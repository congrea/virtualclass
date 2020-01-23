/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

class NoteNavigation {
  constructor() {
    this.queue = [null];
    this.current = 0;
    this.attachImmediateHandler = false;
  }

  handleQueue(context) {
    if (this.queue.indexOf(context) <= -1) {
      this.queue[this.queue.length - 1] = context;
    }
  }

  triggerNavigate(side) {
    if (side === 'previous') {
      if (this.current) this.current = this.current - 1;
    } else {
      if (this.current <= this.queue.length) this.current = this.current + 1;
    }
    this.displayNoteBy(this.queue[this.current]);
    this.updateNavigateNumbers();
  }

  updateNavigateNumbers() {
    const currentNumberElem = document.querySelector('#noteNavigation .notenumber .current');
    if (currentNumberElem) currentNumberElem.innerHTML = `${this.current + 1} /`;

    const totalNumberElem = document.querySelector('#noteNavigation .notenumber .total');
    if (totalNumberElem) totalNumberElem.innerHTML = this.queue.length;
    const next = document.querySelector('#noteNavigation .next');
    const previous = document.querySelector('#noteNavigation .previous');

    if (this.current === 0) {
      previous.classList.add('deactive');
    }

    if (this.current > 0) {
      previous.classList.remove('deactive');
    }

    if (this.current + 1 === this.queue.length) {
      next.classList.add('deactive');
    }

    if (this.current + 1 < this.queue.length) {
      next.classList.remove('deactive');
    }
  }

  displayNoteBy(context) {
    const activeNotecontainer = document.querySelector('#noteContainer .context.active');
    if (activeNotecontainer) {
      activeNotecontainer.classList.remove('active');
    }
    console.log('context ===> ', context, this.current);
    const noteContainer = document.querySelector(`#noteContainer .context[data-context~=${context}]`);
    noteContainer.classList.add('active');
  }

  afterChangeContext(context) {
    if (this.queue.indexOf(context) <= -1) {
      if (this.queue[this.queue.length - 1] != null) {
        this.queue.push(null);
      }
    }
    const position = this.queue.indexOf(context);
    if (position !== -1) {
      this.current = position;
    } else {
      this.current = this.queue.length - 1;
    }

    const currentActiveTab = virtualclass.askQuestion.getActiveTab();
    if (currentActiveTab === 'note') this.updateNavigateNumbers();
  }

  deleteElementFromQueue(context) {
    const pos = this.queue.indexOf(context);
    if (pos >= -1) {
      this.queue.splice(pos, 1);
    }
  }
}

class BookMarkUserInterface {
  afterChangeContext(context) {
    const activeBookMark = document.querySelector('#bookmark .container .bookmarks.active');
    if (activeBookMark) {
      activeBookMark.classList.remove('active');
    }

    const newBookmarkElem = document.querySelector(`#bookmark .bookmarks[data-context~=${context}]`);
    if (newBookmarkElem) {
      newBookmarkElem.classList.add('active');
    } else {
      const bookMarkContainer = document.querySelector('#bookmark .container');
      if (bookMarkContainer && !newBookmarkElem) {
        const bookmarkHtml = virtualclass.getTemplate('bookmark', 'askQuestion');
        bookMarkContainer.insertAdjacentHTML('beforeEnd', bookmarkHtml({context: virtualclass.askQuestion.currentContext}));
      }
    }

    if (virtualclass.askQuestion.queue.bookmark[context]
      && virtualclass.askQuestion.queue.bookmark[context].length > 0) {
      virtualclass.askQuestion.engine.perform(context, 'bookmark');
    }
  }

  async bookMarkHandler(event) {
    // await virtualclass.askQuestion.triggerInitFirebaseOperation('bookmark');
    virtualclass.askQuestion.handler(event);
    const parentNode = event.target.parentNode;
    if (+(parentNode.dataset.value) === 1) {
      parentNode.dataset.value = 0;
    } else {
      parentNode.dataset.value = 1;
    }
  }

  attachHandler() {
    document.getElementById('bookmark').addEventListener('click', this.bookMarkHandler);
  }
}

class AskQuestionUtility {
  elapsedComponentTime(data) {
    const currentEditTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    const previousTime = ((data.componentId).split(`${data.component}-${virtualclass.uInfo.userid}-`))[1];
    return Math.floor((currentEditTime - (+previousTime)) / 60);
  }

  separatedContent(data) {
    let content;
    let moreContent;
    if (data.content.length > 128) {
      content = data.content.slice(0, 128);
      moreContent = data.content.slice(128, data.content.length);
    } else {
      content = data.content;
    }
    if (data.action === 'edit' || data.action === 'cancel') {
      const getContentElem = document.querySelector(`#${data.componentId} .content p`);
      const ellipsisTemp = virtualclass.getTemplate('ellipsisText', 'askQuestion');
      getContentElem.innerHTML = content;
      if (data.content.length > 128) {
        const ellipsisTextTemp = ellipsisTemp({ morecontent: moreContent }); // TODO use this template in question, answer, comment
        document.querySelector(`#${data.componentId} .content p`).insertAdjacentHTML('beforeend', ellipsisTextTemp);
      }
      this.displayMore(data);
    } else if (data.action === 'create') {
      return { content: content, moreContent: moreContent };
    }
  }

