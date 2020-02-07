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
}
