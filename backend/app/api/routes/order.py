from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.models import Menu, Order
from app.schemas.schemas import  OrderCreate,OrderResponse,OrderUpdate,Instock,BizToken,UserToken
from app.dependencies import get_current_user, get_current_biz_user  # 普通用户认证依赖

router = APIRouter()

# 依赖注入：获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 获取当前用户所有的订单
@router.get("/all/for/user", response_model=list[OrderResponse])
def get_all_orders_for_user(db: Session = Depends(get_db), current_user: UserToken = Depends(get_current_user)):
    user_id = current_user.id
    orders = db.query(Order).filter(Order.user_id == user_id, Order.state != "completed").all()  
    return orders

# 获取企业所有菜单的订单
@router.get("/all/for/biz", response_model=list[OrderResponse])
def get_all_orders_for_biz(db: Session = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    biz_id = current_user.id
    orders = db.query(Order).filter(Order.biz_id == biz_id).all()  
    return orders

# 用户批量添加订单
@router.post("/add")
def add_orders(orders: list[OrderCreate], db: Session = Depends(get_db), current_user: UserToken = Depends(get_current_user)):
    new_orders = []
    for order in orders:
        menu = db.query(Menu).filter(Menu.id == order.menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail=f"Menu with id {order.menu_id} not found")
        
        # 获取库存信息
        instock = db.query(Instock).filter(Instock.menu_id == order.menu_id).first()
        if not instock:
            raise HTTPException(status_code=404, detail=f"Instock information for menu {order.menu_id} not found")

        # 检查库存是否足够
        if instock.stock_quantity < order.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for menu id {order.menu_id}")

        # 创建订单
        new_order = Order(menu_id=order.menu_id, quantity=order.quantity, user_id=current_user.id, biz_id=menu.biz_id)
        new_orders.append(new_order)

        # 更新库存
        instock.stock_quantity -= order.quantity  # 减少库存

    db.add_all(new_orders)  # 添加所有新订单
    db.commit()  # 提交到数据库
    return {"message": "Orders placed successfully", "orders": [order.id for order in new_orders]}

# 企业用户更新订单状态
@router.put("/update/{order_id}", response_model=OrderResponse)
def update_order_status(order_id: int, order_update: OrderUpdate, db: Session = Depends(get_db), current_user: UserToken = Depends(get_current_biz_user)):
    # 只允许企业用户更新订单状态
    biz_id = current_user.id  # 获取当前企业用户的ID
    
    # 查找指定的订单
    order = db.query(Order).filter(Order.id == order_id, Order.biz_id == biz_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or does not belong to your business")
    
    # 更新订单状态
    if order_update.state:
        order.state = order_update.state
    
    db.commit()
    db.refresh(order)
    
    return order