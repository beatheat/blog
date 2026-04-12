@echo off
setlocal
cd /d "%~dp0"

set "HUGO_EXE="
for /f "delims=" %%I in ('where hugo 2^>nul') do (
  if not defined HUGO_EXE set "HUGO_EXE=%%I"
)

if not defined HUGO_EXE (
  if exist "%LOCALAPPDATA%\Microsoft\WinGet\Packages\Hugo.Hugo.Extended_Microsoft.Winget.Source_8wekyb3d8bbwe\hugo.exe" (
    set "HUGO_EXE=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Hugo.Hugo.Extended_Microsoft.Winget.Source_8wekyb3d8bbwe\hugo.exe"
  )
)

if not defined HUGO_EXE (
  echo [ERROR] Hugo executable not found.
  echo Install Hugo Extended first:
  echo winget install --id Hugo.Hugo.Extended -e
  pause
  exit /b 1
)

echo [INFO] Starting Hugo dev server...
set "HUGO_PORT="
for %%P in (1313 1314 1315 1316 1317 1318 1319 1320 1321 1322 1323 1324 1325) do (
  netstat -ano | findstr /R /C:":%%P .*LISTENING" >nul
  if errorlevel 1 if not defined HUGO_PORT set "HUGO_PORT=%%P"
)

if not defined HUGO_PORT (
  echo [ERROR] No free port found in 1313-1325.
  pause
  exit /b 1
)

echo [INFO] Using port: %HUGO_PORT%
start "" "http://localhost:%HUGO_PORT%/"
echo [INFO] Using Hugo: %HUGO_EXE%
"%HUGO_EXE%" server -D --port %HUGO_PORT% --baseURL "http://localhost:%HUGO_PORT%/"

endlocal
