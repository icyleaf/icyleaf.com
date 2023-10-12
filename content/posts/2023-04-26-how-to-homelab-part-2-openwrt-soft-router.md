---
title: "如何搭建家用 homelab: Openwrt 软路由"
description: 用牺牲硬件的网络转换效率来换取不必受设备提供商的限制和可玩性
date: 2023-04-26T20:30:00+08:00
slug: "how-to-homelab-part-2-openwrt-soft-router"
aliases:
  - how-to-homelab-part-2
type: posts
index: true
comments: true
isCJKLanguage: true
series:
  - Homelab
categories:
  - Technology
tags:
  - hardware
  - architecture
  - openwrt
image: https://images.unsplash.com/photo-1521542464131-cb30f7398bc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2673&q=80
imageSource:
  - name: Thomas Jensen
    link: https://unsplash.com/photos/UrtxBX5i5SE
  - name: Unsplash
    link: https://unsplash.com
---

{{< tip title="加入讨论群" >}}
方便大家沟通交流，开通了 Discord 讨论群便于第一时间获得教程的最新更新，并提供关于 Homelab 沟通、疑惑解答专区，欢迎[大家加入](https://discord.gg/gdXpKyh85r)。
{{< /tip >}}

路由器是猫总管（调制解调器）最得力的一把手，掌管 homelab 网络大权。对于中国玩家提到软路由肯定绕不开 OpenWrt，今天我尝试用一个全新的视角唠唠这个大家熟悉却又陌生的系统。
以下会涉及大量的基础认知、概念理解，__不会涉及网络配置或高阶玩法__。

## 什么是 OpenWrt

> 与同价位的硬路由相比，软路由硬件更好，可配置性更高，但需要一定的网络知识才能发挥作用。软硬路由的选择取决于网络环境的场景，有些人投入了软路由的怀抱，有些人经历了软路由后[坚定的使用硬路由](https://taresky.com/2019byebye)，还有些人的硬路由之下还会接一个软路由当旁路由[^openwrt-bride-mode]。

[OpenWrt](https://openwrt.org/) 首先是一个开源的操作系统，能够实现硬路由器的核心功能：LAN 和 WAN 的网络转发、路由（DHCP、防火墙、DNS 解析等），在 Linux 开放的生态和社区基础上扩展出丰富的功能[^openwrt]，这个是硬件路由器没有能力达到的（钞能力或重刷魔改固件除外）。

{{< figure src="/tutorials/how-to-homelab/part-2/openwrt-packages-preview.png"
    link="/tutorials/how-to-homelab/part-2/openwrt-packages-preview.png"
    title="丰富的软件包资源"
    caption="图片来源"
    attr="SuLingGG/OpenWrt-Rpi"
    attrlink="https://github.com/SuLingGG/OpenWrt-Rpi"
>}}

它适配 x86、x86_64、arm、arm64 和 MIPS 等架构上千种硬件设备。硬件要求极低，21.02 版本最低要求 16M 闪存和 128M 内存，2023 年的今天没有人会拿老的硬路由古董去折腾它了吧，没有吧？没有吧？任意一台淘汰的 x86 设备都高于这个配置。
且在 x86/x86Z_64 平台安装它甚至比安装 Ubuntu、Debian 系统还要简单。较全的列表请查阅[官方硬件支持列表](https://openwrt.org/supported_devices) 未列入的还可以在 [Github 搜索](https://github.com/search?q=openwrt&type=repositories)。

## 版本分布

OpenWrt 虽然有一套[发布流程](https://openwrt.org/zh/releases/start)却没有稳定的发版节奏和老版本的废弃规则。版本号类似[语义化版本规范](https://semver.org/lang/zh-CN/)划分 `X`.`Y`.`Z` 三段。`X`.`Y` 是年和月相对固定，小功能迭代全靠更新 `Z` 的值。版本大致划分两类：

- 稳定版：生产环境 Ready 的稳定版本。v22.03.2 是该系列的最新版本。
- 开发版：不稳定但会包含不断的迭代增强功能的开发版本，也称之为 snapshot 版本，完成[里程碑](https://openwrt.org/docs/guide-developer/releases/goals/start)会进入 RC 版本。

版本 | 状态 | 重大变化
---|---|---
[snapshot](https://openwrt.org/zh/releases/snapshot) | 开发版本 | -
[22.03](https://openwrt.org/zh/releases/22.03/start) | 最新版本 | 基于 5.10 内核、防火墙迁移 nftables、黑暗模式
[21.02](https://openwrt.org/zh/releases/21.02/start) | 可看做是 LTS 版本 | 基于 5.4 内核、DSA 初步支持
[19.07](https://openwrt.org/docs/guide-developer/releases/goals/19.07.4) | 不再支持 | 基于 4.11 内核、WPA3 支持、客户端渲染 luci
[18.06](https://openwrt.org/zh/releases/18.06/start) | 不再支持 | 基于 4.9 或 4.11 内核、合并 Lede 源码
[LEDE 17.01](https://openwrt.org/zh/releases/17.01/start) | 不再支持 | 基于 4.4 内核

以上版本信息是截止 2023 年 4 月底。

## 衍生及支系

> 话说天下大势，分久必合，合久必分

开源系统生态同样遵循，有些是不满原系统的管理或生态愤恨分支的支系，有些是针对特定的方面有了深化的衍生功能，列举几个我了解的支系。

### LEDE

[LEDE](https://zh.wikipedia.org/wiki/LEDE) 是前者的原因分支出来的一派，新增了很多关键新功能和对新设备的支持而崛起，在 2018 年 1 月 LEDE 宣布和 OpenWRT 和解正式宣布合并，合并后使用 OpenWrt 的名字和 LEDE 的代码。

早期国内知名的 [Lean 狼大](https://github.com/coolsnowwolf)的 [Lede 系统](https://github.com/coolsnowwolf/lede)，很多国内玩家最早接触的系统之一。

### Immortalwrt

基于官方分支的 [Immortalwrt](https://github.com/immortalwrt) 是一个跟进上游速度很快又融合了 Lean 狼大版本特色的新支系。Lean 狼大[也有参与其中](https://twitter.com/icyleaf/status/1496789460473638913)，主要是针对中国玩家定制的固件，拥有更好的本地化适配、加入了各种官方软件列表中没有但是国内环境中可能会用到的软件功能，比如网络多拨、国内镜像及{{< spoiler >}}翻开也不会告诉你的功能等。{{< /spoiler >}}

我从 21.02 开始跟进并使用 snapshot 开发版本没遇到什么大坑，该项目每周都会定时合并上游的代码。

### iStoreOS

同样是基于官方分支的 [iStoreOS](https://www.istoreos.com/) 另辟蹊径，舍弃了 OpenWrt 自身的包管理机制，重新打造了一套类似 [KoolCenter 梅林固件](https://www.koolcenter.com/category/merlin)的软件商店用于解决因为 OpenWRT 系统依赖和软件包依赖杂乱导致不同平台的插件依赖不匹配而无法安装的问题。同时提供多套 UI 操作界面和类似上面一样特色功能和 NAS 向功能：网盘、Docker、异地组网、相册备份等。

> 由于个人没有实际部署和使用，按下不表。

## 固件构成

不同的硬件和软件包的搭配组合衍生出五花八门的固件版本。那有没有想过固件到底是什么，有什么组成的呢？

固件的构成主要是三类 vmlinuz、rootfs 和系统引导。

- vmlinux 是 ELF 文件最原始包含 Linux 内核静态链接的可执行文件；vmlinuz 是压缩后的 vmlinux 且能可启动的文件[^vmlinuz]。
- rootfs 是 OpenWrt 的根分区的所有文件，提供 gzip 压缩后的原始文件、ext4 分区后的文件和 squashfs 分区后的文件。
- 系统引导是引导设备开机后正确引领到上述两个文件的 bootloader，OpenWrt 借助的是 grub2 来实现 legacy 或 EFI 分区引导。

固件文件名包含的 combined 译为合并这就是上面几个文件的自由组合，组合方式会从`文件分区`和`封装`两个字段体现。

{{< figure src="/tutorials/how-to-homelab/part-2/openwrt-file-structure.png"
    link="/tutorials/how-to-homelab/part-2/openwrt-file-structure.png"
    title="Openwrt 固件文件解构"
>}}

OpenWrt 文件系统分区可选择 [ext4](https://zh.wikipedia.org/wiki/Ext4) 或 [squashFS](https://en.wikipedia.org/wiki/SquashFS)。ext4 是一个可读可写的分区格式，这也是 Linux 生态应用最广的文件系统；对比 squashFS 它是一个只读的分区格式，看似不好用但它却有一个非常诱人的功能，可恢复出厂设置或直刷同文件分区的固件达到升级的功能，只不过需要挂在其他可写的磁盘做扩展应用。

封装格式提供可烧录的 iso、img 镜像外，还提供了虚拟化的镜像文件，方便使用者根据各自的情况随意部署。

多提一句，官方还额外其他提供一个组合字段 `-factory` 和 `-sysupgrade` 来区分全新安装或升级的专属固件，这俩不能混用。

> 本节会涉及 Linux 的启动机制，我也是略懂皮毛，如果有描述错误请指正。

## 安装固件

{{< figure src="/tutorials/how-to-homelab/part-2/openwrt-fireware-image-files.png"
    link="/tutorials/how-to-homelab/part-2/openwrt-fireware-image-files.png"
    title="Openwrt 固件镜像文件"
>}}

我相信结合上面的固件构成的原理在选择什么类型的固件上会迎刃而解了吧。安装步骤略过不讲了吧，网络上有[太多的教程](https://www.google.com.hk/search?q=openwrt+%E5%AE%89%E8%A3%85)可供参考。

## 系统核心

### 访问渠道

OpenWrt 提供 Web UI 和 SSH 两种方式访问和管理，默认 Web 界面由 [luci](https://github.com/openwrt/luci) 实现前端展示，uhttpd 负责 web 代理服务。
可通过浏览器访问 http://192.168.1.1 或 http://openwrt.lan 打开，默认开放 80 端口；SSH 端口为 22，默认用户名为 root，没有密码。

{{< figure src="/tutorials/how-to-homelab/part-2/openwrt-themes-preview.png"
    link="/tutorials/how-to-homelab/part-2/openwrt-themes-preview.png"
    title="luci 丰富的主题"
    caption="图片来源"
    attr="3elajar OpenWrt"
    attrlink="https://blog.vpngame.com/openwrt/cara-install-dan-ganti-tema-luci-di-openwrt/"
>}}

luci 是官方维护和默认内置开启的前端 UI 实现，其实深挖能发现还有很多的[实现方案](https://openwrt.org/docs/guide-user/luci/webinterface.overview)。
还有社区近期还在维护的 [oui](https://github.com/zhaojh329/oui)、[x-wrt](https://github.com/x-wrt/x-wrt) 和很久不再更新的 [juci](https://github.com/mkschreder/juci) 等。
这也能够看的出来 OpenWrt 在系统开放性上有很大的包容度。

### 网络接口

默认使用 LAN 2（eth1） 为 WAN 口，LAN 1（eth0）为 LAN 口，如果有多个 WAN、LAN 口需要在网络接口中重新配置。

### 配置管理

系统的配置文件系统层面绝大多数的配置文件都储存在 `/etc/config` 路径下面，编辑保存后是保存对于配置文件而不是实际修改对应服务，因此需要再执行提交操作，这部会完成把部分服务的中间配置更新到真正的配置文件中，再有必要的执行服务的重启操作。

我会通过“修改 LAN IP 地址”的例子分别演示 OpenWrt 配置文件的修改的几种途径。

#### 通过 Web UI

luci 提供网页的可视化操作，比如查看配置、更新管理等配置的管理工作。

{{< figure src="/tutorials/how-to-homelab/part-2/openwrt-luci.png"
    link="/tutorials/how-to-homelab/part-2/openwrt-luci.png"
>}}

分别选择 "网络" -> "接口"，找到接口 lan 右侧的编辑按钮，点开后编辑 IPv4 地址，保存再应用。

#### 通过终端编辑器

使用 vim 或 nano 这类文本编辑器编辑 `/etc/config/network` 文件，找到 lan 分段下面的 ipaddr 修改值：

```diff
config interface 'loopback'
  option device 'lo'
  option proto 'static'
  option ipaddr '127.0.0.1'
  option netmask '255.0.0.0'

config globals 'globals'
  option ula_prefix 'fdd3:af57:2ab4::/48'

config device
  option name 'br-lan'
  option type 'bridge'
  list ports 'eth0'
  option ipv6 '0'

config interface 'lan'
  option device 'br-lan'
  option proto 'static'
-	option ipaddr '192.168.1.1'
+	option ipaddr '10.10.10.1'
  option netmask '255.255.255.0'
  option ip6assign '60'
  option gateway '192.168.16.1'
  list dns '233.5.5.5'
  list dns '202.106.0.20'
```

保存后在重启 network 服务。

```bash
$ /etc/init.d/network restart
```

#### 通过终端 uci 工具

{{< figure src="/tutorials/how-to-homelab/part-2/openwrt-uci.png"
    link="/tutorials/how-to-homelab/part-2/openwrt-uci.png"
    title="Openwrt uci 对应关系"
    caption="图片来源"
    attr="OpenWrt Wiki"
    attrlink="https://openwrt.org/docs/guide-user/base-system/uci"
>}}

[uci](https://openwrt.org/docs/guide-user/base-system/uci) 是配置管理的快捷 CLI 工具，它会比网页编辑或终端找配置文件编辑都要方便。

```bash
# 设置 LAN 的 IP 地址
$ uci set network.lan.ipaddr=10.10.10.1
# 提交应用操作
$ uci commit network
# 重启网络服务
$ /etc/init.d/network restart
```

#### 通过 JSON-RPC 接口

{{< figure src="/tutorials/how-to-homelab/part-2/api-architecture-styles.jpeg"
    link="/tutorials/how-to-homelab/part-2/api-architecture-styles.jpeg"
    title="API 接口方案一览图"
    caption="图片来源"
    attr="Rapid@twitter"
    attrlink="https://twitter.com/Rapid_API/status/1567656196022181891"
>}}

Openwrt 内部通信全靠的是 [ubus](https://openwrt.org/docs/techref/ubus) 总线工具，JSON-RPC 是基于它的二次封装的接口服务。固件默认不会开启此服务，如果需要请在编译固件配置中[开启它](https://github.com/openwrt/luci/wiki/JsonRpcHowTo)。

```bash
# 登录认证获得 token (返回 JSON 的 result 字段值)
$ curl http://<hostname>/cgi-bin/luci/rpc/auth --data '
{
  "id": 1,
  "method": "login",
  "params": [
    "user", "password"
  ]
}'

# 修改 LAN IP 地址
$ curl http://<hostname>/cgi-bin/luci/rpc/uci?auth=yourtoken --data '
{
  "method":"set",
  "params":[
    "network", "lan", "ipaddr", "10.10.10.1"
  ]
}'

# 提交 network 配置变更
$ curl http://<hostname>/cgi-bin/luci/rpc/uci?auth=yourtoken --data '
{
  "method":"commit",
  "params":[
    "network"
  ]
}'

# 重启 network 服务 （接口请求后可能无法正常响应）
$ curl http://<hostname>/cgi-bin/luci/rpc/sys?auth=yourtoken --data '
{
  "method":"call",
  "params":[
    "/etc/init.d/network restart"
  ]
}'
```

更全面的接口地址和调试可前往我维护的 Postman [OpenWrt RPC 接口合集](https://documenter.getpostman.com/view/14290/SzKPUgEo)。

### 设备管理

Dnsmasq 是默认配置和管理设备 DHCP、DNS 为一体的服务，配置文件是 `/etc/config/dhcp`，应用服务 `/etc/init.d/dnsmasq`。

### 防火墙

OpenWrt 22.03 版本开始不再使用 iptable 而是该用 nfstable 实现。两个同时时候存在不兼容情况需要注意。防火墙还承担接口转发的配置，
配置文件是 `/etc/config/firewall`，应用服务 `/etc/init.d/firewall`。

### DDNS

动态动态域名解析，解决公网IP不固定的问题，前提是要有公网 IP 才行。可通过给客户提工单说需要用摄像头看家里的猫猫、狗狗、鱼鱼、龟龟为理由有一定概率给开通。
配置文件是 `/etc/config/ddns`，应用服务 `/etc/init.d/ddns`。注意使用不同的域名供应商需要安装对应的软件包扩展才行。

### 包管理

[opkg](https://openwrt.org/docs/guide-user/additional-software/opkg) 是 OpenWrt 的包管理工具，命令类似于 Debian 的 apt。
它可设置官方和第三方源。也能安装、升级和卸载包的功能。配置目录文件是 `/etc/opkg.conf` 文件和 `/etc/okpg` 目录下面的其他源配置文件构成。软件包是 `.ipk` 扩展名。网页端也有对应的功能实现。

## 编译固件

国内似乎有一个偏见，任何的软件升级和新软件包都要重新编译和重刷固件，以至于流行起了利用 Github Action 白嫖资源来编译符合一万个人心中的哈姆雷特。

编译固件的教程也异常的多，在 Github 能找到很多硬件设备、很多个性化的编译固件的工具，实在懒省事也有开发者提供在线[自定义构建固件工具](https://supes.top/)供您选择。

前期刚开始接触的时候[我也不例外](https://github.com/icyleaf/openwrt-autobuilder)加入到了编译固件的行列，直到最近意识到编译固件只是为了升级几个软件包版本而觉得这个事情有些偏离了设计初衷，我也开始尝试自己编译所需的[软件包](https://github.com/icyleaf/openwrt-packages)和[软件源](https://github.com/icyleaf/openwrt-dist)。

### 开发软件包

如果你是要开发新软件包或编译软件包，你会立刻头大起来，这方面的资源可是少的可怜，我的建议是照着[官方文档](https://openwrt.org/docs/guide-developer/toolchain/single.package)一步步来。

你需要的是理解如何准备开发环境、克隆源码、安装编译环境和了解项目的目录结构，官方也考虑到前期准备会异常辛苦和困难重重，特意提供一个三种开发包。

{{< figure src="/tutorials/how-to-homelab/part-2/openwrt-dev-files.png"
    link="/tutorials/how-to-homelab/part-2/openwrt-dev-files.png"
    title="Openwrt 开发包文件"
>}}

- [toolchain](https://openwrt.org/docs/guide-developer/toolchain/buildsystem_essentials#description): 包含了 GCC 编译器、编译必须的二进制工具和链接器（比如 tar, binutils 等）以及 C 标准库（比如 glibc、musl、uClibc 或者 dietlibc）组成的预编译环境，方便修改 OpenWrt 源码。
- [SDK](https://openwrt.org/docs/guide-developer/toolchain/using_the_sdk): 包含了预编译 toolchain 包和一个编译平台（target 或叫 platform）用于不同平台交叉 ipk 软件包的开发套件。需要注意的是仅允许 ipk 软件包交叉编译，固件本身无法交叉编译。
- [imagebuilder](https://openwrt.org/zh/docs/guide-user/additional-software/imagebuilder): 一个能够快速调整固件内容的特定平台预编译的开箱包，能够这个预设好的环境精简预装的 ipk 包、调整系统参数也能够快速生成个性化固件。需要注意的是软件包是提前预设好，只能精简无法添加新软件包。

本章节只是浅浅让大家了解并没有计划全面展开，如果你想更深入如何开发一个 OpenWrt 软件包，欢迎留言跟我互动，多的话我或许会单开一个系列。

## 最后想说的话

在我的 Homelab 网络拓扑中 OpenWrt 仅仅承担有线部分的网络转发和路由功能，主要是 DHCP、DNS、DDNS 和网络加速为主，无线网络会再通过下游的 Mesh AP 完成。
Docker、网盘等这类复杂且有风险的功能不会出现在 OpenWrt 系统。

接下来会开启存储服务和 VM 虚拟机管理系统 Proxmox 等核心基础服务。

<!-- 以下是注脚 -->

[^openwrt-bride-mode]: 可参考[川叶](https://blog.lishun.me/openwrt-mega-post)的教程查看主旁路由设置和性能对比
[^openwrt]: [维基百科](https://zh.wikipedia.org/wiki/OpenWrt)的解释
[^vmlinuz]: vmlinuz 资料参考[内核环境搭建和基础知识](https://zoepla.github.io/2019/09/%E5%86%85%E6%A0%B8%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E5%92%8C%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/)和[vmlinuz 文件解压缩](https://blog.csdn.net/catoop/article/details/120809707)
