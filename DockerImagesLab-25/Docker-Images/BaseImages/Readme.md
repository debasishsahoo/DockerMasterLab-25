# BASE IMAGES CONCEPT(Official image hierarchy)
## scratch   ← empty filesystem
## busybox   ← tiny Unix utilities (~5MB)
## alpine       ← Alpine Linux (~5MB, musl libc)
## debian/slim  ← Debian minimal (~75MB)
## ubuntu  ← Ubuntu (~75MB)
## distroless   ← no shell, no package manager (Google)

# BASE IMAGES CONCEPT(Language-specific base images)
## FROM python:3.12 -> full Debian
## FROM python:3.12-slim ->Debian minimal (preferred)
## FROM python:3.12-alpine Alpine (smallest but musl issues)

# What is musl Issue in Docker / Linux
- musl issues usually happen when you use Alpine Linux-based Docker images.because Alpine uses musl libc instead of glibc.
- libc means:C Standard Library
 - It is one of the most important system libraries in Linux.
## Almost every program depends on it:
-- Java
-- Python
-- Node.js
-- Docker apps
-- System tools
-- Native binaries
-- Database drivers
-- npm packages with native modules

It handles things like:
memory management
file operations
networking
threads
system calls
process execution

# Two Major libc Types
## GNU C Library(glibc)
Ubuntu
Debian
CentOS
RHEL
Amazon Linux

## musl
Alpine Linux

# Common musl Problems
- 1. Native Binary Fails
- bcrypt
- sharp
- prisma
- canvas
- sqlite3
- node-gyp modules
- 2. Java Issues
- JNI
- native drivers
- Oracle drivers
-performance libraries

### Choosing the right base

- **Development** → full images (debugging tools available)
- **Production** → slim or alpine (smaller attack surface)
- **Security-critical** → distroless or scratch
- **CI/build** → JDK/full; Runtime → JRE/slim