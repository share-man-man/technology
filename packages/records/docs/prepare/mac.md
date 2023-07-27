# mac 篇

## 配置 zsh

> 记得 source ~/.zshrc 使配置生效

```sh
# vscode打开nginx配置
ngc() {
  code /opt/homebrew/etc/nginx/nginx.conf
}

# vpn脚本
vo() {
  export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
  echo "开启了zsh代理"
}
vf() {
  unset http_proxy
  unset https_proxy
  unset all_proxy
  echo "关闭了zsh代理"
}

# homebrew 清华镜像
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_PIP_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"
# homebrew end

# pnpm 别名
alias pn=pnpm

# 自动生成的 jetbrain 破解脚本
___MY_VMOPTIONS_SHELL_FILE="${HOME}/.jetbrains.vmoptions.sh"
if [ -f "${___MY_VMOPTIONS_SHELL_FILE}" ]; then . "${___MY_VMOPTIONS_SHELL_FILE}"; fi
# 破解脚本 end

```

## 安装包管理工具 homebrew

1. 打开 ClashX，打开：设置为系统代理
2. 下载 homebrew

   ```sh
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

## 安装工具

nginx

```sh
brew install nginx
```

7zip

```sh
brew install p7zip
```
