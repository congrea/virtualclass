/**
 * This class dashBoard is use to  create common behaviours(methods)
 * for following features Document, Video and Presentation Sharing
 **/

var dashBoard = {
    userConfirmation: function (msg, cb) {
        virtualclass.popup.confirmInput(msg, function (confirm) {
            cb(confirm);
        });
    },

    close: function () {
        console.log('Close dashboard');
        var closeButton = document.querySelector('#congdashboard .modal-content button.close');
        if (closeButton != null) {
            closeButton.classList.remove('clicked');
            closeButton.click();
            var navButton = document.querySelector('#dashboardnav button');
            if (navButton != null) {
                navButton.classList.remove('clicked');
            }
            virtualclass.modal.hideModal();
            // closeButton.classList.remove('clicked');
        }
    },

    isDashBoardExit: function (app) {
        return (document.querySelector('#' + app + 'Dashboard') != null);
    },

    isDashBoardNavExist: function () {
        return (document.querySelector('#dashboardnav') != null);
    },

    actualCloseHandler: function () {
        var closeButton = document.querySelector('#congdashboard .modal-content button.close');
        if (closeButton != null) {
            closeButton.addEventListener('click', function () {
                var navButton = document.querySelector('#dashboardnav button');
                if (navButton != null) {
                    navButton.classList.remove('clicked');
                    var Dtype = "open";
                    dashBoard.dashBoardClickTooltip(Dtype);
                }
            });
        }
    },

    clickCloseButton: function () {
        var navButton = document.querySelector('#dashboardnav button');
        if (navButton != null) {
            navButton.classList.add('clicked');
        }
    },

    dashBoardClickTooltip: function (Dtype) {
        var dashBoardButton = document.querySelector('#dashboardnav button');
        if (virtualclass.currApp == 'Video') {
            dashBoardButton.parentNode.setAttribute("data-title", virtualclass.lang.getString(Dtype + 'videoDashboard'));
        } else if (virtualclass.currApp == "SharePresentation") {
            dashBoardButton.parentNode.setAttribute("data-title", virtualclass.lang.getString(Dtype + 'SharePresentationdbHeading'));
        } else if (virtualclass.currApp == 'DocumentShare') {
            dashBoardButton.parentNode.setAttribute("data-title", virtualclass.lang.getString(Dtype + 'dsDbheading'));
        } else {
            console.log("dashboard tooltip not working properly");
        }

    }
}