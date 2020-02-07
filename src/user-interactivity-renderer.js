class UserInteractivityRenderer { // Main Part
  mainInterface(data) { // Main Part
    if (data && data.component === 'note') {
      // this.qaNote.renderMainContainer();
    } else {
      // TODO, this code needs to be simplified
      // const toggle = document.querySelector('#virtualclassCont.congrea #congHr');
      const toggle = document.querySelector('#virtualclassCont.congrea #congAskQuestion');
      const context = {};
      const qaTemp = virtualclass.getTemplate('askQuestionMain', 'askQuestion');
      const qtemp = qaTemp(context);
      document.querySelector('#rightSubContainer').insertAdjacentHTML('beforeend', qtemp);
      if (!virtualclass.vutil.checkUserRole()) {
        virtualclass.settings.answer(virtualclass.settings.info.answer);
        virtualclass.settings.comment(virtualclass.settings.info.comment);
        virtualclass.settings.upvote(virtualclass.settings.info.upvote);
        virtualclass.settings.askQuestion(virtualclass.settings.info.askQuestion);
        virtualclass.settings.markNotes(virtualclass.settings.info.markNotes);
      }

      toggle.addEventListener('click', (elem) => {
        virtualclass.userInteractivity.initFirebaseOperatoin();
        virtualclass.userInteractivity.renderMainContainer(elem.currentTarget);
        // if (toggle.classList.contains('highlight-new-question')) {
        //   toggle.classList.remove('highlight-new-question');
        // }
        virtualclass.userInteractivity.rendererObj.removeHighlightQuestion();
      });

      const addQuestion = document.querySelector('#virtualclassCont.congrea .addQuestion-icon');
      if (addQuestion) {
        addQuestion.addEventListener('click', () => {
          virtualclass.userInteractivity.engine.performWithQueue({ component: 'question', action: 'renderer', type: 'input', context: virtualclass.userInteractivity.currentContext });
        });
      }

      const note = document.getElementById('virtualclassnote');
      note.addEventListener('click', (event) => {
        // this.handler.bind(this)
        virtualclass.userInteractivity.triggerInitFirebaseOperation('note');
        virtualclass.rightbar.handleDisplayBottomRightBar(event.currentTarget);
        virtualclass.userInteractivity.engine.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: virtualclass.userInteractivity.currentContext });
        virtualclass.userInteractivity.note.updateNavigateNumbers(virtualclass.userInteractivity.currentContext);
      });
    }
  }

  input(data) { // Main Part
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
      if (data.userId === virtualclass.gObj.orginalUserId) {
        document.querySelector(`#${data.componentId} .content p`).innerHTML = '';
        document.querySelector(`#${data.componentId} .content p`).insertAdjacentHTML('beforeend', userInputTemplate);
        text = document.querySelector('#writeContent .text');
        if (text) {
          text.innerHTML = data.content;
          this.autosize({target: text});
        }
      }
    } else {
      if (data.component === 'question') {
        document.querySelector(insertId).insertAdjacentHTML('beforeend', userInputTemplate);
      } else {
        document.querySelector(`${insertId} .${data.component}s`).insertAdjacentHTML('beforebegin', userInputTemplate);
        const bounding = document.querySelector(`#${data.parent}`).getBoundingClientRect();
        if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
          && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
          // console.log('In the viewport!'); TODO
        } else {
          document.querySelector(`#${data.parent}`).scrollIntoView();
        }
      }
    }

    const inputAction = document.querySelector('#writeContent');
    if (data.component === 'question') {
      if (inputAction) {
        inputAction.addEventListener('click', virtualclass.userInteractivity.handler.bind(virtualclass.userInteractivity));
      }
    }
    inputAction.addEventListener('input', virtualclass.userInteractivity.userInputHandler.bind(this, data.component));
    const textArea = document.querySelector('#writeContent .text')
    textArea.addEventListener('focus', virtualclass.vutil.inputFocusHandler);
    textArea.addEventListener('focusout', virtualclass.vutil.inputFocusOutHandler);
  }

  contentBox(data) { // Main Part
    const text = virtualclass.userInteractivity.questionAnswer.separatedContent(data);
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
        hasControl: virtualclass.vutil.checkUserRole(),
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
    virtualclass.userInteractivity.questionAnswer.displayMore(data);
    if (+(data.userId) === +(virtualclass.gObj.orginalUserId)) {
      if (data.component === 'note') {
        this.renderNote(data.context);
        const textArea = document.querySelector(`#noteContainer .context[data-context="${data.context}"] textarea.content`);
        textArea.value = data.content;
      } else if (data.component !== 'comment') {
        document.querySelector(`#${data.id} .upVote`).dataset.upvote = 'upvoted';
      }
      if (!virtualclass.vutil.checkUserRole()) {
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
          virtualclass.userInteractivity.handler(ev);
        });
      }
    }
  }


  renderNote(currentContext) { // Note Part
    // let attachFunction = false;
    let contextDivElement = document.querySelector(`#noteContainer .context[data-context="${currentContext}"]`);
    if (contextDivElement === null) {
      const contentArea = virtualclass.getTemplate('note-content-area', 'askQuestion');
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
    textArea.addEventListener('focus', virtualclass.vutil.inputFocusHandler.bind(this));
    textArea.addEventListener('focusout', virtualclass.vutil.inputFocusOutHandler.bind(this));

    const noteNavigationContainer = document.getElementById('noteNavigationContainer');
    if (!virtualclass.userInteractivity.note.attachImmediateHandler) {
      virtualclass.userInteractivity.note.attachImmediateHandler = true;
      noteNavigationContainer.addEventListener('click', this.noteHandlerImmediate.bind(this));
    }
  }

  noteContainer(data) { // Note Part
    let context;
    if (data) {
      context = data.context;
    } else {
      context = virtualclass.userInteractivity.currentContext;
    }

    let note = document.getElementById('noteContainer');
    if (note == null) {
      const noteMainContainer = virtualclass.getTemplate('note', 'askQuestion');
      const noteMainContainerHtml = noteMainContainer({ context });
      document.querySelector('#rightSubContainer').insertAdjacentHTML('beforeend', noteMainContainerHtml);
    }

    this.renderNote(data.context);

    const activeElement = document.querySelector('#rightSubContainer .active');
    if (activeElement) {
      activeElement.classList.remove('active');
      // activeElement.classList.add('deactive');
    }
    note = document.getElementById('noteContainer');
    note.classList.add('active');
  }

  noteWithContent(data) { // Note part
    let noteTextContainer = document.querySelector(`#noteContainer [data-context~=${data.context}] .content`);
    if (!noteTextContainer) {
      // virtualclass.userInteractivity.renderer({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });
      // virtualclass.userInteractivity.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });
      virtualclass.userInteractivity.engine.performWithPassData({ component: 'note', action: 'renderer', type: 'noteContainer', context: data.context });

      noteTextContainer = document.querySelector(`#noteContainer [data-context~=${data.context}] .content`);
    }
    noteTextContainer.value = data.content;
  }

  noteHandlerImmediate(ev) { // Note part
    console.log('====> handler ', ev.target.className);
    virtualclass.userInteractivity.handler(ev);
  }

  // TODO, let see how can this be improve more
  noteHandler(ev, eventType) { // Note part
    if (eventType) {
      this.handler(ev);
    } else {
      this.noteEvent = ev;
      if (this.sendToDatabaseTime) {
        clearTimeout(this.sendToDatabaseTime);
      }
      this.sendToDatabaseTime = setTimeout(() => {
        virtualclass.userInteractivity.note.handleQueue(virtualclass.userInteractivity.currentContext);
        virtualclass.userInteractivity.handler(ev); // send note to database
        delete this.noteEvent;
      }, 400);
    }
  }

  autosize(ev) { // main part
    setTimeout(() => {
      ev.target.style.cssText = 'height:auto; padding:0';
      ev.target.style.cssText = 'height:' + ev.target.scrollHeight + 'px';
    }, 1000);
  }

  bookmark(data) { // book mark
    const bookmark = document.querySelector(`#bookmark .bookmarks[data-context~=${data.context}]`);
    if (bookmark) {
      bookmark.dataset.value = data.content;
    }
  }

  removeWriteContainer() { // main part
    const text = document.querySelector('#writeContent');
    if (text) {
      text.remove();
    }
  }

  addHighLightNewQuestion(data) { //  question part
    if (data.component === 'question' && (data.action === 'create' || data.action === 'edit')
      && (virtualclass.userInteractivity.getActiveTab() !== 'question')
    ) {
      this.addHighLightNewQuestionActual();
    }
  }
  addHighLightNewQuestionActual() {  //  question part
    document.getElementById('congAskQuestion').classList.add('highlight-new-question');
  }
  removeHighlightQuestion() {  //  question part
    const element = document.getElementById('congAskQuestion');
    if (element.classList.contains('highlight-new-question')) {
      element.classList.remove('highlight-new-question');
    }
  }
}
