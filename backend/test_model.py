import google.generativeai as genai
import os
import sys

# Get API key from environment (should be set in the container)
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("GOOGLE_API_KEY not found in environment variables.")
    # Try to load from .env file manually if not in env
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("GOOGLE_API_KEY"):
                    api_key = line.split("=")[1].strip().strip('"')
                    break
    except Exception:
        pass

if not api_key:
    print("Could not find API Key.")
    sys.exit(1)

print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")

genai.configure(api_key=api_key)

print("Listing available models that support generateContent:")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")

models_to_test = ["gemini-2.0-flash"]

for model_name in models_to_test:
    print(f"\nTesting model: {model_name}")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello")
        print(f"Success! Response: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")
