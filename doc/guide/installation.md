# 安装

本章节详细介绍如何在项目中安装和引入 WebUploader Plus。

## 下载方式

WebUploader Plus 提供多种引入方式，您可以根据项目需求选择合适的方式。

### 方式一：CDN 引入（推荐用于快速测试）

直接通过 CDN 引入，无需下载和安装：

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/webuploader-plus@latest/dist/webuploader.css">
</head>
<body>
    <script src="https://unpkg.com/webuploader-plus@latest/dist/webuploader.js"></script>
</body>
</html>
```

::: tip 提示
CDN 方式适合快速测试和原型开发，生产环境建议下载到本地。
:::

### 方式二：NPM 安装

如果您使用 npm、yarn 或 pnpm 管理项目依赖：

::: code-group

```bash [npm]
npm install webuploader-plus
```

```bash [yarn]
yarn add webuploader-plus
```

```bash [pnpm]
pnpm add webuploader-plus
```

:::

安装后在项目中引入：

```javascript
import 'webuploader-plus/dist/webuploader.css'
import WebUploader from 'webuploader-plus'

// 使用 WebUploader
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload'
});
```

### 方式三：手动下载

1. 访问 [GitHub Releases](https://github.com/modstart-lib/webuploader-plus/releases)
2. 下载最新版本的压缩包
3. 解压并将 `dist` 目录放到项目中
4. 在 HTML 中引入：

```html
<link rel="stylesheet" href="path/to/dist/webuploader.css">
<script src="path/to/dist/webuploader.js"></script>
```

## 文件说明

下载后的 `dist` 目录包含以下文件：

```
dist/
├── webuploader.js          # 完整版（未压缩）
├── webuploader.min.js      # 完整版（已压缩，推荐）
├── webuploader.css         # 样式文件
├── webuploader.html5only.js # 仅 HTML5 版本
├── webuploader.flashonly.js # 仅 Flash 版本
└── Uploader.swf            # Flash 组件（可选）
```

### 版本选择

- **webuploader.js**: 包含 HTML5 和 Flash 两种运行时，兼容性最好
- **webuploader.html5only.js**: 仅包含 HTML5 运行时，体积更小，适合现代浏览器
- **webuploader.flashonly.js**: 仅包含 Flash 运行时，适合特殊兼容性需求

::: tip 推荐
大多数情况下使用 `webuploader.min.js`（完整版压缩版）即可，它会自动根据浏览器选择最佳运行时。
:::

## 项目集成

### 在原生 HTML 项目中使用

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="path/to/webuploader.css">
</head>
<body>
    <div id="uploader">
        <div id="filePicker">选择文件</div>
    </div>

    <script src="path/to/webuploader.js"></script>
    <script>
        var uploader = WebUploader.create({
            pick: '#filePicker',
            server: '/upload',
            auto: true
        });
    </script>
</body>
</html>
```

### 在 Vue 项目中使用

```vue
<template>
    <div class="uploader-container">
        <div id="filePicker">选择文件</div>
        <div id="fileList"></div>
    </div>
</template>

<script>
import 'webuploader-plus/dist/webuploader.css'
import WebUploader from 'webuploader-plus'

export default {
    name: 'FileUploader',
    mounted() {
        this.initUploader()
    },
    methods: {
        initUploader() {
            const uploader = WebUploader.create({
                pick: '#filePicker',
                server: '/upload',
                auto: false
            });

            uploader.on('fileQueued', (file) => {
                console.log('文件已添加:', file.name)
            });

            uploader.on('uploadSuccess', (file, response) => {
                console.log('上传成功:', response)
            });
        }
    }
}
</script>
```

### 在 React 项目中使用

```jsx
import React, { useEffect, useRef } from 'react'
import 'webuploader-plus/dist/webuploader.css'
import WebUploader from 'webuploader-plus'

function FileUploader() {
    const uploaderRef = useRef(null)

    useEffect(() => {
        uploaderRef.current = WebUploader.create({
            pick: '#filePicker',
            server: '/upload',
            auto: false
        });

        uploaderRef.current.on('fileQueued', (file) => {
            console.log('文件已添加:', file.name)
        });

        uploaderRef.current.on('uploadSuccess', (file, response) => {
            console.log('上传成功:', response)
        });

        return () => {
            uploaderRef.current?.destroy()
        }
    }, [])

    return (
        <div className="uploader-container">
            <div id="filePicker">选择文件</div>
            <div id="fileList"></div>
        </div>
    )
}

export default FileUploader
```

### 在 jQuery 项目中使用

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="path/to/webuploader.js"></script>
<script>
$(function() {
    var uploader = WebUploader.create({
        pick: '#filePicker',
        server: '/upload'
    });

    uploader.on('fileQueued', function(file) {
        var $li = $('<div id="' + file.id + '">').text(file.name);
        $('#fileList').append($li);
    });

    uploader.on('uploadSuccess', function(file, response) {
        $('#' + file.id).addClass('upload-success');
    });
});
</script>
```

## Flash 支持（可选）

如果需要支持旧版浏览器（如 IE 8-10），需要配置 Flash 组件：

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    
    // 指定 Flash SWF 文件路径
    swf: '/path/to/Uploader.swf',
    
    // 运行时优先级（HTML5 优先）
    runtimeOrder: 'html5,flash'
});
```

::: warning 注意
Flash 已于 2020 年底停止支持，现代浏览器默认禁用 Flash。建议仅在必要时才启用 Flash 运行时。
:::

## 依赖说明

WebUploader Plus 是一个独立的库，不依赖于其他库。但在某些场景下，您可能需要：

### jQuery（可选）

WebUploader Plus 内置了简单的 DOM 操作，但如果您的项目已经使用 jQuery，它会自动使用 jQuery：

```html
<!-- 可选：使用 jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="path/to/webuploader.js"></script>
```

### Promise polyfill（仅旧浏览器）

如果需要支持不支持 Promise 的旧浏览器（如 IE 11），需要引入 polyfill：

```html
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
```

## 验证安装

安装完成后，可以通过以下代码验证是否成功：

```javascript
console.log('WebUploader 版本:', WebUploader.version);
console.log('支持的运行时:', WebUploader.support);
```

如果控制台正常输出，说明安装成功。

## 常见问题

### 引入文件后报错？

检查以下几点：
1. 确保 CSS 和 JS 文件路径正确
2. 检查文件是否完整下载
3. 查看浏览器控制台的错误信息

### NPM 安装失败？

尝试以下方法：
1. 清除 npm 缓存：`npm cache clean --force`
2. 删除 `node_modules` 和 `package-lock.json`，重新安装
3. 使用淘宝镜像：`npm install --registry=https://registry.npmmirror.com`

### 如何在 TypeScript 项目中使用？

WebUploader Plus 包含 TypeScript 类型定义文件，可以直接使用：

```typescript
import WebUploader from 'webuploader-plus'

const uploader: WebUploader.Uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload'
});
```

## 下一步

安装完成后，您可以：

- 查看[快速开始](./getting-started.md)，了解基本用法
- 了解[配置选项](./configuration.md)，定制上传行为
- 查看 [API 文档](../api/overview.md)，掌握完整功能

如果遇到问题，请查看[常见问题](../faq.md)或在 [GitHub Issues](https://github.com/modstart-lib/webuploader-plus/issues) 提问。
