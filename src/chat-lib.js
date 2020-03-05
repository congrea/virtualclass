/* function library */


let tabId;
const myChatBoxOpen = false;

const chatResults = [];
// TODO, displayChatUserList and displayChatOfflineUserList should be merged into one function
let myDivResult = '';
const checkChatDisabled = false;
let tmpmyDivResult;

function displayChatUserList(totUsers) {
  if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'insertUser')) {
    virtualclass.gObj.insertUser = true;
    virtualclass.gObj.userToBeDisplay = 500;
  }

  let users = totUsers;

  if (virtualclass.gObj.insertUser) {
    /**
     * Below 'first if block' is  to restrict the update users in list after execeeding 500 users
     *** */
    if (virtualclass.jId === virtualclass.gObj.uid && virtualclass.gObj.userToBeDisplay < totUsers.length) {
      const tusers = [];
      tusers.push(virtualclass.vutil.getMySelf()); // User list can not skip myself
      for (let i = 0; i < virtualclass.gObj.userToBeDisplay; i++) {
        if (totUsers[i].userid !== virtualclass.gObj.uid) {
          tusers.push(totUsers[i]);
        }
      }
      users = tusers;
    }

    for (let i = 0; i < users.length; i++) {
      if (typeof virtualclass.gObj.chatIconColors[users[i].userid] === 'undefined') {
        groupChatImgColor(users[i].name, users[i].userid);
      }
      if (users[i].img === 'noimage') {
        virtualclass.gObj.chatIconColors[users[i].userid].savedImg = false;
      } else {
        virtualclass.gObj.chatIconColors[users[i].userid].savedImg = users[i].img;
      }

      if (document.getElementById(`video${users[i].userid}`) == null) {
        tmpmyDivResult = $('#chat_div').memberlist('option').userSent(users[i]);
        // console.log('====> UserList is created 1b');
      }

      // tmpmyDivResult = true, means user div is created already
      // if (typeof tmpmyDivResult !== 'boolean' && typeof tmpmyDivResult !== undefined
      // && tmpmyDivResult != undefined) {.
      if (typeof tmpmyDivResult !== 'boolean' && typeof tmpmyDivResult !== 'undefined' && tmpmyDivResult != null) {
        myDivResult += tmpmyDivResult;
        // console.log('====> UserList is created 1c');
      }
    }

    if (typeof chat_div === 'undefined') {
      chat_div = document.querySelector('#chat_div');
    }

    /**
     * We need to put the sub_chat div inside the chat_div, because after attaching the event with chat_div(shadow dom),
     * If we click on anchor tag inside the shadow dom, then it does not return current clicked tag(shadow dom)
     * but it returns shadow dom
     * * */
    // if (myDivResult != null && myDivResult != undefined && myDivResult != '' && typeof myDivResult !== 'boolean') {
    // if (chat_div.shadowRoot.innerHTML == ' ' || chat_div.shadowRoot.innerHTML == '') {
    if (myDivResult != null && typeof myDivResult !== 'undefined' && myDivResult !== ''
      && typeof myDivResult !== 'boolean') {
      if (chat_div.shadowRoot.innerHTML === ' ' || chat_div.shadowRoot.innerHTML === '') {
        const userRole = roles.hasControls() ? 'teacher' : 'student';
        if (virtualclass.isPlayMode) {
          chat_div.shadowRoot.innerHTML = `<link rel='stylesheet' type='text/css'
          href='${whiteboardPath}css/modules/chat-container.css'>
          <div id='subchat' class='playMode ${userRole}'>${myDivResult}</div>`;
          // console.log('====> UserList is created 1d finally');
        } else {
          chat_div.shadowRoot.innerHTML = `<link rel='stylesheet' type='text/css' 
          href='${whiteboardPath}css/modules/chat-container.css'>
          <div id='subchat' class='${userRole}'>${myDivResult}</div>`;
          // console.log('====> UserList is created 1d finally');
        }
      } else {
        chat_div.shadowRoot.querySelector('#subchat').insertAdjacentHTML('beforeend', myDivResult);
        // console.log('====> UserList is created 1d finally');
      }
    }


    myDivResult = '';

    // to verify
    if (virtualclass.gObj.uid === virtualclass.vutil.whoIsTeacher()) {
      for (let i = 0; i < users.length; i++) {
        if (virtualclass.gObj.uid !== users[i].userid) {
          virtualclass.user.initControlHandler(users[i].userid);
        }
      }
    }
  }

  virtualclass.gObj.insertUser = !((virtualclass.connectedUsers.length >= virtualclass.gObj.userToBeDisplay));
  if (roles.isStudent()) {
    virtualclass.settings.userlist(virtualclass.settings.info.userlist);
    // TODO remove commented code
    // const gcElem = document.querySelector('#chatrm');
    // if (virtualclass.settings.info.userlist === false) {
    //   const vmchat = document.querySelector('.vmchat_room_bt .inner_bt');
    //   const vmlist = document.querySelector('.vmchat_bar_button');
    //   vmchat.click();
    //   vmlist.classList.add('disable');
    // }
  }
}

