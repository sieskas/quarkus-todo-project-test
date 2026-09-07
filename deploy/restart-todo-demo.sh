#!/bin/sh
set -eu
# Recreate only the Todo task; its in-memory H2 data resets on startup.
exec docker service update --force --detach=false app-generate-1080p-circuit-rd13m8
