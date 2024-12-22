from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from app.core.config import SECRET_KEY, ALGORITHM
from app.models.models import User, Biz
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.schemas.schemas import UserToken, BizToken
from app.db.session import async_session

 
oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="/auth/login/user")

 
oauth2_scheme_biz = OAuth2PasswordBearer(tokenUrl="/auth/login/biz")

async def get_db():
    """
    获取异步数据库会话对象。
    """
    async with async_session() as db:
        yield db

 
async def get_current_user(token: str = Depends(oauth2_scheme_user), db: AsyncSession = Depends(get_db)) -> UserToken:
    """
    验证用户身份并返回用户信息。
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")
        if role != "user":
            raise HTTPException(status_code=403, detail="Unauthorized for this endpoint for User")

        
        result = await db.execute(select(User).filter(User.username == username))
        user = result.scalar_one_or_none()   

        if not user:
            raise HTTPException(status_code=404, detail="User not found")


        return UserToken(id=user.id, user_name=user.username, role=role)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

 
async def get_current_biz_user(token: str = Depends(oauth2_scheme_biz), db: AsyncSession = Depends(get_db)) -> BizToken:
 
    try:
        print(f"Received token: {token}")   
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload: {payload}")   

        biz_name = payload.get("sub")
        role = payload.get("role")
        if role != "biz":
            raise HTTPException(status_code=403, detail="Unauthorized for this endpoint for Biz")

  
        result = await db.execute(select(Biz).filter(Biz.biz_name == biz_name))
        biz = result.scalar_one_or_none()

        if not biz:
            raise HTTPException(status_code=404, detail="Enterprise user not found")

        return BizToken(id=biz.id, biz_name=biz.biz_name, role=role)
    except JWTError as e:
        print(f"JWTError: {str(e)}")  
        raise HTTPException(status_code=401, detail="Invalid token")
