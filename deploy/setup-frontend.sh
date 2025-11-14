#!/bin/bash

# Frontend Setup Script for VPS
# This script sets up the Next.js frontend

set -e

echo "🚀 Setting up OptimaCV Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT/frontend"

# Install dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Build the Next.js application
echo "🏗️  Building Next.js application..."
npm run build

echo "✅ Frontend setup complete!"
echo ""
echo "To start the frontend server:"
echo "  cd frontend"
echo "  npm start"

