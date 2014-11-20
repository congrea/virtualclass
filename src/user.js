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
                  
                  assignRole : function (role, app){
                      
                       if(role == 't'){
                            // alert(vApp.currApp);
                            //vmapp 52
                            vApp.html.optionsWithWrapper();
                            vApp.attachFunction();
                            var app = document.getElementById('vApp' + vApp.currApp);
                            //TODO 
                            // id should be dynamic
                            var vAppOptionsContWidth = document.getElementById("vAppOptionsCont").offsetWidth;
                           // app.style.width = app.offsetWidth - vAppOptionsContWidth;
                            
                            //wb_utility 777
                            window.vApp.wb.attachToolFunction(vcan.cmdWrapperDiv, true);
                            
                            //vmapp 168
                            if(app == 'Whiteboard' && vApp.gObj.uRole == 't'){
                                if(vApp.hasOwnProperty('prevApp')){
                                    vApp.vutil.makeActiveApp("vApp" + app, vApp.prevApp);
                                } else{
                                    vApp.vutil.makeActiveApp("vApp" + app);
                                }
                            }
                            
//                             vApp.wb.utility.displayCanvas();
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
                  }
            }
        };
    window.user = user;
})(window, document);
