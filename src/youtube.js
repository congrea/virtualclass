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
                player : '',
                init : function (videoId, user){
                    this.UI.container();
                    
                    if(typeof user != 'undefined' && user ==  'student'){
                       this.onYTIframApi(videoId); 
                    } else {
                        this.UI.inputURL();
                    }
                },
                
                UI : {
                   id : 'vAppYts', 
                   class : 'vmApp',
                   container : function (){
                       if(document.getElementById(this.id) ==  null){
                        var divYts = document.createElement('div');
                        divYts.id = this.id;
                        divYts.className = this.class;
                        
                        var divPlayer = document.createElement('div');
                        divPlayer.id = "player";
                        divYts.appendChild(divPlayer);
                        
                        var beforeAppend = document.getElementById(vApp.rWidgetConfig.id);
                        document.getElementById(vApp.html.id).insertBefore(divYts, beforeAppend);
                        
                       }
                   },
                   
                   inputURL : function (){
                       if(document.getElementById('youtubeUrlContainer') == null){
                            var uiContainer = document.createElement('div');
                            uiContainer.id = "youtubeUrlContainer";

                            var input = document.createElement("input");
                            input.id = "youtubeurl";
                            input.cols = 70;
                            input.rows = 3;
                            var tnode = document.createTextNode("Please paste here youtube url");
                            input.appendChild(tnode);
                            document.getElementById('vAppYts').appendChild(input);

                            uiContainer.appendChild(input);

                            var submitURL = document.createElement('button');
                            submitURL.id = 'submitURL';
                            submitURL.innerHTML = "Share Video";

                            uiContainer.appendChild(submitURL);
                            
                            var ytsCont = document.getElementById('vAppYts');
                            ytsCont.appendChild(uiContainer);
                            
//                            var divPlayer = document.createElement('div');
//                            divPlayer.id = "player";
//                            ytsCont.appendChild(divPlayer);
                            
                            //var that = this;

                            //for teachers
                            submitURL.addEventListener('click', function (){

                                var videourl = document.getElementById('youtubeurl').value;
                                var videoId = vApp.yts.getVideoId(videourl);
                                
                                if(typeof videoId == 'boolean'){
                                    alert('Invalid YouTube URL.');
                                    return;
                                }
                                
                                
                                vApp.yts.onYTIframApi(videoId);
                                io.send({'yts' : {'init' : videoId}});
                            });
                       }
                   }
                   
                },
               
                getVideoId  : function (url){
                    var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
                    var m = url.match(rx);
                    if (m != null && m.length > 1){
                        var r = m[1].substring(0, 11);
                        if (r.length == 11) {
                            return r;
                        }
                    }
                    return false;
                },
                
                onmessage : function (msg){
                   if(typeof msg.yts == 'string'){
                        if(msg.yts == 'play') {
                            this.player.playVideo();
                        } else if(msg.yts == 'pause') {
                            this.player.pauseVideo();
                        } else if(msg.yts == 'mute'){
                            this.player.mute();
                        }  else if(msg.yts == 'unmute'){
                           this.player.unMute();
                        }
                   } else {
                        if(msg.yts.hasOwnProperty('init')){
                            this.init(msg.yts.init, 'student');
                            document.getElementById('vAppWhiteboard').style.display = 'none';
                            document.getElementById('vAppYts').style.display = 'block';
                        }else{
                            var seekToNum = parseInt(msg.yts.seekto, 10);
                            this.player.seekTo(seekToNum);
                        }
                   } 
                },

                onYTIframApi : function (videoId){
                    if(typeof this.player == 'object'){
                        this.player.loadVideoById(videoId);
                    } else{
                        this.player = new YT.Player('player', {
                            height: '390',
                            width: '640',
                            videoId: videoId,
                            autohide : 0,
                            disablekb : 1,
                            enablejsapi : 1,
                            modestbranding : 1,
                            autoplay : 0,
                            events: {
                                'onReady': this.onPlayerReady
                            }
                        });
                    }
                },

               triggerOnSeekChange :  function () {
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

                        if ((this.player.getPlayerState() != PLState) && this.player.getPlayerState() != 3)  {
                            this.ytOnChange(this.player.getPlayerState());
                            PLState = this.player.getPlayerState();
                        }

                        if (this.player.isMuted() != PSmute) {
                            this.ytOnMuted(this.player.isMuted());
                            PSmute = this.player.isMuted();
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
                    event.target.playVideo();
                    vApp.yts.player.unMute();
                    vApp.yts.player.setVolume(40);
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
