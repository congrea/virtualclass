// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2017  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This file is responsible for sharing the document, it responsible for
 * upload the docs, re-arrangement, disable and delete sending doc to the server and receiving from server
 * It display the docs from localstorage if exist otherwise request the docs to the server
 */

(function(window) {
    var firstTime = true;
    var  io = window.io;
    var documentShare = function() {
        return {
            allPages : null,
            allNotes : null, // this contains all notes received from server
            allDocs : null, // This contains all docs received from server
            notes : null,
            order : [],
            tempFolder : "documentSharing",
            
            init: function(docsObj) {
                this.firstRequest = false;
                firstTime = true;
              
                if(virtualclass.gObj.hasOwnProperty('dstAll') &&  typeof virtualclass.gObj.dstAll == 'string'){
                    this.storageRawData = null;
                }else {
                    this.storageRawData = (typeof virtualclass.gObj.dstAll == 'object') ? virtualclass.gObj.dstAll : null;
                } 
                
                /*
                if(virtualclass.gObj.hasOwnProperty('dstAll')){
                    if(typeof virtualclass.gObj.dstAll == 'string'){
                       this.storageRawData = null; 
                    }else if((typeof virtualclass.gObj.dstAll == 'object')){
                        this.storageRawData =  virtualclass.gObj.dstAll;
                    }
                } else {
                    var that = this;
                    setTimeout(
                        function (){
                           that.init(docsObj) 
                        },100
                    )
                    return;
                } */
                
                if(virtualclass.gObj.hasOwnProperty('docs') &&  typeof virtualclass.gObj.docs == 'string'){
                    this.documents = null;
                }else {
                    this.documents = (typeof virtualclass.gObj.docs == 'object') ? virtualclass.gObj.docs : null;
                }
                


                this.UI.container();

             //   var elem = document.getElementById('docScreenContainer');
                //nirmala
                // if(roles.hasControls()){
                //   virtualclass.vutil.attachEventToUploadTab('docs', ["dtsPopupContainer"], virtualclass.vutil.modalPopup);
                // }

                this.pages = {};
                this.notes = {};
                if(this.documents != null){
                    //this.allPages = this.documents;
                    this.allNotes = this.documents;
                }   

                // if(virtualclass.serverData.rawData.docs.length > 0){
                //     this.rawToProperData(virtualclass.serverData.rawData.docs);
                // }

                this.initAfterUpload(docsObj);
                if (roles.hasControls()) {
                    if(typeof docsObj == 'undefined'){
                        ioAdapter.mustSend({'dts': {init: 'studentlayout'}, 'cf': 'dts'});
                        console.log(virtualclass.gObj.currWb + ' ' + 'Document share Teacher layout ');
                    }
                    // this.UI.attachDocsNav();
                } else {
                    // if user is student
                    var docScreenContainer = document.getElementById('docScreenContainer');
                    if(docScreenContainer != null){
                        var studentMsg = document.querySelector('#docMsgStudent');
                        if(studentMsg == null){
                            var docMsg  = document.createElement('span');
                            docMsg.id = "docMsgStudent";
                            docMsg.innerHTML = "There might be share the Docs";
                            docScreenContainer.appendChild(docMsg);
                        }
                    } else {
                        alert("Container is null");
                    }
                }
                
              
                if(typeof docsObj != 'undefined' ){
                    if(docsObj.init != 'layout' && docsObj.init != 'studentlayout'){
                        if(this.storageRawData != null){
                            this.rawToProperData(this.storageRawData);
                        }
                        // docsObj.init = layout means first layout
                        this.setNoteScreen(docsObj);
                    }
                } else {
                      // Check if there is already docs in local storage
                      var docsObj = JSON.parse(localStorage.getItem('dtsdocs'));
                      if(docsObj != null){
                        if(this.storageRawData != null){
                            this.rawToProperData(this.storageRawData);
                        }
                        this.initAfterUpload(docsObj);
                 //       this.allDocs = docsObj.docs;
                 
                        if(docsObj.slideNumber != null){
                            this.setNoteScreen(docsObj);
                            docsObj.slideNumber = null;
                            localStorage.setItem('dtsdocs', JSON.stringify(docsObj));
                        }
                      } else if(this.allDocs != null && Object.keys(this.allDocs).length > 0){
                            console.log('Do nothing');
                            this.afterFirstRequestDocs(this.allDocs, true);
                      } else {
                            // Only send the request to server
                            // when the docs is not in storage
                            if(roles.hasControls()){
                              this.firstRequestDocs();
                              this.firstRequest = true;
                            }
                      }
                }
            },

           /**
           * This function initiate the docs order
           * and the function which should be performed
           * after uploading the docs
           */
            initAfterUpload : function (docsObj){
                if(typeof docsObj != 'undefined'){
                  for(var key in docsObj.docs) {
                    this.afterUploadFile(docsObj.docs[key].rid, 'fromReload',  docsObj);
                  }

                  if(docsObj.hasOwnProperty('order')){
                    this.order = JSON.parse(docsObj.order);
                  }
                }
            },

          /**
           * This function displays the current note on screen
           * and highlight the naviation of that screen
           */
          setNoteScreen : function (docsObj){
            var doc = this.getDocId(docsObj.slideNumber);
            this.docs.executeScreen(doc, 'fromreload', undefined, docsObj.slideNumber);
            this.setScreenByOrder(doc);
          },

            /**
             * This display the notes acorrding to order
             * Whatever the order will be on this.order,
             * there will be dislay the notes according to this
             */
            setScreenByOrder : function (currDoc){
                if(this.order != null && this.order.length > 0){
                    var allNotes = this.getAllNotes(this.order);
                    // TODO this should be improve
                    for(var i =0; i<allNotes.length; i++){
                        this.setLinkSelected(allNotes[i].lc_content_id, 1);
                    }

                    // remove if there is already pages before render the ordering elements
                    var alreadyElements = document.querySelectorAll('#notesContainer .note');
                    this.createNoteLayout(allNotes, currDoc);
                    this.reArrangeNotes(this.order);

                    // TODO This should be improve at later, should handle at function createNoteNav
                    for(var i=0; i<this.order.length; i++){
                        this.noteStatus(this.order[i], this.allNotes[this.order[i]].status);
                    }
                }
            },

            createNoteLayout : function (allNotes, currDoc){
              var mainContainer, tempCont, objTemp, template, tempHtml;
              if(allNotes.length > 0){
                var pageContainer = document.querySelector('#screen-docs .pageContainer');
                //this.UI.createSlides(pageContainer, allNotes);
                if(pageContainer == null){
                  var tempCont = {notes : allNotes, hasControls : roles.hasControls(), cd : currDoc};
                  template =  'screen';
                  mainContainer = document.querySelector('#docScreenContainer');


                }else{
                  tempCont = {notes :  allNotes};
                  template = 'notesMain';
                  mainContainer =  document.querySelector('#screen-docs #notesContainer');
                }

                template =  virtualclass.getTemplate(template, 'documentSharing');
                tempHtml = template(tempCont);

                if(mainContainer != null){
                  mainContainer.insertAdjacentHTML('beforeend', tempHtml);
                }else{
                  alert('there is no such element');
                }
              }
            },

            /**
             * This function is trigger after upload the doc,
             * create the intance of page/navigation from this page
             */
            afterUploadFile : function (doc, fromReload, docObj){
                var cthis = this;
                // need to get all images from here
                if(typeof docObj != 'undefined'){
                    var status = docObj.docs['docs'+doc].status;
                }else{
                    var status = 1;
                }

                if(typeof fromReload == 'undefined' && roles.hasControls()){
                    
                    this.requestDocs(doc);
                } else {
                    var docId = 'docs' + doc;
                    if(typeof this.pages[docId] != 'object'){
                        this.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
                        if(typeof docObj != 'undefined'){
                            var title = docObj.docs[docId].title;
                        }else {
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
            initDocs  : function (id){
                if(typeof this.pages[id] != 'object'){
                    var status = 0;
                    if(this.allDocs[id].status == 'true' ||  this.allDocs[id].status == 1){
                        status = 1;
                    }
                    var docId = 'docs' + id;
                    this.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
                    // this.pages[docId].init(id, this.allDocs[id].title);
                    this.pages[docId].init(id, this.allDocs[id].filename);
                }
            },

            /**
             * We don't nee to update fetch the all docs according the length but
             * we have to fetch that only once
             *
             */
            // firstRequestDocs : function (){
            //     var cthis = this;
            //     var data = {live_class_id : virtualclass.gObj.congCourse, type : 1, user : virtualclass.gObj.uid};
            //     virtualclass.vutil.xhrSendWithForm(data, 'retrieve_docs', function (response){
            //             response = JSON.parse(response);
            //             if(((+response.status))){
            //                 cthis.afterFirstRequestDocs(response.resultdata.NOTES);
            //                 ioAdapter.mustSend({'dts': {fallDocs: response.resultdata.NOTES},  'cf': 'dts'});
            //                 cthis.firstRequestNotes();
            //             } else if(response.message == "Failed" && (+response.status) == 0){ //there is no document, so let user upload the documents
            //                 virtualclass.vutil.modalPopup('docs', ["dtsPopupContainer"]);
            //             }
            //         }
            //     );
            // },

            firstRequestDocs : function (){
                // if(virtualclass.serverData.rawData.docs.length > 0){
                //     this.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
                //     this.allNotes = this.fetchAllNotes();
                // }else {
                //     var that = this;
                //     virtualclass.serverData.fetchAllData(function (){
                //         that.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
                //         that.allNotes = that.fetchAllNotes();
                //     });
                // }

                var that = this;
                virtualclass.serverData.fetchAllData(function (){
                    ioAdapter.mustSend({'dts': {fallDocs: virtualclass.serverData.rawData.docs}, 'cf': 'dts'});
                    that.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
                    // that.allNotes = that.fetchAllNotes();
                });
            },
            
            fetchAllNotes : function (){
                var allNotes = {};
                for(var key in virtualclass.dts.allDocs){
                    for(var j=0; j< virtualclass.dts.allDocs[key].notesarr.length; j++){
                        allNotes[virtualclass.dts.allDocs[key].notesarr[j].id] = virtualclass.dts.allDocs[key].notesarr[j];
                    }
                   
                }
                return allNotes;
            },

            fetchAllNotesAsArr : function (){
                var allNotes = [];
                for(var key in virtualclass.dts.allDocs){
                    for(var j=0; j< virtualclass.dts.allDocs[key].notesarr.length; j++){
                        allNotes.push(virtualclass.dts.allDocs[key].notesarr[j]) ;
                    }

                }
                return allNotes;
            },

            // requestDocs

            afterFirstRequestDocs2 : function (docs, notconvert){
                if(typeof notconvert == 'undefined'){
                    this.allDocsTemp = docs;
                    this.allDocs = this.convertInObjects(this.allDocsTemp);
                }

                for(var key in this.allDocs){
                    if(!this.allDocs[key].hasOwnProperty('deleted')){
                        this.initDocs(this.allDocs[key].fileuuid);
                    }
                }

                this.allNotes = this.fetchAllNotes();
            },


            afterFirstRequestDocs : function (docs, notconvert){
                // if(typeof notconvert == 'undefined'){
                //     this.allDocsTemp = docs;
                //     this.allDocs = this.convertInObjects(this.allDocsTemp);
                // }
                //
                // this.allNotes = this.fetchAllNotes();

                this.rawToProperData(docs);
                // virtualclass.
                // virtualclass.dts
                virtualclass.storage.dstAllStore(docs);
                for(var key in this.allDocs){
                    if(!this.allDocs[key].hasOwnProperty('deleted')){
                        this.initDocs(this.allDocs[key].fileuuid);
                    }
                }
            },

            rawToProperData : function (docs){
                if(typeof notconvert == 'undefined'){
                    this.allDocsTemp = docs;
                    this.allDocs = this.convertInObjects(this.allDocsTemp);
                }

                this.allNotes = this.fetchAllNotes();
            },


            /**
             * This would be performed after got
             * the request
             * @param docs expects documenation list that have been
             * received from LMS and localstorage
             */
            // afterFirstRequestDocsOld : function (docs, notconvert){
            //     if(typeof notconvert == 'undefined'){
            //         this.allDocsTemp = docs;
            //         this.allDocs = this.convertInObjects(this.allDocsTemp);
            //     }
            //
            //     for(var key in this.allDocs){
            //         this.initDocs(this.allDocs[key].id);
            //     }
            // },

            afterRequestOrder : function (content){
                this.order.length = 0;
                this.order = content.split(',');
                var docId = 'docs' + this.getDocId(this.order[0]);
                // var mainCont = this.pages[docId].UI.mainView.call(this.pages[docId]);
                console.log('From database doc share order ' + this.order.join(','));
                this.setScreenByOrder(docId);
                this.docs.currNote = this.order[0];
                this.docs.displayScreen(docId, this.order[0]);
            },

            /**
             * this requests the order from LMS
             */
            requestOrder : function (cb){
                var data = {
                    "live_class_id" : virtualclass.gObj.congCourse,
                    "content_order_type" : 1
                };
                var cthis = this;
                virtualclass.vutil.xhrSendWithForm(data, 'congrea_retrieve_page_order', function (response){
                        cb.apply(cthis, [response]);
                    }
                );
            },

            executeOrder : function (response){
                var cthis = this;
                var content = JSON.parse(response);
                if (content.message == "Failed") {
                    console.log("page order retrieve failed");
                    $('#congdashboard').modal();
                    virtualclass.dashBoard.clickCloseButton();

                } else if(content) {
                    ioAdapter.mustSend({'dts': {order_recived: content},  'cf': 'dts'});
                    cthis.afterRequestOrder(content);
                    cthis.createNoteNav();
                }
            },

            /**
             * this requests documentation lists from LMS
             */
            // requestDocs : function (doc){
            //         var cthis = this;
            //         var data = {live_class_id : virtualclass.gObj.congCourse, type : 1, user : virtualclass.gObj.uid};
            //         virtualclass.vutil.xhrSendWithForm(data, 'retrieve_docs', function (response){
            //             response = JSON.parse(response);
            //             if(((+response.status))){
            //                 cthis.allDocsTemp = response.resultdata.NOTES;
            //                 cthis.allDocs = cthis.convertInObjects(cthis.allDocsTemp);
            //
            //                 var status = 0;
            //                 if(cthis.allDocs[doc].status == 'true' ||  cthis.allDocs[doc].status == 1){
            //                      status = 1;
            //                 }
            //
            //                 var docId = 'docs' + doc;
            //                 if(typeof cthis.pages[docId] != 'object'){
            //                     cthis.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
            //                     cthis.pages[docId].init(doc, cthis.allDocs[doc].title);
            //                 }
            //                 ioAdapter.mustSend({'dts': {allDocs: cthis.allDocs, doc:doc},  'cf': 'dts'});
            //
            //                     cthis.requestNotes(doc);
            //             }
            //         }
            //     );
            // },

            getFilenameFromUploadingfiles : function (doc){
                for(var i=0; i<virtualclass.gObj.uploadingFiles.length; i++){
                    return virtualclass.gObj.uploadingFiles[i].name;
                }
            },

            requestDocs : function (doc){
                var cthis = this;
                var newDocObj = {
                    filename : this.getFilenameFromUploadingfiles(doc),
                    fileuuid : doc,
                    filepath : "somewhere",
                    filetype : "doc",
                    key_room : virtualclass.gObj.sessionInfo.key + '_' + virtualclass.gObj.sessionInfo.room,
                    status : 1
                };

                // cthis.allDocsTemp = response.resultdata.NOTES;
                // cthis.allDocs = cthis.convertInObjects(cthis.allDocsTemp);
                
                cthis.allDocs[doc] = newDocObj;

                var status = 0;
                if(cthis.allDocs[doc].status == 'true' ||  cthis.allDocs[doc].status == 1){
                    status = 1;
                }

                var docId = 'docs' + doc;
                if(typeof cthis.pages[docId] != 'object'){
                    cthis.pages[docId] = new virtualclass.page('docScreenContainer', 'docs', 'virtualclassDocumentShare', 'dts', status);
                    cthis.pages[docId].init(doc, cthis.allDocs[doc].filename);
                    if(!cthis.allDocs[doc].hasOwnProperty('notes')){
                        var element = document.querySelector('#linkdocs' + doc);
                        element.classList.add('noDocs');
                    }
                }
                ioAdapter.mustSend({'dts': {allDocs: cthis.allDocs, doc:doc},  'cf': 'dts'});
                // here should be the polling
                // cthis.requestNotes(doc);
                virtualclass.serverData.pollingStatus(virtualclass.dts.afterRequestNotes);


            },

            // Earlier it was requestNotes,

            afterRequestNotes :function (){
                var cthis = virtualclass.dts;
                virtualclass.dts.afterFirstRequestDocs(virtualclass.serverData.rawData.docs);
                ioAdapter.mustSend({'dts': {fallDocs: virtualclass.serverData.rawData.docs}, 'cf': 'dts'});

                cthis.removeNoDocsElem();
                cthis.allPages = virtualclass.dts.fetchAllNotesAsArr();
                cthis.allNotes = virtualclass.dts.fetchAllNotes();
                cthis.storeInDocs(cthis.allNotes);
                cthis.dstAllStore(virtualclass.serverData.rawData.docs);
                // TODO, by disabling this can be critical, new api
                // ioAdapter.mustSend({'dts': {allNotes: cthis.allNotes, doc:doc},  'cf': 'dts'});
                ioAdapter.mustSend({'dts': {allNotes: cthis.allNotes}, 'cf': 'dts'});
            },

            removeNoDocsElem : function (){
                var allNoDocsElem = document.querySelectorAll('.noDocs');
                for(var i=0; i<allNoDocsElem.length; i++){
                    allNoDocsElem[i].classList.remove('noDocs');
                }
            },

            /**
             * this requests all notes from LMS
             */
            requestNotes : function (doc){
                var cthis = this;
                var data = { live_class_id : virtualclass.gObj.congCourse, 'notes_id' : 'all', user : virtualclass.gObj.uid};
                virtualclass.vutil.xhrSendWithForm(data, 'retrieve_all_notes',  function (response){
                        response = JSON.parse(response);
                        if((+response.status)){
                           cthis.allPages = response.resultdata;
                           cthis.allNotes = cthis.convertInObjects(cthis.allPages);
                           cthis.storeInDocs(cthis.allNotes)
                           ioAdapter.mustSend({'dts': {allNotes: cthis.allNotes, doc:doc},  'cf': 'dts'});
                       }
                    }
                );
            },

            firstRequestNotes : function (){
                var cthis = this;
                var data = { live_class_id : virtualclass.gObj.congCourse, 'notes_id' : 'all', user : virtualclass.gObj.uid};
                virtualclass.vutil.xhrSendWithForm(data, 'retrieve_all_notes',  function (response){
                        response = JSON.parse(response);
                      //  if((+response.status)){
                           cthis.allPages = response.resultdata;
                           cthis.allNotes = cthis.convertInObjects(cthis.allPages);
                           cthis.storeInDocs(cthis.allNotes)
                           ioAdapter.mustSend({'dts': {fallNotes: cthis.allNotes},  'cf': 'dts'});
                           // cthis.firstRequestDocs();
                           cthis.requestOrder(cthis.executeOrder);
                       //}
                    }
                );
            },

            requestSlidesOld : function (filepath){
                var filepath = parseInt(filepath, 10);
                var cthis = this;
                console.log(virtualclass.gObj.currWb + ' ' + 'document share : request ' + filepath);

                var relativeDocs =  this.getDocs(filepath);

                var dsStatus = document.querySelector('#linkdocs'+filepath).dataset.selected;
                ioAdapter.mustSend({'dts': {dres: filepath, 'ds' : (1-(+dsStatus)) },  'cf': 'dts' });
                return relativeDocs;
            },

            requestSlides : function (filepath){
                var cthis = this;
                console.log(virtualclass.gObj.currWb + ' ' + 'document share : request ' + filepath);

                var relativeDocs =  this.getDocs(filepath);

                var dsStatus = document.querySelector('#linkdocs'+filepath).dataset.selected;
                ioAdapter.mustSend({'dts': {dres: filepath, 'ds' : (1-(+dsStatus)) },  'cf': 'dts' });
                return relativeDocs;
            },

            /**
             * This store all the notes/pages/slides in browser indexdb storage
             * @param allPages exepects all notes
             */
            storeInDocs : function (allPages){
                virtualclass.storage.dstStore(JSON.stringify(allPages));
            },

            removeWhiteboardFromStorage : function (key){
                virtualclass.storage.wbDataRemove(key);
            },

            getNotesOld : function (id){
                var notes = [];
                for(var i in this.allNotes){
                    if(this.allNotes[i].lc_content_id == id){
                        notes.push(this.allNotes[i]);
                    }
                }
                return notes;
            },

            getNotes : function (id){
                return this.allDocs[id].notesarr;
            },

            removePagesUI : function (doc){
                var notes = this.getNotes(doc);
                for(var i=0; i<notes.length; i++){
                    this._removePageUI(notes[i].id);
                }
                if(this.order.length <= 0){
                    firstTime = true;
                }
             },

            _removePageUI : function (noteId, typeDoc){
                var orderId =  this.order.indexOf(noteId);
                if (orderId >= 0) {
                    this.order.splice( orderId, 1);
                }
                var note = document.querySelector('#notesContainer #note' + noteId);
                if(note != null){
                    note.parentNode.removeChild(note);
                }

                if(typeof virtualclass.wb['_doc_' + noteId+'_'+noteId] == 'object'){
                    // delete whiteboard object
                    delete virtualclass.wb['_doc_' + noteId +'_'+noteId];
                }
                this.removeNoteNav(noteId);

                if(roles.hasControls() && typeof (typeDoc != 'undefined' && typeDoc == 'hosts')){
                    // this.selectFirstNote();
                }
                this.reaArrangeThumbCount();
            },

            addPages : function (slides){
                var j = 0;
                while(j < slides.length){
                    if(!slides[j].hasOwnProperty('deletedn')){
                        if(this.order != null){
                            if(this.order.indexOf(slides[j].id) <= -1){
                                this.order.push(slides[j].id);
                            }
                        }
                    }
                    j++;
                }
            },

            toggleSlideWithOrder : function (doc, slides){
                var linkDoc = document.querySelector("#linkdocs"+doc);
                if(linkDoc != null){
                    if(linkDoc.dataset.selected == 1){
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

            setLinkSelected : function (doc, val){
                var linkDoc = document.querySelector("#linkdocs"+doc);
                if(linkDoc != null){
                    linkDoc.dataset.selected = val;
                }
            },

          onResponseFiles : function (doc, slides, docFetch, slide, fromReload){
            if(firstTime){
             // this.docs.currNote = (typeof slide != 'undefined') ? slide : slides[0].id; // first id if order is not defined
              this.docs.currNote = (typeof slide != 'undefined') ? slide : slides[0].id;; // first id if order is not defined
              // this.order = [];
              firstTime = false;
            }

            if(roles.hasControls()){
              var addSlide = this.toggleSlideWithOrder(doc, slides)
            } else {
              var addSlide = (typeof docFetch != 'undefined') ? (+docFetch) : true;
            }

            //var addSlide = this.toggleSlideWithOrder(doc, slides);
            if(addSlide){
              this.addPages(slides);

              var cthis = this;
              if(typeof doc != 'string'){
                var docId = 'docs'+doc;
              } else {
                if(doc.indexOf('docs') >= 0){
                  var docId = doc;
                }else{
                  var docId = 'docs'+doc;
                }
              }

               this.createNoteLayout(slides, docId);

                if(typeof slide != 'undefined'){
                  this.docs.displayScreen(docId, slide);
                }else{
                  this.docs.displayScreen(docId);
                }


              (typeof fromReload != 'undefined') ? this.createNoteNav(fromReload) : this.createNoteNav();
              this.updateLinkNotes(this.docs.currNote);
              virtualclass.vutil.hideUploadMsg('docsuploadContainer'); // file uploader container
            } else {
              this.removePagesUI(doc);
              if(!virtualclass.dts.noteExist()){
                  virtualclass.vutil.showUploadMsg('docsuploadContainer'); // file uploader container
              }

              if(!virtualclass.dts.docSelected()){
                  var docsObj = JSON.parse(localStorage.getItem('dtsdocs'));
                  if(docsObj != null){
                      docsObj.slideNumber = null;
                      localStorage.setItem('dtsdocs', JSON.stringify(docsObj));
                  }
              }
            }

            if(roles.hasAdmin()){
              this.sendOrder(this.order);
              console.log('Document share:- ' + this.order.toString());
            }
          },

          selectFirstNote : function (){
                var currenElement = document.querySelector('#notesContainer .current');
                if(currenElement == null){
                    var firstElement = document.querySelector('#notesContainer .note');
                    if(firstElement != null){
                        this.docs.currNote = firstElement.dataset.slide;
                        this.docs.currDoc = this.getDocId(firstElement.dataset.slide);
                        this.docs.note.getScreen(firstElement);
                    }
                }
            },

            isDocumentExist : function (docsObj){
                if(typeof docsObj != 'undefined'){
                    if(docsObj.init != 'layout' && docsObj.init != 'studentlayout'){
                        return true;
                    } else {
                        return false;
                    }
                }
            },

            isDocAlreadyExist : function (id){
                for(var i=0; i<this.documents.length; i++){
                     if(this.documents[i].id == id){
                         return true;
                     }
                }
                return false;
            },

            UI : {
                id: 'virtualclassDocumentShare',
                class: 'virtualclass container',

                /*
                 * Creates container for the video and appends the container before audio widget
                 */
                container : function () {
                    var docShareCont = document.getElementById(this.id);
                    if(docShareCont == null){
                        var control= roles.hasAdmin()?true:false;
                        var data ={"control":control};
                        var template = virtualclass.getTemplate('docsMain', 'documentSharing');
                        $('#virtualclassAppLeftPanel').append(template(data));

                        if(document.querySelector('#congdashboard') ==  null){
                            // Creating Document Dashboard Container
                            var dashboardTemp = virtualclass.getTemplate('dashboard');
                            var dbHtml = dashboardTemp({app:"DocumentShare"});
                            document.querySelector('#dashboardContainer').innerHTML = dbHtml;
                        }
                    }

                    if(document.querySelector('#DocumentShareDashboard') == null){
                        var elem = document.createElement("div");
                        var cont = document.querySelector('#congdashboard .modal-body')
                        cont.appendChild(elem);
                        elem.id ='DocumentShareDashboard'
                    }

                    if(document.querySelector('.docsDbCont') == null) {
                        // Creating  DOC's Dashboard
                        document.querySelector('#DocumentShareDashboard').innerHTML = virtualclass.vutil.getDocsDashBoard("DocumentShare");
                        if(roles.hasControls()){
                            virtualclass.vutil.attachEventToUploadTab();
                            virtualclass.vutil.modalPopup('docs', ["docsuploadContainer"]);
                        }
                    }
                },

                createMainContent : function (container, content, docId){
                    // this.createSlides(container, content);
                },

                createSlides : function (pageContainer, allNotes){
                    var notes = document.querySelector('#notesContainer');
                    if(notes == null){
                        notes = document.createElement('div');
                        notes.className = 'notes';
                        notes.id = 'notesContainer';
                    }

                    var cthis = virtualclass.dts;
                    for(var i=0; i<allNotes.length; i++) {
                        var noteId = 'note' + allNotes[i].id;
                        if(document.querySelector('#note'+allNotes[i].id) ==  null){
                            var note = document.createElement('div');
                            note.id = 'note' + allNotes[i].id;
                            note.className = 'note';
                            note.dataset.slide = allNotes[i].id;

                            if(note.dataset.statuS == 'true' || note.dataset.statuS == true){
                                note.dataset.status = 1;
                            } else if (note.dataset.status == 'false' || note.dataset.status == false) {
                                note.dataset.status = 0;
                            }else{
                                note.dataset.status = allNotes[i].status;
                            }

                            // var imgContainer = document.createElement('div');
                            //     imgContainer.className = 'imageContainer';
                            // var img = document.createElement('img');
                            // img.src = allNotes[i].content_path;
                            // imgContainer.appendChild(img);
                            // note.appendChild(imgContainer);
                            // notes.appendChild(note);
                        }
                    }

                    pageContainer.appendChild(notes);
                    if(roles.hasControls()){
                        this.createNavigation(pageContainer, "prev");
                        this.createNavigation(pageContainer, "next");
                    }
                },

                createNavigation : function (pageContainer, cmd){
                    if(document.querySelector('#docs'+cmd) == null){
                        var nav = document.createElement('span');
                        nav.className = 'nvgt' + ' ' + cmd ;
                        nav.id = 'docs'+cmd;
                        pageContainer.appendChild(nav);
                    }
                },

                createDocsNav : function (elem, docId){
                    // Please put below comment into console to create dummy
                    // var docScreenContainer = document.getElementById('docScreenContainer');
                    // virtualclass.dts.UI.createDocsNav(docScreenContainer, 1);

                    //var docScreenContainer = document.getElementById('docScreenContainer');
                    //virtualclass.dts.UI.createDocsNav(docScreenContainer, 2);

                    var docNav  = document.getElementById('listDocs');
                    if(docNav == null){
                        var cthis = virtualclass.dts;
                        docNav = document.createElement('div');
                        docNav.id = 'listDocs';
                        elem.appendChild(docNav);
                    }

                    var linkNav = this.createDocsNavLink(docId);
                    this.attachDocsNav(linkNav, docId);
                    docNav.appendChild(linkNav);
                },

                createDocsNavLink : function (sn){
                    var link = document.createElement('div');
                    link.id = "link" + sn;
                    link.className = 'linkdoc';
                    link.innerHTML  = sn;
                    link.dataset.screen = sn;
                    return link;
                },

                attachDocsNav : function  (linkNav, docId){
                    var cthis = virtualclass.dts;
                    linkNav.onclick = cthis.docs.goToDocs(docId);
                }
            },

            createNoteNav : function (fromReload){
                // need to get all images from here
                for(var i=0; i<this.order.length; i++){
                    if(typeof this.notes[this.order[i]] != 'object'){

                        if(this.allNotes[this.order[i]].status == 'true' || (+this.allNotes[this.order[i]].status) == 1){
                           var status = 1;
                        }else {
                            var status = 0;
                        }
                        this.notes[this.order[i]] = new virtualclass.page('screen-docs', 'notes', 'virtualclassDocumentShare', 'dts', status);
                        this.notes[this.order[i]].init(this.order[i], 'note_'+ this.allNotes[this.order[i]].lc_content_id + '_' + this.order[i]);
                        if(typeof fromReload == 'undefined'){
                            this.noteStatus(this.order[i], status);
                        }
                    }
                }
            },

            createNoteNavAlt : function (fromReload){
                // need to get all images from here
                for(var i=0; i<this.order.length; i++){

                    if(this.allNotes[this.order[i]].status == 'true' || (+this.allNotes[this.order[i]].status) == 1){
                        var status = 1;
                    }else {
                        var status = 0;
                    }
                    this.notes[this.order[i]] = new virtualclass.page('screen-docs', 'notes', 'virtualclassDocumentShare', 'dts', status);
                    this.notes[this.order[i]].init(this.order[i], 'note_'+ this.allNotes[this.order[i]].lc_content_id + '_' + this.order[i]);
                    if(typeof fromReload == 'undefined'){
                        this.noteStatus(this.order[i], status);
                    }

                }
            },

            removeNoteNav : function (note){
                var linknote = document.querySelector("#linknotes" + note);
                if(linknote != null){
                    linknote.parentNode.removeChild(linknote);
                }

                if(typeof this.notes[note] == 'object'){
                    delete this.notes[note];
                }
            },

            docs : {
                num : 0,
                currNote : 0,

                // Get the passed slide or first slide
                curr : function (sn, slide){

                    this.currDoc = sn;
                    var cthis = virtualclass.dts;
                    virtualclass.dts.docs.num = sn;

                    var prev = document.querySelector('#documentScreen .screen.current');
                    if(prev != null){
                        prev.classList.remove('current');
                    }

                    var screen = document.querySelector('#screen-docs');
                    screen.classList.add('current');

                    var docContainer = document.querySelector('#documentScreen');
                    docContainer.dataset.screen = sn;

                    if(typeof slide != 'undefined'){
                        this.note = new this.slide(slide);
                    }else{
                        this.note = new this.slide();
                    }

                    this.note.init();
                    this.note.currentSlide(this.currNote);
                },

                display : function (selector){
                    document.querySelector(selector).style.display = 'block';
                },

                hide : function (selector){
                    document.querySelector(selector).style.display = 'none';
                },

                goToDocs : function (doc){
                    var cthis = this;
                    return function (){
                        if(typeof virtualclass.dts.docs.note == 'object'){
                            virtualclass.vutil.updateCurrentDoc(doc, virtualclass.dts.docs.note.currNote);
                        }
                        cthis.executeScreen(doc);
                    }
                },

                /**
                 *
                 * @param note expects the note which would be displayed into current view
                 *
                 */
                goToNavs : function (note){
                    var cthis = this;
                    return function (){
                        var element = document.querySelector("#linknotes" + note);
                        if(element != null){
                            if((+element.dataset.status) == 1){
                                cthis.currNote = note;
                                cthis.note.currentSlide(note);
                            }
                        } else {
                            cthis.currNote = note;
                            cthis.note.currentSlide(note);
                        }
                    }
                },

                studentExecuteScreen : function (data){
                    var filePath = data.dres;
                    this.currDoc = filePath;
                    var relativeDocs =  virtualclass.dts.getDocs(filePath);
                    virtualclass.dts.onResponseFiles(filePath, relativeDocs, data.ds);
                    // TODO, disabling following can be critical, with new api
                    // virtualclass.vutil.updateCurrentDoc(this.currDoc, 1);
                },

                /**
                 * If doc is already not exist, it does request to server
                 * and create doc with whiteboard and slide
                 *
                 */

                executeScreen : function (doc, fromReload, cb, slide){
                    this.currDoc = doc;
                    var cthis = virtualclass.dts;
                    if(roles.hasControls() && typeof fromReload == 'undefined') {
                        var notes = cthis.requestSlides(doc);
                        cthis.onResponseFiles(doc, notes);
                        if(typeof cb != 'undefined'){ cb(); }

                    } else if(typeof slide != undefined){
                        // this should be removed
                        if(typeof doc == 'string' && doc.indexOf('docs') > -1){
                            doc = doc.split('docs')[1];
                        }
                        var slides = cthis.getDocs(doc);
                        if(typeof fromReload == 'undefined'){
                            cthis.onResponseFiles(doc, slides, undefined, slide);
                        } else {
                            cthis.onResponseFiles(doc, slides, undefined, slide, 'fromReload');
                        }

                        if(typeof cb != 'undefined'){ cb();}
                    }

                },

                displayScreen : function (screen, slide){
                    if(typeof slide != 'undefined'){
                        this.curr(screen, slide);
                    } else {
                        this.curr(screen);
                    }
                },

                /**
                 * Create whitebaord/annoation tool for each slide/note
                 * @param slide expects the slide
                 */
                createWhiteboard : function (slide){
                    var cthis = virtualclass.dts;
                    var wbid = '_doc_'+slide+'_'+slide;

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

                    var query = ".note[data-slide='"+slide+"']";
                    var elem = document.querySelector(query);
                    if(elem != null){
                        elem.insertBefore(whiteboard, elem.firstChild);

                        virtualclass.vutil.createWhiteBoard(whiteboard.dataset.wid);
                        // var app = 'Whiteboard';
                        // var args = [app, 'byclick', whiteboard.dataset.wid, whiteboard.id];
                        // virtualclass.appInitiator['Whiteboard'].apply(virtualclass, Array.prototype.slice.call(args));
                        // var measureRes = virtualclass.system.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});
                        //
                        // var id = virtualclass.gObj.currWb;
                        // virtualclass.system.setCanvasWrapperDimension(measureRes, id);


                        // cthis.setNoteDimension(canvasWidth, canvasHeight, wbid);
                    } else {
                        console.log("Element is null");

                    }
                    virtualclass.previous = virtualclass.dtsConfig.id;
                },

                /**
                 *
                 * @param slide represents the slide/note
                 *
                 */
                slide : function (slide){
                    return {
                        li_items : 0,
                        imageNumber: 0,
                        currSlide : (typeof slide != 'undefined') ? slide : 0, // TODO this should be removed
                        currNote : (typeof slide != 'undefined') ? slide : 0,
                        doc : 1,
                        init : function (screen){
                            var cthis  = virtualclass.dts;
                            var screen = '#screen-docs' ;

                            var docScreen = document.querySelector(screen + ' .notes');

                            this.doc = cthis.docs.num;

                            if(docScreen != null){

                                this.li_items = docScreen.children;
                                this.imageNumber = this.li_items.length;

                                if(roles.hasControls()){
                                    var prev = document.querySelector(screen + " .prev");
                                    var next = document.querySelector(screen + " .next");

                                    var dthis = this;

                                    prev.onclick = function(){ dthis.prevSlide(cthis);};
                                    next.onclick = function(){ dthis.nextSlide(cthis);};
                                }

                            } else {
                                alert("no element");
                            }

                        },

                        slideTo : function (note, fromReload){
                            var noteId = note.dataset.slide;
                            virtualclass.vutil.updateCurrentDoc(noteId);

                            var slideNum = slideNum;

                            this.displaySlide(note);

                            if(roles.hasControls() && typeof fromReload == 'undefined'){
                                ioAdapter.mustSend({'dts': {slideTo: noteId, docn:virtualclass.dts.docs.currDoc}, 'cf': 'dts'});
                            }

                        },

                        /**
                         * display the passed slide/note
                         * Expects the note that has to be display
                         */
                        displaySlide : function(note){
                            //TODO this should be used by cthis/this
                            var cthis  = virtualclass.dts;
                            //var currElem = document.querySelector('div[data-slide="'+slide+'"]');
                            var prevElem = document.querySelector('#screen-docs .note.current');
                            if(prevElem != null){
                                prevElem.classList.remove('current');
                            }

                            if(note != null ){
                                note.classList.add('current');
                            }

                        },

                        /**
                         * display the previous slide/note
                         * cthis expects main class virtuaclass.dts
                         */
                        prevSlide : function (cthis){
                            var currNodeId = cthis.docs.currNote;
                            var currElem = document.querySelector('#documentScreen #note' + currNodeId);
                            if(currElem != null){
                                var prevSlide = currElem.previousElementSibling;
                                if(prevSlide != null){
                                    if((+prevSlide.dataset.status) == 0){
                                        var activeSlide = this.getActiveSlide(cthis, currNodeId, 'prev');
                                        if(!activeSlide){
                                            alert('Thre is no page');
                                        }else{
                                            // by true, know the event is performed real user
                                            this.getScreen(activeSlide, true);
                                            cthis.docs.currNote = activeSlide.dataset.slide;
                                        }
                                    } else {
                                        this.getScreen(prevSlide, true);
                                        cthis.docs.currNote = prevSlide.dataset.slide;
                                    }

                                }else{
                                    alert('There is no previous element');
                                }
                            }
                        },

                        getActiveSlide : function (cthis, id, which){
                            var currElem = document.querySelector('#documentScreen #note' + id);
                            if(currElem  != null){
                                if(which == 'next'){
                                    var activeSlide = currElem.nextElementSibling;
                                } else {
                                    var activeSlide = currElem.previousElementSibling;
                                }

                                if(activeSlide != null){
                                    if((+activeSlide.dataset.status) == 0){
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
                        nextSlide : function (cthis){
                            var lastElement = cthis.order[cthis.order.length-1];
                            var currNodeId = cthis.docs.currNote;

                            if(currNodeId != lastElement){
                                var currElem = document.querySelector('#documentScreen #note' + currNodeId);
                                if(currElem  != null){
                                    nextSlide = currElem.nextElementSibling;
                                    if(nextSlide != null){
                                        if((+nextSlide.dataset.status) == 0){
                                            var activeSlide = this.getActiveSlide(cthis, currNodeId, 'next');
                                            if(!activeSlide){
                                                alert('Thre is no page');
                                            }else{
                                                this.getScreen(activeSlide, true);
                                                cthis.docs.currNote = activeSlide.dataset.slide;
                                            }

                                        } else {
                                            // by true, know the event is performed real user
                                            this.getScreen(nextSlide, true);
                                            cthis.docs.currNote = nextSlide.dataset.slide;
                                        }
                                    }
                                }
                            }else {
                                alert('There is no page');
                            }
                        },

                        isSlideAvailable : function (slidId, lastElement){
                            if(slidId == lastElement){
                                return false
                            }
                            return true;
                        },

                        /**
                         * display the current slide/note
                         * slideNum exepects the slide
                         */
                        currentSlide : function (slideNum){
                            var currElem = document.querySelector('#documentScreen #note' + slideNum);
                            if(currElem != null){
                                this.getScreen(currElem);
                            } else {
                                alert(slideNum + ' is not found ');
                            }
                        },

                        /**
                         * Create the screen with Whiteboard and Current slide
                         */
                        getScreen : function(note, userClicked){
                            this.currSlide = note.dataset.slide;
                            this.currNote = note.dataset.slide;
                            virtualclass.dts.currDoc = this.doc;

                            this.slideTo(note);

                            if(!this.isWhiteboardExist(this.currNote)){
                                virtualclass.dts.docs.createWhiteboard(this.currNote);
                            }else {
                                // If there is a zoom, that needs to apply at in next/previous screen,
                                virtualclass.zoom.normalRender();
                            }

                            virtualclass.vutil.updateCurrentDoc(this.currNote);
                            virtualclass.dts.updateLinkNotes(this.currNote);

                            setTimeout(
                                function (){
                                    var isFirstNote = virtualclass.dts.isFirstNote(note.id);
                                    var isLastNote = virtualclass.dts.isLastNote(note.id);

                                    var notesContainer = document.querySelector('#screen-docs .pageContainer');

                                    if(isFirstNote && isLastNote){
                                        notesContainer.classList.add('firstNote');
                                        notesContainer.classList.add('lastNote');
                                    }else if(isFirstNote){
                                        notesContainer.classList.remove('lastNote');
                                        notesContainer.classList.add('firstNote');
                                    } else if(isLastNote){
                                        notesContainer.classList.remove('firstNote');
                                        notesContainer.classList.add('lastNote');
                                    }else {
                                        notesContainer.classList.remove('firstNote');
                                        notesContainer.classList.remove('lastNote');
                                    }
                                },0
                            );
                        },
                        /**
                         * this expects the the whiteboard related to slide
                         * is exist or not
                         * @param slide expects slide/note
                         * @returns {boolean}
                         */
                        isWhiteboardExist : function (slide){
                            var wbContId  = 'containerWb_doc_'+slide+'_'+  slide;
                            wbCont = document.querySelector('#'+wbContId);
                            return (wbCont != null);
                        }
                    }
                }
            },

            /**
             * Destryo the dts class
             */
            destroyDts : function (){
                var appWrapper = document.getElementById(virtualclass.dts.UI.id);
                if(appWrapper != null){
                    appWrapper.parentNode.removeChild(appWrapper);
                } else {
                    alert('Element is null');
                }
                virtualclass.dts = null;
            },

            screenIsCreated : function (doc){
                var screen = document.getElementById('screen' + doc);
                if(screen != null){
                    return true;
                } else {
                    return false;
                }
            },

            convertInObjects2 : function (allPages){
                var note = {};
                for(var i=0; i<allPages.length; i++){
                    note[allPages[i].id] = allPages[i];
                }
                return note;
            },


            convertInObjects : function (allPages){
                var note = {};
                for(var i=0; i<allPages.length; i++){
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
            onmessage : function (e){
                if(typeof virtualclass.dts != 'object'){
                    virtualclass.makeAppReady('DocumentShare', undefined, {init : "studentlayout"});
                }
                var dts = e.message.dts;

                if(dts.hasOwnProperty('allNotes')){
                    this.allNotes = dts.allNotes;
                    this.storeInDocs(this.allNotes);

                } else if(dts.hasOwnProperty('fallNotes')){
                    this.allNotes = dts.fallNotes;
                    this.storeInDocs(this.allNotes);
                    this.dstAllStore(virtualclass.serverData.rawData.docs);
                } else if((dts.hasOwnProperty('allDocs'))) {
                    this.allDocs = dts.allDocs;
                    this.afterUploadFile(dts.doc);
                }else if (dts.hasOwnProperty('fallDocs')){
                    this.afterFirstRequestDocs(dts.fallDocs);

//                    this.allDocs = dts.fallDocs;
//                    for(var i=0; i< this.allDocs.length; i++){
//                        this.initDocs( this.allDocs.id);
//                    }
                    // have to do something
                } else if(dts.hasOwnProperty('dres')){
                    this.docs.studentExecuteScreen(dts);
                    console.log(virtualclass.gObj.currWb + ' ' + 'document share :- Layout initialized');
                }else if (dts.hasOwnProperty('slideTo')){
                    if(typeof this.docs.note != 'object'){
                        var cthis = this;
                        this.docs.executeScreen(dts.docn, undefined, function (){
                            console.log('document share :- doc is not created');
                            cthis.docs.note.currNote =  dts.slideTo;
                            var note = document.querySelector('#note'+dts.slideTo);
                            cthis.docs.note.slideTo(note);
                        }, dts.slideTo);

                        // if teacher refresh the page and navigat to other doc
                        // In student window, It will execute below else condition, it trigger for next slide
                        // In this case the docs are different so we need to initalize first
                        // doc and after that we need to call for next slide
                    } else if(typeof this.docs.note == 'object' && dts.docn != this.docs.num) {
                        this.docs.currNote = dts.slideTo;
                        this.docs.executeScreen(dts.docn, undefined);
                        this.docs.note.currentSlide(dts.slideTo);

                    } else {
                        var note = document.querySelector('#note' + dts.slideTo);
                        if(note != null){
                            this.docs.currNote = dts.slideTo;
                            // In normal case
                            this.docs.note.getScreen(note);
                            console.log(virtualclass.gObj.currWb + ' ' + 'document share :- Normal Case');
                        }else{
                            alert('Note is null');
                        }


                    }
                }else if(dts.hasOwnProperty('dispScreen')){
                    var doc = dts.dispScreen.sc;
                    virtualclass.vutil.updateCurrentDoc(doc, dts.dispScreen.sn);
                    if(!virtualclass.dts.screenIsCreated(doc)){
                        //console.log('document share :- With screen Created');
                        console.log(virtualclass.gObj.currWb + ' ' + 'document share :- With screen Created');
                        this.docs.executeScreen(doc, undefined, undefined, dts.dispScreen.sn);
                        if(typeof this.docs.note == 'object'){
                            this.docs.note.getScreen(dts.dispScreen.sn); // it will get the screen if there is not already
                        }
                    } else {
                        //console.log('document share :- Only display screen');
                        console.log(virtualclass.gObj.currWb + ' ' + 'document share :- Only display screen');
                        this.docs.displayScreen(doc);
                    }
                }else if (dts.hasOwnProperty('rmnote')){
                    this._delete(dts.rmnote);
                }else if(dts.hasOwnProperty('rmsnote')){ // remove single note
                    this._removePageUI(dts.rmsnote);
                    this._removePageFromStructure(dts.rmsnote);
                }else if(dts.hasOwnProperty('noteSt')){
                    this.noteStatus(dts.note, dts.noteSt);
                } else if(dts.hasOwnProperty('docSt')){
                    this.docStatus(dts.doc, dts.docSt);
                }else if (dts.hasOwnProperty('order_recived')){
                    this.afterRequestOrder(dts.order_recived);
                }
                if(!dts.hasOwnProperty('dres')){
                    var studentMsg = document.querySelector('#docMsgStudent');
                    if(studentMsg != null){
                        studentMsg.parentNode.removeChild(studentMsg);
                    }
                }
            },

            sendCurrentSlide : function (){
                if(virtualclass.dts.docs.hasOwnProperty('currDoc')){
                    var doc = virtualclass.dts.docs.currDoc;
                    if(doc != undefined){
                        if(document.querySelector('#listnotes .note') != null){
                            ioAdapter.mustSend({'dts': {slideTo: virtualclass.dts.docs.note.currNote, docn : doc }, 'cf': 'dts'});
                            console.log(virtualclass.gObj.currWb + ' ' + 'Document share send current slide');
                        }

                    }else {
                        console.log('Document sharing : doc number is undefined' );
                    }
                }

            },

            sendCurrentDoc : function (){
                if(virtualclass.dts.docs.hasOwnProperty('currDoc')){
                    if(doc != undefined){
                        var doc = virtualclass.dts.docs.currDoc;
                        ioAdapter.mustSend({'dts': {doc: doc = virtualclass.dts.docs.currDoc}, 'cf': 'dts'});
                        //console.log('Document share send current doc only');
                        console.log(virtualclass.gObj.currWb + ' ' + 'Document share send current doc only');
                    }else {
                        console.log('Document sharing : doc number is undefined' );
                    }
                }
            },

            consoleMessage : function (msg){
                console.log(virtualclass.gObj.currWb + ' ' + msg);
            },

            _rearrange : function (pageOrder){
                alert(pageOrder.toString());
            },

            reArrangeNotes : function (order){
                this.order = order;
                this.reArrangeElements(order);
                if(roles.hasAdmin()){
                    this.sendOrder(this.order);
                }

            },

            sendOrder : function(order){
                var data = {'content_order': order.toString(), content_order_type: 1, live_class_id : virtualclass.gObj.congCourse};
                virtualclass.vutil.xhrSendWithForm(data, 'congrea_page_order', function (response){});
            },

            reaArrangeThumbCount : function (){
                var allThumbist = document.querySelectorAll('#listnotes .thumbList');
                for(var j=0; j<allThumbist.length; j++){
                    allThumbist[j].innerHTML = j+1;
                }
            },
            reArrangeElements : function (order){
                var container = document.getElementById('notesContainer'),
                    tmpdiv = document.createElement('div');
                    tmpdiv.id = "notesContainer";
                    tmpdiv.className  = "notes";

                for (var i = 0; i < order.length; i++) {
                    tmpdiv.appendChild(document.getElementById('note' + order[i]));
                }
                container.parentNode.replaceChild(tmpdiv, container);
                // organize list
                this.reaArrangeThumbCount();
            },

            _deleteOld : function (id){
                if(roles.hasControls()){
                    var linkDocs = document.querySelector('#linkdocs' + id);
                    if(linkDocs != null){
                        linkDocs.parentNode.removeChild(linkDocs);
                    }

                    ioAdapter.mustSend({'dts': {rmnote: id}, 'cf': 'dts'});

                    var data = {lc_content_id : id, action : 'delete', user : virtualclass.gObj.uid};
                    var cthis = this;
                    virtualclass.vutil.xhrSendWithForm(data, 'update_content', function (response){
                        //    alert(response);
                        cthis.sendOrder(cthis.order);
                    });
                }

                delete this.pages['docs'+id];
                this.removePagesUI(id);
                this.removePagesFromStructure(id);
            },

            _delete : function (id){
                var linkDocs = document.querySelector('#linkdocs' + id);
                if(linkDocs != null){
                    linkDocs.parentNode.removeChild(linkDocs);
                }
                var data = {
                    uuid : id,
                    action : 'delete',
                    page : 0
                }

                var url =  'https://api.congrea.net/t/UpdateDocumentStatus';
                var that = this;

                var cthis = this;
                virtualclass.xhrn.sendData(data, url, function (msg) {
                    var res = JSON.parse(msg);
                    if(res.status == 'ok'){
                        cthis.sendOrder(cthis.order);
                    }
                });

                delete this.pages['docs'+id];
                this.removePagesUI(id);
                this.removePagesFromStructure(id);
            },

            _deleteNote2 : function (id, typeDoc){
                this._removePageUI(id, typeDoc);
                this._removePageFromStructure(id, typeDoc);
                if(roles.hasControls()){
                    ioAdapter.mustSend({'dts': {rmsnote: id}, 'cf': 'dts'});
                }
                var cthis = this;
                var data = {page_id : id, action : 'delete', user : virtualclass.gObj.uid};
                virtualclass.vutil.xhrSendWithForm(data, 'update_content', function (response){
                    //alert(response);
                    cthis.sendOrder(cthis.order);
                });
            },


            _deleteNote : function (id, typeDoc){
                this._removePageUI(id, typeDoc);
                this._removePageFromStructure(id, typeDoc);
                if(roles.hasControls()){
                    ioAdapter.mustSend({'dts': {rmsnote: id}, 'cf': 'dts'});
                }

                var cthis = this;

                var idarr = id.split('_');
                var doc = idarr[0];
                var pid = parseInt(idarr[1]);

                var data = {
                    uuid : doc,
                    action : 'delete',
                    page : pid
                }

                var url =  'https://api.congrea.net/t/UpdateDocumentStatus';
                var that = this;

                var cthis = this;

                virtualclass.xhrn.sendData(data, url, function (msg) {
                    var res = JSON.parse(msg);
                    if(res.status == 'ok'){
                        cthis.sendOrder(cthis.order);
                    }
                });
            },

            removePagesFromStructure: function (id){
                var result = [];
                for(var i in this.allNotes){
                    if(this.allNotes[i].lc_content_id == id){
                        this._removePageFromStructure(this.allNotes[i].id);
                        this.removePagesFromStructure(id); // again we call the deltePages as allPages array is re-arranged
                    }
                }
            },


            _removePageFromStructure : function (id){
                this.removeWhiteboardFromStorage('_doc_'+ id+'_'+ id);
                delete this.allNotes[id];
                this.storeInDocs(this.allNotes); //new pages save into docs

            },

            _disable : function (id){
                this.docStatus(id);
            },


            _enable : function (id){
                this.docStatus(id);
            },

            docStatus : function (id, status){
                var note = document.querySelector("#linkdocs" + id + ' .controls.status');
                if(note != null ){
                    if(typeof status == 'undefined'){
                        var status = (1 - (+note.dataset.status));
                    } else {
                        var status = status;
                    }
                } else {
                    console.log('document share:- there is no element ' + id);
                }

                var allNotes = this.getDocs(id);
                for(var i =0; i < allNotes.length; i++){
                    var nid = allNotes[i].id;
                    this.noteStatus(nid, status);
                    this.updatePageNavStatus(nid, status);
                }
                if(roles.hasControls()){
                    ioAdapter.mustSend({'dts': {docSt: status, doc:id}, 'cf': 'dts'});
                }
            },

            /**
             * TODO, need to improve this funciton
             * related to event.status in page.js
             * around 360
             */
            updatePageNavStatus : function (id, status){
                var  linknote = document.querySelector('#linknotes' + id);
                if(linknote != null){
                    linknote.dataset.status = status;
                    var childNode = linknote.querySelector('.controls.status');
                    childNode.dataset.status = status;
                    childNode.querySelector('.statusanch').innerHTML = 'status' + status;
                }else{
                    console.log('Document share : there is no element ' + '#linknotes' + id);
                }
            },


            _noteDisable : function (id){
                this.noteStatus(id);
                this.sendNoteStatus(id)
            },

            _noteEnable : function (id){
                this.noteStatus(id);
                this.sendNoteStatus(id);
            },

            sendNoteStatus : function (id){
                if(roles.hasControls()){
                    var note = document.querySelector("#note" + id);
                    if(note != null){
                        ioAdapter.mustSend({'dts': {noteSt: note.dataset.status, note:id}, 'cf': 'dts'});
                    }else {
                        alert('Element is null');
                    }
                }
            },

            /**
             * set the note status, like enable or disable
             * @param id expects note id
             * @param status expect enable or disable
             */
            noteStatus : function (id, status){
                var note = document.querySelector("#note" + id);
                if(note != null ){
                    if(typeof status == 'undefined'){
                        var status = (1 - (+note.dataset.status));
                    } else {
                        if(status == true || status == 'true'){
                             status = 1;
                        }else {
                                status = 0;
                        }
                    }
                    note.dataset.status = status;
                    var noteObj = this.allNotes[id];
                    noteObj.status = note.dataset.status;
                    this.allNotes[id] = noteObj;
                    this.storeInDocs(this.allNotes);
                } else {
                    console.log('there is no element #note' + id);
                }
            },

            /**
             * get docs from inline variable
             *   @returns {Array}
             */
            getDocsOld : function (id){
                var result = [];
                for(var i in this.allNotes){
                    if(id == this.allNotes[i].lc_content_id){
                        result.push(this.allNotes[i]);
                    }
                }
                return result;
            },

            // Return the pages from specific page
            getDocs : function (id){
                // var doc = this.allDocs[id];
                // var result = [];
                // for(var i in this.allNotes){
                //     if(id == this.allNotes[i].lc_content_id){
                //         result.push(this.allNotes[i]);
                //     }
                // }
                // return result;
                console.log("--------------");
                console.log(virtualclass.gObj.dstAll);
                return this.allDocs[id].notesarr;
            },

            /**
             * get documenation id from all notes by using note id
             * @param id expectes node
             * @returns {*}
             */
            // getDocId : function(id){
            //     if(this.allNotes){
            //         return this.allNotes[id].lc_content_id;
            //     }
            // },

            getDocId : function(id){
                return id.split('_')[0];
            },

            getAllNotes : function(order){
                var result = [];
                for(i=0; i<order.length; i++){
                    result.push(this.allNotes[order[i]]);
                }
                return result;
            },
            /**
             * get note object by passing note
             * @param id expects note
             * @returns {note}
             */
            getNote : function (id){
                return this.allNotes[id];
            },

            updateLinkNotes : function (id){
                var listnotes = document.querySelector("#listnotes .currentNav");
                if(listnotes != null){
                    listnotes.classList.remove('currentNav');
                }
                var linknotes = document.querySelector('#linknotes' + id);
                if(linknotes != null){
                    linknotes.classList.add('currentNav');
                }

            },
            /**
             * This function perform after upload the documenttion
             * @param id expects the upload file id,
             * @param xhr expects xhr object
             * @param response expects xhr response
             */
            onAjaxResponse2 : function (id, xhr, response){
                if(response.hasOwnProperty('resultdata')){
                    this.afterUploadFile(response.resultdata.id);
                    this.showUploadMsz("document upload success","alert-success");



                } else if (response.message == 'duplicate'){
                    //alert(virtualclass.lang.getString('duplicateUploadMsg'));
                    this.showUploadMsz(virtualclass.lang.getString('duplicateUploadMsg'),"alert-error");

                } else {
                    this.showUploadMsz(virtualclass.lang.getString('someproblem'),"alert-error");

                }

                var msz = document.querySelector("#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list");
                if (msz) {
                    msz.style.display = "none";
                }

                var listnotes  = document.querySelector('#listnotes');
                if(listnotes != null){
                  virtualclass.vutil.makeElementDeactive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                  virtualclass.vutil.makeElementActive('#listnotes');
                }else {
                  console.log('List note is null');
                }
            },

            onAjaxResponse : function (id, xhr, response){
                if(response.hasOwnProperty('success')){
                    for(var i=0; i< virtualclass.gObj.uploadingFiles.length; i++){
                        var docUploadId = virtualclass.gObj.uploadingFiles[i].uuid;
                        this.afterUploadFile(docUploadId);
                    }
                    
                    virtualclass.gObj.uploadingFiles = [];
                    this.showUploadMsz("document upload success","alert-success");
                } else if (response.message == 'duplicate'){
                    //alert(virtualclass.lang.getString('duplicateUploadMsg'));
                    this.showUploadMsz(virtualclass.lang.getString('duplicateUploadMsg'),"alert-error");

                } else {
                    this.showUploadMsz(virtualclass.lang.getString('someproblem'),"alert-error");

                }

                var msz = document.querySelector("#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list");
                if (msz) {
                    msz.style.display = "none";
                }

                var listnotes  = document.querySelector('#listnotes');
                if(listnotes != null){
                    virtualclass.vutil.makeElementDeactive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                    virtualclass.vutil.makeElementActive('#listnotes');
                }else {
                    console.log('List note is null');
                }
            },

            showUploadMsz:function(msg,type){
                var mszCont= document.querySelector("#DocumentShareDashboard #docsUploadMsz");

                var alertMsz= document.querySelector("#DocumentShareDashboard #docsUploadMsz .alert");
                if(alertMsz){
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
            },


            /**
             * Set width and height for note
             */
            setNoteDimension : function (width, height, nid){
                var contElem =  document.querySelector('#cont' + nid);
                if(contElem != null){
                    var noteContainer = contElem.parentNode;
                    var noteId = noteContainer.id;
                    var imageContainer = document.querySelector('#'+ noteId +  ' .imageContainer img');
                    imageContainer.style.width = width;
                    imageContainer.style.height = height;
                }
                system.setDocCanvasDimension(width, height, nid);

                var notesContainer =  document.querySelector('#screen-docs .pageContainer');
                if(roles.hasAdmin()){
                    // 60 for whiteboard height toolbar
                    height += 60;
                }
                // for note's container height
                if(notesContainer != null){
                    notesContainer.style.width = width+'px';
                    notesContainer.style.height = height+'px';
                }

            },

            // setNoteImageDimension : function (width, height, nid){
            //   var contElem =  document.querySelector('#cont' + nid);
            //   if(contElem != null){
            //     var noteContainer = contElem.parentNode;
            //     var imageContainer = document.querySelector('#'+ noteContainer.id +  ' .imageContainer img');
            //     imageContainer.style.width = width;
            //     imageContainer.style.height = height;
            //   }else {
            //     alert(nid + ' is null');
            //   }
            // },

            isFirstNote : function (id){
                var firstNote = document.querySelector('#notesContainer .note');
                return (firstNote != null && (id == firstNote.id));
            },

            isLastNote : function (id){
                var allNotes = document.querySelectorAll('#notesContainer .note');
                var lastNote = allNotes[allNotes.length-1];
                return (allNotes.length > 0 && (lastNote.id == id));
            },

            noteExist : function (){
                return (document.querySelector('#notesContainer .note') != null);
            },

            docSelected : function (){
                return document.querySelector('#listdocs .linkdocs[data-selected="1"]');
            }
        };
    }
    window.documentShare = documentShare;
})(window);
