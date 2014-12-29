
var x, y, cx, cy, sl, needFullScreen = 0;
var tempObj, matched, masterSlice, d, imgData, encodeDataArr = null;
var prevImageSlices = [];

onmessage = function(e) {

    encodeRGB(e.data.img);

    for (sl=0; sl<( e.data.resA *  e.data.resB); sl++) {
        if(sl==0){
            x = 0;
            y = 0;
        }else{
            cx = sl  % e.data.resB; // for x
            cy = Math.floor(sl / e.data.resB); // for y
            x = cx * e.data.dw;
            y = cy * e.data.dh;
        }
        d = {'x' : x, 'y' : y, 'w' : e.data.dw, 'h' : e.data.dh};

        imgData = getImageDataCache(d.x, d.y, d.w, d.h, e.data.offsetWidth, e.data.offsetHeight, encodeDataArr);

        if(typeof prevImageSlices[sl] != 'undefined'){
            matched = matchWithPrevious(imgData, prevImageSlices[sl], d.w);
            if(!matched){
                if (prevImageSlices[sl].length != imgData.length) {
                    prevImageSlices[sl] = imgData;
                }else {
                    for (var l=0; l<imgData.length; l++) {
                        prevImageSlices[sl][l] = imgData[l];
                    }
                }
                addSliceToSingle(sendSliceData(imgData, d, e.data.type));
            }

        }else{
            prevImageSlices[sl] = imgData;
            needFullScreen=1;
        }
    }
    if (masterSlice) {
        postMessage({
            masterSlice:masterSlice,
            needFullScreen:needFullScreen
        }, [masterSlice.buffer]);
    } else {
        postMessage({
            masterSlice:null,
            needFullScreen:needFullScreen
        });
    }

    needFullScreen=0;
    masterSlice=null;
};

var encodeRGB = function(imgData){
    var length = imgData.length/4;
    if (encodeDataArr == null || encodeDataArr.length != length) {
        encodeDataArr = new Uint8ClampedArray(length);
    }
    //   int packed = (red / 32 << 5) + (green / 32 << 2) + (blue / 64)
    //(r*6/256)*36 + (g*6/256)*6 + (b*6/256)
    var red, green, blue, encodedData;

    for(var i=0; i<length; i++){
        red = imgData[(i * 4)+ 0];
        green = imgData[(i * 4)+ 1];
        blue = imgData[(i * 4)+ 2];
        //encodedData = (Math.round((red / 32)) << 5) + (Math.round((green / 32)) << 2) + Math.round((blue / 64));
        encodedData = (Math.round((red / 36.5)) << 5) + (Math.round((green / 36.5)) << 2) + Math.round((blue / 85));
        //encodedData = (red*6/256)*36 + (green*6/256)*6 + (blue*6/256)

        encodeDataArr[i]=encodedData;
        //        encodeDataArr.push(encodedData);
    }

    //return encodeDataArr;
};

var sendSliceData = function (encodedData, d, stype){
    var x = breakintobytes(d.x,4);
    var y = breakintobytes(d.y,4);

    var appCode = (stype == 'ss') ? 103 : 203;

    var scode = new Uint8ClampedArray( [ appCode, x[0], x[1], y[0], y[1] , d.h, d.w ] );

    var sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
    sendmsg.set(scode);
    sendmsg.set(encodedData, scode.length);

    return sendmsg;
};

var addSliceToSingle = function (encodedData) {
    if (masterSlice == null) {
        masterSlice = encodedData;
    } else {
        var tempslice = new Uint8ClampedArray(masterSlice.length + encodedData.length);
        tempslice.set(masterSlice);
        tempslice.set(encodedData, masterSlice.length);
        masterSlice = tempslice;
        tempslice = null;
    }
};

/*
 * https://github.com/youbastard/getImageData
 */
var getImageDataCache = function (x, y, w, h, W, H, d) {
    var arr = new Uint8ClampedArray(w*h), i=0;
    for (var r=y; r<(h)+y; r+=1) {
        for (var c=x; c<(w)+x; c+=1) {
            var O = ((r*W) + c);
            arr[i++] = d[O];
        }
    }
    return arr;
};

var matchWithPrevious = function(newI, oldI, width){
    var l = oldI.length;
    var w = width;
    for(var i=0; i<l; i=i+1){ // Quickly Check Forward Diagnal
        if ( (! matchI (oldI[i],newI[i]))  ) {
            return false;
        }
        i = i + w;
    }
    for(var i=0; i<l; i=i-1){ // Quickly Check Backword Diagnal
        i = i + w;
        if ( (! matchI (oldI[i],newI[i]))  ) {
            return false;
        }
    }
    var jump = 7;
    for(var i=0; i<l; i=i+jump){ // Check (all/jump) pixals
        if ( (! matchI (oldI[i],newI[i])) ) {
            return false;
        }
    }
    return true;
};

var matchI = function(oldPixel,newPixel) {
    return (oldPixel == newPixel);
};

function breakintobytes (val,l) {
    var numstring = val.toString();
    for (var i=numstring.length; i < l; i++) {
        numstring = '0'+numstring;
    }
    var parts = numstring.match(/[\S]{1,2}/g) || [];
    return parts;
}

