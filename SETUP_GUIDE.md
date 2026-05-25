# Kwisoko Marketplace - Environment Configuration

## Backend Configuration (.env)

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kwisoko"

# JWT Configuration
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRATION="7d"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Email Configuration (optional)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="your-email@gmail.com"
MAIL_PASSWORD="your-app-password"
MAIL_FROM="noreply@kwisoko.com"

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Payment Gateway (optional)
MOMO_API_KEY="your-momo-key"
MOMO_PRIMARY_KEY="your-momo-primary-key"

# Server
PORT=3001
NODE_ENV="development"
```

## Frontend Configuration (.env.local)

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

## Setup Steps

### 1. PostgreSQL Setup

#### Option A: Local Installation
```bash
# Windows - Download and install from https://www.postgresql.org/download/
# Or use Chocolatey:
choco install postgresql
```

#### Option B: Cloud Database (Recommended for quick start)
- Neon: https://neon.tech
- ElephantSQL: https://www.elephantsql.com
- Update DATABASE_URL in .env with your connection string

#### Option C: Docker
```bash
docker run --name kwisoko-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kwisoko -p 5432:5432 -d postgres:15
```

### 2. Database Migrations
```bash
cd backend
npx prisma migrate dev --name init
```

### 3. Start Backend
```bash
cd backend
npm run start:dev
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- API Docs (Swagger): http://localhost:3001/api/v1/docs
