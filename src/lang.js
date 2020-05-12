// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  /**
   * @words expect array
   *
   */
  

  //  Checking language type is present in congreaLanguages or not.
  //  if not then use default language type = "en"
  let setLangType = function(LangType) {
    if(window.congreaLanguages.hasOwnProperty(LangType)) {
      currentLangType = LangType;
    } else {
      currentLangType = "en";
    }
  }

  const getLang = function (Langtype){
     if(Langtype === null) { // language is not passed from the moodle
      let userBrowserLang = window.navigator.language;
      Langtype = userBrowserLang.toLowerCase();
     }
     setLangType(Langtype);
     window.message = window.congreaLanguages[currentLangType];
  }


  /* This function will take argument from the moodle that
  consist the language of user's moodle */
  getLang(wbUser.language);

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

