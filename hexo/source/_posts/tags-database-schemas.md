title: 标签(Tag)的数据库设计
date: 2008-06-21 12:34:56
category: Technology
tags:
- Database
permalink: tags-database-schemas

---

原文来自：[Then each went to his own home][]

原文作者：[Philipp Keller][]

译者注：本文在涉及到专业术语或者译者表达不明白的地方均会保留原英文。

最近，在[del.icio.us mailinglist][]（译者按：应该是美味书签的讨论版块。以下del.icio.us翻译为**美味书签**）上面发了一个问题：“有人知道美味书签的数据库设计吗？”。之后我得到了一些回复，所以我想把这部分东西的知识分享给大家。

## 疑问

当你要为一个书签添加你认为需要的一个或多个标签时（或日志或其他）其数据库是如何设计的？然后，执行查询时取消这些书签中标签的合集（[union][]）或交集（[intersection][]）。也能从搜索结果中减少一些标签。

大致有三种不同的解决方案：（**注意**：如果你开发了一个网站使得任何人都可以添加标签，而且是一个较大规模的网站则请务必看下其作者写的另外一篇文章：[标签系统的性能测试][]）

## “MySQLicious” 方法(solution)

在这个方法中仅架构了一个表，它是去规范化（[denormalized][]）表。

这个类型被叫做“MySQLicious
方法(solution)”，因为MySQLicious使用这种结构可以把美味书签的数据导入到一个表中。

译者注：MySQLicious是一个把del.icio.us书签镜像到MySQL数据库中的工具。

### 交集(AND)

查询方式： “search+webservice+semweb”:

```
SELECT *FROM `delicious`WHERE tags LIKE "%search%"AND tags LIKE "%webservice%"AND tags LIKE "%semweb%"
```

### 合集(OR)

查询方式： “search|webservice|semweb”:

```
SELECT *FROM `delicious`WHERE tags LIKE "%search%"OR tags LIKE "%webservice%"OR tags LIKE "%semweb%"
```

### 减少(Exclusion)

查询方式： “search+webservice-semweb”

```
SELECT *FROM `delicious`WHERE tags LIKE "%search%"AND tags LIKE "%webservice%"AND tags NOT LIKE "%semweb%"
```

### 结论

优点：

-   只用一个表。
-   查询方式简单易懂。
-   一次就能获得全文搜索结果，可能速度快一些。
-   我猜测查询在基于[良好][]的[参数][]下是相当的快（[Peter Cooper][]的博客也提到：去规范化！去规范化！去规范化！)
-   [在我随后的日志交待使用MySQL fulltext出来有关标签的事情][]。

缺点：

-   每个书签的标签数量是有限的。通常情况下是在数据库中使用一个256字节的域（VCHAIR），否则，假设你用 **Text** 或类似的域，则速度将会慢下来。
-   如果你注意了（就像[Patrice][]那样）你会发现当你以 “websearch” 使用 **Like “%search”**  搜索标签时它也能搜索到，当你修改并使用 **Like “%search%”** 时你最终必须使用一个混乱的解决方法：在标签头添加一个空格，这样才能使其工作。


## “Scuttle” 方法(solution)


分离（Scuttle）字段，并归类到两个表中。右图表“scCategories”是一个标签表，通过一个外来的ID链接书签表。

### 交集(AND)

查询方式：“bookmark+webservice+semweb”:

```
SELECT b.*FROM scBookmarks b, scCategories cWHERE c.bId = b.bIdAND (c.category IN ('bookmark', 'webservice', 'semweb'))GROUP BY b.bIdHAVING COUNT( b.bId )=3
```

首先，当搜索的标签为“bookmark”，“webservice“或“semweb”（例如：**`c.category IN ('bookmark', 'webservice', 'semweb')`** ）时所有名为"bookmark"的标签都会被搜索，然后所有包含这三个标签的书签将筛选出来 (**`HAVING COUNT(b.bId)=3`**)。

### 合集(OR)

查询方式：“bookmark|webservice|semweb”:

Just leave out the `HAVING` clause and you have union:

