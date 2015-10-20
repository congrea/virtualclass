/*
* http://www.vidyamantra.com
*
* Depends on jquery.ui.core, jquery.ui.widiget, jquery.ui.effect
*
* Also uses some styles for jquery.ui.dialog
*/


// Display box for chatroom
(function($){
    $.widget("ui.chatroom", {
        options: {
            id: null, //id for the DOM element
            title: null, // title of the chatbox
            user: null, // can be anything associated with this chatbox
            hidden: false,
            offset: 20, // relative to right edge of the browser window
            width: 230, // width of the chatbox
            messageSent: function(user, msg){
                this.boxManager.addMsg(user.name, msg);
            },
            boxClosed: function(id) {}, // called when the close icon is clicked
            boxManager: {

                init: function(elem) {
                    this.elem = elem;
                },
                addMsg: function(peer, msg) {
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var e = document.createElement('div');
                    box.append(e);

                    var systemMessage = false;

                    if (peer) {
                        var peerName = document.createElement("b");
                        $(peerName).text(peer + ": ");
                        e.appendChild(peerName);
                    } else {
                        systemMessage = true;
                    }

                    var msgElement = document.createElement(systemMessage ? "i" : "span");
                    $(msgElement).text(msg);
                    e.appendChild(msgElement);
                    $(e).addClass("ui-chatbox-msg");
                    $(e).fadeIn();
                    self._scrollToBottom();

                    if (!self.elem.uiChatboxTitlebar.hasClass("ui-state-focus") && !self.highlightLock) {
                        self.highlightLock = true;
                        self.highlightBox();
                    }
                },
                highlightBox: function() {
                    var self = this;
                    self.elem.uiChatboxTitlebar.addClass("ui-state-highlight");
                    /*self.elem.uiChatboxTitlebar.effect("highlight", {},600, function(){
                        self.highlightLock = false;
                        self._scrollToBottom();
                    });*/
                    self.highlightLock = false;
                    self._scrollToBottom();
                },
                toggleBox: function() {
                   this.elem.uiChatbox.toggle("slide",{direction:"down"},1000);
                },
                _scrollToBottom: function() {
                    var box = this.elem.uiChatboxLog;
                    box.scrollTop(box.get(0).scrollHeight);
                }
            }
        },

        toggleContent: function(event) {
            this.uiChatboxContent.toggle();
            if(this.uiChatboxContent.is(":visible")) {
                this.uiChatboxInputBox.focus();
            }
        },

        widget: function() {
            return this.uiChatbox
        },

        _create: function(){
            if(localStorage.getItem('chatEnable') != null){
                var chatStatus = (localStorage.chatEnable == "true") ? "enable" : "disable";
            }else{
                var chatStatus = "enable";
            }
            
	        var self = this,
            options = self.options,
            offset = options.offset,
            title = options.title || "No Title",
            // chatbox, commonchat box
            uiChatbox = (self.uiChatbox = $('<div></div>'))
            .appendTo(document.getElementById('chatWidget'))
            .addClass('ui-widget ' +
                'ui-corner-top ' +
                'ui-chatroom ' +
                 chatStatus
            )
            .prop('id', 'chatrm')
//            .prop('outline', 0) //html is not validated so
            .focusin(function(){
            	self.uiChatboxTitlebar.removeClass("ui-state-highlight"); // delete highlighting
                // ui-state-highlight is not really helpful here
                self.uiChatboxTitlebar.addClass('ui-state-focus');
            })
            .focusout(function(){
	            self.uiChatboxTitlebar.removeClass('ui-state-focus');
            }),
            // titlebar
            uiChatboxTitlebar = (self.uiChatboxTitlebar = $('<div></div>'))
            .addClass('ui-widget-header ' +
                'ui-corner-top ' +
                'ui-chatroom-titlebar ' +
                'ui-dialog-header' // take advantage of dialog header style
            )
            .click(function(event) {
                //self.toggleContent(event);
                self.uiChatboxTitlebar.removeClass("ui-state-highlight");
            })
            .appendTo(uiChatbox),
            uiChatboxTitle = (self.uiChatboxTitle = $('<span></span>'))
            .html(title)
            .appendTo(uiChatboxTitlebar),

            uiChatboxTitlebarMinimize = (self.uiChatboxTitlebarMinimize = $('<a href="#"></a>'))
            .addClass('ui-corner-all ' +
            'ui-chatbox-icon'
            )
            .prop('role', 'button')
            .hover(function() {uiChatboxTitlebarMinimize.addClass('ui-state-hover');},
                function() {uiChatboxTitlebarMinimize.removeClass('ui-state-hover');})
            .focus(function() {
	            uiChatboxTitlebarMinimize.addClass('ui-state-focus');
            })
            .blur(function() {
	            uiChatboxTitlebarMinimize.removeClass('ui-state-focus');
            })
            .click(function(event) {
	               // options.boxManager.toggleBox();
                    toggleCommonChatBox();
                    localStorage.setItem("chatroom_status", "hidden");
		         return false;
            })
            .appendTo(uiChatboxTitlebar),

            //minimize button
            uiChatboxTitlebarMinimizeText = $("<span></span>")
            .addClass('ui-icon ' + 'icon-minus')
            .text('')
            .appendTo(uiChatboxTitlebarMinimize),

            // content
            uiChatboxContent = (self.uiChatboxContent = $('<div></div>'))
            .addClass('ui-widget-content ' + 'ui-chatbox-content ')
            .appendTo(uiChatbox),

            uiChatboxLog = (self.uiChatboxLog = self.element)
            .addClass('ui-widget-content ' + 'ui-chatbox-log')
            .appendTo(uiChatboxContent),

            uiChatboxInput = (self.uiChatboxInput = $('<div></div>'))
            .addClass('ui-widget-content ' + 'ui-chatbox-input')
            .click(function(event) {
                // anything?
            })
            .appendTo(uiChatboxContent),
            uiChatboxInputBox = (self.uiChatboxInputBox = $('<textarea></textarea>'))
            .addClass('ui-widget-content ' + 'ui-chatbox-input-box ' + 'ui-corner-all')
            .prop('id', 'ta_chrm')
            .appendTo(uiChatboxInput)
            .keydown(function(event) {
                if(event.keyCode && event.keyCode == $.ui.keyCode.ENTER) {
                    msg = $.trim($(this).val());
                    var msgobj = {'receiver':'chatroom','msg':msg, 'cf' : 'msg'};
                    if(msg.length > 0) {
                        ioAdapter.mustSend(msgobj);

                        $(this).val('');
                        self.options.messageSent({name:io.cfg.userobj.name}, msg);// sent msg to self
                        // store data on browser
                        var time = new Date().getTime();
                        if(localStorage.getItem('chatroom') != null){
                            var chatroom = JSON.parse(localStorage.getItem('chatroom'));
                            chatroom.push({ userid:io.cfg.userid, name:io.cfg.userobj.name, msg: msg, time: time});
                            localStorage.setItem('chatroom',JSON.stringify(chatroom));
                        } else {
                            localStorage.setItem('chatroom', JSON.stringify([{ userid:io.cfg.userid, name:io.cfg.userobj.name, msg: msg, time: time}]));
                        }                      
                    }                   
                    return false;
                }
            })
            .focusin(function() {
                uiChatboxInputBox.addClass('ui-chatbox-input-focus');
                var box = $(this).parent().prev();
                box.scrollTop(box.get(0).scrollHeight);
            })
            .focusout(function() {
                uiChatboxInputBox.removeClass('ui-chatbox-input-focus');
            });

            // disable selection
            uiChatboxTitlebar.find('*').add(uiChatboxTitlebar).disableSelection();

            // switch focus to input box when whatever clicked
            uiChatboxContent.children().click(function(){
                // click on any children, set focus on input box
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

        _setOption: function(option, value) {
            if (value != null) {
                switch(option) {
                    case "hidden":
                    if (value){
                        this.uiChatbox.hide();
                    }else{
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

        _setWidth: function(width) {
	        this.uiChatbox.width(width + "px");
            // this is a hack, but i can live with it so far
            this.uiChatboxInputBox.css("width", (width - 14) + "px");
        },

        _position: function(offset) {
            this.uiChatbox.css("left", offset);
        }
    });
}(jQuery));