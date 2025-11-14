#!/bin/bash

# Backend Setup Script for VPS
# This script sets up the Python FastAPI backend

set -e

echo "🚀 Setting up OptimaCV Backend..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    if [ -f "deploy/env.template" ]; then
        cp deploy/env.template .env
        echo "⚠️  Please edit .env file with your configuration before starting the server."
    else
        echo "⚠️  deploy/env.template not found. Please create .env manually."
    fi
fi

echo "✅ Backend setup complete!"
echo ""
echo "To start the backend server:"
echo "  source venv/bin/activate"
echo "  uvicorn backend.main:app --host 0.0.0.0 --port 8000"

