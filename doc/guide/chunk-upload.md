# 分片上传

分片上传是 WebUploader Plus 的核心功能之一，它将大文件切分成多个小块并发上传，极大提高了大文件上传的成功率和速度。

## 什么是分片上传

分片上传（Chunk Upload）是指将一个大文件切分成多个小块（chunk），然后分别上传这些小块，服务器端接收到所有分块后再合并成完整文件。

### 优势

- **突破大小限制**：绕过服务器单文件大小限制
- **提高成功率**：小块上传失败后可以单独重试
- **断点续传**：网络中断后可以从断点处继续
- **并发上传**：多个分块可以并发上传，提高速度
- **进度可控**：更精确的上传进度反馈

## 基本配置

### 开启分片上传

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    
    // 开启分片上传
    chunked: true,
    
    // 分片大小（5MB）
    chunkSize: 5 * 1024 * 1024,
    
    // 分片失败后重试次数
    chunkRetry: 3,
    
    // 分片失败重试间隔（毫秒）
    chunkRetryDelay: 1000,
    
    // 并发上传数
    threads: 3
});
```

### 配置说明

- **chunked**: 是否开启分片上传，默认 `false`
- **chunkSize**: 每个分片的大小（字节），默认 5MB
- **chunkRetry**: 分片失败后重试次数，默认 2 次
- **chunkRetryDelay**: 重试间隔时间（毫秒），默认 1000ms
- **threads**: 并发上传数，默认 3

## 分片大小选择

分片大小的选择需要权衡多个因素：

```javascript
// 小分片（1-2MB）
// 优点：失败重传代价小，适合不稳定网络
// 缺点：请求次数多，HTTP 开销大
chunkSize: 1 * 1024 * 1024

// 中等分片（5-10MB）- 推荐
// 优点：平衡性能和可靠性
// 缺点：适用于大多数场景
chunkSize: 5 * 1024 * 1024

// 大分片（20MB+）
// 优点：请求次数少，HTTP 开销小
// 缺点：失败重传代价大，需要稳定网络
chunkSize: 20 * 1024 * 1024
```

::: tip 推荐配置
- **文件 < 10MB**: 不使用分片
- **文件 10-100MB**: 5MB 分片
- **文件 > 100MB**: 10MB 分片
- **网络不稳定**: 2-3MB 小分片
:::

## 服务器端处理

### 分片请求参数

WebUploader Plus 在上传分片时会附加以下参数：

```javascript
{
    file: File,           // 分片文件
    chunks: 10,           // 总分片数
    chunk: 0,             // 当前分片序号（从 0 开始）
    id: 'WU_FILE_0',     // 文件唯一标识
    name: 'test.mp4',    // 文件名
    type: 'video/mp4',   // 文件类型
    size: 52428800       // 文件总大小
}
```

### PHP 服务器端示例

```php
<?php
// upload.php - 分片上传处理
$chunk = isset($_POST['chunk']) ? intval($_POST['chunk']) : 0;
$chunks = isset($_POST['chunks']) ? intval($_POST['chunks']) : 1;
$fileId = $_POST['id'];
$fileName = $_POST['name'];

// 创建临时目录
$tempDir = 'temp/' . $fileId;
if (!is_dir($tempDir)) {
    mkdir($tempDir, 0755, true);
}

// 保存当前分片
$chunkFile = $tempDir . '/chunk_' . $chunk;
move_uploaded_file($_FILES['file']['tmp_name'], $chunkFile);

// 检查是否所有分片都已上传
$uploadedChunks = glob($tempDir . '/chunk_*');
if (count($uploadedChunks) == $chunks) {
    // 合并分片
    $finalFile = 'uploads/' . $fileName;
    $fp = fopen($finalFile, 'wb');
    
    for ($i = 0; $i < $chunks; $i++) {
        $chunkPath = $tempDir . '/chunk_' . $i;
        $chunkContent = file_get_contents($chunkPath);
        fwrite($fp, $chunkContent);
        unlink($chunkPath);  // 删除分片
    }
    
    fclose($fp);
    rmdir($tempDir);  // 删除临时目录
    
    // 返回成功响应
    echo json_encode([
        'success' => true,
        'url' => '/uploads/' . $fileName,
        'message' => '上传成功'
    ]);
} else {
    // 分片上传中
    echo json_encode([
        'success' => true,
        'message' => '分片 ' . ($chunk + 1) . '/' . $chunks . ' 上传成功'
    ]);
}
?>
```

### Node.js 服务器端示例

```javascript
// 使用 Express 和 Multer
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'temp/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    const { chunk, chunks, id, name } = req.body;
    const chunkIndex = parseInt(chunk);
    const totalChunks = parseInt(chunks);
    
    // 创建临时目录
    const tempDir = path.join('temp', id);
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // 移动分片到临时目录
    const chunkPath = path.join(tempDir, `chunk_${chunkIndex}`);
    fs.renameSync(req.file.path, chunkPath);
    
    // 检查是否所有分片都已上传
    const uploadedChunks = fs.readdirSync(tempDir);
    if (uploadedChunks.length === totalChunks) {
        // 合并分片
        const finalPath = path.join('uploads', name);
        const writeStream = fs.createWriteStream(finalPath);
        
        for (let i = 0; i < totalChunks; i++) {
            const chunkFile = path.join(tempDir, `chunk_${i}`);
            const data = fs.readFileSync(chunkFile);
            writeStream.write(data);
            fs.unlinkSync(chunkFile);  // 删除分片
        }
        
        writeStream.end();
        fs.rmdirSync(tempDir);  // 删除临时目录
        
        res.json({
            success: true,
            url: '/uploads/' + name,
            message: '上传成功'
        });
    } else {
        res.json({
            success: true,
            message: `分片 ${chunkIndex + 1}/${totalChunks} 上传成功`
        });
    }
});

