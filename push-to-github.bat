@echo off
title Push Portfolio to GitHub
echo ========================================================
echo   Deploy John Barry V. Blase Portfolio to GitHub
echo ========================================================
echo.
echo Step 1: Create a public repository at https://github.com/new
echo         Recommended Repository Name: blasejohnbarry-bot.github.io
echo.
set /p REPO_URL="Enter your repository URL (e.g. https://github.com/blasejohnbarry-bot/blasejohnbarry-bot.github.io.git): "
if "%REPO_URL%"=="" (
    echo [!] No URL provided. Aborted.
    pause
    exit /b
)

echo.
echo Linking repository to origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Uploading files to GitHub...
git push -u origin main

echo.
echo ========================================================
echo   Upload complete!
echo.
echo   Next Step (Enable GitHub Pages):
echo   1. Go to your GitHub repository -> Settings -> Pages
echo   2. Under 'Branch', select 'main' and folder '/(root)'
echo   3. Click Save!
echo ========================================================
echo.
pause
