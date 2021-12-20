---
title: "ActiveRecord 使用秘笈"
date: "2013-12-03T12:34:56+08:00"
categories:
  - Technology
tags:
- Ruby
- ActiveRecord
- Rails
slug: "activerecord-tips"
---

ActiveRecord 是 Rails 内置的 ORM 框架，大多数人学习 Ruby 都是从 rails 开始，接触的也是这个 ORM，因此就有了这个使用秘笈。

# 支持 `rake db:xxx` 命令

在非 rails 项目怎么让 rake 支持 db:xxx 命令呢？把如下代码放到 `Rakefile` 中:

```
namespace :db do
  require 'activerecord'
  require 'yaml'

  desc "加载项目表数据到数据库"
  task :init => :dbenv do
    file = "db/schema.rb"
    load(file) # 参考 rails 文件结构
  end

  desc "创建数据库初始化数据"
  task :seed => :dbenv do
    seed_file = File.join(File.dirname(__FILE__), 'db', 'seeds.rb')
    load(seed_file) if File.exist?(seed_file)
  end

  desc "合并 db/migrate 目录下的数据库文件"
  task :migrate => :dbenv do
    ActiveRecord::Migration.verbose = ENV["VERBOSE"] ? ENV["VERBOSE"] == "true" : true
    ActiveRecord::Migrator.migrate("db/migrate/", ENV["VERSION"] ? ENV["VERSION"].to_i : nil)
    Rake::Task["db:schema:dump"].invoke if ActiveRecord::Base.schema_format == :ruby
  end

  desc '设定 STEP=n 回滚之前版本的数据库结构'
  task :rollback => :dbenv do
    step = ENV['STEP'] ? ENV['STEP'].to_i : 1
    ActiveRecord::Migrator.rollback('db/migrate/', step)
    Rake::Task["db:schema:dump"].invoke if ActiveRecord::Base.schema_format == :ruby
  end

  task :dbenv do
    dbname = ENV['db'] || 'development'
  	$dbconfig = YAML::load('db/database.yml')
    ActiveRecord::Base.establish_connection($dbconfig[dbname])
  end

  namespace :schema do
    desc "把数据库结构写入 db/schema.rb 文件"
    task :dump => :dbenv do
      require 'active_record/schema_dumper'
      File.open(ENV['SCHEMA'] || "db/schema.rb", "w") do |file|
        ActiveRecord::SchemaDumper.dump(ActiveRecord::Base.connection, file)
      end
    end
  end
end
```

初始化数据库结构

```
$ rake db:init
```

# 支持 SQL Server

只针对 *nix 系统：

1. 安装 freetds

```
* Mac OS: `brew install freetds`
* CentOS: `yum install -y freetds`
```

2. `gem install tiny_tds`
3. `gem install activerecord-sqlserver-adapter`

引用如下：

```
require 'tiny_tds'
require 'activerecord-sqlserver-adapter'
require 'active_record'

ActiveRecord::Base.establish_connection({
  :adapter => 'sqlserver'
 :host => '10.10.10.10',
 :username => 'sa',
  :password => 'p@ssword',
  :database => 'development',
  :timeout => 10,
  :port => 1433,
})

class Users < ActiveRecord::Base
	self.table_name = 'User'
	default_scope { lock('WITH (NOLOCK)') }
end
```

# 多数据库支持

创建 `config/database.yml` 文件:

```
development:
  adapter: mysql2
  host: localhost
  username: root
  password:
  database: development
  timeout: 10
  port: 3306
test:
  adapter: mysql2
  host: 10.10.10.10
  username: root
  password: p@ssword
  database: test
  timeout: 10
  port: 1433
production:
  adapter: mysql2
  host: 33.33.33.33
  username: root
  password: p@ssword
  database: production
```

创建 `lib/model.rb` 文件:

```
$dbconfig = YAML::load(File::open('config/database.yml'))

class User < ActiveRecord::Base
  establish_connection $dbconfig['development']
end

class Post < ActiveRecord::Base
  establish_connection $dbconfig['test']
end

class Tag < ActiveRecord::Base
  establish_connection $dbconfig['production']
end
```


# 动态创建表名

假若有个需求需要按照每月分表（当然也可以安装业务分表什么的），我们可以通过下面方式调用：

```
# 插入 post，如果表不存在则创建后插入
post = Post.date('201312').get_or_create_table.create(
  title:'test',
  content:'body'
)

# Model 实现代码
class Post < ActiveRecord::Base
  @date = Time.now.strftime("%Y%02m")

  def self.date(date)
  	@date = date
  end

  def self.get_or_create_table(params={})
    self.date(params[:date]) if params[:date]
    self.create_table(params) if !self.exists?
  end

  def self.create_table(params={})
    self.date(params[:date]) if params[:date]
    table_name = self.table_name
    ActiveRecord::Schema.define do
      create_table table_name do |table|
        table.column :title, :string
        table.column :content, :text
        table.column :created_at, :datetime
        table.column :updated_at, :datetime
      end
    end

    return self
  end

  def self.table_exists?
    # 如果你设置了多数据库请取消下行注解并更改配置名（参考上个技巧）
    # ActiveRecord::Base.establish_connection($dbconfig['development'])

    ActiveRecord::Base.connection.tables.include?(self.table_name)
  end

  def table_name
    "#{@date_users}"
  end
end
```