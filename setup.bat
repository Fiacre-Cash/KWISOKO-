@echo off
echo 🚀 Starting Kwisoko Marketplace Development Environment
echo.
echo Step 1: Database Setup
echo.
echo Choose one of the following:
echo.
echo Option A: Use Free Cloud Database (Recommended)
echo   1. Visit https://neon.tech
echo   2. Sign up and create a new project
echo   3. Copy the connection string
echo   4. Update DATABASE_URL in backend\.env
echo.
echo Option B: Use Local PostgreSQL
echo   1. Install PostgreSQL from https://www.postgresql.org/download/
echo   2. Create a database named 'kwisoko'
echo   3. Update DATABASE_URL in backend\.env
echo.
echo Option C: Use Docker (if Docker Desktop is running)
echo   1. Run: docker-compose up -d
echo   2. Database will start on localhost:5432
echo.
echo.
echo Step 2: Run Migrations
echo.
cd /d "%~dp0backend"
echo Running Prisma migrations...
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo ⚠️  Migration skipped. Please update DATABASE_URL first.
)
echo.
echo Step 3: Start Development Servers
echo.
echo Open TWO terminal windows:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run start:dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Access the application:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:4000/api/v1
echo   API Docs: http://localhost:4000/api/v1/docs
echo.
pause
