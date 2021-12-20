---
title: "Kohana 官方 2.3，2.4，3.0 的最终裁决！"
date: "2009-07-24T12:34:56+08:00"
categories:
  - Technology
tags: 
- PHP
- Kohana
slug: "official-2-3-2-4-3-0-decisions"

---

> 更新：Kohana 官方已经做出[最终裁决][]！

两天前我(Shadowhand)曾经[说过][]关于 2.4 和 3.0 版本的问题和它们之间的关系已经做出的解答。之后的今天和其他开发者见面（with more of the devs），这似乎是错误的。所以长话短说，我们现在有两个选择：

​1. 我们在一个月内分别发布 2.4 和 3.0。 2.4 将会经可能的兼容 2.3.x 版本但是其中 Database 和 i18n 是全新的不同于 2.3 的系统。 3.0 也将不同于 2.4 的 Database，但是 i18n 系统还是和 2.4 一致。

​2. 完全抛弃 2.4 而专攻 3.0 版本，它将会有一个全新的类似 2.4 版本的 Database 特性，但是语法和更多的特性稍有些不同。 3.0 在发布的同时，新的网站和用户手册也会同步完成。

2.4 和 3.0 版本大约将会在同一天发布（2009年的8月下旬或9月上旬）。两个版本都不会去兼容
2.3.4 版本。虽然升级至 2.4 版本将会少于升级至 3.0 的兼容工作。（请记住，我们从来没有建议和要求用户升级到哪个核心版本）

我本可以行使 [BDFL][]（Benevolent Dictator For Life，代表少数开源软件开发者的领头人）权利做个强制决定，但是我觉得还是听一听社区的声音。你们认为哪个是 Kohana 在未来长期（至少 6 个月以上）开发基础的最好选择呢?

**更新**： 选择第二项，将会抛弃 2.3.x 版本公开发布的版本修复

--------

原文：[Official 2.3, 2.4, 3.0 Decisions - We need your feedback!][]

---------我是华丽的分割线--------------

KO3 RC1 目前已经发布，详情请看[这里][]，希望大家喜欢 Kohana，关注
Kohana，使用 Kohana
的朋友留下你的看法，这对Kohana自身和社区用户都是有益的！

--------关于 E-TextEditor  的分割线---------------

今天前去 Textmate clone 的软件 Intype论坛瞅了一眼，惊奇的发现同样是
Textmate clone 的 E-TextEditor 居然在今年3月份宣布开源，而5月份就在
Github 放出了源码！而且声称会开发 Linux 版本并且弘扬 Linux 的精神，Linux
版本统统免费！详情请看 [Intype 论坛][]

而且已经有Linux用户编译运行了 E-TextEditor 详情请看：[Building the E text
editor on Fedora 10][]

不知道身为 Textmate clone 的 Intype
会做何打算，它们目前正在全力开发新的版本（貌似内核和界面全部重新），拭目以待！

  [最终裁决]: http://forum.khnfans.cn/topic/view/167/1.html
  [说过]: http://forum.kohanaphp.com/comments.php?DiscussionID=2835&page=6#Item_12
  [BDFL]: http://lmgtfy.com/?q=bdfl
  [Official 2.3, 2.4, 3.0 Decisions - We need your feedback!]: http://forum.kohanaphp.com/comments.php?DiscussionID=3043&page=1
  [这里]: http://forum.khnfans.cn/topic/view/168.html
  [Intype 论坛]: http://intype.info/forums/discussion/827/eeditor-going-open-source-open-company/#Item_0
  [Building the E text editor on Fedora 10]: http://fixnum.org/blog/2009/e_on_fedora
