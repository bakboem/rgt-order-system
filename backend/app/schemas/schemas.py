from pydantic import BaseModel
from typing import Optional
# 登录请求模型
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    
class UserToken(BaseModel):
    id: int
    name: str
    role: str

# 企业用户的 Token 模型
class BizToken(BaseModel):
    id: int
    biz_name: str
    role: str

# 创建菜单
class MenuCreate(BaseModel):
    name: str
    image_url: Optional[str]
    price: float
    stock: int

    class Config:
        orm_mode = True

# 更新菜单
class MenuUpdate(BaseModel):
    name: Optional[str]
    image_url: Optional[str]
    price: Optional[float]
    stock: Optional[int]

# 返回菜单
class MenuResponse(MenuCreate):
    id: int

# 创建订单
class OrderCreate(BaseModel):
    menu_id: int
    quantity: int

    class Config:
        orm_mode = True