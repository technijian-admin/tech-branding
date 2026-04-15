import fitz
import os
OUT = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance'
ASSETS = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance\assets'
for pdf in ['My Compliance - vCCO One-Pager.pdf', 'My Compliance - Audit Prep One-Pager.pdf']:
    doc = fitz.open(os.path.join(OUT, pdf))
    print(f"{pdf}: {doc.page_count} page(s)")
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=120)
        out = os.path.join(ASSETS, f'_pdfpage_{pdf.replace(".pdf","")}_p{i+1}.png')
        pix.save(out)
        print(f"  p{i+1}: {page.rect.width:.0f}x{page.rect.height:.0f}pt -> {out}")
    doc.close()
