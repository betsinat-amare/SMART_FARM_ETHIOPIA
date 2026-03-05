from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.farm import Farm


def get_farm_or_404(db: Session, farm_id: int):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()

    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    return farm


def verify_farm_ownership(farm: Farm, user_id: int):
    if farm.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    

def delete_farm(db: Session, farm_id: int, user_id: int):
    farm = get_farm_or_404(db, farm_id)
    verify_farm_ownership(farm, user_id)

    db.delete(farm)
    db.commit()

    return {"detail": "Farm deleted successfully"}