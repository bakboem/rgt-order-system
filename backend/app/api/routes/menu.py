from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.models import Menu, Instock
from app.schemas.schemas import MenuCreate, MenuUpdate, InstockUpdate,BizToken
from app.dependencies import get_current_biz_user  

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 获取当前企业的所有菜单
@router.get("/all", response_model=list[MenuCreate])
def get_all_menus(db: Session = Depends(get_db), current_user:BizToken  = Depends(get_current_biz_user)):
    menus = db.query(Menu).filter(Menu.biz_id == current_user.id).all()
    return menus

# 添加新菜单
@router.post("/add", response_model=MenuCreate)
def add_menu(menu: MenuCreate, db: Session = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    existing_menu = db.query(Menu).filter( Menu.biz_id == current_user.id).first()
    if not existing_menu:
        raise HTTPException(status_code=404, detail="Menu not found or unauthorized to update")
    # 创建菜单并添加到数据库
    new_menu = Menu(**menu.dict(), biz_id=current_user.id)
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)

    # 创建相应的库存记录
    instock = Instock(menu_id=new_menu.id, stock_quantity=menu.stock)
    db.add(instock)
    db.commit()

    db.refresh(instock)
    return new_menu

# 更新菜单
@router.put("/menu/update/{menu_id}", response_model=MenuUpdate)
def update_menu(menu_id: int, menu: MenuUpdate, db: Session = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
    # 查找菜单，确保菜单属于当前企业
    existing_menu = db.query(Menu).filter(Menu.id == menu_id, Menu.biz_id == current_user.id).first()
    if not existing_menu:
        raise HTTPException(status_code=404, detail="Menu not found or unauthorized to update")

    # 更新菜单信息
    for key, value in menu.dict(exclude_unset=True).items():
        setattr(existing_menu, key, value)

    db.commit()
    db.refresh(existing_menu)
    return existing_menu



@router.put("/setStock/{menu_id}", response_model=InstockUpdate)
def set_stock(menu_id: int, stock_data: InstockUpdate, db: Session = Depends(get_db), current_user: BizToken = Depends(get_current_biz_user)):
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
