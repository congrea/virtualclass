/**@Copyright 2017  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Jai Gupta and Suman Bogati <http://www.vidyamantra.com>
 * @module Processing of Screen Sharing related stuff
 */
var screenDecodeBlob = URL.createObjectURL(new Blob(['(',
        function () {
            var globalImageData = {}, imgData, sendTimeout;

            function decodeRGB(encodeDataArr, cwidth, cheight) {
                globalImageData = new ImageData(cwidth, cheight);
                var myLoop = encodeDataArr.length * 4;
                for (var i = 0; i < myLoop; i++) {
                    globalImageData.data[(i * 4) + 0] = (encodeDataArr[i] >> 5) * 36.5; //red
                    globalImageData.data[(i * 4) + 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
                    globalImageData.data[(i * 4) + 2] = (encodeDataArr[i] & 3) * 85;
                    globalImageData.data[(i * 4) + 3] = 255;
                }
                postMessage({
                    globalImageData: globalImageData,
                    dtype: 'drgb',
                    'stype': 'full',
                });
            }

            function decodeRGBSlice(encodeDataArr) {
                myLoop = encodeDataArr.length * 4;
                imgData = new Uint8ClampedArray(myLoop);

                for (var i = 0; i < myLoop; i++) {
                    imgData[(i * 4) + 0] = (encodeDataArr[i] >> 5) * 36.5; //red
                    imgData[(i * 4) + 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
                    imgData[(i * 4) + 2] = (encodeDataArr[i] & 3) * 85;
                    imgData[(i * 4) + 3] = 255;
                }
            }

            function putImageDataCache(x, y, w, h, putData) {
                var W = globalImageData.width;
                var i = 0;
                for (var r = y; r < h + y; r++) {
                    for (var c = x; c < w + x; c++) {
                        var O = ((r * W) + c) * 4;
                        globalImageData.data[O] = putData[i++];
                        globalImageData.data[O + 1] = putData[i++];
                        globalImageData.data[O + 2] = putData[i++];
                        globalImageData.data[O + 3] = putData[i++];
                    }
                }
            }

            function numValidateTwo(n1, n2) {
                n1 = preNumValidateTwo(n1);
                n2 = preNumValidateTwo(n2);
                var nres = n1 + n2;
                return parseInt(nres);
            }

            function preNumValidateTwo(n) {
                var numstring = n.toString();
                if (numstring.length == 1) {
                    return '0' + numstring;
                } else if (numstring.length == 2) {
                    return numstring;
                }
            }

            function process_data_pack(data_pack) {
                var s = 7;
                for (var i = 0; (i + 7) <= data_pack.length; i = l + 1) {
                    x = numValidateTwo(data_pack[i + 1], data_pack[i + 2]);
                    y = numValidateTwo(data_pack[i + 3], data_pack[i + 4]);
                    h = parseInt(data_pack[i + 5]);
                    w = parseInt(data_pack[i + 6]);
                    l = s + (h * w) - 1;
                    recmsg = data_pack.subarray(s, l + 1);
                    var d = {x: x, y: y, w: w, h: h};
                    decodeRGBSlice(recmsg);
                    putImageDataCache(x, y, w, h, imgData);
                    s = l + 7 + 1;
                }
                if (sendTimeout) {
                    clearTimeout(sendTimeout);
                }
                sendTimeout = setTimeout(() => {
                    postMessage({
                        globalImageData: globalImageData,
                        dtype: 'drgb'
                    });
                }, 100);
            }

            /**
             * 1) Converts Screen into multiple slices or chunks
             * 2) Keeps a copy of all previous slices
             * 3) Compares each new slice with its corresponding previous slice (Changed Slices)
             * 4) Combines all Changed Slices data into a single array which is posted back.
             * @param e
             */
            onmessage = function (e) {
                "use strict";
                if (e.data.hasOwnProperty('dtype')) {
                    if (e.data.dtype == 'drgb') { // decodeRGB
                        decodeRGB(e.data.encodeArr, e.data.cw, e.data.ch); // canvas width and canvas height
                    } else {
                        // for decoding slicing image
                        process_data_pack(e.data.data_pack);
                    }
                }
            };

        }.toString(),
        ')()'], {type: 'application/javascript'}));
var sdworker = new Worker(screenDecodeBlob);