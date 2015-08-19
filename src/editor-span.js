// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**
 * By this file we are creating the Editor
 * It depends on parameters what kind of editor(Rich Text or Code editor would be created)
 *
 * @Copyright 2015  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 *
 *
 */
(function (window) {
    "use strict";
    var Span = (function () {
        function Span(pos, length) {
            this.pos = pos;
            this.length = length;
        }

        Span.prototype.end = function () {
            return this.pos + this.length;
        };

        return Span;
    }());
    window.Span = Span;

})(window);
