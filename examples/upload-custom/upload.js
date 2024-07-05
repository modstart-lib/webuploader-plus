$(function () {

    WebUploader.Uploader.register({
        'before-send': 'beforeBlockSend',
        'before-send-file': 'beforeSendFile'
    }, {
        beforeBlockSend: function (block) {
            console.log('beforeBlockSend', block, this.options.chunkUploaded)
            var task = new $.Deferred();
            setTimeout(task.resolve, 0);
            return $.when(task);
        },
        beforeSendFile: function (file) {
            console.log('beforeSendFile', file);
            var me = this;
            var task = new $.Deferred();
            setTimeout(function () {
                me.options.chunkUploaded = 0
                task.resolve()
            }, 0);
            return $.when(task);
        }
    });

    var uploader = WebUploader.create({
        debug: true,
        auto: true,
        pick: {
            id: '#uploadPicker',
            label: '<button>点击选择文件</button>'
        },
        chunked: true,
        chunkSize: 1024,
        chunkRetry: 5,
        threads: 1,
        server: '../../server/handle.php',
        // 需要立即上传文件
        customUpload: function (file, option) {
            console.log('customUpload.upload', file);
            var i = 0;
            var tick = function () {
                setTimeout(function () {
                    if (Math.random() < 0.1) {
                        option.onError(file, '错误了');
                        return;
                    }
                    if (i++ < 10) {
                        option.onProgress(file, i / 10);
                        tick();
                    } else {
                        const res = {
                            code: 0,
                            msg: 'ok',
                            data: {
                                data: {
                                    filename: 'aaa.png',
                                    size: 1000,
                                    path: 'xxx/xxx/xxx.png',
                                    fullPath: 'xxx/xxx/xxx.png',
                                }
                            }
                        };
                        option.onSuccess(file, res);
                    }
                }, 100);
            };
            tick();
        }
    });

    uploader.on('fileQueued', function (file) {
        console.log('fileQueued', file);
    });

    uploader.on('fileDequeued', function (file) {
        console.log('fileDequeued', file);
    });

    uploader.on('uploadProgress', function (file, percentage) {
        console.log('uploadProgress', file, percentage);
    });

    uploader.on('uploadAccept', function (file, response, setErrorReason) {
        console.log('uploadAccept', file, response);
        return true;
    });

    uploader.on('uploadSuccess', function (file, res) {
        console.log('uploadSuccess', file, res);
    });

    uploader.on('uploadBeforeSend', function (file, data) {
        console.log('uploadBeforeSend', file, data);
    });

    uploader.on('uploadError', function (file, typeOrMsg) {
        console.log('uploadError', file, typeOrMsg);
    });

    uploader.on('uploadFinished', function () {
        console.log('uploadFinished');
    });

    uploader.on('error', function (type) {
        console.log('error', type);
    });

});
