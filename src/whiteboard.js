// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
    var io = window.io;
    var i = 0;
    /**
     * This is the main object which has properties and methods
     * Through this properties and methods all the front stuff is happening
     * eg:- creating, storing and replaying the objects
     */

    var whiteboard = function (config) {
        var id = config.hasOwnProperty('id') ? config.id : "appWhitebaordCont";
        var classes = config.hasOwnProperty('class');

        return {
            id: id,
            classes: classes,
            tool: '',
            obj: {},
            prvObj: '',
            replayTime: 0,
          //  sentPackets: 0,
           // sentPackDiv: 'sentPacket',
           // sentPackDivPS: 'sentPacketPS',
           // receivedPackets: 0,
           // receivedPackDiv: 'receivedNumber',
            // receivedPackDivPS: 'receivedNumberPS',
            uid: 0,
            lt: '',
            // commandToolsWrapperId: 'commandToolsWrapper',
            //these are top level object
//                error: [],
            view: {}, // For display important message to user
            lang: {},
            system: {},
            user: {},
            gObj: {
                myrepObj: [],
                replayObjs: [],
                myArr: [],
                displayedObjId: 0,
                packQueue: [],
                queue : [],
                virtualWindow: false
            }, // For store the global oject


            /**
             * This function basically does create the canvas on which
             * the user draws the various object
             * @param window the function gets the window object as parameter
             *
             */
            init: function () {

                virtualclass.wb.vcan = window.vcan; //this would be done because of possibility of conflict
                var vcan = virtualclass.wb.vcan;
                virtualclass.wb.canvas = vcan.create('#canvas');
                var canvasObj = vcan.main.canvas;
                canvasObj.setAttribute('tabindex', '0');  //this does for set chrome
                canvasObj.focus();

                //IMPORTANT  this is changed during the UNIT testing
                //onkeydown event is working into all browser.
                //canvasObj.onkeydown = virtualclass.wb.utility.keyOperation;
                window.onkeydown = virtualclass.wb.utility.keyOperation;

                virtualclass.system.setAppDimension();
                if (typeof (Storage) !== "undefined") {
                    if (localStorage.repObjs) {
                        // var replayObjs = JSON.parse(localStorage.repObjs);
                    }
                    window.virtualclass.wb = virtualclass.wb;
                }

                this.arrowInit();
	            this._init();
            },

            _init: function () {
              /*  if (!roles.hasAdmin()) {
                    virtualclass.wb.pageEnteredTime = new Date().getTime();
                    localStorage.setItem('pageEnteredTime', virtualclass.wb.pageEnteredTime);
                } else {
                    virtualclass.wb.pageEnteredTime = localStorage.getItem('pageEnteredTime');
                }
                */
                virtualclass.wb.oTeacher = roles.hasAdmin();

                if (virtualclass.vutil.chkValueInLocalStorage('rcvdPackId')) {
                    virtualclass.wb.gObj.rcvdPackId = parseInt(localStorage.rcvdPackId);
                } else {
                    virtualclass.wb.gObj.rcvdPackId = 0;
                }

                // virtualclass.wb.utility.displayCanvas();


                window.addEventListener('resize',
                    function () {
                        virtualclass.gObj.resize = true;
                        if (roles.hasControls()) {
                            if (virtualclass.currApp == 'Whiteboard') {
                                virtualclass.wb.utility.lockvirtualclass();
                            }
                        }
                    }
                );


                window.addEventListener('click', function () {
                    virtualclass.view.disappearBox('WebRtc');
                    virtualclass.view.disappearBox('Canvas');
                    virtualclass.view.disappearBox('drawArea');
                });

                // The user's role is already defined

                //this.stHasTeacher = roles.hasControls();
                //if (this.stHasTeacher) {
                //    virtualclass.gObj.uRole = 't';
                //}

                virtualclass.wb.utility.crateCanvasDrawMesssage();
            },


            /**
             * this function called the image function
             * for initialize the arrow
             */
            arrowInit: function () {
                this.arrImg = new Image();
                this.arrImg.src = (typeof window.whiteboardPath != 'undefined') ? window.whiteboardPath + '/images/arrow.png' : '/images/arrow.png';
                this.arrImgDraw = false;
                var wb = this;
                this.arrImg.onload = function () {
                    wb.arrImgDraw = true;
                };
            },
            /**
             * this function does create the command interface
             */
            createCommand: function () {
                var alreadyCreated = virtualclass.wb.utility.alreadyExistToolBar();
                if (alreadyCreated || (localStorage.getItem('educator') != null && localStorage.reclaim)) {
                    return true;
                }

                var cmdToolsWrapper = virtualclass.vutil.createCommandWrapper();
                virtualclass.vutil.createDiv('t_rectangle', 'rectangle', cmdToolsWrapper, 'tool');
                virtualclass.vutil.createDiv('t_line', 'line', cmdToolsWrapper, 'tool');
                virtualclass.vutil.createDiv('t_freeDrawing', 'freeDrawing', cmdToolsWrapper, 'tool');
                virtualclass.vutil.createDiv('t_oval', 'oval', cmdToolsWrapper, 'tool');
                virtualclass.vutil.createDiv('t_triangle', 'triangle', cmdToolsWrapper, 'tool');
                virtualclass.vutil.createDiv('t_text', 'text', cmdToolsWrapper, 'tool');
                virtualclass.vutil.createDiv('t_activeall', 'activeAll', cmdToolsWrapper, 'tool');
                virtualclass.vutil.createDiv('t_clearall', 'clearAll', cmdToolsWrapper, 'tool');

                virtualclass.wb.socketOn = parseInt(wbUser.socketOn);
                if (virtualclass.wb.socketOn == 1) {
                    virtualclass.wb.utility.setClass('vcanvas', 'socketon');
                }
            },

            //not using
            createCommandWrapper: function () {
                //alert(virtualclass.system.device);
                var cmdToolsWrapper = document.createElement('div');
                cmdToolsWrapper.id = virtualclass.gObj.commandToolsWrapperId;
                var canvasElem = document.getElementById(vcan.canvasWrapperId);
                if (canvasElem != null) {
                    document.getElementById('containerWb').insertBefore(cmdToolsWrapper, canvasElem);
                } else {
                    document.getElementById('containerWb').appendChild(cmdToolsWrapper);
                }
                return cmdToolsWrapper;
            },

            /**
             * this function does create the div
             * toolId expect id for command
             * text expects the text used for particular command
             * TODO this shol
             * this whole output process should come by
             * html not javascript
             *
             * THIS FUNCTION IS NOT USING ANY MORE
             */
            createDiv_old: function (toolId, text, cmdToolsWrapper, cmdClass) {
                //console.log('class name ' + text);
                var toolName = text;
                var text = virtualclass.lang.getString(text);
                var ancTag = document.createElement('a');
                ancTag.href = '#';

                var lDiv = document.createElement('div');
                lDiv.id = toolId;
                if (typeof cmdClass != 'undefined') {
                    lDiv.className = cmdClass;
                }

                var iconButton = document.createElement('span');
                iconButton.className = "icon-" + toolName;
                ancTag.appendChild(iconButton);
//                    
//                    ancTag.appendChild(imgTag);
//                    ancTag.innerHTML = "&nbsp;";
                //ancTag.innerHTML = text;
                //ancTag.title = '';
                ancTag.dataset.title = text;
                ancTag.className = 'tooltip';
//                    ancTag.className = 'tooltip ' + "icon-" +toolName;

                lDiv.appendChild(ancTag);

                if (toolId == 't_reclaim') {
                    var virtualclassCont = document.getElementById(virtualclass.html.id);
                    cmdToolsWrapper.appendChild(lDiv);
                    virtualclassCont.insertBefore(cmdToolsWrapper, virtualclassCont.firstChild);

                } else {
                    cmdToolsWrapper.appendChild(lDiv);
                }
            },
            /**
             * this funciton does create the canvas
             */
            createCanvas: function () {
                var cmdToolsWrapper = document.createElement('div');
                cmdToolsWrapper.id = vcan.canvasWrapperId;
                vcan.canvasWrapperId = cmdToolsWrapper.id;
                var canvas = document.createElement('canvas');
                canvas.id = 'canvas';
                canvas.innerHTML = 'Canvas is missing in your browsers. Please update the latest version of your browser';
                cmdToolsWrapper.appendChild(canvas);
                document.getElementById('containerWb').appendChild(cmdToolsWrapper);
            },

            /**
             * this does call the initializer function for particular object
             * @param expects the mouse down event.
             */
            objInit: function (evt) {
                if (roles.hasControls()) {
                    if (this.parentNode.id != 't_clearall') {
                        //call back function should be used as second parameter
                        // for action on reposnse of user, cancel, okay
                        virtualclass.wb.utility.makeActiveTool(this.parentNode.id);
                    }
                }

                var anchorNode = this;

                /**important **/
                if (anchorNode.parentNode.id == 't_replay') {
                    virtualclass.wb.utility.clearAll(false);
                    virtualclass.vutil.beforeSend({'replayAll': true, 'cf': replayAll});
                } else {
                    virtualclass.wb.toolInit(anchorNode.parentNode.id);
                }

                if (anchorNode.parentNode.id != 't_replay' && anchorNode.parentNode.id != 't_clearall'
                    && anchorNode.parentNode.id != 't_reclaim' && anchorNode.parentNode.id != 't_assign') {
                    var currTime = new Date().getTime();
                    virtualclass.wb.lt = anchorNode.parentNode.id;
                    var obj = {'cmd': anchorNode.parentNode.id, mt: currTime};
                    virtualclass.wb.uid++;
                    obj.uid = virtualclass.wb.uid;
                    vcan.main.replayObjs.push(obj);
                    //recorder.items.push(obj);

                    virtualclass.storage.store(JSON.stringify(vcan.main.replayObjs));
//                        virtualclass.storage.wholeStore(obj);

                    virtualclass.vutil.beforeSend({'repObj': [obj], 'cf': 'repObj'}); //after optimized
                }
                if (this.parentNode.id != 't_clearall') {
                    virtualclass.wb.prvTool = this.parentNode.id;
                    virtualclass.wb.prvToolInfo = obj;
                }
            },

            /**
             *
             * This function does attach the handlers by click the particular object
             * would be triggered eg:- if user click on rectangle link then rectangle
             * object would triggered for create the rectangle object
             * @param id expects the  id of container which contains all the commands of div
             */
            attachToolFunction: function (id, alreadyCreated) {
                virtualclass.wb.createCommand(alreadyCreated);
			
                var allDivs = document.getElementById(id).getElementsByTagName('div');
                for (var i = 0; i < allDivs.length; i++) {
                    //TODO this will have to be fixed as it always assigned t_clearall
                    allDivs[i].getElementsByTagName('a')[0].addEventListener('click', virtualclass.wb.objInit);
                }
            },
            /**
             * By this method the particular function would be initialize
             * eg: if the user click on replay button then  the 'replay' function would initialize
             * @param cmd expects the particular command from user
             *
             */
            toolInit: function (cmd, repMode, multiuser, myfunc) {
                if (typeof virtualclass.wb.obj.drawTextObj == 'object' && virtualclass.wb.obj.drawTextObj.wmode == true) {
                    var ctx = vcan.main.canvas.getContext('2d');
                }
                var allChilds = virtualclass.wb.vcan.getStates('children');
                if (allChilds.length > 0) {
                    if (cmd != 't_clearall') {
                        if (typeof multiuser == 'undefined' || cmd != 't_replay') {
                            virtualclass.wb.utility.deActiveFrmDragDrop(); //after optimization NOTE:- this should have to be enable
                        }
                        if (multiuser != true && cmd != 't_replay') {
                            virtualclass.wb.vcan.renderAll();
                        }
                    }
                } else {
                    virtualclass.wb.vcan.main.action = "create";
                }

                if (!virtualclass.wb.utility.IsObjEmpty(virtualclass.wb.obj.freeDrawObj && multiuser == false)) {
                    virtualclass.wb.obj.freeDrawObj.freesvg = false;
                }

                virtualclass.wb.vcan.main.currUserCommand = cmd + 'Init';

                if (cmd == 't_activeall') {
                    virtualclass.wb.utility.t_activeallInit();
                } else if (cmd == 't_replay') {
                    if (typeof multiuser == 'undefined') {
                        vcan.setValInMain('id', 0);
                    }
                    if (typeof myfunc != 'undefined') {
                        virtualclass.wb.t_replayInit(repMode, myfunc);
                    } else {
                        virtualclass.wb.t_replayInit(repMode);
                    }
                } else if (cmd == 't_clearall') {
                    //if (!virtualclass.popup.confirmInput(virtualclass.lang.getString('clearAllWarnMessage'))) {
                    //    return;
                    //}

                    //virtualclass.wb.utility.makeActiveTool(cmd);
                    ////virtualclass.gObj.video.updateVideoInfo();
                    //virtualclass.wb.utility.t_clearallInit();
                    //virtualclass.wb.utility.makeDefaultValue(cmd);
                    //virtualclass.storage.clearStorageData();
                    //virtualclass.wb.prvTool = cmd;
                    //virtualclass.vutil.beforeSend({'clearAll': true});

                    virtualclass.popup.confirmInput(virtualclass.lang.getString('clearAllWarnMessage'), function (confirm) {
                            if (!confirm) {
                                return true;
                            }

                            //virtualclass.wb.utility.makeActiveTool(cmd);
                            virtualclass.wb.utility.t_clearallInit();
                            virtualclass.wb.utility.makeDefaultValue(cmd);
                            virtualclass.storage.clearSingleTable('wbData');

                            virtualclass.vutil.beforeSend({'clearAll': true, 'cf': 'clearAll'});

                            if (virtualclass.wb.hasOwnProperty('prvToolInfo') && typeof virtualclass.wb.prvToolInfo == 'object'){
                                var cmd = virtualclass.wb.prvToolInfo.cmd;
                            } else {
                                var cmd = 't_triangle';
                            }

                            var anch = document.getElementById(cmd).getElementsByTagName('a')[0];
                            if(anch != null){
                                anch.click();
                            }
                        }
                    );

                } else if (cmd == 't_assign') {
                    var toolHeight = localStorage.getItem('toolHeight');
                    if (toolHeight != null) {
                        virtualclass.vutil.beforeSend({
                            'assignRole': true,
                            'toolHeight': toolHeight,
                            'socket': virtualclass.wb.socketOn
                        });
                    } else {
                        virtualclass.vutil.beforeSend({
                            'assignRole': true,
                            'socket': virtualclass.wb.socketOn,
                            'cf': 'assignRole'
                        });
                    }
                } else if (cmd == 't_reclaim') {
                    virtualclass.wb.utility._reclaimRole();
                }

                if (cmd != 't_activeall' && cmd != 't_replay' && cmd != 't_clearallInit' && cmd != 't_assign'
                    && cmd != 't_reclaim') {
                    virtualclass.wb.tool = new virtualclass.wb.tool_obj(cmd);
                    virtualclass.wb.utility.attachEventHandlers();
                }
            },
            /**
             * The object would be created at core level
             * rectangle object would created  in case of creating the rectangle
             * @param the cmd expects one of the object that user can draw
             * text and free draw are different case than other object
             */
            tool_obj: function (cmd) {
                this.cmd = cmd;
                //when other objecti.
                if (cmd != 't_freeDrawing') {
                    virtualclass.wb.obj.freeDrawObj = "";
                }

                if (cmd != 't_text' && !virtualclass.vutil.exitTextWrapper()) {
                    virtualclass.wb.obj.drawTextObj = "";
                }

                if (cmd == 't_freeDrawing') {
                    //NOTE:- this is added during the UNIT testing
                    var borderColor = "#424240";
                    var linWidth = "3";
                    virtualclass.wb.obj.freeDrawObj = new virtualclass.wb.readyFreeHandObj(borderColor, linWidth);
                    virtualclass.wb.obj.freeDrawObj.init();

                    //below line is commented out during unit testing
                    //virtualclass.wb.vcan.main.mcanvas = virtualclass.wb.canvas; //TODO this should be control because it is used inside the

                } else if (cmd == 't_text') {
                    //   virtualclass.vutil.attachClickOutSideCanvas();
                    virtualclass.wb.obj.drawTextObj = new virtualclass.wb.readyTextObj();
                    virtualclass.wb.obj.drawTextObj.init("canvasWrapper");
                }

                var mCmd = cmd.slice(2, cmd.length);

                virtualclass.wb.draw_object(mCmd, virtualclass.wb.canvas, this)
            },
            /**
             * This function does initiates replay function after click on replay button
             * it replays all the object the user would drawn
             */
            t_replayInit: function (repMode, myfunc) {
                //virtualclass.wb.replay = virtualclass.wb._replay();
                if (repMode == 'fromFile') {
                    virtualclass.gObj.chat.removeAllChat();
                    virtualclass.wb.recordAudio = true;
                    virtualclass.recorder.init();
                } else {
                    virtualclass.wb.replay = virtualclass.wb._replay();
                    if (typeof myfunc != 'undefined') {
                        virtualclass.wb.replay.init(repMode, myfunc);
                        virtualclass.wb.replay.renderObj(myfunc);
                    } else {
                        virtualclass.wb.replay.init(repMode);
                        virtualclass.wb.replay.renderObj();
                    }
                }
            }
        };
    };
    window.whiteboard = whiteboard;
})(window, document);
