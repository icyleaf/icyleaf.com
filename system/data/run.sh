#!/usr/bin/env sh

mkdir -p logs
rm -rf public
hugo server --baseURL=${HOST} --destination=public -p ${HTTP_PORT} --bind=0.0.0.0 --watch
