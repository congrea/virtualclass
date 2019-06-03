/*
 * http://www.vidyamantra.com
 *
 * Depends on jquery.ui.core, jquery.ui.widiget, jquery.ui.effect
 *
 * Also uses some styles for jquery.ui.dialog
 */


// Display box for chatroom
(function ($) {
    $.widget("ui.chatroom", {
        options: {
            id: null, //id for the DOM element
            title: null, // title of the chatbox
            user: null, // can be anything associated with this chatbox
            hidden: false,
            offset: 6, // relative to right edge of the browser window
            width: 311, // width of the chatbox
            messageSent: function (user, msg) {
                this.boxManager.addMsg(user.name, msg);
            },
            boxClosed: function (id) {
            }, // called when the close icon is clicked
            boxManager: {
                init: function (elem) {
                    this.elem = elem;
                },
                addMsg: function (peer, msgObj, userid) {
                    if (typeof virtualclass.gObj.chatIconColors[userid] == "undefined") {
                        groupChatImgColor(peer, userid)
                    }
                    var time = virtualclass.vutil.UTCtoLocalTime(msgObj.time);
                    var msg = msgObj.msg;
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var e = document.createElement('li');
                    e.className = "left clearfix";
                    box.append(e);

                    var chatCont = document.createElement("div");
                    chatCont.className = "chat-user-icon pull-left";
                    e.appendChild(chatCont);

                    if (virtualclass.gObj.chatIconColors[userid]) {
                        chatCont.style.backgroundColor = virtualclass.gObj.chatIconColors[userid].bgColor;
                        chatCont.style.color = virtualclass.gObj.chatIconColors[userid].textColor;
                        var Img = document.createElement("span");
                        Img.className = "chat-img ";
                        Img.innerHTML = virtualclass.gObj.chatIconColors[userid].initial;
                    }

                    chatCont.appendChild(Img);
                    var systemMessage = false;
                    // suman 25
                    var chatContainer = document.createElement("div");
                    chatContainer.className = "commonChatCon chat-body clearfix";

                    if (peer) {
                        var peerName = document.createElement("a");
                        peerName.className = "primary-font";
                        $(peerName).text(peer);
                        chatContainer.appendChild(peerName);
                    } else {
                        systemMessage = true;
                    }

                    var msgElement = document.createElement(systemMessage ? "i" : "p");
                    msgElement.className = "text";
                    $(msgElement).text(msg);

                    var msgTime = document.createElement('span');
                    msgTime.className = "text-muted";
                    msgTime.innerHTML = time;

                    chatContainer.appendChild(msgElement);
                    chatContainer.appendChild(msgTime);
                    e.appendChild(chatContainer);

                    // var msgCont = document.createElement('div');
                    // msgCont.className = 'msgCont';
                    // //suman 25;
                    //
                    // msgCont.appendChild(msgElement);
                    chatContainer.appendChild(msgElement);
                    e.dataset.msgtime = msgObj.time;

                    $(e).addClass("ui-chatbox-msg");
                    $(e).fadeIn();
                    self._scrollToBottom();
                    // sortCommonChat();
                },
                groupChatImgColor: function (peer, userid) {
                    var bgColor = "green";
                    var textColor = "white"
                    //if( typeof virtualclass.gObj.chatIconColors[userid] == "undefined"){
                    var initial = this.getInitials(peer)
                    var user = (userid.toString()) + peer;
                    bgColor = this.stringToHslColor(user, 60, 35)
                    var brightness = virtualclass.vutil.calcBrightness(bgColor);
                    if (brightness > 125) {
                        textColor = "black";
                    } else {
                        textColor = "white";
                    }
                    virtualclass.gObj.chatIconColors[userid] = {
                        bgColor: bgColor,
                        textColor: textColor,
                        initial: initial
                    }
                    // }

                },
                stringToHslColor: function (str, s, l) {
                    var hash = 0;
                    for (var i = 0; i < str.length; i++) {
                        hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    }

                    var h = hash % 360;
                    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
                },
                getInitials: function (string) {
                    var names = string.split(' '),
                        initials = names[0].substring(0, 1).toUpperCase();

                    if (names.length > 1) {
                        initials += names[names.length - 1].substring(0, 1).toUpperCase();
                    }
                    return initials;
                },

                highlightBox: function () {
                    var self = this;
                    self.elem.uiChatboxTitlebar.addClass("ui-state-highlight");
                    self.highlightLock = false;
                    self._scrollToBottom();
                },
                toggleBox: function () {
                    this.elem.uiChatbox.toggle("slide", {direction: "down"}, 1000);
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
                this.uiChatboxInputBox.focus();
            }
        },
        widget: function () {
            return this.uiChatbox
        },
        _create: function () {
            if (localStorage.getItem('chatEnable') != null) {
                var chatStatus = (localStorage.chatEnable == "true") ? "enable" : "disable";
            } else {
                var chatStatus = "disable";
            }

            var self = this,
                options = self.options,
                offset = options.offset,
                title = options.title || "No Title",
                // chatbox, commonchat box
                uiChatbox = (self.uiChatbox = $('<div></div>'))
                    .appendTo(document.getElementById('congreaChatCont'))
                    .addClass('ui-widget ' +
                        'ui-corner-top ' +
                        'ui-chatroom ' +
                        chatStatus
                    )
                    .prop('id', 'chatrm')
            uiChatboxContent = (self.uiChatboxContent = $('<div></div>'))
                .addClass('ui-widget-content ' + 'ui-chatbox-content ')
                .appendTo(uiChatbox),
                uiChatboxLog = (self.uiChatboxLog = self.element)
                    .addClass('ui-widget-content ' + 'ui-chatbox-log')
                    .appendTo(uiChatboxContent),
                // uiChatboxInput = (self.uiChatboxInput = $('<div></div>'))
                // .addClass('ui-widget-content ' + 'ui-chatbox-input') // saturday findout
                // .click(function (event) {
                //     // anything?
                // })
                // .appendTo(uiChatboxContent),
                uiChatboxInputBox = (self.uiChatboxInputBox = $('<input></input>'))
                    .addClass('ui-widget-content ' + 'ui-chatbox-input-box ')
                    .prop('id', 'ta_chrm2')
                    .prop('placeholder', 'Send message...')
                    .appendTo(document.querySelector(".congrea #congchatBarInput"))
                    .keydown(function (event) {
                        if (event.keyCode && event.keyCode == $.ui.keyCode.ENTER) {
                            msg = $.trim($(this).val());
                            var time = new Date().getTime();
                            var msgobj = {'receiver': 'chatroom', 'msg': msg, 'cf': 'msg', time: time};
                            if (msg.length > 0) {
                                ioAdapter.mustSend(msgobj);
                                $(this).val('');
                                //self.options.messageSent({name:io.cfg.userobj.name}, {msg:msg, time:time});// sent msg to self
                                //
                                self.options.messageSent({name: io.cfg.userobj.name}, {msg: msg, time: time});
                                // store data on browser
                                if (localStorage.getItem('chatroom') != null) {
                                    var chatroom = JSON.parse(localStorage.getItem('chatroom'));
                                    var cmsg = {userid: io.cfg.userid, name: io.cfg.userobj.name, msg: msg, time: time};
                                    chatroom.push(cmsg);
                                    localStorage.setItem('chatroom', JSON.stringify(chatroom));
                                } else {
                                    var cmsg = {userid: io.cfg.userid, name: io.cfg.userobj.name, msg: msg, time: time};
                                    localStorage.setItem('chatroom', JSON.stringify([cmsg]));
                                }
                                // For exporting the common chat
                                virtualclass.chat.commonChat.push(cmsg);
                            }
                            return false;
                        }
                    })
                    .focusin(function () {
                        uiChatboxInputBox.addClass('ui-chatbox-input-focus');
                        // var box = $(this).parent().prev();
                        // box.scrollTop(box.get(0).scrollHeight);
                    })
                    .focusout(function () {
                        uiChatboxInputBox.removeClass('ui-chatbox-input-focus');
                    });

            uiChatboxContent.children().click(function () {

                self.uiChatboxInputBox.focus();
            });

            self._setWidth(self.options.width);
            self._position(self.options.offset);

            self.options.boxManager.init(self);


            if (!self.options.hidden) {
                uiChatbox.show();
                if (virtualclass.vutil.isPlayMode()) {

                    disCommonChatInput();
                }
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
            this.uiChatbox.width(width + "px");
            // this.uiChatboxInputBox.css("width", (width - 14) + "px");
        },
        _position: function (offset) {
            this.uiChatbox.css("left", offset);
        },

    });
}(jQuery));
