#!/bin/bash

# CRM System Deployment Script

set -e

echo "🚀 Starting CRM System Deployment..."

# Check if .env files exist
if [ ! -f "./backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Copying from .env.example..."
    cp ./backend/.env.example ./backend/.env
    echo "⚠️  Please configure ./backend/.env before continuing."
    exit 1
fi

if [ ! -f "./frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Copying from .env.example..."
    cp ./frontend/.env.example ./frontend/.env
fi

# Build and start containers
echo "📦 Building Docker images..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T backend npm run migrate

echo "✅ Deployment complete!"
echo ""
echo "🌐 Frontend: http://localhost"
echo "🔌 Backend API: http://localhost:5000"
echo "📊 PostgreSQL: localhost:5432"
echo "💾 Redis: localhost:6379"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
