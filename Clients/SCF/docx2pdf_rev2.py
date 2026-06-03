# -*- coding: utf-8 -*-
"""Convert a DOCX to PDF via Word COM, updating TOC + all fields first."""
import sys, os, win32com.client as win32

def convert(docx_path, pdf_path):
    docx_path = os.path.abspath(docx_path); pdf_path = os.path.abspath(pdf_path)
    word = win32.DispatchEx("Word.Application")
    word.Visible = False
    word.DisplayAlerts = False
    try:
        doc = word.Documents.Open(docx_path)
        # update all fields (incl. PAGE) and TOC
        try:
            for toc in doc.TablesOfContents:
                toc.Update()
        except Exception as e:
            print("TOC update note:", e)
        try:
            doc.Fields.Update()
        except Exception:
            pass
        doc.SaveAs(pdf_path, FileFormat=17)  # 17 = wdFormatPDF
        doc.Close(False)
        print("PDF:", pdf_path)
    finally:
        word.Quit()

if __name__ == "__main__":
    convert(sys.argv[1], sys.argv[2])
