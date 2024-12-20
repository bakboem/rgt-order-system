from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,Session,declarative_base
from app.core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)

Base = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

