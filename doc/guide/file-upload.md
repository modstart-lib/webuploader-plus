# 文件上传

本章节介绍 WebUploader Plus 的基础文件上传功能和常用配置。

## 基本用法

最简单的文件上传示例：

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',      // 选择文件的按钮
    server: '/upload',        // 上传接口地址
    auto: true                // 自动上传
});
```

## 文件选择

### 单文件上传

```javascript
var uploader = WebUploader.create({
    pick: {
        id: '#filePicker',
        multiple: false        // 单选
    },
    server: '/upload'
});
```

### 多文件上传

```javascript
var uploader = WebUploader.create({
    pick: {
        id: '#filePicker',
        multiple: true         // 多选（默认）
    },
    server: '/upload'
});
```

### 文件类型限制

使用 `accept` 选项限制文件类型：

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    accept: {
        title: 'Images',                                    // 描述文字
        extensions: 'gif,jpg,jpeg,bmp,png',                 // 允许的文件后缀
        mimeTypes: 'image/*'                                // 允许的 MIME 类型
    }
});
```

常用的文件类型配置：

```javascript
// 图片文件
accept: {
    title: 'Images',
    extensions: 'gif,jpg,jpeg,bmp,png',
    mimeTypes: 'image/*'
}

// 文档文件
accept: {
    title: 'Documents',
    extensions: 'doc,docx,xls,xlsx,ppt,pptx,pdf',
    mimeTypes: 'application/*'
}

// 视频文件
accept: {
    title: 'Videos',
    extensions: 'mp4,avi,mov,wmv',
    mimeTypes: 'video/*'
}

// 音频文件
accept: {
    title: 'Audios',
    extensions: 'mp3,wav,wma,ogg',
    mimeTypes: 'audio/*'
}
```

### 文件大小限制

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    
    // 单个文件大小限制（2MB）
    fileSingleSizeLimit: 2 * 1024 * 1024,
    
    // 所有文件总大小限制（10MB）
    fileSizeLimit: 10 * 1024 * 1024,
    
    // 文件数量限制
    fileNumLimit: 5
});
```

## 上传控制

### 自动上传 vs 手动上传

```javascript
// 自动上传：选择文件后立即上传
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    auto: true
});

// 手动上传：需要调用 upload() 方法
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    auto: false
});

// 点击按钮开始上传
$('#uploadBtn').on('click', function() {
    uploader.upload();
});
```

### 暂停和继续上传

```javascript
// 暂停上传
uploader.stop();

// 继续上传（从暂停处继续）
uploader.upload();
```

### 取消上传

```javascript
// 取消单个文件的上传
uploader.cancelFile(file);

// 取消所有文件的上传
uploader.stop(true);  // true 表示中断当前正在上传的文件
```

## 文件队列管理

### 添加文件

```javascript
// 通过 File 对象添加
var file = new File(['content'], 'filename.txt');
uploader.addFile(file);

// 通过文件选择器添加（用户选择）
// 由 pick 配置自动处理
```

### 移除文件

```javascript
// 从队列中移除文件
uploader.removeFile(file);

// 移除文件时同时从UI中删除
uploader.removeFile(file, true);
```

### 获取文件列表

```javascript
// 获取所有文件
var files = uploader.getFiles();

// 获取指定状态的文件
var queuedFiles = uploader.getFiles('queued');      // 队列中的文件
var uploadingFiles = uploader.getFiles('uploading'); // 正在上传的文件
var successFiles = uploader.getFiles('complete');    // 上传完成的文件
var errorFiles = uploader.getFiles('error');         // 上传失败的文件
```

### 重试上传

```javascript
// 重试单个文件
uploader.retry(file);

// 重试所有失败的文件
var errorFiles = uploader.getFiles('error');
errorFiles.forEach(function(file) {
    uploader.retry(file);
});
```

## 事件监听

### 文件添加事件

```javascript
// 文件被添加到队列
uploader.on('fileQueued', function(file) {
    console.log('文件已添加:', file.name);
    console.log('文件大小:', file.size);
    console.log('文件类型:', file.type);
});

// 多个文件被添加
uploader.on('filesQueued', function(files) {
    console.log('添加了 ' + files.length + ' 个文件');
});
```

### 上传进度事件

```javascript
// 单个文件上传进度
uploader.on('uploadProgress', function(file, percentage) {
    console.log('上传进度:', (percentage * 100).toFixed(2) + '%');
    
    // 更新进度条
    $('#' + file.id).find('.progress').css('width', (percentage * 100) + '%');
});

