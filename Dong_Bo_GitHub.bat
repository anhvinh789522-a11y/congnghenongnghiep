@echo off
chcp 65001 >nul
echo ========================================================
echo   DONG BO DU LIEU NONG NGHIEP LEN GITHUB
echo   Repo: https://github.com/anhvinh789522-a11y/congnghenongnghiep
echo ========================================================
echo.
cd /d "D:\congnghenongnghiep"
set "GIT_CMD=D:\MinGit\cmd\git.exe"

echo 1. Kiem tra trang thai tep thay doi...
"%GIT_CMD%" status -s

echo.
echo 2. Luu vet toan bo tep moi va thay doi...
"%GIT_CMD%" add .
"%GIT_CMD%" commit -m "update: cap nhat du lieu giao dien va ngan hang trac nghiem"

echo.
echo 3. Day len GitHub (origin main)...
"%GIT_CMD%" push origin main

echo.
echo ========================================================
echo   HOAN TAT DONG BO!
echo ========================================================
pause
