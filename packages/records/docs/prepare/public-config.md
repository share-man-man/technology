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

### git 多环境

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
   [includeIf "gitdir:{path}/self/"]
     path = {path}/self/.gitconfig-self
   ```

3. 创建`~/.gitconfig`中配置的私有配置

   > {path}/company-a/.gitconfig-a

   ```txt
   [user]
   name = aaaa
   email = aaaa@compa.com
   ```

   > {path}/company-b/.gitconfig-b

   ```txt
   [user]
   name = bbb
   email = bbb@compb.com
   ```

   > {path}/selft/.gitconfig-self

   ```txt
   [user]
   name = user
   email = user@gmail.com
   ```

## ssh key 配置

### ssh 多环境

1. 进入用户根目录，创建.ssh 文件夹

   ```shell
   cd ~/
   mkdir .ssh
   cd .ssh
   ```

2. 生成 github、gitlab 环境 ssh key

   ```shell
   ssh-keygen -t ed25519 -C "usera@github.com"
   ```

3. 输入生成的文件名:**github_rsa**(可自定义)

4. 输入加密密码（可以不输入密码）

5. 打开.ssh/github_rsa.pub，并复制里面的内容

6. 进入 github 的个人设置的 ssh key，并粘贴刚刚复制的内容

7. 同样的方式生成 gitlab 的配置（注意邮箱、文件名要修改）

8. 创建配置文件

   ```shell
   touch config
   ```

9. 修改配置文件

   ```text
   # gitlab
   Host gitlab.com
       HostName gitlab.com
       PreferredAuthentications publickey
       IdentityFile ~/.ssh/gitlab_rsa
   # github
   Host github.com
       HostName github.com
       PreferredAuthentications publickey
       IdentityFile ~/.ssh/github_rsa
   ```

10. 可以通过 ssh 下载 git 代码了

    > 第一次使用，没有 known_host 文件或索引，会询问**This key is not known by any other names**，输入 **yes** 即可

    ```shell
    git clone git@github.com:usera/proa-ae.git
    ```

11. 已经通过 https 下载的仓库，修改 git 远程仓库地址

    ```shell
    git remote set-url origin git@github.com:usera/proa-ae.git
    ```
