---
title: "如何搭建家用 homelab: 先导篇"
date: 2022-02-22T09:42:23+08:00
draft: true
slug: "how-to-homelab-part-0"
categories:
  - Technology
tags:
  - homelab
  - docker
  - traefik
image: tutorials/how-to-homelab/part-0/cover.png
---

## 前言

这将会是一个持续系列的主题文章，你将会从最基础的家庭 Home lab 搭建开始循序渐进到一些进阶的系统、网络、服务层面的学习。我尽可能以新人的角色描述简单易懂的语言，系列文章会涉及家庭网络、路由器、Linux、数据储存、NAS、服务化等等，如果你在过程中又遇到任何问题，欢迎给我留言。

{{< figure src="/tutorials/how-to-homelab/part-0/diagram.png"
    title="镇楼用的网络拓扑图"
>}}

## 搭建 Homelab 起因

> Homelab: a laboratory of (usually slightly outdated) awesome in the domicile

从语言直译来看可以说是家庭 homelab，把这个事情延展到网络及服务上面那就可以干很多有意思的事情，比如：

- NAS 存储：资源下载、存放任何的数据（照片、小姐姐、学习资料、代码等）
- 影视库：从最简单的网络共享文件夹到可以托管影视管理、播放、转码为一体的 Jellyfin、Plex 服务
- 网络管理：设备限流、流量审计、防火墙策略
- 应用开发：做一些 Side Projects 需要开发环境、缓存、数据存储等
- DevOps：ansible、salt、k8s 来操作维护多个服务器、VM 或者是 lxc

如果您恰好是一名软件应用开发者，homelab 是最佳的扩展你的技能的很好的实验田，学习网络拓扑、Linux 系统、安全管理等。
对于大部分人来说或许多多少少都会听说过 NAS 服务器，其实他也是 Homelab 的实践应用之一。

不要被它的名字吓到，本质上它就是在一个操作系统上面跑一堆上面提到和没提到的服务而已。

## 自建考虑的点

无论上面提到的点有多么吸引你想要组件自己的家庭 homelab，您还要慎重考虑是否真的需要，毕竟真的整一套也会投入很大的精力和一些资金，千万不要没有需求创造需求。

## 商业成品方案

商业成品主要是售卖软件服务来提供类网络管理、数据存储等的解决方案，市面上主流的主要是：

- 群晖: 搭配硬件售卖，各方面都非常令人满意的软件系统，对小白非常友好
- 威联通: 搭配硬件售卖的软件，价格比群晖有优势，软件系统相对群晖要逊色不少
- ESXi: VMware 商业公司开发的硬件虚拟化解决方案，界面简单易用，自身功能较强
- UnRaid: 一款商业的 NAS 系统，但提供快速扩容、Docker 和 VM 管理
- UniFi OS: 主要是 Dream Machine 搭载的系统，整体下来价格非常昂贵

通常情况下商业成品是一站式的解决方案，采购的话费用也会比自建要投入更多的资金，这个就不再 homelab 的考虑范围，这里就一笔带过。

## 开源&免费方案

> 本系列的内容会优先考虑使用开源、免费的解决方案，如果真的无法满足会分享一些商业的解决方案。

自建 homelab 必然会从硬件、软件下手，准备好了再决定网络拓扑结构。

## 硬件筛选

国内和国外的硬件环境有非常大的不同，国内有很多的洋垃圾、魔改硬件的讨论，比如您可能听说过的 E3/E5 神教、垃圾佬之类的名词。
若你是这个领域的行家恭喜你会省不少钱；若你不是也不用沮丧踏踏实实的花钱买数据安全，切记也不要盲目入手垃圾佬的硬件，捡垃圾有风险，有些硬件会被超的很高这样的性价比也会很低而不值得入手。

最关键的几个部分：CPU、内存、主板、网络和硬盘。

- CPU 和内存很好理解，CPU 核心数量、内存容量越多越能造，如果对于影视播放有要求就需要 CPU 有好的核心支持。
- 主板对网口数量、扩展槽会有依赖，网口数量和硬盘数量支持不多就要靠扩展槽来凑。
- 网络状况至关重要，WiFi 6 传输速度还是不如千兆有线，评估下自己家里猫和路由器最低要求千兆网络，有线也尽量是 CAT5e/CAT6 规格
- NAS 应用场景对硬盘容量和规格要求比较高，SSD 不是强需求，如果不差钱全上 SSD 也不是不行。

