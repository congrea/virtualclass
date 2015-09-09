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
    var AttributeConstants = {
        BOLD: 'b',
        ITALIC: 'i',
        UNDERLINE: 'u',
        STRIKE: 's',
        FONT: 'f',
        FONT_SIZE: 'fs',
        COLOR: 'c',
        BACKGROUND_COLOR: 'bc',
        ENTITY_SENTINEL: 'ent',

// Line Attributes
        LINE_SENTINEL: 'l',
        LINE_INDENT: 'li',
        LINE_ALIGN: 'la',
        LIST_TYPE: 'lt'
    };
    window.AttributeConstants = AttributeConstants;

})(window);
