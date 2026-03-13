from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

print("--- Available Models ---")
try:
    for model in client.models.list():
        print(f"Name: {model.name}")
    
    print("\n--- Testing Generation with gemini-1.5-flash ---")
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Hi"
    )
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
