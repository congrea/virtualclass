// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
    var vcan = window.vcan;

    /**
     * @Class defined rectangle for rectangle
     *  methods initilized for creating rectangle object
     *  in future there can be more properties than one
     */
    /**
     * freeHandDrawing is defined for free hand drawing
     * this class has methods through which the the /freend hand draw object is being drawn
     * this method of this class is called when the user click on canvas
     * this class is assigning as property vcan.main because, The object of this
     * class can not create by addObject class,
     */

    vcan.main.freeHandDrawing = function (obj) {
        return {
            type: 'freeDrawing',
            /**
             * initialize the various variable for free drawing
             *  return the current context
             */
            init: function () {
                this.contextTop = {};
                this.isCurrentlyDrawing = false;
                this.freeDrawingXPoints = [];
                this.freeDrawingYPoints = [];
                this.mdTime = [];

                if (obj.borderColor == undefined) {
                    this.freeDrawingColor = "#000000";
                } else {
                    this.freeDrawingColor = obj.borderColor;
                }

                if (obj.lineWidth != undefined) {
                    this.freeDrawingLineWidth = obj.lineWidth;
                } else {
                    this.freeDrawingLineWidth = "3";
                }

                //IMPORTANT:- this have done during the unit testing
                //this.freeDrawingLineWidth = "3"; //TODO this should be dyanamic
                return this; //IMPORTANT added after unit testing
            },
            /***
             * This function does set up the situation for drawing the the free hand drawing object
             * eg:- context begins, call the moveTo()
             * this function is called when user click on canvas for draw the free hand draw
             * @param ctx current context of canvas
             * @returns
             */
            fhdStart: function (ctx, pointer, crtMuser) {

                var currTime = new Date().getTime();
                var canvas = vcan.main.canvas;

                this.contextTop = ctx;
                this.isCurrentlyDrawing = true;

                this.freeDrawingXPoints.push(pointer.x);
                this.freeDrawingYPoints.push(pointer.y);
                this.contextTop.beginPath();
                this.contextTop.save();

                this.contextTop.moveTo(pointer.x, pointer.y);

                this.mdTime.push(currTime);
                this.contextTop.strokeStyle = this.freeDrawingColor;
                this.contextTop.lineWidth = this.freeDrawingLineWidth;
                this.contextTop.lineCap = this.contextTop.lineJoin = 'round';

            },
            /**
             * through this funciton the application is creting the object(free hand draw) in indeed
             * and storing the creating time in property named mdTime of current freew draw object
             * @param evt expects mouse move event as parameter
             * @returns nothing
             */

            //captureDrawingPath: function(evt) {
            //fhRendering: function(evt) {
            fhRendering: function (pointer, crtMuser) {
                var currTime = new Date().getTime();
                this.freeDrawingXPoints.push(pointer.x);
                this.freeDrawingYPoints.push(pointer.y);

                this.contextTop.lineTo(pointer.x, pointer.y);
                this.contextTop.stroke();
                this.mdTime.push(currTime);
            },
            /**
             * By this function the system finalizes all the co-ordinate as user drawn the
             * free hand drawing object, It created the array by callIng Path class through
             * which contains all the co-ordination of created free hand object
             * Thorugh this function the drawn free hand object would be selectable
             * this function is called when user done mouse up after draw the free hand
             * @returns nothing
             *
             */
            finalizeDrawingPath: function (mcanvas, crtMuser, pointer) {
                var currTime = new Date().getTime();
                this.contextTop.closePath();
                this.isCurrentlyDrawing = false;

                var minX = this.utility.min(this.freeDrawingXPoints),
                    minY = this.utility.min(this.freeDrawingYPoints),
                    maxX = this.utility.max(this.freeDrawingXPoints),
                    maxY = this.utility.max(this.freeDrawingYPoints),
                    ctx = this.contextTop,
                    path = [],
                    xPoint,
                    yPoint,
                    mdTime,
                    xPoints = this.freeDrawingXPoints,
                    yPoints = this.freeDrawingYPoints,
                    mdTimes = this.mdTime;

                path.push('M ', xPoints[0] - minX, ' ', yPoints[0] - minY, ' ', mdTimes[0], ' ');
                for (var i = 1; xPoint = xPoints[i], yPoint = yPoints[i], mdTime = mdTimes[i]; i++) { //NOTE:- this have done during the unit testing
                    path.push('L ', xPoint - minX, ' ', yPoint - minY, ' ', mdTime, ' ');
                }

                // TODO maybe remove Path creation from here, to decouple fabric.Canvas from fabric.Path,
                // and instead fire something like "drawing:completed" event with path string

                path = path.join('');
                if (path === "M 0 0 L 0 0 ") {
                    // do not create 0 width/height paths, as they are rendered inconsistently across browsers
                    // Firefox 4, for example, renders a dot, whereas Chrome 10 renders nothing
                    return;
                }
                var xp = this.freeDrawingXPoints[this.freeDrawingXPoints.length - 1];
                var yp = this.freeDrawingYPoints[this.freeDrawingYPoints.length - 1];
                var p = new vcan.Path(path, this);
                p.mp = {};
                p.mp.x = xp;
                p.mp.y = yp;

                p.init(path);
                //below line is commented out during unit testing
                //p = vcan.main.mcanvas.readyObject(p);	 //this should be done thorugh the script.js
                p = mcanvas.readyObject(p);
                p.coreObj.type = 'freeDrawing'; // this is need to make because we are finializing the path into freedrawing
                p = p.coreObj;

                p.fill = null;

                p.stroke = this.freeDrawingColor;
                p.strokeWidth = this.freeDrawingLineWidth;
                p.minX = minX;
                p.minY = minY;

                this.utility.objAdd(p);

                var resP = vcan.utility.setVal(p, "x", minX + (maxX - minX) / 2);
                resP = vcan.utility.setVal(resP, "y", minY + (maxY - minY) / 2);
                resP.setCoords();

                if (typeof obj == 'object') {
                    this.contextTop.restore();
                }

                vcan.renderAll(this.contextTop);
                return resP;

            },
            utility: {
                /**
                 * Finds maximum value in array (not necessarily "first" one)
                 * @method max
                 * @param {Array} array Array to iterate over
                 * @param {String} byProperty
                 * critical I have removed the cloned function named max
                 */
                max: function (array, byProperty) {
                    if (!array || array.length === 0) {
                        return undefined;
                    }
                    var i = array.length - 1,
                        result = byProperty ? array[i][byProperty] : array[i];
                    if (byProperty) {
                        while (i--) {
                            if (array[i][byProperty] >= result) {
                                result = array[i][byProperty];
                            }
                        }
                    }
                    else {
                        while (i--) {
                            if (array[i] >= result) {
                                result = array[i];
                            }
                        }
                    }
                    return result;
                },
                /**
                 * Finds minimum value in array (not necessarily "first" one)
                 * @method min
                 * @param {Array} array Array to iterate over
                 * @param {String} byProperty
                 */
                min: function (array, byProperty) {
                    if (!array || array.length === 0) {
                        return undefined;
                    }
                    var i = array.length - 1,
                        result = byProperty ? array[i][byProperty] : array[i];
                    if (byProperty) {
                        while (i--) {
                            if (array[i][byProperty] < result) {
                                result = array[i][byProperty];
                            }
                        }
                    } else {
                        while (i--) {
                            if (array[i] < result) {
                                result = array[i];
                            }
                        }
                    }
                    return result;

                },
                objAdd: function (obj) {
                    vcan.main.children.push(obj);
                    return this;
                }
            }
        }
    }
})(window);