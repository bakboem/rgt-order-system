from sqlalchemy import Column, Index, String, ForeignKey, Float, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
import uuid

class User(Base):
    __tablename__ = "users_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False, index=True)  
    hashed_password = Column(String, nullable=False)
    orders = relationship("Order", back_populates="user")

class Biz(Base):
    __tablename__ = "biz_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    biz_name = Column(String, unique=True, nullable=False, index=True)  
    hashed_password = Column(String, nullable=False)
    orders = relationship("Order", back_populates="biz")
    menus = relationship("Menu", back_populates="biz")

class Menu(Base):
    __tablename__ = "menus_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  
    name = Column(String, nullable=False, index=True)  
    image_url = Column(String)  
    price = Column(Float, nullable=False)  
    status = Column(String, default="available")  
    biz_id = Column(UUID(as_uuid=True), ForeignKey("biz_table.id"), index=True)  
    biz = relationship("Biz", back_populates="menus")
    instock = relationship("Instock", back_populates="menu", uselist=False) 
    sales = relationship("SaleTracking", back_populates="menu")


class Instock(Base):
    __tablename__ = "instock_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menus_table.id"), unique=True, index=True) 
    stock_quantity = Column(Integer, default=0)  
    menu = relationship("Menu", back_populates="instock")


class Order(Base):
    __tablename__ = "orders_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    state = Column(String, nullable=False, default="waiting", index=True)  
    quantity = Column(Integer, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users_table.id"), index=True)   
    biz_id = Column(UUID(as_uuid=True), ForeignKey("biz_table.id"), index=True)   
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menus_table.id"), index=True)  
    user = relationship("User", back_populates="orders")
    biz = relationship("Biz", back_populates="orders")
    menu = relationship("Menu")
    __table_args__ = (
        Index('ix_orders_table_biz_user', "biz_id", "user_id"),  
    )

 
class SaleTracking(Base):
    __tablename__ = "sale_tracking_table"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menus_table.id"), index=True)  
    quantity = Column(Integer, nullable=False)  
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)  
    menu = relationship("Menu", back_populates="sales")
