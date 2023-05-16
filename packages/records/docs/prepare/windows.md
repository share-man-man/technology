# windows 篇

## 安装 linux 虚拟机

> 原因：主流开发选择 unix、类 uniux 系统，导致 powershell 生态不好，兼容性不佳，很多工具不能在 windows 上运行。比如[阿里低代码引擎](https://lowcode-engine.cn/site/docs/guide/quickStart/start#wslwindow-%E7%94%B5%E8%84%91)

1. 安装虚拟环境：应用\启用或关闭 windows 功能
   - 勾选 适用于 Linux 的子系统、虚拟机平台
2. 微软商店安装 ubuntu、windows terminal
   > ubuntu 是 linux 的发行版本
3. 在 powershell 里将 ubuntu 升级为 wsl2

   ```shell
   wsl --set-default-version 2
   ```

4. clash 开启允许局域网
5. 开启防火墙

   1. 控制面板\系统和安全\Windows Defender 防火墙\允许的应用
   2. 勾选 clash

6. 打开 ubuntu，设置密码
7. 切换管理员

   ```shell
   sudo su
   ```

8. ubuntu 更换国内源，否则经常出现安装失败

   1. 备份原始源文件

      ```shell
      sudo cp /etc/apt/sources list /etc/apt/sources.list.bak
      ```

   2. 更改文件权限使其可编辑

      ```shell
      sudo chmod 777 /etc/apt/sources.list
      ```

   3. 查看 ubuntu 版本

      ```shell
      cat /etc/issue
      ```

   4. 根据版本配置镜像（推荐阿里镜像）

      - ubuntu 16

        ```text
        deb http://mirrors.aliyun.com/ubuntu/ xenial main
        deb-src http://mirrors.aliyun.com/ubuntu/ xenial main
        deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main
        deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main
        deb http://mirrors.aliyun.com/ubuntu/ xenial universe
        deb-src http://mirrors.aliyun.com/ubuntu/ xenial universe
        deb http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
        deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
        deb http://mirrors.aliyun.com/ubuntu/ xenial-security main
        deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main
        deb http://mirrors.aliyun.com/ubuntu/ xenial-security universe
        deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security universe
        ```

      - ubuntu 18

        ```text
        deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
        deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse

        deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
        deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse

        deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
        deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse

        deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
        deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse

        deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
        deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
        ```

      - ubuntu 20

        ```text
          deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
          deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse

          deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
          deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse

          deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
          deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse

          deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
          deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse

          deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
          deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
        ```

## 更新、安装工具

1. 更新 apt

   ```shell
   apt update
   ```

2. 检查系统里的 shell

   ```shell
   cat /etc/shells
   ```

3. 安装 zsh

   ```shell
   apt install zsh #安装 zsh
   chsh -s /bin/zsh #将 zsh 设置成默认 shell（不设置的话启动 zsh 只有直接 zsh 命令即可）
   ```

4. 配置 .zshrc

   > 记得 source ~/.zshrc 使配置生效

   ```sh
   vo() {
      hostip=$(cat /etc/resolv.conf | grep -oP '(?<=nameserver\ ).*')
      export https_proxy="http://${hostip}:7890"
      export http_proxy="http://${hostip}:7890"
      echo "${hostip}"
      echo "梯子-开"
   }

   vf() {
      unset https_proxy
      unset http_proxy
      echo "梯子-关"
   }

   alias pn=pnpm
   ```

5. 安装 pnpm、yarn、nvm、git 等工具

   > 很多都需要梯子

## 常用配置

1. 避免 git 每次 commit 都要输入用户名、密码

   ```bash
   git config credential.helper store
   ```

2. 安装 git-cz 提交工具

   ```shell
   # 所有项目默认使用angular的模板，不同公司要求模板不同，可在项目根目录单独设置 .czrc
   npm install -g commitizen cz-conventional-changelog --registry=https://registry.npmmirror.com
   echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
   ```

## 常见问题

### wsl2 不能连接网络

1. 安装 docker 后，**_curl <https://baidu.com> _** 或者 **_pnpm、yarn 等安装时，网络连接超时_**
2. [github 解决办法](https://github.com/microsoft/WSL/issues/5336#issuecomment-653881695)
