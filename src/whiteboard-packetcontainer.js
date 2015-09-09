// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var packContainer = function () {
        return {
            createPacketContDiv: function (id, clasName) {
                var tag = document.createElement('div');
                if (typeof id != 'undefined') {
                    tag.id = id;
                }
                if (typeof clasName != 'undefined') {
                    tag.clasName = clasName;
                }
                return tag;
            },
            togglePacketCont: function (cthis) {
                var classes = this.className.split(" ");
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i] == 'display') {
                        this.className = 'hide';
                        this.innerHTML = "+";
                        cthis._togglePacketCont(classes[i]);
                        break;
                    } else if (classes[i] == 'hide') {
                        this.className = 'display';
                        this.innerHTML = "-";
                        cthis._togglePacketCont(classes[i]);
                        break;
                    }
                }
            },
            _togglePacketCont: function (label) {
                var style = label == 'display' ? 'none' : 'block';
                var heading = document.getElementById("dataInfoHeading");
                heading.style.display = style;
                var packCont = document.getElementById("packetContainer");
                packCont.style.display = style;
                var packCont = document.getElementById("informationCont");
                packCont.style.display = style;
            }
        }
    };
    window.packContainer = packContainer;
})(window);