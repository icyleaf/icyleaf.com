title: 学习 Ansible + Vagrant
date: 2013-12-21 12:34:56
category: Technology
tags:
- Vagrant
- Ruby
permalink: learning-ansible-and-vagrant

---

 > Ansible is a radically simple IT orchestration engine that makes your applications and systems easier to deploy. Avoid writing scripts or custom code to deploy and update your applications— automate in a language that approaches plain English, using SSH, with no agents to install on remote systems.

简单来说 [Ansible](https://github.com/ansible/ansible) 是一个极简化的应用和系统部署工具，类似 [Puppet](https://github.com/puppetlabs/puppet)、[Chef](https://github.com/opscode/chef)、[SaltStack](https://github.com/saltstack/salt)。由于默认使用 `ssh` 管理服务器（集群），配置文件采用 yaml 而不是某一种特定语言制定。方便至极。

很多人说 salt 也很用的，为什么不考虑呢，我个人觉得，ansible 的配置文件编写起来比较方便，不需要使用 [jinja2](http://jinja.pocoo.org/) 模板引擎适合非 `python` 用户管理。而且我也较同意 "[Ansible and Salt: A detailed comparison](http://missingm.co/2013/06/ansible-and-salt-a-detailed-comparison/)" 文章的评测。

由于个人之前没用过任何其他工具，至于你想知道上面哪些之间有什么区别的话，参见此文：[Review: Puppet vs. Chef vs. Ansible vs. Salt](http://www.infoworld.com/d/data-center/review-puppet-vs-chef-vs-ansible-vs-salt-231308?page=0,0) 或 "[开始使用配置和发布管理](http://ttyn.me/2013/02/19/ansible_intro.html)" 一文中也有提到其特性。

# 安装

大家移步 LinuxToy 的 [Ansible 快速上手](https://linuxtoy.org/archives/hands-on-with-ansible.html) 一文，以及 [使用Vagrant練習環境佈署](http://gogojimmy.net/2013/05/26/vagrant-tutorial/) 作为学习铺垫，我就不再多写。这里我想重点介绍下 Ansible + Vagrant 配合使用技巧。

 > 其实上面 "使用Vagrant練習環境佈署" 提到的配置文件是 Vagrantfile config version = 1 时候的，当前 vagrant 版本是 1.4.1， Vagrantfile config version = 2，因此配置的部分已经有所变动。大家需要做下更新。

如果你使用的是 Vagrant 1.4.0+，工具已经完全集成了上述的 DevOps 工具（甚至 Docker，另外一神器，后续看看能否给个介绍）。默认配置文件只包含了 Puppet 和 Chef，大家需要看[官方文档](http://docs.vagrantup.com/v2/provisioning/index.html)。

如果你是 Mac OS 用户，可以通过 `brew` 和 `brew-cask` 命令安装：

```
$ brew update
$ brew install ansible
$ brew cask install vagrant
```

# 创建 Vagrant 实例

首先创建学习目录(`~/src/learn_ansible`)和一个实例，采用 CentOS 6.5 x64 系统：

```
$ vagrant init centos65 https://github.com/2creatives/vagrant-centos/releases/download/v6.5.1/centos65-x86_64-20131205.box
```

下载完毕之后，编辑 `Vagrantfile` 添加如下内容：

```
config.vm.network :private_network, ip: "33.33.33.10"
config.vm.provision :ansible do |ansible|

ansible.inventory_path = "ansbile/hosts"
	ansible.playbook = "ansbile/playbook.yml"

	# 默认使用 sudo 权限
	ansible.sudo = true
	# 开启调试信息模式
	ansible.verbose = 'vvv'
end
```

并在学习目录创建 `ansible` 目录以及下面两个文件，结构如下：

```
$ tree
.
├── Vagrantfile
└── ansible
    ├── hosts
    └── playbook.yml
1 directory, 3 files

`hosts` 文件内容，ip 地址和上面 `Vagrantfile` 设置的一致：

```
[webserver]
33.33.33.10
```

`playbook.yml` 文件内容：

```
---
# ansbile 的配置文件，这里指定只作用于 webserver 服务器
# 使用 vagrant 的 sudu 权限执行任务
- hosts: webserver
 user: vagrant
 sudo: yes
 tasks:
 	# 任务只有一个，就是安装 nginx
	- name: Install Nginx
  	  yum: name=nginx state=present
```


# 连接 & 部署

使用 Vagrant 的好处在于，它集成了这些工具，并通过 `vagrant provision` 这个命令就能连接服务器并部署。这里我想让大家学习到如何通过传统 ssh 链接 vagrant 虚拟机的方法：

从上面的配置文件我们得知，服务器的 ip 是 `33.33.33.10` 而且默认登录到虚拟机上的用户是 vagrant（密码也是用户名），链接端口是 22。我们先拷贝 ssh public key 到服务器上：

```
$ ssh-copy-id vagrant@33.33.33.10
```

完成之后，我们就可以通过下面命令测试是否配置成功：

```
$ ansible -u vagrant -i ansible/hosts all -m ping

webserver | success >> {
	"changed": false,
	"ping": "pong"
}
```

返回 `ping: pong` 即为连接成功并可以进行部署。若你之前执行了 `vagrant provision` 就会自动执行 `playbook.yml` 的内容。


今天初探就到此结束，希望通过本篇文字大家对它有个大概的了解。
