# Kwisoko Marketplace

A full-stack marketplace application built with **NestJS**, **Next.js**, **Prisma ORM**, and **PostgreSQL**.

## 🎯 Features

- ✅ User Authentication (JWT)
- ✅ Seller Management
- ✅ Product Listings & Categories
- ✅ Shopping Cart & Orders
- ✅ Payment Integration (MOMO)
- ✅ Reviews & Ratings
- ✅ Real-time Chat (WebSockets)
- ✅ Admin Dashboard
- ✅ Image Upload (Cloudinary)
- ✅ Email Notifications
- ✅ API Documentation (Swagger)

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport
- **Real-time**: WebSockets (Socket.io)
- **File Upload**: Cloudinary
- **Payment**: MOMO API
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14
- **UI**: React 18
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Styling**: Tailwind CSS

### Infrastructure
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **Runtime**: Node.js 20

## 🚀 Quick Start

See [QUICK_START.md](./QUICK_START.md) for step-by-step setup instructions.

```bash
# Backend
cd backend
npm install
npm run prisma:generate
npx prisma migrate dev
npm run start:dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Access the app at **http://localhost:3000**

## 📖 Project Structure

```
kwisoko_project_structure/
├── backend/              # NestJS API
├── frontend/            # Next.js Client
├── database/            # Database schemas
├── docker/              # Docker configs
├── QUICK_START.md       # Setup guide
└── docker-compose.yml   # Compose file
```

## 📝 Environment Variables

Create `.env` files in each directory. See the setup guides for details.

## 🔗 API Documentation

After starting the backend, visit: **http://localhost:4000/api/v1/docs**

## 📦 Dependencies Versions

- Node.js: 20.x
- NestJS: 10.3.0
- Next.js: 14.x
- PostgreSQL: 15
- Prisma: 5.9.1

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

MIT License

## 💬 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for the Rwandan marketplace**
