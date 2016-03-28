title: OSX
date: 2010-12-08 12:34:56
category: Technology
tags:
- Mac
- Linux
- Shell
permalink: switer-between-finder-and-terminal-in-osx

---

**在 Finder 打开 Terminal 并切换到当前目录**

安装一个开源的 Finder 辅助工具：[cdto](http://code.google.com/p/cdto/)。功能只有一个就是实现在 Finder
打开 Terminal 并切换到当前 Finder 目录。找到你系统的版本的 app （支持当前
OS X 10.4 以上版本，应该都是雪豹了 吧）拷贝到 Applications 下并把它拖到
Finder 的工具栏上即可。

**从 Terminal 中用 Finder 打开当前路径的目录**

```
$ open .
```

PS，如果是 Ubuntu 系统的话请安装 nautilus，然后在 Terminal 里面输入

```
$ nautilus .
```