from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.session import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
# 用户表

class User(Base):
    __tablename__ = "users_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    orders = relationship("Order", back_populates="user")

# 企业用户表
class Biz(Base):
    __tablename__ = "biz_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    biz_name = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    orders = relationship("Order", back_populates="biz")
    menus = relationship("Menu", back_populates="biz")
    
class Menu(Base):
    __tablename__ = "menus_table"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # 使用 UUID 作为主键
    name = Column(String, nullable=False)  # 菜单名称
    image_url = Column(String)  # 图片链接
    price = Column(Float, nullable=False)  # 食物价格

    biz_id = Column(UUID(as_uuid=True), ForeignKey("biz_table.id"))  # 企业ID
    biz = relationship("Biz", back_populates="menus")

    # 通过 instocks 关联库存信息
    instock = relationship("Instock", back_populates="menu", uselist=False)  # 一对一关系

class Instock(Base):
    __tablename__ = "instock_table"

    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menus_table.id"), unique=True)  # 一对一关系，关联 Menu ID
    stock_quantity = Column(Integer, default=0)  # 库存数量

    # 与 Menu 的一对一关系
    menu = relationship("Menu", back_populates="instock")

# 订单表
class Order(Base):
    __tablename__ = "orders_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    state = Column(String, nullable=False, default="pending")
    quantity = Column(Integer, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users_table.id"))
    biz_id = Column(UUID(as_uuid=True), ForeignKey("biz_table.id"))
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menus_table.id"))
    user = relationship("User", back_populates="orders")
    biz = relationship("Biz", back_populates="orders")
    menu = relationship("Menu")