function handleCommonChat() {
  const askQuestionElem = document.querySelector('#congAskQuestion');
  const notesElem = document.querySelector('#virtualclassnote');
  if (!askQuestionElem.classList.contains('active') && !notesElem.classList.contains('active')) {
    const vmchat = document.querySelector('.vmchat_room_bt .inner_bt');
    const vmlist = document.querySelector('.vmchat_bar_button');
    vmchat.click();
    vmlist.classList.add('disable');
  }
}

function displayChatOfflineUserList(users) {
  alert('display chat offline user');
  let divContainer = document.querySelector('#melistcontainer');
  if (divContainer == null) {
    divContainer = document.createDocumentFragment('div');
    divContainer.id = 'melistcontainer';
  }
  for (let i = 0; i < users.length; i++) {
    if (!virtualclass.vutil.alreadyConnected(users[i].userid)) {
      if (users[i].userid != virtualclass.gObj.uid) {
        if (document.getElementById(`video${users[i].userid}`) == null) {
          myDivResult = $('#chat_div').memberlist('option').userSent(users[i]);
          virtualclass.media.addUserRole(myDivResult, users[i].role);
          divContainer.appendChild(myDivResult);
        }
      }
    }
  }
  // console.log('display offline user');
  document.querySelector('#chat_div').appendChild(divContainer);
}

function updateOnlineUserText() {
  if (roles.hasAdmin()) {
    if (virtualclass.chat.userList.length > 0) {
      // document.querySelector('#usertab_text #onlineusertext').innerHTML = '';
      document.querySelector('#userListHeader #onlineusertext').innerHTML = '';
      // if (roles.hasAdmin()) {
      //   var text = `Users (${virtualclass.connectedUsers.length}/${virtualclass.chat.userList.length})`;
      // } else {
      //   var text = ` Users (${count})`;
      // }

      // const onlineUser = document.querySelector('#usertab_text #onlineusertext');
      const onlineUser = document.querySelector('#userListHeader #onlineusertext');

      if (onlineUser == null) {
        // document.querySelector('#usertab_text').innerHTML
        // = `<span id='onlineusertext' class='cgText'>${text}</span>`;
        onlineUser.innerHTML = `(${virtualclass.connectedUsers.length})`;
      } else {
        // onlineUser.innerHTML = text;
        onlineUser.innerHTML = `(${virtualclass.connectedUsers.length})`;
      }
    } else {
      document.querySelector('#userListHeader #onlineusertext').innerHTML = `(${virtualclass.connectedUsers.length})`;
      // document.querySelector('#user_list .inner_bt #usertab_text').innerHTML = `${
      //   "<span class='cgText' id='onlineusertext'>" + 'Users ('}${virtualclass.connectedUsers.length})</span>`;
    }
  } else {
    document.querySelector('#userListHeader #onlineusertext').innerHTML = `(${virtualclass.connectedUsers.length})`;
    if (virtualclass.settings.info.userlist === true) {
      // document.querySelector('#user_list .inner_bt #usertab_text').innerHTML = `${
      //   "<span class='cgText' id='onlineusertext'>" + 'Users ('}${virtualclass.connectedUsers.length})</span>`;
    } else {
      // document.querySelector('#user_list .inner_bt #usertab_text').innerHTML = `${
      //   "<span class='cgText' id='onlineusertext'>" + 'Users'}</span>`;
    }
  }
}

