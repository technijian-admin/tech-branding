"""
DOCX → PDF converter for the RKE deliverable.

Uses `docx2pdf` (pip-installed, MIT licensed) instead of raw Word COM scripting.
docx2pdf handles Word COM lifecycle cleanly — no orphan WINWORD processes, no
COM server crashes, no manual cleanup. It also auto-skips if Word is already
running with the file open and gives clear error messages instead of hangs.

Usage:
    py -3.12 docx-to-pdf.py
    py -3.12 docx-to-pdf.py /path/to/specific.docx
    py -3.12 docx-to-pdf.py input.docx output.pdf

Install (one-time): py -3.12 -m pip install docx2pdf
"""

import os
import sys
import subprocess
from docx2pdf import convert

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DOCX = os.path.join(HERE, 'RKE-Strategic-AI-Growth-Report.docx')


def kill_orphan_word():
    """Kill any background WINWORD processes that don't have a window.
    These are typically leaked from prior COM automation crashes."""
    try:
        subprocess.run(
            ['powershell', '-NoProfile', '-Command',
             'Get-Process WINWORD -ErrorAction SilentlyContinue | '
             "Where-Object { $_.MainWindowHandle -eq 0 } | Stop-Process -Force"],
            capture_output=True, check=False, timeout=10
        )
    except Exception:
        pass


def main():
    args = sys.argv[1:]
    if len(args) == 0:
        docx = DEFAULT_DOCX
        pdf  = docx.replace('.docx', '.pdf')
    elif len(args) == 1:
        docx = args[0]
        pdf  = docx.replace('.docx', '.pdf')
    else:
        docx, pdf = args[0], args[1]

    if not os.path.exists(docx):
        print(f'ERROR: docx not found: {docx}', file=sys.stderr)
        return 1

    kill_orphan_word()
    print(f'Converting:\n  in:  {docx}\n  out: {pdf}')
    try:
        convert(docx, pdf)
    except Exception as e:
        print(f'docx2pdf failed: {e}', file=sys.stderr)
        kill_orphan_word()
        return 1

    if os.path.exists(pdf):
        kb = os.path.getsize(pdf) / 1024
        print(f'Wrote PDF: {pdf} ({kb:.1f} KB)')
        return 0
    else:
        print('ERROR: PDF was not produced', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
