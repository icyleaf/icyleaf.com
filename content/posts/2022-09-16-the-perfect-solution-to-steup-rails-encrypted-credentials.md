---
title: "Rails 产品环境配置加密凭证的完美方案"
image: https://images.unsplash.com/photo-1527694747350-2d483ffcff28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3267&q=80
imageSource:
  - name: Hello I'm Nik
    link: https://unsplash.com/photos/8yCmQODY2SY
  - name: Unsplash
    link: https://unsplash.com
date: 2022-09-16T13:58:31+08:00
slug: "perfect-solution-to-steup-rails-encrypted-credentials"
type: posts
draft: false
index: true
comments: true
isCJKLanguage: true
series:
  - DockerDeployRails
categories:
  - Technology
tags:
  - Rails
  - Docker
description: 面向用户的项目如何保证数据安全的情况下给用户提供一个便捷部署方式
---

续接上文，项目已经构建镜像后下一步大概率就要开始面向受众人群去传播使用。你有想过让用户自建服务时他要踩的坑吗？那绝对就是加密凭证的配置。

## Rails 教你这么做

很遗憾除了 Rails 寥寥几笔的配置以外你几乎找不到任何不一样的文章。加密凭证的文件结构如下：

```shell
├── config
│  ├── master.key           # 核心私钥
│  ├── credentials.yml.enc  # 加密凭证
│  └── ...
```

`master.key` 是某种算法随机生成的加密串，`credentials.yml.enc` 是存储了各种 key、token、secret value 的 YAML 数据加密后的凭证数据。

Rails 以安全为由（我猜的）对开发者也“封闭”了加密过程，只能通过 `rails credentials:edit` 命令解密 YAML 数据才能编辑和保存。最致命的该命令是使用 `EDITOR` 环境变量配置的文本编辑器，这个通常是 vim, nano 等终端文本编辑器。

这就需要在部署项目的时候无法一键部署，必须在部署前让使用者敲一堆的命令、还要在终端的文本编辑器再敲一堆需要配置的数据。

我想不仅使用者会疯掉，很多 Rails 开发者或许也会发怵。

## 我的最佳实践

> 截止 2022-10-20 为止适用于 Rails 7.x 版本。

上面提到的“封闭”的意思是使用者不可见加解密过程，但可通过[开源代码](https://github.com/rails/rails/blob/7-0-stable/railties/lib/rails/commands/credentials/credentials_command.rb)一探究竟。

我的思路很简单，不提前生成和挂载上面两个文件，通过设置 `RAILS_MASTER_KEY` 和 `RAILS_ENCRYPTED_CREDENTIALS` 两个环境变量再变相实现。

- `RAILS_MASTER_KEY` 是 Rails 内置的变量，它会[优先读取](https://github.com/rails/rails/blob/7-0-stable/activesupport/lib/active_support/encrypted_file.rb#L53)最后才会读取 `config/master.key`。

- `RAILS_ENCRYPTED_CREDENTIALS` 环境变量保存 `credentials.yml.enc` 文件的加密凭证数据，项目启动阶段通过脚本预处理。

### 加密凭证生成器

面向用户自动化配置，这就意味着需要项目开发者提供傻瓜式的配置工具。

{{< figure src="/uploads/2022/09/16/generate-encrypted-credentials-tools.png"
    title="加密凭证生成器"
>}}

上面是一个实现功能的基础版本，如果部署方式是 Docker 或 docker-compose 也可以提供生成对应的部署脚本或文件。

#### 核心源码

生成规则均借鉴 Rails 内部 `ActiveSupport::EncryptedFile` 和 `ActiveSupport::EncryptedConfiguration` 逻辑，数据库加密参考 [database.rake](https://github.com/rails/rails/blob/7-0-stable/activerecord/lib/active_record/railties/databases.rake#L531)：

```ruby
def create
  env_key = "TEMP_MASTER_KEY"
  ENV[env_key] = ActiveSupport::EncryptedConfiguration.generate_key
  generator = ActiveSupport::EncryptedConfiguration.new(
    config_path: "",
    key_path: "",
    env_key: env_key,
    raise_if_missing_key: false
  )

  master_key = generator.key
  contents = {
    "secret_key_base" => SecureRandom.alphanumeric(64),
    "active_record_encryption" => {
      "primary_key" => SecureRandom.alphanumeric(32),
      "deterministic_key" => SecureRandom.alphanumeric(32),
      "key_derivation_salt" => SecureRandom.alphanumeric(32),
    }
  }

  ENV.delete(env_key)
  render json: {
    master_key: master_key,
    encrypted_credentials: generator.send(:encrypt, YAML.dump(contents)),
    contents: contents
  }
end
```

### 自动化处理脚本

环境变量配置的 `RAILS_ENCRYPTED_CREDENTIALS` 变量并不会被 Rails 识别，必须在依赖 Rails 相关服务运行前（包括 Sidekiq）把变量的值转换成对应的文件即可。

```ruby
namespace :app do
  task :credentials do
    master_key_path = Rails.root.join('config', 'credentials', 'production.key')
    encrypted_file_path = Rails.root.join('config', 'credentials', 'production.yml.enc')
    encrypted_credentials = ENV['RAILS_ENCRYPTED_CREDENTIALS'].presence

    if encrypted_credentials && (!File.exist?(encrypted_file_path) || File.read(encrypted_file_path).empty?)
      puts "Write encrypted data into #{encrypted_file_path}"
      File.write(encrypted_file_path, ENV['RAILS_ENCRYPTED_CREDENTIALS'])
    end

    encrypted = Rails.application.encrypted(encrypted_file_path)
    if encrypted.key.nil?
      fail [
        "Missing `RAILS_MASTER_KEY` enviroment value and not found file in #{master_key_path}.",
        "Make sure generate one first and store it in a safe place."
      ].join("\n")
    end

    next if encrypted_credentials

    begin
      data = File.empty?(encrypted_file_path) ? {} : (YAML.load(encrypted.read) || {})
      puts "Preparing encrypted keys: secret_key_base, active_record_encryption ..."

      # Priority: environment > rails builtin > credentials.yml.enc data
      data['secret_key_base'] = ENV['SECRET_TOKEN'].presence || data['secret_key_base'] || SecureRandom.alphanumeric(32)

      # Support encrypted_key in model
      data['active_record_encryption'] = {
        'primary_key' => SecureRandom.alphanumeric(32),
        'deterministic_key' => SecureRandom.alphanumeric(32),
        'key_derivation_salt' => SecureRandom.alphanumeric(32),
      }

      Rails.application.encrypted(encrypted_file_path).write(YAML.dump(data))
    rescue OpenSSL::Cipher::CipherError, ActiveSupport::MessageEncryptor::InvalidMessage
      puts "Couldn't decrypt #{encrypted_file_path}. Perhaps `RAILS_MASTER_KEY` enviroment value is incorrect?"
    end
  end
end
```

### Docker 配置

```
docker run -d \
  -e RAILS_MASTER_KEY="[master_key]" \
  -e RAILS_ENCRYPTED_CREDENTIALS="[encrypted]" \
  [image_name]
```

我的最佳实践并不代表是最完美的解决方案，最起码能够让用户避免碰触代码也能够很轻松的部署才是前提，不是吗？
