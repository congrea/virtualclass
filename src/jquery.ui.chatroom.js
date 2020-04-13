/*
 * http://www.vidyamantra.com
 *
 * Depends on jquery.ui.core, jquery.ui.widiget, jquery.ui.effect
 *
 * Also uses some styles for jquery.ui.dialog
 */


let uiChatboxContent;
let uiChatboxLog;
let uiChatboxInputBox;
let msg;
// Display box for chatroom
(function ($) {
  $.widget('ui.chatroom', {
    options: {
      id: null, // id for the DOM element
      title: null, // title of the chatbox
      user: null, // can be anything associated with this chatbox
      hidden: false,
      offset: 6, // relative to right edge of the browser window
      // width: 311, // width of the chatbox
      messageSent(user, msg) {
        this.boxManager.addMsg(user.name, msg);
      },
      boxClosed(id) {
      }, // called when the close icon is clicked
      boxManager: {
        init(elem) {
          this.elem = elem;
        },
        addMsg(peer, msgObj, userid) {
          let Img;
          if (typeof virtualclass.gObj.chatIconColors[userid] === 'undefined') {
            groupChatImgColor(peer, userid);
          }
          const time = virtualclass.vutil.getCurrentFormattedTime(msgObj.time);
          const { msg } = msgObj;
          const self = this;
          const box = self.elem.uiChatboxLog;
          const e = document.createElement('li');
          e.className = 'left clearfix';
          box.append(e);

          const chatCont = document.createElement('div');
          chatCont.className = 'chat-user-icon pull-left';
          e.appendChild(chatCont);

          if (virtualclass.gObj.chatIconColors[userid]) {
            chatCont.style.backgroundColor = virtualclass.gObj.chatIconColors[userid].bgColor;
            chatCont.style.color = virtualclass.gObj.chatIconColors[userid].textColor;
            Img = document.createElement('span');
            Img.className = 'chat-img ';
            Img.innerHTML = virtualclass.gObj.chatIconColors[userid].initial;
          }

          chatCont.appendChild(Img);
          let systemMessage = false;
          // suman 25
          const chatContainer = document.createElement('div');
          chatContainer.className = 'commonChatCon chat-body clearfix';

          if (peer) {
            const peerName = document.createElement('a');
            peerName.className = 'primary-font';
            $(peerName).text(peer);
            chatContainer.appendChild(peerName);
          } else {
            systemMessage = true;
          }

          const msgElement = document.createElement(systemMessage ? 'i' : 'p');
          msgElement.className = 'text';
          $(msgElement).text(msg);

          const msgTime = document.createElement('span');
          msgTime.className = 'text-muted';
          msgTime.innerHTML = time;


          chatContainer.appendChild(msgElement);
          chatContainer.appendChild(msgTime);
          e.appendChild(chatContainer);
          // console.log('====> chat time ', time);

          // var msgCont = document.createElement('div');
          // msgCont.className = 'msgCont';
          // //suman 25;
          //
          // msgCont.appendChild(msgElement);
          chatContainer.appendChild(msgElement);
          e.dataset.msgtime = msgObj.time;

          $(e).addClass('ui-chatbox-msg');
          $(e).fadeIn();
          self._scrollToBottom();
          // sortCommonChat();
        },
        groupChatImgColor(peer, userid) {
          let bgColor = 'green';
          let textColor = 'white';
          // if( typeof virtualclass.gObj.chatIconColors[userid] == "undefined"){
          const initial = this.getInitials(peer);
          const user = (userid.toString()) + peer;
          bgColor = this.stringToHslColor(user, 60, 35);
          const brightness = virtualclass.vutil.calcBrightness(bgColor);
          if (brightness > 125) {
            textColor = 'black';
          } else {
            textColor = 'white';
          }
          virtualclass.gObj.chatIconColors[userid] = {
            bgColor,
            textColor,
            initial,
          };
          // }
        },
        stringToHslColor(str, s, l) {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
          }

          const h = hash % 360;
          return `hsl(${h}, ${s}%, ${l}%)`;
        },
        getInitials(string) {
          const names = string.split(' ');
          let initials = names[0].substring(0, 1).toUpperCase();

          if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
          }
          return initials;
        },

        highlightBox() {
          const self = this;
          self.elem.uiChatboxTitlebar.addClass('ui-state-highlight');
          self.highlightLock = false;
          self._scrollToBottom();
        },
        toggleBox() {
          this.elem.uiChatbox.toggle('slide', { direction: 'down' }, 1000);
        },
        _scrollToBottom() {
          const box = this.elem.uiChatboxLog;
          box.scrollTop(box.get(0).scrollHeight);
        },
      },
    },
    toggleContent(event) {
      this.uiChatboxContent.toggle();
      if (this.uiChatboxContent.is(':visible')) {
        this.uiChatboxInputBox.focus();
      }
    },
    widget() {
      return this.uiChatbox;
    },
    _create() {
      const self = this;
      let cmsg;
      const { options } = self;
      const { offset } = options;
      const title = options.title || 'No Title';
      // chatbox, commonchat box
      const uiChatbox = (self.uiChatbox = $('<div></div>'))
        .appendTo(document.getElementById('congreaChatCont'))
        .addClass(`${'ui-widget '
        + 'ui-corner-top '
        + 'ui-chatroom '}${
          'disable'}`)
        .prop('id', 'chatrm');
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
        .appendTo(document.querySelector('.congrea #congchatBarInput'))
        .keydown(function (event) {
          if (event.keyCode && event.keyCode === $.ui.keyCode.ENTER) {
            msg = $.trim($(this).val());
            const time = new Date().getTime();
            const msgobj = {
              receiver: 'chatroom', msg, cf: 'msg', time,
            };
            if (msg.length > 0) {
              ioAdapter.mustSend(msgobj);
              $(this).val('');
              // self.options.messageSent({name:io.cfg.userobj.name}, {msg:msg, time:time});// sent msg to self
              //
              self.options.messageSent({ name: io.cfg.userobj.name }, { msg, time });
              // store data on browser
              if (localStorage.getItem('chatroom') != null) {
                const chatroom = JSON.parse(localStorage.getItem('chatroom'));
                cmsg = {
                  userid: io.cfg.userid, name: io.cfg.userobj.name, msg, time,
                };
                chatroom.push(cmsg);
                // localStorage.setItem('chatroom', JSON.stringify(chatroom));
              } else {
                cmsg = {
                  userid: io.cfg.userid, name: io.cfg.userobj.name, msg, time,
                };
                // localStorage.setItem('chatroom', JSON.stringify([cmsg]));
              }
              // For exporting the common chat
              virtualclass.chat.commonChat.push(cmsg);
            }
            return false;
          }
        })
        .focusin(() => {
          uiChatboxInputBox.addClass('ui-chatbox-input-focus');
          virtualclass.vutil.inputFocusHandler();
        })
        .focusout(() => {
          uiChatboxInputBox.removeClass('ui-chatbox-input-focus');
          virtualclass.vutil.inputFocusOutHandler();
        });

      uiChatboxContent.children().click(() => {
        self.uiChatboxInputBox.focus();
      });

      self._setWidth(self.options.width);
      self._position(self.options.offset);

      self.options.boxManager.init(self);
      if (roles.isStudent()) {
        virtualclass.settings.studentgc(virtualclass.settings.info.studentgc); // when teacher gc to student
      }

      if (!self.options.hidden) {
        uiChatbox.show();
        if (virtualclass.vutil.isPlayMode()) {
          disCommonChatInput();
        }
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
      this.uiChatbox.width(`${width}px`);
      // this.uiChatboxInputBox.css("width", (width - 14) + "px");
    },
    _position(offset) {
      this.uiChatbox.css('left', offset);
    },

  });
}(jQuery));
