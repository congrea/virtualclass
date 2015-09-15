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
                .attr('data-title', virtualclass.lang.getString('maxCommonChat'))
            .prop('id', 'chatroom_bt2')
            
            .appendTo(uiFooterbar),

            uiFooterbarchatroomContent = (self.uiFooterbarchatroomContent = $('<div class = "inner_bt"></div>'))
                .appendTo(uiFooterbarchatroomtab);

            uiFooterbarchatroomIcon = (self.uiFooterbarchatroomIcon = $('<div id = "chatroom_icon"><span class="icon-chatroom"></span></div>'))
                .appendTo(uiFooterbarchatroomContent);
             uiFooterbarchatroomText = (self.uiFooterbarchatroomText = $('<div id = "chatroom_text"></div>'))
            .appendTo(uiFooterbarchatroomContent)
            .html('Chatroom <span id="cc_arrow_button" class="icon-arrow-up"></span>')
            .click(function(){
                 if (virtualclass.chat.chatroombox) {
                       toggleCommonChatBox();
                }else{
//                    alert('sss');
                    if($("div#chat_room").length == 0){
                        var d = document.createElement('div');
                        d.id = 'chat_room';
                        document.body.appendChild(d);

                        virtualclass.chat.chatroombox = $("#chat_room").chatroom({
                            id: "chat_room",
                                                user:{'name':'test'},
                                                title : lang.chatroom_header,
                                                offset: '20px',
                                                messageSent : function(user, msg) {
                                                    $("#chat_room").chatroom("option", "boxManager").addMsg(user.name,msg);
                                                }});
                        
                        //added by suman
                        if (virtualclass.gObj.hasOwnProperty('chatEnable')) {
                            if (!virtualclass.gObj.chatEnable) {
                                var chatCont = document.getElementById('chatrm');
                                if(chatCont != null){
                                    virtualclass.user.control.makeElemDisable(chatCont);
                                }
                            }
                        }
                        var iconarrowButton = document.getElementById('cc_arrow_button');
                        iconarrowButton.classList.add('icon-arrow-down');
                        iconarrowButton.classList.remove('icon-arrow-up')
                        uiFooterbarchatroomtab.attr('data-title', virtualclass.lang.getString('minCommonChat'));
                                
                    }  // if end
                }//else end


                 }); //click end

            //userlist tab
            uiFooterbarUserlisttab = (self.uiFooterbarUserlisttab = $('<div></div>'))
            .addClass('vmchat_bar_button')
            .prop('id', 'user_list')
            .appendTo(uiFooterbar),

            uiFooterbarUserlistContent = (self.uiFooterbarUserlistContent = $('<div class="inner_bt"></div>'))
                .appendTo(uiFooterbarUserlisttab);

            uiFooterbarUserlistIcon = (self.uiFooterbarUserlistIcon = $('<div id="usertab_icon"></div>'))
                .appendTo(uiFooterbarUserlistContent);
            uiFooterbarUserlistText = (self.uiFooterbarUserlistText = $('<div id="usertab_text" class="tooltip close " data-title="' + virtualclass.lang.getString('maxUserList') + '"></div>'))
                .appendTo(uiFooterbarUserlistContent)
//            uiFooterUpArrowIcon = (self.uiFooterUpArrowIcon = $('<span id="usertab_toogle_icon" class="icon-arrow-up"></span>'))
//                .appendto("#usertab_text")
//        
            .text('Private Chat')
            .click(function(){
                    virtualclass.gObj.video.dispAllVideo("chat_div");
                if(Object.keys(io.uniquesids).length > 0){
                    if($(this).hasClass('close')){
                        $(this).addClass('open' );
                        $(this).removeClass('close');
                        
                        $("#usertab_toogle_icon").addClass('icon-arrow-down');
                        $("#usertab_toogle_icon").removeClass('close icon-arrow-up');

                        $(this).attr('data-title', virtualclass.lang.getString('miniUserList'));
                        
                    }else{

                        $(this).addClass('close');
                        $(this).removeClass('open');
                        $("#usertab_toogle_icon").addClass('icon-arrow-up');
                        $("#usertab_toogle_icon").removeClass('icon-arrow-down');
                        $(this).attr('data-title', virtualclass.lang.getString('maxUserList'));
                    }


                    
                    $("#chat_div").memberlist("option", "boxManager").toggleBox();
                }
                });

            // tab contain multiple open chatbox
            uiFooterbartabCont = (self.uiFooterbartabCont = $('<div></div>'))
            .attr('id', 'tabs')
            .addClass( "tabs-bottom" )
                .appendTo(uiFooterbar);

            uiFooterbartabs = (self.uiFooterbartabs = $('<ul class="tabs"></ul>'))
                .appendTo(uiFooterbartabCont);

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
