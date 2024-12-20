from sqlalchemy import Column, String, ForeignKey, Float, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
import uuid

# 用户表
class User(Base):
    __tablename__ = "users_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    orders = relationship("Order", back_populates="user")

# 企业用户表
class Biz(Base):
    __tablename__ = "biz_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    biz_name = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    orders = relationship("Order", back_populates="biz")
    menus = relationship("Menu", back_populates="biz")

# 菜单表
class Menu(Base):
    __tablename__ = "menus_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # 主键
    name = Column(String, nullable=False)  # 菜单名称
    image_url = Column(String)  # 图片链接
    price = Column(Float, nullable=False)  # 食物价格
    status = Column(String, default="available")  # 默认可用状态
    biz_id = Column(UUID(as_uuid=True), ForeignKey("biz_table.id"))  # 外键：企业ID
    biz = relationship("Biz", back_populates="menus")
    instock = relationship("Instock", back_populates="menu", uselist=False)  # 一对一关系
    sales = relationship("SaleTracking", back_populates="menu")

# 库存表
class Instock(Base):
    __tablename__ = "instock_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menus_table.id"), unique=True)  # 一对一关系，关联 Menu ID
    stock_quantity = Column(Integer, default=0)  # 库存数量
    menu = relationship("Menu", back_populates="instock")

# 订单表
class Order(Base):
    __tablename__ = "orders_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    state = Column(String, nullable=False, default="waiting")
    quantity = Column(Integer, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users_table.id"))  # 外键：用户ID
    biz_id = Column(UUID(as_uuid=True), ForeignKey("biz_table.id"))  # 外键：企业ID
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menus_table.id"))  # 外键：菜单ID
    user = relationship("User", back_populates="orders")
    biz = relationship("Biz", back_populates="orders")
    menu = relationship("Menu")

# 销售跟踪表
class SaleTracking(Base):
    __tablename__ = "sale_tracking_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menus_table.id"))  # 外键：菜单ID
    quantity = Column(Integer, nullable=False)  # 销售数量
    timestamp = Column(DateTime, default=datetime.utcnow)  # 销售时间
    menu = relationship("Menu", back_populates="sales")
