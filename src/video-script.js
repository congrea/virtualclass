/**
 * This file is responisble to convert webp image to png image
 * This file is useful for the browser which does not support webp image format
 */

// //------------------------------------------------------------------------

function WebPDecDemo(canvasId) {
  const canvas = document.getElementById(canvasId);
  let context = canvas.getContext('2d');

  let outputData = null;
  let output = null;
  let active = null;
  const img = document.createElement('img');

  function drawBitmap(bitmap, WebPImage) {
    // (re)draw image, when size change
    if (WebPImage.biHeight.value != WebPImage.height.value || WebPImage.biWidth.value != WebPImage.width.value) {
      WebPImage.biHeight.value = WebPImage.height.value;
      WebPImage.biWidth.value = WebPImage.width.value;

      var biHeight = WebPImage.biHeight.value;
      var biWidth = WebPImage.biWidth.value;// alert(WebPImage.biHeight.value+' | '+WebPImage.biWidth.value);

      canvas.height = biHeight;
      canvas.width = biWidth;

      context = canvas.getContext('2d');
      output = context.createImageData(canvas.width, canvas.height);
      outputData = output.data;
    }
    if (bitmap && WebPImage.last_y.value != WebPImage.last_y_cache.value) {
      var biHeight = WebPImage.biHeight.value;
      var biWidth = WebPImage.biWidth.value;

      for (let h = WebPImage.last_y_cache.value; h < WebPImage.last_y.value; h++) {
        for (let w = 0; w < biWidth; w++) {
          outputData[0 + w * 4 + (biWidth * 4) * h] = bitmap[0 + w * 3 + (biWidth * 3) * h];
          outputData[1 + w * 4 + (biWidth * 4) * h] = bitmap[1 + w * 3 + (biWidth * 3) * h];
          outputData[2 + w * 4 + (biWidth * 4) * h] = bitmap[2 + w * 3 + (biWidth * 3) * h];
          outputData[3 + w * 4 + (biWidth * 4) * h] = 255;
        }
      }
      context.putImageData(output, 0, 0);
      WebPImage.last_y_cache.value = WebPImage.last_y.value;
    }
  }

  function NextRGB(decoder, idec, WebPImage, data, data_off, block_size, new_data, biHeight, biWidth, bitmap, last_y, start, sleep) {
    active = setTimeout(() => {
      // window.clearTimeout(aktiv);
      block_size = block_size + data_off > data.length ? data.length - data_off : block_size;
      // ... (get additional data)
      memcpy(new_data, 0, data, data_off, block_size);
      status = decoder.WebPIAppend(idec, new_data, block_size);// alert(status+' '+block_size+' '+data_off);
      // status = decoder.WebPIUpdate2(idec, data_off, block_size);//alert(status+' '+block_size+' '+data_off);
      bitmap = decoder.WebPIDecGetRGB(idec, WebPImage.last_y, WebPImage.width, WebPImage.height, WebPImage.stride);// alert(WebPImage.last_y.value);

      // (re)draw image, when size change
      drawBitmap(bitmap, WebPImage);

      data_off += block_size;

      if (status == 5 && active)// 5: VP8_STATUS_SUSPENDED
      { NextRGB(decoder, idec, WebPImage, data, data_off, block_size, new_data, biHeight, biWidth, bitmap, last_y, start, sleep); }
      if (status == 0) {
        const end = new Date();
        const bench_IDecoding = (end - start);
        decSpeedResult.innerHTML = `Speed result:<br />libwebpjs (Incremental decoding): finish in ${bench_IDecoding}ms`;
      }
    }, sleep);
  }

  const WebPIDecodeAndDraw = function (data) {
    clearTimeout(active);
    if (isNaN(parseInt(IncrementalDecBufferSizeBtn.value))) return;
    if (isNaN(parseInt(IncrementalDecSleepBtn.value))) return;

    data = convertBinaryToArray(data);
    const WebPImage = {
      last_y: { value: null },
      last_y_cache: { value: null },
      width: { value: 0 },
      height: { value: 0 },
      biWidth: { value: 0 },
      biHeight: { value: 0 },
      stride: { value: 0 },
    };

    const has_more_data = true;
    const block_size = parseInt(IncrementalDecBufferSizeBtn.value);
    const data_off = 0;
    const new_data = Arr(block_size - 1, 0);
    const biHeight = 0;
    const biWidth = 0;
    const bitmap = null;
    const last_y = null;
    const sleep = parseInt(IncrementalDecSleepBtn.value);

    const decoder = new WebPDecoder();
    const idec = decoder.WebPINew('MODE_RGB');

    // decoder.WebPIAppendAll(idec, new_data, new_data.length);

    const start = new Date();
    NextRGB(decoder, idec, WebPImage, data, data_off, block_size, new_data, biHeight, biWidth, bitmap, last_y, start, sleep);

    decoder.WebPIDelete(idec);
    finishDecoding();
  };
}
