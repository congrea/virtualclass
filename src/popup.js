/* exported PopUp */
/**
 * PopUp.
 * @namespace
 */
// RvVanillaModal
var PopUp = (function (window, undefined) {
    var confirmbox = false;
//var PopUp = (function(window, undefined) {
    'use strict';
    /**
     * Modal constructor.
     * @constructor
     * @param {Object} options
     * @returns: {Object} this with public methods
     */
    function PopUp(options) {
        this.init(options);
        return this;
    }

    /**
     * @public: inits application.
     * @param: {Object} options
     */
    PopUp.prototype.init = function (options) {
        var defaults = {
            selector: '[data-rv-vanilla-modal]',
            modalSelector: '.rv-vanilla-modal',
            closeSelector: '.rv-vanilla-modal-close',
            showModalClassName: 'rv-vanilla-modal-is-open',
            showOverlay: true
        };
        var self = this;

        /**
         * {Object} settings - stores global options
         */
        this.settings = extend(defaults, options);

        /**
         * {Array} of modal wrapper elements
         */
        this.modalElements = docQSA(this.settings.modalSelector);

        /**
         * {Array} of modal trigger elements
         */
        this.triggers = docQSA(this.settings.selector);

        /**
         * Checks if overlay option is enabled.
         */
        if (this.settings.showOverlay) {
            setupOverlay(function () {
                /**
                 * {Object} modal overlay element
                 */
                self.overlayElement = docQS('.rv-vanilla-modal-overlay');
            });
        }
    };

    /**
     * Closes modal.
     *
     * @public: closes modal
     * @param: {Object} targetElement
     */
    PopUp.prototype.close = function (targetElement) {
        targetElement.classList.remove(this.settings.showModalClassName);

        if (this.settings.showOverlay) {
            this.overlayElement.classList.remove('is-shown');
        }
    };

    /**
     * @public: opens modal
     * @param: {Object} targetElement
     */
    PopUp.prototype.open = function (targetElement) {

        document.getElementById('popupContainer').style.display = 'block';

        this.sendBackOtherElems();

        // can be critical
        //var playButton = document.getElementById("playButton"); //inject code
        //if (playButton != null) {
        //    playButton.style.display = 'none'
        //}

        this.closeShownModal();
        targetElement.classList.add(this.settings.showModalClassName);

        if (this.settings.showOverlay) {
            this.overlayElement.classList.add('is-shown');
        }
    };

    /**
     * @public: loops through list of triggers and fires a callback
     * @returns: callback
     */
    PopUp.prototype.each = function (callback) {
        var array = [];
        array.forEach.call(this.triggers, function (element) {
            if (typeof callback === 'function') {
                callback(element);
            }
        });
    };

    /**
     * @public: closes modal if any is shown
     */
    PopUp.prototype.closeShownModal = function () {
        var array = [];
        var showModalClassName = this.settings.showModalClassName;
        array.forEach.call(this.modalElements, function (element) {
            if (element.classList.contains(showModalClassName)) {
                element.classList.remove(showModalClassName);

            }
        });
    };

    PopUp.prototype.closeElem = function () {
        console.log('close popup');
        if (virtualclass.recorder.waitServer == false) {
            var virtualclassToolCont = document.getElementById('virtualclassOptionsCont');
            if (virtualclassToolCont != null) {
                virtualclassToolCont.style.zIndex = 100;
            }

            var stickBar = document.getElementById('stickybar');
            if (stickBar != null) {
                stickBar.style.zIndex = 2000;
            }

            var commandToolsWrapper = document.getElementById('commandToolsWrapper');
            if (commandToolsWrapper != null) {
                commandToolsWrapper.style.pointerEvents = 'visible';
            }

            var mainPopCont = document.getElementById('about-modal');
            if (mainPopCont != null) {
                virtualclass.popup.close(mainPopCont);
            }

            var sessionEndCont = document.getElementById('sessionEndMsgCont');
            sessionEndCont.dataset.displaying = 'false';
        }
    },

        PopUp.prototype.waitBlock = function () {
            //
            // alert('suman bogati');
            var element = document.getElementById('about-modal');
            virtualclass.popup.open(element);
            this.hideAllPopups();

            var recordPlay = document.getElementById('recordPlay');
            recordPlay.style.display = 'block';
            virtualclass.popup.replayWindowAction('none');
        }

    PopUp.prototype.waitBlockAction = function (action) {
        var wait = document.getElementById("recordPlay");
        wait.style.display = action;
    };


    //TODO this function should be improve
    PopUp.prototype.sendBackOtherElems = function (action) {
        var virtualclassToolCont = document.getElementById('virtualclassOptionsCont');

        if (virtualclassToolCont != null) {
            virtualclassToolCont.style.zIndex = 0;
        }

        var commandToolsWrapper = document.getElementById('commandToolsWrapper');

        if (commandToolsWrapper != null) {
            commandToolsWrapper.style.pointerEvents = 'none';
        }

        var stickBar = document.getElementById('stickybar');
        if (stickBar != null) {
            stickBar.style.zIndex = 0;
        }

        var chatrm = document.getElementById('chatrm');
        if (chatrm != null) {
            chatrm.style.zIndex = 0;
        }

        var audioWidget = document.getElementById('audioWidget');
        if (audioWidget != null) {
            audioWidget.style.zIndex = 0;
        }

        var audioWidget = document.getElementById('audioWidget');
        if (audioWidget != null) {
            audioWidget.style.zIndex = 0;
        }

        var chatWidget = document.getElementById('memlist');
        if (chatWidget != null) {
            chatWidget.style.zIndex = 0;
        }
    };

//    PopUp.prototype.updLoadedFile = function(nfile){
//        var updtMsg = virtualclass.lang.getString("downloadedFile",  [nfile]);
//        document.getElementById('waitMsg').innerHTML = updtMsg;
//    }

    PopUp.prototype.openProgressBar = function (nfile){
        var element = document.getElementById('about-modal');
        virtualclass.popup.open(element);

        this.hideAllPopups();
        document.getElementById('recordingContainer').style.display = 'block';

        //virtualclass.popup.waitBlockAction('none');
        //virtualclass.popup.replayWindowAction('none');
    };

    PopUp.prototype.replayWindow = function () {

        var element = document.getElementById('about-modal');

        virtualclass.popup.open(element);

        this.hideAllPopups();
        virtualclass.popup.replayWindowAction('block');

        //virtualclass.popup.waitBlockAction('none');
        //virtualclass.popup.progressBarAction('none');
    };


    PopUp.prototype.sesseionEndWindow = function () {
        var element = document.getElementById('about-modal');
        virtualclass.popup.open(element);
        this.hideAllPopups();
        var sessionEndMsg = document.getElementById("sessionEndMsgCont");
        sessionEndMsg.style.display = 'block';
        sessionEndMsg.dataset.displaying = true;

        var sessionEndClose = document.getElementById("sessionEndClose");
        sessionEndClose.addEventListener('click',
            function () {
                //virtualclass.popup.closeElem();
                //window.location.reload();
                virtualclass.popup.closeElem();
            });
    };

    PopUp.prototype.replayWindowAction = function (action) {
        var replayContainer = document.getElementById("replayContainer");
        replayContainer.style.display = action;
    }

    PopUp.prototype.progressBarAction = function (action) {
        var recordingContainer = document.getElementById("recordingContainer");
        recordingContainer.style.display = action;
    }

    /**
     * For confirm dialouge box,
     * @param message expects the message
     */
    PopUp.prototype.confirmInput = function (message, cb, label) {

        var element = document.getElementById('about-modal');
        virtualclass.popup.open(element);

        this.hideAllPopups();

        var confirmId = 'confirm';

        var confirm = document.getElementById(confirmId);
        confirm.style.display = 'block';

        //var recordingContainer = document.getElementById("recordingContainer");
        //recordingContainer.style.display = action;


        var allConfirmChildrens = confirm.getElementsByClassName('confirmChild');
        if (allConfirmChildrens.length > 0) {
            while (allConfirmChildrens.length >= 1) {
                allConfirmChildrens[0].parentNode.removeChild(allConfirmChildrens[0]);
            }
        }

        var confirmMessage = document.createElement('div');
        confirmMessage.id = confirmId + 'Message';
        confirmMessage.className = 'confirmChild';

        confirmMessage.innerHTML = message;

        confirm.appendChild(confirmMessage);


        var that = this;

        //var confirmButtons = document.getElementById('popupContainer').getElementsByClassName('confirmButton');
        var attachConfirmInit = function () {
            that.confirmInit(this.id, cb, label);
        }
        var confirmOkDiv = document.createElement('div');
        confirmOkDiv.id = 'confirmOk';
        confirmOkDiv.className = 'confirmButton confirmChild';
        confirmOkDiv.addEventListener('click', attachConfirmInit);

        var confirmOkButton = document.createElement('button');
        confirmOkButton.id = 'confirmOkButton';
        confirmOkButton.className = 'icon-check';
        confirmOkButton.innerHTML = "OK";

        confirmOkDiv.appendChild(confirmOkButton);
        confirm.appendChild(confirmOkDiv);


        var confirmCancelDiv = document.createElement('div');
        confirmCancelDiv.id = 'confirmCancel';
        confirmCancelDiv.className = 'confirmButton confirmChild';
        confirmCancelDiv.addEventListener('click', attachConfirmInit)

        var confirmCancelButton = document.createElement('button');
        confirmCancelButton.id = 'confirmCancelButton';
        confirmCancelButton.className = 'icon-close';
        confirmCancelButton.innerHTML = "Cancel";


        confirmCancelDiv.appendChild(confirmCancelButton);
        confirm.appendChild(confirmCancelDiv);


        //var returnStatement = function (boolVal){
        //    alert(boolVal);
        //    return boolVal
        //}


        //if(!confirmbox){
        //    for(var i=0; i<confirmButtons.length; i++){
        //        confirmButtons[i].removeEventListener('click', attachConfirmInit);
        //        confirmButtons[i].addEventListener('click', attachConfirmInit);
        //    }
        //    confirmbox = true;
        //}

    }

    PopUp.prototype.confirmInit = function (userInput, cb, label) {
        virtualclass.popup.closeElem();
        var confirm = (userInput == 'confirmOk') ? virtualclass.popup.confirmOk() : virtualclass.popup.confirmCancel();
        cb(confirm, label);
    }

    PopUp.prototype.confirmCancel = function () {
        return false;
    }

    PopUp.prototype.confirmOk = function () {
        return true;
    }

    PopUp.prototype.waitMsg = function (){
        var element = document.getElementById('about-modal');
        virtualclass.popup.open(element);

        this.hideAllPopups();
        document.getElementById('waitMsgCont').style.display = 'block';

        //virtualclass.popup.waitBlockAction('none');
        //virtualclass.popup.replayWindowAction('none');
    };

    PopUp.prototype.hideAllPopups = function () {
        var allPopuContainer = document.getElementsByClassName('popupWindow');
        for (var i = 0; i < allPopuContainer.length; i++) {
            allPopuContainer[i].style.display = 'none';
        }
    }

    PopUp.prototype.closePopup = function () {
        virtualclass.popup.closeElem();
        var sessionEndCont = document.getElementById('sessionEndMsgCont');
        if(sessionEndCont.dataset.displaying == 'true'){
            this.sesseionEndWindow();
        }
        //virtualclass.popup.closeElem();
    }



    /**
     * @private: short version of querySelectorAll
     * @param: {string} selector - css-like
     * @returns: {Array|NodeList} selector list
     */
    function docQSA(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * @private: short version of querySelector
     * @param: css-like selector
     * @returns: {Object} first DOM selector
     */
    function docQS(selector) {
        return document.querySelector(selector);
    }

    /**
     * @private: merge defaults with user options
     * @param: defaults settings and user options
     * @returns: merged values of defaults and options
     */
    function extend(defaults, options) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    }

    /**
     * @private: creates overlay element
     * @param: callback - on finish
     * @returns: callback
     */
    function setupOverlay(callback) {
        var div = document.createElement('div');
        div.classList.add('rv-vanilla-modal-overlay');
        docQS('body').appendChild(div);
        if (typeof callback === 'function') {
            callback();
        }
    }

    return PopUp;
})(window);
