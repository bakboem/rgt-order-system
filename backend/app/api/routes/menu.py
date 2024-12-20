from operator import and_
from fastapi import APIRouter, Depends, HTTPException,Body
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session
from app.models.models import Instock, Menu,Order,SaleTracking
from app.schemas.schemas import MenuCreate,BizToken,InstockUpdate, MenuResponse, MenuUpdate,MenuWithStock,StockUpdateRequest
from app.dependencies import get_current_biz_user, get_current_user  
from uuid import UUID
from datetime import datetime
from fastapi import HTTPException
from app.messageQueue.producer import rabbitmq_producer
router = APIRouter()

async def get_db():
    """
    获取异步数据库会话对象。
    """
    async with async_session() as db:
        yield db

# 获取当前企业的所有菜单
@router.get("/all/for/biz", response_model=list[MenuWithStock])
async def get_all_menus(db: AsyncSession = Depends(get_db),current_user: BizToken = Depends(get_current_biz_user)):
    result =await  db.execute(
        select(Menu).filter(Menu.status == "available",current_user.id == Menu.biz_id)
    )
    menus = result.scalars().all()
    # Get stock for each menu from the Instock table
    response = []
    for menu in menus:
        stock_result = await db.execute(select(Instock).filter(Instock.menu_id == menu.id))
        stock = stock_result.scalar_one_or_none()
        response.append(MenuWithStock(
            id=menu.id,
            name=menu.name,
            image_url=menu.image_url,
            price=menu.price,
            status = menu.status,
            stock=stock.stock_quantity if stock else 0  # If no stock record, return 0
        ))
    return response

@router.get("/all/for/user", response_model=list[MenuWithStock])
async def get_all_menus(db: AsyncSession = Depends(get_db), current_user: BizToken = Depends(get_current_user)):
    result = await db.execute( select(Menu).filter(Menu.status == "available"))
    menus = result.scalars().all()

    response = []
    for menu in menus:
        stock_result = await db.execute(select(Instock).filter(Instock.menu_id == menu.id))
        stock = stock_result.scalar_one_or_none()
        response.append(MenuWithStock(
            id=menu.id,
            name=menu.name,
            image_url=menu.image_url,
            price=menu.price,
            status=menu.status,
            stock=stock.stock_quantity if stock else 0
        ))
    return response

@router.post("/add", response_model=MenuResponse)
async def add_menu(menu: MenuCreate, db: AsyncSession = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    result = await db.execute(select(Menu).filter(Menu.name == menu.name, Menu.biz_id == current_user.id))
    existing_menu = result.scalar_one_or_none()
    if existing_menu:
        raise HTTPException(status_code=400, detail=f"Menu with name '{menu.name}' already exists.")

    new_menu = Menu(name=menu.name, image_url=menu.image_url, price=menu.price, biz_id=current_user.id)
    db.add(new_menu)
    await db.commit()
    await db.refresh(new_menu)

    instock = Instock(menu_id=new_menu.id, stock_quantity=menu.stock)
    db.add(instock)
    await db.commit()
    await db.refresh(instock)
    
    # RabbitMQ 广播菜单新增消息
    message = {
        "type": "menu_add",
        "data": {
            "id": str(new_menu.id),
            "name": new_menu.name,
            "image_url": new_menu.image_url,
            "price": new_menu.price,
            "stock": instock.stock_quantity,
            "biz_id": str(new_menu.biz_id)
        }
    }
    await rabbitmq_producer.publish_message(routing_key="message", message=message)
    
    return MenuResponse(
        id=new_menu.id,
        name=new_menu.name,
        image_url=new_menu.image_url,
        price=new_menu.price,
        stock=instock.stock_quantity,
        status=new_menu.status
    )
# 更新菜单
@router.put("/update/{menu_id}", response_model=MenuUpdate)
async def update_menu(menu_id: UUID, menu: MenuUpdate, db: AsyncSession = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    # 查找菜单，确保菜单属于当前企业
    result = await db.execute(select(Menu).filter(Menu.id == menu_id, Menu.biz_id == current_user.id))
    existing_menu = result.scalars().first()
    if not existing_menu:
        raise HTTPException(status_code=404, detail="Menu not found or unauthorized to update")

    # 更新菜单信息
    for key, value in menu.model_dump(exclude_unset=True).items():
        setattr(existing_menu, key, value)

    await db.commit()
    await db.refresh(existing_menu)

    # RabbitMQ 广播菜单更新消息
    message = {
        "type": "menu_update",
        "data": {
            "id": str(existing_menu.id),
            "name": existing_menu.name,
            "image_url": existing_menu.image_url,
            "price": existing_menu.price,
            "biz_id": str(existing_menu.biz_id)
        }
    }
    await rabbitmq_producer.publish_message(routing_key="message", message=message)
    return existing_menu


@router.post("/update/stock/{menu_id}", response_model=InstockUpdate)
async def update_stock(
    menu_id: UUID,
    stock_update: StockUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: BizToken = Depends(get_current_biz_user),
):
    menu_result = await db.execute(select(Menu).filter(Menu.id == menu_id))
    menu = menu_result.scalar_one_or_none()
    if not menu:
        raise HTTPException(status_code=404, detail=f"Menu with id {menu_id} not found")
    
    if menu.biz_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this menu's stock")
    
    stock_result = await db.execute(select(Instock).filter(Instock.menu_id == menu_id))
    instock = stock_result.scalar_one_or_none()
    if not instock:
        raise HTTPException(status_code=404, detail=f"Instock record for menu {menu_id} not found")
    
    instock.stock_quantity += stock_update.quantity
    sale_record = SaleTracking(menu_id=menu.id, quantity=stock_update.quantity, timestamp=datetime.utcnow())
    db.add(sale_record)
    await db.commit()
    await db.refresh(instock)

  # RabbitMQ 广播库存更新消息
    message = {
        "type": "stock_update",
        "data": {
            "menu_id": str(menu.id),
            "new_stock": instock.stock_quantity,
            "biz_id": str(menu.biz_id)
        }
    }
    await rabbitmq_producer.publish_message(routing_key="message", message=message)
    return instock


@router.get("/{menu_id}/stock", response_model=int)
async def get_stock_by_menu(menu_id: UUID, db: AsyncSession = Depends(get_db)):
    # 查询库存表，找到与菜单对应的库存
    result = await db.execute(select(Instock).filter(Instock.menu_id == menu_id))
    instock = result.scalars().first()
    if instock is None:
        raise HTTPException(status_code=404, detail="Stock information not found for this menu")
    
    # 返回库存数量
    return instock.stock_quantity


@router.delete("/delete/{menu_id}", response_model=dict)
async def delete_menu(menu_id: UUID, db: AsyncSession = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    # 查询菜单
    result = await db.execute(select(Menu).filter(Menu.id == menu_id))
    menu = result.scalars().first()
    if not menu:
        raise HTTPException(status_code=404, detail=f"Menu with id {menu_id} not found")
    
    # 检查当前用户是否是该菜单的拥有者
    if menu.biz_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this menu")
    
    # 检查是否有任何状态为 "pending" 的订单
    result = await db.execute(
        select(Order).filter(Order.id == menu_id,Order.state == "pending")
    )
    pending_orders = result.scalars().all()
    if pending_orders:
        raise HTTPException(status_code=400, detail=f"Cannot deactivate menu with id {menu_id} because there are pending orders")

    # 将菜单状态设置为不可用（"unavailable"）
    menu.status = "unavailable"
    await db.commit()

    return {"message": f"Menu with id {menu_id} has been successfully deactivated."}
