---
title: "初学 git 入门"
date: "2008-11-07T12:34:56+08:00"
categories:
  - Technology
tags:
- Git
slug: "new-guy-to-git"

---

> Git 是用于 Linux 内核开发的版本控制工具。与常用的版本控制工具 CVS, Subversion 等不同，它采用了分布式版本库的方式，不必服务器端软件支持，使源代码的发布和交流极其方便。Git 的速度很快，这对于诸如 Linux kernel 这样的大项目来说自然很重要。Git 最为出色的是它的合并跟踪（merge tracing）能力。


当前大多数人用的还应该是 SVN 服务，不过上次见到 [CNBorn][] 同学使用 ~~git~~（Bazzer） 做版本控制，其实知道它很早不过没有过多的了解，在我稍微了解之后发现 git 比 svn 更具潜力，可惜对于 PHP 的用户来说还没有多少人开始用 git 甚至我在 PHPChina 的论坛看到有人问 git 的问题，居然有人回答 git 是什么...

同样 git 支持多平台且对于 Windows 的用户也有 GUI 的管理界面。通过几天的了解是使用稍微掌握了一点入门的东西（以下都是命令行的东西，如果你想学习使用 GUI 的操作请看[此讲解视频][]）；

首先是下载并安装 [git][]。接着设置用户标识：

```txt
$ git config --global user.name yourname
$ git config --global user.email example@mail.com
```

然后创建一个目录作为版本库：

```txt
$ mkdir examplecd examplegit init
```

把本地文件同步到远程 git host 服务网站上面


```txt
# 添加文件
$ git add filename

# 提交说明并提交
$ git commit -m 'first commit'

# 添加到远程地址，这个地址不固定，以 git hosts 提供地址为准
$ git remote add origin git@example.com:username/example.git

# 提交 origin 到 master
$ git push origin master
```

另外，如果使用网上的 git host 服务，还涉及到设置 ssh public key 的问题，各个平台有些细微的差别，大家看 github 网站的[相关帮助][]。

如果你想系统的学习 git， 不妨通读下 [《看日记学git》系列文章][]

  [CNBorn]: http://blog.donews.com/CNBorn
  [此讲解视频]: http://gitcasts.com/posts/git-on-windows
  [git]: http://git-scm.com/download
  [相关帮助]: http://github.com/guides/providing-your-ssh-key
  [《看日记学git》系列文章]: http://roclinux.cn/?p=914
