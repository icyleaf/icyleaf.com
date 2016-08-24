#!/usr/bin/env sh

mkdir -p logs
hugo server --baseURL=${HUGO_HOST} --destination=public -p ${HUGO_PORT} --bind=0.0.0.0 --watch