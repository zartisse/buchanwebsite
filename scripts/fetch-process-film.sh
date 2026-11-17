#!/usr/bin/env bash
# Downloads the Process film from Higgsfield into public/assets/process/, strips audio and
# compresses it for the web (1280px, no audio, fast start) (needs curl, node and ffmpeg).
# Then switches src/data/processFilm.ts to the local copies.
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
    *.mp4) ffmpeg -nostdin -y -loglevel error -i "$tmp" -an -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$name" ;;
    *.jpg) ffmpeg -nostdin -y -loglevel error -i "$tmp" -vf "scale=1280:-2" -q:v 4 "$OUT/$name" ;;
  esac
  rm -f "$tmp"
  echo "saved $OUT/$name"
done
sed -i "s|^export const PROCESS_FILM_BASE: string = CDN;|export const PROCESS_FILM_BASE: string = '';|" src/data/processFilm.ts
ls -la "$OUT"
