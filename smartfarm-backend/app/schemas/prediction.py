from pydantic import BaseModel
from datetime import datetime


class PredictionResponse(BaseModel):
    id: int
    predicted_yield: float
    confidence_score: float
    crop_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }