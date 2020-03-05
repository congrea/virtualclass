class UserInteractivityBasicOperation {
  generateData(data) {
    const dataObj = data;
    const qnCreateTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    dataObj.id = `${data.component}-${virtualclass.gObj.orginalUserId}-${qnCreateTime}`;
    dataObj.timestamp = qnCreateTime;
    dataObj.context = virtualclass.userInteractivity.currentContext;
    dataObj.userId = virtualclass.gObj.orginalUserId;
    return dataObj;
  }

  async send(data) {
    if (!virtualclass.userInteractivity.collection) {
      virtualclass.userInteractivity.setDbCollection();
      virtualclass.userInteractivity.attachHandlerForRealTimeUpdate();
    }

    if (data.component === 'note' || data.component === 'bookmark') {
      // console.log('====> sending note data ', JSON.stringify(data));
      await virtualclass.userInteractivity.db.collection(virtualclass.userInteractivity.collectionMark)
        .doc(data.id).set(data).then(() => {
          console.log('ask question write, Document successfully written! ', data);
        })
        .catch((error) => {
          console.error('ask question write, Error writing document: ', error);
        });
    } else {
      await virtualclass.userInteractivity.db.collection(virtualclass.userInteractivity.collection)
        .doc(data.id).set(data)
        .then(() => {
          // console.log('ask question write, Document successfully written! ', data);
        })
        .catch(() => {
          // console.error('ask question write, Error writing document: ', error);
        });
    }
  }

  handler(ev) {
    let editContent;
    const allContext = virtualclass.userInteractivity;
    if (ev.target.id === 'userInteractivity-content') return;
    if (ev.target.dataset.event === 'save') {
      const userInput = document.getElementById('userInteractivity-content');
      if (userInput) { editContent = userInput.value; }
    }
    const writeTemp = document.querySelector('#writeContent .cancel');
    if (writeTemp && ev.target.id !== 'userInteractivity-content' && editContent !== '') {
      writeTemp.click();
    }

    const questionElement = ev.target.closest('div.context');
    if (questionElement && questionElement.dataset) {
      allContext.currentContext = ev.target.closest('div.context').dataset.context;
    }
    let event;
    let parent;
    let componentId = null;
    const currentTarget = ev.target;
    if ((this.event.values.includes(currentTarget.dataset.event))) {
      event = currentTarget.dataset.event;
      parent = currentTarget.parentNode;
    } else if (this.event.values.includes(currentTarget.parentNode.dataset.event)) {
      event = currentTarget.parentNode.dataset.event;
      parent = currentTarget.parentNode.parentNode;
    } else if (this.event.values.includes(currentTarget.parentNode.parentNode.dataset.event)) {
      event = currentTarget.parentNode.parentNode.dataset.event;
      parent = currentTarget.parentNode.parentNode.parentNode;
    }

    if (event) {
      // const data;
      let text;
      let action;
      let parentId = null;
      let component = parent.dataset.component;
      let editElem;
      let str;
      if (parent.dataset.componentId && event !== 'save') {
        componentId = parent.dataset.componentId;
        if (event === 'reply') {
          componentId = null;
          parentId = parent.dataset.componentId;
        } else if (event === 'edit' || event === 'markAnswer' || event === 'delete') {
          parentId = (parent.dataset.parent) ? parent.dataset.parent : null;
        }
      }

      if (event === 'save') {
        if (component === 'note') {
          text = currentTarget.value;
          action = 'create';
        } else if (component === 'bookmark') {
          text = (+(parent.dataset.value) === 0 ? 1 : 0);
          action = 'create';
        } else {
          if (editContent) {
            text = editContent;
          } else if (editContent != null) {
            virtualclass.view.createAskQuestionMsg(virtualclass.lang.getString('enterText'), 'msgContainer', 'loading');
            return;
          }
          if (parent.dataset.componentId === null || parent.dataset.componentId === '') {
            action = 'create';
          } else {
            action = 'edit';
            ({ componentId } = parent.dataset);
            if (!virtualclass.vutil.checkUserRole()) {
              editElem = allContext.context[allContext.currentContext][component][componentId].upvote;
              if (editElem !== 0 && editElem != null) {
                ({ componentId } = parent.dataset);
                event = 'cancel';
                str = virtualclass.lang.getString('upvoted');
                virtualclass.view.createAskQuestionMsg(str, 'msgContainer', 'loading');
              }
            }
          }
        }
        parentId = (parent.dataset.parent) ? parent.dataset.parent : null;
      } else if (event === 'clearall') {
        const currentContextElement = document.querySelector('#noteNavigationContainer .clearAll');
        let currContext = currentContextElement.dataset.currentContext;
        if (currentContextElement.dataset.currentContext) currContext = currentContextElement.dataset.currentContext;

        const contentElement = document.querySelector(`#noteContainer .context[data-context~=${currContext}] textarea`);
        if (contentElement) {
          contentElement.value = '';
          text = '';
          action = 'create';
          event = 'save';
        }
      } else if (event === 'upvote') {
        parentId = parent.dataset.parent;
      }

      const data = {
        event, component, componentId, text, action, parentId,
      };
      this.event.execute(data);
      if (event === 'cancel' || event === 'save') {
        this.inputGenerating = false;
        if (this.pollInputGeneratingTime) {
          clearTimeout(this.pollInputGeneratingTime);
          // console.log('I have cleared my polling time');
        }
        allContext.rendererObj.removeWriteContainer();
        if (roles.isStudent() && this.donotChangeContext && this.donotChangeContext !== this.currentContext) {
          // console.log('Triggered performed 1');
          this.triggerPerform(this.donotChangeContext);
          delete this.donotChangeContext;
        }
      }
    }
  }

  userInputHandler() {
    if (roles.isStudent()) {
      virtualclass.userInteractivity.inputGenerating = true;
      // console.log('====> Input is generating ', virtualclass.userInteractivity.inputGenerating);
      if (this.pollInputGeneratingTime) clearTimeout(this.pollInputGeneratingTime);
      this.pollInputGeneratingTime = setTimeout(() => {
        virtualclass.userInteractivity.inputGenerating = false;
        // console.log('====> Input is generating ', virtualclass.userInteractivity.inputGenerating);
        if (virtualclass.userInteractivity.donotChangeContext) {
          // console.log('Triggered performed 2');
          virtualclass.userInteractivity.triggerPerform(virtualclass.userInteractivity.donotChangeContext);
          delete virtualclass.userInteractivity.donotChangeContext;
          document.querySelector('#writeContent .cancel').click();
        }
      }, 17000);
    }
    const textarea = document.querySelector('#writeContent .text');
    virtualclass.userInteractivity.rendererObj.autosize.call(this, { target: textarea });
  }

  renderer(data) {
    this.rendererObj[data.type].call(this.rendererObj, data);
  }

  create(data) {
    if (data.userId === virtualclass.gObj.orginalUserId) {
      const textTemp = document.querySelector('#writeContent');
      if (textTemp) {
        textTemp.remove();
      }
    }
    data.componentId = data.id;
    this.renderer(data);
    this.updateStatus(data, 'editable');
  }

  delete(data) {
    const elem = document.querySelector(`#${data.componentId}`);
    if (elem) {
      if (data.component === 'answer') {
        // virtualclass.userInteractivity.navigationHandler(data, 'removeNavigation');
      }
      elem.remove();
      this.updateStatus(data, 'delete');
    }
  }

  // deleteComponentVariable(component, componentId, parent, parentId) {
  //   if (!this.tobeDeleted) {
  //     return;
  //   }
  //   const contextObj = virtualclass.userInteractivity.context;
  //   const currentContext = virtualclass.userInteractivity.currentContext;
  //   let childrenArr = contextObj[currentContext][component][componentId].children;
  //
  //   if (childrenArr.length <= 0) {
  //     delete contextObj[currentContext][component][componentId];
  //     if (parent) {
  //       childrenArr = contextObj[currentContext][parent][parentId].children;
  //     }
  //   }
  //
  //   if (childrenArr.length > 0) {
  //     const removedId = childrenArr.shift();
  //     let newComponent;
  //     if (component === 'question') {
  //       newComponent = 'answer';
  //     } else if (component === 'answer') {
  //       newComponent = 'comment';
  //     } else {
  //       newComponent = 'comment';
  //     }
  //     this.deleteComponentVariable(newComponent, removedId, component, parentId);
  //   }
  // }

  // TODO, This whole deleting process should be simplified, It can not be ignored
  deleteComponentVariableHelper(data) {
    if (data.component === 'question') {
      this.deleteQuestionVariable(data.componentId);
    } else if (data.component === 'answer') {
      this.deleteAnswerVariable(data.componentId);
    } else if (data.component === 'comment') {
      this[`deleteCommentVariableLevel${data.level}`](data.componentId);
    }
  }

  deleteQuestionVariable(componentId) {
    const component = 'question';
    const contextObj = virtualclass.userInteractivity.context;
    // const currentContext = virtualclass.userInteractivity.currentContext;
    const { currentContext } = virtualclass.userInteractivity;
    const childrenArr = contextObj[currentContext][component][componentId].children;
    for (let i = 0; i < childrenArr.length; i++) {
      this.deleteAnswerVariable(childrenArr[i]);
    }
    delete contextObj[currentContext][component][componentId];
  }

  deleteAnswerVariable(componentId) {
    const component = 'answer';
    const contextObj = virtualclass.userInteractivity.context;
    const { currentContext } = virtualclass.userInteractivity;
    const childrenArr = contextObj[currentContext][component][componentId].children;
    for (let i = 0; i < childrenArr.length; i++) {
      this.deleteCommentVariableLevel1(childrenArr[i]);
    }
    delete contextObj[currentContext][component][componentId];
  }

  deleteCommentVariableLevel1(componentId) {
    const component = 'comment';
    const contextObj = virtualclass.userInteractivity.context;
    const { currentContext } = virtualclass.userInteractivity;
    const childrenArr = contextObj[currentContext][component][componentId].children;
    for (let i = 0; i < childrenArr.length; i++) {
      this.deleteCommentVariableLevel2(childrenArr[i]);
    }
    delete contextObj[currentContext][component][componentId];
  }

  deleteCommentVariableLevel2(componentId) {
    const component = 'comment';
    const contextObj = virtualclass.userInteractivity.context;
    const { currentContext } = virtualclass.userInteractivity;
    const childrenArr = contextObj[currentContext][component][componentId].children;
    for (let i = 0; i < childrenArr.length; i++) {
      this.deleteCommentVariableLevel3(childrenArr[i]);
    }
    delete contextObj[currentContext][component][componentId];
  }

  deleteCommentVariableLevel3(componentId) {
    const component = 'comment';
    const contextObj = virtualclass.userInteractivity.context;
    const { currentContext } = virtualclass.userInteractivity;
    const childrenArr = contextObj[currentContext][component][componentId].children;
    for (let i = 0; i < childrenArr.length; i++) {
      delete contextObj[currentContext][component][childrenArr[i]];
    }
    delete contextObj[currentContext][component][componentId];
  }

  updateStatus(data, status) {
    let getChildren;
    const contextObj = virtualclass.userInteractivity.context;
    const { currentContext } = virtualclass.userInteractivity;
    let component;
    // let parent = null;
    if (status === 'delete') {
      this.updateCount(data, status);
      // const filterComponent = data.component === 'question' ? 'answer' : 'comment';
      // const childrenArr = contextObj[currentContext][data.component][data.componentId].children;
      // if (childrenArr.length > 0 && roles.hasControls()) {
      //   for (let i = 0; i < childrenArr.length; i++) {
      //     delete contextObj[currentContext][filterComponent][childrenArr[i]];
      //   }
      // }
      // delete contextObj[currentContext][data.component][data.componentId];
      this.deleteComponentVariableHelper(data);
    } else if (status === 'editable' || status === 'edited') {
      component = data;
      if (status === 'editable') {
        component.upvote = 0;
        component.children = [];

        if (data.component === 'comment' && data.level >= 3) {
          const commentElem = document.querySelector(`#${data.componentId}`);
          if (commentElem) {
            commentElem.dataset.status = 'reachMaxLimit';
          }
        } else if (data.component === 'answer') {
          const answerElem = document.querySelector(`#askQuestion #${data.parent} .answers`);
          if (answerElem.classList.contains('close')) {
            answerElem.classList.remove('close');
            answerElem.classList.add('open');
          }
        }
        this.updateCount(data, status);
        virtualclass.vutil.attachWhiteboardPopupHandler();
      } else if (status === 'edited') {
        component.children = contextObj[currentContext][data.component][data.componentId].children;
        component.content = data.content;
      }
      component.status = status;
      contextObj[currentContext][data.component][data.componentId] = component;
    } else if (status === 'upvote') {
      if (data.component === 'question' || data.component === 'answer') {
        getChildren = contextObj[currentContext][data.component][data.componentId].children;
      }
      component = {
        id: data.id,
        content: data.content,
        children: getChildren,
        status,
        parent: data.parent,
        componentId: data.componentId,
        upvote: data.upvote,
        upvoteBy: data.upvoteBy,
      };
      component.status = status;
      contextObj[currentContext][data.component][data.componentId] = component;
    }
  }

  updateCount(data, status) {
    const allContext = virtualclass.userInteractivity;
    let component = data.component === 'answer' ? 'question' : 'answer';
    if (data.parent != null && (data.parent).split('-')[0] === 'comment') {
      component = 'comment';
    }
    if (allContext.context[data.context] && allContext.context[data.context][component] && data.component !== 'question'
      && Object.prototype.hasOwnProperty.call(allContext.context[data.context][component], data.parent)) {
      const children = allContext.context[data.context][component][data.parent].children;
      const moreControlElem = document.querySelector(`#${data.parent}`);
      const controlNavigation = document.querySelector(`#${data.parent} .footer .navigation`);
      if (data.component === 'answer' || data.component === 'comment') {
        if (status === 'editable') {
          children.push(data.componentId);
          if (!virtualclass.vutil.checkUserRole()) {
            if (moreControlElem) {
              moreControlElem.classList.remove('editable');
              moreControlElem.classList.add('noneditable');
            }
          }
          if (controlNavigation && controlNavigation.classList.contains('disable')) {
            controlNavigation.classList.remove('disable');
          }
        } else {
          children.splice(children.indexOf(data.componentId), 1);
          const userId = (data.parent).split('-')[1];
          const time = allContext.questionAnswer.elapsedComponentTime({
            componentId: data.parent, component,
          });
          const componentUpvote = allContext.context[allContext.currentContext][component][data.parent].upvote;
          // TODO handle using component data
          const getParentElem = document.querySelector(`#${data.parent} .upVote .total`);
          if ((!virtualclass.vutil.checkUserRole() && time < 30 && getParentElem && componentUpvote === 0)
            || (component === 'comment' && userId === virtualclass.gObj.orginalUserId)) {
            if (children.length === 0 && moreControlElem) {
              moreControlElem.classList.remove('noneditable');
              moreControlElem.classList.add('editable');
            }
          }

          if (children.length === 0) {
            if (!controlNavigation.classList.contains('disable')) {
              controlNavigation.classList.add('disable');
            }
          }

          if (component === 'question' && !virtualclass.vutil.checkUserRole()) {
            const answersElem = document.querySelectorAll(`#askQuestion #${data.parent} .answers .answer`);
            for (let i = 0; i < answersElem.length; i++) {
              const anstime = allContext.questionAnswer.elapsedComponentTime({
                componentId: data.componentId, component: 'answer',
              });
              const component = 'answer';
              const ansUpvote = allContext.context[allContext.currentContext][component][data.componentId].upvote;
              const ansChildren = allContext.context[data.context][component][data.componentId].children;
              if (answersElem[i].classList.contains('noneditable') && ansUpvote === 0
                && ansChildren.length === 0 && anstime < 30) {
                answersElem[i].classList.remove('noneditable');
                answersElem[i].classList.add('editable');
              }
            }
          }

          if (data.component === 'answer') {
            const selector = `#askQuestion #${data.parent} .answers .answer[data-mark-answer="marked"]`;
            const checkMarkElem = document.querySelector(selector);
            if (!checkMarkElem) {
              const markParentElem = document.querySelector(`#${data.parent}`);
              markParentElem.dataset.markAnswer = '';
            }
          }
        }
        const parentElem = document.querySelector(`#${data.parent} .navigation .total`);
        if (parentElem) {
          parentElem.innerHTML = allContext.context[data.context][component][data.parent].children.length;
        }
      }
    }
  }

  edit(data) {
    virtualclass.userInteractivity.questionAnswer.separatedContent(data);
    document.querySelector(`#${data.componentId} .lable`).innerHTML = `${data.component} (edited)`;
    const textTemp = document.querySelector('#writeContent');
    if (textTemp) {
      textTemp.remove();
    }
    this.updateStatus(data, 'edited');
  }

  upvote(data) { // main part
    if (data.upvote) {
      if (data.upvote === 1) virtualclass.userInteractivity.firstid = data.id;
      document.querySelector(`#${data.componentId} .upVote .total`).innerHTML = data.upvote;
      if (data.upvoteBy[data.upvoteBy.length - 1] === virtualclass.gObj.orginalUserId) {
        document.querySelector(`#${data.componentId} .upVote`).dataset.upvote = 'upvoted';
      } else {
        const checkIndex = data.upvoteBy.indexOf(virtualclass.gObj.orginalUserId);
        if (checkIndex > -1) {
          document.querySelector(`#${data.componentId} .upVote`).dataset.upvote = 'upvoted';
        }
      }
      if (!virtualclass.vutil.checkUserRole()) {
        const upvoteElement = document.querySelector(`#${data.componentId}`);
        upvoteElement.classList.remove('editable');
        upvoteElement.classList.add('noneditable');
      }
      this.updateStatus(data, 'upvote');
      this.mostUpvotedOnTop(data);
    } else {
      // TODO
      document.querySelector(`#${data.componentId} .upVote`).dataset.upvote = 'upvoted';
    }
  }

  markAnswer(data) { // question part
    const selector = `#askQuestion #${data.parent} .answers`;
    const commentElem = document.querySelector(`#${data.parent} .comments`);
    const parent = document.querySelector(`${selector} .answer[data-mark-answer="marked"]`);
    const markParentElem = document.querySelector(`#${data.parent}`);
    const markedAnswer = document.querySelector(selector);
    const changeElemName = document.querySelector(`${selector} #${data.componentId} .moreControls .mark`);
    const checkElemDataset = document.querySelector(`${selector} #${data.componentId}`);
    if (parent && markParentElem.dataset.markAnswer) {
      if (parent && checkElemDataset && checkElemDataset.dataset.markAnswer !== 'marked') {
        return;
      }
      delete parent.dataset.markAnswer;
      delete markParentElem.dataset.markAnswer;
      if (markedAnswer.classList.contains('close')) {
        markedAnswer.classList.remove('close');
        markedAnswer.classList.add('open');
      }
      if (changeElemName) {
        changeElemName.innerHTML = 'Mark As Answer';
        // this.navigationHandler(data, 'Mark As Answer');
        return;
      } else if (!changeElemName) {
        return;
      }
    } else {
      if (changeElemName && changeElemName.innerHTML === 'Mark As Answer') {
        changeElemName.innerHTML = 'Unmark';
      }
    }
    const markElem = document.querySelector(`#${data.componentId}`);
    if (markParentElem && markElem && !markParentElem.dataset.markAnswer) {
      markElem.dataset.markAnswer = 'marked';
      markParentElem.dataset.markAnswer = 'marked';
      if (markedAnswer.classList.contains('open')) {
        markedAnswer.classList.remove('open');
        markedAnswer.classList.add('close');
      }
      if (commentElem && commentElem.classList.contains('open')) {
        commentElem.classList.remove('open');
        commentElem.classList.add('close');
      }
      // this.navigationHandler(data, 'Unmark');
      markedAnswer.insertBefore(markElem, markedAnswer.firstChild);
      if (!virtualclass.vutil.checkUserRole()) {
        const answersElem = document.querySelectorAll(`#askQuestion #${data.parent} .answers .answer`);
        for (let i = 0; i < answersElem.length; i++) {
          if (answersElem[i].classList.contains('editable')) {
            answersElem[i].classList.remove('editable');
          }
          answersElem[i].classList.add('noneditable');
        }
      }
    }
  }

  navigationHandler(data, str) {
    // const allContext = virtualclass.userInteractivity;
    // const markParentElem = document.querySelector(`#${data.parent}`);
    // const component = 'question';
    // const getChildrenLength = allContext.context[allContext.currContext][component][data.parent].children.length;
    // if (getChildrenLength === 1) {
    //   if (str === 'Mark As Answer' || str === 'removeNavigation') {
    //     delete markParentElem.dataset.navigation;
    //   } else if (str === 'Unmark') {
    //     markParentElem.dataset.navigation = 'disable';
    //   }
    // }
  }

  mostUpvotedOnTop(data) { // main part
    let getChildren;
    const arr = [];
    const allContext = virtualclass.userInteractivity.context;
    const customComponent = 'question';
    const currentContext = data.context;
    if (data.component === 'answer') {
      getChildren = allContext[currentContext][customComponent][data.parent].children;
    }
    for (const component in allContext[currentContext][data.component]) {
      if (component !== 'events' && component !== 'orderdByUpvoted') {
        const obj = {
          componentId: component,
          upvote: allContext[currentContext][data.component][component].upvote,
        };
        if (data.component === 'answer') {
          const checkAns = getChildren.indexOf(component);
          if (checkAns !== -1) {
            obj.parent = data.parent;
            arr.push(obj);
          }
        } else if (data.component === 'question') {
          arr.push(obj);
        }
      }
    }
    arr.sort((a, b) => b.upvote - a.upvote);
    allContext[currentContext][data.component].orderdByUpvoted = arr;
  }

  triggerRearrangeUpvotedElem(data) {
    let selector;
    let parent;
    const arr = 'orderdByUpvoted';
    const allContext = virtualclass.userInteractivity.context;
    const currentContext = data.context
    const container = document.createElement('div');
    container.className = data.component === 'question' ? 'container' : 'answers open';
    if (allContext[currentContext][data.component].orderdByUpvoted) {
      if (data.component === 'question') {
        for (let i = 0; i < allContext[currentContext][data.component][arr].length; i++) {
          selector = `#${allContext[currentContext][data.component][arr][i].componentId}`;
          container.appendChild(document.querySelector(selector));
        }
      } else {
        const ansObj = allContext[currentContext][data.component].orderdByUpvoted;
        for (let i = 0; i < ansObj.length; i++) {
          parent = ansObj[i].parent;
          container.appendChild(document.querySelector(`#${ansObj[i].componentId}`));
        }
      }

      const replaceContainer = data.component === 'question' ? '.container' : `#${parent} .answers`;
      selector = `#askQuestion [data-context~=${currentContext}] ${replaceContainer}`;
      const elem = document.querySelector(selector);
      elem.parentNode.replaceChild(container, elem);
      this.rearrangeUpvoteDone = true;
    }
  }
}

