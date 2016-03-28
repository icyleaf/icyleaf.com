title: Colors
date: 2012-03-02 12:34:56
category: Technology
tags:
- Mac
- App
permalink: colors-is-ios-development-utility-tool

---

> 最新更新，发现更好的免费取色器 [Sip](https://itunes.apple.com/us/app/sip/id507257563?mt=12)

[Colors](http://mattpatenaude.com/) 是一个简单的颜色取色器，简单的有可能你都没有听说过它，虽然它对于平面设计师以及
Web
设计师不太看中，但它可是程序员中的一个实用利器，为什么这样说呢，看下面截图，除了基本的颜色取值外，还包括了 Mac 和 iOS（iPhone/iPad）对于类的取值。

等等，你说的不对，我下载了发现并没有 UIColor 的值，坑爹这不是，哈哈，非也，这个应用的最大好处在于可以自定义输出值。默认程序并没有 UIColor 这值。其实添加也很简单，在设置里（Command+逗号），添加一个名为 UIColor 的选项，其中只需要设置 GRB 的输出值和 Alpha 一样即可（Short Decimal over 1），输出格式使用 UIColor 的 RGBA 格式：

```
[UIColor colorWithRed:%r green:%g blue:%b alpha:%a]
```

后来发现这个应用是开源项目，且最后更新时间为 2009 年，难怪没有 UIColor
的输出值，有兴趣的朋友可以 Fork ：https://github.com/13bold/Colors

> 我 fork 了作者的分支，添加了对 UIColor 的支持：http://github.com/icyleaf/Colors