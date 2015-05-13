/** To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (window) {
    var dirtyCorner = {
        decodeRGB: function (encodeDataArr, ctx, canvas) {
            var imageData = ctx.createImageData(canvas.width, canvas.height); // TODO - Create empty Array
            var red, green, blue;
            for (var i = 0; i < encodeDataArr.length * 4; i++) {
                imageData.data[(i * 4) + 0] = (encodeDataArr[i] >> 5) * 36.5; //red
                imageData.data[(i * 4) + 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
                imageData.data[(i * 4) + 2] = (encodeDataArr[i] & 3) * 85;
                imageData.data[(i * 4) + 3] = 255;
            }
            return imageData;
        },

        decodeRGBSlice: function (encodeDataArr, ctx, d) {
            var imageData = ctx.createImageData(d.w, d.h); // TODO - Create empty Array
            var red, green, blue;
            for (var i = 0; i < encodeDataArr.length * 4; i++) {
                imageData.data[(i * 4) + 0] = (encodeDataArr[i] >> 5) * 36.5; //red
                imageData.data[(i * 4) + 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
                imageData.data[(i * 4) + 2] = (encodeDataArr[i] & 3) * 85;
                imageData.data[(i * 4) + 3] = 255;
            }
            return imageData;
        },

        encodeRGB: function (imgData) {
            var length = imgData.length / 4;
            var encodeDataArr = new Uint8ClampedArray(length);
            var red, green, blue, encodedData;

            for (var i = 0; i < length; i++) {
                red = imgData[(i * 4) + 0];
                green = imgData[(i * 4) + 1];
                blue = imgData[(i * 4) + 2];
                encodedData = (Math.round((red / 36.5)) << 5) + (Math.round((green / 36.5)) << 2) + Math.round((blue / 85));
                encodeDataArr[i] = encodedData;
            }
            return encodeDataArr;
        },

        str2ImageData: function (str, d) {
            var imageData = context2.createImageData(d.w, d.h);
            var buf = new ArrayBuffer(str.length); // 2 bytes for each char
            imageData.data = new Uint8Array(buf);
            for (var i = 0, strLe = str.length; i < strLen; i++) {
                imageData.data[i] = str.charCodeAt(i);
            }
            return imageData;
        },

        doClearCanvas: function () {
            context2.clearRect(0, 0, canvas2.width, canvas2.height)
        }
    };
    window.dirtyCorner = dirtyCorner;
})(window);
