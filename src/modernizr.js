/*! modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-webp-setclasses ! */
!(function (e, n, A) {
  function o(e, n) {
    return typeof e === n;
  }

  function t() {
    let e; let n; let A; let t; let a; let i; let
      l;
    for (const f in r) {
      if (Object.prototype.hasOwnProperty.call(r, f)) {
        if (e = [], n = r[f], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length)) for (A = 0; A < n.options.aliases.length; A++)e.push(n.options.aliases[A].toLowerCase());
        for (t = o(n.fn, 'function') ? n.fn() : n.fn, a = 0; a < e.length; a++)i = e[a], l = i.split('.'), l.length === 1 ? Modernizr[l[0]] = t : (!Modernizr[l[0]] || Modernizr[l[0]] instanceof Boolean || (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])), Modernizr[l[0]][l[1]] = t), s.push((t ? '' : 'no-') + l.join('-'));
      }
    }
  }

  function a(e) {
    let n = u.className; const
      A = Modernizr._config.classPrefix || '';
    if (c && (n = n.baseVal), Modernizr._config.enableJSClass) {
      const o = new RegExp(`(^|\\s)${A}no-js(\\s|$)`);
      n = n.replace(o, `$1${A}js$2`);
    }
    Modernizr._config.enableClasses && (n += ` ${A}${e.join(` ${A}`)}`, c ? u.className.baseVal = n : u.className = n);
  }

  function i(e, n) {
    if (typeof e === 'object') for (const A in e)f(e, A) && i(A, e[A]); else {
      e = e.toLowerCase();
      const o = e.split('.'); let
        t = Modernizr[o[0]];
      if (o.length == 2 && (t = t[o[1]]), typeof t !== 'undefined') return Modernizr;
      n = typeof n === 'function' ? n() : n, o.length == 1 ? Modernizr[o[0]] = n : (!Modernizr[o[0]] || Modernizr[o[0]] instanceof Boolean || (Modernizr[o[0]] = new Boolean(Modernizr[o[0]])), Modernizr[o[0]][o[1]] = n), a([(n && n != 0 ? '' : 'no-') + o.join('-')]), Modernizr._trigger(e, n);
    }
    return Modernizr;
  }

  var s = []; var r = []; const l = {
    _version: '3.5.0',
    _config: {
      classPrefix: '', enableClasses: !0, enableJSClass: !0, usePrefixes: !0,
    },
    _q: [],
    on(e, n) {
      const A = this;
      setTimeout(() => {
        n(A[e]);
      }, 0);
    },
    addTest(e, n, A) {
      r.push({ name: e, fn: n, options: A });
    },
    addAsyncTest(e) {
      r.push({ name: null, fn: e });
    },
  }; var
    Modernizr = function () {
    };
  Modernizr.prototype = l, Modernizr = new Modernizr();
  let f; var u = n.documentElement; var
    c = u.nodeName.toLowerCase() === 'svg';
  !(function () {
    const e = {}.hasOwnProperty;
    f = o(e, 'undefined') || o(e.call, 'undefined') ? function (e, n) {
      return n in e && o(e.constructor.prototype[n], 'undefined');
    } : function (n, A) {
      return e.call(n, A);
    };
  }()), l._l = {}, l.on = function (e, n) {
    this._l[e] || (this._l[e] = []), this._l[e].push(n), Object.prototype.hasOwnProperty.call(Modernizr, e) && setTimeout(() => {
      Modernizr._trigger(e, Modernizr[e]);
    }, 0);
  }, l._trigger = function (e, n) {
    if (this._l[e]) {
      const A = this._l[e];
      setTimeout(() => {
        let e; let
          o;
        for (e = 0; e < A.length; e++)(o = A[e])(n);
      }, 0), delete this._l[e];
    }
  }, Modernizr._q.push(() => {
    l.addTest = i;
  }), Modernizr.addAsyncTest(() => {
    function e(e, n, A) {
      function o(n) {
        const o = n && n.type === 'load' ? t.width == 1 : !1; const
          a = e === 'webp';
        i(e, a && o ? new Boolean(o) : o), A && A(n);
      }

      var t = new Image();
      t.onerror = o, t.onload = o, t.src = n;
    }

    const n = [{
      uri: 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=',
      name: 'webp',
    }, {
      uri: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==',
      name: 'webp.alpha',
    }, {
      uri: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
      name: 'webp.animation',
    }, { uri: 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=', name: 'webp.lossless' }];
    const A = n.shift();
    e(A.name, A.uri, (A) => {
      if (A && A.type === 'load') for (let o = 0; o < n.length; o++)e(n[o].name, n[o].uri);
    });
  }), t(), a(s), delete l.addTest, delete l.addAsyncTest;
  for (let p = 0; p < Modernizr._q.length; p++)Modernizr._q[p]();
  e.Modernizr = Modernizr;
}(window, document));
