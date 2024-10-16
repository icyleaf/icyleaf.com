---
title: 让吃灰的兄弟打印机焕发新生：无线打印
description: 传统 USB 设备 DCP-7040 打印机实现无线打印以及苹果设备的 AirPrint 隔空打印
date: 2024-10-16T23:52:52+08:00
slug: "setup-legacy-brother-laser-became-to-a-wireless-airprint"
type: posts
index: true
comments: true
isCJKLanguage: true
categories:
  - Technology
tags:
  - Linux
  - Printer
image: https://images.unsplash.com/photo-1674644653898-5edf4ac87c52?q=80&w=4928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageSource:
  - name: Al Amin Mir
    link: https://unsplash.com/@alaminip
  - name: Unsplash
    link: https://unsplash.com
---

## 起因

从老丈人家拿回来一台已经吃灰的兄弟激光 [DCP-7040](https://support.brother.com/g/b/spec.aspx?c=as_ot&lang=en&prod=dcp7040_us_as) 一体机. 在 Windows 系统上测试仍然可以正常工作，本来想把它接到 Openwrt 路由器的网络打印机插件上实现无线打印，但我的路由器在弱电箱里面放着周围也没有合适可以摆放的位置，我就把它连用 USB 到了一台 Ubuntu Server 服务器上，计划用 [CUPS](https://www.cups.org/) 实现同样的效果。

这台打印机官方驱动虽然提供 Windows、macOS 甚至还有 Linux，在我安装驱动才注意到官方提供的只有 32 位，想要支持 64 位则需要[额外安装兼容库](https://support.brother.com/g/b/faqend.aspx?c=cn&lang=zh&prod=mfcj3930dw_eu_as_cn&faqid=faq00100678_000)（不安装的话能提交打印请求但不会执行打印任务），本想着能凑合用的心态搞了一圈下来，在 CUPS Web 控制面板测试打印页是可以执行命令，但 macOS 无论使用通用驱动还是官方驱动要么不执行打印，要么只会打印出 `12345X@PJL` 这样的一行字，只有 Windows 没问题，头疼了好久。

## 解决方案

在接近绝望时看到了 [brlaser](https://github.com/pdewacht/brlaser/) 这个项目，这是牛人开发激光打印机的开源驱动，支持绝大多数支持标准打印机协议（PCL/PostScript）的兄弟打印机机型：

- Brother DCP-1510 series
- Brother DCP-1600 series
- Brother DCP-7030
- Brother DCP-7040
- Brother DCP-7055
- Brother DCP-7055W
- Brother DCP-7060D
- Brother DCP-7065DN
- Brother DCP-7080
- Brother DCP-L2500D series
- Brother DCP-L2520D series
- Brother DCP-L2520DW series
- Brother DCP-L2540DW series
- Brother HL-1110 series
- Brother HL-1200 series
- Brother HL-2030 series
- Brother HL-2140 series
- Brother HL-2220 series
- Brother HL-2270DW series
- Brother HL-5030 series
- Brother HL-L2300D series
- Brother HL-L2320D series
- Brother HL-L2340D series
- Brother HL-L2360D series
- Brother HL-L2375DW series
- Brother HL-L2390DW
- Brother MFC-1910W
- Brother MFC-7240
- Brother MFC-7360N
- Brother MFC-7365DN
- Brother MFC-7420
- Brother MFC-7460DN
- Brother MFC-7840W
- Brother MFC-L2710DW series
- Lenovo M7605D

驱动也都发布到了主流的 Linux 系统中，比如 Debian、Ubuntu、Arch Linux、NixOS、树莓派的 Raspbian 和 openSUSE。在 Ubuntu Server 上安装 `printer-driver-brlaser` 后就可以在 CUPS Web 控制面板中选择这个驱动一路下一步搞定。

## 配置 CUPS

配置前需要安装 CUPS 和驱动，顺便把管理员用户添加到 cups 用户组。

```bash
# 安装
sudo apt install cups printer-driver-brlaser

# 把用户 icyleaf 加入到 cups 管理组
sudo usermod -aG lpadmin icyleaf
```

配置局域网内可以访问 CUPS 的 WEB 管理页面，编辑 `/etc/cups/cupd.conf`:

```diff
- Listen 127.0.0.1:631
+ Listen 0.0.0.0:631

# 限制局域网段 192.168.222.0/24 可访问
<Location />
  Order allow,deny
+  Allow From 192.168.222.0/24
</Location>

<Location /admin>
  Order allow,deny
+  Allow 192.168.222.0/24
</Location>
```

## 配置打印机

使用服务器的 IP (比如是 192.168.222.100) `https://192.168.222.100:631/admin` 开始添加打印机，记得先打开打印机等待预热完毕。

{{< figure src="/uploads/2024/10/add-printer.png" >}}

添加打印机时已经识别到，选择第二个进行下一步。

{{< figure src="/uploads/2024/10/set-printer-information.png" >}}

记得勾选 `Share This Printer` 允许局域网其他设备可以连接到这台打印机。

{{< figure src="/uploads/2024/10/set-printer-driver.png" >}}

打印机的品牌已经正确识别，选择打印机对应的型号，看到 "Printer Brother_DCP-7040 has been added successfully." 离成功就差最后一步。

{{< figure src="/uploads/2024/10/set-printer-metadata.png" >}}

因为还要设置好纸张类型、DPI、纸张类型...一切都设置好可以在 Manage Printer 查看打印机信息和相关维护功能。

{{< figure src="/uploads/2024/10/brother-printer.png" >}}

## AirPrint 隔空打印

尝试用 iPhone 隔空打印一张，能够顺利找到打印机。

{{< figure src="/uploads/2024/10/iphone-airprint.png" >}}

提交后能够在 CUPS 的任务队列查看详情信息。

{{< figure src="/uploads/2024/10/printer-jobs.png" >}}

## 意犹未尽

CUPS 能够仅实现打印机的复制功能，刚好这台打印机找到了对应的驱动；还缺少无线扫描的功能正在探索中，据说可以使用 [SANE](http://www.sane-project.org/) 配合驱动，服务器是 Server 端没有桌面环境，有点头疼，容我再想想怎么解决。
