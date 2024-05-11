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

### 区分公司项目、个人项目

> 在不同目录，提交代码时，使用不同的 user.name 和 user.email

```txt
.
├── company-a    // A公司项目
│   ├── proj1
│   ├── proj2
├── company-b   // B公司项目
│   ├── proj3
│   ├── proj4
└── self        // 个人项目
    ├── proj5
```

1. 打开 git 全局配置:~/.gitconfig
2. 添加 includeIf 配置，[官方文档](https://git-scm.com/docs/git-config#_example)

   > 自行替换{path}地址

   ```txt
   [credential]
     helper = store
   [includeIf "gitdir:{path}/company-a/"]
     path = {path}/company-a/.gitconfig-a
   [includeIf "gitdir:{path}/company-b/"]
     path = {path}/company-b/.gitconfig-b
   [includeIf "gitdir:{path}/selft/"]
     path = {path}/selft/.gitconfig-self
   ```

3. 创建`~/.gitconfig`中配置的私有配置

   > {path}/company-a/.gitconfig-a

   ```txt
   [user]
   name = aaaa
   email = aaaa@compa.com
   ```

   > {path}/company-a/.gitconfig-b

   ```txt
   [user]
   name = bbb
   email = bbb@compb.com
   ```

   > {path}/company-a/.gitconfig-a

   ```txt
   [user]
   name = user
   email = user@gmail.com
   ```
