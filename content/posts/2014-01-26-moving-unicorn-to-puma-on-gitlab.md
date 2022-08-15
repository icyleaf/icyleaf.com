---
title: "Puma 替换 Unicorn 跑 Gitlab"
tags:
- Ruby
- Git
- Gitlab
- Puma
- Unicorn
categories:
  - Technology
slug: "moving-unicorn-to-puma-on-gitlab"
date: "2014-01-26T12:34:56+08:00"
description: 用 Ruby 编写的 Puma 网关才是未来
---

前篇介绍到如何在《[CentoOS 上面安装 Gitlab](http://icyleaf.com/2013/09/how-to-install-gitlab-on-centos/)》一文，gitlab 默认使用的是 `unicorn` 作为内部的 app server，再用 `nginx` 做代理转发。之前是在公司内部搭建了一个平台，用着还算可以。有打算在 [Linode 购买的 VPS](https://www.linode.com/?r=66b0730eca572d3e45f083e29b1b3f8781b2a009) 上面，使用 `unicorn` 跑服务的时候 `ruby` 的进程居然占了 400-500M 左右，对于 Linode 刚刚免费升级之后才有 1G 内存的环境上，我还真有点放弃安装它的欲望。于是在想是否可以使用 `puma` 替换掉原先的。

## puma

简单介绍下 [`puma`](http://puma.io/)，它是一个由 ruby 编写的转为 [`rack`](http://rack.github.io/) 设计的 app server，在性能和资源占有上却有极大的优势（下表数据来自官方）

```txt
PUMA - 78 Mb
RAINBOWS! (1X16) - 120 Mb
UNICORN - 1076 Mb
RAINBOWS! (16X32) - 1138 Mb
```

而且集成也非常的简单，若使用 rails 或者 sinatra（及 padrino）都已经支持，直接 `gem install puma`，然后跑默认的 `rails/padrino server` 会自动加载。


## 教程

Okay，经过一番查找，官方在收集的 [repices](https://gitlab.com/gitlab-org/gitlab-recipes/tree/master) 里面有关于 `puma` 的一些配置。他们也是收集的非官方资料，里面的资料只有借鉴意义，真正拿来用的时候各种问题，所以才有了本篇文字。

首先是关闭启动的 `gitlab` 服务

```bash
$ (sudo) service gitlab stop
```

关闭之后，添加 puma gem，打开 `Gemfile`

```ruby
group :unicorn do
  gem 'unicorn', '~> 4.6.3'
	gem 'unicorn-worker-killer'
end
```

找到上面的这段 group 替换成：

```ruby
gem 'puma'
```

再者修改 `config.ru`，把下面这段代码做下替换，删除 unicorn 的代码，加载 puma：

```ruby
unless defined?(PhusionPassenger)
  require 'unicorn'
  # Unicorn self-process killer
  require 'unicorn/worker_killer'
  # Max memory size (RSS) per worker
  use Unicorn::WorkerKiller::Oom, (200 * (1 << 20)), (250 * (1 << 20))
end
```

更新成

```ruby
unless defined?(PhusionPassenger)
  require 'puma'
end
```


替换完毕更新 `gem`

```bash
# mysql 数据库
bundle install --without development test postgres --path vendor/bundle --no-deployment
# postgres 数据库
bundle install --without development test mysql --path vendor/bundle --no-deployment
```

最后还有两处需要修改，添加 `config/puma.rb`（替代 `config/unicorn.rb`） 以及替换 `/etc/init.d/gitlab` 服务脚本代码。

`config/puma.rb`的代码在[这里可以下载](https://gitlab.com/gitlab-org/gitlab-recipes/blob/master/app-server/puma/puma.rb)，无需做任何的修改。

`/etc/init.d/gitlab` 服务脚本：[CentOS](https://gitlab.com/gitlab-org/gitlab-recipes/tree/master/init/sysvinit/centos) | [Debian(Ubuntu)](https://gitlab.com/gitlab-org/gitlab-recipes/tree/master/init/sysvinit/debian)

> 服务脚本需要设置下执行权限： chmod +x /etc/init.d/gitlab

最后开启服务应该就完美了

```bash
$ (sudo) service gitlab start
```


## 我想用 Apache 怎么办？

嗯，我没尝试过，官方有提供收集的资料，[自己查看下吧](https://gitlab.com/gitlab-org/gitlab-recipes/tree/master/web-server)，记得要活学活用，直接套肯定会出问题的。
