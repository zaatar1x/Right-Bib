#!/bin/bash

# Docker Quick Start Script for NestJS Backend
# This script automates the Docker setup process

set -e

echo "🐳 NestJS Backend - Docker Quick Start"
echo "======================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Please create .env manually.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true
echo ""

# Build images
echo "🔨 Building Docker images..."
docker-compose build --no-cache
echo ""

# Start services
echo "🚀 Starting services..."
docker-compose up -d
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check container status
echo "📊 Container Status:"
docker-compose ps
echo ""

# Check if backend is responding
echo "🔍 Testing backend connection..."
sleep 5

if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Backend is running at http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Backend is not responding. Check logs with: docker-compose logs backend${NC}"
fi
echo ""

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20
echo ""

echo "========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "📚 Next Steps:"
echo "  1. View logs: docker-compose logs -f"
echo "  2. Test API: curl http://localhost:3000"
echo "  3. Sign up: curl -X POST http://localhost:3000/auth/signup -H 'Content-Type: application/json' -d '{\"email\":\"admin@test.com\",\"username\":\"admin\",\"password\":\"Admin123!\",\"role\":\"admin\"}'"
echo "  4. Stop: docker-compose down"
echo ""
echo "📖 Full documentation: DOCKER_SETUP.md"
echo "========================================="
