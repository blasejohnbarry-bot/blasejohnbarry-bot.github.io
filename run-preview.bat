@echo off
title Portfolio Local Preview
echo Starting local portfolio preview server...
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0serve.ps1"
pause