  displayMore(data) {
    const componentId = (data.action === 'create') ? data.id : data.componentId;
    const btn = document.querySelector(`#${componentId} .content p .btn`);
    if (data.content.length > 128 && btn) {
      if (btn.classList.contains('close')) {
        btn.classList.remove('close');
        btn.classList.add('open');
      }
    }
  }
}

class AskQuestionEvents {
  constructor() {
    this.values = ['edit', 'delete', 'upvote', 'markAnswer', 'moreControls', 'reply', 'navigation',
      'createInput', 'save', 'cancel', 'navigation', 'more', 'less', 'clearall', 'previous', 'next'];
  }

  reply(data) {
    let component;
    if (data.component === 'question' || data.component === 'answer') {
      component = data.component === 'question' ? 'answer' : 'comment';
    } else {
      component = data.component;
    }
    data = {
      component,
      action: 'renderer',
      type: 'input',
      context: virtualclass.askQuestion.currentContext,
      componentId: data.componentId,
      parent: data.parentId,
    };
    virtualclass.askQuestion.engine.performWithQueue(data);
    virtualclass.askQuestion[data.action].call(virtualclass.askQuestion, data);
  }

  edit(data) {
    const moreControls = document.querySelector(`#${data.componentId} .moreControls .item`);
    if (moreControls.classList.contains('open')) {
      moreControls.classList.remove('open');
      moreControls.classList.add('close');
    }
    const userId = (data.componentId).split('-')[1];
    if (userId === virtualclass.uInfo.userid || roles.hasControls()) {
      let text;
      const time = virtualclass.askQuestion.util.elapsedComponentTime({ componentId: data.componentId, component: data.component });
      if (!roles.hasControls()) {
        if (time > 30 || virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId].children.length > 0
          || virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId].upvote > 0) {
          if (time > 30) {
            virtualclass.popup.infoMsg(virtualclass.lang.getString('askQuestionTimeExceed'));
            const moreElem = document.querySelector(`#${data.componentId}`);
            if (moreElem) {
              moreElem.classList.remove('editable');
              moreElem.classList.add('noneditable');
            }
          }
          return;
        }
      }

      const footerElem = document.querySelector(`#${data.componentId} .footer`);
      if (footerElem && footerElem.classList.contains('show')) {
        footerElem.classList.remove('show');
        footerElem.classList.add('hide');
      }
      const str = virtualclass.lang.getString('more');
      const content = (document.querySelector(`#${data.componentId} .content p`).innerText).replace(str, '');
      let moreContent = document.querySelector(`#${data.componentId} .content .morecontent`);
      if (moreContent) {
        moreContent = moreContent.innerHTML;
        text = content + moreContent;
      } else {
        text = content;
      }