app.listen(3000);
```

## 断点续传

开启分片上传后，WebUploader Plus 自动支持断点续传。

### 工作原理

1. 上传过程中网络中断
2. WebUploader 记录已上传的分片
3. 重新连接后，跳过已上传的分片
4. 从断点处继续上传

### 前端实现

```javascript
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    chunked: true,
    chunkSize: 5 * 1024 * 1024,
    
    // 开启断点续传
    chunkRetry: 3
});

// 监听上传中断
uploader.on('uploadError', function(file, reason) {
    console.log('上传中断，可以稍后重试');
});

// 重试按钮
$('#retryBtn').on('click', function() {
    // 重试会自动跳过已上传的分片
    uploader.retry();
});
```

### 服务器端支持

服务器端需要支持查询已上传的分片：

```php
<?php
// check_chunks.php - 查询已上传的分片
$fileId = $_GET['id'];
$tempDir = 'temp/' . $fileId;

$uploadedChunks = [];
if (is_dir($tempDir)) {
    $files = glob($tempDir . '/chunk_*');
    foreach ($files as $file) {
        preg_match('/chunk_(\d+)/', $file, $matches);
        $uploadedChunks[] = intval($matches[1]);
    }
}

echo json_encode([
    'uploaded' => $uploadedChunks
]);
?>
```

前端查询已上传分片：

```javascript
uploader.on('uploadBeforeSend', function(block, data, headers) {
    // 查询已上传的分片
    $.ajax({
        url: '/check_chunks',
        data: { id: block.file.id },
        async: false,
        success: function(response) {
            if (response.uploaded.indexOf(data.chunk) >= 0) {
                // 跳过已上传的分片
                return false;
            }
        }
    });
});
```

## 分片上传进度

### 显示分片进度

```javascript
uploader.on('uploadProgress', function(file, percentage) {
    console.log('总进度:', (percentage * 100).toFixed(2) + '%');
    
    // 计算当前分片
    var chunkSize = 5 * 1024 * 1024;
    var totalChunks = Math.ceil(file.size / chunkSize);
    var currentChunk = Math.floor(percentage * totalChunks);
    
    console.log('当前分片:', currentChunk + '/' + totalChunks);
    
    // 更新UI
    $('#progress').text((percentage * 100).toFixed(2) + '%');
    $('#chunks').text(currentChunk + '/' + totalChunks);
});
```

### 实时速度计算

```javascript
var lastLoaded = 0;
var lastTime = Date.now();

uploader.on('uploadProgress', function(file, percentage) {
    var loaded = file.size * percentage;
    var currentTime = Date.now();
    
    // 计算速度（字节/秒）
    var speed = (loaded - lastLoaded) / ((currentTime - lastTime) / 1000);
    
    lastLoaded = loaded;
    lastTime = currentTime;
    
    // 格式化速度
    var speedText = formatSpeed(speed);
    $('#speed').text(speedText);
});

