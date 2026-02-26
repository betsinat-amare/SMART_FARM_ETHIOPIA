from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.crop import Crop
from app.models.farm import Farm
from app.schemas.crop import CropCreate, CropResponse
from app.routes.farm import get_current_user

router = APIRouter(prefix="/crops", tags=["Crops"])


@router.post("/{farm_id}", response_model=CropResponse)
def create_crop(
    farm_id: int,
    crop_data: CropCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()

    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    # 🔐 Ownership check
    if farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to add crops to this farm",
        )

    crop = Crop(
        **crop_data.model_dump(),
        farm_id=farm_id
    )

    db.add(crop)
    db.commit()
    db.refresh(crop)

    return crop


@router.get("/{farm_id}", response_model=List[CropResponse])
def get_crops_by_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()

    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    if farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view crops in this farm",
        )

    crops = db.query(Crop).filter(Crop.farm_id == farm_id).all()
    return crops