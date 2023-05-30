# 常用配置

## 安装常用工具

- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- [pnpm](https://pnpm.io/zh/)
- [yarn](https://yarnpkg.com/getting-started/install)
- [git](https://git-scm.com/downloads)（mac 自带，wsl 需要安装）

## node 版本配置

```sh
# 其他版本根据业务需求自行安装
nvm install 16
```

## git 配置

- 避免 git 每次 commit 都要输入用户名、密码

  ```sh
  git config credential.helper store
  ```

- 规范 commit 信息

  ```sh
  # 所有项目默认使用angular的模板，不同公司要求模板不同，可在项目根目录单独设置 .czrc
  npm install -g commitizen cz-conventional-changelog --registry=https://registry.npmmirror.com
  echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
  ```
