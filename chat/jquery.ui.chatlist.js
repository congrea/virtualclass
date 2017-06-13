/*
 * http://vidyamantra.com
 *
 * Depends on jquery.ui.core, jquery.ui.widiget, jquery.ui.effect
 *
 * Also uses some styles for jquery.ui.dialog
 */


// Display online user list
(function ($) {
    $.widget("ui.memberlist", {
        options: {
            id: null, //id for the DOM element
            title: null, // title of the chatbox
            user: null, // can be anything associated with this chatbox
            hidden: false,
            offset: 0, // relative to right edge of the browser window
            width: 320, // width of the chatbox
            userSent: function (user) {
                if (user.userid != '7') {
                    //nirmala
                    this.boxManager.addUsr(user.name);
                } else {

                }

                //todo to generalize this
            },
            boxClosed: function (id) {
            }, // called when the close icon is clicked
            boxManager: {
                init: function (elem) {
                    this.elem = elem;
                },
                addUsr: function (peer) {
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var userAlready = document.getElementById("ml" + peer.userid);
                    if (userAlready != null) {
                        userAlready.parentNode.removeChild(userAlready);
                    }
                    var usr = peer;
                    if (peer.userid != wbUser.id) {
                        usr.notSelf = true;
                    }
                    usr.class = "ui-memblist-usr offline"
                    //usr.id = peer.userid;
                    var template=virtualclass.getTemplate("chatuser","chat");
                    $(box).append(template({"peer": usr}));

                    var systemMessage = false;

                    if (peer) {
                        var controls = ['assign', 'audio', 'chat', 'editorRich', 'editorCode'];
                        if (peer.userid != wbUser.id) {
                            var controlDiv = virtualclass.user.createControl(peer.userid, controls);
                            virtualclass.user.control.shouldApply.call(virtualclass.user, peer.userid); //checking audio
                        }

                       if (roles.hasControls() != null && !roles.hasAdmin()) {
                            if (peer.userid == localStorage.getItem('aId')) {
                                var controls = ['assign'];
                                var controlCont = document.getElementById(peer.userid + "ControlContainer");
                                if (controlCont != null) {
                                    virtualclass.user.createAssignControl(controlCont, peer.userid, true);
                                } else {
                                    var divContainer = document.getElementById("ml" + peer.userid);
                                    var divControl = virtualclass.user.createControl(peer.userid, controls);
                                    divContainer.appendChild(divControl);

                                }
                            }
                        }

                    } else {
                        systemMessage = true;
                    }

                    var chatEnable = localStorage.getItem('chatEnable');
                    if (chatEnable != null && chatEnable == "false") {
                        virtualclass.user.control.disableOnLineUser();
                    }

                    if (virtualclass.gObj.uid == peer.userid) {
                        var userDiv = document.getElementById("ml" + virtualclass.gObj.uid);

                        if (userDiv != null) {
                            userDiv.classList.add("mySelf");
                        }
                    }

                },
                highlightBox: function () {
                    var self = this;
                    self.elem.uiChatboxTitlebar.effect("highlight", {}, 300);
                    self.elem.uiChatbox.effect("bounce", {times: 3}, 300, function () {
                        self.highlightLock = false;
                        self._scrollToBottom();
                    });
                },
                toggleBox: function () {

                    //  this.elem.uiChatbox.toggle("slide",{direction:"down"},1000);
                },
                _scrollToBottom: function () {
                    var box = this.elem.uiChatboxLog;
                    box.scrollTop(box.get(0).scrollHeight);
                }
            }
        },
        toggleContent: function (event) {
            this.uiChatboxContent.toggle();
            if (this.uiChatboxContent.is(":visible")) {
            }
        },
        widget: function () {
            return this.uiChatbox
        },
        _create: function () {

            var self = this,
                    options = self.options,
                    offset = options.offset,
                    title = options.title || "No Title",
                    // chatbox
                    uiChatbox = (self.uiChatbox = $('<div></div>'))
                    .appendTo(document.getElementById('congreaChatCont'))
                    .addClass('ui-widget ' +
                            'ui-corner-top ' +
                            'ui-memblist'
                            )
                    .attr('id', 'memlist')
                    .css('display', 'none')
            uiChatboxContent = (self.uiChatboxContent = $('<div></div>'))
                    .addClass('ui-widget-content ' +
                            'ui-memblist-content '
                            )
                    .appendTo(uiChatbox),
                    uiChatboxLog = (self.uiChatboxLog = self.element)
                    .addClass('ui-widget-content ' +
                            'ui-memblist-log'
                            )
                    .appendTo(uiChatboxContent)

                    .focusin(function () {

                        var box = $(this).parent().prev();
                        //box.scrollTop(box.get(0).scrollHeight);
                        box.scrollTop(box.scrollHeight);
                    });

            $(document).on("click", '#chat_div .ui-memblist-usr a', function (event) {
                var str = $(this);
                var ahref = str.attr('href');
                if (typeof ahref != 'undefined') {
                    var id = ahref.replace('#', '');
                    var name = str.siblings('.user-details').find('.usern span').html();

                    if ($.inArray(id, virtualclass.chat.idList) == -1) {
//                        counter++;
                        //idList.push(id);
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
                                type: "privateChat",
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
                }



            });

            self._setWidth(self.options.width);
            self._position(self.options.offset);
            self.options.boxManager.init(self);
            if (roles.hasAdmin()) {
                virtualclass.user.UIaudioAll('congFooterCtr', 'uiMuteAll');
            }
        },
        _setOption: function (option, value) {
            if (value != null) {
                switch (option) {
                    case "hidden":
                        if (value) {
                            this.uiChatbox.hide();
                        } else {
                            this.uiChatbox.show();
                        }
                        break;

                    case "offset":
                        this._position(value);
                        break;

                    case "width":
                        this._setWidth(value);
                        break;
                }
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        },
        _setWidth: function (width) {
            // this.uiChatboxTitlebar.width(width + "px");
            this.uiChatboxLog.width(width + "px");
        },
        _position: function (offset) {
            this.uiChatbox.css("right", offset);
        }
    });

}(jQuery));
