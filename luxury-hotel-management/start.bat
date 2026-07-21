@echo off
echo ========================================
echo  Luxury Hotel Management System
echo  Quick Start Script
echo ========================================
echo.

echo [1/4] Starting MongoDB...
net start MongoDB
timeout /t 2 /nobreak >nul

echo.
echo [2/4] Starting Backend Server...
start cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo.
echo [3/4] Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo.
echo [4/4] Opening Browser...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo  All services started successfully!
echo ========================================
echo.
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo.
echo  Demo Credentials:
echo  Admin: admin@luxuryhotel.com / admin123
echo  User:  john@example.com / 123456
echo.
echo ========================================
pause
