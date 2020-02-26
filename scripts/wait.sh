#!/bin/sh
# wait.sh

set -e

host="$1"
port="$2"
shift
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Bootstrap is unavailable - sleeping"
  sleep 10
done

>&2 echo "Bootstrap is up - executing command"
exec $cmd