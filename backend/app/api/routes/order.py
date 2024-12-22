import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, select
from app.db.session import async_session
from app.models.models import Menu, Order,Instock ,User
from app.schemas.schemas import  OrderCreate,OrderResponse,OrderUpdate,MenuResponse, BizToken,UserToken, WebSocketMessage
from app.dependencies import get_current_user, get_current_biz_user  # 普通用户认证依赖
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from app.messageQueue.producer import rabbitmq_producer
router = APIRouter()

async def get_db():
    async with async_session() as db:
        yield db

@router.get("/all/for/user", response_model=list[OrderResponse])
async def get_all_orders_for_user(db: AsyncSession = Depends(get_db), current_user: UserToken = Depends(get_current_user)):
    user_id = current_user.id
    result = await db.execute(
        select(Order)
        .filter(Order.user_id == user_id, Order.state != "completed")
        .options(
            joinedload(Order.menu).joinedload(Menu.instock),  
            joinedload(Order.biz),                           
            joinedload(Order.user)                           
        ).order_by(desc(Order.created_at))
    )
    orders = result.scalars().all()

    orders_with_details = [
        OrderResponse(
            id=order.id,
            state=order.state,
            quantity=order.quantity,
            menu_id=order.menu_id,
            biz_id=order.biz_id,
            user_id=order.user_id,
            menu=MenuResponse(
                id=order.menu.id,
                name=order.menu.name,
                price=order.menu.price,
                stock=order.menu.instock.stock_quantity,  # 获取当前库存
                image_url=order.menu.image_url
            ),
            biz_name=order.biz.biz_name,
            user_name=order.user.username
        )
         for order in orders
    ]
  

    return orders_with_details

@router.get("/all/for/biz", response_model=list[OrderResponse])
async def get_all_orders_for_biz(db: AsyncSession = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    biz_id = current_user.id
    
    result = await db.execute(
        select(Order)
        .filter(Order.biz_id == biz_id)
        .options(
            joinedload(Order.menu).joinedload(Menu.instock),  # 预加载菜单和库存
            joinedload(Order.biz),                           # 预加载商家信息
            joinedload(Order.user)                           # 预加载用户信息
        ).order_by(desc(Order.created_at))
    )
    orders = result.scalars().all()
    
    if not orders:
        return []
    
    orders_with_details = [
        OrderResponse(
            id=order.id,
            state=order.state,
            quantity=order.quantity,
            menu_id=order.menu_id,
            biz_id=order.biz_id,
            user_id=order.user_id,
            menu=MenuResponse(
                id=order.menu.id,
                name=order.menu.name,
                price=order.menu.price,
                stock=order.menu.instock.stock_quantity,  # 获取当前库存
                image_url=order.menu.image_url
            ),
            biz_name=order.biz.biz_name,
            user_name=order.user.username
        )
        for order in orders
    ]
    return orders_with_details


@router.post("/add/order", response_model=dict)
async def add_orders(
    orders: list[OrderCreate],
    db: AsyncSession = Depends(get_db),
    current_user: UserToken = Depends(get_current_user),
):
    new_orders = []

    for order in orders:
        result = await db.execute(select(Menu).filter(Menu.id == order.menu_id))
        menu = result.scalar_one_or_none()
        if not menu:
            raise HTTPException(status_code=404, detail=f"Menu with id {order.menu_id} not found")
        
        result = await db.execute(select(Instock).filter(Instock.menu_id == order.menu_id))
        instock = result.scalar_one_or_none()
        if not instock:
            raise HTTPException(status_code=404, detail=f"Instock information for menu {order.menu_id} not found")

        if instock.stock_quantity < order.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for menu id {order.menu_id}")

        new_order = Order(
            menu_id=order.menu_id, 
            quantity=order.quantity, 
            user_id=current_user.id, 
            biz_id=menu.biz_id
        )
        new_orders.append(new_order)

        instock.stock_quantity -= order.quantity

    db.add_all(new_orders)
    await db.commit()

    order_responses = []
    for new_order in new_orders:
        item = {
            "id":str(new_order.id),
            "state":new_order.state,
            "quantity":new_order.quantity,
            "menu_id":str(new_order.menu_id),
            "biz_id":str(new_order.biz_id),
            "user_id":str(new_order.user_id),
            "menu":{
                "id":str(menu.id),
                "name":menu.name,
                "price":menu.price,
                "stock":instock.stock_quantity,
                "image_url":menu.image_url,
            },
            "biz_name":None,  
            "user_name":current_user.user_name
        }
        order_responses.append(item)

    message = {
        "type":"order_add",
        "data":order_responses
    }

    await rabbitmq_producer.publish_message(
        routing_key="orders",
        message=message
    )
    
    return {"message": "success"}

@router.put("/update/{order_id}", response_model=OrderResponse)
async def update_order_status(
    order_id: UUID,
    order_update: OrderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: BizToken = Depends(get_current_biz_user),
):
    async with db.begin():  
        result = await db.execute(
            select(Order)
            .filter(Order.id == order_id)
            .options(
                joinedload(Order.menu).joinedload(Menu.instock), 
                joinedload(Order.biz),                          
                joinedload(Order.user)                          
            )
        )
        order = result.scalar_one_or_none()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.biz_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized to update this order")

        order.state = order_update.state
        await db.flush()  

        order_response = OrderResponse(
            id=order.id,
            state=order.state,
            quantity=order.quantity,
            menu_id=order.menu_id,
            biz_id=order.biz_id,
            user_id=order.user_id,
            menu=MenuResponse(
                id=order.menu.id,
                name=order.menu.name,
                image_url=order.menu.image_url,
                price=order.menu.price,
                stock=order.menu.instock.stock_quantity if order.menu.instock else 0,
            ),
            biz_name=order.biz.biz_name,
            user_name=order.user.username,
        )

        message = {
            "type": "order_update",
            "data": [
                {
                "order_id": str(order.id),
                "state": order.state,
                "user_id": str(order.user_id),
                "biz_id": str(order.biz_id),
            },
            ]
        }

        await rabbitmq_producer.publish_message(
            routing_key="orders",
            message=message
        )

    return order_response


@router.delete("/delete/{order_id}", response_model=dict)
async def delete_order(order_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order)
        .options(
            joinedload(Order.menu),
            joinedload(Order.biz),
            joinedload(Order.user),
        )
        .filter(Order.id == order_id)
    )
    order = result.scalars().first()

    if not order:
        raise HTTPException(status_code=404, detail=f"Order with id {order_id} not found")

    # 准备广播消息的数据
    order_response = {
        "id": str(order.id),
        "state": order.state,
        "quantity": order.quantity,
        "menu_id": str(order.menu_id),
        "biz_id": str(order.biz_id),
        "user_id": str(order.user_id),
        "menu": {
            "id": str(order.menu.id) if order.menu else None,
            "name": order.menu.name if order.menu else None,
            "image_url": order.menu.image_url if order.menu else None,
            "price": order.menu.price if order.menu else None,
        },
        "biz_name": order.biz.biz_name if order.biz else None,
        "user_name": order.user.username if order.user else None,
    }

    # 删除订单
    await db.delete(order)
    await db.commit()

    # 准备 RabbitMQ 消息
    message = {
        "type": "order_delete",
        "data": [order_response]
    }

    # 通过 RabbitMQ 广播消息
    await rabbitmq_producer.publish_message(
        routing_key="orders",
        message=message
    )

    return {"message": f"Order with id {order_id} has been successfully deleted."}