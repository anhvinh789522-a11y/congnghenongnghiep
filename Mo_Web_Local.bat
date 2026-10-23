@echo off
chcp 65001 >nul
echo ==========================================================
echo   KHOI DONG CONG CONG NGHE NONG NGHIEP KNTT (4 PHAN HE)
echo   Dia chi Local: http://localhost:8080
echo ==========================================================
start "" "http://localhost:8080"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_server.ps1"
pause
