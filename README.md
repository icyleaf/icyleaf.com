# icyleaf.com

个人[折腾多年][blog-history-link]的博客网站，虽然更新频率日渐枯竭，在各方面其实一直还在折腾着。趁着 [Let's Encrypt][let-encrypt-link] 福利，
顺便实验 [Alpine Linux][alpine-link] 的兼容性，这就成就了当前 Docker 化的结果。

## 环境工具

### 工具

- [Docker][docker-link]: 高性能、低开销并能够保存数据隔离的 OS 虚拟化解决方案
- [Alpine Linux][alpine-link]: 开源且超轻量级（Docker 镜像仅 5MB）还具备完整包管理工具的 Linux 发行版
- [Let's Encrypt][let-encrypt-link]: 免费且好用的 HTTPS 证书
- [Vultr][vultr-link]: 高性价比且实时计算费用的 SSD VPS（本博客正在使用）

### Docker 镜像

- [icyleafcn/alpine-hexo][alpine-hexo-link]
- [jwilder/nginx-proxy][nginx-proxy-link]
- [JrCs/docker-letsencrypt-nginx-proxy-companion][ngix-proxy-ssl-link]

### 部署

```bash
$ [sudo] docker-compose -f docker-compose.yml -f production-single.yml up -d
```

如果博客需要支持 `nginx-proxy` 和 `docker-letsencrypt-nginx-proxy-companion` 可用：

```bash
# 该命令还有缺陷，请勿使用
$ [sudo] docker-compose -f docker-compose.yml -f production-single.yml up -d
```

关于更多 `docker-compose` 在生产环境下的用法，请看 [Using Compose in production][compose-production-link]

## 为什么要这样做

> TODO: 完成文章并添加链接

## 使用说明

基于我维护的镜像 [alpine-hexo][alpine-hexo-link] 自定义自己的博客系统非常的容易，参见 [Dockerfile](Dockerfile) 文件并仿照结构自行创建和配置。

- 添加 source 目录
- 添加 _config.json 博客全局配置文件
- 添加自定义主题和配置（可选）

当然你也可以直接 fork 本项目并替换自己的资源也是可以的。我的博客涉及一个 git-submodule 来引入第三方 hexo 主题。以下是在 fork 之后的修改步骤：

```bash
# 首先你要先点击本项目页面右上角的 fork 按钮并在项目设置修改自己的域名（其他也可以）
$ git clone git@github.com:<github-id>/<repo-name>.git
$ git submodule init --update
```

### 全局部署

如果你的服务器仅作为个人博客使用的可以采用这个方案施行：

```bash
$ cd icyleaf.com
$ [sudo] docker build -t alpine-hexo .
$ [sudo] docker run -d --name icyleaf.com -p 80:80 alpine-hexo
```

### 隔离部署

> TODO: 去看 [jwilder/nginx-proxy][nginx-proxy-link] README

### 支持 HTTPS 证书

这个就用到了 [Let's Encrypt][let-encrypt-link]，不用手动去网站申请，也不用找第一年免费的证书之后还需要愁第二年怎么办，有了它一切都搞定，
[了解更多][letsencrypt-post-link]。搭配 [JrCs/docker-letsencrypt-nginx-proxy-companion][ngix-proxy-ssl-link] 支持 Docker 很好解决。

> TODO: 去看 [JrCs/docker-letsencrypt-nginx-proxy-companion][ngix-proxy-ssl-link] README


## 下一步工作

- [x] 支持 docker
- [ ] 自动关联和启用 Let's Encrypt
- [ ] 自动发布

## 支持一下

如果你有兴趣尝试或更换 VPS 的话可以使用我的 [Vultr 推荐链接][vultr-affiliate-link] 你和我都可以获得 $10 美金。


[blog-history-link]: http://icyleaf.com/2015/12/a-history-of-blog-migration/
[let-encrypt-link]: https://letsencrypt.org/
[alpine-link]: http://www.alpinelinux.org/
[docker-link]: https://www.docker.com/
[vultr-link]: https://www.vultr.com/
[vultr-affiliate-link]: http://www.vultr.com/?ref=6863897=
[letsencrypt-post-link]: https://imququ.com/post/letsencrypt-certificate.html
[alpine-hexo-link]: https://github.com/icyleaf/alpine-hexo
[nginx-proxy-link]: https://github.com/jwilder/nginx-proxy
[ngix-proxy-ssl-link]: https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion
[compose-production-link]: https://docs.docker.com/compose/production/