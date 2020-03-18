class UserInteractivityEvents { // main Part
  constructor() {
    this.values = ['edit', 'delete', 'upvote', 'markAnswer', 'reply', 'navigation',
      'createInput', 'save', 'cancel', 'more', 'less', 'clearall', 'previous', 'next'];
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
      context: virtualclass.userInteractivity.currentContext,
      componentId: data.componentId,
      parent: data.parentId,
    };
    virtualclass.userInteractivity.engine.performWithQueue(data);
    // virtualclass.userInteractivity[data.action].call(virtualclass.userInteractivity, data);
  }

  edit(data) {
    const userInteractive = virtualclass.userInteractivity;
    const allContext = userInteractive.context;
    const userId = (data.componentId).split('-')[1];
    if (+(userId) === +(virtualclass.gObj.orginalUserId) || virtualclass.vutil.checkUserRole()) {
      let text;
      const time = virtualclass.userInteractivity.questionAnswer.elapsedComponentTime({
        componentId: data.componentId, component: data.component,
      });
      if (!virtualclass.vutil.checkUserRole()) {
        if (time > 30
          || allContext[userInteractive.currentContext][data.component][data.componentId].children.length > 0
          || allContext[userInteractive.currentContext][data.component][data.componentId].upvote > 0) {
          // if (time > 30) { TODO check condition on time
          const str = virtualclass.lang.getString('askQuestionTimeExceed');
          virtualclass.view.createAskQuestionMsg(str, 'msgContainer', 'loading');
          const moreElem = document.querySelector(`#${data.componentId}`);
          if (moreElem) {
            moreElem.classList.remove('editable');
            moreElem.classList.add('noneditable');
          }
          // }
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
      data = virtualclass.userInteractivity.generateData({ // todo, this should be moved to utility
        action: 'renderer',
        type: 'input',
        content: text,
        component: component,
        componentId: data.componentId,
        parent: data.component === 'question' ? null : null,
      });
      virtualclass.userInteractivity[data.action].call(virtualclass.userInteractivity, data);
    }
  }

  delete(data) {
    const userInteractive = virtualclass.userInteractivity;
    const allContext = userInteractive.context;
    const userId = (data.componentId).split('-')[1];
    if (+(userId) === +(virtualclass.gObj.orginalUserId) || virtualclass.vutil.checkUserRole()) {
      const time = userInteractive.questionAnswer.elapsedComponentTime({
        componentId: data.componentId, component: data.component,
      });
      if (!virtualclass.vutil.checkUserRole()) {
        if (time > 30
          || allContext[userInteractive.currentContext][data.component][data.componentId].children.length > 0
          || allContext[userInteractive.currentContext][data.component][data.componentId].upvote > 0) {
          const str = virtualclass.lang.getString('askQuestionTimeExceed');
          virtualclass.view.createAskQuestionMsg(str, 'msgContainer', 'loading');
          const moreElem = document.querySelector(`#${data.componentId}`);
          if (moreElem) {
            moreElem.classList.remove('editable');
            moreElem.classList.add('noneditable');
          }
          return;
        }
      }
      data = userInteractive.generateData({
        component: data.component,
        action: data.event,
        componentId: data.componentId,
        parent: data.parentId,
      });
      if (data.component === 'comment') {
        data.level = userInteractive.context[userInteractive.currentContext][data.component][data.componentId].level;
      }
      // console.log('level === ', JSON.stringify(data));
      userInteractive.send(data);
    }
  }

  upvote(data) {
    const userInteractive = virtualclass.userInteractivity;
    const allContext = userInteractive.context;
    const userId = virtualclass.gObj.orginalUserId;
    const upvoteCount = document.querySelector(`#${data.componentId} .upVote .total`).innerHTML;
    if (upvoteCount === '0') {
      const obj = virtualclass.userInteractivity.generateData({ component: data.component, action: data.event });
      if (data.component !== 'question') {
        obj.parent = data.parentId;
      }
      obj.upvote = 1;
      obj.componentId = data.componentId;
      obj.upvoteBy = [userId];
      obj.content = virtualclass.userInteractivity.context[obj.context][data.component][data.componentId].content;
      virtualclass.userInteractivity.send(obj);
      virtualclass.userInteractivity.firstid = obj.id;
    } else {
      allContext[userInteractive.currentContext][data.component][data.componentId].upvoteBy.push(userId);
      userInteractive.firstid = allContext[userInteractive.currentContext][data.component][data.componentId].id;
      userInteractive.db.collection(userInteractive.collection).doc(userInteractive.firstid).update({
        upvote: firebase.firestore.FieldValue.increment(1),
        upvoteBy: allContext[userInteractive.currentContext][data.component][data.componentId].upvoteBy,
      });
      virtualclass.userInteractivity.upvote(data);// TODO
    }
  }

  knowCommentLevel(id) {
    let foundRoot = null;
    let commentLevel = 1;
    const component = 'comment';

    while (!foundRoot && commentLevel < 4) {
      const contextObj = virtualclass.userInteractivity.context;
      const currContext = virtualclass.userInteractivity.currentContext;
      if (contextObj[currContext][component][id]){
        id = contextObj[currContext][component][id].parent;
        commentLevel += 1;
      } else {
        foundRoot = true;
      }
    }
    return commentLevel;
  }

  save(data) {
    if (data.component === 'note') {
      const obj = virtualclass.userInteractivity.generateData({
        component: data.component,
        content: data.text,
        type: 'noteWithContent',
        action: data.action,
        uname: virtualclass.uInfo.userobj.name,
        componentId: data.componentId,
        parent: data.parentId,
        navigation: virtualclass.userInteractivity.note.queue,

      });

      const currContext = document.querySelector('#noteNavigationContainer .clearAll').dataset.currentContext;
      if (currContext) obj.context = currContext;

      virtualclass.userInteractivity.send(obj);
    } else if (data.component === 'bookmark') {
      const obj = virtualclass.userInteractivity.generateData({
        component: data.component,
        content: data.text,
        type: 'bookmark',
        action: data.action,
        uname: virtualclass.uInfo.userobj.name,
        componentId: data.componentId,
        parent: data.parentId,
      });
      virtualclass.userInteractivity.send(obj);
    } else {
      if (data.componentId) {
        const footerElem = document.querySelector(`#${data.componentId} .footer`);
        if (footerElem && footerElem.classList.contains('hide')) {
          footerElem.classList.remove('hide');
          footerElem.classList.add('show');
        }
      }
      const obj = virtualclass.userInteractivity.generateData({
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
      if (data.action === 'edit' || data.action === 'create') {
        if (data.component === 'comment') {
          const commentLevel = this.knowCommentLevel(data.parentId);
          obj.level = commentLevel;
        } else {
          obj.level = this.knowCommentLevel(data.componentId);
        }
      }
      this.trggerSend(obj);
    }
  }

  async trggerSend(obj) { // TODO improve handle without setTimeout
    await virtualclass.userInteractivity.send(obj);

    if (virtualclass.vutil.checkUserRole() && obj.component === 'answer') {
      const dataMark = {
        event: 'markAnswer',
        component: 'answer',
        componentId: obj.componentId,
        parentId: obj.parent,
        text: undefined,
        action: undefined,
      };
      obj.action = 'markAnswer';
      setTimeout(() => {
        virtualclass.userInteractivity.event.execute(dataMark);
      }, 1000);
    }
  }

  moreControls(ev) {
    let elemId;
    let moreControlElemOpen;
    const moreControlElemClose = document.querySelector('#askQuestion .moreControls .item.open');
    if (moreControlElemClose) {
      moreControlElemClose.classList.remove('open');
      moreControlElemClose.classList.add('close');
    } else if (ev.target.firstChild && ev.target.firstChild.dataset != null) {
      elemId = ev.target.firstChild.dataset.componentId;
      moreControlElemOpen = document.querySelector(`#${elemId} .moreControls .item.close`);
      if (moreControlElemOpen && ev.target.dataset.event === 'moreControls') {
        moreControlElemOpen.classList.remove('close');
        moreControlElemOpen.classList.add('open');
      }
    }
  }

  markAnswer(data) {
    const selector = `#askQuestion #${data.parentId} .answers .answer[data-mark-answer="marked"]`;
    const markedAnsElem = document.querySelector(selector);
    const checkElemUnmark = document.querySelector(`#askQuestion #${data.parentId} .answers .moreControls .mark`);
    const str = virtualclass.lang.getString('markAnswerUnmark');
    if (markedAnsElem && checkElemUnmark && checkElemUnmark.innerHTML === 'Unmark'
      && checkElemUnmark.parentNode.dataset.componentId !== data.componentId) {
      virtualclass.view.createAskQuestionMsg(str, 'msgContainer', 'loading');
      return;
    }
    const obj = virtualclass.userInteractivity.generateData({
      component: data.component,
      action: data.event,
      uname: virtualclass.uInfo.userobj.name,
      componentId: data.componentId,
      parent: data.parentId,
    });
    virtualclass.userInteractivity.send(obj);
  }

  cancel(data) {
    const userInteractive = virtualclass.userInteractivity;
    const allContext = virtualclass.userInteractivity.context;
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
      const mainContent = allContext[userInteractive.currentContext][data.component][data.componentId].content;
      userInteractive.questionAnswer.separatedContent({
        componentId: data.componentId, content: mainContent, action: data.event,
      });
    } else {
      userInteractive.rendererObj.removeWriteContainer();
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
    document.querySelector(`#${data.componentId} .container`).scrollIntoView();
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
    virtualclass.userInteractivity.note.triggerNavigate(data.event);
  }

  previous(data) {
    virtualclass.userInteractivity.note.triggerNavigate(data.event);
  }

  execute(data){
    this[data.event].call(this, data);
  }
}
