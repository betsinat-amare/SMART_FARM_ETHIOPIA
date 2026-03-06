from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.routes import auth
from app.routes import users
from app.db.base import Base
from app.routes import farm
from app.routes import crop
from app.routes import prediction
from app.routes import ai

app = FastAPI(title="SmartFarm Ethiopia API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(farm.router)
app.include_router(crop.router)
app.include_router(prediction.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {"message": "SmartFarm API is running 🚀"}

@app.get("/health")
def health_check():
    return {"status": "ok"}