@echo off
echo ==========================================
echo Starting Sairam Bus Connect System
echo ==========================================
echo.
echo Starting Backend Server (Port 5001)...
start cmd /k "cd server && npm run dev"
echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak
echo.
echo Starting Frontend Server (Port 5173)...
start cmd /k "cd client && npm run dev"
echo.
echo ==========================================
echo Both servers are starting!
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:5173
echo.
echo Open your browser and go to:
echo http://localhost:5173/
echo.
echo Login with:
echo Email:   // your email for admin login
echo Password: // your password for admin login
echo ==========================================
pause
