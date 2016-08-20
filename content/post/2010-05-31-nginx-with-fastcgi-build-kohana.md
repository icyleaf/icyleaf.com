---
title: "Nginx+FastCGI 环境搭建 Kohana"
date: "2010-05-31T12:34:56+08:00"
categories:
  - Technology
tags:
- Nginx
- PHP
- Kohana
slug: "nginx-with-fastcgi-build-kohana"

---

Kohana 默认仅对 Apache 环境提供的部署支持，其实对于 Nginx+FastCGI
也是很容易支持的。本文搭建环境是 Ubuntu 10.4 并采用 apt-get
方式安装，喜爱编译的朋友可以自行解决 :)

### 1. 安装 MySQL

```bash
$ sudo apt-get install mysql-server mysql-client
```

安装过程在会提示设置 root 账户的密码，如果是本机测试开发可以留空后稍候设置。

### 2. 安装 Nginx

```bash
# 安装 Nginx
$ sudo apt-get install nginx

# 启动 Nginx
$ sudo /etc/init.d/nginx start
```

完成上面两步之后，打开浏览器，输入 localhost 或 127.0.0.1 如果看到 **Welcome to Nginx!** 字样就说明安装成功了，是不是很简单 :)

注意，如果你的机器上面如果安装了其他 web 容器（比如 Apache，Lighttd等），启动
ngnix 的时候肯定会报错，因为这些 web 容器启动均占用的 80
端口，更改的方法如下：

编辑 `/etc/nginx/sites-available/default` 文件，修改 server 段中的 listen
为 localhost:8080，其中 8080 是更改的监听端口：

```
server {    
listen   localhost:8080;
server_name  localhost;
# [...]
```

保存后重启 Nginx：

```bash
$ sudo /etc/init.d/nginx restart
```

### 3. 安装 PHP5

PHP 在 Nginx 下是通过 FastCGI 模式运行的，使用 Debain 的包管理可以安装
PHP5 和一些必须的（比如，php5-mysql）和可选的扩展（比如，Kohana 要求的
php5-curl，php5-gd，php5-mcrypt），下面前 5
个是必须的，其他可以依据个人需求添加或减少：

```bash
$ sudo apt-get install php5-cgi php5-mysql php5-curl php5-gd php5-mcrypt php5-idn php-pear php5-imagick php5-imap php5-memcache php5-mhash php5-ming php5-pspell php5-recode php5-snmp php5-tidy php5-xmlrpc php5-xsl
```

安装完毕后，需要编辑 php 的配置：

```bash
# 编辑 /etc/php5/cgi/php.ini 文件
# 修改 cgi.fix_pathinfo 的值为 1（如果此项被注解掉了，请删除前面的 # 符号）	cgi.fix_pathinfo = 1
```

至此 PHP5 已经安装完毕，但是还没有结束，因为我们还没有让它支持 FastCGI
嗯，由于 Debain 包并没有提供单独的 FastCGI 守护程序，因此我们可以使用其他的方式实现，通常使用的是 lighttpd 项目提供的 spawn-fcgi（本文也用的这个，但是它总会出现小毛病，导致 Nginx 服务 Down 掉，稍候也会给出一点解决方案）或者是 [PHP-FPM][]（专门为 PHP 提供 FastCGI 进程管理的软件）

好吧，让我们在安装 lighttpd：

```bash
$ sudo apt-get install lighttpd
```

安装完毕后会你发现一些错误信息：

```bash
Starting web server: lighttpd
2010-05-31 10:44:51: (network.c.300) can not bind to port: 80 Address already in use failed!
```

还是上面提到的重复占用端口的问题，不过由于我们只是使用它的 spawn-fcgi 因此我们可以不让它当作服务启动：

```bash
$ sudo update-rc.d -f lighttpd remove
```

好了，让我们开启 FastCGI 守护进程：

```bash
$ /usr/bin/spawn-fcgi -a 127.0.0.1 -p 9000 -u www-data -g www-data -f /usr/bin/php5-cgi -P /var/run/fastcgi-php.pid
```

其中 -a 代表 ip 地址， -p 是进程的端口， -u 是用户， -g 是用户组，-f 是 `php5-cgi` 的执行路径，-P 是进程的 pid，可以适当的在后面在加一个 -C 参数，这个数创建的进程数，本机开发的话一般设置在 3 - 5 左右即可（也可以使用 ab 测试以设置适当的进程数，这样可以防止 Nginx 的无辜 Down 掉）

提示：spawn-fcgi 必须在运行的状况下才能使得 Nginx 支持 PHP
运行，因此可以把上面的启动代码追加到 /etc/rc.local 文件的尾部保存（在 exit
命令之前）。

