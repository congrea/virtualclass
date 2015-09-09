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
    var RichTextToolbar = (function (global) {
        var utils = window.utils;

        function RichTextToolbar(imageInsertionUI) {
            this.imageInsertionUI = imageInsertionUI;
            this.element_ = this.makeElement_();
        }

        utils.makeEventEmitter(RichTextToolbar, ['bold', 'italic', 'underline', 'strike', 'font', 'font-size', 'color',
            'left', 'center', 'right', 'unordered-list', 'ordered-list', 'todo-list', 'indent-increase', 'indent-decrease',
            'undo', 'redo', 'insert-image']);

        RichTextToolbar.prototype.element = function () {
            return this.element_;
        };

        RichTextToolbar.prototype.makeButton_ = function (eventName, iconName) {
            var self = this;
            iconName = iconName || eventName;
            var btn = utils.elt('a', [utils.elt('span', '', {'class': 'vceditor-tb-' + iconName})], {'class': 'vceditor-btn'});
            utils.on(btn, 'click', utils.stopEventAnd(function () {
                self.trigger(eventName);
            }));
            return btn;
        }

        RichTextToolbar.prototype.makeElement_ = function () {
            var self = this;

            var font = this.makeFontDropdown_();
            var fontSize = this.makeFontSizeDropdown_();
            var color = this.makeColorDropdown_();

            var toolbarOptions = [
                utils.elt('div', [font], {'class': 'vceditor-btn-group'}),
                utils.elt('div', [fontSize], {'class': 'vceditor-btn-group'}),
                utils.elt('div', [color], {'class': 'vceditor-btn-group'}),
                utils.elt('div', [self.makeButton_('bold'), self.makeButton_('italic'), self.makeButton_('underline'), self.makeButton_('strike', 'strikethrough')], {'class': 'vceditor-btn-group'}),
                utils.elt('div', [self.makeButton_('unordered-list', 'list-2'), self.makeButton_('ordered-list', 'numbered-list'), self.makeButton_('todo-list', 'list')], {'class': 'vceditor-btn-group'}),
                utils.elt('div', [self.makeButton_('indent-decrease'), self.makeButton_('indent-increase')], {'class': 'vceditor-btn-group'}),
                utils.elt('div', [self.makeButton_('left', 'paragraph-left'), self.makeButton_('center', 'paragraph-center'), self.makeButton_('right', 'paragraph-right')], {'class': 'vceditor-btn-group'}),
                utils.elt('div', [self.makeButton_('undo'), self.makeButton_('redo')], {'class': 'vceditor-btn-group'})
            ];

            if (self.imageInsertionUI) {
                toolbarOptions.push(utils.elt('div', [self.makeButton_('insert-image')], {'class': 'vceditor-btn-group'}));
            }

            var toolbarWrapper = utils.elt('div', toolbarOptions, {'class': 'vceditor-toolbar-wrapper'});
            var toolbar = utils.elt('div', null, {'class': 'vceditor-toolbar'});
            toolbar.appendChild(toolbarWrapper)

            return toolbar;
        };

        RichTextToolbar.prototype.makeFontDropdown_ = function () {
            // NOTE: There must be matching .css styles in vceditor.css.
            var fonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Impact', 'Times New Roman', 'Verdana'];

            var items = [];
            for (var i = 0; i < fonts.length; i++) {
                var content = utils.elt('span', fonts[i]);
                content.setAttribute('style', 'font-family:' + fonts[i]);
                items.push({content: content, value: fonts[i]});
            }
            return this.makeDropdown_('Font', 'font', items);
        };

        RichTextToolbar.prototype.makeFontSizeDropdown_ = function () {
            // NOTE: There must be matching .css styles in vceditor.css.
            var sizes = [9, 10, 12, 14, 18, 24, 32, 42];

            var items = [];
            for (var i = 0; i < sizes.length; i++) {
                var content = utils.elt('span', sizes[i].toString());
                content.setAttribute('style', 'font-size:' + sizes[i] + 'px; line-height:' + (sizes[i] - 6) + 'px;');
                items.push({content: content, value: sizes[i]});
            }
            return this.makeDropdown_('Size', 'font-size', items, 'px');
        };

        RichTextToolbar.prototype.makeColorDropdown_ = function () {
            var colors = ['black', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'grey'];

            var items = [];
            for (var i = 0; i < colors.length; i++) {
                var content = utils.elt('div');
                content.className = 'vceditor-color-dropdown-item';
                content.setAttribute('style', 'background-color:' + colors[i]);
                items.push({content: content, value: colors[i]});
            }
            return this.makeDropdown_('Color', 'color', items);
        };

        RichTextToolbar.prototype.makeDropdown_ = function (title, eventName, items, value_suffix) {
            value_suffix = value_suffix || "";
            var self = this;
            var button = utils.elt('a', title + ' \u25be', {'class': 'vceditor-btn vceditor-dropdown'});
            var list = utils.elt('ul', [], {'class': 'vceditor-dropdown-menu'});
            button.appendChild(list);

            var isShown = false;

            function showDropdown() {
                if (!isShown) {
                    list.style.display = 'block';
                    utils.on(document, 'click', hideDropdown, /*capture=*/true);
                    isShown = true;
                }
            }

            var justDismissed = false;

            function hideDropdown() {
                if (isShown) {
                    list.style.display = '';
                    utils.off(document, 'click', hideDropdown, /*capture=*/true);
                    isShown = false;
                }
                // HACK so we can avoid re-showing the dropdown if you click on the dropdown header to dismiss it.
                justDismissed = true;
                setTimeout(function () {
                    justDismissed = false;
                }, 0);
            }

            function addItem(content, value) {
                if (typeof content !== 'object') {
                    content = document.createTextNode(String(content));
                }
                var element = utils.elt('a', [content]);

                utils.on(element, 'click', utils.stopEventAnd(function () {
                    hideDropdown();
                    self.trigger(eventName, value + value_suffix);
                }));

                list.appendChild(element);
            }

            for (var i = 0; i < items.length; i++) {
                var content = items[i].content, value = items[i].value;
                addItem(content, value);
            }

            utils.on(button, 'click', utils.stopEventAnd(function () {
                if (!justDismissed) {
                    showDropdown();
                }
            }));

            return button;
        };

        return RichTextToolbar;
    })();
    window.RichTextToolbar = RichTextToolbar;
})(window);