```
SELECT b.*FROM scBookmarks b, scCategories cWHERE c.bId = b.bIdAND (c.category IN ('bookmark', 'webservice', 'semweb'))GROUP BY b.bId
```

### 减少(Exclusion)

查询方式：“bookmark+webservice-semweb”，意味着：`bookmark AND webservice AND NOT semweb`

```
SELECT b. *FROM scBookmarks b, scCategories cWHERE b.bId = c.bIdAND (c.category IN ('bookmark', 'webservice'))AND b.bId NOTIN (SELECT b.bId FROM scBookmarks b, scCategories c WHERE b.bId = c.bId AND c.category = 'semweb')GROUP BY b.bIdHAVING COUNT( b.bId ) =2
```

省略掉 **`HAVING COUNT`** 会导致搜索方式变为“bookmark|webservice-semweb”.

信息来源：[Rhomboid][]写的[helping me out with this query][].

### 结论

我猜测这个解决方案主要有利点是使得他更正常化，比第一个解决方案比较而言，好处在于可以为每一个书签添加无限数量的标签。

## “Toxi” 方法(solution)

[Toxi][] 提出了一个三个表的结构，通过表”tagmap“的书签和标签的n-to-m关联。每一个标签都可以在不同的书签一期使用，反之亦然。这种数据库结构也被用在[Wordpress][]之中。

### 交集(AND)

查询方式：“bookmark+webservice+semweb”

```
SELECT b.*FROM tagmap bt, bookmark b, tag tWHERE bt.tag_id = t.tag_idAND (t.name IN ('bookmark', 'webservice', 'semweb'))AND b.id = bt.bookmark_idGROUP BY b.idHAVING COUNT( b.id )=3
```

### 合集(OR)

查询方式：“bookmark|webservice|semweb”

```
SELECT b.*FROM tagmap bt, bookmark b, tag tWHERE bt.tag_id = t.tag_idAND (t.name IN ('bookmark', 'webservice', 'semweb'))AND b.id = bt.bookmark_idGROUP BY b.id
```

### 减少(Exclusion)

查询方式：“bookmark+webservice-semweb”，意味：bookmark AND webservice AND NOT semweb.

```
SELECT b. *FROM bookmark b, tagmap bt, tag tWHERE b.id = bt.bookmark_idAND bt.tag_id = t.tag_idAND (t.name IN ('Programming', 'Algorithms'))AND b.id NOT IN (SELECT b.id FROM bookmark b, tagmap bt, tag t WHERE b.id = bt.bookmark_id AND bt.tag_id = t.tag_id AND t.name = 'Python')GROUP BY b.idHAVING COUNT( b.id ) =2
```

省略掉 **`HAVING COUNT`** 会导致搜索方式变为“bookmark|webservice-semweb”.

信息来源：[Rhomboid][]写的[helping me out with this query][].

### 结论

优点：

-   可以为每个标签节省额外的信息（描述，分类等）
-   这是一个最正常化的解决方案（即，第三范式：[3NF][]）

缺点：

-   当修改或删除书签后，需要删除中间表的相应数据（When altering or deleting bookmarks you can end up with tag-orphans）。

    如果你想要更复杂的查询，比如”**(bookmarks OR bookmark) AND (webservice or WS) AND NOT (semweb or semanticweb)**“这样的查询语句，我建议参见以下查询/计算过程：

1.  为每一个标签出现在你的”“tag-query”时执行一个查询（Run a query for each tag appearing in your
“tag-query”）：**`SELECT b.id FROM tagmap bt, bookmark b, tag t WHERE bt.tag_id = t.tag_id AND b.id = bt.bookmark_id AND t.name = "semweb"`**
2.  把每一个编号集从结果中导到一个数值里面（使用你喜欢的编码语言），这样可以缓存你想要的数组。
3.  使用合集或交集或其他方式限制数组。

通过这种方式，你也可以查询`"(del.icio.us|delicious)+(semweb|semantic_web)-search"，这种类型的查询（即，括号内）利用去规范化的`“MySQLicious solution”`不能这样做。`

