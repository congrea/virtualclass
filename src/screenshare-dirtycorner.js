/** To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (window) {
  const dirtyCorner = {
    decodeRGB(encodeDataArr, ctx, canvas) {
      const imageData = ctx.createImageData(canvas.width, canvas.height); // TODO - Create empty Array
      let red; let green; let
        blue;
      for (let i = 0; i < encodeDataArr.length * 4; i++) {
        imageData.data[(i * 4) + 0] = (encodeDataArr[i] >> 5) * 36.5; // red
        imageData.data[(i * 4) + 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
        imageData.data[(i * 4) + 2] = (encodeDataArr[i] & 3) * 85;
        imageData.data[(i * 4) + 3] = 255;
      }
      return imageData;
    },

    decodeRGBSlice(encodeDataArr, ctx, d) {
      const imageData = ctx.createImageData(d.w, d.h); // TODO - Create empty Array
      let red; let green; let
        blue;
      for (let i = 0; i < encodeDataArr.length * 4; i++) {
        imageData.data[(i * 4) + 0] = (encodeDataArr[i] >> 5) * 36.5; // red
        imageData.data[(i * 4) + 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
        imageData.data[(i * 4) + 2] = (encodeDataArr[i] & 3) * 85;
        imageData.data[(i * 4) + 3] = 255;
      }
      return imageData;
    },

    encodeRGB(imgData) {
      const length = imgData.length / 4;
      const encodeDataArr = new Uint8ClampedArray(length);
      let red; let green; let blue; let
        encodedData;

      for (let i = 0; i < length; i++) {
        red = imgData[(i * 4) + 0];
        green = imgData[(i * 4) + 1];
        blue = imgData[(i * 4) + 2];
        encodedData = (Math.round((red / 36.5)) << 5) + (Math.round((green / 36.5)) << 2) + Math.round((blue / 85));
        encodeDataArr[i] = encodedData;
      }
      return encodeDataArr;
    },

    str2ImageData(str, d) {
      const imageData = context2.createImageData(d.w, d.h);
      const buf = new ArrayBuffer(str.length); // 2 bytes for each char
      imageData.data = new Uint8Array(buf);
      for (let i = 0, strLe = str.length; i < strLen; i++) {
        imageData.data[i] = str.charCodeAt(i);
      }
      return imageData;
    },

    doClearCanvas() {
      context2.clearRect(0, 0, canvas2.width, canvas2.height);
    },
  };
  window.dirtyCorner = dirtyCorner;
}(window));
