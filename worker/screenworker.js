/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Jai Gupta <http://www.vidyamantra.com>
 * @module Processing of Screen Sharing related stuff
 */

var x, y, cx, cy, sl, needFullScreen = 0;
var tempObj, matched, masterSlice, d, imgData, encodeDataArr = null;
var prevImageSlices = [];


/**
 * Encodes Image Data from 4 bit per pixel into 1 bit per pixel (It reduces size)
 * @param imgData
 */
var encodeRGB = function (imgData) {
    "use strict";
    var length = imgData.length / 4, red, green, blue, encodedData, i;
    if (encodeDataArr === null || encodeDataArr.length !== length) {
        encodeDataArr = new Uint8ClampedArray(length);
    }
    for (i = 0; i < length; i++) {
        red = imgData[(i * 4)];
        green = imgData[(i * 4) + 1];
        blue = imgData[(i * 4) + 2];
        encodedData = (Math.round((red / 36.5)) << 5) + (Math.round((green / 36.5)) << 2) + Math.round((blue / 85));
        encodeDataArr[i] = encodedData;
    }
};

/**
 * Converts an number into multiple bytes assuming that one byte can store a 2 digit number for simplicity
 * @param value
 * @param length
 * @returns {Array}
 */
function breakintobytes(value, length) {
    "use strict";
    var numstring = value.toString(), i;
    for (i = numstring.length; i < length; i++) {
        numstring = '0' + numstring;
    }
    return numstring.match(/[\S]{1,2}/g) || [];
}

/**
 * Package Image data as per protocol
 * @param encodedData
 * @param dimension
 * @param screenType
 * @returns {Uint8ClampedArray}
 */
var sendSliceData = function (encodedData, dimension, screenType) {
    "use strict";
    var x, y, appCode, scode, sendmsg;
    x = breakintobytes(dimension.x, 4);
    y = breakintobytes(dimension.y, 4);
    appCode = (screenType === 'ss') ? 103 : 203;
    scode = new Uint8ClampedArray([appCode, x[0], x[1], y[0], y[1], dimension.h, dimension.w]);
    sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
    sendmsg.set(scode);
    sendmsg.set(encodedData, scode.length);
    return sendmsg;
};

/**
 * Combine multiple images into a single Image data
 * @param encodedData
 */
var addSliceToSingle = function (encodedData) {
    "use strict";
    // masterSlice === 'undefined' is false when masterSlice is undefined
    //if (masterSlice === null || masterSlice === 'undefined') {
    if (masterSlice === null || masterSlice === undefined) {

        masterSlice = encodedData;
    } else {
        var tempslice = new Uint8ClampedArray(masterSlice.length + encodedData.length);
        tempslice.set(masterSlice);
        tempslice.set(encodedData, masterSlice.length);
        masterSlice = tempslice;
        tempslice = null;
    }
};

/**
 * nicholas ortenzio
 * nicholas.ortenzio@gmail.com
 *
 * a faster alternative to canvas getImageData()
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Nicholas Ortenzio
 *
 * @param x - starting x coordinate
 * @param y - starting y coordinate
 * @param w - width of rectangle to get data from
 * @param h - height of rectangle to get data from
 * @param W - width of the original image data
 * @param H - height of th original image data
 * @param d - image data (cache this once)
 * @returns {Uint8ClampedArray}
 * https://github.com/youbastard/getImageData
 */
var getImageDataCache = function (x, y, w, h, W, H, d) {
    "use strict";
    var arr = new Uint8ClampedArray(w * h), i = 0;
    for (var r = y; r < (h) + y; r += 1) {
        for (var c = x; c < (w) + x; c += 1) {
            var O = ((r * W) + c);
            arr[i++] = d[O];
        }
    }
    return arr;
};

/**
 * Match Old Image with New Image, returns true of match is not found
 * @param newImage
 * @param oldImage
 * @param width
 * @returns {boolean}
 */
var matchWithPrevious = function (newImage, oldImage, width) {
    "use strict";
    var l = oldImage.length, w = width, i;
    if (oldImage.length !== newImage.length) {
        return false;
    }
    for (i = 0; i < l; i = i + 1) { // Quickly Check Forward Diagonal
        if (oldImage[i] !== newImage[i]) {
            return false;
        }
        i = i + w;
    }
    for (i = 0; i < l; i = i - 1) {// Quickly Check Backward Diagonal
        i = i + w;
        if (oldImage[i] !== newImage[i]) {
            return false;
        }
    }
    var jump = 7; // Let us not check all pixels and rather check at intervals to favor speed
    for (i = 0; i < l; i = i + jump) { // Check (all/jump) pixels
        if (oldImage[i] !== newImage[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Helper function to calculate dimensions
 * @param e
 * @returns {{x: *, y: *, w: (wdw|dw), h: (wdh|dh)}}
 */
function calcDimensions(e) {
    "use strict";
    if (sl === 0) {
        x = 0;
        y = 0;
    } else {
        cx = sl % e.data.resB; // for x
        cy = Math.floor(sl / e.data.resB); // for y
        x = cx * e.data.dw;
        y = cy * e.data.dh;
    }
    return {'x': x, 'y': y, 'w': e.data.dw, 'h': e.data.dh};
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
    if (e.data.hasOwnProperty('initPrevImg')) {
        prevImageSlices = [];
        encodeDataArr = null;
    } else {
        if (!e.data.hasOwnProperty('resize')) { // Resize operation is a special case, treat it as a new image for simplicity
            encodeRGB(e.data.img);
            for (sl = 0; sl < ( e.data.resA * e.data.resB); sl++) {
                d = calcDimensions(e);
                imgData = getImageDataCache(d.x, d.y, d.w, d.h, e.data.offsetWidth, e.data.offsetHeight, encodeDataArr);
                if (typeof prevImageSlices[sl] !== 'undefined') {
                    matched = matchWithPrevious(imgData, prevImageSlices[sl], d.w);
                    if (!matched) {
                        if (prevImageSlices[sl].length !== imgData.length) {
                            prevImageSlices[sl] = imgData;
                        } else {
                            for (var l = 0; l < imgData.length; l++) {
                                prevImageSlices[sl][l] = imgData[l];
                            }
                        }
                        addSliceToSingle(sendSliceData(imgData, d, e.data.type));
                    }
                } else {
                    prevImageSlices[sl] = imgData;
                    needFullScreen = 1;
                }
            }
            if (masterSlice) {
                postMessage({
                    masterSlice: masterSlice,
                    needFullScreen: needFullScreen
                }, [masterSlice.buffer]);
            } else {
                postMessage({
                    masterSlice: null,
                    needFullScreen: needFullScreen
                });
            }
            needFullScreen = 0;
            masterSlice = null;
        } else {
            for (sl = 0; sl < ( e.data.resA * e.data.resB); sl++) {
                d = calcDimensions(e);
                prevImageSlices[sl] = getImageDataCache(d.x, d.y, d.w, d.h, e.data.offsetWidth, e.data.offsetHeight, e.data.img);
            }
        }
    }
};