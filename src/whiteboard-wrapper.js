class WhiteboardWrapper {
  constructor() {
    this.canvas = null;
    this.selectedTool = null;
  }

  init(id, app) {
    let whiteboardContainer;
    let wbHtml;
    const wbTemplate = virtualclass.getTemplate('main', 'whiteboard');
    if (app === 'Whiteboard') {
      whiteboardContainer = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
    } else {
      whiteboardContainer = document.getElementById(`cont${id}`);
    }
    if (app === 'Whiteboard') {
      virtualclass.wbCommon.hideElement();
      const wnoteid = `note${id}`;
      const wnote = document.querySelector(`#${wnoteid}`);
      if (wnote !== null) {
        wnote.classList.add('canvasContainer', 'current');
        wbHtml = wbTemplate({ cn: id, hasControl: roles.hasControls() });
        wnote.innerHTML = wbHtml;
      } else {
        wbHtml = `<div id='${wnoteid}' data-wb-id='${id}' class='canvasContainer current'>${wbTemplate({
          cn: id,
          hasControl: roles.hasControls(),
        })}</div>`;

        if (id !== '_doc_0_0') {
          whiteboardContainer.insertAdjacentHTML('beforeend', wbHtml);
        } else {
          whiteboardContainer.innerHTML = wbHtml;
          const vcanvasDoc = document.querySelector('#note_doc_0_0');
          if (vcanvasDoc !== null) {
            vcanvasDoc.classList.add('current');
          }
        }
      }
    } else {
      wbHtml = wbTemplate({ cn: id, hasControl: roles.hasControls() });
      whiteboardContainer.innerHTML = wbHtml;
    }
  }
}
