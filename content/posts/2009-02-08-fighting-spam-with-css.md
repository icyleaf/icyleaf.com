---
title: "与 SPAM 战斗到底：CSS 篇"
date: "2009-02-08T12:34:56+08:00"
categories:
  - Technology
tags:
- CSS
slug: "fighting-spam-with-css"

---

SPAM，现在还没有一个非常严格的定义。一般来说，凡是未经用户许可就强行发送到用户的邮箱中的任何电子邮件。现在应该已经广泛各种网络应用上面。对于网站来说，网站知名度小的时候或许还可以免于“侵犯”，可是一旦在搜索引擎收录的数量做出一些成绩，SPAM 就会主动找上门来，各种垃圾信息就会扑面而来，然而对SPAM 的战斗一起在进行，这是一场没有硝烟的战争，为了防范
SPAM，大家各显其能，招招新颖，当然还有一些专门为 SPAM 创建防御服务的网站，比如说 WordPress 自带的 [Akismet](http://akismet.com/)。对于各种防御方法，我想应该可以写成一个系列，这个系列的内容或许是从网络上搜集或许是自己突发奇想想出来的奇招（目前应该还不可能哈）。

今天我带给大家的是方法另辟其境：**CSS**。总所周知，CSS 是一种层样式表，只是为了网站界面的展现做出重要贡献的角色。那么它怎么实现防御 SPAM 的呢？ok，接着下看。

**原理**

为了不上了就代码让大家感到迷惑，先讲一下原理：首先在创建表单的时候，添加一个对 SPAM 校验的 input 标签，然后再提交的时候进行对这个标签进行判断其值是否为空，因判断是否为 SPAM。（看官：不就是设置成 hidden 类型吗，这谁都知道）错！我承认这是一个最常见的判断 SPAM 的流程，但这里添加的 input 类型使用的是 text 类型，这是为了防止 SPAM 在进行抓取页面进行对 input 类型判断是否有 hidden 类型为设置的，那么怎么隐藏这个 input 标签呢？那么就可以利用到 CSS 的 display 属性，哈哈，是不是明白了？好吧，看代码吧。

**代码**

HTML 代码：

```txt
Name:<input name="name" /><br />
Email:<input name="email" /><br />
Comment:<input name="comment" /><br />
<input type="hidden" class="special" />
<input type="submit" value="Post it" />
```

CSS 代码：

```txt
body {line-height:35px;font-family:Arial, Helvetica, sans-serif;color:#333;font-size:14px;}
.special {display:none;}
```

上述代码中 class 为 special 的 input 标签即为判断 SPAM 的标志。使用 CSS 对其隐藏，就在提交表单后进行对这个 input 进行判断是否为空即可。这样就简单避免 SPAM 对 input 的 hidden 判断的避免而轻松达到防御的目的。

**声明**

CSS 防御 SPAM 的实现方法来自[Modernblue](http://www.modernblue.com/web-design-blog/fighting-spam-with-css/) 网站发布的文章。本人只是做翻译工作，特此声明。
