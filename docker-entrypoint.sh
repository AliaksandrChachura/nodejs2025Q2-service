#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until npx prisma migrate status > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready! Running migrations..."
npx prisma migrate deploy

echo "Migrations completed. Starting application..."
exec "$@"
