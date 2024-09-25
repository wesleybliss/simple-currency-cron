#!/bin/bash

source="${1:-}"
target="${2:-}"
amount="${3:-1}"

if [[ -z "$source" ]] || [[ -z "$target" ]]; then
    echo "USAGE: $0 <source> <target> [amount=1]"
    exit 1
fi

curl "localhost:3000/api/convert?value=$amount&from=$source&to=$target" | jq
