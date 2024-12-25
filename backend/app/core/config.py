PROJECT_NAME = "RGT Order System"
# CHANGE
#  개발 
DATABASE_URL = "postgresql+asyncpg://rgt-user:RGT12345!@localhost:5432/rgt"
QUEUE_URL = "amqp://guest:guest@localhost/"

# CHANGE
# 배포
# by docker-compose 
# DATABASE_URL = "postgresql+asyncpg://rgt-user:RGT12345!@postgresql:5432/rgt"
# QUEUE_URL = "amqp://guest:guest@rabbitmq/"

#JWT
SECRET_KEY = "rgt-secret-key"
ALGORITHM = "HS256" 
ACCESS_TOKEN_EXPIRE_MINUTES = 30