这是最灵活的数据结构和我猜想它的效果相当好（即，使用一些缓存技术）。</code>

**2006年5月更新**：这篇文章获得了大家的注视。我真的不是为此而准备的！看来大家不断的提到了他，甚至一些网站转载我的文章，我认为，这些不同方式的理论的知识应该归功于：[MySQLicious][],
[scuttle][], [Toxi][]以及所有参与并贡献的评论者（请务必阅读！）

p.s. 感谢[Toxi][]发给我关于三个表结构的疑问，Benjamin
Reitzammer为我指点的[文章][]（一个很好的标签查询参考）和powerlinux提供的[scuttle][]指引。

扩展阅读
--------

- [Taglist: a mailing list dedicated to schemas with tagging][]
- [Tagschema: A blog dedicated to tagging schemas][]
- [Tag-related Queries on Snippets][]
- [Freetag][] is a php “library” with which you can add tags to whatever object you like. It actually uses the “toxi schema”.
- Hammy [gives an insight][] how he did his tagging system with “less DB and more code” (that is: regular expressions), interesting!
- Brad Choate [has got some ideas][] which tag queries should be possible
- Feedmaker has written [a sort of reply to this article][]

  [Then each went to his own home]: http://www.pui.ch/phred/archives/2005/04/tags-database-schemas.html
  [Philipp Keller]: http://www.pui.ch/phred/about
  [icyleaf]: http://www.icyleaf.cn
  [del.icio.us mailinglist]: http://lists.del.icio.us/pipermail/discuss/2005-April/002827.html
  [union]: http://en.wikipedia.org/wiki/Union_%28set_theory%29
  [intersection]: http://en.wikipedia.org/wiki/Intersection_%28set_theory%29
  [标签系统的性能测试]: http://www.pui.ch/phred/archives/2005/06/tagsystems-performance-tests.html
  [denormalized]: http://en.wikipedia.org/wiki/Denormalization
  []: http://www.pui.ch/phred/modules/mysqlicious_structure.png
  [1]: http://www.pui.ch/phred/modules/mysqlicious_data.png
  [良好]: http://www.pui.ch/phred/archives/2005/04/tags-database-schemas.html#comment-57
  [参数]: http://www.pui.ch/phred/archives/2005/04/tags-database-schemas.html#comment-62
  [Peter Cooper]: http://www.petercooper.co.uk/archives/000648.html
  [在我随后的日志交待使用MySQL fulltext出来有关标签的事情]: http://www.pui.ch/phred/archives/2005/05/tags-with-mysql-fulltext.html
  [Patrice]: http://www.pui.ch/phred/archives/2005/04/tags-database-schemas.html#comment-63
  [2]: http://www.pui.ch/phred/modules/scuttle_structure.png
  [Rhomboid]: http://www.metafilter.com/user/26222
  [helping me out with this query]: http://ask.metafilter.com/mefi/34897#544185
  [3]: http://www.pui.ch/phred/modules/toxi_structure.png
  [Toxi]: http://toxi.co.uk/
  [Wordpress]: http://wordpress.org/
  [3NF]: http://en.wikipedia.org/wiki/3NF
  [MySQLicious]: http://nanovivid.com/projects/mysqlicious/
  [scuttle]: http://sourceforge.net/projects/scuttle/
  [文章]: http://laughingmeme.org/archives/002918.html
  [Taglist: a mailing list dedicated to schemas with tagging]: http://lists.tagschema.com/mailman/listinfo/tagdb
  [Tagschema: A blog dedicated to tagging schemas]: http://tagschema.com/blogs/tagschema/
  [Tag-related Queries on Snippets]: http://www.bigbold.com/snippets/tags/tagging
  [Freetag]: http://www.getluky.net/freetag/
  [gives an insight]: http://hellojoseph.com/tags-howto.php
  [has got some ideas]: http://bradchoate.com/weblog/2004/10/06/delicious
  [a sort of reply to this article]: http://blog.feedmarker.com/2005/04/26/tagging-in-mysql/
