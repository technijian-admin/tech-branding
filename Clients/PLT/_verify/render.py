import fitz, pathlib, sys
src = pathlib.Path("Clients/PLT/Pangea-Luxe-AI-Growth-Blueprint.pdf")
out = pathlib.Path("Clients/PLT/_verify"); out.mkdir(exist_ok=True)
doc = fitz.open(src)
print("PAGES:", doc.page_count)
# body-region fill metric (exclude header/footer band) to catch blank/short pages
import statistics
for i, pg in enumerate(doc):
    pix = pg.get_pixmap(dpi=110)
    pix.save(out / f"p{i+1:02d}.png")
    # crude ink metric: fraction of non-white pixels in body region
    rect = pg.rect
    body = fitz.Rect(rect.x0+40, rect.y0+90, rect.x1-40, rect.y1-70)
    bp = pg.get_pixmap(dpi=80, clip=body)
    samples = bp.samples
    n = len(samples)//bp.n
    nonwhite = 0
    for k in range(0, len(samples), bp.n):
        if samples[k] < 245 or samples[k+1] < 245 or samples[k+2] < 245:
            nonwhite += 1
    frac = nonwhite / max(n,1)
    flag = "  <-- LOW FILL" if frac < 0.05 else ""
    print(f"p{i+1:02d} bodyfill={frac:.3f}{flag}")
print("done")
