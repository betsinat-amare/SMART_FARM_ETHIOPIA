from sqlalchemy.orm import Session
from fastapi import HTTPException
from random import uniform

from app.models.crop import Crop
from app.models.prediction import Prediction
from app.services.farm_service import get_farm_or_404, verify_farm_ownership


def generate_crop_prediction(db: Session, crop_id: int, user_id: int):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()

    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    farm = get_farm_or_404(db, crop.farm_id)
    verify_farm_ownership(farm, user_id)

    predicted_yield = round(uniform(2.0, 8.0), 2)
    confidence_score = round(uniform(0.7, 0.95), 2)

    prediction = Prediction(
        predicted_yield=predicted_yield,
        confidence_score=confidence_score,
        crop_id=crop_id
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction

def get_predictions_for_crop(
    db: Session,
    crop_id: int,
    user_id: int,
    skip: int = 0,
    limit: int = 10,
):
    from app.models.crop import Crop

    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    farm = get_farm_or_404(db, crop.farm_id)
    verify_farm_ownership(farm, user_id)

    return (
        db.query(Prediction)
        .filter(Prediction.crop_id == crop_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def delete_prediction(db: Session, prediction_id: int, user_id: int):
    prediction = db.query(Prediction).filter(
        Prediction.id == prediction_id
    ).first()

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    farm = get_farm_or_404(db, prediction.crop.farm_id)
    verify_farm_ownership(farm, user_id)

    db.delete(prediction)
    db.commit()

    return {"detail": "Prediction deleted successfully"}