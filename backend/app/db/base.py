import pytz
from sqlalchemy import Column, DateTime, String, func
from sqlalchemy.ext.declarative import as_declarative, declared_attr
import uuid
from datetime import datetime, timezone

@as_declarative()
class Base:
    """
    扩展 SQLAlchemy 的 declarative_base.
    为所有模型提供通用功能。
    """

    # 自动生成表名，默认为类名的小写形式
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    # 通用字段
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # 自动生成 UUID 主键
    created_at = Column(DateTime(timezone=True), default=func.now())  # 创建时间（UTC）
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())  # 更新时间（UTC）

    @staticmethod
    def to_utc_time(input_time: datetime) -> datetime:
        """
        将时间转换为 UTC 时间
        :param input_time: datetime 对象
        :return: UTC 时间
        """
        if input_time.tzinfo is None:
            return pytz.UTC.localize(input_time)
        return input_time.astimezone(pytz.UTC)

    @staticmethod
    def from_timestamp(timestamp: int) -> datetime:
        """
        从时间戳（秒、毫秒、纳秒）创建 UTC 时间
        :param timestamp: 时间戳
        :return: UTC 时间
        """
        if len(str(timestamp)) == 10:  # Seconds
            return datetime.fromtimestamp(timestamp, tz=timezone.utc)
        elif len(str(timestamp)) == 13:  # Milliseconds
            return datetime.fromtimestamp(timestamp / 1000, tz=timezone.utc)
        elif len(str(timestamp)) > 13:  # Nanoseconds
            return datetime.fromtimestamp(timestamp / 1_000_000_000, tz=timezone.utc)
        else:
            raise ValueError("Invalid timestamp length")    
