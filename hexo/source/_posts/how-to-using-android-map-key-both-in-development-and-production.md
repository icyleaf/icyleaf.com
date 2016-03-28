title: 如何在开发和发布环境使用 Android Map Key
date: 2011-05-02 12:34:56
category: Technology
tags:
- Android
- Google
- Map
permalink: how-to-using-android-map-key-both-in-development-and-production

---

在项目中第一次使用并涉及 Google Map 的功能，而由于 Google 的限制，Google Map 模块出来需要单独下载模块之外，对于每一个应用还都必须具有一个 Google Map Key，这点和使用 Web 开发调用 Google Map API 是一致的。

对于 Android 采用的 Google Map Key 来说，是由一串 MD5 值（类似这样：94:1E:43:49:87:73:BB:E6:A6:88:D7:20:F1:8E:B5:98）生成的。那么这个 MD5 是哪来的呢？

​1. 开发环境的 Google Map Key

这个比较简单，网上大面积教程所采用的 android 系统默认带有一个 debug.keystore。假如开发使用 Eclipse，在其 windows -\> Preference -\> Android -\> Build 下，其中 Default debug keystore 的值便是 debug.keystore 的路径。

在命令行或者终端执行下面命令（注意指明 debug.keystore 的路径）即可获取到 MD5 值。

```
$ keytool -list -keystore debug.keystore
```

​2. 发布环境的 Google Map Key

假如你的应用需要上线到官方的 Google Market 上面，则需要根据其 apk 的签名证书（keystore）的 MD5 值去生成，方法也很简单，发布的签名同样可以使用 Eclipse 的 Export 工具制作。制作完毕后（或许这个生成的签名没有 .keystore 后缀，不用在意）。同样也使用上面的命令获取其 MD5 值。

```
# 比如，证书路径 /home/icyleaf/android/ews
$ keytool -list -keystore /home/icyleaf/android/ews...

#  查询到了 MD5 值
Certificate fingerprint (MD5): 94:1E43:49:87:73:BB:E6:A6:88:D7:20:F1:8E:B5:98
```


使用其 MD5 值在 [Sign Up for the Android Maps API][] 页面填写生成即可。

接下来的步骤就没什么了，又是搜索出千篇一律的教程，大家 Google 之。

  [Sign Up for the Android Maps API]: http://code.google.com/android/maps-api-signup.html
