#!/bin/sh

PACKAGE_HASH=$(md5sum /app-f/package.json 2>/dev/null || echo "none")
LOCK_HASH=$(md5sum /app-f/yarn.lock 2>/dev/null || echo "none")

echo "Running initial yarn install..."
cd /app-f && yarn install

(
  while true; do
    CURRENT_PACKAGE_HASH=$(md5sum /app-f/package.json 2>/dev/null || echo "none")
    CURRENT_LOCK_HASH=$(md5sum /app-f/yarn.lock 2>/dev/null || echo "none")
    
    if [ "$PACKAGE_HASH" != "$CURRENT_PACKAGE_HASH" ] || [ "$LOCK_HASH" != "$CURRENT_LOCK_HASH" ]; then
      echo "Detected changes in package.json or yarn.lock. Running yarn install..."
      cd /app-f && yarn install
    
      PACKAGE_HASH=$CURRENT_PACKAGE_HASH
      LOCK_HASH=$CURRENT_LOCK_HASH
    fi
    
    sleep 2
  done
) &

echo "Starting application with command: $@"
exec "$@"
