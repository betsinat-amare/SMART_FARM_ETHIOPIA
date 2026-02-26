from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FarmBase(BaseModel):
    name: str
    region: str
    district: str
    soil_type: str
    size_in_hectares: float


class FarmCreate(FarmBase):
    pass


class FarmUpdate(BaseModel):
    name: Optional[str] = None
    region: Optional[str] = None
    district: Optional[str] = None
    soil_type: Optional[str] = None
    size_in_hectares: Optional[float] = None


class FarmResponse(FarmBase):
    id: int
    owner_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }