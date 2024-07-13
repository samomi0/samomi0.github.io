---
title: 拉取与推送镜像
weight: 1
---

## 拉取镜像

通常可以在[DockerHub](https://hub.docker.com/)这里搜索你想要的镜像

~~~shell
docker pull ubuntu:20.04
~~~
或者指定sha来拉取特定版本(例如armv8的版本)
~~~shell
docker pull ubuntu:20.04@sha256:0b897358ff6624825fb50d20ffb605ab0eaea77ced0adb8c6a4b756513dec6fc
~~~

## 推送镜像

一般情况下都会需要先登录到希望推送的仓库(示例registry.myharbor.com)
~~~shell
docker login -u user registry.myharbor.com
~~~

~~~shell
docker push registry.myharbor.com/ubuntu:focal
~~~

## 如何换源

也许会需要用到代理，或者干脆使用国内的源

*目前国内源（例如阿里云）基本上只支持少量的公共镜像下载，如果是本地机器，建议走代理下载。*

这里以华为云举例，打开docker的配置文件，如果是新安装的docker，这里可能没有这个文件，创建一个就可以。

~~~shell
sudo vim /etc/docker/daemon.json
~~~

填入我们想加入的源，例如华为云：`https://mirrors.huaweicloud.com/`，像这样：

~~~json
{
  "registry-mirrors": [ 
    "https://mirrors.huaweicloud.com/"
  ]
}
~~~

然后重启docker服务：

~~~shell
sudo systemctl daemon-reload
sudo systemctl restart docker
~~~

这样就完成了换源操作。

