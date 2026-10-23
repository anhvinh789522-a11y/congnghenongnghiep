@echo off
chcp 65001 >nul
echo ========================================================
echo   DONG BO DU LIEU NONG NGHIEP LEN GITHUB
echo   Repo: https://github.com/anhvinh789522-a11y/congnghenongnghiep
echo ========================================================
echo.
cd /d "D:\congnghenongnghiep"
set "PATH=D:\MinGit\cmd;D:\MinGit\ucrt64\bin;%PATH%"

echo 1. Kiem tra trang thai...
git.exe status -s

echo.
echo 2. Dong goi toan bo tep thay doi...
git.exe add .
git.exe commit -m "feat: standard ND 30/2020 formatting, 20-20-30-15 margins, 1.3 line spacing, and page-break isolation"

echo.
echo 3. Day len GitHub (origin main)...
git.exe push origin main

echo.
echo ========================================================
echo   HOAN TAT DONG BO!
echo ========================================================
pause
