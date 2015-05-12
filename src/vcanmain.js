// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var vcan = window.vcan;
    /**
     * through the prototype we are adding method on object which is created by new vcan.main(canvasId);
     **/
    vcan.main.prototype = {
        /**
         * draws the particular object and added the object into children of vcan.main object.
         * @param obj the object on which operation would operated
         *
         */
        addObject: function (obj) {
            if (typeof obj.coreObj == 'object') {
                if (obj.coreObj.type != 'freehand') {
                    vcan.main.children.push(obj.coreObj); //containing all the objects into children array
                }
                var vcanvas = vcan.main.canvas;
                var ctx = vcanvas.getContext('2d');

                vcan.render(ctx, obj.coreObj);

            }
        },
        /**
         * remove the passed object
         * @param obj which have to be delete
         */
        removeObject: function (obj) {
            vcan.remove(obj);
        },
        /**
         * TODO
         * this function  is not used right now
         * binding the event handler on canvas
         * @param type is event type
         * @param handler is function which is executed on this event type
         */

        bind: function (type, handler) {
            vcan.events().bind(vcan.main.canvas, type, handler);
        },
        /**
         *    initiates the other default value for particular object
         *  when this particular object is displaying
         *    @param obj applied the default value to that object
         *  returns the object on which the co-ordinate initiated
         *
         */

        /**
         * this function need to be into another class
         */
        readyObject: function (obj, replayObject) {
            var obj = vcan.extend({}, obj);
            //TODO this should be done into proper way or proper format
            // I think it would be better if below condition would
            // obj.id == undefined is used for drawing free draw for multi user
            //if (replayObject != true && obj.id == undefined) {
            if (!replayObject && obj.id == undefined) {
                vcan.main.id++;
                obj.id = vcan.main.id;
            }

            obj.cornersize = 12;
            obj.rotatingPointOffset = 40;
            obj.selectable = true; //TODO this could be removed not sure but draggable property already defined.
            obj.downObj = false;
            obj.active = false; //TODO that should be set through setActive() function
            obj.cornersize = 12;
            obj.padding = 0;
            obj.hasControls = true;
            obj.cornerColor = 'rgba(102,153,255,0.5)';

            //obj.borderColor = '#000'; Note: below three line code look like this
            if (obj.borderColor == undefined) {
                obj.borderColor = '#000';
            }

            obj.flipX = false;
            obj.flipY = false;
            obj.draggable = false;
            obj.hasBorders = true;
            obj.hasRotatingPoint = false;
            //TODO this should be dynamic and should not be consider on here
            obj.hideCorners = false;
            obj.lockRotation = false;
            obj.MIN_SCALE_LIMIT = 0.1;
            obj.borderOpacityWhenMoving = 0.4;

            if (!obj.hasOwnProperty('theta')) {
                obj.theta = 0;
            }

            if (!obj.hasOwnProperty('scaleX')) {
                obj.scaleX = 1;
            }

            if (!obj.hasOwnProperty('scaleY')) {
                obj.scaleY = 1;
            }

            if (obj.type == 'line') {
                vcan.objLine = new vcan.line();
                vcan.objLine.init(obj);
            } else if (obj.type == 'rectangle') {
                vcan.objRect = new vcan.rectangle();
                vcan.objRect.init(obj);
            } else if (obj.type == 'oval') {
                vcan.objOval = new vcan.oval();
                vcan.objOval.init(obj);
            } else if (obj.type == 'triangle') {
                vcan.objTri = new vcan.triangle();
                vcan.objTri.init(obj);
            } else if (obj.type == 'text') {
                vcan.objTxt = new vcan.text();
                vcan.objTxt.init(obj);
            }

            //TODO this function should not be inside the makeDispObject
            /**
             * @param obj function operated on it
             * @return {Number} width value
             */
            obj.getWidth = function () {
                return this.width * this.scaleX;
            };

            /**
             * @param obj function operated on it
             * @return {Number} height value
             */
            obj.getHeight = function () {
                return this.height * this.scaleY;
            };

            /**
             * Sets the 9 co-ordinates for particular object
             * tl, tr, bl, br, ml, mt, mr, mb, mtr
             * return the object
             */
            obj.setCoords = function () {
                this.currentWidth = this.width * this.scaleX;
                this.currentHeight = this.height * this.scaleY;

                this.hypotenuse = Math.sqrt(
                    Math.pow(this.currentWidth / 2, 2) +
                    Math.pow(this.currentHeight / 2, 2));
                this.angle = Math.atan(this.currentHeight / this.currentWidth);

                this.theta = this.theta;

                // offset added for rotate and scale actions
                var offsetX = Math.cos(this.angle + this.theta) * this.hypotenuse,
                    offsetY = Math.sin(this.angle + this.theta) * this.hypotenuse,
                    theta = this.theta,
                    sinTh = Math.sin(theta),
                    cosTh = Math.cos(theta);

                var tl = {
                    x: this.x - offsetX,
                    y: this.y - offsetY
                };

                var tr = {
                    x: tl.x + (this.currentWidth * cosTh),
                    y: tl.y + (this.currentWidth * sinTh)
                };

                var br = {
                    x: tr.x - (this.currentHeight * sinTh),
                    y: tr.y + (this.currentHeight * cosTh)
                };

                var bl = {
                    x: tl.x - (this.currentHeight * sinTh),
                    y: tl.y + (this.currentHeight * cosTh)
                };
                var ml = {
                    x: tl.x - (this.currentHeight / 2 * sinTh),
                    y: tl.y + (this.currentHeight / 2 * cosTh)
                };
                var mt = {
                    x: tl.x + (this.currentWidth / 2 * cosTh),
                    y: tl.y + (this.currentWidth / 2 * sinTh)
                };
                var mr = {
                    x: tr.x - (this.currentHeight / 2 * sinTh),
                    y: tr.y + (this.currentHeight / 2 * cosTh)
                };
                var mb = {
                    x: bl.x + (this.currentWidth / 2 * cosTh),
                    y: bl.y + (this.currentWidth / 2 * sinTh)

                };
                var mtr = {
                    x: tl.x + (this.currentWidth / 2 * cosTh),
                    y: tl.y + (this.currentWidth / 2 * sinTh)
                };

                // clockwise
                this.oCoords = {tl: tl, tr: tr, br: br, bl: bl, ml: ml, mt: mt, mr: mr, mb: mb, mtr: mtr};

                // set coordinates of the draggable boxes in the corners used to scale/rotate the image
                //TODO in proper way
                this.setCornerCoords();

                /**
                 * Determines which one of the four corners has been clicked of bounding box
                 * @method findTargetCorner
                 * @param e {Event} event object
                 * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
                 */
                obj.findTargetCorner = function (e) {
                    var offset = vcan.main.offset;

                    if (!this.hasControls) {
                        return false;
                    }
                    //  var pointer = actualPointer(e).
                    var pointer = vcan.utility.actualPointer(e);
                    var ex = pointer.x - offset.x,
                        ey = pointer.y - offset.y;
                    var xpoints,
                        lines;

                    //for (var i in this.oCoords) {  //should get through the this.oCoords
                    for (var i in this.oCoords) {
                        if (i === 'mtr' && !this.hasRotatingPoint) {
                            return false;
                        }

                        lines = vcan.virtual_box.getImageLines(this.oCoords[i].corner, i);
                        xpoints = vcan.virtual_box.findCrossPoints(ex, ey, lines);

                        if (xpoints % 2 == 1 && xpoints != 0) {
                            obj.corner = i;
                            return i;
                        }
                    }
                    return false;
                };
                return this;
            };

            /**
             * Draws borders of an object's bounding box.
             * Requires properties: width, height
             * @param ctx context of canvas element
             * @param obj the operation would operated on it
             * @return {vcan.Object} thisArg
             */
                //TOOD that function  should create through the contstructor of object
            obj.drawBorders = function (ctx) {
                if (!this.hasBorders) {
                    return;
                }
                var padding = this.padding,
                    padding2 = padding * 2;

                ctx.save();

                ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
                ctx.strokeStyle = this.borderColor;

                var scaleX = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX),
                    scaleY = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);

                ctx.lineWidth = 1 / this.borderScaleFactor;
                ctx.scale(scaleX, scaleY);

                var w = this.getWidth(),
                    h = this.getHeight();

                ctx.strokeRect(
                    ~~(-(w / 2) - padding) + 0.5, // offset needed to make lines look sharper
                    ~~(-(h / 2) - padding) + 0.5,
                    ~~(w + padding2),
                    ~~(h + padding2)
                );

                if (this.hasRotatingPoint && !this.hideCorners && !this.lockRotation) {
                    var rotateHeight = (this.flipY ? h : -h) / 2;
                    var rotateWidth = (-w / 2);

                    ctx.beginPath();
                    ctx.moveTo(0, rotateHeight);
                    ctx.lineTo(0, rotateHeight + (this.flipY ? this.rotatingPointOffset : -this.rotatingPointOffset));
                    ctx.closePath();
                    ctx.stroke();
                }
                ctx.restore();
                return this;
            };

            /**
             * Draws corners of an object's bounding box.
             * Requires  properties: width, height, scaleX, scaleY
             * Requires public options: cornersize, padding
             * @param ctx context of canvas element
             * @param obj the operation would operated on it
             * @return {vcan.Object} thisArg
             */
            obj.drawCorners = function (ctx) {
                if (!this.hasControls) {
                    return;
                }
                var size = this.cornersize,
                    size2 = size / 2,
                    padding = this.padding,
                    left = -(this.width / 2),
                    top = -(this.height / 2),
                    _left,
                    _top,
                    sizeX = size / this.scaleX,
                    sizeY = size / this.scaleY,
                    scaleOffsetY = (padding + size2) / this.scaleY,
                    scaleOffsetX = (padding + size2) / this.scaleX,
                    scaleOffsetSizeX = (padding + size2 - size) / this.scaleX,
                    scaleOffsetSizeY = (padding + size2 - size) / this.scaleY,
                    height = this.height;

                ctx.save();
                ctx.fillStyle = this.cornerColor;

                // top-left
                _left = left - scaleOffsetX;
                _top = top - scaleOffsetY;
                ctx.fillRect(_left, _top, sizeX, sizeY);

                // top-right
                _left = left + this.width - scaleOffsetX;
                _top = top - scaleOffsetY;
                ctx.fillRect(_left, _top, sizeX, sizeY);

                // bottom-left
                _left = left - scaleOffsetX;
                _top = top + height + scaleOffsetSizeY;
                ctx.fillRect(_left, _top, sizeX, sizeY);

                // bottom-right
                _left = left + this.width + scaleOffsetSizeX;
                _top = top + height + scaleOffsetSizeY;
                ctx.fillRect(_left, _top, sizeX, sizeY);

                // middle-top
                _left = left + this.width / 2 - scaleOffsetX;
                _top = top - scaleOffsetY;
                ctx.fillRect(_left, _top, sizeX, sizeY);

                // middle-bottom
                _left = left + this.width / 2 - scaleOffsetX;
                _top = top + height + scaleOffsetSizeY;
                ctx.fillRect(_left, _top, sizeX, sizeY);

                // middle-right
                _left = left + this.width + scaleOffsetSizeX;
                _top = top + height / 2 - scaleOffsetY;
                ctx.fillRect(_left, _top, sizeX, sizeY);

                // middle-left
                _left = left - scaleOffsetX;
                _top = top + height / 2 - scaleOffsetY;
                ctx.fillRect(_left, _top, sizeX, sizeY);

                // middle-top-rotate
                if (this.hasRotatingPoint) {
                    _left = left + this.width / 2 - scaleOffsetX;
                    _top = this.flipY ?
                        (top + height + (this.rotatingPointOffset / this.scaleY) - sizeY / 2)
                        : (top - (this.rotatingPointOffset / this.scaleY) - sizeY / 2);

                    ctx.fillRect(_left, _top, sizeX, sizeY);
                }

                ctx.restore();
                return this;
            };

            /**
             * Sets state of an object - `true` makes it active, `false` - inactive
             * @param {Boolean} active
             * @return {vcan.Object} thisArg
             */
            obj.setActive = function (active) {
                this.active = !!active;
                return this;
            },
            /**
             *  sets the particular value either draggable and vice-versa
             */
                obj.dragDrop = function (boolVal) {
                    if (boolVal != undefined) {
                        this.draggable = boolVal;
                    } else {
                        this.draggable = false;
                    }
                },
            /**
             * Sets the coordinates of the draggable boxes in the corners of
             * the image used to scale/rotate it.
             * @method setCornerCoords
             * @param obj the object of which sets the co-ordinates
             */
                //TODO use this instead of obj
                obj.setCornerCoords = function () {
                    //var coords = this.oCoords,
                    var coords = this.oCoords,
                        theta = vcan.utility.degreesToRadians(45 - this.getAngle()),
                        cornerHypotenuse = Math.sqrt(2 * Math.pow(this.cornersize, 2)) / 2,
                        cosHalfOffset = cornerHypotenuse * Math.cos(theta),
                        sinHalfOffset = cornerHypotenuse * Math.sin(theta),
                        sinTh = Math.sin(this.theta),
                        cosTh = Math.cos(this.theta);

                    coords.tl.corner = {
                        tl: {
                            x: coords.tl.x - sinHalfOffset,
                            y: coords.tl.y - cosHalfOffset
                        },
                        tr: {
                            x: coords.tl.x + cosHalfOffset,
                            y: coords.tl.y - sinHalfOffset
                        },
                        bl: {
                            x: coords.tl.x - cosHalfOffset,
                            y: coords.tl.y + sinHalfOffset
                        },
                        br: {
                            x: coords.tl.x + sinHalfOffset,
                            y: coords.tl.y + cosHalfOffset
                        }
                    };

                    coords.tr.corner = {
                        tl: {
                            x: coords.tr.x - sinHalfOffset,
                            y: coords.tr.y - cosHalfOffset
                        },
                        tr: {
                            x: coords.tr.x + cosHalfOffset,
                            y: coords.tr.y - sinHalfOffset
                        },
                        br: {
                            x: coords.tr.x + sinHalfOffset,
                            y: coords.tr.y + cosHalfOffset
                        },
                        bl: {
                            x: coords.tr.x - cosHalfOffset,
                            y: coords.tr.y + sinHalfOffset
                        }
                    };

                    coords.bl.corner = {
                        tl: {
                            x: coords.bl.x - sinHalfOffset,
                            y: coords.bl.y - cosHalfOffset
                        },
                        bl: {
                            x: coords.bl.x - cosHalfOffset,
                            y: coords.bl.y + sinHalfOffset
                        },
                        br: {
                            x: coords.bl.x + sinHalfOffset,
                            y: coords.bl.y + cosHalfOffset
                        },
                        tr: {
                            x: coords.bl.x + cosHalfOffset,
                            y: coords.bl.y - sinHalfOffset
                        }
                    };

                    coords.br.corner = {
                        tr: {
                            x: coords.br.x + cosHalfOffset,
                            y: coords.br.y - sinHalfOffset
                        },
                        bl: {
                            x: coords.br.x - cosHalfOffset,
                            y: coords.br.y + sinHalfOffset
                        },
                        br: {
                            x: coords.br.x + sinHalfOffset,
                            y: coords.br.y + cosHalfOffset
                        },
                        tl: {
                            x: coords.br.x - sinHalfOffset,
                            y: coords.br.y - cosHalfOffset
                        }
                    };

                    coords.ml.corner = {
                        tl: {
                            x: coords.ml.x - sinHalfOffset,
                            y: coords.ml.y - cosHalfOffset
                        },
                        tr: {
                            x: coords.ml.x + cosHalfOffset,
                            y: coords.ml.y - sinHalfOffset
                        },
                        bl: {
                            x: coords.ml.x - cosHalfOffset,
                            y: coords.ml.y + sinHalfOffset
                        },
                        br: {
                            x: coords.ml.x + sinHalfOffset,
                            y: coords.ml.y + cosHalfOffset
                        }
                    };

                    coords.mt.corner = {
                        tl: {
                            x: coords.mt.x - sinHalfOffset,
                            y: coords.mt.y - cosHalfOffset
                        },
                        tr: {
                            x: coords.mt.x + cosHalfOffset,
                            y: coords.mt.y - sinHalfOffset
                        },
                        bl: {
                            x: coords.mt.x - cosHalfOffset,
                            y: coords.mt.y + sinHalfOffset
                        },
                        br: {
                            x: coords.mt.x + sinHalfOffset,
                            y: coords.mt.y + cosHalfOffset
                        }
                    };

                    coords.mr.corner = {
                        tl: {
                            x: coords.mr.x - sinHalfOffset,
                            y: coords.mr.y - cosHalfOffset
                        },
                        tr: {
                            x: coords.mr.x + cosHalfOffset,
                            y: coords.mr.y - sinHalfOffset
                        },
                        bl: {
                            x: coords.mr.x - cosHalfOffset,
                            y: coords.mr.y + sinHalfOffset
                        },
                        br: {
                            x: coords.mr.x + sinHalfOffset,
                            y: coords.mr.y + cosHalfOffset
                        }
                    };

                    coords.mb.corner = {
                        tl: {
                            x: coords.mb.x - sinHalfOffset,
                            y: coords.mb.y - cosHalfOffset
                        },
                        tr: {
                            x: coords.mb.x + cosHalfOffset,
                            y: coords.mb.y - sinHalfOffset
                        },
                        bl: {
                            x: coords.mb.x - cosHalfOffset,
                            y: coords.mb.y + sinHalfOffset
                        },
                        br: {
                            x: coords.mb.x + sinHalfOffset,
                            y: coords.mb.y + cosHalfOffset
                        }
                    };

                    coords.mtr.corner = {
                        tl: {
                            //todo earlier there was obj instead of obj
                            // x: coords.mtr.x - sinHalfOffset + (sinTh * obj.rotatingPointOffset),
                            x: coords.mtr.x - sinHalfOffset + (sinTh * this.rotatingPointOffset),
                            y: coords.mtr.y - cosHalfOffset - (cosTh * this.rotatingPointOffset)
                        },
                        tr: {
                            x: coords.mtr.x + cosHalfOffset + (sinTh * this.rotatingPointOffset),
                            y: coords.mtr.y - sinHalfOffset - (cosTh * this.rotatingPointOffset)
                        },
                        bl: {
                            x: coords.mtr.x - cosHalfOffset + (sinTh * this.rotatingPointOffset),
                            y: coords.mtr.y + sinHalfOffset - (cosTh * this.rotatingPointOffset)
                        },
                        br: {
                            x: coords.mtr.x + sinHalfOffset + (sinTh * this.rotatingPointOffset),
                            y: coords.mtr.y + cosHalfOffset - (cosTh * this.rotatingPointOffset)
                        }
                    };

                };

            /**
             * Returns object's angle value
             * @method getAngle
             * @obj the partiuclar object
             * @return {Number} angle value
             */

            obj.getAngle = function () {
                return this.theta * 180 / Math.PI;
            };

            /**
             * This function does set the passed object in front of the all other objects
             * @param the object should be into front
             * return true in success case
             * return false  in failure case
             */
            obj.setZindex = function () {
                for (var i = 0; i < vcan.main.children.length; i++) {
                    if (this.id == vcan.main.children[i].id) {
                        var delObj = vcan.main.children[i];
                        vcan.main.children.splice(i, 1);
                        break;
                    }
                }

                if (delObj != ' ') {
                    vcan.main.children.push(delObj);
                    return true;
                }

                return false;
            },
            /**
             * This function sets up the current object for do various transform
             * eg:- drag, rotate and scale
             * this function does expects event as parameter
             */
                obj.setupCurrentTransform = function (e) {
                    var obj = vcan.main;
                    var action = 'drag',
                        corner,
                        pointer = vcan.utility.actualPointer(e);

                    if (corner = this.findTargetCorner(e)) {
                        action = (corner === 'ml' || corner === 'mr')
                            ? 'scaleX'
                            : (corner === 'mt' || corner === 'mb')
                            ? 'scaleY'
                            : corner === 'mtr'
                            ? 'rotate'
                            : (this.hasRotatingPoint)
                            ? 'scale'
                            : 'rotate';
                    }

                    obj.currentTransform = {
                        target: this,
                        action: action,
                        scaleX: this.scaleX,
                        scaleY: this.scaleY,
                        offsetX: pointer.x - this.x,
                        offsetY: pointer.y - this.y,
                        ex: pointer.x,
                        ey: pointer.y,
                        x: this.x,
                        y: this.y,
                        theta: this.theta,
                        width: this.width * this.scaleX
                    };

                    obj.currentTransform.original = {
                        x: this.x,
                        y: this.y
                    };
                };

            /**
             * Rotates object by invoking its rotate method
             * @method rotateObject
             * @param x {Number} pointer's x coordinate
             * @param y {Number} pointer's y coordinate
             */

            if (obj.type != 'text') {
                obj.setCoords();
            }

            var cor_cal = vcan.makeDispObject(obj);
            return cor_cal;
        }

    }
})(window);