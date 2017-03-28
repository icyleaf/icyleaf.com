# icyleaf.com

[![Build Status](https://travis-ci.org/icyleaf/icyleaf.com.svg?branch=master)](https://travis-ci.org/icyleaf/icyleaf.com)

个人[折腾多年][blog-history-link]的博客网站，虽然更新频率日渐枯竭，在各方面其实一直还在折腾着。趁着 [Let's Encrypt][let-encrypt-link] 福利，
顺便实验 [Alpine Linux][alpine-link] 的兼容性，这就成就了当前 Docker 化的结果。

## 环境工具

### 工具

- [Vultr][vultr-link]: 高性价比且实时计算费用的 SSD VPS（本博客正在使用）
- [Docker][docker-link]: 高性能、低开销并能够保存数据隔离的 OS 虚拟化解决方案
- [Alpine Linux][alpine-link]: 开源且超轻量级（Docker 镜像仅 5MB）还具备完整包管理工具的 Linux 发行版
- [Let's Encrypt][let-encrypt-link]: 免费且好用的 HTTPS 证书

### Docker 镜像

- [icyleafcn/hugo][icyleaf-hugo-link]
- [icyleafcn/caddy][icyleaf-caddy-link]

### Hugo

没错，我又移情别恋了！主题使用自改的 [Casper](http://github.com/icyleaf/hugo-theme-casper)

### 部署

```bash
$ git clone https://github.com/icyleaf/icyleaf.com.git blog && cd blog
$ [sudo] docker-compose up -d
```

### 结构

```
.
├── README.md
├── Dockerfile
├── docker-compose.yml
├── archetypes
│   ├── default.md
│   └── page.md
├── config.yaml
├── content             # 文章内容
│   ├── page
│   └── post
├── layouts
├── logs                # Docker 生成的 http 日志
├── public              # 生成的静态文件目录
├── static
│   └── images
└── themes              # hugo 主题
│   └── casper
└── system              # Docker 容器所需的资源
    ├── site
    │   └── run.sh
    └── etc
        └── Caddyfile
```

关于更多 `docker-compose` 在生产环境下的用法，请看 [Using Compose in production][compose-production-link]

## 支持一下

如果你有兴趣尝试或更换 VPS 的话可以使用我的 [Vultr 推荐链接][vultr-affiliate-link] 你和我都可以获得 $20 美金。

[blog-history-link]: http://icyleaf.com/2015/12/a-history-of-blog-migration/
[let-encrypt-link]: https://letsencrypt.org/
[alpine-link]: http://www.alpinelinux.org/
[docker-link]: https://www.docker.com/
[vultr-link]: https://www.vultr.com/
[vultr-affiliate-link]: http://www.vultr.com/?ref=6863897
[letsencrypt-post-link]: https://imququ.com/post/letsencrypt-certificate.html
[icyleaf-hugo-link]: https://github.com/icyleaf/docker-images/tree/master/hugo
[icyleaf-caddy-link]: https://github.com/icyleaf/docker-images/tree/master/caddy
[ngix-proxy-ssl-link]: https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion
[compose-production-link]: https://docs.docker.com/compose/production/
