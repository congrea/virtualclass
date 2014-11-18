/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(
    function (window){
        var dirtyCorner =  {
      /*      
                decodeRGB : function(encodeDataArr, ctx, d){
                    var imageData = ctx.createImageData(d.w, d.h); // TODO - Create empty Array
                    var red, green, blue;    
                    for(var i=0; i<encodeDataArr.length / 3; i++){
                        imageData.data[(i * 4)+ 0] = encodeDataArr[(i * 3)+ 0];
                        imageData.data[(i * 4)+ 1] = encodeDataArr[(i * 3)+ 1];
                        imageData.data[(i * 4)+ 2] = encodeDataArr[(i * 3)+ 2];
                        imageData.data[(i * 4)+ 3] = 255;
                    }
                    return imageData;
                },
                
                encodeRGB : function(imgData){
                    var length = imgData.length/4;
                    var encodeDataArr = new Uint8ClampedArray(length*3);
                    var red, green, blue, encodedData;

                    for(var i=0; i<length; i++){
                        red = imgData[(i * 4)+ 0];
                        green = imgData[(i * 4)+ 1];
                        blue = imgData[(i * 4)+ 2];

                        encodeDataArr[(i * 3)+ 0]=red;
                        encodeDataArr[(i * 3)+ 1]=green;
                        encodeDataArr[(i * 3)+ 2]=blue;  
                    }

                    return encodeDataArr;
                },*/
            
                decodeRGB : function(encodeDataArr, ctx, d){
                    var imageData = ctx.createImageData(d.w, d.h); // TODO - Create empty Array
                    var red, green, blue;    
                    for(var i=0; i<encodeDataArr.length * 4; i++){
                        imageData.data[(i * 4)+ 0] = (encodeDataArr[i] >> 5) * 36.5; //red
                        imageData.data[(i * 4)+ 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
                        imageData.data[(i * 4)+ 2] = (encodeDataArr[i] & 3) * 85;
                        imageData.data[(i * 4)+ 3] = 255;
                    }
                    return imageData;
                },
                
                encodeRGB : function(imgData){
                    var length = imgData.length/4;
                    var encodeDataArr = new Uint8ClampedArray(length);
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

                    return encodeDataArr;
                },

//                decodeRGB : function(encodeDataArr, ctx, d){
//                    var imageData = ctx.createImageData(d.w, d.h); // TODO - Create empty Array
//                    var red, green, blue;    
//                    for(var i=0; i<encodeDataArr.length * 4; i++){
//                        imageData.data[(i * 4)+ 0] = (encodeDataArr[i] >> 5) * 36.5; //red
//                        imageData.data[(i * 4)+ 1] = ((encodeDataArr[i] & 28) >> 2) * 36.5;
//                        imageData.data[(i * 4)+ 2] = (encodeDataArr[i] & 3) * 85;
//                        imageData.data[(i * 4)+ 3] = 255;
//                    }
//                    return imageData;
//                },

                str2ImageData : function (str, d) {
                    var imageData=  context2.createImageData(d.w, d.h);
                    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
                    imageData.data = new Uint8Array(buf);
                    for (var i=0, strLen=str.length; i<strLen; i++) {
                      imageData.data[i] = str.charCodeAt(i);
                    }
                    return imageData;
                },

                doClearCanvas : function(){
                    context2.clearRect(0, 0, canvas2.width, canvas2.height)
                },
                getImageSlices : function(resA, resB, cApp){
                    //resB ==  y
                    //resA ==  x
                    var imgSlicesArr = [];
                    var totLen = resA * resB;
                    
                    var width =  Math.round( (cApp.localtempCanvas.width) / resB);
                    var height = Math.round( (cApp.localtempCanvas.height) / resA);

                    for(var i=0; i<totLen; i++){
                        var eachSlice  = this._getSingleSliceImg(i, width, height, resA, resB);
                        imgSlicesArr.push(eachSlice);
                    }
                    return imgSlicesArr;
                },

                _getSingleSliceImg : function(i, width, height, resA, resB){
                    var imgSlice = {};
                    var cwidth, cheight, cx, cy, ci =  0;

                    if(i==0){
                        x = 0;
                        y = 0;
                    }else{
                        cx = i  % resB; // for x
                        cy = Math.floor(i / resB); // for y

                        x = cx * width;
                        y = cy * height;;
                    }
                    return {'x' : x, 'y' : y, 'w' : width, 'h' : height}
                },

                matchWithPrevious : function(newI, oldI, width){
                    var l = oldI.length;
                    var w = width * 4;
                    for(var i=0; i<l; i=i+4){ // Quickly Check Forward Diagnal
                       if ( (! this.matchI (oldI,newI,i))  ) {
                           return false;
                       }
                       i = i + w;
                    }
                    for(var i=0; i<l; i=i-4){ // Quickly Check Backword Diagnal
                       i = i + w;
                       if ( (! this.matchI (oldI,newI,i))  ) {
                           return false;
                       }
                    }
                    var jump = 22;
                    for(var i=0; i<l; i=i+jump){ // Check (all/jump) pixals 
                        if ( (! this.matchI (oldI,newI,i)) ) {
                            return false;
                        }
                    }
                    return true;
                },

                matchI : function(oldImageArr,newImageArr,p) {
                    var quality = 10; // Lower is better but will create more false positive
                    for (var c=0; c<=2; c++) {
                        var color = oldImageArr[p + c]; 
                        var pcolor = newImageArr[p + c];
                        if( ( Math.abs(color - pcolor) ) > quality ){
                    //    if( color != pcolor){
                            return false;
                        }
                    }
                    return true;
                }
/*
                matchIShade : function(oldImageArr,newImageArr,p) {
                    return true;
                    var quality = 10; // Lower is better but will create more false positive
                    var r = oldImageArr[p + 0]; 
                    var pr = newImageArr[p + 0];
                    var g = oldImageArr[p + 1]; 
                    var pg = newImageArr[p + 1];
                    var b = oldImageArr[p + 2]; 
                    var pb = newImageArr[p + 2];
                    var cr = Math.abs(pr-r);
                    var cg = Math.abs(pg-g);
                    var cb = Math.abs(pb-b);
                    var ave = (cr + cg + cb) / 3;

                    if (Math.abs(ave-cr) > quality || Math.abs(ave-cg) > quality || Math.abs(ave-cb) > quality) {
                        return false;
                    }

                    return true;
                }*/
        }
        
        window.dirtyCorner = dirtyCorner;
    }
)(window);
