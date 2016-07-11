docker run -d -p 80:80 -p 443:443 --restart=always \
    --name nginx-proxy \
    -v /etc/nginx/certs:/etc/nginx/certs:ro \
    -v /etc/nginx/vhost.d \
    -v /usr/share/nginx/html \
    -v /var/run/docker.sock:/tmp/docker.sock:ro \
    jwilder/nginx-proxy

docker run -d --restart=always \
    --name nginx-letsencrypt \
    -v /etc/nginx/certs:/etc/nginx/certs:rw \
    --volumes-from nginx-proxy \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    jrcs/letsencrypt-nginx-proxy-companion


docker run -d --restart=always \
    --name icyleaf.com \
    -v /data/data/icyleaf.com:/usr/share/nginx/html \
    -e "VIRTUAL_HOST=icyleaf.com" \
    nginx