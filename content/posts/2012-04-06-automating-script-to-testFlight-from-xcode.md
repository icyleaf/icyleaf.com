---
title: "自动化脚本上传应用至 testflightapp"
date: "2012-04-06T12:34:56+08:00"
categories:
  - Technology
tags:
- XCode
- iOS
- testflightapp
slug: "automating-script-to-testFlight-from-xcode"

---

Testflightapp 是团队开发测试中起了重要的角色，尤其是到目前为止一直是免费，最近还推出的 Live 功能不仅可以统计本身的一些数据还可以把现有的一些其他的账户的数据（比如， itunesconnect，Apple iAd，admob 等）导入进一步扩大聚合。

尤其是它真的重视开发着的核心需求，仅推出了唯一的一个公开 API，就是上传打包后的 ipa 文件，配合 Xcode 中 Archive 的 Post-action 可以轻松搞定自动化的操作。

下面是网上搜集的脚本，算是我发现定制化比较强的[自动化脚本](https://gist.github.com/1379127)，而且注解也写的很详细。可以在配合我的打包脚本，可以把各个发布渠道的事情一起自动化。

> 注意：Xcode 默认的 run script 是 `/bin/sh`，而上面的脚本是
`/bin/bash`。

这个 Post-action 不爽的地方在于所有的 `echo` 没有办法直接输出到 Xcode 的 output 里面，所以脚本只能把 log 保持到了 `/tmp`
目录下面，如果发现出现问题请仔细查看 log。

BTW，Post-actions 添加的脚本对于忽略了 XCode 干扰文件的版本控制来说，它没有归入到版本控制之中，脚本是被转义后放在了一个 xcscheme 的 xml 文件中：

```
(project).xcodeproj/xcuserdata/(username).xcuserdatad/xcschemes/(name).xcscheme
```