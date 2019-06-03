var chatContainerEvent = {
    ub: 'init_chatBox',     // User Box(When user lick on link, it will opened new chat user box)
    ac: 'footerControler',  // audio controller
    ch: 'footerControler',  // Chat controller
    er: 'footerControler',  // Editor rich controller
    rs: 'footerControler',  // Request screen share controller
    rh: 'footerControler', // Raised hand controller

    getEvent: function (element) {
        var event = element.dataset.event;
        return this[event]
    },

    init_chatBox: function (cthis, chatboxManager) {
        var str = $(cthis);
        var ahref;
        var id;
        if (cthis.className == "videoSubWrapper" || cthis.classList == "userVideos") {
            ahref = str[0].id;
            id = ahref.replace('user', '');
        } else {
            ahref = str.attr('href');
            id = ahref.replace('#', '');
        }

        if (typeof ahref != 'undefined') {
            if (str.parent('.usern').length > 0) {
                var name = str.html();
            } else {
                //var name = str.siblings('.usern').find('a').html();
                var name = chat_div.shadowRoot.querySelector("#ml" + id + " .usern a").title;
            }

            if ($.inArray(id, virtualclass.chat.idList) == -1) {
                virtualclass.chat.counter++;
                virtualclass.chat.idList.push(id);
                if (!virtualclass.chat.vmstorage.hasOwnProperty(id)) {
                    virtualclass.chat.vmstorage[id] = [];
                    virtualclass.chat.vmstorage[id].push({userid: id, name: name});
                }
            }

            chatboxManager.addBox(id,
                {
                    dest: "dest" + virtualclass.chat.counter, // not used in demo
                    title: "box" + virtualclass.chat.counter,
                    first_name: name,
                    type: "privateChat"
                    //you can add your own options too
                });

            chatboxManager.init({
                user: {'name': name},
                messageSent: function (id, user, msg) {
                    $("#" + id).chatbox("option", "boxManager").addMsg(user.name, msg);
                }
            });

            if (virtualclass.chat.vmstorage.hasOwnProperty(id)) {
                displayUserSinglePvtChatHistory(id)
            }

            id = null;
            name = null;
        }
    },

    onEvent: function (targetElem, chatboxManager) {
        var event = this.getEvent(targetElem);
        if (targetElem.classList == "userVideos" || targetElem.classList == "videoSubWrapper" || event == 'init_chatBox') {
            if (targetElem.classList.contains('media-heading')) {
                targetElem = targetElem.parentNode.previousElementSibling;
            } else {
                targetElem = targetElem.parentNode;
            }

            this.init_chatBox(targetElem, chatboxManager);
        } else if (event == 'footerControler') {
            // If use click on achor tag than on span
            if (targetElem.tagName == 'A') {
                targetElem = targetElem.firstElementChild;
                if (targetElem.tagName != 'SPAN') {
                    alert('no span tag is found');
                }
            }
            virtualclass.user.control.init.call(virtualclass.user, targetElem);
        }
    },

    elementFromShadowDom: function (selector, numOfElems, idStartFromNumber) {
        if (virtualclass.gObj.testChatDiv != null) {
            var chat_div = virtualclass.gObj.testChatDiv.shadowRoot;
            if (typeof numOfElems != 'undefined' && numOfElems == 'all') {
                return chat_div.querySelectorAll(selector);
            } else if (typeof idStartFromNumber != 'undefined') {
                return chat_div.getElementById(selector);
            } else {
                return chat_div.querySelector(selector);
            }
        }
    }
}
