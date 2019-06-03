// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2017  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This file is common file for creating the naivgation for docs, notes and videos.
 * It creates the relative elements like play, hide, delete and also create it's handler
 * It also sends the data with xhr to server on different events
 */

(function (window, document) {

    /**
     * Class is defining here, the page has various attributes like
     * it has type(video or docs or notes), id etc.
     */
    var page = function (parent, ptype, app, module, status, vidType) {
        this.appId = app;
        this.id = null;
        this.parent = (typeof parent != 'undefined' ? parent : null);
        this.status = (typeof status != 'undefined') ? status : 1;
        this.type = ptype;
        this.module = module
        if (ptype == "video") {
            this.videoClass = vidType;
        }
    }

    page.prototype.init = function (id, title) {
        this.rid = id;
        this.id = this.type + id;
        if (typeof title != 'undefined') {
            this.title = title;
        }
        if (roles.hasControls()) {
            var pageScreenContainer = document.getElementById(this.parent);
            if (document.querySelector('#link' + this.id) == null) {
                this.createPageNav(pageScreenContainer);
            }
        }
    }

    /**
     * This function is creating the navigation for docs, notes and video
     */
    page.prototype.createPageNav = function (elem) {
        var listDtype = 'list' + this.type;
        var docNav = document.getElementById(listDtype);
        var lid = 'link' + this.type + this.rid;
        var cthis = this;
        var titleAction = (this.status == 1) ? 'Hide' : 'Show';
        var context = {
            rid: cthis.rid,
            status: this.status,
            id: cthis.id,
            type: cthis.type,
            title: cthis.title,
            titleAction: titleAction
        };

        if (cthis.type == "video") {
            var docNav = document.getElementById("listvideo");
            if (docNav) {
                var elem = this.UI.createPageNavLink2.call(this, docNav);
                var template = virtualclass.getTemplate("linkvideo", "videoupload");
                //$(docNav).append(template(elem));
                docNav.insertAdjacentHTML('beforeend', template(elem));

                var label = document.getElementById(this.type + "Title" + this.rid);
                label.innerHTML = this.title;
                label.dataset.title = this.title;
                this.UI.controller.init(this, lid);
                // var mainpDiv = this.UI.mainPDiv.call(this);
            }

        } else if (this.type == 'docs') {
            var dsTemplate = virtualclass.getTemplate('docsNav', virtualclass.dts.tempFolder);
            context.title = virtualclass.vutil.trimExtension(context.title);
            docNav.insertAdjacentHTML('beforeend', dsTemplate(context));
            this.UI.controller.init(this, lid);

        } else if (this.type == 'notes') {
            var nstemplate = virtualclass.getTemplate('notesNav', virtualclass.dts.tempFolder);
            var note = virtualclass.dts.getNote(this.rid);
            context.content_path = note.thumbnail;
            /** There is does not need thumbnail now,
             * if we need this, we need to find different way instead of executing document.querySelectorAll()
             * **/

            // var allThumbnail = document.querySelectorAll('#list' + this.type + ' .link' + this.type);
            // context.thumbCount = (allThumbnail != null && allThumbnail.length > 0) ? allThumbnail.length :  0;
            // context.thumbCount++;

            docNav.insertAdjacentHTML('beforeend', nstemplate(context));
            this.UI.controller.init(this, lid);

        } else if (this.type == 'ppt') {
            var pptNav = document.getElementById("listppt");
            if (pptNav) {
                var elem = this.UI.createPageNavLink2.call(this, pptNav);
                var template = virtualclass.getTemplate("linkPpt", "ppt");
                // $(pptNav).append(template(elem));
                pptNav.insertAdjacentHTML('beforeend', template(elem));
                var label = document.getElementById(this.type + "Title" + this.rid);
                label.innerHTML = this.title;
                label.dataset.title = this.title;
                this.UI.controller.init(this, lid);
                //var mainpDiv = this.UI.mainPDiv.call(this);
            }
        }
        var mainpDiv = document.getElementById("mainp" + this.id);
        this.createPageNavAttachEvent(mainpDiv);
    },
        //
        /** Attching the event handler when user click on preview of Docs and Notes */
        // Todo, by this function the video's event should be attached
        page.prototype.createPageNavAttachEvent = function (linkNav) {
            if (this.type == 'docs') {

                // linkNav.onclick = virtualclass.dts.docs.goToDocs(this.rid);

                var cthis = virtualclass.dts;
                // linkNav.onclick = cthis.docs.goToDocs(docId);
                var elem = linkNav.closest('.linkdocs');
                if (elem != null) {
                    elem.onclick = cthis.docs.goToDocs(this.rid);
                } else {
                    alert('Element is null');
                }

            } else if (this.type == 'notes') {
                linkNav.onclick = virtualclass.dts.docs.goToNavs(this.rid);
            }
        }

    page.prototype.displayContent = function (parent, mainContent) {
        var pareElem = document.getElementById(parent);
        parent.appendChild(mainContent);
    }

    /**
     * This function used to send the order of notes/videos
     */
    page.prototype.sendUpdate = function (data) {
        data.type = this.type;
        data.id = this.rid;
        page.prototype.xhrSend(data);
    };

    /**
     *  It sends the data to server with method name
     *  First the data would be appended into formData, like
     *  formData.append('username', 'Vidyamantra');
     */
    page.prototype.xhrSend = function (data) {
        var form_data = new FormData();
        for (var key in data) {
            form_data.append(key, data[key]);
        }
        var method = (virtualclass.currApp != "SharePresentation") ? "&methodname=update_content" : "&methodname=update_content_video";
        var path = window.webapi + "&user=" + virtualclass.gObj.uid + method;
        var cthis = this;
        virtualclass.xhr.sendFormData(form_data, path, cthis.onServerResponse);
    }


    /**
     * This funcitons sends the status to Server.
     * like 1 for enable 0 disable
     */
    page.prototype.sendStatus2 = function (data) {
        if (this.type == 'notes') {
            //cthis.dts.sendStatusNote();
            data.page_id = this.rid;
        } else {
            data.lc_content_id = this.rid;
        }
        this.xhrSend(data);
    },

        page.prototype.sendStatus = function (data) {
            if (this.type == 'notes') {
                var ids = this.rid.split('_');
                data.uuid = ids[0];
                data.page = parseInt(ids[1]);

            } else {
                data.uuid = this.rid;
                data.page = 0;
            }

            virtualclass.xhrn.sendData(data, virtualclass.api.UpdateDocumentStatus, function (msg) {
                console.log('Msg ' + msg);
            });
            // this.xhrSend(data);
        }

    /**
     * This function is triggers when the rearrange function,
     * trigger for notes and videos
     */
    page.prototype.rearrange = function () {
        var listPages = document.querySelectorAll('#list' + this.type + ' .link' + this.type);
        var orders = [];
        if (listPages != null) {
            for (var i = 0; i < listPages.length; i++) {
                orders.push(listPages[i].dataset.rid);
            }
        }
        if (orders.length > 0) {
            var result = orders.toString();
            // this.sendUpdate({'content_order': result, content_order_type: this.type});
            if (this.type == 'notes') {
                virtualclass.dts.reArrangeNotes(orders);
            } else {
                virtualclass[this.module]._rearrange(orders);
            }
        } else {
            console.log('Document share:- Element is missing');
        }
    }

    page.prototype.disable = function (id) {
        if (this.type == 'notes') {
            virtualclass.dts._noteDisable(this.rid);
        } else {
            virtualclass[this.module]._disable(this.rid);
        }

    }

    page.prototype.enable = function () {
        if (this.type == 'notes') {
            virtualclass.dts._noteEnable(this.rid);
        } else {
            virtualclass[this.module]._enable(this.rid);
        }
    }

    /**
     * This Object is responsible for creating UI for navigation
     *
     */
    page.prototype.UI = {
        // Creating main preview section section navigation, like thumbnail for notes
        // this function should be removed
        mainPDiv: function () {
            // cthis represents main document object like
            var cthis = this;
            var elem = document.createElement('div');
            elem.className = 'mainp' + cthis.type;
            elem.id = "mainp" + cthis.id;
            elem.className = 'mainpreview';

            if (this.type == 'notes') {
                elem.innerHTML = '';
                var thumbnail = document.createElement('img');
                thumbnail.className = 'thumbnail';
                thumbnail.id = 'thumbnail' + this.rid;

                var note = virtualclass.dts.getNote(this.rid);
                thumbnail.src = note.content_path;
                thumbnail.style.border = "1px solid gray";
                thumbnail.style.width = "70px";
                thumbnail.style.height = "40px";
                thumbnail.style.padding = "5px";
                elem.appendChild(thumbnail);

                var allThumbnail = document.querySelectorAll('#list' + this.type + ' .link' + this.type);
                if (allThumbnail != null) {
                    var thumCount = allThumbnail.length;
                } else {
                    var thumCount = 1;
                }
                var thumbList = document.createElement('span');
                thumbList.className = "thumbList tooltip2";
                thumbList.innerHTML = thumCount;
                thumbList.dataset.title = this.title;
                elem.appendChild(thumbnail);
                elem.appendChild(thumbList);
            } else if (this.type == 'docs') {
                elem.innerHTML = cthis.title;
                elem.dataset.title = cthis.title;
                elem.className += ' tooltip2';
            }

            elem.dataset.screen = cthis.id;
            elem.dataset.rid = cthis.rid;
            return elem;
        },
        // for video and ppt
        createPageNavLink2: function () {
            var cthis = this;
            var elem = document.createElement('div');
            elem.className = 'link' + cthis.type;
            elem.id = "link" + cthis.id;
            elem.className = 'link' + cthis.type + ' links';
            elem.dataset.screen = cthis.id;
            elem.dataset.rid = cthis.rid;
            elem.type = cthis.type;
            elem.dataset.selected = 0;
            elem.dataset.status = this.status
            if (cthis.type == "video") {
                elem.classList.add(cthis.videoClass);
            }
            return elem;
        },

        // cthis referes main class Page
        createPageNavLink: function (docNav) {
            var cthis = this;
            var elem = {};
            elem.type = cthis.type;
            elem.className = 'link' + cthis.type;
            elem.id = "link" + cthis.id;
            elem.className = 'link' + cthis.type + ' links';
            elem.dataset = {};
            elem.dataset.screen = cthis.id;
            elem.dataset.rid = cthis.rid;
            elem.dataset.selected = 0;
            elem.dataset.status = this.status;

            if (cthis.type == "video") {
                elem.type = "video";
                var template = virtualclass.getTemplate("linkvideo", "videoupload");
                // $(docNav).append(template(elem))
                docNav.insertAdjacentHTML('beforeend', template(elem));

            } else {
                var template = JST['templates/linkdoc.hbs'];
                docNav.insertAdjacentHTML('beforeend', template(elem));

            }

        },

        mainView: function (createMainCont) {
            var cthis = this;
            var pageScreenContainer = document.getElementById(this.parent);

            var screenId = 'screen-' + this.type;
            var screenElem = document.getElementById(screenId);

            if (screenElem == null) {
                // var obj = {"doc": cthis, "cd": virtualclass.dts.docs.currDoc, "cn" : virtualclass.dts.docs.currNote};
                var obj = {hasControls: roles.hasControls(), "cd": virtualclass.dts.docs.currDoc};
                var template = JST['templates/docMain.hbs'];
                var docScreen = document.querySelector('#documentScreen')
                docScreen.insertAdjacentHTML('beforeend', template(obj));
            }
            var pageScreenContainer = document.querySelector("#screen" + cthis.id + "   .pageContainer")
            return pageScreenContainer;
        },
        /**
         * This object is responsible for creating the conoroller of navigation
         * It creates the controller elements, attach events and send the status/delete to server
         */
        controller: {
            cthis: null,
            init: function (cthis, parent) {
                this.cthis = cthis;

                // if(cthis.type=="video"){
                var helem = this.element(cthis, 'status', this.cthis.status);
                // var helem = this.element('status');
                var delem = this.element(cthis, 'delete');
                if (cthis.type == 'video') {
                    this.element(cthis, 'edit');
                }
                if (cthis.type != 'docs') {
                    this.dragDrop.init(this.cthis);
                }

            },

            dragDrop: {
                cthis: null,
                source: null,
                init: function (cthis) {
                    var dthis = this;
                    this.cthis = cthis;

                    var id_ = 'list' + this.cthis.type;
                    var listLinks = 'link' + this.cthis.type + this.cthis.rid;


                    var box = document.querySelector('#' + listLinks);

                    box.setAttribute('draggable', 'true');  // Enable boxes to be draggable.
                    box.addEventListener('dragstart', function (e) {
                        dthis.handleDragStart(e, cthis)
                    }, false);
                    box.addEventListener('dragenter', function (e) {
                        dthis.handleDragEnter(e, cthis)
                    }, false);
                    box.addEventListener('dragend', function (e) {
                        dthis.handleDragEnd(e, cthis)
                    }, false);

                    //box.setAttribute('draggable', true  );
                    //box.addEventListener('dragstart', function (e){dragstart(e)}, false);
                    //box.addEventListener('dragenter', function (e){dragenter(e)}, false);
                    //box.addEventListener('dragover', dthis.handleDragOver, false);
                    //box.addEventListener('dragleave', dthis.handleDragLeave, false);
                    //box.addEventListener('drop', dthis.handleDrop, false);
                    //box.addEventListener('dragend', dthis.handleDragEnd, false);
                    //});
                },

                isBefore: function (a, b) {
                    if (a && b) {
                        if (a.parentNode == b.parentNode) {
                            for (var cur = a; cur; cur = cur.previousSibling) {
                                if (cur === b) {
                                    return true;
                                }
                            }
                        }
                        return false;

                    }

                },

                handleDragStart: function (e, cthis) {

                    e.dataTransfer.setData('text/plain', "nirmala");
                    if (cthis.type === 'video') {
                        virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                        virtualclass.vutil.makeElementActive('#listvideo');
                    } else if (this.cthis.type === 'notes') {
                        virtualclass.vutil.makeElementDeactive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                        virtualclass.vutil.makeElementActive('#listnotes');
                    }

                    //   source = virtualclass.vutil.getParentTag(e.target, '.linkdocs');
                    // if(this.cthis.type === 'video'){
                    //     virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                    //     virtualclass.vutil.makeElementActive('#listvideo');
                    // }

                    if (e.target.classList.contains('link' + cthis.type)) {
                        this.source = e.target;

                    } else {
                        this.source = e.target.closest('.link' + cthis.type);
                        //  e.dataTransfer.setData('text/plain', e.target.closest('.link' + this.cthis.type));
                    }

                    e.dataTransfer.effectAllowed = 'move';
                    if (this.source) {
                        this.source.classList.add("dragElem");
                    }

                },

                handleDragEnter: function (e, cthis) {
                    if (cthis.type == 'video') {
                        //  virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                        virtualclass.vutil.makeElementActive('#listvideo');
                    } else if (cthis.type == 'notes') {
                        // virtualclass.vutil.makeElementDeactive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                        virtualclass.vutil.makeElementActive('#listnotes');

                    }

                    // if(this.cthis.type === 'video'){
                    //     virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                    //     virtualclass.vutil.makeElementActive('#listvideo');
                    // }

                    if (this.source) {
                        this.source.classList.add("dragElem");
                        console.log("add dragelem");
                        var elem;
                        // if(this.cthis.type == 'video'){
                        //
                        // }
                        if (cthis.type == 'video' || cthis.type == 'notes' || cthis.type == 'ppt') {
                            var elem = document.querySelectorAll('#virtualclassCont.congrea .link' + cthis.type + '.htn')
                            for (var i = 0; i < elem.length; i++) {
                                elem[i].classList.remove('htn');
                            }

                        }
                        // if(this.cthis.type == 'video'){
                        //     var elem = document.querySelectorAll(' #virtualclassCont.congrea .linkvideo.htn')
                        //     for(var i =0; i<elem.length; i++){
                        //         elem[i].classList.remove('htn');
                        //     }
                        // }else if(this.cthis.type == 'notes'){
                        //     var elem = document.querySelectorAll(' #virtualclassCont.congrea .linknotes.htn')
                        //     for(var i =0; i<elem.length; i++){
                        //         elem[i].classList.remove('htn');
                        //     }
                        //
                        // }


                        var etarget = e.target.closest('.link' + cthis.type);
                        etarget.classList.add("htn");
                        if (this.isBefore(this.source, etarget)) {
                            etarget.parentNode.insertBefore(this.source, etarget);
                        }
                        else {
                            var target = e.target.closest('.link' + cthis.type);
                            target.parentNode.insertBefore(this.source, target.nextSibling);
                        }

                        if (cthis.type == 'video' || cthis.type == 'notes' || cthis.type == 'ppt') {
                            var elem = document.querySelectorAll('#virtualclassCont.congrea .link' + cthis.type + ':not(.dragElem)')
                            for (var i = 0; i < elem.length; i++) {
                                elem[i].classList.add('opaq');
                            }
                        }
                        //
                        // if(this.cthis.type == 'video'){
                        //     var elem = document.querySelectorAll(' #virtualclassCont.congrea .linkvideo:not(.dragElem)')
                        //     for(var i =0; i<elem.length; i++){
                        //         elem[i].classList.add('opaq');
                        //     }
                        // }else if(this.cthis.type == 'notes'){
                        //     var elem = document.querySelectorAll(' #virtualclassCont.congrea .linknotes:not(.dragElem)')
                        //     for(var i =0; i<elem.length; i++){
                        //         elem[i].classList.add('opaq');
                        //     }
                        //
                        // }
                    }

                },
                handleDragEnd: function (e, cthis) {
                    if (virtualclass.currApp == 'DocumentShare') {
                        virtualclass.dts.indexNav.oldOrder = virtualclass.dts.order;
                    }
                    cthis.rearrange();
                    e.preventDefault();
                    this.source.classList.remove("dragElem");
                    console.log("remove dragelem");

                    if (cthis.type == 'video' || cthis.type == 'notes' || cthis.type == 'ppt') {
                        if (cthis.type == 'video') {
                            virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                        } else if (cthis.type == 'notes') {
                            virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');

                        } else {
                            //virtualclass.vutil.makeElementActive('#SharePresentationDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                        }

                        virtualclass.vutil.makeElementActive('#list' + cthis.type);

                        var elems = document.querySelectorAll(' #virtualclassCont.congrea .link' + cthis.type + '.opaq')
                        for (var i = 0; i < elems.length; i++) {
                            elems[i].classList.remove('opaq');
                        }

                        var elem = document.querySelectorAll(' #virtualclassCont.congrea .link' + cthis.type + '.htn')
                        for (var i = 0; i < elem.length; i++) {
                            elem[i].classList.remove('htn');
                        }

                    }

                }
            },

            events: {
                status2: function (elem, cthis) {
                    //alert(cthis.rid + ' from events');
                    if (+(elem.dataset.status) == 0) {
                        if (cthis.type == "video" || cthis.type == "ppt") {
                            elem.title = 'Disable';
                        } else {
                            elem.title = 'Hide';
                        }
                        cthis.status = 1;
                        cthis.enable();
                    } else {
                        if (cthis.type == "video" || cthis.type == "ppt") {
                            elem.title = 'Enable';
                        } else {
                            elem.title = 'Show';
                        }
                        cthis.status = 0;
                        cthis.disable();
                    }
                    elem.dataset.status = cthis.status;
                    var parElem = elem.closest('.link' + cthis.type);
                    parElem.dataset.status = cthis.status;
                    elem.querySelector('.statusanch').innerHTML = 'status' + elem.dataset.status;

                    var data = {'action': 'status', 'status': elem.dataset.status};

                    cthis.sendStatus(data);
                },

                status: function (elem, cthis) {
                    //alert(cthis.rid + ' from events');
                    if (+(elem.dataset.status) == 0) {
                        if (cthis.type == "video" || cthis.type == "ppt") {
                            elem.title = 'Disable';
                        } else {
                            elem.title = 'Hide';
                        }
                        cthis.status = 1;
                        cthis.enable();
                    } else {
                        if (cthis.type == "video" || cthis.type == "ppt") {
                            elem.title = 'Enable';
                        } else {
                            elem.title = 'Show';
                        }
                        cthis.status = 0;
                        cthis.disable();
                    }
                    elem.dataset.status = cthis.status;
                    var parElem = elem.closest('.link' + cthis.type);
                    parElem.dataset.status = cthis.status;
                    elem.querySelector('.statusanch').innerHTML = 'status' + elem.dataset.status;

                    // var data = {'action': 'status', 'status': elem.dataset.status};
                    if (cthis.status == 0) {
                        var data = {'action': 'disable'};
                    } else {
                        var data = {'action': 'enable'};
                    }
                    cthis.sendStatus(data);
                },

                delete: function (elem, cthis, e) {
                    var data = {'action': 'delete'};
                    // if (cthis.type == 'notes') {
                    //     virtualclass.dts._deleteNote(cthis.rid, cthis.type);
                    // } else {
                    //

                    virtualclass.dashBoard.userConfirmation(virtualclass.lang.getString('deletepopup'), function (confirmation) {
                        if (confirmation) {
                            if (cthis.type == 'notes') {
                                virtualclass[cthis.module]._deleteNote(cthis.rid, cthis.type);
                            } else {
                                virtualclass[cthis.module]._delete(cthis.rid);
                            }

                        }
                    });


                    if (virtualclass.currApp == 'DocumentShare') {
                        var evt = e ? e : window.event;
                        if (evt.stopPropagation) evt.stopPropagation();
                        if (evt.cancelBubble != null) evt.cancelBubble = true;
                    }
                    //}
                },
                edit: function (elem, cthis) {
                    var data = {'action': 'edit'};
                    if (!document.querySelector("#titleCont" + cthis.rid)) {
                        if (cthis.type == 'video') {
                            var titleCont = document.querySelector("#virtualclassCont.congrea #videoTitle" + cthis.rid);
                            var text = titleCont.innerHTML;
                            titleCont.style.display = "none";
                            // to use template remember
                            var ct = document.querySelector("#virtualclassCont.congrea #videoTitleCont" + cthis.rid + " .controls.edit");
                            var cont = document.createElement("div");
                            cont.setAttribute("class", "titleCont");
                            cont.setAttribute("id", "titleCont" + cthis.rid);
                            titleCont.parentNode.insertBefore(cont, ct);

                            var tempInbox = document.createElement("input");
                            tempInbox.setAttribute("type", "text");
                            tempInbox.setAttribute("class", "textInput");
                            tempInbox.setAttribute("id", "temp" + cthis.rid);
                            tempInbox.setAttribute("placeholder", text);
                            cont.appendChild(tempInbox);

                            // var tempSave= document.createElement("input");
                            // tempSave.setAttribute("type","submit");
                            // tempSave.setAttribute("class","textSave");
                            // tempSave.setAttribute("id","save"+cthis.rid);
                            // tempSave.setAttribute("value","save");
                            // cont.appendChild(tempSave);

                            // $( tempInbox).on('blur', function(e) {
                            //     rmTxtBox();
                            //
                            // });

                            //remove jquery
                            $(document).on('click', function (e) {
                                if (e.target.id != "temp" + cthis.rid && e.target.id != "editVideoTitle" + cthis.rid) {
                                    rmTxtBox();
                                }
                            });

                            function rmTxtBox() {

                                var ttext = document.querySelector("#virtualclassCont.congrea #temp" + cthis.rid);
                                if (ttext) {
                                    if (!ttext.value) {
                                        ttext.value = cthis.title;
                                    }
                                    if (ttext.value) {
                                        virtualclass.videoUl._editTitle(cthis.rid, ttext.value, cthis.videoClass);
                                        var cont = document.querySelector("#virtualclassCont.congrea #titleCont" + cthis.rid)
                                        cont.parentNode.removeChild(cont);
                                    }

                                }

                            }

                        }

                    }

                }
            },

            element2: function (cthis, eltype, dataSet) {
                if (cthis.type == "video") {
                    if (eltype == "status") {
                        var div = document.querySelector("#controlCont" + cthis.type + cthis.rid + ' .status')
                        div.onclick = this.goToEvent(this.cthis, eltype);
                    } else {
                        var div = document.querySelector("#controlCont" + cthis.type + cthis.rid + ' .delete')
                        div.onclick = this.goToEvent(this.cthis, eltype);
                    }

                } else {

                    if (eltype == "status") {
                        var div = document.querySelector('.controls.status')
                        div.onclick = this.goToEvent(this.cthis, eltype);
                    } else {
                        var div = document.querySelector('.controls.delete')
                        div.onclick = this.goToEvent(this.cthis, eltype);
                    }

                }

            },

            element: function (cthis, eltype, dataSet) {

                var selector = "." + eltype;
                if (eltype == "status" || eltype == 'delete') {
                    var div = document.querySelector("#controlCont" + cthis.type + cthis.rid + ' ' + selector);
                    div.onclick = this.goToEvent(this.cthis, eltype);

                } else if (eltype == "edit") {
                    var edit = document.querySelector("#" + cthis.type + "TitleCont" + cthis.rid + ' ' + selector);
                    edit.onclick = this.goToEvent(this.cthis, eltype);
                    if (cthis.videoClass != 'video_yts') {
                        edit.style.pointerEvents = "none";
                        edit.classList.add("editDisable");
                    }
                }

                var that = this;

                var div = document.querySelector("#link" + cthis.type + cthis.rid);
                if (div) {
                    that.hoverHandler(cthis)                                                                            //
                    div.classList.add("showCtr")                                                                        // edit by shubham
                    div.addEventListener("mouseover", function () {
                        that.hoverHandler(cthis)

                    });
                    div.addEventListener("mouseout", function () {
                        that.hoverHandler1(cthis)

                    });

                }


            },

            hoverHandler: function (cthis) {
                var div;
                if (cthis.type == "video") {
                    div = document.querySelector("#VideoDashboard #link" + cthis.type + cthis.rid + " .controlCont");

                } else if (cthis.type == "ppt") {
                    div = document.querySelector("#SharePresentationDashboard #link" + cthis.type + cthis.rid + " .controlCont");

                } else {
                    div = document.querySelector("#DocumentShareDashboard #link" + cthis.type + cthis.rid + " .controlCont");

                }
                if (div) {
                    div.classList.add("showCtr")
                }

            },
            hoverHandler1: function (cthis) {
                var div;
                if (cthis.type == "video") {
                    div = document.querySelector("#VideoDashboard #link" + cthis.type + cthis.rid + " .controlCont");
                    div.classList.remove("showCtr");
                } else if (cthis.type == "ppt") {
                    div = document.querySelector("#SharePresentationDashboard #link" + cthis.type + cthis.rid + " .controlCont");
                    div.classList.remove("showCtr");
                }
                // }else {
                //     div = document.querySelector("#DocumentShareDashboard #link" + cthis.type + cthis.rid + " .controlCont");
                //
                // }
                // div.classList.remove("showCtr");
            },

            /**
             * This function trigger when user clicks on
             * disable/enable or delete button
             *
             */
            goToEvent: function (cthis, eltype) {
                var dthis = this;
                return function (e) {
                    dthis.events[eltype](this, cthis, e);
                }
            }
        }
    };
    window.page = page;
})(window, document);
