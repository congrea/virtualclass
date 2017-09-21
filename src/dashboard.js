
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
}
