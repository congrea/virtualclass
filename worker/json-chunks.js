/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta <http://www.vidyamantra.com>
 * @module Break recording data into chunks and compress.
 */

importScripts('lzstring.js');

var cn,  totalStore = 0;
var sizemultiplier = 1024 * 1024;
var csize = 100;
var datatmp, beforeStringfy, ctmp;
var totalSent = 0;

function sliceandstring() {
    "use strict";
    ctmp = beforeStringfy.slice(0, csize);
    datatmp = JSON.stringify(ctmp);
}

onmessage = function (e) {
    "use strict";
    var i = 0, alldata, data;
    if (e.data.hasOwnProperty('rdata') && e.data.hasOwnProperty('makeChunk')) {
        beforeStringfy = e.data.rdata;
        totalStore = e.data.rdata.length;
        for (i = 0; beforeStringfy.length; i++) {
            sliceandstring();
            //when data less than 2MB
            while ((datatmp.length < (sizemultiplier * 2)) && (beforeStringfy.length > csize)) {
                if (datatmp.length < (sizemultiplier * 2)) {
                    csize = Math.round(csize * 1.5);
                }
                sliceandstring();
            }
            //when data more than 8MB
            while ((datatmp.length > (sizemultiplier * 8)) && (csize > 1)) {
                if (datatmp.length > (sizemultiplier * 8)) {
                    csize = Math.round(csize / 1.5);
                }
                sliceandstring();
            }
            beforeStringfy.splice(0, csize);

            totalSent += csize;
            datatmp = LZString.compressToEncodedURIComponent(datatmp);
            postMessage({
                rdata: datatmp,
                totalSent: totalSent, //crrent data
                totalStore: totalStore,
                cn: cn
            });
            cn++;
        }
        postMessage({status: 'done'});
    } else if (e.data.hasOwnProperty('rdata') && e.data.hasOwnProperty('getData')) {
        alldata = JSON.parse(e.data.rdata);
        data = LZString.decompressFromEncodedURIComponent(alldata.rdata);
        alldata.rdata = JSON.parse(data);
        postMessage({
            alldata: alldata
        })
    }
};