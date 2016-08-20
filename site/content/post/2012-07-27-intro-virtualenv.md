---
title: "初次接触 virtualenv"
date: "2012-07-27T12:34:56+08:00"
categories:
  - Technology
tags:
- Python
- Virtualenv
- Django
slug: "intro-virtualenv"

---

python 的 virtualenv 功能看着类似于 Ruby 的 RVM，其实这两个东西我都没有用过，本身脚本语言用的最熟练的是 php，最近觉得 php 在处理一些多线程和终端繁琐的事情上有些局限性。决定熟悉下 python 并尝试用 django 做一个小应用。

由于本身 [OpenParty](http://github.com/openparty/openparty) 的代码也是基于 django 开发的，加上最近也开始使用了 virtualenv，这样正好解决了不同项目在使用不同的环境造成的一些困扰。

OS X 本身已经安装了 easy_install 可以通过命令安装：

```
$ easy_install pip
```

安装好之后，可以为每个项目创建一个专属的开发环境，这个环境可以单独存放在一个目录下面，比如：

```
~/envs
      \
      |- env1
      |- env2
      \- env3
```


创建一个的纯净的开发环境:

```
$ virtualenv --no-site-packages <env_name>
```

进入专属的开发环境：

```
$ source <env_name>/bin/activate
```

你会发现 `(<env_name>)` 会出现在你终端提示的前面，这个时候就说明进入该环境，以后的任何和 python 相关的依赖都是在这个环境下面，和系统全局的不受任何影响。

比如通过快速安装项目的依赖：

```
(env_name)$ pip install -r requirements
```

下载的依赖都会存放在这个路径：

```
<env_name>/lib/python2.7/site-packages/
```

退出当前的开发环境：

```
$ deactivate
```

资料参考：

1. [OpenParty README](http://github.com/openparty/openparty)
2. [virtualenv](http://www.virtualenv.org/)
3. [开始使用Virtualenv](http://jsome.net/blog/2010/06/11/start-to-use-virtualenv)
