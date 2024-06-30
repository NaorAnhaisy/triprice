FROM node:lts-alpine as builder
ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN npm install -g @angular/cli
RUN npm install -g @nrwl/cli
RUN npm install -g @nx/workspace
RUN npx nx@latest init
RUN npm init nx-workspace
RUN npm install