function memberUpdate(e, addType) {
  // TODO e.message now does not contain complete list of users. Function needs to be updated.
  if (addType === 'removed') {
    // shadow dom
    const userUI = virtualclass.gObj.testChatDiv.shadowRoot.querySelector(`#ml${e.removeUser}`);
    if (userUI != null) {
      userUI.parentNode.removeChild(userUI);
    }
    updateOnlineUserText();
  } else {
    const userlist = virtualclass.gObj.memberlistpending;
    virtualclass.gObj.memberlistpending = [];
    // console.log('member list pending(memberlistpending) empty ');
    if (userlist.length > 0) {
      virtualclass.chat.showChatUserList(userlist);

      if ((virtualclass.jId === virtualclass.gObj.uid)) {
        // openChatBox
        virtualclass.chat.openChatBox();
        virtualclass.media.dispAllVideo('chat_div');
        // console.log('chat box is opened');
      }

      displayChatUserList(userlist);

      for (let i = 0; i < userlist.length; i++) {
        if (userlist[i].userid === io.cfg.userid && typeof addType !== 'undefined' && addType !== 'removed') {
          const vidTag = document.getElementById(`video${virtualclass.gObj.uid}`);
          if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'audIntDisable')
            && !Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'vidIntDisable') && vidTag == null) {
            // console.log('Media _handleUserMedia');
            virtualclass.media.innerHandleUserMedia(virtualclass.gObj.uid);
          }

          const userDiv = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid}`);
          if (userDiv != null) {
            userDiv.classList.add('mySelf');
          }
        }
      }

      // virtualclass.raiseHand.moveUpInList();
      // TODO, this should enabled
      // if(virtualclass.gObj.uid ==   virtualclass.vutil.whoIsTeacher()) {
      //     virtualclass.raiseHand.moveUpInList();
      // }
    } else {
      /* when there is one user and left the chat
       remove userlist box
       */

      // if ($('div#memlist').length) {
      //   $('div#memlist').remove();
      // }
      console.log('====> Chat div is not removing when one user is left the room ');
    }

    if ((roles.hasAdmin() && virtualclass.jId === virtualclass.gObj.uid)) {
      virtualclass.chat.openChatBox();
      // Only invoke when member is added
      if (addType === 'added') {
        virtualclass.chat.fetchChatUsers();
      } else {
        // for handling if teacher refresh and user is left the session
        virtualclass.chat.showChatListUsers();
      }
      virtualclass.chat.setChatDisplay();
    } else if (virtualclass.jId === virtualclass.gObj.uid) {
      virtualclass.chat.setChatDisplay();
    }

    const memList = document.querySelector('#memlist');
    const chatrm = document.querySelector('#chatrm');
    if (memList != null && document.querySelector('#chatroom_bt2.active') == null) {
      // memList.classList.add('enable'); TODO handle on new user join some issue on other's side
      // memList.classList.remove('disable');


      if (chatrm != null) {
        chatrm.classList.remove('enable');
        chatrm.classList.add('disable');
      }
    } else {
      // TODO memberlist null in recording play
      if (memList) {
        memList.classList.remove('enable');
        memList.classList.add('disable');
      }
      const listTab = document.querySelector('#user_list');
      const chatroomTab = document.querySelector('#chatroom_bt2');

      if (chatrm) {
        if (!chatroomTab.classList.contains('active')) {
          chatroomTab.classList.add('active');
        }
        listTab.classList.remove('active');
      }
    }

    const privateChat = document.querySelector('#virtualclassCont.congrea  #user_list.vmchat_bar_button');
    const search = document.querySelector('#virtualclassCont.congrea #congreaUserSearch');
    const chatInput = document.querySelector('#virtualclassCont.congrea  #ta_chrm2');
    if (privateChat.classList.contains('active')) {
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
    updateOnlineUserText();

    virtualclass.connectedUsers.forEach((elem) => {
      $(`#ml${elem.userid}`).addClass('online').removeClass('offline');
    });

    const userVid = document.querySelector('#chat_div .ui-memblist-usr.mySelf .videoSubWrapper video');
    if (userVid != null) {
      userVid.play();
    }
  }


  if (virtualclass.gObj.delayVid === 'display') {
    // Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause()
    // By delaying 200 miliseconds we are ensuring that above error is not coming
    // TODO remove setTimeout
    setTimeout(
      () => {
        virtualclass.videoHost.setUserIcon(virtualclass.gObj.uid);
      }, 200,
    );
  }
  virtualclass.gObj.delayVid = '';
}

