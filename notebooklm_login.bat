@echo off
set PATH=C:\Users\rjain\.local\bin;%PATH%
cd /d C:\Users\rjain\.notebooklm-mcp
echo.
echo ============================================
echo   NotebookLM Login - Complete these steps:
echo ============================================
echo.
echo   1. A browser will open - log into Google
echo   2. Wait for NotebookLM homepage to appear
echo   3. Come back here and press ENTER
echo.
echo ============================================
echo.
uv run notebooklm login
echo.
echo ============================================
echo   Login complete! You can close this window.
echo ============================================
echo.
pause
