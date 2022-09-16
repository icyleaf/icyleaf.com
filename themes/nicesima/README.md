# nicesima(偽島, ニセシマ)

[![Hugo](https://img.shields.io/badge/hugo-0.93.0-blue.svg)](https://gohugo.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![Screenshot](https://raw.githubusercontent.com/Mogeko/mogege/master/images/Screenshot.png)

> A blog theme for [Hugo](https://gohugo.io) and apply for [icyleaf' s blog](https://icyleaf.com) (but also a preview site).

## Features

- Images lazy loading ([Can I use?](https://caniuse.com/#search=Lazy%20loading%20via%20attribute%20for%20images%20%26%20iframes))
- Automatically highlighting code (Support by [highlight.js](https://highlightjs.org/))
- TeX Functions (Support by [KaTeX](https://katex.org/))
- [Mermaid](https://mermaid-js.github.io/mermaid) (Flowchart/Sequence/Gantt/Class/Entity Relationship Diagram, Git graph and charting tools)
- Dark/Light Mode
- Support for embedded BiliBili video
- Support hidden text
- Language packs for `en` and `zh`

Here is a table showing the similarities and differences between [nicesima](https://github.com/niceRAM/nicesima) and [mogege](https://github.com/Mogeko/mogege) and [LeaveIt](https://github.com/liuzc/LeaveIt):

## Requirements

Hugo-extended 0.93.0 or higher

## Installation

Navigate to your hugo project root and run:

```bash
git submodule add https://github.com/icyleaf/hugo-theme-nicesima themes/nicesima
```

Then run hugo (or set `theme: nicesima` in configuration file)

```bash
hugo server --minify --theme nicesima
```

## Creating site from scratch

Below is example how to create new site from scratch

```bash
hugo new site mydocs; cd mydocs
git init
git submodule add https://github.com/icyleaf/hugo-theme-nicesima  themes/nicesima
cp -R themes/nicesima/exampleSite/content .
```

```bash
hugo server --minify --theme nicesima
```

## Lazy loading

If your browser is [supported](https://caniuse.com/#search=Lazy%20loading%20via%20attribute%20for%20images%20%26%20iframes),
we will lazy loading `<img>` and `<iframes>`

Make sure your browser version:

- Chrome > 76
- Firefox > 75

## TeX Functions

**Note:** [list of TeX functions supported by KaTeX](https://katex.org/docs/supported.html)

With that you can use the `katex` language in Markdown code blocks:

### Example

<pre>
&#96;&#96;&#96;katex
# Inline math:
$$ \varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887… $$

# or Block math:
$$
 \varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } }
$$
&#96;&#96;&#96;
</pre>

![KaTeX](https://raw.githubusercontent.com/Mogeko/mogege/master/images/KaTeX.png)

## Mermaid

With that you can use the `mermaid` language in Markdown code blocks:

<pre>
&#96;&#96;&#96;mermaid
Mermaid syntax
&#96;&#96;&#96;
</pre>

For example:

<pre>
&#96;&#96;&#96;mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
&#96;&#96;&#96;
</pre>

![sequence](https://mermaid-js.github.io/mermaid/img/sequence.png)

## Embedded BiliBili video

You can embed BiliBili videos via Shortcodes, just provide the AV 号/BV 号 of the bilibili video

You can also use the PV 号 to control the 分 P (default: `1`)

```txt
{{< bilibili [AV号/BV号] [PV号] >}}
```

Click [here](https://mogeko.github.io/2020/079#biliplayer) for examples

## Hidden text

You can use "hidden text" to hide spoiler content

```txt
{{< spoiler >}} HIDDEN TEXT {{< /spoiler >}}
```

Click [here](https://mogeko.github.io/2020/080#spoiler) for examples

## Easy-searched text

You can use "Easy-searched text" to set as a link for proper nouns that only need to search to find relevant explanations. For readers, just click on the links to search easily.

```txt
{{< es Easy-searched-text >}}
```

You can also use the `search-engine` to choose which engine to use.

```txt
{{< es Easy-searched-text search-engine >}}
```

By default, `Google` will be used. You can change it to others by the following.

```txt
# Use "Bing"
{{< es Easy-searched-text bing >}}

# Use "GitHub"
{{< es Easy-searched-text github >}}
or
{{< es Easy-searched-text gh >}}

# Use "Bilibili"
{{< es Easy-searched-text bilibili >}}
or
{{< es Easy-searched-text blbl >}}

# Use "Baidu"
{{< es Easy-searched-text baidu >}}
or
{{< es Easy-searched-text bd >}}
```

And you can set any of the above search engines as the default in `config.toml` by the following:

```toml
[params]
  easySearchedEngine = "github"
```

## TOC

The TOC can be enabled by the following config.

```toml
[params]
  toc = true
```

And you can fold inactive TOC automatically:

```toml
[params]
autoCollapseToc = true
```

## Utteranc comment system

This blog supports the [utteranc](https://utteranc.es) comment system.

It is lighter and more powerful than Giscus.

To use utteranc, you need make sure the [utterances app](https://github.com/apps/utterances) is installed on the repo, otherwise users will not be able to post comments.

Then enable utteranc in config.toml

```toml
[params]
  enableComment = "utteranc"
```

Then Configuration: (For more settings, please refer to
[HomePage](https://utteranc.es))

```toml
[params.utteranc] # Homepage: https://utteranc.es
  repo = "icyleaf/icyleaf.com" # The repo to store comments
  issueTerm = "title" # the mapping between blog posts and GitHub issues.
  theme = "preferred-color-scheme" # Theme
  crossOrigin = "anonymous" # default: anonymous
  label = "✨💬✨"
  async = true
```

## Giscus comment system

This blog supports the [giscus](https://giscus.app) comment
system.

Then enable giscus in config.toml

```toml
[params]
  enableComment = "giscus"
```

```toml
[params.giscus] # Github: https://github.com/gitalk/gitalk
  repo = "icyleaf/icyleaf.com"
  repoId = ""
  categoryId = ""
  localPreview: true
```

## Custom CSS/JavaScript

Support custom CSS or JavaScript

Place your custom CSS and JavaScript files in the `/static/css` and `/static/js`
directories of your blog, respectively

```txt
static
├── css
│   └── _custom.css
└── js
    └── _custom.js
```

Then edit in `config.toml`:

```toml
[params.custom]
  css = ["css/_custom.css"]
  js = ["js/_custom.js"]
```

> Currently only supports CSS does not support Sass

## Configuration

There are few configuration options you can add to your `config.toml` file.

```toml
baseURL = ""                  # <head> 里面的 baseurl 信息，填你的博客地址
title = ""                    # 浏览器的标题
defaultContentLanguage: zh-cn # 文字语言
languageCode = "zh-cn"        # HTML 标记语音
hasCJKLanguage = true         # 开启可以让「字数统计」统计汉字
theme = "nicesima"            # 主题

paginate = 15                 # 每页的文章数
enableEmoji = true            # 支持 Emoji
enableRobotsTXT = true        # 支持 robots.txt

# Chroma 代码高亮 http://gohugo.io/content-management/syntax-highlighting/
pygmentsUseClasses=true # 使用自定义的代码高亮样式
[markup]
  [markup.highlight]
    codeFences = true
    anchorLineNos = false
    guessSyntax = false
    hl_Lines = ""
    lineAnchors = ""
    lineNoStart = 1
    lineNos = true
    lineNumbersInTable = false
    noClasses = true
    style = "monokai"
    tabWidth = 4

[Permalinks]
 posts = "/:year/:filename"

[menu]
  [[menu.main]]
    name = "Blog"
    url = "/posts/"
    weight = 1

  [[menu.main]]
    name = "Categories"
    url = "/categories/"
    weight = 2

  [[menu.main]]
    name = "Tags"
    url = "/tags/"
    weight = 3

  [[menu.main]]
    name = "About"
    url = "/about/"
    weight = 4

[params]
  since = 2020
  author = ""                         # Author's name
  avatar = "/images/me/avatar.jpg"    # Author's avatar
  subtitle = ""                       # Subtitle
  homeMode = ""                      # post or other
  enableComment = "giscus"            # giscus 评论系统

  description = ""                    # (Meta) 描述
  keywords = ""                       # site keywords
  license = '本文采用<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/" target="_blank">知识共享署名-非商业性使用 4.0 国际许可协议</a>进行许可'

  toc = true                          # switch catalog
  autoCollapseToc = false             # auto expand and collapse toc

  [params.giscus]
    repo = "icyleaf/icyleaf.com"
    repoId = ""
    categoryId = ""
    localPreview: true
```

# Credits

**This project is based on [nicesima](https://github.com/niceRAM/nicesima)**
