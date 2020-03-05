(function (window, $) {
  const Chat = function () {
    let tabs;
    const my_calculateChatHeight = null;
    return {
      userList: [],
      init() {
        this.chatroombox = null;
        this.chatWindow = 'private';
        this.counter = 0;
        this.idList = [];
        this.commonChat = [];

        const box = null;
        $.htab = [];
        $.htabIndex = [];
        // virtualclass.chat.vmstorage = {};
        this.vmstorage = {};
        $('body').footerbar();

        tabs = $('#tabs').tabs({ cache: true, activeOnAdd: true });

        if (browserSupportsLocalStorage() === false) { // check browser for local storage
          alert(lang.sterror);
          return;
        }

        this.history();

        // todo remove
        this.UI.privateChatBox.init();

        // new message alert
        $('ul.tabs').on('click, focus', 'li', function () {
          $(`li[aria-controls='${$(this).attr('id')}']`).removeClass('ui-state-highlight');
        });

        // nirmala
        //  this.fetchChatUsers();


        // console.log('chat local storage start ');
        /** Disable Chat * */
        // const chatEnable = localStorage.getItem('chatEnable');
        // if (chatEnable != null) {
        //   if (chatEnable == 'false') {
        //     document.querySelector('#chatWidget').classList.add('chat_disabled');
        //     document.querySelector('#chat_div').classList.add('chat_disabled');
        //     document.querySelector('#chatWidget').classList.remove('chat_enabled');
        //   }
        // }
        if (roles.isStudent()) { // (chat or groupchat) disable or eneble on refresh
          virtualclass.settings.studentpc(virtualclass.settings.info.studentpc);
          virtualclass.settings.studentgc(virtualclass.settings.info.studentgc);
        }
      },


      /** TODO , that should be handle properly for simple layout * */
      fetchChatUsers() {
        // console.log('FetchUser congrea_get_enrolled_users');
        const data = new FormData();
        data.append('action', 'fetchUser');

        virtualclass.xhr.vxhr.post(`${window.webapi}&user=${virtualclass.gObj.uid}&methodname=congrea_get_enrolled_users`, data)
          .then((msg) => {
            // TODO only return total number users instead of array objects
            virtualclass.chat.userList = msg.data;
            updateOnlineUserText();
          })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },
      // TODO in this function if confition and else if condition is not working
      setChatDisplay() {
        const chatInput = document.querySelector('#virtualclassCont.congrea  #ta_chrm2');
        const search = document.querySelector('#virtualclassCont.congrea #congreaUserSearch');
        const list = document.getElementById('memlist');
        let listBtn = document.getElementById('user_list');

        const chat = localStorage.getItem('chatWindow');

        if (chat != null && chat === 'common') {
          virtualclass.chat.chatWindow = 'common';
          const chatroom = document.getElementById('chatrm');
          if (chatroom) {
            chatroom.classList.add('enable');
            chatroom.classList.remove('disable');

            const chatroomBtn = document.getElementById('chatroom_bt2');
            chatroomBtn.classList.add('active');
            if (list) {
              list.classList.remove('enable');
              if (!list.classList.contains('disable')) {
                list.classList.add('disable');
              }
              listBtn = document.getElementById('user_list');
              listBtn.classList.remove('active');
            }
            // var search = document.querySelector('#virtualclassCont.congrea #congreaUserSearch');
            if (search) {
              search.style.display = 'none';
            }
          } else {
            if (list) {
              list.classList.add('enable');
              list.classList.remove('disable');

              listBtn = document.getElementById('user_list');
              listBtn.classList.add('active');
            }
          }
        } else if (chat != null && chat === 'support') {
          const supportBtn = document.getElementById('congreaSupport');
          if (supportBtn) {
            // support.style.display = "none";
            supportBtn.classList.add('active');
          }
        } else {
          if (list) {
            list.classList.add('enable');
            listBtn = document.getElementById('user_list');
            listBtn.classList.add('active');
            virtualclass.chat.chatWindow = 'private';
          }

          if (chatInput) {
            chatInput.style.display = 'none';
          }
        }
        const userListButton = document.querySelector('#virtualclassCont.congrea  .vmchat_bar_button');
        if (userListButton.classList.contains('active')) {
          if (chatInput) {
            chatInput.style.display = 'none';
          }
          if (search) {
            search.style.display = 'block';
          }
        } else {
          if (chatInput) {
            chatInput.style.display = 'block';
          }
          if (search) {
            search.style.display = 'none';
          }
        }
      },


      // nirmala
      showChatListUsers() { // 8%
        const userlist = virtualclass.chat.userList;

        if (userlist.length > 0) {
          this.showChatUserList(userlist);
          displayChatOfflineUserList(userlist);
          // $("div#memlist").css({display: 'block'});
          document.querySelector('div#memlist').classList.add('enable');
        }
      },
      showChatUserList(userlist) { // 13%
        if (!document.getElementById('chat_div')) { // prevent creating div on each update
          const cd = document.createElement('div');
          cd.id = 'chat_div';
          document.body.appendChild(cd);
        }

        $('#chat_div').memberlist({
          id: 'chat_div',
          user: userlist,
          offset: '-1px',
          title: lang.online,
          userSent(user) {
            console.log('====> UserList is created 1');
            const userDiv = $('#chat_div').memberlist('option', 'boxManager').addUsr(user);
            return userDiv;
          },
        });
      },

      history() { // TODO evaluate this function
        let chatEnable = null;
        if (localStorage.getItem(wbUser.sid) != null) {
          const data = JSON.parse(localStorage.getItem(wbUser.sid));
          displayPvtChatHistory(data); // TODO this function is not in use
          chatEnable = localStorage.getItem('chatEnable');
          if (chatEnable != null && chatEnable === 'false') {
            virtualclass.user.control.disbaleAllChatBox();
          }
          this.vmstorage = JSON.parse(localStorage.getItem(wbUser.sid));
        }

        // checking common chat local storage
        // Data stored inside sessionStorage variable
        if (localStorage.length > 0) {
          displaycomChatHistory(); // TODO this function is not in use
          virtualclass.chat.removeChatHighLight('chatrm');
          // if(typeof chatEnable != null && chatEnable == "false"){
          if (chatEnable != null && chatEnable === 'false') {
            virtualclass.user.control.disableCommonChat();
          }
        }
      },

      // TODO this function not in use
      exportCommonChat(startTime) {
        const chatHistory = [];
        const storedMsg = virtualclass.chat.commonChat;
        for (let i = 0; i < storedMsg.length; i++) {
          if (startTime <= storedMsg[i].time) {
            chatHistory.push(storedMsg[i]);
          }
        }
        return chatHistory;
      },

      UI: {
        privateChatBox: {
          init() {
            const that = this;
            $('#tabs').delegate('span.icon-close', 'click', that.close);
            $('#tabs').on('click', 'li a', that.toggle);
          },
          close() {
            // delete box
            const tabid = $(this).closest('li').attr('id').substring(5);
            $(`#${tabid}`).chatbox('option').boxClosed(tabid);
            $(`div#cb${tabid}.ui-widget`).hide();

            // delete tab
            const panelId = $(this).closest('li').remove().attr('aria-controls');
            $(`#${panelId}`).remove();
            // delete virtualclass.chat.vmstorage[tabid]; //delete variable storage
          },
          toggle() {
            /* Hide box when click on user tab */
            const tabid = $(this).closest('li').attr('id').substring(5);
            $(`#${tabid}`).chatbox('toggleContentbox');
            if (localStorage.getItem(tabid) === 'hidden') {
              localStorage.removeItem(tabid);
            } else {
              localStorage.setItem(tabid, 'hidden');
            }
          },
        },
      },
      // TODO this function not in use
      removedPrvLoggedInDetail() {
        // if same user login multiple times then
        // remove previously logged in detail
        $('.ui-memblist').remove();
        $('.ui-chatbox').remove();
        $('div#chatrm').remove();
        virtualclass.chat.chatroombox = null;
        // console.log('Chat box is  null');

        // delete open chat box
        for (const key in io.uniquesids) {
          if (key != io.cfg.userid) {
            chatboxManager.delBox(key);
            $(`li#tabcb${key}`).remove(); // delete tab
          }
        }
        this.idList = 0;
        $('#stickybar').removeClass('maximize').addClass('minimize');
        tabs.tabs('refresh');// tabs
      },
      removeCookieUserInfo(e) {
        // delete cookie
        document.cookie = 'auth_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'auth_pass=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'path=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        display_error(e.message);
      },
      makeUserListEmpty() {
        const url = `url(${window.whiteboardPath}images/offline.png)no-repeat top left`;
        $('#user_list .inner_bt #usertab_icon').css({ background: url });
        $('#chatroom_bt .inner_bt #chatroom_text').text(`${lang.chatroom} (0)`);
        $('div#memlist').removeClass('enable');
      },
      removeChatHighLight(id) {
        // var chatCont = document.getElementById(id);
        // var chatRoot = virtualclass.gObj.testChatDiv.shadowRoot.
        // if (chatCont != null) {
        if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'testChatDiv')) {
          const hElements = chatContainerEvent.elementFromShadowDom('.ui-state-highlight', 'all');
          for (let i = 0; i < hElements.length; i++) {
            hElements[i].classList.remove('ui-state-highlight');
          }
        }
        // }
      },
      openChatBox() {
        const memlistBox = document.querySelector('#memlist');
        if (memlistBox != null) {
          const isVisible = memlistBox.offsetWidth > 0 || memlistBox.offsetHeight > 0;
          if (!isVisible) {
            $('#chat_div').memberlist('option', 'boxManager').toggleBox();
          }
        }
      },

      enableTechSupport(uid) {
        const techSupport = document.querySelector('#congreaSupport');
        techSupport.setAttribute('data-tsid', uid);
        techSupport.classList.remove('notavailable');
        techSupport.classList.add('available');
      },

      disableTechSupport(uid) {
        const techSupport = document.querySelector('#congreaSupport');
        techSupport.classList.add('notavailable');
        techSupport.classList.remove('available');
        const closeElement = document.querySelector(`#tabcb${uid} .icon-close`);
        if (closeElement != null) {
          closeElement.click();
        }
      },

      // TODO this function not in use
      isTechSupportExist(uid) {
        const techSupport = document.querySelector('#congreaSupport');
        if (techSupport != null) {
          return ((+techSupport.dataset.tsid) === (+uid));
        }
      },

      removeCommonChatNodes() {
        const chatRoom = document.getElementById('chat_room');
        if (chatRoom !== null) {
          while (chatRoom.firstChild) {
            chatRoom.removeChild(chatRoom.firstChild);
          }
        }
      },

      calculateViewPortForMessageBox() {
        const allNodes = document.querySelectorAll('#tabs .ui-widget.ui-chatbox');
        if (allNodes != null) {
          let totalWidth = 0;
          let i = 0;
          for (; i < allNodes.length; i++) {
            totalWidth += allNodes[i].offsetWidth;
          }
          const mainContaineridth = document.getElementById('virtualclassAppContainer').offsetWidth;
          if (totalWidth > mainContaineridth) {
            const tobeClosed = document.querySelector('#tabs .ui-widget.ui-chatbox');
            if (tobeClosed != null) {
              const closeSpan = tobeClosed.querySelector('span.icon-close');
              if (closeSpan != null) {
                closeSpan.parentNode.click(); // Cliking on close button
              }
            }
          }
        }
      },
    };
  };
  window.Chat = Chat;
}(window, $));
