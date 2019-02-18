---
title: 攒了一台 4K 视频剪辑黑苹果
date: 2019-01-30 10:30:12 +0000
slug: itx-coffee-lake-hackintosh-build-for-4k-video-editing
categories:
- Technology
tags:
- 硬件
- Hackintosh
- PC
- 4K
- 视频剪辑
image: images/4k-hackintosh-hardwares.jpg
index: false
comments: true
isCJKLanguage: true
share: true

---

> 2019-02-18 更新：
>
> 修改无线网卡的最终选择和价格，更新博通网卡部分的内容。

## 装机清单

> 台式机借鉴国外 $1000k 攒机思路在不考虑显示器预算为 6000 元人民币。

名称 | 品牌型号 | 价格
---|---|---
CPU | [Intel i7 9700k](https://ark.intel.com/products/186604/Intel-Core-i7-9700K-Processor-12M-Cache-up-to-4-90-GHz) | 2550
主板 | [华擎 Z390 Phantom Gaming itx/ac](https://www.asrock.com/mb/Intel/Z390%20Phantom%20Gaming-ITXac/index.cn.asp)，[超频利器](https://www.chiphell.com/thread-1936969-1-1.html) | 1399
散热器 | [九州风神 船长 240 EX White RGB](http://www.gamerstorm.com/product/CPULIQUIDCOOLER/2017-08/1286_6878.shtml) | 453
内存 | [海盗船 Vengeance LPX DDR4 3000 16G](https://www.corsair.com/eu/en/Memory-Size/vengeance-lpx-black/p/CMK16GX4M1B3000C15) x 1 | 719
SSD | [三星 970 EVO 250G](https://www.samsung.com/us/computing/memory-storage/solid-state-drives/ssd-970-evo-nvme-m-2-250gb-mz-v7e250bw/) | 489
机箱 | [追风者 215P ITX 侧透 RGB](http://www.phanteks.com/Enthoo-Evolv-ITX-TemperedGlass.html) | 489
电源 | [讯景 XTR550](http://www.xfx.com.cn/power_supplies/xtr-550w/) | 354
无线网卡/蓝牙 | [博通 BCM94360CS2](https://s.taobao.com/search?q=BCM94360CS2&type=p&tmhkh5=&spm=a21wu.241046-tw.a2227oh.d100&from=sea_1_searchbutton&catId=100) | 95 元
显卡 | RX560\~580 | 预算超了暂时没有采购
显示器 | [LG 27UL600 4k HDR400 IPS](https://www.lg.com/cn/monitors/lg-27UL600) | 单独预算
**总价** | | 6095

### 为什么要台式机？

堂堂一个长期苹果用户的码农咋想起来要组装台式机了？这个计划其实我已经盘算好久好久，要不是库克这两年的出价策略我还真把这个念头打消了。 对于现在入一台能用好几年的 Mac 设备基本上都是要顶配了，价格能又不忍直视。

以我现有几台笔记本为例，只有内存和硬盘可更换的加持下 MBP 2011 Late 低配我现在拿来用 VSCode 写代码跑服务也没啥太大问题。而手里的 MBP 2013 Mid 低配因为内存和硬盘全焊丝经常性内存不足卡死，硬盘不足，就连我老婆都恨不得把它扔了，主力机器 MBP 2015 Mid 中配后期更换 SSD 又可以再战 3 年。

当我说要组装台式机的时候不少朋友反问现在还需要用台式机吗，虽然我嘴上只是说说攒着玩啊，现在外出基本上手机可以满足要求，带着笔记本其实也就是存下照片（是的我知道有种东西叫数码伴侣），其实我就是想要一台可配置的机器，不乏有这样想法的开发者，这也是为什么 MacBook Pro（后面简称 MBP）2015 版本的二手机器畅销的原因。

以上的配置因为预算上限没买独立显卡和无线网卡/蓝牙的情况下总花费正好 6000 元整一分不多一分不少让我自己都特别吃惊（显示器是后批的预算），购买渠道主要是哪里便宜去哪里，大部分淘宝，极个别京东（比如有漏液风险度水冷）。其性价比完爆 2018 年新换代的 Mac mini（不考虑体积和接口种类），加上显示器虽然比不上 5k iMac 但其他方面可不差，再加上攒机配置基本上属于顶配（虽然没上 9900k）除了内存以外都不是瓶颈。

### 为什么要视频剪辑？

业余兴趣爱好一直没有行动。之前出去玩攒了不少的视频素材，只有在结婚前花了三个月用 iMovie 剪了一个婚礼上播放的[视频](https://v.youku.com/v_show/id_XOTQyNTg0ODA4.html?sharefrom=iphone&sharekey=9aa274d71e8a3ba95e2fcf03efbc9e8e0)之后也有想学 Final Cut Pro（简称 FCP） 主要还是因为硬件不达标搁浅。

题外话，经过慎重考虑我选择了 Adobe Premiere，支持 Windows 和 macOS 系统而且它也支持和 FCP 一样对独立显卡的渲染优化，反正这俩 App 对我来说都是新的。

### 为什么黑苹果？

> 请不要鄙视和职责用黑苹果的用户，现在 macOS 系统已经是免费安装也都是 [Vanilla](https://en.wikipedia.org/wiki/Vanilla_software) 方式。安装黑苹果尤其是自己动手这也是符合黑客精神。我认为自己来安装黑苹果是一种充满冒险和兴奋的事情。

兼容黑苹果也是选择硬件的很重要的指标之一，虽然我会安装 Windows 系统，长期我更倾向于 macOS 系统。这也是一个长期 Mac 用户最舒服的使用方式，减少各方面的迁移成本，听说某大厂的游戏部门程序员全部采用黑苹果方案。

### 为什么选择 Intel 9700k？

本来是要买 8 代 8700k 的，我买的时候（2019年初）8700k 价格溢价太高！稍微加点钱就能上 9 代 9700k 了！尽管市面上的 Mac 主机还都没有 9 代或许今年内应该能够发售再加上 tonymacx86 已经有很多 9 代的成功案例，何乐而不为呢，大不了在 Apple 在支持 9 代之前我先用 Windows 嘛。

为什么要带 `k`？可以超频啊！目前默频的情况基本满足，后面无论是视频剪辑还是玩游戏的话可以适当超频，配合华擎主板只要 CPU 不踩雷轻松上 5Ghz。 当然还是要考虑黑苹果的兼容性 AMD 在这方面真 YES 不起来。

### 为什么主板选择华擎 Z390？

> CPU 都上 9700k 了。为什么主板还要限制在 Z370 平台（虽然 9 代兼容），直接上 Z390 啊！价格也合适！

都说技嘉是黑苹果首选的主板，其次是华硕、微星一二线大厂，一说起华擎可能在十几年前可能都没听过这个牌子（比如我，毕竟十几年没在台式机混过了）或者是华擎出妖板，这些确实没错。

我选择华擎的主板主要有三大原因：第一在 Z390 系列里面它足够便宜（价格屠夫），第二是主板供电相对可靠且硬件种类非常强大（残血雷电口除外），第三在 hackintosher 看到 [2017 年评出的最佳黑苹果主板](https://hackintosher.com/blog/best-motherboard-brand-hackintoshing-2017-kabylake/)第一名就是华擎，原因是该主板很容易找到解决方案，还能够很好的支持睡眠唤醒。最近在 tonymacx86 华擎主板成功的案例也非常多。如果非要说缺点就是 BIOS 功能太弱版本更新不太稳定。

再说说我为什么选择[华擎 Z390 Phantom Gaming itx/ac](https://www.asrock.com/mb/Intel/Z390%20Phantom%20Gaming-ITXac/index.cn.asp)，[超频利器](https://www.chiphell.com/thread-1936969-1-1.html)，双 Ultra M.2（PCIe Gen3 x4 & SATA3）接口（前支持 2260/2280，后支持 2280），4 SATA 3 接口（支持 RAID)和热插拔，DisplayPort 1.2 和 HDMI 2.0，板载 Intel 802.11ac 无线网卡和蓝牙 5.0模块（但不支持黑苹果，伤心），4 口 USB 3.1 Gen2，同时还有 Polychrome Sync RGB 灯控同步方案（虽然我不 care）。不足的地方也有啦，比如最大 32G 内存（支持 64G 就好了），残血雷电3接口（20G/s）再接 eGPU 会比较惨。

如果你想要大板的话可以考虑华擎 Z390 Extreme 4 或 Taiji，大厂信仰和不差钱的忽略。

最后附上一个[Z390 主板简单横屏](https://zhuanlan.zhihu.com/p/50199792)的文章，对我也很有启发。

### 为什么选择众多漏液全赔的九州风神水冷？

> 购买水冷散热器和 9700k 把独立显卡（RX560）的预算花了。

攒机的时候没有考虑散热器的预算本以为如果买 Intel 盒装的版本会带一个小风扇或者随便买个 100 左右的散热器，真正研究配置的时候发现没有自带风扇，可能便宜的风冷 9700k 会压不住，超频就不要想。高塔的风冷（比如大霜塔）会有会挡内存槽和显卡的风险（据说大镰刀有错位设计）毕竟 itx 只有俩内存和一个 PCIe，权衡下来踩这个坑不如考虑水冷的划算。

起初看海盗船 H100i v2 用的人挺多，瞅了眼价格直接自我劝退，更何况早期有漏液情况就没敢买，在 pcpartpicker 上筛选水冷散热器排名第二代就是[九州风神船长 240 White](http://www.gamerstorm.com/product/CPULIQUIDCOOLER/2017-08/1286_6878.shtml)，尽管也有很多漏液问题但基本上是 2017 年到 2018 年初，后续就再也没有看到漏液爆出（海盗船的现在也没有了）加上价格合适和京东客服再三确认质量保证（质保三年）和漏液全赔之后还是入了一个最便宜的船长 240 特别定制白色 RGB 的版本，结果买回来发现白色的水排和全黑的机箱搭配起来也很不和谐在侧透机箱一览无遗，谁让这个特别版（和国外同步，国内官网没有描述）价格比正常 240 便宜一百块呢。

关于灯控，散热器自带一个 RGB 控制器同时也支持主板 RGB 同步，插在华擎 Z390 主板 RGB 同步插口上也是可用的（虽然商品描述没有标注支持华擎）

九州风神作为一个国产品牌说明书是全英文我要给差评，尤其是在第一次接触水冷加 RGB 灯控的菜鸟来说。

### 为什么选择最不像 itx 机箱的追风者 215P？

说实话选择这台主机我已经限定了必须是 itx 主板和机箱，中塔以上机箱家里条件不允许而且也不太喜欢较大的体积。选择[追风者 215P](http://www.phanteks.com/Enthoo-Evolv-ITX-TemperedGlass.html) 其实是我在找 [4k 视频剪辑配置](https://bartechtv.com/1000-mini-itx-coffee-lake-hackintosh-build-for-4k-video-editing/)发现的，国内恰好也有卖，规格还支持高塔风冷、全尺寸显卡以及 280 水冷，价格还合适（虽然不是最低价）没看具体尺寸就买了侧透 RGB 同款，买回来发现恰巧它的优势把机箱宽度拉大，预想的位置宽度正好不够。

这个机箱的说明书实在是特别的简陋，建议下载国外官方的中文说明书。不知道是不是国内版本减配，没有硬盘灯线和重启线（国外版本说明书是有的），没有也没关系反正机箱也没对于的硬盘灯和重启键，你看到的以为是重启键按钮（国内一些评测也这么认为）实际上是机箱灯控的控制键。

关于灯控，之前也没接触过灯效也就忽略了京东商品详情的 RGB 灯控的图标标识，一直以为这是一个普通的机箱，后来在看国外商品描述的时候提示是支持华硕，技嘉和微星主板 RGB 同步，看油管说是如果要和主板同步就要拆了机箱前面板把里面的控制版拆掉把 4pin 接口接入到主板的灯控口才行。写这篇博文的时候因为各种不确定我又扒了一遍所有商品的描述，在国外商品详情描述上看到了一行在说明书都没有提到的文字 `RGB Montherboard adapter required(sold separately)`，也就是说需要主板 RGB 同步的用户们来掏钱单独买[适配器](http://www.phanteks.com/PH-CB_RGB4P.html)。

关于水冷，支持分体式水冷系统。

### 为什么内存不上双通道？

不是我不想上双通道，双条 8G 的价格和单条 16G 的价格基本保持一致，在现有预算情况下只是恰巧 DDR4 3000 16G 的价格符合我的要求，不用考虑二手卖掉旧内存直接上新，要知道几年后卖二手内存就太廉价了。

品牌的话海盗船、芝奇、镁光、威刚、金士顿都可以考虑，需要注意带马甲的内存条是否挡风冷散热器。

### 为什么选择 AMD RX 500 系列独立显卡？

AMX RX 500 系列和更好的 R9 系列全系 macOS 免驱的，AMD 和 Apple 已经达成长期合作伙伴。免驱动是安装黑苹果抉择的最重要的原因，其次选择 RX 500 系列价格实惠，尤其考虑 RX 560。虽然部分 NVIDIA 显卡有 Web Driver 驱动但据说性能大大折扣，这里推荐黑果小兵整理的 [macOS 10.14 Majave 硬件支持列表](https://blog.daliansky.net/Mojave-Hardware-Support-List.html)。

视频剪辑其实并不太吃显卡，主要还是 CPU，CPU 不足的晴朗下才会选择显卡。国外众多兼容黑苹果的配置中大多没有用更好的显卡。

### 为什么选择这么少容量的 SSD？

如果你不差钱的话请上三星 970 EVO 500G。

上面提到主板支持双 Ultra M.2 插口和 4 SATA 3.0，同时还支持 [RAID0/1/2/3/4/5/10](https://www.youtube.com/watch?v=qg1Vvh67Efw)，其中一个 M.2 插口会被无线+蓝牙模块占用，因此我还剩下一个 M.2 和 4 个 SATA。

对于我来说在不考虑 RAID 和手里只有比较少 SSD 硬盘的情况我会考虑买一个三星 970 EVO 250G，配合拆掉临时使用的 Windows 系统的老笔记本上的镁光 RX200 SSD 硬盘，这两块分别安装 macOS 和 Windows 系统。SSD 用来做系统安装和常用 App，大数据后期我会在买大容量机械硬盘做支持，最近价格涨上去不少。

当前因为有 HP Gen 8 做 NAS，在用 LightRoom 修片也基本够用。影视资源也基本上是通过 NAS 的网络协议直接拉取到电脑或者盒子上硬解播放 4k 也毫无压力。

### 为什么要选择博通的无线网卡方案？

首先博通是 Apple 的合作厂家，所有 Mac 主机的无线模块都是他家提供的，可以做到真正免驱同时以下提到的同时还支持蓝牙模块。

蓝牙模块不仅仅是日常连接鼠标，键盘、耳机音箱，它作为 macOS 系统的核心功能是实现 Handoff 和 AirDrop 功能。

苹果钦点模块：

- BCM94360CS2 (2013年 MacBook Air)
- BCM94360CS (2013年 MacBook Pro)
- BCM94360CD (2013年 iMac)
- BCM943602CS (2015年 MacBook Pro)

理论上上面 4 个模块是真正免驱的（但也不排除需要加驱动）。

接口 | 模块 | 天线 | 无线 | 蓝牙 | 备注 |
| --- | --- | --- | --- | --- | --- |
| PCIe/x1 | BCM94360CD | 4 | 2.4G 450M+/5G 1300M=1750M | 4.0 | iMac (2013) 使用，请勿购买三天线版本，三天线版本（3T3R）蓝牙和无线共用一根影响使用 |
| PCIe/x1 | BCM94331CD | | | | tonymacx86 列表之一，国内没找到 |
| M.2 | BCM943602CS | 3T3R | 2.4G 450M+/5G 1300M=1750M | 4.0 | MacBook Pro (2015) 使用，蓝牙需要接 USB |
| M.2/NGFF 2230, key E | BCM94360CS2 | 2T2R | 2.4G 300M+/5G 867M=1167M | 4.0 | MacBook Air (2013) 使用，价格低廉，性价比最好 |
| M.2/NGFF 2230, key E | BCM94352Z/AzureWave AW-CE162NF/DW1560 | 2T2R | 2.4G 300M/5.0G 867M=1167M | 4.0 |  |
| M.2 | BCM943602BAED/DELL DW1830 | 3T3R | 2.4G 450M+ | 4.1 | |
| M.2 | BCM94350ZAE/DW1820A | | | | tonymacx86 列表之一，国内没找到|
| Half mini | BCM94360HMB/AzureWave AW-CB160H | 3T3R | | | tonymacx86 列表之一，国内没找到 |
| Half mini | BCM94352 HMB/AzureWave AW-CE123H | | | | tonymacx86 列表之一，国内没找到 |

更多博通模块请看 [wikidevi](https://wikidevi.com/wiki/User:Omega/Broadcom_modules_(Apple))，其他兼容的列表请看 [osxlatitude 的整理](https://osxlatitude.com/forums/topic/2120-inventory-of-supportedunsupported-wireless-cards-1-snow-leopard-el-capitan/)

首先排除 PCIe 接口华擎 Z390 itx 版只有一个接口这个是为独立显卡准备的，虽然我很想入 BCM94360CD 四天线。 因此只能考虑 M.2 接口，上面的模块虽然也可以直接插 M.2 接口（底子还是 PCIe 嘛）但板子仅支持 2260/2280，支持 2260 的口我已经插了 SSD（因为主板提供散热马甲），~~因此我只能考虑 2280。淘宝上能找到的支持 2280 转接卡的模块基本上只有 BCM94360CS2 和 BCM943602CS，考虑到后者是较新的 5G 可以达到 1300M，这俩价格也差不多基本上会考虑后者~~。受春节的影响没有入手，期间在浏览的时候发现华擎 Z370 可以拆卸原本的 Intel 的无线模块用来安装博通网卡/蓝牙模块，联系了 up 主没有得到解答只能从他视频扣细节，Intel 网卡型号不一样但确定插槽是 M.2 Key E，考虑到主板自带两个天线口放弃了三天线的 BCM943602CS，买了最物美价廉的 BCM94360CS2，带上转接卡高度 2230 机箱可以兼容。

**特别提醒**：主板自带 M.2 Key E 插口的无线模块需要[支持非 CNVi 网卡才能使用](https://bbs.nga.cn/read.php?tid=16399773&page=1)，如果有白名单请参考上面删除线内的方法。

如果你不需要蓝牙的话也可以考虑 USB 无线网卡，USB 类型的目前暂无网卡和蓝牙二合一可用的硬件，虽然市面上已经出了一些。个人在春节期间不忍寂寞从 7x24 小时发货的京东买了 Comfast CF-913AC V2 USB 网卡安装[驱动](http://en.comfast.com.cn/index.php?m=content&c=index&a=show&catid=30&id=223)装的黑苹果。

### 为什么选择 LG 27UL600 显示器？

家里还在服役的 DELL 2209wa 是我 2010 年购入能坚持到现在已经是个奇迹了，16:10 画面在玩 PS4 时会让画面拉伸，屏幕被植物长期亲密接触屏幕出现了一些坏点，在和老婆大人协商后加购预算购买新显示器。这也就有了这个为什么的出现。

[LG 27UL600](https://www.lg.com/cn/monitors/lg-27UL600) 应该是 2019 年初我找到的国内性价比最高的 4k 显示器了吧。27 寸 4k 分辨率，IPS 屏，支持 DisplayHDR 400，sRGB 99% 色域，DisplayPort 1.2 和 HDMI 2.0 接口（兼容 HDCP 2.2设备），3.5mm 音频输出接口。 缺点是底座垃圾，敲下电脑桌就有可能会让显示器晃悠一会，建议直接上摇臂支架（反正我支架是现成的把老显示器卸下来就行了）。

关于网上有些人说 27 寸用 4k 会特别难受的问题，我表示 Windows 和黑苹果可以字体缩放 200% 用起来非常舒服。

题外话，这款显示器是 27UD69-W 的升级款。如果你不考虑 sRGB 99% 色域的话入手 27UD58-B 也是不错的选择。

### 为什么没有黑苹果安装教程？

等我装好了测试没问题就写，还是说你愿意看到一个没有实践过的版本？
