from app.models.base import Base

# Import models so SQLAlchemy registers them with the shared Base
from app.models import user, farm
from app.models.crop import Crop
from app.models.prediction import Prediction