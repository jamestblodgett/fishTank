@echo off
echo Building portable fish tank...
echo.

REM Read source files
set "HTML_FILE=src\index.html"
set "CSS_FILE=src\styles.css"
set "BG_JS_FILE=src\background.js"
set "FISH_JS_FILE=src\idle-fish.js"
set "OUTPUT_FILE=dist\index-portable.html"

REM Check if source files exist
if not exist "%HTML_FILE%" (
    echo ERROR: %HTML_FILE% not found!
    pause
    exit /b 1
)
if not exist "%CSS_FILE%" (
    echo ERROR: %CSS_FILE% not found!
    pause
    exit /b 1
)
if not exist "%BG_JS_FILE%" (
    echo ERROR: %BG_JS_FILE% not found!
    pause
    exit /b 1
)
if not exist "%FISH_JS_FILE%" (
    echo ERROR: %FISH_JS_FILE% not found!
    pause
    exit /b 1
)

echo Reading source files...
powershell -Command "Get-Content '%HTML_FILE%' -Raw" > temp_html.txt
powershell -Command "Get-Content '%CSS_FILE%' -Raw" > temp_css.txt
powershell -Command "Get-Content '%BG_JS_FILE%' -Raw" > temp_bg_js.txt
powershell -Command "Get-Content '%FISH_JS_FILE%' -Raw" > temp_fish_js.txt

echo Building portable version...

REM Create the portable HTML file
(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo ^<head^>
echo   ^<meta charset="UTF-8"^>
echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo   ^<title^>Idle Fish Tank^</title^>
echo   ^<style^>
type temp_css.txt
echo   ^</style^>
echo ^</head^>
echo ^<body^>
powershell -Command "Get-Content temp_html.txt | Select-String -Pattern '<main.*?</main>' -AllMatches | ForEach-Object { $_.Matches.Value }"
echo.
echo   ^<script^>
type temp_bg_js.txt
echo   ^</script^>
echo.
echo   ^<script^>
type temp_fish_js.txt
echo   ^</script^>
echo.
echo ^</body^>
echo ^</html^>
) > "%OUTPUT_FILE%"

REM Clean up temp files
del temp_html.txt temp_css.txt temp_bg_js.txt temp_fish_js.txt

echo.
echo SUCCESS: Portable fish tank created as %OUTPUT_FILE%
echo File size: 
powershell -Command "(Get-Item '%OUTPUT_FILE%').Length / 1KB" -f 2
echo KB
echo.
echo You can now share %OUTPUT_FILE% - it works from any device!
pause