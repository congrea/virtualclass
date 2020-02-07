class QuestionAnswer {
  elapsedComponentTime(data) {
    const currentEditTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    const previousTime = ((data.componentId).split(`${data.component}-${virtualclass.gObj.orginalUserId}-`))[1];
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
      return { content, moreContent };
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

  addHighLightNewActual() {  //  question part
    document.getElementById('congAskQuestion').classList.add('highlight-new-question');
  }

  removeHighlight() {  //  question part
    const element = document.getElementById('congAskQuestion');
    if (element.classList.contains('highlight-new-question')) {
      element.classList.remove('highlight-new-question');
    }
  }
}
