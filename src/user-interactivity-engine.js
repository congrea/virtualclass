class UserInteractivityEngine { // main part
  performWithQueue(data) {
    this.makeQueue(data);
    const type = (data.component === 'note' || data.component === 'bookmark') ? data.component : 'question';
    this.perform(data.context, type);
  }

  makeQueue(data) {
    const type = (data.component === 'note' || data.component === 'bookmark') ? data.component : 'question';
    if (!virtualclass.userInteractivity.queue[type][data.context]) {
      virtualclass.userInteractivity.queue[type][data.context] = [];
    }
    virtualclass.userInteractivity.queue[type][data.context].push(data);
  }

  perform(context, type) {
    while (virtualclass.userInteractivity.queue[type][context] && virtualclass.userInteractivity.queue[type][context].length > 0) {
      const data = virtualclass.userInteractivity.queue[type][context].shift();
      if (data.component === 'question' && data.upvote && data.upvote > 1) {
        virtualclass.userInteractivity.upvote.call(virtualclass.userInteractivity, data);
      } else if (data.component === 'answer' && data.upvote && data.upvote > 1) {
        virtualclass.userInteractivity.upvote.call(virtualclass.userInteractivity, data);
      } else {
        // context = whiteboard 1/screen share, component = question/answer, action = create/edit
        virtualclass.userInteractivity[data.action].call(virtualclass.userInteractivity, data);
        console.log('=====> perform ', data);
      }
    }
  }

  performWithPassData(data) {
    virtualclass.userInteractivity[data.action].call(virtualclass.userInteractivity, data);
  }
}
