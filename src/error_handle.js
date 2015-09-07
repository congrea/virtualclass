// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2015  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 *
 */
(function (window) {
    // http://stackoverflow.com/questions/9491301/catching-errors-inside-window-onerror
    window.onerror = function(msg, url, lineNo)  {
        console.log("ERROR : " + msg +  " at line  " +  "'"+ lineNo + "' " + "in "  + "'"+url+"'");
    }
})(window);
