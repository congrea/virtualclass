// This file is part of Vidyamantra - http:www.vidyamantra.com/
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
(function (window) {
    "use strict";
    //this is main class
    var editor = function (type, containerId, editorId) {
        this.etype = type;
        var that = this;

        //TODO this should be dynamic
        if (type == 'editorRich') {
            var editorType = {lineWrapping: true};
            var editorToolbar = {richTextToolbar: true, richTextShortcuts: true, readOnly: false};
            //------------------------------------------------------------------------------^---
            // By Default, readOnly need to be false, and perform the action according to need.
            // If we do readOnly : nocurosr by default then the bullet and number would not be generated on student window
            // for more info about bug https://github.com/vidyamantra/virtualclass/issues/119
        } else {
            var editorType = {lineNumbers: true, mode: 'markdown', readOnly: false};
            var editorToolbar = {defaultText: 'Markdown Editor '};
        }

        return {
            etype: type,
            cm: '',
            vcAdapter: "",
            initialised: false,
            prvEdRev: 0,
            dataReqTry: 0,
            stroageData: localStorage.getItem(this.etype + '_allEditorOperations'),
            tempstroageDataRev: localStorage.getItem(this.etype + '_edOperationRev'),

            readonly: false,


            /**
             *  Get the data from localStorage
             *  initialise that data to editor if available
             *  if data is not available,
             *  the function requests the data from teacher in case of student
             */
            veryInit: function () {

                if (this.stroageData != null && this.stroageData != "") {

                    this.stroageDataRev = (this.tempstroageDataRev == null) ? 0 : this.tempstroageDataRev;
                    var docs = JSON.parse(this.stroageData);

                    docs = JSON.parse(docs.data);
                    console.log('Current Editor type ' + virtualclass.currAppEditorType);
                    if (virtualclass.hasOwnProperty('currAppEditor')) {
                        if (virtualclass.currAppEditorType == this.etype) {
                            this.initialiseDataWithEditor(docs, 'displayEditor', virtualclass.currAppEditorType);
                        } else {
                            this.initialiseDataWithEditor(docs);
                        }
                    } else {
                        this.initialiseDataWithEditor(docs);
                    }
                }
                virtualclass.gObj.editorInitDone++; // Count number of Init done. It should be two for two instances of editors.
            },

            /**
             * Initialise the Editor at very first when user click on click Or get command
             * from other user
             * @param revision expects revision document with editor
             * @param clients client number
             * @param docs expect wrapped datas
             * @param operations expect operations of docs
             */
            init: function (revision, clients, docs, operations) {
                var docsInfo = {};
                if (typeof revision != 'undefined') {
                    docsInfo.revision = revision;
                }
                if (typeof clients != 'undefined') {
                    docsInfo.clients = clients;
                }
                if (typeof docs != 'undefined') {
                    docsInfo.doc = docs;
                }
                if (typeof operations != 'undefined') {
                    docsInfo.operations = operations;
                }


                if (!this.cm && typeof this.cm != 'object') {
                    this.codemirrorWithLayout(editorType);
                    this.createEditorClient(editorToolbar, docsInfo);

                } else {
                    virtualclass.dispvirtualclassLayout(virtualclass.currApp); //
                }

                if (roles.hasControls()) {
                    if (roles.hasAdmin()) {
                        this.createAllEditorController();
                    }
                    //TODO Check if it is required to send to all
                    //TODO Check if it is possible avoid going through iolib
                    ioAdapter.mustSendAll({eddata: 'init', et: this.etype, cf: 'eddata'});
                } else {
                    if (roles.hasAdmin()) {
                        this.createAllEditorController();
                    }
                }
            },

            createAllEditorController: function () {
                var editorType = this.etype;
                var containerId = 'all' + editorType + 'Container';
                if (document.getElementById(containerId) == null) {
                    var actionToPerform = 'enable';
                    var editorControllerCont = document.createElement('div');
                    editorControllerCont.id = containerId;
                    editorControllerCont.class = 'editorController';

                    var editorControllerAnch = document.createElement('a');
                    editorControllerAnch.id = editorControllerCont.id + "Anch";
                    editorControllerAnch.href = "#";
                    editorControllerAnch.innerHTML = "Enable All";
                    editorControllerAnch.dataset.action = actionToPerform;
                    editorControllerCont.appendChild(editorControllerAnch);

                    editorType = virtualclass.vutil.capitalizeFirstLetter(editorType);
                    document.getElementById('virtualclass' + editorType + 'Body').appendChild(editorControllerCont);

                    editorControllerAnch.addEventListener('click', function () {
                        var editorControllerAnch = document.getElementById(containerId + 'Anch');
                        if (editorControllerAnch != null) {
                            actionToPerform = editorControllerAnch.dataset.action;
                            if (editorControllerAnch.dataset.action == 'enable') {
                                editorControllerAnch.dataset.action = 'disable';
                                editorControllerAnch.innerHTML = "Disable All";
                            } else {
                                editorControllerAnch.dataset.action = 'enable';
                                editorControllerAnch.innerHTML = "Enable All";
                            }
                        }
                        virtualclass.user.control.toggleAllEditorController.call(virtualclass.user, editorType, actionToPerform);
                    });

                }

            },

            /*
             * By this function we creating the
             * Editor client and virtualclass adapter in ot.js
             * @param editorType expect editor type
             * @param docsInfo about docs(operation, revision, etc)
             */
            createEditorClient: function (editorType, docsInfo) {


                if (roles.hasAdmin()) {
                    this.cm.setOption('readOnly', false);
                    this.createAllEditorController();
                    editorType.readOnly = false;

                }

                if (virtualclass.isPlayMode) {
                    //this.readOnlyMode('disable', 'notCreateSyncBox');
                    this.readOnlyMode('enable', 'notCreateSyncBox');
                    this.cm.setOption('readOnly', 'nocursor');
                }

                Vceditor.fromCodeMirror({}, this.cm, editorType, docsInfo);
                console.log('Creating Rich Text Layout');
            },

            /**
             * Create the code mirror with layout
             * @param mode expect type  of editor
             */
            codemirrorWithLayout: function (options) {
                this.UI.container(this.etype);
                var edElem = document.getElementById(this.UI.edId);
                if (typeof  this.cm != 'object') {
                    console.log('Code mirror instance is created ');
                    this.cm = CodeMirror(document.getElementById(this.UI.edId), options);
                }
            },

            /**
             * requst the data from other use if data is missed at local
             * @param byRequest expects from request is coming from
             * @param withDiffUser is flag for try with different user
             */
            requestData: function () {
                var toUser = virtualclass.vutil.whoIsTeacher();

                this.readOnlyMode('enable');

                ioAdapter.mustSendUser({
                    'eddata': 'requestForEditorData',
                    et: this.etype,
                    cf: 'eddata'
                }, toUser);
            },

            /**
             * Make editor either enable or disable with optional synch message box
             * @param mode mode expect either editor is enable or disbale
             * @param notcreateBox indates iether synch message would created or not
             */
            readOnlyMode: function (mode, notcreateBox) {
                if (typeof this.cm == 'object') {
                    if (mode == 'enable') {
                        if (!this.readonly) {
                            this.cm.setOption("readOnly", 'nocursor');
                            if (typeof notcreateBox == 'undefined') {
                                this.UI.createSynchMessageBox();
                            }
                            this.readonly = 'nocursor';
                        }
                    } else {
                        if (this.readonly && !virtualclass.isPlayMode) {
                            this.cm.setOption("readOnly", false);
                            this.readonly = false;
                            this.UI.hideSynchMessageBox();
                        }

                    }
                    virtualclass.vutil.setReadModeWhenTeacherIsDisConn(virtualclass.vutil.smallizeFirstLetter(this.etype));
                }
            },

            // Check if vcAdapter is ready for given Editor
            isVcAdapterIsReady: function (et) {
                return (virtualclass[et].hasOwnProperty('vcAdapter') && typeof virtualclass[et].vcAdapter == 'object');
            },


            receivedOperations: {
                currAppEditor: function (e) {
                    if (e.fromUser.userid != virtualclass.gObj.userid) {
                        console.log('curr app editor');
                        virtualclass.currAppEditor = true;
                        virtualclass.currAppEditorType = e.message.et;
                        virtualclass.dispvirtualclassLayout(virtualclass.currAppEditorType);
                    }
                },

                init: function (e, etype) {
                    if ((e.fromUser.userid != virtualclass.gObj.uid || wbUser.virtualclassPlay == '1')) {
                        virtualclass.makeAppReady(etype);
                    }
                },

                initVcEditor: function (e) {
                    console.log('received whole data');

                    if (roles.hasView()) {
                        if(typeof virtualclass[e.message.et].vcAdapter.removeOperations == 'function'){
                            virtualclass[e.message.et].vcAdapter.removeOperations(e);
                        }
                    }

                    if ((!roles.hasControls()) ||
                         // allEdData when teacher in educator mode and reponse the data after page refresh
                        (roles.hasControls() &&  e.fromUser.userid != virtualclass.gObj.uid) && (e.message.hasOwnProperty('resFromUser') || e.message.hasOwnProperty('allEdData'))) {
                        var doc = JSON.parse(e.message.data);


                        if (e.message.hasOwnProperty('layoutEd')) {
                            //if(e.message.cet == 'EditorRich' || e.message.cet == 'EditorCode'){
                            //    virtualclass.currAppEditor = true;
                            //}

                            this.initialiseDataWithEditor(doc, e.message);
                        } else {
                            this.initialiseDataWithEditor(doc);
                        }
                    }
                },

                requestForEditorData: function (e) {
                    if (e.fromUser.userid != virtualclass.gObj.uid) {
                        if (typeof this.vcAdapter != 'object' || this.vcAdapter.operations.length == 0) {
                            //TODO Check if it is required to send to all
                            //TODO Check if it is possible avoid going through iolib
                            ioAdapter.mustSendAll({'eddata': 'noDataForEditor', cf: 'eddata'});
                            return;
                        }
                        this.responseToRequest(e.fromUser.userid);

                    } else {
                        console.log('Cannot send requestForEditorData to self');
                    }
                },

                noDataForEditor: function () {
                    if (roles.hasControls()) {
                        // this.requestData('fromTeacher', 'withDifStudent');
                    }
                },

                'virtualclass-editor-operation': function (e) {
                    if (typeof this.vcAdapter == 'object') {
                        //At received of some packet, if there would enabled readOnlyMode, we disabled it

                        this.readOnlyMode('disable');
                        this.vcAdapter.receivedMessage(e);
                    }
                },


                'virtualclass-editor-cursor': function (e) {
                    if (typeof this.vcAdapter == 'object') {
                        this.vcAdapter.receivedMessage(e);
                    }
                },

                'select': function () {
                    if (typeof this.vcAdapter == 'object') {
                        this.vcAdapter.receivedMessage(e);
                    }
                }
            },


            /**
             *  Handle all the responses related to editor coming from server
             * @param e expects event parameter
             * @param etype expects editor type
             */
            onmessage: function (e, etype) {
                //at student
                //second condition is need because e.message.fromuser and virtualclass.gob.uid are same
                //TODO this all if and else condition should be simplyfy
                this.receivedOperations[e.message.eddata].call(this, e, etype);
                if (typeof this.vcAdapter != 'object') {
                    if (roles.hasAdmin() && e.message.eddata == 'virtualclass-editor-operation') {
                        virtualclass.makeAppReady(etype);
                        //this.vcAdapter should convert into otAdapter
                        this.vcAdapter.receivedMessage(e, onmessage);
                    }
                    console.log("virtualclass adapter is not ready for editor");
                }
            },

            /**
             * this object is used for user interace of Editor
             */
            UI: {
                id: containerId,
                class: 'vmApp virtualclass',
                edId: editorId,
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
                        editor.id = this.edId;

                        divEditor.appendChild(editor);

                        var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                        document.getElementById(virtualclass.html.id).insertBefore(divEditor, beforeAppend);
                    }
                },

                /**
                 * Create synchronizing message box
                 * to user for wating
                 */
                createSynchMessageBox: function () {
                    if (document.getElementById('synchMessageBox') != null) {
                        this.showSynchMessageBox();
                    } else {
                        var msgBox = document.createElement('div');
                        msgBox.id = 'synchMessageBox';
                        msgBox.style.width = "340px";
                        msgBox.style.height = "15px";


                        var msg = document.createElement('p');
                        msg.id = 'readOnlyMsg';
                        msg.innerHTML = virtualclass.lang.getString('synchMessage');
                        msgBox.appendChild(msg);

                        var parTag = document.getElementById(this.id);
                        parTag.insertBefore(msgBox, parTag.firstChild);
                    }
                },

                //TODO below 2 functions can be convert into 1
                showSynchMessageBox: function () {
                    var synchMessageBox = document.getElementById('synchMessageBox');
                    if (synchMessageBox != null) {
                        synchMessageBox.style.display = 'block';
                    }

                },

                hideSynchMessageBox: function () {
                    var synchMessageBox = document.getElementById('synchMessageBox');
                    if (synchMessageBox != null) {
                        synchMessageBox.style.display = 'none';
                    }
                }
            },

            /**
             * Response the requested data to requested user
             * @param appIsEditor does decide the editor shoudl be shown or not at other user
             */
            responseToRequest: function (toUser) {
                var initPacket = this.getWrappedOperations(true);
                initPacket.layoutEd = "1";  //this would be for create editor layout
                if(roles.isTeacher()){
                    initPacket.capp = virtualclass.currApp; // this should pass only when user is educator
                }

                initPacket.et = this.etype;

                if (toUser) {
                    initPacket.resFromUser = true;
                    ioAdapter.mustSendUser(initPacket, toUser);
                    console.log('Sending responseToRequest to ' + toUser);
                } else {
                    initPacket.allEdData = true;
                    ioAdapter.mustSend(initPacket);
                    console.log('Sending responseToRequest to all');
                    virtualclass[initPacket.et].vcAdapter.removeOperations({message: {et: initPacket.et}});
                    var operations = JSON.parse(initPacket.data);
                    virtualclass[initPacket.et].initialiseDataWithEditor(operations); // for display content to self
                    virtualclass[initPacket.et].vcAdapter.myOTrequestData = 0;
                }
            },

            /**
             * Check if teacher editor of teacher is
             * @returns {boolean}
             */
            isEidtorWithTeacher: function () {
                return (roles.hasControls() && (virtualclass.currApp == 'EditorRich' || virtualclass.currApp == 'EditorCode'));
            },

            /**
             * Wrapped the text operation with reviion, string etc.
             * @returns {{eddata: string, data, et: *}}
             */
            getWrappedOperations: function (removelast) {
                var operations;
                if (this.vcAdapter && this.vcAdapter.operations) {
                    operations = serialiseOps(this.vcAdapter.operations);
                } else {
                    operations = [];
                }
                //var operations = this.vcAdapter && this.vcAdapter.operations ? serialiseOps(this.vcAdapter.operations): [];
                // We only want the most recent 50 because we can't send too much data

                var wrappedOperations = {
                    eddata: 'initVcEditor',
                    data: JSON.stringify({
                        //revision: this.cmClient.revision,
                        //revision: 0,
                        //clients: [],
                        ////str: this.cm.getValue(), //cm is my code mirror
                        //str: '',
                        operations: operations
                    }),

                    et: this.etype,
                    cf: 'eddata'
                };

                return wrappedOperations;
            },


            getStudentAllText: function () {
                return this.cm.getValue('\n');
            },

            /**
             * Remove the Code Mirror from DOM
             * and make empty of code mirror object
             */
            removeCodeMirror: function () {
                this.readonly = false;
                var uiCont = document.getElementById(this.UI.id);
                if (uiCont != null) {
                    uiCont.parentNode.removeChild(uiCont);
                }
                this.cm = "";
            },

            setReadMode: function () {
                var cmReadOnly = JSON.parse(localStorage.getItem(this.etype));
                if (!roles.hasAdmin()) {
                    if (cmReadOnly != null) {
                        if (!cmReadOnly) {
                            this.cm.setOption("readOnly", 'nocursor');
                            var writeMode = false;
                        } else {
                            this.cm.setOption("readOnly", false);
                            var writeMode = true;
                        }
                    } else {
                        this.cm.setOption("readOnly", 'nocursor');
                        var writeMode = false;
                    }
                    virtualclass.user.control.toggleDisplayWriteModeMsgBox(virtualclass.vutil.capitalizeFirstLetter(this.etype), writeMode);
                    virtualclass.vutil.setReadModeWhenTeacherIsDisConn(virtualclass.vutil.smallizeFirstLetter(this.etype));
                }
            },

            writeBulkDocs: function (doc) {
                var tempOps = deserialiseOps(doc.operations); // Get deserialize operations

                // Make ready the default docs for initialize the editor
                doc.revision = 0; // Does need every time page loads, else it would doubles.
                if ((this.cm)) {
                    if ((this.cm.getValue() !== doc.str) || (doc.str == "")) {
                        this.cmClient = "";
                        this.vcAdapter = "";
                        doc.operations = [];
                        doc.doc = "";
                    }

                    this.createEditorClient(editorToolbar, doc); // creating editor client and virtualclass adapter
                    this.prvEdRev = doc.revision;
                }

                // Write the text/operation on Editor by triggering the operation
                for (var i = 0; i < tempOps.length; i++) {
                    virtualclass[this.etype].vcAdapter.server.receiveOperation(i, tempOps[i]);
                    this.vcAdapter.trigger('operation', tempOps[i].wrapped.toJSON());
                }
            },

            /**
             * After editor packets recived from teacher
             * will set with code mirror, and apply the operations agains text transform
             */

            initialiseDataWithEditor: function (doc, msg) {

                var tempOps = deserialiseOps(doc.operations); // Get deserialize operations

                //initializeig the editor to virtualclass current application
                if(typeof msg != 'undefined' && msg.hasOwnProperty('capp')){
                    virtualclass.currApp = virtualclass.vutil.capitalizeFirstLetter(msg.capp);
                }

                //if (typeof displayEditor != 'undefined') {
                //    if (virtualclass.currAppEditor) {
                //        if (virtualclass.currAppEditorType == et) {
                //            virtualclass.currApp = virtualclass.vutil.capitalizeFirstLetter(et);
                //        }
                //    } else {
                //        virtualclass.currApp = virtualclass.vutil.capitalizeFirstLetter(et);
                //    }
                //}

                this.removeCodeMirror(); // Remove code mirror from dom if exist

                this.codemirrorWithLayout(editorType); // Create the code mirror instance with layout

                virtualclass.dispvirtualclassLayout(virtualclass.currApp); // If virtualclass.currApp is editor then display it

                this.writeBulkDocs(doc);


                this.cm.refresh();
                this.setReadMode(); // Setting the Editor read mode

                var currApp = virtualclass.vutil.capitalizeFirstLetter(virtualclass.currApp);
                if (currApp == 'EditorRich' || currApp == 'EditorCode') {
                    virtualclass.previous = 'virtualclass' + virtualclass.currApp;
                    virtualclass.system.setAppDimension(virtualclass.currApp);
                } else {
                    // if current app is not editor and, there is displaying editor in browser
                    // disable that editor
                    var ediotrRich = document.getElementById('virtualclassEditorRich');
                    if(ediotrRich != null){
                        ediotrRich.style.display = 'none';
                    }

                    var ediotrCode = document.getElementById('virtualclassEditorCode');
                    if(ediotrCode != null){
                        ediotrCode.style.display = 'none';
                    }

                }

                var editorTool = document.getElementById("virtualclassEditorTool");
                if (editorTool != null) {
                    editorTool.style.pointerEvents = 'visible';
                }
                otAdapter.myrequestData = 0;
            },

            /**
             * removing error data from local storage
             * and from inline memoery
             */
            removeEditorData: function () {
                if (typeof this.cm == 'object') {
                    if (typeof this.vcAdapter == 'object') {
                        this.vcAdapter.operations.length = 0;
                    }
                    //this.cm.setValue("");
                    this.removeCodeMirror();
                    localStorage.removeItem(this.etype + '_allEditorOperations');
                    localStorage.removeItem(this.etype + '_edOperationRev');
                }
            },

            /**
             * Save the editor data in to local storage
             */
            saveIntoLocalStorage: function () {
                if ((typeof this.vcAdapter == 'object' && this.vcAdapter.operations.length > 0)) {
                    var wrappedOperations = this.getWrappedOperations();
                    localStorage.removeItem(this.etype + '_allEditorOperations');
                    localStorage.setItem(this.etype + '_allEditorOperations', JSON.stringify(wrappedOperations));
                    localStorage.setItem(this.etype + '_edOperationRev', this.cmClient.revision);
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
        var vceditor = Vceditor.getvcEditor();
        return operations.map(function (op) {
            return new vceditor.WrappedOperation(
                vceditor.TextOperation.fromJSON(op.operation),
                op.cursor && vceditor.Cursor.fromJSON(op.cursor)
            );
        });
    };

    window.editor = editor;
})(window);
