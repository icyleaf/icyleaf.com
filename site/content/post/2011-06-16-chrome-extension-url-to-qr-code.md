---
title: "Chrome 扩展"
date: "2011-06-16T12:34:56+08:00"
categories:
  - Technology
tags:
- Chrome
slug: "chrome-extension-url-to-qr-code"

---

URL to QR-Code 是一个 Chrome 扩展,适用于 Chrome 浏览页面的同时希望把在手机设备(当然手机得支持 QR-Code的扫描)也能访问.我总结可以适用于以下情景:


* 这个网页必须使用手机设备访问
* 这个网页是一个手机应用的安装链接(AppStore/Google Market),用手机访问可以直接安装
* 我就是想用手机浏览此网页,怎么着

好吧,基于以上情景,我做了一个 Chrome 扩展,恩,没错,只适用于 Chrome,也许会有人说,这个东西网上已经有了,为什么你还要重造轮子.我的理由是,虽然我的功能非常简单,鉴于目前现有的一些应用,都会把功能显示在 Chrome 的 Tab 上面,其实这个功能用的几率并不多,放在 Tab 实在是浪费了太大的空间,我的 Tab 的 Icons 已经负载过多了(大家可参考我之前分享的 [我常用的 Chrome 扩展集合](http://icyleaf.com/2011/06/11/im-using-chrome-extensions-software-list/)),因此我决定把 Icon 丢在地址栏的右侧,这里相对于的利用空间更小.点击之后直接弹出
QR-Code,方便手机扫描.

安装地址: http://icyleaf.googlecode.com/svn/javascript/Chrome/url\_to\_qr\_code\_v0.1.crx

--------------需要更新的分割线----------------

发现 Google Chart API 居然提供支持 QR-Code,文档在此后面准备更换生成QR-Code的服务接口支持选文字生成和文字链的原始链接的生成.这里算是埋下一个坑,大家可以提醒我来填满。。。

文档地址：http://code.google.com/apis/chart/image/docs/gallery/qr\_codes.html