@echo off
REM Astrologer CRM - Verify Script for Windows
REM Checks if everything is set up correctly

title Astrologer CRM - Verify Setup
color 0A

echo.
echo ========================================
echo   Astrologer CRM - Verify Setup
echo ========================================
echo.

set /a PASSED=0
set /a TOTAL=0

REM Check Node.js
set /a TOTAL=TOTAL+1
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo   ✗ Node.js not found
) else (
    echo   ✓ Node.js: 
    node --version
    set /a PASSED=PASSED+1
)
echo.

REM Check backend/node_modules
set /a TOTAL=TOTAL+1
echo Checking backend dependencies...
if exist "backend\node_modules" (
    echo   ✓ backend/node_modules exists
    set /a PASSED=PASSED+1
) else (
    echo   ✗ backend/node_modules not found (run setup.bat)
)
echo.

REM Check frontend/node_modules
set /a TOTAL=TOTAL+1
echo Checking frontend dependencies...
if exist "frontend\node_modules" (
    echo   ✓ frontend/node_modules exists
    set /a PASSED=PASSED+1
) else (
    echo   ✗ frontend/node_modules not found (run setup.bat)
)
echo.

REM Check backend/.env
set /a TOTAL=TOTAL+1
echo Checking environment files...
if exist "backend\.env" (
    echo   ✓ backend/.env exists
    set /a PASSED=PASSED+1
) else (
    echo   ✗ backend/.env not found (run setup.bat)
)
echo.

REM Check frontend/.env
set /a TOTAL=TOTAL+1
if exist "frontend\.env" (
    echo   ✓ frontend/.env exists
    set /a PASSED=PASSED+1
) else (
    echo   ✗ frontend/.env not found (run setup.bat)
)
echo.

REM Backend verification
set /a TOTAL=TOTAL+1
echo Checking backend configuration...
cd backend
call node verify.js >nul 2>&1
if errorlevel 1 (
    echo   ✗ Backend verification failed
    echo   Run: cd backend ^&^& npm run verify
) else (
    echo   ✓ Backend verification passed
    set /a PASSED=PASSED+1
)
cd ..
echo.

REM Summary
echo ========================================
echo   Summary: %PASSED%/%TOTAL% checks passed
echo ========================================
echo.

if "%PASSED%"=="%TOTAL%" (
    echo ✓ Everything looks good! Run: start.bat
) else (
    echo ✗ Some checks failed. See details above.
)
echo.
pause
