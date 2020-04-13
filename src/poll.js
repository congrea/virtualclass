// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2016  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Nirmala Mehta <http://www.vidyamantra.com>
 * This file is responsible for poll creating ,publishing,result display
 * saving polls in database and retrieving .

 */
(function (window) {
  'use strtic';

  var poll = function () {
    return {
      coursePoll: [],
      sitePoll: [],
      setting: {
        showResult: true,
        timer: true,
        time: {},
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
      currResultView: 'bar',
      tStamp: [],
      pollState: {},
      // exportfilepath: window.exportfilepath,
      uniqueUsers: [],
      init() {
        this.pollState = {};
        virtualclass.previrtualclass = 'virtualclassPoll';
        virtualclass.previous = virtualclass.previrtualclass;
        // const urlquery = virtualclass.vutil.getUrlVars(exportfilepath);
        const urlquery = virtualclass.vutil.getUrlVars(window.webapi);
        this.cmid = urlquery.cmid;
        if (this.timer) {
          clearInterval(this.timer);
        }
        if (roles.isStudent()) {
          this.UI.defaultLayoutForStudent();
        } else {
          this.UI.container();
          ioAdapter.mustSend({ poll: { pollMsg: 'init' }, cf: 'poll' });
        }
        if (!virtualclass.isPlayMode && roles.hasControls()) {
          this.interfaceToFetchList(this.cmid);
        }
      },

      /*
       *
       * @param {object} create poll data
       * @param {type} category
       * @response text  {object}
       * poll interface to save poll in moodle database
       */
      interfaceToSave(data) {
        const that = this;
        const formData = new FormData();
        formData.append('dataToSave', JSON.stringify(data));
        formData.append('user', virtualclass.gObj.uid);
        // TODO Handle more situations
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=poll_save`, formData).then((msg) => {
          const getContent = msg.data;
          const { options } = getContent;
          const obj = {};
          const optObj = {};
          options.forEach((obj) => {
            const temp = {};
            temp.id = obj.optid;
            temp.options = obj.options;
            optObj[obj.optid] = temp.options;
          });
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
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
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
      interfaceToEdit(data) {
        const that = this;
        const formData = new FormData();
        formData.append('editdata', JSON.stringify(data));
        formData.append('user', virtualclass.gObj.uid);
        // TODO Handle more situations
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=poll_update`, formData).then((msg) => {
          const getContent = msg.data;
          // console.log(getContent);
          that.updatePollList(getContent);
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },

      /*
       *
       * @param {object} new created poll or updated poll  with ids returned from database
       *
       * poll list is updated
       */
      updatePollList(content) {
        const { options } = content;
        const obj = {};
        const optObj = {};

        options.forEach((ob) => {
          const temp = {};
          temp.id = ob.id;
          optObj[ob.id] = ob.options;
        });
        obj.questionid = content.qid;
        obj.category = content.category;
        obj.createdby = content.createdby;
        obj.questiontext = content.question;
        obj.creatorname = content.creatorname;
        obj.options = optObj;

        this.currQid = content.qid;
        this.currOption = optObj;

        const poll = (obj.category) ? this.coursePoll : this.sitePoll;
        poll.push(obj);
        this.interfaceToFetchList(obj.category);
      },
      interfaceToFetchList(category) {
        const that = this;
        const formData = new FormData();
        formData.append('category', JSON.stringify(category));
        formData.append('user', virtualclass.gObj.uid);
        virtualclass.recorder.items = []; // empty on each chunk sent
        // TODO Handle more situations
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=poll_data_retrieve`, formData).then((msg) => {
          // console.log("fetched" + msg);
          //  later in php file
          const getContent = msg.data;
          for (let i = 0; i <= getContent.length - 1; i++) {
            const { options } = getContent[i];
            for (const j in options) {
              getContent[i].options[j] = options[j].options;
              // console.log(`getContent ${getContent[i]}`);
            }
          }
          // console.log(getContent);
          const isAdmin = getContent.pop();
          if (JSON.parse(category)) {
            that.coursePoll = getContent;
            that.displaycoursePollList();
          } else {
            that.sitePoll = getContent;
            that.displaysitePollList(isAdmin);
          }
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },
      interfaceToDelete(qid) {
        const that = this;
        const formData = new FormData();
        formData.append('qid', JSON.stringify(qid));
        formData.append('user', virtualclass.gObj.uid);
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=poll_delete`, formData).then((msg) => {
          const getContent = msg.data;
          if (msg.data && msg.data !== '') {
            that.interfaceToFetchList(getContent);
          }
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },
      interfaceToDelOption(optionId) {
        const formData = new FormData();
        formData.append('id', JSON.stringify(optionId));
        formData.append('user', virtualclass.gObj.uid);
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=poll_option_drop`, formData).then(() => {
          // nothing to do
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },
      interfaceToSaveResult(data) {
        const that = this;
        const formData = new FormData();
        formData.append('saveResult', JSON.stringify(data));
        formData.append('user', virtualclass.gObj.uid);
        virtualclass.xhr.vxhr.post(`${window.webapi}&methodname=poll_result`, formData).then((msg) => {
          if (msg.data !== '' || (msg.statusText === 'OK' && msg.data === 0)) {
            that.interfaceToFetchList(msg.data);
          }
        })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },


      reloadPollList(storedData, pollType) {
        const coursePollTab = document.getElementById('coursePollTab');
        const sitePollTab = document.getElementById('sitePollTab');
        let category = 0;
        if (pollType === 'course') {
          sitePollTab.classList.remove('active');
          coursePollTab.classList.add('active');
          category = this.cmid;
        } else {
          coursePollTab.classList.remove('active');
          sitePollTab.classList.add('active');
        }
        this.interfaceToFetchList(category);
      },


      reloadVotedScrn() {
        this.dataRec.newTime = 0;
        const elem = document.getElementById('stdPollMszLayout');
        if (elem) {
          elem.parentNode.removeChild(elem);
        }
        const stdPollContainer = document.getElementById('stdPollContainer');
        if (stdPollContainer) {
          stdPollContainer.style.display = 'none';
        }

        let msg = '';
        if (this.dataRec.setting.showResult) {
          msg = virtualclass.lang.getString('votesuccess');
        } else {
          msg = virtualclass.lang.getString('votesuccessPbt');
        }
        this.showMsg('mszBoxPoll', msg, 'alert-success');

        this.pollState.currScreen = 'voted';
        this.pollState.data = this.dataRec;
        this.pollState.timer = this.newUserTime;
      },

      reloadStdResult(storedData) {
        const mszbox = document.getElementById('mszBoxPoll');
        if (mszbox) {
          mszbox.style.display = 'none';
        }
        // this.dataRec = storedData.data.stdPoll;
        this.dataRec = storedData.data;
        if (this.dataRec) {
          this.dataRec.newTime = storedData.data.timer;
        }
        this.count = storedData.data.count;
        console.log('====> student submit poll ', this.count);
        // console.log('====> POLL COUNT', this.count);
        this.currResultView = storedData.data.view;
        this.stdPublishResult(this.count);
        if (this.currResultView === 'bar') {
          this.updateBarGraph();
        } else if (this.currResultView === 'pi') {
          this.createPiChart();
          this.updatePiChart();
        }

        this.pollState.currScreen = 'stdPublishResult';
        this.pollState.data = this.dataRec;
        this.pollState.timer = this.newUserTime;
        this.pollState.count = this.count;
        // console.log('====> POLL COUNT', this.count);
        this.pollState.view = this.currResultView;
      },

      // timer to..
      loadTeacherScrn(storedData) {
        // console.log('currentscreenpublish');
        storedData.data.view = storedData.data.view || 'bar';
        this.dataToStd.question = storedData.data.question;
        this.dataToStd.options = storedData.data.options;
        this.dataToStd.qId = storedData.data.qId;

        this.setting = storedData.data.setting;
        this.newUserTime = storedData.data.newTime;
        this.newTime = storedData.data.newTime;

        // this.nTimer = storedData.data.newTime;
        this.nTimer = storedData.data.newTime;

        // virtualclass.poll.afterReload=storedData.data.newTime;
        // this.count = storedData.data.count;
        // console.log('====> student submit poll ', this.count);
        // console.log('====> POLL COUNT', this.count);
        this.currResultView = storedData.data.view;
        this.uniqueUsers = storedData.data.users;
        const { pollType } = storedData.data;
        const coursePollTab = document.getElementById('coursePollTab');
        const sitePollTab = document.getElementById('sitePollTab');
        let category = 0;
        if (pollType === 'course') {
          sitePollTab.classList.remove('active');
          coursePollTab.classList.add('active');
          category = this.cmid;
        } else {
          coursePollTab.classList.remove('active');
          sitePollTab.classList.add('active');
        }
        this.interfaceToFetchList(category);
        this.list = storedData.data.list;
        const data = {
          question: this.dataToStd.question,
          options: this.dataToStd.options,
          setting: this.setting,
          newTime: this.nTimer,
          count: this.count,
          view: this.currResultView,
          list: this.list,
          totalUsers: storedData.data.totalUsers,
          users: this.uniqueUsers,
          pollType,
          qId: storedData.data.qId,

        };

        console.log('====> student submit poll ', this.count);


        if (storedData.pollClosed !== 'yes') {
          this.reloadTeacherPublish(storedData);
        }
        if (typeof storedData.data.pollClosed !== 'undefined' && storedData.pollClosed !== 'yes') {
          this.UI.pollClosedUI();
          const msg = virtualclass.lang.getString('Pclosed');
          this.showMsg('resultLayoutHead', msg, 'alert-success');
          if (this.timer) {
            clearInterval(this.timer);
          }
          this.testNoneVoted(virtualclass.poll.count);
          const msz = document.getElementById('pollResultMsz');
          if (msz) {
            msz.parentNode.removeChild(msz);
          }

          data.pollClosed = 'yes';
          this.pollState.pollClosed = 'yes';
        }
        this.pollState.data = data;
        this.pollState.currScreen = 'teacherPublish';
        localStorage.removeItem('pollState');
      },

      reloadTeacherPublish(storedData) {
        const { pollType } = storedData.data;
        virtualclass.modal.closeModalHandler('editPollModal');
        const isTimer = this.setting.timer;
        this.UI.resultView(isTimer, pollType);
        this.list = storedData.data.list;
        this.count = storedData.data.count;
        // console.log('====> student submit poll ', this.count);
        // console.log('====> POLL COUNT', this.count);
        this.currResultView = storedData.data.view;
        const { totalUsers } = storedData.data;
        this.reloadGraph();
        // this.updateVotingInformation(totalUsers);
        this.updateVotingInformation();

        if (isTimer) {
          let elem;
          const [hour, min, sec] = this.getFormatedTime();
          if (min || sec > 1) {
            const timerWrapper = document.getElementById('timerWrapper');
            if (timerWrapper) {
              elem = document.createElement('div');
              elem.id = 'timerCont';
              timerWrapper.appendChild(elem);
            }
            this.remainingTimer({ hour, min, sec });
          } else if (min || sec <= 1) {
            const timerWrapper = document.getElementById('timerWrapper');
            if (timerWrapper) {
              elem = document.createElement('div');
              elem.id = 'timerCont';
              timerWrapper.appendChild(elem);
            }
            elem.innerHTML = `${min < 10 ? `0${min}` : min}:${sec < 10 ? '00' : sec}`;
            // this.testNoneVoted();
            const msz = document.getElementById('pollResultMsz');
            if (msz) {
              msz.parentNode.removeChild(msz);
            }
          }
        } else {
          this.triggerElapseTimer();
        }

        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
          modalClose.removeAttribute('data-dismiss');
          modalClose.addEventListener('click', () => {
            virtualclass.poll.pollModalClose(pollType);
          });
        }
        // this.count = storedData.data.count;
        this.pollState.currScreen = 'teacherPublish';
      },

      pollModalClose(pollType) {
        const pollList = 'displaycoursePollList';
        const siteList = 'displaysitePollList';
        if (roles.hasControls() && virtualclass.poll.pollState.currScreen
          && virtualclass.poll.pollState.currScreen === 'teacherPublish') {
          virtualclass.poll.pollState.currScreen = (pollType === 'course') ? pollList : siteList;
        }

        const message = virtualclass.lang.getString('pclosetag');
        virtualclass.popup.confirmInput(message, this.resultCloseConfirm, pollType);
      },

      resultCloseConfirm(opted) {
        if (opted) {
          const modal = document.querySelector('#editPollModal');
          if (modal) {
            modal.remove();
          }
          if (virtualclass.poll.timer) {
            // console.log('====> Poll student publish result 3');
            ioAdapter.mustSend({
              poll: {
                pollMsg: 'stdPublishResult',
                data: virtualclass.poll.count,
              },
              cf: 'poll',
            });

            virtualclass.poll.resultToStorage();
            const saveResult = {
              qid: virtualclass.poll.dataToStd.qId,
              list: virtualclass.poll.list,
            };
            virtualclass.poll.interfaceToSaveResult(saveResult);
            clearInterval(virtualclass.poll.timer);
            virtualclass.poll.timer = 0;
          }

          const elem = document.getElementById('congreaPollVoters');
          if (elem) {
            elem.innerHTML = virtualclass.lang.getString('receivedVotes');
          }
          virtualclass.poll.count = {};

          ioAdapter.mustSend({
            poll: {
              pollMsg: 'completeClose',
            },
            cf: 'poll',
          });
          // console.log('====> POLL COUNT', this.count);
        }
      },
      resultToStorage() {
        const data = roles.hasControls() ? this.dataToStd : this.dataRec;
        if (data) {
          const obj = { result: this.count, qid: data.qId, pollData: data };
          this.uid++;
          obj.uid = this.uid;
        }
      },

      reloadGraph() {
        if (this.currResultView === 'bar') {
          this.showGraph();
          this.updateBarGraph();
        } else if (this.currResultView === 'pi') {
          this.createPiChart();
          this.updatePiChart();
        } else if (this.currResultView === 'list') {
          this.listView();
        }
        const elem = document.getElementsByClassName('emptyList');
        if (this.list.length > 0) {
          for (let i = 0; i < elem.length; i++) {
            elem[i].style.display = 'none';
          }
        } else {
          virtualclass.poll.hideChart();
          // const chart = document.getElementById('chart');
          // chart.style.display = 'none';
        }
        const menu = document.querySelectorAll('#chartMenuCont button');
        if (menu) {
          for (let i = 0; i < menu.length; i++) {
            menu[i].classList.remove('disabled');
          }
        }
      },

      // At student end
      onmessage(msg, fromUser) {
        if (msg.poll.pollMsg === 'stdPublish') {
          this.dataRec = msg.poll.data;
        } else if (roles.isStudent() && msg.poll.pollMsg === 'stdResponse' // This for retain screen after submitting the vote
          && virtualclass.poll.pollState.currScreen !== 'stdPublishResult'
          && virtualclass.poll.pollState.data.qId === msg.poll.qId) {
          this.reloadVotedScrn(msg.poll);
        }

        if (msg.poll.pollMsg === 'stdResponse') {
          if (msg.poll.qId === virtualclass.poll.pollState.data.qId) {
            virtualclass.poll[msg.poll.pollMsg].call(this, msg.poll.data, fromUser);
          }
        } else {
          virtualclass.poll[msg.poll.pollMsg].call(this, msg.poll.data, fromUser);
        }
      },

      pollPopUp(cb, index, pollType) {
        const attachInit = function () {
          // console.log(this.id);
          virtualclass.poll.action(this.id, cb, index, pollType);
          if (this.id === 'goBack' || this.id === 'cacelSetting') {
            virtualclass.modal.removeModal();
          }
        };
        const editPoll = document.getElementById('editPollModal');
        const modal = document.getElementById('editPollModal') ? editPoll : document.getElementById('qnPopup');
        const controls = modal.querySelectorAll('#pollModalBody .controls');
        for (let i = 0; i < controls.length; i++) {
          controls[i].addEventListener('click', attachInit);
        }
      },
      attachConfirmInit(id, cb, index, pollType) {
        const that = this;
        that.action(id, cb, index, pollType);
      },
      action(id, cb, index, pollType) {
        cb(id, index, pollType);
      },
      // to gerealize later for course and site
      displaycoursePollList() {
        let mszbox;
        const that = this;
        this.dispList('course');
        const listcont = document.querySelector('#listQnContcourse tbody');
        // *****reminder**change
        if (listcont) {
          while (listcont.childNodes.length) {
            listcont.removeChild(listcont.lastChild);
          }
        }
        // to modify parameters ...********
        const list = document.querySelector('#listQnContcourse');
        if (this.coursePoll.length) {
          if (list) {
            list.style.display = 'block';
          }

          mszbox = document.querySelector('#mszBoxPoll');
          mszbox.style.display = 'none';
          this.coursePoll.forEach((item, index) => {
            that.forEachPoll(item, index, 'course');
          });
        } else {
          mszbox = document.querySelector('#mszBoxPoll');
          const message = virtualclass.lang.getString('noPoll');
          mszbox.style.display = 'block';
          mszbox.innerHTML = message;
          if (list) {
            list.style.display = 'none';
          }
        }

        const elem = document.getElementById('emptyListsite');
        if (elem) {
          elem.parentNode.removeChild(elem);
        }

        this.dispNewPollBtn('course');
        if (this.pollState.currScreen !== 'teacherPublish') {
          this.pollState.currScreen = 'displaycoursePollList';
        }
      },

      displaysitePollList(isAdmin) {
        let mszbox;
        const that = this;
        this.dispList('site');
        const listcont = document.querySelector('#listQnContsite tbody');
        if (listcont) {
          while (listcont.childNodes.length) {
            listcont.removeChild(listcont.lastChild);
          }
        }
        const list = document.querySelector('#listQnContsite');
        if (this.sitePoll.length) {
          this.sitePoll.forEach((item, index) => {
            that.forEachPoll(item, index, 'site', isAdmin);
          });

          if (list) {
            list.style.display = 'block';
          }
          mszbox = document.querySelector('#mszBoxPoll');
          mszbox.style.display = 'none';
        } else {
          mszbox = document.querySelector('#mszBoxPoll');
          let message = virtualclass.lang.getString('noPoll');
          if (isAdmin === 'false') {
            message = virtualclass.lang.getString('noPollNoAdmin');
          }

          mszbox.style.display = 'block';
          mszbox.innerHTML = message;
          if (list) {
            list.style.display = 'none';
          }
        }
        const elem = document.getElementById('emptyListcourse');
        if (elem) {
          elem.parentNode.removeChild(elem);
        }

        this.dispNewPollBtn('site', isAdmin);
        if (this.pollState.currScreen !== 'teacherPublish') {
          this.pollState.currScreen = 'displaysitePollList';
        }
      },

      dispList(pollType) {
        const mszbox = document.getElementById('mszBoxPoll');
        if (mszbox.childNodes.length > 0) {
          mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
        }

        const hide = pollType === 'course' ? 'site' : 'course';
        this.hidePollList(hide);
        const listCont = document.getElementById(`listQnCont${pollType}`);
        if (listCont) {
          listCont.style.display = 'table';
          const elem = document.getElementById(`newPollBtn${pollType}`);
          if (elem) {
            if (elem.classList.contains(hide)) {
              elem.classList.remove(hide);
              elem.classList.add(pollType);
            }
          }
        }

        // else {
        //   this.UI.layout2('layoutPollBody', pollType);
        // }
      },
      dispNewPollBtn(pollType, isAdmin) {
        this.attachEvent(`newPollBtn${pollType}`, 'click', this.newPollHandler, pollType);
        const btn = document.getElementById(`newPollBtn${pollType}`);
        let siteHead;
        let elem;
        if (pollType === 'site') {
          if (typeof isAdmin !== 'undefined' && isAdmin === 'true') {
            btn.style.display = 'table';
          } else {
            btn.style.display = 'none';
            if (roles.hasControls) {
              siteHead = document.getElementById('listQnContsite');
              siteHead.classList.add('teacherTableHeader');
            }
          }

          elem = document.getElementById('newPollBtncourse');
          if (elem) {
            elem.style.display = 'none';
          }
        } else {
          if (roles.hasControls) {
            siteHead = document.getElementById('listQnContsite');
            siteHead.classList.remove('teacherTableHeader');
          }
          btn.style.display = 'table';
          elem = document.getElementById('newPollBtnsite');
          if (elem) {
            elem.style.display = 'none';
          }
        }
      },
      forEachPoll(item, index, pollType, isAdmin) {
        const pollQn = {};
        let link1;
        pollQn.questiontext = item.questiontext;
        const name = (Object.prototype.hasOwnProperty.call(item, 'creatorfname')) ? virtualclass.poll.capitalizeFirstLetterFnameLname(item.creatorfname) : virtualclass.poll.capitalizeFirstLetterFnameLname(item.creatorname);
        pollQn.creator = name;
        pollQn.pollType = pollType;
        pollQn.index = index;

        const template = virtualclass.getTemplate('qn', 'poll');
        const list = document.querySelector(`#listQnCont${pollType} .pollList tbody`) || document.querySelector(`#listQnCont${pollType} .pollList`);
        list.insertAdjacentHTML('beforeend', template({ pollQn }));

        if (((pollType === 'course' && item.createdby === wbUser.id) || (pollType === 'site' && isAdmin === 'true'))) {
          if (!item.isPublished) {
            this.attachEvent(`editQn${pollType}${index}`, 'click', this.editHandler, item, pollType, index, item.createdby, item.questionid);
          } else {
            link1 = document.querySelector(`#editQn${pollType}${index} span`);
            if (link1) {
              link1.setAttribute('title', virtualclass.lang.getString('etDisabledA'));
              link1.style.cursor = 'default';
              link1.classList.add('disabled');
            }
          }
          this.attachEvent(`deleteQn${pollType}${index}`, 'click', this.deleteHandler, item, pollType, index);
        } else {
          link1 = document.querySelector(`#editQn${pollType}${index} span`);
          if (link1) {
            link1.setAttribute('title', virtualclass.lang.getString('etDisabledCr'));
            link1.style.cursor = 'default';
            link1.classList.add('disabled');
          }

          const link3 = document.querySelector(`#deleteQn${pollType}${index} span`);
          link3.setAttribute('title', virtualclass.lang.getString('dltDisabled'));
          link3.style.cursor = 'default';
          link3.classList.add('disabled');
        }
        const poll = pollType == 'course' ? virtualclass.poll.coursePoll : virtualclass.poll.sitePoll;
        if (index === poll.length - 1 || index === poll.length - 2 || index === poll.length - 3) {
          const link = document.querySelector(`#contQn${pollType}${index}`);
          link.classList.add('lastNode');
        }


        this.attachEvent(`publishQn${pollType}${index}`, 'click', this.publishHandler, item, pollType, index);
        this.previewOnHover(item, pollType, index);
      },

      previewOnHover(item, pollType, index) {
        const data = {};
        const popover = document.querySelector(`#qnText${pollType}${index} .popover-content`);
        if (!popover) {
          data.questiontext = item.questiontext;
          data.options = item.options;
          const template = virtualclass.getTemplate('previewPopup', 'poll');
          const preview = (template({ data }));
          virtualclass.modal.attachpopupHandler(pollType, index, preview);
        }
      },

      attachEvent(actionid, eventName, handler, item, pollType, index, qid, temp, isPublished) {
        const elem = document.getElementById(actionid);
        if (elem != null) {
          elem.addEventListener(eventName, () => {
            if (typeof item !== 'undefined') {
              handler(item, pollType, index, actionid, qid, isPublished);
            } else {
              handler(pollType, index, actionid, qid, isPublished);
            }
          });
        }
      },
      hidePollList(pollType) {
        const listCont = document.getElementById(`listQnCont${pollType}`);
        if (listCont) {
          listCont.style.display = 'none';
        }
      },
      editHandler(item, pollType, index) {
        const mszbox = document.getElementById('mszBoxPoll');
        if (mszbox.childNodes.length > 0) {
          mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
        }
        const data = {};
        if (pollType === 'course') {
          poll = virtualclass.poll.coursePoll[index];
        } else {
          poll = virtualclass.poll.sitePoll[index];
        }
        data.options = poll.options;
        data.questiontext = poll.questiontext;

        const template = virtualclass.getTemplate('edit-modal', 'poll');
        const bsCont = document.querySelector('#bootstrapCont');
        bsCont.insertAdjacentHTML('beforeend', template({ data }));
        virtualclass.poll.UI.editPoll(pollType, index);
        virtualclass.modal.closeModalHandler('editPollModal');
      },
      stdResponse(response, fromUser) {
        if (this.pollState.currScreen !== 'voted'
          && this.pollState.currScreen !== 'stdPublishResult' && this.pollState.currScreen !== 'displaysitePollList') {
          // console.log('====> Poll student reponse');
          this.updateResponse(response, fromUser);
        }
      },
      newPollHandler(pollType) {
        const bsCont = document.querySelector('#createPollCont');
        const modal = document.querySelector('#editPollModal');
        if (modal) {
          modal.remove();
        }
        const template = virtualclass.getTemplate('modal', 'poll');
        bsCont.insertAdjacentHTML('beforeend', template());
        virtualclass.modal.closeModalHandler('editPollModal');
        virtualclass.poll.pollPopUp(virtualclass.poll.popupFn, undefined, pollType);
      },
      //* *****************
      popupFn(id, index, pollType) {
        if (id !== 'goBack') {
          virtualclass.poll[id].call(virtualclass.poll, index, pollType, id);
        }
      },
      next(index, pollType) {
        virtualclass.poll.pollSetting(pollType, index);
      },

      // goBack(index, pollType) {
      //   // console.log('modal dismiss');
      // },
      // course poll and site poll

      // cmid  later
      etSave(qIndex, pollType, id) {
        const flagStatus = virtualclass.poll.isBlank();
        if (!flagStatus) {
          return 0;
        }
        const poll = (pollType === 'course') ? virtualclass.poll.coursePoll[qIndex] : virtualclass.poll.sitePoll[qIndex];
        const category = (pollType === 'course') ? virtualclass.poll.cmid : 0;
        const qn = document.getElementById('q');
        const btn = document.getElementById('etSave');
        btn.setAttribute('data-dismiss', 'modal');

        if (typeof qIndex !== 'undefined') {
          virtualclass.poll.saveQuestion(qn, qIndex, pollType);
          virtualclass.poll.saveOption(qIndex, pollType);
          const saveQn = {
            questionid: poll.questionid,
            question: poll.questiontext,
            options: poll.options,
            createdby: poll.createdby,
          };
          virtualclass.poll.interfaceToEdit(saveQn, category);
        } else {
          const flag = virtualclass.poll.newPollSave('undefined', pollType);
          if (!flag) {
            return 0;
          }
        }
        if (id === 'etSave') {
          virtualclass.modal.removeModal();
        }
        return 1;
      },
      closePoll(pollType) {
        const message = virtualclass.lang.getString('pclose');
        virtualclass.popup.confirmInput(message, virtualclass.poll.askConfirmClose, 'close', pollType);
      },
      saveQuestion(elem, qIndex, pollType) {
        if (pollType === 'course') {
          this.coursePoll[qIndex].questiontext = elem.value;
          this.coursePoll[qIndex].creator = wbUser.name;
        } else {
          this.sitePoll[qIndex].questiontext = elem.value;
          this.sitePoll[qIndex].creator = wbUser.name;
        }
        // console.log(this.coursePoll);
        const elem1 = document.getElementById(`qnText${pollType}${qIndex}`);
        elem1.innerHTML = elem.value;
      },
      saveOption(qIndex, pollType) {
        const temp = [];
        let j = 0;
        let t;
        let i;
        const poll = (pollType === 'course') ? this.coursePoll[qIndex] : this.sitePoll[qIndex];
        const optsCont = document.getElementById('optsTxCont');
        const opts = optsCont.querySelectorAll('#virtualclassCont #optsTxCont .opt');

        for (i = 0; i < opts.length; i++) {
          temp[i] = opts[i].value;
        }
        for (const prop in poll.options) {
          poll.options[prop] = temp[j];
          j++;
        }
        if (i > j) {
          j;
          for (t = j; t < i; t++) {
            poll.options[`noid${j}`] = temp[j];
            j++;
          }
        }
      },
      hideModal() {
        virtualclass.modal.removeModal();
      },

      newPollSave(index, pollType) {
        let category = 0;
        const item = {};
        const option = [];
        const flag = virtualclass.poll.isBlank();
        let n;
        if (!flag) {
          return 0;
        }
        const optsCont = document.getElementById('optsTxCont');
        const opts = optsCont.querySelectorAll('#virtualclassCont #optsTxCont .opt');

        for (let i = 0; i < opts.length; i++) {
          option.push(opts[i].value);
        }
        const q = document.getElementById('q');
        item.questiontext = q.value;
        item.creator = wbUser.name;
        item.id = wbUser.id;
        item.options = option;
        if (pollType === 'course') {
          // virtualclass.poll.coursePoll.push(item);
          n = virtualclass.poll.coursePoll.length - 1;
          category = virtualclass.poll.cmid;
        } else {
          // virtualclass.poll.sitePoll.push(item);
          n = virtualclass.poll.sitePoll.length - 1;
        }
        const saveQn = {
          question: q.value,
          options: option,
          action: 'newPollSave',
          category,
          copied: false,
        };

        virtualclass.poll.interfaceToSave(saveQn, category);
        // virtualclass.poll.forEachPoll(item, n, pollType, creator, wbUser.id)
        return 1;
      },
      isBlank() {
        const q = document.getElementById('q');
        const optsCont = document.getElementById('optsTxCont');
        const optionList = optsCont.querySelectorAll('#virtualclassCont #optsTxCont .opt');
        let optCount = 0;
        let optionBlank = 0;
        for (let i = 0; i < optionList.length; i++) {
          if (optionList[i].value == null || optionList[i].value.trim() === '') {
            optionBlank++;
          } else {
            optCount++;
          }
        }
        const qn = document.getElementById('q');
        if (qn.value == null || qn.value.trim() === '') {
          virtualclass.lang.getString('pollblank');
          alert(virtualclass.lang.getString('pollblank'));
          return 0;
        } if (optCount < 2) {
          alert(virtualclass.lang.getString('minoption'));
          return 0;
        } if (optionBlank) {
          alert(virtualclass.lang.getString('delblank'));
          return 0;
        }
        return 1;
      },
      saveNdPublish(index, type) {
        const flagSatus = virtualclass.poll.isBlank();
        if (!flagSatus) {
          return 0;
        }
        const pollType = `${type}Poll`;
        const { length } = virtualclass.poll[pollType];
        const optsCont = document.getElementById('optsTxCont');
        const opt = optsCont.querySelectorAll('#virtualclassCont #optsTxCont .opt');

        if (typeof index === 'undefined') {
          const { length } = virtualclass.poll[pollType];

          // const obj = virtualclass.poll[pollType];

          const question = document.getElementById('q').value;
          const opts = {};
          // const optsCont = document.getElementById('optsTxCont');
          // const opt = optsCont.querySelectorAll('#virtualclassCont #optsTxCont .opt');
          for (let i = 0; i < opt.length; i++) {
            opts[i] = opt[i].value;
          }
          // datatoStd change
          const obj1 = {
            question,
            options: opts,

          };
          virtualclass.poll.dataToStd.question = obj1.question;
          virtualclass.poll.dataToStd.options = obj1.options;
          const setting = true;
          const flag = virtualclass.poll.newPollSave(length, type, setting);
          if (flag) {
            const next = true;
            virtualclass.poll.pollSetting(type, length, next);
          }
        } else {
          const next = true;
          const poll = virtualclass.poll[pollType][index];
          const question = document.getElementById('q').value;
          poll.question = question;

          let j = 0;
          for (let i in poll.options) {
            poll.options[i] = opt[j].value;
            j++;
          }
          // var obj1 = {
          //   question,
          //   options: opts,
          //
          // };
          virtualclass.poll[pollType][index].questiontext = document.getElementById('q').value;

          virtualclass.poll.dataToStd.question = virtualclass.poll[pollType][index].questiontext;
          virtualclass.poll.dataToStd.options = virtualclass.poll[pollType][index].options;
          const flag = virtualclass.poll.etSave(index, type, setting);
          if (flag) {
            virtualclass.poll.pollSetting(type, index, next);
          }
        }

        const data = {
          type: 'course',
          qid: index,
          pollqnOps: virtualclass.poll.dataToStd,
        };
        virtualclass.poll.pollState.currScreen = 'setting';
        virtualclass.poll.pollState.data = data;
      },
      pollCancel() {
        virtualclass.popup.closeElem();
        virtualclass.modal.closeModalHandler('editPollModal');
      },
      reset() {
        const allTxt = document.querySelectorAll('#editPollModal textArea');
        for (let i = 0; i < allTxt.length; i++) {
          allTxt[i].value = '';
        }
      },
      addMoreOption(index, pollType) {
        virtualclass.poll.UI.createOption(index, pollType);
      },
      //* *
      removeOption(pollType, qIndex, y) {
        const optionId = y.replace('remove', '');
        const e = document.getElementById(y);
        e.parentNode.parentNode.removeChild(e.parentNode);
        const poll = (pollType === 'course') ? virtualclass.poll.coursePoll[qIndex] : virtualclass.poll.sitePoll[qIndex];
        if (typeof poll !== 'undefined') {
          delete poll.options[optionId];
          virtualclass.poll.interfaceToDelOption(optionId);
        }
      },
      publishHandler(item, type, index) {
        const mszbox = document.getElementById('mszBoxPoll');
        if (mszbox.childNodes.length > 0) {
          mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
        }

        const { isPublished } = item;

        if (isPublished) {
          virtualclass.poll.duplicatePoll(item);
        } else {
          virtualclass.poll.publishPoll(item, type, index);
        }
      },
      duplicatePoll(item) {
        // to convert item.options in to an array

        const options = [];
        for (const i in item.options) {
          options.push(item.options[i]);
        }
        const saveQn = {
          question: item.questiontext,
          options,
          action: 'newPollSave',
          category: item.category,
          copied: true,
        };

        virtualclass.poll.interfaceToSave(saveQn, item.category);
      },
      publishPoll(item, type) {
        virtualclass.poll.dataToStd.question = item.questiontext;
        virtualclass.poll.dataToStd.qId = item.questionid;
        virtualclass.poll.dataToStd.options = item.options;

        const cont = document.getElementById('layoutPollBody');
        // const elem = document.createElement('div');
        // elem.className = 'container';
        // cont.appendChild(elem);
        const modal = document.getElementById('editPollModal');
        if (modal) {
          modal.remove();
        }
        const obj = {};
        obj.questiontext = item.questiontext;
        obj.options = item.options;
        const template = virtualclass.getTemplate('preview-modal', 'poll');
        const bsCont = document.querySelector('#virtualclassApp #bootstrapCont');
        if (bsCont) {
          bsCont.insertAdjacentHTML('beforeend', template({ poll: obj }));
        }

        if (!type) {
          if (item.category === '0') {
            type = 'site';
          } else {
            type = 'course';
          }
        }
        virtualclass.poll.pollPreview(type);
        virtualclass.modal.closeModalHandler('editPollModal');
      },
      pollPreview(pollType) {
        const cont = document.getElementById('contFooter');
        virtualclass.poll.UI.previewFooterBtns(cont, pollType);
      },

      deleteHandler(item, pollType, index) {
        const mszbox = document.getElementById('mszBoxPoll');
        const notify = mszbox.querySelectorAll('#mszBoxPoll .alert');
        if (notify.length > 0) {
          notify[0].parentNode.removeChild(notify[0]);
        }
        const message = virtualclass.lang.getString('pollDel');
        virtualclass.popup.confirmInput(message, virtualclass.poll.askConfirm, pollType, index);
      },

      showMsg(contId, msg, type) {
        let mszCont = document.getElementById(contId);
        if (!mszCont) {
          const layout = document.getElementById('layoutPollBody');
          mszCont = document.createElement('div');
          mszCont.id = contId;
          layout.appendChild(mszCont);
        }
        const elem = document.createElement('div');
        elem.className = 'alert  alert-dismissable';
        elem.classList.add(type);
        elem.innerHTML = msg;
        mszCont.insertBefore(elem, mszCont.firstChild);

        // const btn = document.createElement('button');
        // btn.className = 'close';
        // btn.setAttribute('data-dismiss', 'alert');
        // btn.innerHTML = '&times';
        // elem.appendChild(btn);

        // btn.addEventListener('click', () => {
        //   elem.parentNode.removeChild(elem);
        // });

      },
      askConfirm(opted, pollType, index) {
        if (opted) {
          const cont = document.getElementById(`contQn${pollType}${index}`);
          cont.parentNode.removeChild(cont);
          const msg = virtualclass.lang.getString('Pdsuccess');
          virtualclass.poll.showMsg('mszBoxPoll', msg, 'alert-success');
          let poll = pollType === 'course' ? virtualclass.poll.coursePoll[index] : virtualclass.poll.sitePoll[index];
          const qid = poll.questionid;
          poll = pollType === 'course' ? virtualclass.poll.coursePoll : virtualclass.poll.sitePoll;
          poll.splice(index, 1);
          virtualclass.poll.interfaceToDelete(qid);
        }
      },



      askConfirmClose(opted, label, pollType) {
        if (opted) {
          if ((virtualclass.poll.setting.showResult && roles.hasControls()) || !roles.hasControls()) {
            ioAdapter.mustSend({
              poll: {
                pollMsg: 'stdPublishResult',
                data: virtualclass.poll.count,
              },
              cf: 'poll',
            });
          }
          virtualclass.poll.resultToStorage();
          virtualclass.poll.UI.pollClosedUI();
          const saveResult = {
            qid: virtualclass.poll.dataToStd.qId,
            list: virtualclass.poll.list,
          };
          virtualclass.poll.interfaceToSaveResult(saveResult);
          const msg = virtualclass.lang.getString('Pclosed');
          virtualclass.poll.showMsg('resultLayoutHead', msg, 'alert-success');
          virtualclass.poll.pollState.data.pollClosed = 'yes';
          clearInterval(virtualclass.poll.timer);
          virtualclass.poll.timer = 0;
          let flagnonzero = 0;
          for (let i in virtualclass.poll.count) {
            if (virtualclass.poll.count[i]) {
              flagnonzero = 1;
            }
          }
          if (flagnonzero) {
            // virtualclass.poll.showGraph();
            if (virtualclass.poll.currResultView !== 'list') {
              virtualclass.poll.showChart();
              // const chart = document.getElementById('chart');
              // chart.style.display = 'block';
            }

            // chart.style.display = "block";
          } else {
            virtualclass.poll.noneVoted(pollType);

            // virtualclass.poll.UI.createResultLayout();
            const header = document.getElementById('resultLayoutHead');
            if (header) {
              for (let i = 0; i < header.childNodes.length; i++) {
                header.childNodes[i].parentNode.removeChild(header.childNodes[i]);
              }
            }
            const msz = document.getElementById('pollResultMsz');
            msz.parentNode.removeChild(msz);

            const chartMenu = document.getElementById('chartMenuCont');
            chartMenu.parentNode.removeChild(chartMenu);
          }
        }
      },

      showStudentPollReport(obj) {
        virtualclass.poll.studentReportLayout(obj);
        const elem = document.getElementById('mszBoxPoll');
        if (elem) {
          elem.parentNode.removeChild(elem);
        }
      },
      studentReportLayout(obj) {
        const report = 'true';
        const layout = document.getElementById('layoutPollBody');
        while (layout.childElementCount > 1) {
          layout.removeChild(layout.lastChild);
        }

        const elem = document.createElement('div');
        layout.appendChild(elem);

        const count = obj.result;
        // elem.innerHTML="data fetched from indexed db";
        virtualclass.poll.count = count;
        console.log('====> student submit poll ', virtualclass.poll.count);
        // console.log('====> Poll count ', virtualclass.poll.count)
        virtualclass.poll.dataRec = obj.pollData;
        virtualclass.poll.stdPublishResult(count, report);
      },
      timerDisable() {
        const timer = document.getElementById('timer');
        timer.classList.add('disabled');
      },

      stdPublish() {
        // console.log('====> Poll publish 2');
        virtualclass.poll.pollState.data = virtualclass.poll.dataRec;
        virtualclass.poll.pollState.timer = virtualclass.poll.newUserTime;
        if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
          console.log('there is happening something');
          this.loadTeacherScrn(virtualclass.poll.pollState);
          // return;
        } else {
          const mszBox = document.getElementById('mszBoxPoll');
          if (mszBox) {
            if (mszBox.childNodes.length > 0) {
              mszBox.childNodes[0].parentNode.removeChild(mszBox.childNodes[0]);
            }
          }
          if (virtualclass.poll.timer) {
            clearInterval(virtualclass.poll.timer);
          }
          const resultLayout = document.getElementById('resultLayout');
          if (resultLayout) {
            resultLayout.parentNode.removeChild(resultLayout);
          }

          const elem = document.getElementById('stdPollContainer');
          if (elem) {
            elem.parentNode.removeChild(elem);
          }

          const pollHeader = document.querySelector('.congrea.student #virtualclassPoll #navigator #stdPollHeader');
          if (pollHeader) {
            pollHeader.style.display = 'block';
          }
          const obj = {};
          obj.question = virtualclass.poll.dataRec.options;
          const template = virtualclass.getTemplate('pollStd', 'poll');
          const layout = document.querySelector('#layoutPollBody');
          layout.insertAdjacentHTML('beforeend', template({ poll: obj }));
          this.UI.stdPublishUI();

          const isTimer = virtualclass.poll.dataRec.setting.timer;
          if (isTimer) {
            const updatedTime = virtualclass.poll.dataRec.newTime;
            virtualclass.poll.newTimer = updatedTime;
            const formattedTimes = this.getFormatedTime();
            const showerTime = {min: formattedTimes[1], sec: formattedTimes[2]};
            this.remainingTimer(showerTime);
            var label = document.querySelector('#timerLabel');
            label.innerHTML = virtualclass.lang.getString('Rtime');
          } else {
            this.triggerElapseTimer();
            const msg = virtualclass.lang.getString('Tmyclose');
            virtualclass.poll.showMsg('stdContHead', msg, 'alert-success');
            document.querySelector('#timerLabel').innerHTML = virtualclass.lang.getString('ETime');
          }

          const qnCont = document.getElementById('stdQnCont');
          this.showQn(qnCont);

          const optionCont = document.getElementById('stdOptionCont');
          this.showOption(optionCont);

          const btn = document.getElementById('btnVote');
          if (btn) {
            btn.addEventListener('click', virtualclass.poll.voted);
          }

          const nav = document.querySelector('#virtualclassCont.congrea.student #navigator #pollResult');
          if (nav) {
            nav.style.display = 'none';
          }
          virtualclass.poll.pollState.currScreen = 'stdPublish';
        }
      },

      getFormatedTime() {
        let remainingTime;
        if (!virtualclass.isPlayMode) {
          const publishTime = virtualclass.poll.pollState.data.setting.time.timestamp;
          const publishTimeInSeconds = virtualclass.vutil.UTCtoLocalTimeToSeconds(publishTime);
          const totalDiff = (new Date().getTime() - publishTimeInSeconds);
          remainingTime = (virtualclass.poll.pollState.data.setting.time.totalInSeconds * 1000) - totalDiff;
        } else {
          remainingTime = virtualclass.poll.pollState.data.setting.time.totalInSeconds * 1000;
        }

        let formattedTimes;
        if (remainingTime > 0) {
          formattedTimes = virtualclass.vutil.miliSecondsToFormatedTime(remainingTime);
        } else {
          formattedTimes = [0, 0, 0];
        }
        return formattedTimes;
      },

      triggerElapseTimer(){
        const publishTime = virtualclass.poll.pollState.data.setting.time.timestamp;
        const publishTimeInSeconds = virtualclass.vutil.UTCtoLocalTimeToSeconds(publishTime);
        const totalDiff = (new Date().getTime() - publishTimeInSeconds);
        const [hour, min, sec] = virtualclass.vutil.miliSecondsToFormatedTime(totalDiff);
        this.elapsedTimer(min, sec);
      },

      voted() {
        virtualclass.poll.pollState.currScreen = 'voted';
        const btn = document.querySelector('#virtualclassCont.congrea #stdPollContainer #btnVote');
        if (!btn.classList.contains('disabled')) {
          const flag = virtualclass.poll.saveSelected();
          if (flag) {
            if (virtualclass.poll.timer) {
              clearInterval(virtualclass.poll.timer);
            }
            const stdPollMszLayout = document.getElementById('stdPollMszLayout');
            if (stdPollMszLayout) {
              stdPollMszLayout.parentNode.removeChild(stdPollMszLayout);
            }

            const stdPollContainer = document.getElementById('stdPollContainer');
            stdPollContainer.parentNode.removeChild(stdPollContainer);
            let msg = '';
            if (virtualclass.poll.dataRec.setting.showResult) {
              msg = virtualclass.lang.getString('votesuccess');
            } else {
              msg = virtualclass.lang.getString('votesuccessPbt');
            }
            const mszbox = document.querySelector('.congrea.student #mszBoxPoll');
            mszbox.style.display = 'block';

            virtualclass.poll.showMsg('mszBoxPoll', msg, 'alert-success');
            virtualclass.poll.sendResponse();
          } else {
            alert('Select an option');
          }
        }

        virtualclass.poll.pollState.currScreen = 'voted';
        virtualclass.poll.pollState.data = virtualclass.poll.dataRec;
        virtualclass.poll.pollState.timer = virtualclass.poll.newUserTime;
      },

      sendResponse() {
        const toUser = virtualclass.vutil.whoIsTeacher();
        // console.log('====> Poll student response');
        ioAdapter.mustSendUser({
          poll: {
            pollMsg: 'stdResponse',
            data: virtualclass.poll.responseId,
            qId : virtualclass.poll.pollState.data.qId,
          },
          cf: 'poll',
        }, toUser);
      },


      saveSelected() {
        const optsCont = document.getElementById('stdOptionCont');
        const elem = optsCont.querySelectorAll('#stdOptionCont .opt');
        let i;
        for (i = 0; i < elem.length; i++) {
          if (elem[i].checked) {
            virtualclass.poll.responseId = elem[i].id;
            return 1;
          }
        }
        if (i === elem.length) {
          return 0;
        }
      },

      elapsedTimer(min, sec) {
        let minute = min || 0;
        let second = sec || 0;
        let elem;

        if (Object.prototype.hasOwnProperty.call(virtualclass.poll, 'timer')) {
          clearInterval(virtualclass.poll.timer);
        }
        const label = document.getElementById('timerLabel');
        if (label) {
          label.innerHTML = virtualclass.lang.getString('ETime');
        }

        if (roles.hasControls()) {
          elem = document.getElementById('timerCont');
        } else {
          const head = document.getElementById('stdContHead');
          if (head) {
            elem = document.querySelector('#timerCont');
            if (elem === null) {
              elem = document.createElement('div');
              elem.id = 'timerCont';
              head.appendChild(elem);
            }
          }
        }
        const handler = function () {
          // console.log("timer" + virtualclass.poll.timer)
          if (elem) {
            second++;
            if (second === 60) {
              second = 0;
              minute++;
              if (minute === 60) minute = 0;
            }

            elem.innerHTML = `${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second}`;
          } else {
            clearInterval(virtualclass.poll.timer);
          }
        };

        handler();
        virtualclass.poll.timer = setInterval(handler, 1000);
      },

      remainingTimer(time) {
        if (virtualclass.poll.timer) {
          clearInterval(virtualclass.poll.timer);
        }
        const elem = document.getElementById('timerCont');
        let min = time.min || 0;
        let sec = time.sec || 0;

        const handler = function () {
          if (elem) {
            elem.innerHTML = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
            sec--;
            if (sec <= 0) {
              sec = 59;
              min--;
              if (min < 0) {
                min = 0;
                sec = 0;
                elem.innerHTML = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
                clearInterval(virtualclass.poll.timer);
                virtualclass.poll.timerExpired();
              }
            }
          } else {
            clearInterval(virtualclass.poll.timer);
          }
        };

        if (min != null || sec != null) {
          handler();
          virtualclass.poll.timer = setInterval(handler, 1000);
        }
      },

      timerExpired() {
        const btn = document.getElementById('btnVote');
        if (btn) {
          btn.classList.add('disabled');
        }
        if (roles.hasControls()) {
          if (virtualclass.poll.setting.showResult) {
            // console.log('====> Poll show result');
            ioAdapter.mustSend({
              poll: {
                pollMsg: 'stdPublishResult',
                data: virtualclass.poll.count,
              },
              cf: 'poll',
            });
          }
          if (virtualclass.poll.timer) {
            const saveResult = {
              qid: virtualclass.poll.dataToStd.qId,
              list: virtualclass.poll.list,
            };
            virtualclass.poll.interfaceToSaveResult(saveResult);
          }
          this.testNoneVoted(virtualclass.poll.count);
        }
        virtualclass.poll.timer = 0;

        const elem = document.getElementById('congreaPollVoters');
        if (elem) {
          elem.innerHTML = virtualclass.lang.getString('rvtu');
        }
        virtualclass.poll.pollState.data.pollClosed = 'yes';
      },
      // to add additional condition for poll closed **remainder
      testNoneVoted(count) {
        let flagnonzero = 0;
        for (var i in count) {
          if (count[i]) {
            flagnonzero = 1;
          }
        }
        if (flagnonzero) {
          if (virtualclass.poll.currResultView !== 'list') {
            virtualclass.poll.showChart();
          }
        } else {

          this.noneVoted();

          const header = document.getElementById('resultLayoutHead');
          if (header) {
            for (let i = 0; i < header.childNodes.length; i++) {
              header.childNodes[i].parentNode.removeChild(header.childNodes[i]);
            }
          }
          const msz = document.getElementById('pollResultMsz');
          msz.parentNode.removeChild(msz);

          const chartMenu = document.getElementById('chartMenuCont');
          chartMenu.parentNode.removeChild(chartMenu);

          const editPollModal = document.querySelector('#editPollModal');
          if (virtualclass.poll.pollState.currScreen === 'teacherPublish'){
            editPollModal.remove();
          }
        }
      },

      stdPublishResult(count, report) {
        const temp = virtualclass.poll.count;
        virtualclass.poll.count = count;
        console.log('====> student submit poll ', virtualclass.poll.count);
        if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
          // console.log('====> Poll displaysitePollList')
          // this.loadTeacherScrn(virtualclass.poll.pollState);
          // this.pollState.currScreen = 'displaysitePollList';
          // const modal = document.querySelector('#editPollModal');
          // if (modal) modal.remove();
          // this.reloadPollList(virtualclass.poll.pollState, virtualclass.poll.pollState.data.pollType);
          const closePollButton = document.getElementById('closePoll');
          if (closePollButton) {
            closePollButton.style.display = 'none';
          }

          clearInterval(virtualclass.poll.timer);
          virtualclass.poll.timer = 0;

          this.testNoneVoted(count);

          virtualclass.poll.count = temp;
        } else {
          if (virtualclass.poll.timer) {
            clearInterval(virtualclass.poll.timer);
          }
          if (virtualclass.poll.dataRec || report) {
            if (virtualclass.poll.dataRec.setting.showResult) {
              this.resultDisplay(count);
            } else {
              this.noResultDisplay();
              const header = document.getElementById('resultLayoutHead');
              virtualclass.poll.UI.resultNotShownUI(header);
              virtualclass.poll.pollState.currScreen = 'stdPublishResult';
              virtualclass.poll.pollState.data = 'noResult';
            }
          }
          virtualclass.poll.resultToStorage();
        }
      },

      completeClose(){
        if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
          this.pollState.currScreen = 'displaysitePollList';
          const modal = document.querySelector('#editPollModal');
          if (modal) modal.remove();
          this.reloadPollList(virtualclass.poll.pollState, virtualclass.poll.pollState.data.pollType);
        }
      },


      resultDisplay(count) {
        // var layout = document.getElementById("layoutPoll");
        // layout.style.display = "none";

        const cont = document.querySelector('.congrea #stdPollContainer');
        if (cont) {
          cont.style.display = 'none';
        }
        const resultLayoutelem = document.getElementById('resultLayout');
        if (resultLayoutelem) {
          resultLayoutelem.parentNode.removeChild(resultLayoutelem);
        }
        virtualclass.poll.UI.createResultLayout();
        // const resultLayout2 = document.getElementById('resultLayout');
        // if (!resultLayout) {
        const timer = document.getElementById('timerWrapper');
        timer.parentNode.removeChild(timer);
        const contLayout = document.getElementById(('resultLayout'));
        contLayout.classList.add('bootstrap', 'container');
        virtualclass.poll.count = count;
        console.log('====> student submit poll ', virtualclass.poll.count);
        // console.log('====> Poll count ', virtualclass.poll.count)
        const mszbox = document.getElementById('mszBoxPoll');
        if (mszbox) {
          if (mszbox.childNodes.length > 0) {
            const notify = mszbox.querySelectorAll('#mszBoxPoll .alert');
            if (notify.length > 0) {
              notify[0].parentNode.removeChild(notify[0]);
            }
          }
        }

        const contElem = document.getElementById('chartMenuCont');
        if (contElem) {
          virtualclass.poll.UI.chartMenu(cont);
        }
        let flagnonzero = 0;
        for (const i in virtualclass.poll.count) {
          if (virtualclass.poll.count[i]) {
            flagnonzero = 1;
          }
        }
        if (flagnonzero) {
          virtualclass.poll.showGraph();
          virtualclass.poll.showChart();
          // const chart = document.getElementById('chart');
          // chart.style.display = 'block';
        } else {
          this.noneVoted();
        }

        virtualclass.poll.pollState.currScreen = 'stdPublishResult';
        virtualclass.poll.pollState.data = virtualclass.poll.dataRec;
        virtualclass.poll.pollState.timer = virtualclass.poll.newUserTime;
        virtualclass.poll.pollState.count = virtualclass.poll.count;
      },

      noResultDisplay() {
        const layout = document.getElementById('stdPollContainer');
        if (layout) {
          layout.parentNode.removeChild(layout);
        }
        virtualclass.poll.UI.createResultLayout();
        const header = document.getElementById('resultLayoutHead');
        if (header) {
          for (let i = 0; i < header.childNodes.length; i++) {
            header.childNodes[i].parentNode.removeChild(header.childNodes[i]);
          }
        }
        const cont = document.getElementById('resultLayoutBody');
        if (cont) {
          for (let i = 0; i < cont.childNodes.length; i++) {
            cont.childNodes[i].parentNode.removeChild(cont.childNodes[i]);
          }
        }
      },
      noneVoted(pollType) {
        console.log('====> No voted poll here');
        if (typeof virtualclass.poll.timer !== 'undefined') {
          clearInterval(virtualclass.poll.timer);
        }
        this.noResultDisplay();
        const head = document.querySelector('#resultLayoutHead');
        if (head) {
          head.style.display = 'none';
        }
        const qnLabel = document.querySelector('#qnLabelCont');
        const chartMenu = document.querySelector('#chartMenuCont');
        if (chartMenu) {
          chartMenu.style.display = 'none';
        }

        const resultCont = document.getElementById('resultLayoutBody');
        const elem = document.createElement('div');
        elem.className = 'pollResultNotify';
        elem.id = 'resultNote';
        resultCont.appendChild(elem);
        resultCont.insertBefore(elem, resultCont.firstChild);
        const msg = virtualclass.lang.getString('Pclosed');
        virtualclass.poll.showMsg('resultNote', msg, 'alert-error');

        const pollClose = document.getElementById('resultNote');
        const elemVote = document.createElement('div');
        elemVote.className = 'notifyText alert alert-info';
        elemVote.id = 'congreaPollNote';
        elemVote.innerHTML = virtualclass.lang.getString('Novote');
        pollClose.appendChild(elemVote);


        const item = virtualclass.poll.dataRec;
        if (!roles.hasControls()) {
          this.showPollText(resultCont, item);
        }


        const modalClose = document.getElementById('modalClose');
        const dCoursePollList = 'displaycoursePollList';
        const dSitePollList = 'displaysitePollList';
        if (modalClose) {
          modalClose.addEventListener('click', () => {
            const modal = document.querySelector('#editPollModal');
            if (modal) {
              modal.remove();
            }
            if (roles.hasControls() && pollType && virtualclass.poll.pollState.currScreen
              && virtualclass.poll.pollState.currScreen === 'teacherPublish'
            ) {
              virtualclass.poll.pollState.currScreen = (pollType === 'course') ? dCoursePollList : dSitePollList;
            }
          });

        }
      },
      showPollText(resulCont) {
        const item = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
        const poll = {};
        poll.question = item.question;
        poll.options = item.options;

        const template = virtualclass.getTemplate('qnOptions', 'poll');
        const nonVoted = document.querySelector('#resultLayoutBody #optnNonVotd');
        nonVoted.insertAdjacentHTML('beforeend', template({ poll }));
      },
      showQn(qnCont) {
        if (roles.hasControls()) {
          qnCont.innerHTML = virtualclass.poll.dataToStd.question;
        } else {
          qnCont.innerHTML = virtualclass.poll.dataRec.question;
        }
      },
      showOption(optionCont) {
        const data = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
        const { options } = data;
        for (const i in options) {
          const optCont = document.createElement('div');
          optionCont.appendChild(optCont);
          const elem = document.createElement('input');
          elem.className = 'opt';
          elem.setAttribute('name', 'option');
          elem.setAttribute('value', i);
          elem.setAttribute('type', 'radio');
          elem.id = i;
          optCont.appendChild(elem);
          const label = document.createElement('span');
          label.className = 'stdoptn';
          optCont.appendChild(label);
          label.innerHTML = data.options[i];
        }
      },

      pollSetting(pollType, index, next) {
        virtualclass.poll.UI.hidePrevious(index);
        const setting = document.getElementById(`settingTx${index}`);
        if (setting == null) {
          virtualclass.poll.UI.pollSettingUI(index, pollType);
        }
        if (typeof next !== 'undefined') {
          document.getElementById('publish').setAttribute('disable', true);
        }
        (document.getElementById('publish')).addEventListener('click', () => {
          virtualclass.poll.saveSetting(pollType, next);
        });
        (document.getElementById('cancelSetting')).addEventListener('click', () => {
          virtualclass.modal.removeModal('editPollModal');
        });
        virtualclass.modal.closeModalHandler('editPollModal');
      },

      saveSetting(pollType, next) {
        let isTimer;
        if (document.getElementById('radioBtn2')) {
          isTimer = document.getElementById('radioBtn2').checked;
          virtualclass.poll.setting.timer = isTimer;
        }

        const time = document.getElementById('timer');
        if (time) {
          const dgt = time.options[time.selectedIndex].value;
          // virtualclass.poll.setting.time.digit = dgt;
          const unitElem = document.getElementById('ut');
          const unit = unitElem.options[unitElem.selectedIndex].value;
          // virtualclass.poll.setting.time.unit = unit;

          if (unit === 'minut') {
            virtualclass.poll.setting.time.totalInSeconds = (+(dgt) * 60);
          } else {
            virtualclass.poll.setting.time.totalInSeconds = (+(dgt));
          }
          virtualclass.poll.setting.time.timestamp = virtualclass.vutil.localToUTC(Date.now());
        }

        if (document.getElementById('pollCkbox')) {
          const isShowResult = document.getElementById('pollCkbox').checked;
          virtualclass.poll.setting.showResult = isShowResult;
        }
        virtualclass.poll.UI.resultView(isTimer, pollType);
        virtualclass.poll.currResultView = 'bar';

        if (isTimer) {
          const timeInSec = virtualclass.poll.setting.time.totalInSeconds;
          const [hour, min, sec] = virtualclass.vutil.miliSecondsToFormatedTime(timeInSec * 1000);
          virtualclass.poll.remainingTimer({ hour, min, sec }); // not in ui
        } else {
          virtualclass.poll.elapsedTimer();
        }

        if (typeof next !== 'undefined') {
          virtualclass.poll.dataToStd.qId = virtualclass.poll.currQid;
          virtualclass.poll.dataToStd.options = virtualclass.poll.currOption;
        }

        const data = {
          question: virtualclass.poll.dataToStd.question,
          options: virtualclass.poll.dataToStd.options,
          qId: virtualclass.poll.dataToStd.qId,
          setting: virtualclass.poll.setting,
          // newTime: virtualclass.poll.newUserTime,
          count: virtualclass.poll.count,
          list: virtualclass.poll.list,
          users: virtualclass.poll.uniqueUsers,
          pollType,

        };

        if (typeof virtualclass.poll.afterReload !== 'undefined') {
          data.newTime = virtualclass.poll.afterReload;
          delete virtualclass.poll.afterReload;
        }

        if (time) {
          // console.log('====> Poll student publish 2');
          ioAdapter.mustSend({
            poll: {
              pollMsg: 'stdPublish',
              data,
            },
            cf: 'poll',
          });
          // console.log(`to send${data}`);
        }

        data.view = virtualclass.poll.currResultView;

        virtualclass.poll.showGraph();
        virtualclass.poll.updateBarGraph();
        virtualclass.poll.pollState.currScreen = 'teacherPublish';
        virtualclass.poll.pollState.data = data;
      },
      updateResponse(response, fromUser) {
        // const chart = document.getElementById('chart');
        // if (chart && virtualclass.poll.currResultView != 'list') {
        //   chart.style.display = 'block';
        // }

        if (virtualclass.poll.currResultView !== 'list') {
          virtualclass.poll.showChart();
        }

        const msz = document.getElementById('pollResultMsz');
        if (msz) {
          msz.style.display = 'none';
        }

        const menu = document.querySelectorAll('#chartMenuCont button');
        for (let i = 0; i < menu.length; i++) {
          menu[i].classList.remove('disabled');
        }

        const obj = {};
        if (typeof virtualclass.poll.count[response] === 'undefined') {
          virtualclass.poll.count[response] = 0;
        }

        // console.log('====> count ', virtualclass.poll.count);
        virtualclass.poll.count[response] = virtualclass.poll.count[response] + 1;
        obj[fromUser.userid] = response;
        obj.username = fromUser.name;
        virtualclass.poll.list.push(obj);
        if (virtualclass.poll.currResultView === 'bar') {
          virtualclass.poll.showGraph();
          virtualclass.poll.updateBarGraph();
        } else if (virtualclass.poll.currResultView === 'pi') {
          virtualclass.poll.updatePiChart();
        } else if (virtualclass.poll.currResultView === 'list') {
          virtualclass.poll.updateListResult();
        }
      },


      updateVotingInformation() {
        console.log('====> POLL UPDATE VOTING INFORMATION ')
        const joinedUsers = Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers') ? virtualclass.connectedUsers.length : 0;
        let usersVote = 0;

        for (const i in virtualclass.poll.count) {
          usersVote += virtualclass.poll.count[i];
        }

        let participients = joinedUsers ? joinedUsers - 1 : 0;

        // if (virtualclass.poll.pollState.data) {
        //   virtualclass.poll.pollState.data.totalUsers = (pt) || participients;
        // }

        const number = virtualclass.poll.uniqueUsers.length ? virtualclass.poll.uniqueUsers.length : 0;
        if (number) {
          participients = number;
        }

        const votes = document.getElementById('receivedVotes');
        if (votes != null) {
          votes.innerHTML = `${usersVote}\/${participients}`;
        }
      },

      updateBarGraph() {
        // const chart = document.getElementById('chart');
        const msz = document.getElementById('pollResultMsz');
        const columns = [];
        const data = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
        for (const i in virtualclass.poll.count) {
          const optedVal = data.options[i];
          columns.push([optedVal, virtualclass.poll.count[i]]);
          if (virtualclass.poll.count[i]) {
            // if (chart) {
            //   chart.style.display = 'block';
            // }
            virtualclass.poll.showChart();
            if (msz) {
              msz.style.display = 'none';
            }
          }
        }

        for (const i in data.options) {
          if (!Object.prototype.hasOwnProperty.call(virtualclass.poll.count, i)) {
            columns.push([data.options[i], '0']);
            virtualclass.poll.count[i] = 0;
          }
        }

        if (virtualclass.poll.chart) {
          // On page refreseh, we need the width of parent node of #chart
          // displaying block #virtualclassApp is giving the correct width
          // if (!virtualclass.config.makeWebSocketReady) {
          //   const virtualclassAppCont = document.querySelector('#virtualclassApp');
          //   virtualclassAppCont.style.display = 'block';
          //   virtualclass.poll.chart.load({
          //     columns,
          //   });
          //   virtualclassAppCont.style.display = 'none';
          // } else {
          //   virtualclass.poll.chart.load({
          //     columns,
          //   });
          // }

          // Enabling the above code would shifted the graph towards right side
          virtualclass.poll.chart.load({
            columns,
          });
        }
        if (roles.hasControls()) {
          this.updateVotingInformation();
        }
      },
      updatePiChart() {
        // const chart = document.getElementById('chart');
        const msz = document.getElementById('pollResultMsz');
        this.updateVotingInformation();
        const data = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
        const columns = [];
        for (const i in virtualclass.poll.count) {
          const optedVal = data.options[i];
          columns.push([optedVal, virtualclass.poll.count[i]]);
          if (virtualclass.poll.count[i]) {
            // if (chart) {
            //   chart.style.display = 'block';
            // }
            virtualclass.poll.showChart();
            if (msz) {
              msz.style.display = 'none';
            }
          }
        }

        for (const i in data.options) {
          if (!Object.prototype.hasOwnProperty.call(virtualclass.poll.count, i)) {
            columns.push([data.options[i], '0']);
            virtualclass.poll.count[i] = 0;
            // console.log('====> Poll count ', virtualclass.poll.count)
          }
        }

        if (virtualclass.poll.piChart) {
          virtualclass.poll.piChart.load({
            columns,
          });
        }
      },
      updateListResult() {
        this.updateVotingInformation();
        const item = virtualclass.poll.list.pop();
        virtualclass.poll.addResultListItem(item);
        virtualclass.poll.list.push(item);
        virtualclass.poll.pollState.data.list = virtualclass.poll.list;
      },
      createPiChart() {
        const graphdata = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
        virtualclass.poll.currResultView = 'pi';
        // const chart = document.getElementById('chart');
        // chart.style.display = 'none';
        virtualclass.poll.hideChart();
        const listCont = document.getElementById('listCont');
        if (listCont) {
          listCont.style.display = 'none';
        }

        const columns = [];
        let isNonZero = false;
        for (const i in virtualclass.poll.count) {
          const optedVal = graphdata.options[i];
          columns.push([optedVal, virtualclass.poll.count[i]]);
          if (virtualclass.poll.count[i]) {
            isNonZero = true;
          }
        }
        if (isNonZero) {
          // chart.style.display = 'block';
          virtualclass.poll.showChart();
        }

        virtualclass.poll.piChart = c3.generate({
          data: {
            // iris data from R
            columns,
            transition: {
              duration: null,
            },
            type: 'pie',

            onclick(d, i) {
              // console.log('onclick', d, i);
            },
            onmouseover(d, i) {
              // console.log('onmouseover', d, i);
            },
            onmouseout(d, i) {
              // console.log('onmouseout', d, i);
            },
          },
        });
        virtualclass.poll.currResultView = 'pi';
        if (typeof virtualclass.poll.pollState.data !== 'undefined') {
          virtualclass.poll.pollState.data.view = 'pi';
        }
      },
      listView() {
        let list;
        virtualclass.poll.currResultView = 'list';
        // const chart = document.getElementById('chart');
        // chart.style.display = 'none';
        virtualclass.poll.hideChart();
        const cont = document.getElementById('resultLayoutBody');
        list = document.getElementById('listCont');

        if (list.hasChildNodes()) {
          list.removeChild(list.childNodes[0]);
        }
        if (virtualclass.poll.list.length > 0) {
          virtualclass.poll.createResponseTable(cont);
          const msz = document.getElementById('pollResultMsz');
          if (msz) {
            msz.parentNode.removeChild(msz);
          }
        }
        list = document.getElementById('listCont');
        if (list) {
          list.style.display = 'block';
        }
      },
      createResponseTable(cont) {
        const template = virtualclass.getTemplate('pollresultlist', 'poll');
        const listCont = document.querySelector('#virtualclassApp #listCont');
        listCont.insertAdjacentHTML('beforeend', template({}));
        virtualclass.poll.list.forEach((item, i) => {
          virtualclass.poll.addResultListItem(item, i);
        });

        virtualclass.poll.currResultView = 'list';
        if (typeof virtualclass.poll.pollState.data !== 'undefined') {
          virtualclass.poll.pollState.data.view = 'list';
          virtualclass.poll.pollState.data.list = virtualclass.poll.list;
        }
      },
      addResultListItem(item) {
        let elem;
        let val;
        const optedVal = virtualclass.poll.dataToStd.options;
        const tbody = document.getElementById('resultList');
        for (const j in item) {
          if (j !== 'username') {
            // const prop = j;
            val = item[j];
          }
        }

        const listItem = document.createElement('tr');
        tbody.appendChild(listItem);

        elem = document.createElement('td');
        const name = virtualclass.poll.capitalizeFirstLetterFnameLname(item.username);
        elem.innerHTML = name;
        listItem.appendChild(elem);

        elem = document.createElement('td');
        elem.innerHTML = optedVal[val];
        listItem.appendChild(elem);
      },

      capitalizeFirstLetterFnameLname(name) {
        let str;
        if (!name || name == null) {
          return;
        }
        const [firstname, lastname] = name.split(/\s*(?: |$)\s*/);
        const firstName = virtualclass.vutil.capitalizeFirstLetter(firstname);
        if (typeof lastname !== 'undefined') {
          const lastName = virtualclass.vutil.capitalizeFirstLetter(lastname);
          return `${firstName} ${lastName}`;
        } else {
          return `${firstName}`;
        }
      },

      barGraph() {
        // const chart = document.getElementById('chart');
        // if (chart) {
        //   chart.style.display = 'block';
        // }
        virtualclass.poll.showChart();
        virtualclass.poll.currResultView = 'bar';
        const listView = document.getElementById('listCont');
        if (listView) {
          listView.style.display = 'none';
        }

        virtualclass.poll.showGraph();
        virtualclass.poll.updateBarGraph();
        virtualclass.poll.pollState.data.view = 'bar';
      },
      // to generlize

      showGraph() {
        // console.log('====> chat graph ', document.querySelector('#chart').offsetWidth);
        const graphdata = roles.hasControls() ? virtualclass.poll.dataToStd : virtualclass.poll.dataRec;
        const columns = [];
        for (const i in virtualclass.poll.count) {
          const optedVal = graphdata.options[i];
          columns.push([optedVal, virtualclass.poll.count[i]]);
        }
        const Data = {};
        Data.type = 'bar';
        Data.columns = columns;
        virtualclass.poll.hideChart();
        const graphData = {
          bindto: '#chart',
          data: Data,
          bar: { width: { ratio: 0.5 } },
          axis: {
            y: {
              tick: {
                format: function (d) {
                  return (parseInt(d) === d) ? d : null;
                },
              },
              label: 'Votes',
            },
          },
        };

        // TODO, below property shoude be used instead of format method in above
        //   scale: {
        //     ticks: {
        //       precision:0
        //     }
        //   }


        // On page refreseh, we need the width of parent node of #chart
        // displaying block #virtualclassApp is giving the correct width
        // if (!virtualclass.config.makeWebSocketReady) {
        //   const virtualclassAppCont = document.querySelector('#virtualclassApp');
        //   // virtualclassAppCont.style.display = 'block';
        //   alert(virtualclassAppCont.offsetWidth);
        //   virtualclass.poll.chart = c3.generate(graphData);
        //   //virtualclassAppCont.style.display = 'none';
        // } else {
        //   virtualclass.poll.chart = c3.generate(graphData);
        // }
        virtualclass.poll.chart = c3.generate(graphData);
      },

      hideChart() {
        const chart = document.getElementById('chart');
        if (chart) {
          chart.style.display = 'none';
        }
        console.log('====> chat graph hide ', document.querySelector('#chart').offsetWidth);
      },

      showChart() {
        const chart = document.getElementById('chart');
        if (chart) {
          chart.style.display = 'block';
        }
        //  console.log('====> chat graph show ', document.querySelector('#chart').offsetWidth);
      },

      UI: {
        id: 'virtualclassPoll',
        class: 'virtualclass',
        /*
         * Creates container for the poll and appends the container before audio widget
         */
        container() {
          const pollCont = document.getElementById(this.id);
          if (pollCont != null) {
            pollCont.parentNode.removeChild(pollCont);
          }

          const template = virtualclass.getTemplate('pollmain', 'poll');
          const control = !!roles.hasAdmin();
          virtualclass.vutil.insertAppLayout(template({ control }));

          if (roles.hasAdmin()) {
            const coursePollNav = document.querySelector('#coursePollTab');
            const sitePollNav = document.querySelector('#sitePollTab');
            sitePollNav.addEventListener('click', () => {
              const category = 0;
              coursePollNav.classList.remove('active');
              sitePollNav.classList.add('active');
              sitePollNav.style.pointerEvents = 'none';
              coursePollNav.style.pointerEvents = 'visible';
              virtualclass.poll.interfaceToFetchList(category);
            });

            coursePollNav.addEventListener('click', () => {
              sitePollNav.classList.remove('active');
              coursePollNav.classList.add('active');
              coursePollNav.style.pointerEvents = 'none';
              sitePollNav.style.pointerEvents = 'visible';
              virtualclass.poll.interfaceToFetchList(virtualclass.poll.cmid);
            });
          } else {
            const resultNav = document.querySelector('#virtualclassCont.congrea.student #navigator #pollResult');
            resultNav.style.display = 'none';

            const stdNav = document.querySelector('.congrea.student #virtualclassPoll #navigator #pollResult');
            stdNav.addEventListener('click', () => {
              virtualclass.poll.showStudentPollReport(virtualclass.poll.previousResult);
              stdNav.classList.add('active');
            });
          }
        },

        resultView(istimer, pollType) {
          let btn;
          // console.log('====> Poll result view 1B ');
          if (roles.hasControls()) {
            this.createResultLayout();
            if (!istimer) {
              const head = document.getElementById('resultLayoutHead');
              btn = document.getElementById('closePoll');
              if (!btn) {
                btn = document.createElement('button');
                btn.id = 'closePoll';
                btn.className = 'btn btn-default col-md-2';
                head.appendChild(btn);
                btn.innerHTML = virtualclass.lang.getString('closeVoting');
                btn.addEventListener('click', () => {
                  virtualclass.poll.closePoll(pollType);
                });

                const iconClose = document.createElement('i');
                iconClose.className = 'icon-close-poll';
                btn.appendChild(iconClose);
              }
            }
          }
          const modalClose = document.getElementById('modalClose');
          if (modalClose) {
            modalClose.removeAttribute('data-dismiss');
            modalClose.addEventListener('click', () => {
              virtualclass.poll.pollModalClose(pollType);
            });
          }
          virtualclass.poll.count = {};
          // console.log('====> Poll count ', virtualclass.poll.count)
          virtualclass.poll.list = [];
        },

        createResultLayout() {
          let template;
          const resultLayout = document.getElementById('resultLayout');
          if (resultLayout) {
            resultLayout.parentNode.removeChild(resultLayout);
          }

          const control = !!roles.hasControls();
          const obj = {};
          obj.control = control;
          if (roles.hasControls()) {
            obj.question = virtualclass.poll.dataToStd.question;
            obj.options = virtualclass.poll.dataToStd.options;

            template = virtualclass.getTemplate('result-modal', 'poll');
            const modal = document.querySelector('#editPollModal');
            if (modal) {
              modal.remove();
            }
            const bsCont = document.querySelector('#bootstrapCont');
            bsCont.insertAdjacentHTML('beforeend', template({ obj }));

            const menu = document.querySelectorAll('#chartMenuCont button');
            for (let i = 0; i < menu.length; i++) {
              menu[i].classList.add('disabled');
            }
          } else {
            obj.question = virtualclass.poll.dataRec.question;
            template = virtualclass.getTemplate('stdResult', 'poll');
            const vcPoll = document.querySelector('#virtualclassPoll');
            vcPoll.insertAdjacentHTML('beforeend', template({ obj }));
          }

          this.resultLayoutBody();
        },
        resultNotShownUI(header) {
          let mszbox;
          const resultMain = document.querySelector('#resultLayoutBody');
          if (resultMain) {
            resultMain.style.display = 'none';
          }

          mszbox = document.getElementById('mszBoxPoll');
          const i = 0;
          if (mszbox) {
            while (mszbox.childNodes.length > 0) {
              mszbox.removeChild(mszbox.childNodes[i]);
            }
          } else {
            mszbox = document.createElement('div');
            mszbox.id = 'mszBoxPoll';
            resultMain.appendChild(mszbox);
          }
          const msg = virtualclass.lang.getString('noResultStd');

          const msgcont = document.querySelector('#mszBoxPoll');
          msgcont.style.display = 'block';


          const head = document.querySelector('#resultLayoutHead');
          if (head) {
            head.style.display = 'none';
          }

          virtualclass.poll.showMsg('mszBoxPoll', msg, 'alert-success');
        },

        resultLayoutBody(cont) {
          const qnLabel = document.querySelector('#qnLabelCont');
          if (qnLabel) {
            if (roles.hasControls()) {
              qnLabel.innerHTML = virtualclass.poll.dataToStd.question;
            }

            if (roles.hasControls()) {
              this.chartMenu();
              this.createResultMsgCont();
            }
          }
        },
        createResultMsgCont(cont) {
          const elem = document.getElementById('pollResultMsz');
          elem.innerHTML = virtualclass.lang.getString('watstdrespo');
        },
        pollClosedUI() {
          const closeBtn = document.getElementById('closePoll');
          if (closeBtn) {
            closeBtn.parentNode.removeChild(closeBtn);
          }

          const votersElem = document.getElementById('congreaPollVoters');
          if (votersElem) {
            votersElem.innerHTML = virtualclass.lang.getString('rvtu');
          }

          const mszElem = document.getElementById('pollResultMsz');
          if (mszElem) {
            mszElem.parentNode.removeChild(mszElem);
          }
        },
        chartMenu(cont) {
          const barElem = document.querySelector('#chartMenuCont #bar');
          barElem.addEventListener('click', virtualclass.poll.barGraph);

          const pi = document.querySelector('#chartMenuCont #pi');
          pi.addEventListener('click', virtualclass.poll.createPiChart);

          if (roles.hasControls()) {
            const elem = document.querySelector('#chartMenuCont #rList');
            elem.addEventListener('click', virtualclass.poll.listView);
          }
        },
        qnLabel(cont) {
          const chart = document.createElement('div');
          chart.id = 'chart';
          chart.className = 'row';
          cont.appendChild(chart);
          console.log('====> chat graph, container ', document.querySelector('#chart').offsetWidth);
        },

        createNav(pollCont) {
          if (!roles.hasControls()) {
            const stdNav = document.querySelector('.congrea.student #virtualclassPoll #navigator a');
            stdNav.addEventListener('click', () => {
              virtualclass.poll.showStudentPollReport();
            });
          }
        },
        createMszBox(cont) {
          const elem = document.createElement('div');
          elem.id = 'mszBoxPoll';
          elem.className = 'row';
          cont.appendChild(elem);
        },

        createOption(qIndex, type) {
          let x;
          let y;
          const optsCont = document.getElementById('optsTxCont');
          const elem = optsCont.querySelectorAll('#optsTxCont .opt');
          let count = 0;
          for (let i = 0; i < elem.length; i++) {
            count++;
            x = elem[i].id;
          }
          const newIndex = count;
          if (x) {
            y = newIndex;
          } else {
            y = '0';
          }
          const close = {};
          close.index = y;
          close.closeBtn = y > 1;
          const template = virtualclass.getTemplate('optioninput', 'poll');
          const html = template({ close });

          const addMore = document.querySelector('#addMoreCont');
          addMore.insertAdjacentHTML('beforebegin', html);
          const closeElem = document.getElementById(`remove${y}`);
          closeElem.addEventListener('click', () => {
            virtualclass.poll.removeOption(type, qIndex, `remove${y}`);
          });
        },
        hidePrevious(index) {
          const optsTxCont = document.getElementById('optsTxCont');
          if (optsTxCont) {
            optsTxCont.parentNode.removeChild(optsTxCont);
          }

          const resetElem = document.getElementById('reset');
          if (resetElem) {
            resetElem.style.display = 'none';
          }
          const footer = document.getElementById('footerCtrCont');
          footer.parentNode.removeChild(footer);
        },
        editPoll(pollType, index) {
          virtualclass.poll.UI.loadContent(pollType, index);
          virtualclass.poll.UI.footerBtns(pollType, index);
        },
        // this  temp**
        loadContent(pollType, index) {
          let opts = [];
          const el = document.getElementById('qnTxCont');

          virtualclass.poll.UI.editQn(pollType, index);
          opts = poll.options;
          let optsCount = 0;
          if (typeof opts === 'object') {
            for (const i in opts) {
              // console.log(i);
              optsCount++;
              virtualclass.poll.UI.editOptions(pollType, index, i, optsCount);
            }
          } else {
            for (let i = 0; i < opts.length; i++) {
              virtualclass.poll.UI.editOptions(pollType, index, i, optsCount);
            }
          }
        },
        previewFooterBtns(footerCont, pollType, index) {
          const cont = document.getElementById('footerCtrCont');
          if (cont) {
            virtualclass.poll.pollPopUp(virtualclass.poll.popupFn, index, pollType);
          }
        },
        footerBtns(pollType, index) {
          if (pollType) {
            virtualclass.poll.pollPopUp(virtualclass.poll.popupFn, index, pollType);
          }
        },
        editQn(pollType, index) {
          const qn = document.querySelector('#qnTxCont #q');
          if (qn == null) {
            qn.value = document.getElementById(`qnText${pollType}${index}`).innerHTML;
          }
          if (qn != null && !qn.value) {
            if (pollType === 'course') {
              qn.value = virtualclass.poll.coursePoll[index].questiontext;
            } else {
              qn.value = virtualclass.poll.sitePoll[index].questiontext;
            }
          }
        },
        editOptions(pollType, qIndex, prop, optsCount) {
          const el = document.getElementById('optsTxCont');
          el.style.display = 'block';

          const opt = document.getElementById(`opt${qIndex}${prop}`);
          if (optsCount > 2) {
            const close = document.createElement('a');
            close.id = `remove${prop}`;
            close.className = 'close';
            close.innerHTML = '&times';
            const cont = document.querySelector(`#optsTxCont .inputWrapper #option${prop}`).parentNode;
            cont.appendChild(close);
            close.addEventListener('click', () => {
              virtualclass.poll.removeOption(pollType, qIndex, close.id);
            });
          }

          const option = document.getElementById(`option${prop}`);
          if (pollType === 'course') {
            const courseOpts = virtualclass.poll.coursePoll[qIndex].options[prop];
            option.value = (typeof courseOpts === 'object') ? courseOpts.options : courseOpts;
          } else {
            const siteOpts = virtualclass.poll.sitePoll[qIndex].options[prop];
            option.value = (typeof siteOpts === 'object') ? siteOpts.options : siteOpts;
          }
        },
        pollSettingUI(index, label) {
          function range(lowEnd, highEnd) {
            const arr = [];
            let c = highEnd - lowEnd + 1;
            while (c--) {
              arr[c] = highEnd--;
            }
            return arr;
          }

          const template = virtualclass.getTemplate('setting-modal', 'poll');
          const modal = document.querySelector('#editPollModal');
          while (modal.firstChild) {
            modal.removeChild(modal.firstChild);
          }
          modal.insertAdjacentHTML('beforeend', template({ time: range(1, 60) }));
          this.settingUIBody(index, label);
        },

        settingUIBody(index, label) {
          this.addSettingHandlers();
        },
        addSettingHandlers() {
          const mode = document.getElementById('mode');
          mode.addEventListener('click', () => {
            const r1 = document.getElementById('radioBtn1');
            const r2 = document.getElementById('radioBtn2');
            if (r1.checked) {
              // var timer = document.getElementById('timer');
              document.getElementById('timer').setAttribute('disabled', true);
              // var unit = document.getElementById('ut');
              document.getElementById('ut').setAttribute('disabled', true);
            } else if (r2.checked) {
              // var timer = document.getElementById('timer');
              document.getElementById('timer').removeAttribute('disabled');
              // var unit = document.getElementById('ut');
              document.getElementById('ut').removeAttribute('disabled');
            }
          });
        },

        defaultLayoutForStudent() {
          this.container();
          const mszCont = document.getElementById('mszBoxPoll');
          const messageLayoutId = 'stdPollMszLayout';
          if (document.getElementById(messageLayoutId) == null) {
            const studentMessage = document.createElement('div');
            studentMessage.id = messageLayoutId;
            studentMessage.innerHTML = virtualclass.lang.getString('pollmaybeshown');
            mszCont.appendChild(studentMessage);
          }
        },
        stdPublishUI() {
          const msz = document.getElementById('stdPollMszLayout');
          if (msz) {
            msz.parentNode.removeChild(msz);
          }
        },
        disableClose() {
          const close = document.getElementById('pollClose');
          close.style.display = 'none';
        },

      },

      updateUsersOnPoll(e) {
        if (e.hasOwnProperty('users')) {
          virtualclass.poll.uniqueUsers = e.message.map(obj => obj.userid);
          virtualclass.poll.uniqueUsers = virtualclass.poll.uniqueUsers.filter((userid) => {
            if (userid !== virtualclass.gObj.uid) {
              return userid;
            }
          });
          if (Object.keys(virtualclass.poll.count).length > 0) {
            virtualclass.poll.updateVotingInformation();
          }
        } else {
          if ((virtualclass.poll.uniqueUsers.indexOf(virtualclass.jId) < 0)) {
            const teacherId = virtualclass.vutil.whoIsTeacher();
            if (teacherId !== virtualclass.jId) {
              virtualclass.poll.uniqueUsers.push(virtualclass.jId);
              if (Object.keys(virtualclass.poll.count).length > 0) {
                virtualclass.poll.updateVotingInformation();
              }
            }
          }
        }
      },

      makeGraphResponsive() {
        if (virtualclass.poll.pollState && virtualclass.poll.pollState.currScreen === 'stdPublishResult'
          && virtualclass.poll.currResultView) {
          let graphElement;
          if (virtualclass.poll.currResultView === 'bar') {
            graphElement = document.querySelector('#chartMenuCont #bar');
          } else {
            graphElement = document.querySelector('#chartMenuCont #pi');
          }
          if (graphElement) graphElement.click();
        }
      },
    };
  };
  window.poll = poll;
}(window));
