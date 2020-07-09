---
title: 华擎 Z390 Gaming ITX 黑苹果安装教程
date: 2019-03-28T17:12:07+08:00
slug: asrock-z390-gaming-itx-install-hackintosh-tutorial
categories:
- Technology
tags:
- 硬件
- Hackintosh
- PC
- 4K
- 视频剪辑
image: images/install-boardcom-module-to-motherboard.jpg
index: false
comments: true
isCJKLanguage: true
share: true

---
> 2019-04-01 更新：
>
> 更新疑惑解答无线网络慢的解决方案。

春节前购入一台式机挖坑要写黑苹果安装教程，本来计划是 3 月初整理完毕期间赶上辞职彻底放飞自我，加上无法忍受编辑视频的龟毛速度购入一块 rx580 矿卡使用一周后良好，立马开始填坑。

> 封图是博通网卡模块替换原由的分解图。

## 硬件清单

参见 [攒了一台 4K 视频剪辑黑苹果](http://icyleaf.com/2019/01/itx-coffee-lake-hackintosh-build-for-4k-video-editing/)。更新了后续更换的硬件和说明。

## 名词解释

* `BIOS` - **_B_**_asic **I**nput/**O**utput **S**ystem_ 缩写，它是主板上标准的固件接口，负责在开机时做硬件启动和检测等工作，并且担任操作系统控制硬件时的中介角色。
* `(U)EFI` - _(**U**nified) **E**xtensible **F**irmware **I**nterface_ 缩写，它是代替 BIOS 的升级方案，(U)EFI 是模块化，支持图形化界面和鼠标操作。UEFI 是基于 Intel EFI 1.1 发展而来的归属国际组织管理，本质上还是 EFI。[BIOS 和 UEFI 的区别](https://www.zhihu.com/question/21672895)，它会以一个名为 EFI 独立分区存在里面是其配置数据。
* `ACPI` - **_A_**_dvanced **C**onfiguration and **P**ower **I**nterface_ 缩写。它是 BIOS 中"电源管理”和“配置管理”的接口，它由很多表组成，包括 RSDP, SDTH, RSDT, FADT, FACS, DSDT, SSDT, MADT, SBST, XSDT, ECDT, SLIT, SRAT 等。
* `DSDT` - _The **D**ifferentiated **S**ystem **D**escription **T**able_ 缩写，它是主板 BIOS 中 ACPI 的一个表，包含了所有除基本系统以外所有不同设备的信息，也就是每台计算机设备的基本系统是相同的，而不相同的设备用 DSDT 来描述。macOS 不完整支持 ACPI 规范，仅支持它的子集 DSDT。因此这个在黑苹果配置中会经常提到。
* `AML` - **_A_**_CPI **M**achine **L**anguage_ 缩写，它是 ACPI 描述语言，用来编辑 ACPI 各种表的代码。
* `Kext(s)` - **_K_**_ernel **Ext**ension_ 缩写，你可以简单的理解为它是 macOS 的驱动文件（内核扩展）。
* `Clover` - 我们使用的启动引导器。Mac 主机使用了自定义固件来启动 macOS。 PC 硬件本身无法做到而 Clover 可以帮我们实现。同时它还提供 kext 注入，ACPI 重命名，kext 补丁和一些其他功能。更多请看黑果小兵的[使用教程](http://blog.daliansky.net/clover-user-manual.html)。
* `config.plist` - 这个文件用来告诉 Clover 该怎么去做。它是一个 XML 格式的属性列表文件（有点类似 HTML）其中最核心的部分是配置黑苹果才能正常运行。你可以使用文本编辑器或者 Clover Configuration App 编辑。

> 多说一句，有时候大家再说到 BIOS 实际上是指 UEFI，只不过为了兼容性主板会在 UEFI 中兼容 BIOS。

## 安装环境

本教程提到的环境和版本信息、Clover 配置和 Kexts 均公开到个人 Github 仓库：[EFI-ASRock-Z390-Phantom-Gaming-ITX](https://github.com/icyleaf/EFI-ASRock-Z390-Phantom-Gaming-ITX) 。

## 安装前的准备工作

### 配置驱动（Kexts）

* 启动必备
  * FakeSMC.kext
  * Lilu.kext
  * WhateverGreen.kext
* 显卡
  * NoVPAJpeg.kext（独立显卡需要，解决无法预览和打开 JPG 图片）
* 声卡
  * AppleALC.kext
* 有线网卡
  * IntelMausiEthernet.kext
* 无线网卡
  * AirportBrcmFixup.kext
* 蓝牙(配合 Kext Utility/KextBeast 安装到系统)
  * BrcmFirmwareRepo.kext
  * BrcmPatchRAM2.kext

### 黑苹果安装启动盘

> 如果你的 OS 是 macOS 请参考如下步骤，否则请去黑果小兵博客下载 macOS 镜像并自行烧录。

准备一个 8G 以上容量的 U 盘使用系统自带磁盘工具 App 格式化为 GUID 分区图 MacOS 扩展（日志式）分区并重命名 USB，接着把从 App Store 下载 macOS Majave 10.14 安装 App，使用其安装包命令创建启动安装盘：

    sudo "/Applications/Install macOS Mojave.app/Contents/Resources/createinstallmedia" --volume /Volumes/USB

这一步会花费 30-40 分钟的时间期间可能也没用任何状态更新，请耐心等待，等到完成后启动盘就制作完成了。

### 安装 Clover 到启动 U 盘

上一步获得了启动 U 盘，在保证没有推出（Eject）和拔出 U 盘的情况下还需要讲 Clover 安装到上面。

1. 安装 [Clover](https://github.com/Dids/clover-builder/releases)（建议使用上面我采用的版本）点击下一步至看到 “Change Install Location" 选择启动 U 盘
2. 点击左下角的 "Customize" 开始定制特定的驱动：

* 勾选 "仅安装 UEFI 开机版本（Clover for UEFI booting only）"
* 勾选 "安装 Clover 到 EFI 系统区（Install Clover in the ESP）"
* 勾选 "UEFI drivers" 下面的 "ApfsDriverLoader-64.efi", "AptioMemoryFix-64.efi", "EmuVariableUefi-64", "FSInject-64.efi"
* 勾选 "安装 RC scripts 到目标磁盘"（启动 U 盘不用勾选，安装成后再次安装 Clover 到硬盘时需要勾选）
* 其他的选项都不勾选

1. 清理 EFI 目录

* 使用 [Clover Configurator](https://mackie100projects.altervista.org/download-clover-configurator/) 挂载 EFI 分区
* 打开 EFI 分区删除 "EFI/CLOVER" 下面的 "driver64" 目录（使用 UEFI 启动不需要）
* 把下载的必备驱动全部复制到 "EFI/CLOVER/kexts/Ohter" 目录下面（该目录存在其他的 kexts 的话就全部删除掉）
* 删除 "EFI/CLOVER/kexts/10.x.x" 目录

1. 如果使用 USB3 安装，你可能需要 [aaron-usb-config.aml](https://www.tonymacx86.com/attachments/aaron-usb-config-zip.378128/) 补丁来激活主板上的
   USB3 端口

### 替换原有网络/蓝牙模块

原有 Intel® Wireless-AC 9560 无线模块（集成无线 802.11ac 方案并提供蓝牙 5.0 和 2x2 802.11ac 2.4/5Ghz Wi-Fi 模块）在主板后部面部的顶部，需要拧下前后两颗螺丝，再拔掉 CMOS 电池的插头，嗯，没错尾部圆圆被塑料包裹的是 CMOS 电池。拆下模块后需要再把金属遮蔽盒拆下来就看到 Intel 无线模块的样子，小心把上面的两个天线拔掉再把模块也拆下放一边，我就得到了框架。

![m2-vs-boardcom-vs-dadapter](https://img.alicdn.com/imgextra/i3/394188259/O1CN01A7yd1U2AsfcpqsQJo_!!394188259.jpg)

避免广告的嫌疑，淘宝自行搜 `BCM94360CS2 NGFF M.2 转接卡`，买回来的博通网卡 + 转接卡可能是固定好的，我们需要把它拆开。转接卡要固定在框架上面后再把博通网卡插上拧上螺丝，框架上的两个天线随便接博通顶部两侧的插口上。转接卡高度超出框架最初拆下来的金属遮蔽盒不能再装回去。最好把框架固定到主板上就完成了。

![](http://icyleaf.com/images/install-boardcom-module-to-motherboard.jpg)

### BIOS

开机 F2 进入 BIOS 再按 F6 切换高级模式，至少需要做如下修改具体情况还需要看硬件情况：

* 高级（Advanced） > 芯片配置（Chipset Configuration） > VT-d -> Disabled
* 高级（Advanced） > USB 配置（USB Configuration） > XHCI Hand-off -> Enabled

### 安装黑苹果

以[ASRock Z390 Phantom Gaming-ITX/ac, i9-9900K, RX 580](https://www.tonymacx86.com/threads/guide-asrock-z390-phantom-gaming-itx-ac-i9-9900k-rx-580.268992/)为基础进行安装。

插入 U 盘到机箱后部主板的插口开机 F12 选择启动 U 盘（如果没有认出来试试其他插口），接着你会看到 Clover 的启动引导界面选择 U 盘启动，之后就是标准的 macOS 安装步骤（格式化硬盘分区为 GUID 分区图 MacOS 扩展（日志式）等等），我就不再多说，其中安装过程中会需要重启，重启进去 Clover 引导界面时选择硬盘启动，而不是启动 U 盘。

黑苹果安装好再次安装 Clover 这次是安装到硬盘上面（步骤和勾选选项同上）。

### Clover 配置

根据我的 [config.plist](https://github.com/icyleaf/EFI-ASRock-Z390-Phantom-Gaming-ITX/blob/master/EFI/CLOVER/config.plist) 进行参考配置：

1. 使用 Clover Configurator 挂载硬盘的 EFI 分区
2. 复制启动 U 盘的 driver64UEFI 和 kexts 目录到硬盘对应位置
3. 使用 Clover Configurator 打开 "EFI/CLOVER/config.plist"

* 在 SMBIOS 选项界面生成 Serial Number 和 SMUUID（点击 Generate New）
* 点击右侧 "Check Coverage" 会打开一个浏览器输入验证码（可能需要翻墙）确保 Serial Number 是**无效的**，这样才能伪装这台机器是台新机器。如果是有效的话就再次重新生成即可。

1. Intel Coffee Lake 架构[通用配置](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide/config.plist-per-hardware/coffee-lake)

### 无线（WIFI）及蓝牙驱动

对于所谓的“免驱”博通网卡其实并不代表了不需要 kext 的帮助，尤其是我自以为是 Apple 钦点的插上就可以用结果毛都没认出来。按照 tonymacx86 [无线及蓝牙安装教程](https://www.tonymacx86.com/threads/broadcom-wifi-bluetooth-guide.242423/) 操作
没有什么大的问题，直接使用 把 `Lilu.kext',`AirportBrcmFixup.kext`,`BrcmFirmwareRepo.kext`和`BrcmPatchRAM2.kext`安装到`/Library/Extensions/\` 路径下重启即可。

> 这里多说一句，理论上把上面的 kexts 放在 EFI 下也是可用的，放在 `/Library/Extensions/` 下是为了防止  Clover 加载 kexts 失败，直接缓存到系统中。

### 疑难杂症

#### U 盘无法引导

使用 USB 3.0 的 U 盘需要打补丁才能使用，tonymacx86 的 [ammulder](https://www.tonymacx86.com/threads/guide-asrock-z390-phantom-gaming-itx-ac-i9-9900k-rx-580.268992/) 提供了补丁下载 aaron-usb-config.zip（首帖的末尾） 解压缩后把里面的文件复制到放到 `EFI/CLOVER/ACPI/patched/` 目录下面。

#### 引导卡在 `apfs_module_init` （引导使用 verbose 模式提示该问题）

这个问题是说华擎 BIOS 升级至 1.3 版后 Device(RTC) 没有初始化变量使得 OSX DSDT 解析异常造成的。如果这种方式对你也不管用的话只能降级 BIOS 到 1.2 版本。

tonymacx86 的 [pupin](https://www.tonymacx86.com/threads/asrock-z390-phantom-gaming-itx-ac.265245/#post-1854444) 给出了解决方案，需要在 config.plist 的 ACPI\\DSDT\\Patches 数组下面添加：

```xml
<dict>
  <key>Comment</key>
  <string>Fix AsRock Z390 BIOS DSDT Device(RTC) bug. If BIOS > 1.2</string>
  <key>Disabled</key>
  <false/>
  <key>Find</key>
  <data>
  oAqTU1RBUwE=
  </data>
  <key>Replace</key>
  <data>
  oAqRCv8L//8=
  </data>
</dict>
```

或者使用 Clover Configuration 在 DSDT 的 Patches 单独打一个补丁，Comment 为 `Fix AsRock Z390 BIOS DSDT Device(RTC) bug. If BIOS > 1.2`，Find 为 `A00A9353 54415301`，Replace 为 `A00A910A FF0BFFFF`、

#### 核显（UHD 630）花屏

这是闪屏的解决方案，待测试：安装好之后能驱动 4K@60Hz 但是闪屏，其实还是显卡驱动的问题，爬帖发现改机型就可以，于是我试了iMac 18,1、iMac 17,3、iMac 17,1等机型仍然闪屏，期间重启了很多次，甚是烦恼。继续爬帖看到某位网友说将SMBIOS里面的信息全部删掉只保留 ProductName 即可，试了下果然起作用了，再也不闪了。后来才得知原理就是 Clover 会根据机型自己推算剩下的值，所以能正常驱动。

#### 核显插 HDMI 显示器黑屏无反应

由于我直接使用的 DP 接口没有遇到该问题，请参考如下链接：

* http://blog.daliansky.net/CoffeeLake-UHD-630-black-screen-direct-bright-screen-and-correct-adjustment-of-brightness-adjustment.html
* https://www.tonymacx86.com/threads/guide-general-framebuffer-patching-guide-hdmi-black-screen-problem.269149/

#### 关于本机 CPU 信息显示 Unknown

macOS 没有支持 9 代 CPU 这里会显示 Unknown 属于正常情况不影响使用，假若你特别想要修改的话请看这里：https://www.idownloadblog.com/2017/01/13/how-to-modify-about-this-mac-hackintosh/

#### 显示器的声音无法识别和输出

如果你安装了 VoodooHDA.kext 请删除，默认 AppleALC.kext 即可驱动，另外需要注意的是机箱前置和后置声音输出无法同时使用。

#### 机箱 USB 无法识别

macOS 10.11 之后由于 Apple USB 驱动重写后造成默认 USB 端口映射会出现不正常需要 DSDT 来打补丁，具体的可参考相关教程。我直接采用的现成的 DSDT 文件可把 [SSDT-UIAC-ALL.aml](https://github.com/icyleaf/EFI-ASRock-Z390-Phantom-Gaming-ITX/raw/master/EFI/CLOVER/ACPI/patched/SSDT-UIAC-ALL.aml) 文件放到 EFI/CLOVER/ACPI/patches 下面接口，或者使用 hackintool 工具和[模板文件](https://github.com/bydavy/EFI-ASRock-Z390-Phantom-Gaming-data)自己尝试定制。

#### 使用博通 BCM94360CS2 无法使用蓝牙

原因可能有两个原因：

1. 上面提到的 `BrcmFirmwareRepo.kext` 和 `BrcmPatchRAM2.kext` 这两个驱动需要使用 [Kext Utility](http://cvad-mac.narod.ru/index/0-4) 或 [KextBeast](https://www.tonymacx86.com/resources/kextbeast-2-0-2.399/) 安装到系统驱动目录。(推荐使用前者更简单，后者可能需要注册 tonymacx86 才可以下载)
2. 第一步已经完成还不能用的话，那就是 USB 的 DSDT 映射文件出问题了，使用上面**机箱 USB 无法识别**提到的文件即可解决。

#### 无线网络（WIFI）速度特别慢

我在写完本教程后让我遇到的诡异问题，我是双系统在 Windows 下无线网络是正常的。经过这几天的分析和推友大神 [@shellexy](https://twitter.com/shellexy/status/1112272600141582337) 的帮助下，总结解决方案如下：

1. 如果你是唯一的黑苹果系统，那么请在"系统偏好设置"的"节能"取消勾选"唤醒以供网络访问"
2. 如果你是 Windows 和黑苹果双系统，完成上面一步后你还需要在 Windows 系统资源管理器 "管理" 的 "设备管理器" 找到博通无线模块切换到最后一个选项卡取消勾选”允许计算机关闭此设备以节约电源”

如果上面两个方法都无效的话可以再试试：

1. 黑苹果系统是否开启了无线网卡随机化 MAC 地址，尝试关闭
2. 更改 WIFI 天线的方向，如果带线的天线那就尝试换换位置。

#### 无法登录 App Store 或登录后无法下载 App

请尝试如下操作：

1. 清除 `$TMPDIR../C/com.apple.appstore` 目录下的所有临时文件
2. config.plist 保留三个 SMBIOS 后重启，重新登录 iCloud 账户
3. 进系统设置移除现有网络所有配置并重启后重新添加

#### 其他疑难杂症

这里有个其他博主分享的总结[Hackintosh for ASRock Z390 Phantom Gaming-ITX/ac+i9-9900K相关问题解决方案](https://www.bugprogrammer.me/2018/11/05/Z390+9900K_Hackintosh.html) 可以看看有没有你遇到的，倘若都没有发现也可以给我[提 Issue](https://github.com/icyleaf/EFI-ASRock-Z390-Phantom-Gaming-ITX/issues/new) 我会尝试帮助你。

### 参考资料

* [Mac OS 之程序员](https://www.kancloud.cn/chandler/mac_os/480611)
* [clover使用教程](http://blog.daliansky.net/clover-user-manual.html)
* [Hackintosh Vanilla](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide)
* [ASRock華擎Z370M-ITX/AC集成顯卡10.14EFI分享](https://macpc.hidemess.com/?thread-145.htm)
* [安装黑苹果教程](https://catty-house.blogspot.com/2018/10/hackintosh.html)
* [\[Guide\] ASRock Z390 Phantom Gaming-ITX/ac, i9-9900K, RX 580](https://www.tonymacx86.com/threads/guide-asrock-z390-phantom-gaming-itx-ac-i9-9900k-rx-580.268992)
* [\[Success\] ASRock Z390 Phantom Gaming 6 - i7 9700K - AMD Vega 56](https://www.tonymacx86.com/threads/success-asrock-z390-phantom-gaming-6-i7-9700k-amd-vega-56.270501/)
* [ASRock Z390 Phantom Gaming-ITX/ac](https://www.tonymacx86.com/threads/asrock-z390-phantom-gaming-itx-ac.265245/#post-1854444)
* [ASROCK Z390 PHANTOM GAMING-ITX/AC](https://www.hackintosh-forum.de/forum/thread/40613-1st-hackintosh-beginner-asrock-z390-phantom-gaming-itx-ac/)