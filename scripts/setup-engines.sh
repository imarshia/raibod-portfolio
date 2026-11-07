#!/bin/bash
# scripts/setup-engines.sh downloads the Prisma engine binaries with curl.
# The Prisma postinstall downloader resets the connection in this environment,
# but direct curl downloads work. Run this once after npm install, before
# prisma generate or prisma migrate.
# Usage: bash scripts/setup-engines.sh
set -euo pipefail
COMMIT="c2990dca591cba766e3b7ef5d9e8a84796e47ab7"
PLATFORM="debian-openssl-3.0.x"
DEST="$HOME/.cache/prisma/master/$COMMIT/$PLATFORM"
mkdir -p "$DEST"
for f in libquery_engine.so.node schema-engine; do
  if [ -f "$DEST/$f" ]; then
    echo "exists: $DEST/$f"
  else
    echo "downloading $f"
    curl -L --retry 3 --max-time 180 -o "$DEST/$f.gz" "https://binaries.prisma.sh/all_commits/$COMMIT/$PLATFORM/$f.gz"
    gunzip -f "$DEST/$f.gz"
    chmod +x "$DEST/$f"
  fi
done
echo "Engines ready in $DEST"
echo "Export before prisma commands:"
echo "  export PRISMA_QUERY_ENGINE_LIBRARY=$DEST/libquery_engine.so.node"
echo "  export PRISMA_SCHEMA_ENGINE_BINARY=$DEST/schema-engine"
