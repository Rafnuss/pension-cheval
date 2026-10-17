#!/usr/bin/env bash
# Standardize photos: originals/<set>/*.jpg -> originals/edited/<set>/ (full res, same look)
# and photos-web/<set>/ (web sizes: 2000w + 1000w, WebP + JPG).
# Usage: scripts/process-photos.sh [set-dir ...]   (default: all sets in originals/)
set -euo pipefail
cd "$(dirname "$0")/.."
sets=("$@"); [ ${#sets[@]} -eq 0 ] && sets=($(ls -d originals/*/ | grep -v '/edited/' | xargs -n1 basename))
for set in "${sets[@]}"; do
  src="originals/$set"; ed="originals/edited/$set"; web="photos-web/$set"
  mkdir -p "$ed" "$web"
  for f in "$src"/*.jpg; do
    [ -e "$f" ] || continue
    name=$(basename "$f" .jpg)
    # Common look: auto-orient, gentle auto-contrast, +8% saturation, light sharpen
    magick "$f" -auto-orient -contrast-stretch 0.3%x0.3% -modulate 100,108 \
      -unsharp 0x1+0.5+0.02 -quality 95 -sampling-factor 4:4:4 "$ed/$name.jpg"
    for w in 2000 1000; do
      magick "$ed/$name.jpg" -resize "${w}x>" -strip -colorspace sRGB -quality 82 -interlace Plane "$web/$name-$w.jpg"
      cwebp -quiet -q 80 -m 6 "$web/$name-$w.jpg" -o "$web/$name-$w.webp"
    done
    echo "ok $set/$name"
  done
done
