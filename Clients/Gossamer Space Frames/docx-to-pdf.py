"""Convert the Gossamer Space Frames blueprint + executive summary DOCX files to PDF via Word COM.
Manual TOC (paragraph-based, not a field), so no TOC field update is required.
Quits Word cleanly to avoid orphan WINWORD processes / file locks.
Usage:  py -3.12 "Clients/Gossamer Space Frames/docx-to-pdf.py"
"""
import time
from pathlib import Path
import win32com.client as win32

HERE = Path(__file__).parent
TARGETS = [
    HERE / 'Gossamer-Space-Frames-AI-Growth-Blueprint.docx',
    HERE / 'Gossamer-Space-Frames-Executive-Summary.docx',
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
