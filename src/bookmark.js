class Bookmark { // Part of bookmark
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
        bookMarkContainer.insertAdjacentHTML('beforeEnd', bookmarkHtml({
          context: virtualclass.userInteractivity.currentContext,
        }));
      }
    }

    if (virtualclass.userInteractivity.queue.bookmark[context]
      && virtualclass.userInteractivity.queue.bookmark[context].length > 0) {
      virtualclass.userInteractivity.engine.perform(context, 'bookmark');
    }
  }

  async bookMarkHandler(event) {
    // await virtualclass.userInteractivity.triggerInitFirebaseOperation('bookmark');
    const ev = event;
    virtualclass.userInteractivity.handler(ev);
    const parentNodeElem = ev.target.parentNode;
    if (+(parentNodeElem.dataset.value) === 1) {
      parentNodeElem.dataset.value = 0;
      ev.target.dataset.title = virtualclass.lang.getString('addContext');
    } else {
      parentNodeElem.dataset.value = 1;
      ev.target.dataset.title = virtualclass.lang.getString('removeContext');
    }
  }

  attachHandler() {
    document.getElementById('bookmark').addEventListener('click', this.bookMarkHandler);
  }

  updateOnPageRefresh(data) {
    const bookmark = document.querySelector(`#bookmark .bookmarks[data-context~=${data.context}]`);
    if (bookmark) {
      const toolTip = bookmark.querySelector('.congtooltip');
      bookmark.dataset.value = data.content;
      if (data.content === 1) {
        toolTip.dataset.title = virtualclass.lang.getString('removeContext');
      } else {
        toolTip.dataset.title = virtualclass.lang.getString('addContext');
      }
    }
  }
}
