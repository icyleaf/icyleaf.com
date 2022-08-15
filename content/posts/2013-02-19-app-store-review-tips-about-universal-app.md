---
title: "针对 Universal 应用上线 App Store 的提示"
date: "2013-02-19T12:34:56+08:00"
categories:
  - Technology
tags:
- iOS
- Xcode
- Universal
slug: "app-store-review-tips-about-universal-app"
description: 上线 Universal 被拒后的想法和思考
---

## 官方禁止新版本支持的设备小余旧版本

[乐居计算器](https://itunes.apple.com/cn/app/le-ju-ji-suan-qi-zui-gei-li/id397735649?mt=8)是我们的第一款 Universal 应用，这次做了重要变化，但仅限于 iPhone 的修改，本想改本次上线仅支持 iPhone 来赶 deadline，临到上线的时候却被 Xcode 报错：

> "This bundle does not support one or more of the devices that were supported in the previous bundle for this app. Bundles must continue to support any devices previously supported."

官方《[App Store Review Guidelines](https://developer.apple.com/appstore/guidelines.html)》却没有提到有这样的限制，最后在官方技术 Q&A 找到答疑，参见 [Why am I getting device support errors when uploading my app?](http://developer.apple.com/library/ios/#qa/qa1623/_index.html)

## iPhone 和 iPad 的排名是分开统计的

不知道大家注意没有，其实就算你发布的 app 是 Universal，但 app store 针对它的排行榜确实分开计算的，因此在做排名统计的时候不要只顾着一个设备的数据。那这个下载的数据怎么计算呢？

1. 什么设备下载就算那个设备的数据
2. 通过 itunes 下载的算 iphone 的数据（Ocz）

> 数据来源：[How does being a universal app affect App Store rankings](http://www.quora.com/How-does-being-a-universal-app-affect-App-Store-rankings)


## iPhone/iPad 新版本改为 Universal，两者都算新品上线

原理同上，不再细说


## iPhone/iPad 还是一劳永逸的 Universal

这是一个众说纷纭的话题，我的个人建议是，如果团队人较少且应用是免费发布，尽可能做成 Universal，减少不必要的维护成本和开发成本（虽然兼容平台会有一些牺牲）；如果是做付费且运营的人员可以支撑，可以最快最能抓住市场需求的点发布 iPhone 版本，通过市场反应去绝对是否开发 iPad 版本，等推广达到一个峰值（这个需要自己衡量）时，可以把 iPhone 或 iPad 的改成 Universal 版本，再次赚上一笔。

当然也有从 Universal 版拆分为 iPhone 和 iPad 的策略，不过我个人对此营销手段感到反感。重要的事让用户失去了占便宜的特殊心理。


### 扩展阅读

* [To Universal or Not](http://www.cocoanetics.com/2011/05/to-universal-or-not/)
* [The Case for Universal Apps](http://blog.iteleportmobile.com/the-case-for-universal-apps)
