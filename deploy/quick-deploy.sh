#!/bin/bash

# Quick Deployment Script for OptimaCV
# This script automates the deployment process

set -e

echo "🚀 OptimaCV Quick Deployment Script"
echo "===================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo "❌ Please do not run this script as root. Run as a regular user with sudo privileges."
    exit 1
fi

# Get project directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📦 Step 1: Installing system dependencies..."
sudo apt update
sudo apt install -y python3 python3-pip python3-venv build-essential python3-dev

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt install -y nginx
fi

echo ""
echo "🔧 Step 2: Setting up backend..."
chmod +x deploy/setup-backend.sh
./deploy/setup-backend.sh

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp deploy/.env.example .env
    echo "⚠️  IMPORTANT: Please edit .env file with your configuration!"
    echo "   Run: nano .env"
    read -p "Press Enter after you've configured .env file..."
fi

echo ""
echo "🔧 Step 3: Setting up frontend..."
chmod +x deploy/setup-frontend.sh
./deploy/setup-frontend.sh

echo ""
echo "⚙️  Step 4: Setting up systemd services..."

# Update service files with correct paths
sudo sed -i "s|/opt/optimacv|$PROJECT_ROOT|g" deploy/optimacv-backend.service
sudo cp deploy/optimacv-backend.service /etc/systemd/system/

# Install PM2 for frontend
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

echo ""
echo "📋 Step 5: Configuring Nginx..."

# Get domain or IP
read -p "Enter your domain name (or press Enter to use IP): " DOMAIN
if [ -z "$DOMAIN" ]; then
    read -p "Enter your server IP: " SERVER_IP
    DOMAIN="$SERVER_IP"
    SERVER_NAME="_"
else
    SERVER_NAME="$DOMAIN www.$DOMAIN"
fi

# Update nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/optimacv
sudo sed -i "s|your-domain.com|$DOMAIN|g" /etc/nginx/sites-available/optimacv
sudo sed -i "s|server_name your-domain.com www.your-domain.com;|server_name $SERVER_NAME;|g" /etc/nginx/sites-available/optimacv

# Enable site
sudo ln -sf /etc/nginx/sites-available/optimacv /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t

echo ""
echo "🔐 Step 6: Setting up firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo ""
echo "🚀 Step 7: Starting services..."

# Start backend
sudo systemctl daemon-reload
sudo systemctl enable optimacv-backend
sudo systemctl start optimacv-backend

# Start frontend with PM2
cd "$PROJECT_ROOT/frontend"
pm2 start npm --name "optimacv-frontend" -- start
pm2 save
pm2 startup

# Restart nginx
sudo systemctl restart nginx

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
echo "=================="
sudo systemctl status optimacv-backend --no-pager -l
echo ""
pm2 status
echo ""
sudo systemctl status nginx --no-pager -l
echo ""
echo "🌐 Your application should be available at:"
echo "   http://$DOMAIN"
echo "   http://$DOMAIN/docs (API documentation)"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .env file if needed: nano $PROJECT_ROOT/.env"
echo "   2. Setup SSL (optional): sudo certbot --nginx -d $DOMAIN"
echo "   3. Check logs:"
echo "      - Backend: sudo journalctl -u optimacv-backend -f"
echo "      - Frontend: pm2 logs optimacv-frontend"
echo "      - Nginx: sudo tail -f /var/log/nginx/error.log"
echo ""

