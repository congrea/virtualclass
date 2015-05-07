// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window, document) {
        var io = window.io;
        var i = 0;
        /**
         * This is the main object which has properties and methods
         * Through this properties and methods all the front stuff is happening
         * eg:- creating, storing and replaying the objects 
         */
        
        var yts  = function (config) { 
            var player;
            var CTpre= 0, PLState = -2, PSmute = -1;
            
            return {
                init : function (user){
                    //for students
                    if(typeof user != 'undefined' && user ==  'student'){
                       this.onYTIframApi(); 
                    } else {
                        var uiContainer = document.createElement('div');
                        uiContainer.id = "youtubeUrlContainer";

                        var textArea = document.createElement("TEXTAREA");
                        textArea.cols = 70;
                        textArea.rows = 3;
                        var tnode = document.createTextNode("Please paste here youtube url");
                        textArea.appendChild(tnode);
                        document.getElementById('vAppYts').appendChild(textArea);

                        uiContainer.appendChild(textArea);

                        var submitURL = document.crateElement('button');
                        submitURL.id = 'submitURL';

                        uiContainer.appendChild(submitURL);
                        
                        var that = this;
                        //for teachers
                        submitURL.addEventListener('click', function (){
                            var videourl = this.value;
                            
                            var videoId = that.getVideoId(videourl);
                            
                            that.onYTIframApi(videoId);
                            io.send({'yts' : 'init'});

                        });
                    }
                },
                
                getVideoId  : function (url){
                    var video_id = window.location.search.split('v=')[1];
                    var ampersandPosition = video_id.indexOf('&');
                    if(ampersandPosition != -1) {
                      video_id = video_id.substring(0, ampersandPosition);
                    }  
                    return video_id;
                },
                
                
                onmessage : function (msg){
                   if(typeof msg.yts == 'string'){
                       if(msg.yts == 'init'){
                            document.getElementById('vAppWhiteboard').style.display = 'none';
                            document.getElementById('vAppYts').style.display = 'block';
                            this.init('student');
                        } else if(msg.yts == 'play') {
                            player.playVideo();
                        } else if(msg.yts == 'pause') {
                            player.pauseVideo();
                        } else if(msg.yts == 'mute'){
                            player.mute();
                        }  else if(msg.yts == 'unmute'){
                           player.unMute();
                        }
                   } else {
                        var seekToNum = parseInt(msg.yts.seekto, 10);
                        player.seekTo(seekToNum);
                   } 
                },

                onYTIframApi : function (videoId){
                    player = new YT.Player('player', {
                        height: '390',
                        width: '640',
                        videoId: 'M7lc1UVf-VE',
                        autohide : 0,
                        disablekb : 1,
                        enablejsapi : 1,
                        modestbranding : 1,
                        autoplay : 0,

                        events: {
                            'onReady': this.onPlayerReady
                        }
                    });
                },

               triggerOnSeekChange :  function () {
                    console.log('there should happend something after each 2 second');
                    if (CTpre == 0 || PLState == -2 || PSmute == -1) {
                        CTpre = player.getCurrentTime();
                        PLState = player.getPlayerState();
                        PSmute = player.isMuted();
                    } else {
                        var difftime = Math.abs(player.getCurrentTime() - CTpre);
                        CTpre = player.getCurrentTime();

                        if (difftime > 4) {
                            this.ytOnSeek(player.getCurrentTime());
                        }

                        if ((player.getPlayerState() != PLState) && player.getPlayerState() != 3)  {
                            this.ytOnChange(player.getPlayerState());
                            PLState = player.getPlayerState();
                        }

                        if (player.isMuted() != PSmute) {
                            this.ytOnMuted(player.isMuted());
                            PSmute = player.isMuted();
                        }

                    }
                },

                ytOnMuted : function  (muted) {
                    if(muted){
                        io.send({'yts' : 'mute'});
                    }else{
                        io.send({'yts' : 'unmute'});
                    }
                    
                    
                    console.log('MUTED '+muted);
                },

             // seekto is video in seconds
                ytOnSeek  : function (seekto) {
                    io.send({'yts' : {'seekto' : seekto}});
                    console.log('SEEK CHANGED '+seekto);
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
                ytOnChange : function  (state) {
                    console.log('STATE CHANGED '+state);
                    if(state == 1){
                        io.send({'yts' : 'play'});
                    } else if(state == 2) { 
                        io.send({'yts' : 'pause'});
                    }
                }, 

                onPlayerReady : function (event) {
                    var that = this;
                    event.target.playVideo();
                    player.unMute();
                    player.setVolume(40);
                    setInterval(
                        function (){
                            vApp.yts.triggerOnSeekChange();
                        }
                    , 2000);
                }
            }
    }
    window.yts = yts;
})(window, document);
