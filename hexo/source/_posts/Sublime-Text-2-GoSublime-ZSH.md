title: Sublime Text 2 + GoSublime + ZSH 的配置
date: 2012-07-30 12:34:56 
category: Technology
tags: 
- golang
- Sublime Text 2
permalink: sublime-text-2-and-gosublime-with-zsh

---

[Sublime Text 2](http://www.sublimetext.com/2)（下面简称 Subl） 通过 PCIP（Package Control: Install Package）安装各式各样的插件，其中还包括 Google 刚刚发布 1.0+ 的 golang 语言也有相应的插件 [GoSublime](https://github.com/DisposaBoy/GoSublime)，其实本来用 tmux + vim 也能解决编写和执行命令之间切换的工作。但是 tmux 的快捷键有时候重复多了会很不爽...

于是今天开始尝试使用 Subl 来编写 golang，安装完毕插件之后，编写还是比较方便的，有语法高亮，代码提示，错误提示，快速编译执行等，但是我在编译执行的时候总是会报如下错误:

 > /bin/sh: go: command not found

由于插件默认是安装 sh shell 去搜索路径的，肯定是因为在 `.bash_profile` 里面没有找到 go 命令，而我已经切换了 zsh shell （.zshrc）因此才会报此错误。

最后翻找了半天资料，发现通过 Preferencs -> Brower Packages -> Gosublime 下面有一个 [USAGE.md](https://github.com/DisposaBoy/GoSublime/blob/master/USAGE.md) 的文档，原来修改 `GoSublime.sublime-settings` 下面的 `env` 的 $PATH 解决了此问题：

 > "env": { "PATH": "/usr/local/sbin:/usr/local/bin:$PATH"}

再次编译运行，搞定！
