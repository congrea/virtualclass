/**
 * This class is responsible to create container for whiteboard/canvas.
 * It contains the key mapping words that used to encode and decode the data.
 * @Copyright 2020  Vidya Mantra EduSystems Pvt. Ltd.
 * @author Suman Bogati <http://www.vidyamantra.com>
 */

class WhiteboardWrapper {
  constructor() {
    this.gObj = {};
    this.keyMap = {
      triangle: 'Triangle', // for instaniating fabric object
      oval: 'Circle',
      rectangle: 'Rect',
      line: 'Line',
      text: 'Text',
      circle: 'Circle',
      r: 'rectangle',
      f: 'freeDrawing',
      l: 'line',
      c: 'circle',
      tr: 'triangle',
      d: 'innerMouseDown', // For triggering the mouse event on student side
      m: 'innerMouseMove',
      u: 'innerMouseUp',
      mousedown: 'd',
      mousemove: 'm',
      mouseup: 'u',
      acd: 'mousedown',
      acm: 'mousemove',
      acu: 'mouseup',
      ovalShort: 'o', // For sending the shapes name in short form
      rectangleShort: 'r',
      freeDrawingShort: 'f',
      lineShort: 'l',
      textShort: 't',
      triangleShort: 'tr',
      circleShort: 'c',
      sp: 'shape',
      ac: 'activeAll',
      cl: 'color',
      cw: 'clear',
      sk: 'strk',
      ft: 'font',
      font: 'ft',
      strk: 'sk',
      color: 'cl',
    };
    this.mouseTool = ['rectangle', 'triangle', 'circle', 'line', 'freeDrawing', 'activeAll', 'text'];
  }

  init(id, app) {
    this.constructor.createWhiteboardContainerHtml(id, app);
    this.replay = new WhiteboardReplay();
    this.util = new WhiteboardUtility();
    this.protocol = new WhiteboardProtocol();
    this.cursor = new WhiteboardCursor();
    this.cursor.init();
    this.msg = new WhiteboardMessage();
  }

  static createWhiteboardContainerHtml(id, app) {
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
