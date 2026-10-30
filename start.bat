@echo off
title BloodLink - Launching Application
echo ========================================================
echo               BLOODLINK APPLICATION LAUNCHER
echo ========================================================
echo.
echo Starting Vite development server and backend API...
echo.

cd /d "%~dp0"

:: Open default browser to localhost:5173 after brief delay
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:5173'"

:: Run dev server
call npm run dev

pause
