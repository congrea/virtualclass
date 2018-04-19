(function (window, document) {

    /**
     * This is the main object which has properties and methods
     * Through this properties and methods all the front stuff is happening
     * eg:- creating, storing and replaying the objects
     */

    var rtcIo = function (config) {
        return {

            init:function(){
                var template = virtualclass.getTemplate('rtcIo');
                $("#virtualclassApp  #chatWidget #stickycontainer").append(template());

                var io = document.querySelector('#virtualclassCont.congrea  #ancIo');
                if(io){

                    io.addEventListener('click',function(){
                        var ioCont = document.querySelector("#virtualclassApp #WebRtcIoContainer.disable");
                     if(ioCont){
                         ioCont.style.display="block";
                         ioCont.classList.remove('disable');
                     }else{
                         ioCont.style.display="none";
                         ioCont.classList.add('disable');
                     }
                    });
                }
                setTimeout(function(){
                    // var script = document.createElement('script');
                    // script.src =  window.whiteboardPath+"io/src/content/devices/input-output/js/main.js";
                    // document.body.appendChild(script);


                    var script = document.createElement('script');
                    script.src =  window.whiteboardPath+"io/src/content/devices/input-output/js/main.js";
                    document.body.appendChild(script);
                },2000)


            },

        }
    };
    window.rtcIo = rtcIo();
})(window, document);