function formatSpeed(bytesPerSecond) {
    if (bytesPerSecond < 1024) {
        return bytesPerSecond.toFixed(2) + ' B/s';
    } else if (bytesPerSecond < 1024 * 1024) {
        return (bytesPerSecond / 1024).toFixed(2) + ' KB/s';
    } else {
        return (bytesPerSecond / 1024 / 1024).toFixed(2) + ' MB/s';
    }
}
```

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="webuploader.css">
    <style>
        .uploader-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .file-info {
            margin: 20px 0;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .progress-container {
            margin: 20px 0;
        }
        .progress-bar {
            height: 20px;
            background: #ddd;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #409eff;
            width: 0%;
            transition: width 0.3s;
        }
        .stats {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="uploader-container">
        <h2>分片上传示例</h2>
        
        <div id="filePicker">选择大文件</div>
        
        <div id="fileInfo" class="file-info" style="display: none;">
            <div>文件名: <span id="fileName"></span></div>
            <div>文件大小: <span id="fileSize"></span></div>
            <div>总分片数: <span id="totalChunks"></span></div>
        </div>
        
        <div class="progress-container">
            <div class="progress-bar">
                <div id="progressFill" class="progress-fill"></div>
            </div>
            <div class="stats">
                <div>进度: <span id="percentage">0%</span></div>
                <div>当前分片: <span id="currentChunk">0</span></div>
                <div>上传速度: <span id="speed">0 KB/s</span></div>
            </div>
        </div>
        
        <button id="uploadBtn">开始上传</button>
        <button id="pauseBtn">暂停</button>
        <button id="retryBtn">重试</button>
    </div>

    <script src="jquery.min.js"></script>
    <script src="webuploader.js"></script>
    <script>
        var uploader = WebUploader.create({
            auto: false,
            pick: '#filePicker',
            server: '/upload',
            chunked: true,
            chunkSize: 5 * 1024 * 1024,
            chunkRetry: 3,
            threads: 3
        });

        var lastLoaded = 0;
        var lastTime = Date.now();

        uploader.on('fileQueued', function(file) {
            $('#fileInfo').show();
            $('#fileName').text(file.name);
            $('#fileSize').text(formatSize(file.size));
            
            var totalChunks = Math.ceil(file.size / (5 * 1024 * 1024));
            $('#totalChunks').text(totalChunks);
        });

        uploader.on('uploadProgress', function(file, percentage) {
            var loaded = file.size * percentage;
            var currentTime = Date.now();
            var speed = (loaded - lastLoaded) / ((currentTime - lastTime) / 1000);
            
            lastLoaded = loaded;
            lastTime = currentTime;
            
            $('#progressFill').css('width', (percentage * 100) + '%');
            $('#percentage').text((percentage * 100).toFixed(2) + '%');
            $('#speed').text(formatSpeed(speed));
            
            var chunkSize = 5 * 1024 * 1024;
            var currentChunk = Math.floor(percentage * Math.ceil(file.size / chunkSize));
            $('#currentChunk').text(currentChunk);
        });

        uploader.on('uploadSuccess', function(file, response) {
            alert('上传成功！');
        });

        $('#uploadBtn').on('click', function() {
            uploader.upload();
        });

        $('#pauseBtn').on('click', function() {
            uploader.stop();
        });

        $('#retryBtn').on('click', function() {
            uploader.retry();
        });

        function formatSize(size) {
            if (size < 1024) return size + ' B';
            if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
            return (size / 1024 / 1024).toFixed(2) + ' MB';
        }

        function formatSpeed(bytesPerSecond) {
            if (bytesPerSecond < 1024) return bytesPerSecond.toFixed(2) + ' B/s';
            if (bytesPerSecond < 1024 * 1024) return (bytesPerSecond / 1024).toFixed(2) + ' KB/s';
            return (bytesPerSecond / 1024 / 1024).toFixed(2) + ' MB/s';
        }
    </script>
</body>
</html>
```

## 最佳实践

### 1. 合理设置分片大小

```javascript
// 根据文件大小动态调整
function getChunkSize(fileSize) {
    if (fileSize < 10 * 1024 * 1024) {
        return 0;  // 不分片
    } else if (fileSize < 100 * 1024 * 1024) {
        return 5 * 1024 * 1024;  // 5MB
    } else {
        return 10 * 1024 * 1024;  // 10MB
    }
}

var file = ...; // 获取文件
var uploader = WebUploader.create({
    pick: '#filePicker',
    server: '/upload',
    chunked: true,
    chunkSize: getChunkSize(file.size)
});
```

### 2. 处理分片失败

```javascript
uploader.on('uploadError', function(file, reason) {
    console.error('上传失败:', reason);
    
    // 自动重试
    setTimeout(function() {
        uploader.retry(file);
    }, 3000);
});
```

### 3. 服务器端验证

```php
// 服务器端验证分片完整性
$totalSize = 0;
for ($i = 0; $i < $chunks; $i++) {
    $chunkFile = $tempDir . '/chunk_' . $i;
    if (!file_exists($chunkFile)) {
        die(json_encode(['error' => '分片缺失']));
    }
    $totalSize += filesize($chunkFile);
}

if ($totalSize != $_POST['size']) {
    die(json_encode(['error' => '文件大小不匹配']));
}
```

## 常见问题

### 为什么要使用分片上传？

- 大文件上传更稳定
- 可以突破服务器限制
- 支持断点续传
- 上传进度更精确

### 分片大小如何选择？

根据文件大小和网络情况：
- 10MB 以下：不分片
- 10-100MB：5MB 分片
- 100MB 以上：10MB 分片
- 网络不稳定：2-3MB

### 如何实现秒传？

结合 MD5 计算，参考[图片处理](./image-processing.md)中的 MD5 章节。

## 下一步

- 了解[图片处理](./image-processing.md)功能
- 查看完整的[配置选项](./configuration.md)
- 查看 [API 文档](../api/overview.md)
