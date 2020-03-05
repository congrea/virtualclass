// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2017  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This file is responsible for sharing the document, it responsible for
 * upload the docs, re-arrangement, disable and delete sending doc to the server and receiving from server
 * It display the docs from localstorage if exist otherwise request the docs to the server
 */

(function (window) {
  let firstTime = true;
  const documentShare = function () {
    return {
      allPages: null,
      allNotes: null, // this contains all notes received from server
      allDocs: null, // This contains all docs received from server
      notes: null,
      order: [],
      tempFolder: 'documentSharing',
      appName: 'DocumentShare',
      sentStudentLayout: false,
      async init() {
        if (!virtualclass.orderList[this.appName]) {
          // console.log('====> ORDER LIST IS CREATING ');
          virtualclass.orderList[this.appName] = new OrderedList();
        }

        this.pages = {};
        this.notes = {};
        firstTime = true;
        if (typeof this.indexNav === 'undefined') {
          this.indexNav = new virtualclass.pageIndexNav('documentShare');
        }
        // this.indexNav = new virtualclass.pageIndexNav('documentShare');
        this.UI.container();
        // console.log('====> DOCUMENT SHARE SUMAN 1A');
        if (roles.hasControls() && virtualclass.config.makeWebSocketReady) {
          // console.log('====> DOCUMENT SHARE SUMAN 1B');
          ioAdapter.mustSend({ dts: { init: 'studentlayout' }, cf: 'dts' });
          console.log('===> document share studentlayout');
          virtualclass.dts.sentStudentLayout = true;
          virtualclass.serverData.syncAllData();
        }
        await this.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
      },

      moveProgressbar() {
        const cont = document.querySelector('#docsUploadMsz');
        const msz = document.querySelector('#docsuploadContainer .qq-upload-list-selector.qq-upload-list');
        if (msz) {
          msz.style.display = 'block';
          const divCont = document.createElement('div');
          cont.appendChild(divCont);
          divCont.appendChild(msz);
        }
      },

      /**
       * This function displays the current note on screen
       * and highlight the naviation of that screen
       */
      setNoteScreen(docsObj) {
        if (document.querySelector(`#note${docsObj.slideNumber}.current.note`) == null) {
          const doc = this.getDocId(docsObj.slideNumber);
          this.docs.executeScreen(doc, 'fromreload', undefined, docsObj.slideNumber);
          this.setScreenByOrder(doc);
        }
      },

      /**
       * This display the notes acorrding to order
       * Whatever the order will be on virtualclass.orderList[this.appName].ol.order,
       * there will be display the notes according to this
       */
      setScreenByOrder(currDoc) {
        if (virtualclass.orderList[this.appName].ol.order != null
          && virtualclass.orderList[this.appName].ol.order.length > 0) {
          const allNotes = this.getAllNotes(virtualclass.orderList[this.appName].ol.order);
          let docId;
          for (let i = 0; i < allNotes.length; i++) {
            docId = allNotes[i].id.split('_')[0];
            this.setLinkSelected(docId, 1);
          }
          // remove if there is already pages before render the ordering elements
          this.createNoteLayout(allNotes, currDoc);

          this.reArrangeNotes(virtualclass.orderList[this.appName].ol.order);

          // TODO This should be improve at later, should handle at function createNoteNav
          for (let i = 0; i < virtualclass.orderList[this.appName].ol.order.length; i++) {
            const docStatus = this.allNotes[virtualclass.orderList[this.appName].ol.order[i]].status;
            this.noteStatus(virtualclass.orderList[this.appName].ol.order[i], docStatus);
          }
        }
      },

      createNoteLayout(notes, currDoc) {
        let mainContainer;
        let tempCont;
        let template;
        let tempHtml;
        const allNotes = [];
        for (let i = 0; i < notes.length; i++) {
          if (!Object.prototype.hasOwnProperty.call(notes[i], 'deletedn')) {
            allNotes.push(notes[i]);
          }
        }

        if (allNotes.length > 0) {
          const pageContainer = document.querySelector('#screen-docs .pageContainer');
          if (pageContainer == null) {
            tempCont = { notes: allNotes, hasControls: roles.hasControls(), cd: currDoc };
            template = 'screen';
            mainContainer = document.querySelector('#docScreenContainer');
          } else {
            tempCont = { notes: allNotes };
            template = 'notesMain';
            mainContainer = document.querySelector('#screen-docs #notesContainer');
          }

          template = virtualclass.getTemplate(template, 'documentSharing');
          tempHtml = template(tempCont);

          if (mainContainer != null) {
            mainContainer.insertAdjacentHTML('beforeend', tempHtml);
          } else {
            // console.log('there is no such element');
          }

          if (!roles.hasControls()) {
            virtualclass.vutil.showZoom();
          }
        }
      },

      /**
       * This function is trigger after upload the doc,
       * create the intance of page/navigation from this page
       */
      afterUploadFile(doc) {
        if (roles.hasControls()) {
          this.createPageForNavigation(doc);
          virtualclass.serverData.pollingStatus().then(() => { virtualclass.dts.afterConverted(); });
        }
      },

      /**
       * It creates the instance for doc which is uploaded to LMS
       * @param id expects the document id
       */
      initDocs(id) {
        if (typeof this.pages[id] !== 'object') {
          let status = 0;
          if (this.allDocs[id].status === 'true' || this.allDocs[id].status === 1) {
            status = 1;
          }
          const docId = `docs${id}`;
          this.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
          // this.pages[docId].init(id, this.allDocs[id].title);
          this.pages[docId].init(id, this.allDocs[id].filename);
        }
      },

      fetchAllNotes() {
        const allNotes = {};
        for (const key in virtualclass.dts.allDocs) {
          for (let j = 0; j < virtualclass.dts.allDocs[key].notesarr.length; j++) {
            allNotes[virtualclass.dts.allDocs[key].notesarr[j].id] = virtualclass.dts.allDocs[key].notesarr[j];
          }
        }
        return allNotes;
      },

      // calling from both teacher and student
      afterFirstRequestDocs(docs) {
        this.rawToProperData(docs);
        for (const key in this.allDocs) {
          if (!Object.prototype.hasOwnProperty.call(this.allDocs[key], 'deleted')) {
            this.initDocs(this.allDocs[key].fileuuid);
          }

          // else {
          //   this._deleteUI(this.allDocs[key].fileuuid);
          // }
        }

        if (roles.hasAdmin()) {
          if (virtualclass.config.makeWebSocketReady) {
            this.requestOrder(this.executeOrder);
          } else {
            // this.executeOrder(virtualclass.gObj.docOrder.docs);
            this.executeOrder(virtualclass.orderList.DocumentShare.ol.order);
          }
        }

        // (virtualclass.dts.noteExist()) ? virtualclass.dashboard.close() : virtualclass.dashboard.open();
      },

      rawToProperData(docs) {
        this.allDocs = this.convertInObjects(docs);
        this.allNotes = this.fetchAllNotes();
      },

      /**
       * This would be performed after got
       * the request
       * @param docs expects documenation list that have been
       * received from LMS and localstorage
       */
      afterRequestOrder(content) {
        // console.log('====> dts order after request ', content.length);
        if (content != null && content.length > 0) {
          // virtualclass.orderList[this.appName].ol.order.length = 0;
          virtualclass.orderList[this.appName].ol.order = content;
          // console.log('====> DTS ORDER ', virtualclass.orderList[this.appName].ol.order);

          const doc = this.getDocId(virtualclass.orderList[this.appName].ol.order[0]);
          if (Object.prototype.hasOwnProperty.call(virtualclass.dts.allDocs, doc)) {
            const docId = `docs${doc}`;
            // var mainCont = this.pages[docId].UI.mainView.call(this.pages[docId]);
            // console.log(`From database doc share order ${virtualclass.orderList[this.appName].ol.order.join(',')}`);
            this.setScreenByOrder(docId);
            this.docs.currNote = virtualclass.orderList[this.appName].ol.order[0];
            this.docs.displayScreen(docId, virtualclass.orderList[this.appName].ol.order[0]);
          }
        }
      },

      /**
       * this requests the order from LMS
       */
      requestOrder(cb) {
        // console.log('====> dts order request ');
        virtualclass.vutil.requestOrder(cb);
      },

      executeOrder(response){
        if (response != null && typeof response !== 'undefined') {
          if (response.length > 0) {
            if (response === 'Failed' || response === 'Error') {
              // console.log('page order retrieve failed');
              $('#congdashboard').modal();
              console.log('Congrea dashboard here');
              // console.log(`dashboard length ${$('#congdashboard').length}`);
              virtualclass.dashboard.clickCloseButton();
            } else if (response && roles.hasAdmin()) {
              // console.log('==== dts must send order');
              ioAdapter.mustSend({ dts: { order_recived: virtualclass.orderList.DocumentShare.ol.order }, cf: 'dts' });
              if (virtualclass.currApp === 'DocumentShare') {
                virtualclass.dts.afterRequestOrder(virtualclass.orderList.DocumentShare.ol.order);
                virtualclass.dts.createNoteNav();
                // (virtualclass.dts.noteExist()) ? virtualclass.dashboard.close() : virtualclass.dashboard.open()
              }
            }
          }
        }
      },

      /**
       * this requests documentation lists from LMS
       */
      getFilenameFromUploadingfiles(doc) {
        for (let i = 0; i < virtualclass.gObj.uploadingFiles.length; i++) {
          return virtualclass.gObj.uploadingFiles[i].name;
        }
      },

      createPageForNavigation(doc) {
        const newDocObj = {
          filename: this.getFilenameFromUploadingfiles(doc),
          fileuuid: doc,
          filepath: 'somewhere',
          filetype: 'doc',
          key_room: `${virtualclass.gObj.sessionInfo.key}_${virtualclass.gObj.sessionInfo.room}`,
          status: 1,
        };

        this.allDocs[doc] = newDocObj;
        let status = 0;
        if (this.allDocs[doc].status === 'true' || this.allDocs[doc].status === 1) {
          status = 1;
        }

        const docId = `docs${doc}`;
        if (typeof this.pages[docId] !== 'object') {
          this.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
          this.pages[docId].init(doc, this.allDocs[doc].filename);
          if (!Object.prototype.hasOwnProperty.call(this.allDocs[doc], 'notes')) {
            const element = document.querySelector(`#linkdocs${doc}`);
            element.classList.add('noDocs');
          }
        }
      },

      afterConverted() {
        // console.log('polling status done 2');
        virtualclass.dts.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
        ioAdapter.mustSend({ dts: { fallDocs: true }, cf: 'dts' });
        this.removeNoDocsElem();
      },

      triggerMsgCloseButton() {
        if (this.successMsgTime) {
          clearTimeout(this.successMsgTime);
        }

        this.successMsgTime = setTimeout(() => {
          const msgCloseButton = document.querySelector('#docsUploadMsz .close');
          if (msgCloseButton) {
            msgCloseButton.click();
          }
        }, 4000);
      },

      removeNoDocsElem() {
        const allNoDocsElem = document.querySelectorAll('.noDocs');
        for (let i = 0; i < allNoDocsElem.length; i++) {
          allNoDocsElem[i].classList.remove('noDocs');
        }
      },

      requestSlides(filepath) {
        // console.log(`${virtualclass.gObj.currWb} ` + `document share : request ${filepath}`);

        const relativeDocs = this.getDocs(filepath);
        if (relativeDocs != null) {
          const dsStatus = document.querySelector(`#linkdocs${filepath}`).dataset.selected;
          ioAdapter.mustSend({ dts: { dres: filepath, ds: (1 - (+dsStatus)) }, cf: 'dts' });
          return relativeDocs;
        } else {
          return null;
        }
      },

      getNotes(id) {
        return this.allDocs[id].notesarr;
      },

      removePagesUI(doc) {
        // console.log('====> Note remove UI');
        const notes = this.getNotes(doc);
        for (let i = 0; i < notes.length; i++) {
          this.removePageUI(notes[i].id);
        }
        if (virtualclass.orderList[this.appName].ol.order.length <= 0) {
          firstTime = true;
        }
        if (roles.hasControls()) {
          this.indexNav.createIndex();
        }
      },

      removePageUI(noteId) {
        // console.log('====> DOCUMENT SHARING removing node', noteId);

        // console.log('JAI 2b');
        const orderId = virtualclass.orderList[this.appName].ol.order.indexOf(noteId);
        if (orderId >= 0) {
          virtualclass.orderList[this.appName].ol.order.splice(orderId, 1);
        }
        const note = document.querySelector(`#notesContainer #note${noteId}`);
        if (note != null) {
          note.parentNode.removeChild(note);
        }

        if (typeof virtualclass.wb[`_doc_${noteId}_${noteId}`] === 'object') {
          // delete whiteboard object
          // console.log('Delete whiteboard');

          // TODO, we need look why it is causing the problem on page refresh
          delete virtualclass.wb[`_doc_${noteId}_${noteId}`];
          console.log('JAI 3');
        }
        this.removeNoteNav(noteId);
        this.reaArrangeThumbCount();
        if (!roles.hasControls()) {
          const curr = document.querySelector('#notesContainer .note.current');
          if (curr) {
            const id = curr.id.split('note')[1];
            virtualclass.dts.indexNav.studentDocNavigation(id);
          } else {
            const cont = document.getElementById('stdPageNo');
            if (cont) {
              cont.innerHTML = 1;
            }

            // virtualclass.indexNav.setTotalPages((virtualclass.orderList[virtualclass.dts.appName].ol.order.length));
            virtualclass.dts.indexNav.setTotalPages(virtualclass.orderList.DocumentShare.ol.order.length);
          }
        }
      },

      addPages(slides) {
        let j = 0;
        while (j < slides.length) {
          if (!Object.prototype.hasOwnProperty.call(slides[j], 'deletedn')) {
            if (virtualclass.orderList[this.appName].ol.order != null) {
              if (virtualclass.orderList[this.appName].ol.order.indexOf(slides[j].id) <= -1) {
                virtualclass.orderList[this.appName].insert(slides[j].id);
                // console.log('====> ORDER is generating');
              }
            }
          }
          j++;
        }
      },

      toggleSlideWithOrder(doc) {
        const linkDoc = document.querySelector(`#linkdocs${doc}`);
        if (linkDoc != null) {
          if (linkDoc.dataset.selected === '1') {
            linkDoc.dataset.selected = 0;
            return false;
          }
          linkDoc.dataset.selected = 1;
          return true;
        }
        // console.log('Document sharing There is no Element');
      },

      setLinkSelected(doc, val) {
        const linkDoc = document.querySelector(`#linkdocs${doc}`);
        if (linkDoc != null) {
          linkDoc.dataset.selected = val;
        }
      },

      onResponseFiles(doc, slides, docFetch, slide, fromReload) {
        let docId;
        if (firstTime) {
          if (typeof slide !== 'undefined'){
            this.docs.currNote = slide;
          } else {
            if (!virtualclass.dts.noteExist()) {
              let i = 0;
              for (; i < slides.length; i++) {
                if (slides[i].status === 1) {
                  slide = slides[i].id;
                  break;
                }
              }
              this.docs.currNote = slide // first id if order is not defined
            }
          }
          firstTime = false;
        }

        let addSlide;
        if (typeof docFetch !== 'undefined') {
          addSlide = +docFetch;
          if (roles.hasControls()) {
            (docFetch === 1) ? this.setLinkSelected(doc, 1) : this.setLinkSelected(doc, 0);
          }
        } else if (roles.hasControls()) {
          addSlide = this.toggleSlideWithOrder(doc, slides);
        } else {
          addSlide = true;
        }

        // var addSlide = this.toggleSlideWithOrder(doc, slides);
        if (addSlide) {
          // TODO, order is fine now, but we have to hanlde this gracefully as done in video and ppt
          console.log('====> document share nav add ');
          this.addPages(slides);

          if (typeof doc !== 'string') {
            docId = `docs${doc}`;
          } else if (doc.indexOf('docs') >= 0) {
            docId = doc;
          } else {
            docId = `docs${doc}`;
          }

          this.createNoteLayout(slides, docId);

          if (typeof slide !== 'undefined') {
            this.docs.displayScreen(docId, slide);
          } else if (!virtualclass.dts.noteExist()) {
            this.docs.displayScreen(docId);
          }
          (typeof fromReload !== 'undefined') ? this.createNoteNav(fromReload) : this.createNoteNav();
          this.updateLinkNotes(this.docs.currNote);
          virtualclass.dts.setCurrentNav(this.docs.currNote);
          virtualclass.vutil.hideUploadMsg('docsuploadContainer'); // file uploader container
          virtualclass.vutil.addNoteClass();
        } else {
          console.log('====> document share nav remove ');
          // this.removePagesUI(doc);
          this.deleteNotesFromOrder(doc);
          this.removePagesUI(doc);

          if (!virtualclass.dts.noteExist()) {
            virtualclass.vutil.showUploadMsg('docsuploadContainer'); // file uploader container
            virtualclass.dts.docs.currNote = 0;
            virtualclass.dts.docs.currDoc = undefined;
            virtualclass.gObj.currWb = null;
            // virtualclass.dts.indexNav.removeNav();
          }

          if (!virtualclass.dts.docSelected()) {
            const docsObj = JSON.parse(localStorage.getItem('dtsdocs'));
            if (docsObj != null) {
              docsObj.slideNumber = null;
              // localStorage.setItem('dtsdocs', JSON.stringify(docsObj));
            }
            if (roles.isStudent()) {
              if (!virtualclass.dts.noteExist()) {
                const docsContainer = document.querySelector('#docScreenContainer');
                if (docsContainer != null) {
                  docsContainer.classList.remove('noteDisplay');
                  console.log('====> noteDisplay removing');
                }
                virtualclass.gObj.currWb = null;

                const virtualclassCont = document.querySelector('#virtualclassCont');
                virtualclassCont.classList.remove('pdfRendering');

                // if(!Object.keys(virtualclass.dts.notes).length){
                //  if(!roles.hasControls()){
                const zoomHide = document.querySelector('#virtualclassAppLeftPanel.hideZoom');
                const zoom = document.querySelector('#virtualclassAppLeftPanel');
                if (!zoomHide) {
                  zoom.classList.add('hideZoom');
                  zoom.classList.remove('showZoom');
                }
              }
            }
          }
        }

        const currNavApp = document.querySelector('#listnotes .currentNav');
        if (currNavApp == null) {
          const firstNote = document.querySelector('#listnotes .linknotes');
          if (firstNote != null) {
            virtualclass.dts.currNote = firstNote.dataset.rid;
            const mainp = document.querySelector(`#mainpnotes${virtualclass.dts.currNote}`);
            // Clicking on default doc's navigation
            if (mainp != null) {
              // Getting the relative document according to note
              virtualclass.dts.docs.currDoc = virtualclass.dts.currNote.split('_')[0];
              mainp.click();
            }
          }
        }

        if (roles.hasAdmin()) {
          this.sendOrder(virtualclass.orderList[this.appName].ol.order);
        }
      },

      selectFirstNote() {
        const currenElement = document.querySelector('#notesContainer .current');
        if (currenElement == null) {
          const firstElement = document.querySelector('#notesContainer .note');
          if (firstElement != null) {
            this.docs.currNote = firstElement.dataset.slide;
            // console.log(`Current note ${this.docs.currNote}`);
            this.docs.currDoc = `docs${this.getDocId(firstElement.dataset.slide)}`;
            this.docs.note.getScreen(firstElement);
          }
        }
      },

      isDocumentExist(docsObj) {
        if (typeof docsObj !== 'undefined') {
          if (docsObj.init !== 'layout' && docsObj.init !== 'studentlayout') {
            return true;
          }
          return false;
        }
      },

      isDocAlreadyExist(id) {
        for (let i = 0; i < this.documents.length; i++) {
          if (this.documents[i].id === id) {
            return true;
          }
        }
        return false;
      },

      UI: {
        id: 'virtualclassDocumentShare',
        class: 'virtualclass container',

        /*
         * Creates container for the video and appends the container before audio widget
         */
        container() {
          const docShareCont = document.getElementById(this.id);
          if (docShareCont == null) {
            // const control = !!roles.hasAdmin();
            const data = { control: roles.hasControls() };

            const template = virtualclass.getTemplate('docsMain', 'documentSharing');
            // $('#virtualclassAppLeftPanel').append(template(data));

            // $('#virtualclassAppLeftPanel').append(template(data));

            virtualclass.vutil.insertAppLayout(template(data));


            if (document.querySelector('#congdashboard') == null) {
              // Creating Document Dashboard Container
              const dashboardTemp = virtualclass.getTemplate('dashboard');
              const dbHtml = dashboardTemp({ app: 'DocumentShare' });
              document.querySelector('#dashboardContainer').innerHTML = dbHtml;
            }
          }

          if (document.querySelector('#DocumentShareDashboard') == null) {
            const elem = document.createElement('div');
            const cont = document.querySelector('#congdashboard .modal-body');
            cont.appendChild(elem);
            elem.id = 'DocumentShareDashboard';
          }

          if (document.querySelector('#docsDbCont') == null) {
            // Creating  DOC's Dashboard
            const docDashboard = virtualclass.vutil.getDocsDashBoard('DocumentShare');
            document.querySelector('#DocumentShareDashboard').innerHTML = docDashboard;
            if (roles.hasControls()) {
              virtualclass.vutil.attachEventToUploadTab();
              if (document.querySelector('#DocumentShareDashboard .qq-gallery') == null) {
                virtualclass.vutil.modalPopup('docs', ['docsuploadContainer']);
              }
              /** Initialize close handler of document's dailogue box, if it's not,
               *  then there is a problem when user click on document dashboard after page refreshing on whiteboard */
              virtualclass.dashboard.modalCloseHandler();
            }
          }
        },

        createMainContent(container, content, docId) {
          // this.createSlides(container, content);
        },

        createSlides(pageContainer, allNotes) {
          let notes = document.querySelector('#notesContainer');
          if (notes == null) {
            notes = document.createElement('div');
            notes.className = 'notes';
            notes.id = 'notesContainer';
          }

          const cthis = virtualclass.dts;
          for (let i = 0; i < allNotes.length; i++) {
            const noteId = `note${allNotes[i].id}`;
            if (document.querySelector(`#note${allNotes[i].id}`) == null) {
              const note = document.createElement('div');
              note.id = `note${allNotes[i].id}`;
              note.className = 'note';
              note.dataset.slide = allNotes[i].id;

              if (note.dataset.statuS === 'true' || note.dataset.statuS === true) {
                note.dataset.status = 1;
              } else if (note.dataset.status === 'false' || note.dataset.status === false) {
                note.dataset.status = 0;
              } else {
                note.dataset.status = allNotes[i].status;
              }
            }
          }

          pageContainer.appendChild(notes);
          if (roles.hasControls()) {
            this.createNavigation(pageContainer, 'prev');
            this.createNavigation(pageContainer, 'next');
          }
        },

        createNavigation(pageContainer, cmd) {
          if (document.querySelector(`#docs${cmd}`) == null) {
            const nav = document.createElement('span');
            nav.className = `${'nvgt' + ' '}${cmd}`;
            nav.id = `docs${cmd}`;
            pageContainer.appendChild(nav);
          }
        },

        /**
         * Display leftbar navigation
         *
         */
        createDocsNav(elem, docId) {
          // Please put below comment into console to create dummy
          // var docScreenContainer = document.getElementById('docScreenContainer');
          // virtualclass.dts.UI.createDocsNav(docScreenContainer, 1);

          // var docScreenContainer = document.getElementById('docScreenContainer');
          // virtualclass.dts.UI.createDocsNav(docScreenContainer, 2);

          let docNav = document.getElementById('listDocs');
          if (docNav == null) {
            const cthis = virtualclass.dts;
            docNav = document.createElement('div');
            docNav.id = 'listDocs';
            elem.appendChild(docNav);
          }

          const linkNav = this.createDocsNavLink(docId);
          this.attachDocsNav(linkNav, docId);
          docNav.appendChild(linkNav);
        },

        createDocsNavLink(sn) {
          const link = document.createElement('div');
          link.id = `link${sn}`;
          link.className = 'linkdoc';
          link.innerHTML = sn;
          link.dataset.screen = sn;
          return link;
        },

        attachDocsNav(linkNav, docId) {
          const cthis = virtualclass.dts;
          linkNav.onclick = cthis.docs.goToDocs(docId);
        },
      },

      createNoteNav(fromReload) {
        let status;
        if (virtualclass.orderList[this.appName].ol.order) {
          this.indexNav.init();
        }

        for (let i = 0; i < virtualclass.orderList[this.appName].ol.order.length; i++) {
          if (typeof this.notes[virtualclass.orderList[this.appName].ol.order[i]] !== 'object') {
            if (this.allNotes[virtualclass.orderList[this.appName].ol.order[i]].status === 'true'
              || (+this.allNotes[virtualclass.orderList[this.appName].ol.order[i]].status) === 1) {
              status = 1;
            } else {
              status = 0;
            }
            this.notes[virtualclass.orderList[this.appName].ol.order[i]] = new virtualclass.page('screen-docs', 'notes', 'virtualclassDocumentShare', 'dts', status);
            this.notes[virtualclass.orderList[this.appName].ol.order[i]].init(virtualclass.orderList[this.appName].ol.order[i], `note_${this.allNotes[virtualclass.orderList[this.appName].ol.order[i]].lc_content_id}_${virtualclass.orderList[this.appName].ol.order[i]}`);
            if (typeof fromReload === 'undefined') {
              this.noteStatus(virtualclass.orderList[this.appName].ol.order[i], status);
            }
          }

          if (i === 0) {
            virtualclass.vutil.hideUploadMsg('docsuploadContainer');
          }
        }

        if (roles.hasControls()) {
          this.indexNav.shownPage(this.indexNav.width);
          this.indexNav.addActiveNavigation();
          const subCont = document.querySelector('#dcPaging');
          subCont.addEventListener('change', function () {
            virtualclass.dts.docs.goToNavs(this.value)();
          });
        }

        const btn = document.querySelector('.congrea.teacher  #dashboardContainer .modal-header button.enable');
        if (!btn) {
          virtualclass.vutil.showFinishBtn();
        }
        this.indexNav.setTotalPages(virtualclass.orderList[virtualclass.dts.appName].ol.order.length);

        //                var index = document.querySelector(".congrea #dcPaging #index" + curr);
        //                if (index && !index.classList.contains('active')) {
        //                    index.classList.add("active");
        //                }
      },

      addNoteHidClass(sn, i, n) {
        if (i > n) {
          sn.classList.add('hid', 'right');
        } else {
          sn.classList.add('shw');
        }
      },

      indexHandler(order) {
        // virtualclass.page.prototype.createPageNavAttachEvent(order)
        virtualclass.dts.docs.goToNavs(order);
      },

      createNoteNavAlt(fromReload) {
        let status;
        // need to get all images from here
        for (let i = 0; i < virtualclass.orderList[this.appName].ol.order.length; i++) {
          if (this.allNotes[virtualclass.orderList[this.appName].ol.order[i]].status === 'true'
            || (+this.allNotes[virtualclass.orderList[this.appName].ol.order[i]].status) === 1) {
            status = 1;
          } else {
            status = 0;
          }
          this.notes[virtualclass.orderList[this.appName].ol.order[i]] = new virtualclass.page('screen-docs', 'notes', 'virtualclassDocumentShare', 'dts', status);
          this.notes[virtualclass.orderList[this.appName].ol.order[i]].init(virtualclass.orderList[this.appName].ol.order[i], `note_${this.allNotes[virtualclass.orderList[this.appName].ol.order[i]].lc_content_id}_${virtualclass.orderList[this.appName].ol.order[i]}`);
          if (typeof fromReload === 'undefined') {
            this.noteStatus(virtualclass.orderList[this.appName].ol.order[i], status);
          }
        }
      },

      removeNoteNav(note) {
        const linknote = document.querySelector(`#linknotes${note}`);
        if (linknote != null) {
          linknote.parentNode.removeChild(linknote);
        }

        if (typeof this.notes[note] === 'object') {
          delete this.notes[note];
        }
      },

      docs: {
        num: 0,
        currNote: 0,

        // Get the passed slide or first slide
        curr(sn, slide) {
          this.currDoc = sn;
          const cthis = virtualclass.dts;
          virtualclass.dts.docs.num = sn;

          const prev = document.querySelector('#documentScreen .screen.current');
          if (prev != null) {
            prev.classList.remove('current');
          }

          const screen = document.querySelector('#screen-docs');
          screen.classList.add('current');

          const docContainer = document.querySelector('#documentScreen');
          docContainer.dataset.screen = sn;

          if (typeof slide !== 'undefined') {
            this.note = new this.slide(slide);
          } else {
            this.note = new this.slide();
          }

          this.note.init();
          this.note.currentSlide(this.currNote);
        },

        display(selector) {
          document.querySelector(selector).style.display = 'block';
        },

        hide(selector) {
          document.querySelector(selector).style.display = 'none';
        },

        goToDocs(doc) {
          const cthis = this;
          return function () {
            if (typeof virtualclass.dts.docs.note === 'object') {
              virtualclass.vutil.updateCurrentDoc(virtualclass.dts.docs.note.currNote);
            }
            cthis.executeScreen(doc);
            if (roles.hasControls()) {
              if (Object.keys(virtualclass.dts.notes).length) {
                virtualclass.vutil.showFinishBtn();
              } else {
                virtualclass.vutil.removeFinishBtn();
              }

              if (virtualclass.dts && virtualclass.dts.docs && virtualclass.dts.docs.currNote) {
                virtualclass.dts.identifyFirstAndLastNote(`note${virtualclass.dts.docs.currNote}`);
              }
            }
          };
        },

        /**
         *
         * @param note expects the note which would be displayed into current view
         *
         */
        goToNavs(note) {
          const cthis = this;
          return function () {
            const element = document.querySelector(`#linknotes${note}`);
            if (element != null) {
              if ((+element.dataset.status) === 1) {
                virtualclass.dts.docs.currNote = note;
                virtualclass.dts.docs.note.currentSlide(note);
              }
            } else {
              virtualclass.dts.docs.currNote = note;
              virtualclass.dts.docs.note.currentSlide(note);
            }
            virtualclass.dts.indexNav.addActiveNavigation();
            virtualclass.dts.indexNav.UI.setClassPrevNext();
          };
        },

        studentExecuteScreen(data) {
          const filePath = data.dres;
          this.currDoc = filePath;
          const relativeDocs = virtualclass.dts.getDocs(filePath);
          if (relativeDocs != null) {
            virtualclass.dts.onResponseFiles(filePath, relativeDocs, data.ds);
          }
          // TODO, disabling following can be critical, with new api
          // virtualclass.vutil.updateCurrentDoc(this.currDoc, 1);
        },

        /**
         * If doc is already not exist, it does request to server
         * and create doc with whiteboard and slide
         *
         */

        executeScreen(doc, fromReload, cb, slide) {
          this.currDoc = doc;
          if (doc.indexOf('docs') === -1) {
            this.currDoc = `docs${doc}`; // In case of missing docs
          }

          const cthis = virtualclass.dts;
          if (roles.hasControls() && typeof fromReload === 'undefined') {
            const isDocs = doc.substring(0, 4); // if docs is prepend at id
            if (isDocs === 'docs') {
              doc = doc.split('docs')[1];
            }
            const notes = cthis.requestSlides(doc);
            if (notes != null) {
              cthis.onResponseFiles(doc, notes);

              if (typeof cb !== 'undefined') {
                cb();
              }
            } else {
              // console.log('There is no data');
            }
          } else if (typeof slide !== 'undefined') {
            // this should be removed
            if (typeof doc === 'string' && doc.indexOf('docs') > -1) {
              doc = doc.split('docs')[1];
            }
            const slides = cthis.getDocs(doc);
            if (slides != null) {
              if (typeof fromReload === 'undefined') {
                cthis.onResponseFiles(doc, slides, undefined, slide);
              } else {
                cthis.onResponseFiles(doc, slides, undefined, slide, 'fromReload');
              }

              if (typeof cb !== 'undefined') {
                cb();
              }
            }
          }
        },

        displayScreen(screen, slide) {
          // console.log('==== prev display screen');
          if (typeof slide !== 'undefined') {
            this.curr(screen, slide);
          } else {
            this.curr(screen);
          }
        },


        /**
         * Create whitebaord/annoation tool for each slide/note
         * @param slide expects the slide
         */
        createWhiteboard(slide) {
          const wbid = `_doc_${slide}_${slide}`;

          // const whiteboard = document.createElement('div');
          // whiteboard.className = 'whiteboard';
          //
          // whiteboard.dataset.wid = wbid;
          // whiteboard.id = `cont${whiteboard.dataset.wid}`;
          //
          // const query = `.note[data-slide='${slide}']`;
          // const elem = document.querySelector(query);
          // if (elem != null) {
          //   elem.insertBefore(whiteboard, elem.firstChild);
          //   console.log('##==jai 3b ', slide);
          //   virtualclass.vutil.createWhiteBoard(whiteboard.dataset.wid);
          // }

          virtualclass.vutil.createWhiteBoard(wbid);
          virtualclass.previous = virtualclass.dtsConfig.id;
        },


        /**
         * @param thslide represents the slide/note
         *
         */
        slide: function slide(thslide) {
          return {
            li_items: 0,
            imageNumber: 0,
            currSlide: (typeof thslide !== 'undefined') ? thslide : 0, // TODO this should be removed
            currNote: (typeof thslide !== 'undefined') ? thslide : 0,
            doc: 1,
            init() {
              const cthis = virtualclass.dts;
              const screen = '#screen-docs';

              const docScreen = document.querySelector(`${screen} .notes`);

              this.doc = cthis.docs.num;

              if (docScreen != null) {
                this.li_items = docScreen.children;
                this.imageNumber = this.li_items.length;

                if (roles.hasControls()) {
                  const prev = document.querySelector(`${screen} .prev`);
                  const next = document.querySelector(`${screen} .next`);
                  const dthis = this;

                  prev.onclick = function () {
                    virtualclass.vutil.navWhiteboard(dthis, dthis.prevSlide, cthis);
                  };

                  next.onclick = function () {
                    virtualclass.vutil.navWhiteboard(dthis, dthis.nextSlide, cthis);
                  };
                }
              } else {
                alert('no element');
              }
            },

            slideTo(note, fromReload) {
              console.log('hello 3');
              const noteId = note.dataset.slide;
              virtualclass.vutil.updateCurrentDoc(noteId);

              this.displaySlide(note);

              if (roles.hasControls() && typeof fromReload === 'undefined') {
                if (!virtualclass.dts.sentStudentLayout && virtualclass.config.makeWebSocketReady) {
                  ioAdapter.mustSend({ dts: { init: 'studentlayout' }, cf: 'dts' });
                  // console.log('====> DOCUMENT SHARE SUMAN 1B');
                  virtualclass.dts.sentStudentLayout = true;
                }

                ioAdapter.mustSend({
                  dts: { slideTo: noteId, docn: virtualclass.dts.docs.currDoc },
                  cf: 'dts',
                });
                // console.log('====> DOCUMENT SHARE SUMAN 2');
                // console.log(`Slide to document sharing ${noteId}`);
              }
            },

            /**
             * display the passed thslide/note
             * Expects the note that has to be display
             */
            displaySlide(note) {
              // TODO this should be used by cthis/this
              // const cthis = virtualclass.dts;
              // var currElem = document.querySelector('div[data-thslide="'+thslide+'"]');
              const prevElem = document.querySelector('#screen-docs .note.current');
              if (prevElem != null) {
                prevElem.classList.remove('current');
              }

              if (note != null) {
                note.classList.add('current');
              }
              virtualclass.vutil.addNoteClass();
              const id = note.id.split('note')[1];
              if (!roles.hasControls()) {
                virtualclass.dts.indexNav.studentDocNavigation(id);
              } else if (!virtualclass.config.makeWebSocketReady) { // when page refresh on teacher side
                const index = virtualclass.orderList[virtualclass.dts.appName].ol.order.indexOf(id);
                virtualclass.wbCommon.indexNav.setCurrentIndex(index + 1);
                virtualclass.dashboard.close();
              }
            },

            /**
             * display the previous thslide/note
             * cthis expects main class virtuaclass.dts
             */
            prevSlide(cthis) {
              const currNodeId = cthis.docs.currNote;
              const currElem = document.querySelector(`#documentScreen #note${currNodeId}`);
              if (currElem != null) {
                const prevSlide = currElem.previousElementSibling;
                if (prevSlide != null) {
                  if ((+prevSlide.dataset.status) === 0) {
                    const activeSlide = this.getActiveSlide(cthis, currNodeId, 'prev');
                    if (!activeSlide) {
                      // alert('There is no page');
                      // virtualclass.dts.indexNav.UI.setArrowStatus('leftNavPage', 'disable');

                      virtualclass.dts.indexNav.UI.setArrowStatusDocs(document.getElementById('leftNavPage'), 'disable', 'enable');
                    } else {
                      // by true, know the event is performed real user
                      this.getScreen(activeSlide, true);
                      cthis.docs.currNote = activeSlide.dataset.slide;
                      // console.log(`Current note ${virtualclass.dts.docs.currNote}`);
                    }
                  } else {
                    this.getScreen(prevSlide, true);
                    cthis.docs.currNote = prevSlide.dataset.slide;
                    // console.log(`Current note ${virtualclass.dts.docs.currNote}`);
                  }

                  /** to set the dimension of whiteboard during window is resized * */
                  const currWb = virtualclass.wb[`_doc_${cthis.docs.currNote}_${cthis.docs.currNote}`];
                  virtualclass.dts.indexNav.movePageIndex('left');
                } else {
                  const leftNavPage = document.getElementById('leftNavPage');
                  virtualclass.dts.indexNav.UI.setArrowStatusDocs(leftNavPage, 'disable', 'enable');
                }
              }
            },

            getActiveSlide(cthis, id, which) {
              let activeSlide;
              const currElem = document.querySelector(`#documentScreen #note${id}`);
              if (currElem != null) {
                if (which === 'next') {
                  activeSlide = currElem.nextElementSibling;
                } else {
                  activeSlide = currElem.previousElementSibling;
                }

                if (activeSlide != null) {
                  if ((+activeSlide.dataset.status) === 0) {
                    // return is need for return the end value
                    return this.getActiveSlide(cthis, activeSlide.dataset.slide, which);
                  }
                  return activeSlide;
                }
                return false;
              }
            },

            /**
             * display the next thslide/note
             * cthis expects main class virtuaclass.dts
             */
            nextSlide(cthis) {
              const lastElement = virtualclass.orderList[virtualclass.dts.appName].ol.order[virtualclass.orderList[virtualclass.dts.appName].ol.order.length - 1];
              const currNodeId = cthis.docs.currNote;

              if (currNodeId !== lastElement) {
                const currElem = document.querySelector(`#documentScreen #note${currNodeId}`);
                if (currElem != null) {
                  const nextSlide = currElem.nextElementSibling;
                  if (nextSlide != null) {
                    if ((+nextSlide.dataset.status) === 0) {
                      const activeSlide = this.getActiveSlide(cthis, currNodeId, 'next');
                      if (!activeSlide) {
                        alert('There is no page');
                      } else {
                        this.getScreen(activeSlide, true);
                        cthis.docs.currNote = activeSlide.dataset.slide;
                        // console.log(`Current note ${virtualclass.dts.docs.currNote}`);
                      }
                    } else {
                      this.getScreen(nextSlide, true);
                      cthis.docs.currNote = nextSlide.dataset.slide;
                    }
                  }
                }
                virtualclass.dts.indexNav.movePageIndex('right');
              } else {
                // alert('There is no page');
                const rightNavPage = document.getElementById('rightNavPage');
                virtualclass.dts.indexNav.UI.setArrowStatusDocs(rightNavPage, 'disable', 'enable');
                // virtualclass.zoom.adjustScreenOnDifferentPdfWidth();
              }
            },

            isSlideAvailable(slidId, lastElement) {
              if (slidId === lastElement) {
                return false;
              }
              return true;
            },

            /**
             * display the current thslide/note
             * slideNum exepects the thslide
             */
            currentSlide(slideNum) {
              const currElem = document.querySelector(`#documentScreen #note${slideNum}`);
              if (currElem != null) {
                // console.log(`${slideNum} ` + ' ====> init trigger');
                this.getScreen(currElem);
              } else {
                // console.log(`Document-Sharing:-${slideNum} is not found `);
              }
              const docsContainer = document.querySelector('#docScreenContainer');
              if (docsContainer != null) {
                docsContainer.classList.add('noteDisplay');
                console.log('====> noteDisplay add');
              }
            },

            isPdfRendered() {
              const pdfRenderElem = document.querySelector(`#canvas${virtualclass.gObj.currWb}`);
              if (pdfRenderElem != null) {
                return Object.prototype.hasOwnProperty.call(pdfRenderElem.parentNode.dataset, 'pdfrender');
              }
              return false;
            },

            /**
             * Create the screen with Whiteboard and Current slide
             */
            getScreen(note) {
              // console.log('====> document sharing 4d');
              this.currSlide = note.dataset.slide;
              this.currNote = note.dataset.slide;
              virtualclass.dts.currDoc = this.doc;
              this.slideTo(note);

              if (!this.isWhiteboardExist(this.currNote)) {
                virtualclass.dts.docs.createWhiteboard(this.currNote);
              } else {
                virtualclass.zoom.normalRender();
              }
              virtualclass.vutil.updateCurrentDoc(this.currNote);
              virtualclass.dts.updateLinkNotes(this.currNote);
              virtualclass.dts.identifyFirstAndLastNote(note.id);
              virtualclass.userInteractivity.makeReadyContext();
            },

            /**
             * this expects the the whiteboard related to thslide
             * is exist or not
             * @param thslide expects thslide/note
             * @returns {boolean}
             */
            isWhiteboardExist(slide) {
              const wId = `_doc_${slide}_${slide}`;
              const wbContId = `containerWb${wId}`;
              const wbCont = document.querySelector(`#${wbContId}`);
              const loadPdf = virtualclass.pdfRender[wId];
              return (wbCont !== null && loadPdf != null);
            },
          };
        },
      },

      /**
       * Destryo the dts class
       */
      destroyDts() {
        const appWrapper = document.getElementById(virtualclass.dts.UI.id);
        if (appWrapper != null) {
          appWrapper.parentNode.removeChild(appWrapper);
        } else {
          // console.log('Element is null');
        }
        virtualclass.dts = null;
      },

      screenIsCreated(doc) {
        const screen = document.getElementById(`screen${doc}`);
        return (screen != null);
      },

      convertInObjects(allPages) {
        const note = {};
        for (let i = 0; i < allPages.length; i++) {
          note[allPages[i].fileuuid] = allPages[i];
        }
        return note;
      },


      /**
       * This onmessage performs when
       * the messsage/packet related to document sharing
       * is received
       * @param e expects event
       */
      onmessage(e) {
        if (typeof virtualclass.dts !== 'object') {
          virtualclass.makeAppReady({ app: 'DocumentShare', data: { init: 'studentlayout' } });
        }
        const { dts } = e.message;
        if (Object.prototype.hasOwnProperty.call(dts, 'docn') && dts.docn.indexOf('docs') === -1) {
          dts.docn = `docs${dts.docn}`; // incaseof missing docs prefix
        }
        // console.log('====> DOCUMENT SHARING ', dts);

        if (Object.prototype.hasOwnProperty.call(dts, 'fallDocs')) {
          virtualclass.dts.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
        } else if (Object.prototype.hasOwnProperty.call(dts, 'dres')) {
          console.log('====> document share res');
          this.docs.studentExecuteScreen(dts);
          if (roles.hasControls() && !virtualclass.dts.noteExist()) {
            virtualclass.dashboard.open();
            if (!virtualclass.config.makeWebsocketReady) {
              virtualclass.vutil.triggerDashboard('DocumentShare', 'hidepopup');
            }
          }
          // console.log('====> DOCUMENT SHARING  res ', dts);
          // console.log(`${virtualclass.gObj.currWb} ` + 'document share :- Layout initialized');
        } else if (Object.prototype.hasOwnProperty.call(dts, 'slideTo')) {
          console.log('====> document share res slideTo');
          if (typeof this.docs.note !== 'object') {
            const cthis = this;
            this.docs.executeScreen(dts.docn, undefined, () => {
              // console.log('document share :- doc is not created');
              cthis.docs.note.currNote = dts.slideTo;
              const note = document.querySelector(`#note${dts.slideTo}`);
              cthis.docs.note.slideTo(note);
            }, dts.slideTo);

            // if teacher refresh the page and navigat to other doc
            // In student window, It will execute below else condition, it trigger for next slide
            // In this case the docs are different so we need to initalize first
            // doc and after that we need to call for next slide
          } else if (typeof this.docs.note === 'object' && dts.docn !== this.docs.num) {
            this.docs.currNote = dts.slideTo;
            // console.log(`Current note ${this.docs.currNote}`);
            // this.docs.executeScreen(dts.docn, undefined);
            this.docs.note.currentSlide(dts.slideTo);
          } else {
            const note = document.querySelector(`#note${dts.slideTo}`);
            if (note != null) {
              this.docs.currNote = dts.slideTo;
              // console.log(`Current note ${this.docs.currNote}`);
              // In normal case
              // console.log(`${virtualclass.gObj.currWb} ` + ' ====> init trigger');
              this.docs.note.getScreen(note);
              // console.log(`${virtualclass.gObj.currWb} ` + 'document share :- Normal Case');
            } else {
              alert(`Note is not found ${dts.slideTo}`);
            }
          }
        } else if (Object.prototype.hasOwnProperty.call(dts, 'dispScreen')) {
          const doc = dts.dispScreen.sc;
          virtualclass.vutil.updateCurrentDoc(doc, dts.dispScreen.sn);
          if (!virtualclass.dts.screenIsCreated(doc)) {
            // console.log('document share :- With screen Created');
            // console.log(`${virtualclass.gObj.currWb} ` + 'document share :- With screen Created');
            this.docs.executeScreen(doc, undefined, undefined, dts.dispScreen.sn);
            if (typeof this.docs.note === 'object') {
              this.docs.note.getScreen(dts.dispScreen.sn); // it will get the screen if there is not already
            }
          } else {
            // console.log('document share :- Only display screen');
            // console.log(`${virtualclass.gObj.currWb} ` + 'document share :- Only display screen');
            this.docs.displayScreen(doc);
          }
        } else if (Object.prototype.hasOwnProperty.call(dts, 'rmnote')) {
          this.delete(dts.rmnote);
        } else if (Object.prototype.hasOwnProperty.call(dts, 'rmsnote')) { // remove single note
          this.removePageUI(dts.rmsnote);
          this.removePageFromStructure(dts.rmsnote);
        } else if (Object.prototype.hasOwnProperty.call(dts, 'noteSt')) {
          if (roles.isStudent()) {
            this.noteStatus(dts.note, dts.noteSt);
          } else {
            // controlContnotes31385ae3
            const elem = document.querySelector(`#controlContnotes${dts.note} .status`);
            const currObj = virtualclass.dts.notes[dts.note];
            if ((+dts.noteSt) === 0) {
              virtualclass.dts.notes[dts.note].UI.controller.events.disableElement(elem, currObj);
            } else {
              virtualclass.dts.notes[dts.note].UI.controller.events.enableElement(elem, currObj);
            }
            virtualclass.dts.notes[dts.note].UI.controller.events.setStatusToElement(elem, currObj);
          }
        } else if (Object.prototype.hasOwnProperty.call(dts, 'docSt')) {
          this.docStatus(dts.doc, dts.docSt);
        } else if (Object.prototype.hasOwnProperty.call(dts, 'order_recived')) {
          this.afterRequestOrder(dts.order_recived);
          if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
            virtualclass.dts.createNoteNav();
          }
        } else if (Object.prototype.hasOwnProperty.call(dts, 'norder')) {
          virtualclass.orderList[this.appName].ol.order = dts.norder;
          // console.log('====> ORDER is geneartThere is no pageing ', virtualclass.orderList[this.appName].ol.order);
          virtualclass.dts.indexNav.studentDocNavigation(this.docs.currNote);
        }
      },

      // sendCurrentSlide() {
      //   if (Object.prototype.hasOwnProperty.call(virtualclass.dts.docs, 'currDoc')) {
      //     const doc = virtualclass.dts.docs.currDoc;
      //     if (doc != undefined) {
      //       if (document.querySelector('#listnotes .note') != null) {
      //         //console.log('==== dts must send ');
      //         ioAdapter.mustSend({
      //           dts: { slideTo: virtualclass.dts.docs.note.currNote, docn: doc },
      //           cf: 'dts',
      //         });
      //         // console.log(`${virtualclass.gObj.currWb} ` + 'Document share send current slide');
      //       }
      //     } else {
      //       // console.log('Document sharing : doc number is undefined');
      //     }
      //   }
      // },

      sendCurrentDoc() {
        let doc;
        if (Object.prototype.hasOwnProperty.call(virtualclass.dts.docs, 'currDoc')) {
          if (doc != null) {
            doc = virtualclass.dts.docs.currDoc;
            // console.log('==== dts must send ');
            ioAdapter.mustSend({ dts: { doc: doc = virtualclass.dts.docs.currDoc }, cf: 'dts' });
            // console.log('Document share send current doc only');
            // console.log(`${virtualclass.gObj.currWb} ` + 'Document share send current doc only');
          } else {
            // console.log('Document sharing : doc number is undefined');
          }
        }
      },

      consoleMessage(msg) {
        // console.log(`${virtualclass.gObj.currWb} ${msg}`);
      },

      _rearrange(pageOrder) {
        alert(pageOrder.toString());
      },

      reArrangeNotes(order) {
        virtualclass.orderList[this.appName].ol.order = order;
        this.reArrangeElements(order);
        if (roles.hasAdmin()) {
          this.sendOrder(virtualclass.orderList[this.appName].ol.order);
          ioAdapter.mustSend({ dts: { norder: virtualclass.orderList[this.appName].ol.order }, cf: 'dts' });
          if (virtualclass.dts && virtualclass.dts.docs && virtualclass.dts.docs.currNote) {
            virtualclass.dts.identifyFirstAndLastNote(`note${virtualclass.dts.docs.currNote}`);
          }
        }
      },

      sendOrder(order) {
        // console.log('====> virtualclass dts order 1', order);
        if (Array.isArray(order)) {
          virtualclass.vutil.sendOrder('docs', order);
        }
      },

      reaArrangeThumbCount() {
        const allThumbist = document.querySelectorAll('#listnotes .thumbList');
        for (let j = 0; j < allThumbist.length; j++) {
          allThumbist[j].innerHTML = j + 1;
        }
      },
      reArrangeElements(order) {
        const container = document.getElementById('notesContainer');
        const tmpdiv = document.createElement('div');
        tmpdiv.id = 'notesContainer';
        tmpdiv.className = 'notes';

        /**
         * TODO, This should be improved, we don't need to call getActiveNotes each  time when we need active notes,
         * it should be invoked only once,
         * It handles, if there are videoswhich are not in orders, that videos should be display also
         * */

        for (let i = 0; i < order.length; i++) {
          tmpdiv.appendChild(document.getElementById(`note${order[i]}`));
        }
        container.parentNode.replaceChild(tmpdiv, container);


        // organize list
        this.reaArrangeThumbCount();
        // const paging = document.querySelectorAll('#dcPaging .noteIndex');
        //
        // // if (paging.length > 0) {
        // //   this.indexNav.rearrangePageNavigation(order);// new
        // // }
        // // const subCont = document.querySelector('#dcPaging');
        // // subCont.addEventListener('change', function () {
        // //   virtualclass.dts.docs.goToNavs(this.value)();
        // // });
      },

      delete(id) {
        this.deleteNotesFromOrder(id);
        const data = {
          uuid: id,
          action: 'delete',
          page: 0,
        };
        const url = virtualclass.api.UpdateDocumentStatus;
        virtualclass.xhrn.vxhrn.post(url, data).then((res) => {
          if (res.data.status === 'ok') {
            virtualclass.dts.sendOrder(virtualclass.orderList[this.appName].ol.order);
          }
        });
        this.deleteDocElement(id);
      },

      deleteNotesFromOrder(doc) {
        const notes = this.getNotes(doc);
        virtualclass.orderList[this.appName].ol.order = virtualclass.orderList[this.appName].ol.order.filter((el) => {
          return !notes.includes(el.id);
        });
        // console.log('====> DTS ORDER ', virtualclass.orderList[this.appName].ol.order);
      },

      deleteDocElement(id) {
        const linkDocs = document.querySelector(`#linkdocs${id}`);
        if (linkDocs != null) {
          linkDocs.parentNode.removeChild(linkDocs);
        }
        delete this.pages[`docs${id}`];
        this.removePagesUI(id);
        this.removePagesFromStructure(id);
      },

      deleteNote(id, typeDoc) {
        this.removePageUI(id, typeDoc);
        this.removePageFromStructure(id, typeDoc);
        if (roles.hasControls()) {
          // console.log('==== dts must send ');
          ioAdapter.mustSend({ dts: { rmsnote: id }, cf: 'dts' });
        }

        const idarr = id.split('_');
        const doc = idarr[0];
        const pid = parseInt(idarr[1]);

        const data = {
          uuid: doc,
          action: 'delete',
          page: pid,
        };

        const url = virtualclass.api.UpdateDocumentStatus;

        const cthis = this;
        virtualclass.xhrn.vxhrn.post(url, data).then((res) => {
          if (res.data.status === 'ok') {
            cthis.sendOrder(virtualclass.orderList[this.appName].ol.order);
          }
        });

        // Check if there is exist any noted
        let noteExit = false;
        const mainDoc = virtualclass.dts.allDocs[doc];
        if (mainDoc != null) {
          for (let i = 0; i < mainDoc.notesarr.length; i++) {
            if (!Object.prototype.hasOwnProperty.call(mainDoc.notesarr[i], 'deletedn')) {
              noteExit = true;
              break;
            }
          }
        }
        if (!noteExit) {
          this.delete(doc);
        }
        if (roles.hasControls()) {
          this.indexNav.createIndex();
        }
      },

      removePagesFromStructure(id) {
        this.allDocs[id].deleted = '0';
        const result = [];
        let i;
        for (i in this.allNotes) {
          if (this.allNotes[i].id.indexOf(id) > -1) {
            this.removePageFromStructure(this.allNotes[i].id);
          }
        }
      },

      updateInAllDocs(noteid) {
        // var docId = virtualclass.dts.currDoc.substring(4, virtualclass.dts.currDoc.length);
        const docId = noteid.split('_')[0];
        const doc = this.allDocs[docId];
        if (typeof doc.notes[noteid] !== 'undefined') {
          doc.notes[noteid].deletedn = noteid;
          for (let i = 0; i < doc.notesarr.length; i++) {
            if (doc.notesarr[i].id === noteid) {
              doc.notesarr[i].deletedn = noteid;
            }
          }
        } else {
          // console.log(`The note with the id ${noteid} is not available`);
        }
      },

      removePageFromStructure(id) {
        // delete this.allNotes[id];
        this.allNotes[id].deletedn = id;
        // new pages save into docs
        this.updateInAllDocs(id);
      },

      disable(id) {
        this.docStatus(id);
      },

      enable(id) {
        this.docStatus(id);
      },

      /** TODO, check if following function is using * */

      docStatus(id, status) {
        const note = document.querySelector(`#linkdocs${id} .controls.status`);
        let docStatus;
        if (note != null) {
          docStatus = (typeof status === 'undefined') ? (1 - (+note.dataset.status)) : status;
        } else {
          docStatus = status;
          // console.log(`document share:- there is no element ${id}`);
        }

        const allNotes = this.getDocs(id);
        for (let i = 0; i < allNotes.length; i++) {
          const nid = allNotes[i].id;
          this.noteStatus(nid, docStatus);
          this.updatePageNavStatus(nid, docStatus);
        }
        if (roles.hasControls()) {
          // console.log('==== dts must send ');
          ioAdapter.mustSend({ dts: { docSt: docStatus, doc: id }, cf: 'dts' });
        }
      },

      /**
       * TODO, need to improve this funciton
       * related to event.status in page.js
       * around 360
       */
      updatePageNavStatus(id, status) {
        const linknote = document.querySelector(`#linknotes${id}`);
        if (linknote != null) {
          linknote.dataset.status = status;
          const childNode = linknote.querySelector('.controls.status');
          childNode.dataset.status = status;
          childNode.querySelector('.statusanch').innerHTML = `status${status}`;
        } else {
          // console.log(`${'Document share : there is no element ' + '#linknotes'}${id}`);
        }
      },


      noteDisable(id) {
        this.noteStatus(id);
        this.sendNoteStatus(id);
      },

      noteEnable(id) {
        this.noteStatus(id);
        this.sendNoteStatus(id);
      },

      sendNoteStatus(id) {
        if (roles.hasControls()) {
          const note = document.querySelector(`#note${id}`);
          if (note != null) {
            // console.log('==== dts must send ');
            ioAdapter.mustSend({ dts: { noteSt: note.dataset.status, note: id }, cf: 'dts' });
          } else {
            // console.log('Element is null');
          }
        }
      },

      /**
       * set the note status, like enable or disable
       * @param id expects note id
       * @param status expect enable or disable
       */
      noteStatus(id, status) {
        // console.log('====> note status ', id, status);
        let docStatus;
        const note = document.querySelector(`#note${id}`);
        if (note != null) {
          if (typeof status === 'undefined') {
            docStatus = (1 - (+note.dataset.status));
          } else if (status === 1 || status === '1') {
            docStatus = 1;
          } else {
            docStatus = 0;
          }
          note.dataset.status = docStatus;
          const noteObj = this.allNotes[id];
          noteObj.status = note.dataset.status;
          this.allNotes[id] = noteObj;
        } else {
          // console.log(`there is no element #note${id}`);
        }
      },

      /**
       * get docs from inline variable
       *   @returns {Array}
       */
      getDocsOld(id) {
        const result = [];
        for (const i in this.allNotes) {
          if (id === this.allNotes[i].lc_content_id) {
            result.push(this.allNotes[i]);
          }
        }
        return result;
      },

      // Return the pages from specific page
      getDocs(id) {
        // console.log('--------------');
        if (this.allDocs != null && typeof this.allDocs[id] === 'object') {
          return this.allDocs[id].notesarr;
        }
        // console.log(`There is no document with the id ${id}`);
      },

      /**
       * get documenation id from all notes by using note id
       * @param id expectes node
       * @returns {*}
       */
      getDocId(id) {
        return id.split('_')[0];
      },

      getAllNotes(order) {
        const result = [];
        for (let i = 0; i < order.length; i++) {
          result.push(this.allNotes[order[i]]);
        }
        return result;
      },

      /**
       * get note object by passing note
       * @param id expects note
       * @returns {note}
       */
      getNote(id) {
        return this.allNotes[id];
      },

      updateLinkNotes(id) {
        const listnotes = document.querySelector('#listnotes .currentNav');
        if (listnotes != null) {
          listnotes.classList.remove('currentNav');
        }
        this.setCurrentNav(id);
      },

      setCurrentNav(id) {
        const linknotes = document.querySelector(`#linknotes${id}`);
        if (linknotes != null) {
          linknotes.classList.add('currentNav');
        }
      },

      /**
       * This function perform after upload the documenttion
       * @param id expects the upload file id,
       * @param xhr expects xhr object
       * @param response expects xhr response
       */
      onAjaxResponse(id, xhr, response) {
        if (Object.prototype.hasOwnProperty.call(response, 'success') && response.success) {
          for (let i = 0; i < virtualclass.gObj.uploadingFiles.length; i++) {
            const docUploadId = virtualclass.gObj.uploadingFiles[i].uuid;
            this.afterUploadFile(docUploadId);
          }

          virtualclass.gObj.uploadingFiles = [];
          this.showUploadMsz(virtualclass.lang.getString('docUploadSuccess'), 'alert-success');
          this.triggerMsgCloseButton();
        } else if (response.message === 'duplicate') {
          // alert(virtualclass.lang.getString('duplicateUploadMsg'));
          this.showUploadMsz(virtualclass.lang.getString('duplicateUploadMsg'), 'alert-error');
        } else if (Object.prototype.hasOwnProperty.call(response, 'error')) {
          this.showUploadMsz(response.error, 'alert-error');
        } else {
          this.showUploadMsz(virtualclass.lang.getString('someproblem'), 'alert-error');
        }

        const msz = document.querySelector('#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list');
        if (msz) {
          msz.style.display = 'none';
        }

        const listnotes = document.querySelector('#listnotes');
        if (listnotes != null) {
          const elemSelector = '#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery';
          virtualclass.vutil.makeElementDeactive(elemSelector);
          virtualclass.vutil.makeElementActive('#listnotes');
        } else {
          // console.log('List note is null');
        }
      },

      showUploadMsz(msg, type) {
        const mszCont = document.querySelector('#DocumentShareDashboard #docsUploadMsz');

        const alertMsz = document.querySelector('#DocumentShareDashboard #docsUploadMsz .alert');
        if (alertMsz) {
          alertMsz.parentNode.removeChild(alertMsz);
        }
        const elem = document.createElement('div');
        elem.className = 'alert  alert-dismissable';
        elem.classList.add(type);
        elem.innerHTML = msg;
        mszCont.appendChild(elem);

        const btn = document.createElement('button');
        btn.className = 'close';
        btn.setAttribute('data-dismiss', 'alert');
        btn.innerHTML = '&times';
        elem.appendChild(btn);
        btn.addEventListener('click', function () {
          this.parentNode.remove();
        });
      },


      /**
       * Set width and height for note
       */
      setNoteDimension(width, height, nid) {
        const contElem = document.querySelector(`#cont${nid}`);
        if (contElem != null) {
          const noteContainer = contElem.parentNode;
          const noteId = noteContainer.id;
          const imageContainer = document.querySelector(`#${noteId} .imageContainer img`);
          imageContainer.style.width = width;
          imageContainer.style.height = height;
        }
        system.setDocCanvasDimension(width, height, nid);

        const notesContainer = document.querySelector('#screen-docs .pageContainer');
        if (roles.hasAdmin()) {
          // 60 for whiteboard height toolbar
          height += 60;
        }
        // for note's container height
        if (notesContainer != null) {
          notesContainer.style.width = `${width}px`;
          notesContainer.style.height = `${height}px`;
        }
      },

      isFirstNote(id) {
        const firstNote = document.querySelector('#notesContainer .note');
        return (firstNote != null && (id === firstNote.id));
      },

      isLastNote(id) {
        const allNotes = document.querySelectorAll('#notesContainer .note');
        const lastNote = allNotes[allNotes.length - 1];
        return (allNotes.length > 0 && (lastNote.id === id));
      },

      noteExist() {
        return (document.querySelector('#notesContainer .note') != null);
      },

      docSelected() {
        return document.querySelector('#listdocs .linkdocs[data-selected="1"]');
      },

      isUploaderExist() {
        const uploadElem = document.querySelector('#docsuploadContainer .qq-uploader-selector');
        return (uploadElem != null);
      },

      updateScreen() {
        this.rawToProperData(virtualclass.serverData.rawData.docs);
        for (const key in this.allDocs) {
          if (!Object.prototype.hasOwnProperty.call(this.allDocs[key], 'deleted')) {
            this.initDocs(this.allDocs[key].fileuuid);
          } else {
            // this.deleteNotesFromOrder(this.allDocs[key].fileuuid);
            // this.deleteDocElement(this.allDocs[key].fileuuid);
            this.delete(this.allDocs[key].fileuuid);
          }
        }
      },

      printOrderList() {
        console.log(virtualclass.orderList.DocumentShare.ol.order);
      },

      identifyFirstAndLastNote (noteId) {
        const isFirstNote = virtualclass.dts.isFirstNote(noteId);
        const isLastNote = virtualclass.dts.isLastNote(noteId);

        const notesContainer = document.querySelector('#screen-docs .pageContainer');

        if (isFirstNote && isLastNote) {
          notesContainer.classList.add('firstNote');
          notesContainer.classList.add('lastNote');
        } else if (isFirstNote) {
          notesContainer.classList.remove('lastNote');
          notesContainer.classList.add('firstNote');
        } else if (isLastNote) {
          notesContainer.classList.remove('firstNote');
          notesContainer.classList.add('lastNote');
        } else {
          notesContainer.classList.remove('firstNote');
          notesContainer.classList.remove('lastNote');
        }

      },
    };
  };
  window.documentShare = documentShare;
}(window));
