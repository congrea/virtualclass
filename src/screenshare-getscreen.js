/*
 * Executed when the virtual class is loaded 
 * Provides an interaction  with desktop selector
 * messege is posted to desktop selector and and desktop selector
 * performes the task and posts a message back on receiving the message.
 * initializes user's screen and recorders 
 * 
 */
window.addEventListener('message', function (event) {
    "use strict";
    if (event.origin != window.location.origin) {
        return;
    }
    if (event.data.type == 'gotScreen') {
        //delete window.shouldChromExtInstall;
        var constraints;
        if (event.data.sourceId === '') { // user canceled
            var error = new Error('NavigatorUserMediaError');
            error.name = 'PERMISSION_DENIED';
            if (virtualclass.hasOwnProperty('ss')) {
                virtualclass.ss.onError(error);
            }

            if (virtualclass.currApp == "SharePresentation" || virtualclass.currApp == "DocumentShare") {
                var dashboardnav = document.querySelector('#dashboardnav button');
                if (dashboardnav != null) {
                    dashboardnav.click();
                }
            }

            if (roles.hasControls()) {   // #943
                virtualclass.vutil.initDefaultApp();
            }

        } else {
            constraints = constraints || {
                    audio: false, video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: event.data.sourceId,
                            maxWidth: 1440,
                            maxHeight: 9999
                        },

                        optional: [
                            {maxFrameRate: 3},
                            {googLeakyBucket: true},
                            {googTemporalLayeredScreencast: true}
                        ]
                    }
                };

            virtualclass.adpt = new virtualclass.adapter();
            let navigator2 = virtualclass.adpt.init(navigator);
            navigator2.getUserMedia(constraints, function (stream) {
                virtualclass.ss._init();
                //if(roles.hasControls()){
                virtualclass.ss.initializeRecorder.call(virtualclass.ss, stream);
                // }
            }, function (e) {
                virtualclass.ss.onError.call(virtualclass.ss, e);
            });
            //the stream we can get here with initalizeRecorder()
        }
        var elem = document.querySelector("#virtualclassScreenShareLocalSmall");
        if (elem) {
            elem.style.display = "block";
        }


    } else if (event.data.type == 'getScreenPending') {
        window.clearTimeout(event.data.id);
    } else if (event.data.type == 'yes') {
        virtualclass.gObj.ext = true;
    }
});