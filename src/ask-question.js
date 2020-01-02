/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
// This class is responsible to render HTML of each component of Ask Question

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
        }
        data = { event, component, componentId, parentId };
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
    }
    if (data.event !== 'save' && data.event !== 'delete' && data.event !== 'upvote' && data.event !== 'markAnswer') {
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
        const context = { id: data.id, itemId: data.componentId, userName: data.uname, hasControl: roles.hasControls(), content: data.content };
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

  // inputHandler(ev) {
  //   console.log('Add input handler');
  //   if (ev.keyCode === 13 && ev.target.parentNode.parentNode.id === 'askQuestion') {
  //     const data = this.generateData({
  //       component: 'question',
  //       content: ev.target.value,
  //       type: 'contentBox',
  //       action: 'create',
  //       uname: virtualclass.uInfo.userobj.name,
  //     });
  //     this.send(data);
  //   } else if (ev.keyCode === 13 && ev.target.parentNode.parentNode.id !== 'askQuestion') {
  //     const data = this.generateData({
  //       component: 'question',
  //       content: ev.target.value,
  //       type: 'contentBox',
  //       action: 'edit',
  //       uname: virtualclass.uInfo.userobj.name,
  //       componentId: ev.target.parentNode.parentNode.dataset.componentId,
  //     });
  //     this.send(data);
  //   }
  // }

  // updateQn(ev) {
  //   const text = document.querySelector(`#${ev.target.parentNode.dataset.component} .content p`).innerHTML;
  //   const data = this.generateData({
  //     component: 'question',
  //     action: 'renderer',
  //     type: 'input',
  //     content: text,
  //     componentId: ev.target.parentNode.dataset.component,
  //     parent: null,
  //   });
  //   this.send(data);
  // }

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
    if (status === 'delete') {
      delete virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId];
    } else {
      let question = data;
      if (status === 'create') {
        question = { id: data.id, content: data.content, children: [], status, parent: null, componentId: data.id };
      } else if (status === 'edit') {
        question.content = data.txt;
      }
      question.status = status;
      virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId] = question;
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
    markElem.dataset.markAnswer = 'marked';
  }
}


class QAquestion extends BasicOperation {
  // create(data) {
  //   const textTemp = document.querySelector('#writeContent');
  //   if (textTemp) {
  //     textTemp.remove();
  //   }
  //   data.componentId = data.id;
  //   this.renderer(data);
  //   // const question = { id: data.id, content: data.content, children: [], status: data.action, parent: null };
  //   this.updateStatus(data, 'editable');
  //
  //   // TODO, this should not be here
  //   // virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][question.id] = question;
  // }

  // edit(data) {
  //   const textTemp = document.querySelector('#writeContent');
  //   if (textTemp) {
  //     textTemp.remove();
  //   }
  //   const chkContextElem = document.querySelector(`.context[data-context~=${data.context}]`);
  //   if (chkContextElem) {
  //     if (data.context === chkContextElem.dataset.context) {
  //       if (data.action === 'edit') {
  //         const questionTemp = document.querySelector(`[data-context~=${data.context}] #${data.componentId} .content p`);
  //         questionTemp.innerHTML = data.content;
  //       }
  //     }
  //   }
  //   this.updateStatus(data, 'edited');
  // }

  // delete(data) {
  //   console.log('question deleted ', data);
  //   // const elem = document.querySelector(`[data-context~=${data.context}] #${data.componentId}`);
  //   const elem = document.querySelector(`#${data.componentId}`);
  //   // TODO, we have to remove answers and related comments from inline structure
  //   if (elem) {
  //     elem.remove();
  //     this.updateStatus(data, 'delete');
  //   }
  //   // TODO, will have to delete all the answer children from here
  // }

  // updateStatus(data, status) {
  //   if (status === 'delete') {
  //     delete virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId];
  //   } else {
  //     let question = data;
  //     if (status === 'create') {
  //       question = { id: data.id, content: data.content, children: [], status, parent: null, componentId: data.id };
  //     } else if (status === 'edit') {
  //       question.content = data.txt;
  //     }
  //     question.status = status;
  //     virtualclass.askQuestion.context[virtualclass.askQuestion.currentContext][data.component][data.componentId] = question;
  //   }
  // }

