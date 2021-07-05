---
title: Fast Crystal
date: '2017-05-10T11:57:58+00:00'
slug: fast-crystal
categories:
- Technology
tags:
- Crystal
index: ''
comments: true
share: true
menu: ''

---
起初是自己写了一个小测试来看看 crystal 下连接字符串几种实现方式的性能情况，结果还真能区分出来

```
$ crystal build --release code/string/concatenation.cr -o bin/string/concatenation
$ ./bin/string/concatenation

Crystal 0.22.0 (2017-04-22) LLVM 4.0.0

 String#+  32.98M ( 30.32ns) (±11.62%)       fastest
String#{}   9.51M (105.16ns) (± 6.12%)  3.47× slower
 String#%    5.0M (200.03ns) (± 4.81%)  6.60× slower
```

于是就仿照 [fast-ruby](https://github.com/JuanitoFatas/fast-ruby) 在周末花了时间 fork 了 crystal 版本，其实结果挺让人吃惊的，因为是编译性语言在大多数情况下一些小的语法糖在编译器优化阶段会做一致性处理最终的结果其实是一样的，但也有一些例外。

https://github.com/icyleaf/fast-crystal
