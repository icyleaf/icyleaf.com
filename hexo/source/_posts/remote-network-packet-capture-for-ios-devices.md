title: 如何针对 iOS 设备进行网络抓包分析
date: 2012-10-15 12:34:56
category: Technology
tags:
- Mac
- iOS
- Shell

---

Charles 目前是 OS X 上面最好的抓包分析软件，相比 WireShark 功能更加强大，并支持代理功能。

1. [iPad HTTP Debugging with Charles](http://www.ravelrumba.com/blog/ipad-http-debugging/) - 教大家如何使用它进行代理抓包
2. [Testing / Tethering Data Driven Mobile Apps with Charles and OSX](http://www.skinkers.com/2012/06/12/testing-tethering-data-driven-mobile-apps-with-charles-and-osx-ipad-iphone-http-debugging/) - 教大家如何进行 request remap，适合不改动代码的情况下修改域名切换环境

不过 Charles 的确定就是共享软件，未注册版本可以使用全功能但是限制是只能允许使用 30 分钟，那么...习惯用 Terminal 的还有一个方法：[Remote Packet Capture for iOS Devices](http://useyourloaf.com/blog/2012/02/07/remote-packet-capture-for-ios-devices.html)

```
$ rvictl -s <UDID>
$ rvictl -l
$ tcpdump -n -t -i rvi0 -q tcp
```