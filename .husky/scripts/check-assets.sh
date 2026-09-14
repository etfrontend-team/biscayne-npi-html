#!/bin/bash

MAX_IMAGE_BYTES=$((1 * 1024 * 1024))   # 1 MB
MAX_VIDEO_BYTES=$((10 * 1024 * 1024))  # 10 MB

has_error=0
mode="${1:-staged}"

if [ "$mode" = "tracked" ]; then
  files=$(git ls-files)
else
  files=$(git diff --cached --name-only --diff-filter=ACM)
fi

get_size() {
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || wc -c < "$1"
}

while IFS= read -r file; do
  [ -z "$file" ] && continue
  [ ! -f "$file" ] && continue

  if echo "$file" | grep -qiE '^assets/images?/' && ! echo "$file" | grep -qiE '\.(mp4|webm|mov|avi|mkv|flv|ogv)$'; then
    size=$(get_size "$file")
    if [ "$size" -gt "$MAX_IMAGE_BYTES" ]; then
      echo -e "\033[31mASSET\033[0m $file — $(( size / 1024 ))KB exceeds 1MB image limit"
      has_error=1
    fi
  fi

  if echo "$file" | grep -qiE '^assets/videos?/' && echo "$file" | grep -qiE '\.(mp4|webm|mov|avi|mkv|flv|ogv)$'; then
    size=$(get_size "$file")
    if [ "$size" -gt "$MAX_VIDEO_BYTES" ]; then
      size_mb=$(awk "BEGIN { printf \"%.2f\", $size/1024/1024 }")
      echo -e "\033[31mASSET\033[0m $file — ${size_mb}MB exceeds 10MB video limit"
      has_error=1
    fi
  fi
done <<< "$files"

if [ "$has_error" -eq 1 ]; then
  if [ "$mode" = "tracked" ]; then
    echo -e "\nOptimize assets before pushing.\n"
  else
    echo -e "\nOptimize assets before committing.\n"
  fi
  exit 1
fi
