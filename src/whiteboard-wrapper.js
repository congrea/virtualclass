class WhiteboardWrapper {
  constructor() {
    this.gObj = null;
    this.keyMap = {
      triangle: 'Triangle', // for instaniating fabric object
      oval: 'Circle',
      rectangle: 'Rect',
      line: 'Line',
      text: 'Text',
      d: 'innerMouseDown', // For triggering the mouse event on student side
      m: 'innerMouseMove',
      u: 'innerMouseUp',
      mousedown: 'd',
      mousemove: 'm',
      mouseup: 'u',
      r: 'rectangle',
      f: 'freeDrawing',
      ovalShort: 'o', // For sending the shapes name in short form
      rectangleShort: 'r',
      freeDrawingShort: 'f',
      lineShort: 'l',
      textShort: 't',
      triangleShort: 'tr',
      sp: 'shape',
      ac: 'action',
      cl: 'color',
      cw: 'clear',
      ac: 'activeAll',
      acd: 'mousedown',
      acm: 'mousemove',
      acu: 'mouseup',
    };
  }

  init(id, app) {
    this.createWhiteboardContainerHtml(id, app);
    this.replay = new WhiteboardReplay();
    this.util = new WhiteboardUtility();
    this.protocol = new WhiteboardProtocol();
    this.util.initArrowImage();
  }

  createWhiteboardContainerHtml(id, app) {
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
