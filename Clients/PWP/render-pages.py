"""Render every page of the PWP blueprint PDF to PNG for proofing."""
import fitz, pathlib
HERE = pathlib.Path(__file__).parent
PDF = HERE / "Prosperity-Wealth-Planning-AI-Blueprint.pdf"
OUT = HERE / "verify"
OUT.mkdir(exist_ok=True)
doc = fitz.open(PDF)
print(f"pages: {doc.page_count}")
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=110)
    pix.save(OUT / f"page-{i+1:02d}.png")
print("rendered ->", OUT)
