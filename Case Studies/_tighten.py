"""
One-shot CSS tightening across every case-study HTML.
Reduces padding, font sizes, and section margins to fit content on page 1.
Idempotent: running twice has no additional effect.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent

REPLACEMENTS = [
    # .sec margin-bottom
    ('.sec { margin-bottom: 14px; }', '.sec { margin-bottom: 9px; }'),
    ('.sec { margin-bottom: 12px; }', '.sec { margin-bottom: 9px; }'),
    ('.sec { margin-bottom: 10px; }', '.sec { margin-bottom: 9px; }'),
    # .body padding
    ('.body { padding: 18px 40px 14px;', '.body { padding: 12px 40px 10px;'),
    # .hero padding
    ('.hero { background: linear-gradient(135deg, var(--dark), #0a1628 55%, #0d2847); padding: 22px 40px 18px;',
     '.hero { background: linear-gradient(135deg, var(--dark), #0a1628 55%, #0d2847); padding: 16px 40px 12px;'),
    # .hero-title size
    ('.hero-title { font-size: 30px;', '.hero-title { font-size: 26px;'),
    ('.hero-title { font-size: 28px;', '.hero-title { font-size: 25px;'),
    ('.hero-title { font-size: 26px;', '.hero-title { font-size: 24px;'),
    # Hero sub size
    ('.hero-sub { font-size: 13px;', '.hero-sub { font-size: 12px;'),
    # hero-top margin
    ('.hero-title { font-size: 24px;', '.hero-title { font-size: 24px;'),
    # Section heading .sh
    ('.sh { font-size: 13px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 1.3px; margin-bottom: 7px;',
     '.sh { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 1.3px; margin-bottom: 5px;'),
    # .m-card padding
    ('.m-card { padding: 12px 10px;', '.m-card { padding: 8px 8px;'),
    ('.m-card { padding: 10px 8px;', '.m-card { padding: 8px 8px;'),
    # .m-card number size
    ('.m-card .n { font-size: 28px;', '.m-card .n { font-size: 22px;'),
    ('.m-card .n { font-size: 26px;', '.m-card .n { font-size: 22px;'),
    ('.m-card .n { font-size: 24px;', '.m-card .n { font-size: 22px;'),
    # .m-card label spacing
    ('.m-card .l { font-size: 8.5px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.2px; margin-top: 6px;',
     '.m-card .l { font-size: 8px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.1px; margin-top: 4px;'),
    # CTA vertical padding
    ('.cta { margin-top: auto; background: linear-gradient(135deg, var(--blue), #004d80); padding: 14px 40px;',
     '.cta { margin-top: auto; background: linear-gradient(135deg, var(--blue), #004d80); padding: 10px 40px;'),
    # Profile cells
    ('.profile .cell { padding: 9px 14px;', '.profile .cell { padding: 7px 14px;'),
    # Section paragraph line-height (reduce a hair)
    ('.sec p { color: var(--grey); font-size: 11.5px; line-height: 1.55;',
     '.sec p { color: var(--grey); font-size: 11px; line-height: 1.45;'),
    # Bullet spacing
    ('.bullet li { font-size: 11px; padding: 3px 0 3px 18px;',
     '.bullet li { font-size: 10.5px; padding: 2px 0 2px 18px;'),
    # p2-head padding
    ('.p2-head { background: var(--off-white); border-bottom: 1px solid var(--light-grey); padding: 12px 40px;',
     '.p2-head { background: var(--off-white); border-bottom: 1px solid var(--light-grey); padding: 8px 40px;'),
]


def tighten(html: str) -> tuple[str, int]:
    count = 0
    for old, new in REPLACEMENTS:
        if old in html and old != new:
            html = html.replace(old, new)
            count += 1
    return html, count


def main():
    files = list(ROOT.glob("*/assets/*.html"))
    print(f"Tightening {len(files)} HTML files...")
    total_changes = 0
    for f in files:
        text = f.read_text(encoding="utf-8")
        new_text, n = tighten(text)
        if n:
            f.write_text(new_text, encoding="utf-8")
            total_changes += n
            print(f"  [{n:2d} rules]  {f.relative_to(ROOT)}")
    print(f"Total: {total_changes} rule applications across {len(files)} files.")


if __name__ == "__main__":
    main()
