from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmResponse
from app.core.security import get_user_from_token
from fastapi.security import OAuth2PasswordBearer
from app.schemas.farm import FarmUpdate

router = APIRouter(prefix="/farms", tags=["Farms"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return user


@router.post("/", response_model=FarmResponse)
def create_farm(
    farm_data: FarmCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    farm = Farm(
        **farm_data.model_dump(),
        owner_id=current_user.id
    )

    db.add(farm)
    db.commit()
    db.refresh(farm)

    return farm


@router.get("/", response_model=List[FarmResponse])
def get_my_farms(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    farms = db.query(Farm).filter(Farm.owner_id == current_user.id).all()
    return farms


@router.put("/{farm_id}", response_model=FarmResponse)
def update_farm(
    farm_id: int,
    farm_data: FarmUpdate,
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
            detail="Not authorized to update this farm",
        )

    # Update only provided fields
    for key, value in farm_data.model_dump(exclude_unset=True).items():
        setattr(farm, key, value)

    db.commit()
    db.refresh(farm)

    return farm


@router.delete("/{farm_id}")
def delete_farm(
    farm_id: int,
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
            detail="Not authorized to delete this farm",
        )

    db.delete(farm)
    db.commit()

    return {"message": "Farm deleted successfully"}

@router.delete("/{farm_id}")
def remove_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return delete_farm(db, farm_id, current_user.id)