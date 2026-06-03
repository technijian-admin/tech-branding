"""Render every page of the PCU PDF to PNG for proofreading + orphan checks."""
import os, sys
import fitz  # PyMuPDF

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(HERE, 'Pacific-Utility-AI-Growth-Report.pdf')
OUT = os.path.join(HERE, 'pages')
os.makedirs(OUT, exist_ok=True)

doc = fitz.open(PDF)
print(f'{PDF}\nPages: {doc.page_count}')
zoom = 1.6
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
    fn = os.path.join(OUT, f'page-{i+1:02d}.png')
    pix.save(fn)
print(f'Rendered {doc.page_count} pages -> {OUT}')

# crude orphan/whitespace scan: report pages whose bottom third is mostly empty
print('\n-- bottom-whitespace scan (pages that may end short) --')
for i, page in enumerate(doc):
    rect = page.rect
    bottom = fitz.Rect(rect.x0, rect.y0 + rect.height*0.66, rect.x1, rect.y1)
    txt = page.get_text("text", clip=bottom).strip()
    blocks = page.get_text("blocks", clip=bottom)
    # count drawing (image) coverage in bottom third
    if len(txt) < 60 and not any(b[6] == 1 for b in blocks):
        print(f'  page {i+1:02d}: bottom third nearly empty (text chars={len(txt)})')
doc.close()
