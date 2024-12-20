from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import DATABASE_URL

# 数据库引擎
engine = create_engine(DATABASE_URL)

# 数据库会话
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
