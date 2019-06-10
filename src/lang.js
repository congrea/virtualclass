// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  /**
   * @words expect array
   *
   */
  const getString = function (string, words) {
    let langString = window.virtualclass.lang.message[string];
    if (typeof words !== 'undefined' && words.length > 0) {
      for (let i = 0; i < words.length; i++) {
        const spatt = new RegExp(`{virtualclass${i + 1}}`);
        langString = langString.replace(spatt, words[i]);
      }
    }
    return langString;
  };
  window.getString = getString;
}(window));
