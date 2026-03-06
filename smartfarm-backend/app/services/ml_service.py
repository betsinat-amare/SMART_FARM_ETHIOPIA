import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import os
from fastapi import HTTPException

# Define the classes based on common Ethiopian crop diseases
# This should match your model's output layer
CLASSES = [
    "Maize_Healthy",
    "Maize_Leaf_Blight",
    "Tomato_Healthy",
    "Tomato_Early_Blight",
    "Wheat_Healthy",
    "Wheat_Rust",
    "Coffee_Healthy",
    "Coffee_Berry_Disease"
]

# Recommendations mapping
RECOMMENDATIONS = {
    "Maize_Leaf_Blight": ["Use resistant varieties", "Crop rotation", "Apply fungicides like Mancozeb"],
    "Tomato_Early_Blight": ["Remove infected leaves", "Avoid overhead watering", "Use copper-based fungicides"],
    "Wheat_Rust": ["Plant rust-resistant seeds", "Monitor early in the season", "Apply triazole fungicides"],
    "Coffee_Berry_Disease": ["Prune to improve aeration", "Copper-based sprays before rainy season", "Pick and destroy infected berries"],
    "Healthy": ["Continue regular monitoring", "Maintain optimal irrigation and nutrient levels"]
}

# Image Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Global model variable
model = None

def load_model():
    global model
    if model is not None:
        return model
    
    # We'll use a pre-trained ResNet18 as a baseline/placeholder
    # In a production environment, you would load your custom .pth weights here
    from torchvision import models
    model = models.resnet18(weights='IMAGENET1K_V1')
    
    # Modify the final layer to match our number of classes
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, len(CLASSES))
    
    # If you have a .pth file, load it here:
    # model_path = "app/ml/disease_model.pth"
    # if os.path.exists(model_path):
    #     model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    
    model.eval()
    return model

async def predict_disease(image_data: bytes):
    try:
        # Load and transform image
        img = Image.open(io.BytesIO(image_data)).convert('RGB')
        img_t = transform(img)
        batch_t = torch.unsqueeze(img_t, 0)

        # Build/Load model
        net = load_model()

        # Inference
        with torch.no_grad():
            out = net(batch_t)
            
        # Get probabilities
        prob = torch.nn.functional.softmax(out, dim=1)[0]
        confidence, index = torch.max(prob, dim=0)
        
        disease_key = CLASSES[index]
        
        # Clean up name for display
        display_name = disease_key.replace("_", " ")
        
        # Get recommendations
        # Check if it's healthy or diseased
        lookup_key = disease_key if "Healthy" not in disease_key else "Healthy"
        recs = RECOMMENDATIONS.get(lookup_key, ["Consult a local agricultural expert for detailed diagnosis."])

        return {
            "disease_name": display_name,
            "confidence": float(confidence),
            "recommendations": recs
        }

    except Exception as e:
        print(f"ML Inference Error: {e}")
        raise HTTPException(status_code=500, detail="Error during image analysis")
