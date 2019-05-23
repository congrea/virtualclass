let sessionSetting  = {
    enableRecording : true,

    recAllowpresentorAVcontrol : false,
    recShowPresentorRecordingStatus : true,

    recDisableAttendeeAV : false,
    recallowattendeeAVcontrol : true,

    showAttendeeRecordingStatus : false,
    trimRecordings : false
}


let recordSettings = {
    enableRecording : false,
    allowpresentorAVcontrol : false,
    disableAttendeeAV : false,
    allowattendeeAVcontrol : false,
    audioVideo : true,
    statusOnly : false,
    trimRecordings : false,

    init () {
         this.enablerecording   =  sessionSetting.enableRecording;
         if(roles.hasControls()){
             this.trimRecordings  = false;
             this.allowpresentorAVcontrol  =  sessionSetting.recAllowpresentorAVcontrol;
             this.showPresentorRecordingStatus = sessionSetting.recShowPresentorRecordingStatus;
         }else {
             this.disableAttendeeAV =  sessionSetting.disableAttendeeAV;
             this.allowattendeeAVcontrol = sessionSetting.recallowattendeeAVcontrol;
             this.showAttendeeRecordingStatus = sessionSetting.showAttendeeRecordingStatus;
         }

         this.showStatus = this.showStatus();
         this.showButton();
    },

    showButton () {
        let recording = document.getElementById('recording');

        if(this.showStatus){
            recording.classList.remove('hide');
            recording.classList.add('show');
            recording.dataset.recording = "on";
            if(!this.statusOnly){
                this.attachHandler(recording);
            }else {
                recording.classList.add('statusonly');
            }
        } else {
            recording.classList.remove('show');
            recording.classList.add('hide');
        }
    },

    attachHandler (recording) {
        recording.addEventListener('click', this.recordingButtonAction.bind(this, recording))
    },

    updateSettingAV (setting){
        let recElem = document.querySelector("#recording");
        let recButton = document.querySelector("#recording .recordingText");

        this.audioVideo = setting;

        if(this.audioVideo){
            recButton.innerHTML = "Rec";
            recElem.dataset.recording = "on";
        }else {
            recButton.innerHTML = "Rec off";
            recElem.dataset.recording = "off";
        }
        ioAdapter.setRecording();
    },

    recordingButtonAction (elem) {
        if(!elem.classList.contains('statusonly')){
            if(elem.dataset.recording == 'off'){
                this.updateSettingAV(true);
            } else {
                this.updateSettingAV(false);
            }
        } else {
            console.log(" Do nothing");
        }
    },

    showStatus (){
        if(roles.hasControls()){
            if(this.enablerecording && this.allowpresentorAVcontrol){
                return true;
            }else if(this.enablerecording && !this.allowpresentorAVcontrol && this.showPresentorRecordingStatus){
                this.statusOnly = true;
                return true
            }
            return false;
        } else {
            if(!this.disableAttendeeAV && this.allowattendeeAVcontrol){
                return true;
            }else if(!this.disableAttendeeAV && this.showAttendeeRecordingStatus){
                this.statusOnly = true;
                return true;
            }
            return false;
        }
    },

    isRecordingOn () {
        if(roles.hasControls()){
            return (this.enablerecording && this.allowpresentorAVcontrol && this.audioVideo);
        } else {
            if(!this.disableAttendeeAV){
                if(this.allowattendeeAVcontrol ){
                    return this.audioVideo;
                }
               return true;
            }
            return false;
        }
    },

    sendYesOrNo (){
        if(this.isRecordingOn()){
            return "Yes";
        }else {
            return "No";
        }
    }
};