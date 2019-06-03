var serverData = {
    rawData: {video: [], ppt: [], docs: []},

    fetchAllData: function (cb) {
        console.log('Fetch all data');
        this.cb = cb;
        console.log('Request get document url');
        this.requestData(virtualclass.api.GetDocumentURLs);
    },

    requestData: function (url) {
        this.rawData = {video: [], ppt: [], docs: []};
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        var that = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                // that.formatRawData(xhr.responseText);
                // if(typeof that.cb != 'undefined'){
                //     that.cb();
                // }
                that.afterResponse(xhr.responseText);
            }
        };

        xhr.setRequestHeader('x-api-key', wbUser.lkey);
        xhr.setRequestHeader('x-congrea-authuser', wbUser.auth_user);
        xhr.setRequestHeader('x-congrea-authpass', wbUser.auth_pass);
        xhr.setRequestHeader('x-congrea-room', wbUser.room);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);

    },

    // requestData3 :function(url) {
    //     this.rawData = {video:[], ppt:[], docs:[]};
    //     virtualclass.xhrn.sendData(null, url, this.afterResponse);
    // },

    afterResponse: function (responseText) {
        if (responseText != 'ERROR') {
            virtualclass.serverData.formatRawData(responseText);
            virtualclass.gObj.fetchedData = true;
            if (typeof virtualclass.serverData.cb != 'undefined') {
                virtualclass.serverData.cb();
            }
        }
    },

    /* To move this function */
    formatRawData: function (raw) {
        var awsData = JSON.parse(raw);

        this.awsUrlArr(awsData);
    },

    awsUrlArr: function (data) {
        this.rawData = {video: [], ppt: [], docs: []};
        var processedArr = [];
        var arr = data.Items;
        var newArr = [];
        var prefix = "https://media.congrea.net/";
        var doc = "https://media.congrea.net";
        var imageUrl, pdfUrl, thnailUrl;
        var cpath; // common path

        for (var j = 0; j < arr.length; j++) {
            if (arr[j].hasOwnProperty('filetype')) {
                switch (arr[j].filetype.S) {
                    case "doc":
                        var obj = this.processObj(arr[j]);
                        cpath = arr[j].processed_data.M.commonpath.S;
                        var count = parseInt(arr[j].processed_data.M.count.N);

                        if (cpath != null && count != null) {
                            var docPrefix = doc + "/" + arr[j].processed_data.M.commonpath.S;
                            var prefix, num, noteId;
                            var notes = {};
                            obj.notes = {}
                            obj.notesarr = [];
                            var deletedNotes = [];
                            var disabledNotes = [];

                            if (obj.hasOwnProperty('deletednes')) {
                                deletedNotes = obj.deletednes;
                            }

                            if (obj.hasOwnProperty('disablednes')) {
                                disabledNotes = obj.disablednes;
                            }


                            for (var i = 1; i <= count; i++) {
                                num = pad(i, 3);
                                imageUrl = docPrefix + "/image/" + num + "." + arr[j].processed_data.M.image.M.type.S;
                                pdfUrl = docPrefix + "/pdf/" + num + ".pdf";
                                thnailUrl = docPrefix + "/thumbnail/" + num + "." + arr[j].processed_data.M.thumbnail.M.type.S;

                                if (i > 99) {
                                    noteId = obj.fileuuid + '_' + i;
                                } else if (i > 9) {
                                    noteId = obj.fileuuid + '_0' + i
                                } else {
                                    noteId = obj.fileuuid + '_00' + i;
                                }
                                var tobj = {};
                                if (deletedNotes.length > 0) {
                                    if (deletedNotes.indexOf(i) > -1) {
                                        tobj.deletedn = noteId;
                                    }
                                }
                                tobj.id = noteId;
                                tobj.pdf = pdfUrl;
                                tobj.image = imageUrl;
                                tobj.thumbnail = thnailUrl;


                                if (disabledNotes.length > 0) {
                                    if (disabledNotes.indexOf(i) > -1) {
                                        tobj.status = 0;
                                    } else {
                                        tobj.status = 1;
                                    }
                                } else {
                                    tobj.status = 1;
                                }
                                obj.notes[noteId] = tobj;
                                obj.notesarr.push(tobj);
                            }

                            processedArr.push(obj);
                            this.rawData.docs.push(obj);
                        }
                        break;
                    case  'video':
                        if (arr[j].processed_data != null && arr[j].processed_data.S == 'COMPLETED') {
                            var obj = this.processObj(arr[j]);

                            var add = obj.filepath.substr(0, obj.filepath.lastIndexOf("/"));
                            obj.urls = {};
                            obj.urls.thumbnail = {};
                            obj.urls.videos = {};
                            obj.urls.main_video = prefix + add + "/video/play_video.m3u8";
                            obj.urls.videos["0400k"] = prefix + add + "/video/0400k/video.m3u8";
                            obj.urls.videos["0600k"] = prefix + add + "/video/0600k/video.m3u8";
                            obj.urls.videos["1000k"] = prefix + add + "/video/1000k/video.m3u8";
                            obj.urls.videos["1500k"] = prefix + add + "/video/1500k/video.m3u8";
                            obj.urls.videos["2000k"] = prefix + add + "/video/2000k/video.m3u8";


                            obj.urls.thumbnail["0400k"] = prefix + add + "/video/0400k/thumbs/00001.png";
                            obj.urls.thumbnail["0600k"] = prefix + add + "/video/0600k/thumbs/00001.png";
                            obj.urls.thumbnail["1000k"] = prefix + add + "/video/1000k/thumbs/00001.png";
                            obj.urls.thumbnail["1500k"] = prefix + add + "/video/1500k/thumbs/00001.png";
                            obj.urls.thumbnail["2000k"] = prefix + add + "/video/2000k/thumbs/00001.png";
                            processedArr.push(obj);
                            this.rawData.video.push(obj);
                        }
                        break;

                    case 'video_yts':
                        console.log('Handle youtube');
                        var obj = this.processVidUrlObj(arr[j]);
                        obj.urls = {};
                        obj.urls.main_video = obj.URL;
                        processedArr.push(obj);
                        this.rawData.video.push(obj);
                        break;

                    case 'presentation':
                        console.log("presentation data")
                        // console.log(obj);
                        var obj = this.processVidUrlObj(arr[j]);
                        obj.urls = {};
                        obj.urls.presentation = obj.URL;
                        processedArr.push(obj);
                        this.rawData.ppt.push(obj);
                        break;
                    case 'video_online' :
                        console.log('Handle one line ');
                        var obj = this.processVidUrlObj(arr[j]);
                        obj.urls = {};
                        obj.urls.main_video = obj.URL;
                        processedArr.push(obj);
                        this.rawData.video.push(obj);
                        break;

                }
            }
        }

        virtualclass.awsData = processedArr;
        //console.log(virtualclass.awsData);
        function pad(n, length) {
            var len = length - ('' + n).length;
            return (len > 0 ? new Array(++len).join('0') : '') + n
        }

    },

    processObj: function (obj) {
        var temp = {};
        // temp.filetag= obj.fileetag.S;
        temp.filename = obj.filename.S;
        temp.filepath = obj.filepath.S;
        temp.filetype = obj.filetype.S;
        temp.fileuuid = obj.fileuuid.S;
        temp.key_room = obj.key_room.S;
        temp.fileuuid = obj.fileuuid.S;

        if (obj.hasOwnProperty('deleted')) {
            if (obj.deleted.NS[0] == '0') {
                temp.deleted = obj.deleted.NS[0];
            } else {
                temp.deletednes = obj.deleted.NS;
            }
        }

        if (obj.hasOwnProperty('disabled')) {
            if (obj.disabled.NS[0] == '0') {
                temp.disabled = obj.disabled.NS[0];
            } else {
                temp.disablednes = obj.disabled.NS;
            }
        }
        return temp;
    },

    processVidUrlObj: function (obj) {
        var temp = {};
        // temp.filetag= obj.fileetag.S;
        temp.URL = obj.URL.S;
        temp.filename = temp.URL;
        temp.filetype = obj.filetype.S;
        temp.fileuuid = obj.fileuuid.S;
        temp.key_room = obj.key_room.S;
        temp.fileuuid = obj.fileuuid.S;
        if (obj.hasOwnProperty('deleted')) {
            temp.deleted = obj.deleted.NS[0];
        }
        if (obj.hasOwnProperty('disabled')) {
            temp.disabled = obj.disabled.NS[0];
        }
        return temp;
    },

    pollingStatus: function (cb) {
        var url = virtualclass.api.GetDocumentStatus;
        if (virtualclass.gObj.hasOwnProperty('pollingDocumentStatus')) {
            clearTimeout(virtualclass.gObj.pollingDocumentStatus);
        }
        var that = this;
        virtualclass.gObj.pollingDocumentStatus = setTimeout(
            function () {
                virtualclass.xhrn.sendData({uuid: virtualclass.gObj.file.uuid}, url, function (response) {
                    var responseObj = JSON.parse(response).Item;
                    if (responseObj != undefined && typeof responseObj != 'undefined') {
                        if (responseObj.hasOwnProperty('processed_data') &&
                            (responseObj.processed_data.hasOwnProperty('S') && (responseObj.processed_data.S == 'COMPLETED') ||
                            (responseObj.processed_data.hasOwnProperty('M') && responseObj.processed_data.M.hasOwnProperty('pdf')))) {
                            clearTimeout(virtualclass.gObj.pollingDocumentStatus);
                            virtualclass.serverData.fetchAllData(cb);
                        } else {
                            that.pollingStatus(cb);
                        }
                    }
                });
            }, 5000
        );
    }
}