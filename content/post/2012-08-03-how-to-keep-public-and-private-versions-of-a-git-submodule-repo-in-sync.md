---
title: "如何保持在 Git Submodule 代码的开放和私有共存"
date: "2012-08-03T12:34:56+08:00"
categories:
  - Technology
tags:
- Git
slug: "how-to-keep-public-and-private-versions-of-a-git-submodule-repo-in-sync"

---

假设我在 github 有一个开源的版本库 x 供大家使用，该库里面又包含了好些个 submodules，其中有一个 submodule 名为 a 是自己在 github 又创建的:

```
$ git submodule add http://github.com/icyleaf/a.git modules/a
```

现在问题是，由于代码需要更新，同时涉及到了 a 这个 submodule，但是它的添加 url 是 read-only，由于 x 这个库是供大家使用，因此 a 又不能设为 private：

```
$ git clone git@github.com:icyleaf/a.git modules/a
```

目前想到的方法是在 x 库以外 clone 下来 a，进行私有的写入和 push 到 github 上面，然后在 x 库的 a 里 git pull 下来获得最新的代码。

如何解决这样的问题，能够当大家全部 clone 下来，而自己开发也能避免麻烦？在一篇文章上面找到了灵感，折腾了一番搞定了 !

该文章有一节讲到，开发者如果经常需要更新 submodule ，即可更换 submodule 的 remote url：

```
$ cd commonlib
$ git remote rm origin
$ git remote add origin ssh://mark@git.mysociety.org/data/git/public/commonlib.git
$ git remote -v origin ssh://mark@git.mysociety.org/data/git/public/commonlib.git

However, you’ll find that two helpful config options will have been
deleted when removing and adding back origin, so you’ll want to add
these back.

$ git config branch.master.remote origin
$ git config branch.master.merge refs/heads/master
```

首先我也先对 a 进行 git remote -v，结果显示：

```
origin http://github.com/icyleaf/a.git (fetch)
origin http://github.com/icyleaf/a.git (push)
```

发现和文章里面的显示的结果不一样，于是我就在想能不能在 remote
上面做些手脚，首先看下 git remote 的 help，发现有一条是可以单独设置 remote
push 的 url ，也就是更换上面 git remote -v 中 push 的 url，尝试：

```
$ git remote set-url --push origin git@github.com:icyleaf/a.git
```

再次执行 remote -v:

```
origin http://github.com/icyleaf/a.git (fetch)
origin git@github.com:icyleaf/a.git (push)
```

执行成功！然后随意 commit 并 push orgin master，成功！

搞定！
