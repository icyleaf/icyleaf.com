title: 升级 xcode 4.3.1
date: 2012-03-09 12:34:56
category: Technology
tags:
- XCode
permalink: upgrade-xcode-431

---

下载 XCode 目前有两种途径：

​1. [Mac App Store](http://itunes.apple.com/us/app/xcode/id497799835?mt=12)

​2. [Apple Developer Download Page](https://developer.apple.com/downloads/index.action)
(需要有开发者账号并登陆）

对于前者好处在于免费下载但下载时间或许非常漫长；但后者如果条件都满足的话（apple developer id + [script](http://t.cn/zOcn4KN) + vps + axel）那就可以非常快速的下载到页面上面的所有资源。

XCode 4.3 之后的版本采用核心和模块分离，现在主程序只有 1.8G 左右，其余的包括 Command line tools + dashcode + graphics tools（同样可以使用上面的脚本）需要单独按需下载。但这还不是变化最大的，最大的地方在于之前版本都是存放在 `/Developer` 路径下面，4.3 之后的版本统一改放在了 `/Applications`下面，下载 dmg 打开后直接把 Xcode 拖入 `/Applications` 即可。

安装完毕后首次启动，会有一个提示，这点需要非常注意，新版的会要求你把 `/Developer` 以及 `/Applications/Install Xcode` 一并移动至回收站，注意是整个目录完全移动。假如你的机器安装了其他的开发工具放置在了`/Developer` 了，这里就需要谨慎处理。

初次之外，我参考 [Use Your Loaf](http://useyourloaf.com/blog/2012/2/17/updating-to-xcode-43.html)的博文，假如你的环境还需要依赖 Command line tools for xcode，除了下载和安装的过程，还需要在终端作下处理。比如上面提到博文所说的 `agvtools` 管理 App 版本自动化的工具。在升级 4.3+ 版本可能就会出现下面的错误

```
$ agvtools
Error: No developer directory found at /Developer.
Run /usr/bin/xcode-select to update the developer directory path.
```

Use Your Loaf 博文提到需要使用 `xcode-select` 重新选择 Xcode 的安装路径，来保证终端工具可以正常运行，但是在 4.3.1 中我尝试还是失败。提示如下：

```
$ sudo /usr/bin/xcode-select -switch /Applications/Xcode.app
$ agvtool
Error: Can't run /Applications/Xcode.app/usr/bin/agvtool (no such file).
```

经常检查发现，实际上 Command line tools 安装后存放在 `/Applications/Xcode.app/Contents/Developer/usr` 路径下面，尝试更正操作:

```
$ sudo /usr/bin/xcode-select -switch /Applications/Xcode.app/Contents/Developer/

搞定！

---------华丽丽的分割线---------

**Instruments 哪里去了？**

哼哼，尝试在 Xcode 图标右键 "Open Developer Tool"，看到了吧，还有一些其他的工具 :)
