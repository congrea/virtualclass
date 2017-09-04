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
                    }
                    if(videoObj.type =='yts'){
                        virtualclass.videoUl.yts=true;
                    }
                }

                if (!roles.hasAdmin() || (roles.isEducator())) {
                    if (typeof this.videoId == 'undefined' && roles.isStudent() && !virtualclass.videoUl.yts ) {
                        //this.UI.defaultLayoutForStudent();
                        // to modify if else block
                    } else {
                        this.UI.container();
                        if (roles.hasControls()) {
                            ioAdapter.mustSend({'videoUl': {init: 'studentlayout'}, 'cf': 'videoUl'});
                            ioAdapter.mustSend({
                                'videoUl': {
                                    'init': {id: virtualclass.videoUl.videoId, videoUrl: virtualclass.videoUl.videoUrl},
                                    startFrom: virtualclass.videoUl.player.currentTime()
                                }, 'cf': 'videoUl'
                            })
                        } else {
                            if (typeof videoObj != 'undefined') {
                                // this.UI.defaultLayoutForStudent();
                                if (!videoObj.hasOwnProperty('fromReload')) {
                                    if(videoObj.type !='yts') {
                                        if (typeof this.videoId == 'undefined') {
                                            this.UI.defaultLayoutForStudent();
                                        } else {
                                            var url = videoObj.url || videoObj.init.videoUrl;
                                            (typeof startFrom == 'undefined') ? this.UI.displayVideo(videoObj.id, url) : this.UI.displayVideo(videoObj.id, url, startFrom);
                                        }
                                    }
                                }else{
                                    if(videoObj.type =='yts'){
                                        virtualclass.videoUl.UI.container();
                                        var player = document.querySelector('#virtualclassVideo #player');
                                        if(!player){
                                          var plr =   document.createElement("div");
                                           plr.id ="player";
                                           var cont = document.querySelector('#virtualclassVideo');
                                           cont.appendChild(plr);
                                        }
                                        virtualclass.yts.init(videoObj, startFrom);

                                    }

                                }

                            } else {
                                this.UI.defaultLayoutForStudent();
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
                        this.reArrangeElements(this.order);
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

            reArrangeElements: function (order) {
                var container = document.getElementById('listvideo'),
                    tmpdiv = document.createElement('div');
                tmpdiv.id = "listvideo";
                tmpdiv.className = "videos";

                for (var i = 0; i < order.length; i++) {
                    var elem = document.getElementById('linkvideo' + order[i])
                    if (elem) {
                        tmpdiv.appendChild(elem);
                    }
                }
                container.parentNode.replaceChild(tmpdiv, container);
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
            requestOrder: function (rdata) {
                virtualclass.xhr.sendFormData(rdata, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=congrea_retrieve_page_order", function (msg) {
                    var content = JSON.parse(msg);
                    if (content.message == "Failed") {
                        console.log("page order retrieve failed");
                    } else {
                        if (content) {
                            virtualclass.videoUl.order = [];
                            virtualclass.videoUl.order = content.split(',');
                            console.log('From database ' + virtualclass.videoUl.order.join(','));
                        }
                        if (virtualclass.videoUl.order.length > 0) {
                            virtualclass.videoUl.reArrangeElements(virtualclass.videoUl.order);
                        }
                    }
                });
            },

            /*
             * after upload video callbback function to update  order of videolist
             * and new order to save in dabase
             * @param response message

             */
            //new
            afterUploadVideo: function (id, xhr, res) {

                if (res.message == "success") {
                    virtualclass.videoUl.order.push(res.resultdata.id);
                    virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);

                } else if (res.message == "Failed") {
                    alert("video upload failed");
                } else if (res.message == "duplicate") {
                    alert("video is already uploaded");
                } else {
                    //fallback
                    alert("video upload failed");
                }

            },

            retrieveOrder: function () {
                var rdata = new FormData();
                rdata.append("live_class_id", virtualclass.gObj.congCourse);
                rdata.append("content_order_type", "2");
                this.requestOrder(rdata);

            },

            /*
             * retrieve videolist from database
             */
            getVideoList: function () {
                var data = new FormData();
                data.append("live_class_id", virtualclass.gObj.congCourse);
                data.append("type", "2");
                var cthis = this;
                virtualclass.xhr.sendFormData(data, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=congrea_retrieve_video", function (msg) {
                    var content = JSON.parse(msg);
                    if (content.message!= "noVideo") {
                        virtualclass.videoUl.videos = content;
                        virtualclass.videoUl.allPages = content;
                        var type = "video";
                        var firstId = "congrea" + type + "ContBody";
                        var secondId = "congreaShareVideoUrlCont";
                        var elemArr = [firstId, secondId];
                        virtualclass.videoUl.showVideos(content);
                        virtualclass.videoUl.retrieveOrder();
                    } else {
                        console.log(msg);
                    }
                });
            },

            afterUploadFile: function (vidObj) {

                var idPostfix = vidObj.id;
                // var docId = 'docs' + doc;
                this.pages[idPostfix] = new virtualclass.page('videoList', 'video', 'virtualclassVideo', 'videoUl', vidObj.status);
                this.pages[idPostfix].init(idPostfix, vidObj.title);
                this.videoDisplayHandler(vidObj);
                var vid = document.getElementById("linkvideo" + vidObj.id);
                var title = document.getElementById("videoTitle" + vidObj.id);
                if(title){
                    title.innerHTML = vidObj.title;
                }

                if (vidObj.status == "0") {
                    this._disable(vidObj.id)
                    if(vid){
                        vid.classList.add("disable");
                    }

                } else {
                    this._enable(vidObj.id);
                    if(vid){
                        vid.classList.add("enable");
                    }
                }
                this.calculateHeight();
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
                        virtualclass.videoUl.afterUploadFile(vidObj);
                    });

                }
                virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                virtualclass.vutil.makeElementActive('#listvideo');

            },

            videoDisplayHandler: function (vidObj) {
                var video = document.getElementById("mainpvideo" + vidObj.id);
                if(vidObj.type =="online"){
                    video.addEventListener('click',function(){
                        virtualclass.videoUl.yts=false;
                        $('#virtualclassVideo iframe#player').remove();
                        $('#videoPlayerCont').css({"display":"block"});
                        virtualclass.videoUl.shareVideo(vidObj.content_path);
                        video.setAttribute("data-dismiss","modal");
                        if(typeof virtualclass.yts.player == "object"){
                            virtualclass.yts.player.destroy();
                        }

                    })

                }else if(vidObj.type =="yts"){
                    var videoId = virtualclass.videoUl.getVideoId(vidObj.content_path);
                    video.addEventListener('click', function () {
                        //to remove this player
                        if(typeof virtualclass.yts.player == "object"){
                            virtualclass.yts.player="";
                        }

                        var player = document.querySelector("#virtualclassVideo #player");
                        if(player){
                            player.parentNode.removeChild(player)
                        }

                        var cont = document.querySelector("#virtualclassVideo");
                        var div = document.createElement("div");
                        div.id="player";
                        cont.appendChild(div) ;
                        virtualclass.videoUl.yts=true;
                        $('#videoPlayerCont').css({"display": "none"});
                        var obj={};
                        obj.init=videoId;
                        virtualclass.yts.init(obj);
                       // virtualclass.yts.onYTIframApi(videoId);
                        //ioAdapter.mustSend({'videoUl': {'ytsInit': videoId}, 'cf': 'videoUl'});
                       // virtualclass.videoUl.ytsVideoPlay(videoId)
                        video.setAttribute("data-dismiss", "modal");
                    })

                }else{

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
                            virtualclass.videoUl.yts=false;
                            virtualclass.videoUl.UI.displayVideo(vidObj.id, vidObj.content_path);
                            virtualclass.videoUl.activeVideoClass(vidObj.id);
                            virtualclass.videoUl.videoToStudent(vidObj);
                            virtualclass.videoUl.videoId = vidObj.id;
                            video.setAttribute("data-dismiss",'modal');
                        });

                    }

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
                this.reArrangeElements(order);
                this.sendOrder(this.order);

            },

            sendOrder: function (order) {
                var data = {
                    'content_order': order.toString(),
                    content_order_type: 2,
                    live_class_id: virtualclass.gObj.congCourse
                };
                virtualclass.vutil.xhrSendWithForm(data, 'congrea_page_order', function (response) {
                });
            },

            onNewUser: function (msg) {
                console.log("videoUl");
                virtualclass.videoUl.videoId = msg.videoUl.init.id;
                virtualclass.videoUl.videoUrl = msg.videoUl.init.videoUrl;
                // setTimeout(function(){
                virtualclass.videoUl.UI.displayVideo(msg.videoUl.init.id, msg.videoUl.init.videoUrl, msg.videoUl.startFrom);
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
                    } else if (msg.videoUl == 'pause') {
                        this.pauseVideo();
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
                if (msg.videoUl.hasOwnProperty('init')) {
                    virtualclass.videoUl.yts=false;
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
                        if (msg.videoUl.isPaused) {
                            if (virtualclass.videoUl.player) {
                                virtualclass.videoUl.player.pause();
                            }
                        }
                    }
                } else if (msg.videoUl.hasOwnProperty('content_path')) {
                    virtualclass.videoUl.yts=false;
                    virtualclass.videoUl.videoId = msg.videoUl.id;
                    virtualclass.videoUl.videoUrl = msg.videoUl.content_path;
                    virtualclass.videoUl.title = msg.videoUl.title;
                    virtualclass.videoUl.UI.displayVideo(msg.videoUl.id, virtualclass.videoUl.videoUrl);
                } else if (msg.videoUl.hasOwnProperty('play')) {
                    this.playVideo(msg.videoUl.play);
                }else if (msg.videoUl.hasOwnProperty('ytsInit')){
                    var upcont = document.getElementById("videoPlayerCont")
                    upcont.style.display="none";
                    virtualclass.videoUl.yts=true;
                    virtualclass.yts.init(msg);
                    // alert("ytsinit");

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
                virtualclass.videoUl.player.play();
                virtualclass.videoUl.player.currentTime(seekVal);
            },

            pauseVideo: function () {
                virtualclass.videoUl.player.pause();
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
                        virtualclass.videoUl.UI.displayVideo(currVideoObj.id, currVideoObj.content_path);
                        virtualclass.videoUl.videoToStudent(currVideoObj);

                        if (virtualclass.videoUl.player) {
                            // virtualclass.videoUl.player.on("ready",function(){
                            virtualclass.videoUl.player.play();
                        }
                        this.activeVideoClass(currVideoObj.id);
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
                var video = document.getElementById("mainpvideo" + _id);
                video.style.opacity = .3;
                video.style.pointerEvents = 'none';
                if(virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                    virtualclass.videoUl.videos.forEach(function (elem, i) {
                        if (elem["id"] == _id) {
                            elem.status = 0;
                        }
                    })
                }
            },

            /*
             * to enable  video in the videolist
             */
            _enable: function (_id) {
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
                var form_data = new FormData();
                var data = {lc_content_id: id, action: 'delete', user: virtualclass.gObj.uid};
                var form_data = new FormData();
                for (var key in data) {
                    form_data.append(key, data[key]);
                    console.log(data[key]);
                }

                virtualclass.xhr.sendFormData(form_data, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=update_content_video", function (msg) {
                    if (msg != "ERROR") {
                        var elem = document.getElementById("linkvideo" + id);
                        if (elem) {
                            elem.parentNode.removeChild(elem);
                            //virtualclass.videoUl.order=[];
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
                });
            },
            /*
             * to retrive order from data base
             */
            xhrOrderSend: function (order) {
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

            videoToStudent: function (videoObj) {
                ioAdapter.mustSend({'videoUl': videoObj, 'cf': 'videoUl'});
            },
            //new
            saveYoutubeUrl:function(videoId){
                var cont = document.getElementById('listvideo')
                var div = document.createElement("div");
                cont.appendChild(div);
                var anc = document.createElement("a");
                div.appendChild(anc)
                anc.href = "#" ;
                anc.innerHTML="videoId "+videoId;
                anc.addEventListener('click',function(){

                    virtualclass.videoUl.ytsVideoPlay(videoId)
                    anc.setAttribute("data-dismiss","modal");
                })
            },
            ytsVideoPlay:function(videoId){
                // $('#videoPlayerCont').css('display','none');
                // virtualclass.yts.onYTIframApi(videoId);
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

            onYTIframApi: function (videoId, playStratFrom, fromReload) {
                if (typeof videoId != 'undefined') {
                    this.videoId = videoId;
                }

                // roles.hasControls(), because loadVideoById is not working, find out why
                if (typeof this.player == 'object' && roles.hasControls()) {
                    this.player.loadVideoById(videoId);
                } else {
                    var vcontrols = 0;
                    if (roles.hasControls()) {
                        vcontrols = 1;
                    }

                    var playerVarsObj = {
                        autohide: 0,
                        disablekb: 1,
                        enablejsapi: 1,
                        modestbranding: 1,
                        controls: vcontrols,
                        rel: 0,
                        fs: 0,
                        showinfo: 0,
                        start: (typeof playStratFrom) != 'undefined' ? Math.round(playStratFrom) : 0
                    };

                    var videoObj = {
                        playerVars: playerVarsObj,
                        videoId: videoId,
                        events: {
                            'onReady': this.onPlayerReady
                        }
                    };

                    if (typeof playStratFrom != 'undefined') {
                        videoObj.start = playStratFrom;
                    }

                    console.log('Player object is CREATED');
                    if (typeof fromReload != 'undefined') {
                        var that = virtualclass.yts;
                        // YouTube player is not ready for when the page is being load
                        // this should should not worked when the user click on youtube share button

                        //window.onYouTubeIframeAPIReady = function () {
                        //    that.player = new YT.Player('player', videoObj);
                        //};

                        if(yts.hasOwnProperty('ytApiReady')){
                            that.player = new YT.Player('player', videoObj);
                            //window.onYouTubeIframeAPIReady = function () {
                            //    that.player = new YT.Player('player', videoObj);
                            //};
                        } else {
                            console.log('onYouTubeIframeAPIReady is not ready ');
                            setTimeout(function (){
                                that.onYTIframApi(videoId, playStratFrom, fromReload);
                            }, 300);
                            return;
                        }
                    } else {
                        this.player = new YT.Player('player', videoObj);
                    }

                    // var youTubeContainer = document.getElementById(this.UI.id);
                    // youTubeContainer.className = youTubeContainer.className + " youTubeSharing";
                }

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
                    if (!videoCont) {
                        var cont = document.getElementById("virtualclassVideo");
                        virtualclass.videoUl.UI.createPlayerCont(cont);
                        //virtualclass.videoUl.UI.container();
                        videoCont = document.getElementById("videoPlayerCont");
                        // videoCont = document.getElementById("virtualclassVideo");
                    } else {
                        // todo to add condition for reload
                        videoCont.style.display = "block";
                    }

                    if($('iframe#player').length){
                        $('iframe#player').remove();
                    }

                    virtualclass.videoUl.UI.switchDisplay(videoCont, videoUrl);

                    virtualclass.videoUl.UI.videojsPlayer(videoUrl, vidId, startFrom);

                },
                destroyYT: function () {

                    if (typeof virtualclass.yts.player == 'object') {
                        if(virtualclass.currApp == 'ScreenShare'){
                            // ioAdapter.mustSend({'yts': 'destroyYT', 'cf': 'yts'});
                        }
                        virtualclass.yts.player.destroy();
                        virtualclass.yts.player = "";
                        if (virtualclass.yts.hasOwnProperty('tsc')) {
                            clearInterval(virtualclass.yts.tsc);
                        }
                    }
                },


                videojsPlayer: function (videoUrl, vidId, startFrom) {

                    var player = videojs("dispVideo");

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

                    });
                    player.on("play", function (e) {
                        console.log("play");
                        if (roles.hasControls()) {

                            ioAdapter.mustSend({'videoUl': {"play": player.currentTime()}, 'cf': 'videoUl'});
                        }

                    });

                    player.on("fullscreenchange", function (e) {
                        //virtualclass.videoUl.UI.onfullscreenChange(player);
                    });

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
                createVideoElem: function (videoCont) {

                    var video = '<video id="dispVideo" class="video-js" controls  preload="auto" data-setup="{}" >';
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
                    player.src({type: 'video/webm', src: videoUrl});
                    player.src({type: 'video/mp4', src: videoUrl});
                    if (startFrom) {
                        player.currentTime(startFrom);
                        // temp
                        player.play();
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
                    // needed to replay same video after resett
                    player.src({type: 'video/webm', src: videoUrl});
                    player.src({type: 'video/mp4', src: videoUrl});

                    console.log("ended" + vidId)
                    var index = virtualclass.videoUl.order.indexOf(vidId);
                    if (index < virtualclass.videoUl.order.length - 1 && index >= 0) {
                        virtualclass.videoUl.listEnd = false;
                    } else {
                        virtualclass.videoUl.listEnd = true;
                        vidId = -1;
                    }
                    //if (virtualclass.videoUl.autoPlayFlag && !virtualclass.videoUl.listEnd) {
                    if (virtualclass.videoUl.autoPlayFlag) {

                        virtualclass.videoUl.autoPlayList(index + 1);

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
                            var type="yts";
                            var input = document.querySelector(".congrea #videourl");
                            var rdata = new FormData();
                            // virtualclass.videoUl.shareVideo(input.value);
                            $('.congrea #listvideo .playing').removeClass('playing');
                            $('.congrea #listvideo .removeCtr').removeClass('removeCtr');

                            // var cont = document.getElementById('listvideo')
                            // var div = document.createElement("div");
                            // cont.appendChild(div);
                            // var anc = document.createElement("a");
                            // div.appendChild(anc)
                            // anc.href = "#" ;
                           // anc.innerHTML=input.value;
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
                createPlayerCont:function(){





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
                popup:function(){
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

                    virtualclass.videoUl.getVideoList();

                    var cont =  document.querySelector("#uploadMsz")
                    var msz = document.querySelector(".qq-upload-list-selector.qq-upload-list");
                    cont.appendChild(msz);
                    var btn = $("#videoPopup .qq-upload-list-selector.qq-upload-button input");
                    var btnUpload= $("#uploadVideo");
                    btnUpload.click(function(){
                        btn.click();
                    })

                }
            },
        };
    };
    window.videoUl = videoUl;
})(window);