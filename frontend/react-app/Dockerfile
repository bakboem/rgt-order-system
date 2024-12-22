# 使用轻量级 Node.js 镜像
FROM node:23-slim

# 设置工作目录
WORKDIR /usr/src/app

# 复制依赖文件
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建项目
RUN yarn build

# 暴露端口
EXPOSE 3000

# 提供构建的静态文件
CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "3000"]
