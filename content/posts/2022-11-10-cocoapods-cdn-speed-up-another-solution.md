---
title: "Cocoapods CDN 加速新解"
date: "2022-11-10T15:30:07+08:00"
slug: "cocoapods-cdn-speed-up-another-solution"
categories:
  - Technology
tags:
  - Ruby
  - iOS
series:
  - Cocoapods 秘笈
index: false
comments: true
isCJKLanguage: true
share: true
description: 官方 CDN 不稳定，Git 源又太大，还要其他解决方案吗？
image: https://images.unsplash.com/photo-1501770118606-b1d640526693?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80
imageSource:
  - name: Neil Thomas
    link: https://unsplash.com/photos/SIU1Glk6v5k
  - name: Unsplash
    link: https://unsplash.com
---

距离 Cocoapods 支持 CDN 源已经 3 年，期间不断有开发者从 CDN 源切回了最初 Git 源的方案，Cocoapods 也没有更多的改进措施。

当初写[CDN 加速镜像源码解读](https://icyleaf.com/2019/11/cocoapods-cdn-source-code-reading/)还是用的 jsdelivr 没想到过了 2 个小版本改 Netlify 了。从国内几大 DNS 解析结果来看总会到 cloudflare 上面。

```bash
$ doggo cdn.cocoapods.org CNAME @202.106.0.20
NAME          	TYPE	CLASS	TTL 	ADDRESS                       	NAMESERVER
cocoapods.org.	SOA 	IN   	303s	betty.ns.cloudflare.com.      	202.106.0.20:53
              	    	     	    	dns.cloudflare.com. 2280316554
              	    	     	    	10000 2400 604800 3600

$ doggo cdn.cocoapods.org CNAME @114.114.114.114
NAME          	TYPE	CLASS	TTL 	ADDRESS                       	NAMESERVER
cocoapods.org.	SOA 	IN   	277s	betty.ns.cloudflare.com.      	114.114.114.114:53
              	    	     	    	dns.cloudflare.com. 2280316554
              	    	     	    	10000 2400 604800 3600
```

jsdelir 的 CDN 是全球覆盖相对比较广的，中国地区用的是网宿节点，但[证书问题](https://www.v2ex.com/t/823281)现在流量都切到了 Fastly

{{< figure src="/uploads/2022/11/10/jsdelivr-network.png"
    link="/uploads/2022/11/10/jsdelivr-network.png"
    title="jsdelivr network"
>}}

国内 DNS 解析的结果可以看出来：

```bash
$ doggo cdn.jsdelivr.net CNAME @114.114.114.114
NAME             	TYPE 	CLASS	TTL  	ADDRESS                 	NAMESERVER
cdn.jsdelivr.net.	CNAME	IN   	1529s	jsdelivr.map.fastly.net.	114.114.114.114:53

15:38:53 in ~
$ doggo cdn.jsdelivr.net CNAME @202.106.0.20
NAME             	TYPE 	CLASS	TTL  	ADDRESS                 	NAMESERVER
cdn.jsdelivr.net.	CNAME	IN   	1515s	jsdelivr.map.fastly.net.	202.106.0.20:53
```

jsdelivr 支持 Github 仓库代码的 CDN 加速，利用本机制可以把 CDN 源加速到 jsdelivr。

官方 CDN 源的源码仓库是 [Cocoapods/cdn.cocoapods.org](https://github.com/CocoaPods/cdn.cocoapods.org)，主分支是同步脚本，`gh-pages` 分支是源的真实数据。

{{< figure src="/uploads/2022/11/10/jsdelivr-github-demo.png"
    title="Cocoapods github 仓库和 jsdelivr CDN 生成结果"
    attr="生成工具"
    attrlink="https://www.jsdelivr.com/github"
>}}

打开 `Podfile` 修改或添加新的地址：

```diff
- source "https://cdn.cocoapods.org"
+ source "https://cdn.jsdelivr.net/gh/CocoaPods/cdn.cocoapods.org@gh-pages"
```

也可以手动指定 jsdelivr 不同的 CDN 供应商

- fastly.jsdelivr.net
- testingcf.jsdelivr.net
- quantil.jsdelivr.net (目前不可用)

利用这个原理可以套到任何支持 Github 仓库作为 CDN 加速的服务。
