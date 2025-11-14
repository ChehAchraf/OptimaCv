# Quick Start: What to Modify

## 1. Nginx Configuration (`nginx.conf`)

### **REQUIRED Changes:**

**Line 26** - Replace with your domain or IP:
```nginx
# If you have a domain:
server_name yourdomain.com www.yourdomain.com;

# If you only have an IP:
server_name _;
# or
server_name 123.45.67.89;
```

### **Optional Changes (after SSL setup):**

1. **Uncomment HTTPS redirect** (lines 16-20) after getting SSL certificate
2. **Uncomment SSL lines** (lines 25, 29-32) after getting SSL certificate

### **Quick Edit Command:**
```bash
sudo nano /etc/nginx/sites-available/optimacv
# Change line 26, save (Ctrl+O, Enter, Ctrl+X)
sudo nginx -t  # Test configuration
sudo systemctl reload nginx  # Apply changes
```

---

## 2. Ollama Setup

### **Do You Need Ollama?**

**YES** - Install Ollama if:
- Your `.env` file has `AI_PROVIDER=ollama`
- You want free, local AI (no API keys)

**NO** - Skip Ollama if:
- Your `.env` file has `AI_PROVIDER=gemini`
- You're using Google Gemini (cloud-based)

### **Install Ollama (if needed):**

```bash
# Quick install
chmod +x deploy/setup-ollama.sh
./deploy/setup-ollama.sh
```

Or manually:
```bash
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable ollama
sudo systemctl start ollama
ollama pull gemma3:4b
```

### **System Requirements:**
- **RAM:** 4GB minimum (8GB+ recommended)
- **Storage:** ~3GB per model
- **CPU:** Any modern CPU

### **Verify Ollama:**
```bash
sudo systemctl status ollama
ollama list
```

---

## Complete Deployment Checklist

1. ✅ **Upload project** to VPS (e.g., `/opt/optimacv`)
2. ✅ **Run setup scripts:**
   ```bash
   ./deploy/setup-backend.sh
   ./deploy/setup-frontend.sh
   ```
3. ✅ **Configure `.env` file:**
   ```bash
   cp deploy/env.template .env
   nano .env
   # Set: AI_PROVIDER, OLLAMA_HOST, OLLAMA_MODEL (or GOOGLE_API_KEY)
   ```
4. ✅ **Install Ollama** (if using Ollama):
   ```bash
   ./deploy/setup-ollama.sh
   ```
5. ✅ **Setup Nginx:**
   ```bash
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/optimacv
   sudo nano /etc/nginx/sites-available/optimacv  # Edit server_name
   sudo ln -s /etc/nginx/sites-available/optimacv /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
6. ✅ **Start services:**
   ```bash
   # Backend
   sudo systemctl enable optimacv-backend
   sudo systemctl start optimacv-backend
   
   # Frontend (with PM2)
   cd frontend
   pm2 start npm --name "optimacv-frontend" -- start
   pm2 save
   pm2 startup
   ```
7. ✅ **Test:**
   - Visit: `http://your-domain.com` or `http://your-ip`
   - API docs: `http://your-domain.com/docs`

---

## Common Issues

### Nginx not working?
```bash
sudo nginx -t  # Check for errors
sudo tail -f /var/log/nginx/error.log  # View errors
```

### Backend not starting?
```bash
sudo journalctl -u optimacv-backend -f  # View logs
```

### Ollama not working?
```bash
sudo systemctl status ollama
ollama list  # Check if model is installed
```

---

## Need More Help?

- **Nginx details:** See `deploy/NGINX_SETUP.md`
- **Ollama details:** See `deploy/OLLAMA_SETUP.md`
- **Full deployment:** See `deploy/DEPLOYMENT.md`

