"""
Generate Chat.AI collateral.

- One-pager and datasheet are exported from HTML via Playwright.
- Brochure is exported with the page-controlled ReportLab generator so
  sections never split across page boundaries.
"""

import os
import subprocess
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

DIR = os.path.dirname(os.path.abspath(__file__))

# CSS injected into every page before PDF generation.
# This overrides responsive breakpoints and forces desktop grid layouts.
PRINT_FIX_CSS = """
<style id="print-fix">
  /* Force all grids to desktop layout - never collapse */
  .problems, .challenge-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .features, .cap-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .pricing, .pricing-grid { grid-template-columns: repeat(4, 1fr) !important; }
  .sec-strip, .security-grid, .metrics-grid { grid-template-columns: repeat(4, 1fr) !important; }
  .deploy-grid, .deploy-options { grid-template-columns: repeat(2, 1fr) !important; }
  .roi-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .council-grid { grid-template-columns: 1fr 1fr !important; }
  .about-content { grid-template-columns: 1fr 1fr !important; }

  /* Keep sections together - never split across pages */
  .prob-card, .feat-card, .cap-card, .price-card,
  .roi-card, .sec-badge, .deploy-card, .pipe-stage, .usecase-card,
  .metric-card, .council-badge, .hero, .cta, .footer {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  /* Keep headers with their content */
  .sec-title, .sec-sub, h2, h3, h4 {
    break-after: avoid !important;
    page-break-after: avoid !important;
  }

  /* Remove forced page breaks and min-heights */
  .page-break { page-break-before: auto !important; break-before: auto !important; }
  .page-section { min-height: auto !important; }

  /* Preserve all colors in print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Disable all hover effects */
  *:hover { transform: none !important; box-shadow: inherit !important; }

  /* Override any responsive breakpoints */
  @media (max-width: 9999px) {
    .problems, .challenge-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .features, .cap-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .pricing, .pricing-grid { grid-template-columns: repeat(4, 1fr) !important; }
    .sec-strip, .security-grid, .metrics-grid { grid-template-columns: repeat(4, 1fr) !important; }
    .deploy-grid, .deploy-options { grid-template-columns: repeat(2, 1fr) !important; }
    .roi-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .council-grid { grid-template-columns: 1fr 1fr !important; }
    .about-content { grid-template-columns: 1fr 1fr !important; }
    .pipeline { flex-direction: column !important; }
  }
</style>
"""


def generate_pdf(p, html_name, pdf_name, scale=1.0):
    """Generate a single PDF from an HTML file."""
    html_path = os.path.join(DIR, html_name)
    pdf_path = os.path.join(DIR, pdf_name)

    if not os.path.exists(html_path):
        print(f"  SKIP: {html_name} not found")
        return None

    browser = p.chromium.launch()
    # Use wide viewport to prevent responsive breakpoints from firing
    page = browser.new_page(viewport={'width': 1280, 'height': 1200})
    page.goto(Path(html_path).resolve().as_uri())
    page.wait_for_load_state('networkidle')
    page.emulate_media(media='print')

    # Inject print-fix CSS
    page.evaluate(f"""
        document.head.insertAdjacentHTML('beforeend', `{PRINT_FIX_CSS}`);
    """)

    # Generate PDF
    page.pdf(
        path=pdf_path,
        format='Letter',
        print_background=True,
        scale=scale,
        margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
    )

    browser.close()

    size_kb = os.path.getsize(pdf_path) / 1024
    return pdf_path, size_kb


def verify_pdf(pdf_path, name):
    """Render each page of a PDF to PNG for verification."""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        print(f"  PyMuPDF not installed, skipping verification")
        return []

    doc = fitz.open(pdf_path)
    pages = len(doc)
    pngs = []
    for i in range(pages):
        png_path = os.path.join(DIR, f'_verify_{name}_pg{i+1}.png')
        doc[i].get_pixmap(dpi=150).save(png_path)
        pngs.append(png_path)
    doc.close()
    return pngs


def run_reportlab_brochure():
    """Build the brochure with explicit page composition."""
    script_path = os.path.join(DIR, 'generate_brochure.py')
    subprocess.run([sys.executable, script_path], check=True)
    pdf_path = os.path.join(DIR, 'Chat.AI Brochure.pdf')
    size_kb = os.path.getsize(pdf_path) / 1024
    return pdf_path, size_kb


def main():
    docs = [
        ('Chat.AI One-Pager.html', 'Chat.AI One-Pager.pdf', 1.0),
        ('Chat.AI Marketing Datasheet.html', 'Chat.AI Marketing Datasheet.pdf', 0.85),
    ]

    with sync_playwright() as p:
        for html, pdf, scale in docs:
            name = html.replace('Chat.AI ', '').replace('.html', '')
            print(f"\n{'='*50}")
            print(f"Generating: {name}")
            print(f"{'='*50}")

            result = generate_pdf(p, html, pdf, scale)
            if result:
                pdf_path, size_kb = result
                print(f"  PDF: {pdf_path} ({size_kb:.0f} KB)")

                # Verify
                pngs = verify_pdf(pdf_path, name.lower().replace(' ', '_'))
                print(f"  Pages: {len(pngs)}")
                for png in pngs:
                    print(f"    {os.path.basename(png)}")

    print(f"\n{'='*50}")
    print("Generating: Brochure")
    print(f"{'='*50}")
    pdf_path, size_kb = run_reportlab_brochure()
    print(f"  PDF: {pdf_path} ({size_kb:.0f} KB)")
    pngs = verify_pdf(pdf_path, 'brochure')
    print(f"  Pages: {len(pngs)}")
    for png in pngs:
        print(f"    {os.path.basename(png)}")

    print(f"\n{'='*50}")
    print("All PDFs generated. Verify PNGs saved for review.")
    print(f"{'='*50}")


if __name__ == '__main__':
    main()
