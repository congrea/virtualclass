/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
// This class is responsible to render HTML of each component of Ask Question

class NoteMain {
  init() {
    this.attachHandler();
  }

  attachHandler() {
    const note = document.getElementById('virtualclassnote');
    note.addEventListener('click', this.handler.bind(this));
  }

  handler() {
    this.renderMainContainer();
  }

  renderMainContainer() {
    let note = document.getElementById('noteContainer');
    if (note == null) {
      const noteMainContainer = virtualclass.getTemplate('note', 'notes');
      const noteMainContainerHtml = noteMainContainer({ context: virtualclass.askQuestion.currentContext });
      document.querySelector('#rightSubContainer').insertAdjacentHTML('beforeend', noteMainContainerHtml);
    }

    const activeElement = document.querySelector('#rightSubContainer .active');
    if (activeElement) {
      activeElement.classList.remove('active');
      activeElement.classList.add('deactive');
    }
    note = document.getElementById('noteContainer');
    note.classList.add('active');
  }
}

class BasicOperation {
  constructor () {
    this.events = ['edit', 'delete', 'upvote', 'markAnswer', 'moreControls', 'reply', 'navigation', 'createInput', 'save', 'cancel'];
  }

  generateData(data) {
    const qnCreateTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    data.id = `${data.component}-${virtualclass.gObj.uid}-${qnCreateTime}`;
    data.timestamp = qnCreateTime;
    data.context = virtualclass.askQuestion.currentContext;
    data.userId = virtualclass.uInfo.userid;
    return data;
  }

