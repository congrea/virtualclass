// This file is part of google
/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 * @author(Previous) google.
  */

(
    function(window) {
        var adapter = function (){
            return {
                RTCPeerConnection : null,
                webrtcDetectedBrowser : null,
                
                init : function (navigator){
                    if (vApp.system.wbRtc.peerCon == true && vApp.system.wbRtc.userMedia == true) {
                        if (navigator.mozGetUserMedia) {
                            
                            window.webrtcDetectedBrowser = "firefox";
                            this.RTCPeerConnection = mozRTCPeerConnection;
                            this.RTCSessionDescription = mozRTCSessionDescription;
                            this.RTCIceCandidate = mozRTCIceCandidate;
                            navigator.getUserMedia = navigator.mozGetUserMedia;

                            this.attachMediaStream = function(element, stream) {
                                this.videoAdd = true;
                                console.log("Attaching media stream");
                                element.mozSrcObject = stream;
                                element.play();
                            };

                            reattachMediaStream = function(to, from) {
                                console.log("Reattaching media stream");
                                to.mozSrcObject = from.mozSrcObject;
                                to.play();
                            };

                            // Fake get{Video,Audio}Tracks
                            MediaStream.prototype.getVideoTracks = function() {
                                return [];
                            };

                            MediaStream.prototype.getAudioTracks = function() {
                                return [];
                            };

                        } else if (navigator.webkitGetUserMedia) {
//                            alert('this is for chrome');
                            console.log("This appears to be Chrome");
                            window.webrtcDetectedBrowser = "chrome";
                            this.RTCPeerConnection = webkitRTCPeerConnection;
                            this.RTCSessionDescription = RTCSessionDescription;
                            this.RTCIceCandidate = RTCIceCandidate;
                            navigator.getUserMedia = navigator.webkitGetUserMedia;

                            this.attachMediaStream = function(element, stream) {
                                element.src = window.URL.createObjectURL(stream);
                                this.videoAdd = true;
                            };

                            reattachMediaStream = function(to, from) {
                                to.src = from.src;
                            };

                            // The representation of tracks in a stream is changed in M26
                            // Unify them for earlier Chrome versions in the coexisting period
                            if (!webkitMediaStream.prototype.getVideoTracks) {
                                webkitMediaStream.prototype.getVideoTracks = function() {
                                    return this.videoTracks;
                                };
                                webkitMediaStream.prototype.getAudioTracks = function() {
                                    return this.audioTracks;
                                };
                            }

                            // New syntax of get streams method in M26
                            if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
                                webkitRTCPeerConnection.prototype.getLocalStreams = function() {
                                    return this.localStreams;
                                };
                                webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
                                    return this.remoteStreams;
                                };
                            }
                        } else {
                            console.log("Browser does not appear to be WebRTC-capable");
                        }

                    }
                    return navigator;
                }
            }
        }
        window.adapter = adapter;
    }
)(window);
