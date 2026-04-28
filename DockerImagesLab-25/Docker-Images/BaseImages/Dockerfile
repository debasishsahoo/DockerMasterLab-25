# ─── FROM ───
# Every Dockerfile must begin with FROM
FROM ubuntu:22.04
FROM python:3.12-slim
FROM scratch

# ─── ARG ─────(Docker File can Start with ARG, in Special Cases)
# Build-time variables (NOT available at runtime)
ARG APP_VERSION=1.0
ARG NODE_ENV=production

# ─── ENV ──────
# Runtime environment variables (persisted in image)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# ─── LABEL ─────
# Metadata for the image
LABEL maintainer="you@example.com"
LABEL version="1.0"
LABEL description="My App"

# ─── WORKDIR ────────
# Sets working directory for RUN, CMD, ENTRYPOINT, COPY, ADD
# Creates directory if it doesn't exist
WORKDIR /app

# ─── COPY ────
# Copy files from build context to image
# everything
COPY . .
# specific folder
COPY src/ /app/src/
# single file
COPY requirements.txt .
# copy with ownership
COPY --chown=node:node . .
# copy from another build stage
COPY --from=builder /app/dist .

# ─── ADD ──────
# Like COPY but also: auto-extracts tar files, supports URLs
# Prefer COPY unless you need these extra features
ADD archive.tar.gz /app/
ADD https://example.com/file.sh /tmp/

# ─── RUN ────
# Execute commands during build (creates a new layer each time)
RUN apt-get update && apt-get install -y curl
RUN pip install --no-cache-dir -r requirements.txt

# Shell form (runs via /bin/sh -c)
RUN echo "hello"
# Exec form (no shell, no variable expansion)
RUN ["pip", "install", "flask"]

# ─── EXPOSE ──────
# Documents which port the container listens on (informational only)
EXPOSE 8080
EXPOSE 8080/tcp
EXPOSE 53/udp

# ─── VOLUME ─────────────────────────────────────────────
# Creates a mount point / marks it as externally mounted
VOLUME ["/data"]
VOLUME /var/log /var/data

# ─── USER ───
# Sets the user for subsequent RUN, CMD, ENTRYPOINT
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
USER 1001  

# ─── CMD ────
# Default command to run when container starts
# Can be overridden at runtime: docker run image mycommand
# Only ONE CMD per Dockerfile (last one wins)
#CMD ["python", "app.py"]
#CMD python app.py

# ─── ENTRYPOINT ─────────────────────────────────────────
# The main executable. CMD becomes default arguments to it.
# Unlike CMD, cannot be fully overridden — use --entrypoint flag
ENTRYPOINT ["gunicorn"]
CMD ["--workers=4", "app:app"]
# Result: gunicorn --workers=4 app:app

# ─── HEALTHCHECK ────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost:8080/health || exit 1
# disable inherited healthcheck
#HEALTHCHECK NONE

# ─── ONBUILD ────────────────────────────────────────────
# Triggers that fire when this image is used as a base image
ONBUILD COPY . /app
ONBUILD RUN pip install -r requirements.txt

# ─── STOPSIGNAL ─────────────────────────────────────────
# Signal to stop the container (default: SIGTERM)
STOPSIGNAL SIGINT

# ─── SHELL ──────────────────────────────────────────────
# Change default shell for RUN instructions
SHELL ["/bin/bash", "-o", "pipefail", "-c"]