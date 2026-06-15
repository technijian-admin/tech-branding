"""Convert B2I-AI-Growth-Report.docx to PDF via Word COM.
Per the 2026-06-11 TOC lesson: update the TOC field, update all fields, SAVE the DOCX
(so the .docx itself carries a populated TOC), then export the PDF from the same session.
"""
import time
from pathlib import Path
import win32com.client as win32

DOCX = Path(__file__).parent / 'B2I-AI-Growth-Report.docx'
PDF  = Path(__file__).parent / 'B2I-AI-Growth-Report.pdf'

if PDF.exists():
    PDF.unlink()

word = win32.Dispatch('Word.Application')
word.Visible = False
try:
    doc = word.Documents.Open(str(DOCX.resolve()))
    for i in range(1, doc.TablesOfContents.Count + 1):
        doc.TablesOfContents(i).Update()
    doc.Fields.Update()
    time.sleep(1)
    doc.Save()  # persist updated TOC into the DOCX itself
    toc_len = doc.TablesOfContents(1).Range.Text and len(doc.TablesOfContents(1).Range.Text) or 0
    pages = doc.ComputeStatistics(2)  # 2 = wdStatisticPages
    doc.SaveAs2(str(PDF.resolve()), FileFormat=17)
    doc.Close(False)
    print(f'TOC field text length: {toc_len} (must be > 500)')
    print(f'Page count: {pages}')
    print('PDF written:', PDF)
finally:
    word.Quit()
