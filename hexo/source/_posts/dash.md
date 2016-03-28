title: Dash 你值得拥有的文档管理工具
date: 2013-02-06 12:34:56
category: Technology
tags:
- Mac
- Dash
- Python
- Flask
permalink: dash

---

Dash 是 Mac OS 的一个文档管理工具，从它第一版发布用到现在，绝对是一个你值得拥有的文档管理工具，因为它还是免费的，你可以从 [Mac App Store](https://itunes.apple.com/cn/app/dash-docs-snippets/id458034879?mt=12) 购买。但是全功能需要应用内付费，否则有些“小骚扰”。

> 建议购买 Full Version，目前是半价，人民币 30 元

![Dash](http://a1.mzstatic.com/us/r1000/106/Purple/v4/14/50/16/14501624-f6fd-4dae-a2bf-187a5a6417de/icon.175x175-75.png)

## 特性

* 支持任何一个你想管理的文档（iOS/Mac/PHP/Python/Java/jQuery/Backbone.js 等等）
* 支持自定义生成你想要的文档（AppleDoc/JavaDoc/RDoc/Doxygen/pydoctor/Sphinx/Scaladoc）
* 自动升级文档版本
* 快捷键搜索文档及 API
* 管理和搜索 Code Snippets
* 无缝插入众多第三方应用（Alfred，XCode，Terminal，Eclipse，甚至任意的 App）

![Dash Feature](http://a116.phobos.apple.com/us/r1000/079/Purple/v4/ec/c8/d0/ecc8d047-84b0-9202-068b-91082f489f68/mzl.mztawrpk.800x500-75.jpg)

## 功能介绍

这块已经有人介绍了，我就不多说了：[Dash：程序员的的好帮手](http://scriptfans.iteye.com/blog/1543219)


## 生成自己的文档

Dash 本身只支持 docsets 格式的文档，也就是由 [appledoc](http://gentlebytes.com/appledoc/) 生成的。默认是让 XCode 的 Organizer 管理文档，但是针对这个庞然大物，只是做文档的管理和快速搜索有消受不起。因此 Dash 才诞生出来的。

其实本篇日志主要是讲这块的内容，从上面的特性上面我也说到 Dash 支持生成任何的文档，因为它支持的文档类型涵盖了目前绝大多数的文档格式，针对这块官方已经写了[如何转换的说明](http://kapeli.com/docsets)，这里简单说明下：

语言|转换工具    
---|-----      
Objective-C 文档|[appledoc](http://gentlebytes.com/appledoc-docs-examples-basic/)
Python, Sphinx, pydoctor|[doc2dash](http://pypi.python.org/pypi/doc2dash/)
Javadoc|[java.docset](http://kapeli.com/JavaDocset.zip)
RDoc|使用 Dash 自身的 "Ruby Installed Gems"
Scaladoc|[mkscaldocset](https://bitbucket.org/inkytonik/mkscaladocset)
Doxygen(源码)|修改参数生成
docsetutil|需要创建指定目录结构
SQLite|官方支持数据库索引，需要创建指定目录结构


### 生成 Flask 文档

因为最近在学习 Flask，过年回家家里没有网络，因为我需要可以查询它的文档，虽然官方提供了 html 和 pdf 格式，但是没有办法快速搜索 API，没法发挥 Dash 的优势嘛，对吧！

Flask 官方提供的 html 文档是 Sphinx 格式的，首先把[文档](http://flask.pocoo.org/docs/flask-docs.zip)下载到本地，并安装好 doc2dash，另外备好一个 [flask icon](https://bitbucket-assetroot.s3.amazonaws.com/c/photos/2011/Sep/30/flask-logo-2523728525-3_avatar.png)。

```
$ pip install doc2dash
```

因为 Dash 可以让每个文档都有自己的 Icon，否则默认只是 docset 的 Icon，下载完毕之后，执行代码：

```
$ doc2dash --name Flask --icon flask-logo.png --add-to-dash /path/to/flask-docs
```

其中 `--add-to-dash` 是生成完毕后自动添加到 Dash，默认生成好的 docset 文件在当前目录。

好了，Dash 已经可以索引到所有的 Flask API 了，真是太 TMD 的酷了！

## 维护你的文档

如果你希望把自己生成的文档分享出来，并提供后期的维护升级，你可以提供一个 feed 保持文档的自动更新，这里有[一个关于 NodeJS 的例子](http://kapeli.com/feeds/NodeJS.xml)。

* 你可以提供多个 url 多备份提供文档下载
* 支持 tgz 格式的打包