      const component = document.querySelector(`#${data.componentId} .content p`).dataset.component;
      data = virtualclass.askQuestion.generateData({ // todo, this should be moved to utility
        action: 'renderer',
        type: 'input',
        content: text,
        component: component,
        componentId: data.componentId,
        parent: data.component === 'question' ? null : null,
      });
      virtualclass.askQuestion[data.action].call(virtualclass.askQuestion, data);
    } else {
      return;
    }
  }

  delete(data) {
    const moreControls = document.querySelector(`#${data.componentId} .moreControls .item`);
    if (moreControls.classList.contains('open')) {
      moreControls.classList.remove('open');
      moreControls.classList.add('close');
    }
    const userId = (data.componentId).split('-')[1];
    if (userId === virtualclass.uInfo.userid || roles.hasControls()) {
      const time = virtualclass.askQuestion.util.elapsedComponentTime({ componentId: data.componentId, component: data.component });
      if (!roles.hasControls()) {
        if (time > 30 || virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId].children.length > 0
          || virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId].upvote > 0) {
          if (time > 30) {
            virtualclass.popup.infoMsg(virtualclass.lang.getString('askQuestionTimeExceed'));
            const moreElem = document.querySelector(`#${data.componentId}`);
            if (moreElem) {
              moreElem.classList.remove('editable');
              moreElem.classList.add('noneditable');
            }
          }
          return;
        }
      }
      data = virtualclass.askQuestion.generateData({
        component: data.component,
        action: data.event,
        componentId: data.componentId,
        parent: data.parentId,
      });
      virtualclass.askQuestion.send(data);
    } else {
      return;
    }
  }

  upvote(data) {
    const upvoteCount = document.querySelector(`#${data.componentId} .upVote .total`).innerHTML;
    if (upvoteCount === '0') {
      const obj = virtualclass.askQuestion.generateData({ component: data.component, action: data.event });
      if (data.component !== 'question') {
        obj.parent = data.parentId;
      }
      obj.upvote = 1;
      obj.componentId = data.componentId;
      obj.content = virtualclass.askQuestion.context[obj.context][data.component][data.componentId].content;
      virtualclass.askQuestion.send(obj);
      virtualclass.askQuestion.firstid = obj.id;
    } else {
      virtualclass.askQuestion.firstid = virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId].id;
      virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(virtualclass.askQuestion.firstid).update('upvote', firebase.firestore.FieldValue.increment(1));
      virtualclass.askQuestion.upvote(data);// TODO
    }
  }

  save(data) {
    if (data.component === 'note') {
      const obj = virtualclass.askQuestion.generateData({
        component: data.component,
        content: data.text,
        type: 'noteWithContent',
        action: data.action,
        uname: virtualclass.uInfo.userobj.name,
        componentId: data.componentId,
        parent: data.parentId,
        navigation: virtualclass.askQuestion.noteNavigation.queue,
      });
      virtualclass.askQuestion.send(obj);
    } else if (data.component === 'bookmark') {
      const obj = virtualclass.askQuestion.generateData({
        component: data.component,
        content: data.text,
        type: 'bookmark',
        action: data.action,
        uname: virtualclass.uInfo.userobj.name,
        componentId: data.componentId,
        parent: data.parentId,
      });
      virtualclass.askQuestion.send(obj);
    } else {
      if (data.componentId) {
        const footerElem = document.querySelector(`#${data.componentId} .footer`);
        if (footerElem && footerElem.classList.contains('hide')) {
          footerElem.classList.remove('hide');
          footerElem.classList.add('show');
        }
      }
      const obj = virtualclass.askQuestion.generateData({
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
      virtualclass.askQuestion.send(obj);
      if (roles.hasControls() && data.component === 'answer') {
        obj.action = 'markAnswer';
        virtualclass.askQuestion.send(obj); // todo, why we are seding more than one time data
      }
    }
  }

  moreControls(data) {
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

  markAnswer(data) {
    const moreControlElem = document.querySelector(`#${data.componentId} .moreControls .item`);
    if (moreControlElem.classList.contains('open')) {
      moreControlElem.classList.remove('open');
      moreControlElem.classList.add('close');
    }
    const obj = virtualclass.askQuestion.generateData({
      component: data.component,
      action: data.event,
      uname: virtualclass.uInfo.userobj.name,
      componentId: data.componentId,
      parent: data.parentId,
    });
    virtualclass.askQuestion.send(obj);
  }

  cancel(data) {
    if (data.componentId) {
      const text = document.querySelector('#writeContent .text');
      if (text) {
        text.remove();
      }

      const footerElem = document.querySelector(`#${data.componentId} .footer`);
      if (footerElem && footerElem.classList.contains('hide')) {
        footerElem.classList.remove('hide');
        footerElem.classList.add('show');
      }
      const mainContent = virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId].content;
      virtualclass.askQuestion.util.separatedContent({ componentId: data.componentId, content: mainContent, action: data.event });
    } else {
      const text = document.querySelector('#writeContent');
      if (text) {
        text.remove();
      }
    }
  }

  navigation(data) {
    const navigateComponent = (data.component === 'question') ? 'answers' : 'comments';
    const ElemNavigate = document.querySelector(`#${data.componentId} .${navigateComponent}`);
    if (ElemNavigate.classList.contains('open')) {
      ElemNavigate.classList.remove('open');
      ElemNavigate.classList.add('close');
    } else {
      ElemNavigate.classList.remove('close');
      ElemNavigate.classList.add('open');
    }
  }

  moreOrLess(data) {
    const moreText = document.querySelector(`#${data.componentId} .morecontent`);
    const action = data.event === 'more' ? 'less' : 'more';
    const btn = document.querySelector(`#${data.componentId} .content .btn`);
    const str = action === 'more' ? virtualclass.lang.getString('more') : virtualclass.lang.getString('less');
    btn.innerHTML = str;
    btn.dataset.event = action;
    if (moreText.classList.contains('close')) {
      moreText.classList.remove('close');
      moreText.classList.add('open');
    } else {
      moreText.classList.remove('open');
      moreText.classList.add('close');
    }
    if (btn.dataset.event === action) {
      btn.classList.remove('close');
      btn.classList.add('open');
    }
  }

  more(data) {
    this.moreOrLess(data);
  }

  less(data) {
    this.moreOrLess(data);
  }

  next(data) {
    virtualclass.askQuestion.noteNavigation.triggerNavigate(data.event);
  }

  previous(data) {
    virtualclass.askQuestion.noteNavigation.triggerNavigate(data.event);
  }

  execute(data){
    this[data.event].call(this, data);
  }

}

class AskQuestionRenderer {
  mainInterface(data) {
    if (data && data.component === 'note') {
      // this.qaNote.renderMainContainer();
    } else {
      // TODO, this code needs to be simplified
      const toggle = document.querySelector('#virtualclassCont.congrea #congHr');
      const context = {};
      const qaTemp = virtualclass.getTemplate('askQuestionMain', 'askQuestion');
      const qtemp = qaTemp(context);
      document.querySelector('#rightSubContainer').insertAdjacentHTML('beforeend', qtemp);

      toggle.addEventListener('click', (elem) => {
        virtualclass.askQuestion.initFirebaseOperatoin();
        virtualclass.askQuestion.renderMainContainer(elem.currentTarget);
      });

      const addQuestion = document.querySelector('#virtualclassCont.congrea .addQuestion-icon');
      if (addQuestion) {
        addQuestion.addEventListener('click', () => {
          virtualclass.askQuestion.engine.performWithQueue({ component: 'question', action: 'renderer', type: 'input', context: virtualclass.askQuestion.currentContext });
        });
      }

      const note = document.getElementById('virtualclassnote');
      note.addEventListener('click', (event) => {
        // this.handler.bind(this)
        virtualclass.askQuestion.triggerInitFirebaseOperation('note');
        virtualclass.rightbar.handleDisplayBottomRightBar(event.currentTarget);
        virtualclass.askQuestion.engine.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: virtualclass.askQuestion.currentContext });
      });
    }
  }

  input(data) {
    let insertId;
    if (data.component === 'question') {
      insertId = '#askQuestion';
    } else {
      insertId = '#' + ((data.componentId === null) ? data.parent : data.componentId);
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
          this.autosize({target: text});
        }
      }
    } else {
      document.querySelector(insertId).insertAdjacentHTML('beforeend', userInputTemplate);
    }
    if (data.component === 'question') {
      const inputAction = document.querySelector('#writeContent');
      if (inputAction) {
        inputAction.addEventListener('click', virtualclass.askQuestion.handler.bind(virtualclass.askQuestion));
        inputAction.addEventListener('input', this.autosize.bind(this));
      }
    }
  }

  contentBox(data) {
    const text = virtualclass.askQuestion.util.separatedContent(data);
    if (data.component === 'question') {
      const chkContextElem = document.querySelector(`#askQuestion .context[data-context~=${data.context}]`);
      if ('question' && chkContextElem) {
        const componentTemplate = virtualclass.getTemplate(data.component, 'askQuestion');
        const htmlContent = componentTemplate({ id: data.id, userName: data.uname, content: text.content, morecontent: text.moreContent });
        document.querySelector(`#askQuestion [data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', htmlContent);
      } else {
        const getContextTemp = virtualclass.getTemplate('context', 'askQuestion');
        const cTemp = getContextTemp({ context: data.context });
        document.querySelector('#askQuestion .container').insertAdjacentHTML('beforeend', cTemp);
        const componentTemp = virtualclass.getTemplate(data.component, 'askQuestion');
        document.querySelector(`#askQuestion [data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', componentTemp({
          id: data.id,
          userName: data.uname,
          content: text.content,
          morecontent: text.moreContent,
        }));
        console.log('====> adding current ');
        document.querySelector(`#askQuestion [data-context~=${data.context}]`).classList.add('current');

      }
    } else if (data.component === 'answer' || data.component === 'comment') {
      const qaAnswerTemp = virtualclass.getTemplate(data.component, 'askQuestion');
      const context = {
        id: data.id,
        itemId: data.componentId,
        userName: data.uname,
        hasControl: roles.hasControls(),
        content: text.content,
        morecontent: text.moreContent,
        parent: data.parent,
      };
      const ansTemp = qaAnswerTemp(context);
      if (data.component === 'answer') {
        document.querySelector(`#${data.parent} .answers`).insertAdjacentHTML('beforeend', ansTemp);
      } else if (data.component === 'comment') {
        const comment = document.querySelector(`#${data.parent} .comments`);
        if (comment) { comment.insertAdjacentHTML('beforeend', ansTemp); };
        // document.querySelector(`#${data.parent} .comments`).insertAdjacentHTML('beforeend', ansTemp);
      }
    }
    virtualclass.askQuestion.util.displayMore(data);

    if (data.userId === virtualclass.uInfo.userid) {
      if (data.component === 'note') {
        this.renderNote(data.context);
        const textArea = document.querySelector(`#noteContainer .context[data-context="${data.context}"] textarea.content`);
        textArea.value = data.content;
      } else if (data.component !== 'comment') {
        document.querySelector(`#${data.id} .upVote`).dataset.upvote = 'upvoted';
      }
      if (!roles.hasControls()) {
        const currentElem = document.querySelector(`#${data.componentId}`);
        if (currentElem) {
          currentElem.classList.add('mySelf');
          currentElem.classList.add('editable');
        }
      }
    }
    if (data.component === 'question') {
      const qnElem = document.querySelector(`#${data.id}.question`);
      if (qnElem) {
        qnElem.addEventListener('click', (ev) => {
          virtualclass.askQuestion.handler(ev);
        });
      }
    }
  }


  renderNote(currentContext) {
    // let attachFunction = false;
    let contextDivElement = document.querySelector(`#noteContainer .context[data-context="${currentContext}"]`);
    if (contextDivElement === null) {
      const contentArea = virtualclass.getTemplate('content-area', 'askQuestion');
      const contentAreaHtml = contentArea({ context: currentContext });
      const noteContainer = document.querySelector('#noteContainer .container');
      if (noteContainer != null) noteContainer.insertAdjacentHTML('beforeEnd', contentAreaHtml);
    }

    const activeNote = document.querySelector('#noteContainer .context.active');
    if (activeNote) activeNote.classList.remove('active');

    contextDivElement = document.querySelector(`#noteContainer .context[data-context="${currentContext}"]`);
    contextDivElement.classList.add('active');

    const textArea = document.querySelector(`#noteContainer .context[data-context="${currentContext}"] textarea.content`);
    textArea.addEventListener('input', this.noteHandler.bind(this));
    textArea.addEventListener('focus', this.inputFocusHandler.bind(this));

    const noteNavigationContainer = document.getElementById('noteNavigationContainer');
    if (!virtualclass.askQuestion.noteNavigation.attachImmediateHandler) {
      virtualclass.askQuestion.noteNavigation.attachImmediateHandler = true;
      noteNavigationContainer.addEventListener('click', this.noteHandlerImmediate.bind(this));
    }
  }

  noteContainer() {
    let note = document.getElementById('noteContainer');
    if (note == null) {
      const noteMainContainer = virtualclass.getTemplate('note', 'askQuestion');
      const noteMainContainerHtml = noteMainContainer({context: virtualclass.askQuestion.currentContext});
      document.querySelector('#rightSubContainer').insertAdjacentHTML('beforeend', noteMainContainerHtml);
    }

    this.renderNote(virtualclass.askQuestion.currentContext);

    const activeElement = document.querySelector('#rightSubContainer .active');
    if (activeElement) {
      activeElement.classList.remove('active');
      // activeElement.classList.add('deactive');
    }
    note = document.getElementById('noteContainer');
    note.classList.add('active');
  }

  noteWithContent(data) {
    let noteTextContainer = document.querySelector(`#noteContainer [data-context~=${data.context}] .content`);
    if (!noteTextContainer) {
      // virtualclass.askQuestion.renderer({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });
      // virtualclass.askQuestion.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });
      virtualclass.askQuestion.engine.performWithPassData({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });

      noteTextContainer = document.querySelector(`#noteContainer [data-context~=${data.context}] .content`);
    }
    noteTextContainer.value = data.content;
  }

  noteHandlerImmediate(ev) {
    console.log('====> handler ', ev.target.className);
    virtualclass.askQuestion.handler(ev);
  }

  // TODO, let see how can this be improve more
  noteHandler(ev, eventType) {
    if (eventType) {
      this.handler(ev);
    } else {
      if (this.sendToDatabaseTime) {
        clearTimeout(this.sendToDatabaseTime);
      }
      this.sendToDatabaseTime = setTimeout(() => {
        virtualclass.askQuestion.noteNavigation.handleQueue(virtualclass.askQuestion.currentContext);
        virtualclass.askQuestion.handler(ev); // send note to database
      }, 700);
    }
  }

  // text area focus input element
  inputFocusHandler() {
    virtualclass.askQuestion.triggerPause();
  }

  autosize(ev) {
    setTimeout(() => {
      ev.target.style.cssText = 'height:auto; padding:0';
      ev.target.style.cssText = 'height:' + ev.target.scrollHeight + 'px';
    }, 1000);
  }

  bookmark(data) {
    const bookmark = document.querySelector(`#bookmark .bookmarks[data-context~=${data.context}]`);
    if (bookmark) {
      bookmark.dataset.value = data.content;
    }
  }
}

