---
title: 如何解决 macOS 编译丢失 C Header 文件
date: 2018-10-24 14:30:07 +0800
slug: apply-for-a-motorcycle-license
categories:
- Technology
tags:
- macOS
index: false
comments: true
isCJKLanguage: true
share: true
---

今天在 macOS 10.14 通过 brew 安装 libgit2 之后调用时提示提示 `fatal error: 'time.h' file not found`，本以为是 brew 的问题自己去编译问题依然。
确认了 Xcode Command Line Tools 并且再次确认了 `xcode-select -s /Applications/Xcode.app` 之后还是这样，就连重启大法也不用之后，
在 Google 上检索换了好些关键词也没找到问题出在哪，索性把关键词继续模糊放大扩大范围，看到了 github 一个不知道是啥的项目看到有 `'stdio.h.h' file not found`
类似的 issue 终于找到了[解决答案](https://github.com/frida/frida/issues/338#issuecomment-424595668)：

> 关键原因是在于找不到 /usr/include 目录，然而安装 command-line tools 也不会自动帮你解决，而是需要在安装后再手动安装 /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg 才行。

跟随这个解决方案也附带了[解释](https://forums.developer.apple.com/thread/104296)：

> From the latest Xcode 10 Beta 2 release notes.
>
> The Command Line Tools package installs the macOS system headers inside the macOS SDK. Software that compiles with the installed tools will search for macOS headers at the standard include path: /Applications/Xcodebeta.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.1 4.sdk/usr/include For legacy software that looks for the macOS headers in the base system under /usr/include, please install the package file located at: /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg
