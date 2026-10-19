@echo off
title Push Portfolio to GitHub
echo ========================================================
echo   Deploy John Barry V. Blase Portfolio to GitHub
echo ========================================================
echo.
echo Target Repository:
echo https://github.com/blasejohnbarry-bot/blasejohnbarry-bot.github.io
echo.
echo Pushing as user 'blasejohnbarry-bot'...
echo (A browser window may open asking you to sign in with GitHub)
echo.

git remote set-url origin https://blasejohnbarry-bot@github.com/blasejohnbarry-bot/blasejohnbarry-bot.github.io.git
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   [SUCCESS] Upload complete!
    echo.
    echo   Next Step (Enable GitHub Pages):
    echo   1. Open: https://github.com/blasejohnbarry-bot/blasejohnbarry-bot.github.io/settings/pages
    echo   2. Under 'Branch', select 'main' and folder '/(root)'
    echo   3. Click Save!
    echo ========================================================
) else (
    echo.
    echo [!] If it says permission denied, please sign in as 'blasejohnbarry-bot' in the browser prompt or remove old credentials from Windows Credential Manager.
)
echo.
pause
