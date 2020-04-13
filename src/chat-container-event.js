

const chatContainerEvent = {
  ub: 'initChatBox', // User Box(When user lick on link, it will opened new chat user box)
  ac: 'footerControler', // audio controller
  ch: 'footerControler', // Chat controller
  er: 'footerControler', // Editor rich controller
  rs: 'footerControler', // Request screen share controller
  rh: 'footerControler', // Raised hand controller

  getEvent(element) {
    const { event } = element.dataset;
    return this[event];
  },

  initChatBox(cthis, chatboxManager) {
    const str = $(cthis);
    let ahref;
    let id;
    let name;
    if (cthis.className === 'videoSubWrapper' || cthis.classList === 'userVideos') {
      ahref = str[0].id;
      id = ahref.replace('user', '');
    } else {
      ahref = str.attr('href');
      id = ahref.replace('#', '');
    }

    if (typeof ahref !== 'undefined') {
      if (str.parent('.usern').length > 0) {
        name = str.html();
      } else {
        // var name = str.siblings('.usern').find('a').html();
        name = chat_div.shadowRoot.querySelector(`#ml${id} .usern a`).title;
      }

      if ($.inArray(id, virtualclass.chat.idList) === -1) {
        virtualclass.chat.counter++;
        virtualclass.chat.idList.push(id);
        if (!Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, id)) {
          virtualclass.chat.vmstorage[id] = [];
          virtualclass.chat.vmstorage[id].push({ userid: id, name });
        }
      }

      chatboxManager.addBox(id,
        {
          dest: `dest${virtualclass.chat.counter}`, // not used in demo
          title: `box${virtualclass.chat.counter}`,
          first_name: name,
          type: 'privateChat',
          // you can add your own options too
        });

      chatboxManager.init({
        user: { name },
        messageSent(id, user, msg) {
          $(`#${id}`).chatbox('option', 'boxManager').addMsg(user.name, msg);
        },
      });

      if (Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, id)) {
        displayUserSinglePvtChatHistory(id);
      }

      id = null;
      name = null;
    }
  },

  onEvent(targetElem, chatboxManager) {
    const event = this.getEvent(targetElem);
    if (targetElem.classList === 'userVideos' || targetElem.classList === 'videoSubWrapper'
      || event === 'initChatBox') {
      if (targetElem.classList.contains('media-heading')) {
        targetElem = targetElem.parentNode.previousElementSibling;
      } else {
        targetElem = targetElem.parentNode;
      }

      this.initChatBox(targetElem, chatboxManager);
    } else if (event === 'footerControler') {
      // If use click on achor tag than on span
      if (targetElem.tagName === 'A') {
        targetElem = targetElem.firstElementChild;
        if (targetElem.tagName !== 'SPAN') {
          alert('no span tag is found');
        }
      }
      virtualclass.user.control.init.call(virtualclass.user, targetElem);
    }
  },

  elementFromShadowDom(selector, numOfElems, idStartFromNumber) {
    let chatDiv;
    if (virtualclass.gObj.testChatDiv != null) {
      chatDiv = virtualclass.gObj.testChatDiv.shadowRoot;
      if (typeof numOfElems !== 'undefined' && numOfElems === 'all') {
        chatDiv = chatDiv.querySelectorAll(selector);
      } else if (typeof idStartFromNumber !== 'undefined') {
        chatDiv = chatDiv.getElementById(selector);
      } else {
        chatDiv = chatDiv.querySelector(selector);
      }
    }
    return chatDiv;
  },
};
