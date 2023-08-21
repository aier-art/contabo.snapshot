#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

if [ $(date '+%e') -eq 22 ]; then
  echo $(date +%Y%m) >.date
  git add .date
  git config --local user.email "bot@users.noreply.github.com"
  git config --local user.name "bot"
  git commit -m "^" && echo "push=1" >>$GITHUB_OUTPUT || exit 0
fi
pnpm install --production
./run.sh
