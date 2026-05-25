#!/bin/bash

echo "🚀 Starting Kwisoko Marketplace Development Environment"
echo ""
echo "1. Installing dependencies..."
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend
npm install
npx prisma generate

echo ""
echo "2. Database setup:"
echo "   - Using cloud database or local PostgreSQL"
echo "   - Update DATABASE_URL in backend/.env"
echo ""

# Run migrations
echo "📊 Running database migrations..."
npx prisma migrate dev --name init

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "3. Starting development servers:"
echo "   Terminal 1 (Backend):  cd backend && npm run start:dev"
echo "   Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "4. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000/api/v1"
echo "   API Docs: http://localhost:4000/api/v1/docs"
