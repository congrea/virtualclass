/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
class BasicOperation {
  constructor () {
    this.events = ['edit', 'delete', 'upvote', 'markAnswer', 'moreControls', 'reply', 'navigation',
      'createInput', 'save', 'cancel', 'navigation', 'more', 'less', 'clearall'];
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

    if (data.component === 'note') {
      console.log('send note data ', data);
      virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collectionMark).doc(data.id).set(data).then(() => {
        console.log('ask question write, Document successfully written! ', data);
      })
        .catch((error) => {
          console.error('ask question write, Error writing document: ', error);
        });
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
        } else if (event === 'edit' || event === 'markAnswer' || event === 'delete') {
          parentId = (parent.dataset.parent) ? parent.dataset.parent : null;
        }
      }

      if (event === 'save') {
        if (component === 'note') {
          text = target.value;
          action = 'create';
        } else {
          if (parent.previousSibling != null && parent.previousSibling.value != null
            && parent.previousSibling.value !== '') {
            text = parent.previousSibling.value;
          } else {
            alert('Please enter text here'); // TODO add popup for display msg
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
      }
      data = {
        event, component, componentId, text, action, parentId
      };
      this.execute(data);
    }
  }

  execute (data) {
    const contextData = virtualclass.askQuestion.context;
    const currentContext = virtualclass.askQuestion.currentContext;
    let component;
    if (data.event === 'reply') {
      if (data.component === 'question' || data.component === 'answer') {
        component = data.component === 'question' ? 'answer' : 'comment';
      } else {
        component = data.component;
      }
      data = {
        component: component,
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
      const userId = (data.componentId).split('-')[1];
      if (userId === virtualclass.uInfo.userid || roles.hasControls()) {
        let text;
        const currentEditTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
        const previousTime = ((data.componentId).split(`${data.component}-${virtualclass.uInfo.userid}-`))[1];
        const getActualTime = Math.floor((currentEditTime - (+previousTime)) / 60);

        if (!roles.hasControls()) {
          if (getActualTime > 30 || contextData[currentContext][data.component][data.componentId].children.length > 0
            || contextData[currentContext][data.component][data.componentId].upvote > 0) {
            if (getActualTime > 30) {
              // TODO add popup
            }
            return;
          }
        }

        const footerElem = document.querySelector(`#${data.componentId} .footer`);
        if (footerElem && footerElem.classList.contains('show')) {
          footerElem.classList.remove('show');
          footerElem.classList.add('hide');
        }
        const content = (document.querySelector(`#${data.componentId} .content p`).innerText).replace('...more', '');
        let moreContent = document.querySelector(`#${data.componentId} .content .morecontent`);
        if (moreContent) {
          moreContent = moreContent.innerHTML;
          text = content + moreContent;
        } else {
          text = content;
        }

        const component = document.querySelector(`#${data.componentId} .content p`).dataset.component;
        data = this.generateData({
          action: 'renderer',
          type: 'input',
          content: text,
          component: component,
          componentId: data.componentId,
          parent: data.component === 'question' ? null : null,
        });
      } else {
        return;
      }
    } else if (data.event === 'delete') {
      const moreControlElem = document.querySelector(`#${data.componentId} .moreControls .item`);
      if (moreControlElem.classList.contains('open')) {
        moreControlElem.classList.remove('open');
        moreControlElem.classList.add('close');
      }
      const userId = (data.componentId).split('-')[1];
      if (userId === virtualclass.uInfo.userid || roles.hasControls()) {
        const currentEditTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
        const previousTime = ((data.componentId).split(`${data.component}-${virtualclass.uInfo.userid}-`))[1];
        const getActualTime = Math.floor((currentEditTime - (+previousTime)) / 60);
        if (!roles.hasControls()) {
          if (getActualTime > 30 || contextData[currentContext][data.component][data.componentId].children.length > 0
            || contextData[currentContext][data.component][data.componentId].upvote > 0) {
            if (getActualTime > 30) {
              // TODO add popup
            }
            return;
          }
        }
        data = this.generateData({
          component: data.component,
          action: data.event,
          componentId: data.componentId,
          parent: data.parentId,
        });
        this.send(data);
      } else {
        return;
      }
    } else if (data.event === 'upvote') {
      const obj = this.generateData({ component: data.component, action: data.event });
      const upvoteCount = document.querySelector(`#${data.componentId} .upVote .total`).innerHTML;
      if (upvoteCount === '0') {
        obj.upvote = 1;
        obj.componentId = data.componentId;
        obj.content = virtualclass.askQuestion.context[obj.context][data.component][data.componentId].content;
        virtualclass.askQuestion.context[obj.context][data.component].send(obj);
        virtualclass.askQuestion.firstid = obj.id;
      } else {
        virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(virtualclass.askQuestion.firstid).update('upvote', firebase.firestore.FieldValue.increment(1));
        this.upvote(data);// TODO
      }
    } else if (data.event === 'moreControls') {
      data.action = 'moreControls';
    } else if (data.event === 'save') {
      if (data.component === 'note') {
        const obj = this.generateData({
          component: data.component,
          content: data.text,
          type: 'noteWithContent',
          action: data.action,
          uname: virtualclass.uInfo.userobj.name,
          componentId: data.componentId,
          parent: data.parentId,
        });
        this.send(obj);
      } else {
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
        if (roles.hasControls() && data.component === 'answer') {
          obj.action = 'markAnswer';
          this.send(obj); // todo, why we are seding more than one time data
        }
      }

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
        const mainContent = contextData[currentContext][data.component][data.componentId].content;
        this.separatedContent({ componentId: data.componentId, content: mainContent, action: data.event });
      } else {
        const text = document.querySelector('#writeContent');
        if (text) {
          text.remove();
        }
      }
    } else if (data.event === 'navigation') {
      const navigateComponent = (data.component === 'question') ? 'answers' : 'comments';
      const ElemNavigate = document.querySelector(`#${data.componentId} .${navigateComponent}`);
      if (ElemNavigate.classList.contains('open')) {
        ElemNavigate.classList.remove('open');
        ElemNavigate.classList.add('close');
      } else {
        ElemNavigate.classList.remove('close');
        ElemNavigate.classList.add('open');
      }
    } else if (data.event === 'more' || data.event === 'less') {
      const moreText = document.querySelector(`#${data.componentId} .morecontent`);
      const action = data.event === 'more' ? 'less' : 'more';
      const btn = document.querySelector(`#${data.componentId} .content .btn`);
      const str = action === 'more' ? '...more' : 'less';
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
    } else if (data.event === 'clearall') {

    }

    if (data.event !== 'save' && data.event !== 'delete' && data.event !== 'upvote'
      && data.event !== 'markAnswer' && data.event !== 'cancel' && data.event !== 'navigation'
      && data.event !== 'more' && data.event !== 'less') { // TODO
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
          inputAction.addEventListener('input', this.autosize.bind(this));
        }
      }
    } else if (data.type === 'contentBox') {
      const text = this.separatedContent(data);
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
          document.querySelector(`#${data.parent} .comments`).insertAdjacentHTML('beforeend', ansTemp);
        }
      }
      this.displayMore(data);

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
          }
        }
      }
      if (data.component === 'question') {
        const qnElem = document.querySelector(`#${data.id}.question`);
        if (qnElem) {
          qnElem.addEventListener('click', (ev) => {
            this.handler(ev);
          });
        }
      }
    } else if (data.type === 'noteContainer') {
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
    } else if (data.type === 'noteWithContent') {
      let noteTextContainer = document.querySelector(`#noteContainer [data-context~=${data.context}] .content`);
      if (!noteTextContainer) {
        // virtualclass.askQuestion.renderer({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });
        // virtualclass.askQuestion.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });
        virtualclass.askQuestion.performWithPassData({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });

        noteTextContainer = document.querySelector(`#noteContainer [data-context~=${data.context}] .content`);
      }
      noteTextContainer.value = data.content;
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

    const noteNavigationContainer = document.getElementById('noteNavigationContainer');
    noteNavigationContainer.addEventListener('click', this.noteHandler2.bind(this));
  }

  noteHandler2(ev) {
    if (ev) {
      this.handler(ev);
    }
  }

  // TODO, let see how can this be improve more
  noteHandler(ev, eventType) {
    if (eventType) {
      this.handler(ev);
    } else {
      if (this.sendToDatabaseTime) {
        clearTimeout(this.sendToDatabaseTime);
      }
      const self = this;
      this.sendToDatabaseTime = setTimeout(() => {
        self.handler(ev); // send note to database
      }, 700);
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
      question = { id: data.id, content: data.content, children: [], status, parent: null, componentId: data.id, upvote: data.upvote };
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
    if (Object.prototype.hasOwnProperty.call(contextObj[data.context][component], data.parent) && data.component !== 'question') {
      const children = contextObj[data.context][component][data.parent].children;
      if (data.component === 'answer' || data.component === 'comment') {
        if (status === 'editable') {
          children.push(data.componentId);
        } else {
          children.splice(children.indexOf(data.componentId), 1);
        }
        if (!roles.hasControls()) {
          const moreControlElem = document.querySelector(`#${data.parent} .moreControls`);
          if (moreControlElem && moreControlElem.classList.contains('disable')) {
            moreControlElem.classList.remove('disable');
          } else {
            moreControlElem.classList.add('disable');
          }
        }
        const parentElem = document.querySelector(`#${data.parent} .navigation .total`);
        parentElem.innerHTML = contextObj[data.context][component][data.parent].children.length;
      }
    }
  }

  edit(data) {
    this.separatedContent(data);
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
        document.querySelector(`#${data.componentId} .moreControls`).classList.add('disable');
      }
      this.updateStatus(data, 'upvote');
    } else {
      // TODO
      document.querySelector(`#${data.componentId} .upVote`).dataset.upvote = 'upvoted';
    }
  }

  markAnswer(data) {
    const markElem = document.querySelector(`#${data.componentId}`);
    const markParentElem = document.querySelector(`#${data.parent}`);
    if (markParentElem && markElem && !markParentElem.dataset.markAnswer) {
      markElem.dataset.markAnswer = 'marked';
      markParentElem.dataset.markAnswer = 'marked';
    }
  }

  autosize(ev) {
    ev.target.style.cssText = 'height:auto; padding:0';
    ev.target.style.cssText = 'height:' + ev.target.scrollHeight + 'px';
  }

  displayMore(data) {
    const componentId = (data.action === 'create') ? data.id : data.componentId;
    const btn = document.querySelector(`#${componentId} .content p .btn`);
    if (data.content.length > 120 && btn) {
      if (btn.classList.contains('close')) {
        btn.classList.remove('close');
        btn.classList.add('open');
      }
    }
  }

  separatedContent(data) {
    let content;
    let moreContent;
    if (data.content.length > 120) {
      content = data.content.slice(0, 120);
      moreContent = data.content.slice(120, data.content.length);
    } else {
      content = data.content;
    }
    if (data.action === 'edit' || data.action === 'cancel') {
      const getContentElem = document.querySelector(`#${data.componentId} .content p`);
      const ellipsisTemp = virtualclass.getTemplate('ellipsisText', 'askQuestion');
      getContentElem.innerHTML = content;
      if (data.content.length > 120) {
        const ellipsisTextTemp = ellipsisTemp({ morecontent: moreContent }); // TODO use this template in question, answer, comment
        document.querySelector(`#${data.componentId} .content p`).insertAdjacentHTML('beforeend', ellipsisTextTemp);
      }
      this.displayMore(data);
    } else if (data.action === 'create') {
      return { content: content, moreContent: moreContent};
    }
  }
}