class QAcontext {
  constructor() {
    this.actions = [];
    this.question = {};
    this.answer = {};
    this.comment = {};
    this.note = {};
    this.bookmark = {};
  }
} // main part


class UserInteractivity extends UserInteractivityBasicOperation {
  init() {  // Main part
    if (this.initialize) return;
    this.queue = {};
    this.queue.note = [];
    this.queue.question = [];
    this.queue.bookmark = [];
    this.context = {};
    this.firstRealTime = true;
    this.initialize = true;
    this.allMarks = {};
    this.note = new Note();
    this.event = new UserInteractivityEvents();
    this.engine = new UserInteractivityEngine();
    this.rendererObj = new UserInteractivityRenderer();
    this.rendererObj.mainInterface();
    this.questionAnswer = new QuestionAnswer();
    this.bookmark = new Bookmark(); // Bookmark  ()
    this.attachHandler();
    this.viewAllMode = false;
    this.inputGenerating = false;
  }

  attachHandler() { // Main part
    this.bookmark.attachHandler();
    if (virtualclass.isPlayMode) {
      const viewAllQuestion = document.getElementById('viewAllQuestion');
      viewAllQuestion.addEventListener('click', this.questionAnswer.viewAllQuestion.bind(this));
    }
  }

  async initFirebaseOperatoin() { // main part
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
      // console.log(`There is some error${result}`);
    }
  }

  makeReadyContext() { // main part
    if (this.clearTimeMakeReady) clearTimeout(this.clearTimeMakeReady);
    this.clearTimeMakeReady = setTimeout(() => {
      if (virtualclass.vutil.checkUserRole()) {
        this.displayContext();
      } else {
        if (!this.inputGenerating) {
          this.displayContext();
        } else {
          this.donotChangeContext = this.readyContextActual();
          // console.log('====> Input is generating ', this.donotChangeContext);
        }
      }
    }, 200);
  }

  getActiveTab() {
    if (document.querySelector('#congAskQuestion.active') != null) {
      return 'question';
    } else if (document.querySelector('#virtualclassnote.active') != null) {
      return 'note';
    }
    return false;
  }

  readyContextActual() { // main part
    let contextName;
    let shareppt;
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
        shareppt = virtualclass.sharePt;
        if (shareppt.currId && shareppt.state) {
          contextName = `sharePt-${shareppt.currId}_${shareppt.state.indexv}_${shareppt.state.indexh}`;
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
    return contextName;
  }

  displayContext() { // main part
    this.rendererObj.removeWriteContainer();
    const contextName = this.readyContextActual();
    if (contextName === this.currentContext || !contextName) return;
    // console.log('===> context before ', this.currentContext);
    const activeTab = this.getActiveTab();
    if (activeTab !== 'question') {
      if (this.queue.question[contextName] && this.queue.question[contextName].length > 0) {
        // this.questionAnswer.addHighLight();
        this.questionAnswer.addHighLightNewActual();
      } else {
        this.questionAnswer.removeHighlight();
      }
    }
    this.triggerPerform(contextName);
    // console.log('===> context after ', this.currentContext);

    if (virtualclass.vutil.checkUserRole()) {
      ioAdapter.mustSend({ cf: 'readyContext', context: this.currentContext });
    }
  }

  triggerPerform(contextName) { // main part
    this.currentContext = contextName;
    this.triggerPerformActual(contextName);
  }

  async triggerPerformActual(contextName) { // main part
    const askQuestoinContainer = document.getElementById('askQuestion');
    if (askQuestoinContainer) {
      if (!contextName) {
        askQuestoinContainer.classList.remove('readyContext');
      } else {
        askQuestoinContainer.classList.add('readyContext');
      }
    }

    const getContextElem = document.querySelector('#askQuestion .container .current');
    const contextElem = document.querySelector(`.context[data-context~=${this.currentContext}]`);
    if (contextElem && !contextElem.classList.contains('current')) {
      contextElem.classList.add('current');
    }

    if (getContextElem && getContextElem.classList.contains('current')) {
      getContextElem.classList.remove('current');
    }

    if (contextName && !this.context[contextName]) {
      this.context[contextName] = new QAcontext();
    }

    const type = this.getActiveTab();
    if (type && this.queue[type] && this.queue[type][contextName] && this.queue[type][contextName].length > 0) {
      await this.engine.perform(contextName, type);
      this.triggerRearrangeUpvotedElem({ context: contextName, component: 'question' });
      this.triggerRearrangeUpvotedElem({ context: contextName, component: 'answer' });
      if (type === 'note') this.note.afterChangeContext(contextName);
    } else if (type === 'note') {
      // Create blank structure for note
      this.engine.performWithQueue({
        component: 'note', action: 'renderer', type: 'noteContainer', context: contextName,
      });
      this.note.afterChangeContext(contextName);
    }
    this.bookmark.afterChangeContext(contextName);
  }

  async authenticate(config) { // main part
    firebase.initializeApp(config);
    if (!this.db) this.db = firebase.firestore();
    this.setDbCollection();
    const result = await virtualclass.xhrn.getAskQnAccess();
    if (result) return firebase.auth().signInWithCustomToken(result.data);
    // This caches the data
    this.db.firestore().enablePersistence()
      .catch(function(err) {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
          // console.log('====> here is some error');
        } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
          // console.log('====> here is another error');
        }
      });
    return false;
  }

  setDbCollection() { // main part
    if (virtualclass.isPlayMode) {
      this.collection = `${wbUser.lkey}_${wbUser.session}_${wbUser.room}`;
      this.collectionMark = `${this.collection}_${virtualclass.gObj.orginalUserId}`;
    } else if (localStorage.getItem('mySession') != null) {
      this.collection = `${wbUser.lkey}_${localStorage.getItem('mySession')}_${wbUser.room}`;
      this.collectionMark = `${this.collection}_${virtualclass.gObj.orginalUserId}`;
    }
  }

  buildAllMarksStatus(data) { // main part
    if (!this.allMarks[data.context]) {
      this.allMarks[data.context] = {};
    }

    if (data.component === 'question') {
      if (data.action === 'create') {
        if (!this.allMarks[data.context].question) this.allMarks[data.context].question = [];
        this.allMarks[data.context][data.component].push(data.componentId);
      } else if (data.action === 'delete') {
        this.allMarks[data.context][data.component] = this.allMarks[data.context][data.component].filter(e => e !== data.componentId);
      }
    } else if (data.component === 'note') {
      this.allMarks[data.context][data.component] = true;
      if (data.content.trim() === '' || data.content.trim() === '') {
        delete this.allMarks[data.context][data.component];
      }
    } else if (data.component === 'bookmark') {
      this.allMarks[data.context][data.component] = true;
      if (+(data.content) === 0) {
        delete this.allMarks[data.context][data.component];
      }
    }
  }

  attachHandlerForRealTimeUpdate() { // main part
    // console.log('===> Attach Real time update ');
    this.db.collection(this.collection).orderBy('timestamp', 'asc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const askQuestion = document.getElementById('askQuestion');
          if (change.type === 'added' || change.type === 'modified') {
            const data = change.doc.data();
            if (askQuestion.classList.contains('active')
              && (data.context === virtualclass.userInteractivity.currentContext
              || virtualclass.userInteractivity.viewAllMode)) {
              this.engine.performWithQueue(data);
              if (virtualclass.isPlayMode && data.context === '_doc_0_0') this.buildAllMarksStatus(data);
            } else {
              this.engine.makeQueue(data);
              this.questionAnswer.addHighLight(data);
              if (virtualclass.isPlayMode) this.buildAllMarksStatus(data);
            }
          }
        });

        if (this.firstRealTime) {
          const virtualclassCont = document.getElementById('virtualclassCont');
          if (virtualclassCont) virtualclassCont.classList.remove('askQuestionFetching');
          this.firstRealTime = false;
          if (this.rendererObj.reArrangeUpvoteCallback) {
            this.rendererObj.reArrangeUpvoteCallback();
          }
        }
      }, (error) => {
        console.log('ask question real time ', error);
      });
  }

  async afterSignIn() { // main part
    // console.log('====> after sign in');
    // console.log('====> one 1');
    if (this.collection) await this.attachHandlerForRealTimeUpdate();
    if (virtualclass.isPlayMode) {
      virtualclass.recorder.requestListOfFiles();
      if (this.collectionMark) this.loadInitialDataMark();
    }
    // console.log('====> one 3');
    // if (this.collectionMark) this.loadInitialDataMark();
  }

  loadInitialDataMark() { // part of note and book mark
    if (!this.collectionMark) return;
    if (this.initCollectionMark) return;
    // console.log('===> trigger note initial data');
    const self = this;
    // console.log('===> collection mark ', this.collectionMark);
    const virtualclassCont = document.getElementById('virtualclassCont');
    virtualclassCont.classList.add('readyForNote');

    this.db.collection(this.collectionMark).get().then((snapshot) => {
      self.initCollectionMark = true;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const currentActiveTab = self.getActiveTab();
        // console.log('====> total data type ', data.type);
        if ((currentActiveTab === 'note' || data.component === 'bookmark')
          && self.currentContext === data.context) {
          self.engine.performWithQueue(data);
        } else {
          self.engine.makeQueue(data);
        }

        if (virtualclass.isPlayMode) this.buildAllMarksStatus(data);

        if (data.component === 'note') {
          virtualclass.userInteractivity.note.queue = data.navigation;
          virtualclass.userInteractivity.note.afterChangeContext(virtualclass.userInteractivity.currentContext);
        }
      });
    });

    // .catch((error) => {
    //   console.log('ask question read error ', error);
    // });
    // todo, this has to be enable in production
  }

  async triggerInitFirebaseOperation(from) { // main part
    await this.initFirebaseOperatoin();
    if (this.initFirebase) { this.loadInitialDataMark(); }
    if (from === 'note') {
      const loadingActive = document.querySelector('#noteContainer .loading.active');
      if (loadingActive) {
        loadingActive.classList.remove('active');
      }

      const contentActive = document.querySelector('#noteContainer .contentContainer');
      if (contentActive) {
        contentActive.classList.add('active');
      }
    }
  }

  renderMainContainer(elem) { // main part
    virtualclass.rightbar.handleDisplayRightBar('#askQuestion');
    virtualclass.rightbar.handleDisplayBottomRightBar(elem);
    if (this.queue.question[this.currentContext] && this.queue.question[this.currentContext].length > 0) {
      this.engine.perform(this.currentContext, 'question');
    }
  }

  getCurrentQuestions() { // main part
    return this.context[virtualclass.userInteractivity.currentContext].question;
  }

  triggerPause() { // main part
    if (virtualclass.isPlayMode && virtualclass.recorder.playStart && !virtualclass.recorder.controller.pause) {
      virtualclass.recorder.initRecPause();
    }
  }
}
