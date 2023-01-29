---
title: "申请泰国电子落地签答疑解惑"
description: 电子签证期间入境神速（大家还未意识到时）
date: "2019-04-10T13:12:07+08:00"
slug: "apply-thailand-evisa"
type: posts
categories:
  - Life
tags:
  - 旅行
  - 泰国
  - 电子落地签
index: false
comments: true
isCJKLanguage: true
share: true
image: https://images.unsplash.com/photo-1581656702382-9ae90e68e7b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2562&q=80
imageSource:
  - name: mana5280
    link: https://unsplash.com/photos/ivG8LkDrtjs
  - name: Unsplash
    link: https://unsplash.com
---

{{< updated at="2019-03-28" >}}

拿着打印的 eVISA 到达曼谷机场后填写玩出入境申请表去专门的 eVISA 通道（可能有路障，工作人员知道是办理 eVISA 会放行）到那边几乎没有人在排队，我们附带的照片（没贴上去）给了也没要（建议最好还是带着），5 分钟时间入境！

{{< /updated >}}

3月初购买了去泰国曼谷的机票，泰国的签证自 2018 年末增加了第四种在线申请电子落地签（E-Visa），赶上泰国免签证费延期到 2019 年 4 月底的好事情，还需要收第三方机构的手续费（这个后面展开）一家三口办下来比淘宝找中介要便宜好多，也不用落地排 1-2 小时队当场办落地签（据说落地入境走的是独立通道）

签证办理渠道对比表

渠道 | 办理机构 | 费用 | 停留时长 | 备注
---|---|---|---|---
自己递签 | 泰国大使馆 | 签证费 | 60天 | 资料要求多，耗时 7 天，婴儿同大人
代办 | 旅行社或淘宝 | 230 人民币签证费+中介费 | 60天 | 资料要求少，耗时 7 天，婴儿同大人
落地签 | 机场入境处 | 签证费 | 60天 | 排队办理耗时 1-2 小时
电子落地签 | 网站办理 | 签证费+手续费 525 泰铢 | 15天，不可延期 | 资料整理比较蛋疼，下签时间未知

上面三种要么要么自己跑大使馆，要么需要费用比较高，办理电子落地签每人也就收 525 泰铢。当时查了一些资料说是申请有好多坑，如果被拒签有一次修改的机会，再被拒签不退钱。

> 一句话总结：是 2019 年 4 月底前最佳申请途径，费用低廉只要资料没有任何问题出发前肯定下签。唯一缺点是只有 15 天停留期且不可延期。

### 申请攻略

泰国电子落地签申请入口：[https://www.evisathailand.com/](https://www.evisathailand.com/)

通过我申请的过程来看我猜这是一个第三方机构委托，他们只负责资料的审核，通过后再递交泰国出入境管理局，因此是商业域名。具体申请步骤大家参考[2019泰国电子落地签申请亲妈式教学](https://bbs.qyer.com/thread-3121710-1.html)。

### 注意事项

- 姓名填写参照护照（名是多字的中间不要有空格）
- 上传附件支持 PNG/JPG/GIF/PDF 大于 100KB 总体小于 2MB
- 机票行程单和酒店预订单建议是英文版本
- 机票行程单往返在一个 PDF 文件的上传两次
- 酒店预订单接受 Booking 和 Airbnb（在邮件酒店预订单有打印功能，跳转网页后打开浏览器隐私模式切换英文打印就是纯英文版本）

泰国电子落地签网站也在不断版本迭代中，以上办理中可能出现的问题后续可能会改善。

### 查询进度

网址：[https://www.evisathailand.com/check](https://www.evisathailand.com/check)

输入 Application id 和护照号即可。

技术党这么做：

```bash
curl 'https://www.evisathailand.com/check?q=check' --data 'reference_code={application_id}&passport_number={passport_number}'
```

解析结果用 html 解析器解析 css 查询路径 `.container ul li` 数组里 h5 是标题，input 的 value 值为数值。

我是用了一个 telegram bot 可以发送命令查询结果，你也可以直接写一个定时脚本有结果了直接发邮件。

### 咨询渠道

- 发英文邮件至 `contact@evisathailand.com` 回复频率未知，我是 6 天后得到的官腔答复。
- 加微信 `泰国电子落地签eVISA` 直接中文留言，回复频率几分钟内繁体中文官腔回复（我猜又是一个客服委托机构）。
- 泰国电子落地签网站最底部 `LIVE CHAT 即时聊天` 英文沟通，秒回复，当场给你审查资料并递交给泰国出入境管理局。（可能需要翻墙）

### 何时下签

办理电子签除了便宜以外，我另外看中的据说是 24 - 48 小时下签，然而我太年轻...

我是 3 月 28 日晚上申请，真正下签是 4 月 10 日，耗时 13 天，期间我尝试了三种咨询渠道，只有最后一种最有效，资料审核后递交泰国出入境管理局后端状态是不可催的，我是从他们审查后递交泰国出入境管理局又花了 3 天才拿到 evisa，不过他们客服给我的答复是只要我这递交泰国出入境管理局了肯定在你出发前给你下签。
