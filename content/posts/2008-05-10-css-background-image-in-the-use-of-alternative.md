---
title: "CSS中background-image的另类使用"
date: "2008-05-10T12:34:56+08:00"
categories:
  - Technology
tags:
- CSS
slug: "css-background-image-in-the-use-of-alternative"

---

在CSS众多的样式当中，background可以说是扮演着重要的角色，它可以设置对象的背景样式。如颜色或者使用一张图片代替，今天我要多说两句的就是使用一张图片的参数：image。准确的来说应该是background-image。我们可以这样用它：

```txt
body{background-image: url(http://www.icyleaf.cn/logo.jpg);
```

这都是可以的，所以说css的自由度很高，这点我很喜欢。其实css显示图片分3种，第一种是单纯的显示一个图片；第二种称之为**CSS Sprites**，也就是说把若干小图片合成一个大图片，然后通过background的postion参数实现效果，第三种就是我们今天说的另类用法，它也有学名称之为**Inline images**。实现声明一点，这个方法不适用于IE浏览器，恩，没错，IE，我们都遗弃你了。（关于CSS Sprites 的描述信息来自[7career.org][]）

CSS Sprites是一种把所有的图片都以base64编码以源代码的形式写在CSS文件里，格式是这样的：**data:[<mediatype>][;base64],<data>**

`data:URL` 标签是在1995年第一次提出，按[RFC2397规范的描述][]：它是"allows
inclusion of small data items as 'immediate' data.（允许在页面中包含一些小的即时数据）"。如一个内嵌的的图片可以这样引用：

```txt
body{background-image:url(data:image/gif;base64,R0lGODlhCAAIAJEAAOnp6eTk5O7m8AAAACH5BAEAAAIALAAAAAAIAAgAAAINjAMJh2q6DnxOVsqmLQA7);}
```

这段代码可以在firefox浏览器运行，恩，图片是我取自[mg12][]当前模板的背景图，呵呵(\^\_\_\_\^)

base64编码简单的说是，Base64内容传送编码被设计用来把任意序列的8位字节描述为一种不易被人直接识别的形式。最早使用在windows系统的电子邮件传输的，主要是附件的传输。在那个时候的黑客们也流行过一段base64编码版的木马和病毒。为了简单篇幅，想了解的看[这里][]。

第一次我也是通过这个方法获取的图片的base64编码，主要原因是网上没有现成的转换这种编码的工具，估计已经被大家所遗忘掉了。我这里简单的写了个PHP代码，实现了图片编码的转换：


这个在线转换的背景就是上面那段代码，大家可以通过查看网页源码看到。图片的代码转换原理也很简单，通过读取图片的文件并把图片储存在一个数组（或字符串）里面，然后使用base64\_encode转换即可～ok，讲解完毕。

  [CSS-background]: http://tu.6.cn/img/id/b438d4bdb329a74340c79037c2261021
  [7career.org]: http://7career.org/2008/02/hpws-1.html
  [RFC2397规范的描述]: http://tools.ietf.org/html/rfc2397
  [这里]: http://www.5dmail.net/html/2004-1-30/200413084348.htm