### 4. 配置 Nginx

Nginx 的配置相对比较简单，语法很像 PHP 代码，如果不了解的可以参考这个：[范例1][]和[范例2][]

编辑 **/etc/nginx/nginx.conf** 文件并作如下修改：

```
[...]
worker_processes  5;
[...]    
keepalive_timeout   2;
[...]
```

定义虚拟主机的配置项存放在 `/etc/nginx/conf.d/` 目录下面，每个虚拟主机配置一个文件并以 .conf 为文件后缀即可，默认是 default，也就是上面修改 Nginx 默认监听端口的文件，这里还要进一步对它配（点击右侧展开）：

```
[...]
server {        
listen   80;        
server_name  _;        
access_log  /var/log/nginx/localhost.access.log;        
location / {                
root   /var/www/nginx-default;                
index  index.php index.html index.htm;        
}        

location /doc {                
root   /usr/share;                
autoindex on;                
allow 127.0.0.1;                
deny all;        
}        l

ocation /images {                
root   /usr/share;                
autoindex on;        
}        

# error_page  404  /404.html;        
# redirect server error pages to the static page /50x.html        
# error_page   500 502 503 504  /50x.html;        
location = /50x.html {                
root   /var/www/nginx-default;        
}        

# proxy the PHP scripts to Apache listening on 127.0.0.1:80       
#location ~ \.php$ {                
#proxy_pass   http://127.0.0.1;        
#}        

# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000        
location ~ \.php$ {                
fastcgi_pass   127.0.0.1:9000;               
fastcgi_index  index.php;                
fastcgi_param  SCRIPT_FILENAME  /var/www/nginx-default$fastcgi_script_name;                
include        fastcgi_params;        
}        

# deny access to .htaccess files, if Apache's document root        # concurs with nginx's one        
# location ~ /\.ht {                
deny  all;        
}
}

[...]
```

说明下里面的个别参数：

**server\_name** 是虚拟主机的服务器入口名称，可以是 IP 也可以是域名。

**location** 段，我在 index 追加了 index.php， root 路径是 `/var/www/nginx-default` 说明该虚拟主机的根目录在这里。

最重要的是关于 PHP 部分的 location 段：**\~ \\.php\$ {}**，Nginx 默认没有开启，我们要确保它开启并在 fastcgi\_param 一行更改了参数（因为浏览器调用的默认 PHP 解析器无法找到 PHP 脚本）：

```
fastcgi_param SCRIPT_FILENAME /var/www/nginx-default$fastcgi_script_name;
```

最后确保在 include 和 fastcgi\_params 之间隔出几个空格（BUG）

重启 Nginx，然后编辑一个 info.php 文件：

```
// 创建 /var/www/nginx-default/info.php 文件
```

保存后在浏览器访问（比如：http://localhost/info.php 或
http://localhost:8080/info.php)，如看到 phpinfo
的参数页面说明配置安装成功 :)

### 5. 安装&配置 Kohana

Kohana 采用的 v3 版本，[安装步骤][]（本文把 kohana 存放在 `/home/icyleaf/php/kohana` 目录）

添加 Nginx 虚拟主机配置文件：

```
# 创建 /etc/nginx/conf.d/kohana.conf 文件
server {   
listen   kohana.local:8080;  
server_name  kohana.local;   
access_log  /var/log/nginx/kohana.access.log;

# define server root path    
set $root_path /home/icyleaf/php/kohana;  

location / {     
root   $root_path;       index  index.php index.html index.htm;
if (!-e $request_filename) {         
rewrite ^/(.*)$ /index.php?kohana_uri=/$1 last;      
}    
}

# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000  
location ~ \.php$ {      
root   $root_path;       
fastcgi_pass   127.0.0.1:9000;       
fastcgi_index  index.php;        
fastcgi_param  SCRIPT_FILENAME  $root_path$fastcgi_script_name;      include fastcgi_params;  
}
}
```

配置中首先定义了一个变量 \$root\_path 指定 Kohana 的源码的路径，对于
Kohana 的 URL rewrite url 重点是 location 段的：

```
if (!-e $request_filename) {    
rewrite ^/(.*)$ /index.php?kohana_uri=/$1 last;
}
```

编辑完成后重载 Nginx 配置：

```
$ sudo /etc/init.d/nginx reload
```

至此教程结束，额外说明的是 Kohana 默认的 .htaccess 对 Nginx 无效可有可无
:)

[PHP-FPM]: http://php-fpm.org/
[范例1]: http://wiki.nginx.org/NginxFullExample
[范例2]: http://wiki.nginx.org/NginxFullExample2
[安装步骤]: http://v3.kohana.cn/guide/tutorials.git
