### Layer System

Each instruction in a Dockerfile (`RUN`, `COPY`, `ADD`) creates a new layer.
Layers are cached and reused, which is why order matters for build performance.


### A base image is the starting point of your Docker image
 - OS + minimal tools + runtime (sometimes)
 - Everything you build sits on top of it

#### Full OS Base Images
 - FROM ubuntu:22.04
 - FROM Debian
 - CentOS

 -- When you need full control
 -- Good for learning & debugging

### Minimal Base Images (Lightweight)
 - Alpine Linux
 - busybox
 - scratch (empty image)

 -- Production apps
 -- Microservices
 -- Reduce image size

 ### Language Runtime Base Images
  - node:20
  - python:3.12
  - openjdk:21
  - golang:1.22

-- Backend apps (Node, Java, Python)
-- Fast setup (no manual install needed)

### Distroless Images (Secure Production)
  - No shell
  - No package manager
  - Only runtime dependencies

```
   FROM gcr.io/distroless/java17
   COPY app.jar /app.jar
   CMD ["app.jar"]
```

  -- High security production environments
  -- Reduce attack surface

### Custom Base Images
 - You create your own base image
 - Example: company standard image with tools


# Dockerfile 


```
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


```

# Dockerfile Instructions Summary

| Instruction | Purpose | Creates Layer? |
| --- | --- | --- |
| `FROM` | Sets the base image | Yes (pulls base layers) |
| `LABEL` | Adds metadata (key-value pairs) | Yes (minimal) |
| `WORKDIR` | Sets working directory for subsequent instructions | Yes (minimal) |
| `COPY` | Copies files from host to image | Yes |
| `RUN` | Executes a command during build (e.g., install deps) | Yes |
| `EXPOSE` | Documents the port (metadata only) | No (metadata) |
| `CMD` | Sets the default command for container startup | No (metadata) |





# The docker build Command
## Step 1: Build the Image
```
docker build -t my-node-app:1.0.0 .
```

| Part | Meaning |
| --- | --- |
| `docker build` | The command to build an image |
| `-t my-node-app:1.0.0` | Tag the image with name `my-node-app` and version tag `1.0.0` |
| `.` | The build context is the current directory |


docker build -t my-node-app:1.0.0 .
docker build -t my-node-app:1.0.0 .
docker build -t my-node-app:latest .
docker build --no-cache -t my-node-app:fresh .
docker build -f Dockerfile.dev -t my-node-app:dev .
docker build --build-arg NODE_ENV=production -t my-node-app:prod .


