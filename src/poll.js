/* global virtualclass, ioAdapter */
(function (window) {
    var poll = function () {

        return {
            /* to generlize */
            coursePoll: [],
            sitePoll: [],
            setting: {
                showResult: true,
                timer: true,
                time: {
                    digit: "2",
                    unit: "minut"
                }

            },
            uid: 0,
            currQid: 0,
            currOption: {},
            dataToStd: {},
            count: {},
            save: 0,
            newUserTime: {},
            list: [],
            listPoll: {},
            currResultView: "bar",
            tStamp: [],
            pollState: {},
            exportfilepath: window.exportfilepath,
            uniqueUsers: [],
            init: function () {

                this.pollState = {};
                virtualclass.previrtualclass = 'virtualclass' + "Poll";
                virtualclass.previous = 'virtualclass' + "Poll";
                var urlquery = getUrlVars(exportfilepath);
                this.cmid = urlquery.cmid;
                if (this.timer) {
                    clearInterval(this.timer);

                }
                if (!roles.hasAdmin() || (roles.isEducator())) {
                    if (roles.isStudent()) {
                        this.UI.defaultLayoutForStudent();

                    } else {
                        this.UI.container();

                        if (roles.hasControls()) {

                            ioAdapter.mustSend({
                                'poll': {
                                    pollMsg: 'init'
                                },
                                'cf': 'poll'
                            });
                        } else {

                            this.UI.defaultLayoutForStudent();

                        }
                    }
                } else {
                    this.UI.container();
                    ioAdapter.mustSend({
                        'poll': {
                            pollMsg: 'init'
                        },
                        'cf': 'poll'
                    });
                }

                var storedData = JSON.parse(localStorage.getItem('pollState'));
                if (storedData && !(isEmpty(storedData))) {
                    console.log("storeddata if block")
                    this.storedDataHandle(storedData);
                } else {
                    if (roles.hasControls()) {
                        console.log("fetchlist");
                        this.interfaceToFetchList(this.cmid);
                    }
                }

                localStorage.removeItem('pollState');

                function isEmpty(obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop))
                            return false;
                    }

                    return true;
                }
            },
            /*
             *
             * @param {object} create poll data
             * @param {type} category
             * @response text  {object}
             * poll interface to save poll in moodle database
             */
            interfaceToSave: function (data, category) {
                var that = this;
                var formData = new FormData();
                formData.append("dataToSave", JSON.stringify(data));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_save", function (msg) { //TODO Handle more situations
                    var getContent = JSON.parse(msg);
                    var options = getContent.options;
                    var obj = {};
                    var optObj = {};
                    options.forEach(function (obj) {
                        var temp = {};
                        temp.id = obj.optid;
                        temp.options = obj.options;
                        optObj[obj.optid] = temp.options;
                    })
//                    virtualclass.poll.currQid = getContent.qid;
//                    virtualclass.poll.currOption = optObj;    

                    if (!getContent.copied) {
                        that.updatePollList(getContent);
                        that.currQid = getContent.qid;
                        that.currOption = optObj;


                    } else {
                        getContent.options = optObj;
                        obj.questionid = getContent.qid;
                        obj.category = getContent.category;
                        obj.createdby = getContent.createdby;
                        obj.questiontext = getContent.question;
                        obj.creatorname = getContent.creatorname;
                        obj.options = getContent.options;
                        that.publishPoll(obj);
                        that.interfaceToFetchList(obj.category);
                        that.currQid = getContent.qid;
                        that.currOption = optObj;
                    }

                });
            },
            /*
             *
             * @param {object}  edited poll data
             *
             * @response text : updated poll with database ids
             * poll saved in the database and database poll with new option id is returned
             accordingly poll list is updated.
             */
            interfaceToEdit: function (data) {
                var that = this;
                var formData = new FormData();
                formData.append("editdata", JSON.stringify(data));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_update", function (msg) { //TODO Handle more situations
                    var getContent = JSON.parse(msg);
                    console.log(getContent);
                    that.updatePollList(getContent);

                });

            },

            /*
             *
             * @param {object} new created poll or updated poll  with ids returned from database
             *
             * poll list is updated
             */
            updatePollList: function (content) {
                var options = content.options;
                var obj = {};
                var optObj = {};

                options.forEach(function (ob) {
                    var temp = {};
                    temp.id = ob.id;
                    optObj[ob.id] = ob.options;
                })
                obj.questionid = content.qid;
                obj.category = content.category;
                obj.createdby = content.createdby;
                obj.questiontext = content.question;
                obj.creatorname = content.creatorname;
                obj.options = optObj;

                this.currQid = content.qid;
                this.currOption = optObj;

                var poll = (obj.category) ? this.coursePoll : this.sitePoll;
                poll.push(obj);
                this.interfaceToFetchList(obj.category);

            },
            interfaceToFetchList: function (category) {
                var that = this;
                var formData = new FormData();
                formData.append("category", JSON.stringify(category));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.recorder.items = []; //empty on each chunk sent
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_data_retrieve", function (msg) { //TODO Handle more situations
                    //console.log("fetched" + msg);
                    //  later in php file
                    var getContent = JSON.parse(msg);
                    for (var i = 0; i <= getContent.length - 1; i++) {
                        var options = getContent[i].options;
                        for (var j in options) {
                            getContent[i].options[j] = options[j].options;
                            console.log("getContent " + getContent[i]);
                        }
                    }
                    console.log(getContent);
                    var isAdmin = getContent.pop();
                    if (category) {
                        that.coursePoll = getContent;
                        that.displaycoursePollList()

                    } else {
                        that.sitePoll = getContent;
                        that.displaysitePollList(isAdmin);
                    }

                });

            },
            interfaceToDelete: function (qid) {
                var that = this;
                var formData = new FormData();
                formData.append("qid", JSON.stringify(qid));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_delete", function (msg) {
                     var getContent = JSON.parse(msg);
                     that.interfaceToFetchList(getContent);
                })
            },
            interfaceToDelOption: function (optionId) {

                var formData = new FormData();
                formData.append("id", JSON.stringify(optionId));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_option_drop", function (msg) {
                        // nothing to do
                })
            },
            interfaceToSaveResult: function (data) {
                var that = this;
                var formData = new FormData();
                formData.append("saveResult", JSON.stringify(data));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_result", function (msg) {
                    if (msg) {
                        var getContent = JSON.parse(msg);
                        that.interfaceToFetchList(getContent);
                    }

                });

            },
            storedDataHandle: function (storedData) {

                if (storedData["currScreen"] == "displaycoursePollList") {
                    this.reloadPollList(storedData, "course");

                } else if (storedData["currScreen"] == "displaysitePollList") {
                    this.reloadPollList(storedData, "site");


                } else if (storedData["currScreen"] == "stdPublish") {
                    this.reloadStdPublish(storedData);


                } else if (storedData["currScreen"] == "teacherPublish") {
                    this.loadTeacherScrn(storedData);

                } else if (storedData["currScreen"] == "voted") {
                    this.reloadVotedScrn(storedData);


                } else if (storedData["currScreen"] == "stdPublishResult") {

                    this.reloadStdResult(storedData);

                }
                localStorage.removeItem('pollState');

            },
            reloadPollList: function (storedData, pollType) {
                var coursePollTab = document.getElementById("coursePollTab");
                var sitePollTab = document.getElementById("sitePollTab");
                var category = 0;
                if (pollType == "course") {
                    sitePollTab.classList.remove('active');
                    coursePollTab.classList.add('active');
                    category = this.cmid;
                } else {
                    coursePollTab.classList.remove('active');
                    sitePollTab.classList.add('active');

                }
                this.interfaceToFetchList(category);
                storedData["currScreen"] == "display" + pollType + "PollList"


            },
            //
            reloadStdPublish: function (storedData) {
                this.dataRec = storedData.data.stdPoll;
                this.dataRec.newTime = storedData.data.timer;
                this.stdPublish();


                var data = {
                    stdPoll: this.dataRec,
                    timer: this.newUserTime
                            //timer: virtualclass.poll.newTimer
                }
                this.pollState["currScreen"] = "stdPublish";
                this.pollState["data"] = data;

            },
            //
            reloadVotedScrn: function (storedData) {

                this.dataRec = storedData.data.stdPoll;
                this.dataRec.newTime = storedData.data.timer;
                var elem = document.getElementById("stdPollMszLayout");
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }

                var msg = "";

                if (this.dataRec.setting.showResult) {
                    msg = "you have voted successfully ,result will be displayed soon"
                } else {
                    msg = "you have voted successfully You wont be able to see the result<br/> As you are not permitted by the teacher";
                }
                this.showMsg("mszBoxPoll", msg, "alert-success");

                var data = {
                    stdPoll: this.dataRec,
                    timer: this.newUserTime
                            //timer: virtualclass.poll.newTimer
                }
                this.pollState["currScreen"] = "voted";
                this.pollState["data"] = data;

            },
            //
            reloadStdResult: function (storedData) {
                this.dataRec = storedData.data.stdPoll;
                if (this.dataRec) {
                    this.dataRec.newTime = storedData.data.timer;

                }

                this.count = storedData.data.count;
                this.currResultView = storedData.data.view;
                this.stdPublishResult(this.count);


                if (this.currResultView == 'bar') {
                    this.updateBarGraph();
                } else if (this.currResultView == 'pi') {
                    this.createPiChart();
                    this.updatePiChart();

                }

                var data = {
                    stdPoll: this.dataRec,
                    timer: this.newUserTime,
                    count: this.count,
                    view: this.currResultView
                            //timer: virtualclass.poll.newTimer
                }
                this.pollState["currScreen"] = "stdPublishResult";
                this.pollState["data"] = data;
            },
            // timer to..
            loadTeacherScrn: function (storedData) {

                console.log("currentscreenpublish");
                this.dataToStd["question"] = storedData.data.question;
                this.dataToStd["options"] = storedData.data.options;
                this.dataToStd["qId"] = storedData.data.qId;

                this.setting = storedData.data.setting;
                this.newUserTime = storedData.data.newTime;
                this.newTime = storedData.data.newTime;
                this.nTimer = storedData.data.newTime;
                //virtualclass.poll.afterReload=storedData.data.newTime;
                this.count = storedData.data.count;
                this.currResultView = storedData.data.view;
                this.uniqueUsers = storedData.data.users;
                var pollType = storedData.data.pollType;
                var coursePollTab = document.getElementById("coursePollTab");
                var sitePollTab = document.getElementById("sitePollTab");
                var category = 0;
                if (pollType == "course") {
                    sitePollTab.classList.remove('active');
                    coursePollTab.classList.add('active');
                    category = this.cmid;
                } else {
                    coursePollTab.classList.remove('active');
                    sitePollTab.classList.add('active');

                }
                this.interfaceToFetchList(category);

                this.reloadTeacherPublish(storedData);
                this.list = storedData.data.list;

                var data = {
                    question: this.dataToStd.question,
                    options: this.dataToStd.options,
                    setting: this.setting,
                    newTime: this.nTimer,
                    count: this.count,
                    view: this.currResultView,
                    list: this.list,
                    totalUsers: storedData.data.totalUsers,
                    users: this.uniqueUsers,
                    pollType: pollType
                };

                if (typeof storedData.data.pollClosed != 'undefined') {
                    this.UI.pollClosedUI();
                    var msg = "Poll closed";
                    this.showMsg("resultLayoutHead", msg, "alert-success");
                    if (this.timer) {
                        clearInterval(this.timer);
                    }
                    this.testNoneVoted();
                    var msz = document.getElementById("pollResultMsz");
                    if (msz) {
                        msz.parentNode.removeChild(msz);
                    }

                    data["pollClosed"] = "yes";
                    this.pollState["pollClosed"] = "yes";
                }
                this.pollState["data"] = data;
                this.pollState["currScreen"] = "teacherPublish";
                localStorage.removeItem('pollState');

            },

            reloadTeacherPublish: function (storedData) {

                var pollType = storedData.data.pollType;
                var cont = document.getElementById("bootstrapCont");
                //virtualclass.poll.UI.generateModal("editPollModal", cont, pollType);
                $('#editPollModal').modal({
                    backdrop: 'static',
                    keyboard: false
                })
                $('#editPollModal').modal({
                    show: true
                });

                $("#editPollModal").on('hidden.bs.modal', function () {
                    //virtualclass.poll.test(pollType);
                    $("#editPollModal").remove();
                });

                var isTimer = this.setting.timer;
                this.UI.resultView(isTimer, pollType);
                this.list = storedData.data.list;
                this.count = storedData.data.count;
                this.currResultView = storedData.data.view;

                var totalUsers = storedData.data.totalUsers;
                this.reloadGraph();
                this.noOfVotes(totalUsers);

                if (isTimer) {
                    this.UI.resultView(isTimer);
                    var min = this.nTimer.min;
                    var sec = this.nTimer.sec;

                    if (min || sec > 1) {
                        var timerWrapper = document.getElementById("timerWrapper");
                        if (timerWrapper) {
                            var elem = document.createElement("div");
                            elem.id = "timerCont";
                            timerWrapper.appendChild(elem);
                        }
                        this.showTimer(virtualclass.poll.nTimer, 0); // not in ui
                    } else if (min || sec <= 1) {

                        var timerWrapper = document.getElementById("timerWrapper");
                        if (timerWrapper) {
                            var elem = document.createElement("div");
                            elem.id = "timerCont";
                            timerWrapper.appendChild(elem);
                        }
                        elem.innerHTML = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "00" : sec);
                        this.noneVoted();
                        var msz = document.getElementById("pollResultMsz");
                        if (msz) {
                            msz.parentNode.removeChild(msz);
                        }

                    }
                } else {
                    var min = storedData.data.newTime.min;
                    var sec = storedData.data.newTime.sec;
                    this.elapsedTimer(min, sec);

                }

                var modalClose = document.getElementById("modalClose");
                if(modalClose){
                    modalClose.removeAttribute("data-dismiss");
                    modalClose.addEventListener("click", function () {
                        virtualclass.poll.pollModalClose(pollType);

                    });
                }

                this.count = storedData.data.count;
                // virtualclass.poll.testNoneVoted();
                this.pollState["currScreen"] = "teacherPublish";

            },

            pollModalClose: function (pollType) {
                if (roles.hasControls()) {
                    if (this.pollState["currScreen"]) {
                        if (this.pollState["currScreen"] == "teacherPublish") {
                            this.pollState["currScreen"] = pollType == 'course' ? "displaycoursePollList" : "displaysitePollList";
                        }

                    }
                }

                var message = "<span>Are u sure to close the poll  </span>";
                virtualclass.popup.confirmInput(message, this.resultCloseConfirm, pollType);
            },
      
            resultCloseConfirm: function (opted) {

                if (opted) {
                    $('#editPollModal').remove();
                    if (this.timer) {
                        ioAdapter.mustSend({
                            'poll': {
                                pollMsg: 'stdPublishResult',
                                data: this.count
                            },
                            'cf': 'poll'
                        });
                        this.resultToStorage();
                        var saveResult = {
                            "qid": this.dataToStd.qId,
                            "list": this.list
                        }


                    }
                    if (this.timer) {
                        this.interfaceToSaveResult(saveResult);
                        clearInterval(this.timer);
                        this.timer = 0;
                    }

                    var elem = document.getElementById("congreaPollVoters")
                    if (elem) {
                        elem.innerHTML = "Recevied Votes";
                    }
                    virtualclass.poll.count = {};
                }
            },
            resultToStorage: function () {
                var data = roles.hasControls() ? this.dataToStd : this.dataRec;
                var obj = {'result': this.count, qid: data.qId, pollData: data};
                this.uid++;
                obj.uid = this.uid;
                if (!roles.hasControls()) {
                    virtualclass.storage.pollStore(JSON.stringify(obj));
                }

            },
            reloadGraph: function () {
                if (this.currResultView == 'bar') {
                    this.showGraph();
                    this.updateBarGraph();

                } else if (this.currResultView == 'pi') {
                    this.createPiChart();
                    this.updatePiChart();

                } else if (this.currResultView == 'list') {
                    this.listView();
                }
                var elem = document.getElementsByClassName("emptyList");
                var chart = document.getElementById("chart")
                if (this.list.length > 0) {
                    for (var i = 0; i < elem.length; i++) {
                        elem[i].style.display = "none";
                    }
                } else {
                    chart.style.display = "none";
                }
            },
            saveInLocalStorage: function () {

                console.log("pollinlocalstorage");
                localStorage.setItem('pollState', JSON.stringify(this.pollState));

            },
            // At student end
            onmessage: function (msg, fromUser) {

                if (msg.poll.pollMsg == "stdPublish") {
                    this.dataRec = msg.poll.data;
                }

                console.log("student side " + msg.poll.pollMsg);
                virtualclass.poll[msg.poll.pollMsg].call(this, msg.poll.data, fromUser);
                if (msg.poll.pollMsg == "stdPublishResult") {
                    this.resultToStorage();
                }

            },
            pollPopUp: function (cb, index, pollType) {

                var attachInit = function () {
                    console.log(this.id);
                    virtualclass.poll.action(this.id, cb, index, pollType);
                }
                var modal = document.getElementById("editPollModal") ? document.getElementById("editPollModal") : document.getElementById("qnPopup");
                var controls = modal.querySelectorAll(':scope .controls');
                for (var i = 0; i < controls.length; i++) {
                    controls[i].addEventListener("click", attachInit)
                }
            },
            attachConfirmInit: function (id, cb, index, pollType) {

                var that = this;

                that.action(id, cb, index, pollType);
            },
            action: function (id, cb, index, pollType) {
                cb(id, index, pollType)
            },
            //to gerealize later for course and site
            displaycoursePollList: function () {
                var that = this;
                this.dispList("course");
                var listcont = document.querySelector("#listQnContcourse tbody")
                // *****reminder**change
                if(listcont) {
                    while (listcont.childNodes.length) {
                        listcont.removeChild(listcont.lastChild);
                    }
                }
                // to modify parameters ...********
                this.coursePoll.forEach(function (item, index) {
                    that.forEachPoll(item, index, "course");
                });

                var elem = document.getElementById("emptyListsite");
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }

                this.dispNewPollBtn("course");
                if (this.pollState["currScreen"] != "teacherPublish") {
                    this.pollState["currScreen"] = "displaycoursePollList";
                }
            },

            displaysitePollList: function (isAdmin) {
                var that = this
                this.dispList("site");
                var listcont = document.querySelector("#listQnContsite tbody");
                if(listcont){
                    while (listcont.childNodes.length) {
                        listcont.removeChild(listcont.lastChild);
                    }
                }

                this.sitePoll.forEach(function (item, index) {
                    that.forEachPoll(item, index, "site", isAdmin);
                });

                var elem = document.getElementById("emptyListcourse");
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }

                this.dispNewPollBtn("site", isAdmin);
                if (this.pollState["currScreen"] != "teacherPublish") {
                        this.pollState["currScreen"] = "displaysitePollList";
                }

            },

            dispList: function (pollType) {

                var mszbox = document.getElementById("mszBoxPoll");
                if (mszbox.childNodes.length > 0) {
                    mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
                }

                var hide = pollType == "course" ? "site" : "course";
                this.hidePollList(hide);
                var listCont = document.getElementById("listQnCont" + pollType);
                if (listCont) {
                    listCont.style.display = "table";
                    var elem = document.getElementById("newPollBtn" + pollType);
                    if (elem) {
                        if (elem.classList.contains(hide)) {
                            elem.classList.remove(hide);
                            elem.classList.add(pollType);
                        }
                    }
                } else {
                    this.UI.layout2("layoutPollBody", pollType);

                }

            },
            dispNewPollBtn: function (pollType, isAdmin) {
                this.attachEvent("newPollBtn" + pollType, "click", this.newPollHandler, pollType)
                var btn = document.getElementById("newPollBtn" + pollType);
                if (pollType == "site") {

                    if (typeof isAdmin != 'undefined' && isAdmin == "true") {
                        btn.style.display = "table";
                    } else {
                        btn.style.display = "none";
                    }

                    var elem = document.getElementById("newPollBtncourse");
                    if (elem) {
                        elem.style.display = "none";
                    }

                } else {
                    btn.style.display = "table";
                    var elem = document.getElementById("newPollBtnsite");
                    if (elem) {
                        elem.style.display = "none";
                    }
                }
            },
            forEachPoll: function (item, index, pollType,isAdmin) {

                  var pollQn = {};
                  pollQn.questiontext = item.questiontext;
                  pollQn.creator = item.creatorname;
                  pollQn.pollType = pollType;
                  pollQn.index = index;

                  var template=virtualclass.getTemplate("qn","poll");
                  $("#listQnCont" + pollType).append(template({"pollQn": pollQn}));

                  if (((pollType == "course" && item.createdby == wbUser.id) || (pollType == "site" && isAdmin == "true"))) {
                        if(!item.isPublished){
                            this.attachEvent("editQn" + pollType + index, "click", this.editHandler, item, pollType, index, item.createdby, item.questionid);

                        }else{
                              var link1= document.querySelector("#editQn"+pollType+index+" span")
                              // link1.setAttribute("data-toggle", "tooltip")
                              if(link1){
                                link1.setAttribute("title", "cannt edit,poll attempted ");
                                link1.style.cursor="default";
                              }
                        }
                        this.attachEvent("deleteQn" + pollType + index, "click", this.deleteHandler, item, pollType, index);
                  }else{
                        var link1= document.querySelector("#editQn"+pollType+index+" span");
                        if(link1){
                              link1.setAttribute("title", "cannt edit, can be edited by creator of the poll");
                              link1.style.cursor="default";
                        }

                        var link3 = document.querySelector("#deleteQn"+pollType + index+" span");
                        link3.setAttribute("title", "cannt delete, can be deleted  by creator of the poll");
                        link3.style.cursor="default";

                  }
                  this.attachEvent("publishQn" + pollType + index, "click", this.publishHandler, item, pollType, index);
                  this.previewOnHover(item,pollType,index);

            },

            previewOnHover: function (item,pollType,index) {
                var data={};
                data.questiontext= item.questiontext;
                data.options=item.options;
                var template=virtualclass.getTemplate("previewPopup","poll");
                var preview = (template({"data":data}));
                $(function () {
                    $('.qnText[data-toggle="popover"]').popover({content:preview,html: true,container:'#qnText'+pollType+index,delay: {show:1000}})
                })

            },

            attachEvent: function (actionid, eventName, handler, item, pollType, index, qid, temp, isPublished) {

                var elem = document.getElementById(actionid);
                if (elem != null) {
                    elem.addEventListener(eventName, function () {
                        if (typeof item != 'undefined') {
                            handler(item, pollType, index, actionid, qid, isPublished);
                        } else {
                            handler(pollType, index, actionid, qid, isPublished);
                        }
                    })
                }
            },
            hidePollList: function (pollType) {

                var listCont = document.getElementById("listQnCont" + pollType);
                if (listCont) {
                    listCont.style.display = "none";
                }

            },
            editHandler: function (item, pollType, index) {
                var mszbox = document.getElementById("mszBoxPoll");
                if (mszbox.childNodes.length > 0) {
                    mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
                }
                var data = {};
                if (pollType == 'course') {
                    poll = virtualclass.poll.coursePoll[index];
                } else {
                    poll =virtualclass.poll.sitePoll[index];
                 }
                data.options = poll.options;
                data.questiontext = poll.questiontext;

                var template=virtualclass.getTemplate("edit-modal","poll");
                $("#bootstrapCont").append(template({"data": data}));

                virtualclass.poll.UI.editPoll(pollType, index);
                $('#editPollModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false
                })

                $("#editPollModal").on('hidden.bs.modal', function () {
                $("#editPollModal").remove();
              });

            },
            stdResponse: function (response, fromUser) {
                this.updateResponse(response, fromUser);

            },
            newPollHandler: function (pollType) {
                var bsCont = document.getElementById("createPollCont");
                if ($('#editPollModal').length) {
                    $('#editPollModal').remove();
                }

                var template=virtualclass.getTemplate("modal","poll");
                $(bsCont).append(template());

                $('#editPollModal').modal({
                    backdrop: 'static',
                    keyboard: false
                })
                $('#editPollModal').modal({
                    show: true
                 });

                $("#editPollModal").on('hidden.bs.modal', function () {
                    $("#editPollModal").remove();
                });

               virtualclass.poll.pollPopUp(virtualclass.poll.popupFn, undefined, pollType);

            },
            //******************
            popupFn: function (id, index, pollType) {

                virtualclass.poll[id].call(this.poll, index, pollType);

            },
            next: function (index, pollType) {

                virtualclass.poll.pollSetting(pollType, index);
            },
            goBack: function (index, pollType) {
                console.log("modal dismiss");

            },
            // course poll and site poll

            //cmid  later
            etSave: function (qIndex, pollType, setting) {

                var flag = virtualclass.poll.isBlank();
                if (!flag) {
                    return 0;
                }
                var poll = (pollType == "course") ? virtualclass.poll.coursePoll[qIndex] : virtualclass.poll.sitePoll[qIndex];
                var category = (pollType == "course") ? virtualclass.poll.cmid : 0;
                var qn = document.getElementById("q");
                var btn = document.getElementById("etSave");
                btn.setAttribute("data-dismiss", "modal");

                if (typeof qIndex != 'undefined') {

                    virtualclass.poll.saveQuestion(qn, qIndex, pollType);
                    virtualclass.poll.saveOption(qIndex, pollType);
                    var saveQn = {
                        "questionid": poll.questionid,
                        "question": poll.questiontext,
                        "options": poll.options,
                        "createdby": poll.createdby
                    }

                    virtualclass.poll.interfaceToEdit(saveQn, category);


                } else {

                    var flag = virtualclass.poll.newPollSave("undefined", pollType);
                    if (!flag) {
                        return 0;
                    }
                }
                if (!setting) {
                    virtualclass.poll.hideModal(qIndex);
                }
                return 1;
            },
            closePoll: function () {
                var message = " are you sure to close the poll";
                virtualclass.popup.confirmInput(message, virtualclass.poll.askConfirmClose);


            },
            saveQuestion: function (elem, qIndex, pollType) {
                if (pollType == "course") {
                    this.coursePoll[qIndex].questiontext = elem.value;
                    this.coursePoll[qIndex].creator = wbUser.name
                } else {
                    this.sitePoll[qIndex].questiontext = elem.value;
                    this.sitePoll[qIndex].creator = wbUser.name
                }
                console.log(this.coursePoll);
                var elem1 = document.getElementById("qnText" + pollType + qIndex);
                elem1.innerHTML = elem.value;

            },
            saveOption: function (qIndex, pollType) {

                var temp = [];
                var j = 0;
                var t;
                var poll = (pollType == "course") ? this.coursePoll[qIndex] : this.sitePoll[qIndex];
                var optsCont = document.getElementById('optsTxCont');
                var opts = optsCont.querySelectorAll(':scope .opt');

                for (var i = 0; i < opts.length; i++) {
                    temp[i] = opts[i].value;
                }
                for (var prop in poll.options) {
                    poll.options[prop] = temp[j];
                    j++;
                }
                if (i > j) {
                    j;
                    for (t = j; t < i; t++) {
                        poll.options["noid" + j] = temp[j];
                        j++;
                    }
                }

            },
            hideModal: function () {
                $("editPollModal").modal('hide');
            },

            newPollSave: function (index, pollType) {
                var category = 0;
                var item = {};
                var option = [];
                var flag = virtualclass.poll.isBlank();
                if (!flag) {
                    return 0;
                }
                var optsCont = document.getElementById('optsTxCont');
                var opts = optsCont.querySelectorAll(':scope .opt');

                for (var i = 0; i < opts.length; i++) {
                    option.push(opts[i].value);
                }
                var q = document.getElementById("q");
                item.questiontext = q.value;
                item.creator = wbUser.name;
                item.id = wbUser.id;
                item.options = option;
                if (pollType == "course") {
                    // virtualclass.poll.coursePoll.push(item);
                    var n = virtualclass.poll.coursePoll.length - 1;
                    category = virtualclass.poll.cmid;
                } else {
                    // virtualclass.poll.sitePoll.push(item);
                    var n = virtualclass.poll.sitePoll.length - 1;
                }
                var saveQn = {
                    "question": q.value,
                    "options": option,
                    "action": "newPollSave",
                    "category": category,
                    "copied": false,
                }

                virtualclass.poll.interfaceToSave(saveQn, category);
                //virtualclass.poll.forEachPoll(item, n, pollType, creator, wbUser.id)
                return 1;
            },
            isBlank: function () {
                var q = document.getElementById("q");
                var optsCont = document.getElementById('optsTxCont');
                var optionList = optsCont.querySelectorAll(':scope .opt');
                var optCount = 0;
                var optionBlank = 0;
                for (var i = 0; i < optionList.length; i++) {
                    if (optionList[i].value) {
                        optCount++;
                    } else {
                        optionBlank++;
                    }
                }
                var qn = document.getElementById("q");
                if (!qn.value) {
                    alert("question cannt be left black");
                    return 0;

                } else if (optCount < 2) {
                    alert("enter atleast two options");
                    return 0;
                } else if (optionBlank) {
                    alert("remove the blank option")
                    return 0;
                }
                return 1;
            },
            saveNdPublish: function (index, type) {
                var pollType = type + "Poll";
                var length = virtualclass.poll[pollType].length
                var optsCont = document.getElementById('optsTxCont');
                var opt = optsCont.querySelectorAll(':scope .opt');

                if (typeof index == 'undefined') {
                    var length = virtualclass.poll[pollType].length

                    var obj = virtualclass.poll[pollType];

                    var question = document.getElementById("q").value;
                    var opts = {};
                    var optsCont = document.getElementById('optsTxCont');
                    var opt = optsCont.querySelectorAll(':scope .opt');
                    for (var i = 0; i < opt.length; i++) {
                        opts[i] = opt[i].value;
                    }
                    //datatoStd change
                    var obj1 = {
                        "question": question,
                        "options": opts

                    }
                    virtualclass.poll.dataToStd.question = obj1.question;
                    virtualclass.poll.dataToStd.options = obj1.options;
                    var setting = true
                    var flag = virtualclass.poll.newPollSave(length, type, setting);
                    if (flag) {
                        var next = true;
                        virtualclass.poll.pollSetting(type, length, next);

                    }

                } else {
                    var next = true;
                    var poll = virtualclass.poll[pollType][index];
                    var question = document.getElementById("q").value;
                    poll.question = question;

                    var j = 0;
                    for (var i in poll.options) {

                        poll.options[i] = opt[j].value;
                        j++;
                    }
                    var obj1 = {
                        "question": question,
                        "options": opts

                    }
                    virtualclass.poll[pollType][index].questiontext = document.getElementById("q").value

                    virtualclass.poll.dataToStd.question = virtualclass.poll[pollType][index].questiontext;
                    virtualclass.poll.dataToStd.options = virtualclass.poll[pollType][index].options;
                    var flag = virtualclass.poll.etSave(index, type, setting);
                    if (flag) {
                        virtualclass.poll.pollSetting(type, index, next);
                    }
                }

                var data = {
                    type: "course",
                    qid: index,
                    pollqnOps: virtualclass.poll.dataToStd
                }
                virtualclass.poll.pollState["currScreen"] = "setting";
                virtualclass.poll.pollState["data"] = data;
            },
            pollCancel: function () {
                virtualclass.popup.closeElem();

            },
            reset: function () {

                $("#editPollModal").find('textArea').val('');

            },
            addMoreOption: function (index, pollType) {

                virtualclass.poll.UI.createOption(index, pollType);

            },
            //**
            removeOption: function (pollType, qIndex, y) {

                var optionId = y.replace("remove", "");
                var e = document.getElementById(y);
                e.parentNode.parentNode.removeChild(e.parentNode);
                var poll = (pollType == 'course') ? virtualclass.poll.coursePoll[qIndex] : virtualclass.poll.sitePoll[qIndex]
                if (typeof poll !== 'undefined') {
                    delete poll.options[optionId];
                    virtualclass.poll.interfaceToDelOption(optionId);
                }
            },
            publishHandler: function (item, type, index) {

                var mszbox = document.getElementById("mszBoxPoll");
                if (mszbox.childNodes.length > 0) {
                    mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
                }

                var isPublished = item.isPublished;

                if (isPublished) {
                    virtualclass.poll.duplicatePoll(item);

                } else {
                    virtualclass.poll.publishPoll(item, type, index);

                }

            },
            duplicatePoll: function (item) {
                //to convert item.options in to an array

                var options = [];
                for (var i in item.options) {
                    options.push(item.options[i]);
                }
                var saveQn = {
                    "question": item.questiontext,
                    "options": options,
                    "action": "newPollSave",
                    "category": item.category,
                    "copied": true
                }

                virtualclass.poll.interfaceToSave(saveQn, item.category);
            },
            publishPoll: function (item, type) {
                virtualclass.poll.dataToStd.question = item.questiontext;
                virtualclass.poll.dataToStd.qId = item.questionid;
                virtualclass.poll.dataToStd.options = item.options;

                var cont = document.getElementById("layoutPollBody");
                var elem = document.createElement('div');
                 elem.className = "container";
                cont.appendChild(elem);
                var modal = document.getElementById("editPollModal");
                 if (modal) {
                    modal.remove();
                }
                var obj = {};
                obj.questiontext = item.questiontext;
                obj.options = item.options;
                var template=virtualclass.getTemplate("preview-modal","poll");
                $("#virtualclassApp #bootstrapCont").append(template({"poll": obj}));

                $('#editPollModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#editPollModal').modal({
                    show: true
                });
                virtualclass.poll.pollPreview(type);
                $("#editPollModal").on('hidden.bs.modal', function () {
                    $("#editPollModal").remove();
                });
            },
            pollPreview: function (pollType) {
                var cont = document.getElementById("contFooter");
                virtualclass.poll.UI.previewFooterBtns(cont, pollType);

            },

            publishHandler2: function () {
                var message = "poll published";
                var message = "poll published";
                virtualclass.poll.showMsg("mszBoxPoll", message, "alert-success");

            },
            deleteHandler: function (item,pollType, index) {
                var mszbox = document.getElementById("mszBoxPoll");
                var notify = mszbox.querySelectorAll(":scope .alert")
                if (notify.length > 0) {
                    notify[0].parentNode.removeChild(notify[0]);
                }
                var message = "<span>Are u sure to delete this Poll</span>";
                virtualclass.popup.confirmInput(message, virtualclass.poll.askConfirm, pollType, index);
            },

            showMsg: function (contId, msg, type) {
                var mszCont = document.getElementById(contId);
                if(!mszCont){
                     var layout = document.getElementById("layoutPollBody");
                     mszCont = document.createElement("div");
                     mszCont.id=contId
                     layout.appendChild(mszCont);
                }
                var elem = document.createElement("div");
                elem.className = "alert  alert-dismissable";
                elem.classList.add(type)
                elem.innerHTML = msg;
                mszCont.insertBefore(elem , mszCont.firstChild);

                var btn = document.createElement("button");
                btn.className = "close";
                btn.setAttribute("data-dismiss", "alert")
                btn.innerHTML = "&times";
                elem.appendChild(btn);

            },
            askConfirm: function (opted, pollType, index) {

                if (opted) {
                    var cont = document.getElementById("contQn" + pollType + index);
                    cont.parentNode.removeChild(cont);
                    var msg = "Poll deleted successfully";
                    virtualclass.poll.showMsg("mszBoxPoll", msg, "alert-success");
                    var poll = pollType == "course" ? virtualclass.poll.coursePoll[index] : virtualclass.poll.sitePoll[index]
                    var qid = poll.questionid;
                    poll = pollType == "course" ? virtualclass.poll.coursePoll : virtualclass.poll.sitePoll;
                    poll.splice(index, 1);
                    virtualclass.poll.interfaceToDelete(qid);
                }
            },
            askConfirmClose: function (opted) {
                if (opted) {

                    ioAdapter.mustSend({
                        'poll': {
                            pollMsg: 'stdPublishResult',
                            data: virtualclass.poll.count
                        },
                        'cf': 'poll'
                    });

                    virtualclass.poll.resultToStorage();
                    virtualclass.poll.UI.pollClosedUI();
                    var saveResult = {
                        "qid": virtualclass.poll.dataToStd.qId,
                        "list": virtualclass.poll.list
                    }
                    virtualclass.poll.interfaceToSaveResult(saveResult);
                    var msg = "Poll closed";
                    virtualclass.poll.showMsg("resultLayoutHead", msg, "alert-success");
                    virtualclass.poll.pollState["data"].pollClosed = "yes";
                    clearInterval(virtualclass.poll.timer);
                    virtualclass.poll.timer = 0;
                    var flagnonzero = 0;
                    for (var i in virtualclass.poll.count) {
                        if (virtualclass.poll.count[i]) {
                            flagnonzero = 1;
                        }
                    }
                    if (flagnonzero) {
                        // virtualclass.poll.showGraph();
                        var chart = document.getElementById("chart");
                        chart.style.display = "block";
                    }
                    else {
                        virtualclass.poll.noneVoted();

                        //virtualclass.poll.UI.createResultLayout();
                        var header = document.getElementById("resultLayoutHead");
                        if (header) {
                            for (var i = 0; i < header.childNodes.length; i++) {
                                header.childNodes[i].parentNode.removeChild(header.childNodes[i]);
                            }

                        }
                        var msz = document.getElementById("pollResultMsz");
                        msz.parentNode.removeChild(msz);

                        var chartMenu = document.getElementById("chartMenuCont");
                        chartMenu.parentNode.removeChild(chartMenu);

                    }

                }
            },
            showStudentPollReport: function () {
                virtualclass.storage.getAllDataOfPoll(['pollStorage'], function (obj) {
                    virtualclass.poll.studentReportLayout(obj)

                    var elem = document.getElementById("mszBoxPoll");
                    elem.parentNode.removeChild(elem);

                });

            },
            studentReportLayout: function (arr) {
                var report = "true"
                var layout = document.getElementById("layoutPollBody");
                while (layout.childElementCount > 1) {
                    layout.removeChild(layout.lastChild);
                }

                var elem = document.createElement("div");
                layout.appendChild(elem)

                var obj = JSON.parse(arr.pop().pollResult);

                var count = obj.result;
                //elem.innerHTML="data fetched from indexed db";
                virtualclass.poll.count = count;
                virtualclass.poll.dataRec = obj.pollData;
                virtualclass.poll.stdPublishResult(count, report);


            },
            timerDisable: function () {

                var timer = document.getElementById("timer");
                timer.classList.add('disabled');

            },
            stdPublish: function () {
                var mszBox = document.getElementById("mszBoxPoll");
                if (mszBox) {
                    if (mszBox.childNodes.length > 0) {
                        mszBox.childNodes[0].parentNode.removeChild(mszBox.childNodes[0]);
                    }

                }
                if (virtualclass.poll.timer) {
                    clearInterval(virtualclass.poll.timer);
                }
                var resultLayout = document.getElementById("resultLayout");
                if (resultLayout) {
                    resultLayout.parentNode.removeChild(resultLayout);
                }
                var layoutPoll = document.getElementById("layoutPoll");
                if (layoutPoll) {
                    layoutPoll.style.display = "block";
                }
                var obj={};
                obj.question= virtualclass.poll.dataRec.options;
                var template=virtualclass.getTemplate("pollStd","poll");
                $("#layoutPollBody").append(template({"poll": obj}));
                this.UI.stdPublishUI();

                var isTimer = virtualclass.poll.dataRec.setting.timer;
                if (isTimer) {
                    var updatedTime = virtualclass.poll.dataRec.newTime;
                    virtualclass.poll.newTimer = updatedTime;
                    this.showTimer(updatedTime);
                    var label = document.querySelector("#timerLabel");
                    label.innerHTML="Remaining time"

                } else {
                    this.elapsedTimer();
                    var msg = "Teacher may close this poll at any time";
                    virtualclass.poll.showMsg("stdContHead", msg, "alert-success")
                    var label = document.querySelector("#timerLabel");
                    label.innerHTML="Elapsed Time";
                }

                var qnCont = document.getElementById("stdQnCont");
                this.showQn(qnCont);

                var optionCont = document.getElementById("stdOptionCont");
                this.showOption(optionCont);

                var btn = document.getElementById("btnVote");
                if (btn) {
                    btn.addEventListener("click", virtualclass.poll.voted);

                }

                var data = {
                    stdPoll: virtualclass.poll.dataRec,
                    timer: virtualclass.poll.newUserTime

                }
                var nav = document.getElementById("navigator");
                if(nav){
                    nav.style.display="none";
                }

                virtualclass.poll.pollState["currScreen"] = "stdPublish";
                virtualclass.poll.pollState["data"] = data;
            },
            voted: function () {
                virtualclass.poll.pollState["currScreen"] = "voted";
                if (virtualclass.poll.timer) {
                    clearInterval(virtualclass.poll.timer);
                }
                var flag = virtualclass.poll.saveSelected();
                if (flag) {
                    var elem = document.getElementById("stdPollMszLayout");
                    if (elem) {
                        elem.parentNode.removeChild(elem);
                    }

                    var elem = document.getElementById("stdPollContainer");
                    elem.parentNode.removeChild(elem);
                    var msg = "";
                    if (virtualclass.poll.dataRec.setting.showResult) {
                        msg = "you have voted successfully ,result will be displayed soon"
                    } else {
                        msg = "you have voted successfully You wont be able to see the result<br/> As you are not permitted by teacher";
                    }
                    virtualclass.poll.showMsg("mszBoxPoll", msg, "alert-success");
                    virtualclass.poll.sendResponse();

                } else {
                    alert("select an option");
                }
                var data = {
                    stdPoll: virtualclass.poll.dataRec,
                    timer: virtualclass.poll.newUserTime
                            //timer: virtualclass.poll.newTimer
                }
                virtualclass.poll.pollState["currScreen"] = "voted";
                virtualclass.poll.pollState["data"] = data;
            },

            sendResponse: function () {
                var toUser = virtualclass.vutil.whoIsTeacher();
                ioAdapter.mustSendUser({
                    'poll': {
                        pollMsg: 'stdResponse',
                        data: virtualclass.poll.responseId
                    },
                    'cf': 'poll'
                }, toUser);

            },
            // not used
            timeStamp: function (message) {
                virtualclass.poll.newTimer = message;

            },
            saveSelected: function () {

                var optsCont = document.getElementById('stdOptionCont');
                var elem = optsCont.querySelectorAll(':scope .opt');
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i].checked) {
                        virtualclass.poll.responseId = elem[i].id;
                        return 1;

                    }
                }
                if (i == elem.length) {
                    return 0;
                }
            },
            elapsedTimer: function (minut, second) {
                var label = document.getElementById("timerLabel")
                if (label) {
                    label.innerHTML = "Elapsed Time";
                }

                if (minut || second) {
                    var min = minut;
                    var sec = second;
                } else {
                    var sec = 0;
                    var min = 0;
                }


                if (!roles.hasControls()) {
                    var head = document.getElementById("stdContHead");
                    if (head) {
                        var elem = document.createElement("div");
                        elem.id = "timerCont";
                        head.appendChild(elem);
                    }
                    // to verify
                    min = virtualclass.poll.dataRec.newTime.min;
                    sec = virtualclass.poll.dataRec.newTime.sec;


                } else {
                  var elem = document.getElementById("timerCont")

                }

                var handler = function () {
                    console.log("timer" + virtualclass.poll.timer)
                    if (elem) {
                        sec++;
                        if (sec == 60) {
                            sec = 0;
                            min++;
                            if (min == 60)
                                min = 0;
                        }

                        virtualclass.poll.newUserTime.min = min;
                        virtualclass.poll.newUserTime.sec = sec;
                        // console.log("hello")
                        elem.innerHTML = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
                    } else {
                        clearInterval(virtualclass.poll.timer);

                    }
                }

                handler();
                virtualclass.poll.timer = setInterval(handler, 1000);

            },
            showTimer: function (rTime, diff) {
                if (virtualclass.poll.timer) {
                    clearInterval(virtualclass.poll.timer);
                }
                var elem = document.getElementById("timerCont");
               if(roles.hasControls()) {
                    if (virtualclass.poll.pollState.data) {
                        virtualclass.poll.pollState["data"].newTime = virtualclass.poll.newUserTime;
                        console.log("test" + virtualclass.poll.pollState["data"].newTime);
                    }

               }
                var min = 0;
                var sec = 0;
                if (roles.hasControls()) {
                    if (typeof rTime.digit != 'undefined') {
                        var dgt = rTime.digit;
                        var unit = rTime.unit;
                        var sec = dgt;
                        var min = 0
                        if (unit == "minut") {
                            var min = dgt;
                            var sec = 0;

                        }
                    } else if (typeof rTime.min != 'undefined') {
                        //for reload
                        min = rTime.min;
                        sec = rTime.sec;
                    }

                }

                if (!roles.hasControls()) {
                    if (virtualclass.poll.newTimer.min || virtualclass.poll.newTimer.sec) {
                        min = virtualclass.poll.newTimer.min;
                        sec = virtualclass.poll.newTimer.sec;
                        virtualclass.poll.newTimer = {};
                    }

                }

                var handler = function () {
                    if (elem) {
                        virtualclass.poll.newUserTime.min = min;
                        virtualclass.poll.newUserTime.sec = sec;


                        elem.innerHTML = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
                        console.log("testtimer" + virtualclass.poll.timer);

                        sec--;
                        if (sec <= 0) {
                            sec = 59;
                            min--;
                            if (min < 0) {
                                min = 0;
                                sec = 0;
                                elem.innerHTML = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
                                clearInterval(virtualclass.poll.timer);
                                virtualclass.poll.timerExpired();
                                return;
                            }
                        }
                        // virtualclass.poll.pollState["data"].
                    } else {
                        //temp
                        clearInterval(virtualclass.poll.timer);
                    }
                }
                if (min || sec) {
                    handler();
                    virtualclass.poll.timer = setInterval(handler, 1000);

                }

            },
            timerExpired: function () {

                var btn = document.getElementById("btnVote");
                if (btn) {
                    btn.classList.add("disabled");
                }
                if (roles.hasControls()) {
                    ioAdapter.mustSend({
                        'poll': {
                            pollMsg: 'stdPublishResult',
                            data: virtualclass.poll.count
                        },
                        'cf': 'poll'
                    });

                    if (virtualclass.poll.timer) {

                        var saveResult = {
                            "qid": virtualclass.poll.dataToStd.qId,
                            "list": virtualclass.poll.list
                        }
                        virtualclass.poll.interfaceToSaveResult(saveResult);

                    }

                    this.testNoneVoted();



                }
                virtualclass.poll.timer = 0;

                var elem = document.getElementById("congreaPollVoters")
                if (elem) {
                    elem.innerHTML = "Recevied Votes / Total Users";
                }
                virtualclass.poll.pollState["data"].pollClosed = "yes";
            },
            // to add additional condition for poll closed **remainder
            testNoneVoted: function () {
                //debugger
                var flagnonzero = 0;
                for (var i in virtualclass.poll.count) {
                    if (virtualclass.poll.count[i]) {
                        flagnonzero = 1;
                    }
                }
                if (flagnonzero) {

                    // virtualclass.poll.showGraph();
                    var chart = document.getElementById("chart");

                    if (virtualclass.poll.currResultView != 'list') {
                        chart.style.display = "block";
                    }

                } else {
                    this.noneVoted();

                    var header = document.getElementById("resultLayoutHead");
                    if (header) {
                        for (var i = 0; i < header.childNodes.length; i++) {
                            header.childNodes[i].parentNode.removeChild(header.childNodes[i]);
                        }

                    }
                    var msz = document.getElementById("pollResultMsz");
                    msz.parentNode.removeChild(msz);

                    var chartMenu = document.getElementById("chartMenuCont");
                    chartMenu.parentNode.removeChild(chartMenu);

                }

            },
            stdPublishResult: function (count, report) {
                virtualclass.poll.count = count;
                if (virtualclass.poll.timer) {
                    clearInterval(virtualclass.poll.timer);
                }
                if (virtualclass.poll.dataRec || report) {
                    if (report || virtualclass.poll.dataRec.setting.showResult) {

                        this.resultDisplay(count);

                    } else {

                        this.noResultDisply();
                        var header = document.getElementById("resultLayoutHead");
                        virtualclass.poll.UI.resultNotShownUI(header);
                        virtualclass.poll.pollState["currScreen"] = "stdPublishResult";
                        virtualclass.poll.pollState["data"] = "noResult"
                    }
                }
                virtualclass.poll.resultToStorage();

            },

            resultDisplay: function (count) {

                var layout = document.getElementById("layoutPoll");
                layout.style.display = "none";
                var resultLayout = document.getElementById("resultLayout")
                if (resultLayout) {
                    resultLayout.parentNode.removeChild(resultLayout);
                }
                virtualclass.poll.UI.createResultLayout();
                var resultLayout = document.getElementById("resultLayout")
                // if (!resultLayout) {
                var timer = document.getElementById("timerWrapper");
                timer.parentNode.removeChild(timer);
                var cont = document.getElementById(("resultLayout"));
                cont.classList.add("bootstrap", "container");
                virtualclass.poll.count = count;
                var mszbox = document.getElementById("mszBoxPoll");
                if (mszbox) {
                    if (mszbox.childNodes.length > 0) {
                        var notify = mszbox.querySelectorAll(":scope .alert");
                        if (notify.length > 0) {
                            notify[0].parentNode.removeChild(notify[0]);
                        }
                    }


                }

                var cont = document.getElementById("chartMenuCont");
                if (cont) {
                    virtualclass.poll.UI.chartMenu(cont)
                }
                var flagnonzero = 0;
                for (var i in virtualclass.poll.count) {
                    if (virtualclass.poll.count[i]) {
                        flagnonzero = 1;
                    }
                }
                if (flagnonzero) {
                    virtualclass.poll.showGraph();
                    var chart = document.getElementById("chart");
                    chart.style.display = "block";
                }
                else {

                    this.noneVoted();
                }


                var data = {
                    stdPoll: virtualclass.poll.dataRec,
                    timer: virtualclass.poll.newUserTime,
                    count: virtualclass.poll.count

                }
                virtualclass.poll.pollState["currScreen"] = "stdPublishResult";
                virtualclass.poll.pollState["data"] = data;

            },
            noResultDisplay: function () {
                var layout = document.getElementById("stdPollContainer");
                if (layout) {
                    layout.parentNode.removeChild(layout);
                }

                // var resultLayout = document.getElementById("resultLayout")
                // if (resultLayout) {
                //     resultLayout.parentNode.removeChild(resultLayout);
                // }


                virtualclass.poll.UI.createResultLayout();
                var header = document.getElementById("resultLayoutHead");
                if (header) {
                    for (var i = 0; i < header.childNodes.length; i++) {
                        header.childNodes[i].parentNode.removeChild(header.childNodes[i]);
                    }

                }
                var cont = document.getElementById("resultLayoutBody");
                if (cont) {
                    for (var i = 0; i < cont.childNodes.length; i++) {
                        cont.childNodes[i].parentNode.removeChild(cont.childNodes[i]);
                    }

                }
            },
            noneVoted: function () {

                this.noResultDisplay();
                var head= document.querySelector("#resultLayoutHead");
                if(head){
                    head.style.display="none";
                }
                var qnLabel= document.querySelector("#qnLabelCont");
                // if(qnLabel){
                //     qnLabel.style.display="none";
                // }
                var chartMenu= document.querySelector("#chartMenuCont");
                if(chartMenu){
                    chartMenu.style.display="none";
                }

                var resultCont = document.getElementById("resultLayoutBody");
                var elem = document.createElement("div");
                elem.className = "pollResultNotify";
                elem.id = "resultNote"
                resultCont.appendChild(elem);
                resultCont.insertBefore(elem,resultCont.firstChild);
                var msg = "Poll closed"
                virtualclass.poll.showMsg("resultNote", msg, "alert-error");

                var  pollClose = document.getElementById("resultNote");
                var elemVote = document.createElement("div");
                elemVote.className = "notifyText alert alert-info";
                elemVote.id = "congreaPollNote";
                elemVote.innerHTML = "No vote Received for this poll";
                pollClose.appendChild(elemVote);


                var item = virtualclass.poll.dataRec;
                if(!roles.hasControls()){
                    this.showPollText(resultCont, item)
                }


                var modalClose = document.getElementById("modalClose");
                if(modalClose){
                    modalClose.addEventListener('click',function(){
                        $('#editPollModal').remove();
                    });

                }

            },
            showPollText: function (resultCont) {
                var item = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                // var qncont = document.getElementById("qnLabelCont");
                // qncont.innerHTML = item.question;


                var poll= {};
                poll.question = item.question;
                poll.options = item.options;

                var template=virtualclass.getTemplate("qnOptions","poll");
                $("#resultLayoutBody").append(template({"poll": poll}));

            },
            showQn: function (qnCont) {
                if (roles.hasControls()) {
                    qnCont.innerHTML = virtualclass.poll.dataToStd.question;

                } else {
                    qnCont.innerHTML = virtualclass.poll.dataRec.question;

                }
            },
            showOption: function (optionCont) {
                var data = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                var options = data.options;
                for (var i in options) {
                    var optCont = document.createElement("div");
                    optionCont.appendChild(optCont);
                    var elem = document.createElement("input");
                    elem.className = "opt";
                    elem.setAttribute("name", "option");
                    elem.setAttribute("value", i);
                    elem.setAttribute("type", "radio");
                    elem.id = i;
                    optCont.appendChild(elem);
                    var label = document.createElement("span");
                    label.className = "stdoptn";
                    optCont.appendChild(label);
                    label.innerHTML = data.options[i];

                }
            },

            pollSetting: function (pollType, index, next) {

                virtualclass.poll.UI.hidePrevious(index);
                var setting = document.getElementById("settingTx" + index);
                if (setting == null) {
                    virtualclass.poll.UI.pollSettingUI(index, pollType);
                }
                if (typeof next != 'undefined') {
                    document.getElementById("publish").setAttribute("disable", true);
                }
                (document.getElementById("publish")).addEventListener("click", function () {
                    virtualclass.poll.saveSetting(pollType, next);

                });
                // virtualclass.poll.attachEvent("publish", "click", virtualclass.poll.saveSetting,pollType);
            },
            saveSetting: function (pollType, next) {

                if (document.getElementById('radioBtn2')) {
                    var isTimer = document.getElementById('radioBtn2').checked;
                    virtualclass.poll.setting.timer = isTimer;
                }

                var time = document.getElementById('timer')
                if (time) {
                    var dgt = time.options[time.selectedIndex].value;
                    virtualclass.poll.setting.time.digit = dgt;

                    var unit = document.getElementById('ut')
                    var ut = unit.options[unit.selectedIndex].value;
                    virtualclass.poll.setting.time.unit = ut;

                    var timeStamp = Date.now();
                    console.log("sender TimeStamp" + Date.now());
                    virtualclass.poll.setting.time.timestamp = timeStamp;

                }

                if (document.getElementById('pollCkbox')) {
                    var isShowResult = document.getElementById('pollCkbox').checked;
                    virtualclass.poll.setting.showResult = isShowResult;

                }


                virtualclass.poll.UI.resultView(isTimer, pollType);
                virtualclass.poll.currResultView = 'bar';

                //var cont = document.getElementById("timerCont");
                if (isTimer) {
                    virtualclass.poll.showTimer(virtualclass.poll.setting.time, 0); // not in ui
                } else {
                    virtualclass.poll.elapsedTimer();

                }

                if (typeof next != 'undefined') {
                    virtualclass.poll.dataToStd.qId = virtualclass.poll.currQid;
                    virtualclass.poll.dataToStd.options = virtualclass.poll.currOption;
                }

                var data = {
                    question: virtualclass.poll.dataToStd.question,
                    options: virtualclass.poll.dataToStd.options,
                    qId: virtualclass.poll.dataToStd.qId,
                    setting: virtualclass.poll.setting,
                    newTime: virtualclass.poll.newUserTime,
                    count: virtualclass.poll.count,
                    list: virtualclass.poll.list,
                    users: virtualclass.poll.uniqueUsers,
                    pollType: pollType

                };

                if (typeof virtualclass.poll.afterReload != "undefined") {

                    data.newTime = virtualclass.poll.afterReload;
                    delete virtualclass.poll.afterReload;
                }

                if (time) {
                    ioAdapter.mustSend({
                        'poll': {
                            pollMsg: 'stdPublish',
                            data: data
                        },
                        'cf': 'poll'
                    });
                    console.log("to send" + data);
                }

                data.view = virtualclass.poll.currResultView;

                virtualclass.poll.showGraph();
                virtualclass.poll.updateBarGraph();

                virtualclass.poll.pollState["currScreen"] = "teacherPublish";
                virtualclass.poll.pollState["data"] = data;

            },
            updateResponse: function (response, fromUser) {

                var chart = document.getElementById("chart");
                if (chart) {
                    chart.style.display = "block";
                }

                var msz = document.getElementById("pollResultMsz");
                if (msz) {
                    msz.style.display = "none";
                }

                var obj = {};
                //var options = virtualclass.poll.dataToStd.options;
                if (typeof virtualclass.poll.count[response] == 'undefined') {
                    virtualclass.poll.count[response] = 0

                }
                virtualclass.poll.count[response] = virtualclass.poll.count[response] + 1;
                obj[fromUser.userid] = response;
                obj["username"] = fromUser.name;
                // obj["id"]=fromUser.userid;
                virtualclass.poll.list.push(obj);
                if (virtualclass.poll.currResultView == 'bar') {
                    virtualclass.poll.updateBarGraph();
                } else if (virtualclass.poll.currResultView == 'pi') {
                    virtualclass.poll.updatePiChart();
                } else if (virtualclass.poll.currResultView == 'list') {
                    virtualclass.poll.updateListResult();
                }
            },

            // to divide this code no of user part to be separated
            noOfVotes: function (pt) {

                // var joinedUsers = virtualclass.connectedUsers.length;
                var joinedUsers = virtualclass.hasOwnProperty('connectedUsers') ? virtualclass.connectedUsers.length : 0;
                var usersVote = 0

                for (var i in virtualclass.poll.count) {
                    usersVote = usersVote + virtualclass.poll.count[i];
                }

                var participients = joinedUsers ? joinedUsers - 1 : 0;

                if (virtualclass.poll.pollState.data) {
                    virtualclass.poll.pollState["data"].totalUsers = (pt)  ?  pt : participients;
                }


                var number = virtualclass.poll.uniqueUsers.length ? virtualclass.poll.uniqueUsers.length : 0;
                if (number) {
                    participients = number - 1;
                }

                var votes = document.getElementById("receivedVotes");
                if (votes != null) {
                    votes.innerHTML = usersVote + "\/" + participients;
                }
            },

            updateBarGraph: function () {

                var chart = document.getElementById("chart");
                var msz = document.getElementById("pollResultMsz");


                var columns = [];
                var data = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                for (var i in virtualclass.poll.count) {
                    var optedVal = data.options[i];
                    columns.push([optedVal, virtualclass.poll.count[i]]);
                    if (virtualclass.poll.count[i]) {

                        if (chart) {
                            chart.style.display = "block";
                        }
                        if (msz) {
                            msz.style.display = "none";
                        }
                    }
                }

                for (var i in data.options) {
                    if (!virtualclass.poll.count.hasOwnProperty(i)) {
                        columns.push([data.options[i], "0"]);
                        virtualclass.poll.count[i] = 0;
                    }
                }

                if (virtualclass.poll.chart) {
                    virtualclass.poll.chart.load({
                        columns: columns
                    });
                }
                if (roles.hasControls()) {
                    this.noOfVotes();
                }
            },
            updatePiChart: function () {
                var chart = document.getElementById("chart");
                var msz = document.getElementById("pollResultMsz");
                this.noOfVotes();
                var data = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                var columns = [];
                for (var i in virtualclass.poll.count) {
                    var optedVal = data.options[i];
                    columns.push([optedVal, virtualclass.poll.count[i]]);
                    if (virtualclass.poll.count[i]) {

                        if (chart) {
                            chart.style.display = "block";
                        }
                        if (msz) {
                            msz.style.display = "none";
                        }
                    }


                }

                for (var i in data.options) {
                    if (!virtualclass.poll.count.hasOwnProperty(i)) {
                        columns.push([data.options[i], "0"]);
                        virtualclass.poll.count[i] = 0;
                    }
                }

                if (virtualclass.poll.piChart) {
                    virtualclass.poll.piChart.load({
                        columns: columns
                    });
                }

            },
            updateListResult: function () {
                this.noOfVotes();
                var item = virtualclass.poll.list.pop();
                virtualclass.poll.addResultListItem(item);
                virtualclass.poll.list.push(item);
                virtualclass.poll.pollState["data"].list = virtualclass.poll.list;
            },
            createPiChart: function () {
                var graphdata = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                virtualclass.poll.currResultView = "pi";
                var chart = document.getElementById("chart");
                chart.style.display = "none";
                var listCont = document.getElementById("listCont");
                if (listCont) {
                    listCont.style.display = "none";
                }

                var columns = [];
                var isNonZero = false;
                for (var i in virtualclass.poll.count) {
                    var optedVal = graphdata.options[i];
                    columns.push([optedVal, virtualclass.poll.count[i]]);
                    if (virtualclass.poll.count[i]) {
                        isNonZero = true;
                    }
                }
                if (isNonZero) {
                    chart.style.display = "block";
                }
                //temp
                require.config({
                    // baseUrl: '/js',
                    paths: {
                        d3: "https://d3js.org/d3.v3.min"
                    }
                });

                require(["d3", "c3"], function (d3, c3) {
                    virtualclass.poll.piChart = c3.generate({
                        data: {
                            // iris data from R
                            columns: columns,
                            type: 'pie',
                            onclick: function (d, i) {
                                console.log("onclick", d, i);
                            },
                            onmouseover: function (d, i) {
                                console.log("onmouseover", d, i);
                            },
                            onmouseout: function (d, i) {
                                console.log("onmouseout", d, i);
                            }
                        },
                    });
                });

                virtualclass.poll.currResultView = "pi"
                if (typeof virtualclass.poll.pollState["data"] != 'undefined') {

                    virtualclass.poll.pollState["data"].view = "pi";

                }
            },
            listView: function () {
                virtualclass.poll.currResultView = "list";
                var chart = document.getElementById("chart");
                chart.style.display = "none";
                var cont = document.getElementById("resultLayoutBody")
                var list = document.getElementById("listCont")
                if (list) {
                    list.style.display = "table";
                }
                if (list.hasChildNodes()) {
                    list.removeChild(list.childNodes[0]);
                }
                if (virtualclass.poll.list.length > 0) {
                  virtualclass.poll.createResponseTable(cont);
                  var msz = document.getElementById("pollResultMsz");
                  if (msz) {
                    msz.parentNode.removeChild(msz)
                  }
                }

            },
            createResponseTable: function (cont) {
                var template=virtualclass.getTemplate("pollresultlist","poll");
                var control = roles.hasAdmin() ? true : false;
                $("#virtualclassApp #listCont").append(template({}));

                virtualclass.poll.list.forEach(function (item, i) {
                    virtualclass.poll.addResultListItem(item, i);

                });

                virtualclass.poll.currResultView = "list";
                if (typeof virtualclass.poll.pollState["data"] != 'undefined') {
                    virtualclass.poll.pollState["data"].view = "list";
                    virtualclass.poll.pollState["data"].list = virtualclass.poll.list;

                }

            },
            addResultListItem: function (item) {
                var optedVal = virtualclass.poll.dataToStd.options;
                var tbody = document.getElementById("resultList");
                for (var j in item) {
                    if (j != "username") {
                        var prop = j;
                        var val = item[j];
                    }

                }

                var listItem = document.createElement("tr");
                //listItem.className = "list-item";
                tbody.appendChild(listItem);

                var elem = document.createElement("td");
                //elem.className = "col-md-2";
                elem.innerHTML = item["username"];
                listItem.appendChild(elem);

                var elem = document.createElement("td");
                //elem.className = "col-md-2";
                elem.innerHTML = optedVal[val];
                listItem.appendChild(elem);

            },
            barGraph: function () {

                var chart = document.getElementById("chart");
                if (chart) {
                    chart.style.display = "block";
                }

                virtualclass.poll.currResultView = "bar";
                var listView = document.getElementById("listCont");
                if (listView) {
                    listView.style.display = "none";
                }

                virtualclass.poll.showGraph();
                virtualclass.poll.updateBarGraph();
                virtualclass.poll.pollState["data"].view = "bar";

            },
            // to generlize
            showGraph: function () {

                if (io.uniquesids) {
                    var users = io.uniquesids.length;
                }

                var graphdata = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                var columns = [];
                for (var i in virtualclass.poll.count) {
                    var optedVal = graphdata.options[i];

                    columns.push([optedVal, virtualclass.poll.count[i]]);
                }
                var Data = {};
                Data.type = "bar"
                Data.columns = columns;
                var chart = document.getElementById("chart");
                if (chart) {
                    require.config({
                        // baseUrl: '/js',
                        paths: {
                            d3: "https://d3js.org/d3.v3.min"
                        }
                    });

                    require(["d3", "c3"], function (d3, c3) {
                        virtualclass.poll.chart = c3.generate({
                            bindto: "#chart",
                            data: Data,
                            bar: {
                                width: 100 // this makes bar width 100px
                            }
                        });
                    });

                    chart.style.display = "none";
                }

            },
            UI: {
                id: 'virtualclassPoll',
                class: 'virtualclass',
                /*
                 * Creates container for the poll and appends the container before audio widget
                 */
                container: function () {
                    var pollCont = document.getElementById(this.id);
                    if (pollCont != null) {
                        pollCont.parentNode.removeChild(pollCont);
                    }

                    var template=virtualclass.getTemplate("pollmain","poll");
                    var control = roles.hasAdmin() ? true : false;
                    $("#virtualclassApp #virtualclassAppLeftPanel").append(template({"control": control}));

                    if (roles.hasAdmin()) {
                        var coursePollNav = document.querySelector("#coursePollTab");
                        var sitePollNav = document.querySelector("#sitePollTab")
                        sitePollNav.addEventListener('click', function () {
                        var category = 0;
                        coursePollNav.classList.remove('active');
                        sitePollNav.classList.add('active');
                        sitePollNav.style.pointerEvents="none";
                        coursePollNav.style.pointerEvents="visible";
                        virtualclass.poll.interfaceToFetchList(category);
                    });

                        coursePollNav.addEventListener('click', function () {
                            sitePollNav.classList.remove('active');
                            coursePollNav.classList.add('active');
                            coursePollNav.style.pointerEvents="none";
                            sitePollNav.style.pointerEvents="visible";
                            virtualclass.poll.interfaceToFetchList(virtualclass.poll.cmid);
                        });
                    }else{

                        var stdNav = document.querySelector('.congrea.student #virtualclassPoll #navigator a')
                        stdNav.addEventListener('click', function () {
                            virtualclass.poll.showStudentPollReport();
                        });

                    }
                    $(function () {
                        $('[data-toggle="popover"]').popover()
                    })

                },

                resultView: function (istimer, pollType) {
                    var layout = document.getElementById("layoutPoll");

                    if (roles.hasControls()) {
                        this.createResultLayout();
                        if (!istimer) {
                            var head = document.getElementById("resultLayoutHead");
                            var btn = document.getElementById("closePoll");
                            if (!btn) {
                                var btn = document.createElement("button");
                                btn.id = "closePoll";
                                head.appendChild(btn);
                                btn.innerHTML = "closePoll";
                                btn.addEventListener("click", virtualclass.poll.closePoll);

                                var iconClose = document.createElement("i");
                                iconClose.className = "icon-close-poll";
                                btn.appendChild(iconClose);

                            }

                        }
                    }
                    var modalClose = document.getElementById("modalClose");
                    if(modalClose){
                        modalClose.removeAttribute("data-dismiss");
                        modalClose.addEventListener("click", function () {
                            virtualclass.poll.pollModalClose(pollType);

                        });
                    }

                    virtualclass.poll.count = {};
                    virtualclass.poll.list = [];

                },
                createResultLayout: function () {

                    var resultLayout = document.getElementById("resultLayout")
                    if (resultLayout) {
                        resultLayout.parentNode.removeChild(resultLayout);
                    }

                    var control = roles.hasControls() ? true : false;
                    var obj ={}
                    obj.control=control;


                    if (roles.hasControls()) {
                        obj.question=virtualclass.poll.dataToStd.question;
                        obj.options=virtualclass.poll.dataToStd.options;

                        var template=virtualclass.getTemplate("result-modal","poll");
                         if ($("#editPollModal").length) {
                             $("#editPollModal").remove();
                         }

                        $("#bootstrapCont").append(template({"obj": obj}));
                        } else {

                            obj.question=virtualclass.poll.dataRec.question;
                            var template=virtualclass.getTemplate("stdResult","poll");
                            $("#virtualclassPoll").append(template({"obj":obj}));
                        }

                    this.resultLayoutBody();
                },
                resultNotShownUI: function (header) {
                    var elem = document.createElement("div");
                    var mszbox = document.getElementById("mszBoxPoll");
                    var i = 0;
                    if (mszbox) {
                        while (mszbox.childNodes.length > 0) {
                            mszbox.removeChild(mszbox.childNodes[i]);
                        }
                    }
                    header.appendChild(elem);
                    var msg = "<b>Poll Closed </b><br/>You wont be able to see the result<br/> As you are not permitted";
                    virtualclass.poll.showMsg("mszBoxPoll", msg, "alert-success");
                },

                resultLayoutBody: function (cont) {
                    var qnLabel = document.querySelector("#qnLabelCont");
                    if(qnLabel){

                        if (roles.hasControls()) {
                            qnLabel.innerHTML = virtualclass.poll.dataToStd.question;
                        }

                        if (roles.hasControls()) {
                            this.chartMenu();
                            this.createResultMsgCont();
                        }


                   }

                },
                createResultMsgCont: function (cont) {
                  var elem = document.getElementById("pollResultMsz")
                  elem.innerHTML = "Waiting for student response"

                },
                pollClosedUI: function () {
                    var closeBtn = document.getElementById("closePoll");
                    if (closeBtn) {
                        closeBtn.parentNode.removeChild(closeBtn);
                    }

                    var elem = document.getElementById("congreaPollVoters")
                    if (elem) {
                        elem.innerHTML = "Recevied Votes / Total Users";
                    }

                    var elem = document.getElementById("pollResultMsz")
                    if (elem) {
                        elem.parentNode.removeChild(elem)
                    }

                },
                chartMenu: function (cont) {

                    var elem = document.querySelector("#chartMenuCont #bar");
                    elem.addEventListener('click', virtualclass.poll.barGraph)

                    var pi = document.querySelector("#chartMenuCont #piView");
                     pi.addEventListener('click', virtualclass.poll.createPiChart);

                    if (roles.hasControls()) {

                        var elem = document.querySelector("#chartMenuCont #rList");
                        elem.addEventListener('click', virtualclass.poll.listView)
                    }

                },
                qnLabel: function (cont) {
                    var chart = document.createElement("div");
                    chart.id = "chart";
                    chart.className = "row";
                    cont.appendChild(chart);
                },

                createNav: function (pollCont) {
                    if (!roles.hasControls())  {
                        var stdNav = document.querySelector('.congrea.student #virtualclassPoll #navigator a')
                        stdNav.addEventListener('click', function () {
                            virtualclass.poll.showStudentPollReport();
                        });

                    }
                   $(function () {
                        $('[data-toggle="popover"]').popover()
                   })

                },
                createMszBox: function (cont) {
                    var elem = document.createElement('div');
                    elem.id = "mszBoxPoll";
                    elem.className = "row";
                    cont.appendChild(elem);

                },

                addAnc: function (navId, text, active) {
                    var elem = document.getElementById(navId);
                    var anc = document.createElement('a');
                    anc.id = navId + "Anch";
                    anc.href = "#";
                    if (elem != null) {
                        var iconButton = document.createElement('span');
                        iconButton.className = "icon-" + "pollNav";
                        iconButton.id = "icon-" + text;
                        iconButton.innerHTML = text;

                        iconButton.setAttribute("data-toogle", "tooltip");
                        iconButton.setAttribute("data-placement", "bottom");
                        iconButton.setAttribute("title", text);

                        anc.appendChild(iconButton);
                        anc.dataset.title = text;
                        anc.className = 'tooltip';
                        if (typeof active != 'undefined') {
                            anc.classList.add(active);
                        }
                        elem.appendChild(anc);
                    }
                },
                createOption: function (qIndex, type) {
                    var optsCont = document.getElementById('optsTxCont');
                    var elem = optsCont.querySelectorAll(':scope .opt');
                    var count = 0;
                    for (var i = 0; i < elem.length; i++) {

                        count++;
                        var x = elem[i].id;

                    }
                    var newIndex = count;
                    if (x) {
                        var y = newIndex;
                    } else {
                        y = "0";
                    }
                    var close={};
                    close.index=y;
                    close.closeBtn= y>1?true:false;
                    var template=virtualclass.getTemplate("optioninput","poll");
                    var html = template({"close":close});

                    var addMore = document.getElementById("addMoreCont");
                    $("#addMoreCont").before(html)
                    var close = document.getElementById("remove" + y);
                    close.addEventListener("click", function () {
                        virtualclass.poll.removeOption(type, qIndex, "remove" + y);
                    })

                },
                hidePrevious: function (index) {
                    var cont = document.getElementById("optsTxCont");
                    if (cont) {
                        cont.parentNode.removeChild(cont);
                    }

                    var cont = document.getElementById("reset");
                    if (cont) {
                        cont.style.display = "none";
                    }
                    var footer = document.getElementById("footerCtrCont");
                    footer.parentNode.removeChild(footer)

                },
                editPoll: function (pollType, index) {
                    virtualclass.poll.UI.loadContent(pollType, index);
                    virtualclass.poll.UI.footerBtns(pollType, index);
                },
                // this  temp**
                loadContent: function (pollType, index) {
                    var opts = [];
                    var el = document.getElementById('qnTxCont');

                    virtualclass.poll.UI.editQn(pollType, index);
                    opts = poll.options;
                    var optsCount = 0;
                    if (typeof opts == 'object') {
                        for (var i in opts) {
                            console.log(i);
                            optsCount++;
                            virtualclass.poll.UI.editOptions(pollType, index, i, optsCount);
                        }
                    } else {
                        for (var i = 0; i < opts.length; i++) {
                            virtualclass.poll.UI.editOptions(pollType, index, i, optsCount);
                    }
                  }

                },
                previewFooterBtns: function (footerCont, pollType, index) {

                    var cont = document.getElementById("footerCtrCont");
                    if (cont) {
                        virtualclass.poll.pollPopUp(virtualclass.poll.popupFn, index, pollType);
                    }
                },
                footerBtns: function (pollType, index) {
                   if (pollType) {
                     virtualclass.poll.pollPopUp(virtualclass.poll.popupFn, index, pollType);
                   }
                },
                editQn: function (pollType, index) {
                   var qn = document.querySelector("#qnTxCont #q")
                   if (qn == null) {
                      qn.value = document.getElementById("qnText" + pollType + index).innerHTML;

                   }

                   if (qn != null && !qn.value) {
                      if (pollType =='course') {
                         qn.value = virtualclass.poll.coursePoll[index].questiontext;
                      } else {
                         qn.value = virtualclass.poll.sitePoll[index].questiontext;
                      }
                   }

                },
                editOptions: function (pollType, qIndex, prop, optsCount) {
                    var el = document.getElementById('optsTxCont')
                    el.style.display = "block";

                    var opt = document.getElementById("opt" + qIndex + prop);
                    if (optsCount > 2) {
                        var close = document.createElement("a");
                        close.id = "remove" + prop;
                        close.className = "close";
                        close.innerHTML = "&times";
                        var cont = document.querySelector("#optsTxCont .inputWrapper #option" + prop).parentNode;
                        cont.appendChild(close);
                        close.addEventListener("click", function () {
                            virtualclass.poll.removeOption(pollType, qIndex, close.id);
                        })

                    }

                    var option = document.getElementById("option" + prop);
                    if (pollType == "course") {
                        var courseOpts = virtualclass.poll.coursePoll[qIndex].options[prop];
                        option.value = (typeof courseOpts == 'object') ? courseOpts.options : courseOpts;
                    } else {
                        var siteOpts = virtualclass.poll.sitePoll[qIndex].options[prop];
                        option.value = (typeof siteOpts == 'object') ? siteOpts.options : siteOpts;
                    }

                },
                pollSettingUI: function (index, label) {
                    function range(lowEnd, highEnd) {
                        var arr = [],
                         c = highEnd - lowEnd + 1;
                        while (c--) {
                        arr[c] = highEnd--
                    }
                        return arr;
                    }

                    var template=virtualclass.getTemplate("setting-modal","poll");
                    $("#editPollModal").empty();
                    $("#editPollModal").append(template({"time": range(1, 60)}));

                    this.settingUIBody(index, label);
                },

                settingUIBody: function (index, label) {
                    this.addSettingHandlers();

                },
                addSettingHandlers: function () {

                    var mode = document.getElementById("mode");
                    mode.addEventListener('click', function () {
                        var r1 = document.getElementById("radioBtn1");
                        var r2 = document.getElementById("radioBtn2");
                        if (r1.checked) {
                            var timer = document.getElementById("timer");
                            timer.setAttribute('disabled', true);
                            var unit = document.getElementById("ut");
                            unit.setAttribute('disabled', true);
                        } else if (r2.checked) {
                            var timer = document.getElementById("timer");
                            timer.removeAttribute('disabled');
                            var unit = document.getElementById("ut");
                            unit.removeAttribute('disabled');
                        }

                    });
                },

                defaultLayoutForStudent: function () {
                    this.container();
                    var mszCont = document.getElementById("mszBoxPoll");
                    var messageLayoutId = 'stdPollMszLayout';
                    if (document.getElementById(messageLayoutId) == null) {
                        var studentMessage = document.createElement('div');
                        studentMessage.id = messageLayoutId;
                        studentMessage.innerHTML = virtualclass.lang.getString('pollmaybeshown');
                        mszCont.appendChild(studentMessage);
                    }
                },
                stdPublishUI: function () {
                    var msz = document.getElementById("stdPollMszLayout");
                    if (msz) {
                        msz.parentNode.removeChild(msz);
                    }
                },
                disableClose: function () {
                    var close = document.getElementById("pollClose");
                    close.style.display = "none";

                }

            },

            updateUsersOnPoll : function (){
                if ((virtualclass.poll.uniqueUsers.indexOf(virtualclass.jId) < 0)) {
                    virtualclass.poll.uniqueUsers.push(virtualclass.jId);
                    //Checking if object is empty
                    if(Object.keys(virtualclass.poll.count).length > 0){
                        virtualclass.poll.noOfVotes();
                    }
                }
            }
        }

    };
    window.poll = poll;

})(window);