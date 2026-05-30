#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "$ROOT_DIR/.env.production.example" && ! -f "$ROOT_DIR/.env" ]]; then
  cp "$ROOT_DIR/.env.production.example" "$ROOT_DIR/.env"
  echo "Created .env from .env.production.example"
fi

npm install
npm run build
npm start
