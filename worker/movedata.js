/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
 
//number of chunck sent to server

var cn = 0;  
var totalSent = 0;
var totalStore = 0;
var sizemultiplier = 1024 * 1024;
var chunks = 0;
var cdata=[];
var ctmp;
var csize = 100;
var datatmp, beforeStringfy;
//var maxsize = 0;

function sliceandstring () {
    ctmp = beforeStringfy.slice(0, csize);
    datatmp = JSON.stringify(ctmp);
}

onmessage = function(e) {
    if(e.data.hasOwnProperty('rdata') && e.data.hasOwnProperty('makeChunk')){
        beforeStringfy = e.data.rdata;
        totalStore= e.data.rdata.length;
        
        for (var i=0; beforeStringfy.length; i++) {
            sliceandstring();

            //when data less than 2MB
            while ((datatmp.length < (sizemultiplier*2)) && (beforeStringfy.length > csize)) {
                if (datatmp.length < (sizemultiplier*2)) {
                    csize=Math.round(csize*1.5);
                }
                sliceandstring();
            }

            //when data more than 20MB
            while ((datatmp.length > (sizemultiplier*8)) && (csize > 1)) {
                if (datatmp.length > (sizemultiplier*8)) {
                    csize=Math.round(csize/1.5);
                }
                sliceandstring();
            }
            


            cdata[i]=beforeStringfy.splice(0,csize);
            
            postMessage({
                rdata:datatmp,
                import : true,
                currData : csize, //crrent data
                totalStore : totalStore,
                cn : cn

            });
            cn++;
        }
        postMessage({status:'done'});
        
    } else if (e.data.hasOwnProperty('rdata') && e.data.hasOwnProperty('getData')){
        var data = JSON.parse(e.data.rdata);
        
        postMessage({
            rdata : data,
            export : true
        });
    }
};

 
 
 
 
//onmessage = function(e) {
//    if (e.data.hasOwnProperty('rdata') && e.data.hasOwnProperty('compress')){
//        if(e.data.hasOwnProperty('fetch')){
//            var fetchData =  e.data.fetch;
//        }else{
//            var fetchData = "none";
//        }
//        
////        var stringifyData = JSON.stringify(e.data.rdata);
////        var data = LZString.compressToEncodedURIComponent(stringifyData);
//        var data = JSON.stringify(e.data.rdata);
//        postMessage({
//            rdata:data,
//            import : true,
//            fetch : fetchData,
//            totalSent : e.data.totalSent,
//            totalStore : e.data.totalStore
//        });
//    }else if (e.data.hasOwnProperty('rdata') && e.data.hasOwnProperty('decompress')){
//        var decodeLzString = LZString.decompressFromEncodedURIComponent(e.data.rdata);  
//        var data = JSON.parse(decodeLzString);
//        
//        postMessage({
//            rdata : data,
//            export : true
//        });
//    }
//};