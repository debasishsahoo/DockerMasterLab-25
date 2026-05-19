#!/bin/sh
set -e

echo "Starting Docker Entrypoint Script"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running Database migrations"
  exec npm run migrate
fi

if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode"
  exec node dist/server.js
else
  echo "Running in development mode"
  exec npm run dev
fi

echo "Starting application..."
exec "$@"