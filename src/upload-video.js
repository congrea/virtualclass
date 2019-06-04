(function (window) {
    var videoUl = function () {
        return {
            videos: [],
            uploaderParam: {},
            videoObj: {},
            videoId: "",
            videoUrl: "",
            isfullscreen: false,
            order: [],
            currPlaying: "",
            autoPlayFlag: 1,
            status: 0,
            yts: false,
            online: false,
            listEndPause: false,
            attachPlayer: false,

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
                this.autoPlayFlag = 1;
                if (typeof videoObj != 'undefined') {
                    if (videoObj.init != 'studentlayout') {
                        this.videoId = videoObj.init.videoId || videoObj.init;
                        this.videoUrl = videoObj.init.videoUrl;
                        this.yts = videoObj.init.yts;
                        this.online = videoObj.init.online;
                        this.isPaused = videoObj.init.isPaused;

                    }
                    if (typeof videoObj.isAutoplay != 'undefined') {
                        this.autoPlayFlag = videoObj.isAutoplay;
                    }

                }

                if (!roles.hasAdmin() || (roles.isEducator())) {
                    if (typeof this.videoId == 'undefined' && roles.isStudent() && !virtualclass.videoUl.yts) {
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
                                // to b e modified
                                if (!videoObj.hasOwnProperty('fromReload')) {
                                    if (this.videoId == undefined || typeof this.videoId == 'undefined') {
                                        // this.UI.defaultLayoutForStudent();
                                    } else if (typeof this.videoId == 'object' && this.videoId.yts == false) {
                                        // this.UI.defaultLayoutForStudent();
                                    } else {
                                        var url = videoObj.url || videoObj.init.videoUrl;
                                        if (typeof url != 'undefined' && url != '' && videoObj.init != 'studentlayout') {
                                            (typeof startFrom == 'undefined') ? this.UI.displayVideo(videoObj.id, url) : this.UI.displayVideo(videoObj.id, url, startFrom);
                                        }
                                    }
                                } else {
                                    this.fromReload(this.videoId, this.videoUrl, startFrom);
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
                    var dashboardnav = document.querySelector('#dashboardnav button');
                    if (dashboardnav != null) {
                        dashboardnav.click();
                    }

                    if (typeof startFrom != 'undefined') {
                        this.fromReload(this.videoId, this.videoUrl, startFrom);
                    } else {
                        ioAdapter.mustSend({'videoUl': {init: 'studentlayout'}, 'cf': 'videoUl'});
                    }
                }
                // if(!virtualclass.isPlayMode){
                //     this.startsync();
                // }

            },

            isPlayerReady (){
                return (virtualclass.videoUl.hasOwnProperty('player') && typeof virtualclass.videoUl.player == 'object');
            },

            // startsync () {
            //     virtualclass.vutil.clearSyncTimeInterval();
            //     virtualclass.videoUl.syncTimeInterval = setInterval(() => {
            //         if(virtualclass.videoUl.videoUrl != null && virtualclass.videoUl.videoUrl != "" && virtualclass.videoUl.player != null){
            //             ioAdapter.sync({time : virtualclass.videoUl.player.currentTime(), 'app': 'video', 'cf': 'sync'});
            //         }
            //     }, 1000);
            // },


            createPageModule: function () {
                if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                    virtualclass.videoUl.videos.forEach(function (vidObj, i) {
                        var idPostfix = vidObj.id;
                        virtualclass.videoUl.pages[idPostfix] = new virtualclass.page('videoList', 'video', 'virtualclassVideo', 'videoUl', vidObj.status);
                    });
                }
            },

            reArrangeElements: function (order) {
                var container = document.getElementById('listvideo'),
                    tmpdiv = document.createElement('div');
                tmpdiv.id = "listvideo";
                tmpdiv.className = "videos";

                var videos = this.getActiveVideos();
                var sortedItems = [];

                var orderChange = false;
                for (var j = 0; j < videos.length; j++) {
                    if (order.indexOf(videos[j].fileuuid) <= -1) {
                        order.push(videos[j].fileuuid);
                        orderChange = true;
                    }
                }
                if (orderChange) {
                    virtualclass.videoUl.order = order;
                    virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
                    orderChange = false;
                }

                for (var i = 0; i < order.length; i++) {
                    var elem = document.getElementById('linkvideo' + order[i])
                    if (elem) {
                        tmpdiv.appendChild(elem);
                    }
                }

                container.parentNode.replaceChild(tmpdiv, container);
            },

            getActiveVideos: function () {
                var activeVideos = [];
                for (var i = 0; i < virtualclass.videoUl.videos.length; i++) {
                    if (!virtualclass.videoUl.videos[i].hasOwnProperty('deleted')) {
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
                if (url) {
                    virtualclass.videoUl.UI.displayVideo(id, url, startFrom);
                } else {
                    var obj = {};
                    obj.init = id;
                    // virtualclass.yts.init(obj,startFrom);
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


            requestOrder: function () {
                virtualclass.vutil.requestOrder('vid',
                    function (response) {
                        if (response == "Error") {
                            console.log("page order retrieve failed");
                        } else {
                            if (typeof response != 'undefined' && response != undefined) {
                                virtualclass.videoUl.order = [];
                                virtualclass.videoUl.order = response;
                                if (virtualclass.videoUl.order.length > 0) {
                                    virtualclass.videoUl.reArrangeElements(virtualclass.videoUl.order); // 1
                                }
                            }
                        }
                    }
                );
            },

            /*
             * after upload video callbback function to update  order of videolist
             * and new order to save in dabase
             * @param response message

             */
            //new

            afterDocStatus: function (response) {
                var object = response;
            },

            updateOrder: function () {
                var activeVideos = this.getActiveVideos();
                if (activeVideos.length != this.order.length) {
                    var videos = activeVideos.map(video => video.fileuuid);
                    this.order = videos;
                }
                this.sendOrder(this.order);
            },

            afterUploadVideo: function (id, xhr, res) {
                var res = res.success;
                if (res) {
                    var url = virtualclass.api.GetDocumentStatus;
                    var that = this;
                    that.updateOrder();
                    virtualclass.videoUl.order.push(virtualclass.gObj.file.uuid);
                    virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
                    virtualclass.videoUl.showUploadMsz("Video uploaded successfully", "alert-success");
                    var popup = document.querySelector(".congrea #VideoDashboard #videoPopup")
                    if (popup) {
                        if (!popup.classList.contains("uploadSuccess")) {
                            popup.classList.add("uploadSuccess");
                        }
                    }

                    for (var i = 0; i < virtualclass.gObj.uploadingFiles.length; i++) {
                        var fileObj = {};
                        fileObj.filename = virtualclass.gObj.uploadingFiles[i].name + " (Processing...)";
                        fileObj.fileuuid = virtualclass.gObj.uploadingFiles[i].uuid;
                        fileObj.filetype = 'video';
                        fileObj.key_room = virtualclass.gObj.sessionInfo.key + '_' + virtualclass.gObj.sessionInfo.room;
                        fileObj.noVideo = true;
                        console.log('File uploading ' + fileObj.filename);
                        this.afterUploadFile(fileObj);
                    }

                    virtualclass.gObj.uploadingFiles = [];
                    virtualclass.serverData.pollingStatus(virtualclass.videoUl.UI.awsVideoList);

                } else {
                    virtualclass.videoUl.showUploadMsz("video upload failed", "alert-error");
                }

                var msz = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-list");
                if (msz) {
                    msz.style.display = "none";
                }
            },

            showUploadMsz: function (msg, type) {
                var mszCont = document.querySelector("#VideoDashboard #uploadMsz");
                var alertMsz = document.querySelector("#VideoDashboard #uploadMsz .alert");
                if (alertMsz) {
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
                btn.addEventListener('click', function () {
                    var msz = document.querySelector("#uploadMsz");
                    if (msz) {
                        msz.style.display = "none";
                    }
                    var popup = document.querySelector(".congrea #VideoDashboard #videoPopup");
                    if (popup) {
                        popup.classList.remove("uploadSuccess");
                    }
                    elem.parentNode.removeChild(elem);

                })
                elem.appendChild(btn);

            },

            retrieveOrder: function () {
                this.requestOrder();
            },


            afterUploadFile: function (vidObj) {
                var idPostfix = vidObj.fileuuid;
                // var docId = 'docs' + doc;
                this.pages[idPostfix] = new virtualclass.page('videoList', 'video', 'virtualclassVideo', 'videoUl', vidObj.status, vidObj.filetype);
                if (vidObj.filetype == "video_yts") {
                    var ytsId = virtualclass.videoUl.getVideoId(vidObj.URL);
                    virtualclass.videoUl.UI.fetchYtsTitle(vidObj, ytsId)
                }
                this.pages[idPostfix].init(idPostfix, vidObj.filename);
                this.videoDisplayHandler(vidObj);
                var vid = document.getElementById("linkvideo" + vidObj.fileuuid);
                var title = document.getElementById("videoTitle" + vidObj.fileuuid);
                if (title) {
                    title.innerHTML = vidObj.filename;
                }

                var controlElem = vid.getElementsByClassName('status')[0];

                if (vidObj.hasOwnProperty('disabled')) {
                    this._disable(vidObj.fileuuid)
                    if (vid) {
                        vid.classList.add("disable");
                        vid.dataset.status = 0;
                    }
                } else {
                    this._enable(vidObj.fileuuid);
                    if (vid) {
                        vid.classList.add("enable");
                        vid.dataset.status = 1;

                    }
                }
                controlElem.dataset.status = vid.dataset.status;
                this.calculateHeight();

                if (vidObj.hasOwnProperty('noVideo')) {
                    vid.classList.add('noVideo');
                }

            },


            calculateHeight: function () {
                var element = document.querySelector('#listvideo');
                var fineUploader = document.querySelector(".congrea .qq-uploader-selector");
                console.log(element.offsetHeight);
                var h = element.offsetHeight;
                console.log(fineUploader.offsetHeight);
                $('.qq-uploader-selector').css({
                    minHeight: h

                })

            },

            showVideos: function (content, storedId) {
                if (roles.hasControls()) {
                    virtualclass.videoUl.showVideoList();
                }
                var currId = virtualclass.videoUl.currPlaying || storedId;
                if (virtualclass.videoUl.videoUrl) {
                    virtualclass.videoUl.activeVideoClass(virtualclass.videoUl.videoId);
                    virtualclass.vutil.showFinishBtn();
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
                if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                    virtualclass.videoUl.videos.forEach(function (vidObj, i) {
                        if (!vidObj.hasOwnProperty('deleted')) {
                            var elem = document.querySelector('#linkvideo' + vidObj.fileuuid);
                            if (elem != null) {
                                elem.classList.remove('noVideo');
                            }
                            virtualclass.videoUl.afterUploadFile(vidObj);
                        }
                    });
                }
                // virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');


                // virtualclass.vutil.removeFinishBtn();
                virtualclass.vutil.makeElementActive('#listvideo');
                var video = document.querySelector(".congrea #listvideo .linkvideo.singleVideo");
                var link = document.querySelector(".congrea #listvideo .linkvideo");
                if (virtualclass.videoUl.videos.length == 1 && !video) {
                    link.classList.add("singleVideo");
                } else if (virtualclass.videoUl.videos.length > 1 && video) {
                    video.classList.remove("singleVideo");
                }

            },

            videoDisplayHandler: function (vidObj) {
                var video = document.getElementById("mainpvideo" + vidObj.fileuuid);
                if (video && !vidObj.status) {
                    if (!video.classList.contains("playDisable")) {
                        video.classList.add("playDisable");
                    }
                } else {
                    if (video && video.classList.contains("playDisable")) {
                        video.classList.remove("playDisable");
                    }
                }
                if (video) {
                    video.addEventListener("click", function () {
                        virtualclass.videoUl.isPaused = false;
                        if (vidObj.filetype == "video_yts") {
                            virtualclass.videoUl.yts = true;
                            virtualclass.videoUl.online = false
                        } else if (vidObj.filetype == "video_online") {
                            virtualclass.videoUl.yts = false;
                            virtualclass.videoUl.online = true
                        } else {
                            virtualclass.videoUl.yts = false;
                            virtualclass.videoUl.online = false
                        }

                        if (vidObj.urls) {
                            var url = vidObj.urls.main_video;
                            virtualclass.videoUl.UI.displayVideo(vidObj.fileuuid, url);
                            virtualclass.videoUl.activeVideoClass(vidObj.fileuuid);

                            var toStd = {};
                            toStd.content_path = url;
                            toStd.id = vidObj.fileuuid;
                            toStd.title = vidObj.filename;
                            toStd.type = vidObj.filetype;

                            virtualclass.videoUl.videoToStudent(toStd);
                            virtualclass.videoUl.videoId = vidObj.fileuuid;
                            virtualclass.vutil.showFinishBtn();
                            virtualclass.dashBoard.close();

                        }
                    });
                }
            },

            activeVideoClass: function (currId) {
                var otherElems = document.getElementsByClassName("controlCont");
                for (var i = 0; i < otherElems.length; i++) {
                    if (otherElems[i].classList.contains("removeCtr")) {
                        otherElems[i].classList.remove("removeCtr");
                    }

                }
                var controlElem = document.getElementById("controlContvideo" + currId);
                if (controlElem && !controlElem.classList.contains("removeCtr")) {
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
                }
            },


            _rearrange: function (order) {
                this.order = order;
                this.reArrangeElements(order); // 2, rearrange
                this.sendOrder(this.order);
            },

            _editTitle: function (id, title, videotype) {
                var form_data = new FormData();
                var data = {lc_content_id: id, action: 'edit', title: title, user: virtualclass.gObj.uid};
                var form_data = new FormData();
                for (var key in data) {
                    form_data.append(key, data[key]);
                    console.log(data[key]);
                }

                virtualclass.xhr.sendFormData(form_data, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=update_content_video", function (msg) {
                    if (msg != "ERROR") {
                        var elem = document.getElementById("videoTitle" + id);
                        if (elem) {
                            elem.innerHTML = title;
                            elem.style.display = "inline";
                            //virtualclass.videoUl.order=[];
                            if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                                virtualclass.videoUl.videos.forEach(function (video, index) {
                                    if (video["id"] == id) {
                                        console.log(video)
                                        video.title = title;

                                    }
                                })
                            }

                        }
                    }
                });

            },


            sendOrder: function (order, type) {
                type = 'vid';
                virtualclass.vutil.sendOrder(type, order);
            },


            /*
             * message  handled at student's end
             * and new order to save in dabase
             * @param message from teacher

             */
            onmessage: function (msg) {
                if (typeof msg.videoUl == 'string') {
                    if (msg.videoUl == 'play') {
                        this.playVideo(msg);
                        virtualclass.videoUl.isPaused = false;
                    } else if (msg.videoUl == 'pause') {
                        this.pauseVideo();
                        virtualclass.videoUl.isPaused = true;
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
                    else if (msg.videoUl == 'videoDelete') {
                        var playerCont = document.querySelector("#videoPlayerCont");
                        if (playerCont) {
                            playerCont.style.display = "none"
                            var msz = document.querySelector("#messageLayoutVideo");
                            if (msz) {
                                msz.style.display = "block";
                            }
                            virtualclass.videoUl.videoId = null;
                            virtualclass.videoUl.videoUrl = null;
                            var video = document.querySelector(".congrea #dispVideo video")
                            var ytube = document.querySelector(".congrea #dispVideo iframe")
                            var cont = video ? video : ytube;
                            if (cont) {
                                cont.setAttribute("src", "");
                            }
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
                if (msg.videoUl.type) {
                    if (msg.videoUl.type == "video_yts") {
                        virtualclass.videoUl.yts = true;
                        virtualclass.videoUl.online = false
                    } else if (msg.videoUl.type == "video_online") {
                        virtualclass.videoUl.online = true;
                        virtualclass.videoUl.yts = false;

                    } else {
                        virtualclass.videoUl.yts = false;
                        virtualclass.videoUl.online = false;
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
                    virtualclass.videoUl.isPaused = false;
                }
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
                if (virtualclass.videoUl.isPlayerReady()) {
                    console.log('====Video play');
                    virtualclass.videoUl.player.currentTime(seekVal);
                    virtualclass.videoUl.player.play();
                }
            },

            pauseVideo: function () {
                // todo pass paused time to students
                if (virtualclass.videoUl.isPlayerReady()) {
                    console.log('====Video pause');
                    virtualclass.videoUl.player.pause();
                    virtualclass.videoUl.isPaused = true;
                }
            },

            /*
             * to play next video from the  the playlist
             * @param index  of next enabled video in the videolist array
             */

            autoPlayList: function (index) {
                var videos = this.getActiveVideos();
                var videoUrl = ""
                var nextIndex = index;
                //var nextId = virtualclass.videoUl.order[index + 1];
                var currVideoObj = this.findNextObj(nextIndex)
                if (typeof currVideoObj != 'object') {

                    var nxIndex = currVideoObj;
                    if (nxIndex < videos.length) {
                        currVideoObj = this.autoPlayList(nxIndex)
                    }
                } else {

                    var toStd = {};
                    toStd.id = currVideoObj.fileuuid;
                    toStd.title = currVideoObj.filename;
                    toStd.type = currVideoObj.filetype;

                    if (!virtualclass.videoUl.listEnd) {
                        if (currVideoObj.filetype == 'video_online') {
                            virtualclass.videoUl.yts = false;
                            virtualclass.videoUl.online = true;
                            //  virtualclass.videoUl.UI.displayVideo(currVideoObj.id, currVideoObj.URL);
                            virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.URL);
                            virtualclass.videoUl.videoToStudent(currVideoObj);

                            if (virtualclass.videoUl.player) {
                                // virtualclass.videoUl.player.on("ready",function() {
                                //     virtualclass.videoUl.player.play();
                                // })
                            }
                            this.activeVideoClass(currVideoObj.id);

                            toStd.content_path = currVideoObj.URL;

                        } else {
                            virtualclass.videoUl.online = false;
                            if (currVideoObj.filetype == 'video_yts') {
                                virtualclass.videoUl.yts = true;
                                virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.URL);
                                toStd.content_path = currVideoObj.URL;

                            } else {
                                virtualclass.videoUl.yts = false;
                                virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.urls.main_video);
                                toStd.content_path = currVideoObj.urls.main_video;

                            }

                            //virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid,currVideoObj.urls.main_video);

                            virtualclass.videoUl.videoToStudent(toStd);

                        }

                        if (virtualclass.videoUl.player) {

                            virtualclass.videoUl.player.ready(function () {
                                var myPlayer = this;
                                myPlayer.play()

                            });
                        }
                        this.activeVideoClass(currVideoObj.fileuuid);

                    }
                }
            },
            /*
             * to find next video from the videolist

             */
            findNextObj: function (index) {
                var nextId = this.findNextVideoId(index);
                var currVideoObj = false;
                var videos = this.getActiveVideos();
                for (var i = 0; i < videos.length; i++) {
                    //for (var j in virtualclass.videoUl.videos[i]) {
                    if (videos[i]['fileuuid'] == nextId) {
                        var vid = document.getElementById("linkvideo" + videos[i]['fileuuid']);
                        if (vid.getAttribute("data-status") == "1") {
                            currVideoObj = videos[i];
                            return currVideoObj;
                        } else {
                            return index + 1;
                        }

                    }
                }
            },

            findNextVideoId: function (index) {
                var list = document.querySelectorAll("#listvideo .linkvideo");
                if (index < list.length) {
                    return list[index].getAttribute("data-rid")
                } else {
                    return false
                }

            },
            findVideoIndex: function (vidId) {
                var list = document.querySelectorAll("#listvideo .linkvideo");
                var index = 0;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].getAttribute("data-rid") == vidId) {
                        index = i
                        return index;
                    }
                }

            },

            /*
             * to disable  video in the videolist
             */

            _disable: function (_id) {
                var linkvideo = document.querySelector("#linkvideo" + _id);
                linkvideo.classList.add('playDisable');
                var video = document.getElementById("mainpvideo" + _id);
                video.style.opacity = .3;
                video.style.pointerEvents = 'none';

                if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                    virtualclass.videoUl.videos.forEach(function (elem, i) {
                        if (elem["fileuuid"] == _id) {
                            elem.disabled = 0
                            elem.status = 0;
                        }
                    })
                }
            },

            /*
             * to enable  video in the videolist
             */
            _enable: function (_id) {
                var linkvideo = document.querySelector("#linkvideo" + _id);
                linkvideo.classList.remove('playDisable');


                var video = document.getElementById("mainpvideo" + _id);
                if (video) {
                    video.style.opacity = 1;
                    video.style.pointerEvents = 'auto';
                    if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                        virtualclass.videoUl.videos.forEach(function (elem, i) {
                            if (elem["fileuuid"] == _id) {
                                delete(elem.disabled);
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
                    uuid: id,
                    action: 'delete',
                    page: 0
                }
                var videoid = id;
                var url = virtualclass.api.UpdateDocumentStatus;
                var that = this;
                // virtualclass.xhrn.sendFormData({uuid:videoid}, url, function (msg) {
                //     that.afterDeleteCallback(msg)
                // });

                virtualclass.xhrn.sendData(data, url, function (msg) {
                    that.afterDeleteCallback(msg, id)
                });
            },

            afterDeleteCallback: function (msg, id) {
                if (msg != "ERROR") {
                    var type = "saved";
                    var elem = document.getElementById("linkvideo" + id);
                    if (elem) {
                        elem.parentNode.removeChild(elem);

                        // if current playing video is deleted
                        if (virtualclass.videoUl.videoId == id) {
                            // if(type !="yts"){
                            var playerCont = document.querySelector("#videoPlayerCont");
                            if (playerCont) {
                                playerCont.style.display = "none";
                                ioAdapter.mustSend({'videoUl': 'videoDelete', 'cf': 'videoUl'});
                                virtualclass.videoUl.videoId = null;
                                virtualclass.videoUl.videoUrl = null;
                                var video = document.querySelector(".congrea #dispVideo video");
                                var ytube = document.querySelector(".congrea #dispVideo iframe");
                                var cont = video ? video : ytube;
                                if (cont) {
                                    cont.setAttribute("src", '');
                                }
                                virtualclass.vutil.removeFinishBtn();
                            }
                        }
                        if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                            virtualclass.videoUl.videos.forEach(function (video, index) {
                                if (video["fileuuid"] == id) {
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
                            // virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
                            virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
                        }
                        if (!virtualclass.videoUl.videos.length) {
                            virtualclass.vutil.removeFinishBtn();

                        } else if (virtualclass.videoUl.videos.length == 1) {
                            var video = document.querySelector(".congrea #listvideo .linkvideo");
                            if (video) {
                                video.classList.add("singleVideo");
                            }
                        }

                    }
                }
            },

            xhrOrderSend: function (order) {
                var data = {order: order.toString()};
                var url = virtualclass.api.UpdateRoomMetaData;
                virtualclass.xhrn.sendData(data, url, function () {
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
                        var template = JST[virtualclass.gObj.tempPrefix + '/videoupload/videoupload.hbs'];
                        // $('#virtualclassAppLeftPanel').append(template(data));
                        virtualclass.vutil.insertAppLayout(template(data));

                        videoCont = document.getElementById(this.id);
                    }
                    if (!roles.hasControls()) {
                        var msz = document.getElementById("messageLayoutVideo");
                        if (msz) {
                            msz.style.display = "block";
                        }
                    }

                },
                createYoutubeUrlCont: function (cont) {
                    var list = document.createElement("div");
                    list.id = "listvideo";
                    cont.appendChild(list);

                },

                displayVideo: function (vidId, videoUrl, startFrom) {
                    var that = this;
                    if (virtualclass.videoUl.hasOwnProperty('displayVideoTime')) {
                        clearTimeout(virtualclass.videoUl.displayVideoTime);
                    }
                    virtualclass.videoUl.displayVideoTime = setTimeout(
                        function () {
                            if (virtualclass.currApp == 'Video') {
                                that._displayVideo(vidId, videoUrl, startFrom);
                            }

                        }, 300
                    )
                },

                _displayVideo: function (vidId, videoUrl, startFrom) {
                    if (typeof virtualclass.videoUl.player == 'object') {
                        if (virtualclass.videoUl.player.hasOwnProperty('dispose')) {
                            virtualclass.videoUl.player.dispose();
                        }
                    }
                    virtualclass.videoUl.videoUrl = videoUrl;
                    virtualclass.videoUl.videoId = vidId;
                    // var videourl = "https://dev.muzioapp.com.s3-website-us-east-1.amazonaws.com/content/ourMuzeVid1.webm";
                    var videoCont = document.getElementById("videoPlayerCont");
                    if (videoCont) {
                        videoCont.style.display = "block";
                    } else {
                        virtualclass.videoUl.UI.container();
                        var videoCont = document.getElementById("videoPlayerCont");
                    }
                    var ply = document.querySelector('iframe#player')
                    if (ply) {
                        ply.remove()
                    }

                    virtualclass.videoUl.UI.switchDisplay(videoCont, videoUrl);
                    virtualclass.videoUl.UI.videojsPlayer(videoUrl, vidId, startFrom);
                    virtualclass.modal.hideModal();
                },

                videojsPlayer: function (videoUrl, vidId, startFrom) {
                    if (!virtualclass.videoUl.player) {
                        var player = videojs("dispVideo"); //TODO, generating error need to handle
                        if (roles.hasControls()) {
                            if (!($('.vjs-autoPlay-button').length)) {
                                virtualclass.videoUl.UI.appendAutoPlayButton(player);
                            }
                            var autoPlayBtn = document.getElementById("autoPlayListBtn")
                            if (autoPlayBtn) {
                                // autoPlayBtn.innerHTML = virtualclass.videoUl.innerHtml;
                                autoPlayBtn.className = virtualclass.videoUl.autoPlayClass;
                            }
                        }

                        virtualclass.videoUl.player = player;
                        virtualclass.videoUl.UI.attachPlayerHandler(virtualclass.videoUl.player, vidId, videoUrl);
                    }
                    // virtualclass.videoUl.player.reset();
                    virtualclass.videoUl.UI.onEndedHandler(virtualclass.videoUl.player, vidId, videoUrl);
                    virtualclass.videoUl.UI.setPlayerUrl(virtualclass.videoUl.player, videoUrl, startFrom);


                },
                attachPlayerHandler: function (player, vidId, videoUrl) {
                    if (!this.attachPlayer) {
                        this.attachPlayer = true;
                        console.log('Attach video player');
                        player.on("pause", function (e) {
                            console.log("paused");
                            if (roles.hasControls()) {
                                ioAdapter.mustSend({'videoUl': "pause", 'cf': 'videoUl'});
                            }
                            virtualclass.videoUl.isPaused = true;
                        });

                        player.on("play", function (e) {
                            console.log("play");
                            if (roles.hasControls()) {
                                ioAdapter.mustSend({'videoUl': {"play": player.currentTime()}, 'cf': 'videoUl'});
                            }
                            virtualclass.videoUl.isPaused = false;
                        });
                    }
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
                createVideoElem: function (videoCont, type) {
                    var video = '<video id="dispVideo" class="video-js" autoplay controls  preload="auto" data-setup="{}" >';
                    videoCont.insertAdjacentHTML('beforeend', video)
                    // $(videoCont).append(video);
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
                    console.log('====Video init to play start');
                    if (startFrom == undefined && virtualclass.videoUl.startTime) {
                        startFrom = virtualclass.videoUl.startTime;
                    }

                    if (player.poster_) {
                        player.poster_ = "";
                    }

                    /*player.reset(); */
                    var dispVideo = document.querySelector("#dispVideo");
                    if (virtualclass.videoUl.yts) {
                        dispVideo.setAttribute('data-setup', '{ techOrder: [youtube],"preload": "auto"}');
                        player.src({type: 'video/youtube', src: videoUrl});

                    } else if (virtualclass.videoUl.online) {
                        dispVideo.setAttribute('data-setup', '{"preload": "auto" }');
                        player.src({type: 'video/webm', src: videoUrl});
                        player.src({type: 'video/mp4', src: videoUrl});

                    } else {
                        dispVideo.setAttribute('data-setup', '{"preload": "auto"}');
                        player.src({type: "application/x-mpegURL", "withCredentials": true, src: videoUrl});
                    }


                    player.ready(function () {
                        var myPlayer = this;
                        /** When video is loaded **/
                        myPlayer.on("loadedmetadata", function () {
                            if (virtualclass.videoUl.isPaused) {
                                myPlayer.pause();
                            } else if (virtualclass.system.device == 'desktop') {
                                myPlayer.play();
                            }
                            if (startFrom) {
                                myPlayer.currentTime(startFrom);
                                if (virtualclass.videoUl.yts && !virtualclass.videoUl.isPaused && virtualclass.system.device == 'desktop') {
                                    myPlayer.play();
                                }
                            }
                        });

                    });

                    console.log(startFrom)

                },
                //  todo  modify
                appendAutoPlayButton: function (player) {
                    // var on = '<div>auto play is on</div>'
                    // var off = '<div>auto play is off</div>'
                    // virtualclass.videoUl.innerHtml = virtualclass.videoUl.autoPlayFlag ? on : off;
                    virtualclass.videoUl.autoPlayClass = virtualclass.videoUl.autoPlayFlag ? 'vjs-autoPlay-button vjs-control on' : 'vjs-autoPlay-button vjs-control off';

                    player.controlBar.addChild('button', {
                        'el': videojs.createEl('button', {
                            className: 'vjs-autoPlay-button vjs-control on',
                            // innerHTML: '<div>auto play</div>',
                            id: "autoPlayListBtn",
                            role: 'button',
                            title: 'Auto Play',
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
                        // cthis.innerHTML = "auto play is on"
                        cthis.style.color = "green";
                    } else {
                        virtualclass.videoUl.autoPlayFlag = 0;
                        cthis.classList.remove("on");
                        cthis.classList.add("off");
                        // cthis.innerHTML = "auto play is off";
                        cthis.style.color = "red";

                    }

                },
                onEndedHandler: function (player, vidId, videoUrl) {

                    player.off("ended");

                    player.on("ended", function (e) {
                        virtualclass.videoUl.UI.onEnded(player, vidId, videoUrl);
                    });


                },

                onEnded: function (player, vidId, videoUrl) {
                    //player.reset();
                    var dispVideo = document.querySelector("#dispVideo");
                    if (virtualclass.videoUl.yts) {
                        dispVideo.setAttribute('data-setup', '{ techOrder: [youtube],controls: true,}');
                        player.src({type: 'video/youtube', src: videoUrl});

                    } else if (virtualclass.videoUl.online) {
                        dispVideo.setAttribute('data-setup', '{"preload": "auto", "controls": true, }');
                        player.src({type: 'video/webm', src: videoUrl});
                        player.src({type: 'video/mp4', src: videoUrl});

                    } else {
                        dispVideo.setAttribute('data-setup', '{"preload": "auto", "controls": true, }');
                        player.src({type: 'application/x-mpegURL', "withCredentials": true, src: videoUrl});

                    }
                    console.log("ended" + vidId)


                    var list = document.querySelectorAll("#listvideo .linkvideo");
                    var index = 0;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].getAttribute("data-rid") == vidId) {
                            index = i
                            break;
                        }
                    }


                    if (virtualclass.videoUl.autoPlayFlag) {
                        if (player.poster_) {
                            player.poster_ = "";
                        }
                        if (virtualclass.videoUl.findNextVideoId(index + 1)) {
                            virtualclass.videoUl.autoPlayList(index + 1, list);
                        } else {
                            virtualclass.videoUl.UI.autoVideoPause();
                        }
                    } else {
                        virtualclass.videoUl.UI.autoVideoPause();
                    }

                },

                autoVideoPause: function () {
                    virtualclass.videoUl.isPaused = true;
                    var paused = virtualclass.videoUl.isPaused;
                    virtualclass.videoUl.listEndPause = true
                    virtualclass.videoUl.player.on("play", function () {
                        if (virtualclass.videoUl.listEndPause) {
                            console.log('==== Video is paused');
                            virtualclass.videoUl.player.pause();
                            virtualclass.videoUl.listEndPause = false;
                        }

                    })
                },


                inputUrl: function () {
                    var videocont = document.getElementById("congreaShareVideoUrlCont");
                    var studentMessage = document.getElementById('messageLayout');
                    if (studentMessage != null) {
                        studentMessage.parentNode.removeChild(studentMessage);
                    }

                    var submitURL = document.getElementById("submitURL")
                    submitURL.addEventListener("click", function () {
                        var input = document.querySelector(".congrea #videourl");
                        var isURL = virtualclass.videoUl.UI.validateURL(input.value);
                        if (isURL) {
                            var playing = document.querySelector(' #listvideo .playing');
                            if (playing) {
                                playing.classList.remove("playing");
                            }
                            var ctr = document.querySelector(' #listvideo .removeCtr');
                            if (ctr) {
                                ctr.classList.remove("removeCtr")
                            }

//                            $('.congrea #listvideo .playing').removeClass('playing');
//                            $('.congrea #listvideo .removeCtr').removeClass('removeCtr');
                            // slice(1, -1) is used to remove first and last character
                            var id = virtualclass.vutil.createHashString(input.value) + virtualclass.vutil.randomString(32).slice(1, -1);

                            virtualclass.videoUl.UI.saveYtsUrl(id)
                        }
                    });

                    var upload = document.querySelector(".congrea #newVideoBtn")
                    if (upload) {
                        upload.addEventListener('click', function () {
                            var uploader = document.querySelector('.congrea #congreavideoContBody');
                            uploader.style.display = "block";
                            var uploader = document.querySelector('.congrea #listvideo');
                            uploader.style.display = "none";

                        })

                    }
                },

                saveYtsUrl: function (id) {
                    var input = document.querySelector(".congrea #videourl");
                    var vidObj = {};
                    vidObj.uuid = id;
                    vidObj.URL = input.value;
                    vidObj.title = input.value;

                    var url = virtualclass.api.addURL;

                    var videoId = virtualclass.videoUl.getVideoId(input.value);

                    if (typeof videoId == 'boolean') {
                        vidObj.type = 'video_online';
                    } else {
                        vidObj.type = "video_yts"
                    }
                    virtualclass.xhrn.sendData(vidObj, url, function (response) {
                        virtualclass.videoUl.updateOrder();
                        virtualclass.videoUl.order.push(vidObj.uuid);

                        // TODO, Critical this need be re-enable
                        virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
                        virtualclass.serverData.fetchAllData(virtualclass.videoUl.UI.awsVideoList);
                    });

                    document.querySelector(".congrea #videourl").value = "";

                },


                fetchYtsTitle: function (vidObj, videoid) {
                    $.getJSON("https://www.googleapis.com/youtube/v3/videos", {
                        key: "AIzaSyCt1SQWwanpucKGFlzytu-mDdr6vRKzJGA",
                        part: "snippet,statistics",
                        id: videoid
                    }, function (data) {
                        var title = "";
                        if (data.items.length === 0) {
                            console.log("video not found")
                        } else {
                            title = data.items[0].snippet.title;
                            virtualclass.videoUl.UI.setYtsTitle(vidObj, title);
                        }


                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.log("unable to fetch you tube title")
                        return "ERROR"
                    });

                },
                validateURL: function (url) {
                    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                    if (res == null) {
                        virtualclass.popup.validateurlPopup("video");
                        return false;
                    }
                    else
                        return true;

                },
                setYtsTitle: function (vidObj, title) {
                    var yts = document.querySelector("#listvideo #videoTitle" + vidObj.fileuuid);
                    if (yts) {
                        yts.innerHTML = title;

                    }

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
                popup: function (currVideo) {

                    var dropArea = document.querySelector("#congreavideoContBody");
                    if (dropArea && dropArea.lastChild != null) {
                        dropArea.removeChild(dropArea.lastChild);
                    }
                    var elemArr = ["congreavideoContBody", "congreaShareVideoUrlCont"];
                    var upload = {};
                    var currPlayed = document.querySelector('#listvideo .playing')
                    if (currPlayed) {
                        //var currPlayed = document.querySelector('#listvideo .playing')
                        var id = currPlayed.getAttribute('data-rid')
                        this.currPlaying = id;
                    }
//                        upload.validation = ["avi", "flv", "wmv", "mov", "mp4", "webm", "mkv", "vob", "ogv", "ogg", "drc", "mng", "qt", "yuv", "rm", "rmvb", "asf", "amv", "m4p",
//                        "m4v", "mpg", "mp2", "mpeg", "mpe", "mpv", "m2v", "svi", "3gp", "3g2", "mxf", "roq", "nsv", "f4v", "f4p", "f4a", "f4b"];
                    upload.validation = ["mp4", "avi", "wmv", "mov", "webm", "mkv", "vob", "mpeg"];
                    upload.cb = virtualclass.videoUl.afterUploadVideo;
                    upload.cthis = 'video';
                    upload.multiple = false;
                    upload.maxSize = 512 * 1000 * 1000; // 512 MB
                    upload.requesteEndPoint = window.webapi + "&methodname=file_save&live_class_id=" + virtualclass.gObj.congCourse + "&status=1&content_type_id=2&user=" + virtualclass.gObj.uid;
                    upload.wrapper = document.getElementById(elemArr[0]);
                    virtualclass.fineUploader.uploaderFn(upload);
                    if (!virtualclass.vutil.isBulkDataFetched() || !virtualclass.videoUl.videos.length) {
                        virtualclass.serverData.fetchAllData(virtualclass.videoUl.UI.awsVideoList);
                    } else {
                        virtualclass.videoUl.showVideos(virtualclass.videoUl.videos);
                        if (virtualclass.videoUl.order.length > 0) {
                            virtualclass.videoUl.reArrangeElements(virtualclass.videoUl.order); // 1
                        }

                    }
                    // virtualclass.videoUl.getVideoList();

                    var dropMsz = document.querySelector("#virtualclassCont.congrea #VideoDashboard .qq-uploader.qq-gallery");
                    if (dropMsz) {
                        dropMsz.setAttribute("qq-drop-area-text", "Drop videos here");
                    }
                    var cont = document.querySelector("#uploadMsz")
                    var msz = document.querySelector("#videoPopup #congreavideoContBody .qq-upload-list-selector.qq-upload-list");
                    if (msz) {
                        msz.style.display = "block";
                    }

                    var upMsz = document.querySelector("#uploadMsz div")
                    if (!upMsz) {
                        upMsz = document.createElement("div");
                        cont.appendChild(upMsz);
                    }
                    upMsz.appendChild(msz);
                    var lists = document.querySelectorAll("#videoPopup #uploadMsz ul")
                    // two ul not to be deleted(one is with li as a child and another recent):when we have started upload,
                    //we change current app and after that return to video
                    if (lists.length > 2) {
                        for (var i = 0; i < lists.length - 1; i++) {
                            if (!lists[i].querySelector("li")) {
                                lists[i].parentNode.removeChild(lists[i]);
                            }
                        }
                    }

                    var msz = document.querySelector("#videoPopup #uploadMsz .qq-upload-list-selector.qq-upload-list");
                    var btnUpload = document.querySelector("#uploadVideo");
                    btnUpload.addEventListener('click', function () {
                        var btn = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-button input");
                        var msz = document.querySelector("#uploadMsz");
                        if (msz) {
                            msz.style.display = "block";
                        }
                        if (btn) {
                            btn.click();
                        }

                    })

                },
                // nirmala aws
                awsr: function () {
                    var data = "Demo";
                    console.log('Request get document url 2');
                    this.postAjax(virtualclass.api.GetDocumentURLs, data)
                },


                awsVideoList: function () {
                    var data = virtualclass.awsData;
                    var videos = [];
                    for (var i = 0; i < data.length; i++) {
                        if ((data[i]["filetype"] == "video" || data[i]["filetype"] == "video_yts" || data[i]["filetype"] == "video_online") && !data[i].hasOwnProperty("deleted")) {
                            videos.push(data[i]);
                        }
                    }
                    console.log(videos);
                    virtualclass.videoUl.videos = videos;
                    virtualclass.serverData.rawData.video = videos;

                    // virtualclass.videoUl.allPages = content;
                    // var type = "video";
                    // var firstId = "congrea" + type + "ContBody";
                    // var secondId = "congreaShareVideoUrlCont";
                    // var elemArr = [firstId, secondId];
                    virtualclass.videoUl.showVideos(videos);
                    virtualclass.videoUl.retrieveOrder();
                }
            },
        };
    };
    window.videoUl = videoUl;
})(window);
