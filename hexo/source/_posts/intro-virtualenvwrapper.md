title: 介绍 virtualenvwrapper
date: 2013-01-16 12:34:56
category: Technology
tags:
- Python
- Virtualenv
permalink: intro-virtualenvwrapper

---

上回说到 [virtualenv](http://icyleaf.com/2012/07/intro-virtualenv) 的基本使用，这会为了提高工作效率，再次介绍针对于它增强的一个扩展 [virtualenvwrapper](http://www.doughellmann.com/projects/virtualenvwrapper/)。

## 安装配置

```
$ pip install virtualenvwrapper
```

安装好之后需要简单配置下，主要是设置独立环境的保存路径：

```
$ export WORKON_HOME=~/Envs
$ mkdir -p $WORKON_HOME
$ source /usr/local/bin/virtualenvwrapper.sh
```

如果使用 oh-my-zsh 的可以开启对应的 virtualenvwrapper 插件， `WORKON_HOME` 会设置在 `~/.virtualenvs/`


## 常用命令

# 查看已创建的环境

```
$ lsvirtualenv
```

# 创建环境

```
$ mkvirtualenv <env_name>
$ mkvirtualenv -r requirements.txt <env_name>
```

# 切换到某个环境

```
$ workon <env_name>
```

# 设置当前环境的默认工作路径(下次执行 workon 命令会自动切换路径)

```
(env_name) $ setvirtualenvproject
```

# 查看当前环境已安装的 packages

```
$ lssitepackages
```

# 删除环境

```
$ rmvirtualenv <env_name>
```

# 创建临时环境 (deactivate 之后自动销毁)

```
$ mktmpenv
```

查看更详细的[命令描述文档](http://virtualenvwrapper.readthedocs.org/en/latest/command_ref.html)。
