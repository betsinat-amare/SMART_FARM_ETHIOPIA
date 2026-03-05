from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.crop import CropCreate, CropResponse
from app.routes.farm import get_current_user
from app.services.crop_service import (
    create_crop_for_farm,
    get_crops_for_farm,
    delete_crop,
)

router = APIRouter(prefix="/crops", tags=["Crops"])


@router.post("/{farm_id}", response_model=CropResponse)
def create_crop(
    farm_id: int,
    crop_data: CropCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_crop_for_farm(
        db,
        farm_id,
        crop_data,
        current_user.id,
    )


@router.get("/{farm_id}", response_model=List[CropResponse])
def get_crops_by_farm(
    farm_id: int,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_crops_for_farm(
        db,
        farm_id,
        current_user.id,
        skip,
        limit,
    )


@router.delete("/{crop_id}")
def remove_crop(
    crop_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return delete_crop(
        db,
        crop_id,
        current_user.id,
    )