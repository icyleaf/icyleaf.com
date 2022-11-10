---
title: "Proxmox VM 创建 Talos OS cloud-init 虚拟机"
description: 官方不提供 Cloud init 安装部署，如何应对解决
date: 2022-11-09T12:13:09+08:00
slug: "create-talos-linux-vm-with-cloud-init-in-proxmox"
type: posts
draft: true
index: true
comments: true
isCJKLanguage: true
series:
  - Proxmox
categories:
  - Proxmox
  - TalOS
  -
tags:
  -
image: https://images.unsplash.com/photo-1528048330205-623cba504fad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2781&q=80
# imageSource:
#   - name:
#     link:
---

[Talos](https://talos.dev) 作为 Container Linux 的一种解决方案，我一直是在 Proxmox VM 上面部署和进行一系列的测试工作，它的部署方式支持裸机安装、虚拟化安装、云安装以及单片机安装。

## 安装方式

### ISO 安装

[Proxmox](https://www.talos.dev/v1.2/talos-guides/install/virtualized-platforms/proxmox/) 虚拟化安装官方只提供 ISO 的安装方式。

### Cloud-init 安装

我当前使用 terraform 部署，搭配 [proxmox-terraform]() 插件可以做到事半功倍。

talos 是纯 API 管理连 ssh 都被舍弃了，无法通过传统的手段 ssh 获取 IP 地址，proxmox 提供的两种方式可以在安装前设定：

1. lxc container (CT 模板)
2. qemu cloud-init

第一种制作相对麻烦，第二种官方本以为也没有明确针对 proxomx 的方案那肯定就不可以了吗？

talos 1.2 版本官方支持了 cloud-init 的 [nocloud](https://www.talos.dev/v1.2/talos-guides/install/cloud-platforms/nocloud/) 安装，镜像下载也能看到有 `nocloud-xxx.raw.xz`

## 什么是 cloud-init


## 参考资料

- https://fairysen.com/742.html
