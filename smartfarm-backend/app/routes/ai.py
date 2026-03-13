from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import shutil
import os
import random
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI Services"])

class ChatRequest(BaseModel):
    message: str
    language: str = "en"  # "en" or "am"

from google import genai
from app.core.config import settings

# Initialize Gemini Client
client = genai.Client(api_key=settings.GOOGLE_API_KEY)

# Specialized Agricultural System Prompt
SYSTEM_PROMPT = """
You are the SmartFarm Ethiopia AI Assistant, a world-class agricultural expert specialized in Ethiopian farming.
Your goal is to provide accurate, actionable, and context-aware advice to farmers in Ethiopia.

Key Areas of Expertise:
1. Ethiopian Crops: Teff, Coffee (Arabica), Maize, Wheat, Barley, Sorghum, Pulses (Chickpeas, Lentils).
2. Local Context: Knowledge of Ethiopian soil (Vertisols, Nitosols), climate zones (Dega, Weyna Dega, Kolla), and highland/lowland farming.
3. Disease Management: Identifying and suggesting organic and chemical treatments for local diseases.
4. Modern Techniques: Precision irrigation, soil conservation, and crop rotation.

Instructions:
- Provide advice in the language requested (Amharic or English).
- Be polite, encouraging, and clear.
- If you don't know something specific to a very local area, suggest consulting a local agricultural extension officer.
- Use metric units (kilograms, hectares, liters).
"""

@router.post("/chat")
async def chat_with_assistant(
    request: ChatRequest,
    current_user = Depends(get_current_user)
):
    try:
        raw_key = settings.GOOGLE_API_KEY
        key_exists = bool(raw_key and raw_key not in ["your_key_here", "YOUR_GEMINI_API_KEY_HERE", ""])
        
        if not key_exists:
            raise ValueError("API_KEY_MISSING")

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            config={'system_instruction': SYSTEM_PROMPT},
            contents=f"{'Respond in Amharic (አማርኛ).' if request.language == 'am' else 'Respond in English.'}\n\nUser Question: {request.message}"
        )
        
        return {
            "response": response.text,
            "language": request.language
        }
    except Exception as e:
        print(f"Gemini API Error: {e}")
        error_str = str(e).lower()
        if "api_key_invalid" in error_str or "api_key_missing" in error_str or "not found" in error_str:
            fallback = "ሰላም! የGemini API ቁልፍ ስላልተገኘ በጊዜያዊነት ምላሽ መስጠት አልቻልኩም። እባክዎ አስተዳዳሪውን ያነጋግሩ።" if request.language == "am" else "Hello! I'm currently in 'offline mode' because my API key is missing. Please contact the administrator to enable my full brains!"
        elif "quota" in error_str or "exhausted" in error_str:
            fallback = "ይቅርታ፣ የነጻ አገልግሎት አጠቃቀም ገደብዎ አልቋል። እባክዎ ጥቂት ጊዜ ቆይተው ይሞክሩ ወይም የክፍያ ገደብዎን ይፈትሹ።" if request.language == "am" else "I've hit my free-tier limit for today! Please wait a while or check your Gemini API quota at Google AI Studio."
        else:
            fallback = "ይቅርታ፣ ችግር ተፈጥሯል። እባክዎ ቆይተው እንደገና ይሞክሩ።" if request.language == "am" else "Sorry, I encountered an error. Please try again later."
            
        return {
            "response": fallback,
            "language": request.language
        }

from app.services.ml_service import predict_disease

@router.post("/disease-detection")
async def detect_disease(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    # Read image file
    image_data = await file.read()
    
    # Run real ML inference
    result = await predict_disease(image_data)
    
    return result


class FertilizerRequest(BaseModel):
    soil_type: str
    crop_name: str
    moisture_level: float
    nitrogen: float
    phosphorus: float
    potassium: float

@router.post("/fertilizer-recommendation")
async def get_fertilizer_recommendation(
    request: FertilizerRequest,
    current_user = Depends(get_current_user)
):
    # Rule-based logic for demo purposes
    crop = request.crop_name.lower()
    n, p, k = request.nitrogen, request.phosphorus, request.potassium
    
    recommendation = ""
    if "maize" in crop:
        if n < 50: recommendation = "Apply 50kg Urea per hectare."
        elif p < 30: recommendation = "Apply 40kg DAP per hectare."
        else: recommendation = "Soil nutrient levels are adequate for Maize."
    elif "teff" in crop:
        if n < 40: recommendation = "Apply 30kg Urea per hectare during tillering."
        else: recommendation = "Maintain current organic fertilizer application."
    else:
        recommendation = "Apply balanced NPK fertilizer (20-20-20) based on crop growth stage."
        
    return {
        "recommendation": recommendation,
        "advice": [
            "Apply fertilizer 10cm away from the plant base.",
            "Water the soil after application.",
            "Consider using organic compost to improve soil structure over time."
        ]
    }

@router.get("/market-prices")
async def get_market_prices(
    crop_name: str = "Maize",
    current_user = Depends(get_current_user)
):
    # Mock data for price trends
    import datetime
    
    today = datetime.date.today()
    prices = []
    
    # Generate 6 months of historical data + 3 months forecast
    base_price = 1200 if "maize" in crop_name.lower() else 3500
    
    for i in range(-6, 4):
        date = today + datetime.timedelta(days=i*30)
        # Add some random walk
        variation = random.uniform(-100, 100)
        prices.append({
            "date": date.strftime("%Y-%m-%B"),
            "price": round(base_price + (i * 50) + variation, 2),
            "type": "Historical" if i <= 0 else "Forecast"
        })
        
    return {
        "crop": crop_name,
        "current_price": prices[6]["price"],
        "trend": "Increasing" if prices[9]["price"] > prices[6]["price"] else "Stable",
        "history": prices
    }

@router.get("/weather-advisory")
async def get_weather_advisory(
    location: str = "Bishoftu",
    current_user = Depends(get_current_user)
):
    # Mock data for weather advisory
    forecast = [
        {"day": "Monday", "temp": 24, "condition": "Sunny", "icon": "☀️"},
        {"day": "Tuesday", "temp": 22, "condition": "Partly Cloudy", "icon": "⛅"},
        {"day": "Wednesday", "temp": 19, "condition": "Light Rain", "icon": "🌦️"},
        {"day": "Thursday", "temp": 18, "condition": "Heavy Rain", "icon": "🌧️"},
        {"day": "Friday", "temp": 21, "condition": "Cloudy", "icon": "☁️"},
    ]
    
    suggestions = []
    if any(f["condition"] == "Heavy Rain" for f in forecast):
        suggestions.append("Delay fertilizer application due to expected heavy rain.")
        suggestions.append("Ensure proper drainage in low-lying fields.")
    else:
        suggestions.append("Good week for weeding and general maintenance.")
        
    suggestions.append("Ideal time for harvesting teff if moisture is below 12%.")
    
    return {
        "location": location,
        "current_temp": 23,
        "current_condition": "Sunny",
        "forecast": forecast,
        "suggestions": suggestions
    }




