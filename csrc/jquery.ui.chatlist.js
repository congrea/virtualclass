/*
* http://vidyamantra.com
*
* Depends on jquery.ui.core, jquery.ui.widiget, jquery.ui.effect
*
* Also uses some styles for jquery.ui.dialog
*/


// Display online user list
(function($){
    $.widget("ui.memberlist", {
        options: {
            id: null, //id for the DOM element
            title: null, // title of the chatbox
            user: null, // can be anything associated with this chatbox
            hidden: false,
            offset:0, // relative to right edge of the browser window
            width: 230, // width of the chatbox
            userSent: function(user){
                this.boxManager.addUsr(user.name);
            },
            boxClosed: function(id) {}, // called when the close icon is clicked
            boxManager: {
                init: function(elem) {
                    this.elem = elem;
                },
                addUsr: function(peer) {
//                    alert('addUser');
//                    debugger;
                    
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var e = document.createElement('div');
                    box.append(e);

                    var systemMessage = false;

                    if (peer) {
                        var peerlink = document.createElement("a");
                        peerlink.href = '#' + peer.userid;

                        var peerName = document.createElement("img");
                        peerName.src = peer.img;
                        peerlink.appendChild(peerName);

                        var usrElement = document.createElement("span");
                        if(peer.lname == undefined){ peer.lname = '';}

                        $(usrElement).text(peer.name + " " + peer.lname);
                        peerlink.appendChild(usrElement);

                        e.appendChild(peerlink);

                    } else {
                        systemMessage = true;
                    }
                    
                    //alert(vApp.gObj.uRole);     
                    
                    $(e).addClass("ui-memblist-usr");
                    $(e).attr("id", 'ml' + peer.userid);
                    $(e).fadeIn();
                    
                    self._scrollToBottom();

                },
                highlightBox: function() {

                    var self = this;
                    self.elem.uiChatboxTitlebar.effect("highlight", {}, 300);
                    self.elem.uiChatbox.effect("bounce", {times:3}, 300, function(){
                        self.highlightLock = false;
                        self._scrollToBottom();
                    });
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
            }
        },

        widget: function() {
            return this.uiChatbox
        },

        _create: function(){
            var self = this,
            options = self.options,
            offset = options.offset,
            title = options.title || "No Title",
            // chatbox
            uiChatbox = (self.uiChatbox = $('<div></div>'))
            .appendTo(document.body)
            .addClass('ui-widget ' +
                'ui-corner-top ' +
                'ui-memblist'
            )
            .attr('id', 'memlist')
            .attr('outline', 0)
            //added to hide userlist on page load
            .css('display','none')
            .focusin(function(){
                self.uiChatboxTitlebar.addClass('ui-state-focus');
            })
            .focusout(function(){
                self.uiChatboxTitlebar.removeClass('ui-state-focus');
                }),

            // titlebar
            uiChatboxTitlebar = (self.uiChatboxTitlebar = $('<div></div>'))
                .addClass('ui-widget-header ' +
                'ui-corner-top ' +
                'ui-memblist-titlebar ' +
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
                'ui-memblist-icon '
                )
                .attr('role', 'button')
                .hover(function() {uiChatboxTitlebarClose.addClass('ui-state-hover');},
                function() {uiChatboxTitlebarClose.removeClass('ui-state-hover');})

            uiChatboxTitlebarMinimize = (self.uiChatboxTitlebarMinimize = $('<a href="#"></a>'))
                .addClass('ui-corner-all ' +
                    'ui-memblist-icon'
                )
                .attr('role', 'button')
                .hover(function() {uiChatboxTitlebarMinimize.addClass('ui-state-hover');},
                function() {uiChatboxTitlebarMinimize.removeClass('ui-state-hover');})

                .click(function(event) {

                        $("#chat_div").memberlist("option", "boxManager").toggleBox();// hide header behind footer bar
                        return false;
                })
                .appendTo(uiChatboxTitlebar),

            uiChatboxTitlebarMinimizeText = $('<span></span>')
                .addClass('ui-icon ' +
                'ui-icon-minusthick')
                .text('minimize')
                .appendTo(uiChatboxTitlebarMinimize),

            // content
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

            .focusin(function() {
                var box = $(this).parent().prev();
                box.scrollTop(box.get(0).scrollHeight);
            });

            // disable selection
            uiChatboxTitlebar.find('*').add(uiChatboxTitlebar).disableSelection();

            // switch focus to input box when whatever clicked
            $(document).on("click", '#chat_div .ui-memblist-usr a', function(event){
                var str = $(this);
                var id = str.attr('href').replace('#', '');
                var name = str.find('span').html();

                if($.inArray(id, idList) == -1){
                    counter++;
                    idList.push(id);
                    vmstorage[id] = [];
                    vmstorage[id].push( { userid:id, name:name});
                }

                chatboxManager.addBox(id,
                                  {dest:"dest" + counter, // not used in demo
                                   title:"box" + counter,
                                   first_name:name
                                   //you can add your own options too
                                  });

                chatboxManager.init({
                    user:{'name' : name},
                    messageSent : function(id,user,msg){
                        $("#" + id).chatbox("option", "boxManager").addMsg(user.name, msg);
                    }
                });
                id = null;
                name = null;

            });

            self._setWidth(self.options.width);
            self._position(self.options.offset);

            self.options.boxManager.init(self);

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
            this.uiChatboxTitlebar.width(width + "px");
            this.uiChatboxLog.width(width + "px");
        },

        _position: function(offset) {
            this.uiChatbox.css("right", offset);
        }
    });

}(jQuery));
