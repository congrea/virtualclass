// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    //virtualclass.wb = window.virtualclass.wb;

    var utility = function () {
        return {
            userIds: [],
            /**
             * This function does check that passed object is existing into
             * removeElements array or not
             * @param obj expects the object which have to be checked against removeElements
             * @returns that position if the object is existing into remove Elements
             * TODO This function is not used any more can be removed from here
             */
            isObjExistRE: function (obj) {
                if (virtualclass.wb.replay.removeElements.length >= 0) {
                    var objPos = virtualclass.wb.vcan.ArrayIndexOf(virtualclass.wb.replay.removeElements, function (pobj) {
                        return pobj.id == obj.id
                    });
                    if (objPos >= 0) {
                        return objPos;
                    }
                }
            },
            /**
             *  This function checks that particular object has property or not
             *  @obj the object should be tested that object has property or not
             *  return true if the object is empty false otherwise
             */
            IsObjEmpty: function (obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            },

            /**
             *  This function converts string to number
             *  @param expects pmdTime which has to be converted
             *  returns that converted number
             */
            stringToNumber: function (pmdTime) {
                if (pmdTime[pmdTime.length - 1] == ' ') {
                    pmdTime = pmdTime.substring(0, pmdTime.length - 1); //removing the space
                }

                pmdTime = Number(pmdTime); //converting string into number
                return pmdTime;
            },
            /***
             * this function does check that the user
             * click at very first on canvas for draw the text
             * or click outside the box for finalize the  written text
             * return true at second case false otherwise
             * at @param expects the number either it is odd or even
             */

            clickOutSidebox: function (num) {
                return (num % 2 != 1) ? true : false;
            },
            /**
             * Through this function the selected object would be deleted
             * when user press on delete button after selected particular object
             * @param evt expects key down event
             */
            keyOperation: function (evt) {
                // This is used for removed the selected object.
                //var currTime = new Date().getTime();
                //8 is used for delete on mac

                if (evt.keyCode == 8 || evt.keyCode == 46) {
                    var vcan = virtualclass.wb.vcan;
                    if (vcan.main.currObj != "") {
                        if(roles.hasControls()){ // can not remove the object when user has not control
                            console.log('Delete whiteboard obj:- Invoke the command');
                            var obj = virtualclass.wb.utility.removeSelectedItem(vcan.main.currObj);
                            virtualclass.vutil.beforeSend({'repObj': [obj], 'cf': 'repObj'});
                        }
                    }
                } else if(evt.keyCode == 27){ // escape key
                    if(typeof virtualclass.wb == 'object'){
                        virtualclass.wb.obj.drawTextObj.finalizeTextIfAny();
                    }
                }
            },

            removeSelectedItem: function (obj, notIncrement, notSave) {
                virtualclass.wb.canvas.removeObject(vcan.main.currObj);
                var currTime = new Date().getTime();

                var obj = {'mt': currTime, 'ac': 'del'};
                if (typeof notIncrement == 'undefined') {
                    virtualclass.wb.uid++;
                }

                obj.uid = virtualclass.wb.uid;

                //if (roles.isStudent()) {
                //    virtualclass.storage.store(JSON.stringify(virtualclass.wb.gObj.replayObjs));
                //} else {
                //    vcan.main.replayObjs.push(obj);
                //    virtualclass.storage.store(JSON.stringify(vcan.main.replayObjs));
                //}

                if(roles.hasControls()){
                    // we will not delete object during the replay
                    if(typeof notSave == 'undefined'){
                        console.log('Delete:- Saving the delete command with id ' + obj.uid);
                        vcan.main.replayObjs.push(obj);
                        virtualclass.storage.store(JSON.stringify(vcan.main.replayObjs));
                    }

                } else {
                    virtualclass.storage.store(JSON.stringify(virtualclass.wb.gObj.replayObjs));
                }

                vcan.main.currObj = "";
                console.log('Delete:- Removing the whitboard object');
                return obj;
            },
            /**
             *  Through this function the event handlers attaching
             *  the canvas there are three kinds of event handlers
             *  mouse down, up and move
             */
            attachEventHandlers: function () {
                virtualclass.wb.canvas.bind('mousedown', virtualclass.wb.utility.ev_canvas);
                virtualclass.wb.canvas.bind('mousemove', virtualclass.wb.utility.ev_canvas);
                virtualclass.wb.canvas.bind('mouseup', virtualclass.wb.utility.ev_canvas);
            },
            /**
             * Call the function through which
             * the canvas would be clear
             */
            t_clearallInit: function () {
                var delRpNode = true;
                virtualclass.wb.utility.clearAll(delRpNode);
            },
            /**
             * By this function  all drawn object over the canvas would be erased
             * which means the canvas would be cleared
             * @param delRpNode
             */
            clearAll: function (delRpNode, pkMode) {
                //TODO this should be done in proper way
                //virtualclass.recorder.items = [];

                virtualclass.wb.uid = 0; //this should be done with proper way
                virtualclass.wb.lt = "";
                var vcan = virtualclass.wb.vcan;
                while (vcan.main.children.length > 0) {
                    virtualclass.wb.canvas.removeObject(vcan.main.children[0]);
                }

                //removing all the elements from replayObjs
                if (delRpNode == true) {
                    /*****
                     This would I have disbaled can be critical
                     virtualclass.wb.repObj.replayObjs.splice(0, virtualclass.wb.repObj.replayObjs);
                     *****/
                    vcan.main.replayObjs.splice(0, vcan.main.replayObjs.length);
                }

                if (virtualclass.wb.replay != undefined) {
                    virtualclass.wb.replay.objNo = 0;
                }

                if (vcan.getStates('action') == 'move') {
                    vcan.setValInMain('action', 'create');
                }

                var sentPacketCont = document.getElementById('sendPackCont');
                if (sentPacketCont != null) {
                    var allDivs = sentPacketCont.getElementsByClassName('numbers');
                    if (allDivs.length > 0) {
                        for (var i = 0; i < allDivs.length; i++) {
                            allDivs[i].innerHTML = 0;
                        }
                    }
                }
               
               
                //for clear sent and received msg information
                //var sentMsgInfo = document.getElementById('sentMsgInfo');
                //if (sentMsgInfo != null) {
                //    //document.getElementById('sentMsgInfo').innerHTML  = "";
                //    sentMsgInfo.innerHTML = "";
                //}
                //
                //var receivedMsgInfo = document.getElementById('rcvdMsgInfo');
                //if (receivedMsgInfo != null) {
                //    receivedMsgInfo.innerHTML = "";
                //}
                //
                //var allTextBoxContainer = document.getElementsByClassName('textBoxContainer');
                //for (var i = 0; i < allTextBoxContainer.length; i++) {
                //    allTextBoxContainer[i].parentNode.removeChild(allTextBoxContainer[i]);
                //}

                var error = document.getElementById('serverErrorCont');
                if (error != null) {
                    error.parentNode.removeChild(error);
                    console.log('Some ERROR removed.');
                }

            },
            /**
             * By this function there would de-activating all the objects
             * which is stored into children array of vcan
             * de-activating means the particular object would not be select able
             * @returns {Boolean}
             */
            deActiveFrmDragDrop: function () {
                var vcan = virtualclass.wb.vcan;
                var allChildren = vcan.main.children;
                var currState = vcan.getStates('action');
                if (currState == 'move') {
                    vcan.setValInMain('action', 'create');
                    for (var i = 0; i < allChildren.length; i++) {
                        //allChildren[i].draggable = false;
                        allChildren[i].dragDrop(false);
                        allChildren[i].setActive(false);
                    }
                    return true;
                }
                return false;
            },

            /**
             *   This function just determines the mouse
             *   position relative to the canvas element. which means the mouse position(x, y)
             *   would counted from there where the canvas is started on browser
             *   @param evt expects the mouse event object
             *   @returns the object which has x and y co-ordination
             */
            getOffset: function (evt) {

                var el = evt.target,
                    x = y = 0;
                //getting the total mouse position from the relative element where the event is occurred
                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    x += el.offsetLeft - el.scrollLeft;
                    y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }

                x = evt.clientX - x;
                y = evt.clientY - y;
                return {x: x, y: y};
            },
            /**
             * Through this function the mouse event would called on the
             * particular object eg:- mouse down over the rectangle object
             * which means the mouse is downed/created for create the rectangle
             */
            ev_canvas: function (ev) {
                //NOTE:- this have been done during the unit testing
                var posMous = virtualclass.wb.vcan.utility.getReltivePoint(ev);
                ev.currX = posMous.x;
                ev.currY = posMous.y;

                // Here the particular function is calling according to mouse event.
                var func = virtualclass.wb.tool[ev.type];
                if (func) {
                    func(ev);
                    return this.ev_canvas;
                }
            },
            /**
             * This function does active all the object which are
             * created on canvas, after active all the object
             * they can be selectable, draggable, rotateable etc
             */
            t_activeallInit: function () {
                var vcan = virtualclass.wb.vcan;
                var allChildren = vcan.getStates('children');
                if (allChildren.length >= 1) {
                    /* TODO this should not contain here */
                    vcan.setValInMain('action', 'move');
                    for (var i = 0; i < allChildren.length; i++) {
                        allChildren[i].dragDrop(true);
                    }
                }
            },
            drawArrowImg: function (img, obj) {
                var ctx = virtualclass.wb.vcan.main.canvas.getContext('2d');
                ctx.clearRect(0, 0, virtualclass.wb.vcan.main.canvas.width, virtualclass.wb.vcan.main.canvas.height);
                vcan.renderAll();
                ctx.save();
                ctx.beginPath();
                ctx.translate(obj.mp.x, obj.mp.y);
                ctx.drawImage(img, -3, -3, 18, 24);
                ctx.closePath();
                ctx.restore();
            },
			
            //initialize transfred packets from local storage when
            // browser is reloaded.
            
			
            assignRole: function (studentId) {
                virtualclass.wb.tool = "";
                if (vcan.main.action == 'move') {
                    virtualclass.wb.utility.deActiveFrmDragDrop();
                }

                if (typeof studentId != 'undefined') {
                    if (roles.isEducator()) {
                        var cmdToolsWrapper = document.getElementById(virtualclass.gObj.commandToolsWrapperId);
                        cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
                        //localStorage.removeItem('reclaim');
                    }

                    //localStorage.removeItem('studentId');
                    //localStorage.setItem('teacherId', studentId);



                    virtualclass.gObj.uRole = 'p'; // P for Presenter
                    localStorage.setItem('uRole', virtualclass.gObj.uRole);

                    virtualclass.user.assignRole(virtualclass.gObj.uRole, virtualclass.currApp);
                    vcan.utility.canvasCalcOffset(vcan.main.canid);
                    if (virtualclass.currApp == 'Yts') {
                        virtualclass.yts.UI.inputURL();

                        virtualclass.yts.seekChangeInterval();
                    }

                } else {
//                        alert(virtualclass.currApp);
                    if (virtualclass.currApp == 'Yts') {
                        virtualclass.yts.UI.removeinputURL();
                        if (virtualclass.yts.hasOwnProperty('tsc')) {
                            clearInterval(virtualclass.yts.tsc);
                        }
                    }


                    virtualclass.gObj.uRole = 's';
                    var cmdToolsWrapper = document.getElementById(virtualclass.gObj.commandToolsWrapperId);
                    if (cmdToolsWrapper != null) {
                        while (cmdToolsWrapper.hasChildNodes()) {
                            cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
                        }
                    }

                    virtualclass.wb.utility.makeCanvasDisable();

                    if (roles.hasAdmin()) {
                        virtualclass.vutil.createReclaimButton(cmdToolsWrapper);
                        //localStorage.reclaim = true;
                        //localStorage.setItem('reclaim', true);
                        virtualclassCont = document.getElementById('virtualclassCont');
                        virtualclassCont.className = virtualclassCont.className + ' educator';

                    } else {
                        if (cmdToolsWrapper != null) {
                            cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);

                        }
                    }

                    //var tid = localStorage.getItem('teacherId');
                    //localStorage.removeItem('teacherId');
                    //localStorage.setItem('studentId', tid);

                    localStorage.setItem('uRole', virtualclass.gObj.uRole);
                    virtualclass.wb.utility.uniqueArrOfObjsToStudent();
                }

//                if (!roles.hasAdmin()) {
//                    virtualclass.vutil.toggleRoleClass(true);
//                }
            },

            reclaimRole: function () {
                virtualclass.gObj.controlAssign = false;
                virtualclass.wb.response.assignRole(virtualclass.gObj.uid, virtualclass.gObj.uid, true);
            },
            dispQueuePacket: function (result) {
                if ((roles.hasControls()) ||
                    (roles.isEducator())) {
                    virtualclass.wb.utility.toolWrapperEnable();

                }
                virtualclass.wb.drawMode = false;
                //if (localStorage.getItem('teacherId') != null && virtualclass.wb.user.connected) {
                if (roles.hasControls()) {
                    virtualclass.wb.utility.makeCanvasEnable();
                    virtualclass.wb.utility.enableAppsBar();
                }

                //if (virtualclass.wb.gObj.packQueue.length > 0) {
                //    window.virtualclass.wb.vcan.main.replayObjs = virtualclass.wb.gObj.packQueue;
                //    virtualclass.wb.gObj.packQueue = [];
                //    virtualclass.wb.toolInit('t_replay', 'fromBrowser', true, virtualclass.wb.utility.dispQueuePacket);
                //} else {
                //
                //}
            },
            // this function is not used any more
            //updateRcvdInformation: function (msg) {
            //    var receivedMsg = document.getElementById('rcvdMsgInfo');
            //    if (receivedMsg != null) {
            //        var compMsg = "";
            //        for (var key in msg) {
            //            compMsg += key + " : " + msg[key] + " <br />";
            //        }
            //        receivedMsg.innerHTML = compMsg;
            //    }
            //},
            makeCanvasDisable: function () {
                var canvasElement = vcan.main.canvas;
                canvasElement.style.position = 'relative';
                canvasElement.style.pointerEvents = "none";
            },
            makeCanvasEnable: function () {
                if (roles.hasControls()) {
                    if (!virtualclass.wb.hasOwnProperty('canvasDisable') || !virtualclass.wb.canvasDisable) {
                        var canvasElement = vcan.main.canvas;
                        canvasElement.style.pointerEvents = "visible";
                    }
                }
            },
            removeToolBox: function () {
                var cmdWrapper = document.getElementById(vcan.cmdWrapperDiv);
                cmdWrapper.parentNode.removeChild(cmdWrapper);
            },

            createReclaimButton: function (cmdToolsWrapper) {
                virtualclass.vutil.createDiv('t_reclaim', 'reclaim', cmdToolsWrapper);
                var aTags = document.getElementById('t_reclaim').getElementsByTagName('a');
                aTags[0].addEventListener('click', virtualclass.wb.objInit);
            },

            chkValueInLocalStorage: function (property) {
                if (localStorage.getItem(property) === null) {
                    return false;
                } else {
                    return localStorage[property];
                }
            },
            // The uniqueArrOfObjsToStudent and.
            // uniqueArrOfObjsToTeacher can be into sign.
            uniqueArrOfObjsToStudent: function () {
                //  alert('toStudent');
                var tempRepObjs = "";
                virtualclass.wb.gObj.replayObjs = [];
                for (var i = 0; i < vcan.main.replayObjs.length; i++) {
                    tempRepObjs = vcan.extend({}, vcan.main.replayObjs[i]);
                    virtualclass.wb.gObj.replayObjs.push(tempRepObjs);
                }
            },
            uniqueArrOfObjsToTeacher: function () {
                vcan.main.replayObjs = [];
                var tempRepObjs = "";
                for (var i = 0; i < virtualclass.wb.gObj.replayObjs.length; i++) {
                    tempRepObjs = vcan.extend({}, virtualclass.wb.gObj.replayObjs[i]);
                    vcan.main.replayObjs.push(tempRepObjs);
                }
            },
            makeDefaultValue: function (cmd) {
                if (typeof cmd == 'undefined' || cmd != 't_clearall') {
                    virtualclass.wb.utility.makeDeActiveTool();
                }

                virtualclass.wb.gObj.myrepObj = [];
                virtualclass.wb.gObj.replayObjs = [];
                virtualclass.wb.gObj.rcvdPackId = 0;
                virtualclass.wb.gObj.displayedObjId = 0;
                virtualclass.wb.gObj.packQueue = [];
                virtualclass.wb.gObj.queue = [];
                virtualclass.wb.uid = 0;

                localStorage.setItem('rcvdPackId', 0);
                //TODO this code should be removed after validate
               // localStorage.removeItem('totalStored');
                //var teacherId = virtualclass.vutil.chkValueInLocalStorage('teacherId');
                //var orginalTeacherId = virtualclass.vutil.chkValueInLocalStorage('orginalTeacherId');
                var wbrtcMsg = virtualclass.vutil.chkValueInLocalStorage('wbrtcMsg');
                var canvasDrwMsg = virtualclass.vutil.chkValueInLocalStorage('canvasDrwMsg');
                var toolHeight = virtualclass.vutil.chkValueInLocalStorage('toolHeight');
                var prvUser = JSON.parse(virtualclass.vutil.chkValueInLocalStorage('prvUser'));
                var toggleRole = JSON.parse(virtualclass.vutil.chkValueInLocalStorage('tc'));



                // TODO this should be done by proepr way
                // it has to be done in function
                virtualclass.gObj.video.audio.bufferSize = 0;
                virtualclass.gObj.video.audio.encMode = "alaw";
//                    virtualclass.gObj.video.audio.an = -1;
                virtualclass.gObj.video.audio.rec = '';
                virtualclass.gObj.video.audio.audioNodes = [];

                if (typeof vcan.objTxt != 'undefined') {
                    vcan.objTxt.removeTextNode();
                }

                if (typeof vcan.main.currentTransform != 'undefined') {
                    vcan.main.currentTransform = "";
                }

                virtualclass.gObj.video.audio.updateInfo();
            },

            clearCurrentTool: function () {
                if (virtualclass.wb.hasOwnProperty("tool")) {
                    virtualclass.wb.tool = ""
                }
            },

            //setOrginalTeacherContent: function(e) {
            setOrginalTeacherContent: function () {
                //localStorage.setItem('teacherId', virtualclass.gObj.uid); //crtical, this could be critcal
                //window.virtualclass.view.canvasDrawMsg('Canvas');
                localStorage.setItem('canvasDrwMsg', true);
                //localStorage.setItem('orginalTeacherId', virtualclass.gObj.uid);
            },

            checkWebRtcConnected: function () {
                if (typeof cthis != 'undefined') {
                    if (cthis.pc[0].hasOwnProperty('iceConnectionState') || typeof cthis.pc[0].iceConnectionState != 'undefined') {
                        return true;
                    }
                }
                return false;
            },
            createVirtualWindow: function (resolution) {
                virtualclass.wb.gObj.virtualWindow = true;
                var div = document.createElement('div');
                virtualclass.wb.utility.removeVirtualWindow('virtualWindow');
                var divId = 'virtualWindow';
                div.setAttribute('id', divId);
                var offset = vcan.main.offset;
                var drawWhiteboard = resolution;

                div.style.width = (drawWhiteboard.width) + "px";
                // div.style.width = (drawWhiteboard.width) + "px";
                if (typeof assignRoleAtStudent != 'undefined') {
                    var toolHeight = 0;
                } else {
                    var toolHeight = parseInt(localStorage.getItem('toolHeight'));
                    toolHeight = toolHeight != null ? toolHeight : 0;
                }

                if (roles.hasAdmin()) {
                    div.style.height = (drawWhiteboard.height + toolHeight) + "px";
                } else {
                    if (roles.hasControls()) {
                        div.style.height = (drawWhiteboard.height) + "px";
                    } else {
                        div.style.height = (drawWhiteboard.height - toolHeight) + "px";
                    }
                }
                var containerWhiteBoard = document.getElementById('containerWb');
                containerWhiteBoard.insertBefore(div, containerWhiteBoard.firstChild);
            },
            removeVirtualWindow: function (id) {
                var virtualWindow = document.getElementById(id);
                if (virtualWindow != null) {
                    virtualclass.wb.gObj.virtualWindow = false;
                    virtualWindow.parentNode.removeChild(virtualWindow);
                }
            },
            getWideValueAppliedByCss: function (id, attr) {
                var element = document.getElementById(id);
                if (element != null) {
                    var style = window.getComputedStyle(element);
                    if (typeof style.marginTop != 'undefined') {
                        var marginTop = parseInt(style.marginTop.match(/\d+/));
                        if (marginTop == null) {
                            marginTop = 0;
                        }
                    }
                    return (element.clientHeight + marginTop);
                } else {
                    return false;
                }
            },
            isNumber: function (num) {
                if (!isNaN(+num)) {
                    return +num;
                }
                return false;
            },
            setCommandToolHeights: function (toolHeight, operation) {
                var virDiv = document.getElementById('virtualWindow');
                if (virDiv != null) {
                    var divHeight = parseInt(virDiv.style.height.match(/\d+/));
                    if (operation == 'decrement') {
                        virDiv.style.height = (divHeight - parseInt(toolHeight)) + "px";
                    } else {
                        virDiv.style.height = (divHeight + parseInt(toolHeight)) + "px";
                    }
                }
            },
            setClass: function (elmentId, newClass) {
                var elem = document.getElementById(elmentId);
                var allClasses = elem.classList;
                var classes = "";
                if (allClasses.length > 0) {
                    if (classes.length < 2) {
                        classes = allClasses[0] + " ";
                    } else {
                        classes = allClasses.join(" ") + " ";
                    }
                }
                var classes = classes + newClass;
                elem.setAttribute('class', classes);
            },

            setStyleUserConnetion: function (currClass, newClass, whoIs) {
                var cdiv = document.getElementsByClassName(currClass)[0];
                if (cdiv != null) {
                    cdiv.setAttribute('class', newClass + ' controlCmd');
                }
            },
            existUserLikeMe: function (e) {
                if (e.fromUser.userid != wbUser.id) {
                    if (e.message.checkUser.hasOwnProperty('role')) {
                        var role = e.message.checkUser.role;
                        if (role) {
                            if (localStorage.getItem('otherRole') == null) {
                                var roles = [];
                                if (role != virtualclass.gObj.uRole) {
                                    roles.push(role);
                                } else {
                                    existUser = true;
                                    return true;
                                }
                            } else {
                                roles = JSON.parse(localStorage.getItem('otherRole'));
                                if (roles.indexOf(role) == -1) {
                                    roles.push(role);
                                }
                            }

                            if (typeof roles != 'undefined') {
                                localStorage.setItem('otherRole', JSON.stringify(roles));
                                console.log("Other Browser " + role + ' ' + e.fromUser.userid);
                            }
                        }
                        return (virtualclass.gObj.uRole == role) ? true : false;
                    }
                } else {
                    if (typeof existUser != 'undefined') {
                        return true;
                    } else {
                        var otherRoles = JSON.parse(localStorage.getItem('otherRole'));
                        if (otherRoles != null) {
                            for (var i = 0; i < otherRoles.length; i++) {
                                if (virtualclass.gObj.uRole == otherRoles[i]) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }
            },

            //TODO remove this function
            existUserWithSameId: function (e) {
                var myId = e.message.checkUser.wbUser.id;
                this.userIds.push(e.fromUser.userid);

                if (this.userIds.length > 1) {
                    var userSameId = virtualclass.wb.utility.arrayContainsSameValue(this.userIds[0], this.userIds);
                    if (userSameId) {
                        return true;
                    }
                }
            },

            //important TODO have to think tabout this function
            //makeUserAvailable: function(browerLength) {
            makeUserAvailable: function () {
                if (localStorage.getItem('repObjs') == null) {
                    virtualclass.wb.utility.toolWrapperEnable();
                    if (vcan.main.canvas != null) {
                        virtualclass.wb.utility.makeCanvasEnable();
                    }
                }
            },

            displayCanvas: function () {
                vcan.canvasWrapperId = 'canvasWrapper';
                if (document.getElementById('canvas') == null) {
                    virtualclass.wb.createCanvas();
                }

                window.virtualclass.wb.init();

                virtualclass.wb.utility.makeCanvasDisable();
                virtualclass.wb.utility.toolWrapperDisable();

                if(!roles.hasControls() && !roles.hasAdmin()){
                    if(vcan.main.children == 0){
                        virtualclass.wb.utility.createWhiteboardMessage()
                    }
                }
            },

            removeWhiteboardMessage : function (){
                var whiteBoradMsg =    document.getElementById('whiteBoardMsg');
                if(whiteBoradMsg != null){
                    whiteBoradMsg.parentNode.removeChild(whiteBoradMsg);
                }

            },

            // whitebeoard message student at very first
            createWhiteboardMessage : function (){
                var whiteboardMsgId = "whiteBoardMsg";
                if(document.getElementById(whiteboardMsgId) == null){
                    var whiteBoradMsgContainer = document.createElement('div');
                    whiteBoradMsgContainer.id = whiteboardMsgId;
                    whiteBoradMsgContainer.innerHTML = virtualclass.lang.getString('msgForWhiteboard');

                    var containerWb = document.getElementById('canvasWrapper');
                    if(containerWb != null){
                        containerWb.appendChild(whiteBoradMsgContainer);
                    }
                }
            },

            initAll: function (e) {
                if (roles.hasControls()) {
                    virtualclass.wb.utility.makeCanvasDisable();
                }
                var res = virtualclass.system.measureResoultion({
                    'width': window.outerWidth,
                    'height': window.innerHeight
                });
            },
            alreadyExistToolBar: function () {
                var rectDiv = document.getElementById('t_rectangle');
                if (rectDiv != null) {
                    var allToolDivs = rectDiv.parentNode.getElementsByClassName('tool');
                    return (allToolDivs.length >= 8) ? true : false;
                }
            },

            //toolWrapperDisable and toolWrapperEnable should be merged into one function
            toolWrapperDisable: function (innerAnchors) {
                //TODO commandToolsWrapper should be come as parameter
                var commandToolWrapper = document.getElementById('commandToolsWrapper');
                if (commandToolWrapper != null) {
                    if (typeof innerAnchors != 'undefined') {
                        var allAnchors = commandToolWrapper.getElementsByTagName('a');
                        for (var i = 0; i < allAnchors.length; i++) {
                            allAnchors[i].style.pointerEvents = "none";
                        }
                    } else {
                        var commandToolWrapper = document.getElementById('commandToolsWrapper');
                        if (commandToolWrapper != null) {
                            commandToolWrapper.style.pointerEvents = "none";
                        }
                    }
                }
            },

            //change the name with toolBoxEnable
            toolWrapperEnable: function (innerAnchors) {
                var commandToolWrapper = document.getElementById('commandToolsWrapper');
                if (commandToolWrapper != null) {
                    if (typeof innerAnchors != 'undefined') {
                        var allAnchors = commandToolWrapper.getElementsByTagName('a');
                        for (var i = 0; i < allAnchors.length; i++) {
                            allAnchors[i].style.pointerEvents = "visible";
                        }
                    } else {
                        if (commandToolWrapper != null) {
                            if (!virtualclass.gObj.hasOwnProperty('errNotDesktop')) {
                                commandToolWrapper.style.pointerEvents = "visible";
                            }
                        }
                    }
                }
            },

            replayFromLocalStroage: function (allRepObjs) {
                if (typeof (Storage) !== "undefined") {
                    if (virtualclass.storage.reclaim === false) {
                        //virtualclass.wb.utility.disableAppsBar();
                        virtualclass.vutil.disableAppsBar();
                    }

                    virtualclass.wb.utility.clearAll(false, 'dontClear');

                    virtualclass.wb.gObj.tempRepObjs = allRepObjs;

                    //virtualclass.wb.gObj.replayObjs = virtualclass.wb.gObj.replayObjs.concat(allRepObjs);

                    //virtualclass.wb.gObj.replayObjs = virtualclass.wb.gObj.replayObjs.concat(allRepObjs);


                    if (allRepObjs.length > 0) {
                        virtualclass.wb.utility.makeCanvasDisable();
                        virtualclass.wb.utility.toolWrapperDisable();
                        //virtualclass.wb.vcan.main.replayObjs = allRepObjs;

                        virtualclass.wb.utility.replayObjsByFilter(allRepObjs, 'fromBrowser');

                        // earlier it was using
                        //for(var i=0; i<allRepObjs.length; i++){
                        //    virtualclass.wb.vcan.main.replayObjs = allRepObjs[i];
                        //    virtualclass.wb.uid = allRepObjs[i].uid;
                        //    virtualclass.wb.gObj.rcvdPackId = virtualclass.wb.uid;
                        //    virtualclass.wb.toolInit('t_replay', 'fromBrowser', true, virtualclass.wb.utility.dispQueuePacket);
                        //}
                    }
                }
            },

            setUserStatus: function (storageHasTeacher, storageHasReclaim) {
                //TODO storageHasTeacher check with null rather than style of now.
                if (!storageHasTeacher && !storageHasReclaim) {
                    virtualclass.wb.utility.removeToolBox();
                    virtualclass.wb.utility.setClass('vcanvas', 'student');
                } else {
                    virtualclass.wb.utility.setClass('vcanvas', 'teacher');
                }
            },
            crateCanvasDrawMesssage: function () {
                //if (typeof localStorage.teacherId != 'undefined') {
                if (roles.hasControls()) {
                    if (localStorage.getItem('canvasDrwMsg') == null) {
                        window.virtualclass.view.canvasDrawMsg('Canvas');
                        window.virtualclass.view.drawLabel('drawArea');
                        localStorage.canvasDrwMsg = true;
                    }
                }
            },

            //important can be critical
            //                canvasEnabelWhenRefresh: function() {
            //                    if (localStorage.getItem('teacherId') != null) {
            //                        virtualclass.wb.utility.makeCanvasEnable();
            //                    }
            //                },
            arrayContainsSameValue: function (val, ids) {
                for (var i = 0; i < ids.length; i++) {
                    if (ids[i] !== val) {
                        return false;
                    }
                }
                return true;
            },

            actionAfterRemovedUser: function () {
                virtualclass.wb.utility.makeCanvasDisable();
                virtualclass.wb.utility.setStyleUserConnetion('con', 'coff');
                virtualclass.wb.utility.removeVirtualWindow('virtualWindow');
                virtualclass.wb.user.connected = false;
                localStorage.removeItem('otherRole');

                if (typeof cthis != 'undefined') {
                    tempIsInitiaor = true;
                    if (cthis.isStarted) {
                        cthis.handleRemoteHangup();
                    }
                }
            },


            sendRequest: function () {
                virtualclass.vutil.beforeSend({'reclaimRole': true, 'cf': 'reclaimRole'});
            },
            updateSentInformation: function (jobj, createArrow) {
                if (roles.hasAdmin()) {
                    var sentObj = JSON.parse(jobj);
                    if (typeof createArrow != 'undefined') {
                        var msg = sentObj;
                    } else {
                        var msg = sentObj.repObj[0];
                    }

                    var compMsg = "";
                    for (var key in msg) {
                        compMsg += key + " : " + msg[key] + " <br />";
                    }
                    if (document.getElementById('sentMsgInfo') != null) {
                        document.getElementById('sentMsgInfo').innerHTML = compMsg;
                    }
                }
            },
            /**
             * the operation before send infor to server
             * @param {type} msg
             * @returns {undefined}
             */
            //audioSend: function (msg, adStatus) {
            //    if (virtualclass.gObj.audMouseDown && io.sock.readyState == 1) {
            //        var uid = breakintobytes(virtualclass.gObj.uid, 8);
            //        var scode = new Int8Array([101, uid[0], uid[1], uid[2], uid[3]]); // Status Code Audio
            //        var sendmsg = new Int8Array(msg.length + scode.length);
            //        sendmsg.set(scode);
            //        sendmsg.set(msg, scode.length); // First element is status code (101)
            //        io.sendBinary(sendmsg);
            //        virtualclass.gObj.video.audio.setAudioStatus(adStatus);
            //    } else {
            //        virtualclass.gObj.video.audio.setAudioStatus("stop");
            //    }
            //},

            /**
             * TODO this function should validate either it's using or not
             * because beforeSend on utility.js is using now
             *
             *
             */

            /**
             * the operation before send message to server
             * @param {type} msg
             * @returns {undefined}
             */
            beforeSend: function (msg, toUser) {

                // when we are in replay mode we don't need send the object to other user
//                    if(wbUser.virtualclassPlay != ' ' || wbUser.virtualclassPlay != false){
//                        return;
//                    }
                if (msg.hasOwnProperty('createArrow')) {
                    var jobj = JSON.stringify(msg);
                    virtualclass.wb.vcan.optimize.sendPacketWithOptimization(jobj, io.sock.readyState, 100);
                } else {
                    if (msg.hasOwnProperty('repObj')) {
                        if (typeof (msg.repObj[msg.repObj.length - 1]) == 'undefined') {
                            return;
                        }
                        virtualclass.wb.gObj.rcvdPackId = msg.repObj[msg.repObj.length - 1].uid;



                        virtualclass.wb.gObj.displayedObjId = virtualclass.wb.gObj.rcvdPackId;
                    }
                    var jobj = JSON.stringify(msg);

                  //  virtualclass.wb.sentPackets = virtualclass.wb.sentPackets + jobj.length;
                    if (io.sock.readyState == 1) {

                        typeof toUser == 'undefined' ? ioAdapter.mustSend(msg) : ioAdapter.mustSendUser(msg, toUser);

                    }

                    //TODO this should be enable
                    var tempObj = JSON.parse(jobj);
                    if (tempObj.hasOwnProperty('repObj')) {
                        virtualclass.wb.utility.updateSentInformation(jobj);
                    }
                }
            //    localStorage.sentPackets = virtualclass.wb.sentPackets;
            },

            checkCanvasHasParents: function () {
                var currentTag = document.getElementById("vcanvas");
                while (currentTag.parentNode.tagName != 'BODY') {
                    if (currentTag.id != "vcanvas") {
                        currentTag.style.margin = "0";
                        currentTag.style.padding = "0";
                    }
                    currentTag = currentTag.parentNode;
                }
                if (currentTag.id != 'vcanvas') {
                    currentTag.style.margin = "0";
                    currentTag.style.padding = "0";
                }
            },

            //TODO lockvirtualclass should be lockWhiteboard
            lockvirtualclass: function () {
                if (window.earlierWidth != window.innerWidth) {
                    virtualclass.wb.canvasDisable = true;
                    virtualclass.wb.utility.makeCanvasDisable();
                    virtualclass.wb.utility.toolWrapperDisable();
                    virtualclass.vutil.disableAppsBar();
                    if (document.getElementById('divForReloadMsg') == null) {

                        var label = (roles.hasControls()) ? 'msgForReload' : 'msgStudentForReload';
                        window.virtualclass.view.displayMsgBox('divForReloadMsg', label);
                        //fix me earlierWidth and innerwidth are same
                        window.earlierWidth = window.innerWidth;

                    }
                }
            },
            getElementRightOffSet: function (element) {
                var rightOffSet = 20;
                //if whiteboard has right sidebar
                if (element.parentNode != null) {
                    var elemContainer = element.parentNode;
                    var offset = vcan.utility.getElementOffset(elemContainer);
                    //WARNING 50 can be dangerous.
                    //var rspace  = (window.earlierWidth != window.innerWidth)  ? 25 : 40;.
                    var rspace = 0;
                    rightOffSet = window.innerWidth - (elemContainer.clientWidth + (offset.x - rspace));
                }
                return rightOffSet;
            },

            // important todo
            // this should be remove not used any where
            objPutInContainer: function (obj) {
                vcan.main.replayObjs.push(obj);
                //localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
                virtualclass.storage.store(JSON.stringify(vcan.main.replayObjs));
            },

            //removeClassFromElement: function (prvTool, className) {
            //    if (prvTool != "t_reclaim") {
            //        var prvTool = document.getElementById(prvTool).className;
            //        var classes = prvTool.split(" ");
            //        var retClass = [];
            //        for (var i = 0; i < classes.length; i++) {
            //            if (classes[i] != className) {
            //                retClass.push(classes[i]);
            //            }
            //        }
            //        if (retClass.length > 1) {
            //            return retClass.join(" ");
            //        } else {
            //            return retClass[0];
            //        }
            //    }
            //},

            makeActiveTool: function (byReload) {
                var tag = document.getElementById(byReload);
                var classes;
                if (virtualclass.wb.hasOwnProperty('prvTool') && virtualclass.wb.prvTool != "t_reclaim") {

                    //classes = virtualclass.wb.utility.removeClassFromElement(virtualclass.wb.prvTool, "active");
                    classes = virtualclass.vutil.removeClassFromElement(virtualclass.wb.prvTool, "active");

                    document.getElementById(virtualclass.wb.prvTool).className = classes;
                } else {
                    classes = tag.className;
                    //classes =  this.parentNode.className;
                }
                tag.className = classes + " active";
                localStorage.activeTool = tag.id;
            },

            makeDeActiveTool: function () {
                virtualclass.wb.tool = "";//unselect any selected tool

                var toolsWrapper = document.getElementById("commandToolsWrapper");
                var activeTool = document.getElementsByClassName('tool active');
                //alert(activeTool.length);
                if (activeTool.length > 0) {
                    activeTool[0].classList.remove('active');
                }

            },

            createAudioTransmitIcon: function (userId) {
                var iconElem = document.cteateElement('div');
                iconElem.id = "audioTransmit" + uuserId;
                iconElem.className = 'audioTransmit';
                var controlCont = document.getElementById(userId + "ControlContainer");

            },
            //todo, this shoudl be into user file
            _reclaimRole: function () {
                virtualclass.wb.utility.reclaimRole();
                virtualclass.wb.utility.sendRequest();
                virtualclass.user.control.changeAttrToAssign('enable');
            },

            //TODO this should be at virtualclass.js
            enableAppsBar: function () {
                var appBarCont = document.getElementById('virtualclassOptionsCont');
                if (appBarCont != null) {
                    appBarCont.style.pointerEvents = "visible";
                }
            },

            replayObjsByFilter : function (repObjs, fromBrowser){
                for(var i=0; i < repObjs.length; i++){
                    virtualclass.wb.bridge.makeQueue(repObjs[i]);
                    if (repObjs[i].uid  ==  virtualclass.wb.gObj.displayedObjId + 1) {
                        virtualclass.wb.uid = repObjs[i].uid;
                        this.executeWhiteboardData(repObjs[i]);
                        if(typeof fromBrowser != 'undefined'){
                            virtualclass.wb.gObj.rcvdPackId = virtualclass.wb.uid;
                        }
                    } else {
                        console.log('Could not display whiteboard object with ' + repObjs[i].uid);
                       // virtualclass.wb.bridge.makeQueue(repObjs[i]);
                    }
                }
                console.log('Whiteboard Stored ID ' + virtualclass.wb.gObj.replayObjs[virtualclass.wb.gObj.replayObjs.length-1].uid);
                virtualclass.storage.store(JSON.stringify(virtualclass.wb.gObj.replayObjs));
            },

            executeWhiteboardData  :  function (objToDisplay){
                console.log('received uid ' + objToDisplay.uid);
                virtualclass.wb.gObj.replayObjs.push(objToDisplay);
                virtualclass.wb.response.replayObj([objToDisplay]);
                this.checkNextQueue(objToDisplay);
            },

            checkNextQueue : function (playedObj){
                var foundObj = this.findPacketInQueue(playedObj);
                if(foundObj){
                    this.executeWhiteboardData(foundObj);
                }
            },

            findPacketInQueue : function (playedObj){
                if(virtualclass.wb.gObj.queue.hasOwnProperty(playedObj.uid + 1)){
                    return virtualclass.wb.gObj.queue[playedObj.uid + 1];
                } else {
                    console.log("Packet" + (playedObj.uid + 1) +  "not found ");
                }

                return false;
            }



        };
    };

    //function breakintobytes(val, l) {
    //    var numstring = val.toString();
    //    for (var i = numstring.length; i < l; i++) {
    //        numstring = '0' + numstring;
    //    }
    //    var parts = numstring.match(/[\S]{1,2}/g) || [];
    //    return parts;
    //}

    window.utility = utility;
})(window);