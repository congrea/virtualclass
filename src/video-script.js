/**
 * This file is responisble to convert webp image to png image
 * This file is useful for the browser which does not support webp image format
 */

////------------------------------------------------------------------------


function WebPDecDemo(canvasId) {
    var canvas = document.getElementById(canvasId),
        context = canvas.getContext("2d"),

        outputData = null,
        output = null,
        active = null,
        img = document.createElement("img");


    var WebPDecodeAndDraw = function (data, canvas, context) {
        if (!!window.Worker) {
            webpToPng.postMessage({
                vdata: data,
                canid: canvas.id
            });


        }

        if (!!window.Worker) {
            webpToPng.onmessage = function (e) {

                if (e.data.canid == 'videoParticipate') {
                    // Teacher's big video which is outside of the Shadow Dom
                    var canvas = document.querySelector('#' + e.data.canid);
                } else {
                    var canvas = chatContainerEvent.elementFromShadowDom('#' + e.data.canid);
                }

                var context = canvas.getContext('2d');
                var output = context.createImageData(canvas.width, canvas.height);

                canvas.height = e.data.bh;
                canvas.width = e.data.bw;

                //	output.data =  new Uint8ClampedArray(outputData);
                output.data.set(e.data.vdata);
                context.putImageData(output, 0, 0);
                virtualclass.gObj.isReadyForVideo = true;

            }
        }
        canvas = canvas;
    }

    function drawBitmap(bitmap, WebPImage) {
        // (re)draw image, when size change
        if (WebPImage.biHeight.value != WebPImage.height.value || WebPImage.biWidth.value != WebPImage.width.value) {
            WebPImage.biHeight.value = WebPImage.height.value;
            WebPImage.biWidth.value = WebPImage.width.value;

            var biHeight = WebPImage.biHeight.value;
            var biWidth = WebPImage.biWidth.value;//alert(WebPImage.biHeight.value+' | '+WebPImage.biWidth.value);

            canvas.height = biHeight;
            canvas.width = biWidth;

            context = canvas.getContext('2d');
            output = context.createImageData(canvas.width, canvas.height);
            outputData = output.data;
        }
        if (bitmap && WebPImage.last_y.value != WebPImage.last_y_cache.value) {
            var biHeight = WebPImage.biHeight.value;
            var biWidth = WebPImage.biWidth.value;

            for (var h = WebPImage.last_y_cache.value; h < WebPImage.last_y.value; h++) {
                for (var w = 0; w < biWidth; w++) {
                    outputData[0 + w * 4 + (biWidth * 4) * h] = bitmap[0 + w * 3 + (biWidth * 3) * h];
                    outputData[1 + w * 4 + (biWidth * 4) * h] = bitmap[1 + w * 3 + (biWidth * 3) * h];
                    outputData[2 + w * 4 + (biWidth * 4) * h] = bitmap[2 + w * 3 + (biWidth * 3) * h];
                    outputData[3 + w * 4 + (biWidth * 4) * h] = 255;

                }
                ;
            }
            context.putImageData(output, 0, 0);
            WebPImage.last_y_cache.value = WebPImage.last_y.value;
        }

    }

    function NextRGB(decoder, idec, WebPImage, data, data_off, block_size, new_data, biHeight, biWidth, bitmap, last_y, start, sleep) {
        active = setTimeout(function () {
            //window.clearTimeout(aktiv);
            block_size = block_size + data_off > data.length ? data.length - data_off : block_size;
            // ... (get additional data)
            memcpy(new_data, 0, data, data_off, block_size);
            status = decoder.WebPIAppend(idec, new_data, block_size);//alert(status+' '+block_size+' '+data_off);
            //status = decoder.WebPIUpdate2(idec, data_off, block_size);//alert(status+' '+block_size+' '+data_off);
            bitmap = decoder.WebPIDecGetRGB(idec, WebPImage.last_y, WebPImage.width, WebPImage.height, WebPImage.stride);//alert(WebPImage.last_y.value);

            // (re)draw image, when size change
            drawBitmap(bitmap, WebPImage);

            data_off += block_size;

            if (status == 5 && active)// 5: VP8_STATUS_SUSPENDED
                NextRGB(decoder, idec, WebPImage, data, data_off, block_size, new_data, biHeight, biWidth, bitmap, last_y, start, sleep);
            if (status == 0) {
                var end = new Date();
                var bench_IDecoding = (end - start);
                decSpeedResult.innerHTML = 'Speed result:<br />libwebpjs (Incremental decoding): finish in ' + bench_IDecoding + 'ms';
            }
        }, sleep);
    }

    var WebPIDecodeAndDraw = function (data) {
        clearTimeout(active);
        if (isNaN(parseInt(IncrementalDecBufferSizeBtn.value))) return;
        if (isNaN(parseInt(IncrementalDecSleepBtn.value))) return;

        data = convertBinaryToArray(data);
        var WebPImage = {
            last_y: {value: null},
            last_y_cache: {value: null},
            width: {value: 0},
            height: {value: 0},
            biWidth: {value: 0},
            biHeight: {value: 0},
            stride: {value: 0}
        };

        var has_more_data = true;
        var block_size = parseInt(IncrementalDecBufferSizeBtn.value);
        var data_off = 0,
            new_data = Arr(block_size - 1, 0);
        var biHeight = 0,
            biWidth = 0;
        var bitmap = null;
        var last_y = null;
        var sleep = parseInt(IncrementalDecSleepBtn.value);

        var decoder = new WebPDecoder();
        var idec = decoder.WebPINew('MODE_RGB');

        //decoder.WebPIAppendAll(idec, new_data, new_data.length);

        var start = new Date();
        NextRGB(decoder, idec, WebPImage, data, data_off, block_size, new_data, biHeight, biWidth, bitmap, last_y, start, sleep);

        decoder.WebPIDelete(idec);
        finishDecoding();
    };
};




