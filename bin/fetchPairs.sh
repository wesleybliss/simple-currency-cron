#!/bin/bash

source="${1:-}"
shift # Shift off the first argument to move it to the positional parameters array

if [[ -z "$source" ]]; then
    echo "USAGE: $0 <source> <...targets>"
    exit 1
fi

# Ensure there is at least one target
if [[ $# -eq 0 ]]; then
    echo "ERROR: At least one target is required."
    exit 1
fi

targets=""
for target in "$@"; do
    # Append each target to the list, preceded by a comma unless it's the first target
    if [ -n "$targets" ]; then
        targets="$targets,$target"
    else
        targets="$target"
    fi
done

curl "localhost:3000/api/pairs?value=1&base=$source&targets=$targets" | jq
