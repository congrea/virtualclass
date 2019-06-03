var removeAppsDom = function () {
    // remove whiteboard tool wrapper
    var commandToolsWrapper = document.getElementById('commandToolsWrapper');
    if (commandToolsWrapper != null) {
        commandToolsWrapper.parentNode.removeChild(commandToolsWrapper);
    }


    // remove virtualclass app tool
    var virtualclassAppCont = document.getElementById('virtualclassOptionsCont');
    if (virtualclassAppCont != null) {
        virtualclassAppCont.parentNode.removeChild(virtualclassAppCont);
    }
}

function memberUpdateWithDelay(e, f) {
    if(f ==  'removed') {
        /** Removing the disconnected user from queue(memberlistpending) and DOM **/
        var index = virtualclass.gObj.memberlistpending.findIndex(x => x.userid == e.removeUser);
        if (index > -1) {
            virtualclass.gObj.memberlistpending.splice(index, 1);
            console.log("===== JOIN user left call");
        } else {
            setTimeout(function (){
                console.log("===== JOIN user left call");
                memberUpdate(e,f);
            },0)
        }
    } else {
        /** Making the user list queue (memberlistpending) here, on every user join **/

        var userlist = e.message;
        if(virtualclass.isPlayMode){
            /**
             * When user sought recording, there would displayed multiple instances of same user on chat list
             * It avoids to add the same users on memberlistpending array and same way on chat list,
             * **/
            for(var i=0; i<userlist.length; i++) {
                if(!isAlreadyInPendingList(userlist[i])){
                    virtualclass.gObj.memberlistpending.push(userlist[i])
                }
            }
        }else {
            for(var i=0; i<userlist.length; i++) {
                virtualclass.gObj.memberlistpending.push(userlist[i])
            }
        }
        console.log('member list pending(memberlistpending) udpate ');
    }

    /**
     * This ensures memberUpdate would be invoked and memberUpdateDelayTimer(setTimeout) would be set only
     * after every 1500 miliseconds, which means the setimeout would not be set on every user joined
     * **/
    if (virtualclass.gObj.memberlistpending.length > 0) {
        if (!virtualclass.gObj.hasOwnProperty("memberUpdateDelayTimer")) {
            virtualclass.gObj.memberUpdateDelayTimer = setTimeout(function () {
                memberUpdate(null, 'added');
                delete virtualclass.gObj.memberUpdateDelayTimer;
                if(!virtualclass.gObj.hasOwnProperty('addEventToChatDiv')){
                    var chatDiv = virtualclass.gObj.testChatDiv.shadowRoot.querySelector('#subchat');
                    chatDiv.addEventListener('click', function (element){
                        var targetElem = element.srcElement;
                        chatContainerEvent.onEvent(targetElem, chatboxManager);

                    });
                    virtualclass.gObj.addEventToChatDiv = true;

                }
            }, 1500)
        }
    }
}

/**
 * This is performing default action when member is added
 * Which means after role overrides/confirmation
 * @param expect
 * @param sType
 *
 */

