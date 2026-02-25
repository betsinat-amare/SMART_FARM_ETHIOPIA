from fastapi import FastAPI
from app.db.session import engine
from app.models.base import Base
from app.models import user   
from app.routes import auth
from app.routes import users
from app.routes import predictions
app = FastAPI(title="SmartFarm Ethiopia API")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(predictions.router)

@app.get("/")
def root():
    return {"message": "SmartFarm API is running 🚀"}