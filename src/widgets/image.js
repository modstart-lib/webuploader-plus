/**
 * @fileOverview 图片操作, 负责预览图片和上传前压缩图片
 */
define([
    '../base',
    '../uploader',
    '../lib/image',
    '../lib/browser-image-compression',
    './widget'
], function( Base, Uploader, Image, imageCompression ) {

    var $ = Base.$,
        throttle;

    // 根据要处理的文件大小来节流，一次不能处理太多，会卡。
    throttle = (function( max ) {
        var occupied = 0,
            waiting = [],
            tick = function() {
                var item;

                while ( waiting.length && occupied < max ) {
                    item = waiting.shift();
                    occupied += item[ 0 ];
                    item[ 1 ]();
                }
            };

        return function( emiter, size, cb ) {
            waiting.push([ size, cb ]);
            emiter.once( 'destroy', function() {
                occupied -= size;
                setTimeout( tick, 1 );
            });
            setTimeout( tick, 1 );
        };
    })( 5 * 1024 * 1024 );

    $.extend( Uploader.options, {

        /**
         * @property {Object} [thumb]
         * @namespace options
         * @for Uploader
         * @description 配置生成缩略图的选项。
         *
         * 默认为：
         *
         * ```javascript
         * {
         *     width: 110,
         *     height: 110,
         *
         *     // 图片质量，只有type为`image/jpeg`的时候才有效。
         *     quality: 70,
         *
         *     // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
         *     allowMagnify: true,
         *
         *     // 是否允许裁剪。
         *     crop: true,
         *
         *     // 为空的话则保留原有图片格式。
         *     // 否则强制转换成指定的类型。
         *     type: 'image/jpeg'
         * }
         * ```
         */
        thumb: {
            width: 110,
            height: 110,
            quality: 70,
            allowMagnify: true,
            crop: true,
            preserveHeaders: false,

            // 为空的话则保留原有图片格式。
            // 否则强制转换成指定的类型。
            // IE 8下面 base64 大小不能超过 32K 否则预览失败，而非 jpeg 编码的图片很可
            // 能会超过 32k, 所以这里设置成预览的时候都是 image/jpeg
            type: 'image/jpeg'
        },
        compress: {
            // 是否开启
            enable: false,
            // 压缩最大宽度或高度
            maxWidthOrHeight: 4000,
            // 压缩的最大大小
            maxSize: 10*1024*1024,
        }
    });

    return Uploader.register({

        name: 'image',


        /**
         * 生成缩略图，此过程为异步，所以需要传入`callback`。
         * 通常情况在图片加入队里后调用此方法来生成预览图以增强交互效果。
         *
         * 当 width 或者 height 的值介于 0 - 1 时，被当成百分比使用。
         *
         * `callback`中可以接收到两个参数。
         * * 第一个为error，如果生成缩略图有错误，此error将为真。
         * * 第二个为ret, 缩略图的Data URL值。
         *
         * **注意**
         * Date URL在IE6/7中不支持，所以不用调用此方法了，直接显示一张暂不支持预览图片好了。
         * 也可以借助服务端，将 base64 数据传给服务端，生成一个临时文件供预览。
         *
         * @method makeThumb
         * @grammar makeThumb( file, callback ) => undefined
         * @grammar makeThumb( file, callback, width, height ) => undefined
         * @for Uploader
         * @example
         *
         * uploader.on( 'fileQueued', function( file ) {
         *     var $li = ...;
         *
         *     uploader.makeThumb( file, function( error, ret ) {
         *         if ( error ) {
         *             $li.text('预览错误');
         *         } else {
         *             $li.append('<img alt="" src="' + ret + '" />');
         *         }
         *     });
         *
         * });
         */
        makeThumb: function( file, cb, width, height ) {
            var opts, image;

            file = this.request( 'get-file', file );

            // 只预览图片格式。
            if ( !file.type.match( /^image/ ) ) {
                cb( true );
                return;
            }

            opts = $.extend({}, this.options.thumb );

            // 如果传入的是object.
            if ( $.isPlainObject( width ) ) {
                opts = $.extend( opts, width );
                width = null;
            }

            width = width || opts.width;
            height = height || opts.height;

            image = new Image( opts );

            image.once( 'load', function() {
                file._info = file._info || image.info();
                file._meta = file._meta || image.meta();

                // 如果 width 的值介于 0 - 1
                // 说明设置的是百分比。
                if ( width <= 1 && width > 0 ) {
                    width = file._info.width * width;
                }

                // 同样的规则应用于 height
                if ( height <= 1 && height > 0 ) {
                    height = file._info.height * height;
                }

                image.resize( width, height );
            });

            // 当 resize 完后
            image.once( 'complete', function() {
                cb( false, image.getAsDataUrl( opts.type ) );
                image.destroy();
            });

            image.once( 'error', function( reason ) {
                cb( reason || true );
                image.destroy();
            });

            throttle( image, file.source.size, function() {
                file._info && image.info( file._info );
                file._meta && image.meta( file._meta );
                image.loadFromBlob( file.source );
            });
        },

        beforeSendFile: function( file ) {
            var opts = this.options.compress, image, deferred;

            // console.log('image.beforeSendFile',opts, file)

            file = this.request( 'get-file', file );

            if(file._widgetImageData){
                return;
            }

            var data = {
                processed: false,
                success: false,
                originalSize: file.size,
            };

            if ( !opts || !opts.enable || !~'image/jpeg,image/jpg,image/png'.indexOf( file.type ) ) {
                file._widgetImageData = data;
                return;
            }

            opts = $.extend({}, opts );
            deferred = Base.Deferred();

            console.log('image.beforeSendFile',opts, file.source.source);

            imageCompression(file.source.source,{
                maxSizeMB: opts.maxSize/1024/1024,
                maxWidthOrHeight: opts.maxWidthOrHeight,
            }).then(function (compressedBlob) {
                if(opts.debug){
                    console.log('webuploader.compress', (compressedBlob.size / file.size * 100).toFixed(2) + '%');
                }
                var oldSize = file.size;
                file.source.source = compressedBlob;
                file.source.size = compressedBlob.size;
                file.size = compressedBlob.size;
                file.trigger( 'resize', compressedBlob.size, oldSize );
                data.processed = true;
                data.success = true;
                file._widgetImageData = data;
                deferred.resolve();
            }).catch(function (error) {
                console.warn('webuploader.compress.error',error);
                data.processed = true;
                file._widgetImageData = data;
                deferred.resolve();
            });

            // image = new Image( opts );
            //
            // deferred.always(function() {
            //     image.destroy();
            //     image = null;
            // });
            // image.once( 'error', deferred.reject );
            // image.once( 'load', function() {
            //     var width = opts.width,
            //         height = opts.height;
            //
            //     file._info = file._info || image.info();
            //     file._meta = file._meta || image.meta();
            //
            //     // 如果 width 的值介于 0 - 1
            //     // 说明设置的是百分比。
            //     if ( width <= 1 && width > 0 ) {
            //         width = file._info.width * width;
            //     }
            //
            //     // 同样的规则应用于 height
            //     if ( height <= 1 && height > 0 ) {
            //         height = file._info.height * height;
            //     }
            //
            //     image.resize( width, height );
            // });
            //
            // image.once( 'complete', function() {
            //     var blob, size;
            //
            //     // 移动端 UC / qq 浏览器的无图模式下
            //     // ctx.getImageData 处理大图的时候会报 Exception
            //     // INDEX_SIZE_ERR: DOM Exception 1
            //     try {
            //         blob = image.getAsBlob( opts.type );
            //
            //         size = file.size;
            //
            //         // 如果压缩后，比原来还大则不用压缩后的。
            //         if ( !noCompressIfLarger || blob.size < size ) {
            //             // file.source.destroy && file.source.destroy();
            //             file.source = blob;
            //             file.size = blob.size;
            //
            //             file.trigger( 'resize', blob.size, size );
            //         }
            //
            //         // 标记，避免重复压缩。
            //         file._compressed = true;
            //         deferred.resolve();
            //     } catch ( e ) {
            //         // 出错了直接继续，让其上传原始图片
            //         deferred.resolve();
            //     }
            // });
            //
            // file._info && image.info( file._info );
            // file._meta && image.meta( file._meta );
            //
            // image.loadFromBlob( file.source );
            return deferred.promise();
        }
    });
});
