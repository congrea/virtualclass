// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2017  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This file is responsible for sharing the document, it responsible for
 * upload the docs, re-arrangement, disable and delete sending doc to the server and receiving from server
 * It display the docs from localstorage if exist otherwise request the docs to the server
 */

(function (window) {
    "use strict";
    var firstTime = true;
    var io = window.io;
    var documentShare = function () {
        return {
            allPages: null,
            allNotes: null, // this contains all notes received from server
            allDocs: null, // This contains all docs received from server
            notes: null,
            order: [],
            tempFolder: "documentSharing",

            init: function (docsObj) {
                this.firstRequest = false;
                firstTime = true;
                this.indexNav = new virtualclass.pageIndexNav("documentShare");

                if (virtualclass.gObj.hasOwnProperty('dstAll') && typeof virtualclass.gObj.dstAll == 'string') {
                    this.storageRawData = null;
                } else {

                    if (virtualclass.gObj.dstAll == null || (typeof virtualclass.gObj.dstAll != 'undefined' && Object.keys(virtualclass.gObj.dstAll).length == 0)) {
                        //In case of storing metata data of docs in local storage but not storing
                        docsObj = undefined;
                        localStorage.removeItem('dtsdocs');
                        this.storageRawData = null;
                    } else {
                        this.storageRawData = (typeof virtualclass.gObj.dstAll == 'object') ? virtualclass.gObj.dstAll : null;
                    }

                    if (virtualclass.gObj.dstAllNotes != null) {
                        this.allNotes = virtualclass.gObj.dstAllNotes;
                    }

                    if (roles.isStudent()) {
                        virtualclass.serverData.rawData.docs = this.storageRawData;
                    }

                    // virtualclass.storage.dstAllStore(virtualclass.gObj.dstAll);
                    /**
                     * Storing again into indexedDb when page is being refreshed
                     */
                    if (roles.hasControls()) {
                        virtualclass.storage.dstAllStore(virtualclass.gObj.dstAll);
                    }
                }

                if (virtualclass.gObj.hasOwnProperty('docs') && typeof virtualclass.gObj.docs == 'string') {
                    this.documents = null;
                } else {
                    this.documents = (typeof virtualclass.gObj.docs == 'object') ? virtualclass.gObj.docs : null;
                }

                this.UI.container();
                this.pages = {};
                this.notes = {};

                if (this.documents != null) {
                    this.allNotes = this.documents;
                }

                this.initAfterUpload(docsObj);
                if (roles.hasControls()) {
                    if (typeof docsObj == 'undefined') {
                        ioAdapter.mustSend({'dts': {init: 'studentlayout'}, 'cf': 'dts'});
                        console.log(virtualclass.gObj.currWb + ' ' + 'Document share Teacher layout ');
                    }
                    // this.UI.attachDocsNav();
                }

                if (typeof docsObj != 'undefined') {

                    if (docsObj.init != 'layout' && docsObj.init != 'studentlayout') {
                        if (this.storageRawData != null) {
                            this.rawToProperData(this.storageRawData, 'fromStorage');
                        }
                        // docsObj.init = layout means first layout
                        this.setNoteScreen(docsObj);
                    } else if (firstTime && roles.isStudent()) {
                        this.rawToProperData(this.storageRawData, 'fromStorage');
                    }


                } else {
                    // Check if there is already docs in local storage
                    var docsObj = JSON.parse(localStorage.getItem('dtsdocs'));
                    if (docsObj != null) {
                        if (this.storageRawData != null) {
                            this.rawToProperData(this.storageRawData, 'fromStorage');
                        }
                        this.initAfterUpload(docsObj);
                        //       this.allDocs = docsObj.docs;

                        if (docsObj.slideNumber != null) {
                            this.setNoteScreen(docsObj);
                            docsObj.slideNumber = null;
                            localStorage.setItem('dtsdocs', JSON.stringify(docsObj));
                        }
                    } else if (this.allDocs != null && Object.keys(this.allDocs).length > 0) {
                        console.log('Do nothing');
                        this.afterFirstRequestDocs(virtualclass.serverData.rawData.docs, true);
                    } else {
                        // Only send the request to server
                        // when the docs is not in storage
                        if (roles.hasControls()) {
                            this.firstRequestDocs();
                            // this.firstRequest = true;
                        }
                    }


                }
                if (virtualclass.dts.noteExist()) {
                    virtualclass.modal.hideModal();
                } else {
                    virtualclass.modal.showModal();
                }

            },

            moveProgressbar: function () {
                var cont = document.querySelector("#docsUploadMsz")
                var msz = document.querySelector("#docsuploadContainer .qq-upload-list-selector.qq-upload-list");
                if (msz) {
                    msz.style.display = "block";
                    var divCont = document.createElement("div")
                    cont.appendChild(divCont);
                    divCont.appendChild(msz);
                }
            },

            /**
             * This function initiate the docs order
             * and the function which should be performed
             * after uploading the docs
             */
            initAfterUpload: function (docsObj) {
                if (typeof docsObj != 'undefined') {
                    for (var key in docsObj.docs) {
                        this.afterUploadFile(docsObj.docs[key].rid, 'fromReload', docsObj);
                    }

                    if (docsObj.hasOwnProperty('order')) {
                        this.order = JSON.parse(docsObj.order);
                    }
                }
            },

            /**
             * This function displays the current note on screen
             * and highlight the naviation of that screen
             */
            setNoteScreen: function (docsObj) {
                if (document.querySelector('#note' + docsObj.slideNumber + '.current.note') == null) {
                    var doc = this.getDocId(docsObj.slideNumber);
                    this.docs.executeScreen(doc, 'fromreload', undefined, docsObj.slideNumber);
                    this.setScreenByOrder(doc);
                }

            },

            /**
             * This display the notes acorrding to order
             * Whatever the order will be on this.order,
             * there will be display the notes according to this
             */
            setScreenByOrder: function (currDoc) {
                if (this.order != null && this.order.length > 0) {
                    var allNotes = this.getAllNotes(this.order);
                    // TODO this should be improve
                    var docId;
                    for (var i = 0; i < allNotes.length; i++) {
                        docId = allNotes[i].id.split('_')[0];
                        this.setLinkSelected(docId, 1);
                    }
                    // remove if there is already pages before render the ordering elements
                    var alreadyElements = document.querySelectorAll('#notesContainer .note');
                    this.createNoteLayout(allNotes, currDoc);

                    this.reArrangeNotes(this.order);

                    // TODO This should be improve at later, should handle at function createNoteNav
                    for (var i = 0; i < this.order.length; i++) {
                        this.noteStatus(this.order[i], this.allNotes[this.order[i]].status);
//                        console.log('Note status ' + this.order[i] + ' -->' + this.allNotes[this.order[i]].status);
                    }

                    /** Earlier it was in noteStatus() which causes the performance issue **/
                    this.storeInDocs(this.allNotes);

                }
            },

            createNoteLayout: function (notes, currDoc) {
                var mainContainer, tempCont, objTemp, template, tempHtml;
                var allNotes = []
                for (var i = 0; i < notes.length; i++) {
                    if (!notes[i].hasOwnProperty("deletedn")) {
                        allNotes.push(notes[i])
                    }
                }
                if (allNotes.length > 0) {
                    var pageContainer = document.querySelector('#screen-docs .pageContainer');
                    //this.UI.createSlides(pageContainer, allNotes);
                    if (pageContainer == null) {
                        var tempCont = {notes: allNotes, hasControls: roles.hasControls(), cd: currDoc};
                        template = 'screen';
                        mainContainer = document.querySelector('#docScreenContainer');
                    } else {
                        tempCont = {notes: allNotes};
                        template = 'notesMain';
                        mainContainer = document.querySelector('#screen-docs #notesContainer');
                    }

                    template = virtualclass.getTemplate(template, 'documentSharing');
                    tempHtml = template(tempCont);

                    if (mainContainer != null) {
                        mainContainer.insertAdjacentHTML('beforeend', tempHtml);
                    } else {
                        console.log('there is no such element');
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
            afterUploadFile: function (doc, fromReload, docObj) {
                var cthis = this;
                // need to get all images from here
                if (typeof docObj != 'undefined') {
                    var status = docObj.docs['docs' + doc].status;
                } else {
                    var status = 1;
                }

                if (typeof fromReload == 'undefined' && roles.hasControls()) {
                    this.requestDocs(doc);
                } else {
                    var docId = 'docs' + doc;
                    if (typeof this.pages[docId] != 'object') {
                        this.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
                        if (typeof docObj != 'undefined') {
                            var title = docObj.docs[docId].title;
                        } else {
                            var title = cthis.allDocs[doc].title;
                        }
                        this.pages[docId].init(doc, title);
                    }
                }
            },

            /**
             * It creates the instance for doc which is uploaded to LMS
             * @param id expects the document id
             */
            initDocs: function (id) {
                if (typeof this.pages[id] != 'object') {
                    var status = 0;
                    if (this.allDocs[id].status == 'true' || this.allDocs[id].status == 1) {
                        status = 1;
                    }
                    var docId = 'docs' + id;
                    this.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
                    // this.pages[docId].init(id, this.allDocs[id].title);
                    this.pages[docId].init(id, this.allDocs[id].filename);
                    this.upateInStorage();
                }
            },

            /**
             * We don't nee to update fetch the all docs according the length but
             * we have to fetch that only once
             *
             */
            firstRequestDocs: function () {
                var that = this;
                if (!virtualclass.vutil.isBulkDataFetched()) {
                    virtualclass.serverData.fetchAllData(function () {
                        ioAdapter.mustSend({'dts': {fallDocs: virtualclass.serverData.rawData.docs}, 'cf': 'dts'});
                        that.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
                        that.firstRequest = true;
                    });
                } else {
                    ioAdapter.mustSend({'dts': {fallDocs: virtualclass.serverData.rawData.docs}, 'cf': 'dts'});
                    that.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
                }
            },

            fetchAllNotes: function () {
                var allNotes = {};
                for (var key in virtualclass.dts.allDocs) {
                    for (var j = 0; j < virtualclass.dts.allDocs[key].notesarr.length; j++) {
                        allNotes[virtualclass.dts.allDocs[key].notesarr[j].id] = virtualclass.dts.allDocs[key].notesarr[j];
                    }
                }
                return allNotes;
            },

            fetchAllNotesAsArr: function () {
                var allNotes = [];
                for (var key in virtualclass.dts.allDocs) {
                    for (var j = 0; j < virtualclass.dts.allDocs[key].notesarr.length; j++) {
                        allNotes.push(virtualclass.dts.allDocs[key].notesarr[j]);
                    }
                }
                return allNotes;
            },

            // requestDocs
            afterFirstRequestDocs: function (docs, notconvert) {
                this.rawToProperData(docs);
                virtualclass.storage.dstAllStore(docs);
                for (var key in this.allDocs) {
                    if (!this.allDocs[key].hasOwnProperty('deleted')) {
                        this.initDocs(this.allDocs[key].fileuuid);
                    }
                }
                if (roles.hasAdmin()) {
                    this.requestOrder(this.executeOrder);
                }
            },

            rawToProperData: function (docs, fromStorage) {
                if (typeof notconvert == 'undefined') {
                    this.allDocsTemp = docs;
                    this.allDocs = this.convertInObjects(this.allDocsTemp);
                }

                //this.allNotes = this.fetchAllNotes();
                if (typeof fromStorage != 'undefined') {
                    this.allNotes = virtualclass.gObj.dstAllNotes;
                } else {
                    this.allNotes = this.fetchAllNotes();
                }


                // if(this.documents != null){
                //     this.allNotes = this.documents;
                // }
            },

            /**
             * This would be performed after got
             * the request
             * @param docs expects documenation list that have been
             * received from LMS and localstorage
             */

            afterRequestOrder: function (content) {
                this.order.length = 0;
                this.order = content;
                var doc = this.getDocId(this.order[0]);
                if (virtualclass.dts.allDocs.hasOwnProperty(doc)) {
                    var docId = 'docs' + doc;
                    // var mainCont = this.pages[docId].UI.mainView.call(this.pages[docId]);
                    console.log('From database doc share order ' + this.order.join(','));
                    this.setScreenByOrder(docId);
                    this.docs.currNote = this.order[0];
                    this.docs.displayScreen(docId, this.order[0]);

                    /**
                     TODO, this should be handle properly
                     As of now, use can see the diffrence
                     * */
                    // virtualclass.dashBoard.close();

                }
            },

            /**
             * this requests the order from LMS
             */
            requestOrder: function (cb) {
                virtualclass.vutil.requestOrder('docs', cb);
            },

            executeOrder: function (response) {
                if (response != undefined && typeof response != 'undefined') {
                    var cthis = virtualclass.dts;
                    if (response.length > 0) {
                        if (response == "Failed" || response == "Error") {
                            console.log("page order retrieve failed");
                            $('#congdashboard').modal();
                            console.log('dashboard length ' + $('#congdashboard').length);

                            virtualclass.dashBoard.clickCloseButton();
                        } else if (response) {
                            if (roles.hasAdmin()) {
                                ioAdapter.mustSend({'dts': {order_recived: response}, 'cf': 'dts'});
                                cthis.afterRequestOrder(response);
                                cthis.createNoteNav();
                            }
                        }
                    }
                }
            },

            /**
             * this requests documentation lists from LMS
             */
            getFilenameFromUploadingfiles: function (doc) {
                for (var i = 0; i < virtualclass.gObj.uploadingFiles.length; i++) {
                    return virtualclass.gObj.uploadingFiles[i].name;
                }
            },

            requestDocs: function (doc) {
                var cthis = this;
                var newDocObj = {
                    filename: this.getFilenameFromUploadingfiles(doc),
                    fileuuid: doc,
                    filepath: "somewhere",
                    filetype: "doc",
                    key_room: virtualclass.gObj.sessionInfo.key + '_' + virtualclass.gObj.sessionInfo.room,
                    status: 1
                };

                cthis.allDocs[doc] = newDocObj;
                var status = 0;
                if (cthis.allDocs[doc].status == 'true' || cthis.allDocs[doc].status == 1) {
                    status = 1;
                }

                var docId = 'docs' + doc;
                if (typeof cthis.pages[docId] != 'object') {
                    cthis.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
                    cthis.pages[docId].init(doc, cthis.allDocs[doc].filename);
                    if (!cthis.allDocs[doc].hasOwnProperty('notes')) {
                        var element = document.querySelector('#linkdocs' + doc);
                        element.classList.add('noDocs');
                    }
                }
                ioAdapter.mustSend({'dts': {allDocs: cthis.allDocs, doc: doc}, 'cf': 'dts'});
                // here should be the polling
                // cthis.requestNotes(doc);
                virtualclass.serverData.pollingStatus(virtualclass.dts.afterRequestNotes);
            },

            // Earlier it was requestNotes,
            afterRequestNotes: function () {
                var cthis = virtualclass.dts;
                virtualclass.dts.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
                ioAdapter.mustSend({'dts': {fallDocs: virtualclass.serverData.rawData.docs}, 'cf': 'dts'});
                cthis.removeNoDocsElem();
                cthis.allPages = virtualclass.dts.fetchAllNotesAsArr();
                cthis.allNotes = virtualclass.dts.fetchAllNotes();
                cthis.storeInDocs(cthis.allNotes);
                virtualclass.storage.dstAllStore(virtualclass.serverData.rawData.docs);
                // TODO, by disabling this can be critical, new api
                // ioAdapter.mustSend({'dts': {allNotes: cthis.allNotes, doc:doc},  'cf': 'dts'});
                ioAdapter.mustSend({'dts': {allNotes: cthis.allNotes}, 'cf': 'dts'});
            },

            removeNoDocsElem: function () {
                var allNoDocsElem = document.querySelectorAll('.noDocs');
                for (var i = 0; i < allNoDocsElem.length; i++) {
                    allNoDocsElem[i].classList.remove('noDocs');
                }
            },

            /**
             * this requests all notes from LMS
             */
            requestNotes: function (doc) {
                var cthis = this;
                var data = {
                    live_class_id: virtualclass.gObj.congCourse,
                    'notes_id': 'all',
                    user: virtualclass.gObj.uid
                };
                virtualclass.vutil.xhrSendWithForm(data, 'retrieve_all_notes', function (response) {
                        response = JSON.parse(response);
                        if ((+response.status)) {
                            cthis.allPages = response.resultdata;
                            cthis.allNotes = cthis.convertInObjects(cthis.allPages);
                            cthis.storeInDocs(cthis.allNotes)
                            ioAdapter.mustSend({'dts': {allNotes: cthis.allNotes, doc: doc}, 'cf': 'dts'});
                        }
                    }
                );
            },

            firstRequestNotes: function () {
                var cthis = this;
                var data = {
                    live_class_id: virtualclass.gObj.congCourse,
                    'notes_id': 'all',
                    user: virtualclass.gObj.uid
                };
                virtualclass.vutil.xhrSendWithForm(data, 'retrieve_all_notes', function (response) {
                        response = JSON.parse(response);
                        //  if((+response.status)){
                        cthis.allPages = response.resultdata;
                        cthis.allNotes = cthis.convertInObjects(cthis.allPages);
                        cthis.storeInDocs(cthis.allNotes)
                        ioAdapter.mustSend({'dts': {fallNotes: cthis.allNotes}, 'cf': 'dts'});
                        // cthis.firstRequestDocs();
                        cthis.requestOrder(cthis.executeOrder);
                        //}
                    }
                );
            },

            requestSlidesOld: function (filepath) {
                var filepath = parseInt(filepath, 10);
                var cthis = this;
                console.log(virtualclass.gObj.currWb + ' ' + 'document share : request ' + filepath);

                var relativeDocs = this.getDocs(filepath);

                var dsStatus = document.querySelector('#linkdocs' + filepath).dataset.selected;
                ioAdapter.mustSend({'dts': {dres: filepath, 'ds': (1 - (+dsStatus))}, 'cf': 'dts'});
                return relativeDocs;
            },

            requestSlides: function (filepath) {
                var cthis = this;
                console.log(virtualclass.gObj.currWb + ' ' + 'document share : request ' + filepath);

                var relativeDocs = this.getDocs(filepath);
                var dsStatus = document.querySelector('#linkdocs' + filepath).dataset.selected;
                ioAdapter.mustSend({'dts': {dres: filepath, 'ds': (1 - (+dsStatus))}, 'cf': 'dts'});
                return relativeDocs;

            },

            /**
             * This store all the notes/pages/slides in browser indexdb storage
             * @param allPages exepects all notes
             */
            storeInDocs: function (allPages) {
                //virtualclass.storage.dstStore(JSON.stringify(allPages));
                virtualclass.storage.dstAllStore(virtualclass.serverData.rawData.docs);
            },

            removeWhiteboardFromStorage: function (key) {
                virtualclass.storage.wbDataRemove(key);
            },

            getNotesOld: function (id) {
                var notes = [];
                for (var i in this.allNotes) {
                    if (this.allNotes[i].lc_content_id == id) {
                        notes.push(this.allNotes[i]);
                    }
                }
                return notes;
            },

            getNotes: function (id) {
                return this.allDocs[id].notesarr;
            },

            removePagesUI: function (doc) {
                var notes = this.getNotes(doc);
                for (var i = 0; i < notes.length; i++) {
                    this._removePageUI(notes[i].id);
                }
                if (this.order.length <= 0) {
                    firstTime = true;
                }
                if (roles.hasControls()) {
                    this.indexNav.createIndex()
                }
            },

            _removePageUI: function (noteId, typeDoc) {
                var orderId = this.order.indexOf(noteId);
                if (orderId >= 0) {
                    this.order.splice(orderId, 1);
                }
                var note = document.querySelector('#notesContainer #note' + noteId);
                if (note != null) {
                    note.parentNode.removeChild(note);
                }

                if (typeof virtualclass.wb['_doc_' + noteId + '_' + noteId] == 'object') {
                    // delete whiteboard object
                    delete virtualclass.wb['_doc_' + noteId + '_' + noteId];
                }
                this.removeNoteNav(noteId);
                this.reaArrangeThumbCount();
                if (!roles.hasControls()) {
                    var curr = document.querySelector("#notesContainer .note.current")
                    if (curr) {
                        var id = curr.id.split("note")[1]
                        virtualclass.dts.indexNav.studentDocNavigation(id);
                    } else {
                        var cont = document.getElementById("stdPageNo");
                        if (cont) {
                            cont.innerHTML = 0
                        }
                        virtualclass.dts.indexNav.setTotalPages((virtualclass.dts.order.length));
                    }

                }

            },

            addPages: function (slides) {
                var j = 0;
                while (j < slides.length) {
                    if (!slides[j].hasOwnProperty('deletedn')) {
                        if (this.order != null) {
                            if (this.order.indexOf(slides[j].id) <= -1) {
                                this.order.push(slides[j].id);
                            }
                        }
                    }
                    j++;
                }
            },

            toggleSlideWithOrder: function (doc, slides) {
                var linkDoc = document.querySelector("#linkdocs" + doc);
                if (linkDoc != null) {
                    if (linkDoc.dataset.selected == 1) {
                        linkDoc.dataset.selected = 0;
                        return false;
                    } else {
                        linkDoc.dataset.selected = 1;
                        return true;
                    }
                } else {
                    console.log('Document sharing There is no Element');
                }
            },

            setLinkSelected: function (doc, val) {
                var linkDoc = document.querySelector("#linkdocs" + doc);
                if (linkDoc != null) {
                    linkDoc.dataset.selected = val;
                }
            },

            onResponseFiles: function (doc, slides, docFetch, slide, fromReload) {
                if (firstTime) {
                    // this.docs.currNote = (typeof slide != 'undefined') ? slide : slides[0].id; // first id if order is not defined
                    this.docs.currNote = (typeof slide != 'undefined') ? slide : slides[0].id; // first id if order is not defined

                    console.log('Current note ' + this.docs.currNote);

                    // this.order = [];
                    firstTime = false;
                }

                if (roles.hasControls()) {
                    var addSlide = this.toggleSlideWithOrder(doc, slides)
                } else {
                    var addSlide = (typeof docFetch != 'undefined') ? (+docFetch) : true;
                }

                //var addSlide = this.toggleSlideWithOrder(doc, slides);
                if (addSlide) {
                    // TODO, order is fine now, but we have to hanlde this gracefully as done in video and ppt
                    this.addPages(slides);

                    var cthis = this;
                    if (typeof doc != 'string') {
                        var docId = 'docs' + doc;
                    } else {
                        if (doc.indexOf('docs') >= 0) {
                            var docId = doc;
                        } else {
                            var docId = 'docs' + doc;
                        }
                    }

                    this.createNoteLayout(slides, docId);

                    if (typeof slide != 'undefined') {
                        this.docs.displayScreen(docId, slide);
                    } else {
                        this.docs.displayScreen(docId);
                    }


                    (typeof fromReload != 'undefined') ? this.createNoteNav(fromReload) : this.createNoteNav();
                    this.updateLinkNotes(this.docs.currNote);
                    virtualclass.dts.setCurrentNav(this.docs.currNote);
                    virtualclass.vutil.hideUploadMsg('docsuploadContainer'); // file uploader container
                    virtualclass.vutil.addNoteClass();
                } else {
                    this.removePagesUI(doc);
                    if (!virtualclass.dts.noteExist()) {
                        virtualclass.vutil.showUploadMsg('docsuploadContainer'); // file uploader container
                        virtualclass.dts.docs.currNote = 0;
                        virtualclass.dts.docs.currDoc = undefined;
                        virtualclass.gObj.currWb = null;
                        //virtualclass.dts.indexNav.removeNav();
                    }

                    if (!virtualclass.dts.docSelected()) {
                        var docsObj = JSON.parse(localStorage.getItem('dtsdocs'));
                        if (docsObj != null) {
                            docsObj.slideNumber = null;
                            localStorage.setItem('dtsdocs', JSON.stringify(docsObj));
                        }
                        if (roles.isStudent()) {


                            var cont = document.querySelector("#cont" + virtualclass.gObj.currWb);
                            if (cont != null) {
                                cont.style.display = 'block';

                            } else {
                                var docsContainer = document.querySelector('#docScreenContainer');
                                if (docsContainer != null) {
                                    docsContainer.classList.remove('noteDisplay');
                                }
                                virtualclass.gObj.currWb = null;

                                var virtualclassCont = document.querySelector('#virtualclassCont');
                                virtualclassCont.classList.remove('pdfRendering');

                                //if(!Object.keys(virtualclass.dts.notes).length){
                                //  if(!roles.hasControls()){
                                var zoomHide = document.querySelector("#virtualclassAppLeftPanel.hideZoom");
                                var zoom = document.querySelector("#virtualclassAppLeftPanel");
                                if (!zoomHide) {
                                    zoom.classList.add("hideZoom");
                                    zoom.classList.remove("showZoom");
                                }
                                //}
                                // }

                            }
                        }
                    }
                }

                var currNavApp = document.querySelector('#listnotes .currentNav');
                if (currNavApp == null) {
                    var firstNote = document.querySelector('#listnotes .linknotes');
                    if (firstNote != null) {
                        virtualclass.dts.currNote = firstNote.dataset.rid;
                        var mainp = document.querySelector('#mainpnotes' + virtualclass.dts.currNote);
                        // Clicking on default doc's navigation
                        if (mainp != null) {
                            // Getting the relative document according to note
                            virtualclass.dts.docs.currDoc = virtualclass.dts.currNote.split('_')[0];
                            mainp.click();
                        }
                    }
                }

                if (roles.hasAdmin()) {
                    this.sendOrder(this.order);
                }
            },

            selectFirstNote: function () {
                var currenElement = document.querySelector('#notesContainer .current');
                if (currenElement == null) {
                    var firstElement = document.querySelector('#notesContainer .note');
                    if (firstElement != null) {
                        this.docs.currNote = firstElement.dataset.slide;
                        console.log('Current note ' + this.docs.currNote);
                        this.docs.currDoc = 'docs' + this.getDocId(firstElement.dataset.slide);
                        this.docs.note.getScreen(firstElement);
                    }
                }
            },

            isDocumentExist: function (docsObj) {
                if (typeof docsObj != 'undefined') {
                    if (docsObj.init != 'layout' && docsObj.init != 'studentlayout') {
                        return true;
                    } else {
                        return false;
                    }
                }
            },

            isDocAlreadyExist: function (id) {
                for (var i = 0; i < this.documents.length; i++) {
                    if (this.documents[i].id == id) {
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
                container: function () {
                    var docShareCont = document.getElementById(this.id);
                    if (docShareCont == null) {
                        var control = roles.hasAdmin() ? true : false;
                        var data = {"control": roles.hasControls()};

                        var template = virtualclass.getTemplate('docsMain', 'documentSharing');
                        // $('#virtualclassAppLeftPanel').append(template(data));

                        //$('#virtualclassAppLeftPanel').append(template(data));

                        virtualclass.vutil.insertAppLayout(template(data));


                        if (document.querySelector('#congdashboard') == null) {
                            // Creating Document Dashboard Container
                            var dashboardTemp = virtualclass.getTemplate('dashboard');
                            var dbHtml = dashboardTemp({app: "DocumentShare"});
                            document.querySelector('#dashboardContainer').innerHTML = dbHtml;
                        }
                    }

                    if (document.querySelector('#DocumentShareDashboard') == null) {
                        var elem = document.createElement("div");
                        var cont = document.querySelector('#congdashboard .modal-body')
                        cont.appendChild(elem);
                        elem.id = 'DocumentShareDashboard'
                    }

                    if (document.querySelector('#docsDbCont') == null) {
                        // Creating  DOC's Dashboard
                        document.querySelector('#DocumentShareDashboard').innerHTML = virtualclass.vutil.getDocsDashBoard("DocumentShare");
                        if (roles.hasControls()) {
                            virtualclass.vutil.attachEventToUploadTab();
                            if (document.querySelector('#DocumentShareDashboard .qq-gallery') == null) {
                                virtualclass.vutil.modalPopup('docs', ["docsuploadContainer"]);
                            }
                            /** Initialize close handler of document's dailogue box, if it's not,
                             *  then there is a problem when user click on document dashboard after page refreshing on whiteboard */
                            virtualclass.vutil.modalCloseHandler();
                        }
                    }
                },

                createMainContent: function (container, content, docId) {
                    // this.createSlides(container, content);
                },

                createSlides: function (pageContainer, allNotes) {
                    var notes = document.querySelector('#notesContainer');
                    if (notes == null) {
                        notes = document.createElement('div');
                        notes.className = 'notes';
                        notes.id = 'notesContainer';
                    }

                    var cthis = virtualclass.dts;
                    for (var i = 0; i < allNotes.length; i++) {
                        var noteId = 'note' + allNotes[i].id;
                        if (document.querySelector('#note' + allNotes[i].id) == null) {
                            var note = document.createElement('div');
                            note.id = 'note' + allNotes[i].id;
                            note.className = 'note';
                            note.dataset.slide = allNotes[i].id;

                            if (note.dataset.statuS == 'true' || note.dataset.statuS == true) {
                                note.dataset.status = 1;
                            } else if (note.dataset.status == 'false' || note.dataset.status == false) {
                                note.dataset.status = 0;
                            } else {
                                note.dataset.status = allNotes[i].status;
                            }
                        }
                    }

                    pageContainer.appendChild(notes);
                    if (roles.hasControls()) {
                        this.createNavigation(pageContainer, "prev");
                        this.createNavigation(pageContainer, "next");
                    }
                },

                createNavigation: function (pageContainer, cmd) {
                    if (document.querySelector('#docs' + cmd) == null) {
                        var nav = document.createElement('span');
                        nav.className = 'nvgt' + ' ' + cmd;
                        nav.id = 'docs' + cmd;
                        pageContainer.appendChild(nav);
                    }
                },

                /**
                 * Display leftbar navigation
                 *
                 */
                createDocsNav: function (elem, docId) {
                    // Please put below comment into console to create dummy
                    // var docScreenContainer = document.getElementById('docScreenContainer');
                    // virtualclass.dts.UI.createDocsNav(docScreenContainer, 1);

                    //var docScreenContainer = document.getElementById('docScreenContainer');
                    //virtualclass.dts.UI.createDocsNav(docScreenContainer, 2);

                    var docNav = document.getElementById('listDocs');
                    if (docNav == null) {
                        var cthis = virtualclass.dts;
                        docNav = document.createElement('div');
                        docNav.id = 'listDocs';
                        elem.appendChild(docNav);
                    }

                    var linkNav = this.createDocsNavLink(docId);
                    this.attachDocsNav(linkNav, docId);
                    docNav.appendChild(linkNav);
                },

                createDocsNavLink: function (sn) {
                    var link = document.createElement('div');
                    link.id = "link" + sn;
                    link.className = 'linkdoc';
                    link.innerHTML = sn;
                    link.dataset.screen = sn;
                    return link;
                },

                attachDocsNav: function (linkNav, docId) {
                    var cthis = virtualclass.dts;
                    linkNav.onclick = cthis.docs.goToDocs(docId);
                }
            },

            createNoteNav: function (fromReload) {
                if (this.order) {
                    this.indexNav.init();
                }

                var curr = virtualclass.dts.docs.currNote;
                var order = '';
                for (var i = 0; i < this.order.length; i++) {
                    if (typeof this.notes[this.order[i]] != 'object') {

                        if (this.allNotes[this.order[i]].status == 'true' || (+this.allNotes[this.order[i]].status) == 1) {
                            var status = 1;
                        } else {
                            var status = 0;
                        }
                        this.notes[this.order[i]] = new virtualclass.page('screen-docs', 'notes', 'virtualclassDocumentShare', 'dts', status);
                        this.notes[this.order[i]].init(this.order[i], 'note_' + this.allNotes[this.order[i]].lc_content_id + '_' + this.order[i]);
                        if (typeof fromReload == 'undefined') {
                            this.noteStatus(this.order[i], status);
                        }
                    }
                    if (roles.hasControls()) {
                        this.indexNav.createDocNavigationNumber(this.order[i], i, status)
                    }

                }
                this.storeInDocs(this.allNotes);
                if (roles.hasControls()) {
                    this.indexNav.shownPage(this.indexNav.width)
                    this.indexNav.addActiveNavigation();
                    var subCont = document.querySelector("#dcPaging")
                    subCont.addEventListener("change", function () {
                        virtualclass.dts.docs.goToNavs(this.value)();
                    });
                }

                var btn = document.querySelector(".congrea.teacher  #dashboardContainer .modal-header button.enable")
                if (!btn) {
                    virtualclass.vutil.showFinishBtn();
                }
                this.indexNav.setTotalPages(virtualclass.dts.order.length);

//                var index = document.querySelector(".congrea #dcPaging #index" + curr);
//                if (index && !index.classList.contains('active')) {
//                    index.classList.add("active");
//                }
            },

            addNoteHidClass: function (sn, i, n) {

                if (i > n) {
                    sn.classList.add("hid", "right");
                } else {
                    sn.classList.add("shw");
                }
            },


            calcInitialWidth: function () {
//                if ($(window).width() <= 320) {
//                    return $('meta[name=viewport]').attr('content', 'user-scalable=yes, initial-scale=0.63, maximum-scale=1.3, width=480');
//                } else if ($(window).width() <= 480) {
//                    return $('meta[name=viewport]').attr('content', 'user-scalable=yes, initial-scale=0.89, maximum-scale=1.3, width=480');
//                } else if ($(window).width() <= 768) {
//                    return $('meta[name=viewport]').attr('content', 'user-scalable=yes, initial-scale=0.8, maximum-scale=1.3, width=920');
//                } else if ($(window).width() <= 1024) {
//                    return $('meta[name=viewport]').attr('content', 'user-scalable=yes, initial-scale=0.85, maximum-scale=1.3, width=920');
//                }


            },


            indexHandler: function (order) {
                // virtualclass.page.prototype.createPageNavAttachEvent(order)
                virtualclass.dts.docs.goToNavs(order)
            },

            createNoteNavAlt: function (fromReload) {
                // need to get all images from here
                for (var i = 0; i < this.order.length; i++) {

                    if (this.allNotes[this.order[i]].status == 'true' || (+this.allNotes[this.order[i]].status) == 1) {
                        var status = 1;
                    } else {
                        var status = 0;
                    }
                    this.notes[this.order[i]] = new virtualclass.page('screen-docs', 'notes', 'virtualclassDocumentShare', 'dts', status);
                    this.notes[this.order[i]].init(this.order[i], 'note_' + this.allNotes[this.order[i]].lc_content_id + '_' + this.order[i]);
                    if (typeof fromReload == 'undefined') {
                        this.noteStatus(this.order[i], status);
                    }

                }

                if (typeof fromReload == 'undefined') {
                    this.storeInDocs(this.allNotes);
                }
            },

            removeNoteNav: function (note) {
                var linknote = document.querySelector("#linknotes" + note);
                if (linknote != null) {
                    linknote.parentNode.removeChild(linknote);

                }

                if (typeof this.notes[note] == 'object') {
                    delete this.notes[note];
                }


            },

            docs: {
                num: 0,
                currNote: 0,

                // Get the passed slide or first slide
                curr: function (sn, slide) {

                    this.currDoc = sn;
                    var cthis = virtualclass.dts;
                    virtualclass.dts.docs.num = sn;

                    var prev = document.querySelector('#documentScreen .screen.current');
                    if (prev != null) {
                        prev.classList.remove('current');
                    }

                    var screen = document.querySelector('#screen-docs');
                    screen.classList.add('current');

                    var docContainer = document.querySelector('#documentScreen');
                    docContainer.dataset.screen = sn;

                    if (typeof slide != 'undefined') {
                        this.note = new this.slide(slide);
                    } else {
                        this.note = new this.slide();
                    }

                    this.note.init();
                    this.note.currentSlide(this.currNote);
                },

                display: function (selector) {
                    document.querySelector(selector).style.display = 'block';
                },

                hide: function (selector) {
                    document.querySelector(selector).style.display = 'none';
                },

                goToDocs: function (doc) {
                    var cthis = this;
                    return function () {
                        if (typeof virtualclass.dts.docs.note == 'object') {
                            virtualclass.vutil.updateCurrentDoc(virtualclass.dts.docs.note.currNote);
                        }
                        cthis.executeScreen(doc);
                        if (roles.hasControls()) {
                            if (Object.keys(virtualclass.dts.notes).length) {
                                virtualclass.vutil.showFinishBtn();
                            } else {
                                virtualclass.vutil.removeFinishBtn();
                            }
                        }
                    }
                },

                /**
                 *
                 * @param note expects the note which would be displayed into current view
                 *
                 */
                goToNavs: function (note) {
                    var cthis = this;
                    return function () {
                        var element = document.querySelector("#linknotes" + note);
                        if (element != null) {
                            if ((+element.dataset.status) == 1) {
                                virtualclass.dts.docs.currNote = note;
                                virtualclass.dts.docs.note.currentSlide(note);
                            }
                        } else {
                            virtualclass.dts.docs.currNote = note;
                            virtualclass.dts.docs.note.currentSlide(note);
                        }
                        virtualclass.dts.indexNav.addActiveNavigation()
                        virtualclass.dts.indexNav.UI.setClassPrevNext()

                    }
                },

                studentExecuteScreen: function (data) {
                    var filePath = data.dres;
                    this.currDoc = filePath;
                    var relativeDocs = virtualclass.dts.getDocs(filePath);
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

                executeScreen: function (doc, fromReload, cb, slide) {
                    this.currDoc = doc;
                    if (doc.indexOf('docs') == -1) {
                        this.currDoc = 'docs' + doc; // In case of missing docs
                    }

                    var cthis = virtualclass.dts;
                    if (roles.hasControls() && typeof fromReload == 'undefined') {
                        var notes = cthis.requestSlides(doc);
                        if (notes != null) {
                            cthis.onResponseFiles(doc, notes);
                            if (typeof cb != 'undefined') {
                                cb();
                            }
                        } else {
                            console.log('There is no data');
                        }
                    } else if (typeof slide != undefined) {
                        // this should be removed
                        if (typeof doc == 'string' && doc.indexOf('docs') > -1) {
                            doc = doc.split('docs')[1];
                        }
                        var slides = cthis.getDocs(doc);
                        if (slides != null) {
                            if (typeof fromReload == 'undefined') {
                                cthis.onResponseFiles(doc, slides, undefined, slide);
                            } else {
                                cthis.onResponseFiles(doc, slides, undefined, slide, 'fromReload');
                            }

                            if (typeof cb != 'undefined') {
                                cb();
                            }
                        }
                    }

                },

                displayScreen: function (screen, slide) {
                    console.log("==== prev display screen");
                    if (typeof slide != 'undefined') {
                        this.curr(screen, slide);
                    } else {
                        this.curr(screen);
                    }
                },


                /**
                 * Create whitebaord/annoation tool for each slide/note
                 * @param slide expects the slide
                 */
                createWhiteboard: async function (slide) {
                    var cthis = virtualclass.dts;
                    var wbid = '_doc_' + slide + '_' + slide;

                    /**
                     * This canvas width and height is set for Screen 1280 * 1024
                     * The same dimension is using for image
                     */

                    /*** width and height handling ***/

                        // var res = virtualclass.system.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});

                    var canvasWidth = 730;
                    var canvasHeight = 750;

                    // cthis.setNoteDimension(canvasWidth, canvasHeight, wbid);
                    //console.log('Create Whiteboard ');

                    console.log(virtualclass.gObj.currWb + ' ' + 'document share Create Whiteboard ');
                    var whiteboard = document.createElement('div');
                    whiteboard.id = 'cont';
                    whiteboard.className = 'whiteboard';

                    whiteboard.dataset.wid = wbid;
                    whiteboard.id = 'cont' + whiteboard.dataset.wid;

                    //document.querySelector("[data-doc='1'] .slide[data-slide='1']");

                    var query = ".note[data-slide='" + slide + "']";
                    var elem = document.querySelector(query);
                    if (elem != null) {
                        elem.insertBefore(whiteboard, elem.firstChild);
                        await virtualclass.vutil.createWhiteBoard(whiteboard.dataset.wid);
                    } else {
                        console.log("Element is null");

                    }
                    console.log("==== previous set ", virtualclass.dtsConfig.id)
                    virtualclass.previous = virtualclass.dtsConfig.id;
                },

                /**
                 *
                 * @param slide represents the slide/note
                 *
                 */
                slide: function (slide) {
                    return {
                        li_items: 0,
                        imageNumber: 0,
                        currSlide: (typeof slide != 'undefined') ? slide : 0, // TODO this should be removed
                        currNote: (typeof slide != 'undefined') ? slide : 0,
                        doc: 1,
                        init: function (screen) {
                            var cthis = virtualclass.dts;
                            var screen = '#screen-docs';

                            var docScreen = document.querySelector(screen + ' .notes');

                            this.doc = cthis.docs.num;

                            if (docScreen != null) {

                                this.li_items = docScreen.children;
                                this.imageNumber = this.li_items.length;

                                if (roles.hasControls()) {
                                    var prev = document.querySelector(screen + " .prev");
                                    var next = document.querySelector(screen + " .next");
                                    var dthis = this;

                                    prev.onclick = function () {
                                        virtualclass.vutil.navWhiteboard(dthis, dthis.prevSlide, cthis);

                                    };

                                    next.onclick = function () {
                                        virtualclass.vutil.navWhiteboard(dthis, dthis.nextSlide, cthis);
                                    };
                                }
                            } else {
                                alert("no element");
                            }

                        },

                        slideTo: function (note, fromReload) {
                            var noteId = note.dataset.slide;
                            virtualclass.vutil.updateCurrentDoc(noteId);

                            var slideNum = slideNum;

                            this.displaySlide(note);

                            /**
                             * TODO, that setTimeout should be removed, it used to hanldle black screen at student
                             * while teacher select/click the document tab subsequently
                             **/
                            if (roles.hasControls() && typeof fromReload == 'undefined') {
                                ioAdapter.mustSend({
                                    'dts': {slideTo: noteId, docn: virtualclass.dts.docs.currDoc},
                                    'cf': 'dts'
                                });
                                console.log('Slide to document sharing ' + noteId);
                            }
                        },

                        /**
                         * display the passed slide/note
                         * Expects the note that has to be display
                         */
                        displaySlide: function (note) {
                            //TODO this should be used by cthis/this
                            var cthis = virtualclass.dts;
                            //var currElem = document.querySelector('div[data-slide="'+slide+'"]');
                            var prevElem = document.querySelector('#screen-docs .note.current');
                            if (prevElem != null) {
                                prevElem.classList.remove('current');
                            }

                            if (note != null) {
                                note.classList.add('current');
                            }
                            virtualclass.vutil.addNoteClass();
                            if (!roles.hasControls()) {
                                var id = note.id.split("note")[1]
                                virtualclass.dts.indexNav.studentDocNavigation(id);
                            }

                        },

                        /**
                         * display the previous slide/note
                         * cthis expects main class virtuaclass.dts
                         */
                        prevSlide: function (cthis) {
                            var currNodeId = cthis.docs.currNote;
                            var currElem = document.querySelector('#documentScreen #note' + currNodeId);
                            if (currElem != null) {
                                var prevSlide = currElem.previousElementSibling;
                                if (prevSlide != null) {
                                    if ((+prevSlide.dataset.status) == 0) {
                                        var activeSlide = this.getActiveSlide(cthis, currNodeId, 'prev');
                                        if (!activeSlide) {
                                            // alert('There is no page');
                                            //virtualclass.dts.indexNav.UI.setArrowStatus('leftNavPage', 'disable');

                                            virtualclass.dts.indexNav.UI._setArrowStatusDocs(document.getElementById('leftNavPage'), 'disable', 'enable');

                                        } else {
                                            // by true, know the event is performed real user
                                            this.getScreen(activeSlide, true);
                                            cthis.docs.currNote = activeSlide.dataset.slide;
                                            console.log('Current note ' + virtualclass.dts.docs.currNote);
                                        }
                                    } else {

                                        this.getScreen(prevSlide, true);
                                        cthis.docs.currNote = prevSlide.dataset.slide;
                                        console.log('Current note ' + virtualclass.dts.docs.currNote);

                                    }

                                    /** to set the dimension of whiteboard during window is resized **/
                                    var currWb = virtualclass.wb['_doc_' + cthis.docs.currNote + '_' + cthis.docs.currNote];
                                    if (typeof currWb == 'object') {
                                        system.setAppDimension(null, 'resize');
                                    }

                                    virtualclass.dts.indexNav.movePageIndex("left")

                                } else {
                                    virtualclass.dts.indexNav.UI._setArrowStatusDocs(document.getElementById('leftNavPage'), 'disable', 'enable');
                                }
                            }
                        },

                        getActiveSlide: function (cthis, id, which) {
                            var currElem = document.querySelector('#documentScreen #note' + id);
                            if (currElem != null) {
                                if (which == 'next') {
                                    var activeSlide = currElem.nextElementSibling;
                                } else {
                                    var activeSlide = currElem.previousElementSibling;
                                }

                                if (activeSlide != null) {
                                    if ((+activeSlide.dataset.status) == 0) {
                                        // return is need for return the end value
                                        return this.getActiveSlide(cthis, activeSlide.dataset.slide, which)
                                    } else {
                                        return activeSlide;
                                    }
                                } else {
                                    return false;
                                }
                            }
                        },

                        /**
                         * display the next slide/note
                         * cthis expects main class virtuaclass.dts
                         */
                        nextSlide: function (cthis) {
                            var lastElement = cthis.order[cthis.order.length - 1];
                            var currNodeId = cthis.docs.currNote;

                            if (currNodeId != lastElement) {
                                var currElem = document.querySelector('#documentScreen #note' + currNodeId);
                                if (currElem != null) {
                                    var nextSlide = currElem.nextElementSibling;
                                    if (nextSlide != null) {
                                        if ((+nextSlide.dataset.status) == 0) {
                                            var activeSlide = this.getActiveSlide(cthis, currNodeId, 'next');
                                            if (!activeSlide) {
                                                alert('There is no page');
                                            } else {
                                                this.getScreen(activeSlide, true);
                                                cthis.docs.currNote = activeSlide.dataset.slide;
                                                console.log('Current note ' + virtualclass.dts.docs.currNote);

                                            }

                                        } else {
                                            this.getScreen(nextSlide, true);
                                            cthis.docs.currNote = nextSlide.dataset.slide;
                                        }
                                    }

                                }
                                virtualclass.dts.indexNav.movePageIndex("right")

                            } else {
                                // alert('There is no page');
                                virtualclass.dts.indexNav.UI._setArrowStatusDocs(document.getElementById('rightNavPage'), 'disable', 'enable');
                                virtualclass.zoom.adjustScreenOnDifferentPdfWidth();
                            }
                        },

                        isSlideAvailable: function (slidId, lastElement) {
                            if (slidId == lastElement) {
                                return false
                            }
                            return true;
                        },

                        /**
                         * display the current slide/note
                         * slideNum exepects the slide
                         */
                        currentSlide: function (slideNum) {
                            var currElem = document.querySelector('#documentScreen #note' + slideNum);
                            if (currElem != null) {
                                this.getScreen(currElem);
                            } else {
                                console.log('Document-Sharing:-' + slideNum + ' is not found ');
                            }
                            var docsContainer = document.querySelector('#docScreenContainer');
                            if (docsContainer != null) {
                                docsContainer.classList.add('noteDisplay');
                            }
                        },

                        isPdfRendered: function () {
                            var pdfRenderElem = document.querySelector('#canvas' + virtualclass.gObj.currWb);
                            if (pdfRenderElem != null) {
                                return pdfRenderElem.parentNode.dataset.hasOwnProperty('pdfrender');
                            }
                            return false;
                        },

                        /**
                         * Create the screen with Whiteboard and Current slide
                         */
                        getScreen: function (note, userClicked) {
                            // if(typeof virtualclass.gObj.currWb != 'undefined' && virtualclass.gObj.currWb != null){
                            //   if(note.nextElementSibling != null){
                            //      var preFetchSlide =  note.nextElementSibling.dataset.slide;
                            //      virtualclass.pdfRender[virtualclass.gObj.currWb].prefechPdf(preFetchSlide);
                            //     }
                            // }

                            this.currSlide = note.dataset.slide;
                            this.currNote = note.dataset.slide;
                            virtualclass.dts.currDoc = this.doc;

                            this.slideTo(note);

                            // todo, critical that's need to be enable and handle properly
                            if (virtualclass.wb[virtualclass.gObj.currWb] != null) {
                                console.log("whiteboard ============ " + virtualclass.wb[virtualclass.gObj.currWb].gObj.queue.length);
                            }


                            if (virtualclass.wb[virtualclass.gObj.currWb] != null && virtualclass.wb[virtualclass.gObj.currWb].gObj.queue.length > 0) {
                                virtualclass.gObj.tempQueue[virtualclass.gObj.currWb] = virtualclass.wb[virtualclass.gObj.currWb].gObj.queue;
                            }

                            if (!this.isWhiteboardExist(this.currNote)) {
                                virtualclass.dts.docs.createWhiteboard(this.currNote);
                            } else if (this.isWhiteboardExist(this.currNote) && !this.isPdfRendered(this.currNote)) {
                                delete virtualclass.wb[virtualclass.gObj.currWb];
                                virtualclass.dts.docs.createWhiteboard(this.currNote);
                            } else {
                                // If there is a zoom, that needs to apply at in next/previous screen,
                                // virtualclass.zoom.normalRender();
                                virtualclass.zoom.adjustScreenOnDifferentPdfWidth();

                                //virtualclass.zoom.zoomAction('fitToScreen');
                            }

                            virtualclass.vutil.updateCurrentDoc(this.currNote);
                            virtualclass.dts.updateLinkNotes(this.currNote);

                            var isFirstNote = virtualclass.dts.isFirstNote(note.id);
                            var isLastNote = virtualclass.dts.isLastNote(note.id);

                            var notesContainer = document.querySelector('#screen-docs .pageContainer');

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
                        /**
                         * this expects the the whiteboard related to slide
                         * is exist or not
                         * @param slide expects slide/note
                         * @returns {boolean}
                         */
                        isWhiteboardExist: function (slide) {
                            var wbContId = 'containerWb_doc_' + slide + '_' + slide;
                            var wbCont = document.querySelector('#' + wbContId);
                            return (wbCont != null);
                        }
                    }
                }
            },

            /**
             * Destryo the dts class
             */
            destroyDts: function () {
                var appWrapper = document.getElementById(virtualclass.dts.UI.id);
                if (appWrapper != null) {
                    appWrapper.parentNode.removeChild(appWrapper);
                } else {
                    console.log('Element is null');
                }
                virtualclass.dts = null;
            },

            screenIsCreated: function (doc) {
                var screen = document.getElementById('screen' + doc);
                return (screen != null);
            },

            convertInObjects: function (allPages) {
                var note = {};
                for (var i = 0; i < allPages.length; i++) {
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
            onmessage: function (e) {
                if (typeof virtualclass.dts != 'object') {
                    virtualclass.makeAppReady('DocumentShare', undefined, {init: "studentlayout"});
                }
                var dts = e.message.dts;
                if (dts.hasOwnProperty('docn') && dts.docn.indexOf('docs') == -1) {
                    dts.docn = 'docs' + dts.docn; // incaseof missing docs prefix
                }

                if (dts.hasOwnProperty('allNotes')) {
                    this.allNotes = dts.allNotes;
                    this.storeInDocs(this.allNotes);

                } else if (dts.hasOwnProperty('fallNotes')) {
                    this.allNotes = dts.fallNotes;
                    this.storeInDocs(this.allNotes);
                    virtualclass.storage.dstAllStore(virtualclass.serverData.rawData.docs);
                } else if ((dts.hasOwnProperty('allDocs'))) {
                    this.allDocs = dts.allDocs;
                    this.afterUploadFile(dts.doc);
                } else if (dts.hasOwnProperty('fallDocs')) {
                    var cthis = this;
                    cthis.afterFirstRequestDocs(dts.fallDocs);
                    virtualclass.serverData.rawData.docs = dts.fallDocs;


//                    this.allDocs = dts.fallDocs;
//                    for(var i=0; i< this.allDocs.length; i++){
//                        this.initDocs( this.allDocs.id);
//                    }
                    // have to do something
                } else if (dts.hasOwnProperty('dres')) {
                    this.docs.studentExecuteScreen(dts);
                    console.log(virtualclass.gObj.currWb + ' ' + 'document share :- Layout initialized');
                } else if (dts.hasOwnProperty('slideTo')) {
                    if (typeof this.docs.note != 'object') {
                        var cthis = this;
                        this.docs.executeScreen(dts.docn, undefined, function () {
                            console.log('document share :- doc is not created');
                            cthis.docs.note.currNote = dts.slideTo;
                            var note = document.querySelector('#note' + dts.slideTo);
                            cthis.docs.note.slideTo(note);
                        }, dts.slideTo);

                        // if teacher refresh the page and navigat to other doc
                        // In student window, It will execute below else condition, it trigger for next slide
                        // In this case the docs are different so we need to initalize first
                        // doc and after that we need to call for next slide


                    } else if (typeof this.docs.note == 'object' && dts.docn != this.docs.num) {
                        this.docs.currNote = dts.slideTo;
                        console.log('Current note ' + this.docs.currNote);
                        this.docs.executeScreen(dts.docn, undefined);
                        this.docs.note.currentSlide(dts.slideTo);
                    } else {
                        var note = document.querySelector('#note' + dts.slideTo);
                        if (note != null) {
                            this.docs.currNote = dts.slideTo;
                            console.log('Current note ' + this.docs.currNote);
                            // In normal case
                            this.docs.note.getScreen(note);
                            console.log(virtualclass.gObj.currWb + ' ' + 'document share :- Normal Case');
                        } else {
                            alert('Note is not found ' + dts.slideTo);
                        }


                    }
                } else if (dts.hasOwnProperty('dispScreen')) {
                    var doc = dts.dispScreen.sc;
                    virtualclass.vutil.updateCurrentDoc(doc, dts.dispScreen.sn);
                    if (!virtualclass.dts.screenIsCreated(doc)) {
                        //console.log('document share :- With screen Created');
                        console.log(virtualclass.gObj.currWb + ' ' + 'document share :- With screen Created');
                        this.docs.executeScreen(doc, undefined, undefined, dts.dispScreen.sn);
                        if (typeof this.docs.note == 'object') {
                            this.docs.note.getScreen(dts.dispScreen.sn); // it will get the screen if there is not already
                        }
                    } else {
                        //console.log('document share :- Only display screen');
                        console.log(virtualclass.gObj.currWb + ' ' + 'document share :- Only display screen');
                        this.docs.displayScreen(doc);
                    }
                } else if (dts.hasOwnProperty('rmnote')) {
                    this._delete(dts.rmnote);
                } else if (dts.hasOwnProperty('rmsnote')) { // remove single note
                    this._removePageUI(dts.rmsnote);
                    this._removePageFromStructure(dts.rmsnote);
                } else if (dts.hasOwnProperty('noteSt')) {
                    this.noteStatus(dts.note, dts.noteSt);
                    this.storeInDocs(this.allNotes);
                } else if (dts.hasOwnProperty('docSt')) {
                    this.docStatus(dts.doc, dts.docSt);
                } else if (dts.hasOwnProperty('order_recived')) {
                    this.afterRequestOrder(dts.order_recived);
                } else if (dts.hasOwnProperty('norder')) {
                    this.order = dts.norder;
                    virtualclass.dts.indexNav.studentDocNavigation(this.docs.currNote);
                }

                // if(!dts.hasOwnProperty('dres')){
                //     virtualclass.vutil.resizeWindowIfBigger();
                // }
            },

            sendCurrentSlide: function () {
                if (virtualclass.dts.docs.hasOwnProperty('currDoc')) {
                    var doc = virtualclass.dts.docs.currDoc;
                    if (doc != undefined) {
                        if (document.querySelector('#listnotes .note') != null) {
                            ioAdapter.mustSend({
                                'dts': {slideTo: virtualclass.dts.docs.note.currNote, docn: doc},
                                'cf': 'dts'
                            });
                            console.log(virtualclass.gObj.currWb + ' ' + 'Document share send current slide');
                        }

                    } else {
                        console.log('Document sharing : doc number is undefined');
                    }
                }

            },

            sendCurrentDoc: function () {
                if (virtualclass.dts.docs.hasOwnProperty('currDoc')) {
                    if (doc != undefined) {
                        var doc = virtualclass.dts.docs.currDoc;
                        ioAdapter.mustSend({'dts': {doc: doc = virtualclass.dts.docs.currDoc}, 'cf': 'dts'});
                        //console.log('Document share send current doc only');
                        console.log(virtualclass.gObj.currWb + ' ' + 'Document share send current doc only');
                    } else {
                        console.log('Document sharing : doc number is undefined');
                    }
                }
            },

            consoleMessage: function (msg) {
                console.log(virtualclass.gObj.currWb + ' ' + msg);
            },

            _rearrange: function (pageOrder) {
                alert(pageOrder.toString());
            },

            reArrangeNotes: function (order) {
                this.order = order;
                this.reArrangeElements(order);
                if (roles.hasAdmin()) {
                    this.sendOrder(this.order);
                    ioAdapter.mustSend({'dts': {norder: this.order}, 'cf': 'dts'});

                }
            },

            sendOrder: function (order) {
                virtualclass.vutil.sendOrder('docs', order);
            },

            reaArrangeThumbCount: function () {
                var allThumbist = document.querySelectorAll('#listnotes .thumbList');
                for (var j = 0; j < allThumbist.length; j++) {
                    allThumbist[j].innerHTML = j + 1;
                }
            },
            reArrangeElements: function (order) {
                var container = document.getElementById('notesContainer'),
                    tmpdiv = document.createElement('div');
                tmpdiv.id = "notesContainer";
                tmpdiv.className = "notes";

                /**
                 * TODO, This should be improved, we don't need to call getActiveNotes each  time when we need active notes,
                 * it should be invoked only once,
                 * It handles, if there are videoswhich are not in orders, that videos should be display also
                 **/

                for (var i = 0; i < order.length; i++) {
                    tmpdiv.appendChild(document.getElementById('note' + order[i]));
                }
                container.parentNode.replaceChild(tmpdiv, container);


                // organize list
                this.reaArrangeThumbCount();
                var paging = document.querySelectorAll("#dcPaging .noteIndex");
                if (paging.length > 0) {
                    this.indexNav.rearrangePageNavigation(order)//new
                }
                var subCont = document.querySelector("#dcPaging")
                subCont.addEventListener("change", function () {
                    virtualclass.dts.docs.goToNavs(this.value)();
                })

            },

            _delete: function (id) {
                var linkDocs = document.querySelector('#linkdocs' + id);
                if (linkDocs != null) {
                    linkDocs.parentNode.removeChild(linkDocs);
                }
                var data = {
                    uuid: id,
                    action: 'delete',
                    page: 0
                }

                var url = virtualclass.api.UpdateDocumentStatus;
                var that = this;

                var cthis = this;
                virtualclass.xhrn.sendData(data, url, function (msg) {
                    var res = JSON.parse(msg);
                    if (res.status == 'ok') {
                        cthis.sendOrder(cthis.order);
                    }
                });

                delete this.pages['docs' + id];
                this.removePagesUI(id);
                this.removePagesFromStructure(id);
                this.upateInStorage();
            },

            _deleteNote: function (id, typeDoc) {
                this._removePageUI(id, typeDoc);
                this._removePageFromStructure(id, typeDoc);
                if (roles.hasControls()) {
                    ioAdapter.mustSend({'dts': {rmsnote: id}, 'cf': 'dts'});
                }

                var idarr = id.split('_');
                var doc = idarr[0];
                var pid = parseInt(idarr[1]);

                var data = {
                    uuid: doc,
                    action: 'delete',
                    page: pid
                }

                var url = virtualclass.api.UpdateDocumentStatus;

                var cthis = this;
                virtualclass.xhrn.sendData(data, url, function (msg) {
                    var res = JSON.parse(msg);
                    if (res.status == 'ok') {
                        cthis.sendOrder(cthis.order);
                    }
                });

                //Check if there is exist any noted
                var noteExit = false;
                var mainDoc = virtualclass.dts.allDocs[doc];
                if (mainDoc != null) {
                    for (var i = 0; i < mainDoc.notesarr.length; i++) {
                        if (!mainDoc.notesarr[i].hasOwnProperty('deletedn')) {
                            noteExit = true;
                            break;
                        }
                    }
                }
                if (!noteExit) {
                    this._delete(doc);
                }
                if (roles.hasControls()) {
                    this.indexNav.createIndex();
                }


            },

            removePagesFromStructure: function (id) {
                this.allDocs[id].deleted = '0';
                var result = [];
                var i;
                for (i in this.allNotes) {
                    if (this.allNotes[i].id.indexOf(id) > -1) {
                        this._removePageFromStructure(this.allNotes[i].id);
                        //this.removePagesFromStructure(id); // again we call the deltePages as allPages array is re-arranged
                    }
                }
            },

            updateInAllDocs: function (noteid) {
                // var docId = virtualclass.dts.currDoc.substring(4, virtualclass.dts.currDoc.length);
                var docId = noteid.split('_')[0];
                doc = this.allDocs[docId];
                if (typeof doc.notes[noteid] != 'undefined') {
                    doc.notes[noteid].deletedn = noteid;
                    for (var i = 0; i < doc.notesarr.length; i++) {
                        if (doc.notesarr[i].id == noteid) {
                            doc.notesarr[i].deletedn = noteid;
                        }
                    }
                } else {
                    console.log('The note with the id ' + noteid + ' is not available');
                }
            },

            _removePageFromStructure: function (id) {
                this.removeWhiteboardFromStorage('_doc_' + id + '_' + id);
                // delete this.allNotes[id];
                this.allNotes[id].deletedn = id;
                this.storeInDocs(this.allNotes); //new pages save into docs
                this.updateInAllDocs(id);
            },

            _disable: function (id) {
                this.docStatus(id);
            },


            _enable: function (id) {
                this.docStatus(id);
            },

            /** TODO, check if following function is using **/

            docStatus: function (id, status) {
                var note = document.querySelector("#linkdocs" + id + ' .controls.status');
                if (note != null) {
                    if (typeof status == 'undefined') {
                        var status = (1 - (+note.dataset.status));
                    } else {
                        var status = status;
                    }
                } else {
                    console.log('document share:- there is no element ' + id);
                }

                var allNotes = this.getDocs(id);
                for (var i = 0; i < allNotes.length; i++) {
                    var nid = allNotes[i].id;
                    this.noteStatus(nid, status);
                    this.updatePageNavStatus(nid, status);
                }
                this.storeInDocs(this.allNotes);
                if (roles.hasControls()) {
                    ioAdapter.mustSend({'dts': {docSt: status, doc: id}, 'cf': 'dts'});
                }
            },

            /**
             * TODO, need to improve this funciton
             * related to event.status in page.js
             * around 360
             */
            updatePageNavStatus: function (id, status) {
                var linknote = document.querySelector('#linknotes' + id);
                if (linknote != null) {
                    linknote.dataset.status = status;
                    var childNode = linknote.querySelector('.controls.status');
                    childNode.dataset.status = status;
                    childNode.querySelector('.statusanch').innerHTML = 'status' + status;
                } else {
                    console.log('Document share : there is no element ' + '#linknotes' + id);
                }
            },


            _noteDisable: function (id) {
                this.noteStatus(id);
                this.storeInDocs(this.allNotes);
                this.sendNoteStatus(id)
            },

            _noteEnable: function (id) {
                this.noteStatus(id);
                this.storeInDocs(this.allNotes);
                this.sendNoteStatus(id);
            },

            sendNoteStatus: function (id) {
                if (roles.hasControls()) {
                    var note = document.querySelector("#note" + id);
                    if (note != null) {
                        ioAdapter.mustSend({'dts': {noteSt: note.dataset.status, note: id}, 'cf': 'dts'});
                    } else {
                        console.log('Element is null');
                    }
                }
            },

            /**
             * set the note status, like enable or disable
             * @param id expects note id
             * @param status expect enable or disable
             */
            noteStatus: function (id, status) {
                var note = document.querySelector("#note" + id);
                if (note != null) {
                    if (typeof status == 'undefined') {
                        var status = (1 - (+note.dataset.status));
                    } else {
                        if (status == true || status == 'true') {
                            status = 1;
                        } else {
                            status = 0;
                        }
                    }
                    note.dataset.status = status;
                    var noteObj = this.allNotes[id];
                    noteObj.status = note.dataset.status;
                    this.allNotes[id] = noteObj;
                    // this.storeInDocs(this.allNotes);
                } else {
                    console.log('there is no element #note' + id);
                }
            },

            /**
             * get docs from inline variable
             *   @returns {Array}
             */
            getDocsOld: function (id) {
                var result = [];
                for (var i in this.allNotes) {
                    if (id == this.allNotes[i].lc_content_id) {
                        result.push(this.allNotes[i]);
                    }
                }
                return result;
            },

            // Return the pages from specific page
            getDocs: function (id) {
                console.log("--------------");
                if (this.allDocs != null && typeof this.allDocs[id] == 'object') {
                    return this.allDocs[id].notesarr;
                } else {
                    console.log('There is no document with the id ' + id);
                }
            },

            /**
             * get documenation id from all notes by using note id
             * @param id expectes node
             * @returns {*}
             */
            getDocId: function (id) {
                return id.split('_')[0];
            },

            getAllNotes: function (order) {
                var result = [];
                for (var i = 0; i < order.length; i++) {
                    result.push(this.allNotes[order[i]]);
                }
                return result;
            },

            /**
             * get note object by passing note
             * @param id expects note
             * @returns {note}
             */
            getNote: function (id) {
                return this.allNotes[id];
            },

            updateLinkNotes: function (id) {
                var listnotes = document.querySelector("#listnotes .currentNav");
                if (listnotes != null) {
                    listnotes.classList.remove('currentNav');
                }
                this.setCurrentNav(id);
            },

            setCurrentNav: function (id) {
                var linknotes = document.querySelector('#linknotes' + id);
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
            onAjaxResponse: function (id, xhr, response) {
                if (response.hasOwnProperty('success') && response.success) {
                    for (var i = 0; i < virtualclass.gObj.uploadingFiles.length; i++) {
                        var docUploadId = virtualclass.gObj.uploadingFiles[i].uuid;
                        this.afterUploadFile(docUploadId);
                    }

                    virtualclass.gObj.uploadingFiles = [];
                    this.showUploadMsz(virtualclass.lang.getString('docUploadSuccess'), "alert-success");
                } else if (response.message == 'duplicate') {
                    //alert(virtualclass.lang.getString('duplicateUploadMsg'));
                    this.showUploadMsz(virtualclass.lang.getString('duplicateUploadMsg'), "alert-error");

                } else {
                    if (response.hasOwnProperty('error')) {
                        this.showUploadMsz(response.error, "alert-error");
                    } else {
                        this.showUploadMsz(virtualclass.lang.getString('someproblem'), "alert-error");
                    }
                }

                var msz = document.querySelector("#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list");
                if (msz) {
                    msz.style.display = "none";
                }

                var listnotes = document.querySelector('#listnotes');
                if (listnotes != null) {
                    virtualclass.vutil.makeElementDeactive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                    virtualclass.vutil.makeElementActive('#listnotes');
                } else {
                    console.log('List note is null');
                }
            },

            showUploadMsz: function (msg, type) {
                var mszCont = document.querySelector("#DocumentShareDashboard #docsUploadMsz");

                var alertMsz = document.querySelector("#DocumentShareDashboard #docsUploadMsz .alert");
                if (alertMsz) {
                    alertMsz.parentNode.removeChild(alertMsz);
                }
                var elem = document.createElement("div");
                elem.className = "alert  alert-dismissable";
                elem.classList.add(type)
                elem.innerHTML = msg;
                mszCont.appendChild(elem);

                var btn = document.createElement("button");
                btn.className = "close";
                btn.setAttribute("data-dismiss", "alert")
                btn.innerHTML = "&times";
                elem.appendChild(btn);
                btn.addEventListener('click', function () {
                    this.parentNode.remove();

                })


            },


            /**
             * Set width and height for note
             */
            setNoteDimension: function (width, height, nid) {
                var contElem = document.querySelector('#cont' + nid);
                if (contElem != null) {
                    var noteContainer = contElem.parentNode;
                    var noteId = noteContainer.id;
                    var imageContainer = document.querySelector('#' + noteId + ' .imageContainer img');
                    imageContainer.style.width = width;
                    imageContainer.style.height = height;
                }
                system.setDocCanvasDimension(width, height, nid);

                var notesContainer = document.querySelector('#screen-docs .pageContainer');
                if (roles.hasAdmin()) {
                    // 60 for whiteboard height toolbar
                    height += 60;
                }
                // for note's container height
                if (notesContainer != null) {
                    notesContainer.style.width = width + 'px';
                    notesContainer.style.height = height + 'px';
                }

            },

            isFirstNote: function (id) {
                var firstNote = document.querySelector('#notesContainer .note');
                return (firstNote != null && (id == firstNote.id));
            },

            isLastNote: function (id) {
                var allNotes = document.querySelectorAll('#notesContainer .note');
                var lastNote = allNotes[allNotes.length - 1];
                return (allNotes.length > 0 && (lastNote.id == id));
            },

            noteExist: function () {
                return (document.querySelector('#notesContainer .note') != null);
            },

            docSelected: function () {
                return document.querySelector('#listdocs .linkdocs[data-selected="1"]');
            },

            isUploaderExist: function () {
                var uploadElem = document.querySelector('#docsuploadContainer .qq-uploader-selector');
                return (uploadElem != null);
            },

            // Update in lcoal Storage
            upateInStorage: function () {
                if (virtualclass.hasOwnProperty('dts') && typeof virtualclass.dts.hasOwnProperty('pages')
                    && (typeof virtualclass.dts.pages == 'object')) {
                    var docsObj = {};
                    docsObj.docs = virtualclass.dts.pages;
                    docsObj.order = JSON.stringify(virtualclass.dts.order);
                    docsObj.slideNumber = (virtualclass.dts.order.length > 0) ? virtualclass.dts.docs.note.currNote : null;
                    localStorage.setItem('dtsdocs', JSON.stringify(docsObj));
                }
            }
        };
    }
    window.documentShare = documentShare;
})(window);
