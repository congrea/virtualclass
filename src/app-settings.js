(function (window, document) {

    /**
     * This is the main object which has properties and methods
     * Through this properties and methods all the front stuff is happening
     * eg:- creating, storing and replaying the objects
     */

    var appSetting = function (config) {
        return {
            init:function(){
                var toggle = document.querySelector("#virtualclassCont.congrea #appSettingCtrl");
                var chat = document.querySelector("#virtualclassCont.congrea #chatWidget");
                var setting = document.querySelector("#virtualclassCont.congrea #appSettingDetail");

                var privateChatTab = document.querySelector("#virtualclassCont.congrea .vmchat_bar_button");
                var commonChatTab = document.querySelector("#virtualclassCont.congrea .vmchat_room_bt");

                if(toggle){
                    toggle.addEventListener('click',function(){
                        if(toggle.classList.contains('chatActive')){
                            toggle.classList.remove('chatActive');
                            toggle.classList.add('settingActive')
                            chat.classList.remove("active");
                            chat.classList.add("deactive")
                            setting.classList.add("active");
                            setting.classList.remove("deactive");
                            if(privateChatTab.classList.contains("active")){
                                privateChatTab.classList.remove('active');
                            }
                            if(commonChatTab.classList.contains("active")){
                                commonChatTab.classList.remove('active');
                            }
                            virtualclass.appSetting.rtcIo();
                            virtualclass.appSettingMedia.init();

                        }else{
                            toggle.classList.add('chatActive');
                            toggle.classList.remove('settingActive');
                            chat.classList.remove("deactive");
                            chat.classList.add("active");
                            setting.classList.remove("active");
                            setting.classList.add("deactive");

                            var memberList =   document.querySelector(".congrea #memlist.enable");
                            if(memberList){
                                privateChatTab.classList.add("active");
                            }
                            var commonChat =   document.querySelector(".congrea #chatrm.enable");
                            if(commonChat){
                                commonChatTab.classList.add("active");
                            }
                        }
                    });
                }

            },
            rtcIo:function(){
                var mediaCont = document.querySelector(".congrea #webRtcIoContainer");
                if(!mediaCont){
                    var template = virtualclass.getTemplate('appSettingMedia');
                    $("#virtualclassApp  #settingMedia").append(template());
                    
                    
                    if (navigator.userAgent.indexOf("Firefox") != -1)//audio output not supported
                    {  
                        var audioOutput = document.querySelector(".congrea #webRtcIoContainer .aoutput")
                        if(audioOutput){
                            audioOutput.style.display= "none"
                        }
           
                    }
                          
                }

            }
        }
    };
    window.appSetting = appSetting();
})(window, document);
