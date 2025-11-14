# Nginx Configuration Guide

## What to Modify in `nginx.conf`

### 1. **Server Name (REQUIRED)**

Replace `your-domain.com` with your actual domain or IP address:

**If you have a domain:**
```nginx
server_name yourdomain.com www.yourdomain.com;
```

**If you only have an IP address:**
```nginx
server_name _;  # or use your IP: server_name 123.45.67.89;
```

### 2. **SSL Configuration (After setting up SSL certificate)**

Once you have SSL certificate from Let's Encrypt:

1. Uncomment the HTTPS redirect block:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

2. Uncomment SSL lines in main server block:
```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

### 3. **File Upload Size (Optional)**

If you need to upload larger files, increase:
```nginx
client_max_body_size 10M;  # Change to 50M, 100M, etc.
```

## Quick Setup Steps

1. **Edit the configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/optimacv
   ```

2. **Change server_name:**
   - Replace `your-domain.com www.your-domain.com` with your actual domain
   - Or use `_` if using IP only

3. **Test configuration:**
   ```bash
   sudo nginx -t
   ```

4. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

## Example Configurations

### Using Domain Name
```nginx
server_name optimacv.com www.optimacv.com;
```

### Using IP Address Only
```nginx
server_name _;
# or
server_name 192.168.1.100;
```

### Using Both Domain and IP
```nginx
server_name optimacv.com www.optimacv.com 192.168.1.100;
```

## After Setup

1. Make sure backend is running on port 8000
2. Make sure frontend is running on port 3000
3. Test: `curl http://your-domain.com` or `curl http://your-ip`

