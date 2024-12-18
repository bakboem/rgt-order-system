from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,Session,declarative_base
from app.core.config import DATABASE_URL

# 创建数据库引擎
engine = create_engine(DATABASE_URL)

# 创建基类
Base = declarative_base()
# 创建数据库会话
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


