// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
let supportedLanguages = ["en","pt-br"];

(function (window) {
  /**
   * @words expect array
   *
   */

  //  Checking language type is present in congreaLanguages or not.
  //  if not then use default language type = "en"
  let setLang = function(congreaLangType,window) {
    if(window.congreaLanguages.hasOwnProperty(congreaLangType)) {
      currentLangType = congreaLangType;
    } else {
      currentLangType = "en";
    }
      window.message = window.congreaLanguages[currentLangType];
  }

  // Checking are moodle passing language type. If it is then 
  // go for checking it is present in our congrea module or not
  const getLang = function (Langtype){
     if(Langtype == "undefined") {
       let userBrowserLang = window.navigator.language;
       Langtype = userBrowserLang;
     }
     setLang(Langtype,window);
  }

  getLang("pt_Br");

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

