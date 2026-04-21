param(
    [string]$DocxPath
)

$absPath = Resolve-Path -LiteralPath $DocxPath
$pdfPath = [System.IO.Path]::ChangeExtension($absPath.Path, '.pdf')

Write-Host "Converting: $($absPath.Path)"
Write-Host "     To:    $pdfPath"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open($absPath.Path, $false, $true)
    # wdFormatPDF = 17
    $doc.SaveAs([ref]$pdfPath, [ref]17)
    $doc.Close($false)
    Write-Host "PDF saved successfully: $pdfPath"
}
catch {
    Write-Host "ERROR: $_"
    exit 1
}
finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
