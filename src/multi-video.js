// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2017  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  // var meeting = window.meeting
  userStreams = {};
  var MultiVideo = {
    init: function () {

      this.UI.container();
      this.start();
      var videosWrapper = document.querySelector('#videosWrapper .videoCont.selfVideo');
      videosWrapper.setAttribute('data-userid', virtualclass.gObj.uid);
      var that = this;
      userStreams[virtualclass.gObj.uid] = virtualclass.multiVideo.localStream;
      videosWrapper.addEventListener('click', function (){
          that.UI.displayMainVideo(this);
      });

      this.updateVideoLength();
      var tag = document.querySelector('#speakerPressOnce');

      virtualclass.vutil.audioStatus(tag, "true");
      var videoSwitch = localStorage.getItem('videoSwitch')
      if(videoSwitch != null){
          if(videoSwitch == '0'){
              virtualclass.multiVideo.disableVideo();
          }
      }
    },

    _init : function (){
      var mvideo = document.querySelector('#videosWrapper .videoCont.selfVideo');
      this.UI.displayMainVideo(mvideo);

      var that = this;
      // todo handle in proper way
      setTimeout(
        function (){
          that.displayVideo();
          if(roles.hasControls()){
            var data={cf : 'mvid',  '_init' : true}
            ioAdapter.mustSend(data);
          }
        },2000
      );
    },


    displayVideo : function (){
      var multiVideo  = document.querySelector('#virtualclassMultiVideo');
      multiVideo.style.display = 'block';
    },

   start: function() {
        console.log('Video First, multivideo');

        virtualclass.multiVideo.localStream = virtualclass.gObj.video.video.tempStream;

        _localStream = virtualclass.multiVideo.localStream;
        console.log('multivideo, add get user media ');
        selfView =  document.querySelector('#videoConfrence .multilocalVideo');
        // selfView.src = URL.createObjectURL(virtualclass.multiVideo.localStream);

       virtualclass.adpt.attachMediaStream(selfView, virtualclass.multiVideo.localStream);
        this.initDone = true;
    },

    UI : {
      container : function() {
        var videoWrapper = document.querySelector('#virtualclassMultiVideo');
        if(videoWrapper == null){
          var template=virtualclass.getTemplate("multiVideoMain");
          $('#virtualclassAppLeftPanel').append(template());
        }
      },

       displayMainVideoOld : function (element){
          var videoElem = element.firstElementChild;
          if(virtualclass.currApp == 'MultiVideo'){
              var canvas = document.querySelector('#multiVidSelected');
              var ctx = canvas.getContext('2d');
              if(typeof earlierVideo != 'undefined'){
                  clearInterval(earlierVideo);
              }

              earlierVideo = setInterval(
                  function (){
                      ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
                  }, 28 //35 frame per second
              );
          }
       },

       displayMainVideo : function (element){
           if(virtualclass.currApp == 'MultiVideo'){
               var video = document.querySelector('#multiVidSelected');
               var userid = element.dataset.userid;
               virtualclass.adpt.attachMediaStream(video, userStreams[userid]);
           }
       }
     },

    removeUser : function (userId){
        var mvideo = document.querySelector('#videosWrapper .videoCont[data-userid="'+userId + '"]');
        if(mvideo != null){
            mvideo.parentNode.removeChild(mvideo);
        }
        // delete userStreams[userId];
    },

    onUserRemove : function (userId){
      this.removeUser(userId);
      this.updateVideoLength();
      // delete userStreams[userId];
    },

    updateVideoLength : function (){
        var allVideos = document.querySelectorAll('#videoConfrence .videoCont');
        var videoConfrence = document.querySelector('#videoConfrence');
        if(allVideos.length > 4){
            var users = 'morethanfour';
        } else if(allVideos.length > 2) {
            var users = 'four';
        } else if(allVideos.length > 1)  {
            var users = 'two';
        }else {
            var users = 'one';
        }
        videoConfrence.setAttribute('data-totalUser', users);
    },

    disableAudio : function (){
        var audioTracks = virtualclass.multiVideo.localStream.getAudioTracks();
        if (audioTracks.length === 0) {
            console.log("No local audio available.");
            return;
        }

        for (var i = 0; i < audioTracks.length; ++i) {
            audioTracks[i].enabled = !audioTracks[i].enabled;
        }
    },

    disableVideo : function (){
        var videoTracks = virtualclass.multiVideo.localStream.getVideoTracks();
        if (videoTracks.length === 0) {
            console.log("No local video available.");
            return;
        }
        console.log("Toggling video mute state.");
        for (var i = 0; i < videoTracks.length; ++i) {
            videoTracks[i].enabled = !videoTracks[i].enabled;
        }
        // this.pcClient_.sendCallstatsEvents(videoTracks[0].enabled ? "videoResume" : "videoPause");
        // trace("Video " + (videoTracks[0].enabled ? "unmuted." : "muted."));

    },

  };

  var apc = {};
  var opc = {};

  var pc;
  var pc_config = window.webrtcDetectedBrowser === 'firefox' ?
    {'iceServers': [{'url': 'stun:23.21.150.121'}]} : // number IP
    {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

  var pc_constraints = {
    'optional': [
      {'DtlsSrtpKeyAgreement': true},
      {'RtpDataChannels': true}
    ]};


  function failureCallback(error){
    console.log('multivideo, ' + error);
  }

  MultiVideo.onmessage = function (message, fromUser){
    if(message.hasOwnProperty('_init')){
       virtualclass.makeAppReady(virtualclass.apps[10]);
      // this.displayVideo();

    }else if(message.hasOwnProperty('offer')){
      _createAnswer(message, fromUser);
    }else if (message.hasOwnProperty('candidate')) {
      var candidate = new RTCIceCandidate(message.candidate);
      if(message.pt == 'apc'){
        apc[fromUser].addIceCandidate(candidate, addIceCandidateSuccess, addIceCandidateError);
      }else {
        opc[fromUser].addIceCandidate(candidate, addIceCandidateSuccess, addIceCandidateError);
      }

      console.log('multivideo addIcecandidate');

    }else if(message.hasOwnProperty('answer')){
      console.log('multivideo setRemoteDescription for' + fromUser);
      opc[fromUser].setRemoteDescription(new RTCSessionDescription(message.sdp), setRemoteDescriptionSuccess, setRemoteDescriptionError);
    }
  }

  function setRemoteDescriptionSuccess() { console.log('multivideo, success setRemoteDescriptionSuccess');}
  function setRemoteDescriptionError(error) { console.log('multivideo, error setRemoteDescriptionError'+ error);}
  function handleCreateAnswerError(error) { console.log('multivideo, error handleCreateAnswerError'+ error);}
  function addIceCandidateSuccess() {console.log('multivideo, success addIceCandidateSuccess');}
  function addIceCandidateError(error) {console.log('multivideo, error addIceCandidateError' + error);}

  function _createAnswer(msg, to){
    var signal = msg;
    apc[to] = new RTCPeerConnection(pc_config);
    apc[to].onicecandidate = handleIceCandidateAnswerWrapper(to, 'opc');
    apc[to].onaddstream = handleRemoteStreamAdded(to);
    apc[to].addStream(_localStream);
    apc[to].setRemoteDescription(new RTCSessionDescription(signal.sdp), setRemoteDescriptionSuccess, setRemoteDescriptionError);
    console.log('multivideo, addStream and setRemoteDescription for' + to);
    apc[to].createAnswer(function (desc){
      gotAnswerDescription(desc, to);
    }, handleCreateAnswerError);
  }

  function gotAnswerDescription (desc, to, pt){
    apc[to].setLocalDescription(desc);
    console.log('multivideo setLocalDescription for ' + to);
    ioAdapter.sendUser({cf : 'mvid', "sdp": desc, 'answer' : true}, to);

  }

  function handleIceCandidateAnswerWrapper(to, pt){
    return function handleIceCandidate(event) {
      console.log('multivideo, STEP 7(9), handleIceCandidate event');
      if (event.candidate) {
        ioAdapter.sendUser({cf : 'mvid', 'candidate': event.candidate, pt : pt}, to);
      } else {
        console.log('multivideo, STEP 10, End of candidates.');
      }
    }
  }

  function addRemoteVideo(stream, userid){
    userStreams[userid] = stream;
    // var mvideo = document.querySelector('#mvideo'+userid);
    virtualclass.multiVideo.removeUser(userid);

    var $videoCont = $("<div class='videoCont remoteVideo' data-userid='"+userid+"' data-totaluser=''></div>");
    $video = $("<video  class='videoBox' autoplay></video>");
    $video.attr({"src": window.URL.createObjectURL(stream), "autoplay": "autoplay"});
    $videoCont.append($video);
    $('#videosWrapper').append($videoCont);

    virtualclass.multiVideo.updateVideoLength();
    console.log('multivideo, Remote stream added');


    $videoCont.click(
        function (){
            MultiVideo.UI.displayMainVideo(this);
        }
    );

  }

  function handleRemoteStreamAdded(from) {
    return function(event) {
      addRemoteVideo(event.stream, from);
      _remoteStream = event.stream;
    }
  }

  function _createOffer (juser){
    opc[juser] = new RTCPeerConnection(pc_config);
    opc[juser].onicecandidate = handleIceCandidateAnswerWrapper(juser, 'apc');
    opc[juser].onaddstream = handleRemoteStreamAdded(juser)
    opc[juser].addStream(_localStream);
    console.log('multivideo, Set addStream for ' + juser);

    function gotOfferDescription(desc) {
      opc[juser].setLocalDescription(desc);
      console.log('multivideo, setLocalDescription with offer');
      ioAdapter.sendUser({cf : 'mvid', "sdp": desc, 'offer' : true}, juser);
    }

    console.log('multivideo, Create offer for ' + juser);
    opc[juser].createOffer(function (desc){
      gotOfferDescription(desc); // true for createOffer
    }, failureCallback);
  }

  MultiVideo.onUserJoin = function (juser) {
    _createOffer(juser);
  }

  window.MultiVideo = MultiVideo;
})(window);