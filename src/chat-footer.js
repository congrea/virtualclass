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

        _create: function () {
            var self = this,
                options = self.options,
                offset = options.offset,
                title = options.title || "No Title";
            var control = roles.hasAdmin();
            var template = virtualclass.getTemplate("stickycont", "chat");
            $("#stickycontainer").append(template({"control": control}));
            var chatroom_bt2 = document.getElementById('chatroom_bt2');
            var user_list = document.getElementById('user_list');
            var setting = document.querySelector("#appSettingCtrl");
            var settingD = document.querySelector("#virtualclassCont.congrea #appSettingDetail");
            var chat = document.querySelector("#virtualclassCont.congrea #chatWidget");


            $('#chatroom_bt2 .inner_bt').click(function () {
                var vmchat_room_bt = document.querySelector('#chatwidget .vmchat_room_bt');
                chatroom_bt2.classList.add('active');
                user_list.classList.remove('active');

                // $('#chatroom_bt2').addClass('active');
                // $('#user_list').removeClass('active');

                // var setting = document.querySelector("#appSettingCtrl");
                // var settingD = document.querySelector("#virtualclassCont.congrea #appSettingDetail");
                // var chat = document.querySelector("#virtualclassCont.congrea #chatWidget");
                if (setting.classList.contains('settingActive')) {
                    setting.classList.remove('settingActive');
                    setting.classList.add("chatActive");
                }
                chat.classList.remove("deactive");
                if (!chat.classList.contains('active')) {
                    chat.classList.add("active");
                }
                settingD.classList.remove("active");
                if (!settingD.classList.contains('deactive')) {
                    settingD.classList.add("deactive");
                }
                $('#chatroom_bt2').removeClass('ui-state-highlight');
                virtualclass.chat.chatWindow = "common";
                if ($("ul#chat_room").length == 0) {
                    var d = document.createElement('ul');
                    d.id = 'chat_room';
                    document.body.appendChild(d);

                    virtualclass.chat.chatroombox = $("#chat_room").chatroom({
                        id: "chat_room",
                        user: {'name': 'test'},
                        title: lang.chatroom_header,
                        // offset: '20px',
                        messageSent: function (user, msg) {
                            var userid = user.userid || virtualclass.gObj.uid
                            $("#chat_room").chatroom("option", "boxManager").addMsg(user.name, msg, userid);
                        }
                    });

                    if (virtualclass.gObj.hasOwnProperty('chatEnable')) {
                        if (!virtualclass.gObj.chatEnable) {
                            var chatCont = document.getElementById('chatrm');
                            if (chatCont != null) {
                                virtualclass.user.control.makeElemDisable(chatCont);
                            }
                        }
                    }
                    // TODO this need to be enable
                    // document.querySelector('#chatwidget .vmchat_room_bt').dataSet.dataTitle = virtualclass.lang.getString('commonChat');
                }

                var chatbox = document.getElementById("ta_chrm2");
                if (chatbox) {
                    chatbox.style.display = "block";
                }

                var memlist = document.getElementById("memlist");
                if (memlist) {
                    memlist.classList.remove("enable");
                    if (!memlist.classList.contains("disable")) {
                        memlist.classList.add("disable")
                    }
                }


                var searchbox = document.getElementById('congreaUserSearch');
                if (searchbox) {
                    searchbox.style.display = "none";
                }

                var chatroom = document.getElementById("chatrm");
                if (chatroom) {
                    if (!chatroom.classList.contains("enable")) {
                        chatroom.classList.add("enable");
                    }
                    chatroom.classList.remove("disable")
                }
            });

            $('#user_list').click(function () {
                // $('#chatroom_bt2').removeClass('active');
                chatroom_bt2.classList.remove('active');
                // $('#congreaSupport').removeClass('active');
                //$('#user_list').addClass('active');
                user_list.classList.add('active');
                var setting = document.getElementById("appSettingCtrl");
                var chat = document.getElementById("chatWidget");
                var settingD = document.getElementById("appSettingDetail");
                if (setting.classList.contains('settingActive')) {
                    setting.classList.remove('settingActive');
                    setting.classList.add("chatActive");

                }

                chat.classList.remove("deactive");
                if (!chat.classList.contains('active')) {
                    chat.classList.add("active");
                }

                settingD.classList.remove("active");
                if (!settingD.classList.contains('deactive')) {
                    settingD.classList.add("deactive");
                }

                virtualclass.chat.chatWindow = "private";
                this.classList.add("active");
                var chatroom = document.getElementById("chatrm");
                if (chatroom) {
                    chatroom.classList.remove("enable");
                    if (!chatroom.classList.contains("disable")) {
                        chatroom.classList.add("disable");
                    }
                }


                var chatbox = document.getElementById("ta_chrm2");
                if (chatbox) {
                    chatbox.style.display = "none";
                }

                var searchbox = document.getElementById('congreaUserSearch');
                if (searchbox) {
                    searchbox.style.display = "block";
                }

                var memlist = document.getElementById("memlist");
                if (memlist) {
                    memlist.classList.remove("disable")
                    if (!memlist.classList.contains("enable")) {
                        memlist.classList.add("enable")
                    }
                }

            }),

                $('#congreaUserSearch').keyup(function () {
                    var text = this.value;
                    searchUser(text);

                });
            //todo to change this code later
            function searchUser() {
                var arr = [];
                virtualclass.connectedUsers.forEach(function (item) {
                    if (item.userid != virtualclass.gObj.uid) {
                        var obj = {
                            'id': item.userid,
                            'name': item.name.toLowerCase()
                        };

                        arr.push(obj);
                    }
                });

                var text = document.getElementById("congreaUserSearch").value;
                _searchUser(arr, text.toLowerCase());

            }

            function _searchUser(arr, search) {
                arr.forEach(function (obj, index) {
                    var userElem = chatContainerEvent.elementFromShadowDom("ml" + obj['id'], null, true);
                    if (obj['name'].indexOf(search) != -1) {
                        userElem.style.display = 'block';
                        //$('#ml' + obj['id']).show();
                    } else {
                        //$('#ml' + obj['id']).hide();
                        userElem.style.display = 'none';
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



