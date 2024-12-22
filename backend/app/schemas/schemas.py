from __future__ import annotations
from pydantic import BaseModel, ConfigDict
from typing import Optional, Union
from uuid import UUID

# 登录请求模型
class LoginRequest(BaseModel):
    username: str
    password: str

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str

    model_config = ConfigDict(from_attributes=True)

class UserToken(BaseModel):
    id: UUID
    user_name: str
    role: str

    model_config = ConfigDict(from_attributes=True)

# 企业用户的 Token 模型
class BizToken(BaseModel):
    id: UUID
    biz_name: str
    role: str

    model_config = ConfigDict(from_attributes=True)

# 创建订单
class OrderCreate(BaseModel):
    menu_id: UUID
    quantity: int

    model_config = ConfigDict(from_attributes=True)

# 更新菜单
class MenuUpdate(BaseModel):
    name: Optional[str]
    image_url: Optional[str]
    price: Optional[float]

    model_config = ConfigDict(from_attributes=True)

# 订单状态更新模型
class OrderUpdate(BaseModel):
    state: Optional[str]  # 订单状态：pending, accepted, completed 等

    model_config = ConfigDict(from_attributes=True)

# 创建菜单
class MenuCreate(BaseModel):
    name: str
    image_url: Optional[str]
    price: float
    stock: int  # 菜单初始库存

    model_config = ConfigDict(from_attributes=True)

# 新增库存模型
class InstockResponse(BaseModel):
    menu_id: UUID  # 外键：菜单 ID
    stock_quantity: int  # 库存数量

    model_config = ConfigDict(from_attributes=True)

class InstockUpdate(BaseModel):
    stock_quantity: int

    model_config = ConfigDict(from_attributes=True)

class MenuWithStock(BaseModel):
    id: UUID
    name: str
    image_url: Optional[str]
    price: float
    status: str
    stock: int  # Include the stock field in the response model

    model_config = ConfigDict(from_attributes=True)

class StockUpdateRequest(BaseModel):
    quantity: int

    model_config = ConfigDict(from_attributes=True)

class MenuResponse(BaseModel):
    id: UUID
    name: str
    image_url: Optional[str] = None
    price: float
    stock: int

    model_config = ConfigDict(from_attributes=True)

class MenuMessage(BaseModel):
    id: UUID
    name: str
    image_url: Optional[str] = None
    price: float
    biz_id: UUID

    model_config = ConfigDict(from_attributes=True)

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

    model_config = ConfigDict(from_attributes=True)

class WebSocketMessage(BaseModel):
    type: str
    data: Union[OrderResponse, MenuMessage, InstockResponse]

    model_config = ConfigDict(from_attributes=True)
