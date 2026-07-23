@echo off
REM ============================================================
REM csps-builder-blocks one-click deploy (Windows)
REM Requirements (one-time setup): Git for Windows, GitHub CLI
REM   Run "gh auth login" once before first use.
REM Usage: edit code, bump "version" in pxt.json, double-click me.
REM ============================================================
cd /d "%~dp0"

REM Read version from pxt.json
for /f %%v in ('powershell -NoProfile -Command "(Get-Content pxt.json -Raw | ConvertFrom-Json).version"') do set VER=%%v
if "%VER%"=="" (
    echo [ERROR] Cannot read version from pxt.json
    pause & exit /b 1
)
echo === Deploying version v%VER% ===

REM First run: init git and set remote
if not exist ".git" (
    git init -b main
    git remote add origin https://github.com/cspst/csps-builder-blocks.git
    git fetch origin
    git reset --soft origin/main 2>nul
)

REM Make sure git identity is set (first-time Git install has none,
REM and commit silently fails without it)
git config user.name >nul 2>&1 || git config user.name "cspst"
git config user.email >nul 2>&1 || git config user.email "clawbot@csps.tp.edu.tw"

git add -A
git commit -m "v%VER%"

REM Merge remote changes first (web uploads / online edits).
REM On conflicts, local files win (-X ours) since this folder is the source of truth.
git pull origin main --no-rebase --no-edit -X ours --allow-unrelated-histories

git push -u origin main
if errorlevel 1 (
    echo [ERROR] Push failed. Check "gh auth login" and network.
    pause & exit /b 1
)

REM Create release (skip if it already exists)
gh release view v%VER% >nul 2>&1
if errorlevel 1 (
    gh release create v%VER% --title v%VER% --notes "One-click deploy release"
    echo === Released v%VER% ===
) else (
    echo === v%VER% already released. Files pushed only. ===
    echo === Bump "version" in pxt.json to publish a new release. ===
)

echo.
echo Done! Students import from: github.com/cspst/csps-builder-blocks
pause
