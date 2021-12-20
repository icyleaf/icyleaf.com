---
title: "友盟 iOS 发布渠道自动化脚本"
date: "2012-05-10T12:34:56+08:00"
categories:
  - Technology
tags: 
- XCode
- iOS
- Shell
- umeng
slug: "ios-publish-channel-packger-for-umeng"

---

现在公司的大多数手机项目的统计服务都是用的[友盟](http:///www.umeng.com)，而自使用之初到现在都有一个渠道管理的功能，这个最后打包的时候实际上可能会产生一点点的麻烦，最早第一个 app 发布的时候，写了一个半自动的脚本，凑合用了很久，现在觉得需要完全自动化，于是借鉴之前 [testflightapp 的自动化脚本](http://icyleaf.com/2012/04/automating-script-to-testFlight-from-xcode/)，重新改造脚本。

实现分两部分：

* iOS 代码
* 自动化脚本

实现原理很简单，我利用一个文本文件放置在项目当中（比如：`PublishChannel.txt`），里面只需要存上发布渠道的名字，默认是 `App Store`。在代码中只需要想友盟调用函数的时候，读取这个文件即可。只需要做这样简单的工作就结束了 iOS 代码部分的工作。

主要的功能基本上都是由自动化脚本完成。因为它要去标记分发渠道，处理打包工作：

1. 打包需要一个符合官方发布要求的 Icon，即 512x512 px，PNG 格式且名字必须是 `iTunesArtwork` （不能包含后缀，无比保证在终端检查）
2. 修改 PublishChannel.txt 的分发渠道
3. 同时需要把 .app 的文件放在 `Payload` 并和 `iTunesArtwork` 一起打成 ipa 包（实际上就是一个 zip，改成了 ipa）

这样看起来其实工作也不复杂，只不过分发渠道多了就是有些浪费时间。同样还是采用了 Archive 的 Post-Action，这里面可以插入脚本以及外部的调用脚本（如果看不到下面的具体代码，请[点击这里](https://gist.github.com/2650508)：

<script src="https://gist.github.com/2650508.js?file=package.sh"></script>
