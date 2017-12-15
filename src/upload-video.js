(function (window) {
    var videoUl = function () {
        return {
            videos: [],
            uploaderParam: {},
            videoObj: {},
            videoId: "",
            videoUrl: "",
            isfullscreen: false,
            videos: [],
            order: [],
            currPlaying: "",
            autoPlayFlag: 1,
            status: 0,
            yts:false,

            /*
             * it creates the the necessary layout and containers to place
             * video
             * Call to the function to create player object
             * @param  videoObj
             * @param  startFrom the position from where to start playing video in second

             */
            init: function (videoObj, startFrom) {
                this.videoInit = true;
                this.currPlaying = "";
                this.pages = {};
                virtualclass.previrtualclass = 'virtualclass' + "Video";
                virtualclass.previous = 'virtualclass' + "Video";

                if (typeof videoObj != 'undefined') {
                    if (videoObj.init != 'studentlayout') {
                        this.videoId = videoObj.init.videoId || videoObj.init;
                        this.videoUrl = videoObj.init.videoUrl;
                        this.yts=videoObj.init.yts;
                        this.isPaused= videoObj.init.isPaused;
                    }
                }

                if (!roles.hasAdmin() || (roles.isEducator())) {
                    if (typeof this.videoId == 'undefined' && roles.isStudent() && !virtualclass.videoUl.yts ) {
                    } else {
                        this.UI.container();
                        if (roles.hasControls()) {
                            ioAdapter.mustSend({'videoUl': {init: 'studentlayout'}, 'cf': 'videoUl'});
                            ioAdapter.mustSend({
                                'videoUl': {
                                    'init': {id: virtualclass.videoUl.videoId, videoUrl: virtualclass.videoUl.videoUrl},
                                    'startFrom': virtualclass.videoUl.player.currentTime()
                                }, 'cf': 'videoUl'
                            })
                        } else {
                            if (typeof videoObj != 'undefined') {

                                // this.UI.defaultLayoutForStudent();
                                if (!videoObj.hasOwnProperty('fromReload')) {
                                    if (this.videoId == undefined || typeof this.videoId == 'undefined') {
                                        this.UI.defaultLayoutForStudent();
                                    }else if(typeof this.videoId == 'object' && this.videoId.yts == false){
                                        this.UI.defaultLayoutForStudent();
                                    } else {
                                        var url = videoObj.url || videoObj.init.videoUrl;
                                        if(typeof url != 'undefined' && url != '' && videoObj.init != 'studentlayout'){
                                            (typeof startFrom == 'undefined') ? this.UI.displayVideo(videoObj.id, url) : this.UI.displayVideo(videoObj.id, url, startFrom);
                                        }
                                    }
                                }
                            } else {
                               // this.UI.defaultLayoutForStudent();
                                var msz = document.getElementById("messageLayoutVideo");
                                if (msz) {
                                    msz.style.display = "block";
                                }
                            }

                        }
                    }
                } else {
                    this.UI.container();
                    if (typeof startFrom != 'undefined' ) {
                        this.fromReload(this.videoId, this.videoUrl, startFrom);
                    } else {
                        ioAdapter.mustSend({'videoUl': {init: 'studentlayout'}, 'cf': 'videoUl'});
                    }
                }

            },


            createPageModule:function(){
                if(virtualclass.videoUl.videos && virtualclass.videoUl.videos.length){
                    virtualclass.videoUl.videos.forEach(function (vidObj, i) {
                        var idPostfix = vidObj.id;
                        virtualclass.videoUl.pages[idPostfix] = new virtualclass.page('videoList', 'video', 'virtualclassVideo', 'videoUl', vidObj.status);
                    });

                }

            },


            /*
             * on reload if videolist is stored in localstorage, it would be fetched from there
             * @param  videoobj from localstorage, if stored as a metadata in prevapp

             */

            videoListFromLocalStr: function (videoObj) {
                // if data available in localstorage
                if (typeof videoObj != 'undefined' && videoObj.hasOwnProperty('fromReload')) {
                    this.videos = JSON.parse(localStorage.getItem("videoList"));

                    // if videos available
                    if (this.videos && this.videos.length > 0) {

                        this.showVideos(this.videos, videoObj.init.videoId);
                        this.order = JSON.parse(localStorage.getItem("videoOrder"));
                        this.reArrangeElements(this.order); // 3, local storage
                        localStorage.removeItem("videoList");
                        localStorage.removeItem("videoOrder");
                    } else {
                        // if videolist is empty
                        var type = "video";
                        var firstId = "congrea" + type + "ContBody";
                        var secondId = "congreaShareVideoUrlCont";
                        var elemArr = [firstId, secondId];
                        this.modalPopup(type, elemArr);
                    }

                } else {
                    // When user come at first time i.e  no localstorage video data  available
                    var list = "onlyRetrieve";
                    //this.getVideoList(list);
                }
            },

            /*
             * rearranges  videos in playlist based on  updated order
             * @param  order of videolist element ,to be called each time,when
             * order changes or videolist to be displayed

             */

            //virtualclass.videoUl.videos

            reArrangeElementsOld: function (order) {
                var container = document.getElementById('listvideo'),
                tmpdiv = document.createElement('div');
                tmpdiv.id = "listvideo";
                tmpdiv.className = "videos";

                this.order = order;

                for (var i = 0; i < order.length; i++) {
                    var elem = document.getElementById('linkvideo' + order[i])
                    if (elem) {
                        tmpdiv.appendChild(elem);
                    }
                }

                container.parentNode.replaceChild(tmpdiv, container);
            },

            reArrangeElements: function (order) {
                var container = document.getElementById('listvideo'),
                    tmpdiv = document.createElement('div');
                tmpdiv.id = "listvideo";
                tmpdiv.className = "videos";

                var videos = this.getActiveVideos();
                var sortedItems = [];

                for(j=0; j<videos.length; j++){
                    if(order.indexOf(videos[j].fileuuid) <= -1){
                        order.push(videos[j].fileuuid);
                    }
                    // for(k=0; k<order.length; k++){
                    //     if(order[k] == videos[j].fileuuid){
                    //         sortedItems.push(videos[j]);
                    //
                    //     }
                    // }
                }

                for (var i = 0; i < order.length; i++) {
                    var elem = document.getElementById('linkvideo' + order[i])
                    if (elem) {
                        tmpdiv.appendChild(elem);
                    }
                }

                container.parentNode.replaceChild(tmpdiv, container);
            },

            getActiveVideos : function (){
                var activeVideos = [];
                for(var i=0; i<virtualclass.videoUl.videos.length; i++){
                    if(!virtualclass.videoUl.videos[i].hasOwnProperty('deleted')){
                        activeVideos.push(virtualclass.videoUl.videos[i]);
                    }
                }
                return activeVideos;
            },

            /*
             * after reload video state is retrived from localstorage
             * @param  id id of video
             * @param  url of the video
             * @param  startFrom place from where to start the video

             */
            fromReload: function (id, url, startFrom) {
                virtualclass.videoUl.UI.container();
                if(url){
                    virtualclass.videoUl.UI.displayVideo(id, url, startFrom);
                }else{
                    var obj={};
                    obj.init=id;
                    virtualclass.yts.init(obj,startFrom);
                }

            },

            /*
             * saves current list and current order in localstorage on reload

             */

            saveVideosInLocalStr: function () {
                var order = virtualclass.videoUl.order;
                console.log(order)
                console.log("videosinlocalstorage");
                console.log(virtualclass.videoUl.videos);
                localStorage.setItem('videoList', JSON.stringify(virtualclass.videoUl.videos));
                localStorage.setItem('videoOrder', JSON.stringify(virtualclass.videoUl.order));
            },

            /*
             * request order from database to rearrange videolist
             * @param  id id of video

             */
            // requestOrderOld: function (rdata) {
            //     virtualclass.xhr.sendFormData(rdata, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=congrea_retrieve_page_order", function (msg) {
            //         var content = JSON.parse(msg);
            //         if (content.message == "Failed") {
            //             console.log("page order retrieve failed");
            //         } else {
            //             if (content) {
            //                 virtualclass.videoUl.order = [];
            //                 virtualclass.videoUl.order = content.split(',');
            //                 console.log('From database ' + virtualclass.videoUl.order.join(','));
            //             }
            //             if (virtualclass.videoUl.order.length > 0) {
            //                 virtualclass.videoUl.reArrangeElements(virtualclass.videoUl.order);
            //             }
            //         }
            //     });
            // },


            requestOrder: function () {
                var url = 'https://api.congrea.net/t/GetRoomMetaData';
                virtualclass.xhrn.sendData({noting:true}, url, function (response) {
                    if (response == "Error") {
                        console.log("page order retrieve failed");
                    } else {
                        var response = JSON.parse(response).Item;
                        if (response.order.S) {
                            virtualclass.videoUl.order = [];
                            virtualclass.videoUl.order = response.order.S.split(',');
                            console.log('From database ' + virtualclass.videoUl.order.join(','));
                        }

                        if (virtualclass.videoUl.order.length > 0) {
                            virtualclass.videoUl.reArrangeElements(virtualclass.videoUl.order); // 1
                        }
                    }
                });

                // virtualclass.xhr.sendFormData(rdata, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=congrea_retrieve_page_order", function (msg) {
                //     var content = JSON.parse(msg);
                //     if (content.message == "Failed") {
                //         console.log("page order retrieve failed");
                //     } else {
                //         if (content) {
                //             virtualclass.videoUl.order = [];
                //             virtualclass.videoUl.order = content.split(',');
                //             console.log('From database ' + virtualclass.videoUl.order.join(','));
                //         }
                //         if (virtualclass.videoUl.order.length > 0) {
                //             virtualclass.videoUl.reArrangeElements(virtualclass.videoUl.order);
                //         }
                //     }
                // });
            },

            /*
             * after upload video callbback function to update  order of videolist
             * and new order to save in dabase
             * @param response message

             */
            //new

            afterDocStatus : function (response){
                var object = response;
            },

            afterUploadVideo: function (id, xhr, res) {
                var res = res.result;
                if(res == 'success'){
                    var url = 'https://api.congrea.net/t/GetDocumentStatus';
                    var that = this;

                    //To know the status
                    // virtualclass.xhrn.sendData({uuid : virtualclass.gObj.file.uuid}, url, function (response) {
                    //     that.afterDocStatus(response);
                    // });

                    virtualclass.videoUl.order.push(virtualclass.gObj.file.uuid);
                    //virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
                    virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
                    // virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
                    virtualclass.videoUl.showUploadMsz("video upload success","alert-success");

                    /** suman new aws**/

                    for(var i=0; i<virtualclass.gObj.uploadingFiles.length; i++){
                        var fileObj = {};
                        fileObj.filename = virtualclass.gObj.uploadingFiles[i].name + " (Processing...)";
                        fileObj.fileuuid = virtualclass.gObj.uploadingFiles[i].uuid;

                        // fileObj.filename = virtualclass.gObj.uploadingFiles[id].name;
                        // fileObj.fileuuid = id;

                        fileObj.type = 'video';
                        fileObj.key_room = virtualclass.gObj.sessionInfo.key + '_' + virtualclass.gObj.sessionInfo.room;
                        fileObj.noVideo = true;
                        console.log('File uploading ' + fileObj.filename);
                        this.afterUploadFile(fileObj);
                    }
                    virtualclass.gObj.uploadingFiles = [];

                    // this.pollingStatus(url);
                    virtualclass.serverData.pollingStatus(virtualclass.videoUl.UI.awsVideoList);

                } else if (res == "Failed" || res == "error" || res == "duplicate") {
                    alert("video upload failed");
                } else {
                    alert("video upload failed");
                    virtualclass.videoUl.showUploadMsz("video upload failed","alert-error");
                }

                var msz = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-list");
                if(msz){
                    msz.style.display="none";
                }
            },

            // pollingStatus : function (url){
            //     if(virtualclass.gObj.hasOwnProperty('pollingDocumentStatus')){
            //         clearTimeout(virtualclass.gObj.pollingDocumentStatus);
            //     }
            //     var that = this;
            //     virtualclass.gObj.pollingDocumentStatus = setTimeout(
            //         function (){
            //             virtualclass.xhrn.sendData({uuid : virtualclass.gObj.file.uuid}, url, function (response) {
            //                 var responseObj = JSON.parse(response).Item;
            //                 if(responseObj.hasOwnProperty('processed_data') && responseObj.processed_data.S == 'COMPLETED'){
            //                     clearTimeout(virtualclass.gObj.pollingDocumentStatus);
            //                     virtualclass.serverData.fetchAllData(virtualclass.videoUl.UI.awsVideoList);
            //                 } else {
            //                     that.pollingStatus(url);
            //                 }
            //             });
            //         }, 5000
            //     );
            // },

            afterUploadVideo2: function (id, xhr, res) {
                var res = res.result;
                if(res == 'success'){
                    virtualclass.videoUl.order.push(res.resultdata.id);
                    virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
                    virtualclass.videoUl.showUploadMsz("video upload success","alert-success");
                } else if (res == "Failed" || res == "error" || res == "duplicate") {
                    alert("video upload failed");
                } else {
                    alert("video upload failed");
                    virtualclass.videoUl.showUploadMsz("video upload failed","alert-error");
                }

                // if (res.message == "success") {
                //     virtualclass.videoUl.order.push(res.resultdata.id);
                //     virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
                //     virtualclass.videoUl.showUploadMsz("video upload success","alert-success");
                //
                // } else if (res.message == "Failed") {
                //     alert("video upload failed");
                //    // virtualclass.videoUl.showUploadMsz("video upload failed","alert-error");
                //
                //
                // } else if (res.message == "duplicate") {
                //     alert("video is already uploaded");
                //     virtualclass.videoUl.showUploadMsz("video upload failed","alert-error");
                //
                // } else {
                //     //fallback
                //     alert("video upload failed");
                //     virtualclass.videoUl.showUploadMsz("video upload failed","alert-error");
                //
                // }

                var msz = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-list");
                if(msz){
                    msz.style.display="none";
                }
            },

            showUploadMsz:function(msg,type){
                var mszCont= document.querySelector("#VideoDashboard #uploadMsz");
                var alertMsz= document.querySelector("#VideoDashboard #uploadMsz .alert");
                if(alertMsz){
                    alertMsz.parentNode.removeChild(alertMsz);
                }
                var elem = document.createElement("div");
                elem.className = "alert  alert-dismissable";
                elem.classList.add(type)
                elem.innerHTML = msg;
                mszCont.appendChild(elem);

                var btn = document.createElement("button");
                btn.className = "close";
                btn.setAttribute("data-dismiss", "alert")
                btn.innerHTML = "&times";
                btn.addEventListener('click',function(){
                    var msz = document.querySelector("#uploadMsz");
                    if(msz){
                        msz.style.display="none";
                    }
                })
                elem.appendChild(btn);

            },

            retrieveOrder2: function () {
                var rdata = new FormData();
                rdata.append("live_class_id", virtualclass.gObj.congCourse);
                rdata.append("content_order_type", "2");
                this.requestOrder(rdata);

            },

            retrieveOrder: function () {
                this.requestOrder();
            },

            /*
             * retrieve videolist from database
             */
            // getVideoList awsr();
            // getVideoList: function () {
            //     var data = new FormData();
            //     data.append("live_class_id", virtualclass.gObj.congCourse);
            //     data.append("type", "2");
            //     var cthis = this;
            //     virtualclass.xhr.sendFormData(data, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=congrea_retrieve_video", function (msg) {
            //         var content = JSON.parse(msg);
            //         if (content.message!= "noVideo") {
            //             virtualclass.videoUl.videos = content;
            //             virtualclass.videoUl.allPages = content;
            //             var type = "video";
            //             var firstId = "congrea" + type + "ContBody";
            //             var secondId = "congreaShareVideoUrlCont";
            //             var elemArr = [firstId, secondId];
            //             virtualclass.videoUl.showVideos(content);
            //             virtualclass.videoUl.retrieveOrder();
            //         } else {
            //             console.log(msg);
            //         }
            //     });
            // },

            afterUploadFile: function (vidObj) {
                var idPostfix = vidObj.fileuuid;
                // var docId = 'docs' + doc;
                this.pages[idPostfix] = new virtualclass.page('videoList', 'video', 'virtualclassVideo', 'videoUl', vidObj.status,vidObj.filetype);
                this.pages[idPostfix].init(idPostfix, vidObj.filename);
                this.videoDisplayHandler(vidObj);
                var vid = document.getElementById("linkvideo" + vidObj.fileuuid);
                var title = document.getElementById("videoTitle" + vidObj.fileuuid);
                if(title){
                    title.innerHTML = vidObj.filename;
                }
                
                var controlElem = vid.getElementsByClassName('status')[0];

                if (vidObj.hasOwnProperty('disabled')) {
                    this._disable(vidObj.fileuuid)
                    if(vid){
                        vid.classList.add("disable");
                        vid.dataset.status = 0;
                    }

                } else {
                    this._enable(vidObj.fileuuid);
                    if(vid){
                        vid.classList.add("enable");
                        vid.dataset.status = 1;

                    }
                }
                controlElem.dataset.status = vid.dataset.status;
                this.calculateHeight();

                if(vidObj.hasOwnProperty('noVideo')){
                    vid.classList.add('noVideo');
                }

            },

            calculateHeight:function(){
                var element = document.querySelector('#listvideo');
                var fineUploader = document.querySelector(".congrea .qq-uploader-selector");
                console.log(element.offsetHeight);
                var h = element.offsetHeight;
                console.log(fineUploader.offsetHeight);
                $('.qq-uploader-selector').css({
                    minHeight:h

                })

            },
            modalPopup: function (type, elemArr) {
                if ($('#listvideo .linkvideo.playing').length > 0) {
                    var id = $('#listvideo .linkvideo.playing').attr('data-rid')
                    this.currPlaying = id;
                }

                var upload = {}
                upload.wrapper = document.getElementById(elemArr[0]);
                upload.requesteEndPoint = window.webapi + "&methodname=file_save&live_class_id=" + virtualclass.gObj.congCourse + "&status=1&content_type_id=2&user=" + virtualclass.gObj.uid;
                upload.cb = virtualclass.videoUl.afterUploadVideo;
                upload.validation = ['mp4', 'webm']
                virtualclass.vutil.modalPopup('video', ["congreavideoContBody", "congreaShareVideoUrlCont"]);
                var cont = document.getElementById("contFooter");
                virtualclass.videoUl.UI.createYoutubeUrlCont(cont)

            },

            showVideos: function (content, storedId) {
                if (roles.hasControls()) {
                    virtualclass.videoUl.showVideoList();
                }
                var currId = virtualclass.videoUl.currPlaying || storedId;
                if (currId) {
                    virtualclass.videoUl.activeVideoClass(currId);
                }
            },

            showVideoList: function () {
                var list = document.getElementById("videoList");
                var elem = document.getElementById("listvideo");
                if (elem) {
                    for (var i = 0; i < elem.childNodes.length - 1; i++) {
                        elem.childNodes[i].parentNode.removeChild(elem.childNodes[i])
                    }
                }
                if(virtualclass.videoUl.videos && virtualclass.videoUl.videos.length){
                    virtualclass.videoUl.videos.forEach(function (vidObj, i) {
                        if(!vidObj.hasOwnProperty('deleted')){
                            var elem = document.querySelector('#linkvideo' + vidObj.fileuuid);
                            if(elem != null){
                                elem.classList.remove('noVideo');
                            }
                            virtualclass.videoUl.afterUploadFile(vidObj);
                        }
                    });
                }
                virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                virtualclass.vutil.makeElementActive('#listvideo');

            },

            videoDisplayHandler: function (vidObj) {
                var video = document.getElementById("mainpvideo" + vidObj.fileuuid);
                //if(vidObj.type =="online"){
                //     video.addEventListener('click',function(){
                //         virtualclass.videoUl.yts=false;
                //         $('#virtualclassVideo iframe#player').remove();
                //         $('#videoPlayerCont').css({"display":"block"});
                //         virtualclass.videoUl.shareVideo(vidObj.content_path);
                //         // video.setAttribute("data-dismiss","modal");
                //         virtualclass.dashBoard.close();
                //         // if(typeof virtualclass.yts.player == "object"){
                //         //     virtualclass.yts.player.destroy();
                //         // }
                //         virtualclass.videoUl.activeVideoClass(vidObj.id);
                //         virtualclass.videoUl.videoId = vidObj.id;
                //     })

               // } else{

                    if (video && !vidObj.status) {
                        if (!video.classList.contains("playDisable")) {
                            video.classList.add("playDisable");
                        }
                    } else {
                        if (video && video.classList.contains("playDisable")) {
                            video.classList.remove("playDisable");
                        }
                    }
                    if(video){
                        video.addEventListener("click", function () {
                            if(vidObj.filetype == "video_yts"){
                                virtualclass.videoUl.yts=true;
                            }else{
                                virtualclass.videoUl.yts=false;
                            }

                            var url =vidObj.urls.main_video;

                            virtualclass.videoUl.UI.displayVideo(vidObj.fileuuid, url);
                            virtualclass.videoUl.activeVideoClass(vidObj.fileuuidid);


                             var toStd={};
                             toStd.content_path=url;
                             toStd.id=vidObj.fileuuid;
                             toStd.title=vidObj.filename;
                             toStd.type=vidObj.filetype;
                            // to set status
                            //toStd.status=vidObj.statu


                            virtualclass.videoUl.videoToStudent(toStd);
                            virtualclass.videoUl.videoId = vidObj.fileuuid;
                            virtualclass.dashBoard.close();
                        });

                    }

               // }

            },

            activeVideoClass: function (currId) {
                var otherElems = document.getElementsByClassName("controlCont");
                for (var i = 0; i < otherElems.length; i++) {
                    if (otherElems[i].classList.contains("removeCtr")) {
                        otherElems[i].classList.remove("removeCtr");
                    }

                }

                var controlElem = document.getElementById("controlContvideo" + currId);
                if ( controlElem && !controlElem.classList.contains("removeCtr")) {
                    controlElem.classList.add("removeCtr");
                }

                var otherElems = document.getElementsByClassName("linkvideo");
                for (var i = 0; i < otherElems.length; i++) {
                    if (otherElems[i].classList.contains("playing")) {
                        otherElems[i].classList.remove("playing");
                    }
                }

                var currentVideo = document.getElementById("linkvideo" + currId);
                if (currentVideo && !currentVideo.classList.contains("playing")) {
                    currentVideo.classList.add("playing");
                }
            },

            shareVideo: function (videoUrl) {
                var videoObj = {};
                var id = "no";
                virtualclass.videoUl.UI.displayVideo(id, videoUrl);
                videoObj.instantVideo = true;
                videoObj.content_path = videoUrl;
                virtualclass.videoUl.videoToStudent(videoObj);
            },


            destroyPl: function () {
                if (typeof virtualclass.videoUl.player == 'object') {
                    if (virtualclass.currApp == 'ScreenShare') {
                        ioAdapter.mustSend({'video': 'destroyPl', 'cf': 'video'});
                    }
                    virtualclass.videoUl.player.dispose();
                    //virtualclass.videoUl.player = "";
                }
            },


            _rearrange: function (order) {
                this.order = order;
                this.reArrangeElements(order); // 2, rearrange
                this.sendOrder(this.order);
            },

            _editTitle:function(id,title,videotype){
                var form_data = new FormData();
                var data = {lc_content_id: id, action: 'edit',title:title, user: virtualclass.gObj.uid};
                var form_data = new FormData();
                for (var key in data) {
                    form_data.append(key, data[key]);
                    console.log(data[key]);
                }

                virtualclass.xhr.sendFormData(form_data, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=update_content_video", function (msg) {
                    if (msg != "ERROR") {
                        var elem = document.getElementById("videoTitle" + id);
                        if (elem) {
                            elem.innerHTML=title;
                            elem.style.display="inline";
                            //virtualclass.videoUl.order=[];
                            if(virtualclass.videoUl.videos && virtualclass.videoUl.videos.length){
                                virtualclass.videoUl.videos.forEach(function (video, index) {
                                    if (video["id"] == id) {
                                        console.log(video)
                                        video.title=title;

                                    }
                                })
                            }

                        }
                    }
                });


            },

            sendOrder2: function (order) {
                var data = {
                    'content_order': order.toString(),
                    content_order_type: 2,
                    live_class_id: virtualclass.gObj.congCourse
                };
                virtualclass.vutil.xhrSendWithForm(data, 'congrea_page_order', function (response) {
                });
            },


            sendOrder: function (order) {
                var data = {order:order.toString()};
                var url = 'https://api.congrea.net/t/UpdateRoomMetaData';
                virtualclass.xhrn.sendData(data, url, function (){});
            },

            onNewUser: function (msg) {
                console.log("videoUl");
                virtualclass.videoUl.videoId = msg.videoUl.init.id;
                virtualclass.videoUl.videoUrl = msg.videoUl.init.videoUrl;
                virtualclass.videoUl.UI.displayVideo(msg.videoUl.init.id, msg.videoUl.init.videoUrl, msg.videoUl.startFrom);
            },

            /*
             * message  handled at student's end
             * and new order to save in dabase
             * @param message from teacher

             */
            onmessage : function (msg) {
                if (typeof msg.videoUl == 'string') {
                    if (msg.videoUl == 'play') {
                        this.playVideo(msg);
                        virtualclass.videoUl.isPaused=false;
                    } else if (msg.videoUl == 'pause') {
                        this.pauseVideo();
                        virtualclass.videoUl.isPaused=true;
                    }
                    else if (msg.videoUl == 'destroyPlayer') {
                        virtualclass.videoUl.destroyPlayer();
                    } else if (msg.videoUl == 'enterFullScreen') {
                        // alert("enter full screen");
                        virtualclass.videoUl.enterFullScreen();

                    } else if (msg.videoUl == 'exitFullScreen') {
                        //alert("exit full screen");
                        virtualclass.videoUl.exitFullScreen();
                    }
                    else if(msg.videoUl == 'videoDelete'){
                        var playerCont = document.querySelector("#videoPlayerCont");
                        if(playerCont){
                            playerCont.style.display="none"
                            var msz= document.querySelector("#messageLayoutVideo");
                            if(msz){
                                msz.style.display="block";
                            }
                            virtualclass.videoUl.videoId = null;
                            virtualclass.videoUl.videoUrl = null;
                        }
                    }
                } else {
                    this.onmessageObj(msg);

                }
            },

            /*
             * message  handled at student's end
             * and new order to save in dabase
             * @param message from teacher

             */

            onmessageObj: function (msg) {
                if(msg.videoUl.type){
                    if(msg.videoUl.type=="video_yts"){
                        virtualclass.videoUl.yts=true;
                    }else{
                        virtualclass.videoUl.yts=false;
                    }
                }

                if (msg.videoUl.hasOwnProperty('init')) {
                    //virtualclass.videoUl.yts=false;
                    virtualclass.videoUl.rec = msg.videoUl;
                    console.log(virtualclass.videoUl.rec);
                    if (msg.videoUl.init == "studentlayout") {
                        virtualclass.makeAppReady('Video', undefined, msg.videoUl);
                        var msz = document.getElementById("messageLayoutVideo");
                        if (msz) {
                            msz.style.display = "block";
                        }
                    } else if (msg.videoUl.init.hasOwnProperty('videoUrl')) {
                        virtualclass.videoUl.videoId = msg.videoUl.init.id;
                        virtualclass.videoUl.videoUrl = msg.videoUl.init.videoUrl;
                        virtualclass.videoUl.UI.displayVideo(msg.videoUl.init.id, msg.videoUl.init.videoUrl, msg.videoUl.startFrom);
                        // if (msg.videoUl.isPaused) {
                        //     if (virtualclass.videoUl.player){
                        //         virtualclass.videoUl.player.pause();
                        //     }
                        // }
                    }
                } else if (msg.videoUl.hasOwnProperty('content_path')) {
                    virtualclass.videoUl.videoId = msg.videoUl.id;
                    virtualclass.videoUl.videoUrl = msg.videoUl.content_path;
                    virtualclass.videoUl.title = msg.videoUl.title;
                    virtualclass.videoUl.UI.displayVideo(msg.videoUl.id, virtualclass.videoUl.videoUrl);
                } else if (msg.videoUl.hasOwnProperty('play')) {
                    this.playVideo(msg.videoUl.play);
                    virtualclass.videoUl.isPaused=false;
                };
            },

            enablePlayer: function () {
                var stdVideo = document.getElementById("videoPlayerCont");
                if (stdVideo) {
                    stdVideo.style.display = "block";
                }
            },

            disablePlayer: function () {
                var stdVideo = document.getElementById("videoPlayerCont");
                if (stdVideo) {
                    stdVideo.style.display = "none";
                }

            },

            destroyPlayer: function () {
                virtualclass.videoUl.player.dispose();

            },

            playVideo: function (seekVal) {
                 //if(!virtualclass.videoUl.isPaused){
                    virtualclass.videoUl.player.play();
                    virtualclass.videoUl.player.currentTime(seekVal);
                // }

            },

            pauseVideo: function () {
                virtualclass.videoUl.player.pause();
                virtualclass.videoUl.isPaused=true;
            },

            /*
             * to play next video from the  the playlist
             * @param index  of next enabled video in the videolist array
             */

            autoPlayList: function (index) {
                var nextIndex = index;
                //var nextId = virtualclass.videoUl.order[index + 1];
                var currVideoObj = this.findNextObj(nextIndex)
                if (typeof currVideoObj != 'object') {

                    var nxIndex = currVideoObj;
                    if (nxIndex < virtualclass.videoUl.order.length) {
                        currVideoObj = this.autoPlayList(nxIndex)
                    }
                } else {
                    if (!virtualclass.videoUl.listEnd) {
                         if(currVideoObj.type=='online'){
                            virtualclass.videoUl.yts=false;
                            virtualclass.videoUl.UI.displayVideo(currVideoObj.id, currVideoObj.content_path);
                            virtualclass.videoUl.videoToStudent(currVideoObj);

                            if (virtualclass.videoUl.player) {
                                // virtualclass.videoUl.player.on("ready",function(){
                                virtualclass.videoUl.player.play();
                            }
                            this.activeVideoClass(currVideoObj.id);

                        }else{
                             if(currVideoObj.type=='video_yts'){
                                 virtualclass.videoUl.yts=true;
                             }else{
                                 virtualclass.videoUl.yts=false;
                             }
                            // var videoUrl ="https://media.congrea.net/yJaR3lEhER3470dI88CMD5s0eCUJRINc2lcjKCu2/12323/225a730b-4609-400c-8489-19d8e1bdaf5c/video/video.m3u8";
                             virtualclass.videoUl.UI.displayVideo(currVideoObj.id,videoUrl);
                            // virtualclass.videoUl.UI.displayVideo(currVideoObj.id, currVideoObj.content_path);
                             var toStd={};
                             toStd.content_path=url;
                             toStd.id=vidObj.fileuuid;
                             toStd.title=vidObj.filename;
                             toStd.type=vidObj.filetype;



                            virtualclass.videoUl.videoToStudent(toStd);

                            if (virtualclass.videoUl.player) {

                                virtualclass.videoUl.player.ready(function(){
                                    var myPlayer = this;
                                    myPlayer.play()

                                });
                            }
                            this.activeVideoClass(currVideoObj.id);

                        }

                    }
                }
            },
            /*
             * to find next video from the videolist

             */
            findNextObj: function (index) {
                var nextId = virtualclass.videoUl.order[index];
                var currVideoObj = false;

                for (var i = 0; i < virtualclass.videoUl.videos.length; i++) {
                    //for (var j in virtualclass.videoUl.videos[i]) {
                    if (virtualclass.videoUl.videos[i]['id'] == nextId) {

                        if (virtualclass.videoUl.videos[i]['status'] != "0") {
                            currVideoObj = virtualclass.videoUl.videos[i];
                            return currVideoObj;
                        } else {
                            return index + 1;
                        }
                    }
                }
            },

            /*
             * to disable  video in the videolist
             */

            _disable: function (_id) {
                var linkvideo = document.querySelector("#linkvideo"+_id);
                linkvideo.classList.add('playDisable');
                var video = document.getElementById("mainpvideo" + _id);
                video.style.opacity = .3;
                video.style.pointerEvents = 'none';
                
                if(virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                    virtualclass.videoUl.videos.forEach(function (elem, i) {
                        if (elem["fileid"] == _id) {
                            elem.status = 0;
                        }
                    })
                }
            },

            /*
             * to enable  video in the videolist
             */
            _enable: function (_id) {
                var linkvideo = document.querySelector("#linkvideo"+_id);
                linkvideo.classList.remove('playDisable');


                var video = document.getElementById("mainpvideo" + _id);
                if(video){
                    video.style.opacity = 1;
                    video.style.pointerEvents = 'auto';
                    if(virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                        virtualclass.videoUl.videos.forEach(function (elem, i) {
                            if (elem["id"] == _id) {
                                elem.status = 1;
                            }
                        })
                    }

                }
            },

            /*
             * to delete  video from list and from the database
             */
            _delete: function (id) {
                var data = {
                    uuid : id,
                    action : 'delete',
                    page : 0
                }
                var videoid = id;
                var url =  'https://api.congrea.net/t/UpdateDocumentStatus';
                var that = this;
                // virtualclass.xhrn.sendFormData({uuid:videoid}, url, function (msg) {
                //     that.afterDeleteCallback(msg)
                // });
                virtualclass.xhrn.sendData(data, url, function (msg) {
                    that.afterDeleteCallback(msg, id)
                });
            },

            afterDeleteCallback : function (msg, id){
                if (msg != "ERROR") {
                    var type ="saved";
                    var elem = document.getElementById("linkvideo" + id);
                    if (elem) {
                        if(elem.classList.contains("yts")){
                            type="yts"
                        }else if(elem.classList.contains("online")){
                            type="online";
                        }
                        elem.parentNode.removeChild(elem);
                        //virtualclass.videoUl.order=[];

                        if(virtualclass.videoUl.videoId == id ){
                            // if(type !="yts"){
                            var playerCont = document.querySelector("#videoPlayerCont");
                            if(playerCont){
                                playerCont.style.display="none";
                                ioAdapter.mustSend({'videoUl':'videoDelete', 'cf': 'videoUl'});

                                virtualclass.videoUl.videoId = null;
                                virtualclass.videoUl.videoUrl = null;
                            }
                        }
                        if(virtualclass.videoUl.videos && virtualclass.videoUl.videos.length){
                            virtualclass.videoUl.videos.forEach(function (video, index) {
                                if (video["id"] == id) {
                                    var index = virtualclass.videoUl.videos.indexOf(video)
                                    if (index >= 0) {
                                        virtualclass.videoUl.videos.splice(index, 1)
                                        console.log(virtualclass.videoUl.videos);
                                    }
                                }
                            })
                        }

                        var idIndex = virtualclass.videoUl.order.indexOf(id);
                        if (idIndex >= 0) {
                            virtualclass.videoUl.order.splice(idIndex, 1)
                            console.log(virtualclass.videoUl.order);
                            virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
                        }
                    }
                }
            },

            /*
             * to retrive order from data base
             */
            xhrOrderSendOld: function (order) {

                var data = {'content_order': order.toString(), content_order_type: 2}
                data.live_class_id = virtualclass.gObj.congCourse;
                var form_data = new FormData();
                for (var key in data) {
                    form_data.append(key, data[key]);
                    console.log(data[key]);
                }
                //                    window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=congrea_enable_video"
                var path = window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=congrea_page_order";
                var cthis = this;
                virtualclass.xhr.sendFormData(form_data, path, function () {
                    virtualclass.videoUl.getVideoList();
                });
            },

            xhrOrderSend: function (order) {
                var data = {order:order.toString()};
                var url = 'https://api.congrea.net/t/UpdateRoomMetaData';
                virtualclass.xhrn.sendData(data, url, function (){
                    // virtualclass.videoUl.UI.awsr();
                    virtualclass.serverData.fetchAllData(virtualclass.videoUl.UI.awsVideoList);
                });
            },

            videoToStudent: function (videoObj) {
                ioAdapter.mustSend({'videoUl': videoObj, 'cf': 'videoUl'});
            },

            getVideoId: function (url) {
                var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
                var m = url.match(rx);
                if (m != null && m.length > 1) {
                    var r = m[1].substring(0, 11);
                    if (r.length == 11) {
                        return r;
                    }
                }
                return false;
            },

            /*
             * this object is for user interface
             */
            UI: {
                id: 'virtualclassVideo',
                class: 'bootstrap virtualclass',
                /*
                 * Creates container for the video and appends the container before audio widget
                 */
                container: function () {
                    var videoCont = document.getElementById('virtualclassVideo');
                    if (!videoCont) {
                        var control = roles.hasAdmin() ? true : false;
                        var data = {"control": control};
                        var template = JST['templates/videoupload/videoupload.hbs'];
                        $('#virtualclassAppLeftPanel').append(template(data));
                        videoCont = document.getElementById(this.id);
                    }
                    if(!roles.hasControls()){
                        var msz = document.getElementById("messageLayoutVideo");
                        if (msz) {
                            msz.style.display = "block";
                        }
                    }

                },
                createYoutubeUrlCont:function(cont){
                    var list = document.createElement("div");
                    list.id="listvideo";
                    cont.appendChild(list);

                },

                displayVideo: function (vidId, videoUrl, startFrom) {
                    if (typeof virtualclass.videoUl.player == 'object') {
                        if (virtualclass.videoUl.player.hasOwnProperty('dispose')) {
                            virtualclass.videoUl.player.dispose();
                        }
                    }
                    virtualclass.videoUl.videoUrl = videoUrl;
                    virtualclass.videoUl.videoId = vidId;
                    // var videourl = "https://dev.muzioapp.com.s3-website-us-east-1.amazonaws.com/content/ourMuzeVid1.webm";
                    var videoCont = document.getElementById("videoPlayerCont");
                    if(videoCont){
                        videoCont.style.display = "block";
                    }

                    if($('iframe#player').length){
                        $('iframe#player').remove();
                    }
                    virtualclass.videoUl.UI.switchDisplay(videoCont, videoUrl);
                    virtualclass.videoUl.UI.videojsPlayer(videoUrl, vidId, startFrom);
                },

                videojsPlayer: function (videoUrl, vidId, startFrom) {
                    var player = videojs("dispVideo"); //TODO, generating error need to handle
                    if (roles.hasControls()) {
                        if (!($('.vjs-autoPlay-button').length)) {
                            virtualclass.videoUl.UI.appendAutoPlayButton(player);
                        }
                        var autoPlayBtn = document.getElementById("autoPlayListBtn")
                        if (autoPlayBtn) {
                            autoPlayBtn.innerHTML = virtualclass.videoUl.innerHtml;
                            autoPlayBtn.className = virtualclass.videoUl.autoPlayClass;
                        }
                    }
                    virtualclass.videoUl.player = player;
                    virtualclass.videoUl.UI.setPlayerUrl(player, videoUrl, startFrom);
                    virtualclass.videoUl.UI.attachPlayerHandler(player, vidId, videoUrl);
                },
                attachPlayerHandler: function (player, vidId, videoUrl) {

                    player.on("pause", function (e) {
                        console.log("paused");
                        if (roles.hasControls()) {
                            ioAdapter.mustSend({'videoUl': "pause", 'cf': 'videoUl'});
                        }
                        virtualclass.videoUl.isPaused=true;

                    });
                    player.on("play", function (e) {
                        console.log("play");
                        if (roles.hasControls()) {
                            ioAdapter.mustSend({'videoUl': {"play": player.currentTime()}, 'cf': 'videoUl'});
                        }
                        virtualclass.videoUl.isPaused=false;

                    });

                    player.on("fullscreenchange", function (e) {
                        //virtualclass.videoUl.UI.onfullscreenChange(player);
                    });
                    player.off("ended");

                    player.on("ended", function (e) {
                        virtualclass.videoUl.UI.onEnded(player, vidId, videoUrl);
                    });
                },
                // todo to modify
                switchDisplay: function (videoCont, videoUrl) {

                    var elem = document.getElementById("dispVideo");
                    if (!elem) {
                        virtualclass.videoUl.UI.createVideoElem(videoCont);

                    } else {
                        elem.style.display = "block";
                    }

                    var elem = document.getElementById("videoPlayerCont");
                    var msz = document.getElementById("messageLayoutVideo");
                    if (typeof videoUrl == 'undefined') {
                        elem.style.display = "none";
                        if (msz) {
                            msz.style.display = "block";
                        } else {
                            var elem = document.createElement("div");
                            elem.id = "messageLayoutVideo";
                        }

                    } else {
                        elem.style.display = "block";
                        if (msz) {
                            msz.style.display = "none";
                        }
                    }
                },
                //n
                createVideoElem: function (videoCont,type) {
                    var video ="";
                    if(virtualclass.videoUl.yts){
                        video = "<video id=dispVideo class=video-js controls  preload=auto data-setup='{ techOrder: [youtube], sources: [{ type: video/youtube}] }' >";
                    }else{
                        video = '<video id="dispVideo" class="video-js" controls  preload="auto" data-setup="{}" >';
                    }

                    $(videoCont).append(video);
                    var vn = document.createElement("p");
                    vn.setAttribute("class", "vjs-no-js")
                    var videoElem = document.getElementById("dispVideo");
                    videoElem.appendChild(vn);

                    var a = document.createElement("a");
                    a.setAttribute("href", "https://videojs.com/html5-video-support/");
                    a.setAttribute("target", "_blank");
                    a.innerHTML = "supports HTML5 video";
                    vn.appendChild(a);

                },

                setPlayerUrl: function (player, videoUrl, startFrom) {
                    var dispVideo = document.querySelector("#dispVideo");
                    if(virtualclass.videoUl.yts){
                        dispVideo.setAttribute('data-setup','{ techOrder: [youtube]}');
                        player.src({type: 'video/youtube', src:videoUrl});

                    }else{
                        var poster = document.querySelector("#dispVideo .vjs-poster");
                        if(poster){
                            poster.style.backgroundImage="none";
                        }
                        dispVideo.setAttribute('data-setup','{"preload": "auto" }');
                        // var isFirefox = typeof InstallTrigger !== 'undefined';
                      //  if(isFirefox){

                          // videoUrl="https://media.congrea.net/yJaR3lEhER3470dI88CMD5s0eCUJRINc2lcjKCu2/12323/89bbbd11-10b9-4687-8d18-c5df8040dcad/video/0400k/video.m3u8";

                         player.src({type: "application/x-mpegURL", "withCredentials":true,src: videoUrl});

                       // }else{
                         //   player.src({type: '"type": "application/x-mpegUR', src: videoUrl});
                         //   player.src({type: '"type": "application/x-mpegUR', src: videoUrl});
                       // }
                    }

                    if (startFrom) {
                        player.ready(function(){
                           var myPlayer = this;
                           if(!virtualclass.videoUl.isPaused){
                               myPlayer.play();
                           }
                           myPlayer.currentTime(startFrom);
                       });

                    }
                    console.log(startFrom)

                },
                //  todo  modify
                appendAutoPlayButton: function (player) {
                    var on = '<div>auto play is on</div>'
                    var off = '<div>auto play is off</div>'
                    virtualclass.videoUl.innerHtml = virtualclass.videoUl.autoPlayFlag ? on : off;
                    virtualclass.videoUl.autoPlayClass = virtualclass.videoUl.autoPlayFlag ? 'vjs-autoPlay-button vjs-control on' : 'vjs-autoPlay-button vjs-control off';

                    player.controlBar.addChild('button', {
                        'el': videojs.createEl('button', {
                            className: 'vjs-autoPlay-button vjs-control on',
                            innerHTML: '<div>auto play is on</div>',
                            id: "autoPlayListBtn",
                            role: 'button',
                            title:'Auto Play',
                            onclick: function () {
                                virtualclass.videoUl.UI.autoPlayFn(this);

                            }
                        })
                    });
                },
                autoPlayFn: function (cthis) {

                    if (cthis.classList.contains('off')) {
                        virtualclass.videoUl.autoPlayFlag = 1;
                        cthis.classList.remove("off");
                        cthis.classList.add("on");
                        cthis.innerHTML = "auto play is on"
                        cthis.style.color = "green";
                    } else {
                        virtualclass.videoUl.autoPlayFlag = 0;
                        cthis.classList.remove("on");
                        cthis.classList.add("off");
                        cthis.innerHTML = "auto play is off";
                        cthis.style.color = "red";

                    }

                },

                onEnded: function (player, vidId, videoUrl) {
                    player.reset();
                    var dispVideo = document.querySelector("#dispVideo");
                    if(virtualclass.videoUl.yts){
                        dispVideo.setAttribute('data-setup','{ techOrder: [youtube]}');
                        player.src({type: 'video/youtube', src:videoUrl});

                    }else{
                        dispVideo.setAttribute('data-setup','{"preload": "auto" }');

                        // var isFirefox = typeof InstallTrigger !== 'undefined';
                        // if(isFirefox){
                        //     player.src({type: 'video/webm', src: videoUrl});
                        // }else{
                        //     player.src({type: 'video/webm', src: videoUrl});
                        //     player.src({type: 'video/mp4', src: videoUrl});
                        // }
                         player.src({type: 'application/x-mpegURL',"withCredentials":true, src: videoUrl});


                    }
                    console.log("ended" + vidId)
                    var index = virtualclass.videoUl.order.indexOf(vidId);
                    if (index < virtualclass.videoUl.order.length - 1 && index >= 0) {
                        virtualclass.videoUl.listEnd = false;
                    } else {
                        virtualclass.videoUl.listEnd = true;
                        vidId = -1;
                    }

                    if (virtualclass.videoUl.autoPlayFlag) {
                        virtualclass.videoUl.autoPlayList(index + 1);

                    }
                },

                inputUrlOld: function () {
                    var videocont = document.getElementById("congreaShareVideoUrlCont");
                    var studentMessage = document.getElementById('messageLayout');
                    if (studentMessage != null) {
                        studentMessage.parentNode.removeChild(studentMessage);
                    }

                        var submitURL= document.getElementById("submitURL")
                        submitURL.addEventListener("click", function () {
                            var input = document.querySelector(".congrea #videourl");
                            var isURL =  virtualclass.videoUl.UI.validateURL(input.value);
                            if(isURL){
                                var rdata = new FormData();
                                // virtualclass.videoUl.shareVideo(input.value);
                                $('.congrea #listvideo .playing').removeClass('playing');
                                $('.congrea #listvideo .removeCtr').removeClass('removeCtr');

                                var vidObj={}
                                vidObj.content_path=input.value;
                                vidObj.id ="tempid";
                                vidObj.status=1;
                                vidObj.title=input.value
                                rdata.append("video",input.value);

                                var videoId = virtualclass.videoUl.getVideoId(input.value);
                                if (typeof videoId == 'boolean') {
                                    vidObj.type="online";
                                    rdata.append("type","online");

                                }else  {
                                    vidObj.type="yts"
                                    rdata.append("type","yts" );

                                }
                                virtualclass.xhr.sendFormData(rdata, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=file_save", function (msg) {
                                    var content = JSON.parse(msg);
                                    console.log(content);
                                    vidObj.id= content.resultdata.id;
                                    virtualclass.videoUl.afterUploadFile(vidObj);
                                    virtualclass.videoUl.order.push(content.resultdata.id);
                                    virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);

                                });
                                document.querySelector(".congrea #videourl").value = "";
                            }

                        });

                        var upload = document.querySelector(".congrea #newVideoBtn")
                        if(upload){
                            upload.addEventListener('click',function(){
                                var uploader= document.querySelector('.congrea #congreavideoContBody');
                                uploader.style.display="block";
                                var uploader= document.querySelector('.congrea #listvideo');
                                uploader.style.display="none";

                            })

                        }
                },

                inputUrl: function () {
                    var videocont = document.getElementById("congreaShareVideoUrlCont");
                    var studentMessage = document.getElementById('messageLayout');
                    if (studentMessage != null) {
                        studentMessage.parentNode.removeChild(studentMessage);
                    }

                    var submitURL= document.getElementById("submitURL")
                    submitURL.addEventListener("click", function () {
                        var input = document.querySelector(".congrea #videourl");
                        var isURL =  virtualclass.videoUl.UI.validateURL(input.value);
                        if(isURL){
                            $('.congrea #listvideo .playing').removeClass('playing');
                            $('.congrea #listvideo .removeCtr').removeClass('removeCtr');
                            // slice(1, -1) is used to remove first and last character
                            var id  = virtualclass.vutil.createHashString(input.value)+virtualclass.vutil.randomString(32).slice(1, -1);

                            var vidObj= {};
                            vidObj.uuid = id;
                            vidObj.URL = input.value;
                            vidObj.title = input.value;
                            var url = ' https://api.congrea.net/t/addURL';

                            var videoId = virtualclass.videoUl.getVideoId(input.value);

                            if (typeof videoId == 'boolean') {
                                vidObj.type = 'video_online';

                            }else  {
                                vidObj.type="video_yts"
                            }

                            virtualclass.xhrn.sendData(vidObj, url, function (response) {
                                // virtualclass.videoUl.afterUploadFile(vidObj);
                                virtualclass.videoUl.order.push(vidObj.uuid);

                                // TODO, Critical this need be re-enable
                                virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
                            });

                            // virtualclass.xhr.sendFormData(rdata, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=file_save", function (msg) {
                            //     var content = JSON.parse(msg);
                            //     console.log(content);
                            //     virtualclass.videoUl.afterUploadFile(vidObj);
                            //     virtualclass.videoUl.order.push(vidObj.id);
                            //     // virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
                            // });
                            document.querySelector(".congrea #videourl").value = "";
                        }
                    });

                    var upload = document.querySelector(".congrea #newVideoBtn")
                    if(upload){
                        upload.addEventListener('click',function(){
                            var uploader= document.querySelector('.congrea #congreavideoContBody');
                            uploader.style.display="block";
                            var uploader= document.querySelector('.congrea #listvideo');
                            uploader.style.display="none";

                        })

                    }
                },


                validateURL:function(url){
                    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                    if(res == null){
                        virtualclass.popup.validateurlPopup();
                        return false;
                    }
                    else
                        return true;

                },

                /*
                 * removeing the video url container
                 */
                removeinputURL: function () {
                    var inputContainer = document.getElementById('youtubeUrlContainer');
                    if (inputContainer != null) {
                        inputContainer.parentNode.removeChild(inputContainer);
                    }
                },
                popup:function(currVideo){
                    var elemArr = ["congreavideoContBody", "congreaShareVideoUrlCont"];
                    var upload = {};
                        if ($('#listvideo .linkvideo.playing').length > 0) {
                            var id = $('#listvideo .linkvideo.playing').attr('data-rid')
                            this.currPlaying = id;
                        }
                        upload.validation = ['mp4', 'webm'];
                        upload.cb = virtualclass.videoUl.afterUploadVideo;
                        upload.cthis = 'video';
                        upload.multiple = false;
                        upload.requesteEndPoint = window.webapi + "&methodname=file_save&live_class_id="+virtualclass.gObj.congCourse+"&status=1&content_type_id=2&user="+virtualclass.gObj.uid;
                        upload.wrapper = document.getElementById(elemArr[0]);
                    virtualclass.fineUploader.uploaderFn(upload);

                    //TODO this need to be outside the function
                    virtualclass.videoUl.UI.inputUrl();
                    //nirmala aws

                    // virtualclass.videoUl.UI.awsr();
                    virtualclass.serverData.fetchAllData(virtualclass.videoUl.UI.awsVideoList);
                    // virtualclass.videoUl.getVideoList();

                    var dropMsz = document.querySelector("#virtualclassCont.congrea #VideoDashboard .qq-uploader.qq-gallery");
                    if(dropMsz){
                        dropMsz.setAttribute("qq-drop-area-text","Drop videos here");
                    }
                    var cont =  document.querySelector("#uploadMsz")
                    var msz = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-list");
                     if(msz){
                         msz.style.display="block";
                     }
                    var upMsz= document.createElement("div")
                    cont.appendChild(upMsz);
                    upMsz.appendChild(msz);

                    var btn = $("#videoPopup .qq-upload-list-selector.qq-upload-button input");
                    var btnUpload= $("#uploadVideo");
                    btnUpload.click(function(){
                        var msz = document.querySelector("#uploadMsz");
                        if(msz){
                            msz.style.display="block";
                        }

                        btn.click();
                    })

                },
                // nirmala aws
                awsr:function(){
                    var data= "Demo";
                    this.postAjax("https://api.congrea.net/t/GetDocumentURLs",data)
                },

                //nirmala aws
                // postAjax:function(url, data, success) {
                //     var params = typeof data == 'string' ? data : Object.keys(data).map(
                //         function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
                //     ).join('&');
                //
                //     var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
                //     xhr.open('POST', url);
                //
                //     xhr.onreadystatechange = function() {
                //         if (xhr.readyState>3 && xhr.status==200) {
                //
                //             console.log(xhr.responseText);
                //             virtualclass.videoUl.UI.formatRawData(xhr.responseText)
                //             virtualclass.videoUl.UI.awsVideoList()
                //             console.log("nirmala m");
                //         }
                //     };
                //     xhr.setRequestHeader('x-api-key', 'yJaR3lEhER3470dI88CMD5s0eCUJRINc2lcjKCu2');
                //     xhr.setRequestHeader('x-congrea-authuser', '46ecba46bc1598c1ec4c');
                //     xhr.setRequestHeader('x-congrea-authpass', '2bf8d3535fdff8a74c01');
                //     xhr.setRequestHeader('x-congrea-room', '12323');
                //     xhr.setRequestHeader('Content-Type', 'application/json');
                //     xhr.send(params);
                //     return xhr;
                // },


                awsVideoList : function(){
                    var data = virtualclass.awsData;
                    var videos=[];
                    for(var i =0;i<data.length;i++){
                        if(data[i]["filetype"]=="video" || data[i]["filetype"]=="video_yts"){
                            videos.push(data[i]);
                        }
                    }
                    console.log(videos);
                    virtualclass.videoUl.videos = videos;

                    // virtualclass.videoUl.allPages = content;
                    // var type = "video";
                    // var firstId = "congrea" + type + "ContBody";
                    // var secondId = "congreaShareVideoUrlCont";
                    // var elemArr = [firstId, secondId];
                    virtualclass.videoUl.showVideos(videos);
                    virtualclass.videoUl.retrieveOrder();
                } ,


                // // to move this function
                // // nirmala aws
                // formatRawData:function(raw){
                //     var awsData= JSON.parse(raw);
                //     console.log("***************");
                //     console.log(awsData);
                //     this.awsUrlArr(awsData);
                //
                // },
                //
                // //nirmala aws
                // awsUrlArr:function(data){
                //     var processedArr =[];
                //     var arr = data.Items;
                //     var newArr=[];
                //     var prefix = "https://media.congrea.net/";
                //     var doc="https://media.congrea.net";
                //     var  imageUrl,pdfUrl,thnailUrl;
                //
                //     for(var j =0; j<arr.length; j++) {
                //         switch(arr[j].filetype.S) {
                //             case "doc":
                //                 var obj=this.processObj(arr[j]);
                //                 obj.urls={};
                //                 obj.urls.image={};
                //                 obj.urls.pdf={};
                //                 obj.urls.thumbnail={};
                //
                //                 var docPrefix = doc +"/" +arr[j].processed_data.M.commonpath.S;
                //                 var count = parseInt(arr[j].processed_data.M.count.N);
                //                 for(var i =1 ; i<=count;i++){
                //                     var num =pad(i,3);
                //                     imageUrl = docPrefix +"/image/"+num+"."+arr[j].processed_data.M.image.M.type.S;
                //                     pdfUrl = docPrefix +"/pdf/"+num+".pdf";
                //                     thnailUrl = docPrefix +"/thumbnail/"+num+"."+arr[j].processed_data.M.thumbnail.M.type.S;
                //                     obj.urls.image[i]=imageUrl;
                //                     obj.urls.pdf[i]=pdfUrl;
                //                     obj.urls.thumbnail[i]=thnailUrl;
                //
                //                 }
                //                 processedArr.push(obj);
                //                 break;
                //
                //             case  'video':
                //                 var obj=this.processObj(arr[j]);
                //                 var add  = obj.filepath.substr(0,obj.filepath.lastIndexOf("/"));
                //                 obj.urls={};
                //                 obj.urls.thumbnail={};
                //                 obj.urls.videos={};
                //                 obj.urls.main_video =prefix+ add+"/video/play_video.m3u8";
                //                 obj.urls.videos["0400k"]=prefix+add+"/video/0400k/video.m3u8";
                //                 obj.urls.videos["0600k"]=prefix+add+"/video/0600k/video.m3u8";
                //                 obj.urls.videos["1000k"]=prefix+add+"/video/1000k/video.m3u8";
                //                 obj.urls.videos["1500k"]=prefix+add+"/video/1500k/video.m3u8";
                //                 obj.urls.videos["2000k"]=prefix+add+"/video/2000k/video.m3u8";
                //
                //
                //                 obj.urls.thumbnail["0400k"]=prefix+add+"/video/0400k/thumbs/00001.png";
                //                 obj.urls.thumbnail["0600k"]=prefix+add+"/video/0600k/thumbs/00001.png";
                //                 obj.urls.thumbnail["1000k"]=prefix+add+"/video/1000k/thumbs/00001.png";
                //                 obj.urls.thumbnail["1500k"]=prefix+add+"/video/1500k/thumbs/00001.png";
                //                 obj.urls.thumbnail["2000k"]=prefix+add+"/video/2000k/thumbs/00001.png";
                //                 processedArr.push(obj);
                //                 break;
                //
                //             case 'video_yts':
                //                 console.log('Handle youtube');
                //                 var obj = this.processVidUrlObj(arr[j]);
                //                 obj.urls={};
                //                 obj.urls.main_video = obj.URL;
                //                 processedArr.push(obj);
                //                 break;
                //         }
                //     }
                //
                //     virtualclass.awsData= processedArr;
                //     console.log(virtualclass.awsData);
                //
                //
                //     function pad(n, length) {
                //         var len = length - (''+n).length;
                //         return (len > 0 ? new Array(++len).join('0') : '') + n
                //     }
                //
                // },
                //
                // //nirmala aws
                // processObj:function(obj){
                //     var temp = {};
                //     // temp.filetag= obj.fileetag.S;
                //     temp.filename= obj.filename.S;
                //     temp.filepath= obj.filepath.S;
                //     temp.filetype= obj.filetype.S;
                //     temp.fileuuid = obj.fileuuid.S;
                //     temp. key_room= obj.key_room.S;
                //     temp.fileuuid = obj.fileuuid.S;
                //     if(obj.hasOwnProperty('deleted')){
                //         temp.deleted = obj.deleted.NS[0];
                //     }
                //
                //     if(obj.hasOwnProperty('disabled')){
                //         temp.disabled = obj.disabled.NS[0];
                //     }
                //     return temp;
                // },
                //
                //
                // processVidUrlObj:function(obj){
                //     var temp = {};
                //     // temp.filetag= obj.fileetag.S;
                //     temp.URL= obj.URL.S;
                //     temp.filename= temp.URL;
                //     temp.filetype= obj.filetype.S;
                //     temp.fileuuid = obj.fileuuid.S;
                //     temp. key_room= obj.key_room.S;
                //     temp.fileuuid = obj.fileuuid.S;
                //     if(obj.hasOwnProperty('deleted')){
                //         temp.deleted = obj.deleted.NS[0];
                //     }
                //      if(obj.hasOwnProperty('disabled')){
                //         temp.disabled = obj.disabled.NS[0];
                //     }
                //     return temp;
                // }
            },
        };
    };
    window.videoUl = videoUl;
})(window);