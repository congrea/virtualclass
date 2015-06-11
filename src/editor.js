// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**
 * By this file we are creating the Editor
 * It depends on parameters what kind of editor(Rich Text or Code editor would be created)
 *
 * @Copyright 2015  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 *
 *
  */
(
    function(window) {
        "use strict";

        //this is main class
        var  editor = function(type, containerId, editorId) {
            this.etype = type;
            var that = this;

            //TODO this should be dynamic
            if(type == 'editor'){
                var editorType = { lineWrapping: true };
                var richEditorToolbar =  {richTextToolbar: true, richTextShortcuts: true};
            } else{
                var editorType =  {lineNumbers: true, mode : 'markdown'};
                var richEditorToolbar = {defaultText: 'Markdown Editor '};
            }

            return {
                etype : type,
                cm : '',
                vcAdapter : "",
                initialised :false,
                prvEdRev : 0,
                dataReqTry : 0,
                stroageData : localStorage.getItem(this.etype+'_allEditorOperations'),
                stroageDataRev : localStorage.getItem(this.etype+'_edOperationRev'),
                readonly : false,


                /**
                 *  Get the data from localStorage
                 *  initialise that data to editor if available
                 *  if data is not available,
                 *  the function requests the data from teacher in case of student
                 */
                veryInit : function (){
                    if(this.stroageData != null){
                        var wrappedOperation = JSON.parse(this.stroageData);
                        var docs = JSON.parse(wrappedOperation.data);
                        if(virtualclass.hasOwnProperty('currAppEditor')){
                            if(virtualclass.currAppEditorType == this.etype){
                                this.initialiseDataWithEditor(docs, 'displayEditor', virtualclass.currAppEditorType);
                            } else {
                                this.initialiseDataWithEditor(docs);
                            }
                        } else {
                            this.initialiseDataWithEditor(docs);
                        }
                    }else {
                        if(virtualclass.gObj.uRole == 's'){
                            this.requestData('from_' + virtualclass.gObj.uRole);
                        }
                    }
                },

                /**
                 * Initialise the Editor at very first when user click on click Or get command
                 * from other user
                 * @param revision expects revision document with editor
                 * @param clients client number
                 * @param docs expect wrapped datas
                 * @param operations expect operations of docs
                 */
                init : function (revision, clients, docs, operations) {
                    var docsInfo = {};
                    if(typeof revision != 'undefined'){ docsInfo.revision =  revision;}
                    if(typeof clients != 'undefined'){ docsInfo.clients =  clients;}
                    if(typeof docs != 'undefined'){ docsInfo.doc =  docs;}
                    if(typeof operations != 'undefined'){ docsInfo.operations =  operations;}


                    if(!this.cm && typeof this.cm != 'object'){
                        this.codemirrorWithLayout(editorType);
                        this.createEditorClient(richEditorToolbar, docsInfo);

                    }else {
                        virtualclass.dispvirtualclassLayout(virtualclass.currApp); //
                    }

                    if(virtualclass.gObj.uRole == 't'){
                        io.send({eddata : 'init', et: this.etype});
                    }

                },
                /***
                 *
                 * @param defaultInfo
                 * @param docsInfo
                 */
                createEditorClient : function (defaultInfo, docsInfo){
                    if(virtualclass.isPlayMode){
                        this.readOnlyMode('disable', 'notCreateSyncBox');
                    }
                    Firepad.fromCodeMirror({}, this.cm, defaultInfo, docsInfo);
                },

                /**
                 * Create the code mirror with layout
                 * @param mode expect type  of editor
                 */
                codemirrorWithLayout : function (mode){
                    this.UI.container(this.etype);
                    var edElem = document.getElementById(this.UI.edId);

                    if(typeof  this.cm  != 'object'){
                        this.cm = CodeMirror(document.getElementById(this.UI.edId), mode);
                    }
                },

                /**
                 * requst the data from other use if data is missed at local
                 * @param byRequest expects from request is coming from
                 * @param withDiffUser is flag for try with different user
                 */
                requestData : function (byRequest, withDiffUser){
                    var toUser = '';
                    for(var i=0; i < virtualclass.connectedUsers.length; i++){
                        if(virtualclass.gObj.uid != virtualclass.connectedUsers[i].userid) {
                            if(virtualclass.connectedUsers[i].role == 't'){
                                if(typeof withDiffUser != 'undefined'){
                                    if((!this.hasOwnProperty('toAlreadyRequestUser') || (this.toAlreadyRequestUser != virtualclass.connectedUsers[i].userid))){
                                        //io.send({'eddata': 'requestForEditorData'}, virtualclass.connectedUsers[i].userid);
                                        toUser = virtualclass.connectedUsers[i].userid;
                                        this.toAlreadyRequestUser = virtualclass.connectedUsers[i].userid;
                                        this.dataReqTry++;
                                        break;
                                    }
                                }else {
                                    toUser = virtualclass.connectedUsers[i].userid;
                                    break;
                                }

                            }else{
                                toUser = virtualclass.connectedUsers[i].userid;
                                break;
                            }
                        }
                    }

                    if(toUser != '' && typeof toUser != 'undefined' &&  io.sock != null){
                         if(io.sock.readyState == 1){
                             io.send({'eddata': 'requestForEditorData', et: this.etype}, toUser);
                         }
                        //this.cm.readOnly(true);
                        this.readOnlyMode('disable');
                    }
                },

                readOnlyMode : function (mode, notcreateBox){
                    if(typeof this.cm == 'object'){
                        if(mode == 'disable'){
                            if(!this.readonly){
                                this.cm.setOption("readOnly", true);
                                if(typeof notcreateBox == ''){
                                    this.UI.createSynchMessageBox();
                                }
                                this.readonly = true;
                            }
                        } else {
                            if(this.readonly && !virtualclass.isPlayMode){
                                this.cm.setOption("readOnly", false);
                                this.UI.hideSynchMessageBox();
                                this.readonly = false;
                            }
                        }
                    }
                },


                /**
                 *  Handle all the responses related to editor coming from server
                 * @param e expects event parameter
                 * @param etype expects editor type
                 */
                onmessage : function (e, etype){
                    //at student
                    //second condition is need because e.message.fromuser and virtualclass.gob.uid are same

                    //TODO this all if and else condition should be simplyfy
                    if(e.message.eddata == 'currAppEditor'){
                        if(e.fromUser.userid != virtualclass.gObj.userid){
                            virtualclass.currAppEditor = true;
                            virtualclass.currAppEditorType = e.message.et;
                        }
                        return;
                    }

                    if(((e.message.eddata === 'init')  && e.fromUser.userid != virtualclass.gObj.uid) ||
                        (e.message.eddata === 'init' &&  wbUser.virtualclassPlay == '1')){
                        virtualclass.makeAppReady(etype);
                    }

                    if(e.message.eddata == 'noDataForEditor'){
                        if(virtualclass.gObj.uRole == 't'){
                           // this.requestData('fromTeacher', 'withDifStudent');
                        }
                        return;
                    } else if(e.message.eddata == 'initVcEditor'){
                        console.log('action initVcEditor');
                        if((virtualclass.gObj.uRole != 't') ||
                            (virtualclass.gObj.uRole == 't' && e.message.hasOwnProperty('resFromUser') && e.fromUser.userid != virtualclass.gObj.uid)){
                            var doc = JSON.parse(e.message.data);
                            if(e.message.hasOwnProperty('layoutEd')){
                                this.initialiseDataWithEditor(doc, "displayEditor", e.message.et);
                            } else {
                                this.initialiseDataWithEditor(doc);
                            }
                        }
                    }else if( e.message.eddata == 'requestForEditorData'){
                        if(e.fromUser.userid != virtualclass.gObj.uid){
                            if(typeof this.vcAdapter != 'object' || this.vcAdapter.operations.length == 0){
                                io.send({'eddata' : 'noDataForEditor'});
                                return;
                            }

                            this.initVcEditor({toUser : e.fromUser.userid});

                        }

                    } else {
                        if(typeof this.vcAdapter == 'object'){
                            if(e.message.eddata == 'virtualclass-editor-operation'){
                                if(this.readonly){
                                    //At received of some packet, if there would enabled readOnlyMode, we disabled it
                                    this.readOnlyMode('enable');
                                }
                            }

                            this.vcAdapter.receivedMessage(e);

                        }else{
                            if(virtualclass.gObj.uRole == 't' && e.message.eddata == 'virtualclass-editor-operation'){
                                virtualclass.makeAppReady(etype);
                                this.vcAdapter.receivedMessage(e);
                            }

                            console.log("virtualclass adapter is not ready for editor");
                        }
            }
                },

                /**
                 * this object is used for user interace of Editor
                 */
                UI: {
                    id: containerId,
                    class: 'vmApp virtualclass',
                    edId : editorId,
                    /**
                     * Create container of editor
                     * @param classes expect class name for container
                     */
                    container: function (classes) {
                        if (document.getElementById(this.id) == null) {
                            var divEditor = document.createElement('div');
                            divEditor.id = this.id;
                            divEditor.className = this.class + ' ' + classes;

                            var editor = document.createElement('div');
                            editor.id =  this.edId;

                            divEditor.appendChild(editor);

                            var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                            document.getElementById(virtualclass.html.id).insertBefore(divEditor, beforeAppend);
                        }
                    },

                    /**
                     * Create synchronizing message box
                     * to user for wating
                     */
                    createSynchMessageBox : function (){
                        if(document.getElementById('synchMessageBox') != null){
                            this.showSynchMessageBox();
                        } else {
                            var msgBox = document.createElement('div');
                            msgBox.id = 'synchMessageBox';
                            msgBox.style.width = "340px";
                            msgBox.style.height = "15px";


                            var msg = document.createElement('p');
                            msg.id = 'readOnlyMsg';
                            msg.innerHTML = "Please wait a while.  Synchronizing with new content.";
                            msgBox.appendChild(msg);

                            var parTag = document.getElementById(this.id);
                            parTag.insertBefore(msgBox, parTag.firstChild);
                        }
                    },

                    showSynchMessageBox : function (){
                        var synchMessageBox = document.getElementById('synchMessageBox');
                        if(synchMessageBox != null){
                            synchMessageBox.display = 'block';
                        }

                    },

                    hideSynchMessageBox : function (){
                        var synchMessageBox = document.getElementById('synchMessageBox');
                        if(synchMessageBox != null){
                            synchMessageBox.display = 'none';
                        }
                    }
                },

                //sending the editor packets for requested user
                //reponse request data
                initVcEditor : function (appIsEditor){

                    var initPacket = this.getWrappedOperations();
                    if(typeof appIsEditor != 'undefined'){
                        if((appIsEditor.hasOwnProperty('editor') || appIsEditor.hasOwnProperty('editorCode')) || this.isEidtorWithTeacher()){
                            initPacket.layoutEd  = "1";  //this would be for create editor layout
                            initPacket.cet = virtualclass.currApp;
                            initPacket.et = this.etype;
                        }

                        if(appIsEditor.hasOwnProperty('toUser')){
                            initPacket.resFromUser = true;
                        }

                        io.send(initPacket, appIsEditor.toUser);
                    }else {
                        io.send(initPacket);
                    }
                },

                /**
                 * Check if teacher editor of teacher is
                 * @returns {boolean}
                 */
                isEidtorWithTeacher : function(){
                    return (virtualclass.gObj.uRole == 't' && (virtualclass.currApp == 'Editor' || virtualclass.currApp == 'EditorCode'));
                },

                getWrappedOperations : function (){
                    var operations = this.vcAdapter && this.vcAdapter.operations ? serialiseOps(this.vcAdapter.operations): [];
                    // We only want the most recent 50 because we can't send too much data

                    //if (operations.length > 50) {
                    //    operations = operations.slice(operations.length - 50);
                    //}

                    var wrappedOperations = {
                        eddata: 'initVcEditor',
                        data: JSON.stringify({
                            revision: this.cmClient.revision,
                            clients: [],
                            str: this.cm.getValue(), //cm is my code mirror
                            operations: operations
                        }),
                        et : this.etype
                    }

                    return wrappedOperations;
                },

                /**
                 * Remove the Code Mirror from DOM
                 * and make empty of code mirror object
                 */
                removeCodeMirror : function (){
                    this.readonly = false;
                    var uiCont = document.getElementById(this.UI.id)
                    if(uiCont != null){
                        uiCont.parentNode.removeChild(uiCont);
                    }
                    this.cm = "";
                },


                // After editor packets recived from teacher
                // will set with code mirror, and apply the operations agains text transform
                initialiseDataWithEditor : function (doc, displayEditor, et) {
                    if(typeof displayEditor != 'undefined'){
                        //virtualclass.currApp = virtualclass.apps[3];
                        if(virtualclass.currAppEditor){
                            if(virtualclass.currAppEditorType == et){
                                virtualclass.currApp = et;
                            }
                        }else{
                            virtualclass.currApp = et;
                        }
                    }

                    this.removeCodeMirror();
                    this.codemirrorWithLayout(editorType);
                    virtualclass.dispvirtualclassLayout(virtualclass.currApp);
                    if ((this.cm)) {
                        if (this.cm.getValue() !== doc.str) {
                            var cmElem = document.getElementById(this.UI.edId);

                            console.log('new string set');

                            this.cmClient = "";
                            this.vcAdapter = "";

                            doc.operations = deserialiseOps(doc.operations);
                            doc.doc = doc.str;

                            this.createEditorClient(richEditorToolbar, doc);
                            this.prvEdRev = doc.revision;
                        }
                    }

                    for(var  i=0; i<doc.operations.length; i++){
                        this.vcAdapter.trigger('operation', doc.operations[i].wrapped.toJSON());
                    }

                    this.cm.refresh();

                    if( virtualclass.currApp == 'Editor'){
                        virtualclass.previous = 'virtualclass' + virtualclass.currApp ;
                        virtualclass.system.setAppDimension(virtualclass.currApp);
                    }

                    var editorTool = document.getElementById("virtualclassEditorTool");
                    if(editorTool  != null){
                        editorTool.style.pointerEvents = 'visible';
                    }

                },

                /**
                 * removing error data from local storage
                 * and from inline memoery
                 */
                removeEditorData : function (){
                    if(typeof this.vcAdapter == 'object' ){
                         this.vcAdapter.operations.length = 0;
                    }
                    localStorage.removeItem(this.etype +'_allEditorOperations');
                    localStorage.removeItem(this.etype + '_edOperationRev');
                },

                /**
                 * Save the editor data in to local storage
                 */
                saveIntoLocalStorage : function (){
                    if((typeof this.vcAdapter == 'object' && this.vcAdapter.operations.length > 0)){
                        var wrappedOperations = this.getWrappedOperations();
                        localStorage.removeItem(this.etype+'_allEditorOperations');
                        localStorage.setItem(this.etype+'_allEditorOperations',  JSON.stringify(wrappedOperations));
                        localStorage.setItem(this.etype+'_edOperationRev',  this.cmClient.revision);

                    }
                }
            }
        };

        // Turns the Array of operation Objects into an Array of JSON stringifyable objects
        var serialiseOps = function (operations) {
            return operations.map(function (op) {
                return {
                    operation: op.wrapped.toJSON()
                };
            });
        };

        // Turns the JSON form of the Array of operations into ot.TextOperations
        var deserialiseOps = function (operations) {
            var vcEditor = Firepad.getvcEditor();
            return operations.map(function (op) {
                return new vcEditor.WrappedOperation(
                    vcEditor.TextOperation.fromJSON(op.operation),
                    op.cursor && vcEditor.Cursor.fromJSON(op.cursor)
                );
            });
        };

    window.editor = editor;
})(window);
