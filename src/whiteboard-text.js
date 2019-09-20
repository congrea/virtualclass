// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  // var vcan = window.vcan;
  /**
   * @Class defined text for drawing text
   *  methods initilized for creating line object
   *  in future there can be more properties than now
   */
  function Text(id) {
    const { vcan } = virtualclass.wb[id];

    vcan.text = function () {
      return {
        type: 'text',
        /**
         * initiates the properties to object
         * @param obj the properties would initates on it
         */
        init(obj) {
          // earlier 1.3 it was
          obj.lineHeight = 1.3;

          if (obj.fontSize == null) {
            obj.fontSize = 30;
          }

          obj.fontSize *= virtualclass.zoom.canvasScale;
          // change during the unit testing
          obj.font = `${obj.fontSize}px Times New Roman`;
          return obj;
        },
        /**
         * it draws the text object as passed parameter obj
         * @param ctx current context
         * @param obj would be drawn
         */
        draw(ctx, obj, noTransform) {
          const { fontSize } = obj;
          ctx.font = `${fontSize}px Times New Roman`;
          ctx.fillStyle = obj.color;
          const textLines = obj.text.split(/\r?\n/);
          // obj.height = obj.fontSize * obj.textLines.length * obj.lineHeight;

          obj.height = this.getTextHeight(ctx, textLines, obj);
          obj.width = this.getTextWidth(ctx, textLines);

          ctx.beginPath();
          for (let i = 0, len = textLines.length; i < len; i++) {
            const tempHeight = (-obj.height / 2) + (i * obj.fontSize * obj.lineHeight) + obj.fontSize;
            ctx.fillText(textLines[i], -obj.width / 2, tempHeight);
          }
          ctx.closePath();
          obj.setCoords();
        },
        /** *
         * It gets the width of text which is passed by textLines
         * @param ctx the context is current canvas context
         * @param textLines this is the texts
         * @returns returns width of text
         */
        getTextWidth(ctx, textLines) {
          let maxWidth = ctx.measureText(textLines[0]).width;

          for (let i = 1, len = textLines.length; i < len; i++) {
            const currentLineWidth = ctx.measureText(textLines[i]).width;
            if (currentLineWidth > maxWidth) {
              maxWidth = currentLineWidth;
            }
          }
          return maxWidth;
        },
        /** *
         * It gets the height of text which is passed by textLines
         * @param ctx the context is current canvas context
         * @param textLines this is the texts the heigth of which is calcualted
         * @returns returns height
         */
        getTextHeight(ctx, textLines, obj) {
          return obj.fontSize * textLines.length * obj.lineHeight;
        },
        removeTextNode() {
          const allTextContainer = document.getElementsByClassName('textBoxContainer');
          for (let i = 0; i < allTextContainer.length; i++) {
            allTextContainer[i].parentNode.removeChild(allTextContainer[i]);
          }
        },
      };
    };
  }

  window.Text = Text;
}(window));
