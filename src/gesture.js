/** This file is used to get the gesture from student to run audio on mobile devices ***/

var gesture = {
    initClassJoin : function (){
        return;
        var joinClassModal = document.querySelector('#joinClassModal');
        if(joinClassModal != null){
            joinClassModal.style.display = 'block';
        }
       //$('#joinClassModal').modal({backdrop: 'static', keyboard: false});
        var joinClass = document.querySelector('#joinClassModal');
        joinClass.className= "modal in";

        var virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
        if(virtualclassApp != null ){
            virtualclassApp.style.display =  'none';
        }

        if(joinClassModal){
            joinClassModal.addEventListener('click', function (){
                joinClassButton.focus();
            });
        }

        var joinClassButton = document.querySelector('#joinClassModal .joinClasscontainer button');
        joinClassButton.focus();
        if(joinClassButton != null){
            joinClassButton.addEventListener('click', function (){
                virtualclass.gesture.clickToContinue();
            });

            joinClassButton.addEventListener('keydown', function (event){
                event.preventDefault();
                if(event.keyCode == 13) {
                    virtualclass.gesture.clickToContinue();
                }
            });
        }
    },

    clickToContinue : function(){
        var virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
        var joinClassModal = document.querySelector('#joinClassModal');

        virtualclassApp.style.display = 'block';
        joinClassModal.style.display = 'none';
       // virtualclass.media.audioVisual.init();
        virtualclass.media.audio.initAudiocontext();

        /* User does not to click on editor to view the written text */
        virtualclass.vutil.triggerMouseEvent(document.querySelector('.CodeMirror-scroll'), 'mousedown');
        //virtualclass.media.audio.receivedAudioProcess(virtualclass.gObj.audioPlayMessage);
    },


    initAudioResume  : function (uid){
        var joinClassModal = document.querySelector('#joinClassModal');

        if(joinClassModal != null){
            joinClassModal.style.display = 'block';
        }

        virtualclass.modal.show('#joinClassModal');

        // $('#joinClassModal').modal({backdrop: 'static', keyboard: false});

        var mainbody = document.querySelector('#joinClassModal .modal-body');
        var initAudio = document.createElement('div');

        initAudio.id = 'initAudio';

        initAudio.innerHTML = "CLICK HERE TO ENABLE AUDIO";
        mainbody.appendChild(initAudio);

        mainbody.onclick = function (){
            virtualclass.media.audio.initScriptNode(uid);
            joinClassModal.style.display = 'none';
            virtualclass.gObj.requestToScriptNode = null;
        }

        var joinClass = document.querySelector('#joinClassModal .joinClasscontainer');

        if(joinClass != null){
            joinClass.style.display = 'none';
        }

    }
}