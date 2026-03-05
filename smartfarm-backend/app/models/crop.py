from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    variety = Column(String, nullable=False)
    planting_date = Column(DateTime, nullable=False)
    expected_yield = Column(Float, nullable=True)

    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    farm = relationship("Farm", back_populates="crops")
    predictions = relationship("Prediction", back_populates="crop", cascade="all, delete")