#!/bin/bash

# Automated Regulatory Reporting Setup Script
# This script sets up and starts the automated regulatory reporting system

echo "🚀 Setting up Automated Regulatory Reporting System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the regulatory-reporting directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ to continue."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_success "Dependencies installed successfully"
else
    print_status "Dependencies already installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from template"
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_error ".env.example not found. Please create .env file manually."
        exit 1
    fi
else
    print_success ".env file found"
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs storage/reports storage/templates
print_success "Directories created"

# Build the project
print_status "Building the project..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
print_success "Project built successfully"

# Check if port is available
PORT=3021
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Port $PORT is already in use. Please stop the service running on this port."
    print_status "You can check what's running on port $PORT with: lsof -i :$PORT"
    print_status "Or kill the process with: kill -9 \$(lsof -t -i:$PORT)"
    exit 1
fi

print_success "Port $PORT is available"

# Display scheduled reports configuration
print_status "Automated Regulatory Reporting Configuration:"
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│ Scheduled Reports (will be created automatically):              │"
echo "├─────────────────────────────────────────────────────────────────┤"
echo "│ • Daily Halal Compliance Summary (9:00 AM daily)               │"
echo "│ • Weekly Food Safety Report (8:00 AM every Monday)             │"
echo "│ • Monthly Quality Control Report (10:00 AM 1st of each month)  │"
echo "└─────────────────────────────────────────────────────────────────┘"

# Start the service
print_status "Starting Automated Regulatory Reporting Service..."
print_status "Service will be available at: http://localhost:$PORT"
print_status "Health check: http://localhost:$PORT/health"
print_status "API Documentation: http://localhost:$PORT/api/v1/status/docs"

# Start the service in background
npm start &
SERVICE_PID=$!

# Wait a moment for service to start
sleep 3

# Check if service started successfully
if ps -p $SERVICE_PID > /dev/null; then
    print_success "✅ Automated Regulatory Reporting Service started successfully!"
    print_success "Service PID: $SERVICE_PID"

    # Display service information
    echo ""
    echo "┌─────────────────────────────────────────────────────────────────┐"
    echo "│ 📊 REGULATORY REPORTING SERVICE STATUS                         │"
    echo "├─────────────────────────────────────────────────────────────────┤"
    echo "│ Status: ✅ RUNNING                                              │"
    echo "│ Port: $PORT                                                     │"
    echo "│ Environment: $(grep NODE_ENV .env | cut -d'=' -f2)                │"
    echo "│ Scheduler: $(grep SCHEDULER_ENABLED .env | cut -d'=' -f2)                │"
    echo "│ Log Level: $(grep LOG_LEVEL .env | cut -d'=' -f2)                  │"
    echo "└─────────────────────────────────────────────────────────────────┘"

    # Display available endpoints
    echo ""
    echo "┌─────────────────────────────────────────────────────────────────┐"
    echo "│ 🔗 AVAILABLE ENDPOINTS                                          │"
    echo "├─────────────────────────────────────────────────────────────────┤"
    echo "│ Health Check: http://localhost:$PORT/health                    │"
    echo "│ API Status: http://localhost:$PORT/api/v1/status/status        │"
    echo "│ Reports: http://localhost:$PORT/api/v1/reports                 │"
    echo "│ Schedules: http://localhost:$PORT/api/v1/schedules             │"
    echo "│ Templates: http://localhost:$PORT/api/v1/templates             │"
    echo "│ Compliance: http://localhost:$PORT/api/v1/compliance           │"
    echo "│ Customs: http://localhost:$PORT/api/v1/customs                 │"
    echo "└─────────────────────────────────────────────────────────────────┘"

    # Display scheduled tasks
    echo ""
    echo "┌─────────────────────────────────────────────────────────────────┐"
    echo "│ ⏰ AUTOMATED SCHEDULED TASKS                                    │"
    echo "├─────────────────────────────────────────────────────────────────┤"
    echo "│ • Daily Halal Compliance Summary - 9:00 AM daily               │"
    echo "│ • Weekly Food Safety Report - 8:00 AM every Monday             │"
    echo "│ • Monthly Quality Control Report - 10:00 AM 1st of each month  │"
    echo "└─────────────────────────────────────────────────────────────────┘"

    echo ""
    print_success "🎉 Automated Regulatory Reporting System is now fully operational!"
    print_status "You can monitor the service logs in the 'logs' directory"
    print_status "To stop the service: kill $SERVICE_PID"

else
    print_error "❌ Failed to start the service"
    print_error "Check the logs for more details"
    exit 1
fi
