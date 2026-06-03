"""
DOCX -> PDF for the MBCA Executive Summary, via Word COM (pywin32).
Usage:  C:/Python314/python.exe Clients/MBCA/docx-to-pdf-summary.py
"""
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
DOCX = os.path.join(HERE, 'MBC-AI-Growth-Summary.docx')
PDF = DOCX.replace('.docx', '.pdf')
WD_FORMAT_PDF = 17


def main():
    docx = sys.argv[1] if len(sys.argv) > 1 else DOCX
    pdf = sys.argv[2] if len(sys.argv) > 2 else docx.replace('.docx', '.pdf')
    if not os.path.exists(docx):
        print(f'ERROR: docx not found: {docx}', file=sys.stderr)
        return 1
    import win32com.client as win32
    word = win32.DispatchEx('Word.Application')
    word.Visible = False
    word.DisplayAlerts = False
    try:
        print(f'Opening: {docx}')
        doc = word.Documents.Open(docx, ReadOnly=False)
        try:
            doc.Fields.Update()
        except Exception as e:
            print(f'  Fields.Update note: {e}')
        time.sleep(0.3)
        print('Exporting PDF...')
        doc.SaveAs(pdf, FileFormat=WD_FORMAT_PDF)
        doc.Close(SaveChanges=False)
    finally:
        word.Quit()
    if os.path.exists(pdf):
        print(f'Wrote PDF: {pdf} ({os.path.getsize(pdf)/1024:.1f} KB)')
        return 0
    print('ERROR: PDF not produced', file=sys.stderr)
    return 1


if __name__ == '__main__':
    sys.exit(main())
