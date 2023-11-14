---
title: 搭建Java服务器(Ubuntu20.04)运行环境
date: 2023-11-14
weight: 1
---

## 前言

第一次搭Ubuntu环境，记录一下大大小小的坑。关于端口开放，或者相关命令这里不会说明，默认都了解。

## docker环境

安装docker详见[从零开始的Ubuntu20.04](https://samomi0.github.io/docs/GetStartWithUbuntu/)。这里主要贴一下docker-compose,包含常用的一些镜像。
### docker-compose

> 移植到《简易docker使用手册》？

- 安装
>tips: 您可以在[docker-compose](https://github.com/docker/compose/releases)中查找官方版本。请确保使用最新版本。
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
- 授权可执行权限 
使用以下命令将docker-compose二进制文件标记为可执行文件：
`sudo chmod +x /usr/local/bin/docker-compose`
> tips: 运行 `docker-compose --version` 验证Docker Compose是否正确安装

- docker-compose.yml
``` yml
version: "3"
networks:
  es-net:
    driver: bridge

services:
  redis:
    image: redis
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - /data/redis/conf/redis.conf:/etc/redis/redis.conf
      - /data/redis/data:/data
    command: redis-server /etc/redis/redis.conf

  elasticSearch:
    image: elasticsearch:7.17.7
    container_name: es
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - /data/es/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - /data/es/data:/usr/share/elasticsearch/data
      - /data/es/logs:/usr/share/elasticsearch/logs
      - /data/es/plugins:/usr/share/elasticsearch/plugins
      - /data/es/plugins:/usr/share/elasticsearch/plugins
    privileged: true
    networks:
      - es-net
    environment:
      - "discovery.type=single-node"
      - "ES_JAVA_OPTS=-Xms256m -Xmx256m"

  kibana:
    image: kibana:7.17.7
    container_name: kibana
    ports:
      - "5601:5601"
    volumes:
      - /data/kibana/data:/usr/share/kibana/data
      - /data/kibana/config:/usr/share/kibana/config
      - /data/kibana/plugins:/usr/share/kibana/plugins
      - /data/kibana/logs:/usr/share/kibana/logs
    privileged: true
    networks:
      - es-net
```
> 小tips:
> - 挂载的config中都需要有xxx.conf文件，尤其是kibana会直接导致启动失败,其中kibana还需要配置`elasticsearch.hosts`,保证kibana能够被正常访问, 挂载目录同时需要777的权限
> - 上述全是单机模式，如果需要集群只需要复制即可
> - es记得配置ik分词器哦~


## mysql环境

## Java环境
```bash
#!/bin/bash

echo "开始检测是否已经安装jdk……"
javaPath=`sudo update-alternatives --list java`
if [ -e $javaPath ]; then
        echo "java的路径是:$javaPath"
else
        echo 'jdk不存在 开始下载jdk17'
        sudo apt update
        sudo apt install openjdk-17-jdk
        sudo update-alternatives --list java
        echo "export JAVA_HOME=${javaPath}" >> ~/.bashrc
fi
```


