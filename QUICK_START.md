# 🚀 Kwisoko Marketplace - Quick Start Guide

## Prerequisites
- Node.js 20+ installed
- npm or yarn package manager
- A database (cloud or local)

## ⚡ Quick Start (5 minutes)

### Step 1: Choose Your Database

#### **Option A: FREE Cloud Database (Recommended - Fastest)**
1. Go to **https://neon.tech**
2. Sign up with GitHub/Google
3. Create a new project
4. Copy the connection string from the "Connection Details" panel
5. Paste into `backend/.env` as `DATABASE_URL`

```env
DATABASE_URL="postgresql://user:password@host/database"
```

#### **Option B: Local PostgreSQL**
1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings (user: postgres, password: postgres)
3. Create database: `kwisoko`
4. Update `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kwisoko"
```

#### **Option C: Docker (if Docker Desktop is running)**
```bash
docker-compose up -d
```

---

### Step 2: Setup Project

**In the project root directory, open TWO terminals:**

#### **Terminal 1 - Backend Setup & Start**
```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run start:dev
```

#### **Terminal 2 - Frontend Setup & Start**
```bash
cd frontend

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

---

### Step 3: Access the Application

| Component | URL | Notes |
|-----------|-----|-------|
| **Frontend** | http://localhost:3000 | Next.js application |
| **Backend API** | http://localhost:4000/api/v1 | NestJS REST API |
| **API Documentation** | http://localhost:4000/api/v1/docs | Swagger UI |
| **Prisma Studio** | Run `npx prisma studio` | Database GUI |

---

## 📋 Default Credentials (After Seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kwisoko.rw | Admin@1234 |
| Seller | seller@kwisoko.rw | Seller@1234 |

---

## 🛠️ Useful Commands

### Backend
```bash
npm run start:dev          # Start in watch mode
npm run build              # Build for production
npm run lint               # Run ESLint
npm test                   # Run tests
npx prisma studio         # Open database GUI
npx prisma migrate dev    # Run migrations
npm run prisma:seed       # Seed database
```

### Frontend
```bash
npm run dev                # Start dev server
npm run build              # Build for production
npm run start              # Start production build
npm run lint               # Run ESLint
```

---

## ❌ Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` in `backend/.env`
- Verify PostgreSQL is running
- Test connection: `psql "your-connection-string"`

### "Port 4000 already in use"
- Change `PORT` in `backend/.env`
- Or kill process: `lsof -ti:4000 | xargs kill -9`

### "Prisma migration error"
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually reset:
npx prisma db push --skip-generate
```

### "Module not found errors"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Project Structure

```
kwisoko_project_structure/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── products/    # Product management
│   │   ├── sellers/     # Seller management
│   │   ├── orders/      # Order management
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── .env
├── frontend/            # Next.js Client
│   ├── src/
│   │   ├── app/        # Pages
│   │   ├── components/ # Reusable components
│   │   └── services/   # API client
│   └── .env.local
├── database/           # Database configs
└── docker-compose.yml  # Docker setup
```

---

## 🚀 Next Steps

1. ✅ Database setup
2. ✅ Start backend (`npm run start:dev`)
3. ✅ Start frontend (`npm run dev`)
4. 📝 Create `.env` files with real values
5. 🔐 Configure JWT secret in `backend/.env`
6. 📧 Setup email (optional)
7. ☁️ Setup Cloudinary for images (optional)

---

## 📖 Documentation

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

## 💡 Need Help?

- Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed configuration
- Review individual module README files in backend
- Check browser console for frontend errors (F12)
- Check terminal output for backend errors

**Happy coding! 🎉**
