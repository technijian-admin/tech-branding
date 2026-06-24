# Convert RGS deck PPTX -> PDF + per-slide PNGs, and verify embedded speaker-notes count.
$ErrorActionPreference = "Stop"
$dir = "C:\vscode\tech-branding\tech-branding\Clients\RGS\presentation"
$pptxPath = Join-Path $dir "Technijian for ROG Services - First Meeting Deck.pptx"
$pdfPath  = Join-Path $dir "Technijian for ROG Services - First Meeting Deck.pdf"
$verifyDir = Join-Path $dir "_verify"

if (-not (Test-Path $verifyDir)) { New-Item -ItemType Directory -Path $verifyDir | Out-Null }

$pp = New-Object -ComObject PowerPoint.Application
try {
    $pres = $pp.Presentations.Open($pptxPath, $true, $false, $false)  # ReadOnly, no window
    $slideCount = $pres.Slides.Count
    Write-Host "Slides: $slideCount"

    # PDF export (ppSaveAsPDF = 32)
    $pres.SaveAs($pdfPath, 32)
    Write-Host "PDF written: $pdfPath"

    # Per-slide PNG export at 1920x1080
    for ($i = 1; $i -le $slideCount; $i++) {
        $png = Join-Path $verifyDir ("slide{0:D2}.png" -f $i)
        $pres.Slides.Item($i).Export($png, "PNG", 1920, 1080)
    }
    Write-Host "PNGs exported to $verifyDir"

    $pres.Close()
} finally {
    $pp.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pp) | Out-Null
}

# Verify notesSlide XML count == slide count
$zipCopy = Join-Path $env:TEMP "rgs_deck_check.zip"
Copy-Item $pptxPath $zipCopy -Force
$extractDir = Join-Path $env:TEMP "rgs_deck_check"
if (Test-Path $extractDir) { Remove-Item $extractDir -Recurse -Force }
Expand-Archive $zipCopy -DestinationPath $extractDir
$notes = Get-ChildItem (Join-Path $extractDir "ppt\notesSlides") -Filter "notesSlide*.xml" -ErrorAction SilentlyContinue
Write-Host ("notesSlide XML count: {0}" -f ($notes | Measure-Object).Count)
Remove-Item $zipCopy -Force
Remove-Item $extractDir -Recurse -Force

Write-Host "DONE"
