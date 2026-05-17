#!/bin/sh
set -e

if [ "$RUN_MIGRATIONS" != "false" ]; then
  echo "Running Prisma migrations..."
  npm run prisma:deploy
fi

if [ "$SEED_DATABASE" = "true" ]; then
  echo "Seeding database..."
  npm run prisma:seed
fi

exec "$@"
