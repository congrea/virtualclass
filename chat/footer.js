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
            //chatroom tab
            uiFooterbarchatroomtab = (self.uiFooterbarchatroomtab = $('<div></div>'))
            .addClass('vmchat_room_bt tooltip')
            //.data('data-title', 'Expand for common chat'), is not working 
            .attr('data-title', vApp.lang.getString('maxCommonChat'))
            .prop('id', 'chatroom_bt2')
            
            .appendTo(uiFooterbar),

            uiFooterbarchatroomContent = (self.uiFooterbarchatroomContent = $('<div class = "inner_bt"></div>'))
            .appendTo(uiFooterbarchatroomtab)

            uiFooterbarchatroomIcon = (self.uiFooterbarchatroomIcon = $('<div id = "chatroom_icon"></div>'))
            .appendTo(uiFooterbarchatroomContent)
             uiFooterbarchatroomText = (self.uiFooterbarchatroomText = $('<div id = "chatroom_text"></div>'))
            .appendTo(uiFooterbarchatroomContent)
            .text('Chatroom')
            .click(function(){
                if(vApp.chat.chatroombox){
				    if(sessionStorage.getItem('chatroom_status') == 'hidden'){
                       sessionStorage.removeItem('chatroom_status');
                       uiFooterbarchatroomtab.attr('data-title', vApp.lang.getString('minCommonChat'));
                      
                   }else{
                       sessionStorage.setItem("chatroom_status", "hidden");
                       uiFooterbarchatroomtab.attr('data-title', vApp.lang.getString('maxCommonChat'));
                   }
                   vApp.chat.chatroombox.chatroom("option", "boxManager").toggleBox();
                }else{

                    if($("div#chat_room").length == 0){
                        var d = document.createElement('div');
                        d.id = 'chat_room';
                        document.body.appendChild(d);

                        vApp.chat.chatroombox = $("#chat_room").chatroom({id:"chat_room",
                                                user:{'name':'test'},
                                                title : lang.chatroom_header,
                                                offset: '20px',
                                                messageSent : function(user, msg) {
                                                    $("#chat_room").chatroom("option", "boxManager").addMsg(user.name,msg);
                                                }});
                        
                        //added by suman
                        if(vApp.gObj.hasOwnProperty('chatEnable')){
                            if(!vApp.gObj.chatEnable){
                                var chatCont = document.getElementById('chatrm');
                                if(chatCont != null){
                                   vApp.user.control.makeElemDisable(chatCont);
                                }
                            }
                        }
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
             uiFooterbarUserlistText = (self.uiFooterbarUserlistText = $('<div id="usertab_text" class="tooltip close" data-title="'+vApp.lang.getString('maxUserList')+'"></div>'))
            .appendTo(uiFooterbarUserlistContent)
            .text('Private Chat')
            .click(function(){ 
               vApp.gObj.video.dispAllVideo("chat_div");
                if(Object.keys(io.uniquesids).length > 0){
                    if($(this).hasClass('close')){
                        $(this).addClass('open');
                        $(this).removeClass('close');
                        $(this).attr('data-title', vApp.lang.getString('miniUserList'));
                    }else{
                        $(this).addClass('close');
                        $(this).removeClass('open');
                        $(this).attr('data-title', vApp.lang.getString('maxUserList'));
                    }
                    
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
