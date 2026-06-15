@echo off
echo Syncing your latest updates to GitHub...
git add .
git commit -m "Auto update from local machine"
git push
echo.
echo Successfully updated GitHub!
pause
