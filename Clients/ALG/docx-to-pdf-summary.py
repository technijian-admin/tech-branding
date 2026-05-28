"""DOCX -> PDF for the ALG executive-summary deliverable, via Word COM."""
import os, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
DOCX = os.path.join(HERE, 'Algro-AI-Growth-Summary.docx')
PDF  = DOCX.replace('.docx', '.pdf')
WD_FORMAT_PDF = 17

def main():
    if not os.path.exists(DOCX):
        print(f'ERROR: docx not found: {DOCX}', file=sys.stderr); return 1
    import win32com.client as win32
    word = win32.DispatchEx('Word.Application')
    word.Visible = False; word.DisplayAlerts = False
    try:
        doc = word.Documents.Open(DOCX, ReadOnly=False)
        for _ in range(2):
            try: doc.Fields.Update()
            except Exception as e: print(f'  Fields.Update note: {e}')
            time.sleep(0.2)
        doc.SaveAs(PDF, FileFormat=WD_FORMAT_PDF)
        doc.Close(SaveChanges=False)
    finally:
        word.Quit()
    if os.path.exists(PDF):
        print(f'Wrote PDF: {PDF} ({os.path.getsize(PDF)/1024:.1f} KB)'); return 0
    return 1

if __name__ == '__main__':
    sys.exit(main())
