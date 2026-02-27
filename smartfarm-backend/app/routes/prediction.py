from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from random import uniform

from app.db.session import get_db
from app.models.crop import Crop
from app.models.farm import Farm
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionResponse
from app.routes.farm import get_current_user
from app.services.prediction_service import delete_prediction, generate_crop_prediction, get_predictions_for_crop

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post("/{crop_id}", response_model=PredictionResponse)
def generate_prediction(
    crop_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return generate_crop_prediction(db, crop_id, current_user.id)

@router.get("/crop/{crop_id}", response_model=list[PredictionResponse])
def list_predictions_by_crop(
    crop_id: int,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_predictions_for_crop(
        db,
        crop_id,
        current_user.id,
        skip,
        limit,
    )

@router.delete("/{prediction_id}")
def remove_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return delete_prediction(db, prediction_id, current_user.id)