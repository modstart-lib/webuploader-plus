$(function () {

    console.log('upload.js');

    var uploader = WebUploader.create({
        auto: true,
        pick: {
            id: '#uploader',
            label: '<button>点击选择图片</button>'
        },
        chunked: true,
        chunkSize: 1024,
        chunkRetry: 5,
        threads: 1,
        server: '../../server/handle.php',
    });

});
