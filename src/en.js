(
    function(window) {
        
        /**
         * {vapp1} {vapp2} are elements you passes with getString function eg:-
         *   vApp.lang.getString('operaBrowserIssue', ['opeara', 27]);
         *   opera and 27 will be replaced over the {vapp1} and {vapp2} resepectively for particular line of language file.
         * @type type
         */
        var message = {
            'notSupportCanvas': 'This browser does not support Canvas. Please update your browser with the latest version' +
                    'For more information about Canvas, click on the link given here <a href="http://en.wikipedia.org/wiki/Canvas_element/">Canvas</a>',
            'notSupportGetUserMedia': 'The browser does not support getUserMedia for webRtc. Please update your browser with the latest version'
 + ' For more information about getUuserMedia, click on the link given here <a href="http://dev.w3.org/2011/webrtc/editor/getusermedia.html">getUserMedia</a>',
            'notSupportPeerConnect': 'The browser is unable to create Peer Connection object for WebRtc' +
                    ' Please update your browser with the latest version.' +
                    ' For more information about WebRtc, click on the link given here <a href="http://www.webrtc.org/">WebRtc</a>',
            'notSupportWebSocket': 'This browser does not support WebSocket. Please update your browser with the latest version. ' +
                    'For more information about WebSocket, click on the link given here <a href="http://www.websocket.org/">WebSocket</a>.',
            'notSupportWebRtc': 'This browser does not support WebRTC. Please update your browser with the latest version.' +
                    ' For more information about WebRtc, click on the link given here <a href="http://www.webrtc.org/">WebRtc</a>',
            'line': 'Line',
            'rectangle': 'Rectangle',
            'triangle': 'Triangle',
            'oval': 'Oval',
            'assign': 'Assign',
            'reclaim': 'Reclaim',
            'freeDrawing': 'Free Drawing',
            'text': 'Text',
            'replay': 'Replay',
            'activeAll': 'Active All',
            'clearAll': 'Clear All',
         //   'connectionOff': 'Connection Off',
         //   'connectionOn': 'Connection On',
            'drawArea': 'Draw Area',
            'totRcvdPackets': 'Total Received Packets',
            'perSecRcvdData': 'Per Second Recevied Packet',
            'totSentPackets': 'Total Sent Packets',
            'perSecSentPacket': 'Per Second Sent Packets',
            'perSecond': 'Per Second',
            'sentPackets': 'Sent <br/><span>Packets</span>',
            'receviedPackets': 'Received <br/><span>Pacekts</span>',
            'total': 'Total',
            'dataDetails': 'Data Details',
            'sentMessageInfo': 'Sent Message <br/><span>Information</span>',
            'receivedMessageInfo': 'Received Message <br/><span>information</span>',
            'wbrtcMsgFireFox': 'You can click on  "Share Selected Devices"' +
                    ' to share your microphone and camera with other users',
            'wbrtcMsgChrome': 'You can click on deny button for not sharing your microphone and camera with other users.' +
                    'or click on allow button to share your microphone and camera with other users.',
            'canvasDrawMsg': 'You can click on any tool to draw object ' +
                    'with a mouse click, mouse move and mouse up in the Draw Area',
            //'clearAllWarnMessage': "Do you want to clear the Whiteboard?",
            'clearAllWarnMessage' : 'Do you want to remove all objects you have drawn?',
          //  'con': 'connection on',
            'cof': 'connection off',
            'askForConnect': 'You will be able to perform this action only when other user get connected',
            'msgForReload' : "You will be unable to draw the objects after resizing the window. <br />  So, please reload the page for drawing. ",
            'msgStudentForReload' : "After resizing the window, there can be a problem over the drawn objects, <br />  So, please realod the page for better results ",
            'reload' : "Reload",
            'whiteboard' : 'Whiteboard',
            'screenshare' : 'Screen Share',
            'sessionend' : "Session End",
            'audioTest' : "Kindly speak some words for audio testing\nYour voice will be recorderd for 5 seconds after press OK.",
            'chatEnable' : "Chat is on",
            'chatDisable' : "Chat Disabled",
            'assignEnable' : "Transfer Controls",
            'assignDisable' : "Reclaim Role",
            'audioEnable' : "Audio Enabled",
            'audioDisable' : "Audio Disabled",
            'audioOn' : "Audio on",
            'minCommonChat' : "Hide Common Chat",
            'maxCommonChat' : "Show Common Chat",
            'miniuserbox' : "Hide User Box",
            'maxuserbox' : "Show User Box",
            'miniUserList' : "Show User List",
            'maxUserList' : "Hide User List",
            'startnewsession' : "Do you want start a new session with ending current session?",
            'DevicesNotFoundError' :  "You may not have Webcam(camera/microphone).",
            'PermissionDeniedError' : "You denied to access your Webcam.",
            'PERMISSION_DENIED' : "You denied to access your Webcam(camera/microphone).",
            'notSupportBrowser' : "Firefox {vApp1} does not support Screen sharing.",
            'disableSpeaker' : "Disable Audio",
            'enableSpeaker' : "Enable Audio",
            'notSupportChrome' : 'Your browser {vapp1} {vapp2} needs to updated, We support Chrome 40',
            'errcanvas' : 'canvas',
            'errwebSocket' : 'Web Socket',
            'errgetusermedia' : 'getUserMedia',
            'errindexeddb' : 'indexedDb',
            'errwebworker' :  'Web worker',
            'errwebaudio' : 'Web audio',
            'errtypedarray' :  'Typed array',
            'errscreenshare' : 'Screen share',
            'operaBrowserIssue' : 'Your browser {vapp1} {vapp2} is partially supported. You will not be able to share your screen with Learners, We fully support chrome and Firefox',
            'commonBrowserIssue' : 'Your browser {vapp1} {vapp2} is not supported, We support Chrome and Firefox.',
            'chFireBrowsersIssue' : 'Your browser {vapp1} {vapp2}  needs to updated, We support Chrome 40 and Firefox 35.',
            'studentSafariBrowserIssue' : 'Your browser {vApp1} does not able to share your Cam with other users, We fully support Chrome  and Firefox.',
            'ieBrowserIssue' : 'Your browser Internet Explorer is not supported, We fully support Chrome  and Firefox.',
            'ios7support' : "We support only iOS 7 (Apple operating system 7) or higher.",
            'supportDesktop' : "For teacher we support desktop computer only not any tablet and mobile phone.",
            'notSupportIphone' : "We support iPad, Tablet or Desktop coputer, not any Mobile phone"
            
//            'silenceDetectEnable' : "Silence detect enable",
//            'silenceDetectDisable' : "Silence detect disable"
        };
        window.message = message;
    }
)(window);
