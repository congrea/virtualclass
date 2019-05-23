let recordSettings = {
    enableRecording : false,
    allowPresenterAV : false,
    disableAttendeeAV : false,
    allowAttendeeAV : false,
    audioVideo : true,
    show : false,
    init () {
         this.enableRecording   =  +(wbUser.recordSettings.enableRecording);

         if(roles.hasControls()){
             this.allowPresenterAV  =  +(wbUser.recordSettings.allowPresenterAV);
         }else {
             this.disableAttendeeAV =  +(wbUser.recordSettings.disableAttendeeAV);
             this.allowAttendeeAV =    +(wbUser.recordSettings.allowAttendeeAV);
             this.show =    +(wbUser.recordSettings.show);
         }

         this.showStatus = this.showStatus();
         let recording = document.getElementById('recording');

         if(this.showStatus){
             recording.classList.remove('hide');
             recording.classList.add('show');
             recording.dataset.recording = "on";
             this.attachHandler(recording);

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
            return (this.enableRecording && this.allowPresenterAV);
        } else {
            return (!this.disableAttendeeAV && this.allowAttendeeAV && this.show);
        }
    },

    isRecordingOn () {
        if(roles.hasControls()){
            return (this.enableRecording && this.allowPresenterAV && this.audioVideo);
        } else {
            if(!this.disableAttendeeAV){
                if(this.allowAttendeeAV ){
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