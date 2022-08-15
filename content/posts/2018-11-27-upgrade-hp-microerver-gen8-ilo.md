---
title: "升级 HP MicroServer Gen8 iLO 秘笈"
date: "2018-11-27T10:43:07+08:00"
slug: "upgrade-hp-microerver-gen8-ilo"
categories:
  - Technology
tags:
  - Server
  - Gen8
image: /uploads/2018/11/27/ilo-soc.jpg
menu: ""
index: false
draft: false
comments: true
isCJKLanguage: true
share: true
description: 服务器硬件提供 iLO 让你不再困扰外接屏幕和键鼠
---

几年前听取网络上的建议德淘了一台 HP MicroServer Gen8 服务器作为家用的 NAS 服务器，德淘的原因除了便宜以外电源的功率比国内版的更大，内存也比国内版的大（4G）。
Gen 8 自带 iLO 这是一个很强大的功能，新出的 Gen10 虽然硬件各方面有不错的表现但却阉割了 iLO，打算入坑谨慎选择。

## 给你鱼

https://pan.baidu.com/s/1wSMlqg-iVO80U-5Z-kNdQA 提取码: w8mq

## 教你渔

本方法适用于你当前操作的电脑系统是任何操作系统。

### 版本概念

iLO 当前的版本分为**硬件版本**和**软件版本**

- 硬件版本目前主要是 iLO4 和 iLO 5，后者是 Gen10 在使用。登录 iLO 管理后台页面的头部会提示你 iLO4/5。
- 软件版本目前 iLO4 的最新版本是 2.6.1，iLO5 因为用不上没有做了解。在 iLO 管理后台登录界面上会有一行小字提示。

### 升级固件

打开 [HPE 网站](https://support.hpe.com/hpesc/public/home) 搜索关键词 "HPE ProLiant MicroServer Gen8 Server"，
不要着急回车稍等片刻等有个浮层显示后点击”驱动和文件下载“。

下载 iLO 固件的可通过左侧的筛选过滤选择 ”固件（Firmware）更新 - Lights-Out Management“ 然后在右侧选择日期是最新的一个对应你操作系统的版本。
如果是 macOS 或没有支持的操作系统也没关系选择任意 Windows 的版本，然后在详情页面点击下载。

如果你下载后的 exe 文件，通过解压文件可直接进行解压缩能看到里面的 bin 文件，这个实际上是通过 iLO 管理后台升级所用的关键文件。

操作路径：Administrator -> Framware

### 安装语言包

还是在刚才的搜索结果页面重置并新过滤”应用软件 - Lights-Out Management“，因为语言包更新到频次没那么高，你需要把右侧最底部显示的条目数改为全部（All）
后通过搜索关键词 ”Lights-Out 4 Language Pack“ 找到你希望使用的语言包，截至目前最新的中文语言包（Simplified Chinese ）是 2017 年的，下载过程同上面。

解压缩文件后只需要里面的 lpk 文件。

操作路径：Administrator -> Access Settings -> Language


