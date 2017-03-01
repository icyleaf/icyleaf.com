#!/usr/bin/env sh

HUGO_HOST=localhost
HUGO_PORT=1313

mkdir -p logs
hugo server --baseURL=${HUGO_HOST} --destination=public -p ${HUGO_PORT} --bind=0.0.0.0 --watch
