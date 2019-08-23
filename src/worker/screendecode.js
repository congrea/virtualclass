/** @Copyright 2017  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Jai Gupta and Suman Bogati <http://www.vidyamantra.com>
 * @module Processing of Screen Sharing related stuff
 */
const screenDecodeBlob = URL.createObjectURL(new Blob(['(',
  function () {
    let globalImageData = {}; let imgData; let
      sendTimeout;

    function decodeRGB(encodeDataArr, cwidth, cheight, uid) {
      globalImageData = new ImageData(cwidth, cheight);
      const myLoop = encodeDataArr.length * 4;
      for (let i = 0; i < myLoop; i++) {
        globalImageData.data[(i * 4) + 0] = (encodeDataArr[i] >> 5) * 36.5; // red
        globalImageData.data[(i * 4) + 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
        globalImageData.data[(i * 4) + 2] = (encodeDataArr[i] & 3) * 85;
        globalImageData.data[(i * 4) + 3] = 255;
      }
      postMessage({
        globalImageData,
        dtype: 'drgb',
        stype: 'full',
        uid,
      });
    }

    function decodeRGBSlice(encodeDataArr) {
      myLoop = encodeDataArr.length * 4;
      imgData = new Uint8ClampedArray(myLoop);

      for (let i = 0; i < myLoop; i++) {
        imgData[(i * 4) + 0] = (encodeDataArr[i] >> 5) * 36.5; // red
        imgData[(i * 4) + 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
        imgData[(i * 4) + 2] = (encodeDataArr[i] & 3) * 85;
        imgData[(i * 4) + 3] = 255;
      }
    }

    function putImageDataCache(x, y, w, h, putData) {
      const W = globalImageData.width;
      let i = 0;
      for (let r = y; r < h + y; r++) {
        for (let c = x; c < w + x; c++) {
          const O = ((r * W) + c) * 4;
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
      const nres = n1 + n2;
      return parseInt(nres);
    }

    function preNumValidateTwo(n) {
      const numstring = n.toString();
      if (numstring.length == 1) {
        return `0${numstring}`;
      } if (numstring.length == 2) {
        return numstring;
      }
    }

    function process_data_pack(data_pack) {
      let s = 7;
      for (let i = 0; (i + 7) <= data_pack.length; i = l + 1) {
        x = numValidateTwo(data_pack[i + 1], data_pack[i + 2]);
        y = numValidateTwo(data_pack[i + 3], data_pack[i + 4]);
        h = parseInt(data_pack[i + 5]);
        w = parseInt(data_pack[i + 6]);
        l = s + (h * w) - 1;
        recmsg = data_pack.subarray(s, l + 1);
        const d = {
          x, y, w, h,
        };
        decodeRGBSlice(recmsg);
        putImageDataCache(x, y, w, h, imgData);
        s = l + 7 + 1;
      }
      if (sendTimeout) {
        clearTimeout(sendTimeout);
      }
      sendTimeout = setTimeout(() => {
        postMessage({
          globalImageData,
          dtype: 'drgb',
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
      if (Object.prototype.hasOwnProperty.call(e.data, 'dtype')) {
        if (e.data.dtype == 'drgb') { // decodeRGB
          decodeRGB(e.data.encodeArr, e.data.cw, e.data.ch, e.data.uid);
        } else {
          // for decoding slicing image
          process_data_pack(e.data.data_pack);
        }
      }
    };
  }.toString(),
  ')()'], { type: 'application/javascript' }));
const sdworker = new Worker(screenDecodeBlob);