这里每一个展开聊都是非常大的话题，我可能会整理一些外部资源供您去补充这方面的知识。市面上也有一些成品硬件的解决方案，您也可以考虑：

- 英特尔 NUC：小巧的机型并不代表他的性能很弱，最新 12 代的 NUC 从各方面都是很好的选择
- 联想 ThinkCentre 系列：比 NUC 稍微大点，这个系列体系非常的庞大且悠久，也有不少价格合适的二手和改装件，但会折腾一些
- 惠普 MicroServer Gen 系列：Gen8/Gen10 都是目前主流的 homelab 解决方案，正统服务器规格和特性。（我有一台 Gen 8 正在服役）
- 树莓派：从 3B 开始它也能做一些 homelab 的应用场景，国内外资料丰富，配件众多。唯一的缺点受新冠影响它的价格在国内居高不下
- 各种矿渣主机：区块链盛行的挖矿行业充斥着很多挖矿主机，比如星际蜗牛、绿盘、蜜獾超存等，有些硬件参数还不错到手之后需要调节或改下静音风扇就可用

最简单的版本就是可以找一个可以长期运行的不再使用的笔记本电脑、台式电脑就能起步。

## 软件部署方案

硬件准备完备之后，我们来考虑搭配哪种软件部署方案，通常会被划分为三大类：

- 传统部署（Traditional Deployment）
- 虚拟化部署（Virutalization Deployment）
- 容器化部署（Containerd Deployment）

{{< figure src="https://d33wubrfki0l68.cloudfront.net/26a177ede4d7b032362289c6fccd448fc4a91174/eb693/images/docs/container_evolution.svg"
    link="https://d33wubrfki0l68.cloudfront.net/26a177ede4d7b032362289c6fccd448fc4a91174/eb693/images/docs/container_evolution.svg"
    title="部署方式的演变"
    pswp-width="1800"
    pswp-height="650"
    caption="图片来源"
    attr="Kubernetes 是什么？"
    attrlink="https://kubernetes.io/zh/docs/concepts/overview/what-is-kubernetes/"
>}}

通常在硬件性能还算不错情况下都不会采用传统部署的方案，单主机的优先级：容器化 > 虚拟化 > 传统部署，机器性能不错且有技术兴趣度的优先级：虚拟化 > 容器化 > 传统部署。

### 传统部署

传统部署通常是在 Bare-metal 机器上面进行的，因此我把它俩划为等号，它使用硬件主机安装操作系统如 Window、macOS 和 *nix (Unix/Linux) 后直接安装和部署服务，听起来没什么特别的，
市面上也会有很多的运维工具用于解决安装系统、配置环境、后期维护、数据备份的工作，比如 Salt、Ansible、Puppet 等有一定的学习成本，没法做到开箱即用， 100% 发挥硬件机能也会是一个问题。

{{< figure src="/tutorials/how-to-homelab/part-0/bare-metal.jpg"
    title="Bare metal 方案"
    caption="图片来源"
    attr="The Cloud Girl"
    attrlink="https://thecloudgirl.dev/BareMetal.html"
>}}

### 虚拟化部署

- Proxomx

### 容器化部署

- Docker
- Containerd

## 基础系统

如果选择传统部署随便用一个你熟悉且满足你需求的操作系统即可

## 应用服务

定好软硬件的基础后您需要面对非常庞大的应用服务来扩展和丰富 homelab

### 入门选择

软路由：

- openwrt：国内最近今年非常主流的解决方案，花样百出，虽然我用的也不标准但现在有点妖魔化了
- 梅林：曾经的王者，还有一些用户
- dd-wrt: 在流行刷路由器初期的懵懂的固件，受限于硬件支持度和更新频率渐行渐远

网关：

- nginx
- caddy
- traefik

DNS

- Dnsmaqe
- pi-hole
- Adguard Home
- SmartDNS

防火墙：

- iptables: Linux 常见的内置防火墙，Ubuntu 会采用 ufw
- pfSense: 国外普遍使用的一款开源防火墙

NAS：

- OpenMediaValut

### 高级进阶

- TrueNas

- Kubernetes

