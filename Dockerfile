FROM icyleafcn/alpine-hexo
MAINTAINER icyleaf <icyleaf.cn@gmail.com>

# install hexo plugins
RUN npm install hexo-generator-feed --save
RUN npm install hexo-generator-seo-friendly-sitemap --save

# clear and copy resouces
RUN rm -rf source
ADD hexo .
ADD config .