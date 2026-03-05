from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CropBase(BaseModel):
    name: str
    variety: str
    planting_date: datetime
    expected_yield: Optional[float] = None


class CropCreate(CropBase):
    pass


class CropResponse(CropBase):
    id: int
    farm_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }