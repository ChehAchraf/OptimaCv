#!/bin/bash

# Script to fix default Nginx site issue
# This removes the default site and ensures OptimaCV is served

set -e

echo "🔧 Fixing Nginx Default Site Issue..."
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script needs sudo privileges"
    echo "Run: sudo bash deploy/fix-nginx-default.sh"
    exit 1
fi

# Remove default site
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️  Removing default Nginx site..."
    rm -f /etc/nginx/sites-enabled/default
    echo "✅ Default site removed"
else
    echo "ℹ️  Default site already removed"
fi

# Check if OptimaCV config exists
if [ ! -f /etc/nginx/sites-available/optimacv ]; then
    echo "⚠️  OptimaCV Nginx config not found!"
    echo "Please copy it first:"
    echo "  sudo cp deploy/nginx.conf /etc/nginx/sites-available/optimacv"
    exit 1
fi

# Enable OptimaCV site
if [ ! -L /etc/nginx/sites-enabled/optimacv ]; then
    echo "🔗 Creating symlink for OptimaCV site..."
    ln -s /etc/nginx/sites-available/optimacv /etc/nginx/sites-enabled/optimacv
    echo "✅ Symlink created"
else
    echo "ℹ️  OptimaCV site already enabled"
fi

# Test Nginx configuration
echo ""
echo "🧪 Testing Nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors!"
    exit 1
fi

# Reload Nginx
echo ""
echo "🔄 Reloading Nginx..."
systemctl reload nginx

echo ""
echo "✅ Done! Your OptimaCV site should now be accessible."
echo ""
echo "📋 Check status:"
echo "   sudo systemctl status nginx"
echo ""
echo "🌐 Visit: http://cv10dh1.vps.webdock.cloud"
echo ""