function messageUpdate(e) {
  let msg = $.isPlainObject(e.message) ? e.message.msg : e.message;
  const to = e.toUser;
  const from = e.fromUser;
  const self = io.cfg.userid;
  const time = new Date().getTime();
  let cmsg;
  let k;
  // common chat room
  if (e.message.receiver === 'chatroom' && (!to || to === '')) {
    // suman 25
    msg = { msg, time: e.message.time };
    if (virtualclass.chat.chatroombox) {
      $('#chat_room').chatroom('option').messageSent(from, msg);
    } else {
      if ($('ul#chat_room').length === 0) {
        const d = document.createElement('ul');
        d.id = 'chat_room';
        document.body.appendChild(d);
        virtualclass.chat.chatroombox = $('#chat_room').chatroom({
          id: 'chat_room',
          user: from,
          title: lang.chatroom_header,
          messageSent(user, msg) {
            const userid = user.userid || virtualclass.gObj.uid;
            $('#chat_room').chatroom('option', 'boxManager').addMsg(user.name, msg, userid);
          },
        });
      }
      $('#chat_room').chatroom('option').messageSent(from, msg);
    }

    // store data on browser
    const storageChat = localStorage.getItem('chatroom');
    if (storageChat != null) {
      const chatroom = JSON.parse(storageChat);
      cmsg = {
        userid: from.userid, name: from.name, msg, time,
      };
      chatroom.push(cmsg);
      // localStorage.setItem('chatroom', JSON.stringify(chatroom));
    } else {
      cmsg = {
        userid: from.userid, name: from.name, msg, time,
      };
      // localStorage.setItem('chatroom', JSON.stringify([cmsg]));
    }
    // For exporting common chat
    virtualclass.chat.commonChat.push(cmsg);

    if ($('#chatroom_bt2.active').length === 0 && virtualclass.config.makeWebSocketReady) {
      $('#chatroom_bt2').addClass('ui-state-highlight');
      // console.log('====> Adding high light');
      $('#chatrm').removeClass('enable');
    }
  } else if (to != null && to !== '') { // private chat
    if (self === to.userid && from.userid !== self) {
      //            if($.inArray(from.userid, idList) == -1){
      //                counter++;
      //                idList.push(from.userid);
      if ($.inArray(from.userid, virtualclass.chat.idList) === -1) {
        virtualclass.chat.counter++;
        virtualclass.chat.idList.push(from.userid);
        if (!Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, from.userid)) {
          virtualclass.chat.vmstorage[from.userid] = [];
          virtualclass.chat.vmstorage[from.userid].push({
            userid: from.userid,
            name: `${from.name} ${from.lname}`,
          });
        }
      }

      // In case of history exist
      const chatBox = document.querySelector(`#cb${from.userid}`);
      if (chatBox == null) {
        chatboxManager.addBox(from.userid,
          {
            dest: `dest${virtualclass.chat.counter}`, // not used in demo
            title: `box${virtualclass.chat.counter}`,
            first_name: from.name,
            last_name: from.lname,
            // you can add your own options too
          });

        if (Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, from.userid)
          && virtualclass.chat.vmstorage[from.userid].length > 1) {
          displayUserSinglePvtChatHistory(from.userid);
        }
      }

      const did = from.userid;

      chatboxManager.init({
        user: from,
        messageSent(did, user, msg) {
          $(`#${did}`).chatbox('option', 'boxManager').addMsg(user.name, msg);
        },
      });
      if (roles.isStudent()) {
        virtualclass.settings.studentpc(virtualclass.settings.info.studentpc); // when teacher pc to student
      }
      $(`#${from.userid}`).chatbox('option').messageSent(from.userid, from, msg);
      // to change this
      $(`li[aria-controls='tabcb${from.userid}']`).addClass('ui-state-highlight');
      // console.log('====> Adding high light');
      // createNotification(from.userid);// tab scrolling notification for hidden tab
      k = from.userid;
    }
    virtualclass.chat.vmstorage[k].push({
      userid: from.userid, name: from.name, msg, time,
    });
  }
}

