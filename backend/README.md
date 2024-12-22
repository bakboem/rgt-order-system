# 使用轻量级 Python 镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装 Poetry
RUN pip install poetry

# 复制 pyproject.toml 和 poetry.lock
COPY ./pyproject.toml /app/pyproject.toml
COPY ./poetry.lock /app/poetry.lock

# 安装依赖
RUN poetry config virtualenvs.create false && poetry install --no-root

# 复制 app 文件夹内容
COPY ./app /app

# 暴露应用端口
EXPOSE 8000

# 使用 Poetry 安装的环境启动应用
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
