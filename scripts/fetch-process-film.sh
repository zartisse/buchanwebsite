#!/usr/bin/env bash
# Downloads the Process film from Higgsfield into public/assets/process/, strips audio and
# compresses it for the web (needs curl, node and ffmpeg).
# Afterwards set PROCESS_FILM_BASE = '' in src/data/processFilm.ts.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/assets/process
mkdir -p "$OUT"
node --input-type=module -e "
import fs from 'node:fs';
const t = fs.readFileSync('src/data/processFilm.ts', 'utf8');
const cdn = t.match(/const CDN = '([^']+)'/)[1];
for (const m of t.matchAll(/src\('([^']+)', '([^']+)'\)/g)) console.log(cdn + '/' + m[1] + ' ' + m[2]);
" | while read -r url name; do
  tmp="$OUT/.dl-$name"
  curl -fsSL "$url" -o "$tmp"
  case "$name" in
    *.mp4) ffmpeg -y -loglevel error -i "$tmp" -an -vf "scale=1600:-2" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$name" ;;
    *.jpg) ffmpeg -y -loglevel error -i "$tmp" -vf "scale=1600:-2" -q:v 3 "$OUT/$name" ;;
  esac
  rm -f "$tmp"
  echo "saved $OUT/$name"
done
