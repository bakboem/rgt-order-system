from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.models import Menu, Order
from app.schemas.schemas import MenuCreate, MenuUpdate, OrderCreate
from app.dependencies import get_current_biz_user  # 企业用户认证依赖

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/all", response_model=list[MenuCreate])
def get_all_menus(db: Session = Depends(get_db), current_user: dict = Depends(get_current_biz_user)):
    menus = db.query(Menu).filter(Menu.biz_id == current_user["id"]).all()
    return menus


@router.post("/add", response_model=MenuCreate)
def add_menu(menu: MenuCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_biz_user)):
    new_menu = Menu(**menu.dict(), biz_id=current_user["id"])
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)
    return new_menu


@router.put("/menu/update/{menu_id}", response_model=MenuCreate)
def update_menu(menu_id: int, menu: MenuUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_biz_user)):
    existing_menu = db.query(Menu).filter(Menu.id == menu_id, Menu.biz_id == current_user["id"]).first()
    if not existing_menu:
        raise HTTPException(status_code=404, detail="Menu not found")

    for key, value in menu.dict(exclude_unset=True).items():
        setattr(existing_menu, key, value)
    db.commit()
    db.refresh(existing_menu)
    return existing_menu
