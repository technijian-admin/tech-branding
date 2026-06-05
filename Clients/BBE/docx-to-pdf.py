"""Convert BBE DOCX to PDF via docx2pdf (handles Word COM lifecycle cleanly)."""
import sys, pathlib
from docx2pdf import convert

BASE = pathlib.Path(__file__).parent
DOCX = BASE / "BBE-AI-Growth-Report.docx"
PDF  = BASE / "BBE-AI-Growth-Report.pdf"

if not DOCX.exists():
    print(f"ERROR: {DOCX} not found — run build-bbe-report.js first"); sys.exit(1)

convert(str(DOCX), str(PDF))
print(f"PDF written: {PDF}")