class BasicOperation {
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

    if (data.component === 'note' || data.component === 'bookmark') {
      virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collectionMark).doc(data.id).set(data).then(() => {
        console.log('ask question write, Document successfully written! ', data);
      })
        .catch((error) => {
          console.error('ask question write, Error writing document: ', error);
        });

      if (data.component === 'note') {
        const content = data.content.trim();
        if (content === '') {
          virtualclass.askQuestion.noteNavigation.deleteElementFromQueue();
        }
      }
    } else {
      virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(data.id).set(data)
        .then(() => {
          console.log('ask question write, Document successfully written! ', data);
        })
        .catch((error) => {
          console.error('ask question write, Error writing document: ', error);
        });
    }
  }

  handler(ev) {
    const questionElement = ev.target.closest('div.context');
    if (questionElement && questionElement.dataset) {
      virtualclass.askQuestion.currentContext = ev.target.closest('div.context').dataset.context;
    }
    let event;
    let parent;
    let componentId = null;
    const target = ev.target;
    if ((this.event.values.includes(target.dataset.event))) {
      event = target.dataset.event;
      parent = target.parentNode;
    } else if (this.event.values.includes(target.parentNode.dataset.event)) {
      event = target.parentNode.dataset.event;
      parent = target.parentNode.parentNode;
    } else if (this.event.values.includes(target.parentNode.parentNode.dataset.event)) {
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
        } else if (event === 'edit' || event === 'markAnswer' || event === 'delete') {
          parentId = (parent.dataset.parent) ? parent.dataset.parent : null;
        }
      }

      if (event === 'save') {
        if (component === 'note') {
          text = target.value;
          action = 'create';
        } else if (component === 'bookmark') {
          text = (+(parent.dataset.value) === 0 ? 1 : 0);
          action = 'create';
        } else {
          if (parent.previousSibling != null && parent.previousSibling.value != null
            && parent.previousSibling.value !== '') {
            text = parent.previousSibling.value;
          } else {
            virtualclass.popup.infoMsg(virtualclass.lang.getString('enterText'));
            return;
          }
          if (parent.dataset.componentId === null || parent.dataset.componentId === '') {
            action = 'create';
          } else {
            action = 'edit';
            componentId = parent.dataset.componentId;
            if (!roles.hasControls()) {
              const editElem = virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][component][componentId].upvote;
              if (editElem !== 0 && editElem != null) {
                componentId = parent.dataset.componentId;
                event = 'cancel';
                virtualclass.popup.infoMsg(virtualclass.lang.getString('upvoted'));
              }
            }
          }
        }
        parentId = (parent.dataset.parent) ? parent.dataset.parent : null;
      } else if (event === 'clearall') {
        const contentElement = document.querySelector(`#noteContainer .context[data-context~=${virtualclass.askQuestion.currentContext}] textarea`);
        if (contentElement) {
          contentElement.value = '';
          text = '';
          action = 'create';
          event = 'save';
        }
      } else if (event === 'upvote') {
        parentId = parent.dataset.parent;
      }
      data = {
        event, component, componentId, text, action, parentId
      };
      this.event.execute(data);
    }
  }

  renderer(data) {
    this.rendererObj[data.type].call(this.rendererObj, data);
  }

  create(data) {
    if (data.userId === virtualclass.uInfo.userid) {
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
      elem.remove();
      this.updateStatus(data, 'delete');
    }
  }

  updateStatus(data, status) {
    let getChildren;
    const contextObj = virtualclass.askQuestion.context;
    const currentContext = virtualclass.askQuestion.currentContext;
    let question;
    if (status === 'delete') {
      this.updateCount(data, status);
      const component = data.component === 'question' ? 'answer' : 'comment';
      const childrenArr = contextObj[currentContext][data.component][data.componentId].children;
      if (childrenArr.length > 0 && roles.hasControls()) {
        for (let i = 0; i < childrenArr.length; i++) {
          delete contextObj[currentContext][component][childrenArr[i]];
        }
      }
      delete contextObj[currentContext][data.component][data.componentId];
    } else if (status === 'editable' || status === 'edited') {
      question = data;
      if (status === 'editable') {
        question = { id: data.id, content: data.content, children: [], status, parent: null, componentId: data.id, upvote: 0 };
        this.updateCount(data, status);
      } else if (status === 'edited') {
        question.children = contextObj[currentContext][data.component][data.componentId].children;
        question.content = data.content;
      }
      question.status = status;
      contextObj[currentContext][data.component][data.componentId] = question;
    } else if (status === 'upvote') {
      if (data.component === 'question' || data.component === 'answer') {
        getChildren = contextObj[currentContext][data.component][data.componentId].children;
      }
      question = { id: data.id, content: data.content, children: getChildren, status, parent: null, componentId: data.id, upvote: data.upvote };
      question.status = status;
      contextObj[currentContext][data.component][data.componentId] = question;
    }
  }

  updateCount(data, status) {
    const contextObj = virtualclass.askQuestion.context;
    let component = data.component === 'answer' ? 'question' : 'answer';
    if (data.parent != null && (data.parent).split('-')[0] === 'comment') {
      component = 'comment';
    }
    if (contextObj[data.context] && contextObj[data.context][component] && Object.prototype.hasOwnProperty.call(contextObj[data.context][component], data.parent) && data.component !== 'question') {
      const children = contextObj[data.context][component][data.parent].children;
      const moreControlElem = document.querySelector(`#${data.parent}`);
      if (data.component === 'answer' || data.component === 'comment') {
        if (status === 'editable') {
          children.push(data.componentId);
          if (!roles.hasControls()) {
            moreControlElem.classList.remove('editable');
            moreControlElem.classList.add('noneditable');
          }
        } else {
          children.splice(children.indexOf(data.componentId), 1);
          const userId = (data.parent).split('-')[1];
          const time = virtualclass.askQuestion.util.elapsedComponentTime({ componentId: data.parent, component: component });
          const componentUpvote = virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][component][data.parent].upvote;
          const getParentElem = document.querySelector(`#${data.parent} .upVote .total`); // TODO handle using component data
          if (!roles.hasControls() && (time < 30 && getParentElem && componentUpvote === 0)
            || (component === 'comment' && userId === virtualclass.uInfo.userid)) {
            if (children.length === 0) {
              moreControlElem.classList.remove('noneditable');
              moreControlElem.classList.add('editable');
            }
          }
          if (data.component === 'answer') {
            const markParentElem = document.querySelector(`#${data.parent}`);
            markParentElem.dataset.markAnswer = '';
          }
        }
        const parentElem = document.querySelector(`#${data.parent} .navigation .total`);
        parentElem.innerHTML = contextObj[data.context][component][data.parent].children.length;
      }
    }
  }

  edit(data) {
    virtualclass.askQuestion.util.separatedContent(data);
    document.querySelector(`#${data.componentId} .lable`).innerHTML = `${data.component} (edited)`;
    const textTemp = document.querySelector('#writeContent');
    if (textTemp) {
      textTemp.remove();
    }
    this.updateStatus(data, 'edited');
  }

  upvote(data) {
    if (data.upvote) {
      if (data.upvote === 1) virtualclass.askQuestion.firstid = data.id;
      document.querySelector(`#${data.componentId} .upVote .total`).innerHTML = data.upvote;
      if (data.userId === virtualclass.uInfo.userid) {
        document.querySelector(`#${data.componentId} .upVote`).dataset.upvote = 'upvoted';
      }
      if (!roles.hasControls()) {
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

  markAnswer(data) {
    const parent = document.querySelector(`#askQuestion #${data.parent} .answers .answer[data-mark-answer="marked"]`);
    const markParentElem = document.querySelector(`#${data.parent}`);
    if (parent && markParentElem.dataset.markAnswer) {
      delete parent.dataset.markAnswer;
      delete markParentElem.dataset.markAnswer;
    }
    const markElem = document.querySelector(`#${data.componentId}`);
    if (markParentElem && markElem && !markParentElem.dataset.markAnswer) {
      markElem.dataset.markAnswer = 'marked';
      markParentElem.dataset.markAnswer = 'marked';
      const answersElem = document.querySelectorAll(`#askQuestion #${data.parent} .answers .answer`);
      for (let i = 0; i < answersElem.length; i++) {
        if (answersElem[i].classList.contains('editable')) {
          answersElem[i].classList.remove('editable');
        }
        answersElem[i].classList.add('noneditable');
      }
    }
  }

  mostUpvotedOnTop(data) {
    let getChildren;
    const arr = [];
    const context = virtualclass.askQuestion.context;
    const currentContext = data.context
    if (data.component === 'answer') {
      getChildren = context[currentContext]['question'][data.parent].children;
    }
    for (const component in context[currentContext][data.component]) {
      if (component !== 'events' && component !== 'orderdByUpvoted') {
        const obj = {
          componentId: component,
          upvote: context[currentContext][data.component][component].upvote,
        };
        if (data.component === 'answer') {
          const checkAns = getChildren.indexOf(component);
          if (checkAns !== -1) {
            arr.push(obj);
          }
        } else if (data.component === 'question') {
          arr.push(obj);
        }
      }
    }
    arr.sort((a, b) => b.upvote - a.upvote);
    if (data.component === 'question') {
      context[currentContext][data.component].orderdByUpvoted = arr;
    } else {
      if (!context[currentContext][data.component].hasOwnProperty('orderdByUpvoted')) {
        context[currentContext][data.component].orderdByUpvoted = { };
      }
      context[currentContext][data.component].orderdByUpvoted[data.parent] = arr;
    }
    const container = document.createElement('div');
    container.className = data.component === 'question' ? 'container' : 'answers open';
    if (data.component === 'question') {
      for (let i = 0; i < context[currentContext][data.component]['orderdByUpvoted'].length; i++) {
        container.appendChild(document.querySelector(`#${context[currentContext][data.component]['orderdByUpvoted'][i].componentId}`));
      }
    } else {
      const ansObj = context[currentContext][data.component].orderdByUpvoted;
      for (let i = 0; i < ansObj[data.parent].length; i++) {
        container.appendChild(document.querySelector(`#${ansObj[data.parent][i].componentId}`));
      }
    }

    const replaceContainer = data.component === 'question' ? '.container' : `#${data.parent} .answers`;
    const elem = document.querySelector(`#askQuestion [data-context~=${currentContext}] ${replaceContainer}`);
    document.querySelector(`#askQuestion [data-context~=${currentContext}] ${replaceContainer}`).parentNode.replaceChild(container, elem);
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
}

class AskQuestionEngine {
  performWithQueue(data) {
    this.makeQueue(data);
    const type = (data.component === 'note' ||  data.component === 'bookmark') ? data.component : 'question';
    this.perform(data.context, type);
  }

  makeQueue(data) {
    const type = (data.component === 'note' || data.component === 'bookmark') ? data.component : 'question';
    if (!virtualclass.askQuestion.queue[type][data.context]) {
      virtualclass.askQuestion.queue[type][data.context] = [];
    }
    virtualclass.askQuestion.queue[type][data.context].push(data);
  }

  perform(context, type) {
    while (virtualclass.askQuestion.queue[type][context] && virtualclass.askQuestion.queue[type][context].length > 0) {
      const data = virtualclass.askQuestion.queue[type][context].shift();
      if (data.component === 'question' && data.upvote && data.upvote > 1) {
        virtualclass.askQuestion.upvote.call(virtualclass.askQuestion, data);
      } else if (data.component === 'answer' && data.upvote && data.upvote > 1) {
        virtualclass.askQuestion.upvote.call(virtualclass.askQuestion, data);
      } else {
        // context = whiteboard 1/screen share, component = question/answer, action = create/edit
        virtualclass.askQuestion[data.action].call(virtualclass.askQuestion, data);
      }
    }
  }

  performWithPassData(data) {
    virtualclass.askQuestion[data.action].call(virtualclass.askQuestion, data);
  }
}

class AskQuestion extends BasicOperation {
  init() {
    if (this.initialize) return;
    this.queue = {};
    this.queue.note = [];
    this.queue.question = [];
    this.queue.bookmark = [];
    this.context = {};
    this.firstRealTime = true;
    this.initialize = true;
    this.allMarks = {};
    this.noteNavigation = new NoteNavigation();
    this.event = new AskQuestionEvents();
    this.engine = new AskQuestionEngine();
    this.rendererObj = new AskQuestionRenderer();
    this.rendererObj.mainInterface();
    this.util = new AskQuestionUtility();
    this.bookmarkUi = new BookMarkUserInterface();
    this.attachHandler();
    this.viewAllMode = false;
  }

  attachHandler() {
    this.bookmarkUi.attachHandler();
    if (virtualclass.isPlayMode) {
      const viewAllQuestion = document.getElementById('viewAllQuestion');
      viewAllQuestion.addEventListener('click', this.viewAllQuestion.bind(this));
    }
  }

  viewAllQuestion(ev) {
    this.triggerPause();
    const viewAllQuestion = document.getElementById('viewAllQuestion');
    const viewAllAction = ev.currentTarget.dataset.viewall;
    const askQuestion = document.getElementById('askQuestion');
    if (askQuestion != null) {
      const rightPanel = document.getElementById('virtualclassAppRightPanel');
      const currentContext = document.querySelector('#askQuestion .container .current');
      if (currentContext) { currentContext.classList.remove('current'); }

      if (viewAllAction === 'enable') {
        if (rightPanel) { rightPanel.classList.add('viewAllMode'); }
        askQuestion.classList.add('viewAll');
        viewAllQuestion.dataset.viewall = 'disable';
        if (!this.viewAllTriggered) {
          for (const context in virtualclass.askQuestion.queue.question) {
            if (!this.context[context]) {
              this.context[context] = new QAcontext();
            }
            this.triggerPerform(context);
          }
        }
        this.viewAllTriggered = true;
        this.viewAllMode = true;
      } else {
        virtualclass.askQuestion.currentContext = virtualclass.askQuestion.readyContextActual();
        if (rightPanel) { rightPanel.classList.remove('viewAllMode'); }
        askQuestion.classList.remove('viewAll');
        viewAllQuestion.dataset.viewall = 'enable';
        const currentContextElement = document.querySelector(`#askQuestion .context[data-context~=${virtualclass.askQuestion.currentContext}]`);
        currentContextElement.classList.add('current');
        this.viewAllMode = false;
      }
    }
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

  getActiveTab() {
    if (document.querySelector('#congHr.active') != null) {
      return 'question';
    } else if (document.querySelector('#virtualclassnote.active') != null) {
      return 'note';
    } else {
      return false;
    }
  }

  readyContextActual() {
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
    return contextName;
  }

  innerMakeReadyContext() {
    const contextName = this.readyContextActual();
    if (contextName === this.currentContext || !contextName) return;
    this.triggerPerform(contextName);
    console.log('====> ready context ', this.currentContext);
    if (roles.hasControls()) {
      ioAdapter.mustSend({ cf: 'readyContext', context: this.currentContext });
    }
  }

  triggerPerform(contextName) {
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

    const type = this.getActiveTab();
    if (type && this.queue[type] && this.queue[type][this.currentContext] && this.queue[type][this.currentContext].length > 0) {
      this.engine.perform(this.currentContext, type);
      if (type === 'note') this.noteNavigation.afterChangeContext(virtualclass.askQuestion.currentContext);
    } else if (type === 'note') {
      // Create blank structure for note
      this.engine.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: virtualclass.askQuestion.currentContext });
      this.noteNavigation.afterChangeContext(virtualclass.askQuestion.currentContext);
    }
    this.bookmarkUi.afterChangeContext(virtualclass.askQuestion.currentContext);

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
      this.collectionMark = `${this.collection}_${virtualclass.gObj.orginalUserId}`;
    } else if (localStorage.getItem('mySession') != null) {
      this.collection = `${wbUser.lkey}_${localStorage.getItem('mySession')}_${wbUser.room}`;
      this.collectionMark = `${this.collection}_${virtualclass.gObj.uid}`;
    }
  }

  buildAllMarksStatus(data) {
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

  attachHandlerForRealTimeUpdate() {
    console.log('===> Attach Real time update ');
    this.db.collection(this.collection).orderBy('timestamp', 'asc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const askQuestion = document.getElementById('askQuestion');
          if (change.type === 'added' || change.type === 'modified') {
            const data = change.doc.data();
            if (askQuestion.classList.contains('active') && (data.context === virtualclass.askQuestion.currentContext || virtualclass.askQuestion.viewAllMode)) {
              this.engine.performWithQueue(data);
              if (virtualclass.isPlayMode && data.context === '_doc_0_0') this.buildAllMarksStatus(data);
            } else {
              this.engine.makeQueue(data);
              if (virtualclass.isPlayMode) this.buildAllMarksStatus(data);
            }
          };
        });

        if (this.firstRealTime) {
          const virtualclassCont = document.getElementById('virtualclassCont');
          if (virtualclassCont) virtualclassCont.classList.remove('askQuestionFetching');
          this.firstRealTime = false;
        }
      }, (error) => {
        console.log('ask question real time ', error);
      });
  }

  afterSignIn() {
    console.log('====> after sign in');
    if (this.collection) this.attachHandlerForRealTimeUpdate();
    if (virtualclass.isPlayMode) {
      virtualclass.recorder.requestListOfFiles();
      if (this.collectionMark) this.loadInitialDataMark();
    }
    // if (this.collectionMark) this.loadInitialDataMark();
  }

  loadInitialDataMark() {
    if (this.initCollectionMark) return;
    console.log('===> trigger note initial data');
    const self = this;
    this.db.collection(this.collectionMark).get().then((snapshot) => {
      // TODO, we have to store the inital data from attachHandlerForRealTimeUpdate
      self.initCollectionMark = true;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const currentActiveTab = self.getActiveTab();
        console.log('====> total data type ', data.type);
        if ((currentActiveTab === 'note' || data.component === 'bookmark') && self.currentContext === data.context) {
          self.engine.performWithQueue(data);
        } else {
          self.engine.makeQueue(data);
        }

        if (virtualclass.isPlayMode) this.buildAllMarksStatus(data);

        if (data.component === 'note') {
          virtualclass.askQuestion.noteNavigation.queue = data.navigation;
          virtualclass.askQuestion.noteNavigation.afterChangeContext(virtualclass.askQuestion.currentContext);
        }
      });
    });
    // .catch((error) => {
    //   console.log('ask question read error ', error);
    // });
    // todo, this has to be enable in production
  }

  async triggerInitFirebaseOperation(from) {
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

  renderMainContainer(elem) {
    virtualclass.rightbar.handleDisplayRightBar('#askQuestion');
    virtualclass.rightbar.handleDisplayBottomRightBar(elem);
    if (this.queue.question[this.currentContext] && this.queue.question[this.currentContext].length > 0) {
      this.engine.perform(this.currentContext, 'question');
    }
  }

  getCurrentQuestions() {
    return this.context[virtualclass.askQuestion.currentContext].question;
  }

  triggerPause() {
    if (virtualclass.isPlayMode && virtualclass.recorder.playStart && !virtualclass.recorder.controller.pause) {
      virtualclass.recorder.initRecPause();
    }
  }
}
