LEVEL 1: Foundation Breakers (1-5)

### **Challenge 1: Multi-Stage Build Optimization**

**Objective**: Reduce a bloated Node.js image from 1GB to under 150MB

```docker
# Given this inefficient Dockerfile:
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g nodemon
RUN apt-get update && apt-get install -y python3 build-essential
CMD ["npm", "start"]
```

**Tasks**:

- Rewrite using multi-stage builds
- Final image must be < 150MB
- Must use alpine base
- Keep only production dependencies
- Verify with `docker images` and `docker history`

**Success Criteria**: Image size < 150MB, app runs successfully