#!/usr/bin/env bash
set -euo pipefail

echo "Checking container logs for failure signals..."
LOGS="$(docker compose logs --tail=120 app db 2>&1 || true)"

echo "$LOGS" | grep -Eiq "error|exception|failed|panic" && {
  echo "Detected failure markers in logs."
  exit 1
}

echo "$LOGS" | grep -Eiq "ready to accept connections|started server|listening" || {
  echo "No healthy startup markers found in logs."
  exit 1
}

echo "Log validation passed."
exec "$@"
