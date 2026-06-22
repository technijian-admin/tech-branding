"""
DOCX -> PDF for the CardLogix Managed-PKI Deployment Options report, via Word COM (pywin32).
Updates the Table of Contents field before exporting (docx-js TOC ships empty until Word
refreshes it) and SAVES the DOCX so the TOC persists. Usage: python docx-to-pdf-options.py
"""
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
DOCX = os.path.join(HERE, 'CardLogix-Managed-PKI-Deployment-Options.docx')
WD_FORMAT_PDF = 17


def convert(docx):
    pdf = docx.replace('.docx', '.pdf')
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
            try:
                doc.Repaginate()
            except Exception as e:
                print(f'  Repaginate note: {e}')
            time.sleep(0.4)
        doc.Save()  # persist the populated TOC into the .docx
        doc.SaveAs(pdf, FileFormat=WD_FORMAT_PDF)
        doc.Close(SaveChanges=True)
        print(f'PDF written: {pdf}  ({os.path.getsize(pdf)//1024} KB)')
    finally:
        word.Quit()
    return 0


if __name__ == '__main__':
    docx = sys.argv[1] if len(sys.argv) > 1 else DOCX
    sys.exit(convert(docx))
