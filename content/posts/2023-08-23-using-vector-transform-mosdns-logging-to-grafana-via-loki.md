---
title: "vector + loki 实现 mosdns 数据看板"
description: 快速验证规则的同时实现类似 AdGuard Home 好看的数据看板
date: 2023-08-23T10:04:13+08:00
slug: "using-vector-transform-mosdns-logging-to-grafana-via-loki"
type: posts
index: true
comments: true
isCJKLanguage: true
categories:
  - Technology
tags:
  - vector
  - mosdns
  - loki
  - linux
  - openwrt
  - grafana
image: https://images.unsplash.com/photo-1668089135991-e2d5ca8c62a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2874&q=80
imageSource:
  - name: Greenpeace Finland
    link: https://unsplash.com/@greenpeacesuomi
  - name: Unsplash
    link: https://unsplash.com
---

我是从 4.0 版本开始使用 [mosdns](https://github.com/IrineSistiana/mosdns)，经历了 4.1 和 4.2 [不稳定的功能更新](https://github.com/IrineSistiana/mosdns/discussions/417#discussioncomment-3831982)和今年 1 月份发布 5.x 大版本重构后貌似已经稳定下来。

托 @[river_leaves](https://twitter.com/river_leaves/status/1574393162163896321) 的福利用 mosdns 自带的 [prometheus metrics](https://irine-sistiana.gitbook.io/mosdns-wiki/mosdns-v5/api-shuo-ming) 接口实时查看 DNS 解析情况。

配置中的规则是灵活且有时候很难调试，为了验证配置规则是否有效以及可视化看到域名访问频次，我从 mosdns 日志本身下手，需要的工具有 vector、prometheus、loki 和 grafana。

{{< figure src="/uploads/2023/08/grafana-mosdns.png"
    title="实时监控 mosdns 规则解析 Grafana 看板"
>}}

> 当前教程仅适用于 mosdns 5.0 ~ 5.1.3 版本（后续版本没有发布可能存在配置变化，依据实际情况调整），没错 5.3 日志结构作者又做调整了，气人不气人（如下暂不支持 5.3）。

## mosdns

mosdns 5 版本采用了[新数据源解包格式](https://github.com/IrineSistiana/mosdns/discussions/584)，配置我实在懒得调整了，直接在采用了 [luci-app-mosdns](https://github.com/sbwml/luci-app-mosdns) 插件配置微调。配置中各个 plugins 名称请确保不要修改和变动，否则会导致 vector 转换规则无法正常工作。

看不到下面配置文件的，送上[直达电梯](https://gist.github.com/icyleaf/e98093f673b4b2850226db582447175a#file-mosdns_config_v5-yaml)。

{{< gist "e98093f673b4b2850226db582447175a" "mosdns_config_v5.yaml" >}}

配置定义了 mosdns 日志的文件路径为 `/var/log/mosdns.log`，输出日志等级只需要是 INFO 即可。如果 mosdns 服务所在磁盘空间较小建议使用 logrotate 来切割日志并控制归档日志数量，以免出现空间不足的情况。

```conf
/var/log/mosdns.log {
  daily
  rotate 2
  compress
  missingok
  notifempty
  copytruncate
}
```

`copytruncate` 的意思是将旧日志文件的内容复制到新日志文件，默认是直接改名原文件会造成 mosdns 运行日志记录出现问题，设置好后确保 logrotate 定时运行：

```bash
# crontab -e
0 1 * * * /bin/sh -c "/usr/sbin/logrotate -l=syslog -d /etc/logrotate.d"
```

## vector

[vector](https://vector.dev) 是一个日志收集工具，能够从多个源（Source）收集、转换（Transform）并推送到下一个接收器（Sinks）。

{{< figure src="/uploads/2023/08/vector-flow.png" >}}

vector 需要能够直接访问到 mosdns 的日志文件。这里有两种方式可以实现：一种是两个服务都在一台机器上运行，另外一种是通过容器化共享 volume 让 vector 可以读取 mosdns 日志。

工具本身是 Go 语言开发从 Github 直接下载好对应的包解压缩就能够使用或者使用一键安装脚本：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.vector.dev | bash
```

Openwrt/Immortalwrt 用户可使用我个人维护的仓库 [icyleaf/openwrt-dist](https://github.com/icyleaf/openwrt-dist) 添加后即可安装（支持 amd64、armv8 平台的 snapshot 和 23.05.0 两个分支）：

添加仓库密钥

```bash
wget http://cdn.jsdelivr.net/gh/icyleaf/openwrt-dist@master/key-build.pub
opkg-key add key-build.pub
```

根据 openwrt 平台不同修改源地址

```bash
# 源规则
# src/gz icyleaf https://icyleaf-openwrt-repo.vercel.app/{{{target}}/packages/{{arch}}

# 添加 snapshot 分支 amd64 (x86/64) 平台的源
echo "src/gz icyleaf https://icyleaf-openwrt-repo.vercel.app/snapshosts/packages/x86/64" >> /etc/opkg/customfeeds.conf
```

安装 vector

```bash
opkg update
opkg install vector
```

修改 `/etc/vector/config.yml` 的配置文件如下

```yaml
data_dir: /tmp/vector

sources:
  mosdns-log-file:
    type: file
    include:
      - /var/log/mosdns.log
    read_from: beginning

transforms:
  mosdns-input:
    type: filter
    inputs:
      - mosdns-log-file
    condition: |
      .file == "/var/log/mosdns.log"

  mosdns-data:
    type: remap
    inputs:
      - mosdns-input
    drop_on_error: true
    source: |
      .type = "mosdns"
      .app = "mosdns"
      del(.host)
      del(.file)
      del(.source_type)

      message_parts = split!(.message, r'\t')

      .timestamp = parse_timestamp!(message_parts[0], format: "%FT%T%.9fZ")
      .level = message_parts[1]

      if (length(message_parts) == 6) {
        .plugin = message_parts[2]
        .processor = message_parts[3]
        .message = message_parts[4]

        if (exists(message_parts[5])) {
          .metadata = parse_json!(message_parts[5])
          . = merge!(., .metadata)
          del(.metadata)
        }
      } else {
        .processor = message_parts[2]
        .message = message_parts[3]

        if (exists(message_parts[4])) {
          .metadata = parse_json!(message_parts[4])
          . = merge!(., .metadata)
          del(.metadata)
        }
      }

      if (exists(.query)) {
        query_parts = split!(.query, r'\s')
        .domain = query_parts[0]
        .record = query_parts[2]
        .address = query_parts[5]
      }

sinks:
  # 同步到 loki，根据实际情况修改 endpoint 的值
  loki:
    type: loki
    inputs:
      - mosdns-data
    endpoint: 'http://10.10.10.2:3100'
    encoding:
      codec: json
    labels:
      app: '{{ app }}'
      type: '{{ type }}'
    healthcheck:
      enabled: true

  # 临时输出转换数据到 vector 控制台（生产环境请禁用）
  debug_mosdns:
    type: console
    inputs:
      - mosdns-data
    encoding:
      codec: json
```

运行 vector 服务（部署好 loki 后再运行）

非 openwrt 用户使用

```bash
vector --config /etc/vector/config.yml --watch-config --verbose
```

openwrt 用户使用

```bash
$ /etc/init.d/vector start

Loaded with warnings ["/etc/vector/config.yml"]
-----------------------------------------------
√ Component configuration
√ Health check "loki"
√ Health check "vector"
-----------------------------------------------
                                      Validated
```

使用 openwrt 插件的 vector 服务本身是会监控配置文件变化并重载，后面再调整的时候也不需要反复重启服务。

## prometheus

[prometheus](https://prometheus.io/) 是一个监控数据服务，可以作为 Grafana 数据源使用。安装参考[官方教程](https://prometheus.io/docs/prometheus/latest/installation/)，配置文件需要把 mosdns metrics 地址（比如是 10.10.10.1:8338）加到 `prometheus.yml` 文件中:

```diff
global:
  scrape_interval:     1m
  evaluation_interval: 1m

scrape_configs:
+  - job_name: mosdns
+    scrape_interval: 5s
+    # scrape_timeout: 10s
+
+    # metrics_path: /metrics
+    static_configs:
+      - targets:
+        - 10.10.10.1:8338
```

## loki

[loki](https://grafana.com/oss/loki/) 是一个日志聚合服务，本身也是 Grafana 研发的，可以作为 Grafana 数据源使用。参照[官方文档](https://grafana.com/docs/loki/latest/installation/docker/)就能部署好 loki 和 Grafana，唯一需要注意的是要提前下载好 loki [配置文件](https://raw.githubusercontent.com/grafana/loki/v2.8.0/cmd/loki/loki-local-config.yaml)。部署好之后把 loki 地址更新到上面 vector 配置。

## grafana

[grafana](https://grafana.com/) 是一个数据可视化工具，安装见 loki 部分，已有服务直接跳过。

Dashboard 看板的配置就非常简单了，先添加好 prometheus 和 loki 的数据源后，导入 [mosdns v5 看板](https://grafana.com/grafana/dashboards/19305-mosdns-v5/)，按照图示配置即可。

{{< figure src="/uploads/2023/08/import-grafana-dashboard.png"
    title="Grafana 导入 Dashboard 看板"
>}}

{{< figure src="/uploads/2023/08/configure-grafana-database.png"
    title="Grafana 配置数据源"
>}}

## 结语

感谢 mosdns 长达几个月的配置稳定之前挖的坑填上了，撒花！