  // upvote(data) {
  //   if (data.upvote) {
  //     if (data.upvote === 1) virtualclass.askQuestion.firstid = data.id;
  //     document.querySelector(`#${data.parent} .upVote .total`).innerHTML = data.upvote;
  //     if (data.userId === virtualclass.uInfo.userid) {
  //       document.querySelector(`#${data.parent} .upVote`).dataset.upvote = 'upvoted';
  //     }
  //   }
  // }
  //
  // renderer(data) {
  //   console.log('Create ', data);
  //   if (data.type === 'input') {
  //     const text = document.querySelector('#writeContent .text');
  //     if (text) {
  //       return;
  //     }
  //     const context = {};
  //     const qaPostTemp = virtualclass.getTemplate('qaPost', 'askQuestion');
  //     const qaTemp = qaPostTemp(context);
  //     if (typeof data.content !== 'undefined' && typeof data.itemId !== 'undefined') {
  //       if (data.userId === virtualclass.gObj.uid) {
  //         document.querySelector(`#${data.itemId} .content p`).innerHTML = '';
  //         document.querySelector(`#${data.itemId} .content p`).insertAdjacentHTML('beforeend', qaTemp);
  //         const text = document.querySelector('#writeContent .text');
  //         text.innerHTML = data.content;
  //         if (text) {
  //           text.addEventListener('keyup', this.inputHandler.bind(this));
  //         }
  //       }
  //     } else {
  //       document.querySelector('#askQuestion').insertAdjacentHTML('beforeend', qaTemp);
  //       const text = document.querySelector('#writeContent .text');
  //       if (text) {
  //         text.addEventListener('keyup', this.inputHandler.bind(this));
  //       }
  //     }
  //   } else if (data.type === 'contentBox') {
  //     const chkContextElem = document.querySelector(`.context[data-context~=${data.context}]`);
  //     if (chkContextElem) {
  //       const qaTemp = virtualclass.getTemplate('question', 'askQuestion');
  //       const qtemp = qaTemp({ id: data.id, userName: data.uname });
  //       document.querySelector(`[data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', qtemp);
  //       document.querySelector(`#${data.id} .content p`).innerHTML = data.content;
  //     } else {
  //       const getContextTemp = virtualclass.getTemplate('context', 'askQuestion');
  //       const cTemp = getContextTemp({ context: data.context });
  //       document.querySelector('#askQuestion .container').insertAdjacentHTML('beforeend', cTemp);
  //       const qaTemp = virtualclass.getTemplate('question', 'askQuestion');
  //       const qtemp = qaTemp({ id: data.id, userName: data.uname });
  //       document.querySelector(`[data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', qtemp);
  //       document.querySelector(`[data-context~=${data.context}]`).classList.add('current');
  //       document.querySelector(`#${data.id} .content p`).innerHTML = data.content;
  //     }
  //     if (data.userId === virtualclass.uInfo.userid) {
  //       document.querySelector(`#${data.id} .upVote`).dataset.upvote = 'upvoted';
  //     }
  //
  //     const qnElem = document.querySelector(`#${data.id}.question`);
  //     if (qnElem) {
  //       qnElem.addEventListener('click', (ev) => {
  //         this.handler(ev);
  //       });
  //     }
  //   }
  // }
  //
  // inputHandler(ev) {
  //   console.log('Add input handler');
  //   if (ev.keyCode === 13 && ev.target.parentNode.parentNode.id === 'askQuestion') {
  //     const data = this.generateData({
  //       component: 'question',
  //       text: ev.target.value,
  //       type: 'contentBox',
  //       action: 'create',
  //       uname: virtualclass.uInfo.userobj.name,
  //     });
  //     this.send(data);
  //   } else if (ev.keyCode === 13 && ev.target.parentNode.parentNode.id !== 'askQuestion') {
  //     const data = this.generateData({
  //       component: 'question',
  //       text: ev.target.value,
  //       type: 'contentBox',
  //       action: 'edit',
  //       uname: virtualclass.uInfo.userobj.name,
  //       itemId: ev.target.parentNode.parentNode.dataset.component,
  //     });
  //     this.send(data);
  //   }
  // }

  // updateQn(ev) {
  //   const text = document.querySelector(`#${ev.target.parentNode.dataset.component} .content p`).innerHTML;
  //   const data = this.generateData({
  //     component: 'question',
  //     action: 'renderer',
  //     type: 'input',
  //     content: text,
  //     componentId: ev.target.parentNode.dataset.component,
  //     parent: null,
  //   });
  //   this.send(data);
  // }

  // deleteQn(ev) {
  //   const data = this.generateData({
  //     component: ev.target.parentNode.parentNode.dataset.type,
  //     action: ev.target.dataset.type,
  //     componentId: ev.target.parentNode.dataset.component,
  //     parent: null,
  //   });
  //   this.send(data);
  // }

