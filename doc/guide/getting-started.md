# 快速开始

本指南将帮助您在 5 分钟内快速上手 WebUploader Plus，实现基础的文件上传功能。

## 前置要求

在开始之前，请确保您已经：

- 拥有一个可以接收文件上传的服务器端点
- 了解基本的 HTML 和 JavaScript 知识
- 准备好一个测试环境（本地或线上）

## 第一步：引入文件

### 方式一：使用 CDN

在您的 HTML 文件中引入 WebUploader Plus：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WebUploader Plus 快速开始</title>
    <!-- 引入样式 -->
    <link rel="stylesheet" href="https://unpkg.com/webuploader-plus@latest/dist/webuploader.css">
</head>
<body>
    <!-- 引入脚本 -->
    <script src="https://unpkg.com/webuploader-plus@latest/dist/webuploader.js"></script>
</body>
</html>
```

### 方式二：下载到本地

1. 从 [GitHub Releases](https://github.com/modstart-lib/webuploader-plus/releases) 下载最新版本
2. 解压文件并将 `dist` 目录放到项目中
3. 在 HTML 中引入：

```html
<link rel="stylesheet" href="path/to/webuploader.css">
<script src="path/to/webuploader.js"></script>
```

## 第二步：创建 HTML 结构

在 HTML 中添加必要的容器元素：

```html
<body>
    <div id="uploader" class="wu-example">
        <!-- 文件选择按钮 -->
        <div id="filePicker">选择文件</div>
        
        <!-- 文件列表 -->
        <div id="fileList" class="uploader-list"></div>
        
        <!-- 上传按钮 -->
        <button id="uploadBtn" class="btn">开始上传</button>
    </div>
