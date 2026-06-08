"""Convert AXRT-AI-Growth-Blueprint.docx to PDF via Word COM (updates TOC first)."""
import subprocess, sys, time
from pathlib import Path
import win32com.client as win32

DOCX = Path(__file__).parent / 'AXRT-AI-Growth-Blueprint.docx'
PDF  = Path(__file__).parent / 'AXRT-AI-Growth-Blueprint.pdf'

if PDF.exists():
    PDF.unlink()

word = win32.Dispatch('Word.Application')
word.Visible = False
doc = word.Documents.Open(str(DOCX.resolve()))
doc.TablesOfContents(1).Update()
time.sleep(1)
doc.SaveAs2(str(PDF.resolve()), FileFormat=17)
doc.Close(False)
word.Quit()
print('PDF written:', PDF)