// diplay user status(offlin/online)
function statusUpdate(from, msg, prop) {
  if ($(`#${from.userid}`).length) {
    $(`#${from.userid}`).chatbox('option').messageSent(from.userid, from, msg);
    $(`#ta${from.userid}`).prop('disabled', prop);
  }
}

function commonChatboxUpdate(from, msg) {
  if ($('ul#chat_room').length) {
    $('#chat_room').chatroom('option').messageSent(from, msg);
  }
}

function newStatus(e) {
  $.each(e.message, (k, u) => {
    if (e.newuser != null && u.userid == e.newuser) {
      statusUpdate(u, 'Online', false);
      commonChatboxUpdate(u, 'Online');
    }
  });
}

/*
 Create tabs
 */
function createTab(id, name) {
  const myTabs = $('#tabs').tabs();
  const ind = $('div#tabs ul li').length;

  tabId = `tabcb${id}`;
  addTab(myTabs, tabId, ind, name);
}

function addTab(tabs, id, tabCounter, tabTitle) {
  // var tabTitle = $( "#tab_title" ),
  const tabContent = $('#tab_content');
  const tabTemplate = `<li id = '${id}' class = 'ui-state-default ui-corner-bottom ui-tabs-active ui-state-active' aria-controls = '${id}'><a href = '#{href}' class = 'ui-tabs-anchor'>#{label}</a> <a href = '#' role = 'button'class = 'ui-corner-all ui-chatbox-icon'><span class = 'ui-icon icon-close'></span></a></li>`;

  const label = tabTitle || `Tab ${tabCounter}`;
  // var id = id;
  const li = $(tabTemplate.replace(/#\{href\}/g, `#${id}`).replace(/#\{label\}/g, label));
  // const tabContentHtml = tabContent.val() || `Tab ${tabCounter} content.`;

  tabs.find('.ui-tabs-nav').append(li);
  // tabs.tabs( "refresh" );
}

function browserSupportsLocalStorage() {
  return ('localStorage' in window) && (window.localStorage != null);
}

/*
 preserve public chat on page refersh
 */
function displaycomChatHistory() {
  // common room chat data populated on referesh

  // if msglength == 1 and  sessionStorage.getItem('chatroom_status') == 'hidden'

  // if(sessionStorage.length > 1 || (sessionStorage.length == 1 && sessionStorage.getItem('chatroom_status') == null) ){
  const storageChat = localStorage.getItem('chatroom');
  if (storageChat != null) {
    const d = document.createElement('ul');
    d.id = 'chat_room';
    document.body.appendChild(d);
    const data = JSON.parse(storageChat);
    virtualclass.chat.commonChat = data;
    $.each(data, (id, msgobj) => {
      if (id < 1) {
        virtualclass.chat.chatroombox = $('#chat_room').chatroom({
          id: 'chat_room',
          user: msgobj,
          title: 'Common chat',
          messageSent(user, msg) {
            const userid = user.userid || virtualclass.gObj.uid;
            $('#chat_room').chatroom('option', 'boxManager').addMsg(user.name, msg, userid);
          },
        });
      }
      if (typeof msgobj.msg === 'object') {
        $('#chat_room').chatroom('option').messageSent(msgobj, msgobj.msg);
      } else {
        $('#chat_room').chatroom('option').messageSent(msgobj, { msg: msgobj.msg, time: msgobj.time });
      }
    });
  }

  if (localStorage.getItem('chatroom_status') == 'hidden') {
    $('#chatrm').hide(); // hide box on page refresh
  }
}

/*
 preserve private chat on page refersh
 */
function displayPvtChatHistory(data) {
  let boxOpen = false;
  // Private chat data populated on page referesh
  // console.log(data);
  $.each(data, (id, msgarr) => {
    virtualclass.chat.counter++;
    virtualclass.chat.idList.push(id);
    $.each(msgarr, (i, msgobj) => {
      if (i < 1) {
        if (Object.prototype.hasOwnProperty.call(msgobj, 'box')) {
          boxOpen = true;
        }
        if (boxOpen) {
          if (id == virtualclass.chat.supportId) {
            msgobj.name = 'support'; // to find alternative
          }
          chatboxManager.addBox(id,
            {
              dest: `dest${virtualclass.chat.counter}`, // not used in demo
              title: `box${virtualclass.chat.counter}`,
              first_name: msgobj.name,
            });

          chatboxManager.init({
            messageSent(id, user, msg) {
              $(`#${id}`).chatbox('option', 'boxManager').addMsg(user.name, msg);
            },
          });
        }
      } else if (boxOpen) {
        $(`#${id}`).chatbox('option').messageSent(id, msgobj, msgobj.msg);
      }
    });

    boxOpen = false;


    if (id == virtualclass.chat.supportId) {
      const support = document.getElementById(`cb${virtualclass.chat.supportId}`);
      if (support) {
        support.classList.add('support');
      }
    }
    if (localStorage.getItem(id) == 'hidden') {
      $(`#cb${id}`).hide(); // hide box on page refersh
      $(`#tabcb${id}`).removeClass('ui-state-active'); // make tab disable on page refersh
    }
  });
}


/*
 Dialog box to display error messages
 */
function displayError(msg) {
  // $("<div id = 'dialog' title = 'VmChat Error:'></div>").prependTo("#stickybar");
  // $("#dialog").html(msg);
  // $('#dialog').dialog();
  virtualclass.view.createErrorMsg(msg, 'errorContainer', 'virtualclassAppFooterPanel', {
    className: 'Unauthenticated',
  });
}


function clearAllChatBox() {
  $('#chatWidget .icon-close').trigger('click');
  // $("#chatrm .ui-icon-minusthick").trigger("click");
}

function disCommonChatInput() {
  const commonChatInput = document.getElementById('ta_chrm');
  if (commonChatInput != null) {
    commonChatInput.disabled = true;
  }
}

/*
 Show hide common chatbox, and
 Do adjustment according to it.
 */

function toggleCommonChatBox() {
  const uiFooterbarchatroomtab = $('#chatroom_bt2');

  if (localStorage.getItem('chatroom_status') == 'hidden') {
    localStorage.removeItem('chatroom_status');
    uiFooterbarchatroomtab.attr('data-title', virtualclass.lang.getString('minCommonChat'));
  } else {
    // localStorage.setItem('chatroom_status', 'hidden');
    uiFooterbarchatroomtab.attr('data-title', virtualclass.lang.getString('maxCommonChat'));
  }


  const iconarrowButton = document.getElementById('cc_arrow_button');
  if (iconarrowButton != null) {
    if (virtualclass.vutil.elemHasAnyClass('cc_arrow_button')) {
      if (iconarrowButton.classList.contains('icon-arrow-up')) {
        iconarrowButton.classList.add('icon-arrow-down');
        iconarrowButton.classList.remove('icon-arrow-up');
      } else {
        iconarrowButton.classList.add('icon-arrow-up');
        iconarrowButton.classList.remove('icon-arrow-down');
      }
    } else {
      iconarrowButton.className = 'icon-arrow-up';
    }
  }
  virtualclass.chat.chatroombox.chatroom('option', 'boxManager').toggleBox();
}


function sortUserList(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

function sortCommonChat() {
  const $wrapper = $('#chat_room');
  $wrapper.find('.ui-chatbox-msg').sort((a, b) => +(a.dataset.msgtime) - +(b.dataset.msgtime))
    .appendTo($wrapper);
}


function displayUserSinglePvtChatHistory(userid) {
  $(`#${userid} .ui-chatbox-msg`).remove();
  const msgarr = virtualclass.chat.vmstorage[userid];
  if (msgarr.length > 1) {
    $.each(msgarr, (i, msgobj) => {
      if (i > 0) {
        $(`#${userid}`).chatbox('option').messageSent(userid, msgobj, msgobj.msg);
      }
    });
  }
}

function groupChatImgColor(peer, userid) {
  let bgColor = 'green';
  let textColor = 'white';
  // if( typeof virtualclass.gObj.chatIconColors[userid] == "undefined"){
  const initial = getInitials(peer);
  const user = (userid.toString()) + peer;
  bgColor = stringToHslColor(user, 60, 35);
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
}
function stringToHslColor(str, s, l) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
function getInitials(string) {
  const names = string.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}
