from sqlalchemy.orm import Session
from app.models.prediction import Prediction
from app.ml.disease_model import predict_disease

def create_prediction(db: Session, user_id: int, image_path: str):
    result = predict_disease(image_path)

    prediction = Prediction(
        user_id=user_id,
        image_path=image_path,
        predicted_label=result["label"],
        confidence_score=result["confidence"]
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction