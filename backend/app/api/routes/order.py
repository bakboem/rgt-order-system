from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.models import Menu, Order
from app.schemas.schemas import MenuResponse, OrderCreate
from app.dependencies import get_current_user  # 普通用户认证依赖

router = APIRouter()

# 依赖注入：获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 用户获取所有菜单
@router.get("/all", response_model=list[MenuResponse])
def get_all_menus(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    menus = db.query(Menu).all()
    return menus

# 用户批量添加订单
@router.post("/add")
def add_orders(orders: list[OrderCreate], db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    new_orders = []
    for order in orders:
        menu = db.query(Menu).filter(Menu.id == order.menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail=f"Menu with id {order.menu_id} not found")
        if menu.stock < order.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for menu id {order.menu_id}")

        # 创建订单
        new_order = Order(**order.dict(), user_id=current_user["id"], biz_id=menu.biz_id)
        new_orders.append(new_order)

        # 更新库存
        menu.stock -= order.quantity

    db.add_all(new_orders)
    db.commit()
    return {"message": "Orders placed successfully", "orders": [order.id for order in new_orders]}
