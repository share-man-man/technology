# 安装 Flutter

1. 根据[官网流程](https://docs.flutter.dev/get-started/install/macos/mobile-ios)安装，会失败，是墙的问题，下载不了资源，解决办法为[替换国内镜像源](https://flutter.cn/community/china?tab=macos)
2. 执行 flutter doctor（提示需要安装 iOS 组件、cocoapods）
   - 正确结果：![正确结果](/flutter-doctor.png)
3. 安装 iOS 模拟器
   > 路径：Xcode->setting->platforms->iOS
   - ![xcode-platforms.png](/xcode-platforms.png)
4. 安装 cocoapods

   > 提示需要升级 ruby>=2.7，安装时间较长，加-V 方便查看进度

   - ```shell
     sudo gem install cocoapods -V
     ```

5. 安装 gpg2

   > rvm 官网提示用 gpg2 命令，实际用 gpg 就行

   - ```shell
     brew install gnupg2
     ```

6. 配置 gpg2

   - ```shell
     gpg2 --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
     ```

7. 验证链接

   - ```shell
     curl -sSL https://get.rvm.io | bash -s stable
     ```

8. 安装 ruby

   > 安装失败，openssl [版本问题](https://github.com/rvm/rvm/issues/5285#issuecomment-1623030117)

   - ```shell
     rvm install 2.7
     ```

9. 重新安装 ruby-2.7
10. 检查版本是否正确

    - ```shell
      ruby -v
      ```

11. 重新安装 cocoapods

    > 提示没有包 drb

    - ```shell
        gem install drb -V
      ```

12. 重新安装 cocoapods
13. flutter doctor 检查