  // upvoteOnQn(ev) {
  //   const parent = ev.target.parentNode.parentNode.dataset; // TODO improve removing parentNode
  //   const data = this.generateData({ component: parent.type, action: ev.target.parentNode.dataset.type });
  //   const upvoteCount = ev.target.nextSibling.innerHTML;
  //   if (upvoteCount == '0') {
  //     data.upvote = 1;
  //     data.parent = parent.parent;
  //     virtualclass.askQuestion.context[data.context][data.component].send(data);
  //     // virtualclass.askQuestion[data.component].send(data);
  //     virtualclass.askQuestion.firstid = data.id;
  //   } else {
  //     virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(virtualclass.askQuestion.firstid).update('upvote', firebase.firestore.FieldValue.increment(1));
  //   }
  // }
}

class QAanswer extends BasicOperation {
  // create(data) {
  //   const textTemp = document.querySelector('#writeContent');
  //   if (textTemp) {
  //     textTemp.remove();
  //   }
  //   this.renderer(data);
  //   console.log('Create ', data);
  // }

  // edit(data) {
  //   const textTemp = document.querySelector('#writeContent');
  //   if (textTemp) {
  //     textTemp.remove();
  //   }
  //   const getElem = document.querySelector(`#${data.componentId} .content p`);
  //   getElem.innerHTML = data.content;
  //   console.log('Create ', data);
  // }

  // delete(data) {
  //   const elem = document.querySelector(`#${data.componentId}`);
  //   elem.remove();
  //   console.log('Create ', data);
  // }

  // upvote(data) {
  //   if (data.upvote) {
  //     if (data.upvote == 1) virtualclass.askQuestion.firstid = data.id;
  //     document.querySelector(`#${data.parent} .upVote .total`).innerHTML = data.upvote;
  //     if (data.userId === virtualclass.uInfo.userid) {
  //       document.querySelector(`#${data.parent} .upVote`).dataset.upvote = 'upvoted';
  //     }
  //   }
  // }

  // renderer(data) {
  //   if (data.type === 'input') {
  //     const text = document.querySelector('#writeContent .text');
  //     if (text) {
  //       return;
  //     }
  //     const context = {};
  //     const qaPostTemp = virtualclass.getTemplate('qaPost', 'askQuestion');
  //     const postTemp = qaPostTemp(context);
  //     if (data.itemId) {
  //       if (data.userId === virtualclass.gObj.uid) {
  //         document.querySelector(`#${data.itemId} .content p`).innerHTML = '';
  //         document.querySelector(`#${data.itemId} .content p`).insertAdjacentHTML('beforeend', postTemp);
  //         const text = document.querySelector('#writeContent .text');
  //         text.innerHTML = data.content;
  //         if (text) {
  //           text.addEventListener('keyup', this.inputHandler.bind(this));
  //         }
  //       }
  //     } else {
  //       document.querySelector(`#${data.componentId}`).insertAdjacentHTML('beforeend', postTemp);
  //       const text = document.querySelector('#writeContent .text');
  //       if (text) {
  //         text.addEventListener('keyup', this.inputHandler.bind(this));
  //       }
  //     }
  //   } else if (data.type === 'answerBox') {
  //     const getAnsElem = document.querySelector(`#${data.itemId} .content p`);
  //     const ansElem = document.querySelector(`#${data.itemId}`);
  //     if (getAnsElem) {
  //       ansElem.dataset.status = data.status;
  //       getAnsElem.innerHTML = data.content;
  //     } else {
  //       const qaAnswerTemp = virtualclass.getTemplate('answer', 'askQuestion');
  //       const context = { id: data.id, itemId: data.componentId, userName: data.uname, hasControl: roles.hasControls() };
  //       const ansTemp = qaAnswerTemp(context);
  //       document.querySelector(`#${data.componentId} .answers`).insertAdjacentHTML('beforeend', ansTemp);
  //       document.querySelector(`#${data.id} .content p`).innerHTML = data.content;
  //       document.querySelector(`#${data.id}`).dataset.status = data.status;
  //       document.querySelector(`#${data.id} .content p`).dataset.status = data.status;
  //     }
  //   }
  //
  //   if (data.userId === virtualclass.uInfo.userid) {
  //     document.querySelector(`#${data.id} .upVote`).dataset.upvote = 'upvoted';
  //   }
  //
  //   const ansElem = document.querySelector(`#${data.id}.answer`);
  //   if (ansElem) {
  //     ansElem.addEventListener('click', (ev) => {
  //       if (ev.target.parentNode.dataset.type === 'upvote' || ev.target.parentNode.dataset.type === 'reply'
  //         || ev.target.parentNode.dataset.type === 'commentsNavigation') {
  //         if (ev.target.parentNode.dataset.type === 'upvote') {
  //           this.upvoteOnAns(ev);
  //         } else if (ev.target.parentNode.dataset.type === 'comment') {
  //           virtualclass.askQuestion.performWithQueue({
  //             component: 'comment',
  //             action: 'renderer',
  //             type: 'input',
  //             context: virtualclass.askQuestion.currentContext,
  //             componentId: ev.target.parentNode.parentNode.dataset.component,
  //           });
  //         }
  //       } else if (ev.target.dataset.type === 'edit' || ev.target.dataset.type === 'delete'
  //         || ev.target.className === 'moreControls' || ev.target.dataset.type === 'mark') {
  //         const getMoreCntrl = document.querySelector(`#${ev.target.dataset.component}.answer .moreControls .item`);
  //         if (ev.target.dataset.type === 'edit') {
  //           this.updateAns(ev);
  //           getMoreCntrl.classList.remove('open');
  //           getMoreCntrl.classList.add('close');
  //         } else if (ev.target.dataset.type === 'delete') {
  //           this.deleteAns(ev);
  //           getMoreCntrl.classList.remove('open');
  //           getMoreCntrl.classList.add('close');
  //         } else if (ev.target.className === 'moreControls' && ev.target.dataset.type === 'answer') {
  //           if (getMoreCntrl.classList.contains('close')) {
  //             getMoreCntrl.classList.remove('close');
  //             getMoreCntrl.classList.add('open');
  //           } else {
  //             getMoreCntrl.classList.remove('open');
  //             getMoreCntrl.classList.add('close');
  //           }
  //         } else if (ev.target.dataset.type === 'mark') {
  //           this.markOnAns(ev);
  //           getMoreCntrl.classList.remove('open');
  //           getMoreCntrl.classList.add('close');
  //         }
  //       }
  //     });
  //   }
  // }

