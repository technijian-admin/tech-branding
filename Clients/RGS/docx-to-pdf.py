"""
DOCX -> PDF converter for the RGS (ROG Services) deliverables.

Uses `docx2pdf` (Word COM under the hood) which handles the COM lifecycle
cleanly. Run with no args to convert both RGS docx files; pass a path to
convert one.

Usage:
    py -3.12 docx-to-pdf.py                 # converts brief + summary
    py -3.12 docx-to-pdf.py some.docx       # one file -> some.pdf
    py -3.12 docx-to-pdf.py in.docx out.pdf
"""

import os
import sys
import subprocess
from docx2pdf import convert

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULTS = [
    'RGS-CoManaged-IT-Security-AI-Brief.docx',
    'RGS-Executive-Summary.docx',
]


def kill_orphan_word():
    try:
        subprocess.run(
            ['powershell', '-NoProfile', '-Command',
             'Get-Process WINWORD -ErrorAction SilentlyContinue | '
             "Where-Object { $_.MainWindowHandle -eq 0 } | Stop-Process -Force"],
            capture_output=True, check=False, timeout=10
        )
    except Exception:
        pass


def one(docx, pdf=None):
    pdf = pdf or docx.replace('.docx', '.pdf')
    if not os.path.exists(docx):
        print(f'  SKIP (not found): {docx}')
        return
    print(f'Converting:\n  in:  {docx}\n  out: {pdf}')
    convert(docx, pdf)
    if os.path.exists(pdf):
        print(f'  Wrote PDF: {pdf} ({os.path.getsize(pdf)/1024:.1f} KB)')
    else:
        print('  ERROR: PDF not produced', file=sys.stderr)


def main():
    args = sys.argv[1:]
    kill_orphan_word()
    try:
        if len(args) == 0:
            for d in DEFAULTS:
                one(os.path.join(HERE, d))
        elif len(args) == 1:
            one(args[0])
        else:
            one(args[0], args[1])
    except Exception as e:
        print(f'docx2pdf failed: {e}', file=sys.stderr)
        kill_orphan_word()
        return 1
    kill_orphan_word()
    return 0


if __name__ == '__main__':
    sys.exit(main())
