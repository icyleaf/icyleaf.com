---
title: "升级  OS X 10.8 和 Python 第三方库那点事"
date: "2012-08-24T12:34:56+08:00"
categories:
  - Technology
tags: 
- Python
- Mac
slug: "upgrade-osx-10-8-with-python-library"

---

今天把公司的机器升级到了 10.8 本来就觉得 OS X
的平滑升级做的非常的好，除了一些被乔帮主鄙视的 JDK
需要重新安装外，其他的一切都很平滑的迁移过来。中午的时候想用 django
练手做个晓项目，熟练的在终端创建新项目，结果爆出如下错误：

> pkg_resources.DistributionNotFound: distribute==0.6.27

顺是看了下 `/Library/Python/2.7/site-packages`
竟然发现里面没有任何的库，心里想估计是升级的适合系统清理掉了，那只能重新安装下了，于是又输入：

```
$ sudo pip install django
```

再次报错：

> pkg_resources.DistributionNotFound: pip==1.1

外头想想也对，python 的库都被清掉了，那只能使用 easy_install 了啊（犯2啊！）

```
$ sudo easy_install pip
```

继续报错 = =!

> pkg_resources.DistributionNotFound: distribute==0.6.27

Ocz，肿么又报错了...迅速脑中确认几件事情：

​1. Python 是否是调用的系统默认的 - √

​2. 确认 easy_install 是否存在 - √ （不仅存在，连没有了的 pip 和
virtualenv 还存在软链接）

​3. distribute 是啥 - ˚∆˚ （Python 新手成长中）

于是网上查询发现也有不少遇到升级 10.8 发现 pip
不见了，但是他们提供的解决方案是：

```
$ sudo easy_install -U pip
```

但是在我本地执行还是报 `distribute`
不存在，看了需要重新安装它了吧，既然不能通过包管理软件执行，那只有官方下载源码安装了：

```
$ curl -O http://python-distribute.org/		$ distribute_setup.py && python
$ distribute_setup.py
```

安装成功之后就有可以从本篇开头的操作继续重装下去了 T_T

补习知识：

> distribute 0.6.28

> Easily download, build, install, upgrade, and uninstall Python
packages
