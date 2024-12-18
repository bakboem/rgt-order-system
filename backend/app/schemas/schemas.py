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


# 菜单的响应模型
class MenuResponse(BaseModel):
    id: int
    name: str
    image_url: Optional[str]
    price: float
    stock: int

    class Config:
        orm_mode = True

# 订单的响应模型
class OrderResponse(BaseModel):
    id: int
    state: str
    quantity: int
    menu_id: int
    biz_id: int
    user_id: int
    menu: Optional[MenuResponse]
    biz_name: Optional[str]
    user_name: Optional[str]

    class Config:
        orm_mode = True

# 创建订单
class OrderCreate(BaseModel):
    menu_id: int
    quantity: int

    class Config:
        orm_mode = True

# 更新菜单
class MenuUpdate(BaseModel):
    name: Optional[str]
    image_url: Optional[str]
    price: Optional[float]
    stock: Optional[int]  # 更新库存信息

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
    id: int

    class Config:
        orm_mode = True

# 返回订单
class OrderResponse(BaseModel):
    id: int
    state: str
    quantity: int
    menu_id: int  # 关联的菜单ID
    biz_id: int   # 关联的企业ID
    user_id: int  # 关联的用户ID

    menu: Optional[MenuResponse]  # 如果需要返回菜单的详细信息
    biz_name: Optional[str]  # 企业名称
    user_name: Optional[str]  # 用户名称

    class Config:
        orm_mode = True  # 确保支持 ORM 查询结果转换为响应模型

# 新增库存模型
class Instock(BaseModel):
    menu_id: int  # 外键：菜单 ID
    stock_quantity: int  # 库存数量

    class Config:
        orm_mode = True

class InstockUpdate(BaseModel):
    stock_quantity: int

    class Config:
        orm_mode = True