window.addEventListener('message', function (event) { 
    if (event.origin != window.location.origin) {
        return;
    }
    
    //if (window.navigator.userAgent.match('Chrome')) {
        if (event.data.type == 'gotScreen') {
            
            var constraints;
            if (event.data.sourceId === '') { // user canceled
                var error = new Error('NavigatorUserMediaError');
                error.name = 'PERMISSION_DENIED';
                vApp.ss.onError(error);
            } else {
                constraints = constraints || {audio: false, video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: event.data.sourceId,
                        maxWidth : 1440,
                        maxHeight : 9999
                    },

                    optional: [
    //                    {maxWidth: window.screen.width},
    //                    {maxHeight: window.screen.height},

                        {maxFrameRate: 3},
                        {googLeakyBucket: true},
                        {googTemporalLayeredScreencast: true}
                    ]
                }};

                vApp.adpt = new vApp.adapter();
                navigator2 =  vApp.adpt.init(navigator);
//                alert('suman bogati');
//                debugger;
                
                navigator2.getUserMedia(constraints, function (stream){
                    vApp.ss._init();   
                    vApp.ss.initializeRecorder.call(vApp.ss, stream);   
                }, function (e){
                    debugger;
                    vApp.ss.onError.call(vApp.ss, e);   
                });

                //the stream we can get here with initalizeRecorder() 
            }
        } else if (event.data.type == 'getScreenPending') {
            window.clearTimeout(event.data.id);
        }
    //}
    
     vApp.getSceenFirefox = function (){
               
        if(window.navigator.userAgent.match('Firefox')){

            var ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
            if (ffver >= 33) {
                //constraints = (hasConstraints && constraints) || {
                constraints = {
                    video: {
                        mozMediaSource: 'window',
                        mediaSource: 'window'
                    }
                }

                vApp.adpt = new vApp.adapter();
                navigator2 =  vApp.adpt.init(navigator)

                navigator2.getUserMedia(constraints, function (err, stream) {
                    //callback(err, stream);
                    vApp.ss._init();   
                    vApp.ss.initializeRecorder.call(vApp.ss, stream); 

                    // workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1045810
                    if (!err) {
                        var lastTime = stream.currentTime;
                        var polly = window.setInterval(function () {
                            if (!stream) window.clearInterval(polly);
                            if (stream.currentTime == lastTime) {
                                window.clearInterval(polly);
                                if (stream.onended) {
                                    stream.onended();
                                }
                            }
                            lastTime = stream.currentTime;
                        }, 500);
                    }
                },
                function (error){
                    alert('there is some ' + error);
                }
                );
            } else {
                error = new Error('NavigatorUserMediaError');
                error.name = 'EXTENSION_UNAVAILABLE'; // does not make much sense but...
            }

        }
     }
            
})