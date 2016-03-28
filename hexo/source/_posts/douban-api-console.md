title: 豆瓣API测试控制台
date: 2009-07-06 12:34:56
category: Technology
tags:
- PHP
- 豆瓣
permalink: douban-api-console

---

> 项目已开源: http://github.com/icyleaf/modou

豆瓣 API 测试控制台的创造灵感来源于 Facebook Developers Tools 中的[Facebook API Console][]， 或许大家知道，魔豆是我的另外一个豆瓣 API 应用，由于是自己封装的 Douban
API（官方提供的库类要求太多，安装繁琐，这不属于我喜爱简洁，轻便的风格），每次想查看某个
API 接口返回的数据都要写一个 test 跑一下。麻烦不说，还容易出错，于是，使用自己封装的 Douban API，借鉴 Facebook API Console
的界面和类似的功能显示，终于小有所成，其中为了实现此控制台，封包的库类经过两次大改，虽然改的很辛苦，但从中学到了很多开发经验。

测试用户必须先进行用户验证才能进行测试，这主要是为了：

1.  避免提交查询中出现错误，并让测试者使用到全部API方法
2.  防止恶意用户利用它做二次api调用，由于测试控制台的传输很简单，提交参数即可查询。

查询方法：

1.  进行用户的登录验证
2.  选择返回的数据类型（支持官方提供的 XML 和 JSON格式）
3.  选择需要查询的API方法（这里我做了分类）
4.  如果查询的方法存在参数，会在方法下面显示。
5.  设置完毕参数后，点击“调用此方法”，稍等片刻即可。

返回的数据结果会在右侧显示出来，其中，右上部分是调用相关 API 的 URL 地址；右下部分是返回的数据结果。

如果，参数设置错误，或者其他问题，返回的结果会以 [CODE] Content
的格式返回，其中 **CODE**代码返回的状态码，**Content** 是返回的信息。

通用参数解释：

-   id  - 查询方法涉及到的 id 值（人，书影音，日记，广播，豆邮，同城等）
-   message - 广播发送的内容
-   title - 日记，豆邮的标题
-   content - 主题内容
-   city - 同城活动的城市代号（根据我判断，应该是中文的拼音，详细请看[官方同城列表][]中各个城市的url）
-   query - 搜索的关键字
-   index - 返回多个元素时，起始元素的下标（相当于豆瓣 api 文档中的start-index）
-   max - 返回多个entry时，每页最多的结果数（相当于豆瓣 api 文档中的max-results）

其中某些方法（涉及到自身的数据，比如我的信息，我的广播，我的同城）在进行查询的时候可以把
id 留空或者设置为 ‘me’ （不带引号），这样调用结果显示的是自己的信息。

如果长时间(大于1分钟)处于“调用中”，可能是由于程序问题，请刷新后重试。

已知存在的问题：

1.  界面和方法列表在 Chrome 浏览器有不兼容的问题出现
2.  返回数据结果头一行多出一个类似水平制表符的转义符似的

由于目前为止豆瓣 API 还没有封装完成，现只提供用户，广播，书影音，豆邮和日记的不完全功能测试查询。
其余的 API 会尽快添加进去 :)

测试地址：[http://ews.im/douban\_console][]

  [Facebook API Console]: http://developers.facebook.com/tools.php
  [官方同城列表]: http://www.douban.com/location/world/
  [http://ews.im/douban\_console]: http://ews.im/douban_console
