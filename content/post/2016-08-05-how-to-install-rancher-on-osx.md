---
title: "如何在 OS X 上安装 Rancher"
slug: "how-to-install-rancher-on-osx"
date: "2016-08-05T17:21:08+08:00"
image: http://docs.rancher.com/img/rancher/rancher_overview_2.png
comments: true
categories:
  - Technology
tags:
  - Mac
  - OSX
  - Docker
  - Rancher
---

Rancher 是 Docker 编排解决方案的一种，好处在于可以做容器编排，网络，存储，负载均衡，还能够支持云服务器（比如 Amazon EC2/Azure/DigitalOcean）也能够兼容 Docker Swarm/Mesos/Kubernetes 等其他的解决方案。自它还没有发布 [1.0](http://rancher.com/announcing-rancher-1-0-ga/) 版本之前也有持续的关注。它自身还有个 [RancherOS](http://www.infoq.com/cn/news/2015/03/rancheros-docker-linux) 对于 CoreOS 也是一个不小的威胁。

![rancher-intro](http://docs.rancher.com/img/rancher/rancher_overview_2.png)

由于它提供非常优化的后台管理界面，同时也提供 REST API，日常开发使用中异常的方便。如果非要说出一点不好的，那可能就是它对内存有点小要求：**最小 1GB 内存**，因此如果想放在自己 VPS 上的童鞋需要评估下了。

## Mac 安装

这块也趁着 [Docker for Mac](https://docs.docker.com/docker-for-mac/) 的好处，终于摆脱的 `docker-machine` 的折磨，不用在依赖 VirtualBox，也不在每次装载 machine 的变量和查找虚拟机的 IP。映射的端口端口都通过 `localhost` 访问。

Rancher 通过 Docker 来安装本来说是非常简单的，它分为服务端和客户端。本教程以 [Single Node](http://docs.rancher.com/rancher/latest/en/installing-rancher/installing-server/) 来讲解，不考虑 [Multi Node](http://docs.rancher.com/rancher/latest/en/installing-rancher/installing-server/multi-nodes/)。

这块网上一直没有太好的解决方案，我看很多国外给出的[解决方案](https://gist.github.com/axnux/09dc375d71398cbbee44ebd23ba35a08)也比较麻烦，主要是由于 Docker for mac 使用的是 xhyve 作为轻量化的虚拟化方案，而 rancher 安装 server 端没有任何问题，在添加主机的时候需要通过 HTTP 来连接 server 端而失败。下面我来带大家用最简单的方案来拆解。无需任何第三方的辅助。

### 服务端

> 如果网速连接 docker hub 过慢可考虑使用代理设置或者国内的镜像服务，我这里分享一个 `https://docker.mirrors.ustc.edu.cn`，可在 Docker -> Preferences... -> Advanced -> Registry Mirror 添加。

```bash
$ docker run -d --name rancher-server --restart=always -p 8080:8080 rancher/server
$ docker logs -f rancher-server

time="2016-08-05T16:48:52Z" level=info msg="Creating schema machine, roles [service]" id=1ds17
time="2016-08-05T16:48:53Z" level=info msg="Creating schema machine, roles [project member owner]" id=1ds18
time="2016-08-05T16:48:53Z" level=info msg="Creating schema machine, roles [admin user readAdmin]" id=1ds19
time="2016-08-05T16:48:53Z" level=info msg="Creating schema machine, roles [readonly]" id=1ds20
```

看到如上类似的日志说明服务已经初始化完毕，通过浏览器访问 `http://localhost:8080` 就可以看到后台管理界面。

### 客户端

先不着急继续页面操作，回到终端上执行如下命令获取 rancher-server 容器的 IP 地址备用

```bash
$ docker inspect --format '{{ .NetworkSettings.IPAddress }}' rancher-server
172.17.0.2
```

接着上面的步骤，在打开页面能看到 Add Host 按钮并点击对于弹出 “Host Registration URL” 选择 “Something else:” 在后面的输入框填入上面的 IP 和端口号 `http://172.17.0.2:8080` 并保存。

之后就是给你一个客户端（部署主机）的选项，由于我们只添加本机作为部署主机使用，因此这里选择 Custom，其他不用任何设置，直接滑倒最底部找到一个执行 docker 命令的区域：

![add rancher host](http://ww2.sinaimg.cn/large/006tNbRwjw1f6jdkffiqhj31ee150k0c.jpg)

```bash
$ docker run -d --privileged -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/rancher:/var/lib/rancher rancher/agent:v1.0.2 http://172.17.0.2:8080/v1/scripts/676576FFEC2212A68391:1470416400000:tfqxfdglHL6Qw8dpLVtbOesYY4
```

你会发现执行可能会报错：

```bash
docker: Error response from daemon: Mounts denied:
The path /var/lib/rancher
is not shared from OS X and is not known to Docker.
You can configure shared paths from Docker -> Preferences... -> File Sharing.
See https://docs.docker.com/docker-for-mac/osxfs/#namespaces for more info.
```

目前有可能是一个 Docker 的 Bug，因为 `/var/lib/rancher` 是挂载到已经默认添加 `/private` 文件共享，但是它还是报错，如果你在 Docker 设置的 File Sharing 添加的话它也不会让你添加，因此我们需要做一点小修改：

```bash
$ docker run -d --privileged -v /var/run/docker.sock:/var/run/docker.sock -v ${HOME}/docker/rancher/var/lib/rancher:/var/lib/rancher rancher/agent:v1.0.2 http://172.17.0.2:8080/v1/scripts/676576FFEC2212A68391:1470416400000:tfqxfdglHL6Qw8dpLVtbOesYY4
5cf22a10cf28b4182b6e205fa631146e86d67c3c9d86901ff8cf7ab087319a29
```

最后点击页面的 Close 后会跳转到 Host 的列表，你就能惊喜的发现添加成功了！

![rancher host](http://ww2.sinaimg.cn/large/006tNbRwjw1f6jdidcojkj315y0m4dik.jpg)

## 结尾

本篇只先解决这一个问题，更多使用的资料请看[Rancher 实战红宝书](http://rancher.hidocker.io/)。



