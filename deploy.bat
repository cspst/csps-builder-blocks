@echo off
chcp 65001 >nul
REM ============================================================
REM csps-builder-blocks 一鍵部署（Windows）
REM 需求（一次性安裝）：Git for Windows、GitHub CLI（gh auth login 登入過）
REM 用法：改完程式、調高 pxt.json 的 version 後，雙擊本檔案
REM ============================================================
cd /d "%~dp0"

REM 讀取 pxt.json 的版本號
for /f %%v in ('powershell -NoProfile -Command "(Get-Content pxt.json -Raw | ConvertFrom-Json).version"') do set VER=%%v
if "%VER%"=="" (
    echo [錯誤] 讀不到 pxt.json 的 version
    pause & exit /b 1
)
echo ── 部署版本：v%VER% ──

REM 第一次使用時初始化 git 與遠端
if not exist ".git" (
    git init -b main
    git remote add origin https://github.com/cspst/csps-builder-blocks.git
    git fetch origin
    git reset --soft origin/main 2>nul
)

git add -A
git commit -m "v%VER%" 2>nul
git push -u origin main
if errorlevel 1 (
    echo [錯誤] push 失敗，請確認已執行 gh auth login 且網路正常
    pause & exit /b 1
)

REM 建立 release（已存在則跳過）
gh release view v%VER% >nul 2>&1
if errorlevel 1 (
    gh release create v%VER% --title v%VER% --notes "一鍵部署發行"
    echo ── 已發行 v%VER% ──
) else (
    echo ── v%VER% 已存在，僅推送檔案（記得調高 pxt.json 版本才會發新版）──
)

echo.
echo 完成！學生匯入網址：github.com/cspst/csps-builder-blocks
pause
