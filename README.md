# Kwisoko Marketplace

Rwanda's full-stack marketplace where buyers and sellers meet.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| Backend | NestJS, TypeScript, Passport JWT |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT + OTP verification |
| Images | Cloudinary |
| Payments | MoMo / Card |
| Hosting | Vercel (FE) · Railway (BE) · Supabase (DB) |

## Project Structure

```
kwisoko/
├── frontend/        # Next.js 14 app
├── backend/         # NestJS REST API
├── database/        # Prisma schema + migrations + seed
├── shared/          # Shared types
├── docker/          # Docker configs
├── docker-compose.yml
└── .env
```

## Quick Start

### 1. Clone and install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, CLOUDINARY_*, etc.
```

### 3. Set up database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx ts-node ../database/prisma/seed.ts
```

### 4. Run development servers

```bash
# Backend (port 4000)
cd backend && npm run start:dev

# Frontend (port 3000)
cd frontend && npm run dev
```

### 5. Or use Docker

```bash
docker-compose up --build
```

## API Docs

Swagger UI available at: `http://localhost:4000/api/docs`

## Default Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kwisoko.rw | Admin@1234 |
| Seller | seller@kwisoko.rw | Seller@1234 |
| Buyer | buyer@kwisoko.rw | Buyer@1234 |

## API Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/logout

GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id

GET    /api/v1/categories
POST   /api/v1/sellers/apply
GET    /api/v1/sellers/dashboard

POST   /api/v1/orders
GET    /api/v1/orders
POST   /api/v1/payments/initiate/:orderId

GET    /api/v1/chats
POST   /api/v1/chats/start/:sellerId
POST   /api/v1/chats/:chatId/messages

GET    /api/v1/admin/stats
GET    /api/v1/admin/sellers/pending
PUT    /api/v1/admin/sellers/:id/approve
PUT    /api/v1/admin/users/:id/ban
```

## Version Plan

- **v1** — Auth, seller approval, products, categories, search, chat, admin, RWF/USD pricing
- **v2** — Mobile money, delivery tracking, featured ads, subscriptions, reviews
- **v3** — Escrow payments, AI recommendations, fraud detection, mobile app
