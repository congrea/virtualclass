
/**
 * This class dashBoard is use to  create common behaviours(methods)
 * for following features Document, Video and Presentation Sharing
 **/

var dashBoard = {
    userConfirmation : function (msg, cb){
        virtualclass.popup.confirmInput(msg, function (confirm){
            cb(confirm);
        });
    },

    close : function (){
        var closeButton = document.querySelector('#congdashboard .modal-content button.close');
        if(closeButton != null){
            closeButton.classList.remove('clicked');
            closeButton.click();
            var navButton =  document.querySelector('#dashboardnav button');
            if(navButton != null){
                navButton.classList.remove('clicked');
            }
            // closeButton.classList.remove('clicked');
        }
    },

    isDashBoardExit : function(app){
        return (document.querySelector('#'+ app + 'Dashboard') != null);
    },

    isDashBoardNavExist : function (){
        return (document.querySelector('#dashboardnav') != null);
    },

    actualCloseHandler : function (){
        var closeButton = document.querySelector('#congdashboard .modal-content button.close');
        if(closeButton != null){
            closeButton.addEventListener('click', function(){
                var navButton =  document.querySelector('#dashboardnav button');
                if(navButton != null){
                    navButton.classList.remove('clicked');
                    dashBoard.removePreviousTooltip();
                }
            });
        }
    },

    clickCloseButton : function (){
        var navButton = document.querySelector('#dashboardnav button');
        if(navButton != null){
            navButton.classList.add('clicked');
        }
    },

    dashBoardClickTooltip : function(){
        var dashBoardButton = document.querySelector('#dashboardnav button');
        var buttonTitle = dashBoardButton.parentNode.getAttribute("data-title");
        if(buttonTitle == "Video Dashboard"){
            dashBoardButton.parentNode.setAttribute("data-title", "Close Video Dashboard");
        }else if(buttonTitle == "Presentation Dashboard"){
            dashBoardButton.parentNode.setAttribute("data-title", "Close Presentation Dashboard");
        }else if(buttonTitle == "Document Dashboard"){
            dashBoardButton.parentNode.setAttribute("data-title", "Close Document Dashboard");
        }else{
            console.log("dashboard close button not perform");
        }

    },

    removePreviousTooltip : function(){
        var prevButton = document.querySelector('#dashboardnav button');
        var prevbuttonTitle = prevButton.parentNode.getAttribute("data-title");
        if(prevbuttonTitle == "Close Video Dashboard"){
            prevButton.parentNode.setAttribute("data-title", "Video Dashboard");
        }else if(prevbuttonTitle == "Close Presentation Dashboard"){
            prevButton.parentNode.setAttribute("data-title", "Presentation Dashboard");
        }else if(prevbuttonTitle == "Close Document Dashboard"){
            prevButton.parentNode.setAttribute("data-title", "Document Dashboard");
        }else{
            console.log("Dashboard menu button not perform");
        }
    }
}