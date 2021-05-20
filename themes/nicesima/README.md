# nicesima(偽島, ニセシマ)

[![Hugo](https://img.shields.io/badge/hugo-0.80.0-blue.svg)](https://gohugo.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

### A blog theme for [Hugo](https://gohugo.io).

![Screenshot](https://raw.githubusercontent.com/Mogeko/mogege/master/images/Screenshot.png)

**This project is based on
[mogege](https://github.com/Mogeko/mogege) which based on 
[LeaveIt](https://raw.githubusercontent.com/liuzc/LeaveIt/)**

By [Mogeko](https://github.com/Mogeko), the author of [mogege](https://github.com/Mogeko/mogege):
> Because the author of
> [LeaveIt](https://raw.githubusercontent.com/liuzc/LeaveIt/) seems to have
> abandoned this project, but I prefer this theme, so I simply reopened a new
> project.
> 
> At this stage, I mainly integrate the part I modified with LeaveIt, and will add
> more features in the future.

I like this theme named [mogege](https://github.com/Mogeko/mogege), 
but **some features is modified** for complying with my habits.
So **that maybe not fit the others**.

## Features

- Images lazy loading
  ([Can I use?](https://caniuse.com/#search=Lazy%20loading%20via%20attribute%20for%20images%20%26%20iframes))
- Automatically highlighting code (Support by
  [highlight.js](https://highlightjs.org/))
- TeX Functions (Support by [KaTeX](https://katex.org/))
- [PlantUML](https://plantuml.com/en/) (Sequence diagram, Usecase diagram, Class
  diagram ...)
- Dark/Light Mode
- Support for embedded BiliBili video
- Support hidden text ...

Here is a table showing the similarities and differences between [nicesima](https://github.com/niceRAM/nicesima) and [mogege](https://github.com/Mogeko/mogege) and [LeaveIt](https://github.com/liuzc/LeaveIt):

| Features                        | *nicesima*   | [mogege(81e57f)](https://github.com/Mogeko/mogege/commit/7c7e26d0b04fb04a0d5c69d837c26823d881e57f) | LeaveIt |
| ------------------------------- | ------------ | ------------------------------------------------------------ | ------- |
| Categories                      | Optimization | Yes                                                          | Yes     |
| Tags                            | inherit      | Yes                                                          | Yes     |
| RSS support                     | inherit      | Yes                                                          | Yes     |
| sitemap.xml                     | inherit      | Yes                                                          | Yes     |
| robots.txt                      | inherit      | Yes                                                          | Yes     |
| Quote                           | inherit      | Optimization                                                 | Yes     |
| Images lazy loading             | inherit      | Optimization[*](https://caniuse.com/#search=Lazy%20loading%20via%20attribute%20for%20images%20%26%20iframes) | Yes     |
| Dark/Light Mode                 | inherit      | Optimization                                                 | Yes     |
| Highlighting code               | Optimization | Optimization                                                 | Yes     |
| Comment area                    | Optimization | Optimization                                                 | Yes     |
| TeX Functions                   | inherit      | Yes                                                          |         |
| PlantUML                        | inherit      | Yes                                                          |         |
| BiliBili video (shortcodes)     | inherit      | Yes                                                          |         |
| Hidden text (shortcodes)        | Optimization | Yes                                                          |         |
| Easy-searched text (shortcodes) | Yes          |                                                              |         |
| Social button                   | Optimization | Yes                                                          | Yes     |
| TOC                             | Yes          |                                                              |         |
| lightGallery                    |              |                                                              | Yes     |

## Requirements

Hugo-extended 0.80.0 or higher

**Hugo extended version**, read more
[here](https://gohugo.io/news/0.48-relnotes/)

## Installation

Navigate to your hugo project root and run:

```bash
git submodule add https://github.com/niceRAM/nicesima themes/nicesima
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
git submodule add https://github.com/niceRAM/nicesima  themes/nicesima
cp -R themes/nicesima/exampleSite/content .
```

```bash
hugo server --minify --theme nicesima
```

## Lazy loading

If your browser is
[supported](https://caniuse.com/#search=Lazy%20loading%20via%20attribute%20for%20images%20%26%20iframes),
we will lazy loading `<img>` and `<iframes>`

Make sure your browser version:

- Chrome > 76
- Firefox > 75

## TeX Functions

**Note:**
[list of TeX functions supported by KaTeX](https://katex.org/docs/supported.html)

To enable KaTex globally set the parameter `math` to `true` in a project's
`config.toml`

To enable KaTex on a per page basis include the parameter `math: true` in
content files.

### Example

```latex
% Inline math:
$$ \varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887… $$

% or
% Block math:
$$
 \varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } }
$$
```

![KaTeX](https://raw.githubusercontent.com/Mogeko/mogege/master/images/KaTeX.png)

## PlantUML

**PlantUML is supported by the
[official server](http://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000)**

To enable KaTex globally set the parameter `plantuml` to `true` in a project's
`config.toml`

To enable KaTex on a per page basis include the parameter `plantuml: true` in
content files.

You can insert PlantUML in the post by:

<pre>
&#96;&#96;&#96;plantuml
PlantUML syntax
&#96;&#96;&#96;
</pre>

For example:

```plantuml
@startuml
Bob -> Alice : hello

create Other
Alice -> Other : new

create control String
Alice -> String
note right : You can also put notes!

Alice --> Bob : ok

@enduml
```

![PlantUML](https://raw.githubusercontent.com/Mogeko/mogege/master/images/PlantUML.svg)

## Embedded BiliBili video

You can embed BiliBili videos via Shortcodes, just provide the AV 号/BV 号 of
the bilibili video

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

## utteranc comment system

This blog supports the 
[utteranc](https://utteranc.es) comment system. 

It is lighter and more powerful than Gitalk.

To use utteranc, you need make sure the 
[utterances app](https://github.com/apps/utterances) is 
installed on the repo, otherwise users will not be able to post comments. 

Then enable utteranc in config.toml

```toml
[params]
    enableUtteranc = true
```

Then Configuration: (For more settings, please refer to 
[HomePage](https://utteranc.es))

```toml
[params.utteranc] # Homepage: https://utteranc.es
    repo = "" # The repo to store comments
    issueTerm = "title" # the mapping between blog posts and GitHub issues. 
    theme = "preferred-color-scheme" # Theme
    crossorigin = "anonymous" # default: anonymous
```

## Gitalk comment system

This blog supports the [gitalk](https://github.com/gitalk/gitalk) comment
system. To use gitalk, you need to apply for a Github Application. For details,
please refer to
[here](https://mogeko.me/2018/024/#%E5%88%9B%E5%BB%BA-github-application).

Then enable gitalk in config.toml

```toml
[params]
    enableGitalk = true
```

> **Notice**: [The demo server of CORS Anywhere](cors-anywhere.herokuapp.com) has been very limited by January 2021, 31st.
> If you'd like to enable Gitalk, you should build a personal proxy server by [cors-anywhere](https://github.com/Rob--W/cors-anywhere),
> then set the url in ```proxy``` like the following.

Then provide your `Client ID` and `Client Secret` from Github Application in
config.toml

```toml
[params.gitalk] # Github: https://github.com/gitalk/gitalk
    clientID = "[Client ID]" # Your client ID
    clientSecret = "[Client Secret]" # Your client secret
    repo = "" # The repo to store comments
    owner = "" # Your GitHub ID
    admin = "" # Required. Github repository owner and collaborators. (Users who having write access to this repository)
    id = "location.pathname" # The unique id of the page.
    labels = "gitalk" # Github issue labels. If you used to use Gitment, you can change it
    perPage = 15 # Pagination size, with maximum 100.
    pagerDirection = "last" # Comment sorting direction, available values are 'last' and 'first'.
    createIssueManually = true # If it is 'false', it is auto to make a Github issue when the administrators login.
    distractionFreeMode = false # Enable hot key (cmd|ctrl + enter) submit comment.
    proxy = "" # the proxy built by cors-anywhere,.etc.
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
baseURL = ""            # <head> 里面的 baseurl 信息，填你的博客地址
title = ""              # 浏览器的标题
languageCode = "zh-cn"  # 语言
hasCJKLanguage = true   # 开启可以让「字数统计」统计汉字
theme = "nicesima"      # 主题

paginate = 11           # 每页的文章数
enableEmoji = true      # 支持 Emoji
enableRobotsTXT = true  # 支持 robots.txt

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
  home_mode = ""                      # post or other
  enableGitalk = true                 # gitalk 评论系统

  description = ""                    # (Meta) 描述
  keywords = ""                       # site keywords
  license = '本文采用<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/" target="_blank">知识共享署名-非商业性使用 4.0 国际许可协议</a>进行许可'

  toc = true                          # switch catalog
  autoCollapseToc = false             # auto expand and collapse toc

  [params.gitalk] # Github: https://github.com/gitalk/gitalk
    clientId = "" # Your client ID
    clientSecret = "" # Your client secret
    repo = "" # The repo to store comments
    owner = "" # Your GitHub ID
    admin = "" # Required. Github repository owner and collaborators. (Users who having write access to this repository)
    id = "location.pathname" # The unique id of the page.
    labels = "gitalk" # Github issue labels. If you used to use Gitment, you can change it
    perPage = 15 # Pagination size, with maximum 100.
    pagerDirection = "last" # Comment sorting direction, available values are 'last' and 'first'.
    createIssueManually = false # If it is 'false', it is auto to make a Github issue when the administrators login.
    distractionFreeMode = true # Enable hot key (cmd|ctrl + enter) submit comment.
    proxy = "" # the proxy built by cors-anywhere,.etc.

```
