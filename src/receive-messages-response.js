// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    "use strict";
    var response = {

        //not using
        reclaimRole: function (formUserId, id) {
//                alert(formUserId + ' ' + id);
            if (formUserId != id) {

                virtualclass.user.control._assign(id, 'notsent', formUserId);

                virtualclass.user.displayStudentSpeaker(true);
                if (localStorage.getItem('aId') != null) {
                    localStorage.removeItem('aId');
                }
                virtualclass.user.control.removeAudioFromParticipate(formUserId);
                //virtualclass.vutil.toggleRoleClass(true);

                if (virtualclass.system.device == 'mobTab') { //mobile or tablet
                    //alert(App.system.mybrowser.name);
                    if ((virtualclass.system.mybrowser.name = "iOS" && virtualclass.system.mybrowser.version >= 8) && /(iPad)/g.test(navigator.userAgent)) {
                        virtualclass.vutil.enableVirtualClass();
                    }


                    var onlyLatest = true;
                    virtualclass.view.removeErrorMsg('errorContainer', onlyLatest);
                }
            }
        },

        //not using
        assignRole: function (fromUserId, id, reclaim) {
            if (fromUserId != id || typeof reclaim != 'undefined') {
                virtualclass.vutil.assignRole(id);
                virtualclass.wb.utility.uniqueArrOfObjsToTeacher();
                //create assing button only to student
                if (!roles.hasAdmin()) {
                    virtualclass.vutil.removeSessionTool();   //
                    var divContainer = document.getElementById("ml" + fromUserId);
                    var controls = ['assign'];

                    var controlCont = document.getElementById(fromUserId + "ControlContainer");
                    if (controlCont != null) {
                        virtualclass.user.createAssignControl(controlCont, fromUserId, true);
                    } else {
                        var divControl = virtualclass.user.createControl(fromUserId, controls);
                        divContainer.appendChild(divControl);
                    }

                    localStorage.setItem('aId', fromUserId);
                    //virtualclass.vutil.toggleRoleClass();
                } else {
                    var currTeacherElem = document.getElementById('chat_div').getElementsByClassName('currTeacher')[0];
                    if (currTeacherElem != null) {
                        virtualclass.user.control.removeCurrTeacherFromControl(currTeacherElem.id);
                    }
                    virtualclass.user.control.changeAttrToAssign('enable');
                }
            }
            virtualclass.vutil.attachClickOutSideCanvas();
            if (virtualclass.system.device == 'mobTab') { //mobile or tablet
                virtualclass.vutil.disableVirtualClass();
                virtualclass.view.createErrorMsg(virtualclass.lang.getString('supportDesktop'), 'errorContainer', 'chatWidget');
            }
        },


        checkUser: function (e, id, storageHasTeacher) {
            var joinId = e.message.joinId;
            if ((typeof vcan.teacher == 'undefined') && (!storageHasTeacher)) {
                virtualclass.wb.utility.makeCanvasDisable();
            }

            //  virtualclass.wb.utility.initDefaultInfo(e, wbUser.role);
            virtualclass.vutil.initDefaultInfo(e, wbUser.role, virtualclass.currApp);

            //virtualclass.vutil.initDefaultInfo(e, wbUser.role, virtualclass.currApp);

            virtualclass.wb.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
        },
        clearAll: function (formUserId, id, eMessage, orginalTeacherId) {
            if (formUserId != id) {
                virtualclass.wb.tool = new virtualclass.wb.tool_obj('t_clearall');
                virtualclass.wb.utility.t_clearallInit();
                virtualclass.wb.utility.makeDefaultValue();
                //virtualclass.storage.clearStorageData();
                virtualclass.storage.clearSingleTable('wbData');
            }

            //if (orginalTeacherId) {
            //    virtualclass.wb.utility.updateRcvdInformation(eMessage);
            //}
        },
        // TODO this is not used any more
        // should be deleted
        replayAll: function () {
            window.virtualclass.wb.vcan.main.replayObjs = virtualclass.wb.gObj.replayObjs;
            virtualclass.wb.utility.clearAll(false);
            virtualclass.wb.toolInit('t_replay', 'fromFile');
        },
        createArrow: function (eMessage, orginalTeacherId) {
            var imageElm = virtualclass.wb.arrImg;
            var obj = {};
            obj.mp = {x: eMessage.x, y: eMessage.y};
            virtualclass.wb.utility.drawArrowImg(imageElm, obj);
            //if (orginalTeacherId) {
            //    virtualclass.wb.utility.updateRcvdInformation(eMessage);
            //}
        },


        replayObj2: function (repObj) {
            window.virtualclass.wb.vcan.main.replayObjs = [];
            if (repObj.length > 0) {
                if (virtualclass.wb.gObj.displayedObjId + 1 == repObj[0].uid) {
                    window.virtualclass.wb.vcan.main.replayObjs = repObj;
                    console.log('Whiteboard:-  recieved ' + repObj[repObj.length - 1].uid);
                    virtualclass.wb.toolInit('t_replay', 'fromBrowser', true, virtualclass.wb.utility.dispQueuePacket);
                } else {
                    console.log('Whiteboard:- Problem between display id ' + virtualclass.wb.gObj.displayedObjId  + ' and recived first packet' + repObj[0].uid);
                }
            }
        },

        replayObj: function (repObj) {
            window.virtualclass.wb.vcan.main.replayObjs = [];
            if (repObj.length > 0) {
                window.virtualclass.wb.vcan.main.replayObjs = repObj;

                //console.log('Whiteboard:-  recieved From ' + repObj[0].uid + ' To ' +  repObj[repObj.length - 1].uid);
                virtualclass.wb.toolInit('t_replay', 'fromBrowser', true, virtualclass.wb.utility.dispQueuePacket);


                //if (virtualclass.wb.gObj.displayedObjId + 1 == repObj[0].uid) {
                //    window.virtualclass.wb.vcan.main.replayObjs = repObj;
                //    console.log('Whiteboard:-  recieved ' + repObj[repObj.length - 1].uid);
                //    virtualclass.wb.toolInit('t_replay', 'fromBrowser', true, virtualclass.wb.utility.dispQueuePacket);
                //} else {
                //    console.log('Whiteboard:- Problem between display id ' + virtualclass.wb.gObj.displayedObjId  + ' and recived first packet' + repObj[0].uid);
                //}
            }
        },

        chunk: function (fromUser, id, repObj) {
            virtualclass.wb.bridge.handleMissedPackets(fromUser, id, repObj);
        },

        repObjForMissedPkts: function (msgRepObj) {
            if (virtualclass.wb.gObj.rcvdPackId !== 0 || (virtualclass.wb.uid > 0 && virtualclass.wb.gObj.rcvdPackId === 0)) { //for handle very starting stage
                if ((typeof msgRepObj === 'object' || msgRepObj instanceof Array)) {
                    if (msgRepObj[0].hasOwnProperty('uid') && (!msgRepObj.hasOwnProperty('chunk'))) {
                        if ((Number(virtualclass.wb.gObj.rcvdPackId + 1) < Number(msgRepObj[0].uid)) || (virtualclass.wb.gObj.rcvdPackId != virtualclass.wb.gObj.displayedObjId)) {
                            var reqPacket = virtualclass.wb.bridge.requestPackets(msgRepObj);
                            virtualclass.vutil.beforeSend({'getMsPckt': reqPacket, 'cf': 'getMsPckt'});
                        }
                    }
                }
            }
        }
    };
    window.response = response;
})(window);
