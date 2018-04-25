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
                if(toggle){
                    toggle.addEventListener('click',function(){
                        if(toggle.classList.contains('chatActive')){
                            toggle.classList.remove('chatActive');
                            toggle.classList.add('settingActive')
                            chat.classList.remove("active");
                            chat.classList.add("deactive")
                            setting.classList.add("active");
                            setting.classList.remove("deactive");


                        }else{
                            toggle.classList.add('chatActive');
                            toggle.classList.remove('settingActive');
                            chat.classList.remove("deactive");
                            chat.classList.add("active");
                            setting.classList.remove("active");
                            setting.classList.add("deactive")
                        }

                    });
                }
                this.rtcIo();
            },
            rtcIo:function(){
                var template = virtualclass.getTemplate('appSettingMedia');
                $("#virtualclassApp  #settingMedia").append(template());

            }
        }
    };
    window.appSetting = appSetting();
})(window, document);
