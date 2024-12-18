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
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    image_url = Column(String)
    price = Column(Float, nullable=False)
    biz_id = Column(UUID, ForeignKey("biz_table.id"))

    biz = relationship("Biz", back_populates="menus")
    instock = relationship("Instock", back_populates="menu", uselist=False)  # 与库存表一对一关联
    
# 库存表
class Instock(Base):
    __tablename__ = "instock_table"
    menu_id = Column(UUID, ForeignKey("menus_table.id"), primary_key=True)
    stock_quantity = Column(Integer, nullable=False)
    menu = relationship("Menu", back_populates="instock")

# 订单表
class Order(Base):
    __tablename__ = "orders_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    state = Column(String, nullable=False, default="pending")
    quantity = Column(Integer, nullable=False)
    user_id = Column(UUID, ForeignKey("users_table.id"))
    biz_id = Column(UUID, ForeignKey("biz_table.id"))
    menu_id = Column(UUID, ForeignKey("menus_table.id"))
    user = relationship("User", back_populates="orders")
    biz = relationship("Biz", back_populates="orders")
    menu = relationship("Menu")
