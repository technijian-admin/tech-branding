# convert-pdf.ps1 — Word COM: update TOC + fields, SAVE the docx (persists TOC),
# then export PDF. Reliable per the biz-dev-blueprint skill (field-update + save).
# Usage:  powershell -ExecutionPolicy Bypass -File convert-pdf.ps1 <name-without-ext> [<name-without-ext> ...]
param([Parameter(ValueFromRemainingArguments=$true)] [string[]]$Names)

if (-not $Names -or $Names.Count -eq 0) {
  $Names = @('Pangea-Luxe-AI-Growth-Blueprint')
}

# Close any orphan WINWORD with no window (avoids the WinError-32 lock).
Get-Process WINWORD -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -eq 0 } | Stop-Process -Force -ErrorAction SilentlyContinue

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  foreach ($name in $Names) {
    $docPath = Join-Path $here "$name.docx"
    $pdfPath = Join-Path $here "$name.pdf"
    if (-not (Test-Path $docPath)) { Write-Host "SKIP (not found): $docPath"; continue }
    Write-Host "Converting: $name"
    $doc = $word.Documents.Open($docPath, $false, $false)
    Start-Sleep -Milliseconds 400
    # Update every TOC field, then all fields, then repaginate
    foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
    $doc.Fields.Update() | Out-Null
    $doc.Repaginate()
    $doc.Save()                                  # persist updated TOC into the DOCX
    $doc.ExportAsFixedFormat([string]$pdfPath, 17)  # 17 = wdExportFormatPDF
    $tocLen = 0
    if ($doc.TablesOfContents.Count -gt 0) { $tocLen = $doc.TablesOfContents.Item(1).Range.Text.Length }
    Write-Host "  TOC length (chars): $tocLen   Pages: $($doc.ComputeStatistics(2))"
    $doc.Close($false)
    if (Test-Path $pdfPath) {
      $kb = [math]::Round((Get-Item $pdfPath).Length / 1KB, 1)
      Write-Host "  Wrote PDF: $pdfPath ($kb KB)"
    } else {
      Write-Host "  ERROR: PDF not produced"
    }
  }
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
