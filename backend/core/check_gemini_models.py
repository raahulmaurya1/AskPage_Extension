import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

# Configure Gemini API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# List all available models
print("Available Gemini models:\n")

for model in genai.list_models():
    print(f"Model name: {model.name}")
    print(f"  Supported methods: {model.supported_generation_methods}")
    print("-" * 60)
