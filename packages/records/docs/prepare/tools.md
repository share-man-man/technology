# 开发工具

- **_chrome 及常用插件_**

  > 开发必备，最好和 google 账户绑定，翻墙后自动同步配置和插件

  - FeHelper（可快速查看 json，不用进入 ide 或在线 json 网站）
  - Proxy SwitchyOmega（根据域名，自动判断是否用梯子访问）
  - Xswitch、react-tools、vue-tools 根据需求自行安装

- **_PostMan_**

  接口调试神器

- **_vscode_**

  前端开发主流工具，以下是我常用的 vscode 配置，绑定 github 账户后自动同步

  ```json
  {
    // eslint配置
    "editor.codeActionsOnSave": {
      // "source.fixAll": false,
      // "source.fixAll.eslint": true
    },
    //  #让prettier使用eslint的代码格式进行校验
    // "prettier.eslintIntegration": true,
    "vetur.format.defaultFormatter.html": "js-beautify-html",
    // #让vue中的js按编辑器自带的ts格式进行格式化
    "vetur.format.defaultFormatter.js": "vscode-typescript",
    "vetur.format.defaultFormatterOptions": {
      "js-beautify-html": {
        "wrap_attributes": "force-aligned"
        // #vue组件中html代码格式化样式
      }
    },
    "workbench.colorCustomizations": {},
    "workbench.editor.enablePreview": false,
    "explorer.compactFolders": false,
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "javascript.updateImportsOnFileMove.enabled": "always",
    "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "typescript.updateImportsOnFileMove.enabled": "always",
    "[html]": {
      "editor.defaultFormatter": "vscode.html-language-features"
    },
    "[vue]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "gitlens.advanced.messages": {
      "suppressFileNotUnderSourceControlWarning": true
    },
    "[jsonc]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "workbench.editor.showTabs": true,
    "editor.minimap.enabled": true,
    "editor.renderWhitespace": "all",
    "[json]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[markdown]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "gitlens.views.branches.branches.layout": "list",
    "git.autofetch": true,
    "[less]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "leetcode.endpoint": "leetcode-cn",
    "leetcode.defaultLanguage": "javascript",
    "leetcode.hint.configWebviewMarkdown": false,
    "leetcode.workspaceFolder": "/Users/shuxiaoman/Documents/projects/_self/leetcode",
    "leetcode.hint.commandShortcut": false,
    "mssql.connections": [
      {
        "server": "{{put-server-name-here}}",
        "database": "{{put-database-name-here}}",
        "user": "{{put-username-here}}",
        "password": "{{put-password-here}}"
      }
    ],
    "git.confirmSync": false,
    "security.workspace.trust.untrustedFiles": "open",
    "[css]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "diffEditor.ignoreTrimWhitespace": false,
    "editor.unicodeHighlight.allowedLocales": {
      "ja": true
    },
    "terminal.integrated.profiles.windows": {
      "PowerShell": {
        "source": "PowerShell",
        "icon": "terminal-powershell"
      },
      "Command Prompt": {
        "path": [
          "${env:windir}\\Sysnative\\cmd.exe",
          "${env:windir}\\System32\\cmd.exe"
        ],
        "args": [],
        "icon": "terminal-cmd"
      },
      "Git Bash": {
        "source": "Git Bash"
      },
      "Ubuntu20.04LTS (WSL)": {
        "path": "C:\\WINDOWS\\System32\\wsl.exe",
        "args": ["-d", "Ubuntu20.04LTS"]
      }
    },
    "terminal.integrated.defaultProfile.windows": "Ubuntu (WSL)",
    "gitlens.views.tags.branches.layout": "list",
    "github.copilot.enable": {
      "*": true,
      "yaml": false,
      "plaintext": false,
      "markdown": false,
      "javascript": true,
      "typescript": false,
      "vue": false
    },
    "editor.inlineSuggest.enabled": true,
    "window.confirmBeforeClose": "always",
    "workbench.colorTheme": "Community Material Theme Palenight High Contrast",
    "code-runner.executorMap": {
      "javascript": "node",
      "java": "cd $dir && javac $fileName && java $fileNameWithoutExt",
      "c": "cd $dir && gcc $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
      "cpp": "cd $dir && g++ $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
      "objective-c": "cd $dir && gcc -framework Cocoa $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
      "php": "php",
      "python": "python -u",
      "perl": "perl",
      "perl6": "perl6",
      "ruby": "ruby",
      "go": "go run",
      "lua": "lua",
      "groovy": "groovy",
      "powershell": "powershell -ExecutionPolicy ByPass -File",
      "bat": "cmd /c",
      "shellscript": "bash",
      "fsharp": "fsi",
      "csharp": "scriptcs",
      "vbscript": "cscript //Nologo",
      "typescript": "ts-node",
      "coffeescript": "coffee",
      "scala": "scala",
      "swift": "swift",
      "julia": "julia",
      "crystal": "crystal",
      "ocaml": "ocaml",
      "r": "Rscript",
      "applescript": "osascript",
      "clojure": "lein exec",
      "haxe": "haxe --cwd $dirWithoutTrailingSlash --run $fileNameWithoutExt",
      "rust": "cd $dir && rustc $fileName && $dir$fileNameWithoutExt",
      "racket": "racket",
      "scheme": "csi -script",
      "ahk": "autohotkey",
      "autoit": "autoit3",
      "dart": "dart",
      "pascal": "cd $dir && fpc $fileName && $dir$fileNameWithoutExt",
      "d": "cd $dir && dmd $fileName && $dir$fileNameWithoutExt",
      "haskell": "runhaskell",
      "nim": "nim compile --verbosity:0 --hints:off --run",
      "lisp": "sbcl --script",
      "kit": "kitc --run",
      "v": "v run",
      "sass": "sass --style expanded",
      "scss": "scss --style expanded",
      "less": "cd $dir && lessc $fileName $fileNameWithoutExt.css",
      "FortranFreeForm": "cd $dir && gfortran $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
      "fortran-modern": "cd $dir && gfortran $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
      "fortran_fixed-form": "cd $dir && gfortran $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
      "fortran": "cd $dir && gfortran $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
      "sml": "cd $dir && sml $fileName"
    },
    "terminal.integrated.defaultProfile.linux": "zsh",
    "window.title": "${rootName}",
    "debug.javascript.autoAttachFilter": "onlyWithFlag",
    "[nginx]": {
      "editor.defaultFormatter": "ahmadalli.vscode-nginx-conf"
    },
    "[dockerfile]": {
      "editor.defaultFormatter": "ms-azuretools.vscode-docker"
    },
    "auto-close-tag.activationOnLanguage": [
      "xml",
      "php",
      "blade",
      "ejs",
      "jinja",
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact",
      "plaintext",
      "markdown",
      "vue",
      "liquid",
      "erb",
      "lang-cfml",
      "cfml",
      "HTML (EEx)",
      "HTML (Eex)",
      "plist"
    ]
  }
  ```

- **_SwitchHost_**

  本地域名快速解析

- **_Docker Desktop_**

  图形化管理 docker

- **_Ideal_**

  > [破解教程](https://www.exception.site/essay/idea-reset-eval)，仅供学习

  后端 java 开发主流工具，前端开发可不管

- **_DataGrip_**

  > [破解教程](https://www.exception.site/essay/idea-reset-eval)，仅供学习。这个教程的激活码只能破解 ideal，需要另外搜索一个 datagrip 的激活码

  数据库管理工具 gui，ideal 有内置。前端开发可不管

- **_mkcert_**

  本地 https 证书，[安装教程](https://github.com/FiloSottile/mkcert)
