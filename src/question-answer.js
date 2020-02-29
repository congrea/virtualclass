class QuestionAnswer {
  elapsedComponentTime(data) {
    const currentEditTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    const previousTime = ((data.componentId).split(`${data.component}-${virtualclass.gObj.orginalUserId}-`))[1];
    return Math.floor((currentEditTime - (+previousTime)) / 60);
  }

  separatedContent(data) {
    let writeContent;
    let moreContent;
    let content;
    let obj;
    if (data.content.length > 128) {
      writeContent = data.content.slice(0, 128);
      moreContent = data.content.slice(128, data.content.length);
    } else {
      writeContent = data.content;
    }
    if (data.action === 'edit' || data.action === 'cancel') {
      const getContentElem = document.querySelector(`#${data.componentId} .content p`);
      const ellipsisTemp = virtualclass.getTemplate('ellipsisText', 'askQuestion');
      if (getContentElem) {
        getContentElem.innerHTML = writeContent;
      }
      if (data.content.length > 128) {
        // TODO use this template in question, answer, comment
        const ellipsisTextTemp = ellipsisTemp({ morecontent: moreContent });
        document.querySelector(`#${data.componentId} .content p`).insertAdjacentHTML('beforeend', ellipsisTextTemp);
      }
      this.displayMore(data);
    } else if (data.action === 'create') {
      content = writeContent;
      obj = { content, moreContent };
      return obj;
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

  addHighLight(data) { //  question part
    if (data.component === 'question' && (data.action === 'create' || data.action === 'edit')
      && (virtualclass.userInteractivity.getActiveTab() !== 'question')
    ) {
      this.addHighLightNewActual();
    }
  }

  addHighLightNewActual() { // question part
    document.getElementById('congAskQuestion').classList.add('highlight-new-question');
  }

  removeHighlight() { // question part
    const element = document.getElementById('congAskQuestion');
    if (element.classList.contains('highlight-new-question')) {
      element.classList.remove('highlight-new-question');
    }
  }

  viewAllQuestion(ev) { // Question part
    this.triggerPause();
    let selector;
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
          for (const context in virtualclass.userInteractivity.queue.question) {
            if (!this.context[context]) {
              this.context[context] = new QAcontext();
            }
            this.triggerPerform(context);
          }
        }
        this.viewAllTriggered = true;
        this.viewAllMode = true;
      } else {
        virtualclass.userInteractivity.currentContext = virtualclass.userInteractivity.readyContextActual();
        if (rightPanel) { rightPanel.classList.remove('viewAllMode'); }
        askQuestion.classList.remove('viewAll');
        viewAllQuestion.dataset.viewall = 'enable';
        selector = `#askQuestion .context[data-context~=${virtualclass.userInteractivity.currentContext}]`;
        const currentContextElement = document.querySelector(selector);
        if (currentContextElement) currentContextElement.classList.add('current');
        this.viewAllMode = false;
      }
    }
  }
}
