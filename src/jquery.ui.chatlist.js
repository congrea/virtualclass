/*
 * http://vidyamantra.com
 *
 * Depends on jquery.ui.core, jquery.ui.widiget, jquery.ui.effect
 *
 * Also uses some styles for jquery.ui.dialog
 */


// Display online user list
(function ($) {
  let uiChatboxContent; let
    uiChatboxLog;
  $.widget('ui.memberlist', {
    options: {
      id: null, // id for the DOM element
      title: null, // title of the chatbox
      user: null, // can be anything associated with this chatbox
      hidden: false,
      offset: 0, // relative to right edge of the browser window
      // width: 320, // width of the chatbox
      userSent(user) {
        if (user.userid !== '7') {
          // nirmala
          this.boxManager.addUsr(user.name);
        } else {

        }

        // todo to generalize this
      },
      boxClosed(id) {
      }, // called when the close icon is clicked
      boxManager: {
        init(elem) {
          this.elem = elem;
        },

        addUsr(peer) {
          const self = this;
          const box = self.elem.uiChatboxLog;
          const userAlready = chatContainerEvent.elementFromShadowDom(`#ml${peer.userid}`);
          if (userAlready != null) {
            // console.log('double created ' + peer.userid);
            // if(userAlready.classList.contains('offline')){
            //     console.log('Remove user');
            //     userAlready.classList.add('online', 'student');
            //     userAlready.classList.remove('offline');
            //     // userAlready.parentNode.removeChild(userAlready); // Jai Gupta
            // }

            return true;
          }


          const e = document.createElement('div');
          const mainUserDiv = document.createDocumentFragment('div');
          mainUserDiv.id = 'tempId';
          // e.className = e.className + "userImg ui-memblist-usr offline";
          const usr = peer;
          if (peer.userid !== wbUser.id) {
            usr.notSelf = true;
          }

          if (roles.hasControls()) {
            usr.isTeacher = true;
          }
          if (peer.role === 't') {
            usr.rl = 'teacher';
          } else if (peer.role === 's') {
            usr.rl = 'student';
          }
          usr.chatIconColors = virtualclass.gObj.chatIconColors[peer.userid];
          // console.log(`Chat add user ${peer.userid}`);
          const template = virtualclass.getTemplate('chatuser', 'chat');
          // $(box).append(template({"peer": usr}));
          // $(box).append(template({"peer": usr}));
          const userHtml = template({ peer: usr });


          return userHtml;
        },

        highlightBox() {
          const self = this;
          self.elem.uiChatboxTitlebar.effect('highlight', {}, 300);
          self.elem.uiChatbox.effect('bounce', { times: 3 }, 300, () => {
            self.highlightLock = false;
            self._scrollToBottom();
          });
        },
        toggleBox() {

          //  this.elem.uiChatbox.toggle("slide",{direction:"down"},1000);
        },
        _scrollToBottom() {
          const box = this.elem.uiChatboxLog;
          //                    box.scrollTop(box.get(0).scrollHeight);
        },
      },
    },
    toggleContent(event) {
      this.uiChatboxContent.toggle();
      if (this.uiChatboxContent.is(':visible')) {
      }
    },
    widget() {
      return this.uiChatbox;
    },
    _create() {
      const self = this;
      const { options } = self;
      const { offset } = options;
      const title = options.title || 'No Title';
      // chatbox
      const uiChatbox = (self.uiChatbox = $('<div></div>'))
        .appendTo(document.getElementById('congreaChatCont'))
        .addClass('ui-widget '
          + 'ui-corner-top '
          + 'ui-memblist')
        .attr('id', 'memlist');
      uiChatboxContent = (self.uiChatboxContent = $('<div></div>'))
        .addClass('ui-widget-content '
          + 'ui-memblist-content ')
        .appendTo(uiChatbox),
      uiChatboxLog = (self.uiChatboxLog = self.element)
        .addClass('ui-widget-content '
            + 'ui-memblist-log')
        .appendTo(uiChatboxContent)

        .focusin(function () {
          const box = $(this).parent().prev();
          // box.scrollTop(box.get(0).scrollHeight);
          box.scrollTop(box.scrollHeight);
        });


      // function init_chatBox (cthis) {
      //     var str = $(cthis);
      //     var ahref = str.attr('href');
      //     if (typeof ahref != 'undefined') {
      //         var id = ahref.replace('#', '');
      //         if(str.parent('.usern').length > 0){
      //             var name = str.html();
      //         } else {
      //             var name = str.siblings('.usern').find('a').html();
      //         }
      //
      //         if ($.inArray(id, virtualclass.chat.idList) == -1) {
      //             virtualclass.chat.counter++;
      //             virtualclass.chat.idList.push(id);
      //             if(!Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, id)){
      //                 virtualclass.chat.vmstorage[id] = [];
      //                 virtualclass.chat.vmstorage[id].push({userid: id, name: name});
      //             }
      //         }
      //
      //         chatboxManager.addBox(id,
      //             {
      //                 dest: "dest" + virtualclass.chat.counter, // not used in demo
      //                 title: "box" + virtualclass.chat.counter,
      //                 first_name: name,
      //                 type: "privateChat"
      //                 //you can add your own options too
      //             });
      //
      //         chatboxManager.init({
      //             user: {'name': name},
      //             messageSent: function (id, user, msg) {
      //                 $("#" + id).chatbox("option", "boxManager").addMsg(user.name, msg);
      //             }
      //         });
      //
      //         if(Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, id)){
      //             displayUserSinglePvtChatHistory(id)
      //         }
      //
      //         id = null;
      //         name = null;
      //     }
      // }
      //
      // $(document).on("click", '#chat_div .ui-memblist-usr .user-details a', function (event) {
      //     var str = $(this);
      //     var ahref = str.attr('href');
      //     if (typeof ahref != 'undefined') {
      //         var id = ahref.replace('#', '');
      //         if(str.parent('.usern').length > 0){
      //            var name = str.html();
      //         } else {
      //             var name = str.siblings('.usern').find('a').html();
      //         }
      //
      //         if ($.inArray(id, virtualclass.chat.idList) == -1) {
      //             virtualclass.chat.counter++;
      //             virtualclass.chat.idList.push(id);
      //             if(!Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, id)){
      //                 virtualclass.chat.vmstorage[id] = [];
      //                 virtualclass.chat.vmstorage[id].push({userid: id, name: name});
      //             }
      //         }
      //
      //         chatboxManager.addBox(id,
      //             {
      //                 dest: "dest" + virtualclass.chat.counter, // not used in demo
      //                 title: "box" + virtualclass.chat.counter,
      //                 first_name: name,
      //                 type: "privateChat"
      //                 //you can add your own options too
      //             });
      //
      //         chatboxManager.init({
      //             user: {'name': name},
      //             messageSent: function (id, user, msg) {
      //                 $("#" + id).chatbox("option", "boxManager").addMsg(user.name, msg);
      //             }
      //         });
      //
      //         if(Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, id)){
      //             displayUserSinglePvtChatHistory(id)
      //         }
      //
      //         id = null;
      //         name = null;
      //     }
      //
      // });

      self._setWidth(self.options.width);
      self._position(self.options.offset);
      self.options.boxManager.init(self);
      if (roles.hasAdmin()) {
        virtualclass.user.mediaSliderUI('audio');
        virtualclass.user.mediaSliderUI('video');
        virtualclass.user.mediaSliderUI('chat');
        virtualclass.user.mediaSliderUI('groupChat');
        virtualclass.user.mediaSliderUI('askQuestion');
        virtualclass.user.mediaSliderUI('userlist');
        virtualclass.user.mediaSliderUI('qaMarkNotes');
      }
    },
    _setOption(option, value) {
      if (value != null) {
        switch (option) {
          case 'hidden':
            if (value) {
              this.uiChatbox.hide();
            } else {
              this.uiChatbox.show();
            }
            break;

          case 'offset':
            this._position(value);
            break;

          case 'width':
            this._setWidth(value);
            break;
        }
      }

      $.Widget.prototype._setOption.apply(this, arguments);
    },
    _setWidth(width) {
      // this.uiChatboxTitlebar.width(width + "px");
      this.uiChatboxLog.width(`${width}px`);
    },
    _position(offset) {
      this.uiChatbox.css('right', offset);
    },
  });
}(jQuery));
