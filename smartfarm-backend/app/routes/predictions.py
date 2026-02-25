import os
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.services.prediction_service import create_prediction

router = APIRouter(prefix="/predictions", tags=["Predictions"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    prediction = create_prediction(db, current_user.id, file_path)

    return {
        "predicted_label": prediction.predicted_label,
        "confidence_score": prediction.confidence_score
    }

@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Prediction).filter(Prediction.user_id == current_user.id).all()