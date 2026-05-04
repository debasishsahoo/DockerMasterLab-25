# syntax=docker/dockerfile:1
# STAGE 1 — BUILD STAGE (dependencies + compile)

FROM node:22-alpine AS build

ARG APP_VERSION=1.0.0
ARG NODE_ENV=production
ARG BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ARG GIT_COMMIT=$(git rev-parse --short HEAD)

ENV NODE_ENV=${NODE_ENV}
ENV APP_VERSION=${APP_VERSION}
ENV BUILD_DATE=${BUILD_DATE}
ENV GIT_COMMIT=${GIT_COMMIT}
ENV NPM_CONFIG_LOGLEVEL=warn
ENV PORT=3000

LABEL maintainer="Debasish Sahoo"
LABEL version="${APP_VERSION}"
LABEL description="A simple Node.js application built with Express.js"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.url="https://github.com/debasishsahoo/nodejs-express-app"
LABEL org.opencontainers.image.source="https://github.com/debasishsahoo/nodejs-express-app"
LABEL org.opencontainers.image.version="${APP_VERSION}"
LABEL org.opencontainers.image.revision="${GIT_COMMIT}"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production && npm cache clean --force