// This class is responsible to render HTML of each component of Ask Question

class QaNote extends BasicOperation { }

class QAquestion extends BasicOperation {}

class QAanswer extends BasicOperation {}

class QAcomment extends BasicOperation {}


class QAcontext {
  constructor() {
    this.actions = [];
    this.question = new QAquestion();
    this.answer = new QAanswer();
    this.comment = new QAcomment();
    this.note = new QaNote();
    // this.mark = new QAmark();
  }
}

class AskQuestionEngine {
  constructor() {
    this.queue = {};
    this.queue.note = [];
    this.queue.question = [];
    this.context = {};
    this.firstRealTime = true;
    this.initialize = false;
  }

  performWithQueue(data) {
    this.makeQueue(data);
    const type = (data.component === 'note' ? data.component : 'question');
    this.perform(data.context, type);
  }

  makeQueue(data) {
    const type = (data.component === 'note') ? data.component : 'question';
    if (!this.queue[type][data.context]) {
      this.queue[type][data.context] = [];
    }
    this.queue[type][data.context].push(data);
  }

  perform(context, type) {
    while (this.queue[type][context].length > 0) {
      const data = this.queue[type][context].shift();
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

  performWithPassData(data) {
    this.context[data.context][data.component][data.action].call(this.context[data.context][data.component], data);
  }
}

class AskQuestion extends AskQuestionEngine {
  init() {
    if (this.initialize) return;
    this.initialize = true;
    console.log('ask question init');
    this.renderer();
    this.allMarks = {};
    // this.qaNote = new QaNote();
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

    const type = this.getActiveTab();
    if (type && this.queue[type] && this.queue[type][this.currentContext] && this.queue[type][this.currentContext].length > 0) {
      this.perform(this.currentContext, type);
    } else if (type === 'note') {
      // Create blank structure for note
      this.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: virtualclass.askQuestion.currentContext });
    }

    // const noteContainerActive = document.querySelector('#noteContainer.active');
    // if (this.context[contextName] && this.initFirebase && noteContainerActive) {
    //   this.context[contextName].note.renderNote(this.currentContext);
    // }

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
    if ((data.component === 'question' || data.component === 'note' || data.component === 'bookmark')) {
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
            if (askQuestion.classList.contains('active') && data.context === virtualclass.askQuestion.currentContext) {
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
    // this.db.collection(this.collection).get().then((snapshot) => {
    //   // TODO, we have to store the inital data from attachHandlerForRealTimeUpdate
    //   snapshot.docs.forEach((doc) => {
    //     this.makeQueue(doc.data());
    //     // this.context[data.context].actions.push(data);
    //   });
    // }).catch((error) => {
    //   console.log('ask question read error ', error);
    // });
    console.log('===> trigger initial data');
    const self = this;
    this.db.collection(this.collectionMark).get().then((snapshot) => {
      // TODO, we have to store the inital data from attachHandlerForRealTimeUpdate
      self.initCollectionMark = true;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const currentActiveTab = self.getActiveTab();
        if (currentActiveTab === 'note' && self.currentContext === data.context) {
          self.performWithQueue(data);
        } else {
          this.makeQueue(data);
        }
        if (virtualclass.isPlayMode) this.buildAllMarksStatus(data);
      });

      // const loading = document.querySelector();
    }).catch((error) => {
      console.log('ask question read error ', error);
    });
  }

