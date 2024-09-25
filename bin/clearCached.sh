#!/bin/bash

if [[ -z "$1" ]]; then
    echo "USAGE: $0 <cache-key>"
    exit 1
fi

curl "localhost:3000/api/clear?key=$1"
