from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    predicted_yield = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)

    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    crop = relationship("Crop", back_populates="predictions")