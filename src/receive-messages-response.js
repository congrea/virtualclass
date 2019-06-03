// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    "use strict";
    var response = {

        //not using
        reclaimRole: function (formUserId, id) {
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
                virtualclass.wb[virtualclass.gObj.currWb].utility.uniqueArrOfObjsToTeacher();
                //create assing button only to student
                if (!roles.hasAdmin()) {
                    virtualclass.vutil.removeSessionTool();   //
                    var divContainer = chatContainerEvent.elementFromShadowDom("#ml" + fromUserId);
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
                virtualclass.wb[virtualclass.gObj.currWb].utility.makeCanvasDisable();
            }
            virtualclass.vutil.initDefaultInfo(e, wbUser.role, virtualclass.currApp);
            virtualclass.wb[virtualclass.gObj.currWb].utility.makeUserAvailable(e.message.checkUser.e.clientLen);
        },
        clearAll: function (formUserId, id, eMessage, orginalTeacherId) {
            if (formUserId != id) {
                virtualclass.wb[virtualclass.gObj.currWb].tool = new virtualclass.wb[virtualclass.gObj.currWb].tool_obj('t_clearall');
                virtualclass.wb[virtualclass.gObj.currWb].utility.t_clearallInit();
                virtualclass.wb[virtualclass.gObj.currWb].utility.makeDefaultValue();
                //virtualclass.storage.clearStorageData();
                virtualclass.storage.wbDataRemove(virtualclass.gObj.currWb);
            }
        },

        // TODO this is not used any more
        // should be deleted
        replayAll: function () {
            window.virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs;
            virtualclass.wb[virtualclass.gObj.currWb].utility.clearAll(false);
            virtualclass.wb[virtualclass.gObj.currWb].toolInit('t_replay', 'fromFile');
        },

        createArrow: function (eMessage) {
            var wid = virtualclass.gObj.currWb;
            var imageElm = virtualclass.wb[wid].arrImg;
            var obj = {};
            obj.mp = {x: eMessage.x * virtualclass.zoom.canvasScale, y: eMessage.y * virtualclass.zoom.canvasScale};

            var wrapper = document.querySelector('#canvasWrapper' + wid);
            // virtualclass.posY = (obj.mp.y - wrapper.scrollTop);
            // virtualclass.posX = (obj.mp.x - wrapper.scrollLeft);

            virtualclass.posY = (obj.mp.y);
            virtualclass.posX = (obj.mp.x);

            // console.log('vm mouse cursor y=' + (virtualclass.posY));

            virtualclass.wb[virtualclass.gObj.currWb].utility.drawArrowImg(imageElm, obj);


            if (virtualclass.pdfRender[wid].scroll.Y != null) {
                virtualclass.pdfRender[wid].customMoustPointer({y: virtualclass.posY}, 'Y', virtualclass.posY);
            }

            if (virtualclass.pdfRender[wid].scroll.X != null) {
                virtualclass.pdfRender[wid].customMoustPointer({x: virtualclass.posX}, 'X', virtualclass.posX);
            }
            //console.log('Mouse cursor x=' + obj.mp.x  + ' y=' + obj.mp.y);
        },


        replayObj2: function (repObj) {
            window.virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = [];
            if (repObj.length > 0) {
                if (virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId + 1 == repObj[0].uid) {
                    window.virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = repObj;
                    console.log('Whiteboard:-  recieved ' + repObj[repObj.length - 1].uid);
                    virtualclass.wb[virtualclass.gObj.currWb].toolInit('t_replay', 'fromBrowser', true, virtualclass.wb[virtualclass.gObj.currWb].utility.dispQueuePacket);
                } else {
                    console.log('Whiteboard:- Problem between display id ' + virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId + ' and recived first packet' + repObj[0].uid);
                }
            }
        },

        replayObj: function (repObj) {
            window.virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = [];
            if (repObj.length > 0) {
                window.virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = repObj;
                virtualclass.wb[virtualclass.gObj.currWb].toolInit('t_replay', 'fromBrowser', true, virtualclass.wb[virtualclass.gObj.currWb].utility.dispQueuePacket);
            }
        },

        chunk: function (fromUser, id, repObj) {
            virtualclass.wb[virtualclass.gObj.currWb].bridge.handleMissedPackets(fromUser, id, repObj);
        },

        repObjForMissedPkts: function (msgRepObj) {
            if (virtualclass.wb[virtualclass.gObj.currWb].gObj.rcvdPackId !== 0 || (virtualclass.wb[virtualclass.gObj.currWb].uid > 0 && virtualclass.wb[virtualclass.gObj.currWb].gObj.rcvdPackId === 0)) { //for handle very starting stage
                if ((typeof msgRepObj === 'object' || msgRepObj instanceof Array)) {
                    if (msgRepObj[0].hasOwnProperty('uid') && (!msgRepObj.hasOwnProperty('chunk'))) {
                        if ((Number(virtualclass.wb[virtualclass.gObj.currWb].gObj.rcvdPackId + 1) < Number(msgRepObj[0].uid)) || (virtualclass.wb[virtualclass.gObj.currWb].gObj.rcvdPackId != virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId)) {
                            var reqPacket = virtualclass.wb[virtualclass.gObj.currWb].bridge.requestPackets(msgRepObj);
                            virtualclass.vutil.beforeSend({'getMsPckt': reqPacket, 'cf': 'getMsPckt'});
                        }
                    }
                }
            }
        }
    };
    window.response = response;
})(window);
