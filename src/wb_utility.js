// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        //vApp.wb = window.vApp.wb;
        
        var utility = function (){
            return {
                userIds: [],
                /**
                 * This function does check that passed object is existing into 
                 * removeElements array or not
                 * @param obj expects the object which have to be checked against removeElements
                 * @returns that position if the object is existing into remove Elements
                 * TODO This function is not used any more can be removed from here 
                 */
                isObjExistRE: function(obj) {
                    if (vApp.wb.replay.removeElements.length >= 0) {
                        var objPos = vApp.wb.vcan.ArrayIndexOf(vApp.wb.replay.removeElements, function(pobj) {
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
                IsObjEmpty: function(obj) {
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
                stringToNumber: function(pmdTime) {
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

                clickOutSidebox: function(num) {
                    return (num % 2 != 1) ? true : false;
                },
                
                
                
                /**
                 * Through this function the selected object would be deleted
                 * when user press on delete button after selected particular object
                 * @param evt expects key down event
                 */
                keyOperation: function(evt) {
                    // This is used for removed the selected object.
                    //var currTime = new Date().getTime();
                    //8 is used for delete on mac 
                    if (evt.keyCode == 8 || evt.keyCode == 46) {
                        var vcan = vApp.wb.vcan;
                        if (vcan.main.currObj != "") {
                            var obj = vApp.wb.utility.removeSelectedItem(vcan.main.currObj);
                            vApp.wb.utility.beforeSend({'repObj': [obj]});
                        }
                    }
                },
                
                removeSelectedItem : function (obj, notIncrement){
                    vApp.wb.canvas.removeObject(vcan.main.currObj);
                    var currTime = new Date().getTime();
                    
                    var obj = {'mt': currTime, 'ac': 'del'};
                    if(typeof notIncrement == 'undefined'){
                        vApp.wb.uid++;
                    }
                    
                    obj.uid = vApp.wb.uid;
                    
                    if(vApp.gObj.uRole == 's'){
                        vApp.storage.store(JSON.stringify(vApp.wb.gObj.replayObjs));
                    }else{
                        vcan.main.replayObjs.push(obj);
                        vApp.storage.store(JSON.stringify(vcan.main.replayObjs));
                    }

                    vcan.main.currObj = "";
                    return obj;
                },
                /**
                 *  Through this function the event handlers attaching  
                 *  the canvas there are three kinds of event handlers
                 *  mouse down, up and move
                 */
                attachEventHandlers: function() {
                    vApp.wb.canvas.bind('mousedown', vApp.wb.utility.ev_canvas);
                    vApp.wb.canvas.bind('mousemove', vApp.wb.utility.ev_canvas);
                    vApp.wb.canvas.bind('mouseup', vApp.wb.utility.ev_canvas);
                },
                /**
                 * Call the function through which     
                 * the canvas would be clear
                 */
                t_clearallInit: function() {
                    var delRpNode = true;
                    vApp.wb.utility.clearAll(delRpNode);
                   // if (localStorage.repObjs) {
                        //localStorage.clear();
                        //alert('suman bogati');
                        //debugger;
                    //}
                },
                /**
                 * By this function  all drawn object over the canvas would be erased   
                 * which means the canvas would be cleared
                 * @param delRpNode
                 */
                clearAll: function(delRpNode, pkMode) {
                    //TODO this should be done in proper way
                    //vApp.recorder.items = [];
                    
                    vApp.wb.uid = 0; //this should be done with proper way
                    vApp.wb.lt = "";
                    var vcan = vApp.wb.vcan;
                    while (vcan.main.children.length > 0) {
                        vApp.wb.canvas.removeObject(vcan.main.children[0]);
                    }

                    //removing all the elements from replayObjs
                    if (delRpNode == true) {
                        /*****
                         This would I have disbaled can be critical
                         vApp.wb.repObj.replayObjs.splice(0, vApp.wb.repObj.replayObjs);
                         *****/
                        vcan.main.replayObjs.splice(0, vcan.main.replayObjs.length);
                    }

                    if (vApp.wb.replay != undefined) {
                        vApp.wb.replay.objNo = 0;
                    }

                    if (vcan.getStates('action') == 'move') {
                        vcan.setValInMain('action', 'create');
                    }

                    var sentPacketCont = document.getElementById('sendPackCont');
                    if (sentPacketCont != null) {
                        var allDivs = sentPacketCont.getElementsByClassName('numbers')
                        if (allDivs.length > 0) {
                            for (var i = 0; i < allDivs.length; i++) {
                                allDivs[i].innerHTML = 0;
                            }
                        }
                    }
                    if (typeof pkMode == 'undefined') {
                        vApp.wb.sentPackets = 0;
                        vApp.wb.receivedPackets = 0;
                    }

                    //for clear sent and received msg information
                    var sentMsgInfo = document.getElementById('sentMsgInfo');
                    if (sentMsgInfo != null) {
                        //document.getElementById('sentMsgInfo').innerHTML  = "";
                        sentMsgInfo.innerHTML = "";
                    }

                    var receivedMsgInfo = document.getElementById('rcvdMsgInfo');
                    if (receivedMsgInfo != null) {
                        receivedMsgInfo.innerHTML = "";
                    }

                    var allTextBoxContainer = document.getElementsByClassName('textBoxContainer');
                    for (var i = 0; i < allTextBoxContainer.length; i++) {
                        allTextBoxContainer[i].parentNode.removeChild(allTextBoxContainer[i]);
                    }

                },
                /**
                 * By this function there would de-activating all the objects
                 * which is stored into children array of vcan
                 * de-activating means the particular object would not be select able 
                 * @returns {Boolean}
                 */
                deActiveFrmDragDrop: function() {
                    var vcan = vApp.wb.vcan;
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
                getOffset: function(evt) {

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
                ev_canvas: function(ev) {
                    //NOTE:- this have been done during the unit testing
                    var posMous = vApp.wb.vcan.utility.getReltivePoint(ev);
                    ev.currX = posMous.x;
                    ev.currY = posMous.y;

                    // Here the particular function is calling according to mouse event.
                    var func = vApp.wb.tool[ev.type];
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
                t_activeallInit: function() {
                    var vcan = vApp.wb.vcan;
                    var allChildren = vcan.getStates('children');
                    if (allChildren.length >= 1) {
                        /* TODO this should not contain here */
                        vcan.setValInMain('action', 'move');
                        for (var i = 0; i < allChildren.length; i++) {
                            allChildren[i].dragDrop(true);
                        }
                    }
                },
                drawArrowImg: function(img, obj) {
                    var ctx = vApp.wb.vcan.main.canvas.getContext('2d');
                    ctx.clearRect(0, 0, vApp.wb.vcan.main.canvas.width, vApp.wb.vcan.main.canvas.height);
                    vcan.renderAll();
                    ctx.save();
                    ctx.beginPath();
                    ctx.translate(obj.mp.x, obj.mp.y);
                    ctx.drawImage(img, -3, -3, 18, 24);
                    ctx.closePath();
                    ctx.restore();
                },
                calcPsSentPackets: function(oldData) {
                    if (vApp.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                        var pacPerSec = vApp.wb.sentPackets - oldData;
                        if (pacPerSec < 0) {
                            pacPerSec = 0;
                        }
                        if(document.getElementById(vApp.wb.sentPackDivPS != null)){
                            document.getElementById(vApp.wb.sentPackDivPS).innerHTML = pacPerSec;
                        }
                        return vApp.wb.sentPackets;
                    }

                },
                calcPsRecvdPackets: function(oldData2) {
                    var pacPerSec = vApp.wb.receivedPackets - oldData2;
                    if (pacPerSec < 0) {
                        pacPerSec = 0;
                    }
                    if(document.getElementById(vApp.wb.receivedPackDivPS) != null){
                        document.getElementById(vApp.wb.receivedPackDivPS).innerHTML = pacPerSec;
                    }
                    return vApp.wb.receivedPackets;
                },
                //initialize transfred packets from local storage when
                // browser is reloaded.
                initStoredPacketsNumbers: function() {
                    if (vApp.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                        if (localStorage.sentPackets) {
                            var totSentPackets = JSON.parse(localStorage.sentPackets);
                            vApp.wb.sentPackets = totSentPackets;
                            if(document.getElementById(vApp.wb.sentPackDiv) != null){
                                document.getElementById(vApp.wb.sentPackDiv).innerHTML = totSentPackets;
                            }
                        }

                        if (localStorage.receivedPackets) {
                            vApp.wb.receivedPackets = JSON.parse(localStorage.receivedPackets);
                            if(document.getElementById(vApp.wb.receivedPackDiv) != null){
                                document.getElementById(vApp.wb.receivedPackDiv).innerHTML = vApp.wb.receivedPackets;
                            }
                        }
                    }
                },
                updateSentPackets: function(obj) {
                    if (vApp.wb.dataInfo == 1) {
                        if (vApp.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                            vApp.wb.sentPackets = vApp.wb.sentPackets + JSON.stringify(obj).length;
                            if(document.getElementById(vApp.wb.sentPackDiv) != null){
                                document.getElementById(vApp.wb.sentPackDiv).innerHTML = vApp.wb.sentPackets;
                            }
                        }
                    }
                },
                assignRole: function(studentId) {
                    vApp.wb.tool = "";
                    if (vcan.main.action == 'move') {
                        vApp.wb.utility.deActiveFrmDragDrop();
                    }
                    if (typeof studentId != 'undefined') {
                        if (localStorage.getItem('reclaim') != null) {
                            var cmdToolsWrapper = document.getElementById(vApp.wb.commandToolsWrapperId);
                            cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
                            localStorage.removeItem('reclaim');
                        }

                        localStorage.removeItem('studentId');
                        localStorage.setItem('teacherId', studentId);
                        
                        vApp.gObj.uRole = 't';
                        
                        vApp.user.assignRole(vApp.gObj.uRole, vApp.currApp);
                        vcan.utility.canvasCalcOffset(vcan.main.canid);
                        
                    } else {
                        vApp.gObj.uRole  = 's';
                        var cmdToolsWrapper = document.getElementById(vApp.wb.commandToolsWrapperId);
                        if (cmdToolsWrapper != null) {
                            while (cmdToolsWrapper.hasChildNodes()) {
                                cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
                            }
                        }

                        vApp.wb.utility.makeCanvasDisable();

                        if (typeof localStorage.orginalTeacherId != 'undefined') {
                            vApp.wb.utility.createReclaimButton(cmdToolsWrapper);
                            //localStorage.reclaim = true;
                            localStorage.setItem('reclaim', true);
                        } else {
                            if (cmdToolsWrapper != null) {
                                cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
                            }
                        }
                        
                        var tid = localStorage.getItem('teacherId');
                        localStorage.removeItem('teacherId');
                        localStorage.setItem('studentId', tid);
                         
                        vApp.wb.utility.uniqueArrOfObjsToStudent();

                    }
                },
                
                reclaimRole : function (){
                    vApp.wb.response.assignRole(vApp.gObj.uid , vApp.gObj.uid, true);
                },
                dispQueuePacket: function(result) {
                    if ((localStorage.getItem('teacherId') != null) ||
                            (localStorage.getItem('orginalTeacherId') != null && vApp.vutil.chkValueInLocalStorage('reclaim'))) {
                        vApp.wb.utility.toolWrapperEnable();
							
                    }
                    vApp.wb.drawMode = false;
                    //if (localStorage.getItem('teacherId') != null && vApp.wb.user.connected) {
                    if (localStorage.getItem('teacherId') != null) {
                        vApp.wb.utility.makeCanvasEnable();
                        vApp.wb.utility.enableAppsBar();
                    }
                    if (vApp.wb.gObj.packQueue.length > 0) {
                        window.vApp.wb.vcan.main.replayObjs = vApp.wb.gObj.packQueue;
                        vApp.wb.gObj.packQueue = [];
                        vApp.wb.toolInit('t_replay', 'fromBrowser', true, vApp.wb.utility.dispQueuePacket);
                    } else {
                        return;
                    }
                },
                updateRcvdInformation: function(msg) {
                    var receivedMsg = document.getElementById('rcvdMsgInfo');
                    if (receivedMsg != null) {
                        var compMsg = "";
                        for (var key in msg) {
                            compMsg += key + " : " + msg[key] + " <br />";
                        }
                        receivedMsg.innerHTML = compMsg;
                    }
                },
                makeCanvasDisable: function() {
                    var canvasElement = vcan.main.canvas;
                    canvasElement.style.position = 'relative';
                    canvasElement.style.pointerEvents = "none";
                },
                makeCanvasEnable: function() {
                    
                    if (localStorage.getItem('teacherId') != null) {
                        if(!vApp.wb.hasOwnProperty('canvasDisable') || !vApp.wb.canvasDisable){
                            var canvasElement = vcan.main.canvas;
                            canvasElement.style.pointerEvents = "visible";
                        }
                    }
                },
                removeToolBox: function() {
                    var cmdWrapper = document.getElementById(vcan.cmdWrapperDiv);
                    cmdWrapper.parentNode.removeChild(cmdWrapper);
                },
                createReclaimButton: function(cmdToolsWrapper) {
                    vApp.wb.createDiv('t_reclaim', 'reclaim',  cmdToolsWrapper);
                    var aTags = document.getElementById('t_reclaim').getElementsByTagName('a');
                    aTags[0].addEventListener('click', vApp.wb.objInit);
                },
                chkValueInLocalStorage: function(property) {
                    if (localStorage.getItem(property) === null) {
                        return false;
                    } else {
                        return localStorage[property];
                    }
                },
                // The uniqueArrOfObjsToStudent and.
                // uniqueArrOfObjsToTeacher can be into sign.
                uniqueArrOfObjsToStudent: function() {
                  //  alert('toStudent');
                    var tempRepObjs = "";
                    vApp.wb.gObj.replayObjs = [];
                    for (var i = 0; i < vcan.main.replayObjs.length; i++) {
                        tempRepObjs = vcan.extend({}, vcan.main.replayObjs[i]);
                        vApp.wb.gObj.replayObjs.push(tempRepObjs);
                    }
                },
                uniqueArrOfObjsToTeacher: function() {
                    vcan.main.replayObjs = [];
                    var tempRepObjs = "";
                    for (var i = 0; i < vApp.wb.gObj.replayObjs.length; i++) {
                        tempRepObjs = vcan.extend({}, vApp.wb.gObj.replayObjs[i]);
                        vcan.main.replayObjs.push(tempRepObjs);
                    }
                },
                makeDefaultValue: function() {
                    vApp.wb.gObj.myrepObj = [];
                    vApp.wb.gObj.replayObjs = [];
                    vApp.wb.gObj.rcvdPackId = 0;
                    vApp.wb.gObj.displayedObjId = 0;
                    vApp.wb.gObj.packQueue = [];
                    vApp.wb.uid = 0;

                    var teacherId = vApp.vutil.chkValueInLocalStorage('teacherId');
                    var orginalTeacherId = vApp.vutil.chkValueInLocalStorage('orginalTeacherId');
                    var wbrtcMsg = vApp.vutil.chkValueInLocalStorage('wbrtcMsg');
                    var canvasDrwMsg = vApp.vutil.chkValueInLocalStorage('canvasDrwMsg');
                    var toolHeight = vApp.vutil.chkValueInLocalStorage('toolHeight');
                    var prvUser = JSON.parse(vApp.vutil.chkValueInLocalStorage('prvUser'));
        
                    localStorage.clear();
                    vApp.recorder.items = [];
                    
                    // TODO this should be done by proepr way
                    // it has to be done in function
                    vApp.gObj.video.audio.bufferSize = 0;
                    vApp.gObj.video.audio.encMode = "alaw";
//                    vApp.gObj.video.audio.an = -1;
                    vApp.gObj.video.audio.rec = '';
                    vApp.gObj.video.audio.audioNodes = [];
                    
                    if(typeof prvUser == 'object'){
                        localStorage.setItem('prvUser', JSON.stringify(prvUser))
                    }
                    if (teacherId) {
                        localStorage.setItem('teacherId', teacherId);
                    }

                    if (orginalTeacherId) {
                        localStorage.setItem('orginalTeacherId', orginalTeacherId);
                    }

                    if (wbrtcMsg) {
                        localStorage.setItem('wbrtcMsg', wbrtcMsg);
                    }

                    if (canvasDrwMsg) {
                        localStorage.setItem('canvasDrwMsg', canvasDrwMsg);
                    }

                    if (toolHeight) {
                        localStorage.setItem('toolHeight', toolHeight);
                    }

                    if (typeof vcan.objTxt != 'undefined') {
                        vcan.objTxt.removeTextNode();
                    }

                    if (typeof vcan.main.currentTransform != 'undefined') {
                        vcan.main.currentTransform = "";
                    }

                    vApp.gObj.video.audio.updateInfo();
                },
                //setOrginalTeacherContent: function(e) {
                setOrginalTeacherContent: function() {
                    localStorage.setItem('teacherId', vApp.gObj.uid);
                    window.vApp.wb.view.canvasDrawMsg('Canvas');
                    localStorage.setItem('canvasDrwMsg', true);
                    if (!vApp.wb.utility.alreadyExistPacketContainer()) {
                        if (parseInt(wbUser.dataInfo, 10) == 1) {
                            vApp.wb.packContainer.createPacketContainer();
                            vApp.wb.packContainer.createPacketInfoContainer();
                            vApp.wb.utility.initStoredPacketsNumbers();
                        }
                    }
                    localStorage.setItem('orginalTeacherId', vApp.gObj.uid);
                },
                initDefaultInfo: function(role) {
//                    if(vApp.gObj.sessionClear){
//                       localStorage.clear();
//                    }
                    
                    if (role == 't') {
                        if (localStorage.getItem('orginalTeacherId') == null) {
                            //vApp.wb.utility.setOrginalTeacherContent(e);
                            vApp.wb.utility.setOrginalTeacherContent();
                            window.vApp.wb.attachToolFunction(vcan.cmdWrapperDiv, true);
                        }
                        //} else if (role == 's' && newuser == null) {
                    }else if (role == 's') {
                        vcan.studentId = wbUser.id;
                        
//                        alert('suman bogati');
//                        debugger;
                        
                        if (localStorage.getItem('studentId') == null && localStorage.getItem('teacherId') == null) {
                            localStorage.setItem('studentId', wbUser.id);
                        }
                    }

                    vApp.gObj.video.init();
                    vApp.gObj.video.isInitiator = true;
                    vcan.oneExecuted = false;
                },
                checkWebRtcConnected: function() {
                    if (typeof cthis != 'undefined') {
                        if (cthis.pc[0].hasOwnProperty('iceConnectionState') || typeof cthis.pc[0].iceConnectionState != 'undefined') {
                            return true;
                        }
                    }
                    return false;
                },
                createVirtualWindow: function(resolution) {
                    vApp.wb.gObj.virtualWindow = true;
                    var div = document.createElement('div');
                    vApp.wb.utility.removeVirtualWindow('virtualWindow');
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

                    if (localStorage.getItem('orginalTeacherId') != null) {
                        div.style.height = (drawWhiteboard.height + toolHeight) + "px";
                    } else {
                        if (localStorage.getItem('teacherId') != null) {
                            div.style.height = (drawWhiteboard.height) + "px";
                        } else {
                            div.style.height = (drawWhiteboard.height - toolHeight) + "px";
                        }
                    }
                    var containerWhiteBoard = document.getElementById('containerWb');
                    containerWhiteBoard.insertBefore(div, containerWhiteBoard.firstChild);
                },
                removeVirtualWindow: function(id) {
                    var virtualWindow = document.getElementById(id);
                    if (virtualWindow != null) {
                        vApp.wb.gObj.virtualWindow = false;
                        virtualWindow.parentNode.removeChild(virtualWindow);
                    }
                },
                getWideValueAppliedByCss: function(id, attr) {
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
                isNumber: function(num) {
                    if (!isNaN(+num)) {
                        return +num;
                    }
                    return false;
                },
                setCommandToolHeights: function(toolHeight, operation) {
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
                setClass: function(elmentId, newClass) {
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
                
                setStyleUserConnetion: function(currClass, newClass, whoIs) {
                    var cdiv = document.getElementsByClassName(currClass)[0];
                    if (cdiv != null){
                            cdiv.setAttribute('class', newClass + ' controlCmd');
                        }
                },
                existUserLikeMe: function(e) {
                    if (e.fromUser.userid != wbUser.id) {
                        if (e.message.checkUser.hasOwnProperty('role')) {
                            var role = e.message.checkUser.role;
                            if (role) {
                                if (localStorage.getItem('otherRole') == null) {
                                    var roles = [];
                                    if (role != vApp.gObj.uRole) {
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
                            return (vApp.gObj.uRole == role) ? true : false;
                        }
                    } else {
                        if (typeof existUser != 'undefined') {
                            return true;
                        } else {
                            var otherRoles = JSON.parse(localStorage.getItem('otherRole'));
                            if (otherRoles != null) {
                                for (var i = 0; i < otherRoles.length; i++) {
                                    if (vApp.gObj.uRole == otherRoles[i]) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        }
                    }
                },
                existUserWithSameId: function(e) {
                    var myId = e.message.checkUser.wbUser.id;
                    this.userIds.push(e.fromUser.userid);

                    if (this.userIds.length > 1) {
                        var userSameId = vApp.wb.utility.arrayContainsSameValue(this.userIds[0], this.userIds);
                        if (userSameId) {
                            return true;
                        }
                    }
                },
                
                //important TODO have to think tabout this function
                //makeUserAvailable: function(browerLength) {
                makeUserAvailable: function() {
                    if (localStorage.getItem('repObjs') == null) {
                        vApp.wb.utility.toolWrapperEnable();
                        if (vcan.main.canvas != null) {
                            vApp.wb.utility.makeCanvasEnable();
                        }
                    }
                },
                displayCanvas: function() {
                    vcan.canvasWrapperId = 'canvasWrapper';
                    if (document.getElementById('canvas') == null) {
                        vApp.wb.createCanvas();
                    }
                    
                    window.vApp.wb.init();
                    
                    vApp.wb.utility.makeCanvasDisable();
                    vApp.wb.utility.toolWrapperDisable();
                    
                },
                initAll: function(e) {
                    if (localStorage.getItem('teacherId') != null) {
                        vApp.wb.utility.makeCanvasDisable();
                    }
                    var res = vApp.system.measureResoultion({'width': window.outerWidth, 'height': window.innerHeight});
                },
                alreadyExistToolBar: function() {
                    var rectDiv = document.getElementById('t_rectangle');
                    if (rectDiv != null) {
                        var allToolDivs = rectDiv.parentNode.getElementsByClassName('tool');
                        return (allToolDivs.length >= 8) ? true : false;
                    }
                },
                alreadyExistPacketContainer: function() {
                    var packDiv = document.getElementById('packetContainer');
                    var infoDiv = document.getElementById('informationCont');

                    if (packDiv.getElementsByTagName('div').length >= 2 || infoDiv.getElementsByTagName('div').length >= 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
               
                //toolWrapperDisable and toolWrapperEnable should be merged into one function
                toolWrapperDisable: function(innerAnchors) {
                    //TODO commandToolsWrapper should be come as parameter
                    var commandToolWrapper = document.getElementById('commandToolsWrapper');  
                    if(commandToolWrapper != null){
                        if(typeof innerAnchors != 'undefined'){
                            var allAnchors = commandToolWrapper.getElementsByTagName('a');
                            for(var i=0; i<allAnchors.length; i++){
                                allAnchors[i].style.pointerEvents = "none";
                            }
                        }else{
                            var commandToolWrapper = document.getElementById('commandToolsWrapper');
                            if (commandToolWrapper != null) {
                                commandToolWrapper.style.pointerEvents = "none";
                            }
                        }
                    }
                },
                
                //change the name with toolBoxEnable
                toolWrapperEnable: function(innerAnchors) {
                    var commandToolWrapper = document.getElementById('commandToolsWrapper');
                    if(commandToolWrapper != null){
                        if(typeof innerAnchors != 'undefined'){
                            var allAnchors = commandToolWrapper.getElementsByTagName('a');
                            for(var i=0; i<allAnchors.length; i++){
                                allAnchors[i].style.pointerEvents = "visible";
                            }
                        }else{
                            if (commandToolWrapper != null) {
                                commandToolWrapper.style.pointerEvents = "visible";
                            }
                        }
                    }
                },
                
                replayFromLocalStroage : function(allRepObjs) {
                    if (typeof (Storage) !== "undefined") {
                        if(vApp.storage.reclaim === false){
                            //vApp.wb.utility.disableAppsBar();
                            vApp.vutil.disableAppsBar();
                        }
                        vApp.wb.vcan.main.replayObjs = allRepObjs;
                        vApp.wb.utility.clearAll(false, 'dontClear');
                        vApp.wb.gObj.replayObjs = vApp.wb.gObj.replayObjs.concat(allRepObjs);

                        if (allRepObjs.length > 0) {
                            vApp.wb.utility.makeCanvasDisable()
                            vApp.wb.utility.toolWrapperDisable();

                            vApp.wb.uid = allRepObjs[allRepObjs.length - 1].uid;
                            vApp.wb.gObj.rcvdPackId = vApp.wb.uid;
                            vApp.wb.toolInit('t_replay', 'fromBrowser', true, vApp.wb.utility.dispQueuePacket);
                        }
                   }
                },
                
                setUserStatus: function(storageHasTeacher, storageHasReclaim) {
                    //TODO storageHasTeacher check with null rather than style of now.
                    if (!storageHasTeacher && !storageHasReclaim) {
                        vApp.wb.utility.removeToolBox();
                        vApp.wb.utility.setClass('vcanvas', 'student');
                    } else {
                        vApp.wb.utility.setClass('vcanvas', 'teacher');
                    }
                },
                crateCanvasDrawMesssage: function() {
                    if (typeof localStorage.teacherId != 'undefined') {
                        if (localStorage.getItem('canvasDrwMsg') == null) {
                            window.vApp.wb.view.canvasDrawMsg('Canvas');
                            window.vApp.wb.view.drawLabel('drawArea');
                            localStorage.canvasDrwMsg = true;
                        }
                    }
                },
                removeOtherUserExist: function(role) {
                    if (role == 't') { //If i am teacher
                        if (localStorage.getItem('studentId') != null) {
                            localStorage.removeItem('studentId');
                        }
                    } else if (role == 's') { //If i am student
                        if (localStorage.getItem('orginalTeacherId') != null) {
                            localStorage.removeItem('orginalTeacherId');
                            if (localStorage.getItem('teacherId') != null) {
                                localStorage.removeItem('teacherId');
                                //vApp.wb.utility.removeToolBox();
                            }
                            if(localStorage.getItem('reclaim') != null){
                                localStorage.removeItem('reclaim');
                            }
                            vApp.wb.utility.removeToolBox();
                        }
                    }
                },
//important can be critical
//                canvasEnabelWhenRefresh: function() {
//                    if (localStorage.getItem('teacherId') != null) {
//                        vApp.wb.utility.makeCanvasEnable();
//                    }
//                },
                arrayContainsSameValue: function(val, ids) {
                    for (var i = 0; i < ids.length; i++) {
                        if (ids[i] !== val) {
                            return false;
                        }
                    }
                    return true;
                },
                
                actionAfterRemovedUser: function() {
                    vApp.wb.utility.makeCanvasDisable();
                    
                    vApp.wb.utility.setStyleUserConnetion('con', 'coff');
                    vApp.wb.utility.removeVirtualWindow('virtualWindow');
                    vApp.wb.user.connected = false;
                    localStorage.removeItem('otherRole');

                    if (typeof cthis != 'undefined') {
                        tempIsInitiaor = true;
                        if (cthis.isStarted) {
                            cthis.handleRemoteHangup();
                        }
                    }
                },
                
                sendRequest: function(msg, value) {
                    vApp.wb.utility.beforeSend({'reclaimRole': true});
                },
                updateSentInformation: function(jobj, createArrow) {
                    if (vApp.vutil.chkValueInLocalStorage('orginalTeacherId')) {
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
                        if(document.getElementById('sentMsgInfo') != null){
                            document.getElementById('sentMsgInfo').innerHTML = compMsg;
                        }
                    }
                },
                /**
                 * the operation before send infor to server
                 * @param {type} msg
                 * @returns {undefined}
                 */
                  audioSend : function (msg){
                    var scode = new Int8Array( [ 101 ] ); // Status Code Audio
                    var sendmsg = new Int8Array(msg.length + scode.length);
                    sendmsg.set(scode);
                    sendmsg.set(msg, scode.length); // First element is status code (101)
                        if (io.sock.readyState == 1) {
                            if(vApp.gObj.audMouseDown){
                                io.sendBinary(sendmsg);
                            }
                        }
                },
                /**
                 * the operation before send infor to server
                 * @param {type} msg
                 * @returns {undefined}
                 */
                beforeSend : function (msg){
                    
                    if (msg.hasOwnProperty('createArrow')) {
                        var jobj = JSON.stringify(msg);
                        vApp.wb.vcan.optimize.sendPacketWithOptimization(jobj, io.sock.readyState, 100);
                    } else {
                        
                        if(msg.hasOwnProperty('repObj')){
                            vApp.wb.gObj.rcvdPackId =  msg.repObj[msg.repObj.length -1].uid;
                            vApp.wb.gObj.displayedObjId = vApp.wb.gObj.rcvdPackId;
                        }
                        var jobj = JSON.stringify(msg);
                        
                        vApp.wb.sentPackets = vApp.wb.sentPackets + jobj.length;
                        if (io.sock.readyState == 1) {
                            io.send(msg);
                        }

                        //TODO this should be enable
                        var tempObj = JSON.parse(jobj);
                        if (tempObj.hasOwnProperty('repObj')) {
                            vApp.wb.utility.updateSentInformation(jobj);
                        }
                    }
                    localStorage.sentPackets = vApp.wb.sentPackets;
                },
               checkCanvasHasParents : function (){
                   var currentTag = document.getElementById("vcanvas");
                   while(currentTag.parentNode.tagName != 'BODY'){
                       if(currentTag.id != "vcanvas"){
                           currentTag.style.margin = "0";
                           currentTag.style.padding = "0";
                       }
                       currentTag  = currentTag.parentNode;
                   }
                   if(currentTag.id != 'vcanvas'){
                       currentTag.style.margin = "0";
                       currentTag.style.padding = "0";
                   }
               },
               
               //TODO lockVapp should be lockWhiteboard
               lockVapp : function (){
                    if(window.earlierWidth != window.innerWidth){
                        vApp.wb.canvasDisable = true;
                        vApp.wb.utility.makeCanvasDisable();
                        vApp.wb.utility.toolWrapperDisable();
                        vApp.vutil.disableAppsBar();
                        if(document.getElementById('divForReloadMsg') == null){
                            var label = (localStorage.getItem('teacherId') != null) ? 'msgForReload' : 'msgStudentForReload';
                            window.vApp.wb.view.displayMsgBox('divForReloadMsg', label);
                            //fix me earlierWidth and innerwidth are same
                            window.earlierWidth = window.innerWidth;
                        }
                    }
               },
                getElementRightOffSet : function (element){
                    var rightOffSet = 20;
                    //if whiteboard has right sidebar
                    if(element.parentNode != null){
                         var elemContainer = element.parentNode;
                         var offset = vcan.utility.getElementOffset(elemContainer);
                        //WARNING 50 can be dangerous.
                         //var rspace  = (window.earlierWidth != window.innerWidth)  ? 25 : 40;.
                         var rspace = 0;
                         rightOffSet = window.innerWidth - (elemContainer.clientWidth + (offset.x - rspace));
                    }
                    return rightOffSet;
                },
                
                initUpdateInfo  : function (oldData2){
                    oldData2 = vApp.wb.receivedPackets;
                    setInterval(function (){
                        if(document.getElementById(vApp.wb.receivedPackDivPS) != null){
                            oldData2 = vApp.wb.utility.calcPsRecvdPackets(oldData2);
                            document.getElementById(vApp.wb.receivedPackDiv).innerHTML = vApp.wb.receivedPackets;
                        }
                    }, 1000);
                },
                
                // important todo
                // this should be remove not used any where
                objPutInContainer : function (obj){
                    vcan.main.replayObjs.push(obj);
                    //localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
                    vApp.storage.store(JSON.stringify(vcan.main.replayObjs));
                }, 
                
                removeClassFromElement : function (prvTool, className){
                    if(prvTool != "t_reclaim"){
                        var prvTool = document.getElementById(prvTool).className;    
                        var classes = prvTool.split(" ");
                        var retClass = [];
                        for(var i=0; i<classes.length; i++){
                            if(classes[i] != className){
                                retClass.push(classes[i]);
                            }
                        }
                        if(retClass.length > 1){
                            return retClass.join(" ");
                        }else{
                            return retClass[0];
                        }
                    }
                },
                
                makeActiveTool : function (byReload){
                 var tag = document.getElementById(byReload);
                    var classes;
                    if(vApp.wb.hasOwnProperty('prvTool') && vApp.wb.prvTool != "t_reclaim"){
                        classes = vApp.wb.utility.removeClassFromElement(vApp.wb.prvTool,  "active");
                        document.getElementById(vApp.wb.prvTool).className = classes;
                    }else{
                        classes =  tag.className; 
                        //classes =  this.parentNode.className; 
                    }
                    tag.className = classes + " active";
                    localStorage.activeTool = tag.id;
                },
                
                createAudioTransmitIcon : function (userId){
                    var iconElem = document.cteateElement('div');
                    iconElem.id = "audioTransmit" + uuserId;
                    iconElem.className = 'audioTransmit';
                    var controlCont = document.getElementById(userId + "ControlContainer");
                    
                    
                },
                //todo, this shoudl be into user file
                _reclaimRole : function (){
                    vApp.wb.utility.reclaimRole();
                    vApp.wb.utility.sendRequest('reclaimRole', true);
                    vApp.user.control.changeAttrToAssign('enable');
                },
				
                enableAppsBar : function (){
                    var appBarCont = document.getElementById('vAppOptionsCont');
                    if(appBarCont != null){
                        appBarCont.style.pointerEvents = "visible";
                    }
                }
            };
        }
        window.utility = utility;  
    }
)(window);
