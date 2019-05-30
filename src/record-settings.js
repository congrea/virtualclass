let sessionSetting  = {
    enableRecording : true,

    recAllowpresentorAVcontrol : true,
    recShowPresentorRecordingStatus : true,

    recDisableAttendeeAV : false,

    recallowattendeeAVcontrol : true,
    showAttendeeRecordingStatus : true,
    trimRecordings : true
}


let recordSettings = {
    enableRecording : false,
    allowpresentorAVcontrol : false,
    disableAttendeeAV : false,
    allowattendeeAVcontrol : false,
    audioVideo : true,
    statusOnly : false,
    trimRecordings : false,
    allowattendeeAVcontrolByTeacher : false,

    init () {
         this.enableRecording   =  sessionSetting.enableRecording;
         if(roles.hasControls()){
             this.allowpresentorAVcontrol  =  sessionSetting.recAllowpresentorAVcontrol;
             this.showPresentorRecordingStatus = (this.allowpresentorAVcontrol) ? true :  sessionSetting.recShowPresentorRecordingStatus;
         }else {
             this.disableAttendeeAV =  sessionSetting.disableAttendeeAV;
             this.allowattendeeAVcontrol = sessionSetting.recallowattendeeAVcontrol;
             this.showAttendeeRecordingStatus = (this.allowattendeeAVcontrol) ? true :  sessionSetting.showAttendeeRecordingStatus;
         }

         this.trimRecordings =  sessionSetting.trimRecordings;

         this.showStatus = this.showStatus();
         this.showButton();
         this.overrideSettingFromLocalStorage();
    },

    overrideSettingFromLocalStorage () {
        let setting = localStorage.getItem('recsetting');
        if(setting !== null && setting !== undefined){
            setting  = JSON.parse(setting);
            if(roles.hasControls() || setting.statusonly !== true){
                this.updateSettingAV(false);
            }else {
                this.onMessage({ac : false});
            }
        }
    },

    showButton () {
        let recording = document.getElementById('recording');
        if(this.showStatus){
            recording.classList.remove('hide');
            recording.classList.add('show');
            virtualclassCont.dataset.recording = "on";
            if(!this.statusOnly){
                this.attachHandler(recording);
            }else {
                recording.classList.add('statusonly');
            }
            if(this.trimRecordings){
                recording.classList.add('trimRecording');
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
            recButton.innerHTML = "Recording";
            virtualclassCont.dataset.recording = "on";
            recElem.setAttribute('data-title','Recording Started');
            localStorage.removeItem('recsetting');
            if(virtualclass.currApp === 'ScreenShare' && virtualclass.ss != null){
                virtualclass.ss.initShareScreen('ss', 500);
            }
        }else {
            if(roles.hasControls() && this.trimRecordings){
                // recButton.innerHTML = "Start Recording";
                recElem.setAttribute('data-title','Recording Stopped');
            }else{
                recElem.setAttribute('data-title','Recording Stopped');
            }
            virtualclassCont.dataset.recording = "off";

            localStorage.setItem('recsetting', JSON.stringify({statusonly: this.statusOnly, rec : virtualclassCont.dataset.recording}));
        }

        ioAdapter.setRecording();




    },

    recordingButtonAction (elem) {
        if(!elem.classList.contains('statusonly')){
            let recordSetting;
            if(virtualclassCont.dataset.recording === 'off'){
                recordSetting = true;
                this.updateSettingAV(recordSetting);
            } else {
                recordSetting = false;
                this.updateSettingAV(recordSetting);
            }

            if(roles.hasControls()){
                ioAdapter.mustSend({ac : recordSetting, 'cf': 'recs'});
            }
        } else {
            console.log(" Do nothing");
        }
    },

    showStatus (){
        if(roles.hasControls()){
            if(this.enableRecording && this.allowpresentorAVcontrol && this.showPresentorRecordingStatus){
                return true;
            }else if(this.enableRecording && !this.allowpresentorAVcontrol && this.showPresentorRecordingStatus){
                this.statusOnly = true;
                return true
            }
            return false;
        } else {

            if(this.enableRecording && !this.disableAttendeeAV && this.allowattendeeAVcontrol && this.showAttendeeRecordingStatus){
                return true;
            }else if(this.enableRecording && !this.disableAttendeeAV && !this.allowpresentorAVcontrol && this.showAttendeeRecordingStatus){
                this.statusOnly = true;
                return true;
            }
            return false;
        }
    },

    isRecordingOn () {
        if(roles.hasControls()){
            return (this.enableRecording && this.allowpresentorAVcontrol && this.audioVideo);
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
        return (this.isRecordingOn() ? "yes" : "no");
    },

    setStatusOnElement () {
        let recording = document.querySelector("#recording");
        if(this.allowattendeeAVcontrolByTeacher){
            recording.classList.add('statusonly');
            this.statusOnly = true;
        }else {
            recording.classList.remove('statusonly');
            this.statusOnly = false;
        }
    },

    onMessage (message) {
        if(message.ac == false){
            this.allowattendeeAVcontrolByTeacher = true;
        }else {
            this.allowattendeeAVcontrolByTeacher = false;
        }
        this.setStatusOnElement();
        this.updateSettingAV(message.ac);
    }
};