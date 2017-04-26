---
title: "打通 Sidekiq 的任督二脉 Ruby 和 Crystal"
date: '2017-04-26T15:54:28+00:00'
slug: ''
categories:
- Technology
tags:
- Sidekiq
- Crystal
- Ruby
image: images/cover.jpg
index: ''
comments: true
share: true
menu: ''
draft: true

---
![Screen Shot 2017-04-26 at 11.25.12.png](quiver-image-url/15552A3F4999492221470DC5A98BA89E.png)

自从开始研究 Crystal 这门语言（之前也有[介绍](http://icyleaf.com/2016/07/gitlab-api-wrapper-for-crystal/)过），基本上每隔一段时间都会看看它的近况，去年 sidekiq 的作者用该语言重新实现了 sidekiq 项目而且给出了特别竟然的[对比数据](http://www.mikeperham.com/2016/05/25/sidekiq-for-crystal/)。

![IMAGE](quiver-image-url/978A0E326A3AB1B17EF31F92F6B5EC0E.jpg =445x200)

相对比 Gitlab 采用 go 语言重新 gitlab_ci_runner 而学习一门新的语言达到高效率低内存的方法之外 Crystal 就像是新的希望。使用 Crystal 重新的 sidekiq 的代码也非常的简单但已经实现了核心功能和 Web UI。

本篇就给大家介绍下如果在 Ruby on Rails 的框架下调度和执行 Crystal 写的 Workers。测试环境是在 macOS 下，其他版本信息如下：

- Ruby 2.0+
  - Rails 5.0
  - Sidekiq 5.0
- Crystal 0.22.0+
  - Sidekiq.cr 0.7.0

## 配置 Rails 环境

如何配置 Ruby、Rails、Bundler、Redis 就不在赘述，只讲核心，首先新建一个最基础的 rails 项目，不用额外的第三方辅助工具，数据库用 sqlite 减少外部依赖：

```bash
$ rails new ruby_on_rails -B -T -S -C -M  -d sqlite3
```

进入项目 `ruby_on_rails` 编辑 `Gemfile`:

```ruby
# 修改源地址
source 'https://gems.ruby-china.org'

# 新增 sidekiq 的支持
gem 'redis-rails'
gem 'sidekiq'

# 其余的不用修改
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.0.2'
# Use sqlite3 as the database for Active Record
gem 'sqlite3'
# Use Puma as the app server
gem 'puma', '~> 3.0'

gem 'redis-rails'
gem 'sidekiq'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platform: :mri
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.0.5'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
```

配置好之后执行 `bundle insall` 安装好 Gem 的依赖，再创建文件 `config/initializers/sidekiq.rb`:

```ruby
redis_config = { url: 'redis://localhost:6379/8' }

Sidekiq.configure_server do |config|
  config.redis = redis_config
end

Sidekiq.configure_client do |config|
  config.redis = redis_config
end
```

Sidekiq 的配置就完事了。

## 配置 Crystal 环境

Crystal 是基于 LLVM 开发，除了 Windows 以外其他绝大数系统基本上都支持（最新支持的 ARM 架构，可在树莓派上安装），[安装步骤](https://crystal-lang.org/docs/installation/)同样不再赘述。

安装好之后首先创建一个新项目：

```bash
$ crystal init app crystal
```

进入项目 `crystal` 编辑 `Shard.yml` 这是一个类似于 Gemfile 的功能，但实现的去中心化，在文件末尾新增如下依赖：

```yaml
dependencies:
  sidekiq:
    github: mperham/sidekiq.cr
    branch: master
```

执行 `shards update` 或 `crystal deps` 安装依赖即可。


## 编写 Workers

Worker 的功能很简单，就是做一个类似 Redis ping 的功能，Worker 在日志输出 PONG。

### Ruby 版本

安装 sidekiq 后会在 rails 内置命令可生成基础模板，切换到 `ruby_on_rails` 目录：

```bash
$ rails g sidekiq:worker ping1
      create  app/workers/ping1_worker.rb
$ rails g sidekiq:worker ping2
      create  app/workers/ping2_worker.rb
```

worker 的内容也很简单，我在日志输出增加了 `[Ruby]` 作为 Ruby 版本的标识便于后面的辨识

```ruby
# app/workers/ping1_worker.rb
class Ping1Worker
  include Sidekiq::Worker

  def perform(*args)
    logger.info "[Ruby] PONG !"
  end
end

# app/workers/ping2_worker.rb
class Ping2Worker
  include Sidekiq::Worker

  def perform(*args)
    logger.info "[Ruby] PONG PONG !!"
  end
end
```

### Crystal 版本

切换到 `crystal` 目录下和 Ruby 不同的是它的源码是存放在 src 目录下面，我们稍微调整下结构：

```bash
.
├── LICENSE
├── README.md
├── lib
├── shard.lock
├── shard.yml
├── spec
└── src
    ├── crystal_server.cr
    └── workers
        ├── ping1_worker.cr
        └── ping2_worker.cr
```

worker 的内容如下，并设置 queue 为 `crystal` 用于指派使用:

```crystal
# src/workers/ping1_worker.cr
class Ping1Worker
  include Sidekiq::Worker
  sidekiq_options do |job|
    job.queue = "crystal"
  end

  def perform()
    logger.info "[Crystal] PONG !"
  end
end

# src/workers/ping2_worker.cr
class Ping2Worker
  include Sidekiq::Worker
  sidekiq_options do |job|
    job.queue = "crystal"
  end

  def perform()
    logger.info "[Crystal] PONG PONG !!"
  end
end
```

通过代码可以看出 Ruby 和 Crystal 的代码基本上是完全一样的。

## 任督二脉

对于使用 Sidekiq 的童鞋都知道，如果我想执行一个队列任务，只需要调用下 Worker 本身的 `perform_*` 方法，这样的话根本无法调用一个不同语言版本的 Worker 否则 sidekiq 会报类似如下错误：

```bash
2017-04-26T06:19:14.187Z 50690 TID-ox4qa1k8o WARN: {"context":"Job raised exception","job":{"class":"Crystal::Ping1Worker","args":[],"retry":true,"queue":"default","jid":"42ce106d79
01a274f3db2d54","created_at":1493187554.181674,"enqueued_at":1493187554.1820428},"jobstr":"{\"class\":\"Crystal::Ping1Worker\",\"args\":[],\"retry\":true,\"queue\":\"default\",\"jid
\":\"42ce106d7901a274f3db2d54\",\"created_at\":1493187554.181674,\"enqueued_at\":1493187554.1820428}"}
2017-04-26T06:19:14.187Z 50690 TID-ox4qa1k8o WARN: NameError: uninitialized constant Crystal
```

打通任督二脉的关键在于两个版本都提供一个 low-level 的 API 可用于定制化调用：

### Ruby 版本

```ruby
job_id = Sidekiq::Client.push(
  'queue' => '',  # 指派特定的队列名，默认是 default
  'class' => '',  # Worker 的类名，可以是实例化类型或字符串类型
  'args' =>[]     # Worker 接收的参数，以数组形式传递
)
```

### Crystal 版本

```crystal
job = Sidekiq::Job.new
job.queue = "default"   # 指派特定的队列名，默认是 default
job.klass = ""          # Worker 的类名，可以是实例化类型或字符串类型
job.args = [].to_json   # Worker 接收的参数，以数组形式传递

client = Sidekiq::Client.new
job_id = client.push(job)
```

## 打通任督二脉

准备工作就绪，打通任督二脉的关键就只差一个了！那就是对于 redis 数据共享，细心的童鞋可能留意了上面只配置了 Ruby 版本的 redis 连接，但对于 Crystal 我故意留白没有说明。因为这个是最关键的一步，对于当前 sidekiq.cr 版本来说。

sidekiq.cr 对于作者来说是一次试水并没有话特别大的精力，Crystal 本身还处在开发阶段在未到达 1.0 之前会有各种 Break Changes。而且作者是非常照顾 Heroku 的开发者，默认仅支持该服务平台 Redis-to-Go 服务，因此想设置 Redis 连接信息必须通过系统的环境变量：

```bash
REDISTOGO_URL=redis://localhost:6379/8
REDIS_PROVIDER=$REDISTOGO_URL
```

上面的配置是不可省略的，因为我个人不懂 Heroku 给作者乱提了 PL 还被作者狠批了一顿 :(

回到话题本身，我们来继续写上 `src/crystal_server.cr` 关键的代码：

> 注意：redis 连接信息无比保证和 rails 配置的是一致的！

```crystal
require "sidekiq"
require "sidekiq/cli"
require "./workers/*"

ENV["LOCAL_REDIS"] = "redis://localhost:6379/8"
ENV["REDIS_PROVIDER"] = "LOCAL_REDIS"

cli = Sidekiq::CLI.new
server = cli.configure do |config|
  # 支持中间件，默认留空即可
end

cli.run(server)
```

代码需要编译执行，因为不编译是无法给 sidekiq cli 传递它接受的参数（当然也有方法，我放在末尾范例源码中自己寻找）

```bash
$ crystal build src/crystal_server.cr -o crystal_server
```

通过上面命令把源码编译成可执行文件到项目根目录的 `crystal_server` 文件。

打开终端一：启动 ruby 的 sidekiq server

```bash
$ cd ruby_on_rails
$ sidekiq -q default
2017-04-26T06:47:19.299Z 76282 TID-owewdljsc INFO: Booting Sidekiq 4.2.10 with redis options {:url=>"redis://localhost:6379/8"}


         m,
         `$b
    .ss,  $$:         .,d$
    `$$P,d$P'    .,md$P"'
     ,$$$$$bmmd$$$P^'
   .d$$$$$$$$$$P'
   $$^' `"^$$$'       ____  _     _      _    _
   $:     ,$$:       / ___|(_) __| | ___| | _(_) __ _
   `b     :$$        \___ \| |/ _` |/ _ \ |/ / |/ _` |
          $$:         ___) | | (_| |  __/   <| | (_| |
          $$         |____/|_|\__,_|\___|_|\_\_|\__, |
        .d$$                                       |_|

2017-04-26T06:47:19.433Z 76282 TID-owewdljsc INFO: Running in ruby 2.4.0p0 (2016-12-24 revision 57164) [x86_64-darwin16]
2017-04-26T06:47:19.433Z 76282 TID-owewdljsc INFO: See LICENSE and the LGPL-3.0 for licensing details.
2017-04-26T06:47:19.433Z 76282 TID-owewdljsc INFO: Upgrade to Sidekiq Pro for more features and support: http://sidekiq.org
2017-04-26T06:47:19.442Z 76282 TID-owewdljsc INFO: Starting processing, hit Ctrl-C to stop
```

打开终端二：启动 crystal 的 sidekiq server

```bash
$ cd crystal
$ ./crystal_server -q crystal

         m,
         `$b
    .ss,  $$:         .,d$
    `$$P,d$P'    .,md$P"'
     ,$$$$$bmmd$$$P^'
   .d$$$$$$$$$$P'
   $$^' `"^$$$'       ____  _     _      _    _
   $:     ,$$:       / ___|(_) __| | ___| | _(_) __ _
   `b     :$$        \___ \| |/ _` |/ _ \ |/ / |/ _` |
          $$:         ___) | | (_| |  __/   <| | (_| |
          $$         |____/|_|\__,_|\___|_|\_\_|\__, |
        .d$$                                       |_|

2017-04-26T06:48:42.755Z 83552 TID-21ybwjk  INFO: Sidekiq v0.7.0 in Crystal 0.22.0
2017-04-26T06:48:42.755Z 83552 TID-21ybwjk  INFO: Licensed for use under the terms of the GNU LGPL-3.0 license.
2017-04-26T06:48:42.755Z 83552 TID-21ybwjk  INFO: Upgrade to Sidekiq Enterprise for more features and support: http://sidekiq.org
2017-04-26T06:48:42.755Z 83552 TID-21ybwjk  INFO: Starting processing with 25 workers
2017-04-26T06:48:42.756Z 83552 TID-21ybwjk  INFO: Press Ctrl-C to stop
```

## 验证功力效果

两边的 sidekiq server 都已经跑起来了，我们先从 rails 启动 console 验证，注意留意两个 sidekiq 终端日志的输出：

```bash
$ rails console
Loading development environment (Rails 5.0.2)

# 调用 rails 本身的 ping1 和 ping2 worker
2.4.0 :001 > Sidekiq::Client.push('class' => 'Ping1Worker', 'args' =>[])
 => "961500753aa127b73ac50851"
2.4.0 :002 > Sidekiq::Client.push('class' => 'Ping2Worker', 'args' =>[])
 => "be366d2e5f44adf367853d82"
```

对应 rails 的 sidekiq server 会同时输出：

```bash
2017-04-26T06:53:01.722Z 76282 TID-owex58ag8 Ping1Worker JID-961500753aa127b73ac50851 INFO: start
2017-04-26T06:53:01.722Z 76282 TID-owex58ag8 Ping1Worker JID-961500753aa127b73ac50851 INFO: [Ruby] PONG !
2017-04-26T06:53:01.722Z 76282 TID-owex58ag8 Ping1Worker JID-961500753aa127b73ac50851 INFO: done: 0.0 sec
2017-04-26T06:53:52.681Z 76282 TID-owex58bs0 Ping2Worker JID-be366d2e5f44adf367853d82 INFO: start
2017-04-26T06:53:52.681Z 76282 TID-owex58bs0 Ping2Worker JID-be366d2e5f44adf367853d82 INFO: [Ruby] PONG PONG !!
2017-04-26T06:53:52.681Z 76282 TID-owex58bs0 Ping2Worker JID-be366d2e5f44adf367853d82 INFO: done: 0.0 sec
```

自身一脉本来就是通的没什么好稀奇的，验证另外一脉：

```bash
$ rails console
Loading development environment (Rails 5.0.2)

# 调用 crystal 的 ping1 和 ping2 worker
2.4.0 :001 > Sidekiq::Client.push('class' => 'Ping1Worker', 'args' =>[], 'queue' => 'crystal')
 => "324cf5e07b5e2999b0a45565"
2.4.0 :002 > Sidekiq::Client.push('class' => 'Ping2Worker', 'args' =>[], 'queue' => 'crystal')
 => "06c60bb9d52d9a31d48d2fdc"
```

看看 crystal 的 sidekiq server 的日志：

```bash
2017-04-26T06:57:11.846Z 21253 TID-1z8q4cg  JID=324cf5e07b5e2999b0a45565 INFO: Start
2017-04-26T06:57:11.846Z 21253 TID-1z8q4cg  JID=324cf5e07b5e2999b0a45565 INFO: [Crystal] PONG !
2017-04-26T06:57:11.846Z 21253 TID-1z8q4cg  JID=324cf5e07b5e2999b0a45565 INFO: Done: 0.000046 sec
2017-04-26T06:57:20.785Z 21253 TID-1z8q3y8  JID=06c60bb9d52d9a31d48d2fdc INFO: Start
2017-04-26T06:57:20.785Z 21253 TID-1z8q3y8  JID=06c60bb9d52d9a31d48d2fdc INFO: [Crystal] PONG PONG !!
2017-04-26T06:57:20.785Z 21253 TID-1z8q3y8  JID=06c60bb9d52d9a31d48d2fdc INFO: Done: 0.000049 sec
```

验证通过！打通了！

Crystal 这边向 Ruby 调用也可行，但只有通过如下代码，有个别时候自身调用也没有日志输出，不过在 Web UI 却发现已处理的数字已正常更新，该问题我再调查下。

```crystal
require "sidekiq"

ENV["LOCAL_REDIS"] = "redis://localhost:6379/8"
ENV["REDIS_PROVIDER"] = "LOCAL_REDIS"

workers = %w(Ping1Worker Ping2Worker)
workers.each do |wk_class|
  job = Sidekiq::Job.new
  job.queue = "default"
  job.klass = wk_class

  Sidekiq::Client.default_context = Sidekiq::Client::Context.new

  client = Sidekiq::Client.new
  job_id = client.push(job)
  puts "[#{wk_class}] job id: #{job_id}"
end
```

```bash
2017-04-26T07:20:58.754Z 62256 TID-oukzi7jck Ping1Worker JID-1fee81b35052cba1f6525de5 INFO: start
2017-04-26T07:20:58.754Z 62256 TID-oukzi7jck Ping1Worker JID-1fee81b35052cba1f6525de5 INFO: [Ruby] PONG !
2017-04-26T07:20:58.755Z 62256 TID-oukzi7jck Ping1Worker JID-1fee81b35052cba1f6525de5 INFO: done: 0.0 sec
2017-04-26T07:20:58.756Z 62256 TID-oul02vzfw Ping2Worker JID-0bb7eef097447784fb48d943 INFO: start
2017-04-26T07:20:58.756Z 62256 TID-oul02vzfw Ping2Worker JID-0bb7eef097447784fb48d943 INFO: [Ruby] PONG PONG !!
2017-04-26T07:20:58.756Z 62256 TID-oul02vzfw Ping2Worker JID-0bb7eef097447784fb48d943 INFO: done: 0.0 sec
```

## 结语

本篇只是通过一个最简单的例子让大家知道互通的方法，实际使用中对于数据交互等还有更多需要考虑的地方，这里就暂时不做展开。非常期待 Crystal 今年立的 [1.0 的目标](https://crystal-lang.org/2016/12/29/crystal-new-year-resolutions-for-2017-1-0.html)。

对于 Crystal 语言本身的评价，大家也可看下 RubyChina 站长的心得[Crystal 说我最近关注 Crystal 的感受](https://ruby-china.org/topics/32771)，编译语言有编译语言的坑，入坑需谨慎。

本文演示的代码已经整理并放到了 [Github](https://github.com/icyleaf/sidekiq-with-ruby-and-crystal)，对于不明白的地方可配合代码更好服用。