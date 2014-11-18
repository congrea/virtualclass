// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
function(window) {
    var keyBoard = {
        prvTool: "",
        skey: false,
        /**
         * this function triggers the activeAll function 
         */
        triggerActiveAll: function(e) {
            if (e.shiftKey) {
                console.log('what happend mere bhai');
                vApp.wb.keyBoard.skey = true;
                vApp.wb.keyBoard.prvTool = vApp.wb.tool.cmd;
                vApp.wb.toolInit('t_activeall');
                var currTime = new Date().getTime();
                var obj = {'cmd': 't_activeall', mt: currTime};
                vcan.main.replayObjs.push(obj);
                vApp.wb.utility.beforeSend({'repObj': [obj]});
                vApp.wb.vcan.main.action = 'move';
            }
        },
        /**
         * this function triggers the deActiveAll function 
         */
        triggerdeActiveAll: function(e) {
            if (vApp.wb.keyBoard.skey) {
                console.log('what happend mere bhai ddd');
                var currTime = new Date().getTime();
                vApp.wb.utility.deActiveFrmDragDrop();
                vApp.wb.toolInit(vApp.wb.keyBoard.prvTool);
                //var obj = {'cmd': vApp.wb.keyBoard.prvTool,  mdTime : currTime};
                var obj = {'cmd': vApp.wb.keyBoard.prvTool, mt: currTime};
                vcan.main.replayObjs.push(obj);
                //vApp.wb.utility.beforeSend({'repObj': [obj]}); //after optimized
                vApp.wb.utility.beforeSend({'repObj': [obj]});
            }
        }
    }

    // this is used for demo only.
    // todo should be into seprate file.
//    var io = window.io;
//    function connectionOpen() {
//        io.wsconnect();
//    }
//
//    function connectionOff() {
//        io.disconnect();
//    }

    window.keyBoard = keyBoard;
})(window);
