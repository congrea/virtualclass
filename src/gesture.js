/** This file is used to get the gesture from student to run audio on mobile devices ***/

var gesture = {


    initClassJoin : function (){
        var joinClassModal = document.querySelector('#joinClassModal');
        if(joinClassModal != null){
            joinClassModal.style.display = 'block';
        }
        $('#joinClassModal').modal({backdrop: 'static', keyboard: false});

        var virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
        if(virtualclassApp != null ){
            virtualclassApp.style.display =  'none';
        }

        var joinClassButton = document.querySelector('#joinClassModal .joinClasscontainer button');
        if(joinClassButton != null){
            joinClassButton.addEventListener('click', function (){
                virtualclassApp.style.display =  'block';
                joinClassModal.style.display =  'none';
                virtualclass.gObj.video.audio.initAudiocontext();
                setTimeout(
                    function () {
                        if(virtualclass.currApp == 'EditorRich'){
                            virtualclass.vutil.triggerMouseEvent(document.querySelector('.CodeMirror-scroll'), 'mousedown');
                        }
                    }, 1000
                );

                //virtualclass.gObj.video.audio.receivedAudioProcess(virtualclass.gObj.audioPlayMessage);
            });
        }
    },


    initAudioResume  : function (uid){
        var joinClassModal = document.querySelector('#joinClassModal');
        if(joinClassModal != null){
            joinClassModal.style.display = 'block';
        }
        $('#joinClassModal').modal({backdrop: 'static', keyboard: false});

        var mainbody = document.querySelector('#joinClassModal .modal-body');
        var initAudio = document.createElement('div');

        initAudio.id = 'initAudio';

        initAudio.innerHTML = "CLICK HERE TO ENABLE AUDIO";
        mainbody.appendChild(initAudio);

        mainbody.onclick = function (){
            virtualclass.gObj.video.audio.initScriptNode(uid);
            joinClassModal.style.display = 'none';
            virtualclass.gObj.requestToScriptNode = null;
        }

        var joinClass = document.querySelector('#joinClassModal .joinClasscontainer');

        if(joinClass != null){
            joinClass.style.display = 'none';
        }

    }
}