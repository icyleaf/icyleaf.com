title: 获取公网 IP
date: 2012-05-09 12:34:56
category: Technology
tags:
- Shell
permalink: fetch-public-ip

---

```
$ curl -s http://checkip.dyndns.org | grep -Eo '([0-9]{1,3}\\.){3}[0-9]{1,3}'
```