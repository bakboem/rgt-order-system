from __future__ import annotations
from pydantic import BaseModel
from typing import Optional, Union
from uuid import UUID
# 登录请求模型
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
class UserToken(BaseModel):
    id: UUID
    name: str
    role: str

# 企业用户的 Token 模型
class BizToken(BaseModel):
    id: UUID
    biz_name: str
    role: str

# 创建订单
class OrderCreate(BaseModel):
    menu_id: UUID
    quantity: int

    class Config:
        orm_mode = True

# 更新菜单
class MenuUpdate(BaseModel):
    name: Optional[str]
    image_url: Optional[str]
    price: Optional[float]
    class Config:
        orm_mode = True

# 订单状态更新模型
class OrderUpdate(BaseModel):
    state: Optional[str]  # 订单状态：pending, accepted, completed 等

    class Config:
        orm_mode = True

# 创建菜单
class MenuCreate(BaseModel):
    name: str
    image_url: Optional[str]
    price: float
    stock: int  # 菜单初始库存
    class Config:
        orm_mode = True

# 新增库存模型
class InstockResponse(BaseModel):
    menu_id: UUID  # 外键：菜单 ID
    stock_quantity: int  # 库存数量

    class Config:
        orm_mode = True

class InstockUpdate(BaseModel):
    stock_quantity: int

    class Config:
        orm_mode = True


class MenuWithStock(BaseModel):
    id: UUID
    name: str
    image_url: Optional[str]
    price: float
    status : str
    stock: int  # Include the stock field in the response model

    class Config:
        orm_mode = True


class StockUpdateRequest(BaseModel):
    quantity: int
    class Config:
        orm_mode = True




# 菜单的响应模型
class MenuResponse(BaseModel):
    id: UUID
    name: str
    image_url: Optional[str] = None
    price: float
    class Config:
        orm_mode = True

class MenuMessage(BaseModel):
    id: UUID
    name: str
    image_url: Optional[str] = None
    price: float
    biz_id: UUID
    class Config:
        orm_mode = True

# 订单的响应模型
class OrderResponse(BaseModel):
    id: UUID
    state: str
    quantity: int
    menu_id: UUID
    biz_id: UUID
    user_id: UUID
    menu: Optional[MenuResponse]
    biz_name: Optional[str]
    user_name: Optional[str]

    class Config:
        orm_mode = True
class WebSocketMessage(BaseModel):
    type: str  # 消息类型，比如 'order_add', 'order_update', 'menu_update'
    data: Union["OrderResponse", "MenuMessage","InstockResponse"] 


