#!/bin/bash

echo "🚀 Halal Logistics Platform Setup"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

echo "✅ Dependencies installed successfully"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd backend
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

cd ..

echo "✅ Prisma client generated"

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Please create backend/.env with your database configuration."
    echo "   Example:"
    echo "   DATABASE_URL=\"postgresql://username:password@hostname/database\""
    echo "   JWT_SECRET=\"your-super-secret-jwt-key\""
    echo "   PORT=5000"
    echo "   FRONTEND_URL=\"http://localhost:3000\""
fi

if [ ! -f ".env.local" ]; then
    echo "⚠️  Frontend .env.local file not found. Please create .env.local with:"
    echo "   NEXT_PUBLIC_API_URL=http://localhost:5000"
    echo "   JWT_SECRET=your-super-secret-jwt-key"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your database in backend/.env"
echo "2. Run 'cd backend && npx prisma db push' to create database tables"
echo "3. Start the backend: 'cd backend && npm run dev'"
echo "4. Start the frontend: 'npm run dev' (in another terminal)"
echo "5. Visit http://localhost:3000"
echo ""
echo "For detailed instructions, see README.md"
