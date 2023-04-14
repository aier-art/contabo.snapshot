#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR

set -a
source .env
set +a

set -ex
exec ./lib/snapshot.js
