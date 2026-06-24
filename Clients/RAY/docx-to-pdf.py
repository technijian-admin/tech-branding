"""Convert the Rayco Exteriors blueprint + executive summary DOCX files to PDF via Word COM.
Manual TOC (paragraph-based, not a field), so no TOC field update is required.
Quits Word cleanly to avoid orphan WINWORD processes / file locks.
Usage:  py -3.12 "Clients/RAY/docx-to-pdf.py"
"""
import time
from pathlib import Path
import win32com.client as win32

HERE = Path(__file__).parent
TARGETS = [
    HERE / 'Rayco-Exteriors-AI-Growth-Blueprint.docx',
    HERE / 'Rayco-Exteriors-Executive-Summary.docx',
]

word = win32.Dispatch('Word.Application')
word.Visible = False
try:
    for docx in TARGETS:
        if not docx.exists():
            print(f'SKIP (missing): {docx.name}')
            continue
        pdf = docx.with_suffix('.pdf')
        if pdf.exists():
            pdf.unlink()
        doc = word.Documents.Open(str(docx.resolve()))
        doc.Fields.Update()
        time.sleep(0.5)
        pages = doc.ComputeStatistics(2)  # 2 = wdStatisticPages
        doc.SaveAs2(str(pdf.resolve()), FileFormat=17)
        doc.Close(False)
        print(f'PDF written: {pdf.name}  ({pages} pages)')
finally:
    word.Quit()
