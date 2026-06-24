import fitz, pathlib
JOBS = [
    ("report",  "Clients/SFC/SFC-Managed-IT-Security-AI-Brief.pdf",            "Clients/SFC/_verify"),
    ("summary", "Clients/SFC/SFC-Executive-Summary.pdf",                       "Clients/SFC/_verify_sum"),
    ("deck",    "Clients/SFC/presentation/Technijian for Santa Fe Christian Schools - First Meeting Deck.pdf", "Clients/SFC/presentation/_verify"),
]
for tag, src, outd in JOBS:
    src = pathlib.Path(src); out = pathlib.Path(outd); out.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(src)
    print(f"\n=== {tag}: {doc.page_count} pages ===")
    for i, pg in enumerate(doc):
        pix = pg.get_pixmap(dpi=110)
        pre = "s" if tag == "deck" else "p"
        pix.save(out / f"{pre}{i+1:02d}.png")
        rect = pg.rect
        body = fitz.Rect(rect.x0+40, rect.y0+90, rect.x1-40, rect.y1-70)
        bp = pg.get_pixmap(dpi=80, clip=body); s = bp.samples
        n = len(s)//bp.n; nz = sum(1 for k in range(0, len(s), bp.n) if s[k] < 245 or s[k+1] < 245 or s[k+2] < 245)
        frac = nz/max(n,1)
        flag = "  <-- LOW FILL" if frac < 0.04 else ""
        print(f"  {pre}{i+1:02d} fill={frac:.3f}{flag}")
print("\ndone")