// 所有文件上传进度
uploader.on('uploadProgress', function(file, percentage) {
    var stats = uploader.getStats();
    console.log('总进度:', stats.successNum + '/' + stats.queueNum);
});
```

### 上传成功事件

```javascript
uploader.on('uploadSuccess', function(file, response) {
    console.log('上传成功');
    console.log('服务器返回:', response);
    
    // 显示上传成功的文件
    $('#' + file.id).addClass('upload-success');
});
```

### 上传失败事件

```javascript
uploader.on('uploadError', function(file, reason) {
    console.log('上传失败:', reason);
    
    // 显示错误信息
    $('#' + file.id).addClass('upload-error');
});
```

### 上传完成事件

```javascript
// 单个文件上传完成（无论成功或失败）
uploader.on('uploadComplete', function(file) {
    console.log('文件上传完成:', file.name);
});

// 所有文件上传完成
uploader.on('uploadFinished', function() {
    console.log('所有文件上传完成');
    var stats = uploader.getStats();
    alert('成功：' + stats.successNum + '，失败：' + stats.errorNum);
});
```

### 验证失败事件

```javascript
uploader.on('error', function(type) {
    var errorMessages = {
        'Q_EXCEED_NUM_LIMIT': '文件数量超出限制',
        'Q_EXCEED_SIZE_LIMIT': '文件总大小超出限制',
        'F_EXCEED_SIZE': '单个文件大小超出限制',
        'F_DUPLICATE': '文件重复'
    };
    
    alert(errorMessages[type] || '未知错误');
});
```

## 服务器通信

### 上传参数

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    
    // 附加参数（对所有文件有效）
    formData: {
        userId: '12345',
        token: 'abcdefg'
    },
    
    // 文件字段名（默认为 'file'）
    fileVal: 'file',
    
    // HTTP 方法
    method: 'POST'
});

// 动态修改参数
uploader.option('formData', {
    userId: '67890',
    timestamp: Date.now()
});
```

### 自定义请求头

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    
    // 设置请求头
    headers: {
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'value'
    }
});
```

### 处理服务器响应

```javascript
uploader.on('uploadSuccess', function(file, response) {
    // response 是服务器返回的数据（已自动 JSON 解析）
    if (response.success) {
        console.log('文件URL:', response.url);
        console.log('文件ID:', response.fileId);
    } else {
        console.error('上传失败:', response.message);
    }
});

uploader.on('uploadError', function(file, reason) {
    console.error('上传错误:', reason);
});
```

## 完整示例

这是一个包含常用功能的完整示例：

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="webuploader.css">
    <style>
        .uploader-container {
            max-width: 800px;
            margin: 50px auto;
        }
        .file-list {
            margin-top: 20px;
        }
        .file-item {
            padding: 10px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .progress-bar {
            height: 4px;
            background: #409eff;
            width: 0%;
            transition: width 0.3s;
        }
        .upload-success {
            border-color: #67c23a;
            background: #f0f9ff;
        }
        .upload-error {
            border-color: #f56c6c;
            background: #fef0f0;
        }
    </style>
</head>
<body>
    <div class="uploader-container">
        <div id="filePicker">选择文件</div>
        <button id="uploadBtn">开始上传</button>
        <button id="pauseBtn">暂停</button>
        <button id="continueBtn">继续</button>
        <div id="fileList" class="file-list"></div>
    </div>

    <script src="jquery.min.js"></script>
    <script src="webuploader.js"></script>
    <script>
        var uploader = WebUploader.create({
            auto: false,
            pick: {
                id: '#filePicker',
                multiple: true
            },
            server: '/upload',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            fileSingleSizeLimit: 5 * 1024 * 1024,
            fileNumLimit: 10,
            formData: {
                userId: '12345'
            }
        });

        uploader.on('fileQueued', function(file) {
            var $item = $('<div id="' + file.id + '" class="file-item">' +
                '<div class="file-name">' + file.name + '</div>' +
                '<div class="file-size">' + formatSize(file.size) + '</div>' +
                '<div class="progress-bar"></div>' +
                '<div class="status">等待上传</div>' +
                '</div>');
            $('#fileList').append($item);
        });

        uploader.on('uploadProgress', function(file, percentage) {
            var $item = $('#' + file.id);
            $item.find('.progress-bar').css('width', (percentage * 100) + '%');
            $item.find('.status').text('上传中 ' + (percentage * 100).toFixed(2) + '%');
        });

        uploader.on('uploadSuccess', function(file, response) {
            $('#' + file.id).addClass('upload-success').find('.status').text('上传成功');
        });

        uploader.on('uploadError', function(file) {
            $('#' + file.id).addClass('upload-error').find('.status').text('上传失败');
        });

        $('#uploadBtn').on('click', function() {
            uploader.upload();
        });

        $('#pauseBtn').on('click', function() {
            uploader.stop();
        });

        $('#continueBtn').on('click', function() {
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

## 下一步

- 学习[分片上传](./chunk-upload.md)处理大文件
- 了解[图片处理](./image-processing.md)功能
- 查看完整的[配置选项](./configuration.md)
- 查看 [API 文档](../api/overview.md)
