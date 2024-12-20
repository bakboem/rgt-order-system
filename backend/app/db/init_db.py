from sqlalchemy.orm import Session
from sqlalchemy import inspect
from app.db.session import engine, SessionLocal
from app.models.models import User, Biz
from app.services.auth_service import get_password_hash

# 初始化数据库：创建表
def init_db():
    """
    初始化数据库，创建缺失的表并插入初始数据。
    """
    # 检查当前数据库中的表
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())  # 已有表
    print("Existing tables in database:", existing_tables)

    # 创建缺失的表
    from app.db.base import Base
    Base.metadata.create_all(bind=engine)

    # 再次检查数据库表，获取最新的表列表
    updated_tables = set(inspector.get_table_names())
    new_tables = updated_tables - existing_tables

    # 打印新创建的表
    if new_tables:
        print("New tables created:", new_tables)
    else:
        print("No new tables were created. All tables already exist.")

    # 插入初始数据
    with SessionLocal() as db:  # 确保会话管理正确
        insert_initial_data(db)

# 插入初始数据
def insert_initial_data(db: Session):
    """
    插入初始用户和企业数据。
    """
    # 初始用户数据
    initial_users = [
        {"username": "rgt1", "password": "rgt1"},
        {"username": "rgt2", "password": "rgt2"}
    ]

    # 检查并插入用户数据
    for user_data in initial_users:
        if not db.query(User).filter(User.username == user_data["username"]).first():
            hashed_password = get_password_hash(user_data["password"])
            user = User(username=user_data["username"], hashed_password=hashed_password)
            db.add(user)

    # 初始企业数据
    initial_bizs = [
        {"biz_name": "biz1", "password": "biz1"},
        {"biz_name": "biz2", "password": "biz2"}
    ]

    # 检查并插入企业数据
    for biz_data in initial_bizs:
        if not db.query(Biz).filter(Biz.biz_name == biz_data["biz_name"]).first():
            hashed_password = get_password_hash(biz_data["password"])
            biz = Biz(biz_name=biz_data["biz_name"], hashed_password=hashed_password)
            db.add(biz)

    # 提交数据
    db.commit()
    print("Initial data inserted successfully.")
