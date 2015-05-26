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
                init: function (revision, clients, docs, operations) {
                    this.cmLayout();
                    this.createEditorClient(revision, clients, docs, operations);
                    if(virtualclass.gObj.uRole == 't'){
                        io.send({eddata : 'init'});
                    }
                },

                cmLayout : function (){
                    this.UI.container();
                    var edElem = document.getElementById(this.UI.edId);

                    if(typeof this.cm != 'object'){
                        this.cm =  CodeMirror(edElem, {
                            lineNumbers: true,
                            lineWrapping: true,
                            mode: "markdown",
                            matchBrackets: true
                        });
                    }

                },

                //Trigger when the packet(text) is received from server
                onmessage : function (e){
                    //at student
                    //second condition is need because e.message.fromuser and virtualclass.gob.uid are same
                    if(((e.message.eddata === 'init')  && e.fromUser.userid != virtualclass.gObj.uid) ||
                        (e.message.eddata === 'init' &&  wbUser.virtualclassPlay == '1')){
                        virtualclass.makeAppReady('Editor');
                    }


                    if(e.message.eddata == 'initVcEditor'){

                        if(virtualclass.gObj.uRole != 't'){
                            var doc = JSON.parse(e.message.data);
                            virtualclass.editor.initialiseDoc(doc);
                        }

                    } else {
                        this.vcAdapter.receivedMessage(e);
                    }
                },

                //UI object is used for create container for editor
                UI: {
                    id: 'virtualclassEditor',
                    class: 'vmApp',
                    edId : 'virtualclassEditorBody',
                    container: function () {
                        var whiteboard = document.getElementById('virtualclassWhiteboard');
                        whiteboard.style.display = 'none';

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
                    this.vcAdapter =  new virtualclassAdapter(revision, docs, operations);
                    this.cmClient = new ot.EditorClient(
                        revision,
                        clients,
                        this.vcAdapter,
                        new ot.CodeMirrorAdapter(this.cm)
                    );
                },

                //sending the editor packets for new join memeber
                initVcEditor : function (appIsEditor){
                    var operations = this.vcAdapter && this.vcAdapter.operations ? serialiseOps(this.vcAdapter.operations): [];
                    // We only want the most recent 50 because we can't send too much data

                    if (operations.length > 50) {
                        operations = operations.slice(operations.length - 50);
                    }

                    var initPacket = {
                        eddata: 'initVcEditor',
                        data: JSON.stringify({
                            revision: this.cmClient.revision,
                            clients: [],
                            str: this.cm.getValue(), //cm is my code mirror
                            operations: operations
                        })

                    }

                    if(typeof appIsEditor != 'undefined'){
                        initPacket.layoutEd  = "1";  //this would be for create editor layout
                    }
                    io.send(initPacket);
                },

                // After editor packets recived from teacher
                // will set with code mirror, and apply the operations agains text transform
                initialiseDoc : function (doc) {
                    this.cmLayout();
                    if (this.cm && !this.initialised) {
                        this.initialised = true;
                        if (this.cm.getValue() !== doc.str) {
                            this.cm.setValue(doc.str);

                        }
                        this.createEditorClient(doc.revision, doc.clients, doc.str, deserialiseOps(doc.operations))
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
