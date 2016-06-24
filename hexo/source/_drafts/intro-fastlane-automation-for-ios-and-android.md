---
title: Fastlane - iOS 和 Android 的自动化构建工具
date: 2016-06-23 05:36:07
permalink: intro-fastlane-automation-for-ios-and-android
tags:
- iOS
- Android
- CI
- CD
---

初时 fastlane 的时候是去年的 11 月份，看到大就感觉遇到了神器一般的惊喜。它一个针对于 iOS 和 Android（后来才支持的）全方位自动化流程的工具，请看下图

![fastlane-flow](https://fastlane.tools/assets/img/intro-fastlane-tree.png)

流程图中每个环节都是独立的工具，每个工具只干一件事情，分工非常的明确。以下是我在团队项目中用到的：

- [scan](https://github.com/fastlane/fastlane/tree/master/scan) 自动化测试工具，很好的封装了 Unit Test
- [sigh](https://github.com/fastlane/fastlane/tree/master/sigh) 针对于 iOS 项目开发证书和 Provision file 的下载工具
- [match](https://github.com/fastlane/fastlane/tree/master/match) 同步团队每个人的证书和 Provision file 的超赞工具，规范[代码签名](https://codesigning.guide/)（虽然里面有些设定比较损）
- [gym](https://github.com/fastlane/fastlane/tree/master/gym) 针对于 iOS 打包和签名的自动化工具，完爆 `xctool`，而 `shenzhen` 也放弃维护
- [qyer](https://github.com/icyleaf/fastlane-qyer) 团队定制的工具，用于检测包和上传到自己的内部分发平台
- [fastlane](https://github.com/fastlane/fastlane) 简单理解就是控制整体流程和实现的框架容器

我在团队中搭建了一个自动化构建的平台，主要用于解放开发的宝贵时间和打断的分神，让测试和产品、运营等相关同事自己构建和安装会方便很多。

fastlane 提供的流程的众多工具都是可以独立存在和使用（提供 cli 命令），也可以统一由 fastlane 来控制。它在使用中提出了两个概念：

- `action`: 由 fastlane 调用的动作（可以是内部也可以是外部自定义扩展），封装调用的参数来实现特定的功能
- lane



