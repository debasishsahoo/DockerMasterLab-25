# #ENV
- Run-time variable
- It stays inside the image and inside the container.
## Used for:
- PORT
- DATABASE_URL
- JAVA_HOME
- NODE_ENV
- PATH
- These values are available while container runs.
```
ENV NODE_ENV=production
Inside container:
echo $NODE_ENV
```

