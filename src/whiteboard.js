// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
  // const { io } = window;
  // const i = 0;

  /**
   * This is the main object which has properties and methods
   * Through this properties and methods all the front stuff is happening
   * eg:- creating, storing and replaying the objects
   */

  const whiteboard = function (config, currWb) {
    // console.log('Whiteboard new one');
    const id = Object.prototype.hasOwnProperty.call(config, 'id') ? config.id : 'appWhitebaordCont';
    const classes = Object.prototype.hasOwnProperty.call(config, 'class');
    // virtualclass.gObj.currWb = currWb;
    //
    if (typeof virtualclass.wb[currWb].vcan !== 'object') {
      virtualclass.wb[currWb].vcan = new window.Vcan();
      // console.log('====> vcan is creating ', currWb);

      window.vcanUtility(currWb);
      window.vcanMain(currWb);
      window.Events(currWb);
      window.Virtualbox(currWb);
      window.Interact(currWb);
      window.Rectangle(currWb);
      window.Oval(currWb);
      window.Triangle(currWb);
      window.Text(currWb);
      window.Line(currWb);
      window.FreeHandDrawing(currWb);
      window.Path(currWb);
      window.Mouse(currWb);
      window.Optimize(currWb);
    }

    return {
      //  currWb : currWb,
      id,
      classes,
      tool: '',
      obj: {},
      prvObj: '',
      replayTime: 0,
      uid: 0,
      lt: '',
      view: {}, // For display important message to user
      lang: {},
      system: {},
      user: {},
      gObj: {
        myrepObj: [],
        replayObjs: [],
        myArr: [],
        // displayedObjId: 0,
        packQueue: [],
        queue: [],
        virtualWindow: false,
      }, // For store the global oject

      vcan: virtualclass.wb[currWb].vcan,


      /**
       * This function basically does create the canvas on which
       * the user draws the various object
       * @param window the function gets the window object as parameter
       *
       */
      init(mid) {
        const { vcan } = virtualclass.wb[mid];
        virtualclass.wb[mid].canvas = vcan.create(`#canvas${mid}`);
        const canvasObj = vcan.main.canvas;
        canvasObj.className += ' whiteboards';
        canvasObj.setAttribute('tabindex', '0'); // this does for set chrome

        const canvasPdf = document.createElement('canvas');
        canvasPdf.id = `canvas${mid}_pdf`;
        canvasPdf.className = 'pdfs';
        canvasPdf.width = canvasObj.width;
        canvasPdf.height = canvasObj.height;

        virtualclass.vutil.insertAfter(canvasPdf, canvasObj);
        // canvasObj.after(canvasPdf);

        // canvasObj.focus();


        // IMPORTANT  this is changed during the UNIT testing
        // onkeydown event is working into all browser.
        // canvasObj.onkeydown = virtualclass.wb[mid].utility.keyOperation;
        onkeydown = virtualclass.wb[mid].utility.keyOperation;

        // if (typeof (Storage) !== 'undefined') {
        //   // if (localStorage.repObjs) {
        //   //   // var replayObjs = JSON.parse(localStorage.repObjs);
        //   // }
        //   virtualclass.wb[mid] = virtualclass.wb[mid];
        // }

        this.arrowInit();
        this._init(mid);
        // var canvas = document.querySelector('#' +canvasObj.mid);
        // if(canvas != null){
        //
        //      canvas.focus();
        // }
      },

      _init(mid) {
        virtualclass.wb[mid].oTeacher = roles.hasAdmin();
        window.addEventListener('click', () => {
          virtualclass.view.disappearBox('WebRtc');
          virtualclass.view.disappearBox('Canvas');
          virtualclass.view.disappearBox('drawArea');
        });

        virtualclass.wb[mid].utility.crateCanvasDrawMesssage(mid);
      },

      // UI: {
      //
      //   // TODO, this should be validated and removed
      //   mainContainer(container, id) {
      //     var container = document.querySelector(`#${container}`);
      //     if (container != null) {
      //       const vcanvas = document.createElement('div');
      //       vcanvas.id = `vcanvas${id}`;
      //       vcanvas.className = 'vcanvas';
      //       vcanvas.dataset.wbId = id;
      //
      //       const containerWb = document.createElement('div');
      //       containerWb.id = `containerWb${id}`;
      //       containerWb.className = 'containerWb';
      //
      //       vcanvas.appendChild(containerWb);
      //       container.appendChild(vcanvas);
      //     } else {
      //       alert('container is null');
      //     }
      //   },
      // },

      /**
       * this function called the image function
       * for initialize the arrow
       */
      arrowInit() {
        this.arrImg = new Image();
        // this.arrImg.src = (typeof window.whiteboardPath != 'undefined') ? window.whiteboardPath + 'resources/images/arrow.png' : '/resources/images/arrow.png';
        this.arrImg.src = 'https://cdn.congrea.net/resources/images/arrow.png';
        this.arrImgDraw = false;
        const wb = this;
        this.arrImg.onload = function () {
          wb.arrImgDraw = true;
        };
      },
      /**
       * this function does create the command interface
       */
      createCommand(alreadyCreated, id) {
        var alreadyCreated = virtualclass.wb[id].utility.alreadyExistToolBar(id);
        if (alreadyCreated || (localStorage.getItem('educator') != null)) {
          return true;
        }

        // var cmdToolsWrapper = virtualclass.vutil.createCommandWrapper(id);
        const toolTemplate = virtualclass.getTemplate('toolbar', 'whiteboard');
        const cmdToolsWrapper = toolTemplate({ cn: id });

        const whiteboardCont = document.getElementById(`containerWb${id}`);
        if (whiteboardCont != null) {
          whiteboardCont.insertAdjacentHTML('afterbegin', cmdToolsWrapper);
        }
      },

      // // not using
      // createCommandWrapper() {
      //   // alert(virtualclass.system.device);
      //   const cmdToolsWrapper = document.createElement('div');
      //   cmdToolsWrapper.id = virtualclass.gObj.commandToolsWrapperId;
      //   const canvasElem = document.getElementById(vcan.canvasWrapperId);
      //   if (canvasElem != null) {
      //     document.getElementById('containerWb').insertBefore(cmdToolsWrapper, canvasElem);
      //   } else {
      //     document.getElementById('containerWb').appendChild(cmdToolsWrapper);
      //   }
      //   return cmdToolsWrapper;
      // },


      /**
       * this funciton does create the canvasdd
       */
      createCanvas(id) {
        const { vcan } = virtualclass.wb[id];
        vcan.canvasWrapperId = cmdToolsWrapper.id;
      },

      initActiveElement(selector, tool) {
        const elem = document.querySelector(selector);
        if (typeof virtualclass.gObj.wbTool[virtualclass.gObj.currWb] === 'undefined') {
          virtualclass.gObj.wbTool[virtualclass.gObj.currWb] = {};
        }
        if (typeof virtualclass.gObj.wbTool[virtualclass.gObj.currWb][tool.type] === 'undefined') {
          elem.addEventListener('click', this.activeElementHandler.bind(this, tool));
          virtualclass.gObj.wbTool[virtualclass.gObj.currWb][tool.type] = true;
        }
      },

      activeElementHandler(tool, ev) {
        // console.log('many times clicked');
        this.activeElement(ev, tool);
      },

      activeElement(ev, tool) {
        const prevSelectedTool = document.querySelector(`#t_${tool.type}${virtualclass.gObj.currWb} .selected`);
        if (prevSelectedTool != null) {
          prevSelectedTool.classList.remove('selected');
        }

        const currElementValue = ev.target.dataset[tool.prop];
        if (currElementValue != null) {
          ev.target.classList.add('selected');
          virtualclass.wb[virtualclass.gObj.currWb].changeToolProperty(tool.type, currElementValue);
        }
      },

      /**
       * this does call the initializer function for particular object
       * @param expects the mouse down event.
       */
      objInit(evt) {
        const wbId = virtualclass.vutil.getWhiteboardId(this.parentNode);
        const anchorNode = this;

        if (evt.target.classList.contains('icon-shapes') || evt.target.parentNode.classList.contains('shapes_icon')) {
          const shapesElem = document.querySelector(`#shapes${wbId}`);
          if (shapesElem.classList.contains('open')) {
            shapesElem.classList.remove('open');
            shapesElem.classList.add('close');
          } else {
            if (shapesElem.classList.contains('close')) {
              shapesElem.classList.remove('close');
            }
            shapesElem.classList.add('open');
            virtualclass.wb[wbId].closeElem(document.querySelector(`#t_strk${wbId} .strkSizeList`));
            virtualclass.wb[wbId].closeElem(document.querySelector(`#t_font${wbId} .fontSizeList`));
          }
          return;
        }

        if (anchorNode.parentNode.id === `t_color${wbId}`) {
          virtualclass.wb[wbId].closeElem(document.querySelector(`#shapes${virtualclass.gObj.currWb}`));
          virtualclass.wb[wbId].closeElem(document.querySelector(`#t_strk${wbId} .strkSizeList`));
          virtualclass.wb[wbId].closeElem(document.querySelector(`#t_font${wbId} .fontSizeList`));

          virtualclass.wb[wbId].toggleDisplay(anchorNode.parentNode.id, wbId);
          virtualclass.wb[wbId].initActiveElement(`#colorList${wbId}`, { type: 'color', prop: 'color' });
        } else if (anchorNode.parentNode.id === `t_strk${wbId}`) {
          virtualclass.wb[wbId].closeElem(document.querySelector(`#shapes${virtualclass.gObj.currWb}`));
          virtualclass.wb[wbId].toggleDisplay(anchorNode.parentNode.id, wbId);
          virtualclass.wb[wbId].initActiveElement(`#t_strk${wbId} ul`, { type: 'strk', prop: 'stroke' });
        } else if (anchorNode.parentNode.id === `t_font${wbId}`) {
          virtualclass.wb[wbId].closeElem(document.querySelector(`#shapes${virtualclass.gObj.currWb}`));
          virtualclass.wb[wbId].toggleDisplay(anchorNode.parentNode.id, wbId);
          virtualclass.wb[wbId].initActiveElement(`#t_font${wbId} ul`, { type: 'font', prop: 'font' });
        } else {
          if (typeof virtualclass.wb[virtualclass.gObj.currWb] !== 'undefined'
            && !virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj
            && typeof virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj !== 'undefined'
            && this.parentNode.id.indexOf('t_text') < 0) {
            // virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj.finalizeTextIfAny();
            // virtualclass.vutil.removeAllTextWrapper();
            const allTextWrapper = document.querySelectorAll('.canvasWrapper .textBoxContainer');
            if (allTextWrapper.length > 0) {
              virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj.finalizeTextIfAny(undefined, virtualclass.gObj.currWb);
            }
          }

          const { vcan } = virtualclass.wb[wbId];

          if (roles.hasControls()) {
            if (this.parentNode.id !== `t_clearall${wbId}`) {
              // call back function should be used as second parameter
              // for action on reposnse of user, cancel, okay
              // virtualclass.wb[id].utility.makeActiveTool();

              virtualclass.wb[wbId].utility.makeActiveTool(this.parentNode.id);
            }

            if (this.parentNode.id !== `t_text${wbId}`) {
              virtualclass.vutil.triggerFinalizeTextIfAny(wbId);
            }
          }

          /** important * */
          if (anchorNode.parentNode.id === `t_replay${wbId}`) {
            virtualclass.wb[wbId].utility.clearAll(false);
            virtualclass.vutil.beforeSend({ replayAll: true, cf: replayAll });
          } else {
            virtualclass.wb[wbId].toolInit({ cmd : anchorNode.parentNode.id, wbId: wbId });
          }

          if (anchorNode.parentNode.id === `t_rectangle${wbId}` || anchorNode.parentNode.id === `t_line${wbId}`
            || anchorNode.parentNode.id === `t_oval${wbId}` || anchorNode.parentNode.id === `t_triangle${wbId}`) {
            const toolName = anchorNode.parentNode.id.slice(2, anchorNode.parentNode.id.split(/_doc_*/)[0].length);
            document.querySelector(`#tool_wrapper${wbId}`).dataset.currtool = anchorNode.parentNode.dataset.tool;
            document.querySelector(`#shapeIcon${wbId} a`).dataset.title = toolName.charAt(0).toUpperCase() + toolName.slice(1);
          } else {
            document.querySelector(`#tool_wrapper${wbId}`).dataset.currtool = 'shapes';
            document.querySelector(`#shapeIcon${wbId} a`).dataset.title = 'Shapes';
            virtualclass.wb[wbId].closeElem(document.querySelector(`#shapes${virtualclass.gObj.currWb}`));
            virtualclass.wb[wbId].closeElem(document.querySelector(`#t_strk${virtualclass.gObj.currWb} .strkSizeList`));
            virtualclass.wb[wbId].closeElem(document.querySelector(`#t_font${virtualclass.gObj.currWb} .fontSizeList`));
            virtualclass.wb[wbId].closeElem(document.querySelector(`#colorList${virtualclass.gObj.currWb}`));
          }


          if (anchorNode.parentNode.id !== `t_replay${wbId}` && anchorNode.parentNode.id !== `t_clearall${wbId}`
            && anchorNode.parentNode.id !== `t_reclaim${wbId}` && anchorNode.parentNode.id !== `t_assign${wbId}`) {
            const currTime = new Date().getTime();
            virtualclass.wb[wbId].lt = anchorNode.parentNode.id;
            // fetching command t_triangle from  t_traingle_doc_1_1
            const cmd = anchorNode.parentNode.id.split(/_doc_*/)[0];
            var obj = { cmd, mt: currTime };
            virtualclass.wb[wbId].uid++;
            obj.uid = virtualclass.wb[wbId].uid;
            vcan.main.replayObjs.push(obj);
            virtualclass.vutil.beforeSend({ repObj: [obj], cf: 'repObj' }); // after optimized
          }
          if (this.parentNode.id !== `t_clearall${wbId}`) {
            virtualclass.wb[wbId].prvTool = this.parentNode.id;
            virtualclass.wb[wbId].prvToolInfo = obj;
          }

          const fontTool = document.querySelector(`#t_font${wbId}`);
          const strkTool = document.querySelector(`#t_strk${wbId}`);
          if (anchorNode.parentNode.id === `t_text${wbId}`) {
            if (fontTool.classList.contains('hide')) {
              fontTool.classList.remove('hide');
              fontTool.classList.add('show');
            }
            strkTool.classList.add('hide');
          } else {
            if (strkTool.classList.contains('hide')) {
              strkTool.classList.remove('hide');
              strkTool.classList.add('show');
            }
            fontTool.classList.add('hide');
          }
        }
      },

      toggleDisplay(toolId, wbId) {
        const colorPicker = document.querySelector(`#colorList${wbId}`);
        if (toolId === `t_color${wbId}`) {
          if (colorPicker.classList.contains('open')) {
            colorPicker.classList.remove('open');
            colorPicker.classList.add('close');
          } else {
            if (colorPicker.classList.contains('close')) {
              colorPicker.classList.remove('close');
            }
            colorPicker.classList.add('open');
          }
        } else if (toolId === `t_strk${wbId}` || toolId === `t_font${wbId}`) {
          virtualclass.wb[wbId].closeElem(colorPicker);
          const selectSize = (toolId === `t_strk${wbId}`) ? document.querySelector(`#${toolId} .strkSizeList`) : document.querySelector(`#${toolId} .fontSizeList`);
          if (selectSize.classList.contains('open')) {
            selectSize.classList.remove('open');
            selectSize.classList.add('close');
          } else {
            if (selectSize.classList.contains('close')) {
              selectSize.classList.remove('close');
            }
            selectSize.classList.add('open');
          }
        }
      },

      changeToolProperty(attr, value) {
        const currTime = new Date().getTime();
        let selectElem;
        let obj;
        if (attr === 'color') {
          selectElem = document.querySelector(`#colorList${virtualclass.gObj.currWb} .selected`).id;
          virtualclass.wb[virtualclass.gObj.currWb].activeToolColor = value;
          document.querySelector(`#t_color${virtualclass.gObj.currWb} .disActiveColor`).style.backgroundColor = virtualclass.wb[virtualclass.gObj.currWb].activeToolColor;
          obj = { color: value, elem: selectElem, mt: currTime };
        } else if (attr === 'strk') {
          selectElem = document.querySelector(`#t_strk${virtualclass.gObj.currWb} .selected`).id;
          virtualclass.wb[virtualclass.gObj.currWb].currStrkSize = value;
          obj = { strkSize: value, elem: selectElem, mt: currTime };
        } else if (attr === 'font') {
          selectElem = document.querySelector(`#t_font${virtualclass.gObj.currWb} .selected`).id;
          virtualclass.wb[virtualclass.gObj.currWb].textFontSize = value;
          obj = { fontSize: value, elem: selectElem, mt: currTime };
        }

        const { vcan } = virtualclass.wb[virtualclass.gObj.currWb];
        virtualclass.wb[virtualclass.gObj.currWb].uid++;
        obj.uid = virtualclass.wb[virtualclass.gObj.currWb].uid;
        vcan.main.replayObjs.push(obj);
        virtualclass.vutil.beforeSend({ repObj: [obj], cf: 'repObj' });
      },

      closeElem(elem) {
        if (elem.classList.contains('open')) {
          elem.classList.remove('open');
          elem.classList.add('close');
        }
      },

      /**
       *
       * This function does attach the handlers by click the particular object
       * would be triggered eg:- if user click on rectangle link then rectangle
       * object would triggered for create the rectangle object
       * @param contId
       * @param alreadyCreated
       * @param id expects the  id of container which contains all the commands of div
       */
      attachToolFunction(contId, alreadyCreated, id) {
        virtualclass.wb[id].createCommand(alreadyCreated, id);
        const allDivs = document.getElementById(contId).getElementsByTagName('div');
        for (let i = 0; i < allDivs.length; i++) {
          // TODO this will have to be fixed as it always assigned t_clearall
          allDivs[i].getElementsByTagName('a')[0].addEventListener('click', virtualclass.wb[id].objInit);
        }
      },
      /**
       * By this method the particular  function would be initialize
       * eg: if the user click on replay button then  the 'replay' function would initialize
       * @param cmd expects the particular command from user
       *
       * @param repMode
       * @param multiuser
       * @param myfunc
       */
      toolInit(data) {
        let cmd;
        let repMode;
        let multiuser;
        let myfunc;
        let wbId;

        if (Object.prototype.hasOwnProperty.call(data, 'cmd')) {
          cmd = data.cmd;
        }


        if (Object.prototype.hasOwnProperty.call(data, 'repMode')) {
          repMode = data.repMode;
        }


        if (Object.prototype.hasOwnProperty.call(data, 'multiUser')) {
          multiuser = data.multiUser;
        }

        if (Object.prototype.hasOwnProperty.call(data, 'myfunc')) {
          myfunc = data.myfunc;
        }

        if (Object.prototype.hasOwnProperty.call(data, 'wbId')) {
          wbId = data.wbId;
        }


        if (Object.prototype.hasOwnProperty.call(data, 'myfunc')) {
          myfunc = data.myfunc;
        }
        // const wbId = virtualclass.gObj.currWb;

        if (cmd.indexOf('_doc_') <= -1) {
          cmd += wbId;
        }

        const { vcan } = virtualclass.wb[wbId];
        // if (typeof virtualclass.wb[wbId].obj.drawTextObj === 'object'
        //   && virtualclass.wb[wbId].obj.drawTextObj.wmode === true) {
        //   const ctx = vcan.main.canvas.getContext('2d');
        // }
        const allChilds = vcan.getStates('children');
        if (allChilds.length > 0) {
          // debugger;
          if (cmd !== `t_clearall${wbId}`) {
            if (typeof multiuser === 'undefined' || cmd !== `t_replay${wbId}`) {
              // after optimization NOTE:- this should have to be enable
              virtualclass.wb[wbId].utility.deActiveFrmDragDrop(wbId);
            }
            if (multiuser !== true && cmd !== 't_replay') {
              vcan.renderAll();
            }
          }
        } else {
          // debugger;
          vcan.main.action = 'create';
        }

        if (!virtualclass.wb[wbId].utility.IsObjEmpty(virtualclass.wb[wbId].obj.freeDrawObj && multiuser === false)) {
          virtualclass.wb[wbId].obj.freeDrawObj.freesvg = false;
        }

        vcan.main.currUserCommand = `${cmd}Init`;

        // if(roles.isStudent()){
        //     console.log(' cmd ' + cmd);
        // }

        // if (cmd == 't_activeall'+ wbId) {
        if (cmd === `t_activeall${wbId}`) {
          // console.log('command active');
          virtualclass.wb[wbId].utility.t_activeallInit();
          // } else if (cmd == 't_replay') {
        } else if (cmd === `t_replay${wbId}`) {
          if (typeof multiuser === 'undefined') {
            // // console.log('====> Setting vcan main = 0');
            vcan.setValInMain('id', 0);
          }
          if (typeof myfunc !== 'undefined') {
            virtualclass.wb[wbId].t_replayInit(repMode, wbId, myfunc);
          } else {
            virtualclass.wb[wbId].t_replayInit(repMode, wbId);
          }
          //  } else if (cmd == 't_clearall'+ wbId) {
        } else if (cmd === `t_clearall${wbId}`) {
          let cofirmmessage;
          if (virtualclass.currApp === 'Whiteboard') {
            cofirmmessage = virtualclass.lang.getString('clearAllWarnMessageW');
          } else if (virtualclass.currApp === 'DocumentShare') {
            cofirmmessage = virtualclass.lang.getString('clearAllWarnMessageD');
          }
          virtualclass.popup.confirmInput(cofirmmessage, (confirm) => {
            // debugger;
            if (!confirm) {
              return true;
            }
            // console.log(`Whiteboard clear init ${wbId}`);
            virtualclass.wb[wbId].utility.t_clearallInit(wbId);
            virtualclass.wb[wbId].utility.makeDefaultValue(cmd, wbId);

            // const obj = { cmd: 't_activeall', mt: currTime };

            virtualclass.vutil.beforeSend({ repObj: [{ cmd: 'clearAll' }], cf: 'repObj' });
            delete virtualclass.gObj.wbTool[virtualclass.gObj.currWb];
            if (roles.hasControls()) {
              virtualclass.wb[wbId].currStrkSize = virtualclass.gObj.defalutStrk;
              virtualclass.wb[wbId].textFontSize = virtualclass.gObj.defalutFont;
              virtualclass.wb[wbId].activeToolColor = virtualclass.gObj.defaultcolor;
              document.querySelector(`#t_color${wbId} .disActiveColor`).style.backgroundColor = virtualclass.wb[wbId].activeToolColor;

              const removeCurrtool = document.querySelector(`#tool_wrapper${wbId}`).dataset.currtool;
              if (removeCurrtool === 'triangle' || removeCurrtool === 'line'
                || removeCurrtool === 'oval' || removeCurrtool === 'rectangle') {
                delete document.querySelector(`#tool_wrapper${wbId}`).dataset.currtool;
              }

              // let tool = document.querySelector(`#shapeIcon${wbId} a`).dataset.title;
              // if (tool === 'triangle' || tool === 'line' || tool === 'oval' || tool === 'rectangle') {
              //   tool = 'Shapes';
              // }

              const strk = document.querySelector(`#t_strk${wbId}`);
              if (strk != null) {
                strk.classList.remove('show');
              }

              const font = document.querySelector(`#t_font${wbId}`);
              if (font != null) {
                font.classList.remove('show');
              }

              const removeColor = document.querySelector(`#colorList${virtualclass.gObj.currWb} .selected`);
              if (removeColor != null) {
                removeColor.classList.remove('selected');
              }

              const removeSelectedStrk = document.querySelector(`#t_strk${virtualclass.gObj.currWb} .selected`);
              if (removeSelectedStrk != null) {
                removeSelectedStrk.classList.remove('selected');
                const selectDefaultStrk = document.querySelector(`.strkSizeList #strk-1${wbId}`);
                selectDefaultStrk.classList.add('selected');
              }

              const removeSelectedFont = document.querySelector(`#t_font${virtualclass.gObj.currWb} .selected`);
              if (removeSelectedFont != null) {
                removeSelectedFont.classList.remove('selected');
                const selectDefaultFont = document.querySelector(`.fontSizeList #font-1${wbId}`);
                selectDefaultFont.classList.add('selected');
              }

              const shapesElem = document.querySelector(`#tool_wrapper${virtualclass.gObj.currWb}.shapesToolbox`);
              shapesElem.classList.remove('active');

              localStorage.removeItem('activeTool');
            }

            // var anch = document.getElementById(cmd).getElementsByTagName('a')[0];
            // if(anch != null){
            //     anch.click();
            // }
          });
        }

        if ((cmd !== `t_replay${wbId}`) && (cmd !== `t_clearallInit${wbId}`)) {
          // debugger;
          virtualclass.wb[wbId].tool = new virtualclass.wb[wbId].toolObj(cmd, wbId);
          virtualclass.wb[wbId].utility.attachEventHandlers(wbId);
        }
      },
      /**
       * The object would be created at core level
       * rectangle object would created  in case of creating the rectangle
       * @param the cmd expects one of the object that user can draw
       * text and free draw are different case than other object
       */
      toolObj: function toolObj(cmd, wbId) {
        // alert("Suman bogati");
        // debugger;
        // var wbId = this.currWb;
        // let wbId;
        // if (cmd.indexOf('_doc_') > -1) {
        //   // const elem = document.querySelector(`#${cmd}`);
        //   // if (elem == null) {
        //   //   wbId = virtualclass.gObj.currWb;
        //   // } else {
        //   //   wbId = virtualclass.vutil.getWhiteboardId(elem);
        //   // }
        //   // wbId =
        // } else {
        //   // When this is executed from student side
        //   // wbId = virtualclass.gObj.currWb;
        //   cmd += wbId;
        // }

        if (cmd.indexOf('_doc_') <= -1) {
          cmd += wbId;
        }

        // debugger;
        this.cmd = cmd;
        // when other objecti.
        if (cmd !== `t_freeDrawing${wbId}`) {
          virtualclass.wb[wbId].obj.freeDrawObj = '';
        }

        if (cmd !== `t_text${wbId}` && !virtualclass.vutil.exitTextWrapper()) {
          virtualclass.wb[wbId].obj.drawTextObj = '';
        }

        if (cmd === `t_freeDrawing${wbId}`) {
          // NOTE:- this is added during the UNIT testing
          const borderColor = '#424240';
          const linWidth = '3';
          virtualclass.wb[wbId].obj.freeDrawObj = new virtualclass.wb[wbId].readyFreeHandObj(borderColor, linWidth);
          virtualclass.wb[wbId].obj.freeDrawObj.init();
        } else if (cmd === `t_text${wbId}`) {
          //   virtualclass.vutil.attachClickOutSideCanvas();
          virtualclass.wb[wbId].obj.drawTextObj = new virtualclass.wb[wbId].readyTextObj();
          virtualclass.wb[wbId].obj.drawTextObj.init(`canvasWrapper${wbId}`);
        }

        let mCmd = cmd.slice(2, cmd.length);
        if (mCmd.indexOf('_doc_') > -1) {
          mCmd = mCmd.substring(0, (mCmd.indexOf('_')));
        }
        virtualclass.wb[wbId].draw_object(mCmd, virtualclass.wb[wbId].canvas, this, wbId);
      },
      /**
       * This function does initiates replay function after click on replay button
       * it replays all the object the user would drawn
       */
      t_replayInit(repMode, wid, myfunc) {
        // const wid = virtualclass.gObj.currWb;
        // debugger;
        // virtual0class.wb.replay = virtualclass.wb[id]._replay();
        if (repMode === 'fromFile') {
          virtualclass.gObj.chat.removeAllChat();
          virtualclass.wb[wid].recordAudio = true;
          virtualclass.recorder.init();
        } else {
          // console.log('=====> whiteboard ready 2 ', wid);
          virtualclass.wb[wid].replay = virtualclass.wb[wid]._replay();

          if (typeof myfunc !== 'undefined') {
            virtualclass.wb[wid].replay.init(repMode, wid, myfunc);
            virtualclass.wb[wid].replay.renderObj(wid, myfunc);
          } else {
            virtualclass.wb[wid].replay.init(repMode, wid);
            virtualclass.wb[wid].replay.renderObj(wid);
          }
        }
      },
    };
  };
  window.whiteboard = whiteboard;
}(window, document));
