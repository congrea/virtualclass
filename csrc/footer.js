// widget for footer bar
(function($){
    $.widget("ui.footerbar", {
        options: {
            id: null, //id for the DOM element
            offset:0, // relative to right edge of the browser window
            width: '100%', // width of the chatbox
            barscroll:($(window).width() - 430),
            boxClosed: function(id) {} // called when the close icon is clicked
        },
        init: function(elem) {
                    this.elem = elem;
        },

        widget: function() {
            return this.uiFooterbar
        },

        _create: function(){
            
            var self = this,
            options = self.options,
            offset = options.offset,
            title = options.title || "No Title",
            // footerbar
            uiFooterbar = (self.uiFooterbar = $('<div></div>'))
            .appendTo(document.getElementById('stickycontainer'))
           // .appendTo(document.getElementById())
            .prop( "id", 'stickybar' )
            .addClass('maximize'),
            // close button tab
            uiFooterbarClosebox = (self.uiFooterbarClosebox = $('<div></div>'))
            .addClass('vmchat_close_bt')
            .prop('id', 'hide_bar')
            .appendTo(uiFooterbar),

            uiFooterbarClose = (self.uiFooterbarClose = $('<input>'))
            .prop('id', 'closebtn')
            .prop('type', 'button')
            .prop('title', 'Close chat')
            .addClass('close')
            .appendTo(uiFooterbarClosebox)
            .clickToggle(function() {
                if($('#stickybar').hasClass('maximize')){
                    $('#stickybar').removeClass('maximize').addClass('minimize');
                    $('#hide_bar input').removeClass('close').addClass('expand')
                    $('#hide_bar input').prop('title', 'Open chat');
                    //alert('sss');
                    vApp.gObj.video.close();
                    io.disconnect();
                    $('.ui-memblist').remove();
                    $('.ui-chatbox').remove();
                    $('div#chatrm').remove();
                    chatroombox = null;

                    // delete open chat box
                    for(key in io.uniquesids){
                        if(key != io.cfg.userid){
                            chatboxManager.delBox(key);
                            $( "li#tabcb" + key ).remove(); //delete tab
                        }
                    }
                    idList = new Array(); // chatbox
                    tabs.tabs( "refresh" );//tabs
                    localStorage.clear(); //empty local storage
                    //TODO:find way to delete object
                    vmstorage = {}; //remove variable storage
                    localStorage.setItem('init', 'false');
                    sessionStorage.removeItem("chatroom");// to remove sessionstorage

                    sessionStorage.clear();
                }
            },
            function() {
                $('#stickybar').removeClass('minimize').addClass('maximize');
                $('#hide_bar input').removeClass('expand').addClass('close');
                $('#hide_bar input').prop('title', 'Close chat');
                localStorage.clear();
                io.init(userdata);
                
//                vApp.gObj.video.close();
                
            });

            //chatroom tab
            uiFooterbarchatroomtab = (self.uiFooterbarchatroomtab = $('<div></div>'))
                .addClass('vmchat_room_bt'
             )
            .prop('id', 'chatroom_bt')
            .appendTo(uiFooterbar),

            uiFooterbarchatroomContent = (self.uiFooterbarchatroomContent = $('<div class = "inner_bt"></div>'))
            .appendTo(uiFooterbarchatroomtab)

            uiFooterbarchatroomIcon = (self.uiFooterbarchatroomIcon = $('<div id = "chatroom_icon"></div>'))
            .appendTo(uiFooterbarchatroomContent)
             uiFooterbarchatroomText = (self.uiFooterbarchatroomText = $('<div id = "chatroom_text"></div>'))
            .appendTo(uiFooterbarchatroomContent)
            .text('Chatroom')
            .click(function(){
                if(chatroombox){
				    if(sessionStorage.getItem('chatroom_status') == 'hidden'){
                       sessionStorage.removeItem('chatroom_status');

                   }else{
                       sessionStorage.setItem("chatroom_status", "hidden");
                   }
                   chatroombox.chatroom("option", "boxManager").toggleBox();
                }else{

                    if($("div#chat_room").length == 0){
                        var d = document.createElement('div');
                        d.id = 'chat_room';
                        document.body.appendChild(d);

                        chatroombox = $("#chat_room").chatroom({id:"chat_room",
                                                user:{'name':'test'},
                                                title : lang.chatroom_header,
                                                offset: '20px',
                                                messageSent : function(user, msg) {
                                                    $("#chat_room").chatroom("option", "boxManager").addMsg(user.name,msg);
                                                }});
                    }  // if end
                }//else end
            }) //click end

            //userlist tab
            uiFooterbarUserlisttab = (self.uiFooterbarUserlisttab = $('<div></div>'))
            .addClass('vmchat_bar_button')
            .prop('id', 'user_list')
            .appendTo(uiFooterbar),

            uiFooterbarUserlistContent = (self.uiFooterbarUserlistContent = $('<div class="inner_bt"></div>'))
            .appendTo(uiFooterbarUserlisttab)

            uiFooterbarUserlistIcon = (self.uiFooterbarUserlistIcon = $('<div id="usertab_icon"></div>'))
            .appendTo(uiFooterbarUserlistContent)
             uiFooterbarUserlistText = (self.uiFooterbarUserlistText = $('<div id="usertab_text"></div>'))
            .appendTo(uiFooterbarUserlistContent)
            .text('Private Chat')
            .click(function(){ 
               vApp.gObj.video.dispAllVideo("chat_div");

                if(Object.keys(io.uniquesids).length > 0){
                    $("#chat_div").memberlist("option", "boxManager").toggleBox();
                }
                    
            })

            // tab contain multiple open chatbox
            uiFooterbartabCont = (self.uiFooterbartabCont = $('<div></div>'))
            .attr('id', 'tabs')
            .addClass( "tabs-bottom" )
            .appendTo(uiFooterbar)

            uiFooterbartabs = (self.uiFooterbartabs = $('<ul class="tabs"></ul>'))
            .appendTo(uiFooterbartabCont)

            self._setWidth(self.options.width);
            self.init(self);
        },

       destroy: function () {
            this.element.remove();
            // if using jQuery UI 1.9.x
            this._destroy();
        },

        _setWidth: function(width) {
            this.uiFooterbar.width(width + "px");
         }

    });

}(jQuery));


(function($) {
    $.fn.clickToggle = function(func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function() {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery));
