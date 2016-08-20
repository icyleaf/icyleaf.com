---
title: "配置 CentOS 的网络联网设置"
date: "2013-09-05T12:34:56+08:00"
categories:
  - Technology
tags:
- Linux
- CentOS
slug: "network-configuration-in-centos"

---

安装完毕 CentOS 6 Server 开始配置网络设置，网上有很多的教程，用的方法要么不全，要么操作方式比较早期，花点时间整理了下方法：


## DHCP 设定

CentOS 默认使用了 `dhcp` 但是可恨的是没有开启。首先我们先看看本机的网卡信息

```
$ ip a
```

返回结果：

```
1: lo:  mtu 16436 qdisc noqueue state UNKNOWN
link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
inet 127.0.0.1/8 scope host lo
inet6 ::1/128 scope host
valid_lft forever preferred_lft forever
2: eth0:  mtu 1500 qdisc mq state UP qlen 1000
link/ether 00:22:19:09:4d:3c brd ff:ff:ff:ff:ff:ff
```

其中 `lo` 是回路路由，咱们不必管它，这里 `eth0` 大家会很熟悉吧，这表示第一块网卡。好了，我们需要改改它的配置文件(CentOS 默认没有安装 `vim`):

```
$ vi /etc/sysconfig/network-scripts/ifcfg-eth0
```

如果你要改其他网卡，比如 `eth1` 那需要修改 `/etc/.../ifcfg-eth1`

```
DEVICE=eth0
HWADDR="00:22:19:09:4D:3C"
NM_CONTROLLED=yes
ONBOOT=yes      # 默认是 no，我们要改成 yes
BOOTPROTO=dhcp  # 如果不是这个值也要修改
```

最后重启 network service 即可：

```
$ service network restart
# 或者比较原始的方法
$ /etc/init.d/network restart
```

如果你看到它在重启并配置 DHCP 服务，那就说明没有问题了

```
Bringing up loopback interface:                [  OK  ]
Bringing up interface eth0:
Determining IP information for eth0... done.   [  OK  ]
```

测试一下

```
$ ping google.com
$ ifconfig
```

## 手动设定

大部分操作和上面的一直，唯一不同的就是修改 `/etc/sysconfig/network-scripts/ifcfg-*` 文件：

```
DEVICE=eth0
HWADDR="00:22:19:09:4D:3C"
NM_CONTROLLED=yes
ONBOOT=yes      		# 默认是 no，我们要改成 yes
BOOTPROTO=static  		# 改成静态模式
IPADDR=192.168.1.11 	# 设定 ip 地址
NETMASK=255.255.255.0 	# 设定子网掩码
GATEWAY=192.168.1.1 	# 设定网关 ip
```

修改 DNS 地址

```
$ vi /etc/resolve.conf

nameserver 8.8.8.8 # 主 DNS
nameserver 8.8.4.4 # 备选 DNS
```