#!/bin/sh
set -e

# Seed database on first run
if [ ! -f /app/db/data.db ]; then
  echo "Database not found, seeding..."
  npx tsx /app/db/seed.ts
fi

echo "Starting Next.js..."
exec npm start
