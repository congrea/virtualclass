
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

                }
            });
        }
    },

    clickCloseButton : function (){
        var navButton = document.querySelector('#dashboardnav button');
        if(navButton != null){
            navButton.classList.add('clicked');
        }

    }
}
