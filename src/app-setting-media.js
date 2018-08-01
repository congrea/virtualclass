(function (window, document) {

    /**
     * This is the main object which has properties and methods
     * Through this properties and methods all the front stuff is happening
     * eg:- creating, storing and replaying the objects
     */

    var appSettingMedia = function (config) {
        return {
            init: function () {
                this.type;
                this.videoElement = document.querySelector('#webRtcIoContainer video');
                this.audioInputSelect = document.querySelector('#webRtcIoContainer select#audioSource');
                this.audioOutputSelect = document.querySelector('#webRtcIoContainer select#audioOutput');
                this.videoSelect = document.querySelector('#webRtcIoContainer select#videoSource');
                this.mainVideoElement= document.querySelector('#videoHostSource');

                this.selectors = [this.audioInputSelect, this.audioOutputSelect, this.videoSelect];
                this.audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);
                navigator.mediaDevices.enumerateDevices().then(virtualclass.appSettingMedia.gotDevices).catch(virtualclass.appSettingMedia.handleError);
                this.audioInputSelect.addEventListener('change',function(){
                    virtualclass.appSettingMedia.start('audio');

                })
                this.audioOutputSelect.addEventListener('change',function(){
                    virtualclass.appSettingMedia.changeAudioDestination()
                });
                this.videoSelect.addEventListener('change',function(){
                    virtualclass.appSettingMedia.start('video');
                });
//                virtualclass.appSettingMedia.start('video');
            },
            gotDevices: function (deviceInfos) {
                var values =   virtualclass.appSettingMedia.selectors.map(function (select) {
                    return select.value;
                });
                virtualclass.appSettingMedia.selectors.forEach(function (select) {
                    while (select.firstChild) {
                        select.removeChild(select.firstChild);
                    }
                });
                for (var i = 0; i !== deviceInfos.length; ++i) {
                    var deviceInfo = deviceInfos[i];
                    var option = document.createElement('option');
                    option.value = deviceInfo.deviceId;
                    if (deviceInfo.kind === 'audioinput') {
                        option.text = deviceInfo.label ||
                            'microphone ' + (virtualclass.appSettingMedia.audioInputSelect.length + 1);
                        virtualclass.appSettingMedia.audioInputSelect.appendChild(option);
                    } else if (deviceInfo.kind === 'audiooutput') {
                        option.text = deviceInfo.label || 'speaker ' +
                            (virtualclass.appSettingMedia.audioOutputSelect.length + 1);
                        virtualclass.appSettingMedia.audioOutputSelect.appendChild(option);
                    } else if (deviceInfo.kind === 'videoinput') {
                        option.text = deviceInfo.label || 'camera ' + (virtualclass.appSettingMedia.videoSelect.length + 1);
                        virtualclass.appSettingMedia.videoSelect.appendChild(option);
                    } else {
                        console.log('Some other kind of source/device: ', deviceInfo);
                    }
                }
                virtualclass.appSettingMedia.selectors.forEach(function (select, selectorIndex) {
                    if (Array.prototype.slice.call(select.childNodes).some(function (n) {
                            return n.value === values[selectorIndex];
                        })) {
                        select.value = values[selectorIndex];
                    }
                });
            },
            // Attach audio output device to video element using device/sink ID.

            attachSinkId: function (element, sinkId) {
                if (typeof element.sinkId !== 'undefined') {
                    element.setSinkId(sinkId)

                        .then(function () {
                            console.log('Success, audio output device attached: ' + sinkId);
                        })
                        .catch(function (error) {
                            var errorMessage = error;
                            if (error.name === 'SecurityError') {
                                errorMessage = 'You need to use HTTPS for selecting audio output ' +
                                    'device: ' + error;
                            }
                            console.error(errorMessage);
                            // Jump back to first output device in the list as it's the default.
                            virtualclass.appSettingMedia.audioOutputSelect.selectedIndex = 0;
                        });
                } else {
                    console.warn('Browser does not support output device selection.');
                }
            },
            changeAudioDestination: function () {
                var audioDestination = virtualclass.appSettingMedia.audioOutputSelect.value;
                virtualclass.appSettingMedia.attachSinkId(virtualclass.appSettingMedia.videoElement, audioDestination);
            },
            gotStream: function (stream) {
                window.stream = stream; // make stream available to console
                virtualclass.appSettingMedia.videoElement.srcObject = stream;
                if(roles.hasAdmin()){
                    // Element to contain teacher Video
                    virtualclass.appSettingMedia.mainVideoElement.srcObject = stream;
                }
                var mysmallVideo =  document.querySelector('#ml' + virtualclass.gObj.uid + ' video');
                if(mysmallVideo != null){
                    mysmallVideo.srcObject = stream;
                }

                virtualclass.gObj.video.stream = stream;
                virtualclass.gObj.video.audio._manuPulateStream();

                return navigator.mediaDevices.enumerateDevices();
            },
            start:function(type) {
                this.type = type;
                if (window.stream) {
                    window.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }

                var audioSource = virtualclass.appSettingMedia.audioInputSelect.value;
                var videoSource = virtualclass.appSettingMedia.videoSelect.value;
                var constraints = {};

                constraints.video = {};
                constraints.video.deviceId =  videoSource ? {exact: videoSource} : undefined;

                if(type == 'video'){
                    constraints.audio = true;
                    var e = document.getElementById("audioSource");
                    var audioSource = e.options[e.selectedIndex].value;
                    if(audioSource != null){
                        constraints.audio = {deviceId: audioSource ? {exact: audioSource} : undefined};
                    }
                } else {
                    constraints.audio = {deviceId: audioSource ? {exact: audioSource} : undefined};
                }

                var congreaVideoSettingCont = document.querySelector('#congreaVideoSettingCont');
                congreaVideoSettingCont.dataset.settingType = type;

                navigator.mediaDevices.getUserMedia(constraints).then(virtualclass.appSettingMedia.gotStream).then(virtualclass.appSettingMedia.gotDevices).catch(virtualclass.appSettingMedia.handleError);

            },
            handleError:function(error) {
                console.log('navigator.getUserMedia error: ', error);
             }


        }
    };
    window.appSettingMedia = appSettingMedia();
})(window, document);
