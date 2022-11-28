# 操作系统-windows

- 避免 Git 每次输出用户名、密码

  ```bash
  git config credential.helper store
  ```

## windows 开发环境

1. 微软商店安装 ubuntu、windows terminal
2. 将 ubuntu 升级为 wsl2
3. clash 开启允许局域网
4. 检查系统里的 shell

   ```shell
   cat /etc/shells
   ```

5. 安装 zsh

   ```shell
   apt install zsh #安装 zsh
   chsh -s /bin/zsh #将 zsh 设置成默认 shell（不设置的话启动 zsh 只有直接 zsh 命令即可）
   ```

6. 添加脚本

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

7. 打开 ubuntu，设置密码
8. windows terminal 开启梯子
9. 安装 yarn、nvm、node、git 等
10. 安装 git-cz 提交工具

    ```shell
    npm install -g commitizen && npm install -g cz-conventional-changelog
    echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
    ```
