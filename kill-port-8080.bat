@echo off
echo ========================================
echo   FoodBridge - Kill Port 8080
echo ========================================
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do (
    echo Killing PID: %%a
    taskkill /F /PID %%a 2>nul
)
echo Port 8080 is now free!
pause
