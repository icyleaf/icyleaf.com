---
title: "Git 和 Pager 的那点事"
date: "2013-10-16T12:34:56+08:00"
categories:
  - Technology
tags:
- Git
- Linux
slug: "about-pager-on-git"

---

 > Git 几乎所有命令都提供分页器，即当命令输出超过一页时，自动在每页输出后暂停，可以按空格继续显示，按 q 退出。

默认 git 的 `pager = less -FRSX`，这个可以通过两种方式更改：

命令：

```
$ git config --global core.pager "less -FRSX"

```
配置文件：

```
$ vim ~/.gitconfig
```

了不起了通过设置自动匹配的色彩来增强可读性

```
$ git config --global color.ui on 	
```

随着 [tig](http://jonas.nitro.dk/tig) 的出现，给 git 的增加了一个强大武装武器。（不明观众看这里先对它有个感官概念：[tig, the ncurses front-end to Git](http://gitready.com/advanced/2009/07/31/tig-the-ncurses-front-end-to-git.html)）

可能大家不知道 tig 本身就可以也是一个 pager，因此我们可以在 git config 默认替换之：

```
$ git config --global core.pager tig
```

自从这样配置之后，让我幸福了好几年。直到...今天发现一个怪异的问题，使用任何需要显示 tig pager 的地方设置的配色是以代码形式显示，而不是解析成了终端显示的颜色。最近忍不住升级到了 10.9 并更新了一些命令，因此也没搞清楚到底是哪里出了问题。只能先把 git 自带的 color 渲染给关闭才解决了这个问题

```
$ git config --global color.ui off
```

我的个人 `.gitconfig` 等配置文件：https://gist.github.com/icyleaf/868866
