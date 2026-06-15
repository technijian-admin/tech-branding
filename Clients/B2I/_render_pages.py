"""Render selected PDF pages to PNG for visual verification."""
import fitz, sys, pathlib
PDF = r"c:\vscode\tech-branding\tech-branding\Clients\B2I\B2I-AI-Growth-Report.pdf"
OUT = pathlib.Path(r"c:\vscode\tech-branding\tech-branding\Clients\B2I\_verify_report")
OUT.mkdir(exist_ok=True)
doc = fitz.open(PDF)
pages = [int(a) for a in sys.argv[1:]] or [1, 2, 3, 5, 15, 18, 33, 38, 42, 49]
for pno in pages:
    pg = doc[pno - 1]
    pix = pg.get_pixmap(dpi=100)
    p = OUT / f"page{pno:02d}.png"
    pix.save(p)
    print("saved", p.name)

