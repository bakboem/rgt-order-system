PROJECT_NAME = "RGT Order System"
# DB
DATABASE_URL = "postgresql+asyncpg://rgt-user:RGT12345!@localhost:5432/rgt"
QUEUE_URL = "amqp://guest:guest@localhost/"

#JWT
SECRET_KEY = "rgt-secret-key"
ALGORITHM = "HS256" 
ACCESS_TOKEN_EXPIRE_MINUTES = 30
