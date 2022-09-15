---
title: "Docker 部署 Rails 加密凭证 Credentials 指北"
image: https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80
imageAuthor: Mitchell Luo / Unsplash
imageSourceLink: https://unsplash.com/photos/FWoq_ldWlNQ
date: 2022-09-15T13:58:31+08:00
slug: "docker-deploy-rails-with-encrypted-credentials"
type: posts
draft: true
index: true
comments: true
isCJKLanguage: true
categories:
  - Technology
tags:
  - Rails
  - Docker
---

最近在做一个小的 Side Project 需要对数据库数据做加密处理，Rails [5.2](https://qiita.com/NaokiIshimura/items/2a179f2ab910992c4d39) 开始支持 `credentials.yml.enc` 加密凭证，
[6.0](https://blog.saeloun.com/2019/10/10/rails-6-adds-support-for-multi-environment-credentials.html) 支持多环境的 credentials 加密凭证，
[7.0](https://blog.saeloun.com/2021/06/09/rails-7-add-encryption-to-active-record.html) 支持对 model 数据库表字段加密处理。

最近一周开发加摸索下来，总结一句话：~~一直加密一直爽，容器化奔赴火葬场。~~

## 机制原理

初始化一个 Rails 项目会在项目根目录 `config` 生成 `master.key` 和 `credentials.yml.enc` 两个文件，前者可以理解为核心密钥，后者是用核心密钥通过
[ActiveSupport::EncryptedConfiguration](https://github.com/rails/rails/blob/7-0-stable/activesupport/lib/active_support/encrypted_configuration.rb) 加密类生成的加密后的数据文件。

只需要保证 `master.key` 不会泄露，通过 `rails credentials:edit` 配置服务所需的各自私密 token、secret key 之类也可以安全的提交到 Git 仓库中。

### 存储路径

密钥和加密后的文件会存在如下目录：

```bash
# 缺省
config/master.key
config/credentials.yml.enc

# Rails 生产环境决定 (6.0 开始支持)
# 如下分别对应 development 和 production 环境
config/credentials/development.key
config/credentials/development.yml.enc

config/credentials/production.key
config/credentials/production.yml.enc
```

### 触发机制

只要运行的代码会涉及 `config/environment.rb` 文件解密流程就会自动被触发，比如：

- `rails server`
- `rails console`
- `Rakefile` 附加 `:environment` 参数的所有 tasks

### 错误成就

解密机制被触发的那一刻，它会从存储路径从缺省到当前生产环境去寻找对应的文件，master key 会优先读取 `RAILS_MASTER_KEY` 环境变量的值，没有才会去存储文件读取，都没有找到就报错 `MissingKeyError` 错误。

master key 在 Rails 5.2 ~ 7 版本密钥的长度必须符合 aes-128-gcm 也就是 32 字节，设置错误会得到 `InvalidKeyLengthError` 错误。

`*.enc` 文件不存在会触发 `MissingContentError` 错误。

其他的错误还有可能是：

```bash
# 通常是 credentials.yml.enc 文件缺失或未设置 secret_key_base (SECRET_KEY_BASE) 的值
ArgumentError: Missing `secret_key_base` for 'production' environment, set this string with `bin/rails credentials:edit`

# master key 密钥不正确无法解密
Unable to load application: ActiveSupport::MessageEncryptor::InvalidMessage: ActiveSupport::MessageEncryptor::InvalidMessage

# 错误同上
OpenSSL::Cipher::CipherError
```

成就大体都列出来了，至于你能到哪步就看你的造化了（开玩笑）。

## 数据库加密处理

对于数据库表字段的加密 Rails 允许自定义加密类，这个不是本文的讨论范围不再展开。

## 容器化处理

恭喜你，从现在开始你本应当直面恐惧，可惜你发现了我这篇文章缺少了点悲惨的经历。

制作 Docker 镜像无论什么情况都要保证不会包含任何私密数据，我通过三种方式来解析如果从不安全到安全的构建过程。

### 最不安全的方式

镜像构建允许设置 [build-arg](https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables---build-arg) 传递

```dockerfile
FROM ruby:3.0.3

ARG master_key
ENV RAILS_MASTER_KEY=$master_key
ENV RAILS_ENV=production

# 省略
...

RUN bin/rails assets:complie
# 或者
RUN RAILS_MASTER_KEY=$master_key bin/rails assets:complie
```

执行构建命令 `docker build -t app --build-arg master_key=[32bits-length-key] .` 构建后虽然可以获得镜像，但构建时设置的值也被封装在了容器中，就算没有封装到容器中使用 `docker history` 也可以看到，因此这种方式是绝对不可取的。

### 改进版 1.0

你可能会看到有些镜像的 Dockerfile 里面会包含多个 `FROM` 的[多阶段构建](https://docs.docker.com/develop/develop-images/multistage-build/)。这个是为了利用隔离资源，重复利用缓存机制的方式使得最终的容器极可能的小和安全。我们可以利用它把私密数据隔离在前面的临时镜像中。

```dockerfile
FROM ruby:3.0.3 as builder

ARG workspace=/app
ARG master_key
ENV RAILS_MASTER_KEY=$master_key
ENV RAILS_ENV=production

# 省略
...

WORKDIR $workspace
RUN bin/rails assets:complie

# 省略
...

FROM ruby:3.0.3-slim

# 省略
...

COPY --from=builder $workspace $workspace
```

镜像存在 `builder` 和一个缺省名字（通常是 `stage-N`, N 是数字从 1 开始）两个阶段，第一阶段是最不安全方式的实现方式，这里在最后一个阶段通过一个干净安全的镜像把上一个阶段的结果文件复制过来就达成了第一个阶段中私密数据泄露的问题。

这种方式也是当前大多数人会应用的方式，尤其利用 Github Action 的 [Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) 功能从某种程度上杜绝了隐私数据的泄露。

### 加强版 2.0

[Buildkit](https://docs.docker.com/develop/develop-images/build_enhancements/) 是 Docker 新一代镜像构建工具，启用可以通过配置环境变量 `DOCKER_BUILDKIT=1` 或在 Docker 配置文件的 features 字典增加 `"buildkit" : "true"`。

由于采用新的构建工具，额外还需要在 Dockerfile 头部显性声明新的语法：`syntax = docker/dockerfile:1.2` 配合
[新的构建 secret ](https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information)

```dockerfile
# syntax = docker/dockerfile:1.2
FROM ruby:3.0.3

ARG workspace=/app
WORKDIR $workspace

# 省略
...

RUN --mount=type=secret,id=master_key,target=config/master.key,required=true \
    bin/rails assets:precompile
```

构建命令执行需要通过 [buildx](https://docs.docker.com/build/buildx/install/) CLI 子命令来完成：

```bash
$ docker buildx build \
  --secret id=master_key,src=config/master.key \
  -t app .
```

展开讲下 [--mount-type=secret](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/reference.md#run---mounttypesecret) 支持的参数:

| 参数名               | 说明                                            |
|---------------------|------------------------------------------------|
| id                  | 密钥的唯一 id，默认是 target 参数的值的文件名        |
| target              | 镜像内挂载的路径，默认是 `/run/secrets/` + `id`    |
| required            | 设置 `true` 当密钥不存在时报错，默认是 `false`      |
| mode                | 挂载后的文件权限，默认是 `0400`                    |
| uid                 | 设置密钥文件的用户 ID，默认是 `0`                  |
| gid                 | 设置密钥文件的用户组 ID，默认是 `0`                |

## 初始化加密数据


## 参考资源

- [Railsのcredentials.yml.encとmaster keyをDockerで安全に扱う](https://techblog.lclco.com/entry/2021/07/27/110000)
- [Don’t leak your Docker image’s build secrets](https://pythonspeed.com/articles/docker-build-secrets/)
