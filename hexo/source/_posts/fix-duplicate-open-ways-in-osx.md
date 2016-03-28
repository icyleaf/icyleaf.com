title: 修复 OS X 打开方式的重复项
date: 2012-11-06 12:34:56
category: Technology
tags:
- Mac
- Shell

---

```
$ /System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r -domain local -domain system-domainuser
```