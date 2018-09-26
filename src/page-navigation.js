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
        this.shownPages = this.countShownPage(this.width);
    }
    
    /* create the pagination */
    pageIndexNav.prototype.createIndex = function () {
        this.init();
        for (var i = 0; i < virtualclass.dts.order.length; i++) {
             this.createThumbnail(virtualclass.dts.order[i], i)
        }
        this.shownPage(this.width);
        this.addActiveClass();
    }
    
    /** Todo, rename function adjustPageNavigation **/
    pageIndexNav.prototype.adjustIndexDisplay=  function (currIndex, dir) {
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
    /** TODO, NAME change removeNavigation **/
    pageIndexNav.prototype.removeNav = function(){
        var dc = document.getElementById("docShareNav");
        while (dc.firstChild) {
            dc.removeChild(dc.firstChild);
        }     
    }
    
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
         
            this.adjustIndexDisplay(parseInt(currIndex), dir);

        }
    }
    
    /** Re-arrange the navigation **/
    pageIndexNav.prototype.rearrangeIndex = function (order) {
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
        this.addActiveClass();

    }
    
    /** createDocNavigationNumber **/
    pageIndexNav.prototype.createThumbnail = function (order, i) {
        var sn = document.createElement("span");
        sn.id = "index" + order;
        sn.className = "noteIndex";
        sn.setAttribute("title", i + 1)
        sn.innerHTML = sn.getAttribute("title");
        this.subCont.appendChild(sn);
        if (virtualclass.dts.docs.currNote == order) {
            sn.classList.add("active")
        }
        sn.onclick = virtualclass.dts.docs.goToNavs(order);
    }
    
    /** createWbNavigationNumber **/
    pageIndexNav.prototype.createWbIndex = function (id) {
        var wid = "_doc_0_" + id;
        var sn = document.createElement("span");
        sn.id = "index" + id;
        sn.className = "noteIndex";
        sn.setAttribute("title", id + 1)
        sn.innerHTML = sn.getAttribute("title");
        this.subCont.appendChild(sn);
        
        sn.className  = (id > this.shownPages) ? "noteIndex hid right" : "noteIndex shw";
        
        if (virtualclass.gObj.currWb == wid) {
            virtualclass.wbCommon.indexNav.addActiveClass(wid)
        }

        sn.onclick = function () {
            virtualclass.wbCommon.setCurrSlideNumber(wid);
            virtualclass.wbCommon.indexNav.addActiveClass(wid)
            virtualclass.wbCommon.readyCurrentWhiteboard(wid);
            // virtualclass.wbCommon.displaySlide(wid);
            virtualclass.gObj.currWb = wid;
        }
    }
    
    /** setNavigationDisplay **/
        
    pageIndexNav.prototype.shownPage = function (width) {
        var pages = document.querySelectorAll(".noteIndex");
        var n = this.countShownPage(width);
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
     * countNumberOfNavigation
     * */
    pageIndexNav.prototype.countShownPage = function (width) {
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
        virtualclass.dts.indexNav.addActiveClass()
        virtualclass.dts.indexNav.UI.setClassPrevNext();
        virtualclass.dts.indexNav.UI.pageNavHandler(direction);

    }
    
    pageIndexNav.prototype.UI = {
        container: function () {
            /** TODO Use handlebars**/
            var dc = document.getElementById("docShareNav");
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
                    var elem= document.querySelector(".noteIndex.shw.active")
                    if (elem && elem.previousSibling != null) {
                          document.querySelector("#virtualclassWhiteboard .prev").click();
                    }else{
                        alert("No previous page")
                    }    
                } else {
                    document.getElementById("docsprev").click()
                    that.disableLastNavigation();
                }

            })
            
            right.addEventListener("click", function () {
                /** create the descriptive function here**/
                if (virtualclass.currApp == "Whiteboard") {
                    var elem= document.querySelector(".noteIndex.shw.active")
                    if (elem && elem.nextSibling != null) {
                        document.querySelector("#virtualclassWhiteboard .next").click();
                        var num = virtualclass.gObj.currWb.split("_doc_0")[1]
                        if (num > this.shownPages) {
                            var shw = document.querySelector(".noteIndex.shw");
                            shw.className = "noteIndex hid left";
                        }
                    }else{
                        alert("next page not available")
                        //that.navigatorMode();
                    }
                } else {
                    document.getElementById("docsnext").click()
                    that.disableLastNavigation();
                }

            })

        },
        
        /** Set enable/disable class for previous or next button when required*/
        setClassPrevNext: function () {
            var currNodeId = virtualclass.dts.docs.currNote;
            var currElem = document.querySelector('#documentScreen #note' + currNodeId);
            if (currElem != null) {
                var prevSlide = currElem.previousElementSibling;
                var nxtSlide = currElem.nextElementSibling;
            }
            var na = document.querySelector("#leftNavPage");
            if (na) {
                if (prevSlide) {
                    na.classList.add("enable")
                    na.classList.remove("disable")

                } else {
                    
                    na.classList.add("disable")
                    na.classList.remove("enable")
                }
            }

            var na = document.querySelector("#rightNavPage");
            if (na) {
                if (nxtSlide) {
                    na.classList.add("enable")
                    na.classList.remove("disable")

                } else {
                    na.classList.add("disable")
                    na.classList.remove("enable")
                }
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

        disableLastNavigation: function () {
            var nr = document.querySelector("#rightNavPage");
            if (virtualclass.currApp == "Whiteboard") {
                    nr.classList.add("enable")
                    nr.classList.remove("disable")
            } else {
              
                var currNodeId = virtualclass.dts.docs.currNote;
                var lastElement = virtualclass.dts.order[virtualclass.dts.order.length - 1];
                if (currNodeId == lastElement) {
                        nr.classList.add("enable")
                        nr.classList.remove("disable")

                }
            }
            
        }

    }

    window.pageIndexNav = pageIndexNav;

})(window, document)