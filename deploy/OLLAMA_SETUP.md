# Ollama Setup Guide for VPS

## Do You Need Ollama?

**Yes, if:**
- You set `AI_PROVIDER=ollama` in your `.env` file
- You want to use local AI models (free, private, no API keys)

**No, if:**
- You set `AI_PROVIDER=gemini` in your `.env` file
- You're using Google Gemini API (cloud-based)

## Installation on VPS

### Option 1: Automated Installation (Recommended)

```bash
# Make script executable
chmod +x deploy/setup-ollama.sh

# Run installation
./deploy/setup-ollama.sh
```

### Option 2: Manual Installation

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
sudo systemctl enable ollama
sudo systemctl start ollama

# Pull the model you need
ollama pull gemma3:4b
```

## System Requirements

- **Minimum RAM:** 4GB (8GB+ recommended)
- **Storage:** ~3-5GB per model
- **CPU:** Any modern CPU (better CPU = faster responses)

## Configuration

### 1. Update `.env` file:

```env
AI_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma3:4b
```

### 2. Verify Ollama is running:

```bash
# Check service status
sudo systemctl status ollama

# Test Ollama
ollama list
ollama run gemma3:4b "Hello, test"
```

## Available Models

### Lightweight Models (Good for VPS with limited RAM)
- `gemma3:4b` - ~2.5GB (default, recommended)
- `llama3.2:1b` - ~1.3GB (very fast, less capable)
- `phi3:mini` - ~2.3GB

### Medium Models (Need 8GB+ RAM)
- `llama3.2:3b` - ~2GB
- `mistral:7b` - ~4.1GB
- `llama3.1:8b` - ~4.7GB

### Large Models (Need 16GB+ RAM)
- `llama3.1:70b` - ~40GB
- `mistral-nemo:12b` - ~7GB

## Managing Ollama

### Start/Stop Service
```bash
sudo systemctl start ollama
sudo systemctl stop ollama
sudo systemctl restart ollama
```

### View Logs
```bash
sudo journalctl -u ollama -f
```

### List Installed Models
```bash
ollama list
```

### Pull New Model
```bash
ollama pull <model-name>
# Example: ollama pull llama3.2:3b
```

### Remove Model
```bash
ollama rm <model-name>
```

### Test Model
```bash
ollama run gemma3:4b "Analyze this CV: [your text]"
```

## Troubleshooting

### Ollama not starting
```bash
# Check logs
sudo journalctl -u ollama -n 50

# Check if port is in use
sudo netstat -tlnp | grep 11434

# Restart service
sudo systemctl restart ollama
```

### Out of Memory
- Use a smaller model (gemma3:4b instead of larger models)
- Increase VPS RAM
- Or switch to Gemini (cloud-based, no local RAM needed)

### Slow Responses
- Use a smaller/faster model
- Upgrade VPS CPU
- Consider using Gemini for faster cloud responses

### Model Not Found
```bash
# Pull the model first
ollama pull gemma3:4b

# Verify it's installed
ollama list
```

## Running Ollama on Different Server

If Ollama is on a different server:

1. **On Ollama server:** Allow external connections
   ```bash
   # Edit Ollama service to bind to 0.0.0.0
   sudo systemctl edit ollama
   # Add:
   [Service]
   Environment="OLLAMA_HOST=0.0.0.0:11434"
   sudo systemctl restart ollama
   ```

2. **In your .env file:**
   ```env
   OLLAMA_HOST=http://your-ollama-server-ip:11434
   ```

3. **Firewall:** Allow port 11434 on Ollama server
   ```bash
   sudo ufw allow 11434/tcp
   ```

## Alternative: Use Gemini Instead

If you don't want to install Ollama, use Gemini:

1. **Get API key:** https://makersuite.google.com/app/apikey
2. **Update .env:**
   ```env
   AI_PROVIDER=gemini
   GOOGLE_API_KEY=your_api_key_here
   ```
3. **No installation needed** - Gemini runs in the cloud

## Performance Tips

1. **Use SSD storage** for faster model loading
2. **Allocate enough RAM** - models run in RAM
3. **Monitor resource usage:**
   ```bash
   htop
   # or
   free -h
   ```

## Security

- Ollama by default only listens on localhost (127.0.0.1)
- This is secure - only your backend can access it
- Don't expose Ollama port (11434) to the internet unless needed

