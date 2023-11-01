---
title: 从零开始的Ubuntu20.04
author: Misaki
date: 2023-10-28
category: Jekyll
layout: post
---

## 一切的开始

选择虚拟机作为载体安装系统，这里我使用`VirtualBox`，原因嘛，主要是免费。你可以在[Oracle官网](https://www.virtualbox.org/wiki/Downloads)下载到它。当然，[清华源](https://mirrors.tuna.tsinghua.edu.cn/virtualbox/)也是有提供的。

然后我们要下载一个Ubuntu20.04的ISO映像文件，同样可以在[清华源](https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/)下载到。

然后就可以安装虚拟机了。

>tips：安装系统时可能会遇到分辨率过低导致页面内容显示不完整的情况，可以用`xrandr`命令来切换分辨率。例如：`xrandr -s 7`，这里7表示第8个分辨率选项。

## 一些基础的工具

现在我们有了一个最小的ubuntu20，在安装一切之前，我们需要先解决网络问题（源和代理）。

### 源

从[清华源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)获取到ubuntu20的apt源，并更新系统配置。

>Notes：这里建议把使用`是否使用 HTTPS`选择否，可以避免一些证书问题。更换ubuntu版本，然后就可以复制粘贴了。这里示例ubuntu20的源。
>
>~~~
>deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
>deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
>deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
>deb http://security.ubuntu.com/ubuntu/ focal-security main restricted universe multiverse
>~~~
>
>tips1：VirtualBox可能出现全屏时分辨率与屏幕不吻合的情况，可以参考这个方案解决。
>
>1. 关闭虚拟机，在`控制器：IDE`处导入增强功能驱动
>2. 开启虚拟机，在屏幕底部（或顶部）的小工具栏选择`设备`->`安装增强功能`
>3. 可能需要重启
>
>tips2：VirtualBox可能出现开启双向粘贴板/拖放但实际上失效的情况，可以参考这个方案解决。
>
>1. 关闭虚拟机，在管理器选择`设置`->`存储`->`控制器：SATA`，勾选右侧的`使用主机输入输出(I/O)缓存`
>2. 选择`控制器：SATA`下方硬盘，勾选右侧的`固态驱动器`
>3. 在`控制器：IDE`处导入增强功能驱动
>4. 开启虚拟机，在文件系统打开驱动目录，运行可执行文件重新安装增强功能
>5. 可能需要重启

使用`sudo vi /etc/apt/source.list`并把源写入，然后执行`sudo apt update`更新配置。

### 基础工具

这里会安装`vim`、`docker`、`curl`、`git`

~~~shell
sudo apt-add-repository "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update && apt install -y vim curl git ca-certificates curl gnupg lsb-release docker-ce
~~~

docker因为sudo权限的关系，平时使用可以将用户加入docker用户组，这里可能需要重启生效。

~~~shell
newgrp docker
sudo groupadd docker
sudo usermod -aG docker <username>
~~~

接下来安装zsh + oh-my-zsh + p10k + 插件

~~~shell
sudo apt update && apt-get install zsh -y
wget https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh
sudo chmod +x install.sh
~~~

将`install.sh`中REPO和REMOTE

~~~
# Default settings
ZSH=${ZSH:-~/.oh-my-zsh}
REPO=${REPO:-ohmyzsh/ohmyzsh}
REMOTE=${REMOTE:-https://github.com/${REPO}.git}
BRANCH=${BRANCH:-master}
~~~

替换为：

~~~
REPO=${REPO:-mirrors/oh-my-zsh}
REMOTE=${REMOTE:-https://gitee.com/${REPO}.git}
~~~

然后执行脚本，就会自动下载oh my zsh了，下载好之后会开始初始化。

然后我们下载p10k主题和插件：

~~~shell
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
~~~

在`.zshrc`（通常是home目录）中修改theme和添加插件：

~~~
ZSH_THEME="powerlevel10k/powerlevel10k"

plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
~~~

### 设置代理

* 设置docker代理

  ```shell
  sudo mkdir -p /etc/systemd/system/docker.service.d
  sudo touch /etc/systemd/system/docker.service.d/proxy.conf
  ```

  在这个`proxy.conf`文件（可以是任意`*.conf`的形式）中，添加以下内容：

  *这里`http://proxy.example.com:8080/`是自己的代理转发地址*

  ```
  [Service]
  Environment="HTTP_PROXY=http://proxy.example.com:8080/"
  Environment="HTTPS_PROXY=http://proxy.example.com:8080/"
  Environment="NO_PROXY=localhost,127.0.0.1,.example.com"
  ```
  
  接下来重启docker服务就可以了`sudo systemctl restart docker`

* 设置clash代理

  从github release页面下载，运行`cfw`可执行文件启动clash

  ~~~
  https://github.com/Fndroid/clash_for_windows_pkg/releases
  ~~~

  建议配合firefox的`SwitchyOmega`插件实现页面的自动代理模式。

* 设置git代理

  ~~~shell
  git config --global http.proxy http://proxy.example.com:8080/
  git config --global https.proxy https://proxy.example.com:8080/
  ~~~

### 安装vscode

国内下载可以替换域名为：`vscode.cdn.azure.cn`

____

好了，现在你有了一个最基础的Ubuntu20.04开发环境了，享受代码的乐趣吧。
