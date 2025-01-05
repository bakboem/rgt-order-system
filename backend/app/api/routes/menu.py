from operator import and_
from fastapi import APIRouter, Depends, HTTPException,Body
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session
from app.models.models import Instock, Menu,Order,SaleTracking
from app.schemas.schemas import MenuCreate,BizToken,InstockUpdate, MenuResponse, MenuUpdate,MenuWithStock,StockUpdateRequest
from app.dependencies import get_current_biz_user, get_current_user  
from uuid import UUID
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import joinedload
from app.messageQueue.producer import rabbitmq_producer
router = APIRouter()

async def get_db():
    async with async_session() as db:
        yield db

@router.get("/all/for/biz", response_model=list[MenuWithStock])
async def get_all_menus(db: AsyncSession = Depends(get_db),current_user: BizToken = Depends(get_current_biz_user)):
    result =await  db.execute(
        select(Menu).filter(Menu.status == "available",current_user.id == Menu.biz_id).order_by(desc(Menu.created_at))
    )
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
            status = menu.status,
            stock=stock.stock_quantity if stock else 0  # If no stock record, return 0
        ))
    return response

@router.get("/all/for/user", response_model=list[MenuWithStock])
async def get_all_menus(db: AsyncSession = Depends(get_db), current_user: BizToken = Depends(get_current_user)):
    result = await db.execute( select(Menu).filter(Menu.status == "available").order_by(desc(Menu.created_at)))
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
@router.post('/add/menu', response_model=MenuResponse)
async def add_menu(menu: MenuCreate, db: AsyncSession = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    async with db.begin():  # 使用事务上下文管理
        result = await db.execute(select(Menu).filter(Menu.name == menu.name, Menu.biz_id == current_user.id))
        existing_menu = result.scalar_one_or_none()
        if existing_menu:
            raise HTTPException(status_code=400, detail=f"Menu with name '{menu.name}' already exists.")

        # 添加新菜单
        new_menu = Menu(name=menu.name, image_url=menu.image_url, price=menu.price, biz_id=current_user.id)
        db.add(new_menu)
        await db.flush()  # 将数据持久化但不提交，获取 `new_menu.id`

        # 添加库存记录
        instock = Instock(menu_id=new_menu.id, stock_quantity=menu.stock)
        db.add(instock)
        await db.flush()  # 确保 instock.id 可用

        # 构建消息
        message = {
            "type": "menu_add",
            "data": [
                {
                    "id": str(new_menu.id),
                    "name": new_menu.name,
                    "image_url": new_menu.image_url,
                    "price": new_menu.price,
                    "biz_id": str(new_menu.biz_id),
                    "stock": instock.stock_quantity
                }
            ]
        }
    
    # 事务外发布消息
    try:
        await rabbitmq_producer.publish_message(
            routing_key="orders",
            message=message
        )
    except Exception as e:
        logger.error(f"Failed to publish RabbitMQ message: {e}")
        raise HTTPException(status_code=500, detail="Failed to publish message.")
    
    # 返回响应
    return MenuResponse(
        id=new_menu.id,
        name=new_menu.name,
        image_url=new_menu.image_url,
        price=new_menu.price,
        stock=instock.stock_quantity,
        status=new_menu.status,
        biz_id=new_menu.biz_id
    )

@router.put("/update/{menu_id}", response_model=MenuUpdate)
async def update_menu(menu_id: UUID, menu: MenuUpdate, db: AsyncSession = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    result = await db.execute(select(Menu).filter(Menu.id == menu_id, Menu.biz_id == current_user.id))
    existing_menu = result.scalars().first()
    if not existing_menu:
        raise HTTPException(status_code=404, detail="Menu not found or unauthorized to update")

    for key, value in menu.model_dump(exclude_unset=True).items():
        setattr(existing_menu, key, value)

    await db.commit()
    await db.refresh(existing_menu)

    message = {
        "type":"menu_update",
        "data":[
             {
            "id": str(existing_menu.id),
            "name":existing_menu.name,
            "image_url":existing_menu.image_url,
            "price":existing_menu.price,
            "biz_id":str(existing_menu.biz_id),
            "instock":existing_menu.stock_quantity if hasattr(existing_menu, 'stock_quantity') else None
           }
        ]
    }
    await rabbitmq_producer.publish_message(
        routing_key="orders",
        message=message
    )
    return existing_menu


@router.post("/update/stock/{menu_id}", response_model=InstockUpdate)
async def update_stock(
    menu_id: UUID,
    stock_update: StockUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: BizToken = Depends(get_current_biz_user),
):
    menu_result = await db.execute(select(Menu).options(joinedload(Menu.instock)).filter(Menu.id == menu_id))
    menu = menu_result.scalar_one_or_none()
    if not menu:
        raise HTTPException(status_code=404, detail=f"Menu with id {menu_id} not found")

    if menu.biz_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this menu's stock")

    instock_result = await db.execute(select(Instock).filter(Instock.menu_id == menu_id))
    instock = instock_result.scalar_one_or_none()
    if not instock:
        raise HTTPException(status_code=404, detail=f"Instock record for menu {menu_id} not found")

    instock.stock_quantity += stock_update.quantity
    sale_record = SaleTracking(menu_id=menu.id, quantity=stock_update.quantity, timestamp=datetime.utcnow())
    db.add(sale_record)
    await db.commit()
    await db.refresh(instock)


    message = {
        "type": "stock_update",
        "data": [
            {
                "menu_id": str(menu.id),
                "new_stock": instock.stock_quantity,
                "biz_id": str(menu.biz_id)
            }
        ]
    }
    await rabbitmq_producer.publish_message(
        routing_key="orders",
        message=message
    )
    return instock


@router.get("/{menu_id}/stock", response_model=int)
async def get_stock_by_menu(menu_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Instock).filter(Instock.menu_id == menu_id))
    instock = result.scalars().first()
    if instock is None:
        raise HTTPException(status_code=404, detail="Stock information not found for this menu")
    
    return instock.stock_quantity

@router.delete("/delete/{menu_id}", response_model=dict)
async def delete_menu(
    menu_id: UUID, 
    db: AsyncSession = Depends(get_db), 
    current_user: BizToken = Depends(get_current_biz_user)
):
    try:
        # 查询菜单
        result = await db.execute(select(Menu).filter(Menu.id == menu_id))
        menu = result.scalars().first()
        if not menu:
            raise HTTPException(status_code=404, detail=f"Menu with id {menu_id} not found")

        # 权限验证
        if menu.biz_id != current_user.id:
            raise HTTPException(status_code=403, detail="You are not authorized to delete this menu")

        # 检查是否有待处理订单
        result = await db.execute(
            select(Order).filter(Order.id == menu_id, Order.state == "pending")
        )
        pending_orders = result.scalars().all()
        if pending_orders:
            raise HTTPException(status_code=400, detail=f"Cannot deactivate menu with id {menu_id} because there are pending orders")

        # 更新菜单状态
        menu.status = "unavailable"
        await db.commit()

        # 发布消息到 RabbitMQ
        message = {
            "type": "menu_delete",
            "data": [
                {
                    "menu_id": str(menu.id),
                    "biz_id": str(menu.biz_id)
                }
            ]
        }
        try:
            await rabbitmq_producer.publish_message(
                routing_key="orders",
                message=message
            )
        except Exception as e:
            logger.error(f"Failed to publish message to RabbitMQ: {e}")
            # 记录异常但不回滚数据库
            return {"message": f"Menu with id {menu_id} deactivated, but message was not published."}

        return {"message": f"Menu with id {menu_id} has been successfully deactivated."}

    except HTTPException as http_exc:
        # 捕获并抛出 HTTP 异常
        raise http_exc
    except Exception as e:
        # 捕获其他异常，确保数据库事务正确回滚
        logger.error(f"Error deleting menu: {e}")
        await db.rollback()  # 显式回滚事务
        raise HTTPException(status_code=500, detail="An internal error occurred while deleting the menu.")
