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
                var control= roles.hasAdmin();
                var template=virtualclass.getTemplate("stickycont","chat");
                $("#stickycontainer").append(template({"control":control}));
                 $('#chatroom_bt2 .inner_bt').click(function () {
                    $('#chatroom_bt2').addClass('active');
                    $('#user_list').removeClass('active');

                     var setting = document.querySelector("#appSettingCtrl");
                     var settingD = document.querySelector("#virtualclassCont.congrea #appSettingDetail");
                     var chat = document.querySelector("#virtualclassCont.congrea #chatWidget");
                     if(setting.classList.contains('settingActive')){
                         setting.classList.remove('settingActive');
                         setting.classList.add("chatActive");
                     }
                     chat.classList.remove("deactive");
                     if(!chat.classList.contains('active')){
                         chat.classList.add("active");
                     }
                     settingD.classList.remove("active");
                     settingD.classList.remove("active");
                     if(! settingD.classList.contains('deactive')){
                         settingD.classList.add("deactive");
                     }

                     // $('#congreaSupport').removeClass("active")
                    $('#chatroom_bt2').removeClass('ui-state-highlight');
                    virtualclass.chat.chatWindow="common";
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

                        $('#chatwidget .vmchat_room_bt').attr('data-title', virtualclass.lang.getString('commonChat'));

                    }

                     var chatbox = document.getElementById("ta_chrm2");
                     if (chatbox) {
                         chatbox.style.display = "block";
                     }

                    var memlist = document.getElementById('memlist');
                    if (memlist) {
                        memlist.classList.remove("enable");
                    }

                     var searchbox = document.querySelector('.congrea .vmchat_search #congreaUserSearch');
                     if (searchbox) {
                         searchbox.style.display = "none";
                     }

                    var chatroom = document.getElementById('chatrm');
                    if (!chatroom.classList.contains("enable")) {
                        chatroom.classList.add("enable");
                    }

                });

                $('#user_list').click(function () {
                    $('#chatroom_bt2').removeClass('active');
                    // $('#congreaSupport').removeClass('active');
                    $('#user_list').addClass('active');
                    var setting = document.querySelector("#appSettingCtrl");
                    var chat = document.querySelector("#virtualclassCont.congrea #chatWidget");
                    var settingD = document.querySelector("#virtualclassCont.congrea #appSettingDetail");
                    if(setting.classList.contains('settingActive')){
                        setting.classList.remove('settingActive');
                        setting.classList.add("chatActive");

                    }

                    chat.classList.remove("deactive");
                    if(!chat.classList.contains('active')){
                        chat.classList.add("active");
                    }

                    settingD.classList.remove("active");
                    if(! settingD.classList.contains('deactive')){
                        settingD.classList.add("deactive");
                    }

//                $('#chatrm').addClass("hide").removeClass('show');
//                $('#memlist').addClass('show').removeClass('hide');
                    virtualclass.chat.chatWindow="private";
                    this.classList.add("active");
                    var chatroom = document.getElementById("chatrm");
                    if (chatroom) {
                        chatroom.classList.remove("enable");
                    }

                    var chatbox = document.getElementById("ta_chrm2");
                    if (chatbox) {
                        chatbox.style.display = "none";
                    }

                    var searchbox = document.querySelector('.congrea .vmchat_search #congreaUserSearch');
                    if (searchbox) {
                        searchbox.style.display = "block";
                    }

                    var memlist = document.getElementById("memlist");
                    if (memlist) {
                        memlist.classList.add("enable")

                    }




                }),

            // $(document).on("click", '#congreaSupport', function (event) {
            //     $('#chatroom_bt2').removeClass('active');
            //     $('#user_list').removeClass('active');
            //     $('#congreaSupport').addClass("active")
            //     virtualclass.chat.chatWindow="support";
            //     // support  id to be dynamic
            //     var str = $(this);
            //     var ahref = str.attr('href');
            //     var name = virtualclass.lang.getString('techsupport');
            //     var id = $(this).attr("data-tsid")
            //    // var id = "7";
            //     if ($.inArray(id, virtualclass.chat.idList) == -1) {
            //         virtualclass.chat.counter++;
            //         virtualclass.chat.idList.push(id);
            //         virtualclass.chat.vmstorage[id] = [];
            //         virtualclass.chat.vmstorage[id].push({userid: id, name: name});
            //     }
            //
            //     chatboxManager.addBox(id,
            //         {
            //             dest: "dest" + virtualclass.chat.counter, // not used in demo
            //             title: "box" + virtualclass.chat.counter,
            //             first_name: name,
            //             class: "support",
            //             //you can add your own options too
            //         });
            //
            //     chatboxManager.init({
            //         user: {'name': name},
            //         messageSent: function (id, user, msg) {
            //             $("#" + id).chatbox("option", "boxManager").addMsg(user.name, msg);
            //         }
            //     });
            //     id = null;
            //     name = null;
            //     var height = virtualclass.vutil.calculateChatHeight();
            //     if (!roles.hasControls()) {
            //
            //         if (!virtualclass.videoHost.gObj.videoSwitch) {
            //             height = height + 230;
            //             $('#chat_div').height(height);
            //         }
            //
            //     }
            //
            //     virtualclass.vutil.setChatContHeight();
            //
            // });

            $('#congreaUserSearch').keyup(function () {
                var text = this.value;
                searchUser(text);

            });
            //todo to change this code later
            function searchUser() {
                var arr = [];
                virtualclass.connectedUsers.forEach(function (item) {
                    if(item.userid != virtualclass.gObj.uid){
                        var obj={
                            'id':item.userid,
                            'name':item.name.toLowerCase()
                        };

                        arr.push(obj);
                    }
                });

                var text = document.getElementById("congreaUserSearch").value;
                _searchUser(arr, text.toLowerCase());

            }
            function _searchUser(arr, search) {
                arr.forEach(function (obj, index) {
                    if (obj['name'].indexOf(search) != -1) {
                        $('#ml' + obj['id']).show();
                    } else {
                        $('#ml' + obj['id']).hide();
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