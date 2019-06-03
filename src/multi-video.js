// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2017  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    // var meeting = window.meeting
    userStreams = {};
    var MultiVideo = {
        init: function () {

            pc_config = {
                iceServers: [
                    {urls: ['stun:turn.congrea.net']},
                    {
                        urls: "turn:turn.congrea.net",
                        username: wbUser.auth_user,
                        credential: wbUser.auth_pass
                    }
                ]
            }

            this.UI.container();
            this.start();
            var videosWrapper = document.querySelector('#videosWrapper .videoCont.selfVideo');
            videosWrapper.id = 'vid' + virtualclass.gObj.uid;

            videosWrapper.setAttribute('data-userid', virtualclass.gObj.uid);
            var that = this;
            userStreams[virtualclass.gObj.uid] = virtualclass.multiVideo.localStream;
            videosWrapper.addEventListener('click', function () {
                that.UI.displayMainVideo(this);
            });

            this.updateVideoLength();

            // if(virtualclass.gObj.audioEnable){
            //     var tag = document.querySelector('#speakerPressOnce');
            //     virtualclass.vutil.audioStatus(tag, "true");
            // }


            // this.setAudioStatus(false);

            var videoSwitch = localStorage.getItem('videoSwitch');

            if (videoSwitch != null) {
                if (videoSwitch == '0') {
                    virtualclass.multiVideo.setVideoStatus(false);
                }
            }
        },

        _init: function () {
            var mvideo = document.querySelector('#videosWrapper .videoCont.selfVideo');
            this.UI.displayMainVideo(mvideo);

            var that = this;
            // todo handle in proper way
            setTimeout(
                function () {
                    that.displayVideo();
                    if (roles.hasControls()) {
                        var data = {cf: 'mvid', '_init': true}
                        ioAdapter.mustSend(data);
                    }
                }, 2000
            );
        },


        displayVideo: function () {
            var multiVideo = document.querySelector('#virtualclassMultiVideo');
            multiVideo.style.display = 'block';
        },

        start: function () {
            console.log('Video First, multivideo');

            virtualclass.multiVideo.localStream = virtualclass.media.video.tempStream;

            _localStream = virtualclass.multiVideo.localStream;

            console.log('multivideo, add get user media ');
            selfView = document.querySelector('#videoConfrence .multilocalVideo');
            // selfView.src = URL.createObjectURL(virtualclass.multiVideo.localStream);

            virtualclass.adpt.attachMediaStream(selfView, virtualclass.multiVideo.localStream);
            this.initDone = true;
        },

        UI: {
            container: function () {
                var videoWrapper = document.querySelector('#virtualclassMultiVideo');
                if (videoWrapper == null) {
                    var template = virtualclass.getTemplate("multiVideoMain");
                    // $('#virtualclassAppLeftPanel').append(template());
                    virtualclass.vutil.insertAppLayout(template());
                }
            },

            displayMainVideoOld: function (element) {
                var videoElem = element.firstElementChild;
                if (virtualclass.currApp == 'MultiVideo') {
                    var canvas = document.querySelector('#multiVidSelected');
                    var ctx = canvas.getContext('2d');
                    if (typeof earlierVideo != 'undefined') {
                        clearInterval(earlierVideo);
                    }

                    earlierVideo = setInterval(
                        function () {
                            ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
                        }, 28 //35 frame per second
                    );
                }
            },

            displayMainVideo: function (element) {
                if (virtualclass.currApp == 'MultiVideo') {
                    var video = document.querySelector('#multiVidSelected');
                    var userid = element.dataset.userid;
                    virtualclass.adpt.attachMediaStream(video, userStreams[userid]);
                }
            }
        },

        removeUser: function (userId) {
            var mvideo = document.querySelector('#videosWrapper .videoCont[data-userid="' + userId + '"]');
            if (mvideo != null) {
                mvideo.parentNode.removeChild(mvideo);
            }
            // delete userStreams[userId];
        },

        onUserRemove: function (userId) {
            this.removeUser(userId);
            this.updateVideoLength();
            if (typeof apc[userId] == 'object') {
                apc[userId].close();
            }

            if (typeof opc[userId] == 'object') {
                opc[userId].close();
            }
            // delete apc[userId];
            // delete opc[userId];
            // delete userStreams[userId];
        },

        updateVideoLength: function () {
            var allVideos = document.querySelectorAll('#videoConfrence .videoCont');

            var users = 'one';
            if (allVideos.length > 4) {
                var users = 'morethanfour';
            } else if (allVideos.length > 2) {
                var users = 'four';
            } else if (allVideos.length > 1) {
                var users = 'two';
            }

            var virtualclassCont = document.querySelector('#virtualclassCont');
            var videoConfrence = document.querySelector('#videoConfrence');
            virtualclassCont.setAttribute('data-totalUser', users);
            videoConfrence.setAttribute('data-totalUser', users);
        },


        setAudioStatus: function (action) {
            var audioTracks = virtualclass.multiVideo.localStream.getAudioTracks();
            if (audioTracks.length === 0) {
                console.log("No local audio available.");
                return;
            }

            for (var i = 0; i < audioTracks.length; ++i) {
                audioTracks[i].enabled = action;
            }
        },

        setVideoStatus: function (action) {
            setTimeout(() => {
                if (typeof virtualclass.multiVideo.localStream != 'undefined') {
                    var videoWrapper = document.querySelector('#vid' + virtualclass.gObj.uid);


                    var videoTracks = virtualclass.multiVideo.localStream.getVideoTracks();

                    if (videoTracks.length === 0) {
                        console.log("No local video available.");
                        return;
                    }
                    console.log("Toggling video mute state.");
                    var dispClass;
                    for (var i = 0; i < videoTracks.length; ++i) {
                        videoTracks[i].enabled = action;

                        if (videoWrapper != null) {
                            var videoConfrence = document.querySelector('#videoConfrence');
                            var activeVideos = document.querySelectorAll('#videosWrapper .videoCont.vshow');

                            if (videoConfrence != null) {
                                videoConfrence.dataset.activeuser = 'vid_' + activeVideos.length;
                            }
                        }

                    }
                } else {
                    console.log('localStream is undefined');
                }


            }, 1000);
            // this.pcClient_.sendCallstatsEvents(videoTracks[0].enabled ? "videoResume" : "videoPause");
            // trace("Video " + (videoTracks[0].enabled ? "unmuted." : "muted."));
        },

        addClass: function () {

        }

    };

    apc = {};
    opc = {};

    //var pc;
    // var pc_config = window.webrtcDetectedBrowser === 'firefox' ?
    //   {'iceServers': [{'url': 'stun:23.21.150.121'}]} : // number IP
    //   {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

    // var pc_config = {
    //     iceServers: [
    //         { urls: ['stun:turn.congrea.net']},
    //         {   urls: "turn:turn.congrea.net",
    //             username: wbUser.auth_user,
    //             credential: wbUser.auth_pass
    //         }
    //     ]
    // }

    var pc_constraints = {
        'optional': [
            {'DtlsSrtpKeyAgreement': true},
            {'RtpDataChannels': true}
        ]
    };


    function failureCallback(error) {
        console.log('multivideo, ' + error);
    }

    MultiVideo.onmessage = function (message, fromUser) {
        if (message.hasOwnProperty('_init')) {
            virtualclass.makeAppReady(virtualclass.apps.mv);
            // this.displayVideo();

        } else if (message.hasOwnProperty('offer')) {
            _createAnswer(message, fromUser);
        } else if (message.hasOwnProperty('candidate')) {
            var candidate = new RTCIceCandidate(message.candidate);
            if (message.pt == 'apc') {
                apc[fromUser].addIceCandidate(candidate, addIceCandidateSuccess, addIceCandidateError);
            } else {
                opc[fromUser].addIceCandidate(candidate, addIceCandidateSuccess, addIceCandidateError);
            }

            console.log('multivideo addIcecandidate');

        } else if (message.hasOwnProperty('answer')) {
            console.log('multivideo setRemoteDescription for' + fromUser);
            opc[fromUser].setRemoteDescription(new RTCSessionDescription(message.sdp), setRemoteDescriptionSuccess, setRemoteDescriptionError);
        }
    }

    function setRemoteDescriptionSuccess() {
        console.log('multivideo, success setRemoteDescriptionSuccess');
    }

    function setRemoteDescriptionError(error) {
        console.log('multivideo, error setRemoteDescriptionError' + error);
    }

    function handleCreateAnswerError(error) {
        console.log('multivideo, error handleCreateAnswerError' + error);
    }

    function addIceCandidateSuccess() {
        console.log('multivideo, success addIceCandidateSuccess');
    }

    function addIceCandidateError(error) {
        console.log('multivideo, error addIceCandidateError' + error);
    }

    function _createAnswer(msg, to) {
        var signal = msg;
        apc[to] = new RTCPeerConnection(pc_config);
        apc[to].onicecandidate = handleIceCandidateAnswerWrapper(to, 'opc');
        apc[to].onaddstream = handleRemoteStreamAdded(to);

        if (typeof _localStream != 'undefined') {
            apc[to].addStream(_localStream);
        } else {
            console.log('_localStream is not defined');
        }
        apc[to].setRemoteDescription(new RTCSessionDescription(signal.sdp), setRemoteDescriptionSuccess, setRemoteDescriptionError);
        console.log('multivideo, addStream and setRemoteDescription for' + to);
        apc[to].createAnswer(function (desc) {
            gotAnswerDescription(desc, to);
        }, handleCreateAnswerError);
    }

    function gotAnswerDescription(desc, to, pt) {
        apc[to].setLocalDescription(desc);
        console.log('multivideo setLocalDescription for ' + to);
        ioAdapter.sendUser({cf: 'mvid', "sdp": desc, 'answer': true}, to);

    }

    function handleIceCandidateAnswerWrapper(to, pt) {
        return function handleIceCandidate(event) {
            console.log('multivideo, STEP 7(9), handleIceCandidate event');
            if (event.candidate) {
                ioAdapter.sendUser({cf: 'mvid', 'candidate': event.candidate, pt: pt}, to);
            } else {
                console.log('multivideo, STEP 10, End of candidates.');
            }
        }
    }

    var updateActiveUsers = function () {
        var tusers = 0;
        let video;

        for (let uid in userStreams) {
            video = userStreams[uid].getVideoTracks()[0];
            var videosWrapper = document.querySelector('#vid' + uid);
            if (video != null) {
                tusers++;
                if (videosWrapper != null) {
                    videosWrapper.classList.add('vshow');
                    videosWrapper.classList.remove('vhide');
                } else {
                    console.log('Meeting mode is null');
                }

            } else {
                if (videosWrapper != null) {
                    videosWrapper.classList.add('vhide');
                    videosWrapper.classList.remove('vshow');
                } else {
                    console.log('Meeting mode is null');
                }
            }
        }

        var users = 'one';
        if (tusers > 4) {
            users = 'morethanfour';
        } else if (tusers > 2) {
            users = 'four';
        } else if (tusers > 1) {
            users = 'two';
        }


        var virtualclassCont = document.querySelector('#virtualclassCont');
        var videoConfrence = document.querySelector('#videoConfrence');
        virtualclassCont.setAttribute('data-totalUser', users);
        videoConfrence.setAttribute('data-totalUser', users);
    }

    function addRemoteVideo(stream, userid) {
        userStreams[userid] = stream;
        // var mvideo = document.querySelector('#mvideo'+userid);
        virtualclass.multiVideo.removeUser(userid);
        //remove jquery
        var $videoCont = $("<div class='videoCont remoteVideo'  id='vid" + userid + "' data-userid='" + userid + "' data-totaluser=''></div>");
        $video = $("<video  class='videoBox' autoplay></video>");
        $video.attr({"src": window.URL.createObjectURL(stream), "autoplay": "autoplay"});
        $videoCont.append($video);
        $('#videosWrapper').append($videoCont);

        virtualclass.multiVideo.updateVideoLength();
        console.log('multivideo, Remote stream added');


        $videoCont.click(
            function () {
                MultiVideo.UI.displayMainVideo(this);
            }
        );

        if (typeof updateActiveTime != 'undefined') {
            clearTimeout(updateActiveTime);
        }
        updateActiveTime = setTimeout(() => {
            updateActiveUsers();
        }, 3000);

    }


    function handleRemoteStreamAdded(from) {
        return function (event) {
            addRemoteVideo(event.stream, from);
            _remoteStream = event.stream;
        }
    }

    function _createOffer(juser) {
        opc[juser] = new RTCPeerConnection(pc_config);
        opc[juser].onicecandidate = handleIceCandidateAnswerWrapper(juser, 'apc');
        opc[juser].onaddstream = handleRemoteStreamAdded(juser)

        if (typeof _localStream != 'undefined') {
            opc[juser].addStream(_localStream);
            console.log('multivideo, Set addStream for ' + juser);
        } else {
            console.log('No _localStream  for ' + juser);
        }

        function gotOfferDescription(desc) {
            opc[juser].setLocalDescription(desc);
            console.log('multivideo, setLocalDescription with offer');
            ioAdapter.sendUser({cf: 'mvid', "sdp": desc, 'offer': true}, juser);
        }

        console.log('multivideo, Create offer for ' + juser);
        opc[juser].createOffer(function (desc) {
            gotOfferDescription(desc); // true for createOffer
        }, failureCallback);
    }

    MultiVideo.onUserJoin = function (juser) {
        /**
         * TODO remove the setTimeout
         *  Settimeout is done because, once all users are connected
         *  and one of these user does page refresh,
         *  then his/her video does not get shown at other side
         * **/
        setTimeout(() => {
            _createOffer(juser);
        }, 2000)

    }

    window.MultiVideo = MultiVideo;
})(window);