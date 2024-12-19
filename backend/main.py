from fastapi import FastAPI
from app.api.routes.auth import router as auth_router
from app.api.routes.menu import router as menu_router
from app.api.routes.order import router as order_router
from app.api.routes.socket import router as socket_route
from app.db.init_db import init_db
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="RGT Order System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)



app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(menu_router, prefix="/menu", tags=["Menu"])
app.include_router(order_router, prefix="/order", tags=["Order"])
app.include_router(socket_route, prefix="/socket", tags=["WebSocket"])

init_db()
   

@app.get("/")
def read_root():
    return {"message": "Welcome to RGT Order System"}