  renderer(data) {
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
        this.initFirebaseOperatoin();
        this.renderMainContainer(elem.currentTarget);
      });

      const addQuestion = document.querySelector('#virtualclassCont.congrea .addQuestion-icon');
      if (addQuestion) {
        addQuestion.addEventListener('click', () => {
          this.performWithQueue({ component: 'question', action: 'renderer', type: 'input', context: virtualclass.askQuestion.currentContext });
        });
      }

      const note = document.getElementById('virtualclassnote');
      note.addEventListener('click', (event) => {
        // this.handler.bind(this)
        this.triggerInitFirebaseOperation();
        virtualclass.rightbar.handleDisplayBottomRightBar(event.currentTarget);
        this.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: virtualclass.askQuestion.currentContext });
      });
    }
  }

  async triggerInitFirebaseOperation() {
    await this.initFirebaseOperatoin();
    if (this.initFirebase) { this.loadInitialDataMark(); }
    const loadingActive = document.querySelector('#noteContainer .loading.active');
    if (loadingActive) {
      loadingActive.classList.remove('active');
    }

    const contentActive = document.querySelector('#noteContainer .contentContainer');
    if (contentActive) {
      contentActive.classList.add('active');
    }
  }

  renderMainContainer(elem) {
    virtualclass.rightbar.handleDisplayRightBar('#askQuestion');
    virtualclass.rightbar.handleDisplayBottomRightBar(elem);
    if (this.queue.question[this.currentContext] && this.queue.question[this.currentContext].length > 0) {
      this.perform(this.currentContext, 'question');
    }
  }

  getCurrentQuestions() {
    return this.context[virtualclass.askQuestion.currentContext].question;
  }
}
