/**
 * Helper functions for newmessage event
 * @type {receiveFunctions}
 */

var receiveFunctions = new function () {

    this.pong = function (e) {
        ioPingPong.pong(e);
    };

    this.pongAck = function (e) {
        ioPingPong.pongAck(e);
    };

    this.control = function (e) {
        virtualclass.user.control.onmessage(e);
    };

    //editor data
    this.eddata = function (e) {
        //virtualclass.editorRich.onmessage(e.message);
        if (e.message.hasOwnProperty('et')) {
            if (e.message.et == 'editorRich') {
                virtualclass.editorRich.onmessage(e, 'EditorRich');
            } else {
                virtualclass.editorCode.onmessage(e, 'EditorCode');
            }
        }
    };

    /**
     * This functioon would invoke when the new user would join as
     * educator with overriding the role. This would at invoke at presenter window
     * for handle editor mode(read and write)
     * @param e.message has various required properties
     */
    this.nEd = function (e) {
        localStorage.setItem('nEd', true);
        //TODO the editor should be dynamic
        var editorRichWriteModeBox = document.getElementById('EditorRichwriteModeBox');

        if (editorRichWriteModeBox != null) {
            if (editorRichWriteModeBox.dataset.writeMode == 'true') {
                localStorage.removeItem('nEd');
            } else {
                e.message.cf = 'control';
                localStorage.setItem('editorCode', 'true');
                virtualclass.user.control.onmessage(e);
            }

        } else {
            console.log('editor mode editorRichWriteModeBox null');

        }
        console.log('Editor mode save');
    };

    this.bt = function () {
        virtualclass.vutil.removeBecomeTeacherWidget();

    }

    this.tConn = function (e) {
        // Lets Editor be the ready
        setTimeout(
            function () {

                virtualclass.vutil.setReadModeWhenTeacherIsConn('editorRich');
                virtualclass.vutil.setReadModeWhenTeacherIsConn('editorCode');
            }, 2000
        );
    }

    //youtube share
    this.yts = function (e) {
        //nothing to do with self received packet
        if (e.fromUser.userid != virtualclass.gObj.uid) {
            virtualclass.yts.onmessage(e.message);
        }
    };

    //silence audio
    this.sad = function (e) {
        var user, anchorTag;
        if (e.message.sad) {
            user = virtualclass.user.control.updateUser(e.fromUser.userid, 'ad', true);
            virtualclass.user.control.audioSign(user, "create");
        } else {
            user = virtualclass.user.control.updateUser(e.fromUser.userid, 'ad', false);
            virtualclass.user.control.audioSign(user, 'remove');
            anchorTag = document.getElementById(user.id + 'contrAudAnch');
            if (anchorTag != null) {
                anchorTag.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
            }
        }
        return true;
    };

    this.settings = function (e){
        if(e.message.hasOwnProperty("Hex")) {
            virtualclass.settings.onMessage(e.message.Hex);
        }
    };

    //enable chat
    this.enc = function (e) {
        if (e.message.hasOwnProperty('ouser')) {
            virtualclass.user.control.enable(e.message.ouser, 'chat', 'Chat', 'chat');
        } else {
            virtualclass.user.control.allChatEnable();
            virtualclass.gObj.chatEnable = true;
            // virtualclass.vutil.beforeSend({'enc': true, 'cf': 'enc', ouser: e.message.toUser});
        }
        document.querySelector('#chatWidget').classList.remove('chat_disabled');
        document.querySelector('#chat_div').classList.remove('chat_disabled');

    };

    //disable chat
    this.dic = function (e) {
        //if other user's control should be disabled
        if (e.message.hasOwnProperty('ouser')) {
            virtualclass.user.control.disable(e.message.ouser, 'chat', 'Chat', 'chat');
        } else {
            virtualclass.user.control.allChatDisable();
            virtualclass.gObj.chatEnable = false;
            // virtualclass.vutil.beforeSend({'dic': true, 'cf': 'dic', ouser: e.message.toUser});
        }
    };

    //enable audio
    this.ena = function (e) {};

    //disable audio
    this.dia = function (e) {};

    //enable all std audio
    this.aEna = function (e){};

    // disable all std audio
    this.aDia = function (e){};

    //chat message update
    this.msg = function (e) {
        messageUpdate(e);  //chat update
    };

    //session end
    this.sEnd = function (e) {
        // #967
        var joinClass = document.querySelector('#joinClassModal');
        joinClass.style.display = "none";

        var virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
        if(virtualclassApp != null ){
            virtualclassApp.style.display =  'block';
        }
        virtualclass.storage.config.endSession();
        virtualclass.popup.sesseionEndWindow();
        virtualclass.gObj.endSession = true;
    };

    //whiteboard ready
    this.dispWhiteboard = function (e) {
        virtualclass.makeAppReady(virtualclass.apps.wb, undefined, e.message.d,e.message.ci);
    };
    this.ppt = function (e) {
        if (e.fromUser.userid != virtualclass.gObj.uid) {
            if (e.message.hasOwnProperty('init')) {
                virtualclass.makeAppReady(virtualclass.apps.sp);
            } else {
                if (typeof virtualclass.sharePt != 'object') {
                    //If virtualclass.ssharePt is not ready at participate side, then we
                    // will create it first then only proceed to next ppt packet
                    virtualclass.makeAppReady(virtualclass.apps.sp);
                    virtualclass.sharePt.onmessage({
                        pptMsg: e.message.ppt.init,
                        cf: 'ppt',
                        user: "all",
                        cfpt: 'setUrl'
                    });
                }
                virtualclass.sharePt.onmessage(e.message);
            }
        }
    };

    //unshare schreen
    this.unshareScreen = function (e) {
        var app = e.message.st;
        if (typeof virtualclass[app] === 'object') {
            console.log('Unshare the screen at student');
            virtualclass[app].prevImageSlices = [];
            virtualclass[app].removeStream();
            virtualclass.currApp = virtualclass.gObj.defaultApp;
        }
    };

    //notfound
    this.videoSlice = function (e) {
        virtualclass.media.playVideo(e.message.videoSlice);
    };

    //screen share by image
    this.videoByImage = function (e) {
        if (!virtualclass.media.existVideoContainer(e.message.videoByImage)) {
            virtualclass.media.video.createElement(e.message.videoByImage);
        }
    };

    //not found
    this.userMsg = function (e) {
        virtualclass.gObj.chat.display(e.message.userMsg);
    };

    // not found
    this.requestPacketBy = function (e) {
        if (roles.hasControls()) {
            var requestBy = e.message.requestPacketBy; //request user
            virtualclass.gObj.chat.sendPackets(requestBy, e.message.sp);
        }
    };

    //not found
    this.chatPackResponsed = function (e) {
        if (e.message.byRequest === virtualclass.gObj.uid) {
            virtualclass.gObj.chat.displayMissedChats(e.message.chatPackResponsed);
        }
    };

    //not found
    this.checkUser = function (e) {
        var disconnect = virtualclass.wb[virtualclass.gObj.currWb].response.checkUser(e, wbUser.id, virtualclass.wb[virtualclass.gObj.currWb].stHasTeacher);
        if (typeof disconnect !== 'undefined') {
            if (disconnect === 'diconnect') {
                //TODO : ?
            }
        }
    };

    //Reclaim Role
    this.reclaimRole = function (e) {
        // debugger;
        console.log('Role reclaim');
        //if (localStorage.getItem('teacherId') !== null) {
        if (roles.hasControls()) {

            virtualclass.vutil.vcResponseAReclaimRole(e.fromUser.userid, wbUser.id);

            //virtualclass.wb[virtualclass.gObj.currWb].response.reclaimRole(e.fromUser.userid, wbUser.id);
        }
    };

    /**
     * remove presenter role when educator is join as teacher
     * @param e
     */
    this.rpr = function (e) {
        this.reclaimRole(e);
        console.log('reclaim role');
    }

    //Assign Role
    this.assignRole = function (e) {
        //debugger;
        if (e.message.toUser === virtualclass.gObj.uid) {
            console.log('Role assign');
            if (typeof virtualclass.wb == 'object') {
                virtualclass.wb[virtualclass.gObj.currWb].utility.removeWhiteboardMessage();
            }
            virtualclass.vutil.vcResponseAssignRole(e.fromUser.userid, wbUser.id);
            //virtualclass.wb[virtualclass.gObj.currWb].response.assignRole(e.fromUser.userid, wbUser.id);
        }
    };

    //Clear All
    this.clearAll = function (e) {
        if (typeof virtualclass.wb != 'object') {
            virtualclass.makeAppReady(virtualclass.apps.wb);
        }
        virtualclass.wb[virtualclass.gObj.currWb].response.clearAll(e.fromUser.userid, wbUser.id, e.message, virtualclass.wb[virtualclass.gObj.currWb].oTeacher);
    };

    //Get missed packet
    this.getMsPckt = function (e) {
        virtualclass.wb[virtualclass.gObj.currWb].gObj.chunk = [];
        var chunk = virtualclass.wb[virtualclass.gObj.currWb].bridge.sendPackets(e, virtualclass.wb[virtualclass.gObj.currWb].gObj.chunk);
        virtualclass.vutil.beforeSend({'repObj': chunk, 'chunk': true, 'cf': 'repObj'});
        //var chunk = virtualclass.wb[virtualclass.gObj.currWb].bridge.sendPackets(e, virtualclass.wb[virtualclass.gObj.currWb].gObj.chunk);
    };

    //Create mouse
    this.createArrow = function (e) {
        if (typeof virtualclass.wb == 'object') {
            if (!roles.hasControls()) {
                virtualclass.wb[virtualclass.gObj.currWb].response.createArrow(e.message);
            }
        }
    };

    //Display Whiteboard Data
    this.repObj = function (e) {
        //     console.log("whiteboard Incomming UID ===== " + e.message.repObj[0].uid);

        if (typeof virtualclass.wb != 'object' && virtualclass.currApp != 'DocumentShare') {
            virtualclass.makeAppReady(virtualclass.apps.wb);
        }

        if(typeof virtualclass.gObj.currWb != 'undefined' ){
            virtualclass.wb[virtualclass.gObj.currWb].utility.removeWhiteboardMessage();

            // The packets came from teacher when he/she does not has control won't be display
            if (e.fromUser.role == 'p' || ((e.fromUser.role == 't' || (e.fromUser.role == 'e')) && !virtualclass.vutil.isPresenterExist())) {
                virtualclass.wb[virtualclass.gObj.currWb].utility.replayObjsByFilter(e.message.repObj);
            } else {
                console.log("whiteboard -------------------------- We just lost a packet");
            }
        }
    };

    //Replay All, TODO, need to do verify
    this.replayAll = function (e) {
        virtualclass.wb[virtualclass.gObj.currWb].response.replayAll();
    };


    // documnetation sharing
    this.dts = function (e) {
        // virtualclass.dts.onmessage(e);
        console.log('Document share :- message received ' + e.message.serial);
        console.dir(e.message.dts);
        if (e.message.dts.hasOwnProperty('init')) {
            virtualclass.gObj.screenRh = 100;
            virtualclass.makeAppReady('DocumentShare', undefined, e.message.dts);
            virtualclass.gObj.screenRh = 60;
        } else if (typeof virtualclass.dts == 'object') {
            virtualclass.dts.onmessage(e);
        }
    }
    this.poll= function(e){
        console.log(e.message.poll.pollMsg);
        if (e.message.poll.pollMsg=="init") {
            virtualclass.makeAppReady("Poll");
        }else {
            if(typeof virtualclass.poll != 'object'){
                //If virtualclass.ssharePt is not ready at participate side, then we
                // will create it first then only proceed to next ppt packet
                virtualclass.makeAppReady("Poll");
                virtualclass.poll.onmessage({pollMsg: e.message.poll.init,  cf: 'poll',  user: "all"});
            }
            virtualclass.poll.onmessage(e.message,e.fromUser);
        }
    }

    this.quiz = function(e){
        console.log(e.message.quiz.quizMsg);
        if (e.message.quiz.quizMsg=="init") {

            virtualclass.makeAppReady("Quiz");
        }else {
            if(typeof virtualclass.quiz != 'object'){
                virtualclass.makeAppReady("Quiz");
                virtualclass.quiz.onmessage({quizMsg: e.message.quiz.init,  cf: 'quiz',  user: "all"});
            }
            virtualclass.quiz.onmessage(e.message,e.fromUser);
        }
    }


    this.videoUl= function(e){
        if(e.fromUser.userid != virtualclass.gObj.uid){
            virtualclass.videoUl.onmessage(e.message);
        }
    }
    //nirmala
    this.congController= function(e){
        if(e.fromUser.userid != virtualclass.gObj.uid){
            virtualclass.videoHost.onmessage(e.message);
        }

        var videoMode = e.message.congCtr.videoSwitch;
        if(videoMode == 'off'){
            virtualclass.vutil.addClass('virtualclassCont', 'videoff');
            virtualclass.vutil.addClass('virtualclassAppRightPanel', 'hide');
            virtualclass.vutil.removeClass('virtualclassAppRightPanel', 'show');
            virtualclass.videoHost.setUserIcon(e.fromUser.userid );
        }else {
            document.querySelector('#virtualclassCont').classList.remove('videoff');
            virtualclass.vutil.addClass('virtualclassAppRightPanel', 'show');
            virtualclass.vutil.removeClass('virtualclassAppRightPanel', 'hide');
        }

    }

    this.tsr = function (e){
        return;
        var enable = e.message.ac;
        if(enable){
            virtualclass.chat.enableTechSupport(e.message.uid);
        }else {
            virtualclass.chat.disableTechSupport(e.message.uid);
        }
    }

    // no audio
    this.na = function (e){
        virtualclass.user.control.iconAttrManupulate(e.fromUser.userid, "icon-audioEnaOrange");
    },

        //yes audio
        this.ya = function (e){
            virtualclass.user.control.iconAttrManupulate(e.fromUser.userid, "icon-audioEnaGreen");
        },



        this.mem_add = function (e){
            virtualclass.ioEventApi.member_added({
                type: "member_added",
                newJoinUser: e.message.user,
                cmadd : true
            });
        }

    this.mvid = function (e){
        console.log('multivideo, message received');
        virtualclass.multiVideo.onmessage(e.message, e.fromUser.userid);
    }

    this.sc = function (e){
        console.log('Recevied scroll');
        virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition(e.message);
    }

    this.scf = function (e){
        console.log('Recevied scroll first');
        console.dir(e.message);
        if(virtualclass.gObj.currWb != null){
            virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition(e.message);
        }
    }

    this.cwb = function (e){
        if(e.message.hasOwnProperty('diswb')){
            var wid = e.message.wid;
            virtualclass.gObj.currWb = wid;
            if(!virtualclass.wbCommon.whiteboardExist(virtualclass.gObj.currWb)){
                virtualclass.vutil.createWhiteBoard(virtualclass.gObj.currWb);
            }
            var idn = wid.split('_');
            if(idn.length > 0){
                virtualclass.gObj.currSlide = idn[idn.length-1];
            }
            virtualclass.wbCommon.displaySlide(wid);
            console.log('whiteboard slide received=' + wid);
            virtualclass.vutil.resizeWindowIfBigger();
        }else if(e.message.hasOwnProperty('wbCount')){
            virtualclass.gObj.wbCount = e.message.wbCount;
            if(virtualclass.gObj.wIds.indexOf(Number(virtualclass.gObj.wbCount)) == -1){
                virtualclass.gObj.wIds.push(virtualclass.gObj.wbCount);
            }

        }
    }

    /***** Start Student Screen Sharing *****/
    /* Handle teacher request for screen sharing **/
    this.reqscreen = function(e){
        if(virtualclass.system.device != 'mobTab' &&
            (virtualclass.system.mybrowser.name == 'Chrome' || virtualclass.system.mybrowser.name == 'Firefox' || virtualclass.system.mybrowser.name == 'Edge')){
            var message = virtualclass.lang.getString('stdscreenshare');
            if(virtualclass.gObj.precheckScrn){
                virtualclass.vutil.prechkScrnShare();
            }
            virtualclass.popup.confirmInput(message,function (confirm){
                if(confirm){
                    if(roles.isStudent()){
                        virtualclass.gObj.studentSSstatus.mesharing = true;

                    }
                    var appName = "ScreenShare";
                    virtualclass.makeAppReady(appName, "byclick");
                }else{
                    virtualclass.vutil.beforeSend({'sd': true, 'cf': 'colorIndicator'});
                }
            });
        } else {
            virtualclass.vutil.beforeSend({'ext': true, 'cf': 'colorIndicator', 'nosupport' : true});
        }
    }

    /** Knows the id of student who is screen sharing **/
    this.sshare_user = (e) => {
        virtualclass.vutil.removeSSsharing();
        virtualclass.gObj.whoIsSharing = e.fromUser.userid;
        virtualclass.vutil.initssSharing(e.fromUser.userid);
    }

    // Self view, but display none to others
    this.sview = function(e){
        var elem = document.getElementById("virtualclassScreenShareLocal");
        if(roles.isStudent() && !virtualclass.gObj.studentSSstatus.mesharing) {
            if(elem != null){
                elem.style.display = "none";
            }
        }
        if(e.message.hasOwnProperty('firstSs')){
            virtualclass.gObj.studentSSstatus.sharing = true;

        }
        virtualclass.gObj.studentSSstatus.shareToAll = false;
        console.log('Share, self view');
    }

    // Share screenshare to all
    this.sToAll = function () {
        var elem = document.getElementById("virtualclassScreenShareLocal");
        if (elem != null) {
            elem.style.display = 'block';
        }
        virtualclass.gObj.studentSSstatus.shareToAll = true;
        virtualclass.gObj.studentSSstatus.sharing = true;
        console.log('Share, to all');
    }

    /** This happens when student does page refresh during the share is being shared  **/
    this.rmStdScreen = function(e){
        virtualclass.vutil.initDefaultApp();
        virtualclass.vutil.beforeSend({'unshareScreen': true, st: 'ss', 'cf': 'unshareScreen'});
        if(typeof virtualclass.ss == 'object'){
            virtualclass.ss.clearScreenShare();
        }else {
            virtualclass.vutil.removeSSsharing();
        }
    }
    /***** End Student Screen Sharing *****/

    this.raiseHand= function(e){
        virtualclass.raiseHand.onMsgRec(e);
    }
    this.colorIndicator= function(e){
        var rMsg = e.message;
        var uid = e.fromUser.userid;
        if(rMsg.sd){
            var elem = chatContainerEvent.elementFromShadowDom('#ml'+uid + ' .icon-stdscreenImg');
            if(elem != null){
                elem.setAttribute('data-dcolor', 'red');

            }
        }else if(rMsg.ext){
            var color = rMsg.hasOwnProperty('nosupport') ? 'nosupport' : 'orange';


            var elem = chatContainerEvent.elementFromShadowDom('#ml'+uid + ' .icon-stdscreenImg');
            if(elem != null){
                elem.setAttribute('data-dcolor', color);
            }
        }
    }


    this.stdVideoCtrl= function(e){
        if(e.fromUser.userid != virtualclass.gObj.uid){
            virtualclass.videoHost.stdVideoCtrlMsg(e);
        }
    }

    this.toggleVideo=function(e){}

    this.destroyPlayer = function (e) {
        if (virtualclass.currApp == "Video") {
            if (virtualclass.hasOwnProperty('videoUl') && virtualclass.videoUl.videoUrl) {
                virtualclass.videoUl.videoUrl = "";
                virtualclass.videoUl.videoId = "";
                var frame = document.getElementById("dispVideo_Youtube_api"); //youtube video
                if (frame && frame.contentWindow) {
                    frame.contentWindow.postMessage(
                        '{"event":"command","func":"pauseVideo","args":""}',
                        '*');
                }
                var dispVideo = document.querySelector(".congrea #dispVideo"); //uploaded video
                if (dispVideo) {
                    dispVideo.style.display = "none";
                    var video = document.querySelector(".congrea #dispVideo video");
                    if (video) {
                        video.setAttribute("src", '');
                    }
                }
                var currPlayed = document.querySelector('#listvideo .playing');
                if(currPlayed){
                    currPlayed.classList.remove('playing')
                }
                var currCont = document.querySelector("#listvideo .removeCtr");
                if(currCont){
                    currCont.classList.remove('removeCtr');
                }

                if(typeof virtualclass.videoUl.player == 'object'){
                    delete(virtualclass.videoUl.player);
                }
            }

        }

    }

    this.sync = function  (){}

    this.wbData = function(e){
        console.log(e)
        if(e.message.wbIndex){
            virtualclass.gObj.currIndex = parseInt(e.message.wbIndex);
            virtualclass.wbCommon.indexNav.studentWBPagination(e.message.wbIndex-1)
        }
    }


    /** Record setting **/
    this.recs = function (e){
        if(!virtualclass.isPlayMode){
            virtualclass.settings.onMessage(e.message);
        }
    }
};
