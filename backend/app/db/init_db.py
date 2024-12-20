# app/db/init_db.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import inspect
from app.db.session import engine, async_session
from app.models.models import User, Biz
from app.services.auth_service import get_password_hash
from app.db.base import Base
from sqlalchemy import text
async def init_db():
    """
    异步初始化数据库，创建缺失的表并插入初始数据。
    """
    async with engine.begin() as conn:
        # 定义一个同步函数，包含所有同步操作
        def sync_operations(sync_conn):
            inspector = inspect(sync_conn)
            existing_tables = set(inspector.get_table_names())

            # 创建缺失的表
            Base.metadata.create_all(sync_conn)

            updated_tables = set(inspector.get_table_names())
            new_tables = updated_tables - existing_tables

            return existing_tables, new_tables

        # 使用 run_sync 执行同步函数
        existing_tables, new_tables = await conn.run_sync(sync_operations)

        print("Existing tables in database:", existing_tables)
        if new_tables:
            print("New tables created:", new_tables)
        else:
            print("No new tables were created. All tables already exist.")

    # 插入初始数据
    async with async_session() as session:
        await insert_initial_data(session)


async def insert_initial_data(session: AsyncSession):
    """
    异步插入初始用户和企业数据。
    """
    initial_users = [
        {"username": "rgt1", "password": "rgt1"},
        {"username": "rgt2", "password": "rgt2"}
    ]

    for user_data in initial_users:
        result = await session.execute(
            text("SELECT 1 FROM users_table WHERE username=:username"),
            {"username": user_data["username"]}
        )
        if not result.scalar():
            hashed_password = get_password_hash(user_data["password"])
            user = User(username=user_data["username"], hashed_password=hashed_password)
            session.add(user)

    initial_bizs = [
        {"biz_name": "biz1", "password": "biz1"},
        {"biz_name": "biz2", "password": "biz2"}
    ]

    for biz_data in initial_bizs:
        result = await session.execute(
            text("SELECT 1 FROM biz_table WHERE biz_name=:biz_name"),
           {"biz_name": biz_data["biz_name"]}
        )
        if not result.scalar():
            hashed_password = get_password_hash(biz_data["password"])
            biz = Biz(biz_name=biz_data["biz_name"], hashed_password=hashed_password)
            session.add(biz)

    await session.commit()
    print("Initial data inserted successfully.")
