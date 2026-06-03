"""
DOCX -> PDF for the ACU (Acuity Advisors) deliverable, via Word COM (pywin32).
Updates the Table of Contents fields before exporting. Pass an ABSOLUTE path.
Usage: python Clients/ACU/docx-to-pdf.py [absolute-docx-path]
"""
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
DOCX = os.path.join(HERE, 'Acuity-Advisors-AI-Growth-Report.docx')
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
            time.sleep(0.3)
        doc.SaveAs(pdf, FileFormat=WD_FORMAT_PDF)
        doc.Close(SaveChanges=True)
        print(f'PDF written: {pdf}  ({os.path.getsize(pdf)//1024} KB)')
    finally:
        word.Quit()
    return 0


if __name__ == '__main__':
    docx = sys.argv[1] if len(sys.argv) > 1 else DOCX
    sys.exit(convert(docx))
