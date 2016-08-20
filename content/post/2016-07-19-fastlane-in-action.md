---
title: "深入浅出 Fastlane 一看你就懂"
tags:
  - iOS
  - Android
  - CI
  - CD
  - Ruby
  - Fastlane
categories:
  - Technology
slug: "fastlane-in-action"
date: "2016-07-19T20:12:07+08:00"

---

这是《 [Fastlane - iOS 和 Android 的自动化构建工具](https://icyleaf.com/2016/07/intro-fastlane-automation-for-ios-and-android/)》系列的第二篇。

本篇我想着重介绍 `fastlane` 本身的基本使用，这里使用 fastlane v1.98.0 作为演示版本。

### 系列索引

1. [Fastlane - iOS 和 Android 的自动化构建工具](https://icyleaf.com/2016/07/intro-fastlane-automation-for-ios-and-android/)
2. [深入浅出 Fastlane 一看你就懂](https://icyleaf.com/2016/07/fastlane-in-action/)


## 命令行工具

安装之后默认会安装一个命令行工具 `fastlane`，利用它可以初始化、执行任务、查看任务定义、查看可用的动作和动作的详细定义，甚至可以用它来创建自定义的动作、插件以及一些辅助功能。想了解的话可以先看看它的帮助：

```bash
$ fastlane --help

  fastlane

  CLI for 'fastlane' - The easiest way to automate building and releasing your iOS and Android apps

        Run using `fastlane [platform] [lane_name]`
        To pass values to the lanes use `fastlane [platform] [lane_name] key:value key2:value2`

  Commands:
    action                  Shows more information for a specific command
    actions                 Lists all available fastlane actions
    add_plugin              Add a new plugin to your fastlane setup
    disable_crash_reporting Deprecated: fastlane doesn't use a crash reporter any more
    docs                    Generate a markdown based documentation based on the Fastfile
    enable_auto_complete    Enable tab auto completion
    enable_crash_reporting  Deprecated: fastlane doesn't use a crash reporter any more
    help                    Display global or [command] help documentation
    init                    Helps you with your initial fastlane setup
    install_plugins         Install all plugins for this project
    lanes                   Lists all available lanes and shows their description
    list                    Lists all available lanes without description
    new_action              Create a new custom action for fastlane.
    new_plugin              Create a new plugin that can be used with fastlane
    run                     Run a fastlane one-off action without a full lane
    search_plugins          Search for plugins, search query is optional
    trigger                 Run a sepcific lane. Pass the lane name and optionally the platform first.
    update_plugins          Update all plugin dependencies

  Global Options:
    --verbose
    -h, --help           Display help documentation
    -v, --version        Display version information

  Author:
    Felix Krause <fastlane@krausefx.com>

  Website:
    https://fastlane.tools

  GitHub:
    https://github.com/fastlane/fastlane
```

我会随着下面每个概念的解释和展开来配合上面的命令一起讲解。

## 生命周期

执行顺序 | 方法名 | 说明
---|---|---
1 | before_all | 在执行 lane 之前只执行一次
2 | before_each | 每次执行 lane 之前都会执行一次
3 | lane | 自定义的任务
4 | after_each | 每次执行 lane 之后都会执行一次
5 | after_all | 在执行 lane 成功结束之后执行一次
6 | error  | 在执行上述情况任意环境报错都会中止并执行一次

以上的部分大家在上一篇已经见识过了，有些还没接触到，不用着急都会一一说明。

## 任务（lane）

正常情况下你可能只会是用到一种任务方法 `lane` 但其实它会包含很多中高级用法。在文章的末尾会详细描述。

### 任务定义

定义任务的方法类似于 rake 的 task，但使用上缺比前者要好用很多，见下表：

定义 | 是否必须 | 说明 | 备注
---|---|---|---
desc | `false` | 方法描述 | 可多次使用打到换行的目的
name | `true` | 方法名 | 符号化的方法名
options | `false` | 方法参数 | 返回 Hash 类型
task | `true` | 方法主体 | 参考 ruby 的方法代码且支持 ruby 代码


```ruby
desc '定义一个 build 方法'
desc '参数 adhoc 判断是否为内测版本, 默认为 false'
desc 'fastlane build'
desc 'fastlane build adhoc:true'
lane :build do |options|
  # task to do something
  adhoc = options[:adhoc] || false
  puts "adhoc: #{adhoc}"

  gym(type: adhoc ? 'adhoc' : 'appstore')
end
```

### 任务执行

一般情况下它需要配合定义好的 lane 才能使用，刚刚我们定义的一个 build 方法，我们这里就试着执行一下吧。

```bash
# 默认执行
$ fastlane build
# 传递参数
$ fastlane build adhoc:true
```

### 任务互调

`lane` 其实可以理解为 `def` 的别名，因此多个 lane 的话实际上是可以相互调用的，这个其实特别实用，这样其实我就可以把 cocoapods 的执行放到单独的 lane 里面而不是 `before_all`，这样执行非构建的任务就不会执行不相关的任务或动作，因此 fastlane 而产生了一个私有任务用内部使用 `private_lane`

```ruby

default_platform :ios

platform :ios do
  desc '构建前的准备工作'
  desc '这是一个私有任务，仅供 Fastfile 内部 lane 调用使用'
  lane :prepare do
    cocoapods
    match
  end

  desc '通用的构建任务'
  desc 'fastlane build'
  desc 'fastlane build type:adhoc'
  lane :build do |options|
    # 调用上面 prepare 私有任务
    prepare

    case options[:type]
    when 'adhoc'
      # 调用 下面 adhoc 任务
      adhoc
    else
      # 调用下面 appstore 任务
      appstore
    end
  end

  desc '构建 adhoc 任务'
  desc 'fastlane adhoc'
  lane :adhoc do
    gym(type: 'adhoc')
  end

  desc '构建 appstore 任务'
  desc 'fastlane appstore'
  lane :appstore do
    gym(type: 'appstore')
  end
end
```

上面的任务中，`build`/`adhoc`/`appstore` 都可以执行，只有 `prepare` 是无法通过命令行外部执行，如果执行会直接报错：

```bash
$ fastlane prepare
[19:17:42]: You can't call the private lane 'prepare' directly
```

### 任务返回值

和 ruby 的方法一致，每个 lane 最后一行会默认作为返回值（无需 [return](http://learnrubythehardway.org/book/ex21.html)）。

```ruby

lane :sum do |options|
  options[:a] + optiona[:b]
end

lane :calculate do
  value = sum(a: 3, b: 5)
  puts value #=> 8
end
```

### 引入外部任务文件

`Fastfile` 除了自身以外还能够引入外部其他的 `Fastfile` 并调用任务，只需要导入外部文件并使用特殊的方法标识即可：


#### 1. import - 导入本地文件

```ruby
# 导入 lanes 目录的 AndroidFastfile
import "lanes/AndroidFastfile"
```

#### 2. import_from_git - 导入 git 仓库文件

可以直接引入 git 仓库的 Fastfile 文件是一个非常赞的功能，通过使用发现其实现原理是先把 git 仓库克隆下来后在引入相对于的文件，因此建议国内在没有网络加速（翻墙）的情况下尽量不用引入比较大的 git 仓库，否则使用会需要漫长的等待...

```ruby
# 导入 mozilla/firefox-ios 项目下 fastlane 下面 Fastfile 文件
import_from_git(url: 'https://github.com/mozilla/firefox-ios')
# 或者
import_from_git(url: 'git@github.com:mozilla/firefox-ios.git',
               path: 'fastlane/Fastfile')
```

假若外部引入的 `Fastfile` 有个方法是 **build**，在命令行工具直接执行即可，如果外部和内部都有相同的任务名，执行会直接报错：

```bash
$ fastlane ios build

[!] Lane 'gradle' was defined multiple times!
```

如果发生这样的事情且你希望在主体 `Fastfile` 也调用的话需要使用特殊的方法定义：`override_lane`

> 注意：此方法只会覆盖外部的相同方法名的代码执行，目前暂时无法使用类似 ruby 的 `super` 继承原由方法！

```ruby
override_lane :build do
  ...
end
```

### 任务查看

只需执行下面这行命令就可以看到非私有任务的可用列表信息

```bash
$ fastlane lanes

--------- ios---------
----- fastlane ios build
通用的构建任务
fastlane build
fastlane build type:adhoc

----- fastlane ios adhoc
构建 adhoc 任务

----- fastlane ios appstore
构建 appstore 任务

Execute using `fastlane [lane_name]`
```

## 扩展（Action）

扩展是 fastlane 的杀手锏，重在集成了众多非常优秀好用的方法供 lane 内部使用，截至 fastlane v`1.98.0` 版本以包含 175 个扩展，这个数量还在陆续增加中。扩展初期是由发起人一个人完成，后续的大部分都是社区共享，如果你发现没有你想要的扩展，可以先去 [issues](https://github.com/fastlane/fastlane/issues?q=is%3Aopen+is%3Aissue+label%3Aaction) 搜索下没有要么自己动手提交要么只有等待了.

### 扩展列表

```bash
$ fastlane actions
+--------------------+-------------------------------------------------------------+------------------+
|                                   Available fastlane actions                                        |
+--------------------+-------------------------------------------------------------+------------------+
| Action             | Description                                                 | Author           |
+--------------------+-------------------------------------------------------------+------------------+
| adb                | Run ADB Actions                                             | hjanuschka       |
| adb_devices        | Get an Array of Connected android device serials            | hjanuschka       |
| add_git_tag        | This will add an annotated git tag to the current branch    | Multiple         |
...
+--------------------+-------------------------------------------------------------+------------------+
  Total of 175 actions

Get more information for one specific action using `fastlane action [name]`
```

### 扩展使用帮助

```bash
# 查看 adb 扩展的使用帮助
$ fastlane action adb
Loading documentation for adb:

+---------------------------------+
|               adb               |
+---------------------------------+
| Run ADB Actions                 |
|                                 |
| see adb --help for more details |
|                                 |
| Created by hjanuschka           |
+---------------------------------+

+----------+----------------------------------------------------------------------+-------------------+---------+
|                                                  adb Options                                                  |
+----------+----------------------------------------------------------------------+-------------------+---------+
| Key      | Description                                                          | Env Var           | Default |
+----------+----------------------------------------------------------------------+-------------------+---------+
| serial   | Android serial, which device should be used for this command         | FL_ANDROID_SERIAL |         |
| command  | All commands you want to pass to the adb command, e.g. `kill-server` | FL_ADB_COMMAND    |         |
| adb_path | The path to your `adb` binary                                        | FL_ADB_PATH       | adb     |
+----------+----------------------------------------------------------------------+-------------------+---------+

+-------------------------------+
|       adb Return Value        |
+-------------------------------+
| The output of the adb command |
+-------------------------------+

More information can be found on https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Actions.md
```

### 创建自定义扩展

通过内置的命令创建你需要的扩展，扩展名必须是全部小写且只能使用下划线分割词组，生成好的扩展文件会在 `fastlane/actions` 目录找到:

```bash
$ fastlane new_action
Must be lower case, and use a '_' between words. Do not use '.'
examples: 'testflight', 'upload_to_s3'
Name of your action: hello
[15:33:15]: Created new action file './fastlane/actions/hello.rb'. Edit it to implement your custom action.
```

这块会占比较大的篇幅，尽情期待后续的展开。

### 引入外部扩展

这块其实也有两种方法可以引入，文件引入是官方教程提供的方法，第二种是我个人尝试出来的，第三种是最近版本才官方支持的。

#### 1. 本地文件引入

自定义的扩展其实也算是本地文件引入的一种形式，当然位于其他路径的通过指定方法也能做到

```ruby
# 引入项目根目录 script/share_actions 路径
actions_path '../script/share_actions'
```

#### 2. rubygem 引入

> 不再建议使用本方法，请看第三种插件引入。

我在团队内部创建了一个自定义的扩展，仅限于团队内部使用而无法贡献社区，我只能采取封装成 ruby gem 包，通过 ruby 的 `require` 方式引入，最终可以完美支持，目前已在项目中使用大半年之久。最重要的是我是开源的：[fastlane-qyer](https://github.com/icyleaf/fastlane-qyer)

```ruby
# 首先安装需要的 rubygem: gem install fastlane-qyer
require 'fastlane-qyer'

lane :upload do
  qyer(api_key: '[token]')
end
```

注意，使用 rubygem 引入的无法在 fastlane actions 中显示出来，也无法使用 fastlane action [name] 查看使用帮助。我猜想一是官方没有这样提供思路，二是就算你引入了 gem 也不是特别好判断里面的文件结构。

#### 3. 插件引入

我注意到 [1.93.0](https://github.com/fastlane/fastlane/releases/tag/1.93.0) 增加了插件机制，很好的解决第二种出现的一些问题。大概看了一下主要是采用 `Gemfile` 的方式使用 `Pluginfile` 维护了引入第三方插件列表。实现原理还是属于第二种方法。

通过 `fastlane search_plugins` 查看当前支持的插件，并使用 `fastlane add_plugins [name]` 引入。

```bash
$ fastlane search_plugins
[16:04:33]: Listing all available fastlane plugins

+--------------------------+---------------------------------------------------+-----------+
|                                Available fastlane plugins                                |
+--------------------------+---------------------------------------------------+-----------+
| Name                     | Description                                       | Downloads |
+--------------------------+---------------------------------------------------+-----------+
| ruby                     | Useful fastlane actions for Ruby projects         | 782       |
| versioning               | Allows to work set/get app version directly       | 758       |
|                          | to/from Info.plist                                |           |
| branding                 | Add some branding to your fastlane output         | 716       |
| instrumented_tests       | New action to run instrumented tests for android. | 590       |
|                          | This basically creates and boots an emulator      |           |
|                          | before running an gradle commands so that you can |           |
|                          | run instrumented tests against that emulator.     |           |
|                          | After the gradle command is executed, the avd     |           |
|                          | gets shut down and deleted. This is really        |           |
|                          | helpful on CI services, keeping them clean and    |           |
|                          | always having a fresh avd for testing.            |           |
| xamarin_build            | Build xamarin android\ios projects                | 582       |
| appicon                  | Generate required icon sizes and iconset from a   | 509       |
|                          | master application icon.                          |           |
...
| download_file            | This action downloads a file from an HTTP/HTTPS   | 171       |
|                          | url (e.g. ZIP file) and puts it in a destination  |           |
|                          | path                                              |           |
+--------------------------+---------------------------------------------------+-----------+

# 添加 sentry 插件
$ fastlane add_plugin sentry
[16:16:23]: Plugin 'fastlane-plugin-sentry' was added to './fastlane/Pluginfile'
[16:16:23]: It looks like fastlane plugins are not yet set up for this project.
[16:16:23]: fastlane will create a new Gemfile at path 'Gemfile'
[16:16:23]: This change is neccessary for fastlane plugins to work
Should fastlane modify the Gemfile at path 'Gemfile' for you? (y/n)
y
[16:16:29]: Successfully modified 'Gemfile'
[16:16:29]: Make sure to commit your Gemfile, Gemfile.lock and Pluginfile to version control
Installing plugin dependencies...
Successfully installed plugins

$ cat fastlane/Pluginfile
# Autogenerated by fastlane
#
# Ensure this file is checked in to source control!

gem 'fastlane-plugin-sentry'
```

更详细的继续期待后续报道，我要挖坑无数。

### 扩展的命令行调用

社区的力量果然是很强大的，陆续添加了那么多功能，早期用户表示不开心！嗯，由于社区的呼声和贡献目前可以通过命令调用扩展：

```bash
# 使用 notification 扩展发送一个通知消息
$ fastlane run notification message:"Hi macOS" title:"Fastlane Notification"
[15:58:05]: --------------------------
[15:58:05]: --- Step: notification ---
[15:58:05]: --------------------------
[15:58:05]: Result: true
```

## 辅助功能

### 自动更新

fastlane 提供一个方法 `update_fastlane` 用于对于自身的版本检查和更新，这个第一篇文章我也有提到过。它其实一个是一个扩展，使用 `fastlane action update_fastlane` 能够看到使用帮助。它有一个参数是可以指定检查特定的 fastlane 工具并进行更新，但其实它是使用 rubygems 进行对 gem 的更新，因此这块其实可以传入任何需要检查并更新的 gem：

```ruby
update_fastlane(tools:'fastlane,gym,match,cocoapods,rest-client')
```

### 环境变量

从 fastlane 的设计体系上在各个地方都加入了环境变量的支持，每个扩展的参数、以及扩展需要共享给其他扩展和任务读取的数据都是通过环境变量获取，如下是我收集的比较常用的列表：

环境变量 | 来源 | 说明 | 备注
---|---|---|---
FASTLANE_USER | credentials_manager |  Apple 开发者账户名 | 验证通过后会保存 Keychain
FASTLANE_PASSWORD | credentials_manager | Apple 开发者账户密码 | 验证通过后会保存 Keychain
FASTLANE_TEAM_ID<br />CERT_TEAM_ID | produce<br />sigh | Apple 团队 ID |
DELIVER_USER<br \>PRODUCE_USERNAME | deliver<br />produce | iTunesConnect 账户名 |
DELIVER_PASSWORD | deliver | iTunesConnect 账户密码
MATCH_PASSWORD | match | 证书加/解密密码 |
FASTLANE_XCODE_LIST_TIMEOUT | fastlane_core | 获取 iOS Scheme 的超时时间 | 默认 10s



