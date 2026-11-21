# 用 GitHub Desktop 发布作品集

本教程针对当前工程。自动部署文件已放在 `.github/workflows/deploy-pages.yml`，不会改变页面设计。

## 1. 添加现有项目

打开 GitHub Desktop，登录你的 GitHub 账号。

点击 File → Add local repository，选择：

```text
C:\Users\gaoyi\Documents\ChatGPT\workbook
```

点 Add repository。这里已有 Git 仓库，不需要创建新项目或重新复制文件。

## 2. 提交本机文件

左侧 Changes 会显示源码和图片等文件。这是首次提交，文件很多属于正常情况。

左下角 Summary 填 `Publish portfolio`，然后点击 Commit to master（如果显示 main，就点 Commit to main）。

这一步只保存到本机。

## 3. 发布到 GitHub

点击 Publish repository。

Name 必须填写：

```text
你的GitHub用户名.github.io
```

例如用户名为 `example-user`，仓库名就是 `example-user.github.io`。这里是登录用户名，不是中文昵称、邮箱或随意取的网站名称。

本工程保留了以 `/assets/` 开头的资源地址，所以本次使用这个个人主页仓库名。不要随意改为 `portfolio` 等带子目录的项目站点名称，否则需要另行适配资源路径。

取消勾选 Keep this code private，选择发布到你自己的账号，再点击 Publish repository。免费方案这里使用公开仓库，源码和公开资源也会被他人看到；不要把账号凭据或原始私人资料额外放入项目。

如果提示同名仓库已存在，先检查那个仓库的用途，不要删除或覆盖。把提示告诉我，再决定如何连接已有仓库。

## 4. 开启 GitHub Pages

上传成功后，在 Desktop 点击 View on GitHub。

进入仓库页面：

1. Settings → 左侧 Pages。
2. 找到 Build and deployment。
3. 将 Source 选择为 GitHub Actions。
4. 不需要另外套用模板工作流，本项目已经包含部署文件。

首次上传可能早于 Pages 设置完成，导致第一次任务失败。这时继续下一步手动运行即可。

## 5. 运行部署

打开仓库上方 Actions。

左侧选择 Deploy portfolio to GitHub Pages。

点击 Run workflow，选择刚刚提交的分支（master 或 main），再点绿色 Run workflow。

等待 build 和 deploy 都变成绿色。然后回到 Settings → Pages，查看 Visit site，或点击部署任务里的页面地址。

正常地址为：

```text
https://你的GitHub用户名.github.io/
```

如果找不到工作流或 Run workflow：

- 确认 `.github/workflows/deploy-pages.yml` 已上传到 GitHub。
- 确认当前查看的是仓库默认分支。
- 若 Actions 被禁用，按仓库页面提示启用。

若部署提示分支不允许发布，检查 Settings → Environments → github-pages 的部署分支规则是否允许实际使用的 main 或 master。

## 6. 验收

用手机流量和另一台电脑访问，检查：

- 首页视频、个人照片正常。
- 所有项目详情和轮播图正常。
- 下载简历可用。
- 页面刷新正常。
- 浏览器没有HTTPS警告。

GitHub Pages 的公开部署完成不等于国内所有网络都已验证可达。请让不同地区的朋友实测，再决定是否适合长期使用。

## 7. 以后更新

我在本机帮你修改网站后：

1. 打开 Desktop 查看 Changes。
2. 填写修改说明，点击 Commit to master/main。
3. 点击 Push origin。
4. 到 GitHub 的 Actions 等待新一轮绿色部署完成。

工作流会自动安装依赖、构建、发布，不需要手工上传 dist，也不需要提交 dist.zip。

## 官方参考入口

- [GitHub Pages 入门](https://docs.github.com/en/pages/quickstart)
- [用 Desktop 添加本地仓库](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-a-repository-from-your-local-computer-to-github-desktop)
- [Vite 静态部署说明](https://vite.dev/guide/static-deploy.html)

本机已准备部署配置；尚未操作你的 GitHub 账号，也尚未验证线上部署结果。界面名称以你当前使用的 GitHub / Desktop 版本为准。
