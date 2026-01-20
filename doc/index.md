---
layout: home

hero:
  name: "WebUploader Plus"
  text: "现代化文件上传组件"
  tagline: 基于 WebUploader 的增强版文件上传库，支持分片上传、断点续传、秒传、图片压缩等功能
  image:
    src: /logo.svg
    alt: WebUploader Plus
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/modstart-lib/webuploader-plus

features:
  - icon: 🎯
    title: 分片上传
    details: 支持大文件分片上传，突破服务器文件大小限制，提高上传成功率
  
  - icon: 🔄
    title: 断点续传
    details: 网络中断后自动续传，无需重新上传已完成的部分，节省时间和流量
  
  - icon: ⚡
    title: 秒传功能
    details: 通过 MD5 校验实现秒传，相同文件无需重复上传，极大提升用户体验
  
  - icon: 🖼️
    title: 图片处理
    details: 内置图片压缩、缩略图生成功能，支持尺寸调整和质量控制
  
  - icon: 📱
    title: 拖拽上传
    details: 支持拖拽文件到指定区域上传，同时支持粘贴剪贴板图片
  
  - icon: 📊
    title: 进度监控
    details: 实时显示上传进度、速度和状态，提供完善的事件回调机制
  
  - icon: 🔧
    title: 高度可配置
    details: 丰富的配置选项，支持自定义上传参数、验证规则和并发数
  
  - icon: 🌐
    title: 跨浏览器支持
    details: HTML5 为主，Flash 为辅，兼容现代浏览器和 IE 8+ 等旧版浏览器
  
  - icon: 🔌
    title: 易于集成
    details: 简单的 API 设计，几行代码即可集成到现有项目中，支持自定义上传逻辑
---

## 快速预览

### 基础用法

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/webuploader.css">
</head>
<body>
    <div id="uploader">
        <div id="filePicker">选择文件</div>
    </div>

    <script src="path/to/webuploader.js"></script>
    <script>
        var uploader = WebUploader.create({
            // 选择文件的按钮
            pick: '#filePicker',
            
            // 上传地址
            server: '/upload',
            
            // 允许的文件类型
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            
            // 自动上传
            auto: true
        });

        // 文件添加到队列
        uploader.on('fileQueued', function(file) {
            console.log('文件已添加：', file.name);
        });

        // 上传进度
        uploader.on('uploadProgress', function(file, percentage) {
            console.log('上传进度：', Math.round(percentage * 100) + '%');
        });

        // 上传成功
        uploader.on('uploadSuccess', function(file, response) {
            console.log('上传成功：', response);
        });

        // 上传失败
        uploader.on('uploadError', function(file) {
            console.log('上传失败：', file.name);
        });
    </script>
</body>
</html>
```

### 分片上传

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    
    // 开启分片上传
    chunked: true,
    
    // 分片大小 5MB
    chunkSize: 5 * 1024 * 1024,
    
    // 分片重试次数
    chunkRetry: 3,
    
    // 并发上传数
    threads: 3
});
```

### 图片压缩

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    
    // 图片压缩配置
    compress: {
        enable: true,
        maxWidthOrHeight: 1920,
        quality: 0.9
    },
    
    // 缩略图配置
    thumb: {
        width: 100,
        height: 100,
        quality: 0.7,
        crop: true
    }
});

// 生成缩略图
uploader.on('fileQueued', function(file) {
    uploader.makeThumb(file, function(error, src) {
        if (!error) {
            $('#thumbnail').attr('src', src);
        }
    });
});
```

## 为什么选择 WebUploader Plus？

### 🚀 开箱即用

无需复杂配置，几行代码即可实现文件上传功能。内置常用的上传场景处理，提供合理的默认配置。

### 💡 功能强大

支持分片上传、断点续传、秒传等高级特性，内置图片压缩和缩略图生成，满足各种业务场景需求。

### 🎯 稳定可靠

基于成熟的 WebUploader 构建，经过大量实际项目验证。完善的错误处理和重试机制，确保上传成功率。

### 🌐 兼容性好

采用 HTML5 为主、Flash 为辅的双运行时架构，兼容现代浏览器和 IE 8+ 等旧版浏览器，同时支持移动端。

## 核心特性

### 分片上传

将大文件切分成多个小块并发上传，突破服务器单文件大小限制，提高上传速度和成功率。

```javascript
// 开启分片上传，每片 5MB
chunked: true,
chunkSize: 5 * 1024 * 1024
```

### 断点续传

网络中断后自动保存上传进度，重新连接后从断点处继续上传，无需重传已完成的部分。

### 秒传

通过计算文件 MD5 值，服务器识别已存在的文件直接返回成功，实现"秒传"效果。

```javascript
uploader.md5File(file, function(md5) {
    console.log('文件 MD5：', md5);
});
```

### 图片处理

内置图片压缩和缩略图生成功能，支持自定义尺寸、质量和裁剪方式。

```javascript
// 图片压缩
compress: {
    enable: true,
    maxWidthOrHeight: 1920,
    quality: 0.9
}
```

## 兼容性

- **现代浏览器**: Chrome、Firefox、Safari、Edge 等（HTML5 完整支持）
- **IE 浏览器**: IE 8+（通过 Flash 运行时）
- **移动端**: Android 4+、iOS 6+
- **Node.js**: 14 或更高版本（开发环境）

## 社区与支持

- [GitHub Issues](https://github.com/modstart-lib/webuploader-plus/issues) - 报告问题和功能请求
- [GitHub Discussions](https://github.com/modstart-lib/webuploader-plus/discussions) - 社区讨论
- [更新日志](./changelog.md) - 查看最新更新

## 开源协议

Apache 2.0

