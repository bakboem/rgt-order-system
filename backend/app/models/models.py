from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.session import Base

# 用户表
class User(Base):
    __tablename__ = "users_table"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # 关联用户订单
    orders = relationship("Order", back_populates="user")

# 企业用户表
class Biz(Base):
    __tablename__ = "biz_table"

    id = Column(Integer, primary_key=True, index=True)
    biz_name = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # 关联企业订单和菜单
    orders = relationship("Order", back_populates="biz")
    menus = relationship("Menu", back_populates="biz")

# 菜单表
class Menu(Base):
    __tablename__ = "menus_table"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  
    image_url = Column(String)             
    price = Column(Float, nullable=False)  
    stock = Column(Integer, default=0)    

    biz_id = Column(Integer, ForeignKey("biz_table.id"))  
    biz = relationship("Biz", back_populates="menus")  

class Order(Base):
    __tablename__ = "orders_table"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, nullable=False, default="pending")  
    quantity = Column(Integer, nullable=False)               

    user_id = Column(Integer, ForeignKey("users_table.id"))
    biz_id = Column(Integer, ForeignKey("biz_table.id"))  
    menu_id = Column(Integer, ForeignKey("menus_table.id"))

    user = relationship("User", back_populates="orders")
    biz = relationship("Biz", back_populates="orders")  
    menu = relationship("Menu")
