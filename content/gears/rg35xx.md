---
title: "RG35XX 复古国产掌机"
image: /gears/rg35xx/kid-playing.jpg
date: 2023-10-12T12:40:06+08:00
slug: "rg35xx-game-console"
type: posts
draft: false
index: true
comments: true
isCJKLanguage: true
categories:
  - Gears
tags:
  - RetroArch
  - 掌机
description: 比 Switch 更适合外出携带的便携掌机
---

高中我第一次接触了同学的 GBA 像是开启了新天地，工作之后买了 NDSi、Switch 也没能找回原来的那种感觉，但何 GB、GBC、GBA 掌机都太太太贵了。
今年 6 月份在日本旅游的时候看到了一些视频 [^youtube-video] 了解到 RG35XX 是比 Miyoo mini 更适合我的掌机，综合分析后 PDD 262 元购入（包含 64GB TF 卡和收纳包）。

- 基于 RetroArch 系统 [^retroarch]
- 3.5 英寸（保证便携的基础上比 Miyoo mini 大一些）
- IPS 全贴合屏幕
- 640x480 分辨率
- 2600 毫安电池提供约 5 小时续航（可改装更大电池）
- 双 TF 卡（可系统和游戏分离）

经过 3 个月的使用和体验，RG35XX 成为我出门必带的设备。它提供 3.5 耳机孔适合在任何的公共场所游玩。
手感说不上有多舒服，按钮手感适中，D-Pad 十字键略硬，竖版设计注定握持感不会特别好，无法长时间握持。
背键设计不好建议替换成有梯度的背键提供更好的手指触感和识别。

{{< figure src="/gears/rg35xx/shoulder-buttons.jpg"
    title="背键改装 3D 件"
>}}

掌机到手建议升级[官方系统支持切换大蒜系统](https://tieba.baidu.com/p/8490422220)且[游戏共用](https://tieba.baidu.com/p/8489528570)后再刷大蒜系统或国内大蒜系统魔改版，
后者能够提供更多的功能设置和更多模拟器（DOS、EasyRing）支持。TF 双卡推荐 32G 系统盘，128G 存储游戏。大蒜系统在 98% 的情况下非常好用，唯独想要玩 SEGA 土星游戏只能使用原装系统。除此之外还有些 RetroArch 系统问题：

- GBA 用的是 mGBA 新核心，音频卡顿的要死，有时候还会卡帧，可把 GBA rom 放到 GPSP 文件夹使用 gpSP 旧核心，目前还未找到把新核心的存档平移过来的[方案](https://www.reddit.com/r/RG35XX/comments/11rkh6b/new_core_of_gameboy_advance_has_very_bad_audio/)。
- 建议不要使用高功率的充电口，使用 5V 3A 电源可以正常充电。

最后分享系统、游戏的资源，国内大部分都在各种群、B 站可以找到：

- [大蒜系统资源聚合](https://gist.github.com/milnak/a288ddb7b0e1e51d251b2121baa03685)
- [集合各种系统和游戏合集](https://pan.baidu.com/s/1MjXp7AVHKqjEJJrHmMMrZg?pwd=35xx) （百度网盘，密码 {{<spoiler>}}35xx{{</spoiler>}}）

{{< figure src="/gears/rg35xx/cadillacs-dinosaurs-mod.jpg"
    title="最爱的恐龙岛"
    caption="视频来源"
    attr="Unity试做恐龙快打3D"
    attrlink="https://www.bilibili.com/video/BV1UV4y147uC"
>}}

[^youtube-video]: [My Favorite Handhelds of 2022](https://www.youtube.com/watch?v=hqAM3INcLeA) 和 [Miyoo Mini Plus vs Anbernic RG35XX Comparison](https://www.youtube.com/watch?v=Bdo44c2HsQY)
[^retroarch]: 市面上大多数游戏系统都是基于 [RetroArch](https://www.retroarch.com/) 开源系统二次开发，RG35XX 拥有 Miyoo Mini [洋葱 Onion 系统](https://github.com/OnionUI/Onion) 官方维护者移植的 [大蒜 Garlic 系统](https://www.patreon.com/posts/garlicos-for-76561333)，之前还在树莓派、香橙派安装过 [Lakka](https://www.lakka.tv) 都是如此。该系统包含我最喜欢的绝大多数游戏引擎。洋葱国内魔改办法还能支持 DOS 这就能玩上仙剑奇侠传、金庸群侠传等。
