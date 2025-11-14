#!/bin/bash

# Quick fix for default Webdock page issue
# Run this if you're seeing the default Webdock page

set -e

echo "🔧 Quick Fix: Removing Default Webdock Page"
echo "============================================="
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script needs sudo privileges"
    echo "Run: sudo bash deploy/quick-fix.sh"
    exit 1
fi

# Step 1: Remove default site
echo "1️⃣  Removing default Nginx site..."
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm -f /etc/nginx/sites-enabled/default
    echo "   ✅ Default site removed"
else
    echo "   ℹ️  Default site already removed"
fi

# Step 2: Check if OptimaCV config exists
echo ""
echo "2️⃣  Checking OptimaCV Nginx config..."
if [ ! -f /etc/nginx/sites-available/optimacv ]; then
    echo "   ⚠️  OptimaCV config not found!"
    echo "   Please run the full deployment first or copy the config:"
    echo "   sudo cp deploy/nginx.conf /etc/nginx/sites-available/optimacv"
    exit 1
else
    echo "   ✅ Config found"
fi

# Step 3: Enable OptimaCV site
echo ""
echo "3️⃣  Enabling OptimaCV site..."
if [ ! -L /etc/nginx/sites-enabled/optimacv ]; then
    ln -s /etc/nginx/sites-available/optimacv /etc/nginx/sites-enabled/optimacv
    echo "   ✅ Site enabled"
else
    echo "   ℹ️  Site already enabled"
fi

# Step 4: Test and reload
echo ""
echo "4️⃣  Testing Nginx configuration..."
if nginx -t; then
    echo "   ✅ Configuration valid"
    echo ""
    echo "5️⃣  Reloading Nginx..."
    systemctl reload nginx
    echo "   ✅ Nginx reloaded"
else
    echo "   ❌ Configuration has errors!"
    echo "   Check: sudo nginx -t"
    exit 1
fi

echo ""
echo "✅ Fix complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure backend is running: sudo systemctl status optimacv-backend"
echo "   2. Make sure frontend is running: pm2 status"
echo "   3. Visit: http://cv10dh1.vps.webdock.cloud"
echo ""

