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
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var userAlready = document.getElementById("ml" + peer.userid);
                    if(userAlready != null){
                       userAlready.parentNode.removeChild(userAlready); 
                    }
                    
                    
                    var e = document.createElement('div');
                    e.className =   e.className + "userImg";
                    box.append(e);

                    var systemMessage = false;
                    
                    if (peer) {
                        var peerlink = document.createElement("a");
                        peerlink.href = '#' + peer.userid;
                        peerlink.classList.add('tooltip');
                        peerlink.setAttribute('data-title', 'Click to chat');

                        var peerName = document.createElement("img");
                        peerName.src = peer.img;
                        peerlink.appendChild(peerName);

                        var usrElement = document.createElement("span");
                        if(peer.lname == undefined){ peer.lname = '';}

                        $(usrElement).text(peer.name + " " + peer.lname);
                        peerlink.appendChild(usrElement);
                        
                        e.appendChild(peerlink);

                        //if(virtualclass.gObj.uRole == 't'){
                        
                        //added by suman
                        
                        
                      //  if(localStorage.getItem('orginalTeacherId') != null){
                            var controls = ['assign', 'audio', 'chat', 'editorRich', 'editorCode'];
                            if(peer.userid != wbUser.id){
                                var controlDiv = virtualclass.user.createControl(peer.userid, controls);
                                e.appendChild(controlDiv);
                                virtualclass.user.control.shouldApply.call(virtualclass.user, peer.userid); //checking audio
                            }
                        //virtualclass.user.control.audioSign({id:peer.userid}, "create");
                      //  }
                        
                        if(roles.hasControls() != null && !roles.hasAdmin()){
                            if(peer.userid ==  localStorage.getItem('aId')){
                                var controls = ['assign'];    
                                var controlCont = document.getElementById(peer.userid  + "ControlContainer");
                                if(controlCont != null){
                                    virtualclass.user.createAssignControl(controlCont, peer.userid, true);
                                }else{
                                    var divContainer = document.getElementById("ml" + peer.userid);
                                    var divControl = virtualclass.user.createControl(peer.userid, controls);
                                    divContainer.appendChild(divControl);
                                     
                                }
                            }
                        }

                    } else {
                        systemMessage = true;
                    }

                    //alert(virtualclass.gObj.uRole);
                    
                    $(e).addClass("ui-memblist-usr");
                    $(e).attr("id", 'ml' + peer.userid);
                    
                    
                    $(e).fadeIn();
                    
                    self._scrollToBottom();
                    var chatEnable = localStorage.getItem('chatEnable');
                    if(chatEnable != null && chatEnable ==  "false"){
                        virtualclass.user.control.disableOnLineUser();
                    }

                    if (virtualclass.gObj.uid == peer.userid) {
                        var userDiv = document.getElementById("ml" + virtualclass.gObj.uid);
                    
                        if(userDiv != null){
                           userDiv.classList.add("mySelf");
                        }
                    }
                    
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
            .appendTo(document.getElementById('chatWidget'))
            .addClass('ui-widget ' +
                'ui-corner-top ' +
                'ui-memblist'
            )
            .attr('id', 'memlist')
//            .attr('outline', 0) html is not validated so
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
            .html('<span class="icon-user"> </span>' + title)
            .appendTo(uiChatboxTitlebar),

            uiChatboxTitlebarClose = (self.uiChatboxTitlebarClose = $('<a href="#"></a>'))
                .addClass('ui-corner-all ' +
                'ui-memblist-icon '
                )
                .attr('role', 'button')
                .hover(function() {uiChatboxTitlebarClose.addClass('ui-state-hover');},
                function () {
                    uiChatboxTitlebarClose.removeClass('ui-state-hover');
                });

            uiChatboxTitlebarMinimize = (self.uiChatboxTitlebarMinimize = $('<a href="#"></a>'))
                .addClass('ui-corner-all ' +
                    'ui-memblist-icon'
                )
                .attr('role', 'button')
                .hover(function() {uiChatboxTitlebarMinimize.addClass('ui-state-hover');},
                function() {uiChatboxTitlebarMinimize.removeClass('ui-state-hover');})
                .click(function(event) {
                        $("#chat_div").memberlist("option", "boxManager").toggleBox();// hide header behind footer bar

                        // Duplicate code with footer.js near about lne 30 to 50

                        var elem = $('#usertab_text');
                        var usertab = $("#usertab_toogle_icon");

                        if(elem.hasClass('close')){
                            elem.addClass('open' );
                            elem.removeClass('close');
                            elem.attr('data-title', virtualclass.lang.getString('miniUserList'));

                            usertab.addClass('icon-arrow-down');
                            usertab.removeClass('close icon-arrow-up');

                        } else {
                            elem.addClass('close');
                            elem.removeClass('open');
                            elem.attr('data-title', virtualclass.lang.getString('maxUserList'));
                            usertab.addClass('icon-arrow-up');
                            usertab.removeClass('icon-arrow-down');
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
                var ahref = str.attr('href'); 
                if(typeof ahref != 'undefined'){
                     var id =  ahref.replace('#', '');
                    //var id = str.attr('href').replace('#', '');
                    //can be critical
                    var name = str.find('span').html();
                    //if($.inArray(id, idList) == -1){
                    
//                    if($.inArray(id, idList) == -1){
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
                }
                
                

            });

            self._setWidth(self.options.width);
            self._position(self.options.offset);
            self.options.boxManager.init(self);
            if(roles.hasAdmin()){
                virtualclass.user.UIaudioAll('memlist', 'ui-memblist-titlebar');
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
            this.uiChatboxTitlebar.width(width + "px");
            this.uiChatboxLog.width(width + "px");
        },

        _position: function(offset) {
            this.uiChatbox.css("right", offset);
        }
    });

}(jQuery));
