import fitz  # PyMuPDF
import os
OUT = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance'
ASSETS = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance\assets'

for pdfname, prefix in [
    ('My Compliance - HIPAA Brochure.pdf', 'bro'),
    ('My Compliance - HIPAA One-Pager.pdf', 'one'),
]:
    doc = fitz.open(os.path.join(OUT, pdfname))
    print(f"{pdfname}: {doc.page_count} pages")
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=100)
        out = os.path.join(ASSETS, f'_pdf_{prefix}_pg{i+1}.png')
        pix.save(out)
        print(f"  {out}: {pix.width}x{pix.height}")
    doc.close()
print("Done.")
