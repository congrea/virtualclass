// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */(function (window) {
    var vcan = window.vcan;

    /**
     * This class is used for create the path for each co-ordinate which is drawn by user
     * The paticular path array has some element which have some proeprties
     * eg:- x, y cordinate, made time, and either it is moveTo Point or LineTo point
     * This class has method for render the particular path either the path would came
     * from user' drawn or replay object
     * */
    vcan.Path = function (path, fdObj) {
        return {
            /**
             * @property
             * @type String
             */

            objectType: 'path',
            /**
             * Constructor
             * @method initialize the function through which the co-ordinate would be parased
             * @param path would be array of string on which we can get the different informaiton
             * eg:- x, y cordinate, timing
             * @param {Object} [options] Options object
             */
            init: function (path, options) {
                options = options || {};
                /* TODO this could be disable for now
                 * in future it may required
                 */
                // only m and l is using
                this.commandLengths = {
                    m: 2,
                    l: 2,
                    h: 1,
                    v: 1,
                    c: 6,
                    s: 4,
                    q: 4,
                    t: 2,
                    a: 7
                };

                if (!path) {
                    throw Error('`path` argument is required');
                }
                this.path = path.match && path.match(/[a-zA-Z][^a-zA-Z]*/g);
                if (!this.path) {
                    return;
                }
                this.initializeFromArray(options);
                return this;
            },
            /**
             * @method _initializeFromArray this function does call the
             * function thorugh which all the co-ordination would be parsed
             * and store them into array and returned it
             */

            initializeFromArray: function (options) {
                var isWidthSet = 'width' in options,
                    isHeightSet = 'height' in options;

                this.path = this._parsePath();
                if (!isWidthSet || !isHeightSet) {
                    this.utility.extend(this, this._parseDimensions());
                    if (isWidthSet) {
                        this.width = options.width;
                    }
                    if (isHeightSet) {
                        this.height = options.height;
                    }
                }
            },
            /**
             * this method creats the path(free hand draw) as according to user have drawn free hand into the canvas.
             * @param ctx this is the current conext of canvas.
             * @returns nothing
             * right now not using this function
             */
            _render: function (ctx) {
                var current, // current instruction
                    x = 0, // current x
                    y = 0, // current y
                    controlX = 0, // current control point x
                    controlY = 0, // current control point y
                    tempX,
                    tempY,
                    l = -(this.width / 2),
                    t = -(this.height / 2);

                for (var i = 0, len = this.path.length; i < len; ++i) {
                    current = this.path[i];

                    switch (current[0]) { // first letter
                        case 'L': // lineto, absolute
                            x = current[1];
                            y = current[2];
                            ctx.lineTo(x + l, y + t);
                            break;

                        case 'M': // moveTo, absolute
                            x = current[1];
                            y = current[2];
                            ctx.moveTo(x + l, y + t);
                            break;

                            ctx.closePath();
                            break;
                    }

                }
            },
            /**
             * this funciton draws a point of free hand object
             * @param ctx is the current context path for canvas
             * @param current its an object on wchich different information would be stored eg: x,y cordinate
             * @param l is the horizontal position which will be combined with the x  co-ordinate for line to
             * @param t is the vertical position which will be combined with the y  co-ordinate for line to
             * right now not using
             * @returns nothing
             */
            replay_render: function (ctx, current, l, t) {
                var x = y = 0;
                switch (current[0]) { // first letter
                    case 'L': // lineto, relative
                        x += current[1];
                        y += current[2];

                        ctx.lineTo(x + l, y + t);
                        ctx.stroke();
                        break;

                    case 'M': // moveTo, relative
                        x += current[1];
                        y += current[2];
                        ctx.moveTo(x + l, y + t);
                        break;
                }

            },
            /**
             * Renders the free drawing object on a specified context
             * @method renders this method is called on mouse up after created the  free hand object
             * @param the currenct context of canvas
             * @param {Boolean} noTransform When true, context is not transformed
             * right now not using
             */
            render: function (ctx, noTransform) {

                ctx.save();
                var m = this.transformMatrix;
                if (m) {
                    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                }
                if (!noTransform) {
                    vcan.transform(ctx, this);
                }
                // ctx.globalCompositeOperation = this.fillRule;

                if (this.overlayFill) {
                    ctx.fillStyle = this.overlayFill;
                }
                else if (this.fill) {
                    ctx.fillStyle = this.fill;
                }

                if (this.stroke) {
                    ctx.strokeStyle = this.stroke;
                }
                ctx.beginPath();

                this._render(ctx);

                if (this.fill) {
                    ctx.fill();
                }
                if (this.stroke) {
                    ctx.strokeStyle = this.stroke;
                    ctx.lineWidth = this.strokeWidth;
                    ctx.lineCap = ctx.lineJoin = 'round';
                    ctx.stroke();
                }
                if (!noTransform && this.active) {
                    //alert('hello guys');
                    this.drawBorders(ctx);
                    this.hideCorners || this.drawCorners(ctx);
                }
                ctx.restore();
            },
            /**
             * This function does parse all the co-ordination(Path) and store them into array
             * 0: "M 0 38 1363777101579 ", this would be converted in element of array eg:-
             *    [0] => M,  [1] => 0,  [2] => 38,  [3] => 1363777101579,
             * @method _parsePath
             * returns the array  which contains the above informaiton   [0] => M,  [1] => 0,  [2] => 38,  [3] => 1363777101579
             *
             */
            _parsePath: function () {
                var result = [],
                    currentPath,
                    chunks,
                    parsed;

                for (var i = 0, j, chunksParsed, len = this.path.length; i < len; i++) {
                    var pattern = /\d+\s$/; //TODO the pattern could be more specific
                    var mdTime = pattern.exec(this.path[i]);
                    if (mdTime != null) {
                        var pos = this.path[i].indexOf(mdTime);
                        this.path[i] = this.path[i].substring(0, pos);
                    }
                    currentPath = this.path[i];

                    chunks = currentPath.slice(1).trim().replace(/(\d)-/g, '$1###-').split(/\s|,|###/);
                    chunksParsed = [currentPath.charAt(0)];

                    for (var j = 0, jlen = chunks.length; j < jlen; j++) {
                        parsed = parseFloat(chunks[j]);
                        if (!isNaN(parsed)) {
                            chunksParsed.push(parsed);
                        }
                    }

                    var command = chunksParsed[0].toLowerCase(),
                        commandLength = this.commandLengths[command];

                    if (chunksParsed.length - 1 > commandLength) {

                        for (var k = 1, klen = chunksParsed.length; k < klen; k += commandLength) {
                            if (mdTime == null) {
                                result.push([chunksParsed[0]].concat(chunksParsed.slice(k, k + commandLength)));
                            } else {
                                result.push([chunksParsed[0]].concat(chunksParsed.slice(k, k + commandLength)));
                                chunksParsed.push(mdTime);
                                result.push(chunksParsed);
                            }
                        }
                    } else {
                        if (mdTime != null) {
                            //result.push(chunksParsed);
                            chunksParsed.push(mdTime[0]);
                            result.push(chunksParsed);
                        } else {
                            result.push(chunksParsed);
                        }
                    }
                }

                return result;
            },
            /**
             * @method _parseDimensions
             * It parses the co-ordination and calculate the height and width for box for drawn object free hand
             * This information would be used for select the object for drag and drop operation or other opertation
             * return the object which contains the value of width, height, top, bottom of drawn free hand object
             */
            _parseDimensions: function () {
                var aX = [],
                    aY = [],
                    previousX,
                    previousY,
                    isLowerCase = false,
                    x,
                    y;

                this.path.forEach(function (item, i) {
                    if (item[3] != " ") {
                        //splice(3) is represented making time.
                        var mdTime = item.splice(3);
                    }

                    if (item[0] !== 'H') {
                        previousX = (i === 0) ? this.utility.getX(item) : this.utility.getX(this.path[i - 1]);
                    }
                    if (item[0] !== 'V') {
                        previousY = (i === 0) ? this.utility.getY(item) : this.utility.getY(this.path[i - 1]);
                    }

                    // lowercased letter denotes relative position;
                    // transform to absolute
                    if (item[0] === item[0].toLowerCase()) {
                        isLowerCase = true;
                    }

                    // last 2 items in an array of coordinates are the actualy x/y (except H/V);
                    // collect them
                    // TODO : support relative h/v commands
                    x = isLowerCase
                        ? previousX + this.utility.getX(item)
                        : item[0] === 'V'
                        ? previousX
                        : this.utility.getX(item);

                    y = isLowerCase
                        ? previousY + this.utility.getY(item)
                        : item[0] === 'H'
                        ? previousY
                        : this.utility.getY(item);

                    var val = parseInt(x, 10);
                    if (!isNaN(val)) {
                        aX.push(val);
                    }
                    val = parseInt(y, 10);
                    if (!isNaN(val)) {
                        aY.push(val);
                    }
                    //TODO this can be ticky
                    if (mdTime != undefined) {
                        if (mdTime.length >= 1) {
                            item.push(mdTime[0]);
                        }
                    }

                }, this);

                var minX = fdObj.utility.min(aX),
                    minY = fdObj.utility.min(aY),
                    deltaX = 0,
                    deltaY = 0;

                var o = {
                    y: minY - deltaY,
                    x: minX - deltaX,
                    bottom: fdObj.utility.max(aY) - deltaY,
                    right: fdObj.utility.max(aX) - deltaX
                };

                o.width = o.right - o.x;
                o.height = o.bottom - o.y;
                return o;
            },
            utility: {
                /**
                 *  return the x co-ordinate of path
                 */
                getX: function (item) {
                    if (item[0] === 'H') {
                        return item[1];
                    }
                    return item[item.length - 2];
                },
                /**
                 * return the y co-ordinate of path
                 */
                getY: function (item) {
                    if (item[0] === 'V') {
                        return item[1];
                    }
                    return item[item.length - 1];
                },
                /**
                 * Copies all enumerable properties of one object to another
                 * @method extend
                 * @param {Object} destination Where to copy to
                 * @param {Object} source Where to copy from
                 * TODO the extend of vcan can be use instead of blow function
                 */

                extend: function (destination, source) {
                    // JScript DontEnum bug is not taken care of
                    for (var property in source) {
                        destination[property] = source[property];
                    }
                    return destination;
                }

            }
        };
    }
})(window);