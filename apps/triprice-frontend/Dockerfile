FROM my-base-image:nx-base AS builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN npx nx build triprice-frontend ${BUILD_FLAG} --verbose

FROM nginx:1.19.2

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/builder/dist/apps/triprice-frontend ./
COPY --from=builder /app/builder/apps/triprice-frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/builder/apps/triprice-frontend/cs.crt /etc/ssl/cs.crt
COPY --from=builder /app/builder/apps/triprice-frontend/myserver.key /etc/ssl/myserver.key
