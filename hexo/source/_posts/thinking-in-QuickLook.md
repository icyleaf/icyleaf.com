title: QuickLook 感悟
date: 2012-04-30 12:34:56
category: Technology
tags:
- XCode
- QuickLook
- Github
permalink: thinking-in-QuickLook

---

前段时间对 OS X 系统的 [QuickLook](http://en.wikipedia.org/wiki/Quick_Look) 非常感兴趣，能够随着开发者的定制，针对不同的文件呈现符合用户需求的预览功能，然后认为它属于是万能的。随后可以琢磨利用它做些意思的事情。

# 范例

为了大家对它有个直接的认识，我这里找了几个范例，看到图大家就非常明白了！

默认系统很对 QuickTime 兼容格式的可以实现视频预览播放，如果安装了最新的 MPlayerX，同样也支持大多数格式（目前还不支持 mkv）
![video quicklook](https://developer.apple.com/library/mac/documentation/UserExperience/Conceptual/Quicklook_Programming_Guide/Art/preview_example2.jpg)

# 预热

Xcode 已经内置了 QuickLook 的插件模块，一边阅读[官方文档](https://developer.apple.com/library/mac/#documentation/UserExperience/Conceptual/Quicklook_Programming_Guide/Introduction/Introduction.html)，一边在 Github 上面搜索相关的[开源项目](https://github.com/search?q=QuickLook&type=Repositories)。

QuickLook 是通过 [UTIs](https://developer.apple.com/library/mac/#documentation/FileManagement/Conceptual/understanding_utis/understand_utis_conc/understand_utis_conc.html#//apple_ref/doc/uid/TP40001319-CH202-CHDHIJDE) 的资源类型来对文件进行预览。

# 有意思的事情

不知从何开始，硬盘收集的电影越来越多，有时候也从朋友那边资源交换来了不少。其实这里有一个很大的问题，交换过来的资源并不一定符合每个人的口味，但面对一个个电影名字的众多视频而且可能还没有仔细的分类（包括我也是没有归类），其实在选择看哪个的时候有些头胀。之前也整理了一些 [pngcrush](http://icyleaf.com/2012/03/pngcrush-usage-with-ios-apps/) 的资源。脑门一亮，在想能不能利用 QuickLook 去*准确显示*电影的信息。

电影的信息来源不用愁，利用 [豆瓣相关 API](http://www.douban.com/service/apidoc/reference/subject) 可以搜索到电影的信息，但是这里还有几点难题：

1. 视频文件的文件名是否好提取关键字（视频文件根据每个来源提供者，视频工作室，个人的维护不同导致很难）
2. 豆瓣 API 接口是否给力（根据 1 是否能够准确搜索到正确的结果呢）

针对于上面的问题，第一我想测试下豆瓣 API 是否给力，于是找了几种不同方式的视频文件名进行测试，记过尚可，但是搜索结果一般都是多条，其结果显示可能会存在偏差（主要是存在于电脑重名），当然这样也无法避免。这里我想郑重的表扬 IMDB 的策略，[IMDB API](http://www.imdbapi.com/) 可以按照关键字和 imdb id 去搜索（豆瓣也满足），让我表扬的地方在于，它返回的结果永远只有一条，我曾测试利用不同语种（大语种，小语种不行）的名字去尝试搜索几乎 98% 的命中率， 而且在搜索的基础上，又提供一个 year 的参数。

 > 这会 IMDB API 服务器总是 503 状态，哎...

基于种种的问题，我最终采用了在文件添加 imdb id 的方式以保证完美的命中率！（虽然前期准备工作可能辛苦点 >..<）


# 干活！

说干就干，在通读了文档和一些开源代码之后，就准备练手。如果大家同样开始跟我新建工程编写代码的时候就会发现一个很坑爹的事情，官方的文档根本没有更新！用的还是 Xcode 3 做的指导。问题在于 3 升级到 4 之后，很多东西都已经改的面目全非。对于熟悉 3 的开发者就不必担心了。

QuickLook 官方文档的前面内容都没有问题，主要是后面有个 Debug 和 Test 的章节，在 4 里面有了一些大的变化，比如需要把 `.qlgenerator` 文件复制到 `/Library/QuickLook` 或 `~/Library/QuickLook` 目录下面，然后通过外部命令 `qlmanage` 去做代码的实现预览。

 > 如果发现没有更新，尝试 `qlmanage -r` 更新一下

在 Xcode 4 是如下解决：

1. 复制 `.qlgenerator` 文件到对应的目录下面

在工程项目的 `Build Phases` 找到 `Add BuildPhase` 并选择 `Add Copy Files`，在选项设置 `Destination` 选择 `Absolute Path`，在 `Subpath` 填入 `~/Library/QuickLook`，最后在下面的列表添加项目的 `.qlgenerator` 文件

2. 执行外部命令

在工程中按快捷键 `Command + Shift + ,`，打开 Scheme， 在 `Run` 的 `Info` 更换 `Executable`，在 `/usr/bin` 找到 `qlmanage` 文件。再更换到 `Arguments` 里面添加参数格式：

 > -p /your/path/to/quicklook/file

比如，我要预览的是 `/Users/icyleaf/sample.mkv` 文件:

 > -p /Users/icyleaf/sample.mkv


# 备受打击

当一切都紧锣密鼓的完成下去的时候，遇到一个无法解决的问题，就是在使用 HTTP 请求的时候，总是返回 "*Operation not permitted*" 的错误，最后没有办法开始 Google 求助，然后发现了[一个很残酷的现实](http://web.archiveorange.com/archive/v/SEb6aPoIYeg2zfU4v9Ee)。于是我有仔细的看了看官方文档，翻到了彻底让我失败的证据！

 > *Important* For security reasons, you cannot use Web Kit plug-ins in HTML passed back to Quick Look (so you cannot, for example, use Java applets or Flash animations).

当前我以为只是不能使用 Webkit 嵌套 HTML，但是看到很多例子（比如预览 Markdown，JSON，.strings 文件）都是通过 WebKit 达到预览格式化后的 HTML 实现的。我还特别高兴的认为官方文档净吓唬我...

原来官方是出于安全考虑，把所有应用放在一个安全的 sandbox 里面，任何有威胁可能的安全问题一律扼杀掉，最终导致我的想法难产了 T_______T

BTW，假如你的 QuickLook 也需要使用到 Webkit，默认调试报 "WebKit Threading Violation - initial use of WebKit from a secondary thread." 错误，系统不运行从其他线程访问资源，因此在 Info.plist 把 `QLNeedsToBeRunInMainThread` 设置为 `YES` 即可。

# 漏网之鱼?

为什么这么讲呢，因为我看到 QuickLook 可以利用第三方的命令甚至是脚本去实现一些功能:

* [qlmarkdownpython](https://github.com/davea/qlmarkdownpython) - 利用 py 脚本 + Python framework 实现 markdown 的格式化
* [QuickJSON](https://github.com/johan/QuickJSON) - 利用 node 脚本实现 JSON 的友好化显示

假如可以利用外部的脚本及命令的话，那是不是可以利用他们完成网络的访问及后续的格式化工作，QuickLook 只是做统一的输出？

To be contiue...
