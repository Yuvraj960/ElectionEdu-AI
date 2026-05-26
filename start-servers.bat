@echo off
echo Starting ElectionEdu AI servers...
echo.

start "Backend Server" cmd /k "cd /d server && node index.js"
timeout /t 2 /nobreak > nul
start "Frontend Server" cmd /k "cd /d client && npm run dev"

echo Servers started! Frontend: http://localhost:5173 Backend: http://localhost:5000
