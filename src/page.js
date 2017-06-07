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
  var page = function (parent, ptype, app, module, status) {
    this.appId = app;
    this.id = null;
    this.parent = (typeof parent != 'undefined' ? parent : null);
    this.status = (typeof status != 'undefined') ? status : 1;
    this.type = ptype;
    this.module = module
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

  page.prototype.createPageNav2 = function (elem) {
    var listDtype = 'list' + this.type;
    var docNav = document.getElementById(listDtype);
    if (docNav == null) {
      docNav = document.createElement('div');
      docNav.id = listDtype;
      docNav.className = 'listPages pages';
      // TODO this should handle in proper way
      if (this.type == 'docs') {
        elem = document.getElementById('docsListContainer');
      }
      elem.appendChild(docNav);
    }

    var lid = 'link' + this.type + this.rid;
    var linkNav = this.UI.createPageNavLink.call(this);
    docNav.appendChild(linkNav);

    if (this.type == 'video') {
      var link = document.getElementById(lid)
      var label = document.createElement("div");
      label.id = this.type + "Title" + this.rid;
      label.className = this.type + "Title";
      label.innerHTML = this.title;
      label.dataset.title = this.title;
      label.className += ' tooltip2';
      link.appendChild(label);
      this.UI.controller.init(this, lid);
      var container = document.querySelector('#controlCont' + this.id);
      var mainpDiv = this.UI.mainPDiv.call(this);
      container.insertBefore(mainpDiv, container.firstChild);
    } else {

      // For notes and videos
      docNav.appendChild(linkNav);
      var mainpDiv = this.UI.mainPDiv.call(this);
      linkNav.appendChild(mainpDiv);
      this.UI.controller.init(this, lid);

    }
    this.createPageNavAttachEvent(mainpDiv);
  },
    /**
     * This function is creating the navigation for docs, notes and video
     */
    page.prototype.createPageNav = function (elem) {
      var listDtype = 'list' + this.type;
      var docNav = document.getElementById(listDtype);
      var lid = 'link' + this.type + this.rid;
      var cthis = this;
      var context = {rid: cthis.rid, status: this.status, id: cthis.id, type: cthis.type, title: cthis.title};
      if (cthis.type == "video") {
        this.UI.createPageNavLink.call(this, docNav);
        var template = JST['templates/linkvideo.hbs'];
        $(docNav).append(template(elem));

        var label = document.getElementById(this.type + "Title" + this.rid);
        label.innerHTML = this.title;
        label.dataset.title = this.title;
        this.UI.controller.init(this, lid);

      } else if (this.type == 'docs') {
        var dsTemplate = virtualclass.getTemplate('docsNav', virtualclass.dts.tempFolder);
        docNav.insertAdjacentHTML('beforeend', dsTemplate(context));
        this.UI.controller.init(this, lid);

      } else if (this.type == 'notes') {
          var nstemplate = virtualclass.getTemplate('notesNav', virtualclass.dts.tempFolder);
          var allThumbnail = document.querySelectorAll('#list' + this.type + ' .link' + this.type);
          var note  = virtualclass.dts.getNote(this.rid);
          context.content_path = note.content_path;
          context.thumbCount = (allThumbnail != null && allThumbnail.length > 0) ? allThumbnail.length :  0;
          context.thumbCount++;
          docNav.insertAdjacentHTML('beforeend', nstemplate(context));
          this.UI.controller.init(this, lid);
      }

      var mainpDiv = document.getElementById("mainp"+this.id);
      this.createPageNavAttachEvent(mainpDiv);
    },
    //
    /** Attching the event handler when user click on preview of Docs and Notes */
    // Todo, by this function the vidoe's event should be attached
    page.prototype.createPageNavAttachEvent = function (linkNav) {
      if (this.type == 'docs') {
        linkNav.onclick = virtualclass.dts.docs.goToDocs(this.rid);
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
    var path = window.webapi + "&user=" + virtualclass.gObj.uid + "&methodname=update_content";
    var cthis = this;
    virtualclass.xhr.sendFormData(form_data, path, cthis.onServerResponse);
  }

  /**
   * This funcitons sends the status to Server.
   * like 1 for enable 0 disable
   */
  page.prototype.sendStatus = function (data) {
    if (this.type == 'notes') {
      //cthis.dts.sendStatusNote();
      data.page_id = this.rid;
    } else {
      data.lc_content_id = this.rid;
    }
    this.xhrSend(data);
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
      this.sendUpdate({'content_order': result, content_order_type: this.type});
      if (this.type == 'notes') {
        virtualclass.dts.reArrangeNotes(orders);
      } else {
        virtualclass[this.module]._rearrange(orders);
      }
    } else {
      alert('there is no element');
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

    createPageNavLink2: function () {
      var cthis = this;
      var elem = document.createElement('div');
      elem.className = 'link' + cthis.type;
      elem.id = "link" + cthis.id;
      elem.className = 'link' + cthis.type + ' links';
      elem.dataset.screen = cthis.id;
      elem.dataset.rid = cthis.rid;
      elem.dataset.selected = 0;
      elem.dataset.status = this.status
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
      elem.dataset.status = this.status

      if (cthis.type == "video") {
        var template = JST['templates/linkvideo.hbs'];
        $(docNav).append(template(elem))

      } else {
        var template = JST['templates/linkdoc.hbs'];
        $(docNav).append(template(elem));

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
        $('#documentScreen').append(template(obj));

        // if(screenElem != null){
        //     screenElem.parentNode.removeChild(screenElem);
        // }
        //
        // var screen = document.createElement('div');
        // screen.id =  screenId;
        // screen.dataset.doc = cthis.id;
        //
        // screen.className =  'screen page_wrapper';
        //
        // var pageContainer = document.createElement('div');
        // pageContainer.className  =  'pageContainer';
        //
        // screen.appendChild(pageContainer);
        // pageScreenContainer.appendChild(screen);
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
        this.dragDrop.init(this.cthis);

        //  }else{
        //this part should be removed
        //var melem = this.element('move', parent);
        //melem.className += ' box';
        //melem.setAttribute('draggable', true);
        //var dataSet = this.status;
        // var helem = this.element('status',  this.cthis.status);
        // // var helem = this.element('status');
        // var delem = this.element('delete');
        //
        // var controllCon = document.createElement('div');
        // controllCon.id = 'controlCont'+cthis.type+cthis.rid;
        // controllCon.className = 'controlCont';

        // controllCon.appendChild(helem);
        // controllCon.appendChild(delem);
        //controllCon.appendChild(melem);

        // var parentElem = document.querySelector('#' + parent);
        // parentElem.appendChild(controllCon);
        // if(this.cthis.type != 'docs'){
        //   this.dragDrop.init(this.cthis);
        // }

        //  }

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
          box.addEventListener('dragstart', function (e) {dthis.handleDragStart(e)}, false);
          box.addEventListener('dragenter', function (e) {dthis.handleDragEnter(e)}, false);
          box.addEventListener('dragend', function (e) {dthis.handleDragEnd(e)}, false);

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
          if (a.parentNode == b.parentNode) {
            for (var cur = a; cur; cur = cur.previousSibling) {
              if (cur === b) {
                return true;
              }
            }
          }
          return false;
        },

        handleDragStart: function (e) {
          //   source = virtualclass.vutil.getParentTag(e.target, '.linkdocs');
          if (e.target.classList.contains('link' + this.cthis.type)) {
            this.source = e.target;
          } else {
            this.source = e.target.closest('.link' + this.cthis.type);
          }

          e.dataTransfer.effectAllowed = 'move';
        },

        handleDragEnter: function (e) {
          //       var etarget = virtualclass.vutil.getParentTag(e.target, '.linkdocs');
          var etarget = e.target.closest('.link' + this.cthis.type);

          if (this.isBefore(this.source, etarget)) {
            etarget.parentNode.insertBefore(this.source, etarget);
          }
          else {
            var target = e.target.closest('.link' + this.cthis.type);
            target.parentNode.insertBefore(this.source, target.nextSibling);

            //etarget.parentNode.insertBefore(source, etarget.nextSibling);
          }
        },
        handleDragEnd: function () {
          this.cthis.rearrange();
        }
      },

      events: {
        status: function (elem, cthis) {
          //alert(cthis.rid + ' from events');
          if (+(elem.dataset.status) == 0) {
            cthis.status = 1;
            cthis.enable();
          } else {
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

        delete: function (elem, cthis) {
          var data = {'action': 'delete'};
          if (cthis.type == 'notes') {
            virtualclass.dts._deleteNote(cthis.rid, cthis.type);
          } else {
            virtualclass[cthis.module]._delete(cthis.rid);
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

          //   var div = document.createElement('div');
          //   div.className = 'controls ' +  eltype;
          //
          //
          //   if(typeof dataSet != 'undefined'){
          //     div.dataset.status = dataSet;
          //   }
          //
          //   var a = document.createElement('a');
          //   a.className = eltype + 'anch';
          //   a.innerHTML = (typeof dataSet != 'undefined') ? eltype+dataSet : eltype;
          //
          //   div.appendChild(a);
          //   div.onclick = this.goToEvent(this.cthis, eltype);
          //
          //   return div;
          //
          //
        }

      },

      element: function (cthis, eltype, dataSet) {
        if (eltype == "status") {
          var selector = '.status';
        } else {
          var selector = '.delete';
        }
        var div = document.querySelector("#controlCont" + cthis.type + cthis.rid + ' ' + selector);
        div.onclick = this.goToEvent(this.cthis, eltype);
      },

      /**
       * This function trigger when user clicks on
       * disable/enable or delete button
       *
       */
      goToEvent: function (cthis, eltype) {
        var dthis = this;
        return function () {
          dthis.events[eltype](this, cthis);
        }
      }
    }
  };
  window.page = page;
})(window, document);
