---
title: "如何搭建家用 homelab: 硬件和架构"
description: 回顾自己家庭的设备架构和不容忽视的因素
date: 2023-01-28T13:58:50+08:00
slug: "how-to-homelab-part-1-hardware-and-architecture"
aliases:
  - how-to-homelab-part-1
type: posts
draft: true
index: true
comments: true
isCJKLanguage: true
series:
  - Homelab
categories:
  - Technology
tags:
  - homelab
  - hardware
  - architecture
image: https://images.unsplash.com/photo-1549319114-d67887c51aed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2874&q=80
imageSource:
  - name: Martijn Baudoin
    link: https://unsplash.com/photos/4h0HqC3K4-c
  - name: Unsplash
    link: https://unsplash.com
---

前面[先导篇]({{< ref "posts/2022-02-12-how-to-homelab-part-0.md" >}})全面讲了下搭建家用 homelab 软硬件的可能性，每个人的室内环境，网络布线都不太一样，我也没有办法给出一个 100% 的通用解决方案。我会先描述当前我的设备架构选项，也会给出一些布网和搭建中不容忽视的因素。

## 我的设备架构

首先声明个人设备架构并不代表这是最佳的方案，只是当前符合我要求的结果，随着需求和技术变化而迭代更新。

### 网络拓扑

{{< figure src="/tutorials/how-to-homelab/part-1/homelab-diagram-v2.1.png"
    link="/tutorials/how-to-homelab/part-1/homelab-diagram-v2.1.png"
    title="2022 年底 v2.1 网络拓扑图"
    caption="图片来源"
    attr="@icyleaf@twitter.com"
    attrlink="https://twitter.com/icyleaf/status/1619228928685801474"
>}}

当时房子装修的时候一切从简{{< spoiler >}}（没有钱）{{< /spoiler >}}，让我有些后悔没有舍得花钱的地方：一是弱电箱太小且位置非常尴尬；二是各个屋子埋线的位置不太合理会有很多 WIFI 死角。不过还好的是开发商预埋的都是 6 类线，**千兆网络是不可或缺的**。假如你不知道家里网络的状态，可通过两台任意可连接有线的设备，运行 [iperf3](https://github.com/esnet/iperf) 服务器端和客户端进行检测。

```bash
# 一台开启服务端，假设服务器 IP 是 192.168.1.100
iperf3 -s

# 一台开客户端，连接服务端进行测试
iperf3 -c 192.168.1.100
```

### 设备选项

一台联通送的光缆猫和一台 4 口软路由勉强放在弱电箱。光缆猫不用多说就是负责接入网络运营商，路由器负责拨号和内网管理，如果软路由的 LAN 口不够到各个房间或者软路由的性能太差，建议新增一个 4 口交换机接替设备的数据交换来减轻路由的压力。

### 路由

## 最低限度设备架构

- 路由器
- 资源服务器

单独把路由器隔离出来主要是为了必备炸机后没有了网络，这样的搭配最起码你还能有台方便查问题的电脑，顺便 SSH 登录服务器不是。

### 路由器

只要能够满足拨号、数据交换、DHCP 和 DNS 服务跑起来高峰不满载即可。如果家里有很多智能设备那还需要考虑 WIFI 的数量上限来决定是不是需要采购 AP。

### 资源服务器

好吧，不得不说这个概念最近炒的很火热，但我说的并不是一次性把性能拉满非要上个 Intel 11、12 代 CPU、动不动就 8 核 16 线程，还要省电。

## 不容忽视的因素

采购资金肯定是优先需要考虑的点，在此基础上购买什么硬件也都能够很容易分析出来。我想从一些比较容易忽略的因素下手以确保 homelab 能够发挥最大的效能。

### 网线规格

__务必保证所有 homelab 的设备都用有线网络互联__，WIFI 会收到周围信道干扰、传输衰减等不稳定性问题，以下是网线的规格汇总：

| 规格 | 命名 | 速率 | 接口 | 备注 |
| --- | --- | --- | --- | --- |
| CAT 5 | 五类线 | 100Mbps | RJ45 | 不推荐 |
| CAT 5E | 超五类线 | 1000Mbps | RJ45 | 最低限度 |
| CAT 6 | 六类线 | 1Gbps/10Gbps* | RJ45 | 50 米内可实现万兆网络 |
| CAT 6A | 超六类线 | 10Gbps | RJ45 | 200 米内可达万兆网络;国际上是 6A，6E 是大陆自己定义 |
| CAT 7 | 七类线 | 10Gbps | GG45/TERA | 带着遮蔽 |
| - | 光纤 |  |  | 不懂，详见[维基百科](https://zh.wikipedia.org/zh-cn/%E5%85%89%E7%BA%96%E9%80%9A%E8%A8%8A) |

从经济上看来 CAT 6/6A 是最佳选择，土豪们 CAT 7 或光纤随意。

### 噪音和散热

- 硬件：
  - 机械硬盘读写盘（有钱就全 SSD）
  - 各种风扇（CPU 散热、显卡、机箱、电源等）
  - 主板 DEBUG 蜂鸣器（有的可关闭或拆除）
- 摆放位置决定噪音耐受度和散热效率

### 省电和功率

- CPU 的待机 TPW 只是参考，还需要考虑硬盘，内存和显卡整体，还需要考虑峰值功率。

### 紧急电源

一次电力的闪断更有可能你正在运行的服务器硬件尤其是的硬盘就会出现故障而坏掉，保证数据的安全性 UPS 不间断电源是必备的，优先考虑支持通讯的，因为停电虽然有 UPS 可以用电池模式继续保持运行，电池电量是有限的服务器如果知道当前的状态进行安全关机。
