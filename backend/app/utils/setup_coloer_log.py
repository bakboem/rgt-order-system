import logging
from colorlog import ColoredFormatter
import logging
from colorlog import ColoredFormatter

def setup_logger():
    logging.getLogger("sqlalchemy.engine").disabled = True
    """配置带颜色的日志格式"""
    formatter = ColoredFormatter(
        "%(log_color)s%(levelname)-8s%(reset)s %(asctime)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "bold_red",
        },
    )
    
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    # 配置主日志
    logger = logging.getLogger("RGT-Order-System")
    
    logger.setLevel(logging.INFO)  # 设置日志级别
    logger.addHandler(handler)
    
    # 配置 uvicorn 的日志
    uvicorn_loggers = ["uvicorn.access", "uvicorn.error"]
    for uvicorn_logger in uvicorn_loggers:
        uvicorn_logger = logging.getLogger(uvicorn_logger)
        uvicorn_logger.handlers = [handler]
        uvicorn_logger.setLevel(logging.DEBUG)
    logging.basicConfig(level=logging.DEBUG)
setup_logger()
