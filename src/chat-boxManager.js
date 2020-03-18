// Need this to make IE happy


if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  };
}

// Manage chatbox
const chatboxManager = (function () {
  // list of all opened boxes
  let boxList = [];
  // list of boxes shown on the page
  let showList = [];
  // list of first names, for in-page demo
  // var nameList = new Array();

  const config = {
    width: 230, // px
    gap: 20,
    maxBoxes: 5,
    messageSent(id, dest, msg) {
      // override this
      $(`#${id}`).chatbox('option', 'boxManager').addMsg(dest, msg);
    },
  };

  function init(options) {
    $.extend(config, options);
  }

  function delBox(id) {
    // TODO
    const remove = id;
    showList = $.grep(showList, id => remove != id);
    boxList = $.grep(boxList, id => remove != id);
    // boxList.remove(id);
  }

  function getNextOffset() {
    return 285 + (config.width + config.gap) * showList.length;
  }

  function boxClosedCallback(id) {
    // close button in the titlebar is clicked
    const idx = showList.indexOf(id);
    if (idx !== -1) {
      showList.splice(idx, 1);
      boxList.splice(idx, 1); // removed if tab is hidden
      const diff = config.width + config.gap;
      let offset;
      for (let i = idx; i < showList.length; i++) {
        offset = $(`#${showList[i]}`).chatbox('option', 'offset');
        $(`#${showList[i]}`).chatbox('option', 'offset', offset - diff);
      }
    } else {
      alert(`There is some error: ${id}`);
    }
  }

  // caller should guarantee the uniqueness of id
  function addBox(id, user, name) {
    const idx1 = showList.indexOf(id);
    const idx2 = boxList.indexOf(id);
    if (idx1 !== -1) {
      // console.log('Do nothing');
    } else if (idx2 !== -1) {
      // exists, but hidden
      // show it and put it back to showList

      $(`#${id}`).chatbox('option', 'offset', getNextOffset());
      const manager = $(`#${id}`).chatbox('option', 'boxManager');
      manager.toggleBox();
      showList.push(id);

      let index = -1;

      index = $('#tabs li').index($(`#tabcb${id}`));
      $($('.tabs li')[index]).css('display', 'list-item');

      $('#tabs').tabs('option', 'active', index);

      $('#tabs').tabs('show');
    } else {
      if (typeof user.last_name === 'undefined') {
        user.last_name = '';
      }
      const elm = document.createElement('div');
      elm.setAttribute('id', id);
      $(elm).chatbox({
        id,
        user,
        title: `${user.first_name} ${user.last_name}`,
        hidden: false,
        width: config.width,
        offset: getNextOffset(),
        messageSent: messageSentCallback,
        boxClosed: boxClosedCallback,
      });
      boxList.push(id);
      showList.push(id);

      virtualclass.chat.calculateViewPortForMessageBox();
    }

    // var chatBox = document.querySelector('#cb' + id);
    // if(chatBox != null) {
    //     var elem = document.querySelector('#cb' + id+ ' .ui-chatbox-msg');
    //     if(elem == null){
    //         if(Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, id)){
    //             var chat = {};
    //              //  chat[id] = virtualclass.chat.vmstorage[id];
    //              // displayPvtChatHistory(chat);
    //         }
    //     }
    // }
    if (user.class === 'support') {
      if (($(`#cb${id}.support`)).length === 0) {
        $(`#cb${id}`).addClass('support').removeClass('privateChat');
      }
    } else if (user.class === 'privateChat') {
      if ($(`#cb${id}.privateChat`).length === 0) {
        $(`#cb${id}`).addClass('privateChat').removeClass('support');
      }
    }
    if (Object.prototype.hasOwnProperty.call(virtualclass.chat.vmstorage, id)) {
      virtualclass.chat.vmstorage[id][0].box = 'opened';
    }
  }

  function messageSentCallback(id, user, msg) {
    // const idx = boxList.indexOf(user.userid);
    config.messageSent(id, user, msg);
  }

  function dispatch(user, msg) {
    $(`#${user.userid}`).chatbox('option', 'boxManager').addMsg(user.name, msg);
  }

  const obj = {
    init,
    addBox,
    delBox,
    dispatch,
  };
  return obj;
}());
