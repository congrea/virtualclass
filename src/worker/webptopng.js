var webpToPngBlob = URL.createObjectURL(new Blob(['(', function (){

    importScripts('https://live.congrea.net/virtualclass/external/build/src/video-libwebp-0.1.3.min.js');

    onmessage = function (e) {
        var mdata;

        if(e.data.hasOwnProperty('vdata')){
            WebPDecodeAndDraw(e.data.vdata, e.data. canid);
        }
    }


    var WebPDecodeAndDraw = function (data, canid) {

        var start = new Date();

        ///libwebpjs 0.1.3 decoder code start ---------------------------------------------
        var WebPImage = { width:{value:0},height:{value:0} }
        var decoder = new WebPDecoder();

        data=convertBinaryToArray(data);//unkonvertierung in char

        //Config, you can set all arguments or what you need, nothing no objeect
        var config = decoder.WebPDecoderConfig;
        var output_buffer = config.output;
        var bitstream = config.input;

        if (!decoder.WebPInitDecoderConfig(config)) {
            alert("Library version mismatch!\n");
            return -1;
        }

        config.options.no_fancy_upsampling = 0;
        config.options.bypass_filtering = 0;
        //config.options.use_threads = 1;
        config.options.use_cropping= 0;
        config.options.crop_left   = 0;
        config.options.crop_top    = 0;
        config.options.crop_width  = 0;
        config.options.crop_height = 0;

        //todo: add stop_watch
        var StatusCode = decoder.VP8StatusCode;

        if(data.length > 0){
            var status = decoder.WebPGetFeatures(data, data.length, bitstream);
        } else {
            return; // Only accept valid data
        }

        if (status != StatusCode.VP8_STATUS_OK) {
            alert('error');
        }

        var mode = decoder.WEBP_CSP_MODE;

        //output_buffer.colorspace = bitstream.has_alpha.value ? MODE_BGRA : MODE_BGR;
        //output_buffer.colorspace = bitstream.has_alpha.value ? MODE_RGBA : MODE_RGB;

        output_buffer.colorspace = mode.MODE_RGBA;

        if(data.length > 0 ){
            status = parseInt(decoder.WebPDecode(data, data.length, config), 10);
        } else {
            return; // only process when valid data is accepted
        }


        var ok = (status == StatusCode.VP8_STATUS_OK);

        if (!ok) {
            alert("Decoding of %s failed.\n");
            return -1;
        }



        //alert("Decoded %s. Dimensions: "+output_buffer.width+" x "+output_buffer.height+""+(bitstream.has_alpha.value ? " (with alpha)" : "")+". Now saving...\n");
        var bitmap = output_buffer.u.RGBA.rgba;
        //var bitmap = decoder.WebPDecodeARGB(data, data.length, WebPImage.width, WebPImage.height);

        ///libwebpjs 0.1.3 decoder code end ---------------------------------------------

        var end = new Date();
        var bench_libwebp=(end-start);

        if (bitmap) {
            //Draw Image
            var start = new Date();
            var biHeight=output_buffer.height; var biWidth=output_buffer.width;
            bitmap.pop();
            postMessage( {
                    vdata : new Uint8ClampedArray(bitmap),
                    bh  : biHeight,
                    bw  : biWidth,
                    canid : canid
                }
            );
        }
    };
}.toString(), ')()'], {type: 'application/javascript'}));

var webpToPng = new Worker(webpToPngBlob);