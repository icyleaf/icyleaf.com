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

{{< updated at="2022-08-15" >}}

自 2021 年 12 月 22 日发布本篇基于 Zealot 4.3.1 一个稳定版本后到现在服务包含了新特性的上线，正文部分做了对应的更新。

{{< /updated >}}

Zealot 是一个为开发者提供快速测试应用核心的应用分发平台，可通过网页、接口（ CI 、CD 服务）上传 iOS 、Android 甚至是 macOS 的应用文件，甚至是连微软 AppCenter 2021 年底还都不支持的 Android aab 格式，全网独一份，撒花！服务会自动解析应用的元数据等信息，上传版本还可以显示丰富的变更日志、甚至是提供给内部看的自定义字段。针对 iOS 测试者提供除了基本获取设备 UDID 的基础上还会提示测试者是否已经有关联的应用可以安装。

{{< figure src="/uploads/2021/12/22/zealot-showcase.png"
    title="Zealot 服务样图"
>}}

## 特性

- Docker 一键部署
- 自由解析、托管 iOS/Android 甚至是 macOS 的应用
- 自定义网络钩子适配所有 InCome Webhook 通知服务（钉钉、企业微信、飞书、Slack 等）
- 应用解包（甚至 mobileprovision 文件）轻松查看应用包本身的秘密
- 开发者友好的客户端 SDKs 、REST APIs 及 DevOps 插件
- 相对全面的文档，服务和文档包含中英文语言支持
- 托管苹果开发者智能注册 iOS 测试设备
- 基于 MIT 协议的开源项目
- 没有什么卵用的黑暗模式

## 开发者的自言自语

Zealot 虽然可能最近半年才慢慢有少部分人接触并使用，实际上历时 7 年的磨练，吸取了多家公司内场景和经验地演变，专注于应用的托管和分发服务，是目前国内外唯一一个支持几乎全平台（Windows/Linux 除外）的应用分发托管平台；唯一支持 Android aab 格式解析的平台；唯一提供 iOS/Android SDK ，fastlane 插件等为开发者、测试者友好的开源项目，希望大家用的开心！ En Taro Adun! 🖖

## 项目地址

https://github.com/tryzealot/zealot/

## 在线演示

> 注意: 数据每日都会重新初始化，不对用户上传的应用承担任何法律风险，后果自负！

- 演示地址: https://tryzealot.herokuapp.com/
- 电子邮箱: admin@zealot.com
- 登录密码: {{< spoiler >}} ze@l0t {{< /spoiler >}}
