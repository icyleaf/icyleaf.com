---
title: 为兄弟激光打印机支持无线打印
description:
date: 2024-07-16T21:43:52+08:00
slug: "setup-legacy-brother-laser-became-to-a-wireless-airprint"
type: posts
draft: true
index: true
comments: true
isCJKLanguage: true
categories:
  - Technology
tags:
  - Software
  - Linux
image: https://images.unsplash.com/photo-1674644653898-5edf4ac87c52?q=80&w=4928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageSource:
  - name: Al Amin Mir
    link: https://unsplash.com/@alaminip
  - name: Unsplash
    link: https://unsplash.com
---

从父母家拿回来一台已经吃灰的兄弟激光一体机，这是一台较早的打印机，拿回来在 Windows 系统上测试仍然可以正常工作，本来想把它接到 Openwrt 路由器的网络打印机插件上实现无线打印，但我的路由器在弱电箱里面放着周围也没有合适可以摆放的位置，我就把它放在了一台运行 Ubuntu Server 跑 Stable Diffusion 和 LLM 服务器边上连上 USB 数据线，计划用 [CUPS](https://www.cups.org/) 实现同样的效果。

我手中的这台打印机型号是 [DCP-7040](https://support.brother.com/g/b/spec.aspx?c=as_ot&lang=en&prod=dcp7040_us_as)，官方驱动不仅提供 Windows、macOS 甚至还有 Linux，在我安装驱动才注意到官方提供的只有 32 位，想要支持 64 位则需要[额外安装兼容库](https://support.brother.com/g/b/faqend.aspx?c=cn&lang=zh&prod=mfcj3930dw_eu_as_cn&faqid=faq00100678_000)（不安装的话能提交打印请求但不会执行打印任务），本想着能凑合用的心态搞了一圈下来，在 CUPS Web 控制面板测试打印页是可以执行命令，但 macOS 无论使用通用驱动还是官方驱动要么不执行打印，要么只会打印出 `12345X@PJL` 这样的一行字，只有 Windows 没问题，头疼了好久。

在接近绝望打算用 Remote Desktop 操作另外一台 Windows 系统打印作为兜底的时候看到了 [brlaser: Brother laser printer driver](https://github.com/pdewacht/brlaser/) 这个项目，这是牛人开发激光打印机的开源驱动，支持绝大多数支持标准打印机协议（PCL/PostScript）的兄弟打印机机型：

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

而且他的驱动也都分发到了主流的 Linux 系统中，比如 Debian、Ubuntu、Arch Linux、NixOS、树莓派的 Raspbian、甚至是 openSUSE，驱动名称叫 `printer-driver-brlaser`，在 Ubuntu Server 上安装后就可以在 CUPS Web 控制面板中选择这个驱动，然后就可以正常打印了。但是这个方案也有一个缺点，就是不支持扫描，我这个又正好是一个带扫描、复印的一体机，SANE 是扫描的解决方案却对兄弟打印机的支持很低。

核心步骤

```bash
# 安装
sudo apt install cups printer-driver-brlaser

# 把用户 icyleaf 加入到 cups 管理组
sudo usermod -aG lpadmin icyleaf

# 开放局域网内访问
sudo vim /etc/cups/cupd.conf
```

```diff
- Listen 127.0.0.1:631
+ Listen 0.0.0.0:631

<Location />
  Order allow,deny
+  Allow From 10.10.10.0/24
</Location>

# Restrict access to the admin pages...
<Location /admin>
  Order allow,deny
+  Allow 10.10.10.0/24
</Location>

打开 `http://10.10.10.4:631` 开始添加打印机。
