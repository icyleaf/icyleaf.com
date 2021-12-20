---
title: "EasyConvert"
date: "2012-10-25T12:34:56+08:00"
categories:
  - Technology
tags: 
- Mac
- App
slug: "easyconvert-gbk-to-utf8-convert-tool-for-mac"

---

托设计朋友的要求，继续奉献出一个小工具: EasyConvert - 针对于文本文件的编码转换工具 - GBK to UTF8

首先这个应用是用于 OS X 系统的，其次其实它是一个很弱的工具，对于技术宅来说一行代码搞定：

```
iconv -f GBK -t UTF-8 source.txt \> output.txt
```

但对于非技术的人来说，跟他们说 terminal 就费了牛鼻子劲了，索性上工具。

代码是开放的：[https://github.com/icyleaf/EasyConvert](https://github.com/icyleaf/EasyConvert)

应用下载：[EasyConvert\_v0.1.3.zip](https://github.com/downloads/icyleaf/EasyConvert/EasyConvert\_v0.1.3.zip)

使用方法很简单，把要转换的 gbk 文件拖到应用窗口里面，应用会自动保存到同目录下。

BTW，应用 Icon 及涉及的图片资源均来自网络，[声明在此](https://github.com/icyleaf/EasyConvert/blob/master/EasyConvert/Readme)。
