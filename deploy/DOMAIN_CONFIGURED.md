# Domain Configuration Complete ✅

Your domain **cv10dh1.vps.webdock.cloud** has been configured in:

## ✅ Updated Files

1. **`deploy/nginx.conf`**
   - Server name: `cv10dh1.vps.webdock.cloud`
   - SSL certificate paths pre-configured

2. **`deploy/env.template`**
   - Domain: `http://cv10dh1.vps.webdock.cloud`
   - CORS origins configured

## 🚀 Next Steps on Your VPS

### 1. Copy Nginx Config
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/optimacv
sudo ln -s /etc/nginx/sites-available/optimacv /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Configure Environment
```bash
cp deploy/env.template .env
nano .env
# The domain is already set, just configure:
# - AI_PROVIDER (ollama or gemini)
# - OLLAMA_HOST and OLLAMA_MODEL (if using Ollama)
# - GOOGLE_API_KEY (if using Gemini)
```

### 3. Setup SSL (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cv10dh1.vps.webdock.cloud
```

After SSL setup, uncomment SSL lines in `/etc/nginx/sites-available/optimacv`:
- Lines 16-20 (HTTPS redirect)
- Line 25 (listen 443)
- Lines 29-30 (SSL certificates)

## 🌐 Your URLs

- **Frontend:** http://cv10dh1.vps.webdock.cloud
- **API:** http://cv10dh1.vps.webdock.cloud/api
- **API Docs:** http://cv10dh1.vps.webdock.cloud/docs
- **After SSL:** https://cv10dh1.vps.webdock.cloud

## 📝 Important Notes

- The domain is configured in both Nginx and environment template
- Make sure to set `CORS_ORIGINS` in your `.env` file to match your domain
- After SSL setup, update `DOMAIN` in `.env` to use `https://`

