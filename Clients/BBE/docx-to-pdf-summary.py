"""Convert BBE Summary DOCX to PDF via docx2pdf."""
import sys, pathlib
from docx2pdf import convert

BASE = pathlib.Path(__file__).parent
DOCX = BASE / "BBE-AI-Growth-Summary.docx"
PDF  = BASE / "BBE-AI-Growth-Summary.pdf"

if not DOCX.exists():
    print(f"ERROR: {DOCX} not found"); sys.exit(1)

convert(str(DOCX), str(PDF))
print(f"PDF written: {PDF}")
