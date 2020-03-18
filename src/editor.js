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
  // this is main class
  const editor = function (type, containerId, editorId) {
    this.etype = type;
    let editorType;
    let editorToolbar;

    // TODO this should be dynamic
    if (type === 'editorRich') {
      editorType = { lineWrapping: true };
      editorToolbar = { richTextToolbar: true, richTextShortcuts: true, readOnly: false };
      // ------------------------------------------------------------------------------^---
      // By Default, readOnly need to be false, and perform the action according to need.
      // If we do readOnly : nocurosr by default then the bullet and number would not be generated on student window
      // for more info about bug https://github.com/vidyamantra/virtualclass/issues/119
    } else {
      editorType = { lineNumbers: true, mode: 'markdown', readOnly: false };
      editorToolbar = { defaultText: 'Markdown Editor ' };
    }

    return {
      etype: type,
      cm: '',
      vcAdapter: '',
      initialised: false,
      prvEdRev: 0,
      dataReqTry: 0,
      stroageData: localStorage.getItem(`${this.etype}_allEditorOperations`),
      tempstroageDataRev: localStorage.getItem(`${this.etype}_edOperationRev`),
      readonly: false,
      editorStatus : false,


      /**
       *  Get the data from localStorage
       *  initialise that data to editor if available
       *  if data is not available,
       *  the function requests the data from teacher in case of student
       */
      // veryInit() {
      //   if (this.stroageData != null && this.stroageData != '') {
      //     this.stroageDataRev = (this.tempstroageDataRev == null) ? 0 : this.tempstroageDataRev;
      //     let docs = JSON.parse(this.stroageData);
      //
      //     docs = JSON.parse(docs.data);
      //     // console.log(`Current Editor type ${virtualclass.currAppEditorType}`);
      //     if (Object.prototype.hasOwnProperty.call(virtualclass, 'currAppEditor')) {
      //       if (virtualclass.currAppEditorType == this.etype) {
      //         this.initialiseDataWithEditor(docs, 'displayEditor', virtualclass.currAppEditorType);
      //       } else {
      //         this.initialiseDataWithEditor(docs);
      //       }
      //     } else {
      //       this.initialiseDataWithEditor(docs);
      //     }
      //   }
      // },

      /**
       * Initialise the Editor at very first when user click on click Or get command
       * from other user
       * @param revision expects revision document with editor
       * @param clients client number
       * @param docs expect wrapped datas
       * @param operations expect operations of docs
       */
      init(revision, clients, docs, operations) {
        virtualclass.userInteractivity.makeReadyContext();
        const docsInfo = {};
        if (typeof revision !== 'undefined') {
          docsInfo.revision = revision;
        }
        if (typeof clients !== 'undefined') {
          docsInfo.clients = clients;
        }
        if (typeof docs !== 'undefined') {
          docsInfo.doc = docs;
        }
        if (typeof operations !== 'undefined') {
          docsInfo.operations = operations;
        }


        if (!this.cm && typeof this.cm !== 'object') {
          this.codemirrorWithLayout(editorType);
          this.createEditorClient(editorToolbar, docsInfo);
        } else {
          virtualclass.dispvirtualclassLayout(virtualclass.currApp); //
        }

        // if (roles.hasControls()) {
        //   this.createAllEditorController();
        //
        //   // if (roles.hasAdmin()) {
        //   //   this.createAllEditorController();
        //   //
        //   //   // TODO Check if it is required to send to all
        //   //   // TODO Check if it is possible avoid going through workerIO
        //   // }
        //   // when presenter OR Teacher click on edit button
        //
        //   if (!virtualclass.gObj.studentSSstatus.sharing) {
        //     ioAdapter.mustSendAll({ eddata: 'init', et: this.etype, cf: 'eddata' });
        //   }
        // } else if (roles.hasAdmin()) {
        //   this.createAllEditorController();
        // }
        if (roles.hasControls()) {
          this.createAllEditorController();
        }

        if (roles.hasControls() && !virtualclass.gObj.studentSSstatus.sharing) {
          ioAdapter.mustSendAll({ eddata: 'init', et: this.etype, cf: 'eddata' });
        }
      },

      createAllEditorController() {
        const editorType = this.etype;
        const containerId = `all${editorType}Container`;
        if (document.getElementById(containerId) == null) {
          let actionToPerform;
          const editortemplate = virtualclass.getTemplate('edenableall', 'editor');
          const editorhtml = editortemplate({ type1: editorType });
          // $('#virtualclass' + virtualclass.vutil.capitalizeFirstLetter(editorType) + 'Body').append(editorhtml);
          const editorTypeElem = `#virtualclass${virtualclass.vutil.capitalizeFirstLetter(editorType)}Body`;
          const editor = document.querySelector(editorTypeElem);
          editor.insertAdjacentHTML('beforeend', editorhtml);
          const editorControllerAnch = document.getElementById(`${containerId}Anch`);
          // const editorModestatus = localStorage.getItem(`${editorType}mode`);
          const editorModestatus = this.editorStatus;
          if (editorModestatus !== null) {
            if (virtualclass.editorRich.collborateToolStatus) {
              virtualclass.editorRich.disableCollaborateTool();
            } else if (editorModestatus === 'disable') {
              editorControllerAnch.dataset.action = 'disable';
              // editorControllerAnch.innerHTML = "Disable all";
            }
          }
          // console.log(`Editor type ${editorType}`);

          editorControllerAnch.addEventListener('click', () => {
            // console.log(`Editor type ${editorType} clicked`);
            let editorControllerAnch = document.getElementById(`${containerId}Anch`);
            if (editorControllerAnch !== null) {
              actionToPerform = editorControllerAnch.dataset.action;
              if (editorControllerAnch.dataset.action === 'enable') {
                virtualclass.editorRich.disableCollaborateTool();
              } else {
                virtualclass.editorRich.enableCollaborateTool();
                // editorControllerAnch.innerHTML = "collaborate";
              }
            }

            // localStorage.setItem(`${editorType}mode`, editorControllerAnch.dataset.action);
            virtualclass.editorRich.editorStatus = editorControllerAnch.dataset.action;
            virtualclass.user.control.toggleAllEditorController.call(virtualclass.user, editorType, actionToPerform);
          });
        }
      },

      disableCollaborateTool() {
        console.log('showing enable editor controller');
        const editorControllerAnch = document.getElementById('alleditorRichContainerAnch');
        editorControllerAnch.dataset.action = 'disable';
        editorControllerAnch.classList.remove('icon-collaboratecrose');
        editorControllerAnch.classList.add('icon-collaborate');
        editorControllerAnch.parentNode.setAttribute('data-title', virtualclass.lang.getString('offcollaboration'));
      },

      enableCollaborateTool() {
        console.log('showing disable editor controller');
        const editorControllerAnch = document.getElementById('alleditorRichContainerAnch');
        editorControllerAnch.classList.remove('icon-collaborate');
        editorControllerAnch.classList.add('icon-collaboratecrose');
        editorControllerAnch.dataset.action = 'enable';
        editorControllerAnch.parentNode.setAttribute('data-title', virtualclass.lang.getString('oncollaboration'));
      },

      /**
       * This function remove the scroll from editor which comes on firefox browser
       * upto paritucular window size
       * @param etype expects browser name
       */

      // This is not best way to handle scroll with firefox.
      removeScrollFromFireFox(etype) {
        etype = virtualclass.vutil.capitalizeFirstLetter(etype);
        // TODO remove setTimeout
        setTimeout(
          () => {
            const codeScrollElem = document.querySelector(`#virtualclass${etype}Body .CodeMirror-vscrollbar`);

            const codeMirrorCont = document.querySelector(`#virtualclass${etype}Body .CodeMirror`);

            const codeContainer = document.querySelector(`#virtualclass${etype}Body .CodeMirror-code`);

            const codeMirrorContHeight = codeMirrorCont.offsetHeight - 25;
            const codeContainerHeight = codeContainer.offsetHeight;

            if (codeContainerHeight > codeMirrorContHeight) {
              codeScrollElem.style.display = 'block';
            } else {
              codeScrollElem.style.display = '';
            }
          }, 20,
        );
      },

      /**
       * By this function we creating the
       * Editor client and virtualclass adapter in ot.js
       * @param editorType expect editor type
       * @param docsInfo about docs(operation, revision, etc)
       */
      createEditorClient(editorType, docsInfo) {
        if (roles.hasAdmin()) {
          this.cm.setOption('readOnly', false);
          this.createAllEditorController();
          editorType.readOnly = false; // editor is enabled
        }

        if (virtualclass.isPlayMode) {
          // this.readOnlyMode('disable', 'notCreateSyncBox');
          this.readOnlyMode('enable', 'notCreateSyncBox');
          this.cm.setOption('readOnly', 'nocursor');
        }

        Vceditor.fromCodeMirror({}, this.cm, editorType, docsInfo);


        const browser = virtualclass.system.mybrowser.detection();
        if (browser[0] === 'Firefox') {
          this.removeScrollFromFireFox(this.etype);
        }
      },

      // TODO its better if disableEditor and enableEditor are removes
      /**
       * This function disables the main container of editor
       * This should apply for iOS(ipad) only
       */
      disableEditorByOuterLayer() {
        // id virtualclassEditorRichBody
        // class CodeMirror cm-s-default CodeMirror-wrap
        const disableEditor = virtualclass.vutil.capitalizeFirstLetter(this.etype);
        const disableEditorSelector = `#virtualclass${disableEditor}Body .CodeMirror.cm-s-default`;
        const editorElem = document.querySelector(disableEditorSelector);
        if (editorElem != null) {
          editorElem.style.pointerEvents = 'none';
        }
        // console.log('Disable editor for ios');
      },

      /**
       * This function enables the main container of editor
       * This should apply for iOS(ipad) only
       */
      enableEditorByOuterLayer() {
        const enableEditor = virtualclass.vutil.capitalizeFirstLetter(this.etype);
        const enableEditorSelector = `#virtualclass${enableEditor}Body .CodeMirror.cm-s-default`;
        const editorElem = document.querySelector(enableEditorSelector);
        if (editorElem != null) {
          editorElem.style.pointerEvents = 'visible';
        }
        // console.log('Enable editor for ios');
      },

      /**
       * Create the code mirror with layout
       * @param mode expect type  of editor
       */
      codemirrorWithLayout(options) {
        this.UI.container(this.etype);
        const edElem = document.getElementById(this.UI.edId);
        if (typeof this.cm !== 'object') {
          // console.log('Code mirror instance is created ');
          this.cm = CodeMirror(document.getElementById(this.UI.edId), options);
        }
      },

      /**
       * requst the data from other use if data is missed at local
       * @param byRequest expects from request is coming from
       * @param withDiffUser is flag for try with different user
       */
      requestData() {
        const toUser = virtualclass.vutil.whoIsTeacher();

        this.readOnlyMode('enable');

        ioAdapter.mustSendUser({
          eddata: 'requestForEditorData',
          et: this.etype,
          cf: 'eddata',
        }, toUser);
      },

      /**
       * Make editor either enable or disable with optional sync message box
       * @param mode mode expect either editor is enable or disbale
       * @param notcreateBox indates iether sync message would created or not
       */
      readOnlyMode(mode, notcreateBox) {
        if (typeof this.cm === 'object') {
          if (mode === 'enable') {
            if (!this.readonly) {
              this.cm.setOption('readOnly', 'nocursor');
              if (typeof notcreateBox === 'undefined') {
                this.UI.createSynchMessageBox();
              }
              this.readonly = 'nocursor';
            }
          } else if (this.readonly && !virtualclass.isPlayMode) {
            this.cm.setOption('readOnly', false);
            this.readonly = false;
            this.UI.hideSynchMessageBox();
          }
          virtualclass.vutil.setReadModeWhenTeacherIsDisConn(virtualclass.vutil.smallizeFirstLetter(this.etype));
        }
      },

      // Check if vcAdapter is ready for given Editor
      isVcAdapterIsReady(et) {
        return (Object.prototype.hasOwnProperty.call(virtualclass[et], 'vcAdapter')
        && typeof virtualclass[et].vcAdapter === 'object');
      },


      receivedOperations: {
        currAppEditor(e) {
          if (e.fromUser.userid != virtualclass.gObj.userid) {
            // console.log('curr app editor');
            virtualclass.currAppEditor = true;
            virtualclass.currAppEditorType = e.message.et;
            virtualclass.dispvirtualclassLayout(virtualclass.currAppEditorType);
          }
        },

        init(e, etype) {
          if ((e.fromUser.role !== 's')
            && ((e.fromUser.userid !== virtualclass.gObj.uid || wbUser.virtualclassPlay === 1)
            || (!virtualclass.config.makeWebSocketReady))) {
            virtualclass.makeAppReady({ app: etype });
          }
        },

        initVcEditor(e) {
          if (roles.hasView()) {
            if (typeof virtualclass[e.message.et].vcAdapter.removeOperations === 'function') {
              virtualclass[e.message.et].vcAdapter.removeOperations(e);
            }
          }

          if ((!roles.hasControls()) || (roles.hasControls() && e.fromUser.userid !== virtualclass.gObj.uid)
            && (Object.prototype.hasOwnProperty.call(e.message, 'resFromUser')
            || Object.prototype.hasOwnProperty.call(e.message, 'allEdData'))) {
            const doc = JSON.parse(e.message.data);


            if (Object.prototype.hasOwnProperty.call(e.message, 'layoutEd')) {
              // if(e.message.cet == 'EditorRich' || e.message.cet == 'EditorCode'){
              //    virtualclass.currAppEditor = true;
              // }

              this.initialiseDataWithEditor(doc, e.message);
            } else {
              this.initialiseDataWithEditor(doc);
            }
          }
        },

        requestForEditorData(e) {
          if (e.fromUser.userid !== virtualclass.gObj.uid) {
            if (typeof this.vcAdapter !== 'object' || this.vcAdapter.operations.length === 0) {
              // TODO Check if it is required to send to all
              // TODO Check if it is possible avoid going through workerIO
              ioAdapter.mustSendAll({ eddata: 'noDataForEditor', cf: 'eddata' });
              return;
            }
            this.responseToRequest(e.fromUser.userid);
          } else {
            // console.log('Cannot send requestForEditorData to self');
          }
        },

        noDataForEditor() {
          if (roles.hasControls()) {
            // this.requestData('fromTeacher', 'withDifStudent');
          }
        },

        'virtualclass-editor-operation': function (e) {
          if (typeof this.vcAdapter === 'object') {
            // At received of some packet, if there would enabled readOnlyMode, we disabled it

            this.readOnlyMode('disable');
            this.vcAdapter.receivedMessage(e);
          }
        },


        'virtualclass-editor-cursor': function (e) {
          if (typeof this.vcAdapter === 'object') {
            this.vcAdapter.receivedMessage(e);
          }
        },

        select() {
          if (typeof this.vcAdapter === 'object') {
            this.vcAdapter.receivedMessage(e);
          }
        },
      },


      /**
       *  Handle all the responses related to editor coming from server
       * @param e expects event parameter
       * @param etype expects editor type
       */
      onmessage(e, etype) {
        // at student
        // second condition is need because e.message.fromuser and virtualclass.gob.uid are same
        // TODO this all if and else condition should be simplyfy
        this.receivedOperations[e.message.eddata].call(this, e, etype);
        if (typeof this.vcAdapter !== 'object') {
          if (roles.hasAdmin() && e.message.eddata === 'virtualclass-editor-operation') {
            // virtualclass.makeAppReady(etype);
            virtualclass.makeAppReady({ app: etype });

            // this.vcAdapter should convert into otAdapter
            this.vcAdapter.receivedMessage(e, onmessage);
          }
          // console.log('virtualclass adapter is not ready for editor');
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
        container(classes) {
          if (document.getElementById(this.id) == null) {
            const containertemplate = virtualclass.getTemplate('editorrich', 'editor');
            const containerhtml = containertemplate({
              type: virtualclass.vutil.capitalizeFirstLetter(classes),
              class: classes,
            });
            // $('#virtualclassAppLeftPanel').append(containerhtml);

            virtualclass.vutil.insertAppLayout(containerhtml);
          }
        },

        /**
         * Create synchronizing message box
         * to user for wating
         */
        createSynchMessageBox() {
          if (document.getElementById('synchMessageBox') != null) {
            this.showSynchMessageBox();
          } else {
            const msgtemplate = virtualclass.getTemplate('messagebox', 'editor');
            const msghtml = msgtemplate();
            const parTag = document.getElementById(this.id);
            parTag.insertAdjacentHTML('afterbegin', msghtml);
          }
        },

        // TODO below 2 functions can be convert into 1
        showSynchMessageBox() {
          const synchMessageBox = document.getElementById('synchMessageBox');
          if (synchMessageBox != null) {
            synchMessageBox.style.display = 'block';
          }
        },

        hideSynchMessageBox() {
          const synchMessageBox = document.getElementById('synchMessageBox');
          if (synchMessageBox != null) {
            synchMessageBox.style.display = 'none';
          }
        },
      },

      /**
       * Response the requested data to requested user
       * @param appIsEditor does decide the editor shoudl be shown or not at other user
       */
      responseToRequest(toUser) {
        const initPacket = this.getWrappedOperations(true);
        initPacket.layoutEd = '1'; // this would be for create editor layout
        if (roles.isTeacher()) {
          initPacket.capp = virtualclass.currApp; // this should pass only when user is educator
        }
        initPacket.et = this.etype;
        if (toUser) {
          initPacket.resFromUser = true;
          ioAdapter.mustSendUser(initPacket, toUser);
        } else {
          initPacket.allEdData = true;
          virtualclass[initPacket.et].vcAdapter.removeOperations({ message: { et: initPacket.et } });
          const operations = JSON.parse(initPacket.data);
          virtualclass[initPacket.et].initialiseDataWithEditor(operations); // for display content to self
          virtualclass[initPacket.et].vcAdapter.myOTrequestData = 0;
          if (virtualclass.currApp === 'EditorRich') {
            ioAdapter.mustSend(initPacket);
          }
        }
      },

      /**
       * Check if teacher editor of teacher is
       * @returns {boolean}
       */
      isEidtorWithTeacher() {
        return (roles.hasControls() && (virtualclass.currApp === 'EditorRich'
        || virtualclass.currApp === 'EditorCode'));
      },

      /**
       * Wrapped the text operation with reviion, string etc.
       * @returns {{eddata: string, data, et: *}}
       */
      getWrappedOperations(removelast) {
        let operations;
        if (this.vcAdapter && this.vcAdapter.operations) {
          operations = serialiseOps(this.vcAdapter.operations);
        } else {
          operations = [];
        }
        // var operations = this.vcAdapter && this.vcAdapter.operations ? serialiseOps(this.vcAdapter.operations): [];
        // We only want the most recent 50 because we can't send too much data

        const wrappedOperations = {
          eddata: 'initVcEditor',
          data: JSON.stringify({
            // revision: this.cmClient.revision,
            // revision: 0,
            // clients: [],
            // //str: this.cm.getValue(), //cm is my code mirror
            // str: '',
            operations,
          }),

          et: this.etype,
          cf: 'eddata',
        };

        return wrappedOperations;
      },


      getStudentAllText() {
        return this.cm.getValue('\n');
      },

      /**
       * Remove the Code Mirror from DOM
       * and make empty of code mirror object
       */
      removeCodeMirror() {
        this.readonly = false;
        const uiCont = document.getElementById(this.UI.id);
        if (uiCont != null) {
          uiCont.parentNode.removeChild(uiCont);
        }
        this.cm = '';
      },

      setReadMode() {
        // const cmReadOnly = JSON.parse(localStorage.getItem(this.etype));
        let writeMode;
        const cmReadOnly = this.editorStatus;
        if (!roles.hasAdmin()) {
          if (cmReadOnly != null) {
            if (!cmReadOnly) {
              this.cm.setOption('readOnly', 'nocursor');
              writeMode = false;
            } else {
              this.cm.setOption('readOnly', false);
              writeMode = true;
            }
          } else {
            this.cm.setOption('readOnly', 'nocursor');
            writeMode = false;
          }
          const editorTypeCapitalize = virtualclass.vutil.capitalizeFirstLetter(this.etype);
          virtualclass.user.control.toggleDisplayWriteModeMsgBox(editorTypeCapitalize, writeMode);
          virtualclass.vutil.setReadModeWhenTeacherIsDisConn(virtualclass.vutil.smallizeFirstLetter(this.etype));

          // For handle editor's read only mode on iPad
          // if (virtualclass.system.mybrowser.name == 'iOS' && virtualclass.system.isIPad()) {
          //   if (writeMode) {
          //     this.enableEditorByOuterLayer();
          //   } else {
          //     this.disableEditorByOuterLayer();
          //   }
          // }
        }
      },

      writeBulkDocs(doc) {
        const tempOps = deserialiseOps(doc.operations); // Get deserialize operations

        // Make ready the default docs for initialize the editor
        doc.revision = 0; // Does need every time page loads, else it would doubles.
        if ((this.cm)) {
          if ((this.cm.getValue() !== doc.str) || (doc.str === '')) {
            this.cmClient = '';
            this.vcAdapter = '';
            doc.operations = [];
            doc.doc = '';
          }

          this.createEditorClient(editorToolbar, doc); // creating editor client and virtualclass adapter
          this.prvEdRev = doc.revision;
        }

        // Write the text/operation on Editor by triggering the operation
        for (let i = 0; i < tempOps.length; i++) {
          virtualclass[this.etype].vcAdapter.server.receiveOperation(i, tempOps[i]);
          this.vcAdapter.trigger('operation', tempOps[i].wrapped.toJSON());
        }
      },

      /**
       * After editor packets recived from teacher
       * will set with code mirror, and apply the operations agains text transform
       */

      initialiseDataWithEditor(doc, msg) {
        const tempOps = deserialiseOps(doc.operations); // Get deserialize operations

        // initializeig the editor to virtualclass current application
        if (typeof msg !== 'undefined' && Object.prototype.hasOwnProperty.call(msg, 'capp')) {
          virtualclass.currApp = virtualclass.vutil.capitalizeFirstLetter(msg.capp);
        }

        // if (typeof displayEditor != 'undefined') {
        //    if (virtualclass.currAppEditor) {
        //        if (virtualclass.currAppEditorType == et) {
        //            virtualclass.currApp = virtualclass.vutil.capitalizeFirstLetter(et);
        //        }
        //    } else {
        //        virtualclass.currApp = virtualclass.vutil.capitalizeFirstLetter(et);
        //    }
        // }

        this.removeCodeMirror(); // Remove code mirror from dom if exist

        this.codemirrorWithLayout(editorType); // Create the code mirror instance with layout

        virtualclass.dispvirtualclassLayout(virtualclass.currApp); // If virtualclass.currApp is editor then display it

        this.writeBulkDocs(doc);


        this.cm.refresh();
        this.setReadMode(); // Setting the Editor read mode

        const currApp = virtualclass.vutil.capitalizeFirstLetter(virtualclass.currApp);
        if (currApp === 'EditorRich' || currApp === 'EditorCode') {
          virtualclass.previous = `virtualclass${virtualclass.currApp}`;
        } else {
          // if current app is not editor and, there is displaying editor in browser
          // disable that editor
          const ediotrRich = document.getElementById('virtualclassEditorRich');
          if (ediotrRich != null) {
            ediotrRich.style.display = 'none';
          }

          const ediotrCode = document.getElementById('virtualclassEditorCode');
          if (ediotrCode != null) {
            ediotrCode.style.display = 'none';
          }
        }

        const editorTool = document.getElementById('virtualclassEditorTool');
        if (editorTool != null) {
          editorTool.style.pointerEvents = 'visible';
        }
        otAdapter.myrequestData = 0;
      },

      /**
       * removing error data from local storage
       * and from inline memory
       */
      removeEditorData() {
        if (typeof this.cm === 'object') {
          if (typeof this.vcAdapter === 'object') {
            this.vcAdapter.operations.length = 0;
          }
          // this.cm.setValue("");
          this.removeCodeMirror();
          localStorage.removeItem(`${this.etype}_allEditorOperations`);
          localStorage.removeItem(`${this.etype}_edOperationRev`);
        }
      },

      /**
       * Save the editor data in to local storage
       */
      saveIntoLocalStorage() {
        if ((typeof this.vcAdapter === 'object' && this.vcAdapter.operations.length > 0)) {
          const wrappedOperations = this.getWrappedOperations();
          // localStorage.removeItem(`${this.etype}_allEditorOperations`);
          // localStorage.setItem(`${this.etype}_allEditorOperations`, JSON.stringify(wrappedOperations));
          // localStorage.setItem(`${this.etype}_edOperationRev`, this.cmClient.revision);
        }
      },

      undoManager(keycode) {
        // Setitmeout is used  to produce the dealy for firefox
        // TODO remove setTimeout
        setTimeout(
          () => {
            if (keycode === 90) {
              document.querySelector('.vceditor-tb-undo').parentNode.click();
            } else if (keycode === 89) {
              document.querySelector('.vceditor-tb-redo').parentNode.click();
            }
          }, 0,
        );
      },

      initAttachTool() {
        const myStyleGroup = document.querySelector('.vceditor-btn-style-group');
        const myListGroup = document.querySelector('.vceditor-btn-list-group');
        const myIndentGroup = document.querySelector('.vceditor-btn-indent-group');
        const myParagraphGroup = document.querySelector('.vceditor-btn-paragraph-group');

        myStyleGroup.addEventListener('mousedown', this.editorNavBar.bind(this));
        myListGroup.addEventListener('mousedown', this.editorNavBar.bind(this));
        myIndentGroup.addEventListener('mousedown', this.editorNavBar.bind(this));
        myParagraphGroup.addEventListener('mousedown', this.editorNavBar.bind(this));
        window.addEventListener('mouseup', this.editorTool.bind(this));
      },

      editorNavBar(ev) {
        if (ev.target.classList[0] === 'vceditor-btn-style-group'
          || ev.target.classList[0] === 'vceditor-btn-list-group'
          || ev.target.classList[0] === 'vceditor-btn-indent-group'
          || ev.target.classList[0] === 'vceditor-btn-paragraph-group') {
          const openElement = document.querySelector('.vceditor-toolbar-wrapper .open');
          const elem = document.querySelector(`.${ev.target.classList[0]}`);
          if (openElement == null || !ev.currentTarget.classList.contains(openElement.classList[0])) {
            virtualclass.editorRich.getEditorToolElem();
            elem.classList.remove('close');
            elem.classList.add('open');
          } else if (openElement != null && elem.classList.contains('open')) {
            elem.classList.remove('open');
            elem.classList.add('close');
          }
        }
      },

      editorTool(ev) {
        const currApp = document.querySelector('#virtualclassCont').dataset.currapp;
        if (currApp !== null && currApp === 'EditorRich' && !ev.target.classList.contains('open')) {
          virtualclass.editorRich.getEditorToolElem();
        }
      },

      getEditorToolElem() {
        const openElement = document.querySelector('.vceditor-toolbar-wrapper .open');
        if (openElement != null) {
          openElement.classList.remove('open');
          openElement.classList.add('close');
        }
      },
    };
  };

  // Turns the Array of operation Objects into an Array of JSON stringifyable objects
  const serialiseOps = function (operations) {
    return operations.map(op => ({
      operation: op.wrapped.toJSON(),
    }));
  };

  // Turns the JSON form of the Array of operations into ot.TextOperations
  const deserialiseOps = function (operations) {
    const vceditor = Vceditor.getvcEditor();
    return operations.map(op => new vceditor.WrappedOperation(
      vceditor.TextOperation.fromJSON(op.operation),
      op.cursor && vceditor.Cursor.fromJSON(op.cursor),
    ));
  };

  window.editor = editor;
}(window));
