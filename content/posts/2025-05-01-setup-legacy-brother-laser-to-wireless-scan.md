---
title: 让吃灰的兄弟打印机焕发新生：无线扫描
description: 传统 USB 设备 DCP-7040 打印机实现无线扫描篇
date: 2025-05-01T16:55:52+08:00
slug: "setup-legacy-brother-laser-became-to-a-wireless-scan"
type: posts
index: true
comments: true
isCJKLanguage: true
categories:
  - Technology
tags:
  - Linux
  - Printer
series:
  - brothers-legacy-lasers-are-modernizing
image: https://images.unsplash.com/photo-1650696868612-4b836291b323?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
imageSource:
  - name: Prasopchok
    link: https://unsplash.com/@gotburied
  - name: Unsplash
    link: https://unsplash.com
---

去年使用 cups 实现了传统打印机实现无线打印，今年我们来解决无线扫描，对！就是上一篇末尾提到的 SANE！

[SANE](http://www.sane-project.org/) 和 cups 分工明确，后者解决打印机无线打印的问题，前者解决扫描仪无线扫描的问题，但唯一不同的是 cups 提供 web 服务和 UI，但 SANE 没有，
借助开源的力量我找到了 [scanservjs](https://github.com/sbs20/scanservjs) 虽然项目已经很久不再活跃，但对于我的设备来说却很管用，这是一个给 SANE 提供前端 Web UI 服务的同时还提供 API 
接口服务的很棒的工具。

在 Web 服务上提供基础的扫描功能外，还能调整分辨率、裁剪、滤镜、OCR 还能不同的输出格式和压缩率，移动设备友好，部署还提供 docker 镜像。

{{< figure src="/uploads/2025/05/scanservjs-demo.jpg"
    caption="Copyrights"
    attr="Sam Strachan"
    attrlink="https://github.com/sbs20/scanservjs" 
>}}

这次我们使用一键安装脚本来处理： 

```shell
curl -s https://raw.githubusercontent.com/sbs20/scanservjs/master/bootstrap.sh | sudo bash -s -- -v latest
sudo systemctrl enable --now scanservjs
```

运行服务会开启 8080 端口，第一次打开服务会使用 `scanimage -L` 获取扫描仪设备，如果获取成功就会在左上角看到，并根据自己的设备把下面的参数修改正确后即可扫描

{{< figure src="/uploads/2025/05/scanservjs-webui.png" >}}

点击预览 （Preview）可以在 Web 看到扫描后的文件或图片，调整后可以再扫描 （Scan），扫描后的文件都会在文件列表，可以下载或编辑，根本都不需要点击机器上的扫描按键和任何配置。

{{< figure src="/uploads/2025/05/scanservjs-swagger.png" >}}

服务提供的 API 基本上满足需求，如果再有一个获得设备列表的接口就更好了 :D

到此这台扫描、打印机为一体的传统机器已经焕发新生。