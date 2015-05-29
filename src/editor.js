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
                veryInit : function (){
                    if(this.stroageData != null){
                        var wrappedOperation = JSON.parse(this.stroageData);
                        var docs = JSON.parse(wrappedOperation.data);
                          //alert('outer');
                        if(virtualclass.hasOwnProperty('currAppEditor')){
                            //alert('ttt');
                            virtualclass.editor.initialiseDoc(docs, 'displayEditor');
                        } else {
                            virtualclass.editor.initialiseDoc(docs);
                        }

                    }else {
                        if(virtualclass.gObj.uRole == 's'){
                            this.requestData('from_' + virtualclass.gObj.uRole);

                            //for(var i=0; i < virtualclass.connectedUsers.length; i++){
                            //    if(virtualclass.connectedUsers[i].role == 't'){
                            //        this.requestData('fromStudent');
                            //        break;
                            //    }
                            //}
                        }
                    }
               },

                //init: function (revision, clients, docs, operations) {
                //    if(!this.cm && typeof this.cm != 'object'){
                //        this.cmLayout();
                //
                //    }else {
                //        virtualclass.dispvirtualclassLayout('virtualclass' + virtualclass.app); //
                //    }
                //
                //    this.createEditorClient(revision, clients, docs, operations);
                //
                //    if(virtualclass.gObj.uRole == 't'){
                //        io.send({eddata : 'init'});
                //    }
                //},

                init: function (revision, clients, docs, operations) {
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

                cmLayout : function (){
                    this.UI.container();
                    var edElem = document.getElementById(this.UI.edId);

                    this.cm =  CodeMirror(edElem, {
                        lineNumbers: true,
                        lineWrapping: true,
                        mode: "markdown",
                        matchBrackets: true
                    });

                    //if(typeof this.cm != 'object'){
                    //    this.cm =  CodeMirror(edElem, {
                    //        lineNumbers: true,
                    //        lineWrapping: true,
                    //        mode: "markdown",
                    //        matchBrackets: true
                    //    });
                    //}
                },

                responseToEditorRequest : function (){

                },

                requestData : function (request){
                    var toUser;
                    for(var i=0; i < virtualclass.connectedUsers.length; i++){
                        if(virtualclass.connectedUsers[i].role == 't'){
                            toUser = virtualclass.connectedUsers[i].userid;
                        }else{
                            toUser = virtualclass.connectedUsers[i].userid;
                        }
                        io.send({'eddata': 'requestForEditorData'}, toUser);
                        break;
                    }

                    //if(request == 'from_s'){
                    //    for(var i=0; i < virtualclass.connectedUsers.length; i++){
                    //        if(virtualclass.connectedUsers[i].role == 't'){
                    //            io.send({'eddata': 'requestForEditorData'}, virtualclass.connectedUsers[i].userid);
                    //            break;
                    //        }
                    //    }
                    //
                    //}else {
                    //
                    //
                    //    //if(this.dataReqTry <=12 ){
                    //    //    for(var i=0; i<virtualclass.connectedUsers.length; i++){
                    //    //        if(virtualclass.gObj.uid != virtualclass.connectedUsers[i].userid){ //is not teacher self
                    //    //            if((!this.hasOwnProperty('toAlreadyRequestUser') || (this.toAlreadyRequestUser != virtualclass.connectedUsers[i].userid))){
                    //    //                io.send({'eddata': 'requestForEditorData'}, virtualclass.connectedUsers[i].userid);
                    //    //                this.toAlreadyRequestUser = virtualclass.connectedUsers[i].userid;
                    //    //                this.dataReqTry++;
                    //    //                break;
                    //    //            }
                    //    //        }
                    //    //    }
                    //    //}
                    //}
                },

                readOnlyMode : function (){

                },

                //Trigger when the packet(text) is received from server
                onmessage : function (e){
                    //at student
                    //second condition is need because e.message.fromuser and virtualclass.gob.uid are same
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
                            //if(this.dataReqTry <=2 ){
                            //    for(var i=0; i<virtualclass.connectedUsers.length; i++){
                            //        if((this.toAlreadyRequestUser != virtualclass.connectedUsers[i].userid) && (virtualclass.gObj.uid != virtualclass.connectedUsers[i].userid)){
                            //            io.send({'eddata': 'requestForEditorData'}, virtualclass.connectedUsers[i].userid);
                            //            this.toAlreadyRequestUser = virtualclass.connectedUsers[i].userid;
                            //            this.dataReqTry++;
                            //        }
                            //    }
                            //}

                            this.requestData('fromTeacher');
                        }
                    } else if(e.message.eddata == 'initVcEditor'){
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

                        if(typeof this.vcAdapter != 'object' || this.vcAdapter.operations.length == 0){
                            io.send({'eddata' : 'noDataForEditor'});
                            return;
                        }

                        this.initVcEditor({toUser : e.fromUser.userid});

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
                    container: function () {
                        //var whiteboard = document.getElementById('virtualclassWhiteboard');
                        //whiteboard.style.display = 'none';
                       if (document.getElementById(this.id) == null) {
                            var divEditor = document.createElement('div');
                            divEditor.id = this.id;
                            divEditor.className = this.class;

                            var editor = document.createElement('div');
                            editor.id =  this.edId;

                            divEditor.appendChild(editor);

                            var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                            document.getElementById(virtualclass.html.id).insertBefore(divEditor, beforeAppend);

                        }
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

                // After editor packets recived from teacher
                // will set with code mirror, and apply the operations agains text transform
                initialiseDoc : function (doc, displayEditor) {

                    if(typeof displayEditor != 'undefined'){
                        virtualclass.currApp = virtualclass.apps[3];
                    }

                    var uiCont = document.getElementById(this.UI.id)
                    if(uiCont != null){
                        uiCont.parentNode.removeChild(uiCont);
                    }

                    this.cm = "";
                        this.cmLayout();

                    virtualclass.dispvirtualclassLayout('virtualclass' + virtualclass.currApp);

                    //if ((this.cm && !this.initialised) || (this.prvEdRev != doc.revision)) {
                    //if ((this.cm && !this.initialised)) {
                    //    this.initialised = true;
                    //        if (this.cm.getValue() !== doc.str) {
                    //            this.cm.setValue(doc.str);
                    //
                    //            this.createEditorClient(doc.revision, doc.clients, doc.str, deserialiseOps(doc.operations));
                    //            this.prvEdRev = doc.revision;
                    //        }
                    //
                    //
                    //}

                    if ((this.cm)) {
                        if (this.cm.getValue() !== doc.str) {
                            var cmElem = document.getElementById('virtualclassEditorBody');

                            console.log('new string set');
                            //this.cm.clear();
                            this.cm.setValue(doc.str);
                            this.cmClient = "";
                            this.vcAdapter = "";
                            this.createEditorClient(doc.revision, doc.clients, doc.str, deserialiseOps(doc.operations));
                            this.prvEdRev = doc.revision;
                        }
                    }

                    var editorTool = document.getElementById("virtualclassEditorTool");
                    if(editorTool  != null){
                        editorTool.style.pointerEvents = 'visible';
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
            return operations.map(function (op) {
                return new ot.WrappedOperation(
                    ot.TextOperation.fromJSON(op.operation),
                    op.cursor && ot.Cursor.fromJSON(op.cursor)
                );
            });
        };

    window.editor = editor;
})(window);
