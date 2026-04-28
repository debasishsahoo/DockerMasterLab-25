# #ARG
- Build-time variable
- It exists only while building the image.
- After image creation, it disappears.
## Used for:
- versions
- environment selection
- dynamic values during build
```
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}
```

# Runtime availability?
- ARG is NOT available inside running containers.Only during:
```
docker build
```

# it will implemented in two ways
```
Dockerfile
ARG APP_VERSION=1.0
RUN echo $APP_VERSION
```
Build with:
```
run command
docker build --build-arg APP_VERSION=2.0 .
```