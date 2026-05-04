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

COPY src/ ./src/
COPY config/ ./config/
COPY --chown=node:node . .

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/wait-for-it.sh

#  STAGE 2 — PRODUCTION RUNTIME IMAGE
FROM node:22-alpine AS production

SHELL ["/bin/sh", "-o", "pipefail", "-c"]

ARG APP_VERSION=1.0.0
ARG NODE_ENV=production

ENV NODE_ENV=production
ENV PORT=3000
ENV APP_HOME=/app
ENV LOG_DIR=/app/logs
ENV DATA_DIR=/app/data
ENV PYTHONDONTWRITEBYTECODE=1

LABEL maintainer="debasish@example.com"
LABEL version="${APP_VERSION}"
LABEL description="Node.js Production Runtime"

WORKDIR /app

RUN apk add --no-cache \
    curl \
    tini \
    dumb-init \
  && addgroup -S appgroup \
  && adduser -S appuser -G appgroup -h /app -s /bin/sh

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/config ./config
COPY --from=builder /app/package.json ./
COPY --from=builder /usr/local/bin/wait-for-it.sh /usr/local/bin/

RUN mkdir -p /app/logs /app/data && chown -R appuser:appgroup /app/logs /app/data

VOLUME ["/app/logs", "/app/data"]

USER appuser

EXPOSE 3000
EXPOSE 9229

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 CMD curl -f http://localhost:3000/health || exit 1

STOPSIGNAL SIGTERM

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]

ONBUILD COPY package.json package-lock.json ./
ONBUILD RUN npm ci --only=production

