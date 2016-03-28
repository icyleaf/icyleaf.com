title: “java.lang.NoClassDefFoundError” in Android
date: 2012-05-14 12:34:56
category: Technology
tags:
- Android
- eclipse
permalink: how-to-salvation-android-import-jar-exception-during-running

---

最近 Eclipse 的 ADT 升级至了 18 版本，结果运行的时候发现导入的第三方 jar
包总是报错

> java.lang.NoClassDefFoundError

可气的是 Eclipse 不会给工程同时在编译的时候也不会报错。

后来发现此版本，第三方的 `jar` 包必须放在项目的 `libs`
目录下面，而且仅能放在 `libs` 根目录下面，即不能在 `libs`
下面在建立子目录存放，也不能改名 `lib` 目录....

更无奈的是， Eclipse 的 User Library 也是出现同样的问题，目前无解 >.<
