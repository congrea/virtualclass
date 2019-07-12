/** This file is used to get the gesture from student to run audio on mobile devices ** */

const gesture = {
  initClassJoin() {
    return;
    const joinClassModal = document.querySelector('#joinClassModal');
    if (joinClassModal != null) {
      joinClassModal.style.display = 'block';
    }
    // $('#joinClassModal').modal({backdrop: 'static', keyboard: false});
    const joinClass = document.querySelector('#joinClassModal');
    joinClass.className = 'modal in';

    const virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
    if (virtualclassApp != null) {
      virtualclassApp.style.display = 'none';
    }
    const joinClassButton = document.querySelector('#joinClassModal .joinClasscontainer button');
    if (joinClassModal) {
      joinClassModal.addEventListener('click', () => {
        joinClassButton.focus();
      });
    }
    this.classJoin = true;
  },

  attachHandler() {
    const joinClassButton = document.querySelector('#joinClassModal .joinClasscontainer button');
    joinClassButton.focus();
    if (joinClassButton != null) {
      joinClassButton.addEventListener('click', () => {
        virtualclass.gesture.clickToContinue();
      });

      joinClassButton.addEventListener('keydown', (event) => {
        event.preventDefault();
        if (event.keyCode == 13) {
          virtualclass.gesture.clickToContinue();
        }
      });
    }
  },

  clickToContinue() {
    const virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
    const joinClassModal = document.querySelector('#joinClassModal');

    virtualclassApp.style.display = 'block';
    joinClassModal.style.display = 'none';
    // virtualclass.media.audioVisual.init();
    virtualclass.media.audio.initAudiocontext();

    /* User does not to click on editor to view the written text */
    virtualclass.vutil.triggerMouseEvent(document.querySelector('.CodeMirror-scroll'), 'mousedown');
    // virtualclass.media.audio.receivedAudioProcess(virtualclass.gObj.audioPlayMessage);
  },


  initAudioResume(uid) {
    const joinClassModal = document.querySelector('#joinClassModal');

    if (joinClassModal !== null) {
      joinClassModal.style.display = 'block';
    }

    virtualclass.modal.show('#joinClassModal');
    if (document.getElementById('initAudio') === null) {
      const mainbody = document.querySelector('#joinClassModal .modal-body');
      const initAudio = document.createElement('div');
      initAudio.id = 'initAudio';
      initAudio.innerHTML = virtualclass.lang.getString('clickheretoplay');
      mainbody.appendChild(initAudio);

      mainbody.onclick = function () {
        virtualclass.media.audio.initScriptNode(uid);
        joinClassModal.style.display = 'none';
        virtualclass.gObj.requestToScriptNode = null;
      };
    }


    const joinClass = document.querySelector('#joinClassModal .joinClasscontainer');
    if (joinClass !== null) {
      joinClass.style.display = 'none';
    }
  },
};
