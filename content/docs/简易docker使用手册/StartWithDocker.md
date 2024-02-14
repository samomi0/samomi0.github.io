---
title: 基础操作
weight: 1
---

## 如何换源

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

## 开发

* 拉取与推送镜像

  ~~~
  docker pull image:tag
  
  docker login -u <username> <harbor_host>
  docker push image:tag
  ~~~

* 部署镜像

​	简单的示例：`docker run -ti --rm --net=host --name=test image:tag`

​	示例常见参数：

| 参数名       | 功能                                                         |
| ------------ | ------------------------------------------------------------ |
| `-ti`        | t和i两个参数通常一起使用，交互式启动容器                     |
| `--rm`       | 停止容器后自动删除，常见于开发时，避免旧容器堆积             |
| `--net=host` | 与-p重叠，使用宿主机网卡，映射全部端口                       |
| `-p`         | -p port:port，映射容器内端口到宿主机端口，可以批量指定       |
| `--name`     | 为容器设置名称，默认会使用一个hash值作为容器名               |
| `-v`         | 挂载外部目录到容器内，会覆盖容器内已存在的目录。好处是可以外部修改或即时备份，可以利用挂载实现一些动态效果 |

还有很多有用参数可见[Docker官方文档](https://docs.docker.com/engine/reference/commandline/run/)

* 构建镜像

  利用dockerfile实现镜像打包，详细的使用方式可见[官方文档](https://docs.docker.com/engine/reference/builder/)

  build时可以选择上传的缓存目录，像这样`docker build -f dockerfile -t image:new_tag .`，最后的`.`即表示使用当前目录作为缓存上传。

  镜像构建通常用于去掉一些不必要的layer，来尽可能减小镜像体积，并且将变动层置后，有利于镜像仓库更好的管理。[资料](https://docs.docker.com/build/guide/layers/)

  在自动化构建中，还可以利用FROM实现多次容器的打包，即区分开发镜像与运行时镜像。


