(function (window, document) {

    /**
     * This is the main object which has properties and methods
     * Through this properties and methods all the front stuff is happening
     * eg:- creating, storing and replaying the objects
     */

    var raiseHand = function (config) {
        return {
            stdRhEnable:"enabled",
            init: function (obj) {
                this. stdRhEnable="enabled";
                if(!roles.hasControls()){
                    this. stdRaiseHandler();
                    this.stdRhEnable=localStorage.getItem("stdRhEnable");
                    if(this.stdRhEnable &&this.stdRhEnable =="disabled" ){
                        var cont = document.querySelector("#stickybar #congHr");
                        var rhElem =  document.querySelector("#icHr");
                        rhElem.setAttribute("data-action","disable");
                        cont.classList.remove("enable");
                        cont.classList.add("disable");
                        localStorage.removeItem("stdRhEnable")
                    }

                }

            },

            disableRaiseH:function(userid){
                var controlContainer = document.getElementById(userid + 'contRaiseH');
                ioAdapter.mustSendUser({
                    'data': {

                        action: "disable"
                    },
                    'cf': 'raiseHand'
                }, userid);
                controlContainer.classList.remove("enabled");
                controlContainer.classList.add("disabled");
                document.getElementById(userid + "contrRaiseHandImg").setAttribute('data-raisehand-disable', true)
                document.getElementById(userid+ "contRaiseAnch").setAttribute('data-title', "disabled")
                controlContainer.style.pointerEvents = "none";
                virtualclass.user.control.updateUser(userid, 'raiseHand',false);
                virtualclass.raiseHand.moveDownInList(userid)
            },

            // to modify this
            raiseMessage:function(rMsg){
                if(roles.hasControls()){
                    this.onMsgRecTr(rMsg.data);

                }else{
                    this.onMsgRecStd(rMsg.data)
                }

            },
            onMsgRecTr:function(msg){
                console.log("raiseStd"+msg.action);
                var userid= msg.user
                var controlContainer = document.getElementById(userid+ 'contRaiseH');
                var anch = document.getElementById(userid + 'contRaiseAnch');
                var cont = document.getElementById(userid + 'contrRaiseHandImg');

                if(msg.action=="enable"){
                    this.trRaisehEnable(userid);
                    this.moveUpInList();
                }
                else if(msg.action=="disable"){
                    virtualclass.user.control.updateUser(userid, 'raiseHand',false);
                    controlContainer.classList.remove("enabled");
                    controlContainer.classList.add("disabled");
                    cont.setAttribute('data-raisehand-disable',true)
                    anch.setAttribute('data-title',"disabled")
                    controlContainer.style.pointerEvents="none";
                    this.moveDownInList(userid)
                }

            },

            onMsgRecStd:function(msg){
                if(msg.action == "disable"){
                    this.stdRhEnable="enabled";
                    var stdR= document.getElementById("congHr")
                    stdR.classList.remove("disable");
                    stdR.classList.add("enable")
                    var rhElem = document.querySelector("#stickybar #icHr");
                    rhElem.setAttribute("data-title",virtualclass.lang.getString("RaiseHandStdEnabled"));
                }

            },
            moveUpInList:function(){
                var ctrEn = document.querySelectorAll(".controllerRaiseH")
                for(var i =0; i <ctrEn.length ;i++){
                    if(ctrEn[i].classList.contains("enabled")){
                        if(i!=0){
                            // to simplify
                            ctrEn[i].parentNode.parentNode.parentNode.insertBefore(ctrEn[i].parentNode.parentNode, ctrEn[0].parentNode.parentNode);

                        }

                    }
                }

            },
            moveDownInList:function(userid){
                var ctrEn = document.querySelectorAll(".controllerRaiseH.enabled")
                var userLink = document.getElementById(userid +"contRaiseH");
                if(ctrEn.length >0) {
                    userLink.parentNode.parentNode.parentNode.insertBefore(userLink.parentNode.parentNode,ctrEn[ctrEn.length-1].parentNode.parentNode.nextSibling);
                }
            },

            // to verify
            trRaisehEnable:function(userid){
                var controlContainer = document.getElementById(userid + 'contRaiseH');
                var anch = document.getElementById(userid + 'contRaiseAnch');
                var cont = document.getElementById(userid + 'contrRaiseHandImg');

                virtualclass.user.control.updateUser(userid, 'raiseHand', true);
                controlContainer.classList.remove("disabled");
                controlContainer.classList.add("enabled");
                cont.setAttribute('data-raisehand-disable',false)
                anch.setAttribute('data-title',virtualclass.lang.getString("RaiseHandEnable"));
                controlContainer.style.pointerEvents="visible"

            },
            ansNotify:function(userid,controlContainer,cont,anch){
                ioAdapter.mustSendUser({
                    'data': {

                        action:"disable"
                    },
                    'cf': 'raiseHand'
                }, userid);
                controlContainer.classList.remove("enabled");
                controlContainer.classList.add("disabled");
                cont.setAttribute('data-raisehand-disable',true)
                anch.setAttribute('data-title',virtualclass.lang.getString("RaiseHandDisable"))
                controlContainer.style.pointerEvents="visible";
                virtualclass.raiseHand.moveDownInList(userid)

            },

            updateInStorage:function(){

                    localStorage.setItem("stdRhEnable",this.stdRhEnable)


            },

            stdRaiseHandler:function(){
                var cont = document.querySelector("#stickybar #congHr");
                cont.addEventListener('click',function(){
                    var rhElem = document.querySelector("#stickybar #icHr");
                    var toUser = virtualclass.vutil.whoIsTeacher();
                    ioAdapter.mustSendUser({
                        'data': {
                            user: wbUser.id,
                            action:rhElem.getAttribute("data-action")
                        },
                        'cf': 'raiseHand'
                    }, toUser);

                    if(rhElem.getAttribute("data-action") =="enable"){
                        rhElem.setAttribute("data-action","disable");
                        cont.classList.remove("enable");
                        cont.classList.add("disable");
                        rhElem.setAttribute("data-title",virtualclass.lang.getString("RaiseHandStdDisabled"));
                        virtualclass.raiseHand.stdRhEnable="disabled";
                    }else{
                        rhElem.setAttribute("data-action","enable")
                        cont.classList.add("enable");
                        cont.classList.remove("disable");
                        rhElem.setAttribute("data-title",virtualclass.lang.getString("RaiseHandStdEnabled"));
                        virtualclass.raiseHand.stdRhEnable="enabled";
                    }

                })

            },

        }
    };

    window.raiseHand = raiseHand();
})(window, document);