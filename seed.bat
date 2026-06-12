@echo off
REM Astrologer CRM - Seed Script for Windows
REM Populates MongoDB with sample data

title Astrologer CRM - Seed Database
color 0A

echo.
echo ========================================
echo   Astrologer CRM - Seed Database
echo ========================================
echo.
echo This will clear and repopulate your database with sample data
echo.
echo Sample data includes:
echo   • 1 Admin user (admin@crm.com / admin123)
echo   • 3 Astrologers
echo   • 3 Customers
echo   • 3 Consultations
echo.

set /p confirm="Continue? (Y/N): "
if /i not "%confirm%"=="Y" exit /b 0

echo.
echo Seeding database...
cd backend
call npm run seed
if errorlevel 1 (
    echo ERROR: Seed failed
    echo Make sure:
    echo   1. MongoDB connection is working
    echo   2. MONGO_URI is set in backend/.env
    echo.
) else (
    echo ✓ Database seeded successfully!
)
cd ..
pause
