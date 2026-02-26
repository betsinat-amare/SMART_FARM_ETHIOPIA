from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import register_user, authenticate_user, generate_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, user_data.name, user_data.email, user_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user

@router.post("/login")
async def login(request: Request, db: Session = Depends(get_db)):
    # Support both JSON body {"email":..., "password":...}
    # and form-encoded data (e.g. OAuth2PasswordRequestForm with 'username' and 'password').
    content_type = request.headers.get("content-type", "")
    if content_type.startswith("application/x-www-form-urlencoded") or content_type.startswith("multipart/form-data"):
        form = await request.form()
        email = form.get("username") or form.get("email")
        password = form.get("password")
    else:
        body = await request.json()
        email = body.get("email")
        password = body.get("password")

    if not email or not password:
        raise HTTPException(status_code=422, detail="email and password are required")

    user = authenticate_user(db, email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = generate_token(user)

    return {
        "access_token": token,
        "token_type": "bearer"
    }