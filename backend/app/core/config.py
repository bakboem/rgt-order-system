PROJECT_NAME = "RGT Order System"
# CHANGE
#  개발 
DATABASE_URL = "postgresql+asyncpg://rgt-user:RGT12345!@localhost:5432/rgt"
QUEUE_URL = "amqp://guest:guest@localhost/"
REDIS_URL = "redis://localhost:6379/0" 
REDIS_PASSWORD = "rgt12345!"
# Rabbit Queue Name
ORDER_QUEUE_NAME="orders_queue"
# Rabbit Exchange Name
ORDER_EXCHANGE ="orders_exchange"
# Routing Key
ROUTING_KEY = "orders"

# CHANGE
# 배포
# by docker-compose 
# DATABASE_URL = "postgresql+asyncpg://rgt-user:RGT12345!@postgresql:5432/rgt"
# QUEUE_URL = "amqp://guest:guest@rabbitmq/"
# REDIS_URL = "redis://redis:6379/0" 


#JWT
SECRET_KEY = "rgt-secret-key"
ALGORITHM = "HS256" 
ACCESS_TOKEN_EXPIRE_MINUTES = 30
