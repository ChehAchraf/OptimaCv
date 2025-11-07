#!/usr/bin/env python3
"""
Ollama Configuration Checker and Setup Helper
This script helps verify and configure Ollama for the OptimaCV project.
"""

import httpx
import asyncio
import json
from backend.core.config import settings

async def check_ollama_status():
    """Check if Ollama is running and accessible"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{settings.OLLAMA_HOST}/api/tags")
            if response.status_code == 200:
                data = response.json()
                models = data.get('models', [])
                print("✅ Ollama is running!")
                print(f"📍 Host: {settings.OLLAMA_HOST}")
                print(f"🤖 Available models:")
                for model in models:
                    print(f"   - {model['name']} (Size: {model.get('size', 'Unknown')})")
                return True, models
            else:
                print(f"❌ Ollama responded with status {response.status_code}")
                return False, []
    except httpx.ConnectError:
        print("❌ Cannot connect to Ollama")
        print(f"   Make sure Ollama is running on {settings.OLLAMA_HOST}")
        print("   Start Ollama with: ollama serve")
        return False, []
    except Exception as e:
        print(f"❌ Error checking Ollama: {e}")
        return False, []

async def check_model_availability():
    """Check if the configured model is available"""
    try:
        import ollama
        client = ollama.Client(host=settings.OLLAMA_HOST)
        
        # Try to list models
        models_response = client.list()
        print(f"🔍 Raw models response: {models_response}")
        
        # Handle different response formats
        if 'models' in models_response:
            models_list = models_response['models']
        else:
            models_list = models_response
            
        model_names = []
        for model in models_list:
            if isinstance(model, dict):
                if 'name' in model:
                    model_names.append(model['name'])
                elif 'model' in model:
                    model_names.append(model['model'])
            else:
                model_names.append(str(model))
        
        print(f"\n🔍 Looking for model: {settings.OLLAMA_MODEL}")
        print(f"📝 Extracted model names: {model_names}")
        
        if settings.OLLAMA_MODEL in model_names:
            print(f"✅ Model {settings.OLLAMA_MODEL} is available!")
            return True
        else:
            print(f"❌ Model {settings.OLLAMA_MODEL} not found")
            print("📥 Available models:")
            for name in model_names:
                print(f"   - {name}")
            
            return False
            
    except Exception as e:
        print(f"❌ Error checking model: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_generation():
    """Test AI generation with a simple prompt"""
    try:
        from backend.services.ollama_service import ollama_service
        
        print(f"\n🧪 Testing generation with {settings.OLLAMA_MODEL}...")
        
        test_prompt = "Hello! Please respond with a simple JSON: {'status': 'working', 'message': 'Ollama is functioning correctly'}"
        
        response = await ollama_service._generate_async(
            prompt=test_prompt,
            system_prompt="You are a helpful assistant. Always respond in valid JSON format."
        )
        
        print("✅ Generation test successful!")
        print(f"📝 Response: {response[:200]}...")
        return True
        
    except Exception as e:
        print(f"❌ Generation test failed: {e}")
        return False

async def main():
    """Main configuration check"""
    print("🔧 OptimaCV Ollama Configuration Checker")
    print("=" * 50)
    
    print(f"⚙️ Current configuration:")
    print(f"   AI Provider: {settings.AI_PROVIDER}")
    print(f"   Ollama Host: {settings.OLLAMA_HOST}")
    print(f"   Ollama Model: {settings.OLLAMA_MODEL}")
    
    print("\n1️⃣ Checking Ollama service...")
    ollama_running, models = await check_ollama_status()
    
    if not ollama_running:
        print("\n🚀 To start Ollama:")
        print("   1. Open a new terminal")
        print("   2. Run: ollama serve")
        print("   3. Keep it running in the background")
        return
    
    print("\n2️⃣ Checking model availability...")
    model_available = await check_model_availability()
    
    if not model_available:
        print(f"\n📥 To install {settings.OLLAMA_MODEL}:")
        print(f"   ollama pull {settings.OLLAMA_MODEL}")
        print("\n🔄 Or update your .env file with an available model")
        return
    
    print("\n3️⃣ Testing generation...")
    generation_works = await test_generation()
    
    if generation_works:
        print("\n🎉 Everything is working! Your OptimaCV is ready to use Ollama.")
        print("\n🚀 Start your backend with:")
        print("   python -m uvicorn backend.main:app --reload --port 8000")
    else:
        print("\n❌ Generation test failed. Check your Ollama installation.")

if __name__ == "__main__":
    asyncio.run(main())