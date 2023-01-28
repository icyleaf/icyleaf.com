---
title: Zealot
date: 2021-12-22T18:45:06+08:00
draft: false
slug: "Intro Zealot"
categories:
  - Technology
tags:
  - opensource
  - projects
image: /uploads/2021/12/22/zealot-cover.png
comments: true
isCJKLanguage: true
share: true
description: 一个为开发者提供快速测试应用核心的应用分发平台
---

{{< updated at="2023-01-28" >}}

Zealot 4.6.0 是 2023 年春节前最新发布的版本，支持了 Arm 平台部署，正文部分做了对应的更新。

{{< /updated >}}

Zealot 是一个为开发者提供快速测试应用核心的应用分发平台，可通过网页、接口（ CI 、CD 服务）上传 iOS 、Android 甚至是 macOS 的应用文件，甚至是连微软 AppCenter 2021 年底还都不支持的 Android aab 格式，全网独一份，撒花！服务会自动解析应用的元数据等信息，上传版本还可以显示丰富的变更日志、甚至是提供给内部看的自定义字段。针对 iOS 测试者提供除了基本获取设备 UDID 的基础上还会提示测试者是否已经有关联的应用可以安装。

{{< figure src="/uploads/2021/12/22/zealot-showcase.png"
    title="Zealot 服务样图"
>}}

## 特性

- 🌏 **多平台应用支持**: macOS、iOS、甚至是 APK 和 AAB 格式的 Android 应用上传、安装（支持 ARM 的 macOS）和下载
- 🗄 **多渠道分类管理**: Debug、AdHoc、Enterprise 还是 Android 应用渠道管理统统没问题
- 📱 **测试设备一网打进**: 自动同步 iOS 测试设备信息，允许一键注册新设备到苹果开发者
- 🧑‍💻 **丰富开发者套件**: 提供 REST API、[iOS][zealot-ios-sdk]、[Android][android-android-sdk] SDK 以及 [fastlane][fastlane-plugin-zealot] 自动化构建插件
- 💥 **剖析应用内部的秘密**: 解读 iOS、Android 应用或 iOS 描述文件的元信息
- 🎳 **多架构部署**: amd86、arm64 和 armv7 任君选择（支持 ARM 的 macOS）
- 🚨 **内置多种事件通知**: 数据可自定义 Income WebHook 到任意通知服务
- 🔑 **第三方登录**: 飞书、Gitlab、Google 和 LDAP 一键授权
- 🌑 **黑暗模式**: 黑夜白昼自由切换

## 开发者的自言自语

Zealot 虽然可能最近半年才慢慢有少部分人接触并使用，实际上历时 7 年的磨练，吸取了多家公司内场景和经验地演变，专注于应用的托管和分发服务，是目前国内外唯一一个支持几乎全平台（Windows/Linux 除外）的应用分发托管平台；唯一支持 Android aab 格式解析的平台；唯一提供 iOS/Android SDK ，fastlane 插件等为开发者、测试者友好的开源项目，希望大家用的开心！ En Taro Adun! 🖖

## 项目地址

https://github.com/tryzealot/zealot/

## 在线演示

> 注意: 数据每日都会重新初始化，不对用户上传的应用承担任何法律风险，后果自负！

- 演示地址: https://tryzealot.herokuapp.com/
- 电子邮箱: admin@zealot.com
- 登录密码: {{< spoiler >}} ze@l0t {{< /spoiler >}}
