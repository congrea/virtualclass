 /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(
    function(window) {
        //vApp.wb = window.vApp.wb;
        var chat = function (){
            return {
                init : function(){
                   this.mainWrapperId = "chatContainer";
                   this.mainChatBoxId = "chatBox";
                   this.commonChatId = "commonChatBoard";
                   this.inputBoxId =  "textInputBox";
                   this.userChatList = [];
                   this.wrapper(); 
                   var msg = localStorage.getItem('msg');
                   this.loadChatFromLocal();
                },
                
                wrapper : function (){
                   //div create common board for chat 
                   var chatBox = document.createElement('div');
                   chatBox.id = this.mainChatBoxId;
                   
                   var commonChatBd = document.createElement('div');
                   commonChatBd.id = this.commonChatId;
                   
                   var cbLabel = document.createElement('p');
                       cbLabel.id =  this.commonChatId + 'Label';
                       
                      // cbLabel.innerHTML = "<span id='firstWord'>Common </span> <br />Chat Board";
                      cbLabel.innerHTML = "Chat Station";
                       
                //   commonChatBd.appendChild(cbLabel);
                       
                   this.inputBox = document.createElement('textarea');
                   this.inputBox.placeholder = "Let's Start The Messaging..:)";
                   this.inputBox.disabled=false;
                   this.inputBox.id = this.inputBoxId;

                   this.inputBox.addEventListener("keyup", this.gettingMessage.bind(this));
                   chatBox.appendChild(commonChatBd);
                
                    chatBox.appendChild(this.inputBox);
                   
                   //chatBox.appendChild(cbLabel);
                   
                   var mainWrapper = document.getElementById(this.mainWrapperId);
                   mainWrapper.appendChild(chatBox);
                   mainWrapper.parentNode.appendChild(chatBox.appendChild(cbLabel));
                  //rightsidebar 
                //   vApp.vutil.sidebarHeightInit();        
                },
                
                loadChatFromLocal : function (){
                    var chatList = JSON.parse(localStorage.getItem('uChatList'));
                    if(chatList !=  null && chatList.length > 0){
                        this.userChatList = [];
                        for(var i=0; i<chatList.length; i++){
                            this.display(chatList[i]);
                        }
                    }
                }, 
                
                
                
                gettingMessage : function (e){
                    var cthis =  e.target;
                    var msgLength = this.getMessageWidth(cthis.id);
                  
                    if(e.keyCode == 13){
                       if(cthis.placeholder != ""){
                           cthis.placeholder = "";
                       }
                       
                       var message = cthis.value.trim();
                       
                       //removing new line from string 
                       message = message.replace(/(\r\n|\n|\r)/gm,"");
                       if(message.length > 0 && message != ""){
                            var commonChatBoardLabel = document.getElementById(this.commonChatId+"Label");
                            if(commonChatBoardLabel != null){
                                commonChatBoardLabel.parentNode.removeChild(commonChatBoardLabel);
                            }
                            
                            //alert(this.commonChatId);
                            var user = {id : vApp.gObj.uid, name : vApp.gObj.uName, msg : message};
                            vApp.wb.utility.beforeSend({"userMsg": user});
                            cthis.value = "";
                       }
                    }
                },
                
                getMessageWidth : function (elemId){
                    var elem = document.getElementById(elemId);
                    var theCSSprop = window.getComputedStyle(elem,null).getPropertyValue("font-size");
                    return elem.value.length * 10;
                },
                
                calcFontSize : function (){
                    
                },
                 
                display : function (user, cevent){
                    var msg = {};
                    localStorage.setItem('msg', msg);
                    var msgBox = document.createElement('div');
                    msgBox.className = "msgCont" + user.id;
                    var element = document.createElement('span');
                    element.className = "userName";
                    element.innerHTML = user.name + " : ";
                    msgBox.appendChild(element);
                    var msgCont = document.createElement("span");
                    msgCont.className = "userMsg";
                    msgCont.innerHTML = user.msg;
                    
                    this.userChatList.push(user);
                    localStorage.setItem('uChatList', JSON.stringify(this.userChatList));
                    
                    if(typeof cevent == 'undefined'){
                        var madeTime = new Date().getTime();
                        var userMsg = {'cuser' : user, mt : madeTime};
                        
                        //vApp.recorder.items.push(userMsg);
                    }
                    
                    msgBox.appendChild(msgCont);
                    document.getElementById(this.commonChatId).appendChild(msgBox);
                    this.stickScrollbarAtBottom();
                },
             
                
                //TODO userChatList is not a good name.
                sendPackets : function (user, sp){
                    if(sp + 1 < this.userChatList.length){
                        var chatMissedPackets =  this.userChatList.slice(sp, this.userChatList.length);
                        vApp.wb.utility.beforeSend({"chatPackResponsed": chatMissedPackets, "byRequest": user });
                    }
                },
                
                displayMissedChats : function (chatArray){
                    for(var i=0; i<chatArray.length; i++){
                        this.display(chatArray[i]);
                    }
                },
                
                stickScrollbarAtBottom : function (){
                    var chatBox = document.getElementById("commonChatBoard");
                    chatBox.scrollTop = chatBox.scrollHeight;
                },
                
                alreadyExist : function (id){
                    var element = document.getElementById(id);
                    return (element != null) ? true : false;
                },
                
                isChatAvailable : function (){
                   return  (chatCont.childNodes.length > 0) ? true : false;
                },
                
                removeAllChat : function (){
                   var chatCont = document.getElementById(this.commonChatId);
                   if(chatCont.childNodes.length > 0){
                       
                       while(chatCont.childNodes[0] != null ){
                          chatCont.childNodes[0].parentNode.removeChild(chatCont.childNodes[0]);
                       }
                   }
                }
            }
        }
        
        window.chat = chat;
    }
)(window);

