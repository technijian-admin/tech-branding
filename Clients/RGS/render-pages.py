"""Render every page of an RGS PDF to PNG for proofreading + blank/orphan scan.
Usage: py -3.12 render-pages.py <pdf-name>
       (default: the full brief)
"""
import os, sys
import fitz  # PyMuPDF

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1
                   else 'RGS-CoManaged-IT-Security-AI-Brief.pdf')
tag = 'pages-summary' if 'Summary' in PDF else 'pages'
OUT = os.path.join(HERE, '_verify_report', tag)
os.makedirs(OUT, exist_ok=True)

doc = fitz.open(PDF)
print(f'{PDF}\nPages: {doc.page_count}')
zoom = 1.6
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
    pix.save(os.path.join(OUT, f'page-{i+1:02d}.png'))
print(f'Rendered {doc.page_count} pages -> {OUT}')

# Blank/orphan scan: measure body-region ink coverage (header/footer excluded).
print('\n-- blank / short-page scan (body-region ink coverage) --')
for i, page in enumerate(doc):
    rect = page.rect
    body = fitz.Rect(rect.x0, rect.y0 + rect.height*0.11, rect.x1, rect.y1 - rect.height*0.07)
    pix = page.get_pixmap(matrix=fitz.Matrix(1.2, 1.2), clip=body)
    n = pix.width * pix.height
    px = pix.samples
    ncomp = pix.n
    ink = 0
    for off in range(0, len(px) - ncomp, ncomp * 4):
        if px[off] < 245 or px[off+1] < 245 or px[off+2] < 245:
            ink += 1
    frac = ink / (n / 4)
    txt = len(page.get_text("text", clip=body).strip())
    flag = ' <== BLANK/ORPHAN — REVIEW' if frac < 0.006 else ''
    if frac < 0.02 or flag:
        print(f'  page {i+1:02d}: body ink={frac*100:5.2f}%  body-text={txt:5d} chars{flag}')
doc.close()
