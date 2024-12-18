from sqlalchemy.orm import Session
from sqlalchemy import inspect
from app.db.session import Base, engine, SessionLocal
from app.models.models import User, Biz
from app.services.auth_service import get_password_hash

# 初始化数据库：创建表
def init_db():
    # 检查当前数据库中的表
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())  # 已有表
    print("Existing tables in database:", existing_tables)

    # 调用 create_all 创建缺失的表
    print("Creating missing tables...")
    Base.metadata.create_all(bind=engine)

    # 再次检查数据库表，获取最新的表列表
    updated_tables = set(inspector.get_table_names())

    # 计算新创建的表
    new_tables = updated_tables - existing_tables
    if new_tables:
        print("New tables created:", new_tables)
    else:
        print("No new tables were created. All tables already exist.")

    # 插入初始数据
    with SessionLocal() as db:  # 确保会话管理正确
        insert_initial_data(db)
# 插入初始数据
def insert_initial_data(db: Session):
    # 检查是否已有用户数据
    if not db.query(User).first():
        hashed_password = get_password_hash("rgt1")
        user = User(username="rgt1", hashed_password=hashed_password)
        db.add(user)
    if not db.query(User).first():
        hashed_password = get_password_hash("rgt2")
        user = User(username="rgt2", hashed_password=hashed_password)
        db.add(user)

    # 检查是否已有企业数据
    if not db.query(Biz).first():
        hashed_password = get_password_hash("biz1")
        biz = Biz(biz_name="biz1", hashed_password=hashed_password)
        db.add(biz)
    if not db.query(Biz).first():
        hashed_password = get_password_hash("biz2")
        biz = Biz(biz_name="biz2", hashed_password=hashed_password)
        db.add(biz)
    db.commit()
