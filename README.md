# 高滢乔 · 产品作品集

React + Vite 单页作品集，包含视频首页、个人经历、四个精选项目、能力介绍和联系模块。

## 本地运行

```sh
npm install
npm run dev
```

终端显示本地预览地址。生产构建使用 `npm run build`，预览构建使用 `npm run preview`。

## 内容与资源

- `src/main.jsx`：个人介绍、经历、项目数据与页面交互。
- `src/styles.css`：视觉与响应式布局，版心最大宽度 1700px。
- `public/assets/`：真实项目原型、简历头像、简历 PDF、本地背景视频及静态封面。
- 项目卡片可打开详情，支持 Esc 关闭、邮箱复制与简历下载。
- 尊重系统减少动态效果设置，使用视频静态封面。
- 字体优先加载 Google Fonts，网络不可用时回退到系统中文字体。

内容依据提供的个人简历整理；未添加无来源的项目成果。网站默认展示简历中的邮箱和电话号码，并提供完整简历下载。

`npm run assets` 可从原始简历目录重新整理资源和生成背景视频，需要本机 Chrome，以及原始 `C:/Users/gaoyi/Desktop/Resume` 目录。正常运行网站不需要此步骤。

运行中的开发服务器可通过 `node scripts/verify.mjs` 检查，需要本机 Chrome。截图输出到 `artifacts/`。

## 部署到 Vercel

项目已包含 `vercel.json`，会自动运行 `npm run build` 并发布 `dist`。

```sh
npx vercel login
npx vercel deploy --prod
```

首次发布时关联自己的 Vercel 账号并创建项目。以后在此目录执行第二条命令即可更新网站，固定的生产地址保持不变。部署只需要项目内的文件，不依赖本机简历目录或本地开发服务器。
