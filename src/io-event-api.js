function processImage(msg, vtype) {
    var data_pack = new Uint8ClampedArray(msg);
    var recmsg = data_pack.subarray(2, data_pack.length);
    if(vtype == 1){
        var b64encoded = "data:image/webp;base64," + btoa(virtualclass.videoHost.Uint8ToString(recmsg));
        var imgType = "webp";
    }else {
        var b64encoded = "data:image/jpeg;base64," + btoa(virtualclass.videoHost.Uint8ToString(recmsg));
        var imgType = "jpeg";
    }

    virtualclass.videoHost.drawReceivedImage(b64encoded, imgType, {x: 0, y: 0});
}

function isAnyOnePresenter() {
    var isPresenter = parseInt(wbUser.anyonepresenter, 10);
    return (isPresenter == 1);
}

function joinAsTeacher (jId){
    virtualclass.gObj.veryFirstJoin = false;
    if (!virtualclass.vutil.isOrginalTeacherExist(jId)) {
        overrideOperation('t');
        console.log('Member add :- join as teacher');
    }

    if (virtualclass.gObj.hasOwnProperty('doEndSession') && roles.isTeacher()) {
        overrideRoleTeacher();
    }
}

/**
 * By this funciton overriding the role and
 * and adjusting the layout/html according to the given role
 * @param role
 */
var overrideOperation = function (role) {
    if (role == 's') {
        virtualclass.view.disappearBox('drawArea'); //remove draw message box
        removeAppsDom();
        if (typeof virtualclass.wb == 'object') {
            // make canvas disable if there canvas is disabled
            virtualclass.wb[virtualclass.gObj.currWb].utility.makeCanvasDisable();
        }
    } else if (role == 'e') {
        var userId = getUserId(virtualclass.jId);
        if (userId) {
            var virtualclassCont = document.getElementById('virtualclassCont');
            virtualclassCont.classList.add('orginalTeacher');
            // sending flag as new user become educator is joined
            //virtualclass.vutil.beforeSend({
            //    'status': true,
            //    control: 'editorRich',
            //    toUser: userId,
            //    'cf': 'nEd'
            //}, userId);
            // transferControl(userId);
        }
        console.log('Member add :- join as educator');
    } else {
        console.log('Member add :- join as ' + role);
    }

    io.disconnect();

    virtualclass.vutil.overrideRoles(role);
    /**If we invoke io.init() without time(1500 miliseconds), then
     * teacher received both events member_joined and member_removed
     * at same time, only time difference is 2 or 3 miliseconds,
     * the sequence of event is incorrect member_added and user_logout ,
     * After delay some time, event sequence is correct user_logout and member_added,
     * **/
    io.init(virtualclass.uInfo);

}


function initOverrideRoleTeacher (jId){
    if (virtualclass.gObj.hasOwnProperty('doEndSession') && selfJoin(jId) && virtualclass.joinUser.role == 't') {
        overrideRoleTeacher();
    }
}

function getPosition (connectedUsers, uid){
    var index = connectedUsers.findIndex(function(o){
        return o.userid == uid;
    });
    return index;
}

