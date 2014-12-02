// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window, document) {
        var user  = function (config) { 
            return {
                init  : function (){

                },

                //TODO function name should be change
                assignRole : function (role, app){
                     if(role == 't'){
                          vApp.html.optionsWithWrapper();
                          vApp.attachFunction();
                          var vAppOptionsContWidth = document.getElementById("vAppOptionsCont").offsetWidth;
                          window.vApp.wb.attachToolFunction(vcan.cmdWrapperDiv, true);


                          if(app == 'Whiteboard' && vApp.gObj.uRole == 't'){
                              if(vApp.hasOwnProperty('prevApp')){
                                  vApp.vutil.makeActiveApp("vApp" + app, vApp.prevApp);
                              } else{
                                  vApp.vutil.makeActiveApp("vApp" + app);
                              }

                              vApp.wb.utility.makeCanvasEnable();
                          }

                     }
                },

                teacherIsAlreadyExist : function (){
                    var allExistedUser = document.getElementById('chat_div').getElementsByClassName('ui-memblist-usr');

                    var role;
                    for(var i=0; i<allExistedUser.length; i++){
                        role = allExistedUser[i].getAttribute('data-role');
                        if(role  == 't'){
                            return true;
                        }
                    }
                    return false;
                },



                createControl : function (userId, controls){
                    var controlCont = document.createElement('div');
                    controlCont.id = userId + "ControlContainer";
                    controlCont.className = "controls";
                    this.createControlDivs(controlCont, userId, controls);
                    return controlCont;
                },
                  
                createControlDivs : function (controlCont, userId, controls){
                    for(var i=0; i<controls.length; i++){
                        if(controls[i] == 'assign'){
                            var assignImg = document.createElement('img');
                            var imgName = "contrAssign";
                            assignImg.id = userId + imgName + "Img";
                            assignImg.src = window.whiteboardPath +  "images/" + imgName + ".png";
                            controlCont.appendChild(assignImg);
                            assignImg.addEventListener('click', vApp.user.control.init);
                            assignImg.className = 'contrAssign';

                        } else if(controls[i] == 'audio'){
                            var audBlock = document.createElement('img');
                            imgName = "contrAudBlock";
                            audBlock.id = userId + imgName + "Img";
                            audBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
                            controlCont.appendChild(audBlock);
                            audBlock.addEventListener('click', vApp.user.control.init);
                            audBlock.className = 'contrAudBlock';

                        }else if (controls[i] == 'chat'){
                            var chatBlock = document.createElement('img');
                            imgName = "contrChatBlock";
                            chatBlock.id = userId + imgName + "Img";
                            chatBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
                            controlCont.appendChild(chatBlock);
                            chatBlock.addEventListener('click', vApp.user.control.init);
                            chatBlock.className = 'contrChatBlock';  
                        }
                    }
                },
                  
                control : {
                    init : function (){
                          //id = ml2
                          //label = contr
                          //control = Assign
                        var compId = this.id;  
                        var ep = compId.indexOf("contr");
                        var userId = compId.substring(0, ep);

                        var restString = compId.split('contr')[1];
                        var imgPos = restString.indexOf("Img");
                        var control = restString.substring(0, imgPos);
                        
                        if(control == 'Assign'){
                           vApp.user.control._assign(userId);
                        }
                    },
                    
                    _assign : function (userId, notsent){
                        
                        vApp.wb.utility.assignRole();
                        vApp.vutil.removeAppPanel();
                        
                        
                        if (!vApp.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                            var canvasWrapper = document.getElementById("vcanvas");
                            canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
                            canvasWrapper.className = 'student';
                        }

                        localStorage.setItem('canvasDrwMsg', true);
                        
                        if(vApp.hasOwnProperty('prevScreen')){
                            //alert(vApp.prevScreen.id);
                            vApp.vutil.videoTeacher2Student(vApp.prevScreen.id + "LocalVideo");
                        }else{
                            vApp.vutil.videoTeacher2Student("vApp" + vApp.currApp+"LocalVideo");
                        }
                        
                        var app;
                        if(vApp.currApp == "ScreenShare"){
                            app = 'ss';
                        }else if(vApp.currApp == "WholeScreenShare"){
                            app = 'wss';
                        }
                        
                        if(vApp.currApp != "Whiteboard"){
                            if(vApp[app].hasOwnProperty('currentStream')){
                                vApp[app].currentStream.stop(); 
                            }
                            vApp[app] = "";    
                        }
                        
                        if(typeof notsent == 'undefined'){
                            vApp.wb.utility.beforeSend({'assignRole' : true, toUser : userId});
                        }
                        
                        if(localStorage.getItem('orginalTeacherId') == null){
                            var controlContainer = document.getElementById('chat_div').getElementsByClassName('controls')[0];
                            controlContainer.parentNode.removeChild(controlContainer);
                        }
                        
                        //alert(vApp.gObj.uRole);
                        
                    }
                }
            }
        };
    window.user = user;
})(window, document);
