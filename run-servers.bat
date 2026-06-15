@echo off
echo ==============================================
echo       STARTING ALL STUCKFIT SERVERS
echo ==============================================
echo.
echo Launching the Backend API...
start cmd.exe /k "cd /d c:\Users\yuvra\stuckfit-api && npm run dev"

echo Launching the Store Frontend... (Port 5173)
start cmd.exe /k "cd /d c:\Users\yuvra\new && npm run dev -- --port 5173"

echo Launching the Admin Panel... (Port 5174)
start cmd.exe /k "cd /d c:\Users\yuvra\stuckfit-admin && npm run dev -- --port 5174 --strictPort"

echo.
echo ALL SERVERS LAUNCHED IN SEPARATE WINDOWS!
echo.
echo ** VERY IMPORTANT: **
echo Be sure to leave the 3 new black windows open! You can minimize them, but if you X them out, the site goes down!
echo.
pause
