/**
 *  Create Navigation for whitboard and Document sharing
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 * 
 */

(function (window, document) {
    var pageIndexNav = function (app) {
        this.shownPages = 6;
        this.app = app;
    }
   
   /* Create the UI container and measure dimension(width) for navigation*/
    pageIndexNav.prototype.init = function () {
        this.UI.container();
        var res = virtualclass.system.measureResoultion({
            'width': window.innerWidth,
            'height': window.innerHeight
        });

        this.subCont = document.querySelector('#virtualclassCont.congrea #dcPaging')
        this.width = res.width;
        this.shownPages = this.countNumberOfNavigation(this.width);
    }
    
    /* create the pagination */
    pageIndexNav.prototype.createIndex = function () {
        this.init();
        for (var i = 0; i < virtualclass.dts.order.length; i++) {
             this.createDocNavigationNumber(virtualclass.dts.order[i], i)
        }
        this.shownPage(this.width);
        this.addActiveNavigation();
        this.setTotalPages(virtualclass.dts.order.length);
    }

    pageIndexNav.prototype.setTotalPages = function(length){
        var cont = document.querySelector("#docShareNav #totalPages");
        if(cont){
            cont.innerHTML = "<span id='teacherCurrPage' >"+this.index+"</span> of " + length + " pages";
        }
    }

    /**
     * This function adjust navigation, like if you click on previous
     * and next button, we need to hide and dislay page number,
     * So, it adjusts page navigation
     */
    pageIndexNav.prototype.adjustPageNavigation=  function (currIndex, dir) {
        if (dir == "right") {
            var nodes = document.querySelectorAll(".noteIndex.shw");
            if (nodes.length) {
                var rl = nodes[nodes.length - 1];
                var shw = parseInt(rl.getAttribute("title"))
            }

            for (var i = shw; i < currIndex; i++) {
                if (virtualclass.currApp == "DocumentShare") {
                    virtualclass.dts.indexNav.UI.setClassPrevNext();
                }
                var elem = document.querySelector(".noteIndex.hid.right");
                if (elem) {
                    elem.classList.remove("hid", "right");
                    elem.classList.add("shw");
                    var lft = document.querySelector(".noteIndex.shw");
                    if (lft) {
                        lft.classList.remove('shw')
                        lft.classList.add("hid", "left");
                    }
                }
            }
       
            if (virtualclass.currApp == "DocumentShare") {
                var curr = virtualclass.dts.docs.currNote;
                var index = document.querySelector(".congrea #dcPaging #index" + curr);
                if (index && !index.classList.contains('active')) {
                    index.classList.add("active");
                }
            }

        } else {

            var nodes = document.querySelector(".noteIndex.shw");
            if (nodes) {
                var shw = parseInt(nodes.getAttribute("title"))
            }

            for (var i = shw; i > currIndex; i--) {
                if (virtualclass.currApp == "DocumentShare") {
                    virtualclass.dts.indexNav.UI.setClassPrevNext();
                }
                var nodes = document.querySelectorAll(".noteIndex.hid.left");
                if (nodes.length) {
                    var elem = nodes[nodes.length - 1];
                }
                if (elem) {
                    elem.classList.remove("hid", "left");
                     elem.classList.add("shw");
                    var nodes = document.querySelectorAll(".noteIndex.shw");
                    if (nodes.length) {
                        var rl = nodes[nodes.length - 1];
                    }

                    if (rl) {
                        rl.classList.remove('shw')
                        rl.classList.add('hid', 'right')

                    }
                }

            }
            if (virtualclass.currApp == "DocumentShare") {
                var curr = virtualclass.dts.docs.currNote;
                var index = document.querySelector(".congrea #dcPaging #index" + curr);
                if (index && !index.classList.contains('active')) {
                    index.classList.add("active");
                }
            }
        }
    }

    pageIndexNav.prototype.removeNav = function(){
        var dc = document.getElementById("docShareNav");
        while (dc.firstChild) {
            dc.removeChild(dc.firstChild);
        }     
    }

    pageIndexNav.prototype.addActiveNavigation = function (wbCurr){
        this.addActiveClass(wbCurr);

        var rightNavPage = document.querySelector('#rightNavPage.disable');
        var isNextNode =  this.UI.isNodeAvailable('.noteIndex.shw.active', 'next');
        if(isNextNode){
            if(rightNavPage != null){
                if(virtualclass.currApp == 'Whiteboard'){
                    this.UI.setArrowStatus('rightNavPage', 'enable');
                }else {
                    virtualclass.dts.indexNav.UI._setArrowStatusDocs(document.getElementById('rightNavPage'), 'enable', 'disable');
                }
            }
        }else {
            if(virtualclass.currApp == 'Whiteboard'){
                this.UI.setArrowStatus('rightNavPage', 'disable');
            }else {
                virtualclass.dts.indexNav.UI._setArrowStatusDocs(document.getElementById('rightNavPage'), 'disable', 'enable');
            }
        }


        var leftNavPage = document.querySelector('#leftNavPage.disable');
        var isPrevNode =  this.UI.isNodeAvailable('.noteIndex.shw.active', 'prev')
        if(isPrevNode){
            if(leftNavPage != null){
                if(virtualclass.currApp == 'Whiteboard'){
                    this.UI.setArrowStatus('leftNavPage', 'enable');
                }else {
                    virtualclass.dts.indexNav.UI._setArrowStatusDocs(document.getElementById('leftNavPage'), 'enable', 'disable');
                }
            }
        }else {
            if(virtualclass.currApp == 'Whiteboard'){
                this.UI.setArrowStatus('leftNavPage', 'disable');
            }else {
                virtualclass.dts.indexNav.UI._setArrowStatusDocs(document.getElementById('leftNavPage'), 'disable', 'enable');
            }
        }
    }


    /** Add active class for current active Note**/
    pageIndexNav.prototype.addActiveClass = function (wbCurr) {
        if(virtualclass.currApp =="Whiteboard"){
           var num = wbCurr.split("doc_0_")[1];
        }
        var index = document.querySelector(".congrea #dcPaging .noteIndex.active");
        if (index) {
            index.classList.remove("active");
        }
        //var curr = virtualclass.dts.docs.currNote;
        var curr = virtualclass.currApp == "DocumentShare" ? virtualclass.dts.docs.currNote : num
        var index = document.querySelector("#index" + curr);
        if (index) {
            index.classList.add("active");
        }
        var rActive = document.querySelector("#dcPaging .hid.right.active");
        var lActive = document.querySelector("#dcPaging .hid.left.active");
        if (rActive || lActive) {
            var currIndex;
            var dir;
            if (rActive) {
                currIndex = rActive.title;
                dir = "right"
            } else {
                currIndex = lActive.title;
                dir = "left"
            }
         this.adjustPageNavigation(parseInt(currIndex), dir);
        }
        
        if(virtualclass.currApp == 'Whiteboard'){
            this.index = (+curr)+1;   
        }else {
            this.index = (currIndex != null) ? currIndex : (index != null && typeof index != 'undefined' ) ? index.title : 1;
        }
        
        var teacherCurrPage = document.getElementById('teacherCurrPage');
        
        if(teacherCurrPage != null){
            teacherCurrPage.innerHTML = this.index;
        }
        
    }
    
    
    /** Re-arrange the Page Navigation **/
    pageIndexNav.prototype.rearrangePageNavigation = function (order) {
        var container = document.getElementById('dcPaging');
        if (container) {
            var tmpdiv = document.createElement('div');
            tmpdiv.id = "dcPaging";
            if (tmpdiv !=null) {
                var old = [];
                if (this.oldOrder) {
                    for (var i = 0; i < this.oldOrder.length; i++) {
                        var j = this.oldOrder[i]
                        old[j] = document.getElementById('index' + this.oldOrder[i]).className;
                    }
                }

                for (var i = 0; i < order.length; i++) {
                    var tempElem = document.getElementById('index' + order[i]);
                    if (this.oldOrder) {
                        // move eleement but retain old class
                        var j = this.oldOrder[i]
                        tempElem.className = old[j];
                    }

                    tmpdiv.appendChild(tempElem);
                    tempElem.innerHTML = i + 1;
                    tempElem.title = i + 1;

                }
                container.parentNode.replaceChild(tmpdiv, container);
            }
        }

        this.UI.setClassPrevNext();
        this.addActiveNavigation();

    }
    
    /** setNavigationDisplay **/
    pageIndexNav.prototype.shownPage = function (width) {
        var pages = document.querySelectorAll(".noteIndex");
        var n = this.countNumberOfNavigation(width);
        for (var i = 0; i < pages.length; i++) {
            if (i > n) {
                pages[i].className = "noteIndex hid right"
            } else {
                pages[i].className = "noteIndex shw"
            }
        }
    }

    /** 
     * Display the number of navigation based on Width 
     * */
    pageIndexNav.prototype.countNumberOfNavigation = function (width) {
        if (width >= 1200) {
            return 10;
        } else if (width >= 700) {
            return 7;
        } else if (width >= 500) {
            return 5;
        } else {
            return 3;
        }
    }

    /* setClasses*/
    pageIndexNav.prototype.movePageIndex = function (direction) {
        virtualclass.dts.indexNav.addActiveNavigation()
        virtualclass.dts.indexNav.UI.setClassPrevNext();
        virtualclass.dts.indexNav.UI.pageNavHandler(direction);

    }


    /** Create navigation for teacher on document sharing **/
    pageIndexNav.prototype.createDocNavigationNumber = function (order, i) {
        var sn = document.createElement("span");
        sn.id = "index" + order;
        sn.className = "noteIndex";
        var pageNum = i + 1;
        sn.setAttribute("title", pageNum);
        sn.innerHTML = pageNum;
        this.subCont.appendChild(sn);
        if (virtualclass.dts.docs.currNote == order) {
            sn.classList.add("active")
        }
        this.index = pageNum;
        sn.onclick = virtualclass.dts.docs.goToNavs(order);
    }


    /** Create navigation for teacher  on  Whiteboard **/
    pageIndexNav.prototype.createWbNavigationNumber = function (id) {
        var wid = "_doc_0_" + id;
        var sn = document.createElement("span");
        sn.id = "index" + id;
        sn.className = "noteIndex";
        var pageNum = id + 1;
        sn.setAttribute("title", pageNum)
        sn.innerHTML = pageNum;
        this.subCont.appendChild(sn);
        this.setTotalPages(pageNum);
        sn.className  = (id > this.shownPages) ? "noteIndex hid right" : "noteIndex shw";

        if (virtualclass.gObj.currWb == wid) {
            virtualclass.wbCommon.indexNav.addActiveNavigation(wid)
        }

        sn.onclick = function () {
            virtualclass.wbCommon.setCurrSlideNumber(wid);
            virtualclass.wbCommon.indexNav.addActiveNavigation(wid)
            virtualclass.wbCommon.readyCurrentWhiteboard(wid);
            // virtualclass.wbCommon.displaySlide(wid);
            virtualclass.gObj.currWb = wid;
        }
    }

    /** Navigation for student on Document Sharing **/
    pageIndexNav.prototype.studentDocNavigation = function(id){
        if(virtualclass.dts.order){
            var index = virtualclass.dts.order.indexOf(id); 
            var cont = document.getElementById("stdPageNo");
            if(cont){
                cont.innerHTML= index +1
            }
            var that = this;
            setTimeout(()=> {
                    that.setTotalPages((virtualclass.dts.order.length));
            }, 100);
        }
    }

    /** Navigation for student on Whiteboard Sharing **/
    pageIndexNav.prototype.studentWBPagination= function(index){
        var cont = document.getElementById("stdPageNo")
        if (cont) {
            cont.innerHTML = parseInt(index) +1;
            var that = this;
            setTimeout(()=> {
                that.setTotalPages((virtualclass.gObj.wbCount+1));
            }, 100);

        }      
    }



    /**Create navigation*/
    pageIndexNav.prototype.UI = {
        container: function () {
            /** TODO Use handlebars**/
            var dc = document.getElementById("docShareNav");
            if (roles.hasControls()) {
             
                var i = 0;
                while (dc.firstChild) {
                    dc.removeChild(dc.firstChild);
                }

                var cont = document.querySelector(".congrea #docShareNav");
                var left = document.createElement('span')
                left.id = "leftNavPage"
                left.className = "pageNav"
                //left.innerHTML = "left"
                cont.appendChild(left);

                var subCont = document.createElement('div')
                subCont.id = "dcPaging";
                cont.appendChild(subCont);

                var right = document.createElement('span')
                right.id = "rightNavPage"
                right.className = "pageNav"
                // right.innerHTML = "right"
                cont.appendChild(right);
                
                var that = this;

                /** create the descriptive function here**/
                left.addEventListener("click", function () {
                    if (virtualclass.currApp == "Whiteboard") {
                        if (that.isNodeAvailable(".noteIndex.shw.active", 'prev')) {
                            document.querySelector("#virtualclassWhiteboard .prev").click();
                        } else {
                            // that.disableLastNavigation();
                            that.setArrowStatus('leftNavPage', 'disable');
                        }
                    } else {
                        document.getElementById("docsprev").click()
                        //that.disableLastNavigation();
                        that.setArrowStatus('leftNavPage', 'disable');
                    }
                })


                right.addEventListener("click", function () {
                    /** create the descriptive function here**/
                    if (virtualclass.currApp == "Whiteboard") {
                        if (that.isNodeAvailable(".noteIndex.shw.active", 'next')) {
                            document.querySelector("#virtualclassWhiteboard .next").click();
                            var num = virtualclass.gObj.currWb.split("_doc_0")[1]
                            if (num > this.shownPages) {
                                var shw = document.querySelector(".noteIndex.shw");
                                shw.className = "noteIndex hid left";
                            }
                        } else {
                            // that.disableLastNavigation();
                            that.setArrowStatus('rightNavPage', 'disable');

                        }
                    } else {
                        document.getElementById("docsnext").click()
                        that.setArrowStatus('rightNavPage', 'disable');
                    }

                })

            }else{
                var cont = document.querySelector(".congrea #docShareNav");
                var paging = document.querySelector(".congrea #stdPageNo")
                if(!paging){
                    var subCont = document.createElement('div')
                    subCont.id = "dcPaging";
                    cont.appendChild(subCont);

                    var pageNo = document.createElement('span')
                    pageNo.id = "stdPageNo";
                    subCont.appendChild(pageNo);
                    
                }             
            }
            var cont = document.querySelector("#totalPages");
            if (!cont) {
                var total = document.createElement('span')
                total.id = "totalPages";
                total.className = "pages";
                dc.insertBefore(total,left);

            }  
        },
        
        /** Set enable/disable class for previous or next button when required*/
        setClassPrevNext: function () {
            var currNodeId = virtualclass.dts.docs.currNote;
            var currElem = document.querySelector('#documentScreen #note' + currNodeId);
            if (currElem != null) {
                var prevSlide = currElem.previousElementSibling;
                var nxtSlide = currElem.nextElementSibling;
            }
            var lna = document.querySelector("#leftNavPage");
            if (lna) {
                (prevSlide) ? this.setArrowStatus('leftNavPage', 'enable') :   this.setArrowStatus('leftNavPage', 'disable');
            }

            var na = document.querySelector("#rightNavPage");
            if (na) {
                (nxtSlide) ? this.setArrowStatus('rightNavPage', 'enable') :   this.setArrowStatus('rightNavPage', 'disable');
            }

        },

        pageNavHandler: function (navType, that) {
            if (navType == "right") {
                var elem = document.querySelector(".noteIndex.hid.right.active");
                if (elem) {
                    elem.classList.remove("hid");
                    elem.classList.remove("right");
                    elem.classList.add("shw");
                    var lft = document.querySelector(".noteIndex.shw");
                    if (lft) {
                        lft.classList.remove('shw')
                        lft.classList.add("hid", "left");
                    }
                }

            } else {
                var elem = document.querySelector(".noteIndex.hid.left.active");
                if (elem) {
                    elem.classList.remove("hid");
                    elem.classList.remove("left");
                    elem.classList.add("shw");
                    var nodes = document.querySelectorAll(".noteIndex.shw");
                    if (nodes.length) {
                        var rl = nodes[nodes.length - 1];
                    }

                    if (rl) {
                        rl.classList.remove('shw')
                        rl.classList.add('hid')
                        rl.classList.add("right");

                    }
                }
            }
        },

        setArrowStatus : function (element, action) {
            var removeClass = (action == 'disable') ? 'enable' : 'disable';

            var nr = document.getElementById(element);
            if (virtualclass.currApp == "Whiteboard") {
                    nr.classList.add(action);
                    nr.classList.remove(removeClass);
            } else {
                var currNodeId = virtualclass.dts.docs.currNote;
                var lastElement = virtualclass.dts.order[virtualclass.dts.order.length - 1];
                if (currNodeId == lastElement) {
                    this._setArrowStatusDocs(nr, action, removeClass);
                }
            }
        },

        _setArrowStatusDocs : function (nr, action, removeClass){
            nr.classList.add(action);
            nr.classList.remove(removeClass);
        },

        isNodeAvailable : function (selector, whichNode){
            var nodeType =  (whichNode == 'next') ? 'nextSibling' : 'previousSibling';
            var elem = document.querySelector(selector);
            return elem && elem[nodeType] != null;
        }
    }
    window.pageIndexNav = pageIndexNav;

})(window, document)