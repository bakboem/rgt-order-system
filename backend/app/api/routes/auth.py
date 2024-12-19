from fastapi import APIRouter, Depends, HTTPException
from jose import JWTError
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.dependencies import get_current_biz_user, get_current_user
from app.models.models import User, Biz
from app.services.auth_service import verify_password, create_access_token
from app.schemas.schemas import BizToken, LoginRequest, Token, UserToken
from datetime import timedelta

router = APIRouter()

# 依赖注入：获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 用户登录
@router.post("/login/user", response_model=Token)
def user_login(login: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login.username).first()
    if not user or not verify_password(login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username,"role": "user"}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token}

# 企业用户登录
@router.post("/login/biz", response_model=Token)
def biz_login(login: LoginRequest, db: Session = Depends(get_db)):
    biz = db.query(Biz).filter(Biz.biz_name == login.username).first()
    if not biz or not verify_password(login.password, biz.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": biz.biz_name,"role": "biz"}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token}

@router.get("/user/info", response_model=UserToken)
def get_user_info(user: UserToken = Depends(get_current_user)):
    return user

@router.get("/biz/info", response_model=BizToken)
def get_biz_info(biz: BizToken = Depends(get_current_biz_user)):
    return biz