# ── Base Image ────────────────────────────────────────────────────────────────
# We use node:20-alpine because:
#   • node:20   → Node.js Long Term Support (LTS) version
#   • alpine    → Minimal Linux distro (~5MB base vs ~900MB for full Debian)
#   • Result    → Smaller image, faster pulls, reduced attack surface
# 
# NEVER use 'node:latest' in production — the tag can change at any time
# and silently break your application.
FROM node:24-alpine

# ── Image Metadata ────────────────────────────────────────────────────────────
# LABEL adds key-value metadata to the image.
# View these later with: docker inspect my-simple-app:1.0.0
LABEL maintainer="debasish.sahoo96@gmail.com"
LABEL description="Simple Node.js Docker tutorial application"
LABEL version="1.0.0"
LABEL org.opencontainers.image.title="docker-simple-app"
LABEL org.opencontainers.image.version="1.0.0"

# ── Working Directory ─────────────────────────────────────────────────────────
# WORKDIR sets the working directory for all subsequent instructions.
# Docker creates this directory automatically if it does not exist.
# Using /usr/src/app is a common Node.js convention.
WORKDIR /usr/src/app

# ── Dependency Installation (Cache-Optimized) ─────────────────────────────────
# WHY copy package files BEFORE the app code?
#
# Docker builds images layer by layer. If a layer's input files haven't
# changed, Docker REUSES the cached layer — skipping that step entirely.
#
# Strategy:
#   1. Copy package.json + package-lock.json  (changes rarely)
#   2. Run npm ci                             (expensive — cached when possible)
#   3. Copy app source code                  (changes frequently)
#
# This way, editing app.js does NOT invalidate the npm install cache.
# Without this pattern, every code change triggers a full npm install.

# Step A: Copy only the dependency manifest files
COPY package.json package-lock.json ./

# Step B: Install production dependencies
# npm ci vs npm install:
#   • npm ci  → Uses exact versions from package-lock.json (reproducible)
#   • npm ci  → Faster (skips dependency resolution)
#   • npm ci  → Fails if lock file is out of sync (catches errors early)
# --omit=dev → Skips devDependencies (test tools, linters) to keep image lean
RUN npm ci --omit=dev

# ── Application Code ──────────────────────────────────────────────────────────
# Copy all remaining project files into the container.
# The .dockerignore file ensures node_modules and other
# unwanted files are NOT copied (they were installed fresh above).
COPY . .

# ── Port Documentation ────────────────────────────────────────────────────────
# EXPOSE tells Docker (and humans) which port this app uses.
# 
# IMPORTANT: EXPOSE does NOT publish the port to the host machine.
# It is documentation only. To actually access the port, you must use:
#   docker run -p 3000:3000 ...
EXPOSE 3000


# ── Startup Command ───────────────────────────────────────────────────────────
# CMD defines the default command when a container starts.
# 
# Exec form ["node", "app.js"] is preferred over shell form "node app.js":
#   • Exec form → Process runs as PID 1 (receives OS signals directly)
#   • Shell form → Runs inside /bin/sh (signals may not reach your process)
#   • This means Ctrl+C and docker stop work correctly with exec form
CMD ["node", "app.js"]