  // inputHandler(ev) {
  //   if (ev.keyCode === 13 && !ev.target.parentNode.parentNode.dataset.status) {
  //     const data = this.generateData({
  //       component: 'answer',
  //       content: ev.target.value,
  //       type: 'contentBox',
  //       action: 'create',
  //       uname: virtualclass.uInfo.userobj.name,
  //       parent: ev.target.parentNode.parentNode.id,
  //       status: 'created',
  //     });
  //     this.send(data);
  //   } else if (ev.keyCode === 13 && ev.target.parentNode.parentNode.dataset.status) {
  //     const data = this.generateData({
  //       component: 'answer',
  //       content: ev.target.value,
  //       type: 'contentBox',
  //       action: 'edit',
  //       uname: virtualclass.uInfo.userobj.name,
  //       // componentId: ev.target.parentNode.parentNode.dataset.parent,
  //       parent: ev.target.parentNode.parentNode.dataset.parent,
  //       status: 'edited',
  //     });
  //     this.send(data);
  //   }
  // }

  // deleteAns(ev) {}

  // updateAns(ev) {
  //   const text = document.querySelector(`#${ev.target.parentNode.dataset.parent} .content p`).innerHTML;
  //   const data = this.generateData({
  //     component: 'answer',
  //     action: 'renderer',
  //     type: 'input',
  //     content: text,
  //     componentId: ev.target.parentNode.dataset.parent,
  //     componentId: ev.target.parentNode.dataset.qid,
  //   });
  //   this.send(data);
  // }

  // upvoteOnAns(ev) {
  //   const parent = ev.target.parentNode.parentNode.dataset; // TODO improve removing parentNode
  //   const data = this.generateData({ component: parent.type, action: ev.target.parentNode.dataset.type });
  //   const upvoteCount = ev.target.nextSibling.innerHTML;
  //   if (upvoteCount == '0') {
  //     data.upvote = 1;
  //     data.parent = parent.parent;
  //     virtualclass.askQuestion.context[data.context][data.component].send(data);
  //     // virtualclass.askQuestion[data.component].send(data);
  //     virtualclass.askQuestion.firstid = data.id;
  //   } else {
  //     virtualclass.askQuestion.db.collection(virtualclass.askQuestion.collection).doc(virtualclass.askQuestion.firstid).update('upvote', firebase.firestore.FieldValue.increment(1));
  //   }
  // }

  markOnAns(ev) {
    const data = this.generateData({
      component: ev.target.parentNode.parentNode.dataset.type,
      action: ev.target.dataset.type,
      componentId: ev.target.parentNode.dataset.parent,
      componentId: ev.target.parentNode.dataset.qid,
    });
    this.send(data);
  }

  mark(data) {
    const getMarkElem = document.querySelector(`#${data.componentId} .footer .mark`);
    getMarkElem.classList.add('marked');
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

class QAcontext {
  constructor() {
    this.actions = [];
    this.question = new QAquestion();
    this.answer = new QAanswer();
    this.comment = new QAcomment();
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
    this.db.collection(this.collection).orderBy('timestamp', 'asc')
      .onSnapshot((querySnapshot) => {
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
