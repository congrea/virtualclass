// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const keyBoard = {
    prvTool: '',
    skey: false,
    /**
     * this function triggers the activeAll function
     */
    triggerActiveAll(e) {
      if (e.shiftKey) {
        virtualclass.wb[virtualclass.gObj.currWb].keyBoard.skey = true;
        virtualclass.wb[virtualclass.gObj.currWb].keyBoard.prvTool = virtualclass.wb[virtualclass.gObj.currWb].tool.cmd;
        //         virtualclass.wb[virtualclass.gObj.currWb].toolInit('t_activeall');

        virtualclass.wb[virtualclass.gObj.currWb].toolInit({cmd : 't_activeall', wbId: virtualclass.gObj.currWb});
        const currTime = new Date().getTime();
        const obj = { cmd: 't_activeall', mt: currTime };
        vcan.main.replayObjs.push(obj);
        virtualclass.vutil.beforeSend({ repObj: [obj], cf: 'repObj' });
        virtualclass.wb[virtualclass.gObj.currWb].vcan.main.action = 'move';
      }
    },
    /**
     * this function triggers the deActiveAll function
     */
    triggerdeActiveAll(e) {
      if (virtualclass.wb[virtualclass.gObj.currWb].keyBoard.skey) {
        const currTime = new Date().getTime();
        virtualclass.wb[virtualclass.gObj.currWb].utility.deActiveFrmDragDrop(virtualclass.gObj.currWb);
        // virtualclass.wb[virtualclass.gObj.currWb].toolInit(virtualclass.wb[virtualclass.gObj.currWb].keyBoard.prvTool);

        virtualclass.wb[virtualclass.gObj.currWb].toolInit({cmd : virtualclass.wb[virtualclass.gObj.currWb].keyBoard.prvTool, wbId: virtualclass.gObj.currWb});
        // var obj = {'cmd': virtualclass.wb[virtualclass.gObj.currWb].keyBoard.prvTool,  mdTime : currTime};
        const obj = { cmd: virtualclass.wb[virtualclass.gObj.currWb].keyBoard.prvTool, mt: currTime };
        vcan.main.replayObjs.push(obj);
        // virutalclass..vutil.beforeSend({'repObj': [obj]}); //after optimized
        virtualclass.vutil.beforeSend({ repObj: [obj], cf: 'repObj' });
      }
    },
  };
  window.keyBoard = keyBoard;
}(window));
