---
title: 如何使用 Docker 管理 Jenkins
date: 2018-04-18T14:44:32+08:00
slug: how-to-manage-jenkins-with-docker
categories:
- Technology
tags:
- Docker
- Jenkins
index: ''
comments: true
share: true
menu: ''
---

官方的 [jenkins](https://hub.docker.com/_/jenkins) 镜像已经不再维护管理而是由 Jenkins Community 进行更新，鉴于 Jenkins 的更新频率特别快社区版本会提供两个版本：

- `lts` 长期稳定版本，但还是会有新版提醒
- `latest` 每周更新版本

都是基于 alpine 系统封装因此镜像的体积会大大减小很多。如果你是内网使用可以不用在意更新问题长期使用一个版本也没太大问题。

## 安装

创建镜像时需要注意几个地方：

1. 关联本地 volumes
1. 设置时区（默认是 UTC 时间）
1. 映射 50000 端口（这个是 master 和 slave 的通讯端口）和 8000 端口（Web）

```bash
docker run -d --restart=always
    -p 8000:8080 -p 50000:50000
    -v /var/lib/docker/jenkins:/var/jenkins_home
    -e JAVA_OPTS=-Duser.timezone=Asia/Shanghai
    jenkins/jenkins:lts
```

对于进行设置 JAVA 的参数可以参考：https://github.com/jenkinsci/docker/issues/45

## 配置 Jenkins 的插件源

使用过它的人都知道管理和安装插件是一个奇慢无比的事情，虽然提供了代理服务器但我这还有一个更好的方案。

我在翻阅国内镜像源网站的时候发现清华大学开源软件镜像站其实提供了国内 Jenkins 插件的镜像源但一直很低调的没有公布，通过进入`管理插件 -> 高级`页面拉到最底部有个升级站点的自定义框，填入

```bash
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```

安装插件的时候系统默认会测试网络就是 ping 下 Google 的网站，它会提示失败但不用担心它会继续尝试下载和安装插件。

## 升级

此方法适用于所有的容器的升级步骤。

首先需要找到容器的名字，这里我想会有不少人会问为什么你在创建一个容器的时候不指定一个名字，
那是因为后面还需要创建一个新版本的容器而名字不能一样，因此我现在创建都让 docker 随机分配。

```bash
$ docker ps
CONTAINER ID  ...   NAMES
8f48718fdd07  ...   naughty_pasteur
```

拿到之后先停止运行后，创建一个数据备份容器再进行拉取最新版本

```bash
$ docker stop naughty_pasteur
$ docker docker create --volumes-from naughty_pasteur --name jenkins-data jenkins/jenkins:lts
```

拉取最新版本后恢复数据：

```bash
$ docker pull jenkins/jenkins:lts
$ docker run -d --restart=always
    --volumes-from jenkins-data
    -p 8000:8080 -p 50000:50000
    -v /var/lib/docker/jenkins:/var/jenkins_home
    -e JAVA_OPTS=-Duser.timezone=Asia/Shanghai
    jenkins/jenkins:lts
```

确保通过 web 访问和 build 正常后删除老的和数据备份的容器

```bash
$ docker rm naughty_pasteur
$ docker rm jenkins-data
```

## 疑惑解答

### 1. 我忘记设置时区但我进实例修改了时区在 Jenkins 里不生效

在 Jenkins 的系统设置页面找到脚本命令行运行：

```java
System.setProperty('org.apache.commons.jelly.tags.fmt.timeZone', 'Asia/Shanghai')
```

执行后即时生效无需重启，方法来自[官方文档](https://wiki.jenkins.io/display/JENKINS/Change+time+zone)

## 官方文档

https://github.com/jenkinsci/docker/blob/master/README.md
