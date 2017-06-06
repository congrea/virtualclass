(function (window) {
    /**
     * {virtualclass1} {virtualclass2} are elements you passes with getString function eg:-
     *   virtualclass.lang.getString('operaBrowserIssue', ['opeara', 27]);
     *   opera and 27 will be replaced over the {virtualclass1} and {virtualclass2} resepectively for particular line of language file.
     * @type type
     */
    var message = {
        'notSupportCanvas': 'This browser does not support <a href="http://en.wikipedia.org/wiki/Canvas_element/">Canvas</a>. Please update your browser with the latest version',
        'notSupportGetUserMedia': 'The browser does not support <a href="http://dev.w3.org/2011/webrtc/editor/getusermedia.html">getUserMedia</a> for <a href="http://www.webrtc.org/">WebRtc</a>. Please update your browser with the latest version',
        'notSupportPeerConnect': 'The browser is unable to create a Peer Connection object for <a href="http://www.webrtc.org/">WebRtc</a>. Please update your browser with the latest version.',
        'notSupportWebSocket': 'This browser does not support <a href="http://www.websocket.org/">WebSocket</a>. Please update your browser with the latest version. ',
        'notSupportWebRtc': 'This browser does not support <a href="http://www.webrtc.org/">WebRtc</a>. Please update your browser with the latest version.',
        'line': 'Line',
        'rectangle': 'Rectangle',
        'triangle': 'Triangle',
        'oval': 'Oval',
        'assign': 'Assign',
        'reclaim': 'Reclaim',
        'freeDrawing': 'Free hand',
        'text': 'Text',
        'replay': 'Replay',
        'activeAll': 'Active All',
        'clearAll': 'Clear All',
        'drawArea': 'Draw Area',
        'totRcvdPackets' : 'Total Packets Received',
        'perSecRcvdData' : 'Packet Received Per Second',
        'totSentPackets': 'Total Packets Sent',
        'perSecSentPacket': 'Packets Sent Per Second ',
        'perSecond': 'Per Second',
        'sentPackets': 'Sent <br/><span>Packets</span>',
        'receviedPackets': 'Received <br/><span>Packets</span>',
        'total': 'Total',
        'dataDetails': 'Data Details',
        'sentMessageInfo': 'Sent Message <br/><span>Information</span>',
        'receivedMessageInfo': 'Received Message <br/><span>Information</span>',
        'wbrtcMsgFireFox': 'You can click on  "Share Selected Devices"' + ' to share your mic and camera feed with other users',
        'wbrtcMsgChrome': 'You can click the deny button for not sharing your microphone and camera  with Congrea.' +  'or click allow button to share them.',
        'canvasDrawMsg': 'You can click on any tool for drawing' + 'click and hold the left mouse button to draw',
        'clearAllWarnMessage': 'Do you really want to clear this whiteboard?',
        'cof': 'connection off',
        'askForConnect': 'This action can be performed only after another user connects',
        'msgForReload': "Please reload this page to continue editing.",
        'msgStudentForReload': "Please reload this page.",
        'reload': "Reload",
        'whiteboard': 'Whiteboard',
        'screenshare': 'Screen Share',
        'sharePresentation':'share presentation',
        'sessionend': "Close Session.",
        'audioTest': "Your voice will be recorded and played back to you. \n Press Ok and speak something for few seconds.",
        'chatEnable': "Disable Chat",
        'chatDisable': "Enable Chat",
        'assignEnable': "Transfer Controls",
        'assignDisable': "Reclaim Controls",

        'editorRichDisable': "Write Mode",
        'editorRichEnable': "Read Only",

        'editorCodeDisable': "Write Mode",
        'editorCodeEnable': "Read Only",

        'audioEnable': "Mute",
        'audioDisable': "Unmute",
        'audioOff': "Mute",
        'audioOn': "Mute",
        'minCommonChat': "Hide Chat Window",
        'maxCommonChat': "Show Chat Window",
        'miniuserbox': "Hide User Box",
        'maxuserbox': "Show User Box",
        'miniUserList': "Hide User List",
        'maxUserList': "Show User List",
        'startnewsession': "This session has not been saved, do you really want to end this session?",
        'DevicesNotFoundError': "Please check your Webcam (camera/microphone) connection.",
        'PermissionDeniedError': "Webcam access has been denied.",
        'PERMISSION_DENIED': "You denied access to your Webcam(camera/microphone).",
        'notSupportBrowser': "Firefox {virtualclass1} does not support Screen sharing.",
        'disableSpeaker': "Mute",
        'enableSpeaker': "Unmute",
        'notSupportChrome': 'Please update your browser {virtualclass1} {virtualclass2} to Google Chrome 40 or above',
        'errcanvas': 'canvas',
        'errwebSocket': 'Web Socket',
        'errgetusermedia': 'getUserMedia',
        'errindexeddb': 'indexedDb',
        'errwebworker': 'Web worker',
        'errwebaudio': 'Web audio',
        'errtypedarray': 'Typed array',
        'errscreenshare': 'Screen share',
        'operaBrowserIssue': 'Your browser {virtualclass1} {virtualclass2} is partially supported. You will not be able to share your screen, Congrea fully support chrome and Firefox',
        'commonBrowserIssue': 'Your browser {virtualclass1} {virtualclass2} is not supported, Congrea support Chrome and Firefox.',
        'chFireBrowsersIssue': 'Your browser {virtualclass1} {virtualclass2} needs updation, Congrea support Chrome 40+ and Firefox 35+.',
        'studentSafariBrowserIssue': 'Your browser {virtualclass1} {virtualclass2} cannot  share your webcam with other users, Congrea fully support Chrome  and Firefox.',
        'ieBrowserIssue': 'Internet Explorer is not supported, Congrea fully support Chrome  and Firefox.',
        'ios7support': "For Apple, Virtual Class supports iOS 8 and higher versions.",
        'supportDesktop': "Virtual Class does not support tablets or mobiles. To present please use a desktop.",
        'notSupportIphone': "Sorry. Virtual Class doesn't support mobile phones.",
        'InternalError': "Please ensure that same webcam is not being used <br /> in multiple browsers or multiple applications. ",
        'SourceUnavailableError': 'Please ensure that same webcam is not being used in multiple browsers or multiple applications.',
        'teacherSafariBrowserIssue': 'Safari does not support presenter functionality. Please switch to Chrome or Firefox.',
        'safariBrowserIssue': 'Your browser Safari {virtualclass1} is not supported, We fully support Chrome  and Firefox',
        'savesession': 'Do you want to save current Session?',
        'savesessionTechSupport' : "Do you want to save current Session? <br /> Once you download the session, Updates won't be avaiable on re-downloading of same session.",
        'plswaitwhile': 'Please wait....',
        'downloadedFile': "Your files are downloading....,  <br />File, {virtualclass1}, has been downloaded",
        'overallprogress': 'Overall Progress',
        'playsessionmsg': 'Click ‘play’ to start the session.',
        'askplayMessage': '<span id="askplaymsg"> Should we start playing the session?</span><br /><span id="remaingmsg">Remaining data will be downloaded in the background.</span>',
        'youTubeUrl': 'Enter YouTube Video URL.',
        'shareYouTubeVideo': 'Share YouTube Video',
        'shareAnotherYouTubeVideo': 'Share Another YouTube Video',
        'editorCode': 'Code Editor',
        'editorRich': 'Text Editor',
         'teachermayshow': 'YouTube video will be shared shortly.',
        'youtubeshare': 'YouTube Video Share',
        'writemode': 'Write Mode',
        'readonlymode': 'Read Only',
        'msgForDownloadStart' : 'Unable to save data. <br /> Preparing data for download',
        'msgForWhiteboard' : 'Empty Whiteboard.',
        'educator' : 'Educator',
        'supportDesktopOnly' : 'Sorry, presenter mode only supports desktops. Tablets and Mobile devices are not supported.',
        'download' : 'Download',
        'downloadFile' : 'Download File',
        'synchMessage' : 'Please wait a while.  Syncing new content.',
        'iosAudEnable' : 'Tap here to enable the audio',
        'studentAudEnable' : 'Student Audio Enabled',
        'screensharealready' : "The screen is being shared.",
        'editorsynchmsg' : 'Editor is not in sync, please wait a few seconds and try again ',
        'canvasmissing' : 'Canvas is missing in your browsers. Please update the latest version of your browser',
        'downloadFile'  : 'Download File',
        'filenotsave'  : 'Your file could not be saved.',
        'filetsaveTS'  : 'The Session is ready to Save.',
        'muteAll' : 'Mute All',
        'unmuteAll' : 'Unmute All',
        'enablehistory' : '"Browser History" should be enabled during the Session.',
        'becomeTeacher' : 'Become Teacher',
        'pptscreenstudent':"Presentation will be shared shortly",
        'confirmOk' : 'Yes',
        'confirmCancel' : 'No',
        'uploadsession' : 'Please wait until processing is complete.',
        // 'VCE2', 'VCE4', 'VCE5', 'VCE6', 'invalidcmid', 'cmidmissing', 'nomdlroot', 'usermissing', 'cnmissing', 'sesseionkeymissing', 'recorddatamissing', 'keymissing'
        'VCE4' : 'Record data is missing',
        'VCE5' : 'There is unable to Record Data.', 
        'VCE6' : 'Course module is missing.',
        'invalidcmid' : 'Course Module is invalid.',
        'nomdlroot' : 'There is no url for momodle root.',
        'usermissing' : 'User is missing',
        'cnmissing' : 'Chunk number is missing',
        'sesseionkeymissing' : 'Session key is missing from Front End.', // from javascript
        'keymissing' :  'Your software(LMS/CMS)\'s key is is missing',
        'invalidurl' :  'Your url is invalid',
        'ppturl' : 'Enter HTML5 Presentation Url.',

        // start pretest from here
        'speakerTest' : 'If you can hear music, speakers are working.',
        'webcamerainfo' : 'If video is visible, webcam is working.',
        'mictesting' : 'Above audio bar shall fluctuate while you speak if your microphone is connected properly.',
        'nowebcam' : 'Webcam is not available, or not connected properly.',
        'NotFoundError' : 'Webcam is not available, or not connected properly.',
        'DevicesNotFoundError' : 'Webcam is not available, or not connected properly.',

        'highBandWidthSpeed' : 'Your bandwidth is good enough.',
        'mediumBandWidthSpeed' : 'Your bandwidth is limited, we are reducing video quality based on your available bandwidth.',
        'lowBandWidthSpeed' : 'Your bandwidth is too low, we are stopping video playback. You will still be able to hear audio and view screen.',

        'SourceUnavailableError' : 'Another application on your computer might be using your webcam. Kindly close all other applications that might be using your webcam.',
        'congreainchrome' : "Your browser is compatible.",
        'notsupportbrowser' : '{virtualclass1} is not fully compatible. For the best experience, use Google Chrome.',

        'rejected' : 'Another application on your computer might be using your webcam. Kindly close all other applications that might be using your webcam.',
        /*For Chrome */
        'PermissionDeniedErrorExt' : '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'  +
        'Go to camera icon on top right of the screen <br /> ' +
        'Click on "Always allow..." option and select the camera option <br />  ' +
        'Click on done and refresh the screen  </div> <div class="screenImages">' +
        ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',

        'SecurityErrorExt' : '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'  +
        'Go to camera icon on top right of the screen <br /> ' +
        'Click on "Always allow..." option and select the camera option <br />  ' +
        'Click on done and refresh the screen  </div> <div class="screenImages">' +
        ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',

        'nopermissionExt' : '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'  +
        'Go to camera icon on top right of the screen <br /> ' +
        'Click on "Always allow..." option and select the camera option <br />  ' +
        'Click on done and refresh the screen  </div> <div class="screenImages">' +
        ' <figure class="chrome" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-video.png" > <figcaption>Chrome</figcaption> </figure></div>',


        /*For Firefox */
        'PermissionDeniedErrorExtFF' : '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'  +
        'Go to camera icon on top left of the screen <br /> ' +
        'Click on "Share Selected Device." option.' +
        '<div class="screenImages">' +
        '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',

        'SecurityErrorExtFF' : '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'  +
        'Go to camera icon on top left of the screen <br /> ' +
        'Click on "Share Selected Device." option.' +
        '<div class="screenImages">' +
        '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',

        'nopermissionExtFF' : '<div class="errorMsg"> Camera access has been blocked.To provide webcam access, kindly follow below procedure <br />'  +
        'Go to camera icon on top left of the screen <br /> ' +
        'Click on "Share Selected Device." option.' +
        '<div class="screenImages">' +
        '<figure class="firefox" > <img src="https://www.congrea.com/wp-content/uploads/2016/10/ff-screnshare.png" > <figcaption>Chrome</figcaption> </figure></div>',

        'poll':'Poll',
        'pollCancel':'close',
        'pollmaybeshown':'Poll may be published ...',
        'videoUpload':"Share Video",
        'documentShare' : 'Document Sharing',
        'congreavideo' : 'This video is already installed, please upload new file.',
        'duplicateUploadMsg' : 'This file is already installed, please upload new file.',
        'someproblem' : 'There is some problem',

        'quiz':'Quiz',
        'quizreviewpublish': 'Review & publish Quiz',
        'quizmayshow' : 'Quiz will be appeared shortly.',
        'techsupport' : "Tech Support",
        'commonChat': "Common Chat",
        'privateChat':"Pivate Chat",
        'support':"Tech Support",
        'uploadsession' : 'Please wait until processing is complete.',
        'totalprogress' : 'Total Progress',
        'indvprogress' : 'Current Task',
        'downloadsession' : 'Please wait while the recording is downloaded.',
        'askplaymsg' : '<span id="askplaymsg"> "Downloading in process, click Play to begin </span>"',
        'overallprogress' : 'Overall Progress',
        'replay_message' : 'Thanks for watching.',
        'uploadedsession' : 'Your session has ended, you may now close the window. <br /> Or close this popup to start a new session.',
        'sessionendmsg' : 'Session has been closed. You may now close your browser.',
        'play' : 'Play',
        'replay' : 'Re-play',
        'tpAudioTest' : 'Test Audio',
        'enableAudio' : 'Unmute',
        'disableAudio' : 'Mute',
        'pressAlwaysToSpeak' : 'Press always to speak.',
        'pushtotalk' : 'Push To Talk',
        'waitmsgconnect' : 'Please wait a whlie. Application is trying to connect.',
        'testingbrowser' : 'Testing Browser Compatibility',
        'testinginternetspeed' : 'Testing Internet Speed',
        'testingspeaker' : 'Testing Speaker',
        'testingmichrophone' : 'Testing Microphone',
        'testingwebcam' : 'Testing Webcam Connection',
        'proposedspeed' : 'Proposed Speed',
        'audiolatency' : 'Audio Latency',
        'videoquality' : 'Video Quality'
    };
    window.message = message;
})(window);
