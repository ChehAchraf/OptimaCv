# OptimaCV VPS Deployment

Quick start guide for deploying OptimaCV on a VPS server.

## Quick Start

### Option 1: Automated Deployment (Recommended)

```bash
# Make the script executable
chmod +x deploy/quick-deploy.sh

# Run the deployment script
./deploy/quick-deploy.sh
```

The script will guide you through:
- Installing dependencies
- Setting up backend and frontend
- Configuring systemd services
- Setting up Nginx
- Configuring firewall

### Option 2: Manual Deployment

Follow the detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md)

## Files Overview

- `setup-backend.sh` - Backend setup script
- `setup-frontend.sh` - Frontend setup script
- `quick-deploy.sh` - Automated deployment script
- `nginx.conf` - Nginx reverse proxy configuration
- `optimacv-backend.service` - Systemd service for backend
- `optimacv-frontend.service` - Systemd service for frontend (use PM2 instead)
- `env.template` - Environment variables template
- `DEPLOYMENT.md` - Detailed deployment guide

## Quick Commands

### Start Services
```bash
# Backend
sudo systemctl start optimacv-backend

# Frontend (PM2)
pm2 start optimacv-frontend

# Nginx
sudo systemctl start nginx
```

### Stop Services
```bash
# Backend
sudo systemctl stop optimacv-backend

# Frontend
pm2 stop optimacv-frontend

# Nginx
sudo systemctl stop nginx
```

### Check Status
```bash
# Backend
sudo systemctl status optimacv-backend

# Frontend
pm2 status

# Nginx
sudo systemctl status nginx
```

### View Logs
```bash
# Backend logs
sudo journalctl -u optimacv-backend -f

# Frontend logs
pm2 logs optimacv-frontend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Configuration

1. **Environment Variables**: Copy `deploy/env.template` to `.env` in project root
2. **CORS Origins**: Set `CORS_ORIGINS` in `.env` or update `backend/main.py`
3. **Nginx**: Edit `/etc/nginx/sites-available/optimacv` with your domain/IP

## Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting steps.

