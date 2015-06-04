// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2015  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var  editor = function() {
            "use strict";
            return {
                cm : '',
                vcAdapter : "",
                initialised :false,
                prvEdRev : 0,
                dataReqTry : 0,
                stroageData : localStorage.getItem('allEditorOperations'),
                stroageDataRev : localStorage.getItem('edOperationRev'),
                readonly : false,
                veryInit : function (){
                    if(this.stroageData != null){
                        var wrappedOperation = JSON.parse(this.stroageData);
                        var docs = JSON.parse(wrappedOperation.data);
                        if(virtualclass.hasOwnProperty('currAppEditor')){
                            virtualclass.editor.initialiseDoc(docs, 'displayEditor');
                        } else {
                            virtualclass.editor.initialiseDoc(docs);
                        }

                    }else {
                        if(virtualclass.gObj.uRole == 's'){
                            this.requestData('from_' + virtualclass.gObj.uRole);
                        }
                    }
                },

                init_old : function (revision, clients, docs, operations) {
                    if(!this.cm && typeof this.cm != 'object'){
                        this.cmLayout();
                        this.createEditorClient(revision, clients, docs, operations);
                    }else {
                        virtualclass.dispvirtualclassLayout('virtualclass' + virtualclass.app); //
                    }

                    if(virtualclass.gObj.uRole == 't'){
                        io.send({eddata : 'init'});
                    }
                },

                init : function (revision, clients, docs, operations) {
                    this.cmLayout();

                    var codeMirror = CodeMirror(document.getElementById(this.UI.edId), { lineWrapping: true });

                    //// Create Firepad (with rich text toolbar and shortcuts enabled).
                    var firepad = Firepad.fromCodeMirror({}, codeMirror,
                        { richTextToolbar: true, richTextShortcuts: true })

                    if(virtualclass.gObj.uRole == 't'){
                        io.send({eddata : 'init'});
                    }

                    //var codeMirror = CodeMirror(document.getElementById(this.UI.edId), {
                    //    lineNumbers: true,
                    //    mode: 'markdown'
                    //});
                    //
                    //var firepad = Firepad.fromCodeMirror({}, codeMirror, {
                    //    defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
                    //});

                },

                cmLayout : function (){
                    var editorType = "richText";

                    this.UI.container(editorType);

                    var edElem = document.getElementById(this.UI.edId);

                    //this.cm =  CodeMirror(edElem, {
                    //    lineNumbers: true,
                    //    lineWrapping: true,
                    //    mode: "markdown",
                    //    matchBrackets: true
                    //});
                },


                cmLayout_2 : function (){
                    this.UI.container();

                    var edElem = document.getElementById(this.UI.edId);
                    this.cm =  CodeMirror(edElem, {
                        lineNumbers: true,
                        lineWrapping: true,
                        mode: "markdown",
                        matchBrackets: true
                    });
                },

                responseToEditorRequest : function (){

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
                             io.send({'eddata': 'requestForEditorData'}, toUser);
                         }
                        //this.cm.readOnly(true);
                        this.readOnlyMode('disable');
                    }
                },

                readOnlyMode : function (mode){
                    if(typeof this.cm == 'object'){
                        if(mode == 'disable'){
                            if(!this.readonly){
                                this.cm.setOption("readOnly", true);
                                this.UI.createReadOnlyMsgBox();
                                this.readonly = true;
                            }
                        } else {
                            if(this.readonly){
                                this.cm.setOption("readOnly", false);
                                this.UI.hideReadOnlyBox();
                                this.readonly = false;
                            }
                        }
                    }
                },

                //Trigger when the packet(text) is received from server
                onmessage : function (e){
                    //at student
                    //second condition is need because e.message.fromuser and virtualclass.gob.uid are same

                    //TODO this all if and else condition should be simplyfy
                    if(e.message.eddata == 'currAppEditor'){
                        if(e.fromUser.userid != virtualclass.gObj.userid){
                            virtualclass.currAppEditor = true;
                        }
                        return;
                    }

                    if(((e.message.eddata === 'init')  && e.fromUser.userid != virtualclass.gObj.uid) ||
                        (e.message.eddata === 'init' &&  wbUser.virtualclassPlay == '1')){
                        virtualclass.makeAppReady('Editor');
                    }

                    if(e.message.eddata == 'noDataForEditor'){
                        if(virtualclass.gObj.uRole == 't'){
                           // this.requestData('fromTeacher', 'withDifStudent');
                        }
                        return;
                    } else if(e.message.eddata == 'initVcEditor'){
                        console.log('action initVcEditor');
                        if((virtualclass.gObj.uRole != 't') || (virtualclass.gObj.uRole == 't' && e.message.hasOwnProperty('resFromUser') && e.fromUser.userid != virtualclass.gObj.uid)){
                            var doc = JSON.parse(e.message.data);
                            if(e.message.hasOwnProperty('layoutEd')){
                                virtualclass.editor.initialiseDoc(doc, "displayEditor");
                            } else {
                                virtualclass.editor.initialiseDoc(doc);
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
                            this.vcAdapter.receivedMessage(e);
                        }else{
                            console.log("virtualclass adapter is not ready for editor");
                        }

                    }
                },

                //UI object is used for create container for editor
                UI: {
                    id: 'virtualclassEditor',
                    class: 'vmApp',
                    edId : 'virtualclassEditorBody',
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
                        document.getElementById('readOnlyMsgBox').style.display = 'block';
                    },

                    hideReadOnlyBox : function (){
                        document.getElementById('readOnlyMsgBox').style.display = 'none';
                    }


                },

                createEditorClient : function (revision, clients, docs, operations){
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
                        if(appIsEditor.hasOwnProperty('editor') || (virtualclass.gObj.uRole == 't' && virtualclass.currApp == 'Editor')){
                            initPacket.layoutEd  = "1";  //this would be for create editor layout
                        }

                        if(appIsEditor.hasOwnProperty('toUser')){
                            initPacket.resFromUser = true;
                        }

                        io.send(initPacket, appIsEditor.toUser);
                    }else {
                        io.send(initPacket);
                    }
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
                        })
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
                initialiseDoc : function (doc, displayEditor) {
                    if(typeof displayEditor != 'undefined'){
                        virtualclass.currApp = virtualclass.apps[3];
                    }

                    this.removeCodeMirror();
                    this.cmLayout();
                    virtualclass.dispvirtualclassLayout('virtualclass' + virtualclass.currApp);
                    if ((this.cm)) {
                        if (this.cm.getValue() !== doc.str) {
                            var cmElem = document.getElementById(this.UI.edId);

                            console.log('new string set');
                            //this.cm.clear();
                            this.cm.setValue(doc.str);
                            this.cmClient = "";
                            this.vcAdapter = "";
                            this.createEditorClient(doc.revision, doc.clients, doc.str, deserialiseOps(doc.operations));
                            this.prvEdRev = doc.revision;
                        }
                    }

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
                    localStorage.removeItem('allEditorOperations');
                    localStorage.removeItem('edOperationRev');
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
            return operations.map(function (op) {
                return new ot.WrappedOperation(
                    ot.TextOperation.fromJSON(op.operation),
                    op.cursor && ot.Cursor.fromJSON(op.cursor)
                );
            });
        };

    window.editor = editor;
})(window);
