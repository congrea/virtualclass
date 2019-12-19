/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
// This class is responsible to render HTML of each component of Ask Question

class BasicOperation {
  generateData(data) {
    const qnCreateTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    const qId = `q-${virtualclass.gObj.uid}-${qnCreateTime}`;
    data.id = qId;
    data.timeStamp = qnCreateTime;
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
  }

  edit(data) {
    const textTemp = document.querySelector('#writeContent');
    if (textTemp) {
      textTemp.remove();
    }
    const chkContextElem = document.querySelector('.context');
    if (chkContextElem) {
      if (data.context === chkContextElem.dataset.context) {
        if (data.action === 'edit') {
          const questionTemp = document.querySelector(`[data-context~=${data.context}] #${data.questionId} .content p`);
          questionTemp.innerHTML = data.text;
        }
      }
    }
  }

  delete(data) {
    console.log('Create ', data);
  }

  upvote(data) {
    if (typeof data.upvote === 'undefined') {
      data.upvote = 1;
      this.send(data);
    } else {
      virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(data.id).update('upvote', firebase.firestore.FieldValue.increment(1));
    }
  }

  updateQnUpvote(data) {
    if (data.upvote) {
      document.querySelector(`#${data.id} .upVote .total`).innerHTML = data.upvote;
    }
  }

