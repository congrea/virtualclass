// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2015  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var  editor = function() {
            "use strict";
            var otAdapter;
            return {
                cm : '',
                init: function () {
                    this.UI.container();
                    this.initCm();
                    if(virtualclass.gObj.uRole == 't'){
                        io.send({eddata : 'init'});
                    }
                },

                //Trigger when the packet(text) is received from server
                onmessage : function (e){
                    //at student
                    //second condition is need because e.message.fromuser and virtualclass.gob.uid are same
                    if((e.message.eddata === 'init' && e.fromUser.userid != virtualclass.gObj.uid) ||
                        (e.message.eddata === 'init' &&  wbUser.virtualclassPlay == '1')){
                        virtualclass.makeAppReady('Editor');
                    }

                    otAdapter.receivedMessage(e);
                },

                //UI object is used for create container for editor
                UI: {
                    id: 'virtualclassEditor',
                    class: 'vmApp',
                    edId : 'virtualclassEditorBody',
                    container: function () {
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

                //initalize the code mirror
                initCm : function (){
                    var revision = 0;
                    var clients = [];
                    var docs = "";
                    var operations = "";
                    var edElem = document.getElementById(this.UI.edId);

                    this.cm =  CodeMirror(edElem, {
                        lineNumbers: true,
                        lineWrapping: true,
                        mode: "markdown",
                        matchBrackets: true
                    });


                    //docs = mycm.getValue();


                    otAdapter =  new virtualclassAdapter(revision, docs, operations);

                    //reateEditorClient(0, [], myCodeMirror.getValue());

                    this.cmClient = new ot.EditorClient(
                        revision,
                        clients,
                        otAdapter,
                        new ot.CodeMirrorAdapter(this.cm)
                    );
                }

            }
        };
    window.editor = editor;
})(window);
