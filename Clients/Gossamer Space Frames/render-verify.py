"""Render every page of the GSF PDFs to JPGs in _verify/ for visual proofreading.
Usage:  py -3.12 "Clients/Gossamer Space Frames/render-verify.py"
"""
from pathlib import Path
import fitz  # PyMuPDF

HERE = Path(__file__).parent
VERIFY = HERE / '_verify'
VERIFY.mkdir(exist_ok=True)

JOBS = [
    (HERE / 'Gossamer-Space-Frames-AI-Growth-Blueprint.pdf', 'p'),
    (HERE / 'Gossamer-Space-Frames-Executive-Summary.pdf', 'sum'),
]

for pdf_path, prefix in JOBS:
    if not pdf_path.exists():
        print(f'SKIP (missing): {pdf_path.name}')
        continue
    doc = fitz.open(str(pdf_path))
    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(dpi=110, alpha=False)
        out = VERIFY / f'{prefix}{i:02d}.jpg'
        pix.save(str(out), jpg_quality=88)
    print(f'{pdf_path.name}: rendered {doc.page_count} pages -> {prefix}NN.jpg')
    doc.close()
print('Done.')
