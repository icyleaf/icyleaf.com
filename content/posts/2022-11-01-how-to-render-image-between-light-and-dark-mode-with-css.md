---
title: "使用 CSS 支持图片黑暗模式动态切换"
description:
date: 2022-11-01T11:24:24+08:00
slug: "how-to-render-image-between-light-and-dark-mode-with-css"
type: posts
draft: false
index: true
comments: true
isCJKLanguage: true
categories:
  - Technology
tags:
  - CSS
  - dark-mode
image: https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=4095&q=80
imageSource:
  - name: Andrew Schultz
    link: https://unsplash.com/photos/EAlbsTo6nuQ
  - name: Unsplash
    link: https://unsplash.com
---

[Zealot](https://github.com/tryzealot/zealot) 项目是我个人长期以来的 Side Project，[4.5.0](https://zealot.ews.im/zh-Hans/docs/user-guide/changelog#450-2022-08-19) 版本开始支持了黑暗模式并提供明亮、黑暗和随系统自动切换三种设置，前两种非常明确可以强制设定，随系统自动切换略微棘手 Javascript 一直是我的弱项，还好 CSS 提供 [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 能够很容易的判断系统主题。受益于 [AdminLTE](https://github.com/ColorlibHQ/AdminLTE/releases/tag/v3.2.0) 支持黑暗模式，我只需要把用户设定的值传递给 Javascript 并动态[设置特定的 CSS class 变量](https://github.com/tryzealot/zealot/blob/4.5.0/app/javascript/controllers/global_controller.js#L26-L37)。

## 效果

尝试修改系统设置的主题，切换明亮和黑暗模式下面的结果有什么变化：

{{< codepen id="mdKVOMy" >}}

如果看不到上面的演示，请[点击这里](https://codepen.io/icyleaf/pen/mdKVOMy)打开新窗口预览。

## 原理

### 样式适配

CSS 样式的模式切换使用的是额外添加的 `@media (prefers-color-scheme: dark)` 作用域，在它里面对样式重新设置就可以完成对黑暗模式的修改：

```css
body {
  font-family: system-ui;
  background: #FFFFFF;
  text-align: center;
}

/* 黑暗模式作用域 */
@media (prefers-color-scheme: dark) {
  body {
    background: #000000;
  }
}
```

默认情况下 body 会设置系统字体、白色背景色和字体居中，黑暗模式下会覆盖背景色为黑色。

### 图片适配

根据 CSS 样式的规则理论上可以把图片设置为 `background-image` ：

```css
.intro-image {
  background-image: url(incro-light.png);
}

@media (prefers-color-scheme: dark) {
  .intro-image {
    background-image: url(incro-dark.png);
  }
}
```

这个方案能实现却多了额外的设置，设置图片大小和缩放方式，也不太符合 HTML 的规范，图片建议设置到 HTML 标签中，[<picture>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) 标签就出现了。

它允许设置多个源 `source` 来应对不同的环境变量，如果都没有匹配或浏览器不支持再通过 img 标签兜底，利用该特性把 `prefers-color-scheme: dark` 添加到 `source` 中：

```html
<picture>
  <!-- 如果是黑暗模式使用该地址 -->
  <source srcset="https://zealot.ews.im/img/showcase-dark.png" media="(prefers-color-scheme: dark)">
  <!-- 兜底方案 -->
  <img src="https://zealot.ews.im/img/showcase-light.png">
</picture>
```

## 实践

Zealot 在对图片适配手动设置和自动匹配黑暗模式是[这么做的](https://github.com/tryzealot/zealot/commit/b48573ce439c07be2eed305a4aac91f4475c2b27)。项目主要适配的只有图片二维码，简单分解下实现步骤：

1. 动态二维码生成支持黑暗模式
1. 判断系统是指定明亮或黑暗模式直接强制设定二维码图片对应的主题
1. 随系统自动切换的情况下，追加 `picture` 标签做判断区分两种主题的图片地址
