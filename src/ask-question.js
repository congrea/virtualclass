/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
// This class is responsible to render HTML of each component of Ask Question

class BasicOperation {
  generateData(data) {
    const qnCreateTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    const qId = `${data.component}-${virtualclass.gObj.uid}-${qnCreateTime}`;
    data.id = qId;
    data.timeStamp = qnCreateTime;
    data.context = virtualclass.askQuestion.currentContext;
    data.userId = virtualclass.uInfo.userid;
    return data;
  }

  send(data) {
    // const docName = data.timeStamp.toString();
    if (!virtualclass.askQuestion.collection) {
      virtualclass.askQuestion.setDbCollection();
      virtualclass.askQuestion.attachHandlerForRealTimeUpdate();
    }
    virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(data.id).set(data)
      .then(() => {
        console.log('ask question write, Document successfully written! ', data);
      })
      .catch((error) => {
        console.error('ask question write, Error writing document: ', error);
      });
  }
}

class QAquestion extends BasicOperation {
  create(data) {
    const textTemp = document.querySelector('#writeContent');
    if (textTemp) {
      textTemp.remove();
    }
    this.renderer(data);
    const question = { id: data.id, content: data.text, children: [], status: data.action, parent: null };
    // TODO, this should not be here
    virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][question.id] = question;
  }

  edit(data) {
    const textTemp = document.querySelector('#writeContent');
    if (textTemp) {
      textTemp.remove();
    }
    const chkContextElem = document.querySelector(`.context[data-context~=${data.context}]`);
    if (chkContextElem) {
      if (data.context === chkContextElem.dataset.context) {
        if (data.action === 'edit') {
          const questionTemp = document.querySelector(`[data-context~=${data.context}] #${data.questionId} .content p`);
          questionTemp.innerHTML = data.text;
        }
      }
    }
    // TODO, this has to be simplified
    virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.questionId].status = 'edited';
    virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.questionId].content = data.text;
  }

  delete(data) {
    console.log('question deleted ', data);
    delete virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.questionId];
    const elem = document.querySelector(`[data-context~=${data.context}] #${data.questionId}`);
    // TODO, we have to remove answers and related comments from inline structure
    elem.remove();
  }

  upvote(data) {
    if (data.upvote) {
      if (data.upvote == 1) virtualclass.askQuestion.firstid = data.id;
      document.querySelector(`#${data.parent} .upVote .total`).innerHTML = data.upvote;
      if (data.userId === virtualclass.uInfo.userid) {
        document.querySelector(`#${data.parent} .upVote`).dataset.upvote = 'upvoted';
      }
    }
  }

  renderer(data) {
    console.log('Create ', data);
    if (data.type === 'input') {
      const context = {};
      const qaPostTemp = virtualclass.getTemplate('qaPost', 'askQuestion');
      const qaTemp = qaPostTemp(context);
      if (typeof data.content !== 'undefined' && typeof data.questionId !== 'undefined') {
        if (data.userId === virtualclass.gObj.uid) {
          document.querySelector(`#${data.questionId}`).insertAdjacentHTML('beforeend', qaTemp);
          const text = document.querySelector('#writeContent .text');
          text.innerHTML = data.content;
          if (text) {
            text.addEventListener('keyup', this.inputHandler.bind(this));
          }
        }
      } else {
        document.querySelector('#askQuestion').insertAdjacentHTML('beforeend', qaTemp);
        const text = document.querySelector('#writeContent .text');
        if (text) {
          text.addEventListener('keyup', this.inputHandler.bind(this));
        }
      }
    } else if (data.type === 'questionBox') {
      const chkContextElem = document.querySelector(`.context[data-context~=${data.context}]`);
      if (chkContextElem) {
        const qaTemp = virtualclass.getTemplate('question', 'askQuestion');
        const qtemp = qaTemp({ id: data.id, userName: data.uname });
        document.querySelector(`[data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', qtemp);
        document.querySelector(`#${data.id} .content p`).innerHTML = data.text;
      } else {
        const getContextTemp = virtualclass.getTemplate('context', 'askQuestion');
        const cTemp = getContextTemp({ context: data.context });
        document.querySelector('#askQuestion .container').insertAdjacentHTML('beforeend', cTemp);
        const qaTemp = virtualclass.getTemplate('question', 'askQuestion');
        const qtemp = qaTemp({ id: data.id, userName: data.uname });
        document.querySelector(`[data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', qtemp);
        document.querySelector(`[data-context~=${data.context}]`).classList.add('current');
        document.querySelector(`#${data.id} .content p`).innerHTML = data.text;
      }
      if (data.userId === virtualclass.uInfo.userid) {
        document.querySelector(`#${data.id} .upVote`).dataset.upvote = 'upvoted';
      }

      const qnElem = document.querySelector(`#${data.id}.question`);
      if (qnElem) {
        qnElem.addEventListener('click', (ev) => {
          if (ev.target.parentNode.dataset.type === 'upvote' || ev.target.parentNode.dataset.type === 'reply'
            || ev.target.parentNode.dataset.type === 'answersNavigation') {
            if (ev.target.parentNode.dataset.type === 'upvote') {
              this.upvoteOnQn(ev);
            }
          } else if (ev.target.dataset.type === 'edit' || ev.target.dataset.type === 'delete') {
            if (ev.target.dataset.type === 'edit') {
              this.updateQn(ev);
            } else {
              this.deleteQn(ev);
            }
          }
        });
      }
    }
  }

  inputHandler(ev) {
    console.log('Add input handler');
    if (ev.keyCode === 13 && ev.target.parentNode.parentNode.id === 'askQuestion') {
      const data = this.generateData({
        component: 'question',
        text: ev.target.value,
        type: 'questionBox',
        action: 'create',
        uname: virtualclass.uInfo.userobj.name,
      });
      this.send(data);
    } else if (ev.keyCode === 13 && ev.target.parentNode.parentNode.id !== 'askQuestion') {
      const data = this.generateData({
        component: 'question',
        text: ev.target.value,
        type: 'questionBox',
        action: 'edit',
        uname: virtualclass.uInfo.userobj.name,
        questionId: ev.target.parentNode.parentNode.id,
      });
      this.send(data);
    }
  }

  updateQn(ev) {
    const text = document.querySelector(`#${ev.target.parentNode.dataset.parent} .content p`).innerHTML;
    const data = this.generateData({
      component: 'question',
      action: 'renderer',
      type: 'input',
      content: text,
      questionId: ev.target.parentNode.dataset.parent,
      parent: null,
    });
    this.send(data);
  }

  deleteQn(ev) {
    const data = this.generateData({
      component: ev.target.parentNode.parentNode.dataset.type,
      action: ev.target.dataset.type,
      questionId: ev.target.parentNode.dataset.parent,
      parent: null,
    });
    this.send(data);
  }

  upvoteOnQn(ev) {
    const parent = ev.target.parentNode.parentNode.dataset; // TODO improve removing parentNode
    const data = this.generateData({ component: parent.type, action: ev.target.parentNode.dataset.type });
    const upvoteCount = ev.target.nextSibling.innerHTML;
    if (upvoteCount == '0') {
      data.upvote = 1;
      data.parent = parent.parent;
      virtualclass.askQuestion.context[data.context][data.component].send(data);
      // virtualclass.askQuestion[data.component].send(data);
      virtualclass.askQuestion.firstid = data.id;
    } else {
      virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(virtualclass.askQuestion.firstid).update('upvote', firebase.firestore.FieldValue.increment(1));
    }
  }
}

class QAanswer {
  create(data) {
    console.log('Create ', data);
  }

  edit(data) {
    console.log('Create ', data);
  }

  delete(data) {
    console.log('Create ', data);
  }

  upvote(data) {
    if (data.firstTime) {
      this.send(data);
    } else {
      this.db.collection(this.collection).doc(data.id).update(data.action, firebase.firestore.FieldValue.increment(1));
    }
  }

  renderer(data) {
    console.log('Create ', data);
  }
}

class QAcomment {
  create(data) {
    console.log('Create ', data);
  }

  edit(data) {
    console.log('edit ', data);
  }

  delete(data) {
    console.log('delete ', data);
  }

  renderer(data) {
    console.log('renderer ', data);
  }
}

class AskQuestionContext {
  constructor() {
    this.actions = [];
    this.question = new QAquestion();
    this.answer = new QAanswer();
    this.comment = new QAcomment();
  }
}

class AskQuestionEngine {
  constructor() {
    this.queue = [];
    this.context = {};
    this.firstRealTime = true;
    this.initialize = false;
  }

  performWithQueue(data) {
    this.makeQueue(data);
    this.perform(data.context);
  }

  makeQueue(data) {
    if (!this.queue[data.context]) this.queue[data.context] = [];
    this.queue[data.context].push(data);
  }

  perform(context) {
    while (this.queue[context].length > 0) {
      const data = this.queue[context].shift();
      if (data.component === 'question' && data.upvote && data.upvote > 1) {
        this.context[data.context][data.component].upvote.call(this.context[data.context][data.component], data);
      } else {
        // context = whiteboard 1/screen share, component = question/answer, action = create/edit
        this.context[data.context][data.component][data.action].call(this.context[data.context][data.component], data);
      }
    }
  }
}

class AskQuestion extends AskQuestionEngine {
  init() {
    if (this.initialize) return;
    this.initialize = true;
    console.log('ask question init');
    this.renderer();
  }

  async initFirebaseOperatoin() {
    if (this.initFirebase) return;
    this.initFirebase = true;

    const config = {
      apiKey: 'AIzaSyDx4OisyZGmbcAx57s0zlwRlopPNNDqxSs',
      authDomain: 'vidyamantra-congrea.firebaseapp.com',
      databaseURL: 'https://vidyamantra-congrea.firebaseio.com',
      projectId: 'vidyamantra-congrea',
      storageBucket: 'vidyamantra-congrea.appspot.com',
      messagingSenderId: '1041362522462',
      appId: '1:1041362522462:web:19396cecc1c79a6dea7fcf',
      measurementId: 'G-PDLZDWQ06W',
    };
    const result = await this.authenticate(config);
    if (result && Object.prototype.hasOwnProperty.call(result, 'operationType')) {
      this.afterSignIn();
    } else {
      console.log(`There is some error${result}`);
    }
  }

  makeReadyContext() {
    if (this.clearTimeMakeReady) clearTimeout(this.clearTimeMakeReady);
    this.clearTimeMakeReady = setTimeout(() => { this.innerMakeReadyContext()}, 200);
  }

  innerMakeReadyContext() {
    let contextName;
    switch (virtualclass.currApp) {
      case 'Whiteboard':
      case 'DocumentShare':
        contextName = virtualclass.gObj.currWb;
        break;
      case 'EditorRich':
        contextName = 'editor';
        break;
      case 'SharePresentation':
        contextName = null;
        if (virtualclass.sharePt.currId && virtualclass.sharePt.state) {
          contextName = `sharePt-${virtualclass.sharePt.currId}_${virtualclass.sharePt.state.indexv}_${virtualclass.sharePt.state.indexh}`;
        }
        break;
      case 'Video':
        if (virtualclass.videoUl.videoId) contextName = `video-${virtualclass.videoUl.videoId}`;
        break;
      case 'ScreenShare':
        if (virtualclass.gObj.screenShareId) contextName = virtualclass.gObj.screenShareId;
        break;
      default:
        contextName = null;
    }

    if (contextName === this.currentContext || !contextName) return;

    const askQuestoinContainer = document.getElementById('askQuestion');
    if (askQuestoinContainer) {
      if (!contextName) {
        askQuestoinContainer.classList.remove('readyContext');
      } else {
        askQuestoinContainer.classList.add('readyContext');
      }
    }

    this.currentContext = contextName;
    const getContextElem = document.querySelector('#askQuestion .container .current');
    const contextElem = document.querySelector(`.context[data-context~=${this.currentContext}]`);
    if (contextElem && !contextElem.classList.contains('current')) {
      contextElem.classList.add('current');
    }

    if (getContextElem && getContextElem.classList.contains('current')) {
      getContextElem.classList.remove('current');
    }

    if (this.currentContext && !this.context[contextName]) {
      this.context[contextName] = new AskQuestionContext();
    }

    if (this.queue[this.currentContext] && this.queue[this.currentContext].length > 0) {
      this.perform(this.currentContext);
    }
    console.log('====> ready context ', this.currentContext);
  }

  async authenticate(config) {
    firebase.initializeApp(config);
    if (!this.db) this.db = firebase.firestore();
    this.setDbCollection();
    const result = await virtualclass.xhrn.getAskQnAccess();
    if (result) return firebase.auth().signInWithCustomToken(result.data);
    return false;
  }

  setDbCollection() {
    if (virtualclass.isPlayMode) {
      this.collection = `${wbUser.lkey}_${wbUser.session}_${wbUser.room}`;
    } else if (localStorage.getItem('mySession') != null) {
      console.log('====> hello guys');
      this.collection = `${wbUser.lkey}_${localStorage.getItem('mySession')}_${wbUser.room}`;
    }
  }

  attachHandlerForRealTimeUpdate() {
    console.log('===> Attach Real time update ');
    this.db.collection(this.collection)
      .onSnapshot((querySnapshot) => {
        // TODO, we have to load the initial data from here

        // if (this.firstRealTime) {
        //   this.firstRealTime = false
        // } else {
        //   querySnapshot.docChanges().forEach((change) => {
        //       if (change.type === 'added' || change.type === 'modified') {
        //       const data = change.doc.data();
        //       if (data.context === virtualclass.askQuestion.currentContext) {
        //         this.performWithQueue(data);
        //       } else {
        //         this.makeQueue(data);
        //       }
        //     };
        //   });
        // }

        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            const data = change.doc.data();
            if (data.context === virtualclass.askQuestion.currentContext) {
              this.performWithQueue(data);
            } else {
              this.makeQueue(data);
            }
          };
        });

      }, (error) => {
        console.log('ask question real time ', error);
      });
  }

  afterSignIn() {
    console.log('====> after sign in');
    // this.loadInitialData();
    if (this.collection) this.attachHandlerForRealTimeUpdate();
  }

  loadInitialData() {
    this.db.collection(this.collection).get().then((snapshot) => {
      // TODO, we have to store the inital data from attachHandlerForRealTimeUpdate
      snapshot.docs.forEach((doc) => {
        this.makeQueue(doc.data());
        // this.context[data.context].actions.push(data);
      });
    }).catch((error) => {
      console.log('ask question read error ', error);
    });
  }

  renderer() {
    // TODO, this code needs to be simplified
    const toggle = document.querySelector('#virtualclassCont.congrea #congHr');
    const context = {};
    const qaTemp = virtualclass.getTemplate('askQuestionMain', 'askQuestion');
    const qtemp = qaTemp(context);
    document.querySelector('#rightSubContainer').insertAdjacentHTML('beforeend', qtemp);

    toggle.addEventListener('click', () => {
      this.initFirebaseOperatoin();
      this.renderMainContainer(toggle);
    });

    const addQuestion = document.querySelector('#virtualclassCont.congrea .addQuestion-icon');
    if (addQuestion) {
      addQuestion.addEventListener('click', () => {
        this.performWithQueue({ component: 'question', action: 'renderer', type: 'input', context: virtualclass.askQuestion.currentContext });
      });
    }
  }

  renderMainContainer(toggle) {
    const chatroombt2 = document.getElementById('chatroom_bt2');
    const useList = document.getElementById('user_list');
    const setting = document.querySelector('#appSettingCtrl');
    const techVideo = document.querySelector('#virtualclassCont.congrea #techVideo');
    const settingD = document.querySelector('#virtualclassCont.congrea #appSettingDetail');
    virtualclass.chat.rightBarHeader('askQuestion');
    // Todo, get the active element, and remove active class from this element
    useList.classList.remove('active');
    techVideo.classList.remove('active');
    setting.classList.remove('active');
    chatroombt2.classList.remove('active');
    toggle.classList.add('active');

    const askQstn = document.querySelector('#virtualclassCont.congrea #askQuestion');
    if (askQstn.classList.contains('deactive')) {
      askQstn.classList.remove('deactive');
      askQstn.classList.add('active');
    }

    const chat = document.querySelector('#virtualclassCont.congrea #chatWidget');
    if (chat.classList.contains('active')) {
      chat.classList.remove('active');
      chat.classList.add('deactive');
    }
    settingD.classList.remove('active');
    if (!settingD.classList.contains('deactive')) {
      settingD.classList.add('deactive');
    }

    const chatbox = document.getElementById('ta_chrm2');
    if (chatbox) {
      chatbox.style.display = 'block';
    }

    const memlist = document.getElementById('memlist');
    if (memlist) {
      memlist.classList.remove('enable');
      if (!memlist.classList.contains('disable')) {
        memlist.classList.add('disable');
      }
    }

    const searchbox = document.getElementById('congreaUserSearch');
    if (searchbox) {
      searchbox.style.display = 'none';
    }

    const chatroom = document.getElementById('chatrm');
    if (chatroom) {
      if (chatroom.classList.contains('enable')) {
        chatroom.classList.remove('enable');
        chatroom.classList.add('disable');
      }
    }
    const taChrm = document.getElementById('ta_chrm2');
    if (taChrm) {
      taChrm.style.display = 'none';
    }

    if (this.queue[this.currentContext] && this.queue[this.currentContext].length > 0) {
      this.perform(this.currentContext);
    }
  }

  getCurrentQuestions() {
    return this.context[virtualclass.askQuestion.currentContext].question;
  }
}