var ioEventApi = {
    readyto_member_add : function (e){
        if(typeof e.joinUser == 'object' ){
            var te = {};
            var i = 0;

            for(let key in e.joinUser){
                if(wbUser.id != key){
                    console.log('Don t join');
                    te.joinUser = {key : key }
                    te.message = e.message[i];
                    te.newuser = e.newuser;
                    te.type = e.type;
                    te.user =  e.user;
                    i++;
                    this.member_added(te);
                }
            }
        } else {
            this.member_added(e);
        }
    },

    member_added : function (e){
        // console.log('===== JOIN user ' + e.message.length);
        // console.log('===== JOIN user ' + e.message);
        var sType;
        if(typeof virtualclass.connectedUsers == 'undefined'){
            virtualclass.connectedUsers = [];
        }
        // console.log('===== JOIN user member_added call ');
        if(e.hasOwnProperty('user')){
            var joinUserObj = e.message;
            virtualclass.jId = joinUserObj.userid;

            console.log('===== JOIN users ' + virtualclass.jId);


            var upos = getPosition(virtualclass.connectedUsers, virtualclass.jId);
            if(upos != -1){
                virtualclass.connectedUsers.splice(upos, 1);
            }
            virtualclass.gObj.allUserObj[virtualclass.jId] = joinUserObj;
            virtualclass.connectedUsers.push(joinUserObj);

            // Get the new joinecr user id and object
            virtualclass.joinUser = joinUserObj;

        }else if(e.hasOwnProperty('users')){

            virtualclass.jId = e.joinUser;
            console.log('===== JOIN users ' + virtualclass.jId);

            virtualclass.connectedUsers = e.message;
            for(var i = 0; i<virtualclass.connectedUsers.length; i++) {
                virtualclass.gObj.allUserObj[virtualclass.connectedUsers[i].userid] = virtualclass.connectedUsers[i];
            }
            virtualclass.joinUser = this.getJoinUser(virtualclass.connectedUsers, virtualclass.jId);

        }else {
            console.log('User packet is not receving');
        }

        // set the default value related about video quality, internet latency and frame rate
        if (virtualclass.jId == virtualclass.gObj.uid) {
            // var speed = roles.hasAdmin() ? 1 :  0;
            if (typeof virtualclass.videoHost.gObj.MYSPEED == 'undefined') {
                var speed = 1;
            } else {
                var speed = virtualclass.videoHost.gObj.MYSPEED;
            }
            virtualclass.videoHost.setDefaultValue(speed);
            virtualclass.vutil.setDefaultScroll();
        }

        // virtualclass.gObj.mySetTime = virtualclass.vutil.getMySetTime(virtualclass.connectedUsers);
        virtualclass.gObj.mySetTime = 2000;

        // console.log('Member add :- join user id ' + virtualclass.joinUser.userid + ' with ' + virtualclass.joinUser.role);
        if ((virtualclass.vutil.selfJoin(virtualclass.jId) && virtualclass.gObj.veryFirstJoin) && virtualclass.joinUser.role == 't') {
            if (virtualclass.vutil.isTeacherAlreadyExist(virtualclass.jId)) {
                virtualclass.gObj.veryFirstJoin = false;
                overrideOperation('s');
                console.log('Member add :- Join As Student');
            } else if (virtualclass.gObj.veryFirstJoin && virtualclass.vutil.isPresenterAlreadyExist(virtualclass.jId)) {
                //overrideOperation('e');

                var presenterId = virtualclass.vutil.getPresenterId();
                if (presenterId) {
                    ioAdapter.sendUser({
                        'cf': 'rpr' // remove presenter role
                    }, presenterId);

                    overrideRoleTeacher();

                } else {
                    console.log('There some problem on joining as');
                }

            } else {

                /* Clouser is used to retain the joined userid on SetTimeout */
                (function(jId){
                    setTimeout(function () {
                        joinAsTeacher(jId)
                        var wid = virtualclass.gObj.currWb;
                        if(virtualclass.pdfRender[wid] != null){
                            virtualclass.pdfRender[wid].sendScroll(); // when user Join as teacher
                        }
                    }, virtualclass.gObj.mySetTime);
                }(virtualclass.jId));

            }
            // If user try to join as Presenter OR Educator
        } else if (((virtualclass.vutil.selfJoin(virtualclass.jId) && virtualclass.gObj.veryFirstJoin))
            && (virtualclass.joinUser.role == 'p'
            && (virtualclass.vutil.isPresenterAlreadyExist(virtualclass.jId))
            || (virtualclass.joinUser.role == 'e' &&
            (virtualclass.vutil.isEducatorAlreadyExist(virtualclass.jId) || virtualclass.vutil.isOrginalTeacherExist(virtualclass.jId))))) {
            virtualclass.gObj.veryFirstJoin = false;
            overrideOperation('s');
            console.log('Member add :- join as student. Earlier was educator OR teacher');
        } else {
            // this will be the usual case:-
            defaultOperation(e, sType);
            if (isAnyOnePresenter() && virtualclass.vutil.selfJoin(virtualclass.jId) && !virtualclass.vutil.isTeacherAlreadyExist(virtualclass.jId) &&
                (virtualclass.joinUser.role == 's' || virtualclass.joinUser.role == 'p')) {
                virtualclass.vutil.createBecomeTeacherWidget();
            }
        }



        (function (jId){
            setTimeout(function (){
                initOverrideRoleTeacher(jId);
            }, virtualclass.gObj.mySetTime + 200)
        }(virtualclass.jId));


        if (isAnyOnePresenter() && (virtualclass.joinUser.role == 't' || virtualclass.joinUser.role == 'e') && virtualclass.jId != virtualclass.gObj.uid) {
            virtualclass.vutil.removeBecomeTeacherWidget();

        }
        if (roles.hasControls()) {
            virtualclass.poll.updateUsersOnPoll();
        }

        if (typeof virtualclass.quiz != 'undefined') {
            if ((virtualclass.quiz.uniqueUsers.indexOf(virtualclass.jId) < 0)) {
                virtualclass.quiz.uniqueUsers.push(virtualclass.jId);

                for (var i in io.uniquesids) {

                    if (virtualclass.quiz.uniqueUsers.indexOf(i) < 0) {
                        virtualclass.quiz.uniqueUsers.push(i);
                    }
                }
            }
        }
        if (virtualclass.joinUser.role == 's' && virtualclass.gObj.has_ts_capability){
            ioAdapter.mustSend({'uid': virtualclass.gObj.uid, ac:true, 'cf': 'tsr'});
        }

        if(virtualclass.gObj.uid != virtualclass.jId && virtualclass.gObj.meetingMode ){
            virtualclass.multiVideo.onUserJoin(virtualclass.jId);
        }

        if(!roles.hasControls()) {
            if (e.message[0].role == 't' || ((virtualclass.gObj.uid == virtualclass.jId)&& virtualclass.vutil.whoIsTeacher())) {
                var vcCont = document.querySelector("#virtualclassCont.congrea");
                if (!vcCont.classList.contains('tr_available')) {
                    vcCont.classList.add("tr_available");
                }
            }
        }
    },

    newmessage : function (e){
        var recMsg = e.message, key;
        if (recMsg.hasOwnProperty('cf')) {
            if (typeof receiveFunctions[recMsg.cf] == 'function') {
                receiveFunctions[recMsg.cf](e);
                return;
            } else {
                console.log('CF ' + recMsg.cf + ' is not a function of receiveFunctions');
            }
        }
    },

    readyto_user_logout : function (msg){
        var e = {};
        for(var uid in msg.action){
            e = {type : "user_logout", fromUser : uid,  message : 'offline'};
            virtualclass.ioEventApi.user_logout(e);
        }
    },

    user_logout : function (e){
        console.log('user_logout');
        if (isAnyOnePresenter() && !isTeacherExistWhenRemoveUser(virtualclass.connectedUsers)) {
            if (virtualclass.gObj.uRole != 't' && virtualclass.gObj.uRole != 'e') {
                virtualclass.vutil.createBecomeTeacherWidget();
            }
        }


        if(!roles.hasControls()) {
            if(!virtualclass.gObj.hasOwnProperty('whoIsTeacher')){
                virtualclass.gObj.whoIsTeacher = virtualclass.vutil.whoIsTeacher();
            }
            // if teacher is log out
            if (virtualclass.gObj.whoIsTeacher == e.fromUser) {
                var vcCont = document.querySelector("#virtualclassCont.congrea");
                if (vcCont && vcCont.classList.contains('tr_available')) {
                    vcCont.classList.remove("tr_available");
                }
            }
        }


        //virtualclass.media.video.removeUser(e.fromUser.userid);
        virtualclass.media.video.removeUser(e.fromUser);
        // TODO this should be update accordiing to new user

        if(virtualclass.chat.isTechSupportExist(e.fromUser)){
            virtualclass.chat.disableTechSupport(e.fromUser);
        }

        if ((e.fromUser.role == 't' || e.fromUser.role == 'e') && (roles.isStudent() || roles.isPresenter())) {
            localStorage.setItem('oTDisconn', true);
            disableEditor('editorRich');
            disableEditor('editorCode');
        }

        var removeUser = e.fromUser;
        delete virtualclass.gObj.allUserObj[removeUser];
        var userPos = getPosition(virtualclass.connectedUsers, removeUser);
        if(userPos !== -1){
            virtualclass.connectedUsers.splice(userPos, 1);
        }
        var e = {removeUser : removeUser};

        memberUpdateWithDelay(e, 'removed')

        if(virtualclass.gObj.meetingMode){
            virtualclass.multiVideo.onUserRemove(removeUser);
        }

        /** Update users in user list until total user is more than 500 **/
        if(virtualclass.connectedUsers.length < virtualclass.gObj.userToBeDisplay){
            virtualclass.gObj.insertUser = true;
        }
    },
    error : function (e){
        if (virtualclass.gObj.displayError) {
            virtualclass.view.removeElement('serverErrorCont');

            if (typeof e.message.stack != 'undefined') {
                virtualclass.view.displayServerError('serverErrorCont', e.message.stack);
            } else {
                console.log('Error message ' + e.message.stack + ' could not display');
            }

            if (typeof e.message !== 'object') {
                display_error(e.message.stack);
            }
        } else {
            if (typeof e.message !== 'object') {
                console.log(e.message.stack);
            }
        }
    },

    Text_Limit_Exeed : function (e){
        virtualclass.view.createErrorMsg(virtualclass.lang.getString('Text_Limit_Exeed'), 'errorContainer', 'chatWidget', {className : 'Text_Limit_Exeed'});
    },

    Binary_Limit_Exeed : function (e){
        virtualclass.view.createErrorMsg(virtualclass.lang.getString('Binary_Limit_Exeed'), 'errorContainer', 'chatWidget', {className : 'Binary_Limit_Exeed'});
    },

    Unauthenticated : function (e){
        virtualclass.view.createErrorMsg(virtualclass.lang.getString('Unauthenticated'), 'errorContainer', 'chatWidget', {className : 'Unauthenticated'});
        virtualclass.vutil.stopConnection();
    },

    Multiple_login : function (e){
        virtualclass.view.createErrorMsg(virtualclass.lang.getString('Multiple_login'), 'errorContainer', 'chatWidget', {className : 'Multiple_login'});
        virtualclass.vutil.stopConnection();
    },

    Max_rooms : function (e){
        virtualclass.view.createErrorMsg(virtualclass.lang.getString('Max_rooms'), 'errorContainer', 'chatWidget', {className : 'Max_rooms'});
    },

    Max_users : function (e){
        virtualclass.view.createErrorMsg(virtualclass.lang.getString('Max_users'), 'errorContainer', 'chatWidget', {className : 'Max_users'});
    },

    PONG : function (e){
        virtualclass.network.latency = e.timeStamp - e.message;
        virtualclass.network.initToPing(1000);
    },

    authentication_failed : function (e){
        virtualclass.chat.removeCookieUserInfo(e);
    },

    connectionclose : function (e){
        if (virtualclass.hasOwnProperty('recorder') && virtualclass.recorder.startUpload) {
            console.log("During the upload process there would not any other popup box.");
        } else {
            if (virtualclass.recorder.smallData && virtualclass.recorder.hasOwnProperty('rdlength') && virtualclass.recorder.rdlength < 100000) {
                console.log('Do not show the waiting popupbox if there small chunks of data');
            } else {
                virtualclass.popup.waitMsg();
            }
        }
        virtualclass.chat.makeUserListEmpty();
    },

    connectionopen : function (e){
        virtualclass.gObj.invalidlogin = false;
        var setTimeReady = 6000;
        // There will take more time to connect socket when teacher will
        // Come from become Teacher
        if (virtualclass.gObj.hasOwnProperty('doEndSession')) {
            console.log('From Become Teacher');
            setTimeReady = 10000;
        }
        setTimeout(
            function () {

                if (!virtualclass.vutil.sesionEndMsgBoxIsExisting() && !virtualclass.gObj.hasOwnProperty('downloadProgress') && !(virtualclass.recorder.startUpload)) {
                    virtualclass.popup.closePopup();
                    virtualclass.vutil.setDefaultScroll();
                    var popupContainer = document.getElementById('popupContainer');
                    if (popupContainer != null) {
                        popupContainer.style.display = 'none';
                    }

                    console.log('Popup box Close All');
                } else {
                    console.log('Popup box Could not close');
                }
            }, setTimeReady // Wait for everything is to be ready

        );
    },
    binrec : function (e){
        // TODO here should be eith unit8clampped array or unit8array
        var data_pack = new Uint8Array(e.message);
        switch (data_pack[0]) {
            case 102:
            case 103:
            case 104:
            case 202:
            case 203:
            case 204:
                var stype = 'ss';
                var sTool = 'ScreenShare';
                if(roles.hasControls()){
                    virtualclass.gObj.studentSSstatus.mesharing = true;
                    var virtualclassCont = document.querySelector('#virtualclassCont');
                    if(virtualclassCont != ''){
                        virtualclassCont.classList.add('studentScreenSharing');
                        /** Remove following statement after fully support of SHADOW DOM **/
                        document.querySelector('#chat_div').classList.add('studentScreenSharing');
                    }
                }

                if (!virtualclass.hasOwnProperty('studentScreen')) {
                    virtualclass.studentScreen = new studentScreen();
                }

                if(virtualclass.gObj.precheckScrn){
                    virtualclass.vutil.prechkScrnShare();
                }

                // The binary data is coming on teacher when user download the session
                // which actually should not, workaround for now

                if (!roles.hasControls() || virtualclass.gObj.studentSSstatus.mesharing) {
                    virtualclass.studentScreen.ssProcess(data_pack, e.message, stype, sTool);
                }

                if(virtualclass.gObj.studentSSstatus.sharing && roles.isStudent()){
                    var elem = document.getElementById("virtualclassScreenShareLocal");
                    if(virtualclass.gObj.studentSSstatus.shareToAll){
                        if(elem != null){
                            elem.style.display = 'block';
                        }
                    }else{
                        if(elem != null){
                            elem.style.display = 'none';
                        }
                    }
                }

                break;
            case 11:  // user video image
                virtualclass.media.video.process(e.message);
                break;
            case 21 : // teacher big video
                processImage(e.message, data_pack[1]);
        }
    },

    getJoinUser (users, uid) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].userid == uid) {
                return users[i];
            }
        }
    }

};