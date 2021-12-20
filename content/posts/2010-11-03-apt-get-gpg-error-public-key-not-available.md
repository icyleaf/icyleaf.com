---
title: "Ubuntu 解决 public key is not available 问题"
date: "2010-11-03T12:34:56+08:00"
categories:
  - Technology
tags:
- Ubuntu
- Linux
slug: "apt-get-gpg-error-public-key-not-available"

---

自 Ubuntu 10.04 升级至 10.10 之后，系统就有些不注意的小毛病，包括系统的各个软件的配置文件可能有改动，加上常年累计尝试并添加很多 ppa

的源，自定义的软件源在升级兼容的考虑下全部金禁用了导致原本软件源的注解名称也没有了，自己不知道各个软件源是干什么的...于是手动在软件源管理（a本放在了 Applications -\> Ubuntu Software Center 程序里面 Edit 菜单下面）清理。

第一开始是凭记忆清理了一部分不再使用的软件的源，退出后更新发现失败...再次清理 Authentication 里面的 Public key，发现还是有问题，最后下定狠心把所有的源和 public key 全部删除了再更新发现还是有错误 T_T 其实错误提示的是一种类型的：

> W: GPG error: http://ppa.launchpad.net jaunty Release: The following signatures couldn't be verified because the public key is not available: NO\_PUBKEY 12DE1BCB04E5E17B5

自己动手丰衣足食...Google 之发现有两种解决方案，第一个是在 launchpad keyserver 网站搜索 key 从而找到 public
key，详情请看[这里][]。第二种则相对于比较简单：命令行流。

​1. 复制报错的尾部 NO\_PUBKEY 后面的串的后 8
位（以上面的为例：4E5E17B5），执行:

```bash
$ gpg --keyserver keyserver.ubuntu.com --recv 4E5E17B5# 返回信息gpg: requesting key 4E5E17B5 from hkp server keyserver.ubuntu.comgpg: key 4E5E17B5: public key "Launchpad PPA for chromium-daily" importedgpg: no ultimately trusted keys foundgpg: Total number processed: 1gpg:               imported: 1  (RSA: 1)
$ gpg --export --armor 4E5E17B5 | sudo apt-key add -# 返回信息OK
```

解决！
