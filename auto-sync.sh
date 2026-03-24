#!/bin/bash
# Auto-sync changes to GitHub every 60 seconds

echo "Watching for changes to automatically publish to GitHub..."
while true; do
  if [[ -n $(git status --porcelain) ]]; then
    echo "Changes detected, committing and pushing..."
    git add .
    git commit -m "Auto-publish: $(date)"
    git push origin main
    echo "Successfully published at $(date)"
  fi
  sleep 60
done