  send(data) {
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

  handler(ev) {
    let event;
    let parent;
    let componentId = null;
    const target = ev.target;
    if ((this.events.includes(target.dataset.event))) {
      event = target.dataset.event;
      parent = target.parentNode;
    } else if (this.events.includes(target.parentNode.dataset.event)) {
      event = target.parentNode.dataset.event;
      parent = target.parentNode.parentNode;
    } else if (this.events.includes(target.parentNode.parentNode.dataset.event)) {
      event = target.parentNode.parentNode.dataset.event;
      parent = target.parentNode.parentNode.parentNode;
    }

    if (event) {
      let data;
      let text;
      let action;
      let parentId = null;
      const component = parent.dataset.component;
      if (parent.dataset.componentId && event !== 'save') {
        componentId = parent.dataset.componentId;
        if (event === 'reply') {
          componentId = null;
          parentId = parent.dataset.componentId;
        } else if (event === 'edit' || event === 'markAnswer') {
          parentId = parent.dataset.parent;
        }
        if (event === 'cancel') {
          text = parent.previousSibling.value;
          data = { event, component, text, componentId, parentId };
        } else {
          data = { event, component, componentId, parentId };
        }
      }

      if (event === 'save') {
        text = parent.previousSibling.value;
        if (parent.dataset.componentId === null || parent.dataset.componentId === '') {
          action = 'create';
        } else {
          action = 'edit';
        }
        componentId = parent.dataset.componentId;
        parentId = (parent.dataset.parent) ? parent.dataset.parent : null;
        data = { event, component, componentId, text, action, parentId };
      }

      this.execute(data);
    }
  }

  execute (data) {
    const contextData = virtualclass.askQuestion.context;
    const currentContext = virtualclass.askQuestion.currentContext;
    if (data.event === 'reply') {
      data = {
        component: data.component === 'question' ? 'answer' : data.component,
        action: 'renderer',
        type: 'input',
        context: virtualclass.askQuestion.currentContext,
        componentId: data.componentId,
        parent: data.parentId,
      };
      virtualclass.askQuestion.performWithQueue(data);
    } else if (data.event === 'edit') {
      const moreControlElem = document.querySelector(`#${data.componentId} .moreControls .item`);
      if (moreControlElem.classList.contains('open')) {
        moreControlElem.classList.remove('open');
        moreControlElem.classList.add('close');
      }
      const currentEditTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
      const previousTime = ((data.componentId).split(`${data.component}-${virtualclass.uInfo.userid}-`))[1];
      const getActualTime = Math.floor((currentEditTime - (+previousTime)) / 60);
      if (getActualTime > 30 || contextData[currentContext][data.component][data.componentId].children.length > 0) {
        return;
      }
      const footerElem = document.querySelector(`#${data.componentId} .footer`);
      if (footerElem && footerElem.classList.contains('show')) {
        footerElem.classList.remove('show');
        footerElem.classList.add('hide');
      }
      const text = document.querySelector(`#${data.componentId} .content p`).innerHTML;
      const component = document.querySelector(`#${data.componentId} .content p`).dataset.component;
      data = this.generateData({
        action: 'renderer',
        type: 'input',
        content: text,
        component: component,
        componentId: data.componentId,
        parent: data.component === 'question' ? null : null,
      });
    } else if (data.event === 'delete') {
      if (contextData[currentContext][data.component][data.componentId].children.length > 0) {
        const moreControlElem = document.querySelector(`#${data.componentId} .moreControls .item`);
        if (moreControlElem.classList.contains('open')) {
          moreControlElem.classList.remove('open');
          moreControlElem.classList.add('close');
        }
        return;
      }
      data = this.generateData({
        component: data.component,
        action: data.event,
        componentId: data.componentId,
        parent: null,
      });
      this.send(data);
    } else if (data.event === 'upvote') {
      // const parent = data.componentId;
      const obj = this.generateData({ component: data.component, action: data.event });
      const upvoteCount = document.querySelector(`#${data.componentId} .upVote .total`).innerHTML;
      if (upvoteCount == '0') {
        obj.upvote = 1;
        obj.componentId = data.componentId;
        virtualclass.askQuestion.context[obj.context][data.component].send(obj);
        virtualclass.askQuestion.firstid = obj.id;
      } else {
        virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(virtualclass.askQuestion.firstid).update('upvote', firebase.firestore.FieldValue.increment(1));
      }
    } else if (data.event === 'moreControls') {
      data.action = 'moreControls';
    } else if (data.event === 'save') {
      if (data.componentId) {
        const footerElem = document.querySelector(`#${data.componentId} .footer`);
        if (footerElem && footerElem.classList.contains('hide')) {
          footerElem.classList.remove('hide');
          footerElem.classList.add('show');
        }
      }
      const obj = this.generateData({
        component: data.component,
        content: data.text,
        type: 'contentBox',
        action: data.action,
        uname: virtualclass.uInfo.userobj.name,
        componentId: data.componentId,
        parent: data.parentId,
      });
      if (data.action === 'create') {
        obj.componentId = obj.id;
      }
      this.send(obj);
    } else if (data.event === 'markAnswer') {
      const moreControlElem = document.querySelector(`#${data.componentId} .moreControls .item`);
      if (moreControlElem.classList.contains('open')) {
        moreControlElem.classList.remove('open');
        moreControlElem.classList.add('close');
      }
      const obj = this.generateData({
        component: data.component,
        action: data.event,
        uname: virtualclass.uInfo.userobj.name,
        componentId: data.componentId,
        parent: data.parentId,
      });
      this.send(obj);
    } else if (data.event === 'cancel') {
      const footerElem = document.querySelector(`#${data.componentId} .footer`);
      if (footerElem && footerElem.classList.contains('hide')) {
        footerElem.classList.remove('hide');
        footerElem.classList.add('show');
      }
      const text = document.querySelector('#writeContent .text');
      if (text) {
        text.remove();
      }
      const elem = document.querySelector(`#${data.componentId} .content p`);
      elem.innerHTML = contextData[currentContext][data.component][data.componentId].content;
    }
    if (data.event !== 'save' && data.event !== 'delete' && data.event !== 'upvote'
      && data.event !== 'markAnswer' && data.event !== 'cancel') {
      this[data.action].call(this, data);
    }
  }

  renderer(data) {
    let insertId;
    if (data.type === 'input') {
      if (data.component === 'question') {
        insertId = '#askQuestion';
      } else {
        insertId = '#' + ((data.componentId === null) ? data.parent : data.componentId);
        // insertId = '#' + data.componentId;
      }

      let text = document.querySelector('#writeContent .text');
      if (text) { return; }

      const context = { componentId: data.componentId, component: data.component, parent: data.parent };
      const userInput = virtualclass.getTemplate(data.type, 'askQuestion');
      const userInputTemplate = userInput(context);
      if (typeof data.content !== 'undefined' && typeof data.componentId !== 'undefined') {
        if (data.userId === virtualclass.gObj.uid) {
          document.querySelector(`#${data.componentId} .content p`).innerHTML = '';
          document.querySelector(`#${data.componentId} .content p`).insertAdjacentHTML('beforeend', userInputTemplate);
          text = document.querySelector('#writeContent .text');
          if (text) {
            text.innerHTML = data.content;
          }
        }
      } else {
        document.querySelector(insertId).insertAdjacentHTML('beforeend', userInputTemplate);
      }
      if (data.component === 'question') {
        const inputAction = document.querySelector('#writeContent');
        if (inputAction) {
          inputAction.addEventListener('click', this.handler.bind(this));
        }
      }
    } else if (data.type === 'contentBox') {
      if (data.component === 'question') {
        const chkContextElem = document.querySelector(`.context[data-context~=${data.context}]`);
        if ('question' && chkContextElem) {
          const componentTemplate = virtualclass.getTemplate(data.component, 'askQuestion');
          const htmlContent = componentTemplate({ id: data.id, userName: data.uname, content: data.content });
          document.querySelector(`[data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', htmlContent);
          // document.querySelector(`#${data.id} .content p`).innerHTML = data.content;
        } else {
          const getContextTemp = virtualclass.getTemplate('context', 'askQuestion');
          const cTemp = getContextTemp({ context: data.context });
          document.querySelector('#askQuestion .container').insertAdjacentHTML('beforeend', cTemp);

          const componentTemp = virtualclass.getTemplate(data.component, 'askQuestion');
          document.querySelector(`[data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', componentTemp({ id: data.id, userName: data.uname, content: data.content }));
          document.querySelector(`[data-context~=${data.context}]`).classList.add('current');
        }
      } else if (data.component === 'answer') {
        const qaAnswerTemp = virtualclass.getTemplate(data.component, 'askQuestion');
        const context = { id: data.id, itemId: data.componentId, userName: data.uname, hasControl: roles.hasControls(), content: data.content, parent: data.parent };
        const ansTemp = qaAnswerTemp(context);
        document.querySelector(`#${data.parent} .answers`).insertAdjacentHTML('beforeend', ansTemp);
      }

      if (data.userId === virtualclass.uInfo.userid) {
        document.querySelector(`#${data.id} .upVote`).dataset.upvote = 'upvoted';
      }

      if (data.component === 'question') {
        const qnElem = document.querySelector(`#${data.id}.question`);
        if (qnElem) {
          qnElem.addEventListener('click', (ev) => {
            this.handler(ev);
          });
        }
      }
    }
  }

  moreControls (data) {
    const selector = '#' + data.componentId +  ' .moreControls .item';
    const getMoreCntrl = document.querySelector(selector);
    if (getMoreCntrl.classList.contains('close')) {
      getMoreCntrl.classList.remove('close');
      getMoreCntrl.classList.add('open');
    } else {
      getMoreCntrl.classList.remove('open');
      getMoreCntrl.classList.add('close');
    }
  }

  create(data) {
    const textTemp = document.querySelector('#writeContent');
    if (textTemp) {
      textTemp.remove();
    }
    data.componentId = data.id;
    this.renderer(data);
    this.updateStatus(data, 'editable');
  }

  delete(data) {
    const elem = document.querySelector(`#${data.componentId}`);
    elem.remove();
    this.updateStatus(data, 'delete');
  }

  updateStatus(data, status) {
    const contextObj = virtualclass.askQuestion.context;
    if (status === 'delete') {
      delete contextObj[virtualclass.askQuestion.currentContext][data.component][data.componentId];
    } else {
      let question = data;
      if (status === 'editable') {
        question = { id: data.id, content: data.content, children: [], status, parent: null, componentId: data.id };
        if (Object.prototype.hasOwnProperty.call(contextObj[data.context]['question'], data.parent)) {
          if (data.component === 'answer' || data.component === 'comment') {
            contextObj[data.context]['question'][data.parent].children.push(data.componentId);
            const parentElem = document.querySelector(`#${data.parent} .navigation .total`);
            parentElem.innerHTML = contextObj[data.context]['question'][data.parent].children.length;
          }
        }
      } else if (status === 'edited') {
        question.children = contextObj[virtualclass.askQuestion.currentContext][data.component][data.componentId].children;
        question.content = data.content;
      }
      question.status = status;
      contextObj[virtualclass.askQuestion.currentContext][data.component][data.componentId] = question;
    }
  }

  edit(data) {
    const textTemp = document.querySelector('#writeContent');
    if (textTemp) {
      textTemp.remove();
    }
    const getElem = document.querySelector(`#${data.componentId} .content p`);
    getElem.innerHTML = data.content;
    this.updateStatus(data, 'edited');
  }

  upvote(data) {
    if (data.upvote) {
      if (data.upvote === 1) virtualclass.askQuestion.firstid = data.id;
      document.querySelector(`#${data.componentId} .upVote .total`).innerHTML = data.upvote;
      if (data.userId === virtualclass.uInfo.userid) {
        document.querySelector(`#${data.componentId} .upVote`).dataset.upvote = 'upvoted';
      }
    }
  }

  markAnswer(data) {
    const markElem = document.querySelector(`#${data.componentId}`);
    const markParentElem = document.querySelector(`#${data.parent}`);
    markElem.dataset.markAnswer = 'marked';
    markParentElem.dataset.markAnswer = 'marked';
  }
}

class QAquestion extends BasicOperation {

}

class QAanswer extends BasicOperation {

}

class QAcomment {

}

class Note {

}


class QAcontext {
  constructor() {
    this.actions = [];
    this.question = new QAquestion();
    this.answer = new QAanswer();
    this.comment = new QAcomment();
    this.note = new Note();
    // this.note = new QAnote();
    // this.mark = new QAmark();
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
      } else if (data.component === 'answer' && data.upvote && data.upvote > 1) {
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
    this.allMarks = {};
    this.mainNote = new NoteMain();
    this.mainNote.init();
  }

  async initFirebaseOperatoin() {
    if (this.initFirebase) return;
    const virtualclassCont = document.getElementById('virtualclassCont');
    if (virtualclassCont) virtualclassCont.classList.add('askQuestionFetching');
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
      this.context[contextName] = new QAcontext();
    }

    if (this.queue[this.currentContext] && this.queue[this.currentContext].length > 0) {
      this.perform(this.currentContext);
    }

    console.log('====> ready context ', this.currentContext);
    ioAdapter.mustSend({ cf: 'readyContext', context: this.currentContext });
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

  buildAllMarksStatus (data) {
    if (!this.allMarks[data.context]) {
      this.allMarks[data.context] = {};
    }

    if ((data.component === 'question' || data.component === 'note' || data.component === 'bookmark')) {
      if (data.action === 'create') {
        if (!this.allMarks[data.context].question) this.allMarks[data.context].question = [];
        this.allMarks[data.context][data.component].push(data.componentId);
      } else if (data.action === 'delete') {
        this.allMarks[data.context][data.component] = this.allMarks[data.context][data.component].filter(e => e !== data.componentId);
      }
    }
  }

  attachHandlerForRealTimeUpdate() {
    console.log('===> Attach Real time update ');
    this.db.collection(this.collection).orderBy('timestamp', 'asc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            const data = change.doc.data();
            if (data.context === virtualclass.askQuestion.currentContext) {
              this.performWithQueue(data);
              if (virtualclass.isPlayMode && data.context === '_doc_0_0') this.buildAllMarksStatus(data);
            } else {
              this.makeQueue(data);
              if (virtualclass.isPlayMode) this.buildAllMarksStatus(data);
            }
          };
        });

        if (this.firstRealTime) {
          const virtualclassCont = document.getElementById('virtualclassCont');
          if (virtualclassCont) virtualclassCont.classList.remove('askQuestionFetching');
          this.firstRealTime  = false;
        }
      }, (error) => {
        console.log('ask question real time ', error);
      });
  }

  afterSignIn() {
    console.log('====> after sign in');
    // this.loadInitialData();
    if (this.collection) this.attachHandlerForRealTimeUpdate();
    if (virtualclass.isPlayMode) {
      virtualclass.recorder.requestListOfFiles();
    }
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
    } else if (!chat.classList.contains('active')) {
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
