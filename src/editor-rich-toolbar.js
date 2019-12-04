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
  const RichTextToolbar = (function (global) {
    const { utils } = window;

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
      const self = this;
      iconName = iconName || eventName;
      const btn = utils.elt('a', [utils.elt('span', '', { class: `vceditor-tb-${iconName}` })], { class: 'vceditor-btn' });
      utils.on(btn, 'click', utils.stopEventAnd(() => {
        self.trigger(eventName);
      }));
      return btn;
    };

    RichTextToolbar.prototype.makeElement_ = function () {
      const self = this;

      const font = this.makeFontDropdown_();
      const fontSize = this.makeFontSizeDropdown_();
      const color = this.makeColorDropdown_();
      const toolbarOptions = [
        utils.elt('div', [font], { class: 'vceditor-btn-group close editor-font' }),
        utils.elt('div', [fontSize], { class: 'vceditor-btn-group close' }),
        utils.elt('div', [color], { class: 'vceditor-btn-group close' }),
      ];
   
      const styleGroup = utils.elt('div', null, { class: 'vceditor-btn-style-group close' });
      const styleGroupInner = utils.elt('div', [self.makeButton_('bold'), self.makeButton_('italic'), self.makeButton_('underline'), self.makeButton_('strike', 'strikethrough')], { class: 'vceditor-btn-group style-group' });
      styleGroup.appendChild(styleGroupInner);
      toolbarOptions.push(styleGroup);

      const myListGroup = utils.elt('div', null, { class: 'vceditor-btn-list-group close' });
      const list = utils.elt('div', [self.makeButton_('unordered-list', 'list-2'), self.makeButton_('ordered-list', 'numbered-list'), self.makeButton_('todo-list', 'list')], { class: 'vceditor-btn-group list-group' });
      myListGroup.appendChild(list);
      toolbarOptions.push(myListGroup);

      const myIndentGroup = utils.elt('div', null, { class: 'vceditor-btn-indent-group close' });
      const indent = utils.elt('div', [self.makeButton_('indent-decrease'), self.makeButton_('indent-increase')], { class: 'vceditor-btn-group indent-group' });
      myIndentGroup.appendChild(indent);
      toolbarOptions.push(myIndentGroup);

      const myParagraphGroup = utils.elt('div', null, { class: 'vceditor-btn-paragraph-group close' });
      const paragraph = utils.elt('div', [self.makeButton_('left', 'paragraph-left'), self.makeButton_('center', 'paragraph-center'), self.makeButton_('right', 'paragraph-right')], { class: 'vceditor-btn-group paragraph-group' });
      myParagraphGroup.appendChild(paragraph);
      toolbarOptions.push(myParagraphGroup);

      const undo = utils.elt('div', [self.makeButton_('undo'), self.makeButton_('redo')], { class: 'vceditor-btn-group undo-group' });
      toolbarOptions.push(undo);

      if (self.imageInsertionUI) {
        toolbarOptions.push(utils.elt('div', [self.makeButton_('insert-image')], { class: 'vceditor-btn-group vceditor-btn-image' }));
      }

      const toolbarWrapper = utils.elt('div', toolbarOptions, { class: 'vceditor-toolbar-wrapper' });
      const toolbar = utils.elt('div', null, { class: 'vceditor-toolbar' });
      toolbar.appendChild(toolbarWrapper);
      return toolbar;
    };

    RichTextToolbar.prototype.makeFontDropdown_ = function () {
      // NOTE: There must be matching .css styles in vceditor.css.
      const fonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Impact', 'Times New Roman', 'Verdana'];

      const items = [];
      for (let i = 0; i < fonts.length; i++) {
        const content = utils.elt('span', fonts[i]);
        content.setAttribute('style', `font-family:${fonts[i]}`);
        items.push({ content, value: fonts[i] });
      }
      return this.makeDropdown_('Font', 'font', items);
    };

    RichTextToolbar.prototype.makeFontSizeDropdown_ = function () {
      // NOTE: There must be matching .css styles in vceditor.css.
      const sizes = [9, 10, 12, 14, 18, 24, 32, 42];

      const items = [];
      for (let i = 0; i < sizes.length; i++) {
        const content = utils.elt('span', sizes[i].toString());
        content.setAttribute('style', `font-size:${sizes[i]}px; line-height:${sizes[i] - 6}px;`);
        items.push({ content, value: sizes[i] });
      }
      return this.makeDropdown_('Size', 'font-size', items, 'px');
    };

    RichTextToolbar.prototype.makeColorDropdown_ = function () {
      const colors = ['black', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'grey'];

      const items = [];
      for (let i = 0; i < colors.length; i++) {
        const content = utils.elt('div');
        content.className = 'vceditor-color-dropdown-item';
        content.setAttribute('style', `background-color:${colors[i]}`);
        items.push({ content, value: colors[i] });
      }
      return this.makeDropdown_('Color', 'color', items);
    };

    RichTextToolbar.prototype.makeDropdown_ = function (title, eventName, items, value_suffix) {
      value_suffix = value_suffix || '';
      const self = this;
      const toolTitle = virtualclass.vutil.smallizeFirstLetter(title);
      const button = (title === 'Font') ? utils.elt('a', `${title} \u25be`, { class: 'vceditor-btn vceditor-dropdown' }) : utils.elt('a', null, { class: `vceditor-btn vceditor-dropdown ${toolTitle}` });
      const list = utils.elt('ul', [], { class: `vceditor-dropdown-menu ${toolTitle}-menu` });
      button.appendChild(list);

      let isShown = false;

      function toggleDropdown() {
        const elem = list.parentNode.parentNode;
        if (isShown) {
          elem.classList.remove('open');
          elem.classList.add('close');
        } else {
          elem.classList.remove('close');
          elem.classList.add('open');
        }
      }

      function showDropdown() {
        if (!isShown) {
          toggleDropdown();
          utils.on(document, 'click', hideDropdown, /* capture= */true);
          isShown = true;
        }
      }

      let justDismissed = false;

      function hideDropdown() {
        if (isShown) {
          toggleDropdown();
          utils.off(document, 'click', hideDropdown, /* capture= */true);
          isShown = false;
        }
        // HACK so we can avoid re-showing the dropdown if you click on the dropdown header to dismiss it.
        // TODO remove setTimeout
        justDismissed = true;
        setTimeout(() => {
          justDismissed = false;
        }, 0);
      }

      function addItem(content, value) {
        if (typeof content !== 'object') {
          content = document.createTextNode(String(content));
        }
        const element = utils.elt('a', [content]);

        utils.on(element, 'click', utils.stopEventAnd(() => {
          hideDropdown();
          self.trigger(eventName, value + value_suffix);
        }));

        list.appendChild(element);
      }

      for (let i = 0; i < items.length; i++) {
        const { content } = items[i];
        const { value } = items[i];
        addItem(content, value);
      }

      utils.on(button, 'click', utils.stopEventAnd(() => {
        if (!justDismissed) {
          showDropdown();
        }
      }));

      return button;
    };

    return RichTextToolbar;
  }());
  window.RichTextToolbar = RichTextToolbar;
}(window));
