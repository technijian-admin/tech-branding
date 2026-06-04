"""Convert COB-AI-Growth-Report.docx to PDF via Word COM (updates TOC fields)."""
import os, sys, time
from pathlib import Path

docx_path = Path(__file__).parent / "COB-AI-Growth-Report.docx"
pdf_path  = Path(__file__).parent / "COB-AI-Growth-Report.pdf"

if not docx_path.exists():
    print(f"ERROR: {docx_path} not found")
    sys.exit(1)

try:
    import win32com.client as win32
except ImportError:
    print("ERROR: pywin32 not installed. Run: pip install pywin32")
    sys.exit(1)

print(f"Opening {docx_path.name}...")
word = win32.Dispatch("Word.Application")
word.Visible = False
word.DisplayAlerts = False

try:
    doc = word.Documents.Open(str(docx_path.resolve()))
    time.sleep(2)
    for toc in doc.TablesOfContents:
        toc.Update()
    doc.SaveAs(str(pdf_path.resolve()), FileFormat=17)
    doc.Close(False)
    print(f"PDF written: {pdf_path.name}")
finally:
    word.Quit()
