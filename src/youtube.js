// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2015  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * this file creates the player object to play video and to send it's state changes to the receiver
 * receiver accordingly updates its state.
 */
(function (window, document) {
    //var io = window.io;
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
            retryForPalyer: 1, // Not being used
            player: '',
            /*
             * it creates the the necessary layout and containers to place 
             * video and to input url 
             * Call to the function to create player object 
             * @param  videoObj
             * @param  startFrom the position from where to start playing video in second

             */
            init: function (videoObj, startFrom) {
                if (typeof videoObj != 'undefined') {
                    if (videoObj.init != 'studentlayout') {
                        var videoId = videoObj.init;
                    }

                }

                if (!roles.hasAdmin() || (roles.isEducator())) {
                    if (typeof videoId == 'undefined' && roles.isStudent()) {
                        this.UI.defaultLayoutForStudent();

                    } else {
                        //("video url  available");
                        this.UI.container();

                        // if student has teacher role, localstorage validate because there is not ready actual role on virtualclass.gObj.uRole

                        if (roles.hasControls()) {
                            if(typeof videoId != 'undefined'){
                                this.onYTIframApi(videoId, startFrom, 'fromReload');
                            }
                            this.UI.inputURL();
                            ioAdapter.mustSend({'yts': {init: 'studentlayout'}, 'cf': 'yts'});
                        } else {
                            if(typeof videoObj != 'undefined'){
                                if (!videoObj.hasOwnProperty('fromReload')) {

                                    // When student try to share the youtube video
                                    if(typeof videoId == 'undefined'){
                                        this.UI.defaultLayoutForStudent();
                                    } else{
                                        (typeof startFrom == 'undefined') ? this.onYTIframApi(videoId) : this.onYTIframApi(videoId, startFrom);
                                    }

                                }
                            } else {
                                // when user transfered the role refresh during the youtube sharing
                                this.UI.defaultLayoutForStudent();
                            }

                            //this.onYTIframApi(videoId, startFrom, 'fromReload');
                        }
                    }
                } else {
                    //  alert("original teacher");
                    this.UI.container();
                    if (typeof startFrom != 'undefined') {
                        this.onYTIframApi(videoId, startFrom, 'fromReload');
                    }
                    this.UI.inputURL();

                    //For student layout
                    ioAdapter.mustSend({'yts': {init: 'studentlayout'}, 'cf': 'yts'});
                }

            },
            /*
             * this function is called  when we leave  the video player's page 
             * 
             */
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
            /*
             * this object is for user interface
             */
            UI: {
                id: 'virtualclassYts',
                class: 'virtualclass',
                /*
                 * Creates container for the video and appends the container before audio widget
                 */
                container: function () {

                    var ytsCont = document.getElementById(this.id);
                    if (ytsCont != null) {
                        ytsCont.parentNode.removeChild(ytsCont);
                    }

                    var divYts = document.createElement('div');
                    divYts.id = this.id;
                    divYts.className = this.class;

                    this.createPlayerTag(divYts);


                    var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                    document.getElementById(virtualclass.html.id).insertBefore(divYts, beforeAppend);
                },

                createPlayerTag: function (divYts) {
                    var divPlayer = document.createElement('div');
                    divPlayer.id = "player";
                    divYts.appendChild(divPlayer);
                },
                /* 
                 * This function is being called when the teacher's role is assigned to student
                 * A layout to place video is created by this function
                 * it creates layout to place video and url placeholder
                 */


                defaultLayoutForStudent: function () {
                    var ytsContainer = document.getElementById(this.id);
                    if (ytsContainer == null) {
                        ytsContainer = document.createElement('div');
                        ytsContainer.id = this.id;
                        ytsContainer.className = this.class;
                        var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                        document.getElementById(virtualclass.html.id).insertBefore(ytsContainer, beforeAppend);
                    }

                    var youtubeUrlContainer = document.getElementById('youtubeUrlContainer');
                    if (youtubeUrlContainer != null) {
                        youtubeUrlContainer.parentNode.removeChild(youtubeUrlContainer);
                    }

                    var messageLayoutId = 'messageLayout';
                    if (document.getElementById(messageLayoutId) == null) {
                        var studentMessage = document.createElement('p');
                        studentMessage.id = messageLayoutId;
                        studentMessage.innerHTML = virtualclass.lang.getString('teachermayshow');
                        ytsContainer.appendChild(studentMessage);
                    }

                },
                /*
                 * Creating input  and submit element  for the url
                 * On clicking submit button an object containing video object is sent to the students
                 * Calling function to create player object
                 * 
                 */
                inputURL: function () {
                    var studentMessage = document.getElementById('messageLayout');
                    if (studentMessage != null) {
                        studentMessage.parentNode.removeChild(studentMessage);
                    }

                    if (document.getElementById('youtubeUrlContainer') == null) {
                        var uiContainer = document.createElement('div');
                        uiContainer.id = "youtubeUrlContainer";

                        var input = document.createElement("input");
                        input.id = "youtubeurl";
                        input.cols = 70;
                        input.rows = 3;
                        input.placeholder = virtualclass.lang.getString("youTubeUrl");

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
                            ioAdapter.mustSend({'yts': {'init': videoId}, 'cf': 'yts'});
                        });
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
                }

            },
            /*
             * getting the video id from the url of the video
             * @param url url of the youtube video
             */
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
             * It changes the state of the video based on the message received
             * @param  msg message object to sent information to the receiver

             */
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
            /*
             * Creates player object
             * @param  videoId 
             * @param  playStratFrom If page is reloaded it starts from the last left position
             * @param  fromReload If video is reloaded due to page refresh then it is defined otherwise it is undefined

             */
            onYTIframApi: function (videoId, playStratFrom, fromReload) {
                //console.log(playStratFrom);
                // console.log(fromReload);
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
                        var that = this;
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

                    var youTubeContainer = document.getElementById(this.UI.id);
                    youTubeContainer.className = youTubeContainer.className + " youTubeSharing";
                }

            },
            /*
             * Once the player is ready  this is triggered  after every two second to 
             * find the  video' s state ,position and mute or unmute.
             * it checks for  the video's current time , state and mute or unmute
             * and calls the corrending functions to update at the receiver 
             * 
             */
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
                    console.log(CTpre);

                    console.log(this.player.getCurrentTime());
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
            /*
             * If video at sender's side is muted then an object is sent
             *  to reciver indicating that video is muted else object indicates unmute
             * @param {boolean} muted true if video is muted otherwise false

             */
            ytOnMuted: function (muted) {
                if (muted) {
                    ioAdapter.mustSend({'yts': 'mute', 'cf': 'yts'});
                } else {
                    ioAdapter.mustSend({'yts': 'unmute', 'cf': 'yts'});
                }

                console.log('MUTED ' + muted);
            },
            /*
             * Send the seek position to the receiver.
             * @param seekto  video seek position in seconds

             */
            // seekto is video in seconds
            ytOnSeek: function (seekto) {
                ioAdapter.mustSend({'yts': {'seekto': seekto}, 'cf': 'yts'});
                console.log('SEEK CHANGED ' + seekto);
            },

            /*
             * On state change , State of the video is being sent to the receiver
             * @param int state state of the video
             */
            ytOnChange: function (state) {
                console.log('STATE CHANGED ' + state);
                if (state == 1) {
                    ioAdapter.mustSend({'yts': 'play', 'cf': 'yts'});
                } else if (state == 2) {
                    ioAdapter.mustSend({'yts': 'pause', 'cf': 'yts'});
                }
            },
            /*
             * this event handler is called when the player is ready
             * plays video, unmute video, sets it volume
             * and if the role is teacher he would be able to seek change
             * @param event onready event 
             */
            onPlayerReady: function (event) {
                if (roles.hasControls()) {
                    var submitURLButton = document.getElementById('submitURL');
                    submitURLButton.innerHTML = virtualclass.lang.getString('shareAnotherYouTubeVideo');
                }

                event.target.playVideo();

                virtualclass.yts.player.unMute();
                virtualclass.yts.player.setVolume(40);
                //alert("hello");
                if (roles.hasControls()) {
                    virtualclass.yts.seekChangeInterval();
                }
            },

            /*
             * After every two second a function is executed to find the seek position
             * 
             */
            seekChangeInterval: function () {
                virtualclass.yts.tsc = setInterval(
                    function () {
                        virtualclass.yts.triggerOnSeekChange();
                    }
                    , 2000);
            }
        }
    };

    window.onYouTubeIframeAPIReady = function () {
        yts.ytApiReady = true;
        console.log('onYouTubeIframeAPIReady is ready now');
    };

    window.yts = yts;
})(window, document);
