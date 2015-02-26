// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var response = {
            reclaimRole: function(formUserId, id) {
//                alert(formUserId + ' ' + id);
                if (formUserId != id) {
                    
                    vApp.user.control._assign(id, 'notsent', formUserId);
                    
                    vApp.user.displayStudentSpeaker(true);
                    if(localStorage.getItem('aId') != null){
                        localStorage.removeItem('aId');
                    }
                    vApp.user.control.removeAudioFromParticipate(formUserId);
                    //vApp.vutil.toggleRoleClass(true);
                }
            },
            assignRole: function(fromUserId, id, reclaim) {
//                alert(fromUserId + ' ' + id);
                if (fromUserId != id || typeof reclaim != 'undefined') {
                    vApp.wb.utility.assignRole(id);
                    vApp.wb.utility.uniqueArrOfObjsToTeacher();
                    //create assing button only to student
                    if(localStorage.getItem('orginalTeacherId') == null){
                        vApp.vutil.removeSessionTool();   //
                        var divContainer = document.getElementById("ml" + fromUserId);
                        var controls = ['assign'];
                            
                        var controlCont = document.getElementById(fromUserId + "ControlContainer");
                        if(controlCont != null){
                            vApp.user.createAssignControl(controlCont, fromUserId, true);
                        }else{
                            var divControl = vApp.user.createControl(fromUserId, controls);
                            divContainer.appendChild(divControl);
                        }
                            
                        localStorage.setItem('aId', fromUserId);
                        //vApp.vutil.toggleRoleClass();
                    }else{
                        var currTeacherElem = document.getElementById('chat_div').getElementsByClassName('currTeacher')[0];
                        if(currTeacherElem != null){
                            vApp.user.control.removeCurrTeacherFromControl(currTeacherElem.id);
                        }
                        vApp.user.control.changeAttrToAssign('enable');
                    }
                }
                vApp.vutil.attachClickOutSideCanvas();
            },
            checkUser: function(e, id, storageHasTeacher) {
                var joinId = e.message.joinId;
                if ((typeof vcan.teacher == 'undefined') && (!storageHasTeacher)) {
                    vApp.wb.utility.makeCanvasDisable();
                }
                vApp.wb.utility.initDefaultInfo(e, wbUser.role);
                vApp.wb.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
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
