from fastapi import FastAPI
from app.api.routes.auth import router as auth_router
from app.api.routes.menu import router as menu_router
from app.api.routes.order import router as order_router
from app.db.init_db import init_db

app = FastAPI(title="RGT Order System")

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(menu_router, prefix="/menu", tags=["Menu"])
app.include_router(order_router, prefix="/order", tags=["Order"])

init_db()
   

@app.get("/")
def read_root():
    return {"message": "Welcome to RGT Order System"}
