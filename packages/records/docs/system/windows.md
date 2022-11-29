# 操作系统-windows

- 避免 Git 每次输出用户名、密码

  ```bash
  git config credential.helper store
  ```

## windows 开发环境

1. 安装虚拟环境：应用\启用或关闭 windows 功能
   - 勾选 适用于 Linux 的子系统、虚拟机平台
2. 微软商店安装 ubuntu、windows terminal
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

9. 更新 apt

   ```shell
   apt update
   ```

10. 检查系统里的 shell

    ```shell
    cat /etc/shells
    ```

11. 安装 zsh

    ```shell
    apt install zsh #安装 zsh
    chsh -s /bin/zsh #将 zsh 设置成默认 shell（不设置的话启动 zsh 只有直接 zsh 命令即可）
    ```

12. 添加脚本

    ```shell
     vpnon(){
       hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*');
       export https_proxy="http://${hostip}:7890";
       export http_proxy="http://${hostip}:7890";
       echo "${hostip}";
       echo "梯子-开";
     }
     vpnoff(){
       unset https_proxy;
       unset http_proxy;
       echo "梯子-关";
     }
    ```

13. windows terminal 开启梯子
14. 安装 yarn、nvm、node、git 等
15. 安装 git-cz 提交工具

    ```shell
    npm install -g commitizen && npm install -g cz-conventional-changelog
    echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
    ```