var defaultOperation = function (e, sType) {

    if ((virtualclass.jId == virtualclass.gObj.uid)) {
        // Override the roles for removing Class from virtualclass container.
        if (virtualclass.joinUser.role != 't') {
            virtualclass.vutil.overrideRoles(virtualclass.joinUser.role);
            if (virtualclass.joinUser.role == 's') {
                removeAppsDom();
            } else if (virtualclass.joinUser.role != 'e') {
                removeSessionEndTool(); // remove session tool if there is any
            }
        }


        if (virtualclass.gObj.hasOwnProperty('doEndSession') && virtualclass.joinUser.role == 't') {
            overrideRoleTeacher();
            console.log('From localStorage, perform the override role action');
        } else {
            console.log('From localStorage, cannot perform the override role action');
        }
    } else {
        console.log('Does not need to say hello to new user');
        // We nee to send the current cursor to new user for for whiteboards
        //sendCursorToNewUser(e, virtualclass.jId);
    }

    ioPingPong.ping(e);

    // e.message.sort(sortUserList);
    // e.message = [virtualclass.joinUser];
    if(!Array.isArray(e.message)){
        e.message = [e.message];
    }

    memberUpdateWithDelay(e, 'added');

    if (roles.hasAdmin()) {
        if (virtualclass.gObj.uid == virtualclass.jId) {
            if(!virtualclass.gObj.studentSSstatus.mesharing){
                if (virtualclass.currApp.toUpperCase() == 'EDITORRICH' || virtualclass.currApp.toUpperCase() == 'EDITORCODE') {
                    ioAdapter.mustSend({'eddata': 'currAppEditor', et: virtualclass.currApp});
                }

                // On reload or new connection, make sure all students have same editor data
                if (virtualclass.editorRich.isVcAdapterIsReady('editorRich')) {
                    virtualclass.editorRich.responseToRequest();
                } else {
                    console.log('Editor Rich vcAdapter is not ready');
                }

                if (virtualclass.editorCode.isVcAdapterIsReady('editorCode')) {
                    virtualclass.editorCode.responseToRequest();
                } else {
                    console.log('Editor Code vcAdapter is not ready');
                }
            }

            if (virtualclass.currApp === 'SharePresentation') {
                if (typeof virtualclass.sharePt == 'object') {
                    ioAdapter.mustSendUser({
                        'ppt': {
                            'init': virtualclass.sharePt.pptUrl,
                            startFrom: virtualclass.sharePt.state
                        }, 'cf': 'ppt'
                    }, virtualclass.jId);
                }
            }else if(virtualclass.currApp ==='Video'){
                if (typeof virtualclass.videoUl.player == 'object') {
                    ioAdapter.mustSendUser({
                        'videoUl': {
                            'init': {
                                videoId:virtualclass.videoUl.videoId,
                                videoUrl:virtualclass.videoUl.videoUrl,
                            },
                            startFrom: virtualclass.videoUl.player.currentTime()
                        }, 'cf': 'videoUl'
                    }, virtualclass.jId);
                }
            }

        }

        // Send to everyone that the teacher is connected
        // for remove for extra cover of read only mode with editor
        ioAdapter.sendWithDelayAndDrop ({'cf': 'tConn'}, null, 'send', 'tConn', 1000);

    }

    // Greet new student with info, When other user join
    if (roles.hasControls() && virtualclass.gObj.uid != virtualclass.jId) {
        // Greet new student with info
        virtualclass.vutil.sendCurrAppOnUserJoin();

        if (virtualclass.currApp === 'ScreenShare') {
            sType = 'ss';
        }  else if (virtualclass.currApp === 'SharePresentation') {
            console.log("sharePPt");
            //debugger;
            if (typeof virtualclass.sharePt == 'object') {
                ioAdapter.mustSendUser({
                    'ppt': {
                        'init': virtualclass.sharePt.pptUrl,
                        startFrom: virtualclass.sharePt.state
                    }, 'cf': 'ppt'
                }, virtualclass.jId);
            } else {
                // TODO Need more validation  from nirmala
                ioAdapter.mustSendUser({'ppt': {'init': 'studentlayout'}, 'cf': 'ppt'}, virtualclass.jId);
            }
        } else if (virtualclass.currApp === 'DocumentShare') {

            // ioAdapter.mustSendUser({'ppt': {'init': virtualclass.sharePt.pptUrl, startFrom : virtualclass.sharePt.state}, 'cf' : 'ppt'}, virtualclass.jId);

            if (roles.hasControls() && virtualclass.dts.docs.hasOwnProperty('currDoc')) {
                if(virtualclass.gObj.currWb != null){
                    var doc = virtualclass.dts.docs.currDoc;
                    //ioAdapter.mustSendUser({'ppt': {'init': virtualclass.sharePt.pptUrl, startFrom : virtualclass.sharePt.state}, 'cf' : 'ppt'}, virtualclass.jId);
                    ioAdapter.mustSendUser({
                        'dts': {
                            slideTo: virtualclass.dts.docs.note.currNote,
                            docn: virtualclass.dts.docs.currDoc
                        }, 'cf': 'dts'
                    }, virtualclass.jId);
                    console.log('Document share send :- Complete slide');
                }
            } else {
                ioAdapter.mustSendUser({'dts': {init: 'studentlayout'}, 'cf': 'dts'}, virtualclass.jId);
                console.log('Document share send :- Layout');
            }
        }else if(virtualclass.currApp === 'Video'){
            if(typeof virtualclass.videoUl.player == 'object'){
                if(virtualclass.videoUl.videoUrl){
                    ioAdapter.mustSendUser({'videoUl': {'init': {id:virtualclass.videoUl.videoId,videoUrl:virtualclass.videoUl.videoUrl },
                        startFrom : virtualclass.videoUl.player.currentTime(),isPaused:virtualclass.videoUl.player.paused()}, 'cf' : 'videoUl'}, virtualclass.jId);
                }
            } else {
                ioAdapter.mustSendUser({'videoUl': {'init' : 'studentlayout'}, 'cf': 'videoUl'}, virtualclass.jId);
            }
        }

        if (typeof sType !== 'undefined' && sType !== null) {
            triggerInitShareScreen(sType, 6000); //There might need some time to executing missed packets
        }
    }else if (roles.isStudent() && virtualclass.gObj.uid != virtualclass.jId && virtualclass.gObj.studentSSstatus.mesharing) {
        sType = 'ss';
        //There might need some time to executing missed packets
        triggerInitShareScreen(sType, 6000);
    }
}