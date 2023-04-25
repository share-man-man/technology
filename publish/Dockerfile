FROM nginx:1.23.3
# 将构建好的静态文件复制到docker里去
COPY packages/vite-project/dist /usr/share/nginx/html/vite-project
COPY packages/records/docs/.vitepress/dist /usr/share/nginx/html/records
# 复制nginx相关配置
COPY publish/nginx.conf /etc/nginx/nginx.conf
