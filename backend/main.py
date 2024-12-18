from fastapi import FastAPI
from sqlalchemy import inspect
from app.db.session import engine,SessionLocal, Base  # 导入 Base 和 engine
from app.models.models import User, Biz,Menu, Order  # 导入所有模型类
from app.api.routes.auth import router as auth_router
from app.api.routes.menu import router as menu_router
from app.api.routes.order import router as order_router
from app.services.auth_service import get_password_hash
app = FastAPI(title="RGT Order System")

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(menu_router, prefix="/menu", tags=["Menu"])
app.include_router(order_router, prefix="/order", tags=["Order"])


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
    print("Inserting initial data (if not exists)...")
    insert_initial_data()


def insert_initial_data():
    db = SessionLocal()
    try:
        # 检查并添加两个用户
        if not db.query(User).filter_by(username="rgt1").first():
            rgt1 = User(username="rgt1", hashed_password= get_password_hash("rgt1"))
            db.add(rgt1)
        if not db.query(User).filter_by(username="rgt2").first():
            rgt2 = User(username="rgt2", hashed_password=get_password_hash("rgt2"))
            db.add(rgt2)

        # 检查并添加两个企业用户
        if not db.query(Biz).filter_by(biz_name="biz1").first():
            biz1 = Biz(
                biz_name="biz1", hashed_password=get_password_hash("biz1")
            )
            db.add(biz1)
        if not db.query(Biz).filter_by(biz_name="biz2").first():
            biz2 =  Biz(
                biz_name="biz2", hashed_password=get_password_hash("biz2")
            )
            db.add(biz2)

        # 提交数据
        db.commit()
        print("Initial data inserted successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error inserting initial data: {e}")
    finally:
        db.close()


# 初始化数据库
init_db()


@app.get("/")
def read_root():
    return {"message": "Welcome to RGT Order System"}
