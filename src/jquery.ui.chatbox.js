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
(function ($) {
  let uiChatboxTitlebar;
  $.widget('ui.chatbox', {
    options: {
      id: null, // id for the DOM element
      title: null, // title of the chatbox
      user: null, // can be anything associated with this chatbox
      hidden: false,
      offset: 0, // relative to right edge of the browser window
      width: 230, // width of the chatbox
      messageSent(id, user, msg) {
        // override this
        this.boxManager.addMsg(user.name, msg);
      },
      boxClosed(id) {
      }, // called when the close icon is clicked
      boxManager: {
        // thanks to the widget factory facility
        init(elem) {
          this.elem = elem;
        },
        addMsg(peer, msg) {
          const name = virtualclass.poll.capitalizeFirstLetterFnameLname(peer);
          const self = this;
          const box = self.elem.uiChatboxLog;
          const e = document.createElement('div');
          box.append(e);
          // $(e).hide();

          let systemMessage = false;

          if (name) {
            const peerName = document.createElement('b');
            $(peerName).text(`${name}: `);
            e.appendChild(peerName);
          } else {
            systemMessage = true;
          }

          const msgElement = document.createElement(systemMessage ? 'i' : 'span');
          $(msgElement).text(msg);
          e.appendChild(msgElement);
          $(e).addClass('ui-chatbox-msg');
          $(e).fadeIn();
          self._scrollToBottom();

          if (!self.elem.uiChatboxTitlebar.hasClass('ui-state-focus') && !self.highlightLock) {
            self.highlightLock = true;
            self.highlightBox();
          }
        },
        highlightBox() {
          // this.elem.uiChatbox.addClass("ui-state-highlight");
          const self = this;
          // self.elem.uiChatboxTitlebar.effect("highlight", {}, 300);
          /* self.elem.uiChatbox.effect("bounce", {times:1}, 300, function(){
           self.highlightLock = false;
           self._scrollToBottom();
           }); */
        },
        toggleBox() {
          this.elem.uiChatbox.toggle();
        },
        _scrollToBottom() {
          const box = this.elem.uiChatboxLog;
          box.scrollTop(box.get(0).scrollHeight);
        },
      },
    },
    toggleContent(event) {
      // do nothing
    },
    toggleContentbox(event) {
      if (this.uiChatboxContent.is(':visible')) {
        this.uiChatboxInputBox.focus();
        $($(`#tabs ul li[id = "tabcb${this.options.id}"]`)).removeClass('ui-state-active');
      } else {
        $($(`#tabs ul li[id="tabcb${this.options.id}"]`)).addClass('ui-state-active');
      }
      this.uiChatbox.toggle('slide', { direction: 'down' }, 1000);
    },
    widget() {
      return this.uiChatbox;
    },
    _create() {
      createTab(this.options.id, this.options.title);
      const self = this;
      const { options } = self;
      const { offset } = options;
      const title = options.title || 'No Title';
      // chatbox
      const uiChatbox = (self.uiChatbox = $('<div></div>'))
        .appendTo(document.body)
        .addClass('ui-widget '
          + 'ui-corner-top '
          + 'ui-chatbox')
        .attr('id', `cb${self.options.id}`)
        //            .attr('outline', 0) //html is not validated so
        .focusin(() => {
          // ui-state-highlight is not really helpful here
          // self.uiChatbox.removeClass('ui-state-highlight');
          self.uiChatboxTitlebar.addClass('ui-state-focus');
        })
        .focusout(() => {
          self.uiChatboxTitlebar.removeClass('ui-state-focus');
        });
      // titlebar
      const uiChatboxTitlebar = (self.uiChatboxTitlebar = $('<div></div>'))
        .addClass('ui-widget-header '
          + 'ui-corner-top '
          + 'ui-chatbox-titlebar '
          + 'ui-dialog-header', // take advantage of dialog header style
        )
        .click((event) => {
          // self.toggleContent(event);
        })
        .appendTo(uiChatbox);
      const uiChatboxTitle = (self.uiChatboxTitle = $('<span class="cgText"></span>'))
        .html(title)
        .appendTo(uiChatboxTitlebar);
      const uiChatboxTitlebarClose = (self.uiChatboxTitlebarClose = $('<a href="#"></a>'))
        .addClass(
          'ui-chatbox-icon ',
        )
        .attr('role', 'button')
        .hover(() => {
          uiChatboxTitlebarClose.addClass('ui-state-hover');
        },
        () => {
          uiChatboxTitlebarClose.removeClass('ui-state-hover');
        })
        .click((event) => {
          delete virtualclass.chat.vmstorage[self.options.id][0].box;
          uiChatbox.hide();
          self.options.boxClosed(self.options.id);
          $(`#tabcb${self.options.id}`).remove();
          // delete virtualclass.chat.vmstorage[self.options.id]; //delete variable storage
          // localStorage.removeItem(self.options.id);//delete local storage
          // to be verified
          if (virtualclass.chat.idList && virtualclass.chat.idList.length) {
            const index = virtualclass.chat.idList.indexOf(self.options.id);
            if (index > -1) {
              virtualclass.chat.idList.splice(index, 1);
            }
          }
          return false;
        })
        .appendTo(uiChatboxTitlebar);
      const uiChatboxTitlebarCloseText = $('<span ></span>')
        .addClass('ui-icon ' + 'icon-close ' + 'cgIcon ')
        .text('')
        // .text('close')
        .appendTo(uiChatboxTitlebarClose);
      const uiChatboxTitlebarMinimize = (self.uiChatboxTitlebarMinimize = $('<a href = "#"></a>'))
        .addClass('ui-chatbox-icon')
        .attr('role', 'button')
        .hover(() => {
          uiChatboxTitlebarMinimize.addClass('ui-state-hover');
        },
        () => {
          uiChatboxTitlebarMinimize.removeClass('ui-state-hover');
        })
        .click((event) => {
          self.toggleContentbox(event);
          // if (localStorage.getItem(self.options.id) == 'hidden') {
          //   localStorage.removeItem(self.options.id);
          // } else {
          //   // localStorage.setItem(self.options.id, 'hidden');
          // }
          return false;
        })

        .appendTo(uiChatboxTitlebar);
      const uiChatboxTitlebarMinimizeText = $('<span></span>')
        .addClass('ui-icon ' + 'icon-minus')
        .text('')
        .appendTo(uiChatboxTitlebarMinimize);
      // content
      const uiChatboxContent = (self.uiChatboxContent = $('<div></div>'))
        .addClass('ui-widget-content ' + 'ui-chatbox-content ')
        .appendTo(uiChatbox);
      const uiChatboxLog = (self.uiChatboxLog = self.element)
        .addClass('ui-widget-content ' + 'ui-chatbox-log')
        .appendTo(uiChatboxContent);
      const uiChatboxInput = (self.uiChatboxInput = $('<div></div>'))
        .addClass('ui-widget-content ' + 'ui-chatbox-input')
        .click((event) => {
          // anything?
        })
        .appendTo(uiChatboxContent);
      const uiChatboxInputBox = (self.uiChatboxInputBox = $('<textarea></textarea>'))
        .addClass('ui-widget-content '
          + 'ui-chatbox-input-box ')
        .prop('id', `ta${self.options.id}`)
        .appendTo(uiChatboxInput)
        .keypress(function (event) {
          if (event.keyCode && event.keyCode === $.ui.keyCode.ENTER) {
            const msg = $.trim($(this).val());
            if (msg.length > 0) {
              ioAdapter.mustSendUser({ msg, cf: 'msg' }, self.options.id); // userid=self.options.id

              $(`li[aria-controls='tabcb${self.options.id}']`).removeClass('ui-state-highlight');

              $(this).val('');
              $(`#${self.options.id}`).chatbox('option').messageSent(self.options.id, { name: io.cfg.userobj.name }, msg);// sent msg to self
              // to avoid error of undefined
              const k = self.options.id;
              if (typeof (virtualclass.chat.vmstorage[k]) === 'undefined') {
                virtualclass.chat.vmstorage[k] = [];
              }
              const time = new Date().getTime();
              virtualclass.chat.vmstorage[k].push({
                userid: io.cfg.userid,
                name: io.cfg.userobj.name,
                msg,
                time,
              });
            }

            return false;
          }
        })

        .focusin(function () {
          uiChatboxInputBox.addClass('ui-chatbox-input-focus');
          const box = $(this).parent().prev();
          box.scrollTop(box.get(0).scrollHeight);
        })
        .focusout(() => {
          uiChatboxInputBox.removeClass('ui-chatbox-input-focus');
        });

      // disable selection
      uiChatboxTitlebar.find('*').add(uiChatboxTitlebar).disableSelection();

      // switch focus to input box when whatever clicked
      uiChatboxContent.children().click(() => {
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
      $($(`#tabs ul li[id = "tabcb${self.options.id}"]`)).append(uiChatbox);
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
      this.uiChatboxInputBox.css('width', `${width - 11}px`);
    },
    _position(offset) {
      // this.uiChatbox.css("right", offset); //change this to right
    },
  });
}(jQuery));
