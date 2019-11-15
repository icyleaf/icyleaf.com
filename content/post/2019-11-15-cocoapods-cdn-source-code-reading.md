---
title: "Cocoapods 新增 CDN 支持的源码解读"
date: "2019-11-15T19:10:07+08:00"
slug: "cocoapods-cdn-source-code-reading"
categories:
  - Technology
tags:
  - Ruby
  - iOS
menu: ""
index: false
comments: true
isCJKLanguage: true
share: true
draft: true
---

Cocoapods [1.7.2](https://blog.cocoapods.org/CocoaPods-1.7.2/) 版本开始增加 CDN 支持但默认没有启用，[1.8](http://blog.cocoapods.org/CocoaPods-1.8.0-beta/) 版本的发布舍弃了原始完整克隆的 Specs 仓库改用 CDN 服务。CDN 利用的是免费且强大的 [jsDelivr](https://www.jsdelivr.com/) CDN 服务，该 CDN 网络在国内是有备案因此速度和稳定性都会有很好的保证。该提案其实在去年已经有人使用 Cocoapods Plugin 的方式实现并向社区[贡献 PR](https://github.com/CocoaPods/CocoaPods/issues/8268)。

那么 CDN 支持相比之前的机制有啥优势呢？难道是把 Pods 的仓库和源码都托管到 CDN 网络了吗，其实并不是的。

> 友情提醒：本文只重点分析 Pods 下载的机制，不展开其他方面，以下只是 `pod install` 执行顺序中的一部分，如果你想了解 Cocoapods 都干了什么可以前往[这篇文章](https://www.jianshu.com/p/84936d9344ff)查阅。

### 老的机制

第一步先检查本地 `~/.cocoapods/repo/master` 目录是否存在，没有直接克隆 `https://github.com/Cocoapods/Specs.git` 仓库，这步在国内来说特别费时间正常下载下来目录应该是 2G+，如果有其他 source 源（比如私有源）会重复刚才的操作。

第二步安装 Podfile 每个 Pod 去在各个源中寻找对应的版本，从版本的 .podspec 文件解析获取组件的地址，这个可能是 http、git、svn、hg 中的[任意一个](https://guides.cocoapods.org/syntax/podspec.html#source)，获取到之后开始下载（默认是在 `~/Library/Caches/CocoaPods` 做缓存目录）

### 新的机制

第一步分析 Podfile 里面的 source ，如果没有走默认 Cocoapods 的配置（1.8 以上是 https://cdn.cocoapods.org，之前的还是 Cocoapods/Spec），
如果本地不存在官方 cdn 的 repo 名字是 trunk 的保留字，自己无法创建。如果有自定义的 source 会追加上去 sources 列表。

```
$ http HEAD https://cdn.cocoapods.org/all_pods.txt
HTTP/1.1 200 OK
Accept-Ranges: bytes
Age: 0
Cache-Control: public, max-age=0, must-revalidate
Connection: keep-alive
Content-Length: 924280
Content-Type: text/plain; charset=UTF-8
Date: Sat, 09 Nov 2019 07:06:15 GMT
Etag: "acf0d284f3a8e82e0d66ba1a91cd30b9-ssl"
Server: Netlify
Strict-Transport-Security: max-age=31536000
X-NF-Request-ID: 50b466cd-ce9e-4326-b5bb-0d29a193ae4b-7809449
```

第二步检查或下载每个 source，每个 source 会检查是否是 cdn 类型（使用 HEAD 请求检查是否包含 /all_pods.txt）文件：

- cdn 类型，下面详细解释
- 其他类型，走原来的老的逻辑，不再赘述

第三步，下载 `Cocoapods-version.yml` 并缓存 etag，下载 `/Cocoapods-version.yml` 并取 headers 的第一个 etag 的值存为 `/Cocoapods-version.yml.etag`，如果存在 etag 会比对一样就不需要下载， 链接支持根目录和其他目录，支持 301 跳转。

Cocoapods-version.yml

```yaml
---
min: 1.0.0
last: 1.8.4
prefix_lengths:
- 1
- 1
- 1
```

第四步，分析 Pod 并获取 pod 的版本信息，比如 Podfile 我增加了一个 `pod "AFNetworking"`，把 pod 名字做 MD5 后的值取 Cocoapods-version.yml 的 prefiex\_length 数组长度的值单字母拆分用下划线分割按照规则拼成文件名 `all_pods_versions(_{fragment}).txt` (如果prefix\_length 为 0 则只会去下载 `/all_pods_versions.txt`)

比如：prefix\_lengths 数组大小为 3，AFNetworking MD5 后 a75d452377f396bdc4b623a5df25820 则匹配前三位 a75 拆分后 a\_7\_5
后查找 cdn url 路径的 `/all_pods_versions_a_7_5.txt` 下载下来后的内容：

```
Fuse/0.1.0/0.2.0/1.0.0/1.1.0/1.2.0
GXFlowView/1.0.0
JFCountryPicker/0.0.1/0.0.2
JVEmptyElement/0.1.0
```

第五步，下载 pod 的所有版本的 .podspec 文件，从上面的文件按照每行寻找第一段的名字，把后面的所有版本按照上面获取到的 prefix\_lengths 的值（例如 AFNetworking 是 a, 7 , 5） `/Specs/a/7/5/AFNetworking/{version}/AFNetworking.podspec.json` 一次下载，并保存 etag 为 `/Specs/a/7/5/AFNetworking/{version}/AFNetworking.podspec.json.etag`，如果没有找到的话就会直接报错 :(

```
Adding spec repo `trunk` with CDN `https://cdn.cocoapods.org/`
  CDN: trunk Relative path downloaded: CocoaPods-version.yml, save ETag: "031c25b97a0aca21900087e355dcf663-ssl"
  CDN: trunk Relative path: CocoaPods-version.yml exists! Returning local because checking is only perfomed in repo update
  CDN: trunk Relative path downloaded: all_pods_versions_a_7_5.txt, save ETag: "5b32718ecbe82b0ae71ab3c77120213f-ssl"
  CDN: trunk Redirecting from https://cdn.cocoapods.org/Specs/a/7/5/AFNetworking/0.10.0/AFNetworking.podspec.json to https://raw.githubusercontent.com/CocoaPods/Specs/master/Specs/a/7/5/AFNetworking/0.10.0/AFNetworking.podspec.json
  CDN: trunk Relative path downloaded: Specs/a/7/5/AFNetworking/0.10.0/AFNetworking.podspec.json, save ETag: W/"a5f00eb1fdfdcab00b89e96bb81d48c110f09220063fdcf0b269290bffc18cf5"
```

Cocoapods trunk 源的目录结构：

```
.cocoapods
  repo
    trunk
      .url   #=> https://cdn.cocoapods.org/
      Cocoapods-version.yml  # => 从 https://cdn.cocoapods.org/CocoaPods-version.yml 下载的文件
      Cocoapods-version.yml.etag  # 上一个请求的第一个 etag 值存下来
      all_pods_versions_a_7_5.txt  # 参考上面的备注
      all_pods_versions_a_7_5.txt.etag # 上一个请求的第一个 etag 值存下来
```

第六步和老的机制第二步一样同样最终还是会寻找 podspec 里面下载地址去下载，
也就是说**真正 CDN 缓存加速的只有原有 Specs 必要的 podspec 文件，而不会加速 Pod 真正源地址**，改机制只是减轻了本地更新官方 Specs 源的麻烦以及维护一个巨大的本地文件存储，这也是中心化机制的一个心结。
