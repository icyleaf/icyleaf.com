title: 利用 argparse 写的脚本命令：测试 URL 响应时间
date: 2012-08-02 12:34:56
category: Technology
tags:
- Python
- Ruby
permalink: url-request-time-test-using-python-with-argparse

---

前几天看完《[Python简明教程](http://woodpecker.org.cn/abyteofpython_cn/chinese/)》，预想练手，想起同事的一个 ruby 代码，尝试改写成 python，顺便看看两个语言的简练程度。下面是原始的 ruby 代码：

```
#!/usr/bin/env ruby

require 'rubygems'
require 'net/http'

urls = ["http://icyleaf.com"]
50.times do
  urls.each do |url|
    start_at = Time.now
    Net::HTTP.get URI.parse(url)
    end_at = Time.now
    diff = end_at - start_at
    if diff < 0.3 then
      color_code = 32
    elsif diff > 0.8 then
      color_code = 31
    else
      color_code = 33
    end
    puts "#{url}\n time: \033[#{color_code}m#{diff}\033[0m seconds"
  end
end
```

改写 python 的同时，考虑脚本的灵活性准备增加两个参数，第一个是请求测试次数，第二个是请求测试的 URL，而 python 默认提供了 [argparse](http://docs.python.org/dev/library/argparse.html) 库，可以很方便的生成 --help 的帮助和解析传递的参数：

```
#!/usr/bin/env python

import urllib2
import time
import sys
import argparse

def benchmark(url, count):
	for i in range(count):
		s = time.time()
		r = urllib2.urlopen(urllib2.Request(url))
		e = time.time()
		diff = e - s

		if diff < 0.3:
			color_code = 32
		elif diff > 0.8:
			color_code = 31
		else:
			color_code = 33

		print '# %d' % (i + 1)
		print '\tStauts: %s' % r.getcode()
		print '\tTime: \033[%dm%f\033[0m second(s)' % (color_code, diff)


def main(argv):
	parser = argparse.ArgumentParser(description='url request time test')

	parser.add_argument('URL', help='request url')
	parser.add_argument('-t', '--time', action='store', dest='count', type=int, default=10, help='request times')
	args = parser.parse_args(argv)

	benchmark(args.URL, args.count)


if __name__ == '__main__':
	main(sys.argv[1:])
```

当然，我主要是为了练手 python 才去写的，ruby 本身也有 [optparse](http://ruby-doc.org/stdlib-1.9.3/libdoc/optparse/rdoc/OptionParser.html) 库用于解析参数，但是需要自己手写生成 --help 的输出，而且需要对每个参数做相应的 callback。

效果如下：

![screenshot](http://ww3.sinaimg.cn/large/65d1d65bgw1dvi5nsc4sdj.jpg)
