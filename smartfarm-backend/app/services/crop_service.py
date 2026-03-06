from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.schemas.crop import CropCreate
from app.models.crop import Crop
from app.services.farm_service import (
    get_farm_or_404,
    verify_farm_ownership,
)


def create_crop_for_farm(
    db: Session,
    farm_id: int,
    crop_data: CropCreate,
    user_id: int,
):
    farm = get_farm_or_404(db, farm_id)
    verify_farm_ownership(farm, user_id)

    db_crop = Crop(
        **crop_data.model_dump(),
        farm_id=farm_id
    )
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop


def get_crops_for_farm(
    db: Session,
    farm_id: int,
    user_id: int,
    skip: int = 0,
    limit: int = 10,
):
    farm = get_farm_or_404(db, farm_id)
    verify_farm_ownership(farm, user_id)

    return (
        db.query(Crop)
        .filter(Crop.farm_id == farm_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def delete_crop(db: Session, crop_id: int, user_id: int):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()

    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    farm = get_farm_or_404(db, crop.farm_id)
    verify_farm_ownership(farm, user_id)

    db.delete(crop)
    db.commit()

    return {"detail": "Crop deleted successfully"}