</body>
```

## 第三步：初始化上传器

创建 WebUploader 实例并配置基本参数：

```javascript
// 初始化 WebUploader
var uploader = WebUploader.create({
    // 自动上传，设置为 false 需要手动调用 upload() 方法
    auto: false,
    
    // 选择文件的按钮
    pick: {
        id: '#filePicker',
        label: '点击选择文件'
    },
    
    // 上传接口地址
    server: '/upload',
    
    // 不压缩 image
    resize: false,
    
    // 允许选择的文件类型（可选）
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
```

## 第四步：处理上传事件

监听文件添加、上传进度、上传成功等事件：

```javascript
// 当文件被添加到队列时
uploader.on('fileQueued', function(file) {
    var html = '<div id="' + file.id + '" class="file-item">' +
                   '<span class="file-name">' + file.name + '</span>' +
                   '<span class="file-size">' + formatSize(file.size) + '</span>' +
                   '<span class="status">等待上传</span>' +
               '</div>';
    
    $('#fileList').append(html);
});

// 上传进度
uploader.on('uploadProgress', function(file, percentage) {
    var $li = $('#' + file.id);
    var $status = $li.find('.status');
    $status.text('上传中 ' + Math.round(percentage * 100) + '%');
});

// 上传成功
uploader.on('uploadSuccess', function(file, response) {
    var $li = $('#' + file.id);
    var $status = $li.find('.status');
    $status.text('上传成功');
    console.log('服务器返回：', response);
});

// 上传失败
uploader.on('uploadError', function(file) {
    var $li = $('#' + file.id);
    var $status = $li.find('.status');
    $status.text('上传失败');
});

// 上传完成（无论成功或失败）
uploader.on('uploadComplete', function(file) {
    console.log('上传完成：', file.name);
});

// 格式化文件大小
function formatSize(size) {
    if (size < 1024) {
        return size + ' B';
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + ' KB';
    } else {
        return (size / 1024 / 1024).toFixed(2) + ' MB';
    }
}
```

## 第五步：添加上传按钮

为上传按钮绑定点击事件：

```javascript
// 点击上传按钮
$('#uploadBtn').on('click', function() {
    uploader.upload();
});
```

## 完整示例

将以上代码整合在一起：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WebUploader Plus 快速开始</title>
    <link rel="stylesheet" href="https://unpkg.com/webuploader-plus@latest/dist/webuploader.css">
    <style>
        .wu-example {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .uploader-list {
            margin: 20px 0;
            min-height: 100px;
        }
        .file-item {
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
        }
        .btn {
            padding: 10px 20px;
            background-color: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #66b1ff;
        }
    </style>
</head>
<body>
    <div id="uploader" class="wu-example">
        <div id="filePicker">选择文件</div>
        <div id="fileList" class="uploader-list"></div>
        <button id="uploadBtn" class="btn">开始上传</button>
    </div>

    <script src="https://unpkg.com/jquery@3.6.0/dist/jquery.min.js"></script>
    <script src="https://unpkg.com/webuploader-plus@latest/dist/webuploader.js"></script>
    <script>
        var uploader = WebUploader.create({
            auto: false,
            pick: {
                id: '#filePicker',
                label: '点击选择文件'
            },
            server: '/upload',
            resize: false,
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });

        uploader.on('fileQueued', function(file) {
            var html = '<div id="' + file.id + '" class="file-item">' +
                           '<span class="file-name">' + file.name + '</span>' +
                           '<span class="file-size">' + formatSize(file.size) + '</span>' +
                           '<span class="status">等待上传</span>' +
                       '</div>';
            $('#fileList').append(html);
        });

        uploader.on('uploadProgress', function(file, percentage) {
            var $li = $('#' + file.id);
            $li.find('.status').text('上传中 ' + Math.round(percentage * 100) + '%');
        });

        uploader.on('uploadSuccess', function(file, response) {
            var $li = $('#' + file.id);
            $li.find('.status').text('上传成功');
        });

        uploader.on('uploadError', function(file) {
            var $li = $('#' + file.id);
            $li.find('.status').text('上传失败');
        });

        $('#uploadBtn').on('click', function() {
            uploader.upload();
        });

        function formatSize(size) {
            if (size < 1024) {
                return size + ' B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + ' KB';
            } else {
                return (size / 1024 / 1024).toFixed(2) + ' MB';
            }
        }
    </script>
</body>
</html>
```

## 服务器端处理

WebUploader Plus 会将文件以 POST 方式提交到您配置的 `server` 地址。以下是一个简单的 PHP 服务器端示例：

```php
<?php
// upload.php
if ($_FILES['file']) {
    $file = $_FILES['file'];
    
    // 设置上传目录
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // 生成文件名
    $filename = uniqid() . '_' . $file['name'];
    $filepath = $uploadDir . $filename;
    
    // 移动文件
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        echo json_encode([
            'success' => true,
            'url' => '/' . $filepath
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => '上传失败'
        ]);
    }
}
?>
```

::: tip 提示
不同的后端语言处理文件上传的方式不同，请根据您使用的后端框架查阅相关文档。
:::

## 常见问题

### 选择文件后没有反应？

检查以下几点：
1. 确保 jQuery 已正确引入（如果需要）
2. 检查浏览器控制台是否有错误信息
3. 确保事件监听代码已正确执行

### 上传失败怎么办？

1. 检查 `server` 配置的接口地址是否正确
2. 确认服务器端接口可以正常访问
3. 检查服务器端文件上传权限
4. 查看浏览器 Network 面板的请求详情

### 如何限制文件大小和类型？

可以通过配置选项来限制：

```javascript
WebUploader.create({
    // ...其他配置
    
    // 限制单个文件大小（2MB）
    fileSingleSizeLimit: 2 * 1024 * 1024,
    
    // 限制总文件大小（10MB）
    fileSizeLimit: 10 * 1024 * 1024,
    
    // 限制文件数量
    fileNumLimit: 5,
    
    // 限制文件类型
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
```

## 下一步

恭喜！您已经成功实现了基本的文件上传功能。接下来您可以：

- 了解更多[配置选项](./configuration.md)
- 学习[分片上传](./chunk-upload.md)处理大文件
- 探索[图片处理](./image-processing.md)功能
- 查看完整的 [API 文档](../api/overview.md)

如果遇到问题，可以查看[常见问题](../faq.md)或在 [GitHub Issues](https://github.com/modstart-lib/webuploader-plus/issues) 提问。

## 使用交流

> 添加好友请备注 WebUploaderPlus

<table width="100%">
    <thead>
        <tr>
            <th width="50%">微信交流群</th>
            <th>QQ交流群</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <img style="width:100%;"
                     src="https://modstart.com/code_dynamic/modstart_wx" />
            </td>
            <td>
                <img style="width:100%;"
                     src="https://modstart.com/code_dynamic/modstart_qq" />
            </td>
        </tr>
    </tbody>
</table>
