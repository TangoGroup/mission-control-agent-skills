#!/usr/bin/env bash
# Resize, compress and strip a photo for the web.
#   bash prepare.sh <source image> <dest .jpg> [max width in px, default 1600] [quality, default 72]
# Limits the WIDTH only (portraits keep their full height up to that width) and never enlarges.
# Uses ImageMagick when available, otherwise macOS sips. Prints the final size.
set -euo pipefail
SRC="${1:?source image}"; DEST="${2:?destination .jpg}"; W="${3:-1600}"; Q="${4:-72}"
mkdir -p "$(dirname "$DEST")"
if command -v magick >/dev/null 2>&1; then
  magick "$SRC" -auto-orient -resize "${W}x>" -strip -interlace Plane -quality "$Q" "$DEST"
  magick identify -format '%f %wx%h %b\n' "$DEST"
elif command -v sips >/dev/null 2>&1; then
  cur=$(sips -g pixelWidth "$SRC" | awk '/pixelWidth/{print $2}')
  if [[ "$cur" -gt "$W" ]]; then sips -s format jpeg -s formatOptions "$Q" --resampleWidth "$W" "$SRC" --out "$DEST" >/dev/null; else sips -s format jpeg -s formatOptions "$Q" "$SRC" --out "$DEST" >/dev/null; fi
  echo "note: sips does not apply EXIF rotation; check portrait photos"
  sips -g pixelWidth -g pixelHeight "$DEST" | tail -2 | tr '\n' ' '; echo
else
  echo "Install ImageMagick (brew install imagemagick) or use macOS sips." >&2; cp "$SRC" "$DEST"
fi
