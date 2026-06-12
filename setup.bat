@echo off
REM Astrologer CRM - Setup Script for Windows
REM This script installs dependencies for both backend and frontend

title Astrologer CRM Setup
color 0A
cls

echo.
echo ========================================
echo   Astrologer CRM - Setup Script
echo ========================================
echo.

set BACKEND_DIR=backend
set FRONTEND_DIR=frontend

REM Check if directories exist
if not exist "%BACKEND_DIR%" (
    echo ERROR: backend directory not found!
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo ERROR: frontend directory not found!
    pause
    exit /b 1
)

REM Check Node.js installation
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Download from: https://nodejs.org/ (16+ required)
    pause
    exit /b 1
)
echo ✓ Node.js found: 
node --version
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd %BACKEND_DIR%
if exist node_modules (
    echo ✓ Backend node_modules already exists
) else (
    echo Downloading packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)
echo ✓ Backend ready
cd ..
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd %FRONTEND_DIR%
if exist node_modules (
    echo ✓ Frontend node_modules already exists
) else (
    echo Downloading packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✓ Frontend ready
cd ..
echo.

REM Environment setup
echo Setting up environment files...
if not exist "%BACKEND_DIR%\.env" (
    copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
    echo ✓ Created backend/.env (update with your MONGO_URI)
) else (
    echo ✓ backend/.env already exists
)

if not exist "%FRONTEND_DIR%\.env" (
    copy "%FRONTEND_DIR%\.env.example" "%FRONTEND_DIR%\.env" >nul
    echo ✓ Created frontend/.env
) else (
    echo ✓ frontend/.env already exists
)
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Open backend\.env and set MONGO_URI
echo   2. Run: start.bat
echo.
pause
