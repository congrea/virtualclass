// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window, document) {
        var io = window.io;
        var i = 0;
        /**
         * This is the main object which has properties and methods
         * Through this properties and methods all the front stuff is happening
         * eg:- creating, storing and replaying the objects 
         */
        
        var whiteboard  = function (config) { 
            var id = config.hasOwnProperty('id') ? config.id : "appWhitebaordCont";
            var classes = config.hasOwnProperty('class');
            
            return {
                id : id,
                classes : classes,
                tool: '',
                obj: {},
                prvObj: '',
                replayTime: 0,
                sentPackets: 0,
                sentPackDiv: 'sentPacket',
                sentPackDivPS: 'sentPacketPS',
                receivedPackets: 0,
                receivedPackDiv: 'receivedNumber',
                receivedPackDivPS: 'receivedNumberPS',
                uid: 0,
                lt: '',
                commandToolsWrapperId: 'commandToolsWrapper',
                //these are top level object
//                error: [],
                view:  {}, // For display important message to user
                lang:  {},
                system:{},
                user : {},
                gObj: {
                    myrepObj : [],
                    replayObjs : [],
                    myArr : [],
                    displayedObjId : 0,
                    packQueue : [],
                    virtualWindow : false
                }, // For store the global oject
                
                
                
                /**
                 * This function basically does create the canvas on which 
                 * the user draws the various object
                 * @param window the function gets the window object as parameter
                 *    
                 */
                init: function() {
                    
                    vApp.wb.vcan = window.vcan; //this would be done because of possibility of conflict
                    var vcan = vApp.wb.vcan;
                    vApp.wb.canvas = vcan.create('#canvas');
                    var canvasObj = vcan.main.canvas;
                    canvasObj.setAttribute('tabindex', '0');  //this does for set chrome
                    canvasObj.focus();

                    //IMPORTANT  this is changed during the UNIT testing
                    //onkeydown event is working into all browser.
                    canvasObj.onkeydown = vApp.wb.utility.keyOperation;

                    vApp.system.setCanvasDimension();
                    if (typeof (Storage) !== "undefined") {
                        if (localStorage.repObjs) {
                           // var replayObjs = JSON.parse(localStorage.repObjs);
                        }
                        window.vApp.wb = vApp.wb;
                    }

                    this.arrowInit();
                    var oldData = vApp.wb.sentPackets;
                    
                    // It's important
                    // Earlier it was vApp.clear
                    vApp.clear2 = setInterval(function() {
                        if (document.getElementById(vApp.wb.sentPackDivPS) != null) {
                            oldData = vApp.wb.utility.calcPsSentPackets(oldData);
                            document.getElementById(vApp.wb.sentPackDiv).innerHTML = vApp.wb.sentPackets;  //update total packets
                        }
                    }, 1000);
                    
                    this._init();
                },
                
                _init : function (){
                    if(!vApp.vutil.chkValueInLocalStorage('orginalTeacherId')){
                        vApp.wb.pageEnteredTime = new Date().getTime();
                        localStorage.setItem('pageEnteredTime',  vApp.wb.pageEnteredTime);
                    }else{
                        vApp.wb.pageEnteredTime = localStorage.getItem('pageEnteredTime');
                    }

                    vApp.wb.oTeacher = vApp.vutil.chkValueInLocalStorage('orginalTeacherId');

                    if(vApp.vutil.chkValueInLocalStorage('rcvdPackId')){
                        vApp.wb.gObj.rcvdPackId = parseInt(localStorage.rcvdPackId);
                    }else{
                        vApp.wb.gObj.rcvdPackId = 0;
                    }

                    // vApp.wb.utility.displayCanvas();
                    
                    if(vApp.gObj.uRole == 't'){
                        window.addEventListener('resize', 
                            function (){
                                if(vApp.currApp == 'Whiteboard'){
//                                    alert('sss');
//                                    debugger;
                                    //alert(vApp.currApp);
                                    vApp.wb.utility.lockCanvas();
                                }
                            }
                        );
                    }
                    
                    window.addEventListener('click', function (){
                        vApp.wb.view.disappearBox('WebRtc')
                        vApp.wb.view.disappearBox('Canvas');
                        vApp.wb.view.disappearBox('drawArea');
                    });

                    var storageHasReclaim = vApp.vutil.chkValueInLocalStorage('reclaim');
                    
                    this.stHasTeacher = vApp.vutil.chkValueInLocalStorage('teacherId');
                    
                    // 24
//                    vApp.wb.utility.setUserStatus(this.stHasTeacher, storageHasReclaim);

                    if(vApp.vutil.chkValueInLocalStorage('reclaim')){
//
//                        var cmdToolsWrapper = document.getElementById(vApp.wb.commandToolsWrapperId);
//                        if(cmdToolsWrapper != null){
//                            while(cmdToolsWrapper.hasChildNodes()){
//                                cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
//                            }
//                        }
//                        
                        var cmdToolsWrapper = vApp.wb.createCommandWrapper();
                        vApp.wb.utility.createReclaimButton(cmdToolsWrapper);
                        vApp.gObj.uRole = 's';
                        
                    }
                    if(this.stHasTeacher){
                        vApp.gObj.uRole = 't';
                    }
                    
                    vApp.wb.utility.crateCanvasDrawMesssage();
                },
                
                
                /**
                 * this function called the image function
                 * for initialize the arrow
                 */
                arrowInit: function() {
                    this.arrImg = new Image();
                    this.arrImg.src = (typeof window.whiteboardPath != 'undefined') ? window.whiteboardPath + '/images/arrow.png' : '/images/arrow.png';
                    this.arrImgDraw = false;
                    var wb = this;
                    this.arrImg.onload = function() {
                        wb.arrImgDraw = true;
                    };
                },
                /**
                 * this function does create the command interface  
                 */
                createCommand: function() {

                    var alreadyCreated = vApp.wb.utility.alreadyExistToolBar();
                    if (alreadyCreated) {
                        return true;
                    }

//                    var cmdToolsWrapper = document.createElement('div');
//                    cmdToolsWrapper.id = vApp.wb.commandToolsWrapperId;
//                    var canvasElem = document.getElementById(vcan.canvasWrapperId);
//                    if (canvasElem != null) {
//                        document.getElementById('containerWb').insertBefore(cmdToolsWrapper, canvasElem);
//                    } else {
//                        document.getElementById('containerWb').appendChild(cmdToolsWrapper);
//                    }
                    
                    var cmdToolsWrapper = this.createCommandWrapper();
                    vApp.wb.createDiv('t_rectangle', 'rectangle', cmdToolsWrapper, 'tool');
                    vApp.wb.createDiv('t_line', 'line', cmdToolsWrapper, 'tool');
                    vApp.wb.createDiv('t_freeDrawing', 'freeDrawing', cmdToolsWrapper, 'tool');
                    vApp.wb.createDiv('t_oval', 'oval', cmdToolsWrapper, 'tool');
                    vApp.wb.createDiv('t_triangle', 'triangle', cmdToolsWrapper, 'tool');
                    vApp.wb.createDiv('t_text', 'text', cmdToolsWrapper, 'tool');
                    vApp.wb.createDiv('t_activeall', 'activeAll', cmdToolsWrapper, 'tool');
                    vApp.wb.createDiv('t_clearall', 'clearAll', cmdToolsWrapper, 'tool');

                    vApp.wb.createDiv('t_replay', 'Replay', cmdToolsWrapper, 'tool');

                    vApp.wb.socketOn = parseInt(wbUser.socketOn);
                    if (vApp.wb.socketOn == 1) {
                        vApp.wb.utility.setClass('vcanvas', 'socketon');
                    }
                },
                
                createCommandWrapper : function (){
                    var cmdToolsWrapper = document.createElement('div');
                    cmdToolsWrapper.id = vApp.wb.commandToolsWrapperId;
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
                 */
                createDiv: function(toolId, text, cmdToolsWrapper, cmdClass) {
                    var ancTag = document.createElement('a');
                    ancTag.href = '#';

                    var lDiv = document.createElement('div');
                    lDiv.id = toolId;
                    if (typeof cmdClass != 'undefined') {
                        lDiv.className = cmdClass;
                    }
                    
//                    if(localStorage.getItem('activeTool') !=  null){
                        
//                        var activeTool = localStorage.getItem('activeTool')
//                        if(activeTool == toolId){
//                            lDiv.className = lDiv.className + " active";
//                        }
//                    }
                    
                    

                    var imgTag = document.createElement('img');
                    imgTag.alt = vApp.lang.getString(text);
                    if(typeof window.whiteboardPath != 'undefined'){
                        imgTag.src = window.whiteboardPath + '/images/' + text + ".png";
                    }else{
                        imgTag.src = '/images/' + text + ".png";
                    }
                    ancTag.appendChild(imgTag);
                    ancTag.title = '';
                    ancTag.dataset.title = text;
                    ancTag.className = 'tooltip';

                    lDiv.appendChild(ancTag);
                    
                    if(toolId == 't_reclaim'){
                        var vAppCont = document.getElementById(vApp.html.id);
                        cmdToolsWrapper.appendChild(lDiv);
                        vAppCont.insertBefore(cmdToolsWrapper, vAppCont.firstChild);
                        
                    }else{
                        cmdToolsWrapper.appendChild(lDiv);
                    }
                    //var canvasElem = document.getElementById(vcan.canvasWrapperId);

                },
                /**
                 * this funciton does create the canvas
                 */
                createCanvas: function() {
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
                objInit: function(evt) {
                    
//                    var classes;
//                    if(vApp.wb.hasOwnProperty('prvTool')){
//                        classes = vApp.wb.utility.removeClassFromElement(vApp.wb.prvTool,  "active");
//                        document.getElementById(vApp.wb.prvTool).className = classes;
//                    }else{
//                        classes =  this.parentNode.className; 
//                    }
//                    this.parentNode.className = classes + " active";
                    
                    if(vApp.gObj.uRole == 't'){
                        vApp.wb.utility.makeActiveTool(this.parentNode.id);
                    }
                    
                    var anchorNode = this;
                    /**important **/
                    if (anchorNode.parentNode.id == 't_replay') {
                        vApp.wb.utility.clearAll(false);
                        vApp.wb.utility.beforeSend({'replayAll': true});
                    } else {
                        vApp.wb.toolInit(anchorNode.parentNode.id);
                    }

                    if (anchorNode.parentNode.id != 't_replay' && anchorNode.parentNode.id != 't_clearall'
                            && anchorNode.parentNode.id != 't_reclaim' && anchorNode.parentNode.id != 't_assign') {
                        var currTime = new Date().getTime();
                        vApp.wb.lt = anchorNode.parentNode.id;
                        var obj = {'cmd': anchorNode.parentNode.id, mt: currTime};
                        vApp.wb.uid++;
                        obj.uid = vApp.wb.uid;
                        vcan.main.replayObjs.push(obj);
                        //recorder.items.push(obj);
                        
                        vApp.storage.wholeStore(obj);
                        
                        vApp.wb.utility.beforeSend({'repObj': [obj]}); //after optimized
                    }
                    
                    vApp.wb.prvTool = this.parentNode.id;
                    
                },
                
                /**
                 * 
                 * This function does attach the handlers by click the particular object
                 * would be triggered eg:- if user click on rectangle link then rectangle
                 * object would triggered for create the rectangle object
                 * @param id expects the  id of container which contains all the commands of div
                 */
                attachToolFunction: function(id, alreadyCreated) {
                    //console.log('suman bogati my name');
//                    vcan.canvasWrapperId = 'canvasWrapper';

                    vApp.wb.createCommand(alreadyCreated);
                    if (typeof alreadyCreated == 'undefined') {
                        
//                        if (document.getElementById('canvas') == null) {
//                            vApp.wb.createCanvas();
//                        }
                        
                        var orginalTeacherId = vApp.vutil.chkValueInLocalStorage('orginalTeacherId');
                        vApp.wb.dataInfo = parseInt(wbUser.dataInfo);
                        if (orginalTeacherId && vApp.wb.dataInfo == 1) {
                            if (!vApp.wb.utility.alreadyExistPacketContainer()) {
                                vApp.wb.packContainer.createPacketContainer();
                                vApp.wb.packContainer.createPacketInfoContainer();
                                vApp.wb.utility.initStoredPacketsNumbers();
                            }
                        }
                    }

                    var allDivs = document.getElementById(id).getElementsByTagName('div');
                    for (var i = 0; i < allDivs.length; i++) {
                        //TODO this will have to be fixed as it always assigned t_clearall
                        allDivs[i].getElementsByTagName('a')[0].addEventListener('click', vApp.wb.objInit);
                    }
                },
                /**
                 * By this method the particular function would be initialize
                 * eg: if the user click on replay button then  the 'replay' function would initialize   
                 * @param cmd expects the particular command from user
                 * 
                 */
                toolInit: function(cmd, repMode, multiuser, myfunc) {
                    if (typeof vApp.wb.obj.drawTextObj == 'object' && vApp.wb.obj.drawTextObj.wmode == true) {
                        var ctx = vcan.main.canvas.getContext('2d');
                    }

                    var allChilds = vApp.wb.vcan.getStates('children');

                    if (allChilds.length > 0 && cmd != 't_clearall') {
                        if (typeof multiuser == 'undefined' || cmd != 't_replay') {
                            vApp.wb.utility.deActiveFrmDragDrop(); //after optimization NOTE:- this should have to be enable
                        }
                        if (multiuser != true && cmd != 't_replay') {
                            vApp.wb.vcan.renderAll();
                        }
                    }
                    if (!vApp.wb.utility.IsObjEmpty(vApp.wb.obj.freeDrawObj && multiuser == false)) {
                        vApp.wb.obj.freeDrawObj.freesvg = false;
                    }

                    vApp.wb.vcan.main.currUserCommand = cmd + 'Init';

                    if (cmd == 't_activeall') {
                        vApp.wb.utility.t_activeallInit();
                    }

                    if (cmd == 't_replay') {
                        if (typeof multiuser == 'undefined') {
                            vcan.setValInMain('id', 0);
                        }
                        if (typeof myfunc != 'undefined') {
                            //alert('via socket');
                            
                            vApp.wb.t_replayInit(repMode, myfunc);
                        } else {
                            //alert('via click');
                            vApp.wb.t_replayInit(repMode);
                        }
                    }

                    if (cmd == 't_clearall') {
                        var userInput = confirm(vApp.lang.getString('clearAllWarnMessage'));
                        if (!userInput) {
                            return;
                        }

                        //vApp.gObj.video.updateVideoInfo();
                        vApp.wb.utility.t_clearallInit();
                        vApp.wb.utility.makeDefaultValue();
                        vApp.storage.clearStorageData();
                        
                        vApp.wb.utility.beforeSend({'clearAll': true});
                    }

                    if (cmd == 't_assign') {
                   //     vApp.wb.utility.assignRole();
                        
                        var toolHeight = localStorage.getItem('toolHeight');
                        if (toolHeight != null) {
                              vApp.wb.utility.beforeSend({'assignRole': true, 'toolHeight': toolHeight, 'socket': vApp.wb.socketOn});
                        } else {
                            vApp.wb.utility.beforeSend({'assignRole': true, 'socket': vApp.wb.socketOn});
                        }
                    }

                    if (cmd == 't_reclaim') {
                        vApp.wb.utility._reclaimRole();
                        
//                        vApp.wb.utility.reclaimRole();
//                        vApp.wb.utility.sendRequest('reclaimRole', true);
                    }
                    
                    

                    if (cmd != 't_activeall' && cmd != 't_replay' && cmd != 't_clearallInit' && cmd != 't_assign'
                            && cmd != 't_reclaim') {
                        vApp.wb.tool = new vApp.wb.tool_obj(cmd)
                        vApp.wb.utility.attachEventHandlers();
                    }
                },
                /**
                 * The object would be created at core level 
                 * rectangle object would created  in case of creating the rectangle
                 * @param the cmd expects one of the object that user can draw
                 * text and free draw are different case than other object
                 */
                tool_obj: function(cmd) {
                    this.cmd = cmd;
                    //when other objecti.
                    if (cmd != 't_freeDrawing') {
                        vApp.wb.obj.freeDrawObj = "";
                    }

                    if (cmd != 't_text') {
                        vApp.wb.obj.drawTextObj = "";
                    }

                    if (cmd == 't_freeDrawing') {
                        //NOTE:- this is added during the UNIT testing
                        var borderColor = "#424240";
                        var linWidth = "3";
                        vApp.wb.obj.freeDrawObj = new vApp.wb.readyFreeHandObj(borderColor, linWidth);
                        vApp.wb.obj.freeDrawObj.init();

                        //below line is commented out during unit testing
                        //vApp.wb.vcan.main.mcanvas = vApp.wb.canvas; //TODO this should be control because it is used inside the

                    } else if (cmd == 't_text') {
                        vApp.wb.obj.drawTextObj = new vApp.wb.readyTextObj();
                        vApp.wb.obj.drawTextObj.init("canvasWrapper");
                    }

                    var mCmd = cmd.slice(2, cmd.length);

                    vApp.wb.draw_object(mCmd, vApp.wb.canvas, this)
                },
                /**
                 * This function does initiates replay function after click on replay button 
                 * it replays all the object the user would drawn 
                 */
                t_replayInit: function(repMode, myfunc) {
                    //vApp.wb.replay = vApp.wb._replay();
                    if(repMode == 'fromFile'){
                        vApp.gObj.chat.removeAllChat();
                        
//                        if(vAppObj.gObj.chat.isAvailable()){
//                            vAppObj.gObj.chat.removeAllChat();
//                        }
                        
                        vApp.wb.recordAudio = true;
                        //var audioRepTime = vApp.wb.recordStarted - vApp.wb.pageEnteredTime;
                        
//                        console.log("audioRepTime " + audioRepTime);
                        vApp.recorder.init();
                        
//                        var obj = vApp.recorder.objs[0];
//                        var repTime = obj.mt - vApp.wb.pageEnteredTime;
//                     
//                        setTimeout(
//                            function (){
//                                vApp.recorder.renderObj();
//                            },
//                            repTime
//                        );
//                        
//                        setTimeout(
//                            function (){
//                                if(typeof vApp.gObj.video != 'undefined'){
//                                    //vApp.gObj.video.audio.replay(0, 0);
//                                    vApp.gObj.video.audio.replayInit();
//                                }
//                            },
//                            audioRepTime
//                        );
                
                    }else{
                        vApp.wb.replay = vApp.wb._replay();
                        if (typeof myfunc != 'undefined') {
                            vApp.wb.replay.init(repMode, myfunc);
                            vApp.wb.replay.renderObj(myfunc);
                        }else {
                            vApp.wb.replay.init(repMode);
                            vApp.wb.replay.renderObj();
                        }
                    }
                }
            };
    }
    
    window.whiteboard = whiteboard;
    
})(window, document);
