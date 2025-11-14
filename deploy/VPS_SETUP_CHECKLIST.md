# VPS Setup Checklist for Webdock

## Current Issue: Default Webdock Page Showing

You're seeing the default Webdock page because:
1. The default Nginx site is still enabled
2. OptimaCV Nginx config might not be set up yet
3. Services might not be running

## Step-by-Step Fix

### 1. Upload Your Project to VPS

**Option A: Using Git (Recommended)**
```bash
# SSH into your VPS
ssh your-user@cv10dh1.vps.webdock.cloud

# Navigate to a directory (e.g., /opt)
cd /opt
sudo mkdir optimacv
sudo chown $USER:$USER optimacv
cd optimacv

# Clone your repository
git clone <your-repo-url> .

# Or if you need to upload manually, use SCP or FTP
```

**Option B: Using SCP from your local machine**
```bash
# From your local Windows machine (PowerShell)
scp -r C:\Users\hamza\Desktop\OptimaVé\OptimaCv\* your-user@cv10dh1.vps.webdock.cloud:/opt/optimacv/
```

**Option C: Using FTP**
- Connect via FTP client
- Upload files to `/opt/optimacv/` or `/home/your-user/optimacv/`

### 2. Remove Default Webdock Site

```bash
# SSH into VPS
ssh your-user@cv10dh1.vps.webdock.cloud

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Also remove the default index file (optional)
sudo rm -f /var/www/html/index.php
```

### 3. Setup OptimaCV Nginx Configuration

```bash
# Navigate to your project
cd /opt/optimacv  # or wherever you uploaded it

# Copy Nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/optimacv

# Enable the site
sudo ln -s /etc/nginx/sites-available/optimacv /etc/nginx/sites-enabled/optimacv

# Test configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

### 4. Setup Backend and Frontend

```bash
# Setup backend
chmod +x deploy/setup-backend.sh
./deploy/setup-backend.sh

# Setup frontend
chmod +x deploy/setup-frontend.sh
./deploy/setup-frontend.sh

# Configure environment
cp deploy/env.template .env
nano .env  # Edit with your settings
```

### 5. Install Ollama (if using Ollama)

```bash
chmod +x deploy/setup-ollama.sh
./deploy/setup-ollama.sh
```

### 6. Start Services

**Backend:**
```bash
# Using systemd
sudo cp deploy/optimacv-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable optimacv-backend
sudo systemctl start optimacv-backend

# Check status
sudo systemctl status optimacv-backend
```

**Frontend:**
```bash
# Install PM2
sudo npm install -g pm2

# Start frontend
cd frontend
pm2 start npm --name "optimacv-frontend" -- start
pm2 save
pm2 startup  # Follow the instructions shown
```

### 7. Verify Everything is Working

```bash
# Check Nginx
sudo systemctl status nginx
curl http://localhost

# Check Backend
sudo systemctl status optimacv-backend
curl http://localhost:8000

# Check Frontend
pm2 status
curl http://localhost:3000

# Check from browser
# Visit: http://cv10dh1.vps.webdock.cloud
```

## Quick Fix Script

If you've already uploaded the project, run:

```bash
cd /opt/optimacv  # or your project path
chmod +x deploy/fix-nginx-default.sh
sudo bash deploy/fix-nginx-default.sh
```

## Troubleshooting

### Still seeing default page?

1. **Check which site is enabled:**
   ```bash
   ls -la /etc/nginx/sites-enabled/
   ```

2. **Check Nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Verify services are running:**
   ```bash
   # Backend
   sudo systemctl status optimacv-backend
   curl http://localhost:8000
   
   # Frontend
   pm2 status
   curl http://localhost:3000
   ```

4. **Check Nginx is serving the right site:**
   ```bash
   sudo nginx -T | grep server_name
   ```

### Services not starting?

**Backend issues:**
```bash
# Check logs
sudo journalctl -u optimacv-backend -f

# Check if port 8000 is in use
sudo netstat -tlnp | grep 8000

# Test manually
cd /opt/optimacv
source venv/bin/activate
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

**Frontend issues:**
```bash
# Check PM2 logs
pm2 logs optimacv-frontend

# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000

# Test manually
cd /opt/optimacv/frontend
npm start
```

## Webdock-Specific Notes

1. **Sudo requires password** - This is normal, just enter your password when prompted
2. **FTP is enabled** - You can use FTP to upload files if needed
3. **MongoDB is disabled** - You don't need it for this project
4. **Default web root** - `/var/www/html` - You can ignore this, we're using a different setup

## Complete Deployment Command Sequence

```bash
# 1. Navigate to project
cd /opt/optimacv

# 2. Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# 3. Setup Nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/optimacv
sudo ln -s /etc/nginx/sites-available/optimacv /etc/nginx/sites-enabled/optimacv
sudo nginx -t
sudo systemctl reload nginx

# 4. Setup backend
./deploy/setup-backend.sh
cp deploy/env.template .env
nano .env  # Configure

# 5. Setup frontend
./deploy/setup-frontend.sh

# 6. Install Ollama (if needed)
./deploy/setup-ollama.sh

# 7. Start backend
sudo cp deploy/optimacv-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable optimacv-backend
sudo systemctl start optimacv-backend

# 8. Start frontend
sudo npm install -g pm2
cd frontend
pm2 start npm --name "optimacv-frontend" -- start
pm2 save
pm2 startup

# 9. Verify
curl http://cv10dh1.vps.webdock.cloud
```

