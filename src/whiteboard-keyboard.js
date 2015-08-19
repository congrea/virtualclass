// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var keyBoard = {
        prvTool: "",
        skey: false,
        /**
         * this function triggers the activeAll function
         */
        triggerActiveAll: function (e) {
            if (e.shiftKey) {
                virtualclass.wb.keyBoard.skey = true;
                virtualclass.wb.keyBoard.prvTool = virtualclass.wb.tool.cmd;
                virtualclass.wb.toolInit('t_activeall');
                var currTime = new Date().getTime();
                var obj = {'cmd': 't_activeall', mt: currTime};
                vcan.main.replayObjs.push(obj);
                virtualclass.vutil.beforeSend({'repObj': [obj], 'cf': 'repObj'});
                virtualclass.wb.vcan.main.action = 'move';
            }
        },
        /**
         * this function triggers the deActiveAll function
         */
        triggerdeActiveAll: function (e) {
            if (virtualclass.wb.keyBoard.skey) {
                var currTime = new Date().getTime();
                virtualclass.wb.utility.deActiveFrmDragDrop();
                virtualclass.wb.toolInit(virtualclass.wb.keyBoard.prvTool);
                //var obj = {'cmd': virtualclass.wb.keyBoard.prvTool,  mdTime : currTime};
                var obj = {'cmd': virtualclass.wb.keyBoard.prvTool, mt: currTime};
                vcan.main.replayObjs.push(obj);
                //virutalclass..vutil.beforeSend({'repObj': [obj]}); //after optimized
                virtualclass.vutil.beforeSend({'repObj': [obj], 'cf': 'repObj'});
            }
        }
    };
    window.keyBoard = keyBoard;
})(window);
