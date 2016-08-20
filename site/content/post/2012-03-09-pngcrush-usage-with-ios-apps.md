---
title: "pngcrush 的一些用法"
date: "2012-03-09T12:34:56+08:00"
categories:
  - Technology
tags:
- iOS
- Mac
slug: "pngcrush-usage-with-ios-apps"

---

pngcrush 顾名思义，看起名字本身就优化 png 的工具，为什么会提到它呢，因为目前所有 iOS app 自身的 png 文件都是经过它优化的，对于优化有的 png，系统本身默认是无法识别的（包括看图工具，作图工具）。但这个工具不仅仅可以优化还可以还原。假如你希望可以学习优秀 iOS App 的一些 png 资源设计，通过这个工具延伸的一些辅助工具，可以快速预览和恢复未优化的图片。

# pngcrush

本身就是一个开源的工具，托管在 [SourceForge](http://pmt.sourceforge.net/pngcrush/index.html)，可以在任何平台运行，对于安装 Xcode 的童鞋，此工具默认放在：

```
# XCode 4.3+
/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/usr/bin/pngcrush

# XCode 4.2.x 以下版本
/Developer/Platforms/iPhoneOS.platform/Developer/usr/bin/

# 还原 ipa 目录下所以 png 文件到 reverted 目录下面
pngcrush -dir reverted -revert-iphone-optimizations -q ipa/*.png
```

这里还有一些其他版本的[类似工具](http://stackoverflow.com/questions/7138700/pngcrush-uncrush-on-linux)

# Quicklook

OSX 有个系统的快速预览功能，简单的解释（针对于图片来说）：可以显示图片的内容，同时选中文件，按**空格**对于系统可以识别的即可快速查看文件的内容。

但由于 iOS app 的 png 文件是优化后的，既然系统无法识别，那就更别提 Quicklook 了，于是利用 pngcrush 就有了新的产物：PngUncrush.qlgenerator。有了它就可以用 Quicklook 显示和查看 png 图片了。

目前利用这个工具做成的工具很多，包括用 shell 安装的，pkg 文件，实际上原理都是把这个文件丢到系统 `/Library/QuickLook/` 或者 `~/Library/QuickLook/` 下面即可。

我觉得比较好用的是 [Quicklook Plugins for Mac](http://castelliweb.com/blog/2010/05/24/quicklook-plugins-for-mac/)，这是一个 pkg 安装文件，不仅包括了对于 png 文件的快速预览，同时对于 ipa 文件的图表也会更换为更为直观的 App 图标，方便大家的浏览和识别。


# atPeek

我就知道你不会满足上面半自动的工具，我想 [atPeek](http://www.atpurpose.com/atPeek/)(奇怪为什么会被墙掉) 也是你在本博文中最满意的工具。正式介绍下，这个工具自打开的一瞬间，就会加载 `Music/iTunes/Mobile Applications` 目录下面的所有 ipa 文件。点击你需要查看的 ipa 文件，不仅可以查看该 ipa 的基本 App，最让大家爽的是，ipa 的所有资源文件以文件资源管理器的方式呈现出来。嗯，没错！我可以看到你们双眼发光了！

但是，这是一个付费应用，你可以进行的操作就是浏览 ipa 和应用自带的预览功能，任何的放大以及导出 png 资源，都是需要付费的，价格为 $4.99。
