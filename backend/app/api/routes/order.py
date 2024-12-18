from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.models import Menu, Order,Instock ,Biz,User
from app.schemas.schemas import  OrderCreate,OrderResponse,OrderUpdate,MenuResponse, BizToken,UserToken
from app.dependencies import get_current_user, get_current_biz_user  # 普通用户认证依赖
from uuid import UUID
from app.services.socket_service import websocket_service
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

    # 填充每个订单的详细信息
    orders_with_details = []
    for order in orders:
        menu = db.query(Menu).filter(Menu.id == order.menu_id).first()
        biz = db.query(Biz).filter(Biz.id == order.biz_id).first()
        user = db.query(User).filter(User.id == order.user_id).first()

        if not menu or not biz or not user:
            raise HTTPException(status_code=404, detail="Missing related data")

        orders_with_details.append(
            OrderResponse(
                id=order.id,
                state=order.state,
                quantity=order.quantity,
                menu_id=order.menu_id,
                biz_id=order.biz_id,
                user_id=order.user_id,
                menu=MenuResponse(
                    id=menu.id,
                    name=menu.name,
                    price=menu.price,
                    stock=menu.instock.stock_quantity,  # 获取当前库存
                    image_url=menu.image_url,
                ),
                biz_name=biz.biz_name,
                user_name=user.username
            )
        )

    return orders_with_details

@router.get("/all/for/biz", response_model=list[OrderResponse])
def get_all_orders_for_biz(db: Session = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    biz_id = current_user.id
    orders = db.query(Order).filter(Order.biz_id == biz_id).all()  

    # 填充每个订单的详细信息
    orders_with_details = []
    for order in orders:
        menu = db.query(Menu).filter(Menu.id == order.menu_id).first()
        biz = db.query(Biz).filter(Biz.id == order.biz_id).first()
        user = db.query(User).filter(User.id == order.user_id).first()

        if not menu or not biz or not user:
            raise HTTPException(status_code=404, detail="Missing related data")

        orders_with_details.append(
            OrderResponse(
                id=order.id,
                state=order.state,
                quantity=order.quantity,
                menu_id=order.menu_id,
                biz_id=order.biz_id,
                user_id=order.user_id,
                menu=MenuResponse(
                    id=menu.id,
                    name=menu.name,
                    price=menu.price,
                    stock=menu.instock.stock_quantity,  # 获取当前库存
                    image_url=menu.image_url,
                ),
                biz_name=biz.biz_name,
                user_name=user.username
            )
        )

    return orders_with_details


@router.post("/add", response_model=dict)
def add_orders(orders: list[OrderCreate], db: Session = Depends(get_db), current_user: UserToken = Depends(get_current_user)):
    # 只保存订单，返回成功信息
    new_orders = []

    for order in orders:
        menu = db.query(Menu).filter(Menu.id == order.menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail=f"Menu with id {order.menu_id} not found")
        
        instock = db.query(Instock).filter(Instock.menu_id == order.menu_id).first()
        if not instock:
            raise HTTPException(status_code=404, detail=f"Instock information for menu {order.menu_id} not found")

        if instock.stock_quantity < order.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for menu id {order.menu_id}")

        # 创建订单
        new_order = Order(
            menu_id=order.menu_id, 
            quantity=order.quantity, 
            user_id=current_user.id, 
            biz_id=menu.biz_id
        )
        new_orders.append(new_order)

        # 更新库存
        instock.stock_quantity -= order.quantity

    db.add_all(new_orders)
    db.commit()

    return {"message": "success"}
@router.put("/update/{order_id}", response_model=OrderResponse)
async def update_order_status(order_id: UUID, order_update: OrderUpdate, db: Session = Depends(get_db)):
    """更新订单状态并返回更新后的订单信息"""
    
    # 查找订单
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 更新订单状态
    order.state = order_update.state  # 使用 `state` 而不是 `status`
    db.commit()

    # 获取菜单和用户信息
    menu = db.query(Menu).filter(Menu.id == order.menu_id).first()
    user = db.query(User).filter(User.id == order.user_id).first()

    if not menu or not user:
        raise HTTPException(status_code=404, detail="Menu or User not found")

    # 构建订单响应数据
    order_response = OrderResponse(
        id=order.id,
        state=order.state,
        quantity=order.quantity,
        menu_id=order.menu_id,
        biz_id=order.biz_id,
        user_id=order.user_id,
        menu=MenuResponse(
            id=menu.id,
            name=menu.name,
            image_url=menu.image_url,
            price=menu.price,
            stock=menu.instock.stock_quantity if menu.instock else 0
        ),
        biz_name=menu.biz.biz_name if menu.biz else None,
        user_name=user.username
    )

    # 广播订单更新通知给用户和企业
    await websocket_service.broadcast_user_order_update(order.user_id, f"Your order {order_id} is now {order_update.state}")
    await websocket_service.broadcast_biz_order_update(order.biz_id, f"Order {order_id} status updated to {order_update.state}")

    return order_response  # 返回更新后的订单数据

@router.delete("/delete/{order_id}", response_model=dict)
def delete_order(order_id: UUID, db: Session = Depends(get_db)):
    # 查询是否存在该订单
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail=f"Order with id {order_id} not found")
    
    # 删除订单
    db.delete(order)
    db.commit()

    return {"message": f"Order with id {order_id} has been successfully deleted."}