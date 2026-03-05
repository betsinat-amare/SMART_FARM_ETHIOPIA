import random

def predict_disease(image_path: str):
    diseases = [
        "Maize Leaf Blight",
        "Rust Disease",
        "Healthy Leaf",
        "Bacterial Spot"
    ]

    return {
        "label": random.choice(diseases),
        "confidence": round(random.uniform(0.75, 0.98), 2)
    }