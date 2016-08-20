---
title: "初学教程：正则表达式"
date: "2007-12-10T12:34:56+08:00"
categories:
  - Technology
tags:
- regex
slug: "beginner-guide-a-regular-expression"

---

> **正则表达式**（英文全称regular
> expression）描述了一种字符串匹配的模式，可以用来检查一个串是否含有某种子串、将匹配的子串做替换或者从某个串中取出符合某个条件的子串等。

正则表达式的用途：

通过使用正则表达式，可以：

-   测试字符串内的模式。
    例如，可以测试输入字符串，以查看字符串内是否出现电话号码模式或信用卡号码模式。这称为数据验证。
-   替换文本。
    可以使用正则表达式来识别文档中的特定文本，完全删除该文本或者用其他文本替换它。
-   基于模式匹配从字符串中提取子字符串。
    可以查找文档内或输入域内特定的文本。

例如，您可能需要搜索整个 Web 站点，删除过时的材料，以及替换某些 HTML 格式标记。在这种情况下，可以使用正则表达式来确定在每个文件中是否出现该材料或该 HTML 格式标记。此过程将受影响的文件列表缩小到包含需要删除或更改的材料的那些文件。然后可以使用正则表达式来删除过时的材料。最后，可以使用正则表达式来搜索和替换标记。

正则表达式在 JScript 或 C
等语言中也很有用，这些语言的字符串处理能力还不为人们所知。

想要在很短的时间学会
正则表达式也不是一件很容易的事情，现在在网上有一份教程，应该是很火的，名叫"**[正则表达式30分钟入门教程][]**"，这也是我推荐的初学入门教程。教程来自[unibetter大学生社区][]。

教程中用到的测试正则表达式的工具是在.NET支持。这里我推荐一个由[CHKen][]（[CHKen
Player][]的作者）使用纯API编写的测试正则表达式工具：[RegExp][]。

![RegExp][1]

另外在[月光博客][]还收集了很多“[常用的正则表达式][]”是实际应用中也许对大家会有所帮助。

  [正则表达式30分钟入门教程]: http://unibetter.com/deerchao/zhengzhe-biaodashi-jiaocheng-se.htm
  [unibetter大学生社区]: http://www.unibetter.com/
  [CHKen]: http://www.chken.com/
  [CHKen Player]: http://www.chken.com/ViewSoft.asp?id=1
  [RegExp]: http://www.chken.com/Soft/Other/RegExp.zip "点击直接下载"
  [1]: http://pdjh03.mofile.com/p/1/2007/12/11/88/88NF27CQTN_103_500_320.jpg
  [月光博客]: http://www.williamlong.info
  [常用的正则表达式]: http://www.williamlong.info/archives/433.html
