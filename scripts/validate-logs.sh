#!/usr/bin/env bash
set -euo pipefail  # fixed pipefail

echo "Running migrations..."
npx prisma migrate deploy || { echo "Migrations failed"; exit 1; }

echo "Starting app..."
exec npm start