  renderer(data) {
    console.log('Create ', data);
    if (data.type === 'input') {
      const context = {};
      const qaPostTemp = virtualclass.getTemplate('qaPost', 'askQuestion');
      const qaTemp = qaPostTemp(context);
      if (typeof data.content !== 'undefined' && typeof data.questionId !== 'undefined') {
        document.querySelector(`#${data.questionId}`).insertAdjacentHTML('beforeend', qaTemp);
        const text = document.querySelector('#writeContent .text');
        text.innerHTML = data.content;
        if (text) {
          text.addEventListener('keyup', this.inputHandler.bind(this));
        }
      } else {
        document.querySelector('#askQuestion').insertAdjacentHTML('beforeend', qaTemp);
        const text = document.querySelector('#writeContent .text');
        if (text) {
          text.addEventListener('keyup', this.inputHandler.bind(this));
        }
      }
    } else if (data.type === 'questionBox') {
      const chkContextElem = document.querySelector('.context');
      if (chkContextElem) {
        if (data.context === chkContextElem.dataset.context) {
          const qaTemp = virtualclass.getTemplate('question', 'askQuestion');
          const qtemp = qaTemp({ id: data.id, userName: data.uname });
          document.querySelector(`[data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', qtemp);
          document.querySelector(`#${data.id} .content p`).innerHTML = data.text;
        }
      } else {
        const getContextTemp = virtualclass.getTemplate('context', 'askQuestion');
        const cTemp = getContextTemp({ context: data.context });
        document.querySelector('#askQuestion').insertAdjacentHTML('beforeend', cTemp);
        const qaTemp = virtualclass.getTemplate('question', 'askQuestion');
        const qtemp = qaTemp({ id: data.id, userName: data.uname });
        document.querySelector(`[data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', qtemp);
        document.querySelector(`#${data.id} .content p`).innerHTML = data.text;
      }


      const qnElem = document.querySelector('#askQuestion .question');
      if (qnElem) {
        qnElem.addEventListener('click', (ev) => {
          if (ev.target.parentNode.dataset.type === 'upvote' || ev.target.parentNode.dataset.type === 'reply'
           || ev.target.parentNode.dataset.type === 'answersNavigation') {
            this[ev.target.parentNode.dataset.type](data);
          } else if (ev.target.dataset.type === 'edit' || ev.target.dataset.type === 'delete') {
            const text = document.querySelector(`#${ev.target.parentNode.dataset.parentid} .content p`).innerHTML;
            virtualclass.askQuestion.performWithQueue({
              component: 'question',
              action: 'renderer',
              type: 'input',
              context: virtualclass.gObj.currWb,
              content: text,
              questionId: ev.target.parentNode.dataset.parentid,
            });
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
        userid: virtualclass.uInfo.userid,
        uname: virtualclass.uInfo.userobj.name,
      });
      if (virtualclass.currApp === 'Whiteboard') {
        data.context = virtualclass.gObj.currWb;
      }
      this.create(data);
      this.send(data);
    } else if (ev.keyCode === 13 && ev.target.parentNode.parentNode.id !== 'askQuestion') {
      const data = this.generateData({
        component: 'question',
        text: ev.target.value,
        type: 'questionBox',
        action: 'edit',
        userid: virtualclass.uInfo.userid,
        uname: virtualclass.uInfo.userobj.name,
        questionId: ev.target.parentNode.parentNode.id,
      });
      if (virtualclass.currApp === 'Whiteboard') {
        data.context = virtualclass.gObj.currWb;
      }
      this.edit(data);
      this.send(data);
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
    this.question = new QAquestion();
    this.answer = new QAanswer();
    this.comment = new QAcomment();
  }
}

class AskQuestionEngine {
  constructor() {
    this.queue = [];
    this.context = {};
  }

  perform() {
    while (this.queue.length > 0) {
      const data = this.queue.shift();
      this.context[data.context][data.component][data.action].call(this.context[data.context][data.component], data);
    }
    this.queue.length = 0;
  }

  // virtualclass.askQuestion.performWithQueue({action:'create', component:'question'})

  performWithQueue(data) {
    this.queue.push(data);
    this.perform();
  }

  queue(data) {
    this.queue.push(data);
  }
}

class AskQuestion extends AskQuestionEngine {
  async init() {
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
    this.renderer();
  }

  makeReadyContext() {
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
          contextName = `${virtualclass.sharePt.currId}_${virtualclass.sharePt.state.indexv}_${virtualclass.sharePt.state.indexh}`;
        }
        break;
      case 'Video':
        if (virtualclass.videoUl.videoId) contextName = virtualclass.videoUl.videoId;
        break;
      case 'ScreenShare':
        if (virtualclass.gObj.screenShareId) contextName = virtualclass.gObj.screenShareId;
        break;
      default:
        contextName = null;
    }

    const askQuestoinContainer = document.getElementById('askQuestion');
    if (askQuestoinContainer) {
      if (!contextName) {
        askQuestoinContainer.classList.remove('readyContext');
      } else {
        askQuestoinContainer.classList.add('readyContext');
      }
    }

    this.currentContext = contextName;
    if (virtualclass.currApp !== 'Poll' && virtualclass.currApp !== 'Quiz'
      && this.currentContext && !this.context[contextName]) {
      this.context[contextName] = new AskQuestionContext();
    }
  }

  async authenticate(config) {
    firebase.initializeApp(config);
    console.log('====> hi helllo 2');
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
      this.collection = `${wbUser.lkey}_${localStorage.getItem('mySession')}_${wbUser.room}`;
    }
  }

  attachHandlerForRealTimeUpdate() {
    this.db.collection(this.collection)
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            // console.log('ask question  ', change.doc.data());
            const data = change.doc.data();
            if (virtualclass.gObj.uid !== data.userid) {
              this.context[data.context][data.component][data.action].call(this.context[data.context][data.component], data);
            }
          }
          if (change.type === 'modified') {
            const data = change.doc.data();
            if (data.component === 'question') {
              this.context[data.context][data.component].updateQnUpvote.call(this.context[data.context][data.component], data);
            }
            // console.log('ask question modified ', change.doc.data());
          }
        });
      }, (error) => {
        console.log('ask question real time ', error);
      });
  }

  afterSignIn() {
    // this.loadInitialData();
    if (this.collection) this.attachHandlerForRealTimeUpdate();
  }

  loadInitialData() {
    this.db.collection(this.collection).get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log('ask question read data ', doc.data());
      });
    }).catch((error) => {
      console.log('ask question read error ', error);
    });
  }

  renderer() {
    const toggle = document.querySelector('#virtualclassCont.congrea #congHr');
    const chatroombt2 = document.getElementById('chatroom_bt2');
    const useList = document.getElementById('user_list');
    const setting = document.querySelector('#appSettingCtrl');
    const techVideo = document.querySelector('#virtualclassCont.congrea #techVideo');
    const settingD = document.querySelector('#virtualclassCont.congrea #appSettingDetail');

    const context = {};
    const qaTemp = virtualclass.getTemplate('askQuestionMain', 'askQuestion');
    const qtemp = qaTemp(context);
    document.querySelector('#rightSubContainer').insertAdjacentHTML('beforeend', qtemp);

    toggle.addEventListener('click', () => {
      virtualclass.chat.rightBarHeader('askQuestion');
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
    });

    const addQuestion = document.querySelector('#virtualclassCont.congrea .addQuestion-icon');
    if (addQuestion) {
      addQuestion.addEventListener('click', () => {
        this.performWithQueue({ component: 'question', action: 'renderer', type: 'input', context: virtualclass.gObj.currWb });
      });
    }
  }
}
