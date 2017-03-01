FROM icyleafcn/alpine:latest
MAINTAINER icyleaf <icyleaf.cn@gmail.com>

ENV CADDY_FEATURES "git hugo"

RUN apk --update --no-cache add curl openssh-client git tar
ONBUILD RUN FEATURES_LIST=$(echo $CADDY_FEATURES | sed 's/ /%2C/g') && \
    curl --location --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
      "https://caddyserver.com/download/build?os=linux&arch=amd64&features=${FEATURES_LIST}" \
      | tar -C /usr/bin/ -xz caddy && \
    /usr/bin/caddy -version

ADD . /site

WORKDIR /site
VOLUME /site

EXPOSE 80 443 2015

ENTRYPOINT ["/usr/bin/caddy"]
CMD ["-conf", "/site/system/etc/Caddyfile"]
