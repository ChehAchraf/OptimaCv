# OptimaCV VPS Deployment Guide

This guide will help you deploy OptimaCV on a VPS server without Docker.

## Prerequisites

- Ubuntu 20.04+ or Debian 11+ VPS
- Root or sudo access
- Domain name (optional, can use IP address)
- At least 2GB RAM (4GB+ recommended)
- Python 3.8+ and Node.js 18+

## Step 1: Initial Server Setup

### 1.1 Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Required Software

```bash
# Install Python and pip
sudo apt install -y python3 python3-pip python3-venv

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install build tools (for some Python packages)
sudo apt install -y build-essential python3-dev
```

### 1.3 Verify Installations

```bash
python3 --version  # Should be 3.8+
node --version     # Should be 18+
nginx -v           # Should show version
```

## Step 2: Clone and Setup Project

### 2.1 Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/optimacv
sudo chown $USER:$USER /opt/optimacv

# Clone your repository (replace with your repo URL)
cd /opt/optimacv
git clone <your-repo-url> .

# Or if you're uploading files manually, upload them to /opt/optimacv
```

### 2.2 Setup Backend

```bash
cd /opt/optimacv

# Make setup script executable
chmod +x deploy/setup-backend.sh

# Run backend setup
./deploy/setup-backend.sh

# Activate virtual environment
source venv/bin/activate

# Create .env file
cp deploy/.env.example .env
nano .env  # Edit with your configuration
```

**Important:** Edit `.env` file with your settings:
- Set `AI_PROVIDER` (ollama or gemini)
- If using Ollama, configure `OLLAMA_HOST` and `OLLAMA_MODEL`
- If using Gemini, add your `GOOGLE_API_KEY`
- Update `DOMAIN` with your server IP or domain

### 2.3 Setup Frontend

```bash
# Make setup script executable
chmod +x deploy/setup-frontend.sh

# Run frontend setup
./deploy/setup-frontend.sh
```

## Step 3: Configure Backend CORS

Update the backend CORS settings to allow your domain:

```bash
nano backend/main.py
```

Update the `origins` list to include your domain:

```python
origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://your-domain.com",  # Add your domain
    "http://your-server-ip",   # Add your IP if not using domain
]
```

## Step 4: Setup Systemd Services

### 4.1 Backend Service

```bash
# Copy service file
sudo cp deploy/optimacv-backend.service /etc/systemd/system/

# Update the path in the service file if needed
sudo nano /etc/systemd/system/optimacv-backend.service

# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable optimacv-backend
sudo systemctl start optimacv-backend

# Check status
sudo systemctl status optimacv-backend
```

### 4.2 Frontend Service

**Note:** For the frontend service, you need to use the full path to npm or use a process manager like PM2.

**Option A: Using PM2 (Recommended)**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start frontend with PM2
cd /opt/optimacv/frontend
pm2 start npm --name "optimacv-frontend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown
```

**Option B: Update systemd service to use full npm path**

```bash
# Find npm path
which npm  # Usually /usr/bin/npm

# Edit service file
sudo nano /etc/systemd/system/optimacv-frontend.service

# Update ExecStart to use full path:
# ExecStart=/usr/bin/npm start

# Then enable and start
sudo systemctl daemon-reload
sudo systemctl enable optimacv-frontend
sudo systemctl start optimacv-frontend
```

## Step 5: Configure Nginx

### 5.1 Setup Nginx Configuration

```bash
# Copy nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/optimacv

# Edit the configuration
sudo nano /etc/nginx/sites-available/optimacv
```

**Important:** Update these lines:
- Replace `your-domain.com` with your actual domain or remove if using IP
- If using IP only, change `server_name` to your IP or use `_` for default

### 5.2 Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/optimacv /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 5.3 Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall if not already enabled
sudo ufw enable
```

## Step 6: Setup SSL (Optional but Recommended)

### 6.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Get SSL Certificate

```bash
# Replace with your domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 6.3 Update Nginx Config

After SSL setup, uncomment the SSL lines in `/etc/nginx/sites-available/optimacv`:

```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

Then restart nginx:
```bash
sudo systemctl restart nginx
```

## Step 7: Verify Deployment

### 7.1 Check Services

```bash
# Check backend
sudo systemctl status optimacv-backend
curl http://localhost:8000

# Check frontend
pm2 status  # or sudo systemctl status optimacv-frontend
curl http://localhost:3000

# Check nginx
sudo systemctl status nginx
```

### 7.2 Test from Browser

- Visit `http://your-domain.com` or `http://your-server-ip`
- Visit `http://your-domain.com/docs` for API documentation

## Step 8: Setup Ollama (If Using Ollama)

If you're using Ollama for AI:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
sudo systemctl enable ollama
sudo systemctl start ollama

# Pull the model
ollama pull gemma3:4b

# Or if using a different model, update .env file
```

## Troubleshooting

### Backend not starting

```bash
# Check logs
sudo journalctl -u optimacv-backend -f

# Check if port is in use
sudo netstat -tlnp | grep 8000

# Test manually
cd /opt/optimacv
source venv/bin/activate
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Frontend not starting

```bash
# Check PM2 logs
pm2 logs optimacv-frontend

# Or systemd logs
sudo journalctl -u optimacv-frontend -f

# Test manually
cd /opt/optimacv/frontend
npm start
```

### Nginx errors

```bash
# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Check if services are running
sudo systemctl status optimacv-backend
pm2 status
```

### Permission issues

```bash
# Fix ownership
sudo chown -R www-data:www-data /opt/optimacv

# Or if using your user
sudo chown -R $USER:$USER /opt/optimacv
```

## Maintenance

### Update Application

```bash
cd /opt/optimacv

# Pull latest changes
git pull

# Update backend
source venv/bin/activate
pip install -r requirements.txt

# Update frontend
cd frontend
npm install
npm run build

# Restart services
sudo systemctl restart optimacv-backend
pm2 restart optimacv-frontend
# or
sudo systemctl restart optimacv-frontend
```

### View Logs

```bash
# Backend logs
sudo journalctl -u optimacv-backend -f

# Frontend logs (PM2)
pm2 logs optimacv-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Security Recommendations

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Setup firewall rules:**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

3. **Use SSL/HTTPS** (highly recommended)

4. **Regular backups** of your application and database

5. **Monitor logs** regularly for suspicious activity

## Support

For issues or questions, check:
- Backend logs: `sudo journalctl -u optimacv-backend`
- Frontend logs: `pm2 logs` or `sudo journalctl -u optimacv-frontend`
- Nginx logs: `/var/log/nginx/error.log`

