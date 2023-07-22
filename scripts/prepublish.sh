#!/bin/sh
# check if we are on the main branch and if we are at the latest commit
# and if there are no uncommited changes, otherwise abort
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
  echo "Not on main branch, aborting."
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommited changes, aborting."
  exit 1
fi
git pull

rm -r dist
bun run build
