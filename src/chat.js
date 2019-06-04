(
    function (window, $) {
        var Chat = function () {
            "use strict";
            var tabs;
            var my_calculateChatHeight = null;
            return {
                userList: [],
                init: function () {
                    this.chatroombox = null;
                    this.chatWindow = "private";
                    this.counter = 0;
                    this.idList = [];
                    this.commonChat = [];

                    var box = null;
                    $.htab = [];
                    $.htabIndex = [];
                    //virtualclass.chat.vmstorage = {};
                    this.vmstorage = {};
                    $('body').footerbar();

                    if (localStorage.getItem('init') == 'false') { // check footer is close
                        $('#stickybar').removeClass('maximize').addClass('minimize');
                        $('#hide_bar input').removeClass('close').addClass('expand');
                    }

                    tabs = $('#tabs').tabs({cache: true, activeOnAdd: true});

                    if (browserSupportsLocalStorage() == false) { // check browser for local storage
                        alert(lang.sterror);
                        return;
                    }

                    this.history();

                    //todo remove
                    this.UI.privateChatBox.init();

                    // new message alert
                    $('ul.tabs').on("click, focus", "li", function () {

                        $("li[aria-controls='" + $(this).attr('id') + "']").removeClass('ui-state-highlight');
                    });

                    //nirmala
                    //  this.fetchChatUsers();


                    console.log('chat local storage start ');
                    /** Disable Chat **/
                    var chatEnable = localStorage.getItem('chatEnable');
                    if (chatEnable != null) {
                        if (chatEnable == "false") {
                            document.querySelector('#chatWidget').classList.add('chat_disabled');
                            document.querySelector('#chat_div').classList.add('chat_disabled');
                            document.querySelector('#chatWidget').classList.remove('chat_enabled');
                        }
                    }

                },

                /** TODO , that should be handle properly for simple layout **/
                fetchChatUsers: function () {
                    console.log('FetchUser congrea_get_enrolled_users');
                    var data = new FormData();
                    data.append("action", "fetchUser");
                    virtualclass.xhr.send(data, window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=congrea_get_enrolled_users", function (msg) {
                        //debugger;
                        // TODO only return total number users instead of array objects
                        virtualclass.chat.userList = JSON.parse(msg);
                        // console.log(virtualclass.chat.userList);
                        // virtualclass.chat.showChatListUsers();
                        // virtualclass.chat.setChatDisplay();
                        updateOnlineUserText();
                        // virtualclass.media.updateVideoContHeight();
                    });
                },
                setChatDisplay: function () {
                    var chatInput = document.querySelector("#virtualclassCont.congrea  #ta_chrm2");
                    var search = document.querySelector("#virtualclassCont.congrea #congreaUserSearch");

                    var chat = localStorage.getItem('chatWindow');

                    if (chat != null && chat == "common") {
                        virtualclass.chat.chatWindow = "common";
                        var chatroom = document.getElementById("chatrm");
                        if (chatroom) {
                            chatroom.classList.add("enable")
                            chatroom.classList.remove("disable")

                            var chatroomBtn = document.getElementById("chatroom_bt2");
                            chatroomBtn.classList.add("active");

                            var list = document.getElementById("memlist");
                            if (list) {
                                list.classList.remove("enable")
                                if (!list.classList.contains("disable")) {
                                    list.classList.add("disable")
                                }
                                var listBtn = document.getElementById("user_list");
                                listBtn.classList.remove("active");
                            }
                            var search = document.querySelector("#virtualclassCont.congrea #congreaUserSearch");
                            if (search) {
                                search.style.display = "none";
                            }


                        } else {
                            var list = document.getElementById("memlist");
                            if (list) {
                                list.classList.add("enable")
                                list.classList.remove("disable")

                                var listBtn = document.getElementById("user_list");
                                listBtn.classList.add("active");
                            }
                        }
                    } else if (chat != null && chat == "support") {
                        var supportBtn = document.getElementById("congreaSupport");
                        if (supportBtn) {
                            // support.style.display = "none";
                            supportBtn.classList.add("active");
                        }

                    } else {
                        var list = document.getElementById("memlist");
                        if (list) {
                            list.classList.add("enable");
                            var listBtn = document.getElementById("user_list");
                            listBtn.classList.add("active");
                            virtualclass.chat.chatWindow = "private";
                        }

                        if (chatInput) {
                            chatInput.style.display = "none";
                        }

                    }
                    var privateChat = document.querySelector("#virtualclassCont.congrea  .vmchat_bar_button");
                    if (privateChat.classList.contains('active')) {
                        if (chatInput) {
                            chatInput.style.display = "none";
                        }
                        if (search) {
                            search.style.display = "block";
                        }
                    } else {
                        if (chatInput) {
                            chatInput.style.display = "block";
                        }
                        if (search) {
                            search.style.display = "none";
                        }

                    }

                },


                //nirmala
                showChatListUsers: function () { // 8%
                    var userlist = virtualclass.chat.userList;
//
                    // $("#user_list .inner_bt #usertab_text").html("<span id='onlineusertext'>" + "Users" + "(" + count + ")</span>");
                    // var onlineUser = document.createElement('span');
                    //     onlineUser.id = 'onlineusertext';
                    //     onlineUser.innerHTML =
                    //     document.querySelector('#usertab_text').appendChild(onlineUserTxt);

                    //$("#user_list .inner_bt #usertab_text").html("<span id='onlineusertext'>" + "Users" + "(" + count + ")</span>");


                    if (userlist.length > 0) {
                        this._showChatUserList(userlist);
                        displayChatOfflineUserList(userlist);
                        // $("div#memlist").css({display: 'block'});
                        document.querySelector('div#memlist').classList.add("enable");

                    }
                },
                _showChatUserList: function (userlist) { //13%
                    if (!document.getElementById('chat_div')) { // prevent creating div on each update
                        var cd = document.createElement('div');
                        cd.id = 'chat_div';
                        document.body.appendChild(cd);
                    }

                    /***
                     * Chat height is calculated only when Chat div is created, Or, on Window re-size.
                     * It does not need to calculate on each _showChatUserList() invocation.
                     ***/
                    // if (my_calculateChatHeight == null) {
                    //     var height = virtualclass.vutil.calculateChatHeight(); //12%
                    //     my_calculateChatHeight = height;
                    //     if (!roles.hasControls() && !virtualclass.videoHost.gObj.videoSwitch) {
                    //         height = height + 230; // 230 is teacher's video height
                    //     }
                    //     virtualclass.vutil.setChatContHeight(height);
                    //     virtualclass.chat.boxHeight = height;
                    // }

                    $("#chat_div").memberlist({
                        id: "chat_div",
                        user: userlist,
                        offset: '-1px',
                        title: lang.online,
                        userSent: function (user) {
                            var userDiv = $("#chat_div").memberlist("option", "boxManager").addUsr(user);
                            return userDiv;
                        }
                    });


                    // var testChatDiv = virtualclass.gObj.testChatDiv.shadowRoot.querySelector('#subchat');
                    // testChatDiv.addEventListener('click', function (element){
                    //     var targetElem = element.srcElement;
                    //     chatContainerEvent.onEvent(targetElem, chatboxManager);
                    //
                    // });
                },

                history: function () {
                    var chatEnable = null;
                    if (localStorage.getItem(wbUser.sid) != null) {
                        var data = JSON.parse(localStorage.getItem(wbUser.sid));
                        displayPvtChatHistory(data);
                        chatEnable = localStorage.getItem('chatEnable');
                        if (chatEnable != null && chatEnable == "false") {
                            virtualclass.user.control.disbaleAllChatBox();
                        }
                        this.vmstorage = JSON.parse(localStorage.getItem(wbUser.sid));
                    }

                    //checking common chat local storage
                    //Data stored inside sessionStorage variable
                    if (localStorage.length > 0) {
                        displaycomChatHistory();
                        virtualclass.chat.removeChatHighLight('chatrm');
                        //if(typeof chatEnable != null && chatEnable == "false"){
                        if (chatEnable != null && chatEnable == "false") {
                            virtualclass.user.control.disableCommonChat();
                        }
                    }
                },

                exportCommonChat: function (startTime) {
                    var chatHistory = [];
                    var storedMsg = virtualclass.chat.commonChat;
                    for (var i = 0; i < storedMsg.length; i++) {
                        if (startTime <= storedMsg[i].time) {
                            chatHistory.push(storedMsg[i]);
                        }
                    }
                    return chatHistory;
                },

                UI: {
                    privateChatBox: {
                        init: function () {
                            var that = this;
                            $('#tabs').delegate("span.icon-close", "click", that.close);
                            $("#tabs").on("click", "li a", that.toggle);

                        },
                        close: function () {
                            // delete box
                            var tabid = $(this).closest("li").attr("id").substring(5);
                            $("#" + tabid).chatbox("option").boxClosed(tabid);
                            $('div#cb' + tabid + '.ui-widget').hide();

                            //delete tab
                            var panelId = $(this).closest("li").remove().attr("aria-controls");
                            $("#" + panelId).remove();
                            // delete virtualclass.chat.vmstorage[tabid]; //delete variable storage
                        },
                        toggle: function () {
                            /* Hide box when click on user tab */
                            var tabid = $(this).closest("li").attr("id").substring(5);
                            $("#" + tabid).chatbox('toggleContentbox');
                            if (localStorage.getItem(tabid) == 'hidden') {
                                localStorage.removeItem(tabid);
                            } else {
                                localStorage.setItem(tabid, 'hidden');
                            }
                        }
                    }
                },
                removedPrvLoggedInDetail: function () {
                    //if same user login multiple times then
                    //remove previously logged in detail
                    $('.ui-memblist').remove();
                    $('.ui-chatbox').remove();
                    $('div#chatrm').remove();
                    virtualclass.chat.chatroombox = null;
                    console.log("Chat box is  null");

                    // delete open chat box
                    for (let key in io.uniquesids) {
                        if (key != io.cfg.userid) {
                            chatboxManager.delBox(key);
                            $("li#tabcb" + key).remove(); //delete tab
                        }
                    }
                    this.idList = 0;
                    $('#stickybar').removeClass('maximize').addClass('minimize');
                    tabs.tabs("refresh");//tabs
                },
                removeCookieUserInfo: function (e) {
                    //delete cookie
                    document.cookie = "auth_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    document.cookie = "auth_pass=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    document.cookie = "path=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    display_error(e.message);
                },
                makeUserListEmpty: function () {

                    $("#user_list .inner_bt #usertab_icon").css({'background': 'url(' + window.whiteboardPath + 'images/offline.png)no-repeat top left'});
                    $("#chatroom_bt .inner_bt #chatroom_text").text(lang.chatroom + " (0)");
                    $('div#memlist').removeClass("enable");
                },
                removeChatHighLight: function (id) {
                    // var chatCont = document.getElementById(id);
                    // var chatRoot = virtualclass.gObj.testChatDiv.shadowRoot.
                    // if (chatCont != null) {
                    if (virtualclass.gObj.hasOwnProperty('testChatDiv')) {
                        var hElements = chatContainerEvent.elementFromShadowDom('.ui-state-highlight', 'all');
                        for (var i = 0; i < hElements.length; i++) {
                            hElements[i].classList.remove('ui-state-highlight');
                        }
                    }
                    //}
                },
                openChatBox: function () {
                    var memlistBox = document.querySelector('#memlist');
                    if (memlistBox != null) {
                        var isVisible = memlistBox.offsetWidth > 0 || memlistBox.offsetHeight > 0;
                        if (!isVisible) {
                            $("#chat_div").memberlist("option", "boxManager").toggleBox();
                        }
                    }
                },

                enableTechSupport: function (uid) {
                    var techSupport = document.querySelector('#congreaSupport');
                    techSupport.setAttribute('data-tsid', uid);
                    techSupport.classList.remove('notavailable');
                    techSupport.classList.add('available');
                },

                disableTechSupport: function (uid) {
                    var techSupport = document.querySelector('#congreaSupport');
                    techSupport.classList.add('notavailable');
                    techSupport.classList.remove('available');
                    var closeElement = document.querySelector('#tabcb' + uid + ' .icon-close');
                    if (closeElement != null) {
                        closeElement.click();
                    }
                },

                isTechSupportExist: function (uid) {
                    var techSupport = document.querySelector('#congreaSupport');
                    if (techSupport != null) {
                        return ((+techSupport.dataset.tsid) == (+uid))
                    }
                },

            }
        };
        window.Chat = Chat;
    })(window, $);