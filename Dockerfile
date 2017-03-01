FROM icyleafcn/caddy:latest
MAINTAINER icyleaf <icyleaf.cn@gmail.com>

ARG CADDY_FEATURES="git hugo"

COPY system/web/Caddyfile /etc/Caddyfile

