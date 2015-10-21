/*
* Copyright 2010, Wen Pu (dexterpu at gmail dot com)
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* Check out http://www.cs.illinois.edu/homes/wenpu1/chatbox.html for document
*
* Depends on jquery.ui.core, jquery.ui.widiget, jquery.ui.effect
*
* Also uses some styles for jquery.ui.dialog

*/


// TODO: implement destroy()
(function($){
    $.widget("ui.chatbox", {
        options: {
            id: null, //id for the DOM element
            title: null, // title of the chatbox
            user: null, // can be anything associated with this chatbox
            hidden: false,
            offset: 0, // relative to right edge of the browser window
            width: 230, // width of the chatbox
            messageSent: function(id,user, msg){
                // override this
                this.boxManager.addMsg(user.name, msg);
            },
            boxClosed: function(id) {}, // called when the close icon is clicked
            boxManager: {
                // thanks to the widget factory facility
                init: function(elem) {
                    this.elem = elem;
                },
                addMsg: function(peer, msg) {
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var e = document.createElement('div');
                    box.append(e);
                    //$(e).hide();

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
                    //this.elem.uiChatbox.addClass("ui-state-highlight");
                    var self = this;
                    //self.elem.uiChatboxTitlebar.effect("highlight", {}, 300);
                    /*self.elem.uiChatbox.effect("bounce", {times:1}, 300, function(){
                        self.highlightLock = false;
                        self._scrollToBottom();
                    });*/
                },
                toggleBox: function() {
                    this.elem.uiChatbox.toggle();
                },
                _scrollToBottom: function() {
                    var box = this.elem.uiChatboxLog;
                    box.scrollTop(box.get(0).scrollHeight);

                }
            }
        },
        toggleContent: function(event) {
            //do nothing
        },
        toggleContentbox: function(event) {
            if(this.uiChatboxContent.is(":visible")) {
                this.uiChatboxInputBox.focus();
                $($('#tabs ul li[id = "tabcb' + this.options.id + '"]')).removeClass( "ui-state-active" );
            }else{
                $($('#tabs ul li[id="tabcb' + this.options.id + '"]')).addClass( "ui-state-active" );
            }
            this.uiChatbox.toggle("slide",{direction:"down"},1000);
        },

        widget: function() {
            return this.uiChatbox
        },

        _create: function(){
            
            createTab(this.options.id,this.options.title);
            var self = this,
            options = self.options,
            offset = options.offset,
            title = options.title || "No Title",

            // chatbox
            uiChatbox = (self.uiChatbox = $('<div></div>'))
            .appendTo(document.body)
            .addClass('ui-widget ' +
                'ui-corner-top ' +
                'ui-chatbox'
            )
            .attr('id','cb' + self.options.id)
//            .attr('outline', 0) //html is not validated so
            .focusin(function(){
                // ui-state-highlight is not really helpful here
                //self.uiChatbox.removeClass('ui-state-highlight');
                self.uiChatboxTitlebar.addClass('ui-state-focus');
            })
            .focusout(function(){
                self.uiChatboxTitlebar.removeClass('ui-state-focus');
            }),
            // titlebar
            uiChatboxTitlebar = (self.uiChatboxTitlebar = $('<div></div>'))
            .addClass('ui-widget-header ' +
                'ui-corner-top ' +
                'ui-chatbox-titlebar ' +
                'ui-dialog-header' // take advantage of dialog header style
            )
            .click(function(event) {
               // self.toggleContent(event);
            })
            .appendTo(uiChatbox),
            uiChatboxTitle = (self.uiChatboxTitle = $('<span></span>'))
            .html(title)
            .appendTo(uiChatboxTitlebar),
            uiChatboxTitlebarClose = (self.uiChatboxTitlebarClose = $('<a href="#"></a>'))
                .addClass('ui-corner-all ' +
                'ui-chatbox-icon '
            )
            .attr('role', 'button')
            .hover(function() {uiChatboxTitlebarClose.addClass('ui-state-hover');},
            function() {uiChatboxTitlebarClose.removeClass('ui-state-hover');})

            .click(function(event) {
                uiChatbox.hide();
                self.options.boxClosed(self.options.id);

                $( "#tabcb" + self.options.id ).remove();

                    delete virtualclass.chat.vmstorage[self.options.id]; //delete variable storage
                localStorage.removeItem(self.options.id);//delete local storage
                return false;
            })
            .appendTo(uiChatboxTitlebar),
            uiChatboxTitlebarCloseText = $("<span ></span>")
            .addClass('ui-icon ' + 'icon-close')
            .text('')
            //.text('close')
            .appendTo(uiChatboxTitlebarClose),
            uiChatboxTitlebarMinimize = (self.uiChatboxTitlebarMinimize = $('<a href = "#"></a>'))
            .addClass('ui-corner-all ' + 'ui-chatbox-icon')
            .attr('role', 'button')
            .hover(function() {uiChatboxTitlebarMinimize.addClass('ui-state-hover');},
            function() {uiChatboxTitlebarMinimize.removeClass('ui-state-hover');})
            .click(function(event) {
                   self.toggleContentbox(event);
                   if(localStorage.getItem(self.options.id) == 'hidden'){
                       localStorage.removeItem(self.options.id);
                   }else{
                       localStorage.setItem(self.options.id, 'hidden');
                   }
                   return false;
            })

            .appendTo(uiChatboxTitlebar),
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
                .addClass('ui-widget-content ' +
                'ui-chatbox-input-box ' +
                'ui-corner-all'
            )
           .prop('id','ta' + self.options.id)
            .appendTo(uiChatboxInput)
            .keypress(function(event) {
                if(event.keyCode && event.keyCode == $.ui.keyCode.ENTER) {
                    msg = $.trim($(this).val());
                    if(msg.length > 0) {

                        ioAdapter.mustSendUser({'msg':msg, 'cf' : 'msg'}, self.options.id); // userid=self.options.id

                        $("li[aria-controls='tabcb" + self.options.id + "']").removeClass('ui-state-highlight');

                        $(this).val('');
                        $("#" + self.options.id).chatbox("option").messageSent(self.options.id, {name:io.cfg.userobj.name}, msg);// sent msg to self
                        // to avoid error of undefined
                        var k = self.options.id;
                        if (typeof(virtualclass.chat.vmstorage[k]) == 'undefined') {
                            virtualclass.chat.vmstorage[k] = [];
                        }
                        var time = new Date().getTime();
                        virtualclass.chat.vmstorage[k].push({
                            userid: io.cfg.userid,
                            name: io.cfg.userobj.name,
                            msg: msg,
                            time: time
                        });
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
            }

            // create tab in footer
            $($('#tabs ul li[id = "tabcb' + self.options.id + '"]')).append(uiChatbox);
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
            this.uiChatboxInputBox.css("width", (width - 14) + "px");
        },

        _position: function(offset) {
            //this.uiChatbox.css("right", offset); //change this to right
        }
    });
}(jQuery));