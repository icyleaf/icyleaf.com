---
title: "极速化 CocoaPods"
date: "2015-01-20T12:34:56+08:00"
categories:
  - Technology
tags:
- CocoaPods
- iOS
slug: "speed-up-cocoapods"

---

[Cocopods](http://cocoapods.org/) 本身是一个优秀的 iOS 开发的包管理工具，涵盖了 7k+ 的开源组件，包管理库是托管在 Github。
众所周知的原因它的速度日渐缓慢，有时会频繁报如下错误：

```bash
$ pod install

Cloning into '/path/to/ios/project/Pods/xxx'

error: RPC failed; result=52, HTTP code = 0

fatal: The remote end hung up unexpectedly
```

本文主要为解决该问题而诞生的，以下的加速方案不局限于目前已流传的优化方案，而是在此基础上**彻底的加速**！

- 使用淘宝 Ruby Gems 源（Cocoapods 使用 ruby 开发）
- `pod install` 时不设置包的更新：[参考文章](http://phatblat.com/blog/2014/07/30/pod-install/)
- 使用国内 git 服务器镜像 Cocoapods Spec: [参考文章](http://blog.devtang.com/blog/2014/05/25/use-cocoapod-to-manage-ios-lib-dependency/)

如果你对 Cocoapods 有更深层次的理解，请参见：[objc.io: Cocoapods under the hood](http://www.objc.io/issue-6/cocoapods-under-the-hood.html) [中文版本](http://objccn.io/issue-6-4/)

今天早晨看到微博众多 iOS 开发者赞同转发《[CocoaPods最佳实践探讨](http://weibo.com/p/1001603800875490492754)》一文，
针对 `Pods` 建议纳入版本控制也是无奈之举。之前公司项目中也是这样施行很长一段时间，不排除更新可能会造成很多无用信息"刷屏"，
偶尔还会因为版本冲突造成一些混乱状况需要处理。个人还是更倾向于精简原则，遵循[官方的建议](http://guides.cocoapods.org/using/using-cocoapods.html#should-i-ignore-the-pods-directory-in-source-control)。

大家都是技术人员，其实这些小问题难道因为 github 倒下就没有解决方案了吗？！看我如何撕破这层纸老虎：

### 技术概述

- Cocopods v0.34.0+
- Gitlab: 自建私有 git 服务器
- gitlab-mirrors: 专用于 github 镜像至 gitlab 并保持定期更新
- rake: ruby 的代码构建工具（不懂 ruby 的可以把它理解为命令聚合工具）

### 技术剖析

Cocoapods 自身支持[私有仓库](http://guides.cocoapods.org/making/private-cocoapods.html)，
恰好的是就在前不久发布的 [0.34.0](https://github.com/CocoaPods/CocoaPods/blob/master/CHANGELOG.md#0340) 版本支持 `Podfile`
添加多个的包源仓库，举个例子：

```ruby
source 'https://github.com/artsy/Specs.git'
source 'https://github.com/CocoaPods/Specs.git'

pod 'AFNetworking'
pod 'Mantle'
```

这个特性其实是为了扩充官方 Spec 的同时可以更好的让开发者管理私有的公共组件，那我同样是从这里下手：

> 前提是自己以及搭建好 gitlab 服务器：[官方教程 （Ubuntu）](https://about.gitlab.com/downloads/) | [本人教程 （CentOS）](http://icyleaf.com/2013/09/how-to-install-gitlab-on-centos/)

#### 自力更生

首先我们需要创建一个自己的 Spec 仓库，目录结构如下：

```bash
.
├── CocoaPods-version.yml
├── Specs/
├── README.md
├── Rakefile
└── Gemfile
```

配置不做详细描述，这里比官方多了两个文件 `Rakefile` 和 `Gemfile` 都是 rake 所需的文件，这个后面会讲到。
再者就是配置 [gitlab-mirrors](https://github.com/samrocketman/gitlab-mirrors#three-easy-steps)，教程很详细不再重复。

{{< updated at="2022-04-18" >}}

gitlab-mirrors 的机制问题再使用其他会有很大的限制，我重新造了一个新轮子 [hpr](https://icyleaf.com/2018/04/intro-hpr/) 通过 HTTP REST API + Docker 部署的方式更好的解决了这个问题。

{{< /updated >}}

#### 偷梁换柱

利用私有 Spec 仓库特性，可以把官方 `Spec` 目录下面的包按需或全部镜像过来，再次基础上**把里面涉及 github 的地址替换成 gitlab 的地址**

你没有看错，这是核心步骤，如果这步没有做那么和国内镜像的地址没有任何差别。核心代码如下：

##### Rakefile

```ruby
require 'uri'
require 'fileutils'
require 'multi_json'
require 'net/ssh'

desc '镜像一个 github 包至 gitlab 仓库'
task :clone, [:name] do |t, p|
  name = p[:name]
  current_path = Dir.pwd

  specs = Dir[File.join(File.expand_path('~'), '.cocoapods/repos/master/Specs/*')]

  repo = specs.select { |s| File.basename(s) == name }.first

  if repo
    puts " * found repo, copy it here"
    repo_store_path = File.join(current_path, 'Specs')
    FileUtils.cp_r repo, repo_store_path

    puts " * updating repo url"
    Dir["#{repo_store_path}/#{name}/*"].each do |f|
      pod_file = File.join(f, "#{name}.podspec.json")
      json = File.read(pod_file)
      data = MultiJson.load json

      if data['source']['git']
        puts " -> #{data['version']}: git"
        orginal_repo_url = data['source']['git']
        coverted_repo_name =  URI.parse(orginal_repo_url).path[1..-1].gsub('/', '-').downcase
        data['source']['git'] = "http://gitlab.dev/mirrors/#{coverted_repo_name}"

        File.write(pod_file, JSON.pretty_generate(data))
      else data['source']['http']
        puts " -> #{data['version']}: http url, do you want speed up?"
      else data['source']['svn']
        puts " -> #{data['version']}: svn repo, do you want speed up?"
      end
    end
  else
    puts "Not find spec named: #{name}"
  end
end

desc 'gitlab 服务器镜像 Cocoapod Spec'
task :mirror, [:repo] do |t, p|
  host        = '172..0.1'
  user        = 'icyleaf'
  options     = {:keys => '~/.ssh/keys/id_rsa.pub'}

  puts "Connect gitlab server and mirror"
  Net::SSH.start(host, user, options) do |ssh|
    gitmirror_path = '/home/gitmirror/gitlab-mirrors'
    cmd = "sudo -u gitmirror -H rake \"add[#{p[:repo]}]\""
    stdout = ssh.exec!("echo 'cd #{gitmirror_path} && #{cmd}'")
    puts stdout
    ssh.loop
  end
end
```

##### Gemfile

```ruby
source "https://ruby.taobao.org"

gem 'rest_client'
gem 'multi_json'
gem 'rake'
gem 'net-ssh'
```

`rake` 里面有两个 task：

- mirror: 镜像 iOS 开源组件
- clone: 负责把官方 spec 指定包（开源组件的版本控制）替换 gitlab 地址并加入到私有包仓库

### 总结

通过工具总有办法可以改进和提升开发者的效率和解决各种的问题，希望本文可以给大家带来更多的灵感！

### 答疑解惑

#####  F: 这套理论靠谱吗？

A: 目前我们团队已经采用并运行了很长一段时间，没有任何风险。最大的优势在于兼容官方的仓库，
就算无法链接自己的私有服务器，使用官方和国内镜像的都可以瞬间切换。

#####  F: 如果没有服务器可以实现吗？

A: 醒醒吧孩子，就连单纯的镜像官方 Cocoapods Spec 还需要一个服务器执行定期同步脚本呢。

##### F: 国内 git 托管服务器能够支持吗？

A: 据我所知国内大部分 git 托管服务器的解决方案都是基于 gitlab 二次开发的，理论上可行，
上面提到的 gitlab-mirror 本身依赖于 gitlab 的 api 在镜像的同时自动新建仓库。如果有成功的欢迎反馈。

##### F: 我从你代码发现服务器同样调用了一个 rake 脚本，你没有开源！

A: 眼睛真够敏锐的，个人对 gitlab-mirror 再做镜像时做了一个约束，新建一个 `Rakefile` 文件放到你的 gitlab-mirror 项目根目录即可：

```ruby
require 'uri'

desc "Adding repo to gitmirror"
task :add, [:repo] do |t, p|
  repo = p[:repo]

  begin
    name = URI.parse(repo).path[1..-1].gsub('/', '-').gsub('.git', '')
    if name
      `./add_mirror.sh -f --git --project-name #{name} --mirror #{repo}`
    end
  rescue Error => e
    puts 'not url'
  end
end
```

##### F: 我还有问题！

A: 麻烦请留言，谢谢！
