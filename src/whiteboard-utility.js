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
                var id = virtualclass.gObj.currWb;
                if (virtualclass.wb[id].replay.removeElements.length >= 0) {
                    var objPos = virtualclass.wb[id].vcan.ArrayIndexOf(virtualclass.wb[id].replay.removeElements, function (pobj) {
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
                var id = virtualclass.gObj.currWb;
                // This is used for removed the selected object.
                //var currTime = new Date().getTime();
                //8 is used for delete on mac

                if (evt.keyCode == 8 || evt.keyCode == 46) {
                    var vcan = virtualclass.wb[id].vcan;
                    if (vcan.main.currObj != "") {
                        if (roles.hasControls()) { // can not remove the object when user has not control
                            console.log('Delete whiteboard obj:- Invoke the command');
                            var obj = virtualclass.wb[id].utility.removeSelectedItem(vcan.main.currObj);
                            virtualclass.vutil.beforeSend({'repObj': [obj], 'cf': 'repObj'});
                        }
                    }
                } else if (evt.keyCode == 27) { // escape key
                    if ((virtualclass.currApp == "Whiteborad" || virtualclass.currApp == "DocumentShare") && typeof virtualclass.wb[id] == 'object') {
                        virtualclass.wb[id].obj.drawTextObj.finalizeTextIfAny();
                    }
                }
            },

            removeSelectedItem: function (obj, notIncrement, notSave) {
                var id = virtualclass.gObj.currWb;
                var vcan = virtualclass.wb[id].vcan;
                virtualclass.wb[id].canvas.removeObject(vcan.main.currObj);
                var currTime = new Date().getTime();

                var obj = {'mt': currTime, 'ac': 'del'};
                if (typeof notIncrement == 'undefined') {
                    virtualclass.wb[id].uid++;
                }

                obj.uid = virtualclass.wb[id].uid;

                if (roles.hasControls()) {
                    // we will not delete object during the replay
                    if (typeof notSave == 'undefined') {
                        console.log('Delete:- Saving the delete command with id ' + obj.uid);
                        vcan.main.replayObjs.push(obj);
                        virtualclass.storage.store(JSON.stringify(vcan.main.replayObjs));
                    }

                } else {
                    virtualclass.storage.store(JSON.stringify(virtualclass.wb[id].gObj.replayObjs));
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
            attachEventHandlers: function (id) {
                virtualclass.wb[id].canvas.bind('mousedown', virtualclass.wb[id].utility.ev_canvas);
                virtualclass.wb[id].canvas.bind('mousemove', virtualclass.wb[id].utility.ev_canvas);
                virtualclass.wb[id].canvas.bind('mouseup', virtualclass.wb[id].utility.ev_canvas);
                virtualclass.wb[id].canvas.bind('touchstart', virtualclass.wb[id].utility.ev_canvas);
                virtualclass.wb[id].canvas.bind('touchmove', virtualclass.wb[id].utility.ev_canvas);
                virtualclass.wb[id].canvas.bind('touchend', virtualclass.wb[id].utility.ev_canvas);
            },
            /**
             * Call the function through which
             * the canvas would be clear
             */
            t_clearallInit: function () {
                virtualclass.wb[virtualclass.gObj.currWb].currStrkSize = virtualclass.gObj.defalutStrk;
                virtualclass.wb[virtualclass.gObj.currWb].textFontSize = virtualclass.gObj.defalutFont;
                virtualclass.wb[virtualclass.gObj.currWb].activeToolColor = virtualclass.gObj.defaultcolor;
                var delRpNode = true;
                virtualclass.wb[virtualclass.gObj.currWb].utility.clearAll(delRpNode);
            },
            /**
             * By this function  all drawn object over the canvas would be erased
             * which means the canvas would be cleared
             * @param delRpNode
             */
            clearAll: function (delRpNode, pkMode) {
                var wid = virtualclass.gObj.currWb;
                console.log('Whiteboard clear ' + wid);
                //TODO this should be done in proper way
                //virtualclass.recorder.items = [];

                virtualclass.wb[wid].uid = 0; //this should be done with proper way
                virtualclass.wb[wid].lt = "";
                var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                while (vcan.main.children.length > 0) {
                    virtualclass.wb[wid].canvas.removeObject(vcan.main.children[0]);
                }

                //removing all the elements from replayObjs
                if (delRpNode == true) {
                    /*****
                     This would I have disbaled can be critical
                     virtualclass.wb[virtualclass.gObj.currWb].repObj.replayObjs.splice(0, virtualclass.wb[virtualclass.gObj.currWb].repObj.replayObjs);
                     *****/
                    vcan.main.replayObjs.splice(0, vcan.main.replayObjs.length);
                }

                if (virtualclass.wb[wid].replay != undefined) {
                    virtualclass.wb[wid].replay.objNo = 0;
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

                var error = document.getElementById('serverErrorCont');
                if (error != null) {
                    error.parentNode.removeChild(error);
                    console.log('Some ERROR removed.');
                }

                virtualclass.vutil.removeAllTextWrapper();

                virtualclass.wb[virtualclass.gObj.currWb].currStrkSize = virtualclass.gObj.defalutStrk;
                virtualclass.wb[virtualclass.gObj.currWb].textFontSize = virtualclass.gObj.defalutFont;
                virtualclass.wb[virtualclass.gObj.currWb].activeToolColor = virtualclass.gObj.defaultcolor;

            },
            /**
             * By this function there would de-activating all the objects
             * which is stored into children array of vcan
             * de-activating means the particular object would not be select able
             * @returns {Boolean}
             */
            deActiveFrmDragDrop: function () {
                var wid = virtualclass.gObj.currWb;
                var vcan = virtualclass.wb[wid].vcan;
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
                var wbId = virtualclass.gObj.currWb;
                //NOTE:- this have been done during the unit testing
                var posMous = virtualclass.wb[wbId].vcan.utility.getReltivePoint(ev);
                ev.currX = posMous.x;
                ev.currY = posMous.y;

                // Here the particular function is calling according to mouse event.
                var func = virtualclass.wb[wbId].tool[ev.type];
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
                var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
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
                var wid = virtualclass.gObj.currWb;
                var vcan = virtualclass.wb[wid].vcan;
                var ctx = vcan.main.canvas.getContext('2d');
                ctx.clearRect(0, 0, vcan.main.canvas.width, vcan.main.canvas.height);
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
                var wid = virtualclass.gObj.currWb;
                virtualclass.wb[wid].tool = "";
                if (vcan.main.action == 'move') {
                    virtualclass.wb[wid].utility.deActiveFrmDragDrop();
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

                    virtualclass.wb[wid].utility.makeCanvasDisable();

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

                    localStorage.setItem('uRole', virtualclass.gObj.uRole);
                    virtualclass.wb[wid].utility.uniqueArrOfObjsToStudent();
                }

            },

            reclaimRole: function () {
                var wid = virtualclass.gObj.currWb;
                virtualclass.gObj.controlAssign = false;
                virtualclass.wb[wid].response.assignRole(virtualclass.gObj.uid, virtualclass.gObj.uid, true);
            },
            dispQueuePacket: function (result) {
                var wid = virtualclass.gObj.currWb;
                if ((roles.hasControls()) ||
                    (roles.isEducator())) {
                    virtualclass.wb[wid].utility.toolWrapperEnable();

                }
                virtualclass.wb[wid].drawMode = false;
                if (roles.hasControls()) {
                    virtualclass.wb[wid].utility.makeCanvasEnable();
                    virtualclass.wb[wid].utility.enableAppsBar();
                }
            },

            makeCanvasDisable: function () {
                var wid = virtualclass.gObj.currWb;
                var vcan = virtualclass.wb[wid].vcan
                var canvasElement = vcan.main.canvas;
                //   canvasElement.style.position = 'relative';
                canvasElement.style.pointerEvents = "none";
            },
            makeCanvasEnable: function () {
                var wid = virtualclass.gObj.currWb;
                var vcan = virtualclass.wb[wid].vcan
                // debugger;
                if (roles.hasControls()) {
                    if (!virtualclass.wb[wid].hasOwnProperty('canvasDisable') || !virtualclass.wb[wid].canvasDisable) {
                        var canvasElement = vcan.main.canvas;
                        canvasElement.style.pointerEvents = "visible";
                    }
                }
            },
            removeToolBox: function (id) {
                var cmdWrapper = document.getElementById('commandToolsWrapper' + id);
                cmdWrapper.parentNode.removeChild(cmdWrapper);
            },

            createReclaimButton: function (cmdToolsWrapper) {
                var wid = virtualclass.gObj.currWb;
                virtualclass.vutil.createDiv('t_reclaim', 'reclaim', cmdToolsWrapper);
                var aTags = document.getElementById('t_reclaim').getElementsByTagName('a');
                aTags[0].addEventListener('click', virtualclass.wb[wid].objInit);
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
                var wid = virtualclass.gObj.currWb;
                var vcan = virtualclass.wb[wid].vcan;
                //  alert('toStudent');
                var tempRepObjs = "";
                virtualclass.wb[wid].gObj.replayObjs = [];
                for (var i = 0; i < vcan.main.replayObjs.length; i++) {
                    tempRepObjs = vcan.extend({}, vcan.main.replayObjs[i]);
                    virtualclass.wb[wid].gObj.replayObjs.push(tempRepObjs);
                }
            },
            uniqueArrOfObjsToTeacher: function () {
                var wid = virtualclass.gObj.currWb;
                var vcan = virtualclass.wb[wid].vcan;
                vcan.main.replayObjs = [];
                var tempRepObjs = "";
                for (var i = 0; i < virtualclass.wb[wid].gObj.replayObjs.length; i++) {
                    tempRepObjs = vcan.extend({}, virtualclass.wb[wid].gObj.replayObjs[i]);
                    vcan.main.replayObjs.push(tempRepObjs);
                }
            },
            makeDefaultValue: function (cmd) {
                // console.log('Whiteboard re-init queue');
                var wid = virtualclass.gObj.currWb;

                if (typeof cmd == 'undefined' || cmd != 't_clearall') {
                    virtualclass.wb[wid].utility.makeDeActiveTool();
                }

                virtualclass.wb[wid].gObj.myrepObj = [];
                virtualclass.wb[wid].gObj.replayObjs = [];
                virtualclass.wb[wid].gObj.rcvdPackId = 0;
                virtualclass.wb[wid].gObj.displayedObjId = 0;
                virtualclass.wb[wid].gObj.packQueue = [];
                virtualclass.wb[wid].gObj.queue = [];
                virtualclass.wb[wid].uid = 0;

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
                virtualclass.media.audio.bufferSize = 0;
                virtualclass.media.audio.encMode = "alaw";
                virtualclass.media.audio.rec = '';
                virtualclass.media.audio.audioNodes = [];

                var vcan = virtualclass.wb[wid].vcan;

                if (typeof vcan.objTxt != 'undefined') {
                    vcan.objTxt.removeTextNode();
                }

                if (typeof vcan.main.currentTransform != 'undefined') {
                    vcan.main.currentTransform = "";
                }

                virtualclass.media.audio.updateInfo();
            },

            clearCurrentTool: function () {
                var wid = virtualclass.gObj.currWb;
                if (virtualclass.wb[wid].hasOwnProperty("tool")) {
                    virtualclass.wb[wid].tool = ""
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
                var wid = virtualclass.gObj.currWb;

                virtualclass.wb[wid].gObj.virtualWindow = true;
                var div = document.createElement('div');
                virtualclass.wb[wid].utility.removeVirtualWindow('virtualWindow');
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
                var wid = virtualclass.gObj.currWb;
                var virtualWindow = document.getElementById(id);
                if (virtualWindow != null) {
                    virtualclass.wb[wid].gObj.virtualWindow = false;
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
                var wid = virtualclass.gObj.currWb;
                var myId = e.message.checkUser.wbUser.id;
                this.userIds.push(e.fromUser.userid);

                if (this.userIds.length > 1) {
                    var userSameId = virtualclass.wb[wid].utility.arrayContainsSameValue(this.userIds[0], this.userIds);
                    if (userSameId) {
                        return true;
                    }
                }
            },

            //important TODO have to think tabout this function
            //makeUserAvailable: function(browerLength) {
            makeUserAvailable: function () {
                var wid = virtualclass.gObj.currWb;
                if (localStorage.getItem('repObjs') == null) {
                    virtualclass.wb[wid].utility.toolWrapperEnable();
                    if (vcan.main.canvas != null) {
                        virtualclass.wb[wid].utility.makeCanvasEnable();
                    }
                }
            },

            displayCanvas: function (id) {
                var vcan = virtualclass.wb[id].vcan;

                vcan.canvasWrapperId = 'canvasWrapper' + id;
                if (document.getElementById('canvas' + id) == null) {
                    virtualclass.wb[id].createCanvas(id);
                }

                window.virtualclass.wb[id].init(id);


                virtualclass.wb[id].utility.makeCanvasDisable();
                virtualclass.wb[id].utility.toolWrapperDisable();

                if (!roles.hasControls() && !roles.hasAdmin()) {
                    if (vcan.main.children == 0) {
                        //     virtualclass.wb[id].utility.createWhiteboardMessage()
                    }
                }
                if (!roles.hasControls() && virtualclass.currApp == "Whiteboard") {
                    if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
                        virtualclass.wbCommon.indexNav.studentWBPagination(virtualclass.gObj.currSlide);
                    }
                }

            },

            removeWhiteboardMessage: function () {
                var whiteBoradMsg = document.getElementById('whiteBoardMsg');
                if (whiteBoradMsg != null) {
                    whiteBoradMsg.parentNode.removeChild(whiteBoradMsg);
                }

            },

            // whitebeoard message student at very first
            createWhiteboardMessage: function () {
                var whiteboardMsgId = "whiteBoardMsg";
                if (document.getElementById(whiteboardMsgId) == null) {
                    var whiteBoradMsgContainer = document.createElement('div');
                    whiteBoradMsgContainer.id = whiteboardMsgId;
                    whiteBoradMsgContainer.innerHTML = virtualclass.lang.getString('msgForWhiteboard');

                    var containerWb = document.getElementById('canvasWrapper' + virtualclass.gObj.currWb);
                    if (containerWb != null) {
                        containerWb.appendChild(whiteBoradMsgContainer);
                    }
                }
            },

            initAll: function (e) {
                var wid = virtualclass.gObj.currWb;
                if (roles.hasControls()) {
                    virtualclass.wb[wid].utility.makeCanvasDisable();
                }
                var res = virtualclass.system.measureResoultion({
                    'width': window.outerWidth,
                    'height': window.innerHeight
                });
            },
            alreadyExistToolBar: function (id) {
                var rectDiv = document.getElementById('t_rectangle' + id);
                if (rectDiv != null) {
                    var allToolDivs = rectDiv.parentNode.getElementsByClassName('tool');
                    return (allToolDivs.length >= 4) ? true : false;
                }
                return false;
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
                // alert('Replay from local storage');
                console.log('PDF, Whiteboard is intializing');
                // console.log('Whiteboard from local storage last Object ' + allRepObjs[allRepObjs.length - 1].uid);

                var wid = virtualclass.gObj.currWb;
                if (typeof (Storage) !== "undefined") {
                    if (virtualclass.storage.reclaim === false) {
                        //virtualclass.wb[virtualclass.gObj.currWb].utility.disableAppsBar();
                        virtualclass.vutil.disableAppsBar();
                    }
                    virtualclass.wb[wid].utility.clearAll(false, 'dontClear');
                    virtualclass.wb[wid].gObj.tempRepObjs = allRepObjs;


                    if (allRepObjs.length > 0) {
                        virtualclass.wb[wid].utility.makeCanvasDisable();
                        virtualclass.wb[wid].utility.toolWrapperDisable();
                        virtualclass.wb[wid].gObj.displayedObjId = 0;
                        virtualclass.wb[wid].utility.replayObjsByFilter(allRepObjs, 'fromBrowser');
                    }
                }
            },

            setUserStatus: function (storageHasTeacher, storageHasReclaim) {
                var wid = virtualclass.gObj.currWb;
                //TODO storageHasTeacher check with null rather than style of now.
                if (!storageHasTeacher && !storageHasReclaim) {
                    virtualclass.wb[wid].utility.removeToolBox(wid);
                    virtualclass.wb[wid].utility.setClass('vcanvas', 'student');
                } else {

                    virtualclass.wb[wid].utility.setClass('vcanvas', 'teacher');
                }
            },
            crateCanvasDrawMesssage: function (id) {
                //if (typeof localStorage.teacherId != 'undefined') {
                if (roles.hasControls()) {
                    if (localStorage.getItem('canvasDrwMsg') == null) {
                        //window.virtualclass.view.canvasDrawMsg('Canvas', id);
                        // window.virtualclass.view.drawLabel('drawArea', id);
                        localStorage.canvasDrwMsg = true;
                    }
                }
            },

            arrayContainsSameValue: function (val, ids) {
                for (var i = 0; i < ids.length; i++) {
                    if (ids[i] !== val) {
                        return false;
                    }
                }
                return true;
            },

            actionAfterRemovedUser: function () {
                var wid = virtualclass.gObj.currWb;
                virtualclass.wb[wid].utility.makeCanvasDisable();
                virtualclass.wb[wid].utility.setStyleUserConnetion('con', 'coff');
                virtualclass.wb[wid].utility.removeVirtualWindow('virtualWindow');
                virtualclass.wb[wid].user.connected = false;
                wb[wid]
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
             * the operation before send message to server
             * @param {type} msg
             * @returns {undefined}
             */
            beforeSend: function (msg, toUser) {
                var wid = virtualclass.gObj.currWb;
                if (msg.hasOwnProperty('createArrow')) {
                    var jobj = JSON.stringify(msg);
                    virtualclass.wb[wid].vcan.optimize.sendPacketWithOptimization(jobj, 300);
                } else {
                    if (msg.hasOwnProperty('repObj')) {
                        if (typeof (msg.repObj[msg.repObj.length - 1]) == 'undefined') {
                            return;
                        }
                        virtualclass.wb[wid].gObj.rcvdPackId = msg.repObj[msg.repObj.length - 1].uid;


                        virtualclass.wb[wid].gObj.displayedObjId = virtualclass.wb[wid].gObj.rcvdPackId;
                    }
                    var jobj = JSON.stringify(msg);

                    //  virtualclass.wb[virtualclass.gObj.currWb].sentPackets = virtualclass.wb[virtualclass.gObj.currWb].sentPackets + jobj.length;
                    if (io.webSocketConnected()) {

                        typeof toUser == 'undefined' ? ioAdapter.mustSend(msg) : ioAdapter.mustSendUser(msg, toUser);

                    }

                    //TODO this should be enable
                    var tempObj = JSON.parse(jobj);
                    if (tempObj.hasOwnProperty('repObj')) {
                        virtualclass.wb[wid].utility.updateSentInformation(jobj);
                    }
                }
                //    localStorage.sentPackets = virtualclass.wb[virtualclass.gObj.currWb].sentPackets;
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

                var wid = virtualclass.gObj.currWb;
                if (window.earlierWidth != window.innerWidth) {
                    virtualclass.wb[wid].canvasDisable = true;
                    virtualclass.wb[wid].utility.makeCanvasDisable();
                    virtualclass.wb[wid].utility.toolWrapperDisable();
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

            makeActiveTool: function (byReload) {
                var wid = virtualclass.gObj.currWb;
                var tag = document.getElementById(byReload);
                var classes;
                if (virtualclass.wb[wid].hasOwnProperty('prvTool') && virtualclass.wb[wid].prvTool != "t_reclaim" + wid) {

                    //classes = virtualclass.wb[virtualclass.gObj.currWb].utility.removeClassFromElement(virtualclass.wb[virtualclass.gObj.currWb].prvTool, "active");
                    classes = virtualclass.vutil.removeClassFromElement(virtualclass.wb[wid].prvTool, "active");

                    document.getElementById(virtualclass.wb[wid].prvTool).className = classes;
                    virtualclass.wb[wid].utility.themeColorShapes(byReload);
                } else {
                    classes = tag.className;
                    virtualclass.wb[wid].utility.themeColorShapes(byReload);
                    //classes =  this.parentNode.className;
                }
                tag.className = classes + " active";
                localStorage.activeTool = tag.id;
            },

            themeColorShapes: function (byReload) {
                var tool = byReload.split(/_doc_*/)[0];
                var shapesElem = document.querySelector("#tool_wrapper" + virtualclass.gObj.currWb + ".shapesToolbox");
                if (tool == "t_line" || tool == "t_oval" || tool == "t_rectangle" || tool == "t_triangle") {
                    shapesElem.classList.add("active");
                } else {
                    shapesElem.classList.remove("active");
                }
            },

            makeDeActiveTool: function () {
                var wid = virtualclass.gObj.currWb;
                virtualclass.wb[wid].tool = "";//unselect any selected tool

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
                var wid = virtualclass.gObj.currWb;
                virtualclass.wb[wid].utility.reclaimRole();
                virtualclass.wb[wid].utility.sendRequest();
                virtualclass.user.control.changeAttrToAssign('enable');
            },

            //TODO this should be at virtualclass.js
            enableAppsBar: function () {
                var appBarCont = document.getElementById('virtualclassOptionsCont');
                if (appBarCont != null) {
                    appBarCont.style.pointerEvents = "visible";
                }
            },

            replayObjsByFilter: function (repObjs, fromBrowser) {
                var wid = virtualclass.gObj.currWb;
                for (var i = 0; i < repObjs.length; i++) {
                    virtualclass.wb[wid].bridge.makeQueue(repObjs[i]);

                    if (repObjs[i].hasOwnProperty("cmd")) {
                        if (roles.hasControls()) {
                            var tool = repObjs[i].cmd.slice(2, repObjs[i].cmd.length);
                            var currentShapeTool = document.querySelector("#" + "tool_wrapper" + wid);
                            var shapesElem = document.querySelector("#tool_wrapper" + virtualclass.gObj.currWb + ".shapesToolbox");
                            if (tool == "triangle" || tool == "line" || tool == "oval" || tool == "rectangle") {
                                document.querySelector("#shapeIcon" + wid + " a").dataset.title = tool.charAt(0).toUpperCase() + tool.slice(1);
                                currentShapeTool.dataset.currtool = tool;
                                shapesElem.classList.add("active");
                            } else {
                                document.querySelector("#shapeIcon" + wid + " a").dataset.title = "Shapes";
                                currentShapeTool.dataset.currtool = "shapes";
                                shapesElem.classList.remove("active");
                            }
                        }
                    } else if (repObjs[i].hasOwnProperty("color")) {
                        virtualclass.wb[wid].activeToolColor = repObjs[i].color;
                        if (roles.hasControls()) {
                            document.querySelector("#t_color" + wid + " .disActiveColor").style.backgroundColor = virtualclass.wb[wid].activeToolColor;
                            virtualclass.wb[wid].utility.selectElem("#colorList" + wid, repObjs[i].elem);
                        }
                    } else if (repObjs[i].hasOwnProperty("strkSize")) {
                        virtualclass.wb[wid].currStrkSize = repObjs[i].strkSize;
                        if (roles.hasControls()) {
                            document.querySelector("#t_strk" + wid + " ul").dataset.stroke = virtualclass.wb[wid].currStrkSize;
                            virtualclass.wb[wid].utility.selectElem("#t_strk" + wid, repObjs[i].elem);
                        }
                    } else if (repObjs[i].hasOwnProperty("fontSize")) {
                        virtualclass.wb[wid].textFontSize = repObjs[i].fontSize;
                        if (roles.hasControls()) {
                            document.querySelector("#t_font" + wid + " ul").dataset.font = virtualclass.wb[wid].textFontSize;
                            virtualclass.wb[wid].utility.selectElem("#t_font" + wid, repObjs[i].elem);
                        }
                    }

                    if (repObjs[i].uid == virtualclass.wb[wid].gObj.displayedObjId + 1) {
                        virtualclass.wb[wid].uid = repObjs[i].uid;
                        this.executeWhiteboardData(repObjs[i]);
                        if (typeof fromBrowser != 'undefined') {
                            virtualclass.wb[wid].gObj.rcvdPackId = virtualclass.wb[wid].uid;
                        }
                    }
                }
                // console.log('Whiteboard Stored ID ' + virtualclass.wb[wid].gObj.replayObjs[virtualclass.wb[wid].gObj.replayObjs.length-1].uid);
                if (virtualclass.wb[wid].gObj.replayObjs.length > 0) {
                    // console.log('Whiteboard saving storage ' + repObjs[repObjs.length-1].uid);
                    virtualclass.storage.store(JSON.stringify(virtualclass.wb[wid].gObj.replayObjs));
                }
                //  virtualclass.storage.store(JSON.stringify(virtualclass.wb[wid].gObj.replayObjs));
                if (roles.hasControls()) {
                    var fontTool = document.querySelector("#t_font" + wid);
                    var strkTool = document.querySelector("#t_strk" + wid);
                    if (virtualclass.wb[wid].tool.cmd == "t_text" + wid) {
                        if (fontTool.classList.contains("hide")) {
                            fontTool.classList.remove("hide");
                            fontTool.classList.add("show");
                        }
                        strkTool.classList.add("hide");
                    } else {
                        if (!fontTool.classList.contains("hide")) {
                            fontTool.classList.add("hide");
                        }
                    }
                }
            },

            selectElem: function (selector, value) {
                var Elem = document.querySelector(selector + " .selected");
                if (Elem != null) {
                    Elem.classList.remove('selected');
                }
                var selectedItem = document.querySelector(selector + " #" + value);
                if (selectedItem != null) {
                    selectedItem.classList.add("selected");
                }
            },

            executeWhiteboardData: function (objToDisplay) {
                var wid = virtualclass.gObj.currWb;
                // console.log('Whiteboard executed uid ' + objToDisplay.uid);
                virtualclass.wb[wid].gObj.replayObjs.push(objToDisplay);
                virtualclass.wb[wid].response.replayObj([objToDisplay]);
                this.checkNextQueue(objToDisplay);
            },

            checkNextQueue: function (playedObj) {
                var foundObj = this.findPacketInQueue(playedObj);
                if (foundObj) {
                    this.executeWhiteboardData(foundObj);
                }
            },

            findPacketInQueue: function (playedObj) {
                var wid = virtualclass.gObj.currWb;
                if (playedObj.hasOwnProperty("color")) {
                    virtualclass.wb[wid].activeToolColor = playedObj.color;
                } else if (playedObj.hasOwnProperty("strkSize")) {
                    virtualclass.wb[wid].currStrkSize = playedObj.strkSize;
                } else if (playedObj.hasOwnProperty("fontSize")) {
                    virtualclass.wb[wid].textFontSize = playedObj.fontSize;
                }

                if (virtualclass.wb[wid].gObj.queue.hasOwnProperty(playedObj.uid + 1)) {
                    return virtualclass.wb[wid].gObj.queue[playedObj.uid + 1];
                } else {
                    //console.log("Whiteboard Packet is " + (playedObj.uid + 1) +  " is not found in queue");
                }

                return false;
            },


            putScrollWithCevent: function (e) {
                var e = this.scaleCordinate(e);
                return e;
            },

            scaleCordinate: function (ev) {
                ev.detail.cevent.x = ev.detail.cevent.x * virtualclass.zoom.canvasScale;
                ev.detail.cevent.y = ev.detail.cevent.y * virtualclass.zoom.canvasScale;
                return ev;
            },

            scaleMoveCordinate: function (obj) {
                obj.x = ev.detail.cevent.x / virtualclass.zoom.canvasScale;
                obj.y = ev.detail.cevent.y / virtualclass.zoom.canvasScale;
                return obj;
            }
        };
    };
    window.utility = utility;
})(window);