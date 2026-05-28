"""
DOCX -> PDF for the DTS Executive Summary, via Word COM (pywin32).
Usage:  /c/Python314/python.exe Clients/DTS/docx-to-pdf-summary.py
"""
import os, sys, time
HERE = os.path.dirname(os.path.abspath(__file__))
DOCX = os.path.join(HERE, 'DisruptiX-AI-Growth-Summary.docx')
PDF = DOCX.replace('.docx', '.pdf')
WD_FORMAT_PDF = 17

def main():
    if not os.path.exists(DOCX):
        print(f'ERROR: {DOCX} not found', file=sys.stderr); return 1
    import win32com.client as win32
    word = win32.DispatchEx('Word.Application'); word.Visible = False; word.DisplayAlerts = False
    try:
        doc = word.Documents.Open(DOCX, ReadOnly=False)
        try: doc.Fields.Update()
        except Exception as e: print(f'  Fields.Update note: {e}')
        time.sleep(0.3)
        doc.SaveAs(PDF, FileFormat=WD_FORMAT_PDF)
        doc.Close(SaveChanges=False)
    finally:
        word.Quit()
    if os.path.exists(PDF):
        print(f'Wrote PDF: {PDF} ({os.path.getsize(PDF)/1024:.1f} KB)'); return 0
    print('ERROR: PDF not produced', file=sys.stderr); return 1

if __name__ == '__main__': sys.exit(main())
