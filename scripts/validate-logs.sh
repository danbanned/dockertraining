#!/usr/bin/env bash

set -euo pipefail

LOG_INPUT="${1:-}"

if [ -n "$LOG_INPUT" ] && [ -f "$LOG_INPUT" ]; then
  CONTENT="$(cat "$LOG_INPUT")"
else
  CONTENT="${LOG_INPUT:-healthy}"
fi

if printf "%s" "$CONTENT" | grep -Eiq "(error|exception|failed|panic)"; then
  echo "Unhealthy log markers detected"
  exit 1
fi

echo "Logs look healthy"
