// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  /**
   * @words expect array
   *
   */
  

  let setLangType = function(LangType) {
    let currentLangType;
    //  Check language type is present in congreaLanguages or not.
    if(window.congreaLanguages.hasOwnProperty(LangType)) {
      currentLangType = LangType;
    } else if(LangType.length>=4) {
      // check language by first two characters of langtype
      LangType = LangType.substring(0,2);
      if(window.congreaLanguages.hasOwnProperty(LangType)) {
        currentLangType = LangType;
      } else {
        currentLangType = "en";
      }
    } else {
      // used default language
      currentLangType = "en";
    }
    return currentLangType;
  }

  const getLang = function (Langtype){
     if(typeof Langtype === "undefined") { 
      // language is not passed from the moodle
      let userBrowserLang = window.navigator.language;
      Langtype = userBrowserLang.toLowerCase();
      Langtype = Langtype.replace(/-/g, '_' ); // Replacing hyphen with underscore
     }
     const congreaLang = setLangType(Langtype);
     window.message = window.congreaLanguages[congreaLang];
  }


  getLang(wbUser.language); // Takes argument from the moodle (moodle's language)

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

