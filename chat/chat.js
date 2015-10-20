(
    //$ is stands for jQuery
    function(window, $) {
    var Chat = function() {
        return {
            init: function( ) {
                this.chatroombox = null;
                this.counter = 0;
                this.idList = [];
                var box = null;
                $.htab = [];
                $.htabIndex = [];
                //virtualclass.chat.vmstorage = {};
                this.vmstorage = {};
                $('body').footerbar();

                if(localStorage.getItem('init') == 'false'){ // check footer is close
                    $('#stickybar').removeClass('maximize').addClass('minimize');
                    $('#hide_bar input').removeClass('close').addClass('expand');
                }
                
                tabs = $('#tabs').tabs({ cache: true, activeOnAdd: true});

                if (browserSupportsLocalStorage() == false)  { // check browser for local storage
                    alert(lang.sterror);
                    return;
                }
                
                this.history();
                this.UI.privateChatBox.init();
                // new message alert
                $('ul.tabs').on("click, focus", "li", function(){

                    $("li[aria-controls='" + $(this).attr('id') + "']").removeClass('ui-state-highlight');
                });
            }, 
            
            history : function (){
                // checking private chat local storage
                // Data stored in session key inside localStorage variable
                // sid is the session id
                var chatEnable = null;
               
                if (localStorage.getItem(wbUser.sid) != null)  {
                   displayPvtChatHistory();
                   chatEnable = localStorage.getItem('chatEnable');
                   if(chatEnable != null && chatEnable ==  "false"){
                       virtualclass.user.control.disbaleAllChatBox();
                   }
                   this.vmstorage = JSON.parse(localStorage.getItem(wbUser.sid));
                }

                //checking common chat local storage
                //Data stored inside sessionStorage variable
                if(localStorage.length > 0){
                    displaycomChatHistory();
                    virtualclass.chat.removeChatHighLight('chatrm');
                    //if(typeof chatEnable != null && chatEnable == "false"){
                    if(chatEnable != null && chatEnable == "false"){
                        virtualclass.user.control.disableCommonChat();
                    }
                }
            }, 
            
            UI   : {
                privateChatBox : {
                    init : function (){
                        var that = this;
                        $('#tabs').delegate( "span.icon-close", "click", that.close);
                        $("#tabs").on("click", "li a", that.toggle);
                        
                    }, 
                    
                    close : function (){
                        // delete box
                        var tabid = $( this ).closest( "li" ).attr( "id").substring(5);
                        $("#" + tabid).chatbox("option").boxClosed(tabid);
                        $('div#cb' + tabid + '.ui-widget').hide();

                        //delete tab
                        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
                        $( "#" + panelId ).remove();

                        delete virtualclass.chat.vmstorage[tabid]; //delete variable storage
                    },
                    
                    toggle : function (){
                        /* Hide box when click on user tab */
                        var tabid = $( this ).closest( "li" ).attr( "id").substring(5);
                        $("#" + tabid).chatbox('toggleContentbox');
                        if(localStorage.getItem(tabid) == 'hidden'){
                           localStorage.removeItem(tabid);
                        }else{
                           localStorage.setItem(tabid, 'hidden');
                        }
                    }
                }
            },
            
            removedPrvLoggedInDetail : function (){
                //if same user login multiple times then
                //remove previously logged in detail
                $('.ui-memblist').remove();
                $('.ui-chatbox').remove();
                $('div#chatrm').remove();
                virtualclass.chat.chatroombox = null;

                // delete open chat box
                for(key in io.uniquesids){
                    if(key != io.cfg.userid){
                        chatboxManager.delBox(key);
                        $( "li#tabcb" + key ).remove(); //delete tab
                    }
                }
//                this.idList = new Array(); // chatbox
                this.idList = 0; 
                $('#stickybar').removeClass('maximize').addClass('minimize');
                tabs.tabs( "refresh" );//tabs
            },
            
            removeCookieUserInfo : function (e){
                //delete cookie
                document.cookie = "auth_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                document.cookie = "auth_pass=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                document.cookie = "path=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                display_error(e.message);
            },
            
            makeUserListEmpty : function (){
                
                $("#user_list .inner_bt #usertab_icon").css({'background':  'url('+window.whiteboardPath+'images/offline.png)no-repeat top left'});
//                $("#user_list .inner_bt #usertab_text").text(lang.whos + " (0)");
                $("#user_list .inner_bt #usertab_text").html("<span id='onlineusertext'>"+lang.whos + " (0) </span> <span id='usertab_toogle_icon' class='icon-arrow-up'></span>");
                $("#chatroom_bt .inner_bt #chatroom_text").text(lang.chatroom + " (0)");
                $('div#memlist').css('display','none');
            },

            removeChatHighLight : function (id){
                var chatCont = document.getElementById(id);
                if(chatCont != null){
                    var hElements = chatCont.getElementsByClassName("ui-state-highlight");
                    for(var i=0; i<hElements.length; i++){
                        hElements[i].classList.remove('ui-state-highlight');
                    }
                }
            }
        }
    };
    
    window.Chat = Chat;
})(window, $);