/* global virtualclass, ioAdapter */
(function (window) {
    var quiz = function () {

        return {
            /* to generlize */
            coursequiz: [],
            uid: virtualclass.gObj.uid,
            qzid: 0,
            newUserTime: {},
            list: [],
            listQuiz: {},
            uniqueUsers: [],
            usersFinishedQz: [],
            quizJSON : {},
            attemptedUsers : {},
            cmid : 2, //TODO : courseid of moodle
            exportfilepath: window.exportfilepath,
            quizSt: {}, //used for storage
            quizAttempted: {}, //used for storage
            qGrade: [], //used for storage
            init: function () {

                virtualclass.previrtualclass = 'virtualclass' + "Quiz";
                virtualclass.previous = 'virtualclass' + "Quiz";
                var urlquery = virtualclass.vutil.getUrlVars(exportfilepath);
                this.cmid = urlquery.cmid;

                if (!roles.hasAdmin() || (roles.isEducator())) {
                    if (roles.isStudent()) {
                        this.UI.defaultLayoutForStudent();

                    } else {
                        this.UI.container();

                        if (roles.hasControls()) {

                            ioAdapter.mustSend({
                                'quiz': {
                                    quizMsg: 'init'
                                },
                                'cf': 'quiz'
                            });
                        } else {
                            this.UI.defaultLayoutForStudent();

                        }
                    }
                } else {
                    this.UI.container();
                    ioAdapter.mustSend({
                        'quiz': {
                            quizMsg: 'init'
                        },
                        'cf': 'quiz'
                    });
                }
                if (roles.hasControls()) {
                    console.log("fetchquizes");
                    this.interfaceToFetchList(this.cmid);
                }

                var storedData = JSON.parse(localStorage.getItem('quizSt'));
                if (storedData) {
                    this.storedDataHandle(storedData);
                    virtualclass.quiz.quizSt = storedData;
                }
            },

            /**
             * Called on page refersh
             * fetch data from index db
             * and populate all data
             * @param {string}  display screen
             * @return
             */
            storedDataHandle: function (storedData) {
                //display quiz on student screen
                if (storedData.screen == "stdPublish") {
                    var that = this;

                    virtualclass.storage.getQuizData(
                        function (data) {
                            if(data.hasOwnProperty('qData')){
                                var dataRc = JSON.parse(data['qData']);
                                that.quizDisplay(dataRc);
                            }else {
                                console.log('Quiz data is not available');
                            }
                        }
                    );
                } else if(storedData.screen == "quizsubmitted") {
                    // If quiz has been submitted by student
                    // display quiz result page at student site

                    var rData = JSON.parse(localStorage.getItem('qRep'));
                    this.UI.displayStudentResultScreen(rData);

                } else if(storedData.screen == "tchResultView") {
                    //display teacher screen after quiz publish
                    var that = this;
                    virtualclass.storage.getQuizData(
                        function (data) {
                            if (typeof data !== 'undefined' && data.hasOwnProperty('qData') &&
                                data.hasOwnProperty('qDetail')) {

                                var quizDetial = JSON.parse(data['qDetail']);
                                /* On page refesh, we don't have to reset the time limit,
                                 * if we do this, the quiz without timer would be closed on page refresh
                                 * */
                                //if (storedData.hasOwnProperty('qtime')) {
                                // quizDetial.timelimit = that.convertTimeToSec(storedData.qtime);
                                //}
                                that.quizJSON = data['qData'];
                                that.openQuizPopup(that.quizJSON, quizDetial.id);
                                that.UI.resultView(quizDetial);
                                that.tabContent();
                                if (data.hasOwnProperty('qAttempt')) {
                                    that.quizAttempted = JSON.parse(data['qAttempt']);
                                    that.displayAttemptOverview();
                                }
                                if (data.hasOwnProperty('qGrade')) {
                                    that.qGrade = JSON.parse(data['qGrade']);
                                    that.displayGradeReport();
                                }
                                if(storedData.qClosed == "true"){
                                    document.getElementById('closeQzBt').disabled = true;
                                }
                            }
                        }
                    );
                    virtualclass.quiz.quizSt.screen = storedData.screen;
                }
            },

            /*
             Check if quiz exit, call function to display list of quizes
             */
            displayQuizList: function () {
                var isQuiz=false
                virtualclass.quiz.dispList("course");
                var listcont = document.getElementById("listquizcourse");
                if (Object.keys(this.coursequiz).length > 0) {
                    for ( var k in this.coursequiz) {
                        if (this.coursequiz.hasOwnProperty(k)) {
                            if(! +this.coursequiz[k].quizstatus){
                                isQuiz=true
                                this.displayQuizes (this.coursequiz[k], k);

                            }
                        }
                    }
                    this.UI.listHeader();
                    if(isQuiz){
                        var header = document.querySelector("#virtualclassCont.congrea #layoutQuiz #headerContainer")
                        if(!header.classList.contains("show")){
                            header.classList.add("show")
                        }
                    }else{
                        var mszBoxQuiz =document.querySelector("#virtualclassCont.congrea #layoutQuiz #mszBoxQuiz");
                        if(mszBoxQuiz){
                            mszBoxQuiz.classList.add("show");
                            mszBoxQuiz.innerHTML= virtualclass.lang.getString("noQuiz");
                        }
                    }

                } else {
                    var mszBoxQuiz =document.querySelector("#virtualclassCont.congrea #layoutQuiz #mszBoxQuiz");
                    if(mszBoxQuiz){
                        mszBoxQuiz.classList.add("show");
                        mszBoxQuiz.innerHTML= virtualclass.lang.getString("noQuiz");
                    }
                }
            },

            dispList: function () {

                var mszbox = document.getElementById("mszBoxQuiz");

                var listCont = document.getElementById("listQzCont");
                if (listCont) {
                    listCont.style.display = "block";
                } else {
                    console.log('quiz layout 2');
                    this.UI.layout2("layoutQuizBody");
                }
            },

            /**
             * Fetch all quiz detial from database as json
             * send fetched data displayQuizList fun
             * to display list of quizes
             * @param {string}  display screen
             * @return
             */
            interfaceToFetchList: function (category) {
                var formData = new FormData();
                formData.append("cmid", this.cmid);
                formData.append("user", this.uid);
                var scope = this;
                virtualclass.xhr.send(formData, window.webapi+"&methodname=congrea_quiz", function (data) {

                    var getContent = JSON.parse(data);
                    if(getContent['status'] == 0) {
                        var cont = document.getElementById("bootstrapQzCont");
                        cont.innerHTML = virtualclass.lang.getString("noQuiz");
                    } else {
                        for (var i = 0; i <= getContent.length - 1; i++) {
                            var options = getContent[i].options;
                            for (var j in options) {
                                getContent[i].options[j] = options[j].options;
                                //console.log("getContent " + getContent[i]);
                            }
                        }
                        //console.log(getContent);
                        scope.coursequiz = getContent;
                        scope.displayQuizList();
                    }
                });
            },
            /*
             Display quiz list with detail
             */
            displayQuizes: function (item, index) {
                //console.log(item);
                this.UI.qzCont(index);
                this.UI.qzCtrCont(index);
                this.UI.qzTextCont(item, index);
                this.attachQZEvent("publishQz" + index, "click", this.publishHandler, item, index);
            },

            attachQZEvent: function (actionid, eventName, handler, item, index) {

                var elem = document.getElementById(actionid);
                if (elem != null) {
                    elem.addEventListener(eventName, function () {
                        if (typeof item != 'undefined') {
                            console.log('attach time handler');
                            handler(item, index);
                            //handler(item, index, actionid, item.id);
                        } else {
                            console.log('quiz is missing no need of time');
                            //handler(index, actionid);
                        }
                    })
                }
            },

            /*
             Attach publis & preview button with quiz list
             */
            publishHandler: function (item, index) {

                var mszbox = document.getElementById("mszBoxQuiz");
                if (mszbox.childNodes.length > 0) {
                    mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
                }
                virtualclass.quiz.publishQuiz(item, index);
            },

            /*
             Display preview pop up box for quiz display
             and call preview function for teacher screen
             */
            publishQuiz: function (item, index) {
                this.openQuizPopup(item, index);
                this.quizPreview(item);
                var quizModal = document.querySelector('#editQuizModal');
                quizModal.className='modal in';
                quizModal.style.display="block";
            
            },

            /**
             * Open model popup box for quiz
             * @param {string} quiz data in json formate
             * @param {int}  quiz id
             * @return
             */
            openQuizPopup: function (item, index) {

                this.qzid = index; //store quiz id
                var cont = document.getElementById("layoutQuizBody");
                var elem = document.createElement('div');
                elem.className = "container";
                cont.appendChild(elem);
                var modal = document.getElementById("editQuizModal");
                if (modal) {
                    modal.remove();
                }
                // to change this to
                var cont = document.getElementById("bootstrapQzCont");
                virtualclass.quiz.UI.generateModal("editQuizModal", cont);
             

//                $('#editQuizModal').modal({
//                    backdrop: 'static',
//                    keyboard: false
//                });
//                $('#editQuizModal').modal({
//                    show: true
//                });

                //virtualclass.quiz.quizPreview(item);
            },
            showQn: function (qnCont) {
                if (roles.hasControls()) {
                    qnCont.innerHTML = 'quiz question';
                } else {
                    qnCont.innerHTML = 'quiz question for student';
                }
            },
            action: function (id, cb, index) {
                cb(id, index)
            },

            /**
             * Get data of a single quiz in json
             * Send json data with other quiz detail
             * to slickQuiz for quiz display
             * @param {object}  quiz detial
             * @return
             */
            getQuizData: function(quizitem) {

                var quizDetail = this.coursequiz[quizitem.id];
                var formData = new FormData();
                formData.append("cmid", this.cmid);
                formData.append("user", this.uid);
                formData.append("qid", quizitem.id);
                scope = this;
                virtualclass.xhr.send(formData, window.webapi+"&methodname=congrea_get_quizdata", function (data) {
                    if(scope.isJson(data)) {
                        scope.quizJSON = data;
                        $('#slickQuiz').slickQuiz({
                            json: scope.quizJSON,
                            questionPerPage : quizDetail.questionsperpage,
                            questionMode : quizDetail.preferredbehaviour,
                            quizTime : quizDetail.timelimit,
                            displayDetailResult : false
                        });
                    } else {
                        var pbBt = document.getElementById("publishQzBt");
                        pbBt.parentNode.removeChild(pbBt);
                        var msgCont = document.getElementById('contQzBody');
                        msgCont.innerHTML = data;
                    }
                });
            },

            quizPopUp: function (cb, index) {
                console.log('quiz pop up');
                var attachInit = function () {
                    console.log(this.id);
                    virtualclass.quiz.action(this.id, cb, index);
                }
                var modal = document.getElementById("editQuizModal") ? document.getElementById("editQuizModal") : document.getElementById("qzPopup");
                var controls = modal.querySelectorAll(':scope .controls');

                for (var i = 0; i < controls.length; i++) {
                    controls[i].addEventListener("click", attachInit)
                }
            },

            quizPreview: function (quizitem) {
                console.log('quiz preview function');
                this.UI.modalContentUI();

                var header = document.getElementById("contQzHead");
                var heading = document.createElement('div');
                heading.id = "QstnName";
                heading.innerHTML = quizitem.name;
                header.appendChild(heading);

                var publishBttn = document.getElementById("contQzBody");
                var btn = document.createElement('button');
                btn.id = "publishQzBt";
                btn.classList.add("btn", "btn-default", "controls")
                btn.innerHTML = virtualclass.lang.getString('PQuiz');

                publishBttn.appendChild(btn);

                var iconPublish = document.createElement('i');
                iconPublish.className = "icon-publish";
                btn.appendChild(iconPublish);


                this.getQuizData(quizitem);
                this.quizPopUp(this.popupFn, 1);
            },

            popupFn: function (id, index) {
                virtualclass.quiz[id].call(this.quiz, index);
            },

            /*
             Function is called when teacher pulished quiz
             call by popupFn function and display quiz result
             */
            publishQzBt: function() {
                var vthis = virtualclass.quiz;
                var qzJson = vthis.quizJSON;
                var quizobj = JSON.parse(qzJson);
                var noOfQus = quizobj.questions.length;
                vthis.coursequiz[vthis.qzid].noOfQus = noOfQus;
                var quizDetail = vthis.coursequiz[vthis.qzid];

                var data = {json: qzJson,
                    questionPerPage : quizDetail.questionsperpage,
                    questionMode : quizDetail.preferredbehaviour,
                    quizTime : quizDetail.timelimit,
                    displayDetailResult : false,
                    ptm : new Date().getTime() // published time
                };


                //send data to student
                ioAdapter.mustSend({
                    'quiz': {
                        quizMsg: 'stdPublish',
                        quizId: vthis.qzid,
                        data: data,

                    },
                    'cf': 'quiz'
                });
                // display result interface to teacher
                vthis.UI.resultView(quizDetail);
                vthis.tabContent();
                vthis.quizSt.screen ='tchResultView';
                virtualclass.storage.quizStorage('qDetail', JSON.stringify(quizDetail));
                virtualclass.storage.quizStorage('qData', qzJson);

                //save data in LMS DB
                var formData = new FormData();
                formData.append("cmid", vthis.cmid);
                formData.append("qzid", vthis.qzid);
                formData.append("user", vthis.uid);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=congrea_add_quiz", function (data) {
                    if(data !== 'ture') {
                        console.log('Quiz data not saved in congrea');
                    }
                });
            },

            /**
             * Called on click of close quiz button
             * At student side quiz will be closed and display result
             * While teacher will be able to see report
             * @param {null}
             * @return
             */
            closeQzBt: function() {
                console.log('-------CLOSE QUIZ--------');
                var qzid = virtualclass.quiz.qzid;
                var data = { qzid: qzid };
                ioAdapter.mustSend({
                    'quiz': {
                        quizMsg: 'stdShowResult',
                        data: data
                    },
                    'cf': 'quiz'
                });
                //stop timer
                if(typeof CDTimer != 'undefined'){
                    clearInterval(CDTimer);
                    console.log('Clear quiz interval');
                }

                document.getElementById("closeQzBt").disabled = true;
                var msginfo = document.createElement('div');
                msginfo.className="alert alert-info";
                msginfo.innerHTML = virtualclass.lang.getString('QClosed');
                resultQzLayout.insertBefore(msginfo,resultQzLayout.firstChild);
                // Reset the attempted quiz counter after closig the quiz

            },

            /**
             * Display quiz stucture with data
             * through slickQuiz.js file
             * @param {json} quiz json object
             * @return null
             */
            quizDisplay: function(quiz){
                //console.log("student side " + quiz.quizMsg);
                var msz = document.getElementById("mszBoxQuiz");
                if (msz) {
                    msz.parentNode.removeChild(msz);
                }
                var cQzbody = document.getElementById("contQzBody");
                if (cQzbody) {
                    cQzbody.parentNode.removeChild(cQzbody);
                }
                var cont = document.getElementById("bootstrapQzCont");//Todo:
                var body = virtualclass.view.customCreateElement('div','contQzBody','modal-body');
                cont.appendChild(body);
                this.UI.modalContentUI();
                $('#slickQuiz').slickQuiz(quiz);
            },

            /**
             * Called on page referesh by utility.js
             * Save data to local storage
             * @param {null}
             * @return
             */
            saveInLocalStorage: function() {
                var vthis = virtualclass.quiz;
                // student timer
                if(document.querySelector("#qztime") != null) {
                    vthis.quizSt.qtime = document.querySelector("#qztime").textContent;
                    console.log('quiz='+ vthis.quizSt.qtime);
                }
                // teacher timer
                if(document.querySelector("#elsTime") != null) {
                    vthis.quizSt.qtime = document.querySelector("#elsTime").textContent;
                    console.log('quiz='+ vthis.quizSt.qtime);
                }
                console.log('quiz='+ vthis.quizSt.screen);
                if ((document.getElementById('closeQzBt')!= null) &&
                    document.getElementById('closeQzBt').disabled == true) {
                    vthis.quizSt.qClosed = 'true';
                }
                if(vthis.quizSt) {
                    localStorage.setItem('quizSt', JSON.stringify(vthis.quizSt));
                }
                if(vthis.quizAttempted) {
                    console.log('attempt data ='+ vthis.quizAttempted);
                    virtualclass.storage.quizStorage("qAttempt", JSON.stringify(vthis.quizAttempted));
                }

            },

            /**
             * Event received on onmessage
             * @param {object}  data object
             * @param {object}  sender detail
             * @return
             */
            onmessage: function (msg, fromUser) {
                //localStorage.removeItem('quizSt');
                var vthis = virtualclass.quiz;

                if (msg.quiz.quizMsg == "stdPublish") {
                    vthis.dataRec = msg.quiz.data;
                    virtualclass.storage.quizStorage("qData", JSON.stringify(vthis.dataRec));
                    vthis.quizSt.screen ='stdPublish';
                    this.quizDisplay(msg.quiz.data);
                }

                // When teacher close the quiz, this event will be triggered
                // At student end quiz will be submitted automatically
                // and result will display to student screen
                if((msg.quiz.quizMsg == "stdShowResult") || (msg.quiz.quizMsg == "quizTimeEnd")) {

                    if (document.querySelector('#timeText') != null) {
                        document.querySelector('#timeText').textContent = "Quiz has been closed";
                    }
                    var resPage = document.querySelector("#slickQuiz .quizResults");
                    if(resPage && resPage.style.display != 'block') {
                        // click submit button of student screen
                        var arr = document.querySelectorAll('#slickQuiz .nextQuestion');
                        var arrlength = arr.length-1;
                        arr[arrlength].click();
                    }
                }
                // Quiz cose at student end
                if(msg.quiz.quizMsg == "quizClosed") {
                    localStorage.removeItem('quizSt');
                    this.quizSt = {}
                    localStorage.removeItem('qRep');
                    virtualclass.storage.clearTableData("quizData");
                    this.UI.defaultLayoutForStudent();
                }

                //teacher result progress view
                // Event will be triggerd on each answer select by student
                if (msg.quiz.quizMsg == "quizAttempt" && roles.hasControls()) {

                    if(typeof this.attemptedUsers[msg.quiz.questionId] == 'undefined'){
                        this.attemptedUsers[msg.quiz.questionId] = {};
                    }
                    var usrid = msg.quiz.user;
                    if(typeof this.attemptedUsers[msg.quiz.questionId][usrid] == 'undefined') {
                        this.attemptedUsers[msg.quiz.questionId][usrid] = {};
                    }

                    this.attemptedUsers[msg.quiz.questionId][usrid] = msg.quiz.ans;
                    var totalAttptedUsers = Object.keys(this.attemptedUsers[msg.quiz.questionId]).length;
                    var correctAns = 0;
                    for (var key in this.attemptedUsers[msg.quiz.questionId]) {
                        if(this.attemptedUsers[msg.quiz.questionId][key] == true) {
                            correctAns++;
                        }
                    }
                    document.getElementById('usA_'+msg.quiz.questionId).innerHTML = totalAttptedUsers;
                    var attemptPercent = 0;
                    if(correctAns > 0) {
                        var attemptPercent = (correctAns / totalAttptedUsers)*100;
                    }
                    var pBar = document.getElementById('qPb_'+msg.quiz.questionId);
                    pBar.innerHTML = attemptPercent + '% correct';
                    pBar.style.width = attemptPercent + '%';

                    if(typeof this.quizAttempted[msg.quiz.questionId] == 'undefined'){
                        this.quizAttempted[msg.quiz.questionId] = {};
                    }
                    this.quizAttempted[msg.quiz.questionId].uA = totalAttptedUsers;
                    this.quizAttempted[msg.quiz.questionId].cA = correctAns;
                }

                // Event triggerd on quiz submit
                if (msg.quiz.quizMsg == "quizsubmitted" && roles.hasControls()) {
                    //console.log(fromUser);

                    //if (this.usersFinishedQz.indexOf(msg.quiz.user) < 0) {
                    this.usersFinishedQz.push(msg.quiz.user);
                    var ct = this.usersFinishedQz.length;

                    var name = (!typeof fromUser.lname == "undefined") ? fromUser.name + ' ' + fromUser.lname : fromUser.name;

                    this.gradeReport(ct, name, msg.quiz.timetaken, msg.quiz.score, msg.quiz.quesattemptd, msg.quiz.correctans);

                    this.qGrade.push({
                        'nm' : name,
                        'tt' : msg.quiz.timetaken,
                        'sc' : msg.quiz.score,
                        'qAt' : msg.quiz.quesattemptd,
                        'ca' : msg.quiz.correctans
                    });
                    virtualclass.storage.quizStorage("qGrade", JSON.stringify(vthis.qGrade));

                    //save data in LMS DB
                    this.saveGradeInDb(msg.quiz.user, msg.quiz.timetaken, msg.quiz.score, msg.quiz.quesattemptd, msg.quiz.correctans);
                    //}
                }
            },

            /**
             * Save quiz result in LMS database
             * @param {int} user id
             * @param {int}  time in seconds
             * @param {float}  grade in percentage
             * @param {int}  no of question attempted
             * @param {int}  no of currect answer
             * @return null
             */
            saveGradeInDb: function(userId, timeTn, grade, quesAttempted, correctAns){
                //save data in LMS DB
                var vthis = virtualclass.quiz;
                var tt = this.convertTimeToSec(timeTn);
                var formData = new FormData();
                formData.append("cmid", vthis.cmid);
                formData.append("qzid", vthis.qzid);
                formData.append("user", userId);
                formData.append("grade", grade);
                formData.append("timetaken", tt);
                formData.append("qusattempted", quesAttempted);
                formData.append("currectans", correctAns);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=congrea_quiz_result", function (data) {
                    if (data !== 'ture') {
                        console.log('Quiz data not saved in congrea');
                    }
                });
            },

            /**
             * Called on page refersh
             * display atttemped answer bar with storage data
             * @param {null}
             * @return
             */
            displayAttemptOverview: function() {
                var that = virtualclass.quiz;
                for (var key in that.quizAttempted) {
                    document.getElementById('usA_'+key).innerHTML = that.quizAttempted[key].uA;
                    if(that.quizAttempted[key].cA > 0) {
                        var attemptPt = (that.quizAttempted[key].cA / that.quizAttempted[key].uA)*100;
                        var attemptPercent = attemptPt.toFixed(2);

                        var pBar = document.getElementById('qPb_'+key);
                        pBar.innerHTML = attemptPercent + '% correct';
                        pBar.style.width = attemptPercent + '%';
                    }
                }
            },

            /**
             * Called on page refersh to populate previous data
             * display grade report with stored data
             * @param {null}
             * @return
             */
            displayGradeReport: function() {
                var that = virtualclass.quiz;
                for (var i = 0; i < that.qGrade.length; i++) {
                    that.gradeReport(i+1, that.qGrade[i].nm, that.qGrade[i].tt,
                        that.qGrade[i].sc, that.qGrade[i].qAt, that.qGrade[i].ca);
                }
            },

            /**
             * create progress overview page with
             * questions and empty progress bar
             * @param {null}
             * @return
             */
            attemptProgressReport: function() {
                var qzJson = virtualclass.quiz.quizJSON;
                var quizobj = JSON.parse(qzJson);
                var body = virtualclass.view.customCreateElement('div','attemptQzBody','modal-body');
                var questionArr = quizobj.questions;
                var qcount = 1;
                for (i = 0; i < questionArr.length; i++) {
                    var quesDiv = virtualclass.view.customCreateElement('div', '', 'q-area');
                    body.appendChild(quesDiv);
                    var quesNoDiv = virtualclass.view.customCreateElement('span', '', 'q-no');
                    quesNoDiv.innerHTML = qcount;
                    quesDiv.appendChild(quesNoDiv);

                    var quesTxtDiv = virtualclass.view.customCreateElement('div', '', 'qscolor');
                    quesTxtDiv.innerHTML =  questionArr[i].q;
                    quesDiv.appendChild(quesTxtDiv);
                    // no of users attempted question
                    var usAtdiv = virtualclass.view.customCreateElement('div');
                    usAtdiv.innerHTML = "Users attempted : <span id='usA_"+questionArr[i].qid+"'>0</span>";
                    quesDiv.appendChild(usAtdiv);
                    // progress bar
                    var pbar = this.UI.createProgressBar(questionArr[i].qid, 0);
                    quesDiv.appendChild(pbar);
                    qcount++;
                }
                return body;
            },

            /**
             * Display container for tab in report view page
             * @param {null}
             * @return
             */
            tabContent:function(){
                var head = document.getElementById(("resultQzLayout"));
                var tcDiv = virtualclass.view.customCreateElement('div', '', "tab-content");

                var tOvDiv = virtualclass.view.customCreateElement('div', 'qzOverv');
                tOvDiv.className = "tab-pane fade in active";
                var qzOverviewPage = this.attemptProgressReport();
                tOvDiv.appendChild(qzOverviewPage);
                tcDiv.appendChild(tOvDiv);
              
                var tGrDiv = virtualclass.view.customCreateElement('div', 'gdRpt');
                tGrDiv.className = "tab-pane fade";
                var tGdRpPage = this.UI.gradeReportLayout();
                tGrDiv.appendChild(tGdRpPage);
                tcDiv.appendChild(tGrDiv);

                head.appendChild(tcDiv);
            },

            /**
             * Create a dynamic td for filled value of
             * grade report of a given user
             * @param {string} td1v serial number
             * @param {string} td2v student name
             * @param {string} td3v time taken to finish quiz
             * @param {string} td4v grade in percentage
             * @param {string} td5v No of questions attempted
             * @param {string} td6v no of correct answer
             * @return null
             */
            gradeReport:function(td1v, td2v, td3v, td4v, td5v, td6v) {

                var tbody = document.getElementById('qzReTbody');
                if(tbody){

                    var tr = document.createElement("tr");
                    tbody.appendChild(tr);

                    var th = document.createElement("th");
                    th.scope = "row";
                    th.innerHTML = td1v;
                    tr.appendChild(th);
                    var td2 = document.createElement("td");
                    td2.innerHTML = td2v;
                    tr.appendChild(td2);
                    var td3 = document.createElement("td");
                    td3.innerHTML = td3v;
                    tr.appendChild(td3);
                    var td4 = document.createElement("td");
                    td4.innerHTML = td4v +'%';
                    tr.appendChild(td4);
                    var td5 = document.createElement("td");
                    td5.innerHTML = td5v;
                    tr.appendChild(td5);
                    var td6 = document.createElement("td");
                    td6.innerHTML = td6v;
                    tr.appendChild(td6);
                }
            },

            /**
             * Display timer in asc and desc order
             * @param {int} timelimit for quiz
             * @param {object} div container to display timer
             * @param {string} asc or desc
             * @return
             */
            quizTimer: function(duration, display, order) {
                // order asc or desc
                order = typeof order !== 'undefined' ? order : 'desc';
                var start = Date.now(),
                    diff,
                    hours,
                    minutes,
                    seconds;

                function timer() {
                    // get the number of seconds that have elapsed since
                    // startTimer() was called
                    if(order == 'asc'){
                        diff = duration + (((Date.now() - start) / 1000) | 0);
                    } else {
                        diff = duration - (((Date.now() - start) / 1000) | 0);
                    }
                    // Setting and displaying hours, minutes, seconds
                    hours = (diff / 3600) | 0;
                    minutes = ((diff % 3600) / 60) | 0;
                    seconds = (diff % 60) | 0;

                    hours = hours < 10 ? "0" + hours : hours;
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    display.textContent = hours + ":" + minutes + ":" + seconds;
                    //var ctime = hours + ":" + minutes + ":" + seconds;
                    // Global scope of timer
                    timeTakenQuiz = hours + ":" + minutes + ":" + seconds;

                    if (diff <= 0) {
                        if(order != 'asc'){
                            display.textContent = "00 : 00 : 00 ";

                        }

                        // add one second so that the count down starts at the full duration
                        // example 17:00:00 not 16:59:59
                        //start = Date.now() + 1000;
                        start =0;
                        if(typeof CDTimer != 'undefined'){
                            clearInterval(CDTimer);
                            console.log('Clear quiz interval');
                        }

                        ioAdapter.mustSend({
                            'quiz': {
                                quizMsg: 'quizTimeEnd',
                                quizId: virtualclass.view.qzid
                            },
                            'cf': 'quiz'
                        });
                        if(roles.hasControls()){
                            document.getElementById('closeQzBt').disabled = true;
                        }
                    }
                    //return ctime;
                };
                // don't want to wait a full second before the timer starts
                if(order !== 'asc'){
                    timer();
                }
                CDTimer = setInterval(timer, 1000);
            },

            /**
             * Callled on click of close button of result page
             * Ask for close confirmation if yes delete
             * data form storage
             * @param {null}
             * @return
             */
            quizModalClose: function () {
                var that = this;
                var message = virtualclass.lang.getString('rusureCquiz');
                virtualclass.popup.confirmInput(message, function (confirm){
                    if (confirm) {
                        localStorage.removeItem('quizSt');
                        that.quizSt = {};
                        virtualclass.storage.clearTableData("quizData");
                        localStorage.removeItem('qRep');
                        var mBody = document.getElementById('editQuizModal');
                        mBody.parentNode.removeChild(mBody);
                        that.attemptedUsers = {};
                        that.quizAttempted = {};
                        ioAdapter.mustSend({
                            'quiz': {
                                quizMsg: 'quizClosed',
                                quizId: that.qzid
                            },
                            'cf': 'quiz'
                        });
                    }
                });
            },

            /**
             * Function to convert seconds into hh:mm:ss
             * @param {int} seconds
             * @return string date
             */
            convertSecToTime: function (sec) {
                if (/^\d+$/.test(sec)) {
                    var date = new Date(null);
                    date.setSeconds(sec); // specify value for SECONDS here
                    var result = date.toISOString().substr(11, 8);
                    return result;
                } else {
                    return '00:00:00';
                }
            },

            /**
             * Function to convert hh:mm:ss into secods
             * @param {string} hh:mm:ss
             * @return string date
             */
            convertTimeToSec: function (hms){
                //var hms = '02:04:33';
                if(hms){
                    var a = hms.split(':'); // specify value for SECONDS here
                    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    return seconds;
                }
                return 0;
            },
            /**
             * Function to check json string
             * @param {string} json strin
             * @return {boolean} true/false
             */
            isJson: function (str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            },

            /**
             * Object contain userInterface functions
             */
            UI: {
                id: 'virtualclassQuiz',
                class: 'virtualclass',
                /*
                 * Creates container for the quiz
                 */
                container: function () {
                    console.log("quiz layout check");
                    var quizCont = document.getElementById(this.id);
                    if (quizCont != null) {
                        quizCont.parentNode.removeChild(quizCont);
                    }

                    var divQuiz = virtualclass.view.customCreateElement('div', this.id, this.class);
                    //virtualclass.vutil.insertIntoLeftBar(divQuiz);
                    virtualclass.vutil.insertAppLayout(divQuiz);
                    this.layout(divQuiz)
                },

                /**
                 * Display quiz body header & msg
                 * when first time quiz connected
                 * @param div element
                 * @return
                 */
                layout: function (divQuiz) {

                    var contQuiz = virtualclass.view.customCreateElement('div', 'layoutQuiz','bootstrap container-fluid quizLayout');
                    divQuiz.appendChild(contQuiz);

                    var nav = document.createElement('nav');
                    nav.className = "nav navbar ";
                    contQuiz.appendChild(nav);

                    var div = virtualclass.view.customCreateElement('div','','vchead');
                    div.innerHTML = virtualclass.lang.getString('Quiz');
                    nav.appendChild(div);

                    var contQuizBody = virtualclass.view.customCreateElement('div', 'layoutQuizBody','quizMainCont');
                    contQuiz.appendChild(contQuizBody);

                    this.createMszBox(contQuizBody);
                    this.createModalCont(contQuizBody);
                },

                createModalCont: function (contQuiz) {
                    var bsCont = virtualclass.view.customCreateElement('div', 'bootstrapQzCont','modalCont');
                    contQuiz.appendChild(bsCont);
                },

                layout2: function (contQuiz) {
                    var ctr = document.getElementById(contQuiz);
                    var text = "Available Quizes";
                    var e = document.getElementById("listQzCont");
                    if (e == null) {
                        var mainQzDiv = document.createElement('div');
                        mainQzDiv.className="table-responsive";
                        ctr.appendChild(mainQzDiv);
                        var e = virtualclass.view.customCreateElement('table', 'listQzCont','table table-bordered table-striped quizList');
                        mainQzDiv.appendChild(e);
                    }
                },
                /*
                 Diaplay header of quiz list
                 */
                listHeader: function () {
                    var cont = document.getElementById("listQzCont")

                    var headCont = document.createElement("tr");
                    headCont.classList.add("headerContainer")
                    headCont.id = "headerContainer";

                    cont.insertBefore(headCont, cont.firstChild)
                    var elem = document.createElement("th");
                    elem.classList.add("controlsHeader")
                    elem.innerHTML = virtualclass.lang.getString('Controls');
                    headCont.appendChild(elem);

                    var iconCtr = document.createElement('i');
                    iconCtr.className = "icon-setting";
                    elem.appendChild(iconCtr);

                    var elem = document.createElement("th");
                    elem.classList.add("qnTextHeader")
                    elem.innerHTML = virtualclass.lang.getString('Quizes');
                    headCont.appendChild(elem);

                    var iconHelp = document.createElement('i');
                    iconHelp.className = "icon-help";
                    elem.appendChild(iconHelp);

                    var elem = document.createElement("th");
                    elem.classList.add("timeHeader")
                    elem.innerHTML = virtualclass.lang.getString('Time');
                    headCont.appendChild(elem);

                    var iconCreator = document.createElement('i');
                    iconCreator.className = "icon-creator";
                    elem.appendChild(iconCreator);

                    var elem = document.createElement("th");
                    elem.classList.add("qperpageHeader")
                    elem.innerHTML = virtualclass.lang.getString('Quiz/page');
                    headCont.appendChild(elem);
                },

                /**
                 * Create two tab for report layout
                 * @param null
                 * @return
                 */
                createTab: function(){
                    var tbUl = document.createElement("ul");
                    tbUl.classList.add("nav", "nav-tabs");

                    var tbLi1 = document.createElement("li");
                    tbLi1.className = "active";
                    var li1a = document.createElement("a");
                    li1a.setAttribute('data-toggle', "tab");
                    li1a.href = "#qzOverv";
                    li1a.innerHTML = "Questions overview";
                    tbLi1.appendChild(li1a);
                    tbUl.appendChild(tbLi1);
          
                    var tbLi2 = document.createElement("li");
                    var li2a = document.createElement("a");
                    li2a.setAttribute('data-toggle', "tab");
                    li2a.href = "#gdRpt";
                    li2a.innerHTML = virtualclass.lang.getString('Greport');
                    tbLi2.appendChild(li2a);
                    tbUl.appendChild(tbLi2);
                    tbLi2.addEventListener('click',function(){
                        tbLi2.classList.toggle('active') ;
                        tbLi1.classList.toggle('active') ;
                        if(tbLi2.classList.contains('active')){
                           var rpt = document.querySelector('#gdRpt')
                           rpt.className= 'tab-pane fade in active';
                           var qz = document.querySelector('#qzOverv')
                           qz.className= 'tab-pane fade';
                           
                       }
                    })
                             
                    tbLi1.addEventListener('click',function(){
                       tbLi1.classList.toggle('active') ;
                       tbLi2.classList.toggle('active') ;
                       if(tbLi1.classList.contains('active')){
                           var qz = document.querySelector('#qzOverv')
                           qz.className= 'tab-pane fade in active';
                           var rpt = document.querySelector('#gdRpt')
                           rpt.className= 'tab-pane fade';
                        }
                    })
                    return tbUl;
                },

                /**
                 * Display progress/result interface to teacher
                 * @param {object} qz quiz detail
                 * @return
                 */
                resultView: function (qz) {
                    var layout = document.getElementById("layoutQuiz");

                    if (roles.hasControls()) {
                        this.createResultLayout();

                        var contQzHead  = document.querySelector('#contQzHead');
                        var QstnName  = document.querySelector('#QstnName');
                        if(QstnName == null){
                            var QstnName =  document.createElement('div');
                            QstnName.id = 'QstnName';
                            QstnName.innerHTML =  qz.name;
                            if(contQzHead != null){
                                contQzHead.appendChild(QstnName)
                            }
                        }

                        var qtime = parseInt(qz.timelimit);
                        if(qtime > 0) {
                            var order = 'desc';
                            var timeHeader = "Time remaining" ;
                        } else {
                            var order = 'asc';
                            timeHeader = "Elapsed time";
                        }

                        /**
                         * Displays the timer in result view from local storage, with or without timer,
                         * it was coming from timelimit earlier
                         * **/
                        let timerInfo = localStorage.getItem('quizSt');
                        if(timerInfo != null){
                            timerInfo = JSON.parse(timerInfo);
                            if(Object.keys(timerInfo).length > 0){
                                var elTime = timerInfo.qtime;
                                var res = elTime.split(":");
                                qtime = parseInt(res[2]) + (parseInt(res[1]) * 60) + (parseInt(res[0]) * 3600);
                            }
                        }
                        var bodyHdCont = document.getElementById("resultQzLayout");

                        var elem = virtualclass.view.customCreateElement('div','rsQzHead','row col-md-12');
                        bodyHdCont.appendChild(elem);

                        // var leftdiv = virtualclass.view.customCreateElement('div','', 'col-md-6');
                        // elem.appendChild(leftdiv);

                        var timeInnerdiv = virtualclass.view.customCreateElement('div','','col-md-3');
                        timeInnerdiv.innerHTML =  "Time limit : <span> " + virtualclass.quiz.convertSecToTime(qz.timelimit) +"</span>";
                        elem.appendChild(timeInnerdiv);

                        var qNoInnerdiv = virtualclass.view.customCreateElement('div','','col-md-3');
                        qNoInnerdiv.innerHTML =  "No of questions : <span> " + qz.noOfQus +"</span>";
                        elem.appendChild(qNoInnerdiv);

                        // var rightdiv = virtualclass.view.customCreateElement('div', '','col-md-6');
                        // elem.appendChild(rightdiv);

                        var elstimeInnerdiv = virtualclass.view.customCreateElement('div','','col-md-4');
                        elstimeInnerdiv.innerHTML = timeHeader + " : <span id=\"elsTime\">00:00:00</span>";
                        elem.appendChild(elstimeInnerdiv);

                        var btnInnerdiv = virtualclass.view.customCreateElement('button', 'closeQzBt','');
                        btnInnerdiv.classList.add("btn", "btn-default", "controls");
                        btnInnerdiv.innerHTML = virtualclass.lang.getString('Cquiz');
                        elem.appendChild(btnInnerdiv);
                        btnInnerdiv.addEventListener("click", virtualclass.quiz.closeQzBt);

                        var storedData = JSON.parse(localStorage.getItem('quizSt'));
                        if(storedData != null && (storedData.qClosed == 'true' || storedData.qClosed)){
                            console.log("Don't run timer when quiz is closed");
                            var elapsedTime = document.querySelector('#elsTime');
                            localStorage.setItem('quizSt', JSON.stringify(storedData));
                            if(elapsedTime != null){
                                elapsedTime.innerHTML =  storedData.qtime;
                            }

                        } else {
                            virtualclass.quiz.quizTimer(qtime, document.getElementById("elsTime"), order);
                        }
                        var tbUl = this.createTab();
                        bodyHdCont.appendChild(tbUl);
                        //var maxMarksdiv = virtualclass.view.customCreateElement('div', 'maxMark','');
                    }
                },

                /**
                 * Replace preview window into result popup
                 * @param null
                 * @return
                 */
                createResultLayout: function () {
                    var resultLayout = document.getElementById("resultQzLayout")
                    if (resultLayout) {
                        resultLayout.parentNode.removeChild(resultLayout);
                    }
                    if (roles.hasControls()) {
                        var head = document.getElementById(("contQzHead"));
                        if (pubbtn = document.getElementById("publishQzBt")) {
                            pubbtn.parentNode.removeChild(pubbtn);
                        }
                        var closebt = document.querySelector('#contQzHead .close');
                        if(closebt) {
                            closebt.parentNode.removeChild(closebt);
                            var el = virtualclass.view.customCreateElement('div','modalQzClose','close');
                            el.type = "button";
                            //el.setAttribute("data-dismiss", "modal");
                            el.innerHTML = "&times";
                            head.appendChild(el);
                        }

                        var cont = document.getElementById("quizModalBody");
                        if (cont) {
                            while (cont.childElementCount > 1) {
                                cont.removeChild(cont.lastChild);
                            }
                        }

                        var elem = document.createElement("div");
                        elem.id = "resultQzLayout";
                        cont.appendChild(elem);

                        var modalClose = document.getElementById("modalQzClose");
                        modalClose.addEventListener("click", function () {
                            virtualclass.quiz.usersFinishedQz = [];
                            virtualclass.quiz.qGrade = [];
                            virtualclass.quiz.quizModalClose();

                        });
                    }
                },

                /**
                 * Create progress bar to display attempt report
                 * Bootstrap progress bar is used
                 * @param {int} question id for which attempt bar appears
                 * @param {int} number of attempt as bar value
                 * @return
                 */
                createProgressBar: function (quesid, value) {
                    var pbarOuterdiv = virtualclass.view.customCreateElement('div', '','progress');
                    var pbarinnerdiv = virtualclass.view.customCreateElement('div', 'qPb_'+quesid,'progress-bar');
                    pbarinnerdiv.role = 'progressbar';
                    pbarinnerdiv.setAttribute("setaria-valuenow", value);
                    pbarinnerdiv.setAttribute("aria-valuemin", "0");
                    pbarinnerdiv.setAttribute("aria-valuemax", "100");
                    pbarinnerdiv.style = "width:"+value+"%";
                    pbarinnerdiv.innerHTML = value+"% Correct";
                    pbarOuterdiv.appendChild(pbarinnerdiv);
                    return pbarOuterdiv;
                },

                /**
                 * Create grade report layout, in later
                 * stage value will populated
                 * @param null
                 * @return
                 */
                gradeReportLayout: function() {
                    var body = virtualclass.view.customCreateElement('div','gradeRpBody','modal-body');

                    var quesDiv = virtualclass.view.customCreateElement('table', '','table');
                    var thead = virtualclass.view.customCreateElement('thead', '','thead-inverse');
                    var tr = document.createElement("tr");
                    var th1 = document.createElement("th");
                    th1.innerHTML = "#";
                    tr.appendChild(th1);
                    var th2 = document.createElement("th");
                    th2.innerHTML = "Name";
                    tr.appendChild(th2);
                    var th3 = document.createElement("th");
                    th3.innerHTML = "Time taken";
                    tr.appendChild(th3);
                    var th4 = document.createElement("th");
                    th4.innerHTML = "Grade";
                    tr.appendChild(th4);
                    var th5 = document.createElement("th");
                    th5.innerHTML = "Q. attempted";
                    tr.appendChild(th5);
                    var th6 = document.createElement("th");
                    th6.innerHTML = "Correct";
                    tr.appendChild(th6);

                    thead.appendChild(tr);
                    quesDiv.appendChild(thead);

                    var tbody = virtualclass.view.customCreateElement('tbody','qzReTbody');
                    quesDiv.appendChild(tbody);

                    body.appendChild(quesDiv);

                    return body;
                },

                /**
                 * Create grade and display result(progress/grade)
                 * Screen header with value
                 * @param {object} contain detial about quiz
                 * @return null
                 */
                displayStudentResultScreen: function(data) {
                    //var resPage = document.querySelector("#slickQuiz .quizResults");
                    var msgPage = document.getElementById('mszBoxQuiz');

                    if (msgPage) {
                        var sqm = document.getElementById('stdQuizMszLayout');
                        if (sqm) {
                            msgPage.removeChild(sqm);
                        }
                        var resPage = virtualclass.view.customCreateElement('div','resultDiv');
                        msgPage.appendChild(resPage);

                        var noOfQ = document.createElement('h4');
                        noOfQ.innerHTML = "<span class='col-md-4'> Total no of questions </span>  <span class='nfqh'>: &nbsp;  "+data.grade.noofqus+"</span>";
                        resPage.appendChild(noOfQ);

                        var tt = document.createElement('h4');
                        tt.innerHTML = " <span class='col-md-4'> Time taken </span><span class='tth'> : &nbsp;   "+data.grade.timetaken+"</span>";
                        resPage.appendChild(tt);

                        var mm = document.createElement('h4');
                        mm.innerHTML = " <span class='col-md-4'> Maximum mark </span><span class='mmh'>: &nbsp;  "+data.grade.maxmarks+"</span>";
                        resPage.appendChild(mm);

                        var ca = document.createElement('h4');
                        ca.innerHTML = "<span class='col-md-4'> Correct answers </span><span class='cah'>: &nbsp;  "+data.grade.correctans+"</span>";
                        resPage.appendChild(ca);

                        var qa = document.createElement('h4');
                        qa.innerHTML = " <span class='col-md-4'> Questions attempted</span> <span class='qah'>: &nbsp;  "+data.grade.quesattemptd+"</span>";
                        resPage.appendChild(qa);

                        var sc = document.createElement('h4');
                        sc.innerHTML = " <span class='col-md-4'> You Scored </span> <span class='sch'>: &nbsp;  "+data.grade.score+"</span>";
                        resPage.appendChild(sc);

                        resPage.style.display = 'block';
                    }
                },

                createMszBox: function (cont) {
                    var elem = virtualclass.view.customCreateElement('div', 'mszBoxQuiz','row');
                    cont.appendChild(elem);
                },

                generateModal: function (id, bsCont) {
                    var modal = virtualclass.view.customCreateElement('div',id,'modal');
                    modal.role = "dialog";
                    modal.style.display = "none";
                    modal.setAttribute("tab-index", "-1");
                    modal.setAttribute("area-hidden", "true");
                    bsCont.appendChild(modal);

                    var dialog = document.createElement("div");
                    dialog.className = "modal-dialog";
                    modal.appendChild(dialog);

                    var content = virtualclass.view.customCreateElement('div','quizModalBody','modal-content');
                    dialog.appendChild(content);

                    var head = virtualclass.view.customCreateElement('div','contQzHead','modal-header');
                    content.appendChild(head);

                    var el = virtualclass.view.customCreateElement('div','','close');
                    el.type = "button";
                    el.setAttribute("data-dismiss", "modal");
                    el.innerHTML = "&times";
                    head.appendChild(el);

                    var body = virtualclass.view.customCreateElement('div','contQzBody','modal-body');
                    content.appendChild(body);
                    
                    var close = document.querySelector('#editQuizModal #contQzHead .close ');
                    close.addEventListener('click',function(){
                        modal.style.display="none";
                        modal.className='modal fade'
                    })
                    
                },

                modalContentUI: function () {
                    //Quiz display container
                    var body = document.getElementById("contQzBody");

                    var skQzCont = virtualclass.view.customCreateElement('div','slickQuiz','path-mod-congrea-quiz');
                    var qzName = virtualclass.view.customCreateElement('h3','','quizName');
                    skQzCont.appendChild(qzName); //quiz name div

                    var qzTime = virtualclass.view.customCreateElement('P','timeText');
                    skQzCont.appendChild(qzTime); //quiz timer p

                    var skQzNav = virtualclass.view.customCreateElement('div','exam_navblock','navblock');
                    skQzCont.appendChild(skQzNav); ////quiz questions navigation

                    var skQzNavCont = virtualclass.view.customCreateElement('div','','content');
                    skQzNav.appendChild(skQzNavCont);

                    var skQzNavContBt = virtualclass.view.customCreateElement('div','','qn_buttons multipages');
                    skQzNavCont.appendChild(skQzNavContBt);

                    var qzArea = virtualclass.view.customCreateElement('div','','quizArea');
                    skQzCont.appendChild(qzArea);
                    var qzheader = virtualclass.view.customCreateElement('div','','quizHeader');
                    qzArea.appendChild(qzheader);

                    var qzheaderA = virtualclass.view.customCreateElement('a','','button startQuiz');
                    qzheaderA.href="#";
                    qzheaderA.innerHTML= "Get Started!";
                    qzheader.appendChild(qzheaderA);

                    //alert('I am here. add result div');
                    var qzResult = virtualclass.view.customCreateElement('div','','quizResults');
                    skQzCont.appendChild(qzResult);

                    var qzScr = virtualclass.view.customCreateElement('h3','','quizScore');
                    qzScr.innerHTML= "You Scored: <span></span>";
                    qzResult.appendChild(qzScr);

                    var qzLevel = virtualclass.view.customCreateElement('h3','','quizLevel');
                    qzheaderA.innerHTML= "<strong>Ranking:</strong> <span></span>";
                    qzResult.appendChild(qzLevel);

                    var qzRsCpy = virtualclass.view.customCreateElement('div','','quizResultsCopy');
                    qzResult.appendChild(qzRsCpy);
                    body.appendChild(skQzCont);
                },

                /*
                 Create div with unique id for quiz list display
                 */
                qzCont: function (index) {
                    var list = document.getElementById("listQzCont");
                    var elem = virtualclass.view.customCreateElement('tr', 'contQz' + index,'vcQuizCont');
                    if (list != null) {
                        list.insertBefore(elem, list.firstChild);
                    }
                },

                qzCtrCont: function (index) {

                    var e = document.getElementById("contQz" + index);
                    var ctrCont = virtualclass.view.customCreateElement('td', "ctrQz" + index, "quizCtrCont");
                    e.appendChild(ctrCont);

                    var link2 = document.createElement("a");
                    link2.href = "#";
                    link2.id = "publishQz" + index;

                    ctrCont.appendChild(link2);

                    var sp = document.createElement("span");
                    sp.className = "icon-publish2";
                    sp.setAttribute("data-toggle", "tooltip")
                    sp.setAttribute("title", virtualclass.lang.getString('quizreviewpublish'));

                    link2.appendChild(sp);
                },

                qzTextCont: function (item, index) {
                    var e = document.getElementById("contQz" + index);
                    var qzCont = document.createElement('td');
                    qzCont.classList.add("qnText")
                    qzCont.innerHTML = item.name;
                    e.appendChild(qzCont);

                    var elem = document.createElement("td");
                    elem.classList.add("creator")

                    if (item.timelimit > 0) {
                        var tLimit = virtualclass.quiz.convertSecToTime(item.timelimit)
                    } else {
                        var tLimit = item.timelimit;
                    }
                    elem.innerHTML = tLimit;
                    e.appendChild(elem);

                    var elem = document.createElement("td");
                    elem.classList.add("qperpage")

                    elem.innerHTML = item.questionsperpage;
                    e.appendChild(elem);
                },

                defaultLayoutForStudent: function () {
                    this.container();
                    var mszCont = document.getElementById("mszBoxQuiz");
                    var messageLayoutId = 'stdQuizMszLayout';
                    if (document.getElementById(messageLayoutId) == null) {
                        var studentMessage = virtualclass.view.customCreateElement('div', messageLayoutId);
                        studentMessage.innerHTML = virtualclass.lang.getString('quizmayshow');
                        mszCont.appendChild(studentMessage);
                    }
                }
            }
        }
        //return _quiz;
    };
    window.quiz = quiz;

})(window);