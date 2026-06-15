"""Render every page of an ANI PDF to PNG for proofreading + orphan/blank checks.
Usage: python Clients/ANI/render-pages.py [pdf-name]   (default: the full report)
"""
import os, sys
import fitz  # PyMuPDF

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else 'Andersen-Industries-AI-Growth-Report.pdf')
OUT = os.path.join(HERE, 'pages' if 'Summary' not in PDF else 'pages-summary')
os.makedirs(OUT, exist_ok=True)

doc = fitz.open(PDF)
print(f'{PDF}\nPages: {doc.page_count}')
zoom = 1.6
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
    fn = os.path.join(OUT, f'page-{i+1:02d}.png')
    pix.save(fn)
print(f'Rendered {doc.page_count} pages -> {OUT}')

# Robust blank/orphan scan: rasterize the BODY region (header+footer excluded) and measure
# the fraction of non-white pixels ("ink"). The per-page header logo lives in the excluded
# top band, so it cannot mask a blank body the way an image-count check does. A diagram page
# has high ink; a truly blank page has ~0.
print('\n-- blank / short-page scan (body-region ink coverage) --')
for i, page in enumerate(doc):
    rect = page.rect
    body = fitz.Rect(rect.x0, rect.y0 + rect.height*0.11, rect.x1, rect.y1 - rect.height*0.07)
    pix = page.get_pixmap(matrix=fitz.Matrix(1.2, 1.2), clip=body)
    n = pix.width * pix.height
    px = pix.samples
    ncomp = pix.n
    ink = 0
    # sample every 4th pixel for speed; count pixels that are not near-white
    for off in range(0, len(px) - ncomp, ncomp * 4):
        if px[off] < 245 or px[off+1] < 245 or px[off+2] < 245:
            ink += 1
    frac = ink / (n / 4)
    txt = len(page.get_text("text", clip=body).strip())
    flag = ' <== BLANK/ORPHAN — REVIEW' if frac < 0.006 else ''
    if frac < 0.02 or flag:
        print(f'  page {i+1:02d}: body ink={frac*100:5.2f}%  body-text={txt:5d} chars{flag}')
doc.close()
