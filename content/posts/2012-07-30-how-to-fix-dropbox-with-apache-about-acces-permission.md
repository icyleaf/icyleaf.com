---
title: "Dropbox和Apache关于权限的问题"
date: "2012-07-30T12:34:56+08:00"
categories:
  - Technology
tags:
- Dropbox
- apache
slug: "how-to-fix-dropbox-with-apache-about-acces-permission"

---

自从上次 SSD 硬盘不小心挂了之后，就算是返厂检修，一旦是算坏只能更换新的无法提供维修服务。这次我对待一些数据就更加小心了。尤其是代码，其实这次代码也并没有损失多少，丢失了一些平时的练习的项目。但为了保证代码的完整性和整体的同步性，我决定使用 Dropbox 同步我的代码。这样平时练习的代码也不必丢到 Github 或者花麻烦自建的服务器上面，什么都不需要操作就可以同步与无形之中。

移动用户目录的 src 至 Dropbox 目录并创建软链接：

```
$ mv ~/src ~/Dropbox/src
```

```
$ ln -s ~/Dropbox/src ~/src
```

如果这是写 Dropbox 同步代码的事情，那到这里就结束了，后来发现 apache
无法访问 php 的目录，报如下错误：

> Symbolic link not allowed or link target not accessible:
/Users/icyleaf/src

这个问题是因为我 VirtualHost 是这样配置的，使用的是经过处理的软链接的方式访问，而 apache 默认不允许这种行为：

```
<directory " users icyleaf src php">

	Options Indexes FollowSymLinks MultiViews Includes

	AllowOverride All

	Order allow,deny

	Allow from all

</directory>
```

但是我 Directory 已经配置了 `Options FollowSymLinks` 但还是报如下错误，经过反复的检查 `/Users/icyleaf/src` 目录的权限也没有问题，最后只能在配置里把软链接替换成原始路径：

```
<directory " users icyleaf dropbox src php">

	Options Indexes FollowSymLinks MultiViews Includes

	AllowOverride All

	Order allow,deny

	Allow from all

</directory>
```

发现还是无法访问，但是报了的是另外一个错误：

> Permission denied: access to / denied

又是一番折腾，最终发现居然是坑爹的 Dropbox 的访问权限居然是：

```
drwx------@ 21 icyleaf staff 714 7 30 06:07 Dropbox
```

调整权限：

```
$ chmod o+w ~/Dropbox
```

再次查看权限:

```
drwxr-xr-x@ 21 icyleaf staff 714 7 30 06:07 Dropbox
```

再次访问权限没有问题，替换为原来的软链接方式访问，一切搞定！
