
#!/bin/sh
set -e

echo "============================================"
echo "  Application Starting"
echo "============================================"
echo "  Environment:    ${NODE_ENV}"
echo "  Build Env:      ${BUILD_ENVIRONMENT}"
echo "  Port:           ${PORT}"
echo "  Debug Mode:     ${DEBUG_MODE}"
echo "  Running User:   $(whoami)"
echo "  Node Version:   $(node --version)"
echo "  Working Dir:    $(pwd)"
echo "============================================"

# Execute the CMD
exec "$@"