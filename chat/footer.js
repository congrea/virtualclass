// widget for footer bar
(function ($) {
    $.widget("ui.footerbar", {
        options: {
            id: null, //id for the DOM element
            offset: 0, // relative to right edge of the browser window
            width: '100%', // width of the chatbox
            barscroll: ($(window).width() - 430),
            supportId: "7",
            boxClosed: function (id) {
            } // called when the close icon is clicked
        },
        init: function (elem) {
            this.elem = elem;
        },
        widget: function () {
            return this.uiFooterbar
        },
        //nirmala
        _create: function () {
            var self = this,
                options = self.options,
                offset = options.offset,
                title = options.title || "No Title",
                // footerbar
                uiFooterbar = (self.uiFooterbar = $('<div></div>'))
                .appendTo(document.getElementById('stickycontainer'))
                .prop("id", 'stickybar')
                .addClass('maximize'),
                //chatroom tab
                uiChatbar = (self.uiChatbar = $('<div></div>'))
                .addClass("chatBarTab")
                .insertBefore(uiFooterbar);
            uiFooterbarchatroomtab = (self.uiFooterbarchatroomtab = $('<div></div>'))
                .addClass('vmchat_room_bt tooltip')

                .attr('data-title', virtualclass.lang.getString('commonChat'))
                .prop('id', 'chatroom_bt2')

                .appendTo(uiChatbar),
                uiFooterbarchatroomContent = (self.uiFooterbarchatroomContent = $('<div class = "inner_bt"></div>'))
                .appendTo(uiFooterbarchatroomtab)
                .click(function () {
                    $('#chatroom_bt2').addClass('active');
                    $('#user_list').removeClass('active');
                    $('#congreaSupport').removeClass("active")
                    $('#chatroom_bt2').removeClass('ui-state-highlight');
                    virtualclass.chat.chatWindow="common";
                    if ($("div#chat_room").length == 0) {
                        var d = document.createElement('div');
                        d.id = 'chat_room';
                        document.body.appendChild(d);

                        virtualclass.chat.chatroombox = $("#chat_room").chatroom({
                            id: "chat_room",
                            user: {'name': 'test'},
                            title: lang.chatroom_header,
                            // offset: '20px',
                            messageSent: function (user, msg) {
                                $("#chat_room").chatroom("option", "boxManager").addMsg(user.name, msg);
                            }});

                        if (virtualclass.gObj.hasOwnProperty('chatEnable')) {
                            if (!virtualclass.gObj.chatEnable) {
                                var chatCont = document.getElementById('chatrm');
                                if (chatCont != null) {
                                    virtualclass.user.control.makeElemDisable(chatCont);
                                }
                            }
                        }

                        uiFooterbarchatroomtab.attr('data-title', virtualclass.lang.getString('commonChat'));

                    }

                    var memlist = document.getElementById('memlist');
                    if (memlist) {
                        memlist.style.display = "none";
                    }


                    var chatroom = document.getElementById('chatrm');
                    if (chatroom) {
                        chatroom.style.display = "block";
                    }


                });
            uiFooterbarchatroomIcon = (self.uiFooterbarchatroomIcon = $('<div id = "chatroom_icon"><span class="icon-chatroom"></span></div>'))
                    .appendTo(uiFooterbarchatroomContent);
            uiFooterbarchatroomText = (self.uiFooterbarchatroomText = $('<div id = "chatroom_text"></div>'))
                    .appendTo(uiFooterbarchatroomContent)
                    // disable minimize icon, for disbaling the chat box
                    .html('Chatroom')

            uiFooterbarUserlisttab = (self.uiFooterbarUserlisttab = $('<div></div>'))
                    .addClass('vmchat_bar_button tooltip')
                    .prop('id', 'user_list')
                    .appendTo(uiChatbar).click(function () {
                $('#chatroom_bt2').removeClass('active');
                $('#congreaSupport').removeClass('active');
                $('#user_list').addClass('active');
//                $('#chatrm').addClass("hide").removeClass('show');
//                $('#memlist').addClass('show').removeClass('hide');
                virtualclass.chat.chatWindow="private";
                this.classList.add("active");
                var chatroom = document.getElementById("chatrm");
                if (chatroom) {
                    chatroom.style.display = "none";
                }

                var memlist = document.getElementById("memlist");
                if (memlist) {
                    memlist.style.display = "block";
                }
              
              
            }),
            uiFooterbarUserlistContent = (self.uiFooterbarUserlistContent = $('<div class="inner_bt"></div>'))
                    .appendTo(uiFooterbarUserlisttab);

            uiFooterbarUserlistText = (self.uiFooterbarUserlistText = $('<div id="usertab_text">privateChat</div>'))
                    .appendTo(uiFooterbarUserlistContent)
                    .text('Private Chat')
            uiFooterbarUserlisttab.attr('data-title', virtualclass.lang.getString('privateChat'))
            uiSupportTab = (self.uiSupportTab = $('<div></div>'))
                    .addClass('vmchat_support notavailable tooltip')
                    .prop('id', 'congreaSupport')
                    .appendTo(uiChatbar),
                    uiSupportContent = (self.uiFooterbarUserlistContent = $('<div class="support_bt"></div>'))
                    .appendTo(uiSupportTab);

            uiSupportIcon = (self.uiFooterbarUserlistIcon = $('<div id="supporttab_icon"></div>'))
                    .appendTo(uiSupportContent);

            uiFooterbarUserlistText = (self.uiFooterbarUserlistText = $('<div id="supporttab_text"></div>'))
                    .appendTo(uiSupportContent)      
                    .text('support');
            uiSupportTab.attr('data-title', virtualclass.lang.getString('support'))
            $(document).on("click", '#congreaSupport', function (event) {
                $('#chatroom_bt2').removeClass('active');
                $('#user_list').removeClass('active');
                $('#congreaSupport').addClass("active")
                virtualclass.chat.chatWindow="support";
                // support  id to be dynamic  
                var str = $(this);
                var ahref = str.attr('href');
                var name = virtualclass.lang.getString('techsupport');
                var id = $(this).attr("data-tsid")
               // var id = "7";
                if ($.inArray(id, virtualclass.chat.idList) == -1) {
                    virtualclass.chat.counter++;
                    virtualclass.chat.idList.push(id);
                    virtualclass.chat.vmstorage[id] = [];
                    virtualclass.chat.vmstorage[id].push({userid: id, name: name});
                }

                chatboxManager.addBox(id,
                    {
                        dest: "dest" + virtualclass.chat.counter, // not used in demo
                        title: "box" + virtualclass.chat.counter,
                        first_name: name,
                        class: "support",
                        //you can add your own options too
                    });

                chatboxManager.init({
                    user: {'name': name},
                    messageSent: function (id, user, msg) {
                        $("#" + id).chatbox("option", "boxManager").addMsg(user.name, msg);
                    }
                });
                id = null;
                name = null;
                var height = virtualclass.vutil.calculateChatHeight();
                if (!roles.hasControls()) {

                    if (!virtualclass.videoHost.gObj.videoSwitch) {
                        height = height + 230;
                        $('#chat_div').height(height);
                    }

                }
               
                virtualclass.vutil.setChatContHeight();

            });

            uiFooterbartabCont = (self.uiFooterbartabCont = $('<div></div>'))
                    .attr('id', 'tabs')
                    .addClass("tabs-bottom", "privateChat")
                    .appendTo(uiFooterbar);

            uiFooterbartabs = (self.uiFooterbartabs = $('<ul class="tabs"></ul>'))
                    .appendTo(uiFooterbartabCont);

            uiFooterCtrCont = (self.uiFooterCtrCont = $('<div></div>'))
                    .addClass('footerCtr')
                    .prop('id', 'congFooterCtr')
                    .appendTo(document.getElementById('stickybar')),
                    uiMuteAll = (self.uiMuteAll = $('<div></div>'))
                    .addClass('uiMuteAll')
                   //.prop('id', 'precheckTest')
                    .appendTo(uiFooterCtrCont),
                    uiPrecheckTab = (self.uiPrecheckTab = $('<div></div>'))
                    .addClass('prechk')
                    .prop('id', 'precheckTest')
                    .appendTo(uiFooterCtrCont),
                    uiPrecheck = (self.uiPrecheckTab = $('<span></span>'))
                    .addClass('precheck tooltip')
                    .prop('id', 'precheckSetting')
                    .prop('data-title', 'precheck test')
                    .text("precheck")
                    .appendTo(uiPrecheckTab),
                    uiVideoSwitchTab = (self.uiVideoSwitchTab = $('<div></div>'))
                    .addClass('videoSwitchCont')
                    .prop('id', 'congCtrBar')
                    .appendTo(uiFooterCtrCont),
                    uiSearchTab = (self.uiSearchTab = $('<div></div>'))
                    .addClass('vmchat_search')
                    .prop('id', 'congUserSearch')
                    .appendTo(uiFooterCtrCont),
                    uiSearchContent = (self.uisearchContent = $('<input type ="text" id="congreaUserSearch" class="search" placeholder="search user ...">'))
                    .appendTo(uiSearchTab).keyup(function () {
                var text = this.value;
                searchUser(text);



            });
            //todo to change this code later
            function searchUser() {
                var arr = [];
                virtualclass.chat.userList.forEach(function (item) {
                    arr.push(item.name.toLowerCase());

                });

                var text = document.getElementById("congreaUserSearch").value;
                _searchUser(arr, text.toLowerCase());

            }
            function _searchUser(arr, search) {
                arr.forEach(function (elem, index) {
                    if (elem.indexOf(search) != -1) {
                        $('#ml' + virtualclass.chat.userList[index].userid).show();
                    } else {
                        $('#ml' + virtualclass.chat.userList[index].userid).hide();
                    }

                })

            }

            self._setWidth(self.options.width);
            self.init(self);
        },
        destroy: function () {
            this.element.remove();
            // if using jQuery UI 1.9.x
            this._destroy();
        },
        //to ask
        _setWidth: function (width) {
            //  this.uiFooterbar.width(width + "px");
        }

    });

}(jQuery));


(function ($) {
    $.fn.clickToggle = function (func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function () {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery));