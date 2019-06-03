(function (window, document) {

    // This file is part of Vidyamantra - http:www.vidyamantra.com/
    /**@Copyright 2018  Vidya Mantra EduSystems Pvt. Ltd.
     * @author  Nirmala Mehta <http://www.vidyamantra.com>
     * This file is to add  raise hand feature .
     * student can raise hand if they have queries
     */

    var raiseHand = function (config) {
        return {
            stdRhEnable: "enabled",
            rhCount: 0,
            rhCountR: 0,
            init: function (obj) {
                this.stdRhEnable = "enabled";
                if (!roles.hasControls()) {
                    this.attachHandlerAtStudent();
                    // this.stdRhEnable=localStorage.getItem("stdRhEnable");
                    if (this.stdRhEnable && this.stdRhEnable == "disabled") {
                        var rhElem = document.querySelector("#virtualclassCont.congrea #icHr");
                        rhElem.setAttribute("data-action", "disable");
                        var cont = document.querySelector("#virtualclassCont.congrea #congHr");
                        cont.classList.remove("enable");
                        cont.classList.add("disable");
                        cont.setAttribute("data-title", virtualclass.lang.getString("RaiseHandStdDisabled"));
                        //localStorage.removeItem("stdRhEnable");
                    }

                }

            },

            disableRaiseHand: function (userid) {
                // var controlContainer = document.getElementById(userid + 'contRaiseH');
                var controlContainer = chatContainerEvent.elementFromShadowDom('#ml' + userid + ' .controllerRaiseH');

                var controlContainer = chatContainerEvent.elementFromShadowDom('#ml' + userid + ' .controllerRaiseH');
                var anch = controlContainer.querySelector('a.congtooltip');
                var cont = anch.querySelector('.RaiseHandImg');

                ioAdapter.mustSendUser({
                    'data': {

                        action: "disable"
                    },
                    'cf': 'raiseHand'
                }, userid);
                controlContainer.classList.remove("enabled");
                controlContainer.classList.add("disabled");
                cont.setAttribute('data-raisehand-disable', true)
                anch.setAttribute('data-title', "disabled")
                controlContainer.style.pointerEvents = "none";
                virtualclass.user.control.updateUser(userid, 'raiseHand', false);
                virtualclass.raiseHand.moveDownInList(userid)
                this.rhCount--;
                if (!this.rhCount) {
                    document.querySelector("#user_list .hand_bt").classList.remove("highlight");
                }

                var text = document.querySelector("#user_list .hand_bt  #notifyText")
                if (this.rhCount > 0) {
                    text.innerHTML = this.rhCount;
                } else {
                    var rh = document.querySelector("#user_list .hand_bt");
                    text.innerHTML = "";
                    rh.classList.remove('congtooltip');
                    rh.removeAttribute('data-title');
                    document.querySelector("#user_list .hand_bt").classList.remove("highlight");
                }

            },

            onMsgRec: function (e) {
                var rMsg = e.message;
                if (roles.hasControls()) {
                    this.msgRecAtTeacher(rMsg.data);
                } else {
                    this.msgRecAtStudent(rMsg.data)
                }


            },
            msgRecAtTeacher: function (msg) {
                console.log("raiseStd" + msg.action);
                var userid = msg.user

                // var controlContainer = document.getElementById(userid+ 'contRaiseH');
                // var anch = document.getElementById(userid + 'contRaiseAnch');
                // var cont = document.getElementById(userid + 'contrRaiseHandImg');
                var controlContainer = chatContainerEvent.elementFromShadowDom('#ml' + userid + ' .controllerRaiseH');
                var anch = controlContainer.querySelector('a.congtooltip');
                var cont = anch.querySelector('.RaiseHandImg');


                if (msg.action == "enable") {
                    this.enableRaiseHand(userid);
                    this.moveUpInList();
                } else if (msg.action == "disable") {
                    virtualclass.user.control.updateUser(userid, 'raiseHand', false);
                    controlContainer.classList.remove("enabled");
                    controlContainer.classList.add("disabled");
                    cont.setAttribute('data-raisehand-disable', true)
                    anch.setAttribute('data-title', "disabled")
                    controlContainer.style.pointerEvents = "none";
                    this.moveDownInList(userid)
                    this.rhCount--;
                    if (!this.rhCount) {
                        document.querySelector("#user_list .hand_bt").classList.remove("highlight");
                    }

                }
                var text = document.querySelector("#user_list .hand_bt  #notifyText")
                if (this.rhCount > 0) {
                    text.innerHTML = this.rhCount;
                } else {
                    var rh = document.querySelector("#user_list .hand_bt");
                    text.innerHTML = "";
                    rh.classList.remove('congtooltip');
                    rh.removeAttribute('data-title');
                }
            },

            msgRecAtStudent: function (msg) {
                if (msg.action == "disable") {
                    this.stdRhEnable = "enabled";
                    var stdR = document.getElementById("congHr")
                    stdR.classList.remove("disable");
                    stdR.classList.add("enable")
                    var rhElem = document.querySelector("#virtualclassCont.congrea #icHr");
                    //rhElem.setAttribute("data-title",virtualclass.lang.getString("RaiseHandStdEnabled"));
                    rhElem.setAttribute("data-action", "enable");

                    var handCont = document.querySelector("#virtualclassCont.congrea #congHr");
                    handCont.setAttribute("data-title", virtualclass.lang.getString("RaiseHandStdEnabled"));
                }

            },
            moveUpInList: function () {
                var ctrEn = chatContainerEvent.elementFromShadowDom('.controllerRaiseH', 'all');

                for (var i = 0; i < ctrEn.length; i++) {
                    if (ctrEn[i].classList.contains("enabled")) {
                        if (i != 0) {
                            // to simplify
                            ctrEn[i].closest('.ui-memblist-usr').parentNode.insertBefore(ctrEn[i].closest('.ui-memblist-usr'), ctrEn[0].closest('.ui-memblist-usr'));
                        }
                    }
                }
            },
            moveDownInList: function (userid) {
                // var ctrEn = document.querySelectorAll("#virtualclassCont.congrea .controllerRaiseH.enabled")
                var ctrEn = chatContainerEvent.elementFromShadowDom(".controllerRaiseH.enabled", 'all');
                var userLink = virtualclass.gObj.testChatDiv.shadowRoot.getElementById(userid + "contRaiseH");
                if (ctrEn.length > 0) {
                    userLink.closest('.ui-memblist-usr').parentNode.insertBefore(userLink.closest('.ui-memblist-usr'), ctrEn[ctrEn.length - 1].closest('.ui-memblist-usr').nextSibling);
                }
            },

            // to verify
            enableRaiseHand: function (userid) {
                this.rhCount++;
                this._enableRaiseHand(this.rhCount, userid);

            },

            _enableRaiseHand: function (count, userid) {
                // var controlContainer = document.getElementById(userid + 'contRaiseH');
                // var anch = document.getElementById(userid + 'contRaiseAnch');
                // var cont = document.getElementById(userid + 'contrRaiseHandImg');

                var controlContainer = chatContainerEvent.elementFromShadowDom('#ml' + userid + ' .controllerRaiseH');
                var anch = controlContainer.querySelector('a.congtooltip');
                var cont = anch.querySelector('.RaiseHandImg');


                virtualclass.user.control.updateUser(userid, 'raiseHand', true);
                controlContainer.classList.remove("disabled");
                controlContainer.classList.add("enabled");
                cont.setAttribute('data-raisehand-disable', false)
                anch.setAttribute('data-title', virtualclass.lang.getString("RaiseHandEnable"));
                controlContainer.style.pointerEvents = "visible";
                //count++;

                var handbt = document.querySelector("#user_list .hand_bt");
                if (!handbt.classList.contains("highlight")) {
                    handbt.classList.add("highlight");
                }

                var text = document.querySelector("#user_list .hand_bt  #notifyText")
                text.innerHTML = count;
                var tooltip = document.querySelector("#user_list .hand_bt");
                if (!tooltip.classList.contains('congtooltip')) {
                    tooltip.classList.add('congtooltip')
                }
                tooltip.setAttribute('data-title', virtualclass.lang.getString("raiseHandNotify"));

            },
            _raiseHand: function (userid) {
                this.rhCountR++;
                this.rhCount = this.rhCountR;
                this._enableRaiseHand(this.rhCountR, userid);

            },

            updateInStorage: function () {
                localStorage.setItem("stdRhEnable", this.stdRhEnable)
            },

            attachHandlerAtStudent: function () {
                var cont = document.querySelector("#virtualclassCont.congrea #congHr");
                cont.addEventListener('click', function () {
                    var rhElem = document.querySelector("#virtualclassCont.congrea #icHr");
                    var toUser = virtualclass.vutil.whoIsTeacher();
                    ioAdapter.sendUser({
                        'data': {
                            user: wbUser.id,
                            action: rhElem.getAttribute("data-action")
                        },
                        'cf': 'raiseHand'
                    }, toUser);

                    if (rhElem.getAttribute("data-action") == "enable") {
                        rhElem.setAttribute("data-action", "disable");
                        cont.classList.remove("enable");
                        cont.classList.add("disable");
                        var handCont = document.querySelector("#virtualclassCont.congrea #congHr");
                        handCont.setAttribute("data-title", virtualclass.lang.getString("RaiseHandStdDisabled"));
                        virtualclass.raiseHand.stdRhEnable = "disabled";
                    } else {
                        rhElem.setAttribute("data-action", "enable")
                        cont.classList.add("enable");
                        cont.classList.remove("disable");
                        var handCont = document.querySelector("#virtualclassCont.congrea #congHr");
                        handCont.setAttribute("data-title", virtualclass.lang.getString("RaiseHandStdEnabled"));
                        virtualclass.raiseHand.stdRhEnable = "enabled";
                    }

                })

            },

        }
    };
    window.raiseHand = raiseHand();
})(window, document);
