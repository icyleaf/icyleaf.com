---
title: "Modules Library 和 DBManager Module"
date: "2009-03-05T12:34:56+08:00"
categories:
  - Technology
tags:
- Kohana
- PHP
slug: "modules-helper-and-dbmanager-module"

---

> Hi, Don't understand Chinese? ok, No problem. Here to view [Modules Library][] and [DBManager Module][]

或许大家可能有了解到，本人目前一直在对 [Kohana][]这个纯 PHP5
框架进行文档翻译和维护，同时也建立一个站点：[Kohana爱好者][]。
站点提供中文化的文档，包含中文语言包的中文镜像下载支持以及中文化论坛。Kohana 
凭借着基于 CodeIgniter
框架+PHP5，赢得了一群使用者，我也希望无论是国外的还是国内的使用者都能共享自己的力量。

恩...以上算是给自己打个广告。Modules Library 和 DBManager Module 均是为
Kohana 框架编写的，以后会根据自己和大家的寻求做适当的更新。

**Modules Library**，中文译为 扩展管理库，是一个方便管理 Kohana
系统自身扩展配置的库类，通过它使用代码就可以轻松实现获取当前所有 Modules
信息，已激活的 Moduels， 未激活的 Modules，最重要的是还可以添加
Modules，激活和关闭 Module。

范例代码：


```php
// Instance Module library
$module = Module::instance();

// list all modules of application in application/config/config.php
echo Kohana::debug($module->list_all());

// list active modules of application in application/config/config.php
echo Kohana::debug($module->list_active());

// list inactive modules of application in application/config/config.ph	p
echo Kohana::debug($module->list_inactive());

// active 'auth' module
$module->active('auth');

// inactive 'auth' module
$module->inactive('auth');

// add 'sample_module' module with description.
$module->add('sample_module', 'Just a sample module');
```

**DBManager Module**灵感来自 WordPress 插件 WP\_DBManager，就连名字都很类似，其实对于其功能也是按照它实现。哈哈～～

目前对于此扩展实现的功能如下：

- 获得当前 Mysql 版本以及 Kohana 连接数据库等信息
- 获取当前所有表数据
- 备份数据库（支持Gzip压缩和自动备份）
- 优化数据库（支持自动优化）
- 修复数据库
- 获得，下载，删除数据库备份文件

此扩展支持配置和 i18n，以及对目前来说一个简易的演示页面。

目前还没有对实现自动备份后进行 Email 通知的功能，以及以后会对多种数据库支持。和限制最大化数据库备份文件。至于是否可以在进行数据库表数据的操作（比如查询，删除表，修改表等）是否还需要支持？

以后对自己发布的 Kohana 相关的代码都会托管在 Google Code 上面，地址：[http://code.google.com/p/kohana-fans-cn/][]

  [Kohana]: http://kohanaphp.com
  [Kohana爱好者]: http://khnfans.cn/ "Kohana爱好者"
  [http://code.google.com/p/kohana-fans-cn/]: http://code.google.com/p/kohana-fans-cn/
  [Modules Library]: http://forum.kohanaphp.com/comments.php?DiscussionID=2117&page=1
  [DBManager Module]: http://forum.kohanaphp.com/comments.php?DiscussionID=2156&page=1
