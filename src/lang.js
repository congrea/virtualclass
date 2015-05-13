// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
    /*
     * @words expect array
     *
     */
    var getString = function (string, words) {
        var langString = window.virtualclass.lang.message[string];
        if (typeof words != 'undefined' && words.length > 0) {
            for (var i = 0; i < words.length; i++) {
                var spatt = new RegExp('{virtualclass' + (i + 1) + '}');
                langString = langString.replace(spatt, words[i]);
            }
        }
        return langString;
    };
    window.getString = getString;
})(window);