from pydantic import BaseModel
from typing import Optional
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

# 菜单的响应模型
class MenuResponse(BaseModel):
    id: UUID
    name: str
    image_url: Optional[str]
    price: float
    stock: int

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

# 返回菜单
class MenuResponse(MenuCreate):
    id: UUID

    class Config:
        orm_mode = True

# 返回订单
class OrderResponse(BaseModel):
    id: UUID
    state: str
    quantity: int
    menu_id: UUID  # 关联的菜单ID
    biz_id: UUID   # 关联的企业ID
    user_id: UUID  # 关联的用户ID

    menu: Optional[MenuResponse]  # 如果需要返回菜单的详细信息
    biz_name: Optional[str]  # 企业名称
    user_name: Optional[str]  # 用户名称

    class Config:
        orm_mode = True  # 确保支持 ORM 查询结果转换为响应模型

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