---
title: "Fastlane - iOS 和 Android 的自动化构建工具"
tags:
  - iOS
  - Android
  - CI
  - CD
  - Ruby
  - Fastlane
categories:
  - Technology
series:
  - fastlane
slug: "intro-fastlane-automation-for-ios-and-android"
date: "2016-07-11T12:36:07+08:00"
description: 使用 fastlane 提升构建移动应用的效率
---

## 前言

这篇文章整理了很久，发现在一篇文章里无法一一讲述和全面的覆盖，初步打算是把这个做成一个系列，想到哪里就写到哪里，如果恰好有读者爱戴并有一些建议反馈，我也会根据大家的需要调整内容的方向和深度。论美剧的编剧的重要性(笑)。

## 初次邂逅

初时 fastlane 的时候是去年的 11 月份，看到大就感觉遇到了神器一般的惊喜。它一个针对于 iOS 和 Android（后来才支持的）全方位自动化流程的工具，请看下图

![fastlane-flow](https://fastlane.tools/assets/img/intro-fastlane-tree.png)

流程图中每个环节都是独立的工具，每个工具只干一件事情，分工非常的明确。以下是我在团队项目中用到的：

- [scan](https://github.com/fastlane/fastlane/tree/master/scan) 自动化测试工具，很好的封装了 Unit Test
- [sigh](https://github.com/fastlane/fastlane/tree/master/sigh) 针对于 iOS 项目开发证书和 Provision file 的下载工具
- [match](https://github.com/fastlane/fastlane/tree/master/match) 同步团队每个人的证书和 Provision file 的超赞工具，规范[代码签名](https://codesigning.guide/)（虽然里面有些设定比较损）
- [gym](https://github.com/fastlane/fastlane/tree/master/gym) 针对于 iOS 打包和签名的自动化工具，完爆 `xctool`，而 `shenzhen` 也放弃维护
- [qyer](https://github.com/icyleaf/fastlane-qyer) 团队定制的工具，用于检测包和上传到自己的内部分发平台
- [fastlane](https://github.com/fastlane/fastlane) 简单理解就是控制整体流程和实现的框架容器

利用目前支持的工具可以做所有包含自动化和可持续化构建的每个环节，比如单元测试、截图、分发渠道、上传元数据和 ipa 包提交审核等等。看到这这些是不是很兴奋？
反正我看到之后就像黑夜看到了光明，果断抛弃自己维护的脚本。

## 基本构成

Fastlane 提供的流程的众多工具都是可以独立存在和使用（提供 cli 命令），也可以统一由 fastlane 来控制。它在使用中提出了两个概念：

- `action`: Fastlane 的插件，截至当前内置 165 个至多，不过每个动作的颗粒度大小不一。[查看详情](https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Actions.md)
- `lane`: Fastlane 的任务（或者可以理解为命令），一个可以包含多个 lanes，通过 `fastlane` cli 传入制定的 lane 来执行。

光说不干假把式，看法宝：

```ruby
lane :adhoc do
  # build version 自动加一
  increment_build_number
  # 执行 pod install
  cocoapods
  # 调用 facebook 的 xctool 进行单元测试
  xctool
  # 对模拟器运行的 App 进行截图
  snapshot
  # 安装团队证书和 profiles
  match
  # 上传 App 元数据和签名的 ipa 到 iTunes Conneects
  deliver
  # 把截图套进一个设备外壳
  frameit
  # 允许自定义的脚本文件
  sh "./customScript.sh"
  # 发消息到 slack
  slack
end
```

## 安装

工具的起源本身是专门针对 iOS 项目，因此目前依赖于 macOS 10.9 以上系统，Ruby 是一个众所周知的轮子发明者，很多知名的工具都是它开发的，fastlane 也不例外。以下是依赖环境：

- macOS 10.9+
- Ruby 2.0+ (推荐 rvm 或 rbenv 安装)
- Xcode + command line tools

以上依赖配置好之后就可以通过 rubygem 进行安装：

```bash
$ [sudo] gem install fastlane
```

fastlane 默认会把核心工具都会进行安装，需要大家耐心等待一会...

## 初始化

有两种方法可以初始化，一种是通过命令，一种是自己创建指定的（至少包含一个）约束文件 `Fastfile`。首先我先介绍大家使用命令初始化:

```bash
# 切换只你开发的 iOS 项目根目录
$ cd to/your/ios/project
$ fastlane init
[11:46:34]: Detected iOS/Mac project in current directory...
[11:46:34]: This setup will help you get up and running in no time.
[11:46:34]: fastlane will check what tools you're already using and set up
[11:46:34]: the tool automatically for you. Have fun!
[11:46:34]: Created new folder './fastlane'.
...
Your Apple ID (e.g. fastlane@krausefx.com): xxx@gmail.com
[11:46:59]: Verifying if app is available on the Apple Developer Portal and iTunes Connect...
[11:46:59]: Starting login with user 'xxx@gmail.com'
Multiple teams found on the Developer Portal, please enter the number of the team you want to use:
1) XXXXXXXXXX "XXXXXXXXXX" (In-House)
2) YYYYYYYYYY "YYYYYYYYYY" (Company/Organization)
+----------------+----------------------------------------------------------------------------+
|                                       Detected Values                                       |
+----------------+----------------------------------------------------------------------------+
| Apple ID       | xxx@gmail.com                                                              |
| App Name       | Hello Fastlane                                                             |
| App Identifier | com.icyleaf.demo.HelloFastlane                                             |
| Workspace      | /Users/icyleaf/Development/iOS/HelloFastlane.xcworkspace                   |
+----------------+----------------------------------------------------------------------------+

[11:48:36]: This app identifier doesn't exist on iTunes Connect yet, it will be created for you
Please confirm the above values (y/n) n
App Identifier (com.krausefx.app): com.icyleaf.demo.HelloFastlane
[11:50:04]: Created new file './fastlane/Appfile'. Edit it to manage your preferred app metadata information.
Optional: The scheme name of your app (If you don't need one, just hit Enter): AppDemo
[11:50:40]: 'snapshot' not enabled.
[11:50:40]: 'cocoapods' enabled.
[11:50:40]: 'carthage' not enabled.
[11:50:40]: Created new file './fastlane/Fastfile'. Edit it to manage your own deployment lanes.
[11:50:40]: fastlane will send the number of errors for each action to
[11:50:40]: https://github.com/fastlane/enhancer to detect integration issues
[11:50:40]: No sensitive/private information will be uploaded
[11:50:40]: Successfully finished setting up fastlane
```

这部分会进行联网，并提示输入你的 Apple ID 来验证你的应用是否存在（没有也会帮你自动创建）并获取相应的关键信息，通过一系列的流程下来把获取的信息会创建一个 `fastlane` 目录
并并写入相应的文件（如果某些信息没有填写会忽略某些文件的生成）：

- `Fastfile`: 核心文件，主要用于 cli 调用和处理具体的流程，[了解详情](https://github.com/fastlane/fastlane/tree/master/fastlane/docs#fastfile)
- `Appfile`: 从 Apple Developer Portal 获取和项目相关的信息，[了解详情](https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Appfile.md)
- `Deliverfile`: 从 iTunes Connect 获取和项目相关的信息，[了解详情](https://github.com/fastlane/fastlane/blob/master/deliver/Deliverfile.md)

抛开其他的几个文件先不说，大家先把注意力放到刚创建好的 `Fastfile` 文件上面（可能有变化，仅作参考），如果大家对 Ruby 有了解的话，它定义的 DSL 语言非常类似 [rake](https://github.com/ruby/rake)，但流程上有参考的 [rspec](https://github.com/rspec/rspec)，一旦不满足需求还可以使用 Ruby 代码来实现。单凭 DSL 语言来说就算对于 Ruby 没有基础的也能很快掌握，大多都是比较简单易懂的语法。

```ruby
# Customise this file, documentation can be found here:
# https://github.com/fastlane/fastlane/tree/master/fastlane/docs
# All available actions: https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Actions.md
# can also be listed using the `fastlane actions` command

# Change the syntax highlighting to Ruby
# All lines starting with a # are ignored when running `fastlane`

# If you want to automatically update fastlane if a new version is available:
# update_fastlane

# This is the minimum version number required.
# Update this, if you use features of a newer version
fastlane_version "1.95.0"

default_platform :ios

platform :ios do
  # 执行所有命令前都会先执行这里
  before_all do
    # ENV["SLACK_URL"] = "https://hooks.slack.com/services/..."
    cocoapods
  end

  desc "Runs all the tests"
  lane :test do
    scan
  end

  desc "Submit a new Beta Build to Apple TestFlight"
  desc "This will also make sure the profile is up to date"
  lane :beta do
    # match(type: "appstore") # more information: https://codesigning.guide
    gym(scheme: "AppDemo") # Build your app - more options available
    pilot

    # sh "your_script.sh"
    # You can also use other beta testing services here (run `fastlane actions`)
  end

  desc "Deploy a new version to the App Store"
  lane :appstore do
    # match(type: "appstore")
    # snapshot
    gym(scheme: "AppDemo") # Build your app - more options available
    deliver(force: true)
    # frameit
  end

  # 你可以定义属于自己的 lane（任务）
  lane :hello do
    puts "hello world"
  end

  # 仅当上述流程全部执行成功后才会走这里。其实应该定义为 after_success
  after_all do |lane|
    # slack(
    #   message: "Successfully deployed new App Update."
    # )
  end

  # 如果流程发生异常会走这里并终止
  error do |lane, exception|
    # slack(
    #   message: exception.message,
    #   success: false
    # )
  end
end
```

通过上面的注解，我想大家对它已经有了初步的了解，那么定义完之后该如何执行呢？回到刚才的终端（关闭了？那再切换到刚才的 iOS 项目的根目录）：

```bash
$ fastlane ios hello
[11:56:24]: -------------------------------------------------
[11:56:24]: --- Step: Verifying required fastlane version ---
[11:56:24]: -------------------------------------------------
[11:56:24]: fastlane version valid
[11:56:24]: ------------------------------
[11:56:24]: --- Step: default_platform ---
[11:56:24]: ------------------------------
[11:56:24]: Driving the lane 'ios hello' 🚀
[11:56:24]: -----------------------
[11:56:24]: --- Step: cocoapods ---
[11:56:24]: -----------------------
[11:56:24]: $ pod install
...
[11:56:28]: hello world

+------+-------------------------------------+-------------+
|                     fastlane summary                     |
+------+-------------------------------------+-------------+
| Step | Action                              | Time (in s) |
+------+-------------------------------------+-------------+
| 1    | Verifying required fastlane version | 0           |
| 2    | default_platform                    | 0           |
| 3    | cocoapods                           | 4           |
+------+-------------------------------------+-------------+

[11:56:28]: fastlane.tools finished successfully 🎉
```

哒哒！一个简单的任务执行完毕！

如果大家注意观察上面的文件可能注意到一些小细节：

```ruby
# 自动更新 fastlane 工具，需要 rubygems >= 2.1.0
update_fastlane

# 最低兼容版本，由于 fastlane 还是逐步健壮的阶段更新速度还是蛮快的，
# 为了防止新特性在旧版本的不支持会强制设置一个最低兼容版本
# 不过工具特别贴心的会在每次执行之后会检查是否有新版本，如果有会在最后末尾追加新版本提醒
fastlane_version "1.95.0"

# 默认使用平台是 ios，也就是说文件可以定义多个平台，
# 通过上述执行的命令也能看出来是执行的 ios 平台下面的 hello 任务。
# 这个的作用是可以在执行 fastlane 的时候省略 ios，不信你执行 fastlane hello 试试。
default_platform :ios
```

## Android 的支持

这个的支持我觉得关键是社区的呼声太大，加上贡献者的热情（我提交过许多 issues 和个别 PL，响应非常的迅速）很快就加上了其支持，
但具体的特性不是特别多，主要是对于 `gradle` 的封装，我先不做展开介绍，大家可以先看看[官方文档](https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Android.md)，如果后续有特别不明白的地方我在做具体的讲解。

今天就先写到这里后续我会继续整理更多的使用指南和实战范例共大家参考，最后给大家附赠官方给大家的一些[范例](https://github.com/fastlane/examples)。
