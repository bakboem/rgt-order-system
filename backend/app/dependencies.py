from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from app.core.config import SECRET_KEY, ALGORITHM
from app.models.models import User, Biz
from app.db.session import SessionLocal
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.schemas.schemas import UserToken, BizToken


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 普通用户认证依赖
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserToken:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")
        if role != "user":
            raise HTTPException(status_code=403, detail="Unauthorized for this endpoint")
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserToken(id=user.id, username=user.username, role=role)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# 企业用户认证依赖
def get_current_biz_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> BizToken:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        biz_name = payload.get("sub")
        role = payload.get("role")
        if role != "biz":
            raise HTTPException(status_code=403, detail="Unauthorized for this endpoint for Biz")
        biz = db.query(Biz).filter(Biz.biz_name == biz_name).first()
        if not biz:
            raise HTTPException(status_code=404, detail="Enterprise user not found")
        return BizToken(id=biz.id, biz_name=biz.biz_name, role=role)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")