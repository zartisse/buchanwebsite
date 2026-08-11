#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Load .env.local for Supabase vars at build time
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source <(grep -v '^#' .env.local | sed 's/^/export /')
  set +a
fi

export VITE_BASE_PATH=/buchanwebsite/
npm run build

npx --yes gh-pages@6.3.0 -d dist -m "Deploy site $(date +%Y-%m-%d)"

echo ""
echo "Published to gh-pages branch."
echo "Enable GitHub Pages: Settings → Pages → Source → gh-pages / (root)"
echo "Live URL: https://zartisse.github.io/buchanwebsite/"
