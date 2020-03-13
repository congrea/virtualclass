/* global virtualclass, ioAdapter */
(function (window) {
  'use strtic';

  let scope; let
    pubbtn;
  const quiz = function () {
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
      quizJSON: {},
      attemptedUsers: {},
      cmid: 2, // TODO : courseid of moodle
      // exportfilepath: window.exportfilepath,
      quizSt: {}, // used for storage
      quizAttempted: {}, // used for storage
      // qGrade: [], // used for storage
      initToFetch: true,
      init() {
        virtualclass.previrtualclass = 'virtualclassQuiz';
        virtualclass.previous = 'virtualclassQuiz';
        // const urlquery = virtualclass.vutil.getUrlVars(exportfilepath);
        const urlquery = virtualclass.vutil.getUrlVars(window.webapi);
        this.cmid = urlquery.cmid;

        if (!roles.hasAdmin() || (roles.isEducator())) {
          if (roles.isStudent()) {
            this.UI.defaultLayoutForStudent();
          } else {
            this.UI.container();

            if (roles.hasControls()) {
              ioAdapter.mustSend({
                quiz: {
                  quizMsg: 'init',
                },
                cf: 'quiz',
              });
            } else {
              this.UI.defaultLayoutForStudent();
            }
          }
        } else {
          this.UI.container();
          ioAdapter.mustSend({
            quiz: {
              quizMsg: 'init',
            },
            cf: 'quiz',
          });
        }
        if (roles.hasControls() && this.initToFetch) {
          this.initToFetch = false;
          this.interfaceToFetchList(this.cmid);
        }

        const storedData = JSON.parse(localStorage.getItem('quizSt'));
        if (storedData) {
          // this.storedDataHandle(storedData);
          virtualclass.quiz.quizSt = storedData;
        }
      },

      displayQuizModalBox() {
        const quizModal = document.querySelector('#editQuizModal');
        quizModal.className = 'modal in';
        quizModal.style.display = 'block';
      },

      teacherViewOnPageRefresh(msg) {
        const quizDetial = msg.quizDetail;
        // virtualclass.quiz.readyToPublishQuiz(quizDetial, quizDetial.id);
        /* On page refesh, we don't have to reset the time limit,
         * if we do this, the quiz without timer would be closed on page refresh
         * */
        this.quizJSON = msg.data.json;

        this.openQuizPopup(this.quizJSON, quizDetial.id);
        this.UI.resultView(quizDetial);
        this.tabContent();
        this.displayQuizModalBox();

        // if (Object.prototype.hasOwnProperty.call(msg.data, 'qAttempt')) {
        //   alert('performing attempt');
        //   this.quizAttempted = JSON.parse(msg.data.qAttempt);
        //   this.displayAttemptOverview();
        // }
        // if (Object.prototype.hasOwnProperty.call(msg.data, 'qGrade')) {
        //   alert('performing grade');
        //   this.qGrade = JSON.parse(msg.data.qGrade);
        //   this.displayGradeReport();
        // }
        // if (typeof storedData != 'undefined' && storedData.qClosed == 'true') {  // TODO, need to find what it is ?
        //   document.getElementById('closeQzBt').disabled = true;
        // }
        virtualclass.quiz.quizSt.screen = 'tchResultView';
      },

      /*
       Check if quiz exit, call function to display list of quizes
       */
      displayQuizList() {
        console.log('===> quiz display questions');
        let isQuiz = false;
        let mszBoxQuiz;
        virtualclass.quiz.dispList('course');
        const listcont = document.getElementById('listquizcourse');
        if (Object.keys(this.coursequiz).length > 0) {
          for (const k in this.coursequiz) {
            if (Object.prototype.hasOwnProperty.call(this.coursequiz, k)) {
              if (!+this.coursequiz[k].quizstatus) {
                isQuiz = true;
                this.displayQuizes(this.coursequiz[k], k);
              }
            }
          }
          this.UI.listHeader();
          if (isQuiz) {
            const header = document.querySelector('#virtualclassCont.congrea #layoutQuiz #headerContainer');
            if (!header.classList.contains('show')) {
              header.classList.add('show');
            }
          } else {
            mszBoxQuiz = document.querySelector('#virtualclassCont.congrea #layoutQuiz #mszBoxQuiz');
            if (mszBoxQuiz) {
              mszBoxQuiz.classList.add('show');
              mszBoxQuiz.innerHTML = virtualclass.lang.getString('noQuiz');
            }
          }
        } else {
          mszBoxQuiz = document.querySelector('#virtualclassCont.congrea #layoutQuiz #mszBoxQuiz');
          if (mszBoxQuiz) {
            mszBoxQuiz.classList.add('show');
            mszBoxQuiz.innerHTML = virtualclass.lang.getString('noQuiz');
          }
        }
      },

      dispList() {
        const mszbox = document.getElementById('mszBoxQuiz');

        const listCont = document.getElementById('listQzCont');
        if (listCont) {
          listCont.style.display = 'block';
        } else {
          // console.log('quiz layout 2');
          this.UI.layout2('layoutQuizBody');
        }
      },

      /**
       * Fetch all quiz detial from database as json
       * send fetched data displayQuizList fun
       * to display list of quizes
       * @param {string}  display screen
       * @return
       */
      interfaceToFetchList(category) {
        console.log('===> quiz fetch');
        const formData = new FormData();
        formData.append('cmid', this.cmid);
        formData.append('user', this.uid);
        const scope = this;
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=congrea_quiz`, formData).then((data) => {
          this.initToFetch = true;
          const getContent = data.data;
          if (getContent.status === 0) {
            const cont = document.getElementById('bootstrapQzCont');
            cont.innerHTML = virtualclass.lang.getString('noQuiz');
          } else {
            for (let i = 0; i <= getContent.length - 1; i++) {
              const { options } = getContent[i];
              for (const j in options) {
                getContent[i].options[j] = options[j].options;
                // console.log("getContent " + getContent[i]);
              }
            }
            // console.log(getContent);
            scope.coursequiz = getContent;
            scope.displayQuizList();
          }
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },
      /*
       Display quiz list with detail
       */
      displayQuizes(item, index) {
        // console.log(item);
        this.UI.qzCont(index);
        this.UI.qzCtrCont(index);
        this.UI.qzTextCont(item, index);
        this.attachQZEvent(`publishQz${index}`, 'click', this.publishHandler, item, index);
      },

      attachQZEvent(actionid, eventName, handler, item, index) {
        const elem = document.getElementById(actionid);
        if (elem != null) {
          elem.addEventListener(eventName, () => {
            if (typeof item !== 'undefined') {
              // console.log('attach time handler');
              handler(item, index);
              // handler(item, index, actionid, item.id);
            } else {
              // console.log('quiz is missing no need of time');
              // handler(index, actionid);
            }
          });
        }
      },

      /*
       Attach publis & preview button with quiz list
       */
      publishHandler(item, index) {
        const mszbox = document.getElementById('mszBoxQuiz');
        // console.log('====> quiz removing mszBoxQuiz');
        if (mszbox.childNodes.length > 0) {
          mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
        }
        virtualclass.quiz.readyToPublishQuiz(item, index);
      },

      /*
       Display preview pop up box for quiz display
       and call preview function for teacher screen
       */
      readyToPublishQuiz(item, index) {
        this.openQuizPopup(item, index);
        this.quizPreview(item);
        this.displayQuizModalBox();
      },

      /**
       * Open model popup box for quiz
       * @param {string} quiz data in json formate
       * @param {int}  quiz id
       * @return
       */
      openQuizPopup(item, index) {
        this.qzid = index; // store quiz id
        // var cont = document.getElementById('layoutQuizBody');
        // const elem = document.createElement('div');
        // elem.className = 'container';
        // cont.appendChild(elem);
        const modal = document.getElementById('editQuizModal');
        if (modal) {
          modal.remove();
        }
        // to change this to
        const cont = document.getElementById('bootstrapQzCont');
        virtualclass.quiz.UI.generateModal('editQuizModal', cont);
      },

      showQn(qnCont) {
        if (roles.hasControls()) {
          qnCont.innerHTML = 'quiz question';
        } else {
          qnCont.innerHTML = 'quiz question for student';
        }
      },
      action(id, cb, index) {
        cb(id, index);
      },

      /**
       * Get data of a single quiz in json
       * Send json data with other quiz detail
       * to slickQuiz for quiz display
       * @param {object}  quiz detial
       * @return
       */
      getQuizData(quizitem) {
        const quizDetail = this.coursequiz[quizitem.id];
        const formData = new FormData();
        formData.append('cmid', this.cmid);
        formData.append('user', this.uid);
        formData.append('qid', quizitem.id);
        scope = this;
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=congrea_get_quizdata`, formData, { transformResponse: res => res }).then((data) => {
          if (scope.isJson(data.data)) {
            scope.quizJSON = data.data;
            $('#slickQuiz').slickQuiz({
              json: scope.quizJSON,
              questionPerPage: quizDetail.questionsperpage,
              questionMode: quizDetail.preferredbehaviour,
              quizTime: quizDetail.timelimit,
              displayDetailResult: false,
            });
          } else {
            const pbBt = document.getElementById('publishQzBt');
            pbBt.parentNode.removeChild(pbBt);
            const msgCont = document.getElementById('contQzBody');
            msgCont.innerHTML = data;
          }
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },

      quizPopUp(cb, index) {
        // console.log('quiz pop up');
        const attachInit = function () {
          // console.log(this.id);
          virtualclass.quiz.action(this.id, cb, index);
        };
        const modal = document.getElementById('editQuizModal') ? document.getElementById('editQuizModal') : document.getElementById('qzPopup');
        const controls = modal.querySelectorAll(':scope .controls');

        for (let i = 0; i < controls.length; i++) {
          controls[i].addEventListener('click', attachInit);
        }
      },

      quizPreview(quizitem) {
        // console.log('quiz preview function');
        this.UI.modalContentUI();

        const header = document.getElementById('contQzHead');
        const heading = document.createElement('div');
        heading.id = 'QstnName';
        heading.innerHTML = quizitem.name;
        header.appendChild(heading);

        const publishBttn = document.getElementById('contQzBody');
        const btn = document.createElement('button');
        btn.id = 'publishQzBt';
        btn.classList.add('btn', 'btn-default', 'controls');
        btn.innerHTML = virtualclass.lang.getString('PQuiz');

        publishBttn.appendChild(btn);

        const iconPublish = document.createElement('i');
        iconPublish.className = 'icon-publish';
        btn.appendChild(iconPublish);


        this.getQuizData(quizitem);
        this.quizPopUp(this.popupFn, 1);
      },

      popupFn(id, index) {
        virtualclass.quiz[id].call(virtualclass.quiz, index);
      },

      /*
       Function is called when teacher pulished quiz
       call by popupFn function and display quiz result
       */
      publishQzBt() {
        const vthis = virtualclass.quiz;
        const qzJson = vthis.quizJSON;
        const quizobj = JSON.parse(qzJson);
        const noOfQus = quizobj.questions.length;
        vthis.coursequiz[vthis.qzid].noOfQus = noOfQus;
        const quizDetail = vthis.coursequiz[vthis.qzid];

        const data = {
          json: qzJson,
          questionPerPage: quizDetail.questionsperpage,
          questionMode: quizDetail.preferredbehaviour,
          quizTime: quizDetail.timelimit,
          displayDetailResult: false,
          // ptm: new Date().getTime(), // published time
        };
        virtualclass.quiz.publishedTime = Date.now();
        // send data to student
        ioAdapter.mustSend({
          quiz: {
            quizMsg: 'stdPublish',
            quizId: vthis.qzid,
            data,
            quizDetail,
            timestamp: virtualclass.vutil.localToUTC(Date.now()),
          },
          cf: 'quiz',
        });
        // display result interface to teacher
        vthis.UI.resultView(quizDetail);
        vthis.tabContent();
        vthis.quizSt.screen = 'tchResultView';

        // save data in LMS DB
        const formData = new FormData();
        formData.append('cmid', vthis.cmid);
        formData.append('qzid', vthis.qzid);
        formData.append('user', vthis.uid);
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=congrea_add_quiz`, formData).then((msg) => {
          if (msg.data !== 'ture') {
            // console.log('Quiz data not saved in congrea');
          }
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },

      /**
       * Called on click of close quiz button
       * At student side quiz will be closed and display result
       * While teacher will be able to see report
       * @param {null}
       * @return
       */
      closeQzBt() {
        virtualclass.quiz.publishedTime = 0;
        // console.log('-------CLOSE QUIZ--------');
        const { qzid } = virtualclass.quiz;
        const data = { qzid };
        ioAdapter.mustSend({
          quiz: {
            quizMsg: 'stdShowResult',
            data,
          },
          cf: 'quiz',
        });
        // stop timer
        if (virtualclass.gObj.CDTimer != null) {
          clearInterval(virtualclass.gObj.CDTimer);
          // console.log('Clear quiz interval');
        }

        document.getElementById('closeQzBt').disabled = true;
        const msginfo = document.createElement('div');
        msginfo.className = 'alert alert-info';
        msginfo.innerHTML = virtualclass.lang.getString('QClosed');
        resultQzLayout.insertBefore(msginfo, resultQzLayout.firstChild);
        // Reset the attempted quiz counter after closig the quiz
      },

      /**
       * Display quiz stucture with data
       * through slickQuiz.js file
       * @param {json} quiz json object
       * @return null
       */
      quizDisplay(quiz) {
        if (roles.isStudent()) {
          const customResultForMobile = document.querySelector('#virtualclassCont.customResult');
          if (customResultForMobile != null) {
            customResultForMobile.classList.remove('customResult');
          }
        }
        // console.log("student side " + quiz.quizMsg);
        const msz = document.getElementById('mszBoxQuiz');
        if (msz) {
          msz.parentNode.removeChild(msz);
          // console.log('====> quiz removing mszBoxQuiz');
        }
        const cQzbody = document.getElementById('contQzBody');
        if (cQzbody) {
          cQzbody.parentNode.removeChild(cQzbody);
        }
        const cont = document.getElementById('bootstrapQzCont');// Todo:
        const body = virtualclass.view.customCreateElement('div', 'contQzBody', 'modal-body');
        cont.appendChild(body);
        this.UI.modalContentUI();
        $('#slickQuiz').slickQuiz(quiz);
      },


      /**
       * Event received on onmessage
       * @param {object}  data object
       * @param {object}  sender detail
       * @return
       */
      onmessage(msg, fromUser) {
        // localStorage.removeItem('quizSt');
        let attemptPercent;
        const vthis = virtualclass.quiz;
        if (msg.quiz.quizMsg === 'stdPublish') {
          vthis.publishedTime = virtualclass.vutil.UTCtoLocalTimeToSeconds(msg.quiz.timestamp);
          msg.quiz.data.ptm = vthis.publishedTime;
          vthis.dataRec = msg.quiz.data;
          vthis.qzid = msg.quiz.quizId;
          if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
            this.teacherViewOnPageRefresh(msg.quiz);
          } else {
            vthis.quizSt.screen = 'stdPublish';
            this.quizDisplay(msg.quiz.data);
            delete virtualclass.quiz.closeQuizId;
          }
        }

        // W hen teacher close the quiz, this event will be triggered
        // At student end quiz will be submitted automatically
        // and result will display to student screen
        if ((msg.quiz.quizMsg === 'stdShowResult') || (msg.quiz.quizMsg === 'quizTimeEnd')) {
          virtualclass.quiz.publishedTime = 0;
          if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
            let closeQzBt = document.getElementById('closeQzBt');
            if (closeQzBt != null) {
              closeQzBt.disabled = true;
            }
          } else {
            if (document.querySelector('#timeText') != null) {
              document.querySelector('#timeText').textContent = 'Quiz has been closed';
            }
            const resPage = document.querySelector('#slickQuiz .quizResults');
            // console.log('====> QUIZ IS CREATING');
            if (resPage && resPage.style.display !== 'block') {
              // click submit button of student screen
              const arr = document.querySelectorAll('#slickQuiz .nextQuestion');
              const arrlength = arr.length - 1;
              arr[arrlength].click();
            }
          }
        }

        // Quiz cose at student end
        if (msg.quiz.quizMsg === 'quizClosed') {
          // localStorage.removeItem('quizSt');
          this.closeQuizId = msg.quiz.quizId;
          console.log('hello  brother => ', this.closeQuizId);
          this.quizSt = {};
          this.UI.defaultLayoutForStudent();
        }

        // teacher result progress view
        // Event will be triggerd on each answer select by student
        if (msg.quiz.quizMsg === 'quizAttempt' && roles.hasControls()) {
          const attemptedTime = virtualclass.vutil.UTCtoLocalTimeToSeconds(msg.quiz.timestamp);
          if (attemptedTime > virtualclass.quiz.publishedTime) {
            if (typeof this.attemptedUsers[msg.quiz.questionId] === 'undefined') {
              this.attemptedUsers[msg.quiz.questionId] = {};
            }
            const usrid = msg.quiz.user;
            if (typeof this.attemptedUsers[msg.quiz.questionId][usrid] === 'undefined') {
              this.attemptedUsers[msg.quiz.questionId][usrid] = {};
            }

            this.attemptedUsers[msg.quiz.questionId][usrid] = msg.quiz.ans;
            const totalAttptedUsers = Object.keys(this.attemptedUsers[msg.quiz.questionId]).length;
            let correctAns = 0;
            for (const key in this.attemptedUsers[msg.quiz.questionId]) {
              if (this.attemptedUsers[msg.quiz.questionId][key] == true) {
                correctAns++;
              }
            }
            document.getElementById(`usA_${msg.quiz.questionId}`).innerHTML = totalAttptedUsers;
            attemptPercent = 0;
            if (correctAns > 0) {
              attemptPercent = (correctAns / totalAttptedUsers) * 100;
            }
            const pBar = document.getElementById(`qPb_${msg.quiz.questionId}`);
            pBar.innerHTML = `${attemptPercent}% correct`;
            pBar.style.width = `${attemptPercent}%`;

            if (typeof this.quizAttempted[msg.quiz.questionId] === 'undefined') {
              this.quizAttempted[msg.quiz.questionId] = {};
            }
            this.quizAttempted[msg.quiz.questionId].uA = totalAttptedUsers;
            this.quizAttempted[msg.quiz.questionId].cA = correctAns;
          } else {
            console.log('Igonre the packet');
          }
        }

        // Event triggerd on quiz submit
        if (msg.quiz.quizMsg === 'quizsubmitted') {
          this.submittedTime = virtualclass.vutil.UTCtoLocalTimeToSeconds(msg.quiz.timestamp);
          if (roles.hasControls()) {
            console.log('===> quiz result quizsubmitted ');
            if (this.submittedTime > this.publishedTime) {
              this.usersFinishedQz.push(msg.quiz.user);
              const ct = this.usersFinishedQz.length;
              const userName = virtualclass.poll.capitalizeFirstLetterFnameLname(fromUser.name);
              const name = (!typeof fromUser.lname === 'undefined') ? `${fromUser.name} ${fromUser.lname}` : userName;
              this.gradeReport(ct, name, msg.quiz.timetaken, msg.quiz.score, msg.quiz.quesattemptd, msg.quiz.correctans, fromUser.userid);

              // this.qGrade.push({
              //   nm: name,
              //   tt: msg.quiz.timetaken,
              //   sc: msg.quiz.score,
              //   qAt: msg.quiz.quesattemptd,
              //   ca: msg.quiz.correctans,
              // });
              // save data in LMS DB
              if (virtualclass.config.makeWebSocketReady) {
                this.saveGradeInDb(msg.quiz.user, msg.quiz.timetaken, msg.quiz.score, msg.quiz.quesattemptd, msg.quiz.correctans);
              }
            }
          } else if (this.submittedTime > this.publishedTime) {
            if (this.closeQuizId && this.closeQuizId === msg.quiz.quizId) {
              this.quizSt = {};
              if (!virtualclass.config.makeWebSocketReady) {
                if (virtualclass.currApp === 'Quiz') {
                  this.UI.defaultLayoutForStudent();
                }
              } else {
                this.UI.defaultLayoutForStudent();
              }

            } else {
              const quizBodyContainer = document.getElementById('contQzBody');
              if (quizBodyContainer != null) {
                quizBodyContainer.parentNode.removeChild(quizBodyContainer);
              }

              const contQuizBody = document.getElementById('layoutQuizBody');
              this.UI.createMszBox(contQuizBody);
              this.UI.displayStudentResultScreen(msg.quiz);
            }
          }
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
      saveGradeInDb(userId, timeTn, grade, quesAttempted, correctAns) {
        // save data in LMS DB
        const vthis = virtualclass.quiz;
        const tt = this.convertTimeToSec(timeTn);
        const formData = new FormData();
        formData.append('cmid', vthis.cmid);
        formData.append('qzid', vthis.qzid);
        formData.append('user', userId);
        formData.append('grade', grade);
        formData.append('timetaken', tt);
        formData.append('qusattempted', quesAttempted);
        formData.append('currectans', correctAns);
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=congrea_quiz_result`, formData).then((data) => {
          if (data.data !== 'ture') {
            // console.log('Quiz data not saved in congrea');
          }
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },

      /**
       * Called on page refersh
       * display atttemped answer bar with storage data
       * @param {null}
       * @return
       */
      displayAttemptOverview() {
        const that = virtualclass.quiz;
        for (const key in that.quizAttempted) {
          document.getElementById(`usA_${key}`).innerHTML = that.quizAttempted[key].uA;
          if (that.quizAttempted[key].cA > 0) {
            const attemptPt = (that.quizAttempted[key].cA / that.quizAttempted[key].uA) * 100;
            const attemptPercent = attemptPt.toFixed(2);

            const pBar = document.getElementById(`qPb_${key}`);
            pBar.innerHTML = `${attemptPercent}% correct`;
            pBar.style.width = `${attemptPercent}%`;
          }
        }
      },

      /**
       * Called on page refersh to populate previous data
       * display grade report with stored data
       * @param {null}
       * @return
       */
      // displayGradeReport() {
      //   const that = virtualclass.quiz;
      //   for (let i = 0; i < that.qGrade.length; i++) {
      //     that.gradeReport(i + 1, that.qGrade[i].nm, that.qGrade[i].tt,
      //       that.qGrade[i].sc, that.qGrade[i].qAt, that.qGrade[i].ca);
      //   }
      // },

      /**
       * create progress overview page with
       * questions and empty progress bar
       * @param {null}
       * @return
       */
      attemptProgressReport() {
        const qzJson = virtualclass.quiz.quizJSON;
        const quizobj = JSON.parse(qzJson);
        const body = virtualclass.view.customCreateElement('div', 'attemptQzBody', 'modal-body');
        const questionArr = quizobj.questions;
        let qcount = 1;
        for (let i = 0; i < questionArr.length; i++) {
          const quesDiv = virtualclass.view.customCreateElement('div', '', 'q-area');
          body.appendChild(quesDiv);
          const quesNoDiv = virtualclass.view.customCreateElement('span', '', 'q-no');
          quesNoDiv.innerHTML = qcount;
          quesDiv.appendChild(quesNoDiv);

          const quesTxtDiv = virtualclass.view.customCreateElement('div', '', 'qscolor');
          quesTxtDiv.innerHTML = questionArr[i].q;
          quesDiv.appendChild(quesTxtDiv);
          // no of users attempted question
          const usAtdiv = virtualclass.view.customCreateElement('div');
          usAtdiv.innerHTML = `Users attempted : <span id='usA_${questionArr[i].qid}'>0</span>`;
          quesDiv.appendChild(usAtdiv);
          // progress bar
          const pbar = this.UI.createProgressBar(questionArr[i].qid, 0);
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
      tabContent() {
        const head = document.getElementById(('resultQzLayout'));
        const tcDiv = virtualclass.view.customCreateElement('div', '', 'tab-content');

        const tOvDiv = virtualclass.view.customCreateElement('div', 'qzOverv');
        tOvDiv.className = 'tab-pane fade in active';
        const qzOverviewPage = this.attemptProgressReport();
        tOvDiv.appendChild(qzOverviewPage);
        tcDiv.appendChild(tOvDiv);

        const tGrDiv = virtualclass.view.customCreateElement('div', 'gdRpt');
        tGrDiv.className = 'tab-pane fade';
        const tGdRpPage = this.UI.gradeReportLayout();
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
      gradeReport(td1v, td2v, td3v, td4v, td5v, td6v, userId) {
        const tbody = document.getElementById('qzReTbody');
        if (tbody) {
          let tr = document.getElementById(`user${userId}`);
          if (tr !== null) {
            td1v = tr.childNodes[0].innerHTML; // COUNTER
            tr.parentNode.removeChild(tr);
          }
          tr = document.createElement('tr');
          tr.id = `user${userId}`;
          tbody.appendChild(tr);

          const th = document.createElement('th');
          th.scope = 'row';
          th.innerHTML = td1v;
          tr.appendChild(th);
          const td2 = document.createElement('td');
          td2.innerHTML = td2v;
          tr.appendChild(td2);
          const td3 = document.createElement('td');
          td3.innerHTML = td3v;
          tr.appendChild(td3);
          const td4 = document.createElement('td');
          td4.innerHTML = `${td4v}%`;
          tr.appendChild(td4);
          const td5 = document.createElement('td');
          td5.innerHTML = td5v;
          tr.appendChild(td5);
          const td6 = document.createElement('td');
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
      quizTimer(duration, display, order) {
        // order asc or desc
        order = typeof order !== 'undefined' ? order : 'desc';
        let start = Date.now();
        let diff;
        let hours;
        let minutes;
        let seconds;
        if (virtualclass.gObj.CDTimer != null) {
          clearInterval(virtualclass.gObj.CDTimer);
          // console.log('Clear quiz interval');
        }


        function timer() {
          // get the number of seconds that have elapsed since
          // startTimer() was called
          if (order === 'asc') {
            diff = duration + (((Date.now() - start) / 1000) | 0);
          } else {
            diff = duration - (((Date.now() - start) / 1000) | 0);
          }
          // Setting and displaying hours, minutes, seconds
          hours = (diff / 3600) | 0;
          minutes = ((diff % 3600) / 60) | 0;
          seconds = (diff % 60) | 0;

          hours = hours < 10 ? `0${hours}` : hours;
          minutes = minutes < 10 ? `0${minutes}` : minutes;
          seconds = seconds < 10 ? `0${seconds}` : seconds;

          display.textContent = `${hours}:${minutes}:${seconds}`;
          // var ctime = hours + ":" + minutes + ":" + seconds;
          // Global scope of timer
          //  timeTakenQuiz = `${hours}:${minutes}:${seconds}`;

          if (diff <= 0) {
            if (order !== 'asc') {
              display.textContent = '00 : 00 : 00 ';
            }

            // add one second so that the count down starts at the full duration
            // example 17:00:00 not 16:59:59
            // start = Date.now() + 1000;
            start = 0;
            if (virtualclass.gObj.CDTimer != null) {
              clearInterval(virtualclass.gObj.CDTimer);
              // console.log('Clear quiz interval');
            }

            ioAdapter.mustSend({
              quiz: {
                quizMsg: 'quizTimeEnd',
                quizId: virtualclass.view.qzid,
              },
              cf: 'quiz',
            });
            if (roles.hasControls()) {
              let closeQzBt = document.getElementById('closeQzBt');
              if (closeQzBt != null) {
                closeQzBt.disabled = true;
              }
            }
          }
          // return ctime;
        }
        // don't want to wait a full second before the timer starts
        if (order !== 'asc') {
          timer();
        }
        virtualclass.gObj.CDTimer = setInterval(timer, 1000);
      },

      /**
       * Callled on click of close button of result page
       * Ask for close confirmation if yes delete
       * data form storage
       * @param {null}
       * @return
       */
      quizModalClose() {
        const that = this;
        const message = virtualclass.lang.getString('rusureCquiz');
        virtualclass.popup.confirmInput(message, (confirm) => {
          if (confirm) {
            that.quizSt = {};
            const mBody = document.getElementById('editQuizModal');
            mBody.parentNode.removeChild(mBody);
            that.attemptedUsers = {};
            that.quizAttempted = {};
            ioAdapter.mustSend({
              quiz: {
                quizMsg: 'quizClosed',
                quizId: that.qzid,
              },
              cf: 'quiz',
            });
          }
        });
      },

      /**
       * Function to convert seconds into hh:mm:ss
       * @param {int} seconds
       * @return string date
       */
      convertSecToTime(sec) {
        if (/^\d+$/.test(sec)) {
          const date = new Date(null);
          date.setSeconds(sec); // specify value for SECONDS here
          const result = date.toISOString().substr(11, 8);
          return result;
        }
        return '00:00:00';
      },

      /**
       * Function to convert hh:mm:ss into secods
       * @param {string} hh:mm:ss
       * @return string date
       */
      convertTimeToSec(hms) {
        // var hms = '02:04:33';
        if (hms) {
          const a = hms.split(':'); // specify value for SECONDS here
          const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
          return seconds;
        }
        return 0;
      },
      /**
       * Function to check json string
       * @param {string} json strin
       * @return {boolean} true/false
       */
      isJson(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      },

      sendQuizData(quizId, questionId, answer) {
        if (roles.isStudent()) {  // To avoid preview mode
          const teacherID = virtualclass.vutil.whoIsTeacher();
          ioAdapter.mustSendUser({
            quiz: {
              quizMsg: 'quizAttempt',
              quizid: quizId,
              questionId,
              ans: answer,
              user: virtualclass.gObj.uid,
              timestamp: virtualclass.vutil.localToUTC(Date.now())
            },
            cf: 'quiz',
          }, teacherID);
        }
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
        container() {
          // console.log('quiz layout check');
          const quizCont = document.getElementById(this.id);
          if (quizCont != null) {
            console.log('===> Quiz remove');
            quizCont.parentNode.removeChild(quizCont);
          }

          const divQuiz = virtualclass.view.customCreateElement('div', this.id, this.class);
          // virtualclass.vutil.insertIntoLeftBar(divQuiz);
          virtualclass.vutil.insertAppLayout(divQuiz);
          this.layout(divQuiz);
        },

        /**
         * Display quiz body header & msg
         * when first time quiz connected
         * @param div element
         * @return
         */
        layout(divQuiz) {
          const quizLayoutCont = 'bootstrap container-fluid quizLayout';
          const contQuiz = virtualclass.view.customCreateElement('div', 'layoutQuiz', quizLayoutCont);
          divQuiz.appendChild(contQuiz);

          const nav = document.createElement('nav');
          nav.className = 'nav navbar ';
          contQuiz.appendChild(nav);

          const div = virtualclass.view.customCreateElement('div', '', 'vchead');
          div.innerHTML = virtualclass.lang.getString('Quiz');
          nav.appendChild(div);

          const contQuizBody = virtualclass.view.customCreateElement('div', 'layoutQuizBody', 'quizMainCont');
          contQuiz.appendChild(contQuizBody);

          this.createMszBox(contQuizBody);
          this.createModalCont(contQuizBody);
        },

        createModalCont(contQuiz) {
          const bsCont = virtualclass.view.customCreateElement('div', 'bootstrapQzCont', 'modalCont');
          contQuiz.appendChild(bsCont);
        },

        layout2(contQuiz) {
          const ctr = document.getElementById(contQuiz);
          const text = 'Available Quizes';
          const cont = document.getElementById('listQzCont');
          if (cont == null) {
            const mainQzDiv = document.createElement('div');
            mainQzDiv.className = 'table-responsive';
            ctr.appendChild(mainQzDiv);
            const quizListTable = 'table table-bordered table-striped quizList';
            const e = virtualclass.view.customCreateElement('table', 'listQzCont', quizListTable);
            mainQzDiv.appendChild(e);
          }
        },
        /*
         Diaplay header of quiz list
         */
        listHeader() {
          const cont = document.getElementById('listQzCont');

          const headCont = document.createElement('tr');
          headCont.classList.add('headerContainer');
          headCont.id = 'headerContainer';

          cont.insertBefore(headCont, cont.firstChild);
          const controlsHeaderElem = document.createElement('th');
          controlsHeaderElem.classList.add('controlsHeader');
          controlsHeaderElem.innerHTML = virtualclass.lang.getString('Controls');
          headCont.appendChild(controlsHeaderElem);

          const iconCtr = document.createElement('i');
          iconCtr.className = 'icon-setting';
          controlsHeaderElem.appendChild(iconCtr);

          const qnTextHeaderElem = document.createElement('th');
          qnTextHeaderElem.classList.add('qnTextHeader');
          qnTextHeaderElem.innerHTML = virtualclass.lang.getString('Quizes');
          headCont.appendChild(qnTextHeaderElem);

          const iconHelp = document.createElement('i');
          iconHelp.className = 'icon-help';
          qnTextHeaderElem.appendChild(iconHelp);

          const timeHeaderElem = document.createElement('th');
          timeHeaderElem.classList.add('timeHeader');
          timeHeaderElem.innerHTML = virtualclass.lang.getString('Time');
          headCont.appendChild(timeHeaderElem);

          const iconCreator = document.createElement('i');
          iconCreator.className = 'icon-creator';
          timeHeaderElem.appendChild(iconCreator);

          const qperpageHeaderElem = document.createElement('th');
          qperpageHeaderElem.classList.add('qperpageHeader');
          qperpageHeaderElem.innerHTML = virtualclass.lang.getString('Quiz/page');
          headCont.appendChild(qperpageHeaderElem);
        },

        /**
         * Create two tab for report layout
         * @param null
         * @return
         */
        createTab() {
          const tbUl = document.createElement('ul');
          tbUl.classList.add('nav', 'nav-tabs');

          const tbLi1 = document.createElement('li');
          tbLi1.classList.add('active', 'questionPreview');
          const li1a = document.createElement('a');
          li1a.setAttribute('data-toggle', 'tab');
          li1a.href = '#qzOverv';
          li1a.innerHTML = 'Questions overview';

          tbLi1.appendChild(li1a);
          tbUl.appendChild(tbLi1);

          const tbLi2 = document.createElement('li');
          tbLi2.classList.add('reportPreview');
          const li2a = document.createElement('a');
          li2a.setAttribute('data-toggle', 'tab');
          li2a.href = '#gdRpt';
          li1a.classList.add('reportPreview');
          li2a.innerHTML = virtualclass.lang.getString('Greport');
          tbLi2.appendChild(li2a);
          tbUl.appendChild(tbLi2);
          tbLi2.addEventListener('click', () => {
            if (!tbLi2.classList.contains('active')) {
              tbLi2.classList.toggle('active');
              tbLi1.classList.toggle('active');
            }

            if (tbLi2.classList.contains('active')) {
              const rpt = document.querySelector('#gdRpt');
              rpt.className = 'tab-pane fade in active';
              const qz = document.querySelector('#qzOverv');
              qz.className = 'tab-pane fade';
            }
          });

          tbLi1.addEventListener('click', () => {
            if (!tbLi1.classList.contains('active')) {
              tbLi1.classList.toggle('active');
              tbLi2.classList.toggle('active');
            }
            if (tbLi1.classList.contains('active')) {
              const qz = document.querySelector('#qzOverv');
              qz.className = 'tab-pane fade in active';
              const rpt = document.querySelector('#gdRpt');
              rpt.className = 'tab-pane fade';
            }
          });
          return tbUl;
        },

        /**
         * Display progress/result interface to teacher
         * @param {object} qz quiz detail
         * @return
         */
        resultView(qz) {
          let order;
          let timeHeader;
          if (roles.hasControls()) {
            this.createResultLayout();

            const contQzHead = document.querySelector('#contQzHead');
            const QstnName = document.querySelector('#QstnName');
            if (QstnName == null) {
              const QstnNameElem = document.createElement('div');
              QstnNameElem.id = 'QstnName';
              QstnNameElem.innerHTML = qz.name;
              if (contQzHead != null) {
                contQzHead.appendChild(QstnNameElem);
              }
            }

            let qtime = parseInt(qz.timelimit);
            if (qtime > 0) {
              order = 'desc';
              timeHeader = 'Time remaining';
            } else {
              order = 'asc';
              timeHeader = 'Elapsed time';
            }

            /**
             * Displays the timer in result view from local storage, with or without timer,
             * it was coming from timelimit earlier
             * * */
            // let timerInfo = localStorage.getItem('quizSt');
            // if (timerInfo != null) {
            //   timerInfo = JSON.parse(timerInfo);
            //   if (Object.keys(timerInfo).length > 0) {
            //     const elTime = timerInfo.qtime;
            //     const res = elTime.split(':');
            //     qtime = parseInt(res[2]) + (parseInt(res[1]) * 60) + (parseInt(res[0]) * 3600);
            //   }
            // }
            const bodyHdCont = document.getElementById('resultQzLayout');
            if (order === 'asc') {
              bodyHdCont.classList.add('elapsedTime');
            }

            const elem = virtualclass.view.customCreateElement('div', 'rsQzHead', 'row col-md-12');
            bodyHdCont.appendChild(elem);

            // var leftdiv = virtualclass.view.customCreateElement('div','', 'col-md-6');
            // elem.appendChild(leftdiv);

            const timeInnerdiv = virtualclass.view.customCreateElement('div', '', 'timilimit col-md-3');
            timeInnerdiv.innerHTML = `Time limit : <span> ${virtualclass.quiz.convertSecToTime(qz.timelimit)}</span>`;
            elem.appendChild(timeInnerdiv);

            const qNoInnerdiv = virtualclass.view.customCreateElement('div', '', 'col-md-3');
            qNoInnerdiv.innerHTML = `No of questions : <span> ${qz.noOfQus}</span>`;
            elem.appendChild(qNoInnerdiv);

            // var rightdiv = virtualclass.view.customCreateElement('div', '','col-md-6');
            // elem.appendChild(rightdiv);

            const elstimeInnerdiv = virtualclass.view.customCreateElement('div', '', 'col-md-4');
            elstimeInnerdiv.innerHTML = `${timeHeader} : <span id="elsTime">00:00:00</span>`;
            elem.appendChild(elstimeInnerdiv);

            const btnInnerdiv = virtualclass.view.customCreateElement('button', 'closeQzBt', '');
            btnInnerdiv.classList.add('btn', 'btn-default', 'controls');
            btnInnerdiv.innerHTML = virtualclass.lang.getString('Cquiz');
            elem.appendChild(btnInnerdiv);
            btnInnerdiv.addEventListener('click', virtualclass.quiz.closeQzBt);

            // const storedData = JSON.parse(localStorage.getItem('quizSt'));

            // if (storedData != null && (storedData.qClosed == 'true' || storedData.qClosed)) {
            //   // console.log("Don't run timer when quiz is closed");
            //   const elapsedTime = document.querySelector('#elsTime');
            //   // localStorage.setItem('quizSt', JSON.stringify(storedData));
            //   if (elapsedTime != null) {
            //     elapsedTime.innerHTML = storedData.qtime;
            //   }
            // } else {
            //   virtualclass.quiz.quizTimer(qtime, document.getElementById('elsTime'), order);
            // }

            if (order === 'asc' && typeof virtualclass.quiz.publishedTime !== 'undefined'
              && !virtualclass.config.makeWebSocketReady) {
              const publishTime = virtualclass.quiz.publishedTime;
              const publishTimeInMiliSeconds = virtualclass.vutil.UTCtoLocalTimeToSeconds(publishTime);
              qtime = (new Date().getTime() - publishTimeInMiliSeconds) / 1000;
              if (qtime < 0 || virtualclass.quiz.publishedTime === 0) {
                qtime = 0;
              }
            } else {
              qtime = virtualclass.quiz.calculateRemainingTime(+(qz.timelimit));
            }

            virtualclass.quiz.quizTimer(qtime, document.getElementById('elsTime'), order);

            const tbUl = this.createTab();
            bodyHdCont.appendChild(tbUl);
            // var maxMarksdiv = virtualclass.view.customCreateElement('div', 'maxMark','');
          }
        },

        /**
         * Replace preview window into result popup
         * @param null
         * @return
         */
        createResultLayout() {
          const resultLayout = document.getElementById('resultQzLayout');
          if (resultLayout) {
            resultLayout.parentNode.removeChild(resultLayout);
          }
          if (roles.hasControls()) {
            const head = document.getElementById(('contQzHead'));
            if (pubbtn = document.getElementById('publishQzBt')) {
              pubbtn.parentNode.removeChild(pubbtn);
            }
            const closebt = document.querySelector('#contQzHead .close');
            if (closebt) {
              closebt.parentNode.removeChild(closebt);
              const el = virtualclass.view.customCreateElement('div', 'modalQzClose', 'close');
              el.type = 'button';
              // el.setAttribute("data-dismiss", "modal");
              el.innerHTML = '&times';
              head.appendChild(el);
            }

            const cont = document.getElementById('quizModalBody');
            if (cont) {
              while (cont.childElementCount > 1) {
                cont.removeChild(cont.lastChild);
              }
            }

            const elem = document.createElement('div');
            elem.id = 'resultQzLayout';
            cont.appendChild(elem);

            const modalClose = document.getElementById('modalQzClose');
            modalClose.addEventListener('click', () => {
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
        createProgressBar(quesid, value) {
          const pbarOuterdiv = virtualclass.view.customCreateElement('div', '', 'progress');
          const pbarinnerdiv = virtualclass.view.customCreateElement('div', `qPb_${quesid}`, 'progress-bar');
          pbarinnerdiv.role = 'progressbar';
          pbarinnerdiv.setAttribute('setaria-valuenow', value);
          pbarinnerdiv.setAttribute('aria-valuemin', '0');
          pbarinnerdiv.setAttribute('aria-valuemax', '100');
          pbarinnerdiv.style = `width:${value}%`;
          pbarinnerdiv.innerHTML = `${value}% Correct`;
          pbarOuterdiv.appendChild(pbarinnerdiv);
          return pbarOuterdiv;
        },

        /**
         * Create grade report layout, in later
         * stage value will populated
         * @param null
         * @return
         */
        gradeReportLayout() {
          const body = virtualclass.view.customCreateElement('div', 'gradeRpBody', 'modal-body');

          const quesDiv = virtualclass.view.customCreateElement('table', '', 'table');
          const thead = virtualclass.view.customCreateElement('thead', '', 'thead-inverse');
          const tr = document.createElement('tr');
          const th1 = document.createElement('th');
          th1.innerHTML = '#';
          tr.appendChild(th1);
          const th2 = document.createElement('th');
          th2.innerHTML = 'Name';
          tr.appendChild(th2);
          const th3 = document.createElement('th');
          th3.innerHTML = 'Time taken';
          tr.appendChild(th3);
          const th4 = document.createElement('th');
          th4.innerHTML = 'Grade';
          tr.appendChild(th4);
          const th5 = document.createElement('th');
          th5.innerHTML = 'Q. attempted';
          tr.appendChild(th5);
          const th6 = document.createElement('th');
          th6.innerHTML = 'Correct';
          tr.appendChild(th6);

          thead.appendChild(tr);
          quesDiv.appendChild(thead);

          const tbody = virtualclass.view.customCreateElement('tbody', 'qzReTbody');
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
        displayStudentResultScreen(data) {
          const totalScore = (((+data.maxmarks) / data.noofqus) * data.correctans).toFixed(2);
          // console.log('====> Create message box 2');
          // var resPage = document.querySelector("#slickQuiz .quizResults");
          const msgPage = document.getElementById('mszBoxQuiz');

          if (msgPage) {
            const sqm = document.getElementById('stdQuizMszLayout');
            if (sqm) {
              msgPage.removeChild(sqm);
            }
            const resultDiv = document.getElementById('resultDiv');
            if (resultDiv != null) {
              resultDiv.parentNode.removeChild(resultDiv);
            }

            const resPage = virtualclass.view.customCreateElement('div', 'resultDiv');
            msgPage.appendChild(resPage);

            const noOfQ = document.createElement('h4');
            noOfQ.innerHTML = `Total no of questions: ${data.noofqus}</span>`;
            resPage.appendChild(noOfQ);

            const tt = document.createElement('h4');
            tt.innerHTML = `Time taken: ${data.timetaken}</span>`;
            resPage.appendChild(tt);

            const mm = document.createElement('h4');
            mm.innerHTML = `Maximum mark: ${(+data.maxmarks).toFixed(2)}</span>`;
            resPage.appendChild(mm);

            const ca = document.createElement('h4');
            ca.innerHTML = `Correct answers: ${data.correctans}</span>`;
            resPage.appendChild(ca);

            const qa = document.createElement('h4');
            qa.innerHTML = `Questions attempted: ${data.quesattemptd}</span>`;
            resPage.appendChild(qa);

            const sc = document.createElement('h3');
            sc.className = 'quizScore';
            sc.innerHTML = `You Scored: <i>${totalScore} / ${(+data.maxmarks).toFixed(2)}</i></span>`;
            resPage.appendChild(sc);

            resPage.style.display = 'block';
          }
          const virtualclassCont = document.querySelector('#virtualclassCont');
          if(virtualclass.system.device === 'mobTab') {
            virtualclassCont.classList.add('customResult');
          }
        },

        createMszBox(cont) {
          const elem = virtualclass.view.customCreateElement('div', 'mszBoxQuiz', 'row');
          cont.appendChild(elem);
        },

        generateModal(id, bsCont) {
          const modal = virtualclass.view.customCreateElement('div', id, 'modal');
          modal.role = 'dialog';
          modal.style.display = 'none';
          modal.setAttribute('tab-index', '-1');
          modal.setAttribute('area-hidden', 'true');
          bsCont.appendChild(modal);

          const dialog = document.createElement('div');
          dialog.className = 'modal-dialog';
          modal.appendChild(dialog);

          const content = virtualclass.view.customCreateElement('div', 'quizModalBody', 'modal-content');
          dialog.appendChild(content);

          const head = virtualclass.view.customCreateElement('div', 'contQzHead', 'modal-header');
          content.appendChild(head);

          const el = virtualclass.view.customCreateElement('div', '', 'close');
          el.type = 'button';
          el.setAttribute('data-dismiss', 'modal');
          el.innerHTML = '&times';
          head.appendChild(el);

          const body = virtualclass.view.customCreateElement('div', 'contQzBody', 'modal-body');
          content.appendChild(body);

          const close = document.querySelector('#editQuizModal #contQzHead .close ');
          close.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.className = 'modal fade';
          });
        },

        modalContentUI() {
          // Quiz display container
          const body = document.getElementById('contQzBody');

          const skQzCont = virtualclass.view.customCreateElement('div', 'slickQuiz', 'path-mod-congrea-quiz');
          const qzName = virtualclass.view.customCreateElement('h3', '', 'quizName');
          skQzCont.appendChild(qzName); // quiz name div

          const qzTime = virtualclass.view.customCreateElement('P', 'timeText');
          skQzCont.appendChild(qzTime); // quiz timer p

          const skQzNav = virtualclass.view.customCreateElement('div', 'exam_navblock', 'navblock');
          skQzCont.appendChild(skQzNav); // //quiz questions navigation

          const skQzNavCont = virtualclass.view.customCreateElement('div', '', 'content');
          skQzNav.appendChild(skQzNavCont);

          const skQzNavContBt = virtualclass.view.customCreateElement('div', '', 'qn_buttons multipages');
          skQzNavCont.appendChild(skQzNavContBt);

          const qzArea = virtualclass.view.customCreateElement('div', '', 'quizArea');
          skQzCont.appendChild(qzArea);
          const qzheader = virtualclass.view.customCreateElement('div', '', 'quizHeader');
          qzArea.appendChild(qzheader);

          const qzheaderA = virtualclass.view.customCreateElement('a', '', 'button startQuiz');
          qzheaderA.href = '#';
          qzheaderA.innerHTML = 'Get Started!';
          qzheader.appendChild(qzheaderA);

          // alert('I am here. add result div');
          // console.log('====> QUIZ IS CREATING');
          const qzResult = virtualclass.view.customCreateElement('div', '', 'quizResults');
          skQzCont.appendChild(qzResult);

          const qzScr = virtualclass.view.customCreateElement('h3', '', 'quizScore');
          qzScr.innerHTML = 'You Scored: <span></span>';
          qzResult.appendChild(qzScr);

          const qzLevel = virtualclass.view.customCreateElement('h3', '', 'quizLevel');
          qzheaderA.innerHTML = '<strong>Ranking:</strong> <span></span>';
          qzResult.appendChild(qzLevel);

          const qzRsCpy = virtualclass.view.customCreateElement('div', '', 'quizResultsCopy');
          qzResult.appendChild(qzRsCpy);
          body.appendChild(skQzCont);
        },

        /*
         Create div with unique id for quiz list display
         */
        qzCont(index) {
          const list = document.getElementById('listQzCont');
          const elem = virtualclass.view.customCreateElement('tr', `contQz${index}`, 'vcQuizCont');
          if (list != null) {
            list.insertBefore(elem, list.firstChild);
          }
        },

        qzCtrCont(index) {
          const e = document.getElementById(`contQz${index}`);
          const ctrCont = virtualclass.view.customCreateElement('td', `ctrQz${index}`, 'quizCtrCont');
          e.appendChild(ctrCont);

          const link2 = document.createElement('a');
          link2.href = '#';
          link2.id = `publishQz${index}`;

          ctrCont.appendChild(link2);

          const sp = document.createElement('span');
          sp.className = 'icon-publish2';
          sp.setAttribute('data-toggle', 'tooltip');
          sp.setAttribute('title', virtualclass.lang.getString('quizreviewpublish'));

          link2.appendChild(sp);
        },

        qzTextCont(item, index) {
          const e = document.getElementById(`contQz${index}`);
          const qzCont = document.createElement('td');
          let tLimit;
          qzCont.classList.add('qnText');
          qzCont.innerHTML = item.name;
          e.appendChild(qzCont);

          const creatorElem = document.createElement('td');
          creatorElem.classList.add('creator');

          if (item.timelimit > 0) {
            tLimit = virtualclass.quiz.convertSecToTime(item.timelimit);
          } else {
            tLimit = item.timelimit;
          }
          creatorElem.innerHTML = tLimit;
          e.appendChild(creatorElem);

          const qperpageElem = document.createElement('td');
          qperpageElem.classList.add('qperpage');

          qperpageElem.innerHTML = item.questionsperpage;
          e.appendChild(qperpageElem);
        },

        defaultLayoutForStudent() {
          this.container();
          const mszCont = document.getElementById('mszBoxQuiz');
          const messageLayoutId = 'stdQuizMszLayout';
          if (document.getElementById(messageLayoutId) == null) {
            const studentMessage = virtualclass.view.customCreateElement('div', messageLayoutId);
            studentMessage.innerHTML = virtualclass.lang.getString('quizmayshow');
            mszCont.appendChild(studentMessage);
          }
        },
      },

      createMessageBox() {
        // console.log('=====> CREATE MESSAGE BOX');
        const mszCont = document.getElementById('mszBoxQuiz');
        const messageLayoutId = 'stdQuizMszLayout';
        if (document.getElementById(messageLayoutId) == null) {
          const studentMessage = virtualclass.view.customCreateElement('div', messageLayoutId);
          studentMessage.innerHTML = virtualclass.lang.getString('quizmayshow');
          mszCont.appendChild(studentMessage);
        }
      },

      sendSubmittedQuiz(msg) {
        const teacherID = virtualclass.vutil.whoIsTeacher();
        ioAdapter.mustSendUser({
          quiz: {
            quizMsg: 'quizsubmitted',
            quizId: this.qzid,
            user: virtualclass.gObj.uid,
            timestamp: virtualclass.vutil.localToUTC(Date.now()),
            timetaken: msg.timetaken,
            quesattemptd: msg.quesattemptd,
            correctans: msg.correctans,
            score: msg.score,
            maxmarks: msg.maxmarks,
            noofqus: msg.noofqus,
          },
          cf: 'quiz',
        }, teacherID);
      },

      calculateRemainingTime(totalTimeInSec) {
        if (typeof virtualclass.quiz.publishedTime !== 'undefined' && (roles.isStudent()
          || (roles.hasControls() && !virtualclass.config.makeWebSocketReady))) {
          if (virtualclass.quiz.publishedTime === 0) {
            return totalTimeInSec;
          } else {
            const totalDiff = (new Date().getTime() - virtualclass.quiz.publishedTime);
            let timeLeft = ((totalTimeInSec * 1000) - totalDiff) / 1000;
            if (timeLeft < 0) {
              timeLeft = 0;
            }
            return timeLeft;
          }
        } else {
          return totalTimeInSec;
        }
      },

      scrollToTop() {
        const quizArea = document.querySelector('#slickQuiz .quizArea');
        if (quizArea != null) {
          quizArea.scrollTop = 0;
        }
      },
    };
  };
  window.quiz = quiz;
}(window));
