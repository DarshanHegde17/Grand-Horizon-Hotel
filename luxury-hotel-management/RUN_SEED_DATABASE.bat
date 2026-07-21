@echo off
title Luxury Hotel - Seed Database
color 0E
echo ========================================
echo  LUXURY HOTEL - SEED DATABASE
echo ========================================
echo.
echo This will populate the database with:
echo - 2 Users (Admin + Regular User)
echo - 8 Sample Rooms
echo.
pause
cd /d D:\MR_nith\luxury-hotel-management\backend
node seedData.js
echo.
echo ========================================
echo Database seeded successfully!
echo ========================================
pause
