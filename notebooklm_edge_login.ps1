$env:Path = "C:\Users\rjain\.local\bin;$env:Path"
Set-Location "C:\Users\rjain\.notebooklm-mcp"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  NotebookLM Login via Microsoft Edge" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Edge will open. Log in with Google, then" -ForegroundColor Yellow
Write-Host "  come back here and press ENTER." -ForegroundColor Yellow
Write-Host ""

try {
    uv run python "c:\vscode\tech-branding\tech-branding\notebooklm_edge_login.py"
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
