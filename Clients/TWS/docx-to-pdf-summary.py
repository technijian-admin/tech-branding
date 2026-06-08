"""Convert TWS-AI-Growth-Blueprint-Summary.docx to PDF via Word COM."""
import time
from pathlib import Path
import win32com.client as win32

DOCX = Path(__file__).parent / 'TWS-AI-Growth-Blueprint-Summary.docx'
PDF  = Path(__file__).parent / 'TWS-AI-Growth-Blueprint-Summary.pdf'

if PDF.exists():
    PDF.unlink()

word = win32.Dispatch('Word.Application')
word.Visible = False
doc = word.Documents.Open(str(DOCX.resolve()))
doc.SaveAs2(str(PDF.resolve()), FileFormat=17)
doc.Close(False)
word.Quit()
print('PDF written:', PDF)
