---
title: "初识 Ruby Gem Guard"
categories:
  - Technology
tags:
- Ruby
- Gem
slug: "intro-ruby-gem-guard"
date: "2014-01-25T12:34:56+08:00"
---

[Guard](http://guardgem.org) 是一个很好的 Web 辅助开发工具，因为看了 tutsplus 网站的介绍视频：[Guard is your best firend](http://net.tutsplus.com/tutorials/tools-and-tips/guard-is-your-best-friend/)。这里把视频的东西提取出来自我消化：

```
$ gem install guard
```

它实际的工作就像名字那样，实时守卫这某些文件并做出对应的操作，本质上相当于一个有这个思想的禁卫兵，通过指派命令（安装扩展 gem）而负责守卫和执行，比如视频中提到的：

上面是概念的理解，实际上的流程是，设定一系列的规则，让他监控文件内容（修改时间）的动态，一旦发生变化则根据不同的命令执行不同的操作。

具体基本操作不再多少，官方 [README](https://github.com/guard/guard) 写的非常详细，或者通过上面视频也能熟悉。

## guard-sass

监听 [sass](http://sass-lang.com/) 文件并转换成 css 文件

## guard-coffeescript

监听 [coffeescript](http://coffeescript.org/) 文件并转换成 js 文件

## guard-rspec

自动跑 [rspec](https://github.com/rspec/rspec-core) test

## guard-livereload

配合浏览器的辅助工具，做到无需手动刷新页面即可看到 html/css/js 的修改变化，浏览器需要安装配套插件。

## guard-zeus

自动接管 [zeus](https://github.com/burke/zeus)

## guard-puma

[puma](http://puma.io) 是目前比较新的一个 web 服务器，这个扩展可以监听配置变化从而自动重启服务器。


官方列举的所有扩展：[List of available Guards](https://github.com/guard/guard/wiki/List-of-available-Guards)