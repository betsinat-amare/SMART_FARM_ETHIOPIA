from fastapi import FastAPI
from app.db.session import engine
from app.routes import auth
from app.routes import users
from app.db.base import Base
from app.routes import farm
from app.routes import crop

app = FastAPI(title="SmartFarm Ethiopia API")


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(farm.router)
app.include_router(crop.router)

@app.get("/")
def root():
    return {"message": "SmartFarm API is running 🚀"}