@echo off
title MedCore HMS - Setup
color 0B
echo.
echo  ==========================================
echo   MedCore HMS v2.0 - Setup ^& Launch
echo  ==========================================
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found!
    echo  Please install from: https://nodejs.org
    echo  Download LTS version, install, restart PC, then run this again.
    pause & exit /b 1
)
echo  [OK] Node.js: & node --version

echo.
echo  [1/4] Installing packages (first time takes 2-3 min)...
call npm install
if %errorlevel% neq 0 ( echo [FAILED] npm install & pause & exit /b 1 )

echo.
echo  [2/4] Setting up database...
call npx prisma generate
if %errorlevel% neq 0 ( echo [FAILED] prisma generate & pause & exit /b 1 )
call npx prisma db push --skip-generate
if %errorlevel% neq 0 ( echo [FAILED] db push & pause & exit /b 1 )

echo.
echo  [3/4] Loading demo patients and data...
call npx tsx prisma/seed.ts
if %errorlevel% neq 0 ( echo [FAILED] seed & pause & exit /b 1 )

echo.
echo  ==========================================
echo   SUCCESS! Starting MedCore HMS...
echo  ==========================================
echo.
echo   Browser:  http://localhost:3000
echo.
echo   ADMIN:    admin@medcore.com   / admin123
echo   DOCTOR:   doctor@medcore.com  / doctor123
echo   STAFF:    staff@medcore.com   / staff123
echo.
echo   Press Ctrl+C to stop the server
echo  ==========================================
echo.
call npm run dev
