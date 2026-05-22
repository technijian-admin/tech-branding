"""
DOCX -> PDF for the ORX deliverable, via Word COM (pywin32).

Unlike docx2pdf, this UPDATES the Table of Contents fields before exporting,
so the TOC renders with real entries and page numbers (a docx-js TOC ships
empty until Word refreshes it).

Usage:  python Clients/ORX/docx-to-pdf.py
"""
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
DOCX = os.path.join(HERE, 'OrthoKinetix-AI-Growth-Report.docx')
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
        # Update every field and TOC twice (page numbers settle on 2nd pass)
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
