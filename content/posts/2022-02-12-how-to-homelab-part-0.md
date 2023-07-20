---
title: "如何搭建家用 homelab: 先导篇"
date: 2022-02-12T20:00:00+08:00
slug: "how-to-homelab-part-0"
aliases:
  - how-to-homelab-part-0-intro
  - how-to-homelab
  - homelab
draft: false
categories:
  - Technology
tags:
  - homelab
  - docker
  - traefik
series:
  - Homelab
image: tutorials/how-to-homelab/part-0/cover.png
comments: true
isCJKLanguage: true
share: true
description: 搭建 homelab 之前都需要了解哪些背景
---

## 前言

这将会是一个持续系列的主题文章，你将会从最基础的家庭 homelab 搭建开始循序渐进到一些进阶的系统、网络、服务层面的学习。我尽可能以新人的角色描述简单易懂的语言，系列文章会涉及家庭网络、路由器、Linux、数据储存、NAS、服务化等等，如果你在过程中又遇到任何问题，欢迎给我留言。

{{< figure src="/tutorials/how-to-homelab/part-0/homelab-diagram-v2.0.png"
    link="/tutorials/how-to-homelab/part-0/homelab-diagram-v2.0.png"
    title="2021 年底 v2.0 镇楼用的网络拓扑图"
    caption="图片来源 "
    attr="@icyleaf@twitter.com"
    attrlink="https://twitter.com/icyleaf/status/1472036769742745603"
>}}

## 搭建 homelab 起因

> homelab: a laboratory of (usually slightly outdated) awesome in the domicile

从语言直译来看可以说是家庭 homelab，把这个事情延展到网络及服务上面那就可以干很多有意思的事情，比如：

- NAS 存储：资源下载、存放任何的数据（照片、小姐姐、学习资料、代码等）
- 影视库：从最简单的网络共享文件夹到可以托管影视管理、播放、转码为一体的 Jellyfin、Plex 服务
- 网络管理：设备限流、流量审计、防火墙策略
- 应用开发：做一些 side projects 需要开发环境、缓存、数据存储等
- DevOps：ansible、salt、k8s 来操作维护多个服务器、VM 或者是 lxc

如果您恰好是一名软件应用开发者，homelab 是最佳的扩展你的技能的很好的实验田，学习网络拓扑、Linux 系统、安全管理等。
对于大部分人来说或许多多少少都会听说过 NAS 服务器，其实他也是 homelab 的实践应用之一。

不要被它的名字吓到，本质上它就是在一个操作系统上面跑一堆上面提到和没提到的服务而已。

## 自建考虑的点

无论上面提到的点有多么吸引你想要组件自己的家庭 homelab，您还要慎重考虑是否真的需要，毕竟真的整一套也会投入很大的精力和一些资金，千万不要没有需求创造需求。

> 本系列的内容会优先考虑使用开源、免费的解决方案，如果真的无法满足会分享一些商业的解决方案。

## 商业成品方案

商业成品主要是售卖软件服务来提供类网络管理、数据存储等的解决方案，市面上主流的主要是：

