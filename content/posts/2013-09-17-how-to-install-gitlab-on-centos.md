---
title: "如何在 CentOS 上安装 Gitlab"
date: "2013-09-17T12:34:56+08:00"
categories:
  - Technology
tags:
- Linux
- CentOS
- Git
slug: "how-to-install-gitlab-on-centos"

---

2013 年 08 月的 OpenParty "[花事如期](http://www.beijing-open-party.org/event/25)" 活动上，[晓东](https://github.com/vecio)在他的机器上演示了自建 Gitlab 的项目，看到 Gitlab 目前已经比较成熟，而不像早期寒碜的界面，这个时候看安装一下也是不错的事情，不过他们的项目文档只提供了 Ubuntu 系统的[安装文档](https://github.com/gitlabhq/gitlabhq#installation)，对于 CentOS 没有提到，非官方的文档有比较老久，凭着之前熟悉 Ubuntu 和学习 CentOS，那就开始安装吧：

以下教程在 `CentOS 6 x86_64` 版本下操作。

## 首先安装 EPEL 和编译依赖库

```
$ rpm -ivh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
```

> 如果你是非 64 位，去上面的网址找到适合你发行版的最新版本的 epel rpm

```
$ yum -y update
$ yum -y install gcc gcc-c++ make autoconf libyaml-devel gdbm-devel ncurses-devel openssl-devel zlib-devel readline-devel curl-devel expat-devel gettext-devel  tk-devel libxml2-devel libffi-devel libxslt-devel libicu-devel sendmail patch libyaml* pcre-devel sqlite-devel vim
```

## 安装 Python 2.7+

Gitlab 要求 Python 2.5.5+ 以及 Ruby 1.9+

系统 Python 默认是 2.6.x，如果你想把 Python 升级到目前比较流行的 2.7.x 就参照下面步骤，否则直接跳过。（Gitlab 目前不支持 Python 3.0）

```
$ mkdir /tmp/gitlab && cd /tmp/gitlab
$ curl --progress http://python.org/ftp/python/2.7.5/Python-2.7.5.tgz | tar xvf
$ cd Python-2.7.5
$ ./configure --prefix=/usr/local
$ make && make altinstall
```

安装好之后，需要做两件事情，替换默认 python 的版本至最新版本，

```
$ sudo ln -s /usr/local/bin/python2.7 /usr/local/bin/python
```

> 因为系统默认 `PATH` 的寻址路径是 `/usr/local/bin`

最后看下 Python 版本是否是刚刚安装的版本：

```
$ python --version
```

> 由于 `yum` 是 python 的一个 module，所以这块修改可能会引起无法调用 yum 脚本，所以需要修改这个文件 `/usr/bin/yum` 的第一行为 `!#/usr/bin/python2.6`

## 安装 Ruby 2.0

Ruby 1.9 和 2.0 的特性差别不大，索性升级至最新 2.0 版本即可

```
$ cd /tmp/gitlab
$ curl --progress http://cache.ruby-lang.org/pub/ruby/2.0/ruby-2.0.0-p247.tar.gz | tar xz
$ cd ruby-2.0.0-p247
$ ./configure
$ make
$ make install
```

ruby 2.0 已经内置 gem (v2.0.3)，只需要安装 bundler

```
$ gem install bundler
```

> 若在执行 `sudo ruby` 或 `sudo gem` 找不到命令，因为编译的路径配置到了 `/usr/local/bin`，我们只需要做下软链接到 root 用户可以找到的 `$PATH` 路径：

```
$ ln -s /usr/local/bin/ruby /usr/bin/ruby
$ ln -s /usr/local/bin/gem /usr/bin/gem
$ ln -s /usr/local/bin/bundle /usr/bin/bundle
```

## 安装 Git 和 Gitolite

```
$ yum -y install git-all gitolite
```

## 安装 Nginx

```
$ yum -y install nginx
$ service nginx start
```

> nginx 需要从 EPEL 中安装，默认系统没有 nginx 包。


## 安装 Mysql 和 Redis

Gitlab 要求强制安装 redis 处理一些数据，另外支持 MySQL 和 PostgreSQL，这里主要以 MySQL 为例

```
$ yum -y install mysql mysql-devel mysql-server redis
```

配置 Mysql 和 gitlab 需要的用户和数据库

```
$ service mysqld start
$ mysql -u root
$ mysql> CREATE USER 'gitlab'@'localhost' IDENTIFIED BY 'gitlab';
$ mysql> CREATE DATABASE IF NOT EXISTS `gitlabhq_production` DEFAULT CHARACTER SET `utf8` COLLATE `utf8_unicode_ci`;
$ mysql> GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON `gitlabhq_production`.* TO 'gitlab'@'localhost';
$ mysql> \q
```

Redis 使用默认配置即可，直接启动

```
$ service redis start
```

## 添加 Gitlab 用户

```
$ useradd -c 'GitLab' git
```

CentOS 的命令没有办法直接禁止用户的访问的参数，需要用下面命令：

```
$ passwd -l git 	
```

## 安装 Gitlab-shell

使用 root 账户切换到 git 账户下操作，可以比官方教程省去一些麻烦的输入

```
$ su git && cd /home/git
$ git clone https://github.com/gitlabhq/gitlab-shell.git
$ cd gitlab-shell
```

通过 `git tag` 查看最新版本并切换之

```
$ git checkout v1.7.1
```

编辑配置文件修改你要设定的域名（domain），比如 `http://gitlab.dev/`

```
$ vim config.yml
```

完成之后执行安装脚本

```
$ ./bin/install
```

## 安装 Gitlab

```
$ cd /home/git
$ git clone https://github.com/gitlabhq/gitlabhq.git gitlab
$ cd /home/git/gitlab
```

通过 `git tag` 查看最新版本并切换之

```
$ git checkout 6.0.1
```

这里需要配置的东西多一些，这里参考[官方的文档](https://github.com/gitlabhq/gitlabhq/blob/master/doc/install/installation.md#configure-it)，也可以安装我下面的步骤来：

```
$ cd /home/git/gitlab
```

复制配置文件，修改 host 相关的配置项，主要是 domain 要和上面的 `http://gitlab.dev`

```
$ cp config.yml{.example,}
$ vim config/gitlab.yml
```

确认 gitlab 以下目录的权限是否正确

```
$ mkdir tmp/pids/
$ mkdir tmp/sockets/
$ chown -R git log/
$ chown -R git tmp/
$ chmod -R u+rwX log/
$ chmod -R u+rwX tmp/
$ chmod -R u+rwX tmp/pids/
$ chmod -R u+rwX tmp/sockets/
```

创建 satellites 目录，这个目录是保存各个用户的仓库

```
$ mkdir /home/git/gitlab-satellites
```

创建 uploads 目录（为什么 gitlab 不在项目中创建呢= =！）

```
$ mkdir public/uploads
$ chmod -R u+rwX  public/uploads
```

复制 unicorn 配置文件

```
$ cp config/unicorn.rb{.example,}
```

设置 ruby web 容器的参数，比如 2GB RAM 服务器可以设置 3 个 worker。

> 如果系统其他服务占用了 unicorn 的端口，记得改名。

```
$ vim config/unicorn.rb
```

设置一些 git 全局参数

```
$ git config --global user.name "GitLab"
$ git config --global user.email "gitlab@localhost"
$ git config --global core.autocrlf input
```

配置 gitlab 数据库设置    

```
$ cp config/database.yml{.mysql,}
$ vim config/database.yml
$ chmod o-rwx config/database.yml
```

安装必需的 Ruby Gems

```
$ cd /home/git/gitlab
$ [sudo] gem install charlock_holmes --version '0.6.9.4'
$ bundle install --deployment --without development test postgres aws
```

初始化数据库数据（执行输入 `Yes` 继续创建）

```
$ bundle exec rake gitlab:setup RAILS_ENV=production
```

设置 init 脚本

```
$ sudo cp lib/support/init.d/gitlab /etc/init.d/gitlab
$ sudo chmod +x /etc/init.d/gitlab
```

## 检查 Gitlab 状态

```
$ bundle exec rake gitlab:env:info RAILS_ENV=production
```

启动 gitlab 服务

```
$ sudo service gitlab start
```

再起检查，保证所有项目都是绿色

```
$ bundle exec rake gitlab:check RAILS_ENV=production
```

## 配置 nginx

根据 nginx 的安装路径适当修改下面的路径即可，我们先把 gitlab 提供的配置文件拷贝过去

```
$ sudo mkdir -p /etc/nginx/conf/sites/
$ sudo cp lib/support/nginx/gitlab /etc/nginx/conf/sites/gitlab.conf
```

 > 根据 nginx 版本和不同发行版的不同，配置结构可能不同根据你的实际情况加载 `gitlab.conf`


修改 `gitlab.conf` 的 `YOUR_SERVER_FQDN` 为上面设置的 domain。
最后修改 `nginx.conf` 或者 `default.conf` 加载 `/etc/nginx/conf/site` 下所有 conf 文件

```
http {

	include /etc/nginx/conf/site/*.conf;

	server {
		…
	}
}
```

保存后，重启各个服务

```
$ sudo service nginx reload
$ sudo service gitlab restart
```

## 开始 Gitlab 之旅

配置好 hosts 即可访问 `gitlab.dev`

```
$ echo "127.0.0.1 gitlab.dev" >> /etc/hosts
```

默认的用户名密码：

```
admin@local.host
5iveL!fe
```

## 各种坑

### 1. 错误日志报权限错误

```
2013/11/07 00:42:21 [crit] 15875#0: *2 stat() "/home/git/gitlab/public/favicon.ico.html" failed (13: Permission denied), client: 33.33.33.1, server: gitlab.web.lo, request: "GET /favicon.ico HTTP/1.1", host: "gitlab.web.lo"
2013/11/07 00:42:21 [crit] 15875#0: *2 connect() to unix:/home/git/gitlab/tmp/sockets/gitlab.socket failed (13: Permission denied) while connecting to upstream, client: 33.33.33.1, server: gitlab.web.lo, request: "GET /favicon.ico HTTP/1.1", upstream: "http://unix:/home/git/gitlab/tmp/sockets/gitlab.socket:/favicon.ico", host: "gitlab.web.lo"
2013/11/07 00:42:31 [crit] 15875#0: *2 stat() "/home/git/gitlab/public/" failed (13: Permission denied), client: 33.33.33.1, server: gitlab.web.lo, request: "GET / HTTP/1.1", host: "gitlab.web.lo"
2013/11/07 00:42:31 [crit] 15875#0: *2 stat() "/home/git/gitlab/public//index.html" failed (13: Permission denied), client: 33.33.33.1, server: gitlab.web.lo, request: "GET / HTTP/1.1", host: "gitlab.web.lo"
2013/11/07 00:42:31 [crit] 15875#0: *2 stat() "/home/git/gitlab/public/.html" failed (13: Permission denied), client: 33.33.33.1, server: gitlab.web.lo, request: "GET / HTTP/1.1", host: "gitlab.web.lo"
2013/11/07 00:42:31 [crit] 15875#0: *2 connect() to unix:/home/git/gitlab/tmp/sockets/gitlab.socket failed (13: Permission denied) while connecting to upstream, client: 33.33.33.1, server: gitlab.web.lo, request: "GET / HTTP/1.1", upstream: "http://unix:/home/git/gitlab/tmp/sockets/gitlab.socket:/", host: "gitlab.web.lo"
2013/11/07 00:42:31 [crit] 15875#0: *2 stat() "/home/git/gitlab/public/favicon.ico" failed (13: Permission denied), client: 33.33.33.1, server: gitlab.web.lo, request: "GET /favicon.ico HTTP/1.1", host: "gitlab.web.lo"
2013/11/07 00:42:31 [crit] 15875#0: *2 stat() "/home/git/gitlab/public/favicon.ico/index.html" failed (13: Permission denied), client: 33.33.33.1, server: gitlab.web.lo, request: "GET /favicon.ico HTTP/1.1", host: "gitlab.web.lo"
2013/11/07 00:42:31 [crit] 15875#0: *2 stat() "/home/git/gitlab/public/favicon.ico.html" failed (13: Permission denied), client: 33.33.33.1, server: gitlab.web.lo, request: "GET /favicon.ico HTTP/1.1", host: "gitlab.web.lo"
2013/11/07 00:42:31 [crit] 15875#0: *2 connect() to unix:/home/git/gitlab/tmp/sockets/gitlab.socket failed (13: Permission denied) while connecting to upstream, client: 33.33.33.1, server: gitlab.web.lo, request: "GET /favicon.ico HTTP/1.1", upstream: "http://unix:/home/git/gitlab/tmp/sockets/gitlab.socket:/favicon.ico", host: "gitlab.web.lo"
```

解决方案:

```
$ (sudo) chmod o+x /home/git
```

### 2. 8080 端口被占用

这样主要是因为 nginx 的配置是做 unicorn 的代理转发，实际上 gitlab 是由 unicorn 容器驱动，而在配置里默认绑定的是 `8080` 端口

```
$ vim /home/git/gitlab/config/unicorn.rb
```

找到 `listen "127.0.0.1:8080", :tcp_nopush => true` 修改成其他未占用的端口号即可。