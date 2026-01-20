# WebUploader Plus 文档

这是 WebUploader Plus 项目的完整开源文档，使用 VitePress 构建。

## 快速开始

### 开发模式

在项目根目录运行：

```bash
npm run docs:dev
```

或进入 doc 目录：

```bash
cd doc
npm install  # 首次运行需要安装依赖
npm run dev
```

文档将在 `http://localhost:5173` 运行。

### 构建文档

```bash
npm run docs:build
```

构建产物将生成在 `doc/.vitepress/dist` 目录。

### 预览构建

```bash
npm run docs:preview
```

## 文档结构

```
doc/
├── .vitepress/
│   └── config.js          # VitePress 配置
├── index.md               # 首页
├── guide/                 # 指南
│   ├── getting-started.md # 快速开始
│   ├── installation.md    # 安装
│   ├── configuration.md   # 配置选项
│   ├── file-upload.md     # 文件上传
│   ├── chunk-upload.md    # 分片上传
│   └── image-processing.md # 图片处理
├── api/                   # API 参考
│   ├── overview.md        # 概览
│   ├── uploader-config.md # 配置选项
│   ├── methods.md         # 实例方法
│   ├── events.md          # 事件系统
│   └── file-object.md     # 文件对象
├── dev/                   # 开发指南
│   ├── setup.md           # 环境搭建
│   ├── architecture.md    # 项目架构
│   └── contributing.md    # 贡献指南
└── faq.md                 # 常见问题
```

## 文档内容

### 指南 (Guide)

面向用户的使用指南，包括：

- **快速开始**: 5 分钟快速上手
- **安装**: 详细的安装步骤
- **配置选项**: 所有配置选项详解
- **文件上传**: 基本文件上传流程
- **分片上传**: 大文件分片上传配置
- **图片处理**: 图片压缩、缩略图等功能

### API 参考 (API)

完整的 API 文档，包括：

- **概览**: API 概述和快速导航
- **配置选项**: 所有配置参数详解
- **实例方法**: 所有可用的实例方法
- **事件系统**: 事件监听和触发
- **文件对象**: 文件对象属性和方法

### 开发指南 (Dev)

面向贡献者的开发文档：

- **环境搭建**: 开发环境配置
- **项目架构**: 架构设计说明
- **贡献指南**: 如何贡献代码

### 其他

- **常见问题 (FAQ)**: 常见问题解答

## 文档编写规范

### Markdown 语法

使用标准 Markdown + VitePress 扩展语法：

#### 代码块

\`\`\`javascript
var uploader = WebUploader.create({
  pick: '#filePicker',
  server: '/upload'
});
\`\`\`

#### 提示框

\`\`\`::: tip 提示
这是一个提示信息
:::

::: warning 警告
这是一个警告信息
:::

::: danger 危险
这是一个危险警告
:::
\`\`\`

#### 代码组

\`\`\`::: code-group

\`\`\`bash [npm]
npm install
\`\`\`

\`\`\`bash [yarn]
yarn install
\`\`\`

:::
\`\`\`

### 文档风格

1. **清晰简洁**: 使用简单明了的语言
2. **代码示例**: 提供完整可运行的代码示例
3. **链接引用**: 相关内容提供链接
4. **中英文结合**: 中文为主，关键术语保留英文

## 部署

### GitHub Pages

在 `.vitepress/config.js` 中配置 base：

```javascript
export default defineConfig({
  base: '/webuploader-plus/', // 仓库名
  // ...
})
```

构建并部署：

```bash
npm run docs:build
cd doc/.vitepress/dist
git init
git add -A
git commit -m 'deploy docs'
git push -f git@github.com:username/webuploader-plus.git main:gh-pages
```

### Vercel / Netlify

直接导入 GitHub 仓库，配置：

- **Build Command**: `npm run docs:build`
- **Output Directory**: `doc/.vitepress/dist`

## 维护

### 更新文档

1. 编辑对应的 markdown 文件
2. 本地预览确认无误
3. 提交 Pull Request

### 添加新页面

1. 在对应目录创建 markdown 文件
2. 在 `.vitepress/config.js` 的 sidebar 中添加链接
3. 确保页面链接正确

### 检查链接

使用工具检查死链：

```bash
npx markdown-link-check doc/**/*.md
```

## 相关资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [项目主页](../)

## 许可证

BSD License - 与主项目相同。
