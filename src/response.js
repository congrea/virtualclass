// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var response = {
            reclaimRole: function(formUserId, id) {
                if (formUserId != id) {
                    vApp.wb.utility.removeToolBox();
                    vApp.wb.utility.makeCanvasDisable();
                    if (typeof localStorage.teacherId != 'undefined') {
                        localStorage.removeItem('teacherId');
                    }

                    vApp.wb.utility.uniqueArrOfObjsToStudent();

                    vApp.wb.view.disappearBox('Canvas');
                    vApp.wb.view.disappearBox('drawArea');

                    var canvasWrapper = document.getElementById("vcanvas");
                    canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');

                    canvasWrapper.className = 'student';
                    localStorage.setItem('canvasDrwMsg', true);

                    if (!vApp.vutil.chkValueInLocalStorage('orginialTeacherId')) {
                        vApp.wb.utility.setCommandToolHeights(toolHeight, 'decrement');
                    }

                } else {
                    if (vApp.vutil.chkValueInLocalStorage('orginialTeacherId')) {
                        var toolHeight = localStorage.getItem('toolHeight');
                        vApp.wb.utility.setCommandToolHeights(toolHeight, 'increment');
                    }

                    vApp.wb.utility.uniqueArrOfObjsToTeacher();
                    var canvasWrapper = document.getElementById("vcanvas");
                    canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
                    canvasWrapper.className = 'teacher';
                    localStorage.canvasDrwMsg = true;
                    
                    //vApp.wb.utility.setStyleUserConnetion('coff', 'con');
                    
                }
            },
            assignRole: function(fromUserId, id, socket, toolHeight) {
                if (fromUserId != id) {
                    vApp.wb.socketOn = parseInt(socket);
                    vApp.wb.utility.setClass('vcanvas', 'socketon');
                    vApp.wb.utility.assignRole(id);
                    vApp.wb.utility.uniqueArrOfObjsToTeacher();

                    if (!vApp.vutil.chkValueInLocalStorage('canvasDrwMsg')) {
                        window.vApp.wb.view.canvasDrawMsg('Canvas');
                        window.vApp.wb.view.drawLabel('drawArea');
                        localStorage.setItem('canvasDrwMsg', true);
                    }

                    var canvasWrapper = document.getElementById("vcanvas");
                    canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
                    canvasWrapper.className = 'teacher';

                  //  vApp.wb.user.connected = true;

                    var toolHeight = localStorage.getItem('toolHeight');
                    vApp.wb.utility.setCommandToolHeights(toolHeight, 'increment');
                    
                    //vApp.wb.utility.setStyleUserConnetion('coff', 'con', 'fromAssign');

                } else {
                    vApp.wb.utility.uniqueArrOfObjsToStudent();
                    if (!vApp.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                        var canvasWrapper = document.getElementById("vcanvas");
                        canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
                        canvasWrapper.className = 'student';
                    }
                    if (localStorage.getItem('orginialTeacherId') == null) {
                        vApp.wb.utility.setCommandToolHeights(toolHeight, 'decrement');
                    }

                    localStorage.setItem('canvasDrwMsg', true);
                }
            },
            
            checkUser: function(e, id, storageHasTeacher) {
//                alert('ss');
//                debugger;
                var joinId = e.message.joinId;
           //     if ((typeof vcan.teacher == 'undefined') && (!storageHasTeacher) && (e.fromUser.userid == id) && (e.fromUser.userid == joinId)) {
                if ((typeof vcan.teacher == 'undefined') && (!storageHasTeacher)) {
                    vApp.wb.utility.makeCanvasDisable();
                }
                
                //if (e.fromUser.userid == id ){
                    vApp.wb.utility.initDefaultInfo(e, wbUser.role);
                    vApp.wb.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
                //}
            },
            
            clearAll: function(formUserId, id, eMessage, orginalTeacherId) {
                if (formUserId != id) {
                    vApp.wb.tool = new vApp.wb.tool_obj('t_clearall');
                    vApp.wb.utility.t_clearallInit();
                    vApp.wb.utility.makeDefaultValue();
                    vApp.storage.clearStorageData();
                }

                if (orginalTeacherId) {
                    vApp.wb.utility.updateRcvdInformation(eMessage);
                }
            },
            
            // TODO this is not used any more
            // should be deleted
            replayAll: function() {
                window.vApp.wb.vcan.main.replayObjs = vApp.wb.gObj.replayObjs;
                vApp.wb.utility.clearAll(false);
                vApp.wb.toolInit('t_replay', 'fromFile');
            },
            createArrow: function(eMessage, orginalTeacherId) {
                var imageElm = vApp.wb.arrImg;
                var obj = {};
                obj.mp = {x: eMessage.x, y: eMessage.y};
                vApp.wb.utility.drawArrowImg(imageElm, obj);
                if (orginalTeacherId) {
                    vApp.wb.utility.updateRcvdInformation(eMessage);
                }
            },
            replayObj: function(repObj) {
                window.vApp.wb.vcan.main.replayObjs = [];
                if (repObj.length > 0) {
                    if (vApp.wb.gObj.displayedObjId + 1 == repObj[0].uid) {
                        window.vApp.wb.vcan.main.replayObjs = repObj;
                        vApp.wb.toolInit('t_replay', 'fromBrowser', true, vApp.wb.utility.dispQueuePacket);
                    }
                }
            },
            
            chunk: function(fromUser, id, repObj) {
                vApp.wb.bridge.handleMissedPackets(fromUser, id, repObj);
            },
            
            repObjForMissedPkts: function(msgRepObj) {
                if (vApp.wb.gObj.rcvdPackId != 0 || (vApp.wb.uid > 0 && vApp.wb.gObj.rcvdPackId == 0)) { //for handle very starting stage
                    if ((typeof msgRepObj == 'object' || msgRepObj instanceof Array)) {
                        if (msgRepObj[0].hasOwnProperty('uid')) {
                            if ((vApp.wb.gObj.rcvdPackId + 1 != msgRepObj[0].uid) && (!msgRepObj.hasOwnProperty('chunk'))) {
                                if (Number(vApp.wb.gObj.rcvdPackId) < Number(msgRepObj[0].uid)) {
                                    var reqPacket = vApp.wb.bridge.requestPackets(msgRepObj);
                                    vApp.wb.utility.beforeSend({'getMsPckt': reqPacket});
                                }
                            }
                        }
                    }
                }
            }
        };
        
        window.response = response;
    }
)(window);
