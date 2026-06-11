"""Blank-page scan for Abound-AI-Growth-Report.pdf.
Strips recurring header/footer lines (per the 2026-06-11 skill lesson) so a page
holding only the running header/footer is flagged as effectively blank.
"""
import re, sys
from collections import Counter
import fitz  # PyMuPDF

PDF = r"c:\vscode\tech-branding\tech-branding\Clients\AFC\Abound-AI-Growth-Report.pdf"
doc = fitz.open(PDF)
pages = [pg.get_text() or "" for pg in doc]
n = len(pages)
print(f"pages: {n}")

# find recurring lines (headers/footers) across >40% of pages
line_counts = Counter()
for t in pages:
    for ln in set(l.strip() for l in t.splitlines() if l.strip()):
        # normalize page numbers in footer
        norm = re.sub(r"Page \d+ of \d+", "Page X of Y", ln)
        line_counts[norm] += 1
recurring = {l for l, c in line_counts.items() if c > n * 0.4}
print("recurring lines stripped:", recurring)

issues = []
for i, t in enumerate(pages, 1):
    body_lines = []
    for ln in t.splitlines():
        s = ln.strip()
        if not s:
            continue
        norm = re.sub(r"Page \d+ of \d+", "Page X of Y", s)
        if norm in recurring:
            continue
        body_lines.append(s)
    body = " ".join(body_lines)
    status = "OK"
    if len(body) == 0:
        status = "BLANK"
        issues.append((i, "BLANK", body[:60]))
    elif len(body) < 60:
        status = "THIN"
        issues.append((i, "THIN", body[:120]))
    print(f"  p{i:02d}  {len(body):5d} chars  {status}  | {body[:90]}")

print()
if issues:
    print("ISSUES:")
    for pg, kind, snippet in issues:
        print(f"  page {pg}: {kind}  -> {snippet}")
    sys.exit(1)
print("No blank pages between cover and final page.")
