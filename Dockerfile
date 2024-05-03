## 第一阶段
#FROM node:20.12.1 AS build-stage
#
## 创建工作目录
#RUN mkdir -p /app
#WORKDIR /app
#
## 复制项目文件和目录到容器中
#COPY . /app
#
## 安装依赖项并构建应用程序
#RUN npm install --force --registry https://registry.npmmirror.com && \
#    npm run build && \
#    npm cache clean --force
#
## 清理node_modules目录
#RUN rm -rf ./node_modules

# 第二阶段
FROM node:20.12.1 AS runtime-stage
#2、作者
MAINTAINER bobovinch
# 创建工作目录
RUN mkdir -p /app
WORKDIR /app

# 复制构建阶段生成的输出到运行时阶段
COPY  ./.output /app/.output
COPY ./package.json /app/

# 设置环境变量
ENV PORT=3010
ENV NUXT_PUBLIC_BASELLM_URL=http://127.0.0.1:3000
ENV NUXT_PUBLIC_WXAUTHREDIRECT_URI=https://www.gptpro.ink/status/loading
ENV NUXT_PUBLIC_BASE_APIURL=http://192.168.0.107:3001
ENV NUXT_PUBLIC_BASE_SOCKETURL=http://192.168.0.107:3002
ENV NUXT_PUBLIC_BASE_VITSURL=http://127.0.0.1:5000

# 暴露端口
EXPOSE 3010
# 设置入口点为启动脚本
ENTRYPOINT ["npm", "run", "start"]

