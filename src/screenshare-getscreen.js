/*
 * Executed when the virtual class is loaded
 * Provides an interaction  with desktop selector
 * messege is posted to desktop selector and and desktop selector
 * performes the task and posts a message back on receiving the message.
 * initializes user's screen and recorders
 * Todo, following file should be deleted in future,
 * as there is no need of extension to share the screen
 */
window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) {
    return;
  }
  if (event.data.type === 'gotScreen') {
    // delete window.shouldChromExtInstall;
    let constraints;
    if (event.data.sourceId === '') { // user canceled
      virtualclass.vutil.beforeSend({ sd: true, cf: 'colorIndicator' });
      const error = new Error('NavigatorUserMediaError');
      error.name = 'PERMISSION_DENIED';
      if (Object.prototype.hasOwnProperty.call(virtualclass, 'ss')) {
        virtualclass.ss.onError(error);
      }

      if (virtualclass.currApp === 'SharePresentation' || virtualclass.currApp === 'DocumentShare') {
        const dashboardnav = document.querySelector('#dashboardnav button');
        if (dashboardnav != null) {
          dashboardnav.click();
        }
      }

      if (roles.hasControls()) { // #943
        virtualclass.vutil.initDefaultApp();
      }
    } else {
      constraints = constraints || {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: event.data.sourceId,
            maxWidth: 1440,
            maxHeight: 9999,
          },

          optional: [
            { maxFrameRate: 3 },
            { googLeakyBucket: true },
            { googTemporalLayeredScreencast: true },
          ],
        },
      };

      virtualclass.adpt = new virtualclass.adapter();
      const navigator2 = virtualclass.adpt.init(navigator);
      navigator2.getUserMedia(constraints, (stream) => {
        virtualclass.ss.initInternal();
        virtualclass.ss.initializeRecorder.call(virtualclass.ss, stream);
      }, (e) => {
        virtualclass.ss.onError.call(virtualclass.ss, e);
      });
      // the stream we can get here with initalizeRecorder()
    }
    const elem = document.querySelector('#virtualclassScreenShareLocalSmall');
    if (elem) {
      elem.style.display = 'block';
    }
  } else if (event.data.type === 'getScreenPending') {
    window.clearTimeout(event.data.id);
  } else if (event.data.type === 'yes') {
    virtualclass.gObj.ext = true;
  }
});
