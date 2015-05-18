// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2015  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var  editor = function() {
            return {
                cm : '',
                init: function () {
                    this.UI.container();
                    this.initCm();
                    if(virtualclass.gObj.uRole == 't'){
                        io.send({eddata : 'init'});
                    }
                },

                onmessage : function (e){
                    //at student
                    if(e.message.eddata === 'init'){
                        virtualclass.makeAppReady('Editor');
                    }
                    otAdapter.receivedMessage(e);
                },

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

                initCm : function (){

                    var edElem = document.getElementById(this.UI.edId);

                    this.cm =  CodeMirror(edElem, {
                        lineNumbers: true,
                        lineWrapping: true,
                        mode: "markdown",
                        matchBrackets: true
                    });

                    revision = 0;
                    clients = [];
                    docs = "";
                    //docs = mycm.getValue();
                    operations = "";

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
