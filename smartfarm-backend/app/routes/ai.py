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

@router.post("/chat")
async def chat_with_assistant(
    request: ChatRequest,
    current_user = Depends(get_current_user)
):
    # This is a placeholder for actual LLM integration (e.g. Gemini)
    # For now, it provides rule-based responses to demonstrate functionality.
    
    msg = request.message.lower()
    lang = request.language
    
    if lang == "am":
        if "ሰላም" in msg:
            response = "ሰላም! እኔ የእርስዎ የSmartFarm ረዳት ነኝ። በምን ልርዳዎት?"
        elif "ሰብል" in msg:
            response = "ስለ ሰብልዎ ጥያቄ ካለዎት ይንገሩኝ። በሽታን ለመለየት ፎቶ ማንሳት ይችላሉ።"
        else:
            response = "ጥያቄዎን ተቀብያለሁ። ስለ ግብርና ወይም ስለ ሰብልዎ ማንኛውንም ነገር ይጠይቁኝ።"
    else:
        if "hello" in msg or "hi" in msg:
            response = "Hello! I am your SmartFarm assistant. How can I help you today?"
        elif "crop" in msg or "plant" in msg:
            response = "I can help you monitor your crops. You can also upload images for disease detection."
        elif "weather" in msg:
            response = "It's important to check the weather before planting. Would you like to see the forecast?"
        else:
            response = "I've received your query. Feel free to ask me anything about farming, fertilizer, or crop prices!"
            
    return {
        "response": response,
        "language": lang
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




