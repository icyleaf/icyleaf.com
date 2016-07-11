---
title: Gitlab API Wrapper for Crystal
date: 2016-07-11 20:41:26
category: Technology
tags:
- Ruby
- Crystal
permalink: gitlab-api-wrapper-for-crystal
---

## Gitlab.cr

[gitlab.cr](https://github.com/icyleaf/gitlab.cr) 是我最近课下练习的新语言 [Crystal](http://crystal-lang.org/) 写的 gitlab 包，方法和功能和 [gitlab ruby 版本](https://github.com/NARKOZ/gitlab)基本类似。

目前已经完成了大部分 API 的封装，在一边熟悉 crystal 的同时一边补充，其中肯定有一些性能问题和坑，毕竟没有任何依赖都是自己实现的。比较坑爹的是官方手册太简单，也没有实时跟进，能够好好翻阅的其实也就是官方的 API 文档和源码。不过 crystal 还算比较人性化的一面，默认集成了类似 rspce 的单元测试（简化版）和依赖库管理 shards（类似 bundler）和生成文档的工具。通过 [travis-ci](https://travis-ci.org/``) 会自动生成每次 git push 的变化。

API 文档：http://icyleaf.github.io/gitlab.cr/

## 为什么学习 Crystal？

![crystal logo](https://cloud.githubusercontent.com/assets/209371/13291809/022e2360-daf8-11e5-8be7-d02c1c8b38fb.png)

Ruby 的缺点众所周知的一个点就是慢，虽说用它的人都不在乎主要是用的爽，so what！这一致命的坑其实默默的被承受着，很多的 Ruby 开发者也在一直寻觅着新的更高性能的语言。比如 Gitlab 的 Build Runner 使用 Go 实现了。Rails 的核心开发者基于多年对 Ruby 的怨念而开发的 Elixir，还有 Firefox 主导的 Rust 也吸引了不少目光。有那么多选择为什么偏偏选了这么一个没有听说过的语言？

## 语言优势

- 类似 Ruby 风格语法（但舍弃了一些动态特性）
- 一切都是对象（和 Ruby 一样）
- 自动类型推荐和静态类型检查
- 支持方法重载
- 易用的 C 语言库的绑定机制
- 基于 LLVM（目前不支持 Windows）
- 编译性语言，可以打包二进制包

仅仅是这些可能大家觉得没什么，其实对我来说也不够冲击力，最重要的关键是在我从订阅的 Ruby Weekly 周刊看到 sidekiq 的作者用 crystal 重新实现了核心部分发的[博文分享](http://www.mikeperham.com/2016/05/25/sidekiq-for-crystal/)，提到的一点：**至少是比 ruby 2.3 大部分代码要快 3-5 倍，减少至少 3 倍的内存占用**。怀着怀疑的态度我大概的研究了这个语言，确实看到了新希望。

库 | 语言 | 并发量 | 平均响应时间
---|---|---|---
[fast-http-server](https://github.com/sdogruyol/fast-http-server) | `Crystal` | 18348.47rpm | 8.67ms
[http-server](https://github.com/indexzero/http-server) | `Node.js` | 2105.55rpm | 47.92ms
[SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html) | `Python` | 785.14rpm | 1.91ms

还有一份一直再更新维护的语言之间的[评测](https://github.com/kostya/benchmarks)仅供参考，看着里面的数据还是蛮吸引人的。

> 评测数据来源: [Flirting with Crystal, a Rubyist Perspective](http://www.akitaonrails.com/2016/05/31/flirting-with-crystal-a-rubyist-perspective)

## 语言友好

```ruby
# File: server.cr
require "http/server"

server = HTTP::Server.new(8080) do |context|
  context.response.content_type = "text/plain"
  context.response.print "Hello world! The time is #{Time.now}"
end

puts "Listening on http://0.0.0.0:8080"
server.listen
```

看着是不是是不是和 Ruby 差不多。通过命令编译成二进制在运行试试：

```bash
$ crystal build --release server.cr
$ ./server
Listening on http://0.0.0.0:8080
```

> macOS 用户可以通过 brew 进行安装 `brew install crystal-lang`

## 语言限制

- 没有了强大的黑魔法，尤其是针对 `eval` 和 `send` 两个的缺失。提供了 macro 的方式可以实现部分动态定义方法的机制。
- require 引入必须放置在头部（crystal 0.7.7 以上版本的限制）
- 有待优化的 gc 机制（目前采用的是 [Hans Boehm GC](https://zh.wikipedia.org/wiki/%E8%B2%9D%E5%A7%86%E5%9E%83%E5%9C%BE%E6%94%B6%E9%9B%86%E5%99%A8)）
- 还在开发中的语言，API 变化很快

## 最后想说的话

总体来说是一个让人眼前一亮的语言，很是期待后续的进化。我相信 sidekiq 作者的那篇博文也让无数开发者看到了新大陆。目前项目也在[捐献](https://salt.bountysource.com/teams/crystal-lang)中，如果你对它感兴趣不妨慷慨的动动自己的钱包，Ruby 的创始人 matz 直接捐献了 $500。

## 相关资源

- 作者 Twitter: https://twitter.com/asterite
- Awesome Crystal: http://awesome-crystal.com/
- Sidekiq for Crystal: http://www.mikeperham.com/2016/05/25/sidekiq-for-crystal/
- Test Driving Sidekiq and Crystal: http://www.mikeperham.com/2016/06/14/test-driving-sidekiq-and-crystal/
- Flirting with Crystal, a Rubyist Perspective: http://www.akitaonrails.com/2016/05/31/flirting-with-crystal-a-rubyist-perspective