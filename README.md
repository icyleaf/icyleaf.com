# icyleaf.com

[![Build Status](https://img.shields.io/circleci/project/github/icyleaf/icyleaf.com/master.svg?style=flat)](https://circleci.com/gh/icyleaf/icyleaf.com)

个人[折腾多年][blog-history-link]的博客网站，虽然更新频率日渐枯竭，在各方面其实一直还在折腾着。趁着 [Let's Encrypt][let-encrypt-link] 福利，
顺便实验 [Alpine Linux][alpine-link] 的兼容性，这就成就了当前 Docker 化的结果。

## 环境工具

### 工具

- [Vultr][vultr-link]: 高性价比且实时计算费用的 SSD VPS
- [Docker][docker-link]: 高性能、低开销并能够保存数据隔离的 OS 虚拟化解决方案
- [Alpine Linux][alpine-link]: 开源且超轻量级（Docker 镜像仅 5MB）还具备完整包管理工具的 Linux 发行版
- [Let's Encrypt][let-encrypt-link]: 免费且好用的 HTTPS 证书

### 部署

> 当前使用 Github Pages 服务部署，以下部署方式年久失修，慎用！

```bash
$ git clone https://github.com/icyleaf/icyleaf.com.git blog
$ cd blog
$ [sudo] docker-compose up -d
```

[blog-history-link]: https://icyleaf.com/2015/12/a-history-of-my-blog/
[let-encrypt-link]: https://letsencrypt.org/
[alpine-link]: http://www.alpinelinux.org/
[docker-link]: https://www.docker.com/
[vultr-link]: https://www.vultr.com/
[vultr-affiliate-link]: http://www.vultr.com/?ref=6863897
[letsencrypt-post-link]: https://imququ.com/post/letsencrypt-certificate.html
[ngix-proxy-ssl-link]: https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion
[compose-production-link]: https://docs.docker.com/compose/production/
