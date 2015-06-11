// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2015  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        "use strict";
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


                veryInit : function (){
                    if(this.stroageData != null){
                        var wrappedOperation = JSON.parse(this.stroageData);
                        var docs = JSON.parse(wrappedOperation.data);
                        if(virtualclass.hasOwnProperty('currAppEditor')){
                            if(virtualclass.currAppEditorType == this.etype){
                                this.initialiseDoc(docs, 'displayEditor', virtualclass.currAppEditorType);
                            } else {
                                this.initialiseDoc(docs);
                            }

                        } else {
                            this.initialiseDoc(docs);
                        }
                    }else {
                        if(virtualclass.gObj.uRole == 's'){
                            this.requestData('from_' + virtualclass.gObj.uRole);
                        }
                    }
                },

                init : function (revision, clients, docs, operations) {
                    var docsInfo = {};
                    if(typeof revision != 'undefined'){ docsInfo.revision =  revision;}
                    if(typeof clients != 'undefined'){ docsInfo.clients =  clients;}
                    if(typeof docs != 'undefined'){ docsInfo.doc =  docs;}
                    if(typeof operations != 'undefined'){ docsInfo.operations =  operations;}


                    if(!this.cm && typeof this.cm != 'object'){
                        this.cmLayout(editorType);
                        this.createEditorClient(richEditorToolbar, docsInfo);

                    }else {
                        virtualclass.dispvirtualclassLayout(virtualclass.currApp); //
                    }

                    if(virtualclass.gObj.uRole == 't'){
                        io.send({eddata : 'init', et: this.etype});
                    }

                },

                createEditorClient : function (defaultInfo, docsInfo){
                    if(virtualclass.isPlayMode){
                        this.readOnlyMode('disable', 'notCreateSyncBox');
                    }
                    Firepad.fromCodeMirror({}, this.cm, defaultInfo, docsInfo);
                },

                cmLayout : function (mode){
                    var editorType = "richText";
                    this.UI.container(editorType);
                    var edElem = document.getElementById(this.UI.edId);

                    if(typeof  this.cm  != 'object'){
                        this.cm = CodeMirror(document.getElementById(this.UI.edId), mode);
                    }
                },

                requestData : function (request, withDiffUser){
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
                                    this.UI.createReadOnlyMsgBox();
                                }
                                this.readonly = true;
                            }
                        } else {
                            if(this.readonly && !virtualclass.isPlayMode){
                                this.cm.setOption("readOnly", false);
                                this.UI.hideReadOnlyBox();
                                this.readonly = false;
                            }
                        }
                    }
                },

                //Trigger when the packet(text) is received from server
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
                                this.initialiseDoc(doc, "displayEditor", e.message.et);
                            } else {
                                this.initialiseDoc(doc);
                            }
                        }
                    }else if( e.message.eddata == 'requestForEditorData'){
                        // no operation at client side
                        //alert("wil have to response data");
                        //debugger;

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



                        //if(e.message.eddata == 'virtualclass-editor-operation'){
                        //    if(typeof this.vcAdapter == 'object'){
                        //        if(this.readonly){
                        //            //At received of some packet, if there would enabled readOnlyMode, we disabled it
                        //            this.readOnlyMode('enable');
                        //        }
                        //        this.vcAdapter.receivedMessage(e);
                        //    }
                        //
                        //}

                    }
                },

                //UI object is used for create container for editor
                UI: {
                    id: containerId,
                    class: 'vmApp virtualclass',
                    edId : editorId,
                    container: function (classes) {
                        //var whiteboard = document.getElementById('virtualclassWhiteboard');
                        //whiteboard.style.display = 'none';

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

                    createReadOnlyMsgBox : function (){
                        if(document.getElementById('readOnlyMsgBox') != null){
                            this.showReadOnlyBox();
                        } else {
                            var msgBox = document.createElement('div');
                            msgBox.id = 'readOnlyMsgBox';
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

                    showReadOnlyBox : function (){
                        var readOnlyMsgBox = document.getElementById('readOnlyMsgBox');
                        if(readOnlyMsgBox != null){
                            readOnlyMsgBox.display = 'block';
                        }

                    },

                    hideReadOnlyBox : function (){
                        var readOnlyMsgBox = document.getElementById('readOnlyMsgBox');
                        if(readOnlyMsgBox != null){
                            readOnlyMsgBox.display = 'none';
                        }
                    }
                },

                createEditorClient_org : function (revision, clients, docs, operations){
                    if(!this.hasOwnProperty('cmClient') || typeof this.cmClient != 'object'){
                        this.vcAdapter =  new virtualclassAdapter(revision, docs, operations);
                        this.cmClient = new ot.EditorClient(
                            revision,
                            clients,
                            this.vcAdapter,
                            new ot.CodeMirrorAdapter(this.cm)
                        );
                    }
                },

                //sending the editor packets for requested user
                //reponse request data
                initVcEditor : function (appIsEditor){

                    var initPacket = this.getWrappedOperations();
                    if(typeof appIsEditor != 'undefined'){
                        //alert("suman bogati");
                        //debugger;
                        //if(appIsEditor.hasOwnProperty('editor') || (virtualclass.gObj.uRole == 't' && virtualclass.currApp == 'Editor')){
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
                initialiseDoc : function (doc, displayEditor, et) {
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
                    this.cmLayout(editorType);
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

                removeEditorData : function (){
                    if(typeof this.vcAdapter == 'object' ){
                         this.vcAdapter.operations.length = 0;
                    }
                    localStorage.removeItem(this.etype +'_allEditorOperations');
                    localStorage.removeItem(this.etype + '_edOperationRev');
                },

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
