// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
    var io = window.io;
    var i = 0;
    /**
     * This is the main object which has properties and methods
     * Through this properties and methods all the front stuff is happening
     * eg:- creating, storing and replaying the objects
     */

    var yts = function (config) {
        //var player;
        var CTpre = 0, PLState = -2, PSmute = -1;

        return {
            retryForPalyer : 1,
            player: '',
            init: function (videoObj, startFrom) {

                if(typeof videoObj != 'undefined'){
                    if(videoObj.init != 'studentlayout'){
                        var videoId = videoObj.init;
                    }
                }
                //if (virtualclass.gObj.uRole == 's' && localStroage.getItem('orginalTeacherId') ==  null) {
                // should not orginal teacher, If orginal teacher then, he/she should have not teacher role
                if (localStorage.getItem('orginalTeacherId') ==  null ||
                        (localStorage.getItem('orginalTeacherId') !=  null && localStorage.getItem('reclaim') != null )
                                        ) {

                    if(typeof videoId == 'undefined' && virtualclass.gObj.uRole == 's'){
                        this.UI.defaultLayoutForStudent();
                    } else {
                        this.UI.container();
                        // if student has teacher role, localstorage validate because there is not ready actual role on virtualclass.gObj.uRole

                        if (localStorage.getItem('teacherId') != null ){
                            this.onYTIframApi(videoId, startFrom, 'fromReload');
                            this.UI.inputURL();
                            io.send({'yts': {init : 'studentlayout'}});
                        } else {
                            if(!videoObj.hasOwnProperty('fromReload')){
                                (typeof startFrom == 'undefined') ? this.onYTIframApi(videoId) : this.onYTIframApi(videoId, startFrom);
                            }
                            //this.onYTIframApi(videoId, startFrom, 'fromReload');

                        }
                    }
                } else {
                    this.UI.container();
                    if(typeof startFrom != 'undefined'){
                        this.onYTIframApi(videoId, startFrom, 'fromReload');
                    }
                    this.UI.inputURL();

                    //For student layout
                    io.send({'yts': {init : 'studentlayout'}});
                }
            },

            destroyYT: function () {
                if (typeof virtualclass.yts.player == 'object') {
                    //console.log('Player object is DESTROYED.');
                    virtualclass.yts.player.destroy();
                    virtualclass.yts.player = "";
                    if (virtualclass.yts.hasOwnProperty('tsc')) {
                        clearInterval(virtualclass.yts.tsc);
                    }
                }
            },

            UI: {
                id: 'virtualclassYts',
                class: 'virtualclass',
                container: function () {

                    var ytsCont = document.getElementById(this.id);
                    if (ytsCont != null) {
                        ytsCont.parentNode.removeChild(ytsCont);
                    }

                    var divYts = document.createElement('div');
                    divYts.id = this.id;
                    divYts.className = this.class;

                    this.createPlayerTag(divYts);

                    //var divPlayer = document.createElement('div');
                    //divPlayer.id = "player";
                    //divYts.appendChild(divPlayer);

                    var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                    document.getElementById(virtualclass.html.id).insertBefore(divYts, beforeAppend);
                },

                createPlayerTag : function (divYts){
                    var divPlayer = document.createElement('div');
                    divPlayer.id = "player";
                    divYts.appendChild(divPlayer);
                },

                defaultLayoutForStudent : function (){
                    var ytsContainer = document.getElementById(this.id);
                    if(ytsContainer == null){
                        ytsContainer = document.createElement('div');
                        ytsContainer.id = this.id;
                        ytsContainer.className = this.class;
                        var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                        document.getElementById(virtualclass.html.id).insertBefore(ytsContainer, beforeAppend);
                    }

                    var youtubeUrlContainer =  document.getElementById('youtubeUrlContainer');
                    if(youtubeUrlContainer != null){
                        youtubeUrlContainer.parentNode.removeChild(youtubeUrlContainer);
                    }

                    var messageLayoutId = 'messageLayout';
                    if(document.getElementById(messageLayoutId) == null){
                        var studentMessage = document.createElement('p');
                        studentMessage.id =  messageLayoutId;
                        studentMessage.innerHTML = virtualclass.lang.getString('teachermayshow');
                        ytsContainer.appendChild(studentMessage);
                    }
                },

                inputURL: function () {
                    var studentMessage = document.getElementById('messageLayout');
                    if(studentMessage != null){
                        studentMessage.parentNode.removeChild(studentMessage);
                    }

                    if (document.getElementById('youtubeUrlContainer') == null) {
                        var uiContainer = document.createElement('div');
                        uiContainer.id = "youtubeUrlContainer";

                        var input = document.createElement("input");
                        input.id = "youtubeurl";
                        input.cols = 70;
                        input.rows = 3;
                        input.placeholder =  virtualclass.lang.getString("youTubeUrl");

                        //var tnode = document.createTextNode("Please put here youtube url");
                        //input.appendChild(tnode);

                        document.getElementById('virtualclassYts').appendChild(input);

                        uiContainer.appendChild(input);

                        var submitURL = document.createElement('button');
                        submitURL.id = 'submitURL';
                        submitURL.innerHTML = virtualclass.lang.getString('shareYouTubeVideo');

                        uiContainer.appendChild(submitURL);

                        var ytsCont = document.getElementById('virtualclassYts');
                        var playerTag = document.getElementById('player');

                        // referenceNode.nextSibling, insert after
                        ytsCont.insertBefore(uiContainer, playerTag.nextSibling);



                        //for teachers'
                        submitURL.addEventListener('click', function () {

                            var videourl = document.getElementById('youtubeurl').value;
                            var videoId = virtualclass.yts.getVideoId(videourl);

                            if (typeof videoId == 'boolean') {
                                alert('Invalid YouTube URL.');
                                return;
                            }

                            virtualclass.yts.videoId = videoId;
                            virtualclass.yts.onYTIframApi(videoId);
                            io.send({'yts': {'init': videoId}});
                        });
                    }
                },

                removeinputURL: function () {
                    var inputContainer = document.getElementById('youtubeUrlContainer');
                    if (inputContainer != null) {
                        inputContainer.parentNode.removeChild(inputContainer);
                    }
                }

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

            onmessage: function (msg) {
                if (typeof msg.yts == 'string') {

                    if (msg.yts == 'play') {
                        this.player.playVideo();
                    } else if (msg.yts == 'pause') {
                        this.player.pauseVideo();
                    } else if (msg.yts == 'mute') {
                        this.player.mute();
                    } else if (msg.yts == 'unmute') {
                        this.player.unMute();
                    }

                } else {
                    if (msg.yts.hasOwnProperty('init')) {
                        virtualclass.makeAppReady('Yts', undefined, msg.yts);
                    } else {
                        var seekToNum = parseInt(msg.yts.seekto, 10);
                        //during the replay if player is ready for seek
                        if (this.player.hasOwnProperty('seekTo')) {
                            this.player.seekTo(seekToNum);
                        }
                    }
                }
            },

            onYTIframApi: function (videoId, playStratFrom, fromReload) {
                if(typeof videoId != 'undefined'){
                    this.videoId = videoId;
                }

                // virtualclass.gObj.uRole == 't', because loadVideoById is not working, find out why
                if (typeof this.player == 'object' && virtualclass.gObj.uRole == 't') {
                    this.player.loadVideoById(videoId);
                } else {
                    var playerVarsObj = {
                        height: '390',
                        width: '640',
                        autohide: 0,
                        disablekb: 1,
                        enablejsapi: 1,
                        modestbranding: 1,
                        start: (typeof playStratFrom) != 'undefined' ? Math.round(playStratFrom) : 0
                        }

                    var videoObj = {
                        playerVars : playerVarsObj,
                        videoId :  videoId,
                        events : {
                            'onReady': this.onPlayerReady
                        }
                    }

                    if(typeof playStratFrom != 'undefined'){
                        videoObj.start = playStratFrom;
                    }

                    console.log('Player object is CREATED');
                    if(typeof fromReload !=  'undefined'){
                        var that = this;
                        // YouTube player is not ready for when the page is being load
                        // this should should not worked when the user click on youtube share button
                        window.onYouTubeIframeAPIReady = function() {
                            that.player = new YT.Player('player', videoObj);
                        };
                    }else {
                        this.player = new YT.Player('player', videoObj);
                    }

                    var youTubeContainer = document.getElementById(this.UI.id);
                    youTubeContainer.className = youTubeContainer.className + " youTubeSharing";
                }
            },

            triggerOnSeekChange: function () {
                //this.actualCurrentTime = this.player.getCurrentTime();
                console.log('there should happend something after each 2 second');
                if (CTpre == 0 || PLState == -2 || PSmute == -1) {
                    CTpre = this.player.getCurrentTime();
                    PLState = this.player.getPlayerState();
                    PSmute = this.player.isMuted();
                } else {
                    var difftime = Math.abs(this.player.getCurrentTime() - CTpre);
                    CTpre = this.player.getCurrentTime();

                    if (difftime > 4) {
                        this.ytOnSeek(this.player.getCurrentTime());
                    }

                    if ((this.player.getPlayerState() != PLState) && this.player.getPlayerState() != 3) {
                        this.ytOnChange(this.player.getPlayerState());
                        PLState = this.player.getPlayerState();
                    }

                    if (this.player.isMuted() != PSmute) {
                        this.ytOnMuted(this.player.isMuted());
                        PSmute = this.player.isMuted();
                    }

                }
            },

            ytOnMuted: function (muted) {
                if (muted) {
                    io.send({'yts': 'mute'});
                } else {
                    io.send({'yts': 'unmute'});
                }

                console.log('MUTED ' + muted);
            },

            // seekto is video in seconds
            ytOnSeek: function (seekto) {
                io.send({'yts': {'seekto': seekto}});
                console.log('SEEK CHANGED ' + seekto);
            },

            /*
             * state is player state as given by player.getPlayerState
             *  -1 – unstarted
             *  0 – ended
             *  1 – playing
             *  2 – paused
             *  3 – buffering
             *  5 – video cued
             */
            ytOnChange: function (state) {
                console.log('STATE CHANGED ' + state);
                if (state == 1) {
                    io.send({'yts': 'play'});
                } else if (state == 2) {
                    io.send({'yts': 'pause'});
                }
            },

            onPlayerReady: function (event) {
                if(virtualclass.gObj.uRole == 't'){
                    var submitURLButton = document.getElementById('submitURL');
                    submitURLButton.innerHTML = virtualclass.lang.getString('shareAnotherYouTubeVideo');
                }

                event.target.playVideo();

                virtualclass.yts.player.unMute();
                virtualclass.yts.player.setVolume(40);
                if (virtualclass.gObj.uRole == 't') {
                    virtualclass.yts.seekChangeInterval();
                }
            },

            seekChangeInterval: function () {
                virtualclass.yts.tsc = setInterval(
                    function () {
                        virtualclass.yts.triggerOnSeekChange();
                    }
                    , 2000);
            }
        }
    };
    window.yts = yts;
})(window, document);
