from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.models import Instock, Menu
from app.schemas.schemas import MenuCreate, MenuUpdate,BizToken,InstockUpdate, MenuResponse,MenuWithStock
from app.dependencies import get_current_biz_user  
from uuid import UUID
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 获取当前企业的所有菜单
@router.get("/all", response_model=list[MenuWithStock])
def get_all_menus(db: Session = Depends(get_db)):
    menus = db.query(Menu).all()
    # Get stock for each menu from the Instock table
    response = []
    for menu in menus:
        stock = db.query(Instock).filter(Instock.menu_id == menu.id).first()
        response.append(MenuWithStock(
            id=menu.id,
            name=menu.name,
            image_url=menu.image_url,
            price=menu.price,
            stock=stock.stock_quantity if stock else 0  # If no stock record, return 0
        ))
    return response

# 添加新菜单
from fastapi import HTTPException

@router.post("/add", response_model=MenuResponse)
def add_menu(menu: MenuCreate, db: Session = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    # Check if the menu with the same name already exists for the current user
    existing_menu = db.query(Menu).filter(Menu.name == menu.name, Menu.biz_id == current_user.id).first()
    if existing_menu:
        raise HTTPException(status_code=400, detail=f"Menu with name '{menu.name}' already exists.")

    # Create the new menu and add it to the database
    new_menu = Menu(name=menu.name, image_url=menu.image_url, price=menu.price, biz_id=current_user.id)
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)

    # Create the corresponding stock record and store it in the Instock table
    instock = Instock(menu_id=new_menu.id, stock_quantity=menu.stock)  # Save the stock quantity in the Instock table
    db.add(instock)
    db.commit()

    db.refresh(instock)

    # Return the new menu along with the stock
    return MenuResponse(
        id=new_menu.id,
        name=new_menu.name,
        image_url=new_menu.image_url,
        price=new_menu.price,
        stock=instock.stock_quantity
    )


# 更新菜单
@router.put("/update/{menu_id}", response_model=MenuUpdate)
def update_menu(menu_id: UUID, menu: MenuUpdate, db: Session = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    # 查找菜单，确保菜单属于当前企业
    existing_menu = db.query(Menu).filter(Menu.id == menu_id, Menu.biz_id == current_user.id).first()
    if not existing_menu:
        raise HTTPException(status_code=404, detail="Menu not found or unauthorized to update")

    # 更新菜单信息
    for key, value in menu.model_dump(exclude_unset=True).items():
        setattr(existing_menu, key, value)

    db.commit()
    db.refresh(existing_menu)
    return existing_menu



@router.put("/setStock/{menu_id}", response_model=InstockUpdate)
def set_stock(menu_id: UUID, stock_data: InstockUpdate, db: Session = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    # 查找菜单的库存记录，确保是当前企业用户管理的菜单
    instock = db.query(Instock).filter(Instock.menu_id == menu_id).first()
    
    if not instock:
        raise HTTPException(status_code=404, detail="Stock information not found for menu id")

    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if menu.biz_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to update stock for this menu")

    # 更新库存数量
    instock.stock_quantity = stock_data.stock_quantity
    db.commit()
    db.refresh(instock)
    return instock

@router.get("/{menu_id}/stock", response_model=int)
def get_stock_by_menu(menu_id: UUID, db: Session = Depends(get_db)):
    # 查询库存表，找到与菜单对应的库存
    instock = db.query(Instock).filter(Instock.menu_id == menu_id).first()
    
    if instock is None:
        raise HTTPException(status_code=404, detail="Stock information not found for this menu")
    
    # 返回库存数量
    return instock.stock_quantity