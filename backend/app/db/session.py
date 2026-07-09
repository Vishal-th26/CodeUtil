from app.db.base import Base
from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


db_url= settings.DATABASE_URL

engine=create_engine(db_url,pool_pre_ping=True)
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
        