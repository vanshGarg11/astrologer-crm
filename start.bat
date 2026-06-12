@echo off
REM Astrologer CRM - Start Script for Windows
REM Starts both backend and frontend development servers

title Astrologer CRM - Launcher
color 0A
cls

echo.
echo ========================================
echo   Astrologer CRM - Launcher
echo ========================================
echo.

REM Check if node_modules exist
if not exist "backend\node_modules" (
    echo ERROR: backend/node_modules not found
    echo Run setup.bat first
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ERROR: frontend/node_modules not found
    echo Run setup.bat first
    pause
    exit /b 1
)

REM Check .env files
if not exist "backend\.env" (
    echo ERROR: backend/.env not found
    echo Run setup.bat first
    pause
    exit /b 1
)

echo Starting servers...
echo.
echo Backend:  http://localhost:5000 (Port 5000)
echo Frontend: http://localhost:5173 (Port 5173)
echo.
echo Tip: Press Ctrl+C in any window to stop that server
echo.

REM Start backend in new window
start "Astrologer CRM - Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak

REM Start frontend in new window
start "Astrologer CRM - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✓ Both servers started in new windows
echo Waiting for servers to initialize (30 seconds)...
timeout /t 30 /nobreak

REM Try to open browser
timeout /t 3 /nobreak
start http://localhost:5173

echo.
echo ✓ Opening frontend in browser...
echo.