- [群晖](https://www.synology.com/): 搭配硬件售卖，各方面都非常令人满意的软件系统，对小白非常友好
- [威联通](https://www.qnap.com/): 搭配硬件售卖的软件，价格比群晖有优势，软件系统相对群晖要逊色不少
- [UnRaid](https://unraid.net/): 一款商业的 NAS 系统，但提供快速扩容、Docker 和 VM 管理
- [UniFi OS](https://store.ui.com/collections/unifi-network-unifi-os-consoles): 主要是 Dream Machine 搭载的系统，整体下来价格非常昂贵

通常情况下商业成品是一站式的解决方案，采购的话费用也会比自建要投入更多的资金，这个就不再 homelab 的考虑范围，这里就一笔带过。

## 开源&免费方案

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
- 各种开发板：比如树莓派从 3B 开始它也能做一些 homelab 的应用场景，国内外资料丰富，配件众多。唯一的缺点受新冠影响它的价格在国内居高不下，可以考虑一些其他成熟的开发板。
- 各种矿渣主机：区块链盛行的挖矿行业充斥着很多挖矿主机，比如星际蜗牛、绿盘、蜜獾超存等，有些硬件参数还不错到手之后需要调节或改下静音风扇就可用。

最简单的版本就是可以找一个可以长期运行的不再使用的笔记本电脑、台式电脑就能起步（功耗太高的话就真的算了）

## 软件部署方案

硬件准备完备之后，我们来考虑搭配哪种软件部署方案，通常会被划分为三大类：

- 传统部署（Traditional Deployment）
- 虚拟化部署（Virutalization Deployment）
- 容器化部署（Containerd Deployment）

{{< figure src="/tutorials/how-to-homelab/part-0/container-evolution.svg"
    link="/tutorials/how-to-homelab/part-0/container-evolution.svg"
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
    link="/tutorials/how-to-homelab/part-0/bare-metal.jpg"
    title="Bare metal 方案"
    caption="图片来源"
    attr="The Cloud Girl"
    attrlink="https://thecloudgirl.dev/BareMetal.html"
>}}

### 虚拟化部署

- [ESXi](https://www.vmware.com/products/esxi-and-esx.html): VMware 公司开发的硬件虚拟化解决方案，界面简单易用，自身功能较强，付费使用
- [Proxomx](https://www.proxmox.com): 基于 Debian 开发企业级虚拟化系统，支持硬件直通，可扩展集群，上手难度略高，简称 PVE

基于开源解决方案实在没有太多可选性，PVE 是市面上最成熟、社区活跃也很高的方案，
就算遇到奇奇怪怪的问题善用搜索引擎代替上都可以解决。

### 容器化部署

- [Docker](https://www.docker.com/): 现代容器化的开山鼻祖，自己比较作引发了大叛逃就有了下面两个解决方案
- [Containerd](https://containerd.io/): 始于 Docker 母公司，壮大在 CNCF 基金会，提供 nerdctl 代替 docker CLI
- [Podman](https://podman.io/): Red Hat 公司领导的兼容 Docker 的解决方案

一句话总结没看懂就用 docker 就行。

## 基础系统

如果选择传统部署随便用一个你熟悉且满足你需求的操作系统即可

## 应用服务

定好软硬件的基础后您需要面对非常庞大的应用服务来扩展和丰富 homelab

### 初阶方案

#### 软路由

- [openwrt](https://github.com/openwrt/openwrt): 国内最近今年非常主流的解决方案，国内有个 [immortalwrt](https://github.com/immortalwrt/immortalwrt) 分支版本
- [梅林](https://www.asuswrt-merlin.net/): 华硕开源的路由器固件，同样国内有个 [koolcenter](https://www.koolcenter.com/) 改版
- [dd-wrt](https://dd-wrt.com/): 在流行刷路由器初期的懵懂的固件，受限于硬件支持度和更新频率渐行渐远，当时支持多 wan 的 tomato

#### 网关

- [nginx](https://www.nginx.com/): 老牌传统网关，用于托管或反向代理网站服务
- [caddy v2](https://caddyserver.com/): 现代化设计的 HTTP/2 且支持 [Let’s encrypt](https://letsencrypt.org/) 的网关

#### DNS

- [dnsmasq](https://dnsmasq.org/): 一切的基础，用于配置 DNS 和 DHCP 服务
- [pi-hole](https://pi-hole.net/): 主打保护隐私和过滤广告的路由系统，常用海外用户
- [adguard home](https://adguard.com/zh_cn/adguard-home/overview.html): 专注保护隐私和过滤广告全网广告拦截的服务，提供用户友善的 UI 界面
- [smartDNS](https://github.com/pymumu/smartdns): 加速 DNS 解析分流的 DNS 服务
- [mosdns](https://github.com/IrineSistiana/mosdns): 集 smartDNS 和 adguard home 优点并存的 DNS 服务但配置麻烦

#### 防火墙

- [iptables](https://www.netfilter.org/projects/iptables/index.html): Linux 常见的内置防火墙
- [nftables](https://www.netfilter.org/projects/nftables/index.html): iptables 的官方增强版，未来的趋势都会慢慢迁移过来
- [pfSense](https://www.pfsense.org/): 国外普遍使用的一款开源防火墙

#### NAS

- [OpenMediaValut](https://www.openmediavault.org/): 硬件依赖低门槛的综合性 NAS 系统

#### 服务部署

- [portainer](https://www.portainer.io/): 简单容易上手的容器化部署解决方案

#### 影音

- [Jellyfin](https://jellyfin.org/): 影视剧、电影等媒体播放服务，支持片源资料搜刮和看过数据同步服务

#### 应用

- [Bitwarden](https://bitwarden.com/): 开源且完全可代替 1 Password 的全平台密码生成管理服务，推荐使用开发者用 Rust 重写的 [vaultwarden](https://github.com/dani-garcia/vaultwarden)
- [ZoneMinder](https://zoneminder.com/): 开源多路摄像头&录像管理服务

更多的应用可以关注我的[自建服务集合](https://github.com/stars/icyleaf/lists/self-host-services)

### 高级进阶

下面介绍的也仅限于我个人能力范围内目前想到的点，能力有限也请手下留情。

#### 网关

- [traefik](https://traefik.io/traefik/): 一款开源的反向代理与负载均衡综合性工具

#### NAS

- [TrueNAS](https://www.truenas.com/): 国外做数据存储的首选，基于 ZFS 文件系统内存大小决定磁盘容量的上限，前身叫 FreeNAS

#### 服务部署

- [Kubernetes](https://kubernetes.io/): 现代容器化编排系统，所谓的云 YAML 工程师终极工具 😆

## 小结

homelab 玩法的可能性是无限的，不要把想象力局限在这几年国内流行的所谓 AIO Boom：
使用 pve 部署一切，更甚者用 openwrt + docker 部署各自服务出现问题先不说，
真遇到服务器宕机一波全带走。

另外不要太过于计较服务器的功耗情况，只要不是电耗子 35W 还是 65W 没省多少电费，
下面是一个正面例子，虽然用的是 X99-T8D + E5 2696V3*2 + 金河田 6100 双路电源
但开发者主要用于适合自己场景的使用，那就不是浪费。

{{<twitter user="yetone" id="1540235004495921152">}}

下面这个图中的例子是一个反面教材，要么哗众取宠要么非蠢即坏。

{{<twitter user="taresky" id="1555752846334705666">}}

最后的忠告，国内各自信息咨询站的 OpenWrt，NAS 文章看看就行，别太认真。
有那时间不如多看看官方文档，官方社区讨论 :D
