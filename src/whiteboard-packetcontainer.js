// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const packContainer = function () {
    return {
      createPacketContDiv(id, clasName) {
        const tag = document.createElement('div');
        if (typeof id !== 'undefined') {
          tag.id = id;
        }
        if (typeof clasName !== 'undefined') {
          tag.clasName = clasName;
        }
        return tag;
      },
      togglePacketCont(cthis) {
        const classes = this.className.split(' ');
        for (let i = 0; i < classes.length; i++) {
          if (classes[i] === 'display') {
            this.className = 'hide';
            this.innerHTML = '+';
            cthis._togglePacketCont(classes[i]);
            break;
          } else if (classes[i] === 'hide') {
            this.className = 'display';
            this.innerHTML = '-';
            cthis._togglePacketCont(classes[i]);
            break;
          }
        }
      },
      _togglePacketCont(label) {
        const style = label === 'display' ? 'none' : 'block';
        const heading = document.getElementById('dataInfoHeading');
        heading.style.display = style;
        var packCont = document.getElementById('packetContainer');
        packCont.style.display = style;
        var packCont = document.getElementById('informationCont');
        packCont.style.display = style;
      },
    };
  };
  window.packContainer = packContainer;
}(window));
