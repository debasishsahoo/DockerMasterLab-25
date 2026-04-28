# # Always use absolute paths
```
WORKDIR /app
```

# # Chained WORKDIR is cumulative
```
WORKDIR /app
WORKDIR src
```
# # now Use this as one WORKDIR /app/src

# # Separate workdirs per stage in multistage builds
```
FROM node:20 AS builder
WORKDIR /build
```
```
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
```