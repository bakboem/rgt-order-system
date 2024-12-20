from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import DATABASE_URL


# 创建异步引擎
engine = create_async_engine(DATABASE_URL, echo=True)

# 创建异步会话
async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)
