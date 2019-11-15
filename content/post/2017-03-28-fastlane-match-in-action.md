---
title: "你虐我千百遍，我待你如初恋，直到我遇到 match"
slug: fastlane-match-in-action
tags:
  - iOS
  - Android
  - CI
  - CD
  - Ruby
  - Fastlane
  - match
category: Technology
date: '2017-03-28T20:12:07+08:00'
image: https://github.com/fastlane/fastlane/raw/master/match/assets/match.png
share: true
comments: true
---


## 系列目录

1. [Fastlane - iOS 和 Android 的自动化构建工具](https://icyleaf.com/2016/07/intro-fastlane-automation-for-ios-and-android/)
2. [深入浅出 Fastlane 一看你就懂](http://icyleaf.com/2016/07/fastlane-in-action/)
3. [你虐我千百遍，我待你如初恋，直到我遇到 match](https://icyleaf.com/2017/03/fastlane-match-in-action/)

## 前言

通过前两篇的文章大家已经对 fastlane 的概念和基本使用已经有了初步的掌握，在第二篇中也有提到 fastlane 实现的各种功能其实都是基于独立封装设计的各个工具实现。它们即可以单独成为一个体系同时也会被吸纳到 fastlane 的 action 系统之中。`match` 是在 iOS 开发和持续测试和构建中最重中之重的环节，它维护和管理着 iOS 的各种证书和 profile 的创建、更新工作。想必很多用户听到 iOS 证书和 profile 都会头大脑涨，恨不得要手撕鬼子的技能点来对付他们（如图）

![code-signing-problem](https://codesigning.guide/assets/img/cs-the-problem.png)

上图来源于作者专门整理的网站 https://codesigning.guide/，对于 iOS App 签名原理感兴趣的可以参见 JSPatch 作者的分析：http://blog.cnbang.net/tech/3386/

## 功能特性

1. 主动/被动创建、更新、Xcode 所需的各种证书和打包所需的 Profiles
2. 托管 Xcode 所需的各种证书和打包所需的 Profiles
3. 统一并共享团队成员统一使用
4. 证书具有密码加密保护（openssl）
5. 支持多团队（账户）
6. 支持单 App 多 Target(identifier)
7. 内测支持企业账户（v0.11.0 还在测试可用，并没有正式支持）

## 原理

match 其实是在 fastlane 基础包 cert、sign、spaceship、credentials_manager 之上把 iOS 开发者证书流程化的工具。为了实现团队内共享项目的开发者证书，它使用 git 仓库对证书进行托管，首先需要进行初始化，配置 git 仓库、项目的 iDP 信息之后，下载 Development、AppStore、AdHoc 的开发者证书和项目的 Profile files，并通过 openssl 的方式进行安全加密后提交并推送到 git 仓库，其他成员（或自动化构建系统）使用时需要输入密钥后才能把证书解密并导入到 keychain 和 Profiles 目录。

如果对于证书加密策略感兴趣的可以在本文底部资料参考的第一个链接查看详情。

## 使用

> 最新 fastlane 已经包含了所有的子模块，独立的 match 不在更新，请直接安装 fastlane，使用 fastlane match 代替 match 命令。

安装就很简单通过 `gem install fastlane` 会把它的全家桶一并下载安装，首先可以看下帮助：

```bash
$ fastlane match --help

  match

  Easily sync your certificates and profiles across your team using git

  Commands:
    adhoc             Run match for a adhoc provisioning profile
    appstore          Run match for a appstore provisioning profile
    change_password   Re-encrypt all files with a different password
    decrypt           Decrypts the repository and keeps it on the filesystem
    development       Run match for a development provisioning profile
    help              Display global or [command] help documentation
    init              Create the Matchfile for you
    nuke              Delete all certificates and provisioning profiles from the Apple Dev Portal
    nuke development  Delete all certificates and provisioning profiles from the Apple Dev Portal of the type development
    nuke distribution Delete all certificates and provisioning profiles from the Apple Dev Portal of the type distribution
    run               Easily sync your certificates and profiles across your team using git

  Global Options:
    --verbose
    -r, --git_url STRING URL to the git repo containing all the certificates (MATCH_GIT_URL)
    --git_branch STRING  Specific git branch to use (MATCH_GIT_BRANCH)
    -y, --type STRING    Create a development certificate instead of a distribution one (MATCH_TYPE)
    -a, --app_identifier [VALUE] The bundle identifier(s) of your app (comma-separated) (MATCH_APP_IDENTIFIER)
    -u, --username STRING Your Apple ID Username (MATCH_USERNAME)
    -s, --keychain_name STRING Keychain the items should be imported to (MATCH_KEYCHAIN_NAME)
    -p, --keychain_password STRING This might be required the first time you access certificates on a new mac. For the login/default keychain this is your account password (MATCH_KEYCHAIN_PASSWORD)
    --readonly [VALUE]   Only fetch existing certificates and profiles, don't generate new ones (MATCH_READONLY)
    -b, --team_id STRING The ID of your Developer Portal team if you're in multiple teams (FASTLANE_TEAM_ID)
    -l, --team_name STRING The name of your Developer Portal team if you're in multiple teams (FASTLANE_TEAM_NAME)
    --verbose [VALUE]    Print out extra information and all commands (MATCH_VERBOSE)
    --force [VALUE]      Renew the provisioning profiles every time you run match (MATCH_FORCE)
    --skip_confirmation [VALUE] Disables confirmation prompts during nuke, answering them with yes (MATCH_SKIP_CONFIRMATION)
    --shallow_clone [VALUE] Make a shallow clone of the repository (truncate the history to 1 revision) (MATCH_SHALLOW_CLONE)
    --force_for_new_devices [VALUE] Renew the provisioning profiles if the device count on the developer portal has changed (MATCH_FORCE_FOR_NEW_DEVICES)
    --skip_docs [VALUE]  Skip generation of a README.md for the created git repository (MATCH_SKIP_DOCS)
    -h, --help           Display help documentation
    -v, --version        Display version information
```

建议大家在项目中创建并配置 `fastlane/Matchfile` 文件可以把命令需要的参数省略：

```bash
$ fastlane match init
```

设置好 git_url(git 仓库地址）、type（默认同步证书类型）、app_identifier、username（iDP 的账户名）即可。

## 生成和同步证书

```bash
# 开发环境证书
$ fastlane match development
# 产品环境证书
$ fastlane match appstore
# 内测环境证书
$ fastlane match adhoc
```

初次使用的时候会提示需要输入 iDP 的账户密码，校验成功后可以保存到 keychain 中后续可以不在重复输入（好贴心）密码（也可通过设置变量 FASTLANE_PASSWORD），该密码就是上面提到的证书加密的密钥，请妥善保存。

> 提示：如果担心密码泄露可设置 FASTLANE_DONT_STORE_PASSWORD = true 不进行密码保存至 keychain，在 keychain 可通过关键词 "deliver." 检索。

有的童鞋说我们有 299 的企业证书，为什么不做支持呢？起初作者并没有打算进行支持是担心滥用以及代码结构需要较大的变更，随着开发者呼声太高，其实还是做了支持，只不过并没有正式的纳入，需要通过配置环境变量支持：

```bash
# 企业环境证书
$ ENV['MATCH_FORCE_ENTERPRISE'] = '1' && fastlane match enterprise
```

## 修改密钥

建议密码定期更换或再人员发生变更之后进行密码变更：

```bash
$ fastlane match change_password
```

## 重新生成

**慎用**：match 提供一个命令允许把当前的证书撤销后并全新的重新生成一份，这个事项是会把证书和 Profiles 全部包含在内，如果单纯的想只重设 Profles 并同步是不支持的。我想这也是为什么该命名叫做 `nuke`

我这里可给大家提供一种只同步 profile 的方法：首先在 git 仓库中找到你要重设的 profile 文件，并把它从仓库中删除提交，然后在执行该类型的命令即可，命令发现没有 profile 会自动再生成一个 profile 并下载同步至 git 仓库。


## 资料参考

- http://macoscope.com/blog/simplify-your-life-with-fastlane-match/
- https://github.com/fastlane/fastlane/issues/2007
