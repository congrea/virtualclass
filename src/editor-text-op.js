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
    var TextOp = (function () {
        //var utils = vceditor.utils;
        var utils = window.utils;

        // Operation are essentially lists of ops. There are three types of ops:
        //
        // * Retain ops: Advance the cursor position by a given number of characters.
        //   Represented by positive ints.
        // * Insert ops: Insert a given string at the current cursor position.
        //   Represented by strings.
        // * Delete ops: Delete the next n characters. Represented by negative ints.
        function TextOp(type) {
            this.type = type;
            this.chars = null;
            this.text = null;
            this.attributes = null;

            if (type === 'insert') {
                this.text = arguments[1];
                utils.assert(typeof this.text === 'string');
                this.attributes = arguments[2] || {};
                utils.assert(typeof this.attributes === 'object');
            } else if (type === 'delete') {
                this.chars = arguments[1];
                utils.assert(typeof this.chars === 'number');
            } else if (type === 'retain') {
                this.chars = arguments[1];
                utils.assert(typeof this.chars === 'number');
                this.attributes = arguments[2] || {};
                utils.assert(typeof this.attributes === 'object');
            }
        }

        TextOp.prototype.isInsert = function () {
            return this.type === 'insert';
        };
        TextOp.prototype.isDelete = function () {
            return this.type === 'delete';
        };
        TextOp.prototype.isRetain = function () {
            return this.type === 'retain';
        };

        TextOp.prototype.equals = function (other) {
            return (this.type === other.type &&
            this.text === other.text &&
            this.chars === other.chars &&
            this.attributesEqual(other.attributes));
        };

        TextOp.prototype.attributesEqual = function (otherAttributes) {
            for (var attr in this.attributes) {
                if (this.attributes[attr] !== otherAttributes[attr]) {
                    return false;
                }
            }

            for (attr in otherAttributes) {
                if (this.attributes[attr] !== otherAttributes[attr]) {
                    return false;
                }
            }

            return true;
        };

        TextOp.prototype.hasEmptyAttributes = function () {
            var empty = true;
            for (var attr in this.attributes) {
                empty = false;
                break;
            }

            return empty;
        };

        return TextOp;
    })();
    window.TextOp = TextOp;

})(window);

