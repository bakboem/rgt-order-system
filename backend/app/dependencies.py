from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from app.core.config import SECRET_KEY, ALGORITHM
from app.models.models import User, Biz
from app.db.session import SessionLocal
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.schemas.schemas import UserToken, BizToken


# 为普通用户定义 OAuth2 端点
oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="/auth/login/user")

# 为企业用户定义 OAuth2 端点
oauth2_scheme_biz = OAuth2PasswordBearer(tokenUrl="/auth/login/biz")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 用户认证依赖
def get_current_user(token: str = Depends(oauth2_scheme_user), db: Session = Depends(get_db)) -> UserToken:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")
        if role != "user":
            raise HTTPException(status_code=403, detail="Unauthorized for this endpoint for User")
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # 确保返回的 UserToken 包含 name 字段
        return UserToken(id=user.id, name=user.username, role=role)  # name 应该是用户的用户名
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_biz_user(token: str = Depends(oauth2_scheme_biz), db: Session = Depends(get_db)) -> BizToken:
    try:
        print(f"Received token: {token}")  # 打印 token 用于调试
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload: {payload}")  # 打印解析后的 payload
        
        biz_name = payload.get("sub")
        role = payload.get("role")
        if role != "biz":
            raise HTTPException(status_code=403, detail="Unauthorized for this endpoint for Biz")
        biz = db.query(Biz).filter(Biz.biz_name == biz_name).first()
        if not biz:
            raise HTTPException(status_code=404, detail="Enterprise user not found")
        return BizToken(id=biz.id, biz_name=biz.biz_name, role=role)
    except JWTError as e:
        print(f"JWTError: {str(e)}")  # 打印异常信息
        raise HTTPException(status_code=401, detail="Invalid token")
