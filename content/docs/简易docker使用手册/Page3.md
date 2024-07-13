---
title: 保存与构建镜像
weight: 3
---

## 保存

docker save 可以将一个镜像打包成tar包，以便于你发布它
~~~shell
docker save -o name_of_image.tar image:tag
~~~

docker commit 可以将一个正在运行的容器保存成镜像，当然这会保存这个容器当前的所有状态，请不要在发布镜像时这么做喔
~~~shell
docker commit container_id image:tag
~~~

## 构建镜像

利用dockerfile实现镜像打包，详细的使用方式可见[官方文档](https://docs.docker.com/engine/reference/builder/)

build时可以选择上传的缓存目录，像这样`docker build -f dockerfile -t image:new_tag .`，最后的`.`即表示使用当前目录作为缓存上传。

镜像构建通常用于去掉一些不必要的layer，来尽可能减小镜像体积，并且将变动层置后，有利于镜像仓库更好的管理。[资料](https://docs.docker.com/build/guide/layers/)

在自动化构建中，还可以利用多次FROM实现隔离，只选取必要的内容添加到最终的镜像里。


