/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

class Note { // Part of Note
  constructor() {
    this.queue = [null];
    this.current = 0;
    this.attachImmediateHandler = false;
    this.attachFocusHandler = {};
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

    let context = this.queue[this.current];
    if (context == null) {
      console.log('==== suman bogati ', this.queue[virtualclass.userInteractivity.currentContext]);
      context = virtualclass.userInteractivity.currentContext;
    }

    if (virtualclass.userInteractivity.context[context]) {
      this.displayNoteBy(context);
    } else {
      virtualclass.userInteractivity.engine.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context });
    }
    this.updateNavigateNumbers(context);
  }

  updateNavigateNumbers(context) {
    const currentNumberElem = document.querySelector('#noteNavigation .notenumber .current');
    if (currentNumberElem) currentNumberElem.innerHTML = `${this.current + 1} /`;

    const clearAll = document.querySelector('#noteNavigationContainer .clearAll');
    clearAll.dataset.currentContext = context;

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
    console.log('Update ');
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

    const currentActiveTab = virtualclass.userInteractivity.getActiveTab();
    if (currentActiveTab === 'note') this.updateNavigateNumbers(context);
  }

  deleteElementFromQueue(context) {
    console.log('====> clear context ', context);
    const pos = this.queue.indexOf(context);
    if (pos >= -1) {
      if (pos + 1 === this.queue.length) {
        this.queue[pos] = null;
      } else {
        this.queue.splice(pos, 1);
        if (this.queue.length > 0) {
          if (this.queue[this.queue.length - 1] != null) {
            this.queue.push(null);
          }
        } else {
          this.queue[0] = null;
        }
        this.current = this.queue.length - 1;
        this.updateNavigateNumbers(context);
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
    if (!this.attachFocusHandler[currentContext]) {
      textArea.addEventListener('input', this.noteHandler.bind(this));
      textArea.addEventListener('focus', virtualclass.vutil.inputFocusHandler.bind(this));
      textArea.addEventListener('focusout', virtualclass.vutil.inputFocusOutHandler.bind(this));
      this.attachFocusHandler[currentContext] = true;
    }

    const noteNavigationContainer = document.getElementById('noteNavigationContainer');
    if (!virtualclass.userInteractivity.note.attachImmediateHandler) {
      virtualclass.userInteractivity.note.attachImmediateHandler = true;
      noteNavigationContainer.addEventListener('click', this.noteHandlerImmediate.bind(this));
    }
  }

  container(data) { // Note Part
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

  displayWithContent(data) { // Note part
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
}
