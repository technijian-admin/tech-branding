"""
DOCX -> PDF for the DTS (DisruptiX Talent Solutions) deliverable, via Word COM (pywin32).
Updates the Table of Contents fields before exporting (docx-js TOC ships empty
until Word refreshes it; docx2pdf does NOT refresh it, the win32com path does).

Usage:  /c/Python314/python.exe Clients/DTS/docx-to-pdf.py
"""
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
DOCX = os.path.join(HERE, 'DisruptiX-AI-Growth-Report.docx')
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
        for _ in range(2):
            try:
                doc.Fields.Update()
            except Exception as e:
                print(f'  Fields.Update note: {e}')
            for toc in doc.TablesOfContents:
                toc.Update()
            time.sleep(0.3)
        print('TOC + fields updated; exporting PDF...')
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
