// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

(
    function (window){
        var getString = function (string, words){
            var langString = window.vApp.lang.message[string];
            if(typeof words != 'undefined' &&  words.length > 0){
                for(var i=0; i<words.length; i++){
	            	var spatt = new RegExp('{vapp'+(i+1)+'}');
                    langString = langString.replace(spatt, words[i]);
                }
            }
            return langString;
        }
        window.getString = getString;
    }
)(window);