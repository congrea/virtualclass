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

                virtualclass.poll.pollState = {};
                virtualclass.previrtualclass = 'virtualclass' + "Poll";
                virtualclass.previous = 'virtualclass' + "Poll";
                var urlquery = getUrlVars(exportfilepath);
                virtualclass.poll.cmid = urlquery.cmid;


                if (virtualclass.poll.timer) {

                    clearInterval(virtualclass.poll.timer);

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
                        virtualclass.poll.interfaceToFetchList(virtualclass.poll.cmid);
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
                        virtualclass.poll.updatePollList(getContent);
                        virtualclass.poll.currQid = getContent.qid;
                        virtualclass.poll.currOption = optObj;


                    } else {
                        getContent.options = optObj;
                        obj.questionid = getContent.qid;
                        obj.category = getContent.category;
                        obj.createdby = getContent.createdby;
                        obj.questiontext = getContent.question;
                        obj.creatorname = getContent.creatorname;
                        obj.options = getContent.options;
                        virtualclass.poll.publishPoll(obj);
                        virtualclass.poll.interfaceToFetchList(obj.category);
                        virtualclass.poll.currQid = getContent.qid;
                        virtualclass.poll.currOption = optObj;
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

                var formData = new FormData();
                formData.append("editdata", JSON.stringify(data));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_update", function (msg) { //TODO Handle more situations
                    var getContent = JSON.parse(msg);
                    console.log(getContent);
                    virtualclass.poll.updatePollList(getContent);

                });

            },
            // to simplify later with weblib *********rem
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

                virtualclass.poll.currQid = content.qid;
                virtualclass.poll.currOption = optObj;

                var poll = (obj.category) ? virtualclass.poll.coursePoll : virtualclass.poll.sitePoll;
                poll.push(obj);
                virtualclass.poll.interfaceToFetchList(obj.category);

            },
            interfaceToFetchList: function (category) {
                var formData = new FormData();
                formData.append("category", JSON.stringify(category));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.recorder.items = []; //empty on each chunk sent
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_data_retrieve", function (msg) { //TODO Handle more situations
                    //console.log("fetched" + msg);
                    // to change later in php file 
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
                        virtualclass.poll.coursePoll = getContent;
                        virtualclass.poll.displaycoursePollList()

                    } else {
                        virtualclass.poll.sitePoll = getContent;
                        virtualclass.poll.displaysitePollList(isAdmin);
                    }

                });

            },
            interfaceToDelete: function (qid) {
                var formData = new FormData();
                formData.append("qid", JSON.stringify(qid));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_delete", function (msg) {
                    // var getContent = JSON.parse(msg);
                    //virtualclass.poll.interfaceToFetchList(getContent);


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

                var formData = new FormData();
                formData.append("saveResult", JSON.stringify(data));
                formData.append("user", virtualclass.gObj.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=poll_result", function (msg) {
                    if (msg) {
                        var getContent = JSON.parse(msg);
                        virtualclass.poll.interfaceToFetchList(getContent);
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
                    category = virtualclass.poll.cmid;
                } else {
                    coursePollTab.classList.remove('active');
                    sitePollTab.classList.add('active');

                }
                virtualclass.poll.interfaceToFetchList(category);
                storedData["currScreen"] == "display" + pollType + "PollList"


            },
            reloadStdPublish: function (storedData) {
                virtualclass.poll.dataRec = storedData.data.stdPoll;
                virtualclass.poll.dataRec.newTime = storedData.data.timer;
                virtualclass.poll.stdPublish();


                var data = {
                    stdPoll: virtualclass.poll.dataRec,
                    timer: virtualclass.poll.newUserTime
                            //timer: virtualclass.poll.newTimer
                }
                virtualclass.poll.pollState["currScreen"] = "stdPublish";
                virtualclass.poll.pollState["data"] = data;

            },
            reloadVotedScrn: function (storedData) {

                virtualclass.poll.dataRec = storedData.data.stdPoll;
                virtualclass.poll.dataRec.newTime = storedData.data.timer;
                var elem = document.getElementById("stdPollMszLayout");
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }

                var msg = "";

                if (virtualclass.poll.dataRec.setting.showResult) {
                    msg = "you have voted successfully ,result will be displayed soon"
                } else {
                    msg = "you have voted successfully You wont be able to see the result<br/> As you are not permitted by the teacher";
                }
                virtualclass.poll.showMsg("mszBoxPoll", msg, "alert-success");

                var data = {
                    stdPoll: virtualclass.poll.dataRec,
                    timer: virtualclass.poll.newUserTime
                            //timer: virtualclass.poll.newTimer
                }
                virtualclass.poll.pollState["currScreen"] = "voted";
                virtualclass.poll.pollState["data"] = data;

            },
            reloadStdResult: function (storedData) {
                virtualclass.poll.dataRec = storedData.data.stdPoll;
                if (virtualclass.poll.dataRec) {
                    virtualclass.poll.dataRec.newTime = storedData.data.timer;

                }

                virtualclass.poll.count = storedData.data.count;
                virtualclass.poll.currResultView = storedData.data.view;
                virtualclass.poll.stdPublishResult(virtualclass.poll.count);


                if (virtualclass.poll.currResultView == 'bar') {
                    virtualclass.poll.updateBarGraph();
                } else if (virtualclass.poll.currResultView == 'pi') {
                    virtualclass.poll.createPiChart();
                    virtualclass.poll.updatePiChart();

                }

                var data = {
                    stdPoll: virtualclass.poll.dataRec,
                    timer: virtualclass.poll.newUserTime,
                    count: virtualclass.poll.count,
                    view: virtualclass.poll.currResultView
                            //timer: virtualclass.poll.newTimer
                }
                virtualclass.poll.pollState["currScreen"] = "stdPublishResult";
                virtualclass.poll.pollState["data"] = data;
            },
            // timer to..
            loadTeacherScrn: function (storedData) {

                console.log("currentscreenpublish");
                virtualclass.poll.dataToStd["question"] = storedData.data.question;
                virtualclass.poll.dataToStd["options"] = storedData.data.options;
                virtualclass.poll.dataToStd["qId"] = storedData.data.qId;

                virtualclass.poll.setting = storedData.data.setting;
                virtualclass.poll.newUserTime = storedData.data.newTime;
                virtualclass.poll.newTime = storedData.data.newTime;
                virtualclass.poll.nTimer = storedData.data.newTime;
                //virtualclass.poll.afterReload=storedData.data.newTime;
                virtualclass.poll.count = storedData.data.count;
                virtualclass.poll.currResultView = storedData.data.view;
                virtualclass.poll.uniqueUsers = storedData.data.users;
                var pollType = storedData.data.pollType;
                var coursePollTab = document.getElementById("coursePollTab");
                var sitePollTab = document.getElementById("sitePollTab");
                var category = 0;
                if (pollType == "course") {
                    sitePollTab.classList.remove('active');
                    coursePollTab.classList.add('active');
                    category = virtualclass.poll.cmid;
                } else {
                    coursePollTab.classList.remove('active');
                    sitePollTab.classList.add('active');

                }
                virtualclass.poll.interfaceToFetchList(category);

                this.reloadTeacherPublish(storedData);
                virtualclass.poll.list = storedData.data.list;

                var data = {
                    question: virtualclass.poll.dataToStd.question,
                    options: virtualclass.poll.dataToStd.options,
                    setting: virtualclass.poll.setting,
                    newTime: virtualclass.poll.nTimer,
                    count: virtualclass.poll.count,
                    view: virtualclass.poll.currResultView,
                    list: virtualclass.poll.list,
                    totalUsers: storedData.data.totalUsers,
                    users: virtualclass.poll.uniqueUsers,
                    pollType: pollType
                };

                if (typeof storedData.data.pollClosed != 'undefined') {
                    virtualclass.poll.UI.pollClosedUI();
                    var msg = "Poll closed";
                    virtualclass.poll.showMsg("resultLayoutHead", msg, "alert-success");
                    if (virtualclass.poll.timer) {
                        clearInterval(virtualclass.poll.timer);
                    }
                    virtualclass.poll.testNoneVoted();
                    var msz = document.getElementById("pollResultMsz");
                    if (msz) {
                        msz.parentNode.removeChild(msz);
                    }

                    data["pollClosed"] = "yes";
                    virtualclass.poll.pollState["pollClosed"] = "yes";
                }
                virtualclass.poll.pollState["data"] = data;
                virtualclass.poll.pollState["currScreen"] = "teacherPublish";
                localStorage.removeItem('pollState');

            },
            reloadTeacherPublish: function (storedData) {

                var pollType = storedData.data.pollType;
                var cont = document.getElementById("bootstrapCont");
                virtualclass.poll.UI.generateModal("editPollModal", cont, pollType);
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

                var isTimer = virtualclass.poll.setting.timer;
                virtualclass.poll.UI.resultView(isTimer, pollType);
                virtualclass.poll.list = storedData.data.list;
                virtualclass.poll.count = storedData.data.count;
                virtualclass.poll.currResultView = storedData.data.view;

                var totalUsers = storedData.data.totalUsers;
                this.reloadGraph();
                virtualclass.poll.noOfVotes(totalUsers);

                if (isTimer) {
                    virtualclass.poll.UI.resultView(isTimer);
                    var min = virtualclass.poll.nTimer.min;
                    var sec = virtualclass.poll.nTimer.sec;

                    if (min || sec > 1) {
                        var timerWrapper = document.getElementById("timerWrapper");
                        if (timerWrapper) {
                            var elem = document.createElement("div");
                            elem.id = "timerCont";
                            timerWrapper.appendChild(elem);
                        }
                        virtualclass.poll.showTimer(virtualclass.poll.nTimer, 0); // not in ui
                    } else if (min || sec <= 1) {

                        var timerWrapper = document.getElementById("timerWrapper");
                        if (timerWrapper) {
                            var elem = document.createElement("div");
                            elem.id = "timerCont";
                            timerWrapper.appendChild(elem);
                        }
                        elem.innerHTML = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "00" : sec);
                        virtualclass.poll.noneVoted();
                        var msz = document.getElementById("pollResultMsz");
                        if (msz) {
                            msz.parentNode.removeChild(msz);
                        }

                    }
                } else {
                    var min = storedData.data.newTime.min;
                    var sec = storedData.data.newTime.sec;
                    virtualclass.poll.elapsedTimer(min, sec);

                }

                virtualclass.poll.count = storedData.data.count;
                // virtualclass.poll.testNoneVoted(); 
                virtualclass.poll.pollState["currScreen"] = "teacherPublish";

            },
            pollModalClose: function (pollType) {

                if (roles.hasControls()) {
                    if (virtualclass.poll.pollState["currScreen"]) {
                        if (virtualclass.poll.pollState["currScreen"] == "teacherPublish") {
                            virtualclass.poll.pollState["currScreen"] = pollType == 'course' ? "displaycoursePollList" : "displaysitePollList";
                        }

                    }
                }

                var message = "<span>Are u sure to close the poll  </span>";
                virtualclass.popup.confirmInput(message, virtualclass.poll.resultCloseConfirm, pollType);
            },
            resultCloseConfirm: function (opted) {
                //
                if (opted) {

                    $('#editPollModal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();

                    if (virtualclass.poll.timer) {
                        ioAdapter.mustSend({
                            'poll': {
                                pollMsg: 'stdPublishResult',
                                data: virtualclass.poll.count
                            },
                            'cf': 'poll'
                        });
                        //virtualclass.poll.resultToStorage();
                        var saveResult = {
                            "qid": virtualclass.poll.dataToStd.qId,
                            "list": virtualclass.poll.list
                        }


                    }
                    if (virtualclass.poll.timer) {
                        virtualclass.poll.interfaceToSaveResult(saveResult);
                        clearInterval(virtualclass.poll.timer);
                        virtualclass.poll.timer = 0;
                    }

                    var elem = document.getElementById("congreaPollVoters")
                    if (elem) {
                        elem.innerHTML = "Recevied Votes";
                    }

                }
            },
            resultToStorage: function () {
                //debugger;
                //console.log("nirmala");
                // only for student
                var data = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                //var currTime=new Date().getTime();
               // virtualclass.poll.result = virtualclass.poll.count;
                var obj = {'result': virtualclass.poll.count, qid: data.qId, pollData: data};
                virtualclass.poll.uid++;
                obj.uid = virtualclass.poll.uid;
          
                // to generlize
                if (!roles.hasControls()) {
                    virtualclass.storage.pollStore(JSON.stringify(obj));
                }

            },
            reloadGraph: function () {
                if (virtualclass.poll.currResultView == 'bar') {
                    virtualclass.poll.showGraph();
                    virtualclass.poll.updateBarGraph();

                } else if (virtualclass.poll.currResultView == 'pi') {
                    virtualclass.poll.createPiChart();
                    virtualclass.poll.updatePiChart();

                } else if (virtualclass.poll.currResultView == 'list') {
                    virtualclass.poll.listView();
                }
                var elem = document.getElementsByClassName("emptyList");
                var chart = document.getElementById("chart")
                if (virtualclass.poll.list.length > 0) {
                    for (var i = 0; i < elem.length; i++) {
                        elem[i].style.display = "none";
                    }
                } else {
                    chart.style.display = "none";
                }
            },
            saveInLocalStorage: function () {

                console.log("pollinlocalstorage");
                localStorage.setItem('pollState', JSON.stringify(virtualclass.poll.pollState));

            },
            // At student end
            onmessage: function (msg, fromUser) {

                if (msg.poll.pollMsg == "stdPublish") {
                    virtualclass.poll.dataRec = msg.poll.data;
                }

                console.log("student side " + msg.poll.pollMsg);
                virtualclass.poll[msg.poll.pollMsg].call(this, msg.poll.data, fromUser);
                if (msg.poll.pollMsg == "stdPublishResult") {
                    virtualclass.poll.resultToStorage();
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

                virtualclass.poll.dispList("course");
                var listcont = document.getElementById("listQnContcourse");
                // *****reminder**change
                while (listcont.hasChildNodes()) {
                    listcont.removeChild(listcont.lastChild);
                }

                // to modify parameters ...********
                virtualclass.poll.coursePoll.forEach(function (item, index) {
                    virtualclass.poll.forEachPoll(item, index, "course", item.creatorname, item.createdby, item.questionid, item.isPublished);
                });

                var elem = document.getElementById("emptyListsite");
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }

                if (virtualclass.poll.coursePoll.length > 0) {
                    virtualclass.poll.listHeader("course");
                } else {
                    virtualclass.poll.dispEmptyListMsg("course")
                }

                this.dispNewPollBtn("course");
                if (virtualclass.poll.pollState["currScreen"] != "teacherPublish") {
                    virtualclass.poll.pollState["currScreen"] = "displaycoursePollList";
                }
            },
            displaysitePollList: function (isAdmin) {

                virtualclass.poll.dispList("site");
                var listcont = document.getElementById("listQnContsite");
                while (listcont.hasChildNodes()) {
                    listcont.removeChild(listcont.lastChild);
                }
                virtualclass.poll.sitePoll.forEach(function (item, index) {
                    virtualclass.poll.forEachPoll(item, index, "site", item.creatorname, item.createdby, item.questionid, item.isPublished, isAdmin);
                });

                var elem = document.getElementById("emptyListcourse");
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }

                if (virtualclass.poll.sitePoll.length > 0) {
                    virtualclass.poll.listHeader("site");
                } else {
                    virtualclass.poll.dispEmptyListMsg("site")
                }

                this.dispNewPollBtn("site", isAdmin);
                if (virtualclass.poll.pollState["currScreen"] != "teacherPublish") {
                    virtualclass.poll.pollState["currScreen"] = "displaysitePollList";
                }

            },
            dispEmptyListMsg: function (polltype) {
                var mszCont = document.getElementById("mszBoxPoll");
                var elem = document.getElementById("emptyList" + polltype);
                if (!elem) {
                    var emptyList = document.createElement("div");
                    emptyList.className = "emptyList";
                    emptyList.id = "emptyList" + polltype;
                    mszCont.appendChild(emptyList);
                    if (polltype == "course") {
                        emptyList.innerHTML = "Create Your course Poll ";

                    } else {

                        emptyList.innerHTML = "Only admin can create  site poll";
                    }

                }

            },
            listHeader: function (polltype) {
                var cont = document.getElementById("listQnCont" + polltype)

                var headCont = document.createElement("div");
                headCont.classList.add("row", "headerContainer", "col-md-12")
                headCont.id = "headerContainer" + polltype;

                cont.insertBefore(headCont, cont.firstChild)
                var elem = document.createElement("div");
                elem.classList.add("controlsHeader", "col-md-2")
                elem.innerHTML = "Controls";
                headCont.appendChild(elem);

                var iconCtr = document.createElement('i');
                iconCtr.className = "icon-setting";
                elem.appendChild(iconCtr);

                var elem = document.createElement("div");
                elem.classList.add("qnTextHeader", "col-md-8")
                elem.innerHTML = "Poll Questions";
                headCont.appendChild(elem);


                var iconHelp = document.createElement('i');
                iconHelp.className = "icon-help";
                elem.appendChild(iconHelp);


                var elem = document.createElement("div");
                elem.classList.add("creatorHeader", "col-md-2")
                elem.innerHTML = "Creator";
                headCont.appendChild(elem);

                var iconCreator = document.createElement('i');
                iconCreator.className = "icon-creator";
                elem.appendChild(iconCreator);



            },
            dispList: function (pollType) {

                var mszbox = document.getElementById("mszBoxPoll");
                if (mszbox.childNodes.length > 0) {
                    mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
                }

                var hide = pollType == "course" ? "site" : "course";
                virtualclass.poll.hidePollList(hide);
                var listCont = document.getElementById("listQnCont" + pollType);
                if (listCont) {
                    listCont.style.display = "block";
                    var elem = document.getElementById("newPollBtn" + pollType);
                    if (elem) {
                        if (elem.classList.contains(hide)) {
                            elem.classList.remove(hide);
                            elem.classList.add(pollType);
                        }
                    }
                } else {
                    virtualclass.poll.UI.layout2("layoutPollBody", pollType);

                }

            },
            dispNewPollBtn: function (pollType, isAdmin) {
                if (!document.getElementById("newPollBtn" + pollType)) {
                    virtualclass.poll.UI.newPollBtn(pollType);
                }

                var btn = document.getElementById("newPollBtn" + pollType);
                if (pollType == "site") {

                    if (typeof isAdmin != 'undefined' && isAdmin == "true") {
                        btn.style.display = "block";
                    } else {
                        btn.style.display = "none";
                    }

                    var elem = document.getElementById("newPollBtncourse");
                    if (elem) {
                        elem.style.display = "none";
                    }


                } else {

                    btn.style.display = "block";

                    var elem = document.getElementById("newPollBtnsite");
                    if (elem) {
                        elem.style.display = "none";
                    }

                }

            },
            forEachPoll: function (item, index, pollType, creator, crtrId, id, isPublished, isAdmin) {
                //console.log(item);
                virtualclass.poll.UI.qnCont(index, pollType);
                virtualclass.poll.UI.qnCtrCont(index, pollType, crtrId, isPublished, isAdmin);
                virtualclass.poll.UI.qnTextCont(item, index, pollType, creator);
                virtualclass.poll.attachEvent("editQn" + pollType + index, "click", virtualclass.poll.editHandler, pollType, index, crtrId, id);
                virtualclass.poll.attachEvent("publishQn" + pollType + index, "click", virtualclass.poll.publishHandler, item, pollType, index, crtrId, id, isPublished);
                virtualclass.poll.attachEvent("deleteQn" + pollType + index, "click", virtualclass.poll.deleteHandler, pollType, index, crtrId, id);


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
            editHandler: function (pollType, index) {

                var mszbox = document.getElementById("mszBoxPoll");
                if (mszbox.childNodes.length > 0) {
                    mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
                }


                var data = {
                    type: "course",
                    qid: index
                }

                var bsCont = document.getElementById("editPollModal");

                if (bsCont == null) {
                    var cont = document.getElementById("bootstrapCont");

                    virtualclass.poll.UI.generateModal("editPollModal", cont, pollType, index);
                    virtualclass.poll.UI.modalContentUI(pollType, index);

                }
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
                console.log(response);
//                if (typeof response != "undefined") {
//
//                }
                this.updateResponse(response, fromUser);

            },
            newPollHandler: function (pollType) {

                var bsCont = document.getElementById("createPollCont");
                virtualclass.poll.UI.generateModal("editPollModal", bsCont, pollType);
                // virtualclass.poll.UI.newPollContentUI("newPollModal");
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

                virtualclass.poll.UI.layoutNewPoll(pollType);
                virtualclass.poll.UI.newPollTextUI();
                virtualclass.poll.UI.footerBtns();
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

            //cmid to change later
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
                    virtualclass.poll.coursePoll[qIndex].questiontext = elem.value;
                    virtualclass.poll.coursePoll[qIndex].creator = wbUser.name
                } else {
                    virtualclass.poll.sitePoll[qIndex].questiontext = elem.value;
                    virtualclass.poll.sitePoll[qIndex].creator = wbUser.name
                }
                console.log(virtualclass.poll.coursePoll);
                var elem1 = document.getElementById("qnText" + pollType + qIndex);
                elem1.innerHTML = elem.value;

            },
            saveOption: function (qIndex, pollType) {

                var temp = [];
                var j = 0;
                var t;
                var poll = (pollType == "course") ? virtualclass.poll.coursePoll[qIndex] : virtualclass.poll.sitePoll[qIndex];
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
            // to change
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

                var isPublished = arguments[5];
                console.log(arguments[4]);
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


                //var obj = virtualclass.poll[pollType][index];
                virtualclass.poll.dataToStd.question = item.questiontext;
                virtualclass.poll.dataToStd.qId = item.questionid;
                virtualclass.poll.dataToStd.options = item.options;
                // to add here

                var cont = document.getElementById("layoutPollBody");
                var elem = document.createElement('div');
                elem.className = "container";
                cont.appendChild(elem);
                var modal = document.getElementById("editPollModal");
                if (modal) {
                    modal.remove();
                }
                // to change this to 
                var cont = document.getElementById("bootstrapCont");
                virtualclass.poll.UI.generateModal("editPollModal", cont, type);
                $('#editPollModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#editPollModal').modal({
                    show: true
                });
                virtualclass.poll.pollPreview(type);

                $("#editPollModal").on('hidden.bs.modal', function () {
                    //virtualclass.poll.test(type)
                    $("#editPollModal").remove();
                });

            },
            pollPreview: function (pollType) {

                virtualclass.poll.UI.modalContentUI();
                var header = document.getElementById("contHead");

                var text = document.createElement('div');
                text.id = "publishTx";
                text.classList.add("row", "modalHeaderTx");
                // text.className = "row";
                text.innerHTML = "Publish Poll";
                header.appendChild(text);

                var cont = document.getElementById("qnTxCont")
                virtualclass.poll.showQn(cont);
                var cont = document.getElementById("optsTxCont")
                virtualclass.poll.showOption(cont);
                var cont = document.getElementById("contFooter");
                virtualclass.poll.UI.previewFooterBtns(cont, pollType);

            },
            pollPreviewAlt: function (pollType, item) {
                virtualclass.poll.UI.modalContentUI();
                var cont = document.getElementById("qnTxCont")
                virtualclass.poll.showPreviewQn(cont, item.questiontext);
                cont = document.getElementById("optsTxCont")
                virtualclass.poll.showPreviewOption(cont, item);

            },
            publishHandler2: function () {

                var message = "poll published";
                virtualclass.poll.showMsg("mszBoxPoll", message, "alert-success");

            },
            deleteHandler: function (pollType, index, actionid, qid) {
                var mszbox = document.getElementById("mszBoxPoll");
                var notify = mszbox.querySelectorAll(":scope .alert")
                if (notify.length > 0) {
                    notify[0].parentNode.removeChild(notify[0]);
                }
                var message = "<span>Are u sure to delete this Poll</span>";
                virtualclass.popup.confirmInput(message, virtualclass.poll.askConfirm, pollType, index, actionid);
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
                mszCont.appendChild(elem);
                elem.style.width = "100%";

                var btn = document.createElement("button");
                btn.className = "close";
                btn.setAttribute("data-dismiss", "alert")
                btn.innerHTML = "&times";
                elem.appendChild(btn);
                    
                
             
            },
            askConfirm: function (opted, pollType, index, id) {

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
                    if (poll.length == 0) {
                        var header = document.getElementById("headerContainer" + pollType);
                        header.style.display = "none";
                        virtualclass.poll.dispEmptyListMsg(pollType);
                    }
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

                   // virtualclass.poll.resultToStorage();
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

                this.UI.stdPublishUI();

                var isTimer = virtualclass.poll.dataRec.setting.timer;
                if (isTimer) {
                    var updatedTime = virtualclass.poll.dataRec.newTime;
                    virtualclass.poll.newTimer = updatedTime;
                    this.showTimer(updatedTime);
                } else {
                    this.elapsedTimer();
                    var msg = "Teacher may close this poll at any time";
                    virtualclass.poll.showMsg("stdContHead", msg, "alert-success")
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
                    var timerWrapper = document.getElementById("timerWrapper");
                    var elem = document.createElement("div");
                    elem.id = "timerCont";
                    timerWrapper.appendChild(elem);
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

                if (!roles.hasControls()) {

                    var head = document.getElementById("stdContHead");
                    if (head) {
                        var elem = document.createElement("div");
                        elem.id = "timerCont";
                        head.appendChild(elem);
                    }
                } else {
                    var timerWrapper = document.getElementById("timerWrapper");
                    if (timerWrapper) {
                        var elem = document.createElement("div");
                        elem.id = "timerCont";
                        timerWrapper.appendChild(elem);
                    }
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
//                    if (roles.hasControls()) {
//                        virtualclass.poll.resultToStorage();
//                    }


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
                // virtualclass.poll.resultToStorage();

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


                //var notify = document.getElementsByClassName("alert");


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

                var resultLayout = document.getElementById("resultLayout")
                if (resultLayout) {
                    resultLayout.parentNode.removeChild(resultLayout);
                }


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

                // noresult display to be called when polll is closed
                this.noResultDisplay();
                var resultCont = document.getElementById("resultLayoutBody");

                var elem = document.createElement("div");
                elem.className = "pollResultNotify";
                elem.id = "resultNote"
                resultCont.appendChild(elem);
                var msg = "Poll closed"
                virtualclass.poll.showMsg("resultNote", msg, "alert-error");

                var elem = document.createElement("div");
                elem.className = "notifyText";
                elem.id = "congreaPollNote";
                elem.innerHTML = "No vote Received for this poll";
                resultCont.appendChild(elem);
                var item = virtualclass.poll.dataRec;
                this.showPollText(resultCont, item)

            },
            showPollText: function (resultCont) {
                var item = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                var qncont = document.createElement("div")
                resultCont.appendChild(qncont)
                this.showQn(qncont);
                var optioncont = document.createElement("div")
                resultCont.appendChild(optioncont)
                this.showOption(optioncont);

            },
            showQn: function (qnCont) {
                if (roles.hasControls()) {
                    qnCont.innerHTML = virtualclass.poll.dataToStd.question;

                } else {
                    qnCont.innerHTML = virtualclass.poll.dataRec.question;

                }
            },
            showPreviewQn: function (qnCont, item) {

                // virtualclass.poll.dataToStd.question = virtualclass.poll[pollType][index].questiontext;
                var cont = document.createElement("div");
                qnCont.appendChild(cont)
                cont.innerHTML = item.questiontext;

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
                    var label = document.createElement("label");
                    optCont.appendChild(label);
                    label.innerHTML = data.options[i];
                }
            },
            //redundent code 
            showPreviewOption: function (optionCont, item) {
                while (optionCont.childElementCount > 1) {
                    optionCont.removeChild(optionCont.lastChild);
                }

                var data = item
                var options = item.options;
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
                    var label = document.createElement("label");
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


                // to change this nd to stop sending on page refresh************************Reminder

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

                var joinedUsers = 0;
                var usersVote = 0
                for (var i in io.uniquesids) {
                    console.log(i)
                    joinedUsers++;
                }
                //var columns = [];
                //  var data = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
                for (var i in virtualclass.poll.count) {
                    usersVote = usersVote + virtualclass.poll.count[i];
                }

                var participients = joinedUsers ? joinedUsers - 1 : 0;
                var votes = document.getElementById("receivedVotes");
                if (roles.hasControls()) {

                    if (virtualclass.poll.pollState.data) {

                        if (pt) {
                            virtualclass.poll.pollState["data"].totalUsers = pt;
                        } else {
                            virtualclass.poll.pollState["data"].totalUsers = participients;
                        }
                        if (votes) {
                            votes.innerHTML = usersVote + "\/" + virtualclass.poll.pollState["data"].totalUsers;
                        }

                    }

                    var number = virtualclass.poll.uniqueUsers.length ? virtualclass.poll.uniqueUsers.length : 0;
                    if (number) {
                        participients = number - 1;
                    }
                    //participients = number-1;
                    if (votes) {
                        votes.innerHTML = usersVote + "\/" + participients;
                    }

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
                    list.parentNode.removeChild(list);
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

                var tablecont = document.createElement('div');
                tablecont.className = "table-responsive"
                tablecont.id = "listCont"
                cont.appendChild(tablecont);

                var list = document.createElement("table");
                list.id = "listViewTable";
                list.className = "table table-bordered";
                tablecont.appendChild(list);

                var thead = document.createElement("thead");
                list.appendChild(thead);

                var tbody = document.createElement("tbody");
                tbody.id = "resultList";
                list.appendChild(tbody);

                var listItem = document.createElement("tr");

                thead.appendChild(listItem);

                var elem = document.createElement("th");

                elem.innerHTML = "NAME";
                listItem.appendChild(elem);

                var elem = document.createElement("th");
                //elem.className = "col-md-2";
                elem.innerHTML = "OPTION SELECTED";
                listItem.appendChild(elem);
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

                console.log(users);
                console.log(virtualclass.poll.count.length);
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

                    // temporary .. to look for alternative
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
                    console.log("layout check");
                    var pollCont = document.getElementById(this.id);
                    if (pollCont != null) {
                        pollCont.parentNode.removeChild(pollCont);
                    }

                    var divPoll = document.createElement('div');
                    divPoll.id = this.id;
                    divPoll.className = this.class;
                    virtualclass.vutil.insertIntoLeftBar(divPoll);
//                    var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
//                    document.getElementById(virtualclass.html.id).insertBefore(divPoll, beforeAppend);

                    this.layout(divPoll, "course")
                },
                layout: function (divPoll, pollType) {

                    var contPoll = document.createElement('div');
                    contPoll.id = "layoutPoll";
                    contPoll.className = "bootstrap container-fluid pollLayout";
                    divPoll.appendChild(contPoll);
                    // this.listNav(contPoll);

                    this.createNav(contPoll);

                    var contPollBody = document.createElement('div');
                    contPollBody.id = "layoutPollBody";
                    contPollBody.className = "pollMainCont";
                    contPoll.appendChild(contPollBody);

                    this.createMszBox(contPollBody);
                    this.createModalCont(contPollBody);



                },
                createNewBtnCont: function (ctr) {

                    var btncont = document.getElementById("createPollCont");
                    if (btncont) {
                        btncont.parentNode.removeChild(btncont);
                    }
                    var ct = document.createElement('div');
                    ct.id = "createPollCont";
                    ct.className = "createBtnCont";
                    ctr.appendChild(ct);

                },
                createModalCont: function (contPoll) {
                    var bsCont = document.createElement("div");
                    bsCont.id = "bootstrapCont";
                    bsCont.className = "modalCont";
                    contPoll.appendChild(bsCont);

                },
//                createListHeader: function (cont, pollType) {
//
//                    var contHead = document.createElement("span");
//                    contHead.className = "pollListHeader"
//                    cont.appendChild(contHead);
//                    var header = document.createElement("h4");
//                    header.id = "pollListHead";
//                    contHead.appendChild(header);
//
//
//                },
                layout2: function (contPoll, pollType) {
                    var ctr = document.getElementById(contPoll);

                    var text = pollType == "course" ? "Available course polls" : "Available site Polls";

                    var e = document.getElementById("listQnCont" + pollType);
                    if (e == null) {

                        var e = document.createElement('div');
                        e.id = "listQnCont" + pollType;
                        e.className = "row pollList";
                        ctr.appendChild(e);

                    }

                    this.createNewBtnCont(ctr);

                },
                layoutNewPoll: function () {

                    var head = document.getElementById(("contHead"));
                    var headerTx = document.createElement('div');



                    var text = document.createElement('div');
                    text.id = "editTx";
                    text.classList.add("row", "modalHeaderTx");
                    //text.className = "row";
                    text.innerHTML = "Create New Poll";
                    head.appendChild(text);

                    var body = document.getElementById("contBody");
                    //var footer = document.getElementById("newPollFooter");
                    var txCont = document.getElementById("qnTxCont");
                    if (!txCont) {
                        var qncont = document.createElement("div");
                        qncont.id = "qnTxCont";
                        qncont.classList.add("row", "pollTxCont")
                        body.appendChild(qncont);
                    }
                    var optsCont = document.getElementById("optsTxCont");
                    if (!optsCont) {
                        var opscont = document.createElement("div");
                        opscont.id = "optsTxCont";
                        opscont.classList.add("row", "pollTxCont")
                        body.appendChild(opscont);
                    }
                },
                newPollTextUI: function () {
                    var qncont = document.getElementById("qnTxCont");
                    var opscont = document.getElementById("optsTxCont");
                    var label = document.createElement('label');
                    label.innerHTML = "Question :";
                    label.className = "pollLabel";
                    qncont.appendChild(label);

                    var cont = document.createElement("div")
                    cont.className = "inputWrapper clearfix clearfix";
                    qncont.appendChild(cont);

                    var qnText = document.createElement('textArea');
                    qnText.id = "q";
                    qnText.className = "qn form-control";
                    qnText.rows = "1";
                    qnText.placeholder = "Type question";
                    cont.appendChild(qnText);

                    var label = document.createElement('label');
                    label.innerHTML = "Options :";
                    label.className = "optionLabel";
                    opscont.appendChild(label);

                    var cont = document.createElement("div")
                    cont.className = "inputWrapper clearfix";
                    opscont.appendChild(cont);

                    var optnText = document.createElement('textArea');
                    optnText.id = "1";
                    optnText.className = "opt form-control";
                    optnText.placeholder = "Type option";
                    optnText.rows = "1";
                    cont.appendChild(optnText);

                    var cont = document.createElement("div")
                    cont.className = "inputWrapper clearfix";
                    opscont.appendChild(cont);
                    var optnText = document.createElement('textArea');

                    optnText.id = "2";
                    optnText.className = "opt form-control";
                    optnText.rows = "1";
                    optnText.placeholder = "Type option";
                    cont.appendChild(optnText);

                    var addMoreCont = document.createElement("div");
                    addMoreCont.id = "addMoreCont";
                    addMoreCont.className = "addMoreCont";
                    opscont.appendChild(addMoreCont);

                    var addIcon = document.createElement("span");
                    addIcon.className = "icon-plus-circle";
                    addMoreCont.appendChild(addIcon);

                    var addMore = document.getElementById("AddMoreOption");
                    if (!addMore) {
                        var anc = document.createElement("a");
                        anc.href = "#";
                        anc.id = "addMoreOption";
                        anc.innerHTML = "Add Option"
                        anc.classList.add("addMoreOption", "controls");
                        addMoreCont.appendChild(anc);
                    }
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
                    modalClose.removeAttribute("data-dismiss");

                    modalClose.addEventListener("click", function () {
                        virtualclass.poll.pollModalClose(pollType);

                    });


                    virtualclass.poll.count = {};
                    virtualclass.poll.list = [];

                },
                createResultLayout: function () {

                    var resultLayout = document.getElementById("resultLayout")
                    if (resultLayout) {
                        resultLayout.parentNode.removeChild(resultLayout);
                    }

                    if (roles.hasControls()) {

                        var head = document.getElementById(("contHead"));
                        var resultTx = document.getElementById(("resultTx"));
                        if (!resultTx) {
                            var text = document.createElement('div');
                            text.id = "resultTx";
                            text.classList.add("row", "modalHeaderTx");
                            //text.className = "row";
                            text.innerHTML = "Poll Result";
                            head.appendChild(text);


                        }

                        var cont = document.getElementById("pollModalBody");
                        if (cont) {
                            while (cont.childElementCount > 1) {
                                cont.removeChild(cont.lastChild);
                            }
                        }

                        var settingTx = document.getElementById("settingTx");
                        if (settingTx) {
                            settingTx.parentNode.removeChild(settingTx);
                        }
                        var elem = document.createElement("div");
                        elem.id = "resultLayout";
                        // elem.className = "bootstrap container";

                        cont.appendChild(elem);


                    } else {

                        var cont = document.getElementById("virtualclassPoll");
                        var elem = document.createElement("div");
                        elem.id = "resultLayout";
                        elem.className = "bootstrap container";
                        cont.appendChild(elem);


                    }

                    this.resultLayoutHeader(elem);
                    this.resultLayoutBody(elem);
    this.resultLayoutFooter(elem);

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
                resultLayoutHeader: function (cont) {
                    var elem = document.createElement("div");
                    elem.id = "resultLayoutHead";
                    elem.className = "row";
                    cont.appendChild(elem);

                    var tw = document.createElement("div");
                    tw.id = "timerWrapper";
                    tw.className = "col-md-6";
                    elem.appendChild(tw);

                    var label = document.createElement('label');
                    label.innerHTML = "Remaining Time";
                    label.id = "timerLabel";
                    tw.appendChild(label);

                    var tw = document.createElement("div");
                    tw.id = "votesWrapper";
                    tw.className = "col-md-6";
                    elem.appendChild(tw);

                    if (roles.hasControls()) {
                        var label = document.createElement('label');
                        label.innerHTML = "Voted So Far";
                        label.id = "congreaPollVoters";
                        tw.appendChild(label);

                        var votes = document.createElement("div");
                        votes.id = "receivedVotes";
                        tw.appendChild(votes);

                    }

                },
                resultLayoutBody: function (cont) {
                    var elem = document.createElement("div");
                    elem.id = "resultLayoutBody";
                    elem.className = "row";
                    cont.appendChild(elem);

                    var qnLabel = document.createElement("div");
                    qnLabel.id = "qnLabelCont"
                    qnLabel.className = "row";
                    elem.appendChild(qnLabel);
                    if (roles.hasControls()) {
                        qnLabel.innerHTML = virtualclass.poll.dataToStd.question;
                    } else {
                        qnLabel.innerHTML = virtualclass.poll.dataRec.question;
                    }

                    var chartMenu = document.createElement("div");
                    chartMenu.id = "chartMenuCont";
                    chartMenu.className = "row";
                    elem.appendChild(chartMenu);
                    if (roles.hasControls()) {
                        this.chartMenu(chartMenu);
                        this.createResultMsgCont(cont);
                    }

                    this.createChartCont(elem);

                },
                createResultMsgCont: function (cont) {
                    var elem = document.createElement("div");
                    elem.id = "pollResultMsz";
                    elem.className = "pollResultMsz";
                    elem.innerHTML = "Waiting for student response....."
                    cont.appendChild(elem);

                },
                createChartCont: function (cont) {

                    var chart = document.createElement("div");
                    chart.id = "chart";
                    chart.className = "row";
                    cont.appendChild(chart);

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

                    var elem = document.createElement("div");
                    elem.id = "bar ";
                    elem.className = "col-sm-1";
                    cont.appendChild(elem);


                    var bar = document.createElement("a");
                    //bar.innerHTML = "bar graph ";
                    bar.href = "#"
                    bar.id = "barView";
                    // elem.className="glyphicon glyphicon-stats";
                    elem.appendChild(bar);

                    var baricon = document.createElement("span");
                    baricon.className = "icon-stats-bars";
                    bar.appendChild(baricon);


                    elem.addEventListener('click', virtualclass.poll.barGraph)


                    var elem = document.createElement("div");
                    elem.id = "pi";
                    elem.className = "col-sm-1";
                    cont.appendChild(elem);


                    var pi = document.createElement("a");
                    // pi.innerHTML = "pi chart ";
                    pi.href = "#"
                    pi.id = "piView";
                    // elem.className="glyphicon glyphicon-stats";
                    elem.appendChild(pi);
                    var piicon = document.createElement("span");
                    piicon.className = "icon-pie-chart";
                    pi.appendChild(piicon);


                    pi.addEventListener('click', virtualclass.poll.createPiChart);

                    var elem = document.createElement("div");
                    elem.id = "list view";
                    elem.className = "col-sm-1";
                    cont.appendChild(elem);

                    // a to replace with span
                    if (roles.hasControls()) {

                        var list = document.createElement("a");
                        //list.innerHTML = "list view ";
                        list.href = "#"
                        list.id = "listView"

                        var listicon = document.createElement("span");
                        listicon.className = "icon-list-ul";
                        list.appendChild(listicon);

                        elem.appendChild(list);
                        elem.addEventListener('click', virtualclass.poll.listView)
                    }

                },
                qnLabel: function (cont) {
                    var chart = document.createElement("div");
                    chart.id = "chart";
                    chart.className = "row";
                    cont.appendChild(chart);
                },
                resultLayoutFooter: function (cont) {
                    var elem = document.createElement("div");
                    elem.id = "resultLayoutFooter";
                    elem.className = "row";
                    cont.appendChild(elem);

                },
                createNav: function (pollCont) {
//               
                    var nav = document.createElement('nav');
                    nav.id = "navigator";
                    nav.className = "nav navbar";
                    pollCont.appendChild(nav);
//                    if (!roles.hasControls()) {
//                        nav.style.display = "none";
//                    }
                    var ul = document.createElement('ul');
                    ul.classList.add("nav", "nav-tabs", "pollNavBar");
                    nav.appendChild(ul);

                    if (roles.hasControls()) {
                        var li1 = document.createElement('li');
                        li1.setAttribute("role", "presentation");
                        li1.id = "coursePollTab";
                        li1.classList.add("navListTab", "active")
                        li1.setAttribute("data-toggle", "popover");
                        li1.setAttribute("data-trigger", "hover");
                        //li1.setAttribute("title","Polls you will create are course specific");
                        li1.setAttribute("data-content", "Polls you will create are course specific");

                        ul.appendChild(li1);

                        var a = document.createElement("a")
                        a.href = "#";
                        a.innerHTML = "Course Poll";
                        li1.appendChild(a);

                        var li = document.createElement('li');
                        a.addEventListener('click', function () {

                            li.classList.remove('active');
                            li1.classList.add('active');
                            virtualclass.poll.interfaceToFetchList(virtualclass.poll.cmid);
                        })
                        ul.appendChild(li);

                        li.setAttribute("role", "presentation");
                        li.id = "sitePollTab";
                        li.classList.add("navListTab");
                        li.setAttribute("data-toggle", "popover");
                        li.setAttribute("data-trigger", "hover");
                        // li.setAttribute("title","Polls created here are of site level");
                        li.setAttribute("data-content", "Polls created here are of site level");
                        var a = document.createElement("a")
                        a.href = "# ";
                        a.innerHTML = "Site Poll";
                        li.appendChild(a);
                        //virtualclass.poll.attachEvent('click','coursePollNav',virtualclass.poll.coursePollHandler);
                        a.addEventListener('click', function () {
                            var category = 0;
                            li1.classList.remove('active');
                            li.classList.add('active');
                            virtualclass.poll.interfaceToFetchList(category);
                        });


                    } else {

                        li = document.createElement('li');
                        li.setAttribute("role", "presentation");
                        li.id = "pollResult";
                        li.classList.add("navListTab");
                        li.setAttribute("data-toggle", "popover");
                        li.setAttribute("data-trigger", "hover");
                        //li.classList.remove('active');
                        // li.setAttribute("title","Polls created here are of site level");
                        li.setAttribute("data-content", "show result");
                        ul.appendChild(li);
                        var a = document.createElement("a")
                        a.href = "# ";
                        a.innerHTML = "Poll Result";
                        li.appendChild(a);
                        //virtualclass.poll.attachEvent('click','coursePollNav',virtualclass.poll.coursePollHandler);
                        a.addEventListener('click', function () {
//                        var category = 0;
//                        li1.classList.remove('active');
//                        li.classList.add('active');
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
                newPollBtn: function (pollType) {

                    var ct = document.getElementById("createPollCont")
                    var btn = document.createElement('button');
                    btn.id = "newPollBtn" + pollType;
                    btn.className = "btn btn-default";
                    btn.classList.add(pollType);
                    btn.innerHTML = "Create New";
                    btn.setAttribute("data-toogle", "modal");
                    btn.setAttribute("data-target", "#editPollModal")
                    ct.appendChild(btn);
                    virtualclass.poll.attachEvent(btn.id, "click", virtualclass.poll.newPollHandler, pollType)

                    var iconNew = document.createElement('i');
                    iconNew.className = "icon-create-new";
                    btn.appendChild(iconNew);

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
                    var addMore = document.getElementById("addMoreCont");
                    var cont = document.createElement("div");
                    cont.className = "inputWrapper clearfix";


                    optsCont.insertBefore(cont, addMore)

                    var option = document.createElement("textArea");

                    option.rows = "1";
                    option.id = "option" + y;
                    option.className = "opt form-control";
                    option.placeholder = "Type option";
                    option.style.width = "97%";
                    option.style.float = "left";
                    cont.appendChild(option)
                    if (newIndex > 1) {
                        var close = document.createElement("a");
                        close.id = "remove" + y;
                        close.className = "close";
                        close.innerHTML = "&times";
                        cont.appendChild(close);
                        // cont.appendChild(close);
                        close.addEventListener("click", function () {
                            virtualclass.poll.removeOption(type, qIndex, close.id);

                        })

                    }

                },
                qnCont: function (index, pollType) {
                    var list = document.getElementById("listQnCont" + pollType);
                    var elem = document.createElement("div");
                    elem.id = "contQn" + pollType + index;
                    elem.className = "row vcPollCont col-md-12";
                    if (list != null) {
                        list.insertBefore(elem, list.firstChild);
                    }
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
                generateModal: function (id, bsCont, pollType) {

                    var modal = document.createElement("div");

                    modal.id = id;
                    modal.className = "modal";
                    modal.role = "dialog";
                    modal.style.display = "none";
                    modal.setAttribute("tab-index", "-1");
                    modal.setAttribute("area-hidden", "true");
                    bsCont.appendChild(modal);

                    var dialog = document.createElement("div");
                    dialog.className = "modal-dialog";
                    modal.appendChild(dialog);

                    var content = document.createElement("div");
                    content.className = "modal-content";
                    content.id = "pollModalBody"
                    dialog.appendChild(content);

                    var head = document.createElement("div");
                    head.id = "contHead";
                    head.className = "modal-header";
                    content.appendChild(head);

                    var el = document.createElement('button');
                    el.type = "button";
                    el.className = "close";
                    el.id = "modalClose";
                    el.setAttribute("data-dismiss", "modal");
//                   el.addEventListener("click",function(){
//                       virtualclass.poll.test(pollType);
//                       
//                   })
                    //virtualclass.poll.attachEvent("modalClose", "click", virtualclass.poll.test,pollType);
                    el.innerHTML = "&times";
                    head.appendChild(el);

                    var body = document.createElement("div");
                    body.id = "contBody";
                    body.className = "modal-body";
                    content.appendChild(body);

                    var footer = document.createElement("div");
                    footer.id = "contFooter";
                    footer.className = "modal-footer";
                    content.appendChild(footer);
                },
                modalContentUI: function () {

                    var body = document.getElementById("contBody");
                    var qncont = document.createElement("div");
                    qncont.id = "qnTxCont";
                    qncont.classList.add("row", "previewTxCont")
                    body.appendChild(qncont);

                    var opscont = document.createElement("div");
                    opscont.id = "optsTxCont";
                    opscont.classList.add("row", "previewTxCont");
                    body.appendChild(opscont);

                },
                qnCtrCont: function (index, pollType, id, isPublished, isAdmin) {

                    var e = document.getElementById("contQn" + pollType + index);

                    var ctrCont = document.createElement("div");
                    ctrCont.id = "ctrQn" + pollType + index;
                    ctrCont.className = "col-md-2 pollCtrCont";
                    e.appendChild(ctrCont);

                    var cont = document.createElement("div");
                    cont.className = "pollCtrContainer";
                    ctrCont.appendChild(cont);

                    var editCont = document.createElement("div");
                    editCont.id = "contQn" + pollType + index + "E";
                    editCont.className = "editCont pull-left";
                    cont.appendChild(editCont);

                    var deleteCont = document.createElement("div");
                    deleteCont.id = "contQn" + pollType + index;
                    deleteCont.className = "deleteCont pull-left";
                    cont.appendChild(deleteCont);

                    if ((pollType == "course" && id == wbUser.id) || (pollType == "site" && isAdmin == "true")) {

                        if (!isPublished) {
                            var link1 = document.createElement("a");
                            //link1.innerHTML = "edit";
                            link1.href = "#";

                            link1.setAttribute("data-target", "#editPollModal")
                            link1.setAttribute("id", "editQn" + pollType + index);
//                           
                            editCont.appendChild(link1);

                            var sp = document.createElement("span");
                            sp.className = "icon-pencil2";
                            sp.setAttribute("data-toggle", "tooltip")
                            sp.setAttribute("title", "edit poll");
                            link1.appendChild(sp);

                        } else {
                            var link1 = document.createElement("span");
                            link1.className = "icon-pencil2";
                            link1.setAttribute("data-toggle", "tooltip")
                            link1.setAttribute("title", "cannt edit,poll attempted ");
                            editCont.appendChild(link1);

                        }
                        var link3 = document.createElement("a");
                        link3.href = "#";
                        link3.id = "deleteQn" + pollType + index;


                        //link3.innerHTML = "delete";
                        // link3.className= "icon-bin"
                        var sp = document.createElement("span");
                        sp.className = "icon-bin22";
                        sp.setAttribute("data-toggle", "tooltip")
                        sp.setAttribute("title", "delete poll");


                        link3.appendChild(sp);

                        deleteCont.appendChild(link3);


                    } else {

                        var link1 = document.createElement("span");
                        link1.className = "icon-pencil2";
                        link1.setAttribute("data-toggle", "tooltip")
                        link1.setAttribute("title", "cannt edit, can be edited by creator of the poll");
                        editCont.appendChild(link1);

                        var link3 = document.createElement("span");
                        link3.setAttribute("data-toggle", "tooltip")
                        link3.setAttribute("title", "cannt delete, can be deleted  by creator of the poll");
                        link3.className = "icon-bin22"
                        deleteCont.appendChild(link3);

                    }
                    var e = document.createElement("div");
                    e.className = "publishCont pull-left";
                    e.id = "contQn" + pollType + index + "P";
                    cont.appendChild(e);

                    var link2 = document.createElement("a");
                    link2.href = "#";
                    link2.id = "publishQn" + pollType + index;

                    e.appendChild(link2);

                    var sp = document.createElement("span");
                    sp.className = "icon-publish2";
                    sp.setAttribute("data-toggle", "tooltip")
                    sp.setAttribute("title", "publish poll");

                    link2.appendChild(sp);
                },
                qnTextCont: function (item, index, pollType, creator) {

                    var option = "";
                    for (var i in item.options) {
                        option = option + item.options[i] + " ";
                    }

                    var e = document.getElementById("contQn" + pollType + index);
                    var qnCont = document.createElement("div");

                    qnCont.id = "qnText" + pollType + index;
                    qnCont.classList.add("qnText", "col-md-8")
                    qnCont.innerHTML = item.questiontext;
                    e.appendChild(qnCont);

                    qnCont.setAttribute("data-toggle", "popover");
                    qnCont.setAttribute("data-trigger", "hover");

                    var preview = document.createElement('div');
                    preview.id = "popover" + pollType + index;
                    preview.classList.add("pollPreview");
                    virtualclass.poll.UI.pollPreviewCont(preview, item);


                    $(function () {
                        $('[data-toggle="popover"]').popover({content: preview, html: true, delay: {show: 1000}})
                    })



                    var elem = document.createElement("div");
                    elem.classList.add("creator", "col-md-2")

                    elem.innerHTML = creator;
                    e.appendChild(elem);



                },
                pollPreviewCont: function (cont, item) {

                    var popUpcont = document.createElement("div");
                    cont.id = "popupCont";
                    cont.appendChild(popUpcont);

                    var qncont = document.createElement("div");
                    qncont.id = "qnTxCont";
                    qncont.classList.add("row", "previewTxCont")
                    popUpcont.appendChild(qncont);


                    var l = document.createElement("label");
                    l.innerHTML = "Question";
                    qncont.appendChild(l);
                    virtualclass.poll.showPreviewQn(qncont, item);

                    var opscont = document.createElement("div");
                    opscont.id = "optsTxCont";
                    opscont.classList.add("row", "previewTxCont");
                    popUpcont.appendChild(opscont);

                    var label = document.createElement("label");
                    label.innerHTML = "Options";
                    opscont.appendChild(label);
                    virtualclass.poll.showPreviewOption(opscont, item);


                },
                editPoll: function (pollType, index) {

//                    var text = document.getElementById(("modalHeaderTx"));
//                    if (text == null) {
//                        var head = document.getElementById(("contHead"));
//                        var el = document.createElement('');
//                        el.href = "#";
//                        el.type = "button";
//                        el.id = "reset";
//                        el.className = "controls";
//                        el.innerHTML = "reset";
//                        head.appendChild(el);
//                    }
                    var header = document.getElementById("contHead");
                    var text = document.createElement('div');
                    text.id = "editTx";
                    text.classList.add("row", "modalHeaderTx");
                    //text.className = "row";
                    text.innerHTML = "Poll Edit";
                    header.appendChild(text);


                    virtualclass.poll.UI.loadContent(pollType, index);
                },
                //to change this  temp**
                loadContent: function (pollType, index) {

                    var opts = [];
                    var el = document.getElementById('qnTxCont');
                    el.style.display = "block";
                    virtualclass.poll.UI.editQn(pollType, index);
                    if (pollType == 'course') {
                        poll = virtualclass.poll.coursePoll[index];
                    } else {
                        poll = virtualclass.poll.sitePoll[index];
                    }
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
                    var optsCont = document.getElementById("optsTxCont");

                    var addMoreCont = document.createElement("div");
                    addMoreCont.id = "addMoreCont";
                    addMoreCont.className = "addMoreCont";
                    optsCont.appendChild(addMoreCont);

                    var addIcon = document.createElement("span");
                    addIcon.className = "icon-plus";
                    addMoreCont.appendChild(addIcon);

                    var addMore = document.getElementById("AddMoreOption");
                    if (!addMore) {
                        var anc = document.createElement("a");
                        anc.href = "#";
                        anc.id = "addMoreOption";
                        anc.innerHTML = "Add Option"
                        anc.classList.add("addMoreOption", "controls");
                        addMoreCont.appendChild(anc);
                    }

                    virtualclass.poll.UI.footerBtns(pollType, index);

                },
                previewFooterBtns: function (footerCont, pollType, index) {

                    var cont = document.getElementById("footerCtrCont");
                    if (!cont) {
                        var ctrCont = document.createElement("div");
                        ctrCont.id = "footerCtrCont"

                        footerCont.appendChild(ctrCont);

                        var btn = document.createElement('button');
                        btn.id = "goBack";

                        btn.setAttribute("data-dismiss", "modal");
                        btn.innerHTML = "< Back";
                        btn.classList.add("btn", "btn-default", "controls");
                        ctrCont.appendChild(btn);

                        var iconBack = document.createElement('i');
                        iconBack.className = "icon-back";
                        btn.appendChild(iconBack);

                        var btn = document.createElement('button');
                        btn.id = "next";
                        btn.classList.add("btn", "btn-default", "controls")
                        btn.innerHTML = "Go to Publish";
                        ctrCont.appendChild(btn)
                        virtualclass.poll.pollPopUp(virtualclass.poll.popupFn, index, pollType);

                        var iconPublish = document.createElement('i');
                        iconPublish.className = "icon-publish";
                        btn.appendChild(iconPublish);
                    }
                },
                footerBtns: function (pollType, index) {

                    var footerCont = document.getElementById("contFooter");
                    var ctrCont = document.createElement("div");
                    ctrCont.id = "footerCtrCont";
                    footerCont.appendChild(ctrCont);

                    var cont = document.getElementById("etSave");
                    if (cont == null) {
//                        var anc = document.createElement("a");
//                        anc.href = "#";
//                        anc.id = "addMoreOption";
//                        anc.innerHTML = "AddMoreOption"
//                        anc.classList.add("addMoreOption", "controls");
//                        ctrCont.appendChild(anc);
                        var btn = document.createElement("button");

                        btn.id = "reset";
                        btn.classList.add("btn", "btn-default", "pull-left", "controls");
                        btn.type = "button";
                        btn.innerHTML = "Reset";
                        ctrCont.appendChild(btn);

                        var iconReset = document.createElement('i');
                        iconReset.className = "icon-reset";
                        btn.appendChild(iconReset);


                        var btn = document.createElement('button');
                        btn.id = "etSave";
                        btn.innerHTML = "Save";
                        btn.classList.add("btn", "btn-default", "controls");
                        ctrCont.appendChild(btn);

                        var iconSave = document.createElement('i');
                        iconSave.className = "icon-save";
                        btn.appendChild(iconSave);


                        var btn = document.createElement('button');
                        btn.id = "saveNdPublish";
                        btn.classList.add("btn", "btn-default", "controls");
                        btn.innerHTML = "Save and Publish";
                        ctrCont.appendChild(btn)

                        var savePublish = document.createElement('i');
                        savePublish.className = "icon-publish";
                        btn.appendChild(savePublish);


                        if (pollType) {
                            virtualclass.poll.pollPopUp(virtualclass.poll.popupFn, index, pollType);
                        }
                    }
                },
                editQn: function (pollType, index) {
                    var el = document.getElementById('qnTxCont')
                    var qn = document.getElementById('q')
                    // el.style.display="block";
                    if (qn == null) {
                        var label = document.createElement('label');
                        label.innerHTML = "Question :";
                        label.className = "pollLabel";
                        el.appendChild(label);

                        var qncont = document.createElement("div")
                        qncont.className = "inputWrapper clearfix";
                        el.appendChild(qncont);

                        var qnText = document.createElement('textArea');
                        qnText.id = "q";
                        qnText.className = "qn form-control";
                        qnText.rows = "1";
                        qnText.value = document.getElementById("qnText" + pollType + index).innerHTML;
                        qncont.appendChild(qnText);
                    }
                    var elem = document.getElementById('q')

                    if (elem != null && !elem.value) {
                        if (pollType = 'course') {
                            elem.value = virtualclass.poll.coursePoll[index].questiontext;
                        } else {
                            elem.value = virtualclass.poll.sitePoll[index].questiontext;
                        }
                    }

                },
                editOptions: function (pollType, qIndex, prop, optsCount) {
                    var el = document.getElementById('optsTxCont')
                    el.style.display = "block";

                    var opt = document.getElementById("opt" + qIndex + prop);
                    if (opt == null) {
                        var l = document.getElementById("pollOptLabel");
                        if (l == null) {
                            var label = document.createElement('label');
                            label.innerHTML = "Options :";
                            label.id = "pollOptLabel";
                            label.className = "pollLabel";

                            el.appendChild(label);
                        }
                        var cont = document.createElement("div");
                        cont.className = "inputWrapper clearfix";
                        el.appendChild(cont);

                        var option = document.createElement("textArea");

                        option.rows = "1";
                        option.id = "option" + prop;
                        option.className = "opt form-control";

                        option.style.width = "97%";
                        option.style.float = "left";
                        cont.appendChild(option)
                        if (optsCount > 2) {
                            var close = document.createElement("a");
                            close.id = "remove" + prop;
                            close.className = "close";
                            close.innerHTML = "&times";

                            cont.appendChild(close);
                            close.addEventListener("click", function () {
                                virtualclass.poll.removeOption(pollType, qIndex, close.id);

                            })


                        }

//                        virtualclass.poll.attachEvent(close.id, "click", virtualclass.poll.removeOption, pollType, qIndex);


                        if (pollType == "course") {
                            var courseOpts = virtualclass.poll.coursePoll[qIndex].options[prop];
                            option.value = (typeof courseOpts == 'object') ? courseOpts.options : courseOpts;
                        } else {
                            var siteOpts = virtualclass.poll.sitePoll[qIndex].options[prop];
                            option.value = (typeof siteOpts == 'object') ? siteOpts.options : siteOpts;
                        }

                    }
                },
                pollSettingUI: function (index, label) {
                    this.settingUIHeader(index, label)
                    this.settingUIBody(index, label);
                    this.settingUIFooter(index, label)

                },
                settingUIHeader: function (index, label) {
                    var header = document.getElementById("contHead");
                    var editTx = document.getElementById("editTx");
                    if (editTx) {
                        editTx.parentNode.removeChild(editTx);
                    }
                    var publishTx = document.getElementById("publishTx");
                    if (publishTx) {
                        publishTx.parentNode.removeChild(publishTx);
                    }

                    var text = document.createElement('div');
                    text.id = "settingTx";
                    text.classList.add("row", "modalHeaderTx");
                    // text.className = "row";
                    text.innerHTML = "Poll Setting";
                    header.appendChild(text);

                },
                settingUIBody: function (index, label) {

                    var body = document.getElementById("contBody");
                    for (var i = 0; i < body.childNodes.length; i++) {
                        body.childNodes[i].parentNode.removeChild(body.childNodes[i]);
                    }

                    var elem = document.createElement('div');
                    elem.id = "settingCont";
                    elem.className = "row";
                    body.appendChild(elem);

                    this.modeSetting(elem);
                    this.enTimer(elem);
                    this.ckShowRt(elem)
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
                settingUIFooter: function (index, label) {
                    var footer = document.getElementById("contFooter");
                    var settingBtn = document.createElement('div');
                    settingBtn.id = "settingBtn";
                    footer.appendChild(settingBtn);

                    var cancel = document.createElement('button');
                    cancel.id = "cacelSetting";
                    cancel.className = "btn btn-default";
                    cancel.setAttribute("data-dismiss", "modal");
                    cancel.innerHTML = "cancel";
                    settingBtn.appendChild(cancel);

                    var iconCancel = document.createElement('i');
                    iconCancel.className = "icon-publish-cancel";
                    cancel.appendChild(iconCancel);

                    var publish = document.createElement('button');
                    publish.id = "publish";
                    publish.className = "btn btn-default";
                    // save.setAttribute("data-dismiss", "modal");
                    publish.innerHTML = "Publish";

                    var iconPublish = document.createElement('i');
                    iconPublish.className = "icon-publish";
                    publish.appendChild(iconPublish);
                    settingBtn.appendChild(publish);

                },
                modeSetting: function (cont) {
                    var modeLabel = document.createElement('div');
                    modeLabel.innerHTML = "Mode of closing Poll :";
                    modeLabel.className = "pollLabel"
                    cont.appendChild(modeLabel);

                    var mode = document.createElement('div');
                    mode.id = "mode";
                    mode.className = "custom-controls-stacked";
                    cont.appendChild(mode);

                    var label = document.createElement('label');
                    label.className = "custom-control custom-radio";
                    mode.appendChild(label);

                    var el = document.createElement('input');
                    el.type = "radio";
                    el.name = "option"
                    el.value = "BY Instructor";
                    el.id = "radioBtn1";
                    el.className = "custom-control-input";
                    label.appendChild(el);

                    var span = document.createElement("span");
                    span.className = "custom-control-indicator";
                    label.appendChild(span)

                    var span = document.createElement("span");
                    span.className = "custom-control-description";
                    span.innerHTML = "By Instructor";
                    label.appendChild(span);

                    var labelTimer = document.createElement('label');
                    labelTimer.className = "custom-control custom-radio";
                    mode.appendChild(labelTimer);
                    var el = document.createElement('input');
                    el.type = "radio";
                    el.name = "option"
                    el.value = "BY Timer";
                    el.id = "radioBtn2";
                    el.checked = "checked";
                    el.className = "custom-control-input";
                    labelTimer.appendChild(el);

                    var span = document.createElement("span");
                    span.className = "custom-control-indicator";
                    labelTimer.appendChild(span)

                    var span = document.createElement("span");
                    span.className = "custom-control-description";
                    span.innerHTML = "By Timer";
                    labelTimer.appendChild(span);
                },
                enTimer: function (setting) {
                    var enTimer = document.createElement('div');
                    enTimer.id = "enTimer";
                    setting.appendChild(enTimer);

                    var timerTx = document.createElement('div');
                    timerTx.id = "timerTx";
                    timerTx.innerHTML = "Set Timer"
                    timerTx.className = "pollLabel"
                    enTimer.appendChild(timerTx);

                    var sel = document.createElement('div');
                    sel.id = "selTime";
                    enTimer.appendChild(sel);

                    var time = document.createElement('select');
                    time.type = "select";
                    time.id = "timer";
                    time.name = "timer"
                    time.className = "form-control";
                    time.style.width = "100px";
                    time.style.display = "inline";
                    sel.appendChild(time);
                    selectOne();

                    function selectOne() {
                        var select = document.getElementById('timer');
                        for (var i = 0; i < 60; i++) {

                            select.options[select.options.length] = new Option(i + 1, i + 1);
                        }
                    }

                    var unit = document.createElement('select');
                    unit.type = "select";
                    unit.id = "ut";
                    unit.name = "unit";
                    unit.className = "form-control";
                    unit.style.width = "100px";
                    unit.style.display = "inline";
                    sel.appendChild(unit);

                    var op = document.createElement('option');
                    op.id = "op1";
                    op.name = "unit";
                    op.value = "minut";
                    op.innerHTML = "minut";
                    unit.appendChild(op);

                    var op = document.createElement('option');
                    op.id = "op2";
                    op.name = "unit";
                    op.value = "second";
                    op.innerHTML = "second";
                    unit.appendChild(op);

                },
                ckShowRt: function (setting) {
                    var showRt = document.createElement('div');
                    showRt.id = "showRt";
                    showRt.className = "form-group";
                    setting.appendChild(showRt);

                    var label = document.createElement('label');
                    label.id = "labelCk";
                    label.className = "custom-control custom-checkbox ";
                    showRt.appendChild(label);

                    var ckbox = document.createElement('input');
                    ckbox.type = "checkbox";
                    ckbox.id = "pollCkbox";
                    ckbox.className = "custom-control-input ";
                    ckbox.checked = "checked";
                    label.appendChild(ckbox);

                    var span = document.createElement('span');
                    span.id = "labelCk";
                    span.classList.add("custom-control-description", "pollLabel")
                    // span.className = "custom-control-description";
                    span.innerHTML = "show result to students";
                    label.appendChild(span);

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

                    this.stdPublishLayout();
                    var msz = document.getElementById("stdPollMszLayout");
                    if (msz) {
                        msz.parentNode.removeChild(msz);
                    }


                },
                stdPollDisplay: function () {

                    this.stdPollHeader();
                    this.stdPollContent();
                    this.stdPollFooter();

                },
                stdPollHeader: function () {
                    var head = document.getElementById("stdContHead");
                    var label = document.createElement('label');
                    label.innerHTML = "Remaining Time";
                    label.id = "timerLabel";
                    head.appendChild(label);

                },
                stdPollContent: function () {
                    var body = document.getElementById("stdContBody");
                    var elem = document.createElement("div");
                    elem.id = "stdQnCont";
                    elem.className = "row";
                    body.appendChild(elem);

                    var elem = document.createElement("div");
                    elem.id = "stdOptionCont";
                    elem.className = "row";
                    body.appendChild(elem);
                    // elem.innerHTML="option container";
                },
                stdPollFooter: function () {
                    var footer = document.getElementById("stdContFooter");
                    var btn = document.createElement("input");
                    btn.id = "btnVote";
                    btn.className = "btn btn-primary";
                    btn.value = "VOTE"
                    footer.appendChild(btn);

                },
                stdPublishLayout: function () {

                    var cont = document.getElementById("layoutPollBody");
                    var elem = document.getElementById("stdPollContainer");
                    if (elem) {
                        elem.parentNode.removeChild(elem);
                    }
                    var elem = document.createElement('div');
                    elem.id = "stdPollContainer";
                    elem.className = "container";
                    cont.appendChild(elem);
                    this.stdLayoutTemp(elem);

                },
                stdLayoutTemp: function (cont) {
                    var elem = document.createElement('div');
                    elem.id = "stdContHead";
                    elem.className = "row";
                    cont.appendChild(elem);

                    var elem = document.createElement('div');
                    elem.id = "stdContBody";
                    elem.className = "row";
                    cont.appendChild(elem);

                    var elem = document.createElement('div');
                    elem.id = "stdContFooter";
                    elem.className = "row";
                    cont.appendChild(elem);
                    this.stdPollDisplay();

                },
                disableClose: function () {
                    var close = document.getElementById("pollClose");
                    close.style.display = "none";

                }

            }
        }

    };
    window.poll = poll;

})(window);