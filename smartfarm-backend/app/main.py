from fastapi import FastAPI
from app.db.session import engine
from app.routes import auth
from app.routes import users
from app.db.base import Base
from app.routes import farm


app = FastAPI(title="SmartFarm Ethiopia API")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(farm.router)

@app.get("/")
def root():
    return {"message": "SmartFarm API is running 🚀"}