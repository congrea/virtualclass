// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

(
    function (window){
        var getString = function (string){
            return window.vApp.lang.message[string];
        }
        window.getString = getString;
    }
)(window);