class WhiteboardWrapper {
  constructor() {
    this.gObj = {};
    this.keyMap = {
      triangle: 'Triangle', // for instaniating fabric object
      oval: 'Circle',
      rectangle: 'Rect',
      line: 'Line',
      text: 'Text',
      triangle: 'Triangle',
      circle: 'Circle',
      d: 'innerMouseDown', // For triggering the mouse event on student side
      m: 'innerMouseMove',
      u: 'innerMouseUp',
      mousedown: 'd',
      mousemove: 'm',
      mouseup: 'u',
      r: 'rectangle',
      f: 'freeDrawing',
      l: 'line',
      c: 'circle',
      tr: 'triangle',
      ovalShort: 'o', // For sending the shapes name in short form
      rectangleShort: 'r',
      freeDrawingShort: 'f',
      lineShort: 'l',
      textShort: 't',
      triangleShort: 'tr',
      circleShort: 'c',
      sp: 'shape',
      ac: 'action',
      cl: 'color',
      cw: 'clear',
      ac: 'activeAll',
      acd: 'mousedown',
      acm: 'mousemove',
      acu: 'mouseup',
      cl: 'color',
      sk: 'strk',
      ft: 'font',
      font: 'ft',
      strk: 'sk',
      color: 'cl',
      font: 'ft',
    };
    this.shapes = ['rectangle', 'triangle', 'text', 'freeDrawing', 'circle', 'line'];
  }
 
  init(id, app) {
    this.createWhiteboardContainerHtml(id, app);
    this.replay = new WhiteboardReplay();
    this.util = new WhiteboardUtility();
    this.protocol = new WhiteboardProtocol();
    this.cursor = new WhiteboardCursor();
    this.cursor.init();
    this.msg = new WhiteboardMessage();
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
