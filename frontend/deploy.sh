#!/bin/bash

# Celo Multi-Agent Frontend Deployment Script
set -e

echo "🚀 Deploying Celo Multi-Agent Frontend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL=${BACKEND_URL:-"http://localhost:5000"}
NODE_ENV=${NODE_ENV:-"production"}
PORT=${PORT:-3000}

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Backend URL: ${BACKEND_URL}"
echo -e "  Environment: ${NODE_ENV}"
echo -e "  Port: ${PORT}"
echo ""

# Check dependencies
echo -e "${YELLOW}📦 Checking dependencies...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies check passed${NC}"

# Install packages
echo -e "${YELLOW}📥 Installing packages...${NC}"
npm ci --production=false

# Environment setup
echo -e "${YELLOW}⚙️ Setting up environment...${NC}"
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_BASE_URL=${BACKEND_URL}" > .env.local
    echo "NEXT_PUBLIC_APP_NAME=Celo Multi-Agent System" >> .env.local
    echo "NODE_ENV=${NODE_ENV}" >> .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
else
    echo -e "${GREEN}✅ Using existing .env.local${NC}"
fi

# Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Health check function
health_check() {
    local url=$1
    local max_attempts=30
    local attempt=1

    echo -e "${YELLOW}🏥 Performing health check on ${url}...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null; then
            echo -e "${GREEN}✅ Health check passed${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts - waiting for service...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ Health check failed after $max_attempts attempts${NC}"
    return 1
}

# Check if running in Docker
if [ "${DOCKER_ENV}" = "true" ]; then
    echo -e "${BLUE}🐳 Docker environment detected${NC}"
    
    # Start the application
    echo -e "${YELLOW}🚀 Starting application...${NC}"
    npm start &
    APP_PID=$!
    
    # Wait a bit for startup
    sleep 5
    
    # Health check
    if health_check "http://localhost:${PORT}"; then
        echo -e "${GREEN}🎉 Deployment successful!${NC}"
        echo -e "${GREEN}Frontend running at: http://localhost:${PORT}${NC}"
        wait $APP_PID
    else
        echo -e "${RED}❌ Deployment failed - health check failed${NC}"
        kill $APP_PID 2>/dev/null || true
        exit 1
    fi
else
    echo -e "${BLUE}💻 Local environment detected${NC}"
    echo -e "${GREEN}🎉 Build completed successfully!${NC}"
    echo -e "${BLUE}To start the server:${NC}"
    echo -e "  npm start"
    echo ""
    echo -e "${BLUE}For development:${NC}"
    echo -e "  npm run dev"
    echo ""
    echo -e "${BLUE}Expected URLs:${NC}"
    echo -e "  Frontend: http://localhost:${PORT}"
    echo -e "  Backend:  ${BACKEND_URL}"
fi