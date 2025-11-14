#!/bin/bash

# Ollama Setup Script for VPS
# This script installs and configures Ollama on your VPS

set -e

echo "🤖 Setting up Ollama on VPS..."
echo ""

# Check if Ollama is already installed
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is already installed"
    ollama --version
    echo ""
    read -p "Do you want to reinstall? (y/N): " REINSTALL
    if [[ ! $REINSTALL =~ ^[Yy]$ ]]; then
        echo "Skipping installation..."
        exit 0
    fi
fi

echo "📥 Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

echo ""
echo "⚙️  Configuring Ollama service..."

# Enable and start Ollama service
sudo systemctl enable ollama
sudo systemctl start ollama

# Wait for Ollama to start
echo "⏳ Waiting for Ollama to start..."
sleep 5

# Check if Ollama is running
if sudo systemctl is-active --quiet ollama; then
    echo "✅ Ollama service is running"
else
    echo "⚠️  Ollama service might not be running. Check with: sudo systemctl status ollama"
fi

echo ""
echo "📦 Pulling default model (this may take a while)..."
echo "   Model: gemma3:4b"
echo "   This will download ~2.5GB, please be patient..."

# Pull the default model
ollama pull gemma3:4b

echo ""
echo "✅ Ollama setup complete!"
echo ""
echo "📊 Ollama Status:"
echo "=================="
sudo systemctl status ollama --no-pager -l | head -10
echo ""
echo "📝 Available commands:"
echo "   - Check status: sudo systemctl status ollama"
echo "   - View logs: sudo journalctl -u ollama -f"
echo "   - List models: ollama list"
echo "   - Pull more models: ollama pull <model-name>"
echo "   - Test Ollama: ollama run gemma3:4b"
echo ""
echo "🔧 Configuration:"
echo "   - Ollama runs on: http://localhost:11434"
echo "   - Update your .env file:"
echo "     AI_PROVIDER=ollama"
echo "     OLLAMA_HOST=http://localhost:11434"
echo "     OLLAMA_MODEL=gemma3:4b"
echo ""

