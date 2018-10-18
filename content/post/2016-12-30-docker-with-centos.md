---
categories:
- Technology
comments: true
date: 2016-12-30T17:52:30+08:00
image: images/cover.jpg
share: true
slug: "docker-with-centos"
tags:
- docker
- centos
title: Docker 摸爬滚打对抗 CentOS 6
---

> 2018年10月18日更新：

国庆期间恰巧服务器硬盘故障且运维并没有做 raid 备份，给更换了一台新内部服务器，索性升级到了 CentOS 7，因此针对 CentOS 6 安装 Docker 的答疑不再更新。

## 前言

前不久终于把我们移动团队内部服务器从 CentOS 5.x 升级到了 6.8。本来是拜托让升级至 7.0 版本起码能用上 docker 1.12 版本还是靠谱的事情。
事情往往难以预料的被告知其他团队在安装 7.0 之后造成内部服务器群的网卡失灵的诡异故障只能作罢，想想起码还有个早期 docker 版本可安装也就先这么着吧。

这个是在 [如何在CentOS 上安装Gitlab](http://icyleaf.com/2013/09/how-to-install-gitlab-on-centos/) 之后有一个无奈的使用指南，
因为运维也有他的考虑方面，参见知乎讨论：[如何说服运维选择 Debian/Ubuntu 而不是 CentOS](https://www.zhihu.com/question/29191794)

## 安装 Docker

### 1.7.1

Docker 最后一个支持 CentOS 6 的版本是 1.7.1 还必须安装 epel 源之后就[被大家欢天喜地的抛弃了 6 的支持](https://github.com/docker/docker/issues/14365)。

```bash
sudo rpm -ivh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
sudo yum -y remove docker
sudo yum install libselinux-python docker-io
```

> 由于 yum 内 docker 已经被其他使用，不用安装错误了。

### 1.7.1 以上版本

**请果断放弃这种想法**，虽然你可能在网上搜索有个别的文章说把内核升级到 3.10 后可以安装 docker 1.9 版本，经过我个人反复测试根本不可行！

当然如果你还是坚持想尝试，请参考如下链接：

- http://www.pangxie.space/docker/364
- http://www.cnblogs.com/dongdongwq/p/5381752.html
- http://0evin.com/2016/06/17/%5B%E5%8E%9F%E5%88%9B%5DCentOS6.5%E5%AE%89%E8%A3%85Docker1.11.X%E7%89%88%E6%9C%AC/

## 配置 Docker

安装成功后先不要配置开机自启动和启动服务，docker 的官方镜像在国内众所周知的慢的一塌糊涂，如果你是在国内服务器使用请参考如下配置。

我这里把我个人私藏已久的好用的镜像告诉大家，大家可不要以为我用的是阿里云或者 DaoCloud 这类有很多限制的玩意：

- 中国科技大学镜像：https://docker.mirrors.ustc.edu.cn
- 网易蜂巢镜像：http://hub-mirror.c.163.com

同样需要注意的是 1.7.1 版本的 docker 配置文件是在 `/etc/sysconfig/docker` 而不是网上和官方说的 `/etc/default/docker` 打开此文件在 other_args 配置对于的源即可。

```
# /etc/sysconfig/docker
#
# Other arguments to pass to the docker daemon process
# These will be parsed by the sysv initscript and appended
# to the arguments list passed to docker -d

#other_args=
#other_args="--registry-mirror=http://hub-mirror.c.163.com"
other_args="--registry-mirror=https://docker.mirrors.ustc.edu.cn"

DOCKER_CERT_PATH=/etc/docker

# Resolves: rhbz#1176302 (docker issue #407)
DOCKER_NOWARN_KERNEL_VERSION=1

# Location used for temporary files, such as those created by
# # docker load and build operations. Default is /var/lib/docker/tmp
# # Can be overriden by setting the following environment variable.
# # DOCKER_TMPDIR=/var/tmp
```

后面就没什么好说的了，启动服务和设置开机自启动就完事了

```
sudo chkconfig docker on
sudo service docker start
```

验证下启动的服务是否已经配置了国内镜像源

```
$ ps aux | grep "docker -d"

root     16992  0.1  0.1 1239860 32276 ?       Sl   Dec29   2:02 /usr/bin/docker -d --registry-mirror=https://docker.mirrors.ustc.edu.cn
root     26873  0.0  0.0 103332   876 pts/2    S+   18:16   0:00 grep docker -d
```

## 疑难杂症

#### 1. 使用国内镜像源 pull 镜像偶尔会失败，反复几次就可以解决

频次不高原因未知，因此还未重视。

#### 2. Docker Web 管理工具

> 2018年10月更新：

推荐使用 [portainer](https://github.com/portainer/portainer) ，兼容 1.7 的部分功能可能会发生部分功能和参数无法显示但不影响使用。之前我有推荐 rancher（可参考前篇文章：[如何在 OS X 上安装 Rancher
](http://icyleaf.com/2016/08/how-to-install-rancher-on-osx/)），但 rancher 官方要求 docker 最低版本是 1.9+。

#### 3. Docker 进程挂了重启后无法恢复之前的 containers

错误的输出没有实例复现，大概会包含如下关键词 `mount`, `/var/lib/docker/devicemapper/mnt/d640aea67108b04c6a5ba14645966b092db1f807f3e3f41dca7a1470f76b68fb` 这种一般是因为意外终止进程造成上次的 volume 没有正常 unmount，只需手动操作下即可：

```bash
unmount /var/lib/docker/devicemapper/mnt/d640aea67108b04c6a5ba14645966b092db1f807f3e3f41dca7a1470f76b68fb
```

> `d640aea67108b04c6a5ba14645966b092db1f807f3e3f41dca7a1470f76b68fb` 是根据不同 container 生成的，请根据实际情况复制和执行。

这个真没办法，只能在 Dockerfile 或者进实例里面进行修改时区，这个我就不过多赘述了。

#### 4. 宿主机 CST 时间会造成 docker 实例时间不准

这个真没办法，只能在 Dockerfile 或者进实例里面进行修改时区，这个我就不过多赘述了。
