@echo off
setlocal
cd /d "%~dp0"

set "HUGO_EXE=hugo"
where hugo >nul 2>nul
if errorlevel 1 (
  set "HUGO_EXE=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Hugo.Hugo.Extended_Microsoft.Winget.Source_8wekyb3d8bbwe\hugo.exe"
)

if not exist "%HUGO_EXE%" (
  echo [ERROR] Hugo executable not found.
  echo Install Hugo Extended first:
  echo winget install --id Hugo.Hugo.Extended -e
  pause
  exit /b 1
)

echo [INFO] Building site...
"%HUGO_EXE%" --minify --cleanDestinationDir

if errorlevel 1 (
  echo [ERROR] Build failed.
  pause
  exit /b 1
)

echo [DONE] Build completed. Output: public\
pause
endlocal
