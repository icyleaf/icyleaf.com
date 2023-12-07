---
title: "如何搭建家用 homelab: 数据存储"
description: 如果你想部署任何一个服务，你都需要存储一些数据
date: 2023-07-24T10:30:25+08:00
slug: "how-to-homelab-part-3-storages"
aliases:
  - how-to-homelab-part-3
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
  - storages
image: https://images.unsplash.com/photo-1686705562930-4f3e46f620d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80
imageSource:
  - name: Michael Kahn
    link: https://unsplash.com/@mklibrary
  - name: Unsplash
    link: https://unsplash.com
---

{{< tip title="加入讨论群" >}}
方便大家沟通交流，开通讨论群便于第一时间获得教程的最新更新，并提供关于 Homelab 沟通、疑惑解答专区，欢迎大家加入：[Discord](https://discord.gg/B5RxWfGngG) 或 [Discord](https://t.me/GeekAdventure)。
{{< /tip >}}

当你有些照片、视频需要存放时；或跑一些无状态的应用或服务时；或同步转存某网云的文件时，这些数据是不是都要保存起来，这就是数据存储。本篇的内容都是从各方面浅尝辄止的介绍，每个部分展开讲都是很大的篇幅，能力有限，大家多多理解。

{{< figure src="/tutorials/how-to-homelab/storages/hp-micro-gen8.jpeg"
    title="我的 NAS 服务器"
>}}

## 存储介质

存储介质只从硬盘考虑，无论是 HDD 机械硬盘还是 SSD 固态硬盘在适合的场合都是不错的选择。

### HDD 机械硬盘

HDD 全称是 Hard Disk Drive，采用纯机械结构，数据存储在一张环形的磁性盘片上，通过磁头持续移动来读取数据或写入数据（有点类似胶片机）

{{< figure src="https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
    title="HDD 机械硬盘的内部结构"
    caption="图片来源"
    attr="benjamin lehman"
    attrlink="https://unsplash.com/photos/GNyjCePVRs8"
>}}

HDD 硬盘优点是存储容量大、价格便宜，缺点是容易损坏且噪音较大。为了突破更大的容量限制，硬盘厂商也在从各种科技层面持续改进诞生了 12T+ 大容量硬盘。

读写速度受转速、磁盘数量等因素影响。转速是指硬盘每分钟旋转的圈数，单位是 rpm（每分钟的转动数），常见的有 5400rpm 和 7200rpm 规格。一般来讲转速越高读写速度越好，但噪音、耗电量和发热量也越高；单个磁盘容量是有上限的，想要更大容量最简单的方案是增加更多磁性盘片。

{{< figure src="/tutorials/how-to-homelab/storages/9-platter-Ultrastar-18TB-HDD.jpeg"
    title="HDD 多磁盘"
    caption="图片来源"
    attr="anandtech"
    attrlink="https://www.anandtech.com/show/17097/western-digital-30tb-hdd-plans-mamr-future-unclear"
>}}

多磁盘的出现就要引出 CMR/PMR 垂直磁记录（垂直盘）和 SMR 叠瓦磁记录（叠瓦盘）两个概念，传统机械硬盘都属于前者， 2013 年希捷发布了可以提高存储容量高出 25% 的 SMR 磁盘，但由于读取寻址复杂，写入影响之前的数据，现在非常不受大家欢迎。

硬盘厂商现在出售的 HDD 硬盘会两种混合出货，现在购买尽可能考虑 CMR/PMR 垂直盘。

{{< figure src="/tutorials/how-to-homelab/storages/pmr-vs-cmr.jpeg"
    title="CMR/PMR 和 SMR 磁盘结构对比"
    caption="图片来源"
    attr="buffalotech"
    attrlink="https://www.buffalotech.com/blog/cmr-vs-smr-hard-drives-in-network-attached-storage-nas"
>}}

### SSD 固态硬盘

SSD 全称是 Solid-state Drive，采用纯 NAND 存储芯片来减少损坏和提升高读写的速度，因为制造工艺复杂且芯片厂家较少目前价格还处于一个有竞争力的市场上，随着国内厂商的研发速度逐渐提升，从价格方面收益的还是广大的消费者的我们。

{{< figure src="/tutorials/how-to-homelab/storages/ssd-nand.png"
    title="SSD 固态硬盘内部结构"
    caption="图片来源"
    attr="advantech"
    attrlink="https://www.advantech.com/pt-br/resources/news/choosing-the-right-ssd-technology-for-expanding-embedded-application-requirements"
>}}

这种硬盘的特点是新技术的魅力：拥有超高速的读写速度，使用时不会担心晃动造成的硬盘损坏。但存储容量同样也是有单个或多个 NAND 芯片构成，但不会像机械硬盘那么大，4 TB 已经是很大的容量了。

读写速度受芯片的工艺、良品率和有无额外硬件外部缓存芯片等因素影响，在深入就不懂了，摘部分[维基百科](https://zh.wikipedia.org/wiki/%E5%9B%BA%E6%80%81%E7%A1%AC%E7%9B%98)的介绍，有兴趣的自己再查吧。

> 目前用来生产固态硬盘的 NAND Flash 有四种，分别是单层式存储（SLC）、多层式存储（MLC，通常用来指称双层式存储）、三层式存储（TLC）、四层式存储（QLC）。有些厂商亦称 TLC 为 3-bit MLC。
>
> SLC、MLC、TLC 的读写速度依序从快至慢（约4:2:1），使用寿命依序从长至短（约 6:3:2），成本依序从高至低，需要纠错比特数（ECC）则是相反地从低至高（同一制程下 1:2:4。不过 ECC 也受制程的影响，同一种芯片，越小尺度的制程需要越多的纠错比特）。固态硬盘的主流从 SLC 芯片转到 MLC 芯片，促成了 2011 年的大降价，固态硬盘因此普及。

## 接口类型

### SATA

{{< figure src="/tutorials/how-to-homelab/storages/sata-drive-data-and-power-connectors.jpg"
    title="SATA 电源接口（左）及数据接口（右）"
    caption="图片来源"
    attr="wikipedia"
    attrlink="https://en.wikipedia.org/wiki/SATA"
>}}

早期 ATA 的串口改进版，SATA 规格的硬盘有 HDD 和 SSD 两种。其优点是抗干扰性强，线材细小且有较高的传输速度等原因一直沿用至今，现在已经成为主流的接口类型。最新的 SATA 3.0 标准能够达到 600 MiB/s 传输速度（6 Gbit/s 带宽）。

### M.2 (NGFF)

{{< figure src="/tutorials/how-to-homelab/storages/m2-keys-mean.png"
    title="M.2 接口图解"
    caption="图片来源"
    attr="delock"
    attrlink="https://www.delock.de/infothek/M.2/M.2_e.html"
>}}

M.2 原本的名称是 NGFF（Next Generation Form Factor），本来是用于取代 mSATA 为了兼容早期硬件设计层面有 USB 规格、SATA 规格和 PCIE 规格，它们的传输速度依次递增。使用 PCIE 通道的往往又被叫做 NVMe。

### mSATA

{{< figure src="/tutorials/how-to-homelab/storages/m2-vs-msata.png"
    title="M.2 和 mSATA 对比"
    caption="图片来源"
    attr="r/gpdwin"
    attrlink="https://www.reddit.com/r/gpdwin/comments/80ial8/psa_dont_buy_msata_gpd_win_2_only_supports_m2_sata/"
>}}

一些国内工控机上还长能见到 mSATA 硬盘接口，它也遵循 SATA 协议只不过是采用的更小的接口的 SSD 硬盘，常用在小型化笔记本上，由于较小的体积优势特别适合放在工控机，虽然它的尺寸规格和 M.2 接口一样但接口协议是不一样的，无法兼容。

### USB

{{< figure src="/tutorials/how-to-homelab/storages/usb-speed.png"
    title="USB 3.x 标准"
    caption="图片来源"
    attr="wikipedia"
    attrlink="https://zh.wikipedia.org/wiki/USB"
>}}

USB 硬盘还有另外一个更熟悉的名称：移动硬盘。常用在电脑本身空间不足，各类较大资源的存储或者摄影、影视行业作为临时存储使用等场景。有些开发板（比如早期树莓派）无法提供更多的存储接口而往往会提供 USB 3.0 接口，在做一些非高频的读写应用场景也是能够满足需求的。只需要记着至少满足 USB 3.0 标准（能够达到 400 MiB/s 传输速度），3.1 标准最好（1.2 GiB/s 传输速度）。

连接接口方面我已经不想吐槽了，尤其是 Type-C 接口，针脚定义的是全的，厂商为了成本考虑，卖的便宜的线往往只能满足充电需求，没有数据传输针脚；有的虽然只需要充电考虑，也会漏一些针脚无法满足高功率（30-100W）的充电标准（高功率需要额外的 e-mark 芯片）；有点可能不支持 DP，HDMI 视频信号；绝大多数不支持雷雳/雷电/Thunderbolt 4 协议（需 Intel 认证），满满的坑，买的时候一点要看仔细，问清楚。

{{< figure src="/tutorials/how-to-homelab/storages/usb-type-list.png"
    title="USB 连接接口"
    caption="图片来源"
    attr="wikipedia"
    attrlink="https://zh.wikipedia.org/wiki/USB"
>}}

## 尺寸规格

### SATA 方面

{{< figure src="/tutorials/how-to-homelab/storages/hard-drive-size.png"
    title="硬盘尺寸大小"
    caption="图片来源"
    attr="delock"
    attrlink="https://www.delock.de/infothek/M.2/M.2_e.html"
>}}

常见的主要有 2.5 寸和 3.5 寸两种规格。2.5 寸 HDD 和 SSD 两种都会有，3.5 寸基本上全是 HDD 硬盘，SSD 容量都是芯片颗粒不会占太大体积没必要。

### M.2 (NGFF) 方面

{{< figure src="/tutorials/how-to-homelab/storages/m2-size.png"
    title="M.2 尺寸"
    caption="图片来源"
    attr="delock"
    attrlink="https://www.delock.de/infothek/M.2/M.2_e.html"
>}}

## 磁盘寿命

任何的硬盘厂商都会给硬盘一个保质期外还会有一个额外的评判条件来做参考，对于 HDD 硬盘是平均无故障工作时间 MTBF（小时为单位）；对于 SSD 硬盘是最大写入量（TBW 为单位）。两者的监控都可以通过支持 [S.M.A.R.T](https://zh.wikipedia.org/wiki/S.M.A.R.T.) 的任何应用完成。

{{< figure src="/tutorials/how-to-homelab/storages/wd-red-plus-specs.png"
    title="西数红盘的产品简介"
    caption="图片来源"
    attr="西部数据"
    attrlink="https://documents.westerndigital.com/content/dam/doc-library/zh_cn/assets/public/western-digital/product/internal-drives/wd-red-plus-hdd/product-brief-western-digital-wd-red-plus-hdd.pdf"
>}}

HDD 受机械结构的影响，很容易因为振动过大，写入时突然掉电出现坏道，少量的坏道可以通过磁盘检测和修复工具可以规避，随着磁盘坏道越来越多赶紧备份并替换新的磁盘的好。虽然评判标准是平均无故障工作时间，然而在实验室恒定条件下机械硬盘能够无故障工作几万甚至几十万小时，实际上要看 S.M.A.R.T 检测报告的情况。

{{< figure src="/tutorials/how-to-homelab/storages/hard-disk-platter-damanged.jpeg"
    title="磁盘坏道"
    caption="图片来源"
    attr="blocks&files"
    attrlink="https://blocksandfiles.com/2019/07/12/the-reasons-disk-drives-fail/"
>}}

SSD 最大 TPW 值通常都会商品参数之中找到，实际写入 TBW 可以在 S.M.A.R.T 检测报告找到：

- SATA 的 SSD 计算公式：
  > `Total_LBAs_Written * Sector Size / 1024^4 = TBW`
- NVME 的 SSD 计算公式：
  > `Data Units Written = TBW`

硬盘的门道多坑也多，有了大概了解真要买的话也别太过于担心，我们可以站在巨人的肩膀：[Backblaze](https://www.backblaze.com/)

该公司他们会采购不同容量，不同品牌，SSD 和 HDD 硬盘作为生产环境用于提供商业服务：类似亚马逊 S3 云存储、价格低廉的数据备份服务，每年都会布季度和年度的硬盘统计报告。

硬盘统计报告：[https://www.backblaze.com/cloud-storage/resources/hard-drive-test-data](https://www.backblaze.com/cloud-storage/resources/hard-drive-test-data)

{{< figure src="/tutorials/how-to-homelab/storages/b2-drive-survival-chart-extended.jpg"
    title="Backblaze 2021 年 9 月超长期磁盘寿命统计表"
    caption="图片来源"
    attr="Backblaze"
    attrlink="https://www.backblaze.com/blog/how-long-do-disk-drives-last/"
>}}

根据他们在 2021 年 12 月发布的磁盘使用寿命有多长的报告来看，中位数是在六年零九个月左右，这个时间是他们的使用场景的结果，家用肯定会更长。我现在服役最长的 HDD 是 10 年前，前不久有些坏道过多的 12 年 2.5 寸 5400rpm HDD 磁盘退役了。

{{< figure src="/tutorials/how-to-homelab/storages/ten-years-old-hdd.png"
    title="超长时间的 HDD"
>}}

## 存储协议

说完了硬件部分，我们在来聊聊软件部分，在不考虑数据的文件系统的选购上来说，文件共享有 DAS、NAS 和 SAN 划分：

- DAS 全称是 Direct Access Storage 即本地直连存储
- NAS 全称是 Network Attached Storage 即网络连接存储
- SAN 全称是 Storage Area Network 即存储区域网络

{{< figure src="/tutorials/how-to-homelab/storages/das-nas-san.png"
    title="DAS vs NAS vs SAN"
    caption="图片来源"
    attr="挨踢路人甲"
    attrlink="https://walker-a.com/archives/4522"
>}}

手机、电脑、服务器等电子设备自带的存储就是 DAS；

微软的 SMB/CIFS，*nux 的 NFS 和苹果的 AFP 等都属于 NAS；

前两个都很容易理解，SAN 的区别在于存储还是多节点应用服务器上，通过统一服务来做资源管理，比较常见的是 iSCSI。

{{< figure src="/tutorials/how-to-homelab/storages/san-network.png"
    title="SAN 网络工作原理"
    caption="图片来源"
    attr="挨踢路人甲"
    attrlink="https://walker-a.com/archives/4522"
>}}

### AFP

Apple 专有协议，Linux 虽然还有 [netatalk](https://netatalk.sourceforge.io/) AFP 开源实现，仅可用在 macOS 挂载远程磁盘使用，很多的服务本身是不支持的，homelab 层面完全不用考虑。

### SMB

SMB 协议常用在 Windows 系统之间的文件共享，也称之为 CIFS。在 Linux 可以通过安装 Samba 开源实现。不过基于用户身份鉴权和本身设计上有缺陷的原因并不能很好的在 homelab 中发挥最大的性能，可以使用但不太推荐，建议使用 SMB 3.0 及以上版本。

### NFS

NFS 协议常用在 *nux 系统之间的文件共享。基于 IP 地址/地址段鉴权，配置简单可以很轻松上手，在 homelab 初期非常适合，建议使用 NFS 4.0 及以上版本。随着应用对存储服务的依赖越来越多，也会遇到 NFS 速度较慢，存在争用、分布式锁、单点服务等瓶颈。就会慢慢转向多集群分布且适合 homelab 尤其是 Kubernetes 的块存储服务。

### iSCSI

SCSI 本身是一个支持热插拔的企业级硬盘的商业常用的硬件接口，前面加一个小 i 摇身一变成了一种网络文件共享协议来仿真模拟 SCSI 协议，基于块存储的特性让文件共享具有较高 IO 吞吐量也能够游刃有余。

## 存储系统

存储系统的目的是实现核心存储数据的基础上提供文件共享，管理和其他扩展功能。通常情况下上面提到的 SMB 和 NFS 协议都属于内置的文件共享功能，iSCSI 只有部分系统内置支持。

### 群晖

用户受众最大的可能就是[群晖](https://www.synology.cn/zh-cn)机器，基本上大家入手的第一台 NAS 就可能是它，配置简单的话可以很轻松上手。

{{< figure src="/tutorials/how-to-homelab/storages/synology-name-rule.jpeg"
    title="群晖型号命名规则"
    caption="图片来源"
    attr="PT邀请码"
    attrlink="http://www.ptyqm.com/24518.html"
>}}

群晖底层是 Linux 系统，它的软件生态体系是完善的，因此价格较贵，硬件通常都不是特别好，官方提供的[场景预估工具](https://www.synology.cn/zh-cn/support/nas_selector)很容易找到对应的机型，建议懂硬件的可以再看看其 [CPU 和内存规格](https://kb.synology.com/zh-hk/DSM/tutorial/What_kind_of_CPU_does_my_NAS_have)是否满足。

### Unraid

[Unraid](https://unraid.net/product) 这两年开始流行的新型虚拟化 NAS 系统，从名字就能看出来是不支持硬件 raid 阵列，底层是 slackware 系统。系统核心主打虚拟化平台，最有趣的是在他们官网的用户案例最显著的分别列的是 Minecraft 自建服务器、游戏服务器、密码管理和备份服务，反而 NFS 服务端、数据存储成了附加功能，也怪不得它们的 Slogan 是 "More Than a NAS OS"。

截至 2023 年 07 月 21 日为止，他们的付费策略如下所示：

套餐 | 价格 | 说明
---|---|---
Basic | $59 | 6 盘位
Plus | $89 | 12 盘位
Pro | $129 | 无限盘位

2022 年官方有过一次 5 折的优惠活动，不着急的可以等等看，2023 年的现在官网有一个 85 折的 [23 夏日特卖](https://unraid.net/summer-sale)，优惠码：`SUMMER23` （不是广告）

### TrueNAS

[TrueNAS](https://www.truenas.com/) 一直都是 NAS 开源项目标杆级的存在，前身叫 FreeNAS，基于 ZFS 特性创建的数据池可以保证数据的高可用和数据安全。提供商业版和免费版，免费版有划分为 Core 和 Scale。Core 是基础版提供最核心的数据存储功能，底层是 FreeBAS 系统；Scale 额外提供虚拟化功能，底层是 Debian 系统，无论是那种硬件要求都较高，尤其是内存，最低硬件要求：

- CPU: 双核 64位 Intel 或 AMD 处理器
- 内存: 8 GB
- 启动盘: 16 GB 系统盘
- 存储池: 两块容量相同的磁盘组成存储池

ZFS 组 Raid 数据池支持 Z1/Z2/Z3，创建数据池时推荐使用 [ZFS RAIDZ 计算器](https://wintelguy.com/zfs-calc.pl)。

### Rockstor

[Rockstor](https://rockstor.com/) 也是一个类似 TreeNAS 的开源系统，也是唯一一个基于 BTRFS 文件系统作为数据池的数据存储服务，充分利用 BTRFS 特性在数据管理、数据备份、数据快照上有全方面的功能支持。底层是 openSUSE 系统，除了刚开始配置管理和 CLI 工具上有点不太适应以外，服务管理还基本一致。另外我非常喜欢的一点是除了 x86 架构，还支持 ARM64 和树莓派 4 开发板，硬件要求也比较低：

- CPU: 任意 64 位 Intel/AMD 处理器或 ARM64 A53 处理器（双核 i3 或 A72+ 更佳）
- 内存: 2 GB（4 GB 更佳）
- 启动盘: 16 GB 系统盘（32GB 更佳）
- 存储池: 至少一块额外硬盘（按需分配）

我在 Proxmox 以 VM 的形式跑了半年，一切正常，还能定时快照，爽的一匹。切记 BTRFS [Raid 5/6 有功能缺陷](https://btrfs.readthedocs.io/en/latest/Status.html#raid56)，要么单盘要么 Raid 0/1/10，组成 Raid 的话推荐使用[群晖 RAID 计算器](https://www.synology.com/en-us/support/RAID_calculator?hdds=12%20TB)或[BTRFS 计算器](https://carfax.org.uk/btrfs-usage/)。

### OpenMediaVault

[OpenMediaValue](https://www.openmediavault.org)（简称 OMV）是基于 Debian（仅支持 Buster, Bullseye 两个版本）开源的 NAS 系统，优点是硬件条件需求很低，附属功能都以插件形式存在，支持插件库，不开启的情况下也不会占用资源和空间，唯一的不足之处是他的 Web 管理系统，每操作个功能都需要点击 “应用” 然后一个较长时间的等待有点烦人，不过基本上可以忽略。最低硬件要求：

- CPU: 任意 64位 Intel/AMD 处理器或 ARM 处理器
- 内存: 1 GB
- 启动盘: 4 GB 系统盘
- 存储池: 至少一块额外硬盘（按需分配）

它的定位和 Unraid 很类似，除了 NAS 还想干很多事情。通过 [omv-extra 插件库](https://wiki.omv-extras.org/)能够支持 Docker、 Proxmox 内核等附属的功能，官方并不提供 ARM 的镜像，运行[系统安装脚本](https://github.com/OpenMediaVault-Plugin-Developers/installScript)可以在部分开发板的 armbian 系统上安装。

### 纯 Linux

高阶点的玩家可以自己在任何主流的 Linux 系统上手动配置安装 SMB、NFS 服务端，并完成自己的配置。除此之外还可以考虑使用 [Cockpit](https://cockpit-project.org/) 通过 Web 界面管理磁盘和文件共享功能。

## 分布式存储

上面提到的文件共享协议和 NAS 系统都是单体设备部署，如遇到意外时停电、运行的电脑发生晃动造成 HDD 硬盘损坏都会造成应用完全不可用，在有备份的前提下更换硬件、重做系统、恢复备份数据需要耗费很长的时间，如何避免并实现 zero down 呢？
和解决硬盘容量的思路一样，增加多台机器组成集群的分布式存储。

{{< figure src="/tutorials/how-to-homelab/storages/Storage-to-Use_v04-23-21.max-1600x1600.jpeg"
    title="对象存储 VS 块存储 VS 文件存储"
    caption="图片来源"
    attr="Google Cloud"
    attrlink="https://cloud.google.com/blog/topics/developers-practitioners/map-storage-options-google-cloud"
>}}

分布式存储可以分为对象存储和块存储，上图列出来不同存储的说明和使用场景。

下面罗列一些我经常**见到的**（绝大多数没长时间用过）解决方案，其他云存储方案可以参考[这里](https://anarsolutions.com/10-popular-cloud-native-storage-solutions-%F0%9F%93%8C/)。

### Ceph

企业级别的开源分布式存储服务，支持对象存储、块存储和文件存储三种类型。功能强大，容量不够了加机器就能扩容。最大的缺点是硬件要求很高且架构复杂造成运维成本也很高。

{{< figure src="/tutorials/how-to-homelab/storages/ceph-diagramm.png"
    title="Ceph 对三种类型存储的支持"
    caption="图片来源"
    attr="Ceph"
    attrlink="https://ceph.com/en/discover/technology"
>}}

[Rook](https://rook.io/) 是专门为 Kubernetes 研发的 Ceph 云原生存储，硬件要求过高以至于我的 RK3399 + 4G 内存规格的开发板部署困难而放弃。

### Gluster

[Gluster](https://www.gluster.org/) 是块存储，相比 Ceph 来说结构相对简单，易于部署，所以也方便在其上部署容器。官方建议运行在 XFS 文件系统上，底层用 LVM 实现快照。

网上能够看到很多 Ceph 和 Gluster 对比的文章和视频，对这两个有兴趣的可以看看这两个的文章：

- [Gluster和Ceph对比](https://cloud-atlas.readthedocs.io/zh_CN/latest/gluster/gluster_vs_ceph.html)
- [So 2 years running ZFS+Gluster and I'm **extremely** glad I did (migration from TrueNAS)](https://www.reddit.com/r/homelab/comments/ukt2aw/so_2_years_running_zfsgluster_and_im_extremely/)

### Longhorn

{{< figure src="/tutorials/how-to-homelab/storages/how-longhorn-works.svg"
    title="Longhorn 工作原理"
    caption="图片来源"
    attr="Longhorn"
    attrlink="https://longhorn.io/docs/1.5.1/concepts/"
>}}

[Longhorn](https://longhorn.io/) 是纯 Kubernetes 云原生块存储，基于 iSCSI 文件共享协议，从文档上看有较好的数据备份、快速回滚、故障转移等功能，且最低硬件要求也不高：

- 集群数量：三个节点（唯一的硬性要求）
- CPU 架构：AMD64/ARM64
- CPU：每个节点 4 vCPU
- 内存：每个节点 4 GB 内存
- Kubernetes 版本：v1.21+

我去年的时候在开发板集群短暂测试过一段时间，它创建 PVC 的过程比较慢，尚未确定具体是哪里的原因（开发板上 TF 卡槽规格、 TF 卡本身）。

### OpenEBS

[OpenEBS](https://openebs.io/) 也是纯 Kubernetes 云原生存储，提供本地卷和分布式存储卷，分布式卷根据[不同使用场景](https://openebs.io/docs/concepts/casengines)内置了 3 个存储引擎：[cStor](https://openebs.io/docs/concepts/cstor)、[Jiva](https://openebs.io/docs/concepts/jiva) 和 [Mayastor](https://openebs.io/docs/concepts/mayastor)。

## 存储备份原则

如果没有备份那么数据可能在历史上就不曾存在过（笑），如何保证数据安全性呢，这就不得不提到知名的 [3-2-1](https://en.wikipedia.org/wiki/Backup#Storage) 备份原则：

- 3：至少三份完整备份数据
- 2：存放在两种不同的存储介质（冷/热硬盘、光盘、移动硬盘、NAS、磁带、云存储等）
- 1：至少一份备份数据保存在异地（与原始数据不同地理位置的地方，比如云存储、朋友或亲戚的家等）

经过我的观察严格遵循这个原则的玩家其实挺少的，绝大多数都是 2-2-1（比如我）:

- 2：两份完整备份数据（甚至用 raid 1 或 raid 10 来实现的双备份）
- 2：存放在两种不同的存储介质（冷/热硬盘、NAS 或移动硬盘）
- 1：至少一份备份数据保存在异地（云存储、老家的 NAS）

我个人解读是对于 3 的定义有不同，有些人认为 3 是三份完整备份数据，有些人认为是一份原始数据 + 量份完整备份数据；有些人可能认为两份完整备份数据已经足够了。无论如何解读都没有对或错，只要能保证数据的安全性和可恢复性就是好策略。

市面上有很多优秀的商业和开源数据备份工具或服务

### 备份工具

现在有太多优秀的数据备份工具可供选择，且差异化也会越来越小，绝大多数都是支持远程协议和云存储的数据同步、数据加密、压缩等功能，以下列举的都是数据备份相关的工具，并没有把单纯数据同步的工具列在内。

工具 | 性质 | 开发语言 | 特色
----|------|--------|-----
[BorgBackup](https://www.borgbackup.org/) | 免费/开源 | Python | 异地备份
[Duplicati](https://www.duplicati.com/) | 免费/开源 | C# | Web UI，AES 256 加密
[Hyper Backup](https://www.synology.com/en-global/dsm/feature/hyper_backup) | 商业 | - | 基于 Synology NAS
[Kopia](https://kopia.io/) | 免费/开源 | Go | Web UI，API，块存储，增量备份，定时快照，备份策略，自建备份服务器
[Rclone](https://rclone.org/) | 免费/开源 | Go | Web UI，分布式存储
[Resilio](https://www.resilio.com/individuals/) | 商业/免费 | - | 采用 P2P 协议同步
[Restic](https://restic.net/) | 免费/开源 | Go | 增量备份

个人建议优先考虑支持加密备份（支持压缩更好），支持定时能够增量快照或备份，同时又有备份策略（保留最多数量，是否删除等）的工具，原因有二：

- 能够按照自己需求配置后自动化处理的绝不要人工干预
- 加密是为了保证数据的安全性，防止数据的泄露带来的不必要的损失

### 云存储服务

网上各厂家提供的云存储收费通常是按照占用磁盘空间大小和流量两个纬度计算费用，据我所知目前最最便宜且口碑比较好的是 Backblaze 的 [B2 云备份](https://www.backblaze.com/cloud-storage)服务。

云存储 | 存储 | 下载
------|-----|-----
Backblaze B2    | 0.0005 美元/GB/月 | 0.01 美元/GB
亚马逊 S3        | 0.026 美元/GB/月 | 0.09 美元/GB
Azure           | 0.0208 美元/GB/月 | 0.08 美元/GB
Google Cloud    | 0.0023 美元/GB/月 | 0.11 美元/GB
阿里云 OSS       | 0.0075 ~ 0.12 元/GB/月 | 0.25 ~ 0.50 元/GB
腾讯云 COS       | 0.01 ~ 0.099 元/GB/月 | 0.5 元/GB

B2 服务最吸引人的地方注册直接赠送免费 10G 空间，下载头 1GB 免费，API 提供免费额度，小场景使用几乎可以一直白嫖，国内的云存储价格打法就特别眼花缭乱，大体划分为标准存储，低频，（冷）归档，深度（冷）归档。

## 小结

准备好好你的 NAS，下一篇正式开始 homelab 实战。
