/**
 @license @nocompile
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
(function () { /*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
'use strict';

  let r; const aa = typeof Object.defineProperties === 'function' ? Object.defineProperty : function (a, b, c) {
    a != Array.prototype && a != Object.prototype && (a[b] = c.value);
  };
  const fa = typeof window !== 'undefined' && window === this ? this : typeof global !== 'undefined' && global != null ? global : this;

  function ha() {
    ha = function () {
    };
    fa.Symbol || (fa.Symbol = ia);
  }

  var ia = (function () {
    let a = 0;
    return function (b) {
      return `jscomp_symbol_${b || ''}${a++}`;
    };
  }());

  function ja() {
    ha();
    let a = fa.Symbol.iterator;
    a || (a = fa.Symbol.iterator = fa.Symbol('iterator'));
    typeof Array.prototype[a] !== 'function' && aa(Array.prototype, a, {
      configurable: !0,
      writable: !0,
      value() {
        return ka(this);
      },
    });
    ja = function () {
    };
  }

  function ka(a) {
    let b = 0;
    return la(() => (b < a.length ? { done: !1, value: a[b++] } : { done: !0 }));
  }

  function la(a) {
    ja();
    a = { next: a };
    a[fa.Symbol.iterator] = function () {
      return this;
    };
    return a;
  }

  function ma(a) {
    ja();
    const b = a[Symbol.iterator];
    return b ? b.call(a) : ka(a);
  }

  function na(a) {
    for (var b, c = []; !(b = a.next()).done;)c.push(b.value);
    return c;
  }

  let oa;
  if (typeof Object.setPrototypeOf === 'function') oa = Object.setPrototypeOf; else {
    let pa;
    a: {
      const qa = { Na: !0 }; const
        ra = {};
      try {
        ra.__proto__ = qa;
        pa = ra.Na;
        break a;
      } catch (a) {
      }
      pa = !1;
    }
    oa = pa ? function (a, b) {
      a.__proto__ = b;
      if (a.__proto__ !== b) throw new TypeError(`${a} is not extensible`);
      return a;
    } : null;
  }
  const sa = oa;

  function ta() {
    this.f = !1;
    this.b = null;
    this.fa = void 0;
    this.a = 1;
    this.G = 0;
    this.c = null;
  }

  function ua(a) {
    if (a.f) throw new TypeError('Generator is already running');
    a.f = !0;
  }

  ta.prototype.m = function (a) {
    this.fa = a;
  };
  function va(a, b) {
    a.c = { Qa: b, Ua: !0 };
    a.a = a.G;
  }

  ta.prototype.return = function (a) {
    this.c = { return: a };
    this.a = this.G;
  };
  function wa(a, b) {
    a.a = 3;
    return { value: b };
  }

  function xa(a) {
    this.a = new ta();
    this.b = a;
  }

  function ya(a, b) {
    ua(a.a);
    const c = a.a.b;
    if (c) {
      return Ba(a, 'return' in c ? c.return : a => ({ value: a, done: !0 }), b, a.a.return);
    }
    a.a.return(b);
    return Ca(a);
  }

  function Ba(a, b, c, d) {
    try {
      const e = b.call(a.a.b, c);
      if (!(e instanceof Object)) throw new TypeError(`Iterator result ${e} is not an object`);
      if (!e.done) return a.a.f = !1, e;
      var f = e.value;
    } catch (g) {
      return a.a.b = null, va(a.a, g), Ca(a);
    }
    a.a.b = null;
    d.call(a.a, f);
    return Ca(a);
  }

  function Ca(a) {
    for (; a.a.a;) {
      try {
        var b = a.b(a.a);
        if (b) return a.a.f = !1, { value: b.value, done: !1 };
      } catch (c) {
        a.a.fa = void 0, va(a.a, c);
      }
    }
    a.a.f = !1;
    if (a.a.c) {
      b = a.a.c;
      a.a.c = null;
      if (b.Ua) throw b.Qa;
      return { value: b.return, done: !0 };
    }
    return { value: void 0, done: !0 };
  }

  function Da(a) {
    this.next = function (b) {
      ua(a.a);
      a.a.b ? b = Ba(a, a.a.b.next, b, a.a.m) : (a.a.m(b), b = Ca(a));
      return b;
    };
    this.throw = function (b) {
      ua(a.a);
      a.a.b ? b = Ba(a, a.a.b.throw, b, a.a.m) : (va(a.a, b), b = Ca(a));
      return b;
    };
    this.return = function (b) {
      return ya(a, b);
    };
    ja();
    this[Symbol.iterator] = function () {
      return this;
    };
  }

  function Ea(a, b) {
    b = new Da(new xa(b));
    sa && sa(b, a.prototype);
    return b;
  }

  (function () {
    if (!(function () {
      const a = document.createEvent('Event');
      a.initEvent('foo', !0, !0);
      a.preventDefault();
      return a.defaultPrevented;
    }())) {
      const a = Event.prototype.preventDefault;
      Event.prototype.preventDefault = function () {
        this.cancelable && (a.call(this), Object.defineProperty(this, 'defaultPrevented', {
          get() {
            return !0;
          },
          configurable: !0,
        }));
      };
    }
    let b = /Trident/.test(navigator.userAgent);
    if (!window.CustomEvent || b && typeof window.CustomEvent !== 'function') {
      window.CustomEvent = function (a, b) {
        b = b || {};
        const c = document.createEvent('CustomEvent');
        c.initCustomEvent(a, !!b.bubbles, !!b.cancelable, b.detail);
        return c;
      }, window.CustomEvent.prototype = window.Event.prototype;
    }
    if (!window.Event || b && typeof window.Event !== 'function') {
      const c = window.Event;
      window.Event = function (a, b) {
        b = b || {};
        const c = document.createEvent('Event');
        c.initEvent(a, !!b.bubbles, !!b.cancelable);
        return c;
      };
      if (c) for (var d in c)window.Event[d] = c[d];
      window.Event.prototype = c.prototype;
    }
    if (!window.MouseEvent || b && typeof window.MouseEvent !== 'function') {
      b = window.MouseEvent;
      window.MouseEvent = function (a,
        b) {
        b = b || {};
        const c = document.createEvent('MouseEvent');
        c.initMouseEvent(a, !!b.bubbles, !!b.cancelable, b.view || window, b.detail, b.screenX, b.screenY, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, b.relatedTarget);
        return c;
      };
      if (b) for (d in b)window.MouseEvent[d] = b[d];
      window.MouseEvent.prototype = b.prototype;
    }
    Array.from || (Array.from = function (a) {
      return [].slice.call(a);
    });
    Object.assign || (Object.assign = function (a, b) {
      for (var c = [].slice.call(arguments, 1), d = 0, e; d < c.length; d++) if (e = c[d]) for (let f = a, n = e, p = Object.getOwnPropertyNames(n), G = 0; G < p.length; G++)e = p[G], f[e] = n[e];
      return a;
    });
  }(window.WebComponents));
  (function () {
    function a() {
    }

    function b(a, b) {
      if (!a.childNodes.length) return [];
      switch (a.nodeType) {
        case Node.DOCUMENT_NODE:
          return R.call(a, b);
        case Node.DOCUMENT_FRAGMENT_NODE:
          return yb.call(a, b);
        default:
          return w.call(a, b);
      }
    }

    const c = typeof HTMLTemplateElement === 'undefined';
    const d = !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment); let
      e = !1;
    /Trident/.test(navigator.userAgent) && (function () {
      function a(a, b) {
        if (a instanceof DocumentFragment) for (var d; d = a.firstChild;)c.call(this, d, b); else {
          c.call(this,
            a, b);
        }
        return a;
      }

      e = !0;
      const b = Node.prototype.cloneNode;
      Node.prototype.cloneNode = function (a) {
        a = b.call(this, a);
        this instanceof DocumentFragment && (a.__proto__ = DocumentFragment.prototype);
        return a;
      };
      DocumentFragment.prototype.querySelectorAll = HTMLElement.prototype.querySelectorAll;
      DocumentFragment.prototype.querySelector = HTMLElement.prototype.querySelector;
      Object.defineProperties(DocumentFragment.prototype, {
        nodeType: {
          get() {
            return Node.DOCUMENT_FRAGMENT_NODE;
          },
          configurable: !0,
        },
        localName: {
          get() {
          },
          configurable: !0,
        },
        nodeName: {
          get() {
            return '#document-fragment';
          },
          configurable: !0,
        },
      });
      var c = Node.prototype.insertBefore;
      Node.prototype.insertBefore = a;
      const d = Node.prototype.appendChild;
      Node.prototype.appendChild = function (b) {
        b instanceof DocumentFragment ? a.call(this, b, null) : d.call(this, b);
        return b;
      };
      const f = Node.prototype.removeChild; const
        g = Node.prototype.replaceChild;
      Node.prototype.replaceChild = function (b, c) {
        b instanceof DocumentFragment ? (a.call(this, b, c), f.call(this, c)) : g.call(this, b, c);
        return c;
      };
      Document.prototype.createDocumentFragment = function () {
        const a = this.createElement('df');
        a.__proto__ = DocumentFragment.prototype;
        return a;
      };
      const h = Document.prototype.importNode;
      Document.prototype.importNode = function (a, b) {
        b = h.call(this, a, b || !1);
        a instanceof DocumentFragment && (b.__proto__ = DocumentFragment.prototype);
        return b;
      };
    }());
    const f = Node.prototype.cloneNode; const g = Document.prototype.createElement; const h = Document.prototype.importNode;
    const k = Node.prototype.removeChild; const l = Node.prototype.appendChild; const n = Node.prototype.replaceChild;
    const p = DOMParser.prototype.parseFromString;
    const G = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML') || {
      get() {
        return this.innerHTML;
      },
      set(a) {
        this.innerHTML = a;
      },
    }; const u = Object.getOwnPropertyDescriptor(window.Node.prototype, 'childNodes') || {
      get() {
        return this.childNodes;
      },
    }; var w = Element.prototype.querySelectorAll; var R = Document.prototype.querySelectorAll;
    var yb = DocumentFragment.prototype.querySelectorAll; const
      zb = (function () {
        if (!c) {
          let a = document.createElement('template'); const
            b = document.createElement('template');
          b.content.appendChild(document.createElement('div'));
          a.content.appendChild(b);
          a = a.cloneNode(!0);
          return a.content.childNodes.length === 0 || a.content.firstChild.content.childNodes.length === 0 || d;
        }
      }());
    if (c) {
      const U = document.implementation.createHTMLDocument('template'); let Ma = !0;
      let q = document.createElement('style');
      q.textContent = 'template{display:none;}';
      const za = document.head;
      za.insertBefore(q, za.firstElementChild);
      a.prototype = Object.create(HTMLElement.prototype);
      const da = !document.createElement('div').hasOwnProperty('innerHTML');
      a.R = function (b) {
        if (!b.content && b.namespaceURI
          === document.documentElement.namespaceURI) {
          b.content = U.createDocumentFragment();
          for (var c; c = b.firstChild;)l.call(b.content, c);
          if (da) b.__proto__ = a.prototype; else if (b.cloneNode = function (b) {
            return a.b(this, b);
          }, Ma) {
            try {
              m(b), y(b);
            } catch (Hh) {
              Ma = !1;
            }
          }
          a.a(b.content);
        }
      };
      const ba = {
        option: ['select'],
        thead: ['table'],
        col: ['colgroup', 'table'],
        tr: ['tbody', 'table'],
        th: ['tr', 'tbody', 'table'],
        td: ['tr', 'tbody', 'table'],
      }; var m = function (b) {
        Object.defineProperty(b, 'innerHTML', {
          get() {
            return ea(this);
          },
          set(b) {
            const c = ba[(/<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(b)
            || ['', ''])[1].toLowerCase()];
            if (c) for (var d = 0; d < c.length; d++)b = `<${c[d]}>${b}</${c[d]}>`;
            U.body.innerHTML = b;
            for (a.a(U); this.content.firstChild;)k.call(this.content, this.content.firstChild);
            b = U.body;
            if (c) for (d = 0; d < c.length; d++)b = b.lastChild;
            for (; b.firstChild;)l.call(this.content, b.firstChild);
          },
          configurable: !0,
        });
      }; var
        y = function (a) {
          Object.defineProperty(a, 'outerHTML', {
            get() {
              return `<template>${this.innerHTML}</template>`;
            },
            set(a) {
              if (this.parentNode) {
                U.body.innerHTML = a;
                for (a = this.ownerDocument.createDocumentFragment(); U.body.firstChild;) {
                  l.call(a,
                    U.body.firstChild);
                }
                n.call(this.parentNode, a, this);
              } else throw Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");
            },
            configurable: !0,
          });
        };
      m(a.prototype);
      y(a.prototype);
      a.a = function (c) {
        c = b(c, 'template');
        for (var d = 0, e = c.length, f; d < e && (f = c[d]); d++)a.R(f);
      };
      document.addEventListener('DOMContentLoaded', () => {
        a.a(document);
      });
      Document.prototype.createElement = function () {
        const b = g.apply(this, arguments);
        b.localName === 'template' && a.R(b);
        return b;
      };
      DOMParser.prototype.parseFromString = function () {
        const b = p.apply(this, arguments);
        a.a(b);
        return b;
      };
      Object.defineProperty(HTMLElement.prototype, 'innerHTML', {
        get() {
          return ea(this);
        },
        set(b) {
          G.set.call(this, b);
          a.a(this);
        },
        configurable: !0,
        enumerable: !0,
      });
      const ca = /[&\u00A0"]/g; const Ab = /[&\u00A0<>]/g; const
        Na = function (a) {
          switch (a) {
            case '&':
              return '&amp;';
            case '<':
              return '&lt;';
            case '>':
              return '&gt;';
            case '"':
              return '&quot;';
            case '\u00a0':
              return '&nbsp;';
          }
        };
      q = function (a) {
        for (var b = {}, c = 0; c < a.length; c++)b[a[c]] = !0;
        return b;
      };
      const Aa = q('area base br col command embed hr img input keygen link meta param source track wbr'.split(' '));
      const Oa = q('style script xmp iframe noembed noframes plaintext noscript'.split(' ')); var
        ea = function (a, b) {
          a.localName === 'template' && (a = a.content);
          for (var c = '', d = b ? b(a) : u.get.call(a), e = 0, f = d.length, g; e < f && (g = d[e]); e++) {
            a: {
              var h = g;
              let k = a;
              const l = b;
              switch (h.nodeType) {
                case Node.ELEMENT_NODE:
                  for (var n = h.localName, m = `<${n}`, p = h.attributes, w = 0; k = p[w]; w++)m += ` ${k.name}="${k.value.replace(ca, Na)}"`;
                  m += '>';
                  h = Aa[n] ? m : `${m + ea(h, l)}</${n}>`;
                  break a;
                case Node.TEXT_NODE:
                  h = h.data;
                  h = k && Oa[k.localName] ? h : h.replace(Ab, Na);
                  break a;
                case Node.COMMENT_NODE:
                  h = `\x3c!--${h.data}--\x3e`;
                  break a;
                default:
                  throw window.console.error(h), Error('not implemented');
              }
            }
            c += h;
          }
          return c;
        };
    }
    if (c || zb) {
      a.b = function (a, b) {
        const c = f.call(a, !1);
        this.R && this.R(c);
        b && (l.call(c.content, f.call(a.content, !0)), Pa(c.content, a.content));
        return c;
      };
      var Pa = function (c, d) {
        if (d.querySelectorAll && (d = b(d, 'template'), d.length !== 0)) {
          c = b(c, 'template');
          for (var e = 0, f = c.length, g, h; e < f; e++)h = d[e], g = c[e], a && a.R && a.R(h), n.call(g.parentNode, tf.call(h, !0), g);
        }
      }; var tf = Node.prototype.cloneNode = function (b) {
        if (!e && d && this instanceof DocumentFragment) if (b) var c = uf.call(this.ownerDocument, this, !0); else return this.ownerDocument.createDocumentFragment(); else this.nodeType === Node.ELEMENT_NODE && this.localName === 'template' && this.namespaceURI == document.documentElement.namespaceURI ? c = a.b(this, b) : c = f.call(this, b);
        b && Pa(c, this);
        return c;
      }; var
        uf = Document.prototype.importNode = function (c, d) {
          d = d || !1;
          if (c.localName === 'template') return a.b(c, d);
          const e = h.call(this, c, d);
          if (d) {
            Pa(e, c);
            c = b(e, 'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');
            for (var f, k = 0; k < c.length; k++) {
              f = c[k];
              d = g.call(document, 'script');
              d.textContent = f.textContent;
              for (var l = f.attributes, m = 0, p; m < l.length; m++)p = l[m], d.setAttribute(p.name, p.value);
              n.call(f.parentNode, d, f);
            }
          }
          return e;
        };
    }
    c && (window.HTMLTemplateElement = a);
  }());
  const Fa = setTimeout;

  function Ga() {
  }

  function Ha(a, b) {
    return function () {
      a.apply(b, arguments);
    };
  }

  function t(a) {
    if (!(this instanceof t)) throw new TypeError('Promises must be constructed via new');
    if (typeof a !== 'function') throw new TypeError('not a function');
    this.J = 0;
    this.wa = !1;
    this.A = void 0;
    this.U = [];
    Ia(a, this);
  }

  function Ja(a, b) {
    for (; a.J === 3;)a = a.A;
    a.J === 0 ? a.U.push(b) : (a.wa = !0, Ka(() => {
      const c = a.J === 1 ? b.Wa : b.Xa;
      if (c === null) (a.J === 1 ? La : Qa)(b.ra, a.A); else {
        try {
          var d = c(a.A);
        } catch (e) {
          Qa(b.ra, e);
          return;
        }
        La(b.ra, d);
      }
    }));
  }

  function La(a, b) {
    try {
      if (b === a) throw new TypeError('A promise cannot be resolved with itself.');
      if (b && (typeof b === 'object' || typeof b === 'function')) {
        const c = b.then;
        if (b instanceof t) {
          a.J = 3;
          a.A = b;
          Ra(a);
          return;
        }
        if (typeof c === 'function') {
          Ia(Ha(c, b), a);
          return;
        }
      }
      a.J = 1;
      a.A = b;
      Ra(a);
    } catch (d) {
      Qa(a, d);
    }
  }

  function Qa(a, b) {
    a.J = 2;
    a.A = b;
    Ra(a);
  }

  function Ra(a) {
    a.J === 2 && a.U.length === 0 && Ka(() => {
      a.wa || typeof console !== 'undefined' && console && console.warn('Possible Unhandled Promise Rejection:', a.A);
    });
    for (let b = 0, c = a.U.length; b < c; b++)Ja(a, a.U[b]);
    a.U = null;
  }

  function Sa(a, b, c) {
    this.Wa = typeof a === 'function' ? a : null;
    this.Xa = typeof b === 'function' ? b : null;
    this.ra = c;
  }

  function Ia(a, b) {
    let c = !1;
    try {
      a((a) => {
        c || (c = !0, La(b, a));
      }, (a) => {
        c || (c = !0, Qa(b, a));
      });
    } catch (d) {
      c || (c = !0, Qa(b, d));
    }
  }

  t.prototype.catch = function (a) {
    return this.then(null, a);
  };
  t.prototype.then = function (a, b) {
    const c = new this.constructor(Ga);
    Ja(this, new Sa(a, b, c));
    return c;
  };
  t.prototype.finally = function (a) {
    const b = this.constructor;
    return this.then(c => b.resolve(a()).then(() => c), c => b.resolve(a()).then(() => b.reject(c)));
  };
  function Ta(a) {
    return new t(((b, c) => {
      function d(a, g) {
        try {
          if (g && (typeof g === 'object' || typeof g === 'function')) {
            const h = g.then;
            if (typeof h === 'function') {
              h.call(g, (b) => {
                d(a, b);
              }, c);
              return;
            }
          }
          e[a] = g;
          --f === 0 && b(e);
        } catch (n) {
          c(n);
        }
      }

      if (!a || typeof a.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var e = Array.prototype.slice.call(a);
      if (e.length === 0) return b([]);
      for (var f = e.length, g = 0; g < e.length; g++)d(g, e[g]);
    }));
  }

  function Ua(a) {
    return a && typeof a === 'object' && a.constructor === t ? a : new t(((b) => {
      b(a);
    }));
  }

  function Va(a) {
    return new t(((b, c) => {
      c(a);
    }));
  }

  function Wa(a) {
    return new t(((b, c) => {
      for (let d = 0, e = a.length; d < e; d++)a[d].then(b, c);
    }));
  }

  var Ka = typeof setImmediate === 'function' && function (a) {
    setImmediate(a);
  } || function (a) {
    Fa(a, 0);
  };
  /*

   Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  if (!window.Promise) {
    window.Promise = t;
    t.prototype.then = t.prototype.then;
    t.all = Ta;
    t.race = Wa;
    t.resolve = Ua;
    t.reject = Va;
    const Xa = document.createTextNode(''); const
      Ya = [];
    (new MutationObserver((() => {
      for (var a = Ya.length, b = 0; b < a; b++)Ya[b]();
      Ya.splice(0, a);
    }))).observe(Xa, { characterData: !0 });
    Ka = function (a) {
      Ya.push(a);
      Xa.textContent = Xa.textContent.length > 0 ? '' : 'a';
    };
  }

  /*
   Copyright (C) 2015 by WebReflection

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.

   */
  (function (a, b) {
    if (!(b in a)) {
      var c = typeof global === typeof c ? window : global; let d = 0; const e = `${Math.random()}`;
      const f = `__\u0001symbol@@${e}`; const g = a.getOwnPropertyNames; const h = a.getOwnPropertyDescriptor; const k = a.create;
      const l = a.keys; const n = a.freeze || a; const p = a.defineProperty; const G = a.defineProperties;
      const u = h(a, 'getOwnPropertyNames'); const w = a.prototype; const R = w.hasOwnProperty; const yb = w.propertyIsEnumerable;
      const zb = w.toString; const U = function (a, b, c) {
        R.call(a, f) || p(a, f, {
          enumerable: !1, configurable: !1, writable: !1, value: {},
        });
        a[f][`@@${b}`] = c;
      }; const Ma = function (a, b) {
        const c = k(a);
        g(b).forEach((a) => {
          ba.call(b,
            a) && Aa(c, a, b[a]);
        });
        return c;
      }; const q = function () {
      }; const za = function (a) {
        return a != f && !R.call(ca, a);
      }; const da = function (a) {
        return a != f && R.call(ca, a);
      }; var ba = function (a) {
        const b = `${a}`;
        return da(b) ? R.call(this, b) && this[f][`@@${b}`] : yb.call(this, a);
      }; const m = function (b) {
        p(w, b, {
          enumerable: !1,
          configurable: !0,
          get: q,
          set(a) {
            ea(this, b, {
              enumerable: !1, configurable: !0, writable: !0, value: a,
            });
            U(this, b, !0);
          },
        });
        return n(ca[b] = p(a(b), 'constructor', Ab));
      }; const y = function (a) {
        if (this && this !== c) throw new TypeError('Symbol is not a constructor');
        return m('__\u0001symbol:'.concat(a
            || '', e, ++d));
      }; var ca = k(null); var Ab = { value: y }; const Na = function (a) {
        return ca[a];
      }; var Aa = function (a, b, c) {
        const d = `${b}`;
        if (da(d)) {
          b = ea;
          if (c.enumerable) {
            var e = k(c);
            e.enumerable = !1;
          } else e = c;
          b(a, d, e);
          U(a, d, !!c.enumerable);
        } else p(a, b, c);
        return a;
      }; const
        Oa = function (a) {
          return g(a).filter(da).map(Na);
        };
      u.value = Aa;
      p(a, 'defineProperty', u);
      u.value = Oa;
      p(a, b, u);
      u.value = function (a) {
        return g(a).filter(za);
      };
      p(a, 'getOwnPropertyNames', u);
      u.value = function (a, b) {
        const c = Oa(b);
        c.length ? l(b).concat(c).forEach((c) => {
          ba.call(b, c) && Aa(a, c, b[c]);
        }) : G(a,
          b);
        return a;
      };
      p(a, 'defineProperties', u);
      u.value = ba;
      p(w, 'propertyIsEnumerable', u);
      u.value = y;
      p(c, 'Symbol', u);
      u.value = function (a) {
        a = '__\u0001symbol:'.concat('__\u0001symbol:', a, e);
        return a in w ? ca[a] : m(a);
      };
      p(y, 'for', u);
      u.value = function (a) {
        if (za(a)) throw new TypeError(`${a} is not a symbol`);
        return R.call(ca, a) ? a.slice(20, -e.length) : void 0;
      };
      p(y, 'keyFor', u);
      u.value = function (a, b) {
        const c = h(a, b);
        c && da(b) && (c.enumerable = ba.call(a, b));
        return c;
      };
      p(a, 'getOwnPropertyDescriptor', u);
      u.value = function (a, b) {
        return arguments.length
        === 1 ? k(a) : Ma(a, b);
      };
      p(a, 'create', u);
      u.value = function () {
        const a = zb.call(this);
        return a === '[object String]' && da(this) ? '[object Symbol]' : a;
      };
      p(w, 'toString', u);
      try {
        var ea = k(p({}, '__\u0001symbol:', {
          get() {
            return p(this, '__\u0001symbol:', { value: !1 })['__\u0001symbol:'];
          },
        }))['__\u0001symbol:'] || p;
      } catch (Pa) {
        ea = function (a, b, c) {
          const d = h(w, b);
          delete w[b];
          p(a, b, c);
          p(w, b, d);
        };
      }
    }
  }(Object, 'getOwnPropertySymbols'));
  (function (a) {
    const b = a.defineProperty; const c = a.prototype; const d = c.toString; let
      e;
    'iterator match replace search split hasInstance isConcatSpreadable unscopables species toPrimitive toStringTag'.split(' ').forEach((f) => {
      if (!(f in Symbol)) {
        switch (b(Symbol, f, { value: Symbol(f) }), f) {
          case 'toStringTag':
            e = a.getOwnPropertyDescriptor(c, 'toString'), e.value = function () {
              const a = d.call(this); const
                b = this[Symbol.toStringTag];
              return typeof b === 'undefined' ? a : `[object ${b}]`;
            }, b(c, 'toString', e);
        }
      }
    });
  }(Object, Symbol));
  (function (a, b, c) {
    function d() {
      return this;
    }

    b[a] || (b[a] = function () {
      let b = 0; const c = this; const
        g = {
          next() {
            const a = c.length <= b;
            return a ? { done: a } : { done: a, value: c[b++] };
          },
        };
      g[a] = d;
      return g;
    });
    c[a] || (c[a] = function () {
      const b = String.fromCodePoint; const c = this; let g = 0; const h = c.length; const
        k = {
          next() {
            const a = h <= g; const
              d = a ? '' : b(c.codePointAt(g));
            g += d.length;
            return a ? { done: a } : { done: a, value: d };
          },
        };
      k[a] = d;
      return k;
    });
  }(Symbol.iterator, Array.prototype, String.prototype));
  /*

   Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  Object.keys = function (a) {
    return Object.getOwnPropertyNames(a).filter(b => (b = Object.getOwnPropertyDescriptor(a, b)) && b.enumerable);
  };
  const Za = window.Symbol.iterator;
  String.prototype[Za] && String.prototype.codePointAt || (String.prototype[Za] = function $a() {
    let b; const
      c = this;
    return Ea($a, (d) => {
      d.a == 1 && (b = 0);
      if (d.a != 3) return b < c.length ? d = wa(d, c[b]) : (d.a = 0, d = void 0), d;
      b++;
      d.a = 2;
    });
  });
  Set.prototype[Za] || (Set.prototype[Za] = function ab() {
    let b; const c = this; let
      d;
    return Ea(ab, (e) => {
      e.a == 1 && (b = [], c.forEach((c) => {
        b.push(c);
      }), d = 0);
      if (e.a != 3) return d < b.length ? e = wa(e, b[d]) : (e.a = 0, e = void 0), e;
      d++;
      e.a = 2;
    });
  });
  Map.prototype[Za] || (Map.prototype[Za] = function bb() {
    let b; const c = this; let
      d;
    return Ea(bb, (e) => {
      e.a == 1 && (b = [], c.forEach((c, d) => {
        b.push([d, c]);
      }), d = 0);
      if (e.a != 3) return d < b.length ? e = wa(e, b[d]) : (e.a = 0, e = void 0), e;
      d++;
      e.a = 2;
    });
  });
  /*

   Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  window.WebComponents = window.WebComponents || { flags: {} };
  const cb = document.querySelector('script[src*="webcomponents-bundle"]'); const db = /wc-(.+)/; const
    v = {};
  if (!v.noOpts) {
    location.search.slice(1).split('&').forEach((a) => {
      a = a.split('=');
      let b;
      a[0] && (b = a[0].match(db)) && (v[b[1]] = a[1] || !0);
    });
    if (cb) for (let eb = 0, fb = void 0; fb = cb.attributes[eb]; eb++)fb.name !== 'src' && (v[fb.name] = fb.value || !0);
    if (v.log && v.log.split) {
      const gb = v.log.split(',');
      v.log = {};
      gb.forEach((a) => {
        v.log[a] = !0;
      });
    } else v.log = {};
  }
  window.WebComponents.flags = v;
  const hb = v.shadydom;
  hb && (window.ShadyDOM = window.ShadyDOM || {}, window.ShadyDOM.force = hb);
  const ib = v.register || v.ce;
  ib && window.customElements && (window.customElements.forcePolyfill = ib);
  /*

   Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */
  function jb() {
    this.za = this.root = null;
    this.ea = !1;
    this.N = this.$ = this.oa = this.assignedSlot = this.assignedNodes = this.S = null;
    this.childNodes = this.nextSibling = this.previousSibling = this.lastChild = this.firstChild = this.parentNode = this.V = void 0;
    this.Ea = this.ua = !1;
    this.Z = {};
  }

  jb.prototype.toJSON = function () {
    return {};
  };
  function x(a) {
    a.ma || (a.ma = new jb());
    return a.ma;
  }

  function z(a) {
    return a && a.ma;
  }
  const A = window.ShadyDOM || {};
  A.Sa = !(!Element.prototype.attachShadow || !Node.prototype.getRootNode);
  const kb = Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild');
  A.K = !!(kb && kb.configurable && kb.get);
  A.qa = A.force || !A.Sa;
  const lb = navigator.userAgent.match('Trident'); const
    mb = navigator.userAgent.match('Edge');
  void 0 === A.Ba && (A.Ba = A.K && (lb || mb));
  function nb(a) {
    return (a = z(a)) && void 0 !== a.firstChild;
  }

  function B(a) {
    return a.Ja === 'ShadyRoot';
  }

  function ob(a) {
    a = a.getRootNode();
    if (B(a)) return a;
  }

  const pb = Element.prototype;
  const qb = pb.matches || pb.matchesSelector || pb.mozMatchesSelector || pb.msMatchesSelector || pb.oMatchesSelector || pb.webkitMatchesSelector;

  function rb(a, b) {
    if (a && b) {
      for (let c = Object.getOwnPropertyNames(b), d = 0, e = void 0; d < c.length && (e = c[d]); d++) {
        const f = e; const g = a; const
          h = Object.getOwnPropertyDescriptor(b, f);
        h && Object.defineProperty(g, f, h);
      }
    }
  }

  function sb(a, b) {
    for (var c = [], d = 1; d < arguments.length; ++d)c[d - 1] = arguments[d];
    for (d = 0; d < c.length; d++)rb(a, c[d]);
    return a;
  }

  function tb(a, b) {
    for (const c in b)a[c] = b[c];
  }

  const ub = document.createTextNode(''); let vb = 0; const
    wb = [];
  (new MutationObserver((() => {
    for (; wb.length;) {
      try {
        wb.shift()();
      } catch (a) {
        throw ub.textContent = vb++, a;
      }
    }
  }))).observe(ub, { characterData: !0 });
  function xb(a) {
    wb.push(a);
    ub.textContent = vb++;
  }

  const Bb = !!document.contains;

  function Cb(a, b) {
    for (; b;) {
      if (b == a) return !0;
      b = b.parentNode;
    }
    return !1;
  }

  function Db(a) {
    for (let b = a.length - 1; b >= 0; b--) {
      const c = a[b]; const
        d = c.getAttribute('id') || c.getAttribute('name');
      d && d !== 'length' && isNaN(d) && (a[d] = c);
    }
    a.item = function (b) {
      return a[b];
    };
    a.namedItem = function (b) {
      if (b !== 'length' && isNaN(b) && a[b]) return a[b];
      for (let c = ma(a), d = c.next(); !d.done; d = c.next()) if (d = d.value, (d.getAttribute('id') || d.getAttribute('name')) == b) return d;
      return null;
    };
    return a;
  }
  const Eb = []; let
    Fb;

  function Gb(a) {
    Fb || (Fb = !0, xb(Hb));
    Eb.push(a);
  }

  function Hb() {
    Fb = !1;
    for (var a = !!Eb.length; Eb.length;)Eb.shift()();
    return a;
  }

  Hb.list = Eb;
  function Ib() {
    this.a = !1;
    this.addedNodes = [];
    this.removedNodes = [];
    this.ca = new Set();
  }

  function Jb(a) {
    a.a || (a.a = !0, xb(() => {
      a.flush();
    }));
  }

  Ib.prototype.flush = function () {
    if (this.a) {
      this.a = !1;
      const a = this.takeRecords();
      a.length && this.ca.forEach((b) => {
        b(a);
      });
    }
  };
  Ib.prototype.takeRecords = function () {
    if (this.addedNodes.length || this.removedNodes.length) {
      const a = [{ addedNodes: this.addedNodes, removedNodes: this.removedNodes }];
      this.addedNodes = [];
      this.removedNodes = [];
      return a;
    }
    return [];
  };
  function Kb(a, b) {
    const c = x(a);
    c.S || (c.S = new Ib());
    c.S.ca.add(b);
    const d = c.S;
    return {
      Ia: b,
      P: d,
      Ka: a,
      takeRecords() {
        return d.takeRecords();
      },
    };
  }

  function Lb(a) {
    const b = a && a.P;
    b && (b.ca.delete(a.Ia), b.ca.size || (x(a.Ka).S = null));
  }

  function Mb(a, b) {
    const c = b.getRootNode();
    return a.map((a) => {
      let b = c === a.target.getRootNode();
      if (b && a.addedNodes) {
        if (b = Array.from(a.addedNodes).filter(a => c === a.getRootNode()), b.length) {
          return a = Object.create(a), Object.defineProperty(a, 'addedNodes', {
            value: b,
            configurable: !0,
          }), a;
        }
      } else if (b) return a;
    }).filter(a => a);
  }
  const Nb = Element.prototype.insertBefore; const Ob = Element.prototype.replaceChild; const Pb = Element.prototype.removeChild;
  const Qb = Element.prototype.setAttribute; const Rb = Element.prototype.removeAttribute; const Sb = Element.prototype.cloneNode;
  const Tb = Document.prototype.importNode; const Ub = Element.prototype.addEventListener;
  const Vb = Element.prototype.removeEventListener; const Wb = Window.prototype.addEventListener;
  const Xb = Window.prototype.removeEventListener; const Yb = Element.prototype.dispatchEvent;
  const Zb = Node.prototype.contains || HTMLElement.prototype.contains; const $b = Document.prototype.getElementById;
  const ac = Element.prototype.querySelector; const bc = DocumentFragment.prototype.querySelector;
  const cc = Document.prototype.querySelector; const dc = Element.prototype.querySelectorAll;
  const ec = DocumentFragment.prototype.querySelectorAll; const fc = Document.prototype.querySelectorAll; const
    C = {};
  C.appendChild = Element.prototype.appendChild;
  C.insertBefore = Nb;
  C.replaceChild = Ob;
  C.removeChild = Pb;
  C.setAttribute = Qb;
  C.removeAttribute = Rb;
  C.cloneNode = Sb;
  C.importNode = Tb;
  C.addEventListener = Ub;
  C.removeEventListener = Vb;
  C.gb = Wb;
  C.hb = Xb;
  C.dispatchEvent = Yb;
  C.contains = Zb;
  C.getElementById = $b;
  C.pb = ac;
  C.tb = bc;
  C.nb = cc;
  C.querySelector = function (a) {
    switch (this.nodeType) {
      case Node.ELEMENT_NODE:
        return ac.call(this, a);
      case Node.DOCUMENT_NODE:
        return cc.call(this, a);
      default:
        return bc.call(this, a);
    }
  };
  C.qb = dc;
  C.ub = ec;
  C.ob = fc;
  C.querySelectorAll = function (a) {
    switch (this.nodeType) {
      case Node.ELEMENT_NODE:
        return dc.call(this, a);
      case Node.DOCUMENT_NODE:
        return fc.call(this, a);
      default:
        return ec.call(this, a);
    }
  };
  const gc = /[&\u00A0"]/g; const
    hc = /[&\u00A0<>]/g;

  function ic(a) {
    switch (a) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case '\u00a0':
        return '&nbsp;';
    }
  }

  function jc(a) {
    for (var b = {}, c = 0; c < a.length; c++)b[a[c]] = !0;
    return b;
  }

  const kc = jc('area base br col command embed hr img input keygen link meta param source track wbr'.split(' '));
  const lc = jc('style script xmp iframe noembed noframes plaintext noscript'.split(' '));

  function mc(a, b) {
    a.localName === 'template' && (a = a.content);
    for (var c = '', d = b ? b(a) : a.childNodes, e = 0, f = d.length, g = void 0; e < f && (g = d[e]); e++) {
      a: {
        var h = g;
        let k = a; const
          l = b;
        switch (h.nodeType) {
          case Node.ELEMENT_NODE:
            k = h.localName;
            for (var n = `<${k}`, p = h.attributes, G = 0, u; u = p[G]; G++)n += ` ${u.name}="${u.value.replace(gc, ic)}"`;
            n += '>';
            h = kc[k] ? n : `${n + mc(h, l)}</${k}>`;
            break a;
          case Node.TEXT_NODE:
            h = h.data;
            h = k && lc[k.localName] ? h : h.replace(hc, ic);
            break a;
          case Node.COMMENT_NODE:
            h = `\x3c!--${h.data}--\x3e`;
            break a;
          default:
            throw window.console.error(h),
            Error('not implemented');
        }
      }
      c += h;
    }
    return c;
  }
  const D = document.createTreeWalker(document, NodeFilter.SHOW_ALL, null, !1);
  const E = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1);

  function nc(a) {
    const b = [];
    D.currentNode = a;
    for (a = D.firstChild(); a;)b.push(a), a = D.nextSibling();
    return b;
  }

  const F = {
    parentNode(a) {
      D.currentNode = a;
      return D.parentNode();
    },
    firstChild(a) {
      D.currentNode = a;
      return D.firstChild();
    },
    lastChild(a) {
      D.currentNode = a;
      return D.lastChild();
    },
    previousSibling(a) {
      D.currentNode = a;
      return D.previousSibling();
    },
    nextSibling(a) {
      D.currentNode = a;
      return D.nextSibling();
    },
  };
  F.childNodes = nc;
  F.parentElement = function (a) {
    E.currentNode = a;
    return E.parentNode();
  };
  F.firstElementChild = function (a) {
    E.currentNode = a;
    return E.firstChild();
  };
  F.lastElementChild = function (a) {
    E.currentNode = a;
    return E.lastChild();
  };
  F.previousElementSibling = function (a) {
    E.currentNode = a;
    return E.previousSibling();
  };
  F.nextElementSibling = function (a) {
    E.currentNode = a;
    return E.nextSibling();
  };
  F.children = function (a) {
    const b = [];
    E.currentNode = a;
    for (a = E.firstChild(); a;)b.push(a), a = E.nextSibling();
    return Db(b);
  };
  F.innerHTML = function (a) {
    return mc(a, a => nc(a));
  };
  F.textContent = function (a) {
    switch (a.nodeType) {
      case Node.ELEMENT_NODE:
      case Node.DOCUMENT_FRAGMENT_NODE:
        a = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, null, !1);
        for (var b = '', c; c = a.nextNode();)b += c.nodeValue;
        return b;
      default:
        return a.nodeValue;
    }
  };
  const oc = A.K; const
    pc = [Node.prototype, Element.prototype, HTMLElement.prototype];

  function H(a) {
    let b;
    a: {
      for (b = 0; b < pc.length; b++) {
        const c = pc[b];
        if (c.hasOwnProperty(a)) {
          b = c;
          break a;
        }
      }
      b = void 0;
    }
    if (!b) throw Error(`Could not find descriptor for ${a}`);
    return Object.getOwnPropertyDescriptor(b, a);
  }

  const I = oc ? {
    parentNode: H('parentNode'),
    firstChild: H('firstChild'),
    lastChild: H('lastChild'),
    previousSibling: H('previousSibling'),
    nextSibling: H('nextSibling'),
    childNodes: H('childNodes'),
    parentElement: H('parentElement'),
    previousElementSibling: H('previousElementSibling'),
    nextElementSibling: H('nextElementSibling'),
    innerHTML: H('innerHTML'),
    textContent: H('textContent'),
    firstElementChild: H('firstElementChild'),
    lastElementChild: H('lastElementChild'),
    children: H('children'),
  } : {}; const qc = oc ? {
    firstElementChild: Object.getOwnPropertyDescriptor(DocumentFragment.prototype,
      'firstElementChild'),
    lastElementChild: Object.getOwnPropertyDescriptor(DocumentFragment.prototype, 'lastElementChild'),
    children: Object.getOwnPropertyDescriptor(DocumentFragment.prototype, 'children'),
  } : {}; const rc = oc ? {
    firstElementChild: Object.getOwnPropertyDescriptor(Document.prototype, 'firstElementChild'),
    lastElementChild: Object.getOwnPropertyDescriptor(Document.prototype, 'lastElementChild'),
    children: Object.getOwnPropertyDescriptor(Document.prototype, 'children'),
  } : {}; const
    sc = {
      ya: I,
      sb: qc,
      mb: rc,
      parentNode(a) {
        return I.parentNode.get.call(a);
      },
      firstChild(a) {
        return I.firstChild.get.call(a);
      },
      lastChild(a) {
        return I.lastChild.get.call(a);
      },
      previousSibling(a) {
        return I.previousSibling.get.call(a);
      },
      nextSibling(a) {
        return I.nextSibling.get.call(a);
      },
      childNodes(a) {
        return Array.prototype.slice.call(I.childNodes.get.call(a));
      },
      parentElement(a) {
        return I.parentElement.get.call(a);
      },
      previousElementSibling(a) {
        return I.previousElementSibling.get.call(a);
      },
      nextElementSibling(a) {
        return I.nextElementSibling.get.call(a);
      },
      innerHTML(a) {
        return I.innerHTML.get.call(a);
      },
      textContent(a) {
        return I.textContent.get.call(a);
      },
      children(a) {
        switch (a.nodeType) {
          case Node.DOCUMENT_FRAGMENT_NODE:
            return qc.children.get.call(a);
          case Node.DOCUMENT_NODE:
            return rc.children.get.call(a);
          default:
            return I.children.get.call(a);
        }
      },
      firstElementChild(a) {
        switch (a.nodeType) {
          case Node.DOCUMENT_FRAGMENT_NODE:
            return qc.firstElementChild.get.call(a);
          case Node.DOCUMENT_NODE:
            return rc.firstElementChild.get.call(a);
          default:
            return I.firstElementChild.get.call(a);
        }
      },
      lastElementChild(a) {
        switch (a.nodeType) {
          case Node.DOCUMENT_FRAGMENT_NODE:
            return qc.lastElementChild.get.call(a);
          case Node.DOCUMENT_NODE:
            return rc.lastElementChild.get.call(a);
          default:
            return I.lastElementChild.get.call(a);
        }
      },
    };
  const J = A.Ba ? sc : F;

  function tc(a) {
    for (; a.firstChild;)a.removeChild(a.firstChild);
  }

  const uc = A.K; const vc = document.implementation.createHTMLDocument('inert');
  const wc = Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected'); const xc = wc && wc.get;
  const yc = Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement'); const zc = {
    parentElement: {
      get() {
        let a = z(this);
        (a = a && a.parentNode) && a.nodeType !== Node.ELEMENT_NODE && (a = null);
        return void 0 !== a ? a : J.parentElement(this);
      },
      configurable: !0,
    },
    parentNode: {
      get() {
        let a = z(this);
        a = a && a.parentNode;
        return void 0 !== a ? a : J.parentNode(this);
      },
      configurable: !0,
    },
    nextSibling: {
      get() {
        let a = z(this);
        a = a && a.nextSibling;
        return void 0 !== a ? a : J.nextSibling(this);
      },
      configurable: !0,
    },
    previousSibling: {
      get() {
        let a = z(this);
        a = a && a.previousSibling;
        return void 0 !== a ? a : J.previousSibling(this);
      },
      configurable: !0,
    },
    nextElementSibling: {
      get() {
        let a = z(this);
        if (a && void 0 !== a.nextSibling) {
          for (a = this.nextSibling; a && a.nodeType !== Node.ELEMENT_NODE;)a = a.nextSibling;
          return a;
        }
        return J.nextElementSibling(this);
      },
      configurable: !0,
    },
    previousElementSibling: {
      get() {
        let a = z(this);
        if (a && void 0 !== a.previousSibling) {
          for (a = this.previousSibling; a && a.nodeType !== Node.ELEMENT_NODE;)a = a.previousSibling;
          return a;
        }
        return J.previousElementSibling(this);
      },
      configurable: !0,
    },
  }; const Ac = {
    className: {
      get() {
        return this.getAttribute('class') || '';
      },
      set(a) {
        this.setAttribute('class', a);
      },
      configurable: !0,
    },
  }; const Bc = {
    childNodes: {
      get() {
        if (nb(this)) {
          const a = z(this);
          if (!a.childNodes) {
            a.childNodes = [];
            for (let b = this.firstChild; b; b = b.nextSibling)a.childNodes.push(b);
          }
          var c = a.childNodes;
        } else {
          c = J.childNodes(this);
        }
        c.item = function (a) {
          return c[a];
        };
        return c;
      },
      configurable: !0,
    },
    childElementCount: {
      get() {
        return this.children.length;
      },
      configurable: !0,
    },
    firstChild: {
      get() {
        let a = z(this);
        a = a && a.firstChild;
        return void 0 !== a ? a : J.firstChild(this);
      },
      configurable: !0,
    },
    lastChild: {
      get() {
        let a = z(this);
        a = a && a.lastChild;
        return void 0 !== a ? a : J.lastChild(this);
      },
      configurable: !0,
    },
    textContent: {
      get() {
        if (nb(this)) {
          for (var a = [], b = 0, c = this.childNodes, d; d = c[b]; b++) {
            d.nodeType !== Node.COMMENT_NODE
            && a.push(d.textContent);
          }
          return a.join('');
        }
        return J.textContent(this);
      },
      set(a) {
        if (typeof a === 'undefined' || a === null) a = '';
        switch (this.nodeType) {
          case Node.ELEMENT_NODE:
          case Node.DOCUMENT_FRAGMENT_NODE:
            if (!nb(this) && uc) {
              const b = this.firstChild;
              (b != this.lastChild || b && b.nodeType != Node.TEXT_NODE) && tc(this);
              sc.ya.textContent.set.call(this, a);
            } else tc(this), (a.length > 0 || this.nodeType === Node.ELEMENT_NODE) && this.appendChild(document.createTextNode(a));
            break;
          default:
            this.nodeValue = a;
        }
      },
      configurable: !0,
    },
    firstElementChild: {
      get() {
        let a = z(this);
        if (a && void 0 !== a.firstChild) {
          for (a = this.firstChild; a && a.nodeType !== Node.ELEMENT_NODE;)a = a.nextSibling;
          return a;
        }
        return J.firstElementChild(this);
      },
      configurable: !0,
    },
    lastElementChild: {
      get() {
        let a = z(this);
        if (a && void 0 !== a.lastChild) {
          for (a = this.lastChild; a && a.nodeType !== Node.ELEMENT_NODE;)a = a.previousSibling;
          return a;
        }
        return J.lastElementChild(this);
      },
      configurable: !0,
    },
    children: {
      get() {
        return nb(this) ? Db(Array.prototype.filter.call(this.childNodes, a => a.nodeType === Node.ELEMENT_NODE))
          : J.children(this);
      },
      configurable: !0,
    },
    innerHTML: {
      get() {
        return nb(this) ? mc(this.localName === 'template' ? this.content : this) : J.innerHTML(this);
      },
      set(a) {
        const b = this.localName === 'template' ? this.content : this;
        tc(b);
        let c = this.localName || 'div';
        c = this.namespaceURI && this.namespaceURI !== vc.namespaceURI ? vc.createElementNS(this.namespaceURI, c) : vc.createElement(c);
        uc ? sc.ya.innerHTML.set.call(c, a) : c.innerHTML = a;
        for (a = this.localName === 'template' ? c.content : c; a.firstChild;)b.appendChild(a.firstChild);
      },
      configurable: !0,
    },
  }; const Cc = {
    shadowRoot: {
      get() {
        const a = z(this);
        return a && a.za || null;
      },
      configurable: !0,
    },
  }; const
    Dc = {
      activeElement: {
        get() {
          let a = yc && yc.get ? yc.get.call(document) : A.K ? void 0 : document.activeElement;
          if (a && a.nodeType) {
            let b = !!B(this);
            if (this === document || b && this.host !== a && C.contains.call(this.host, a)) {
              for (b = ob(a); b && b !== this;)a = b.host, b = ob(a);
              a = this === document ? b ? null : a : b === this ? a : null;
            } else a = null;
          } else a = null;
          return a;
        },
        set() {
        },
        configurable: !0,
      },
    };

  function K(a, b, c) {
    for (const d in b) {
      const e = Object.getOwnPropertyDescriptor(a, d);
      e && e.configurable || !e && c ? Object.defineProperty(a, d, b[d]) : c && console.warn('Could not define', d, 'on', a);
    }
  }

  function Ec(a) {
    K(a, zc);
    K(a, Ac);
    K(a, Bc);
    K(a, Dc);
  }

  function Fc() {
    const a = Gc.prototype;
    a.__proto__ = DocumentFragment.prototype;
    K(a, zc, !0);
    K(a, Bc, !0);
    K(a, Dc, !0);
    Object.defineProperties(a, {
      nodeType: { value: Node.DOCUMENT_FRAGMENT_NODE, configurable: !0 },
      nodeName: { value: '#document-fragment', configurable: !0 },
      nodeValue: { value: null, configurable: !0 },
    });
    ['localName', 'namespaceURI', 'prefix'].forEach((b) => {
      Object.defineProperty(a, b, { value: void 0, configurable: !0 });
    });
    ['ownerDocument', 'baseURI', 'isConnected'].forEach((b) => {
      Object.defineProperty(a, b, {
        get() {
          return this.host[b];
        },
        configurable: !0,
      });
    });
  }

  const Hc = A.K ? function () {
  } : function (a) {
    const b = x(a);
    b.ua || (b.ua = !0, K(a, zc, !0), K(a, Ac, !0));
  }; const
    Ic = A.K ? function () {
    } : function (a) {
      x(a).Ea || (K(a, Bc, !0), K(a, Cc, !0));
    };
  const Jc = J.childNodes;

  function Kc(a, b, c) {
    Ic(b);
    let d = x(b);
    void 0 !== d.firstChild && (d.childNodes = null);
    if (a.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      d = a.childNodes;
      for (let e = 0; e < d.length; e++)Lc(d[e], b, c);
      a = x(a);
      b = void 0 !== a.firstChild ? null : void 0;
      a.firstChild = a.lastChild = b;
      a.childNodes = b;
    } else Lc(a, b, c);
  }

  function Lc(a, b, c) {
    Hc(a);
    c = c || null;
    const d = x(a); const e = x(b); let
      f = c ? x(c) : null;
    d.previousSibling = c ? f.previousSibling : b.lastChild;
    if (f = z(d.previousSibling)) f.nextSibling = a;
    if (f = z(d.nextSibling = c)) f.previousSibling = a;
    d.parentNode = b;
    c ? c === e.firstChild && (e.firstChild = a) : (e.lastChild = a, e.firstChild || (e.firstChild = a));
    e.childNodes = null;
  }

  function Mc(a, b) {
    const c = x(a);
    b = x(b);
    a === b.firstChild && (b.firstChild = c.nextSibling);
    a === b.lastChild && (b.lastChild = c.previousSibling);
    a = c.previousSibling;
    const d = c.nextSibling;
    a && (x(a).nextSibling = d);
    d && (x(d).previousSibling = a);
    c.parentNode = c.previousSibling = c.nextSibling = void 0;
    void 0 !== b.childNodes && (b.childNodes = null);
  }

  function Nc(a) {
    let b = x(a);
    if (void 0 === b.firstChild) {
      b.childNodes = null;
      const c = Jc(a);
      b.firstChild = c[0] || null;
      b.lastChild = c[c.length - 1] || null;
      Ic(a);
      for (b = 0; b < c.length; b++) {
        const d = c[b]; const
          e = x(d);
        e.parentNode = a;
        e.nextSibling = c[b + 1] || null;
        e.previousSibling = c[b - 1] || null;
        Hc(d);
      }
    }
  }
  const Oc = J.parentNode;

  function Pc(a, b, c) {
    if (b === a) throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");
    if (c) {
      var d = z(c);
      d = d && d.parentNode;
      if (void 0 !== d && d !== a || void 0 === d && Oc(c) !== a) throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
    }
    if (c === b) return b;
    const e = []; let f = Qc; let g = ob(a); const
      h = g ? g.host.localName : '';
    if (b.parentNode) {
      const k = Rc(b);
      Sc(b.parentNode, b, !!g || !(b.getRootNode() instanceof ShadowRoot));
      f = function (a, b) {
        Tc() && (Uc(a, k), Qc(a, b));
      };
    }
    d = !0;
    const l = !Vc(b, h);
    !g || b.__noInsertionPoint && !l || Wc(b, (a) => {
      a.localName === 'slot' && e.push(a);
      l && f(a, h);
    });
    e.length && Xc(g, e);
    (a.localName === 'slot' || e.length) && g && Yc(g);
    nb(a) && (Kc(b, a, c), g = z(a), Zc(a) ? (Yc(g.root), d = !1) : g.root && (d = !1));
    d ? (d = B(a) ? a.host : a, c ? (c = $c(c), C.insertBefore.call(d, b, c)) : C.appendChild.call(d, b)) : b.ownerDocument !== a.ownerDocument && a.ownerDocument.adoptNode(b);
    ad(a, b);
    return b;
  }

  function Sc(a, b, c) {
    c = void 0 === c ? !1 : c;
    if (b.parentNode !== a) throw Error(`The node to be removed is not a child of this node: ${b}`);
    const d = ob(b); const
      e = z(a);
    if (nb(a) && (Mc(b, a), Zc(a))) {
      Yc(e.root);
      var f = !0;
    }
    if (Tc() && !c && d) {
      const g = Rc(b);
      Wc(b, (a) => {
        Uc(a, g);
      });
    }
    bd(b);
    if (d) {
      const h = a && a.localName === 'slot';
      h && (f = !0);
      ((c = cd(d, b)) || h) && Yc(d);
    }
    f || (f = B(a) ? a.host : a, (!e.root && b.localName !== 'slot' || f === Oc(b)) && C.removeChild.call(f, b));
    ad(a, null, b);
    return b;
  }

  function bd(a) {
    let b = z(a);
    if (b && void 0 !== b.V) {
      b = a.childNodes;
      for (let c = 0, d = b.length, e = void 0; c < d && (e = b[c]); c++)bd(e);
    }
    if (a = z(a)) a.V = void 0;
  }

  function $c(a) {
    let b = a;
    a && a.localName === 'slot' && (b = (b = (b = z(a)) && b.N) && b.length ? b[0] : $c(a.nextSibling));
    return b;
  }

  function Zc(a) {
    return (a = (a = z(a)) && a.root) && dd(a);
  }

  function ed(a, b) {
    if (b === 'slot') a = a.parentNode, Zc(a) && Yc(z(a).root); else if (a.localName === 'slot' && b === 'name' && (b = ob(a))) {
      if (b.o) {
        fd(b);
        let c = a.Ha; const
          d = gd(a);
        if (d !== c) {
          c = b.w[c];
          const e = c.indexOf(a);
          e >= 0 && c.splice(e, 1);
          c = b.w[d] || (b.w[d] = []);
          c.push(a);
          c.length > 1 && (b.w[d] = hd(c));
        }
      }
      Yc(b);
    }
  }

  function ad(a, b, c) {
    if (a = (a = z(a)) && a.S) b && a.addedNodes.push(b), c && a.removedNodes.push(c), Jb(a);
  }

  function id(a) {
    if (a && a.nodeType) {
      const b = x(a); let
        c = b.V;
      void 0 === c && (B(a) ? (c = a, b.V = c) : (c = (c = a.parentNode) ? id(c) : a, C.contains.call(document.documentElement, a) && (b.V = c)));
      return c;
    }
  }

  function jd(a, b, c) {
    const d = [];
    kd(a.childNodes, b, c, d);
    return d;
  }

  function kd(a, b, c, d) {
    for (let e = 0, f = a.length, g = void 0; e < f && (g = a[e]); e++) {
      var h;
      if (h = g.nodeType === Node.ELEMENT_NODE) {
        h = g;
        const k = b; const l = c; const n = d; const
          p = k(h);
        p && n.push(h);
        l && l(p) ? h = p : (kd(h.childNodes, k, l, n), h = void 0);
      }
      if (h) break;
    }
  }

  let ld = null;

  function Tc() {
    ld || (ld = window.ShadyCSS && window.ShadyCSS.ScopingShim);
    return ld || null;
  }

  function md(a, b, c) {
    const d = Tc();
    d && b === 'class' ? d.setElementClass(a, c) : (C.setAttribute.call(a, b, c), ed(a, b));
  }

  function nd(a, b) {
    if (a.ownerDocument !== document || a.localName === 'template') return C.importNode.call(document, a, b);
    const c = C.importNode.call(document, a, !1);
    if (b) {
      a = a.childNodes;
      b = 0;
      for (var d; b < a.length; b++)d = nd(a[b], !0), c.appendChild(d);
    }
    return c;
  }

  function Qc(a, b) {
    const c = Tc();
    c && c.scopeNode(a, b);
  }

  function Uc(a, b) {
    const c = Tc();
    c && c.unscopeNode(a, b);
  }

  function Vc(a, b) {
    let c = Tc();
    if (!c) return !0;
    if (a.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      c = !0;
      for (let d = 0; c && d < a.childNodes.length; d++)c = c && Vc(a.childNodes[d], b);
      return c;
    }
    return a.nodeType !== Node.ELEMENT_NODE ? !0 : c.currentScopeForNode(a) === b;
  }

  function Rc(a) {
    if (a.nodeType !== Node.ELEMENT_NODE) return '';
    const b = Tc();
    return b ? b.currentScopeForNode(a) : '';
  }

  function Wc(a, b) {
    if (a) {
      a.nodeType === Node.ELEMENT_NODE && b(a);
      for (var c = 0, d; c < a.childNodes.length; c++)d = a.childNodes[c], d.nodeType === Node.ELEMENT_NODE && Wc(d, b);
    }
  }
  const od = `__eventWrappers${Date.now()}`; const pd = (function () {
    const a = Object.getOwnPropertyDescriptor(Event.prototype, 'composed');
    return a ? function (b) {
      return a.get.call(b);
    } : null;
  }()); const qd = {
    blur: !0,
    focus: !0,
    focusin: !0,
    focusout: !0,
    click: !0,
    dblclick: !0,
    mousedown: !0,
    mouseenter: !0,
    mouseleave: !0,
    mousemove: !0,
    mouseout: !0,
    mouseover: !0,
    mouseup: !0,
    wheel: !0,
    beforeinput: !0,
    input: !0,
    keydown: !0,
    keyup: !0,
    compositionstart: !0,
    compositionupdate: !0,
    compositionend: !0,
    touchstart: !0,
    touchend: !0,
    touchmove: !0,
    touchcancel: !0,
    pointerover: !0,
    pointerenter: !0,
    pointerdown: !0,
    pointermove: !0,
    pointerup: !0,
    pointercancel: !0,
    pointerout: !0,
    pointerleave: !0,
    gotpointercapture: !0,
    lostpointercapture: !0,
    dragstart: !0,
    drag: !0,
    dragenter: !0,
    dragleave: !0,
    dragover: !0,
    drop: !0,
    dragend: !0,
    DOMActivate: !0,
    DOMFocusIn: !0,
    DOMFocusOut: !0,
    keypress: !0,
  }; const
    rd = {
      DOMAttrModified: !0,
      DOMAttributeNameChanged: !0,
      DOMCharacterDataModified: !0,
      DOMElementNameChanged: !0,
      DOMNodeInserted: !0,
      DOMNodeInsertedIntoDocument: !0,
      DOMNodeRemoved: !0,
      DOMNodeRemovedFromDocument: !0,
      DOMSubtreeModified: !0,
    };

  function sd(a, b) {
    const c = []; let
      d = a;
    for (a = a === window ? window : a.getRootNode(); d;)c.push(d), d = d.assignedSlot ? d.assignedSlot : d.nodeType === Node.DOCUMENT_FRAGMENT_NODE && d.host && (b || d !== a) ? d.host : d.parentNode;
    c[c.length - 1] === document && c.push(window);
    return c;
  }

  function td(a, b) {
    if (!B) return a;
    a = sd(a, !0);
    for (var c = 0, d, e = void 0, f, g = void 0; c < b.length; c++) if (d = b[c], f = d === window ? window : d.getRootNode(), f !== e && (g = a.indexOf(f), e = f), !B(f) || g > -1) return d;
  }

  const ud = {
    get composed() {
      void 0 === this.Y && (pd ? this.Y = this.type === 'focusin' || this.type === 'focusout' || pd(this) : !1 !== this.isTrusted && (this.Y = qd[this.type]));
      return this.Y || !1;
    },
    composedPath() {
      this.ta || (this.ta = sd(this.__target, this.composed));
      return this.ta;
    },
    get target() {
      return td(this.currentTarget || this.__previousCurrentTarget, this.composedPath());
    },
    get relatedTarget() {
      if (!this.la) return null;
      this.va || (this.va = sd(this.la, !0));
      return td(this.currentTarget || this.__previousCurrentTarget, this.va);
    },
    stopPropagation() {
      Event.prototype.stopPropagation.call(this);
      this.ka = !0;
    },
    stopImmediatePropagation() {
      Event.prototype.stopImmediatePropagation.call(this);
      this.ka = this.Da = !0;
    },
  };

  function vd(a) {
    function b(b, d) {
      b = new a(b, d);
      b.Y = d && !!d.composed;
      return b;
    }

    tb(b, a);
    b.prototype = a.prototype;
    return b;
  }

  const wd = { focus: !0, blur: !0 };

  function xd(a) {
    return a.__target !== a.target || a.la !== a.relatedTarget;
  }

  function yd(a, b, c) {
    if (c = b.__handlers && b.__handlers[a.type] && b.__handlers[a.type][c]) for (var d = 0, e; (e = c[d]) && (!xd(a) || a.target !== a.relatedTarget) && (e.call(b, a), !a.Da); d++);
  }

  function zd(a) {
    const b = a.composedPath();
    Object.defineProperty(a, 'currentTarget', {
      get() {
        return d;
      },
      configurable: !0,
    });
    for (var c = b.length - 1; c >= 0; c--) {
      var d = b[c];
      yd(a, d, 'capture');
      if (a.ka) return;
    }
    Object.defineProperty(a, 'eventPhase', {
      get() {
        return Event.AT_TARGET;
      },
    });
    let e;
    for (c = 0; c < b.length; c++) {
      d = b[c];
      let f = z(d);
      f = f && f.root;
      if (c === 0 || f && f === e) if (yd(a, d, 'bubble'), d !== window && (e = d.getRootNode()), a.ka) break;
    }
  }

  function Ad(a, b, c, d, e, f) {
    for (let g = 0; g < a.length; g++) {
      const h = a[g]; const k = h.type; const l = h.capture; const n = h.once; const
        p = h.passive;
      if (b === h.node && c === k && d === l && e === n && f === p) return g;
    }
    return -1;
  }

  function Bd(a, b, c) {
    if (b) {
      const d = typeof b;
      if (d === 'function' || d === 'object') {
        if (d !== 'object' || b.handleEvent && typeof b.handleEvent === 'function') {
          const e = this instanceof Window ? C.gb : C.addEventListener;
          if (rd[a]) return e.call(this, a, b, c);
          if (c && typeof c === 'object') {
            var f = !!c.capture;
            var g = !!c.once;
            var h = !!c.passive;
          } else f = !!c, h = g = !1;
          const k = c && c.na || this; let
            l = b[od];
          if (l) {
            if (Ad(l, k, a, f, g, h) > -1) return;
          } else b[od] = [];
          l = function (e) {
            g && this.removeEventListener(a, b, c);
            e.__target || Cd(e);
            if (k !== this) {
              var f = Object.getOwnPropertyDescriptor(e,
                'currentTarget');
              Object.defineProperty(e, 'currentTarget', {
                get() {
                  return k;
                },
                configurable: !0,
              });
            }
            e.__previousCurrentTarget = e.currentTarget;
            if (!B(k) || e.composedPath().indexOf(k) != -1) {
              if (e.composed || e.composedPath().indexOf(k) > -1) {
                if (xd(e) && e.target === e.relatedTarget) e.eventPhase === Event.BUBBLING_PHASE && e.stopImmediatePropagation(); else if (e.eventPhase === Event.CAPTURING_PHASE || e.bubbles || e.target === k || k instanceof Window) {
                  const h = d === 'function' ? b.call(k, e) : b.handleEvent && b.handleEvent(e);
                  k !== this
            && (f ? (Object.defineProperty(e, 'currentTarget', f), f = null) : delete e.currentTarget);
                  return h;
                }
              }
            }
          };
          b[od].push({
            node: k, type: a, capture: f, once: g, passive: h, ib: l,
          });
          wd[a] ? (this.__handlers = this.__handlers || {}, this.__handlers[a] = this.__handlers[a] || {
            capture: [],
            bubble: [],
          }, this.__handlers[a][f ? 'capture' : 'bubble'].push(l)) : e.call(this, a, l, c);
        }
      }
    }
  }

  function Dd(a, b, c) {
    if (b) {
      const d = this instanceof Window ? C.hb : C.removeEventListener;
      if (rd[a]) return d.call(this, a, b, c);
      if (c && typeof c === 'object') {
        var e = !!c.capture;
        var f = !!c.once;
        var g = !!c.passive;
      } else e = !!c, g = f = !1;
      const h = c && c.na || this; let
        k = void 0;
      let l = null;
      try {
        l = b[od];
      } catch (n) {
      }
      l && (f = Ad(l, h, a, e, f, g), f > -1 && (k = l.splice(f, 1)[0].ib, l.length || (b[od] = void 0)));
      d.call(this, a, k || b, c);
      k && wd[a] && this.__handlers && this.__handlers[a] && (a = this.__handlers[a][e ? 'capture' : 'bubble'], k = a.indexOf(k), k > -1 && a.splice(k, 1));
    }
  }

  function Ed() {
    for (const a in wd) {
      window.addEventListener(a, (a) => {
        a.__target || (Cd(a), zd(a));
      }, !0);
    }
  }

  function Cd(a) {
    a.__target = a.target;
    a.la = a.relatedTarget;
    if (A.K) {
      const b = Object.getPrototypeOf(a);
      if (!b.hasOwnProperty('__patchProto')) {
        const c = Object.create(b);
        c.jb = b;
        rb(c, ud);
        b.__patchProto = c;
      }
      a.__proto__ = b.__patchProto;
    } else rb(a, ud);
  }

  const Fd = vd(window.Event); const Gd = vd(window.CustomEvent); const
    Hd = vd(window.MouseEvent);

  function Id() {
    window.Event = Fd;
    window.CustomEvent = Gd;
    window.MouseEvent = Hd;
    Ed();
    if (!pd && Object.getOwnPropertyDescriptor(Event.prototype, 'isTrusted')) {
      const a = function () {
        const a = new MouseEvent('click', { bubbles: !0, cancelable: !0, composed: !0 });
        this.dispatchEvent(a);
      };
      Element.prototype.click ? Element.prototype.click = a : HTMLElement.prototype.click && (HTMLElement.prototype.click = a);
    }
  }
  function Jd(a, b) {
    return { index: a, W: [], ba: b };
  }

  function Kd(a, b, c, d) {
    let e = 0; let f = 0; let g = 0; let h = 0; let
      k = Math.min(b - e, d - f);
    if (e == 0 && f == 0) {
      a: {
        for (g = 0; g < k; g++) if (a[g] !== c[g]) break a;
        g = k;
      }
    }
    if (b == a.length && d == c.length) {
      h = a.length;
      for (var l = c.length, n = 0; n < k - g && Ld(a[--h], c[--l]);)n++;
      h = n;
    }
    e += g;
    f += g;
    b -= h;
    d -= h;
    if (b - e == 0 && d - f == 0) return [];
    if (e == b) {
      for (b = Jd(e, 0); f < d;)b.W.push(c[f++]);
      return [b];
    }
    if (f == d) return [Jd(e, b - e)];
    k = e;
    g = f;
    d = d - g + 1;
    h = b - k + 1;
    b = Array(d);
    for (l = 0; l < d; l++)b[l] = Array(h), b[l][0] = l;
    for (l = 0; l < h; l++)b[0][l] = l;
    for (l = 1; l < d; l++) {
      for (n = 1; n < h; n++) {
        if (a[k + n - 1] === c[g + l - 1]) {
          b[l][n] = b[l - 1][n - 1];
        } else {
          var p = b[l - 1][n] + 1; const
            G = b[l][n - 1] + 1;
          b[l][n] = p < G ? p : G;
        }
      }
    }
    k = b.length - 1;
    g = b[0].length - 1;
    d = b[k][g];
    for (a = []; k > 0 || g > 0;)k == 0 ? (a.push(2), g--) : g == 0 ? (a.push(3), k--) : (h = b[k - 1][g - 1], l = b[k - 1][g], n = b[k][g - 1], p = l < n ? l < h ? l : h : n < h ? n : h, p == h ? (h == d ? a.push(0) : (a.push(1), d = h), k--, g--) : p == l ? (a.push(3), k--, d = l) : (a.push(2), g--, d = n));
    a.reverse();
    b = void 0;
    k = [];
    for (g = 0; g < a.length; g++) {
      switch (a[g]) {
        case 0:
          b && (k.push(b), b = void 0);
          e++;
          f++;
          break;
        case 1:
          b || (b = Jd(e, 0));
          b.ba++;
          e++;
          b.W.push(c[f]);
          f++;
          break;
        case 2:
          b || (b = Jd(e,
            0));
          b.ba++;
          e++;
          break;
        case 3:
          b || (b = Jd(e, 0)), b.W.push(c[f]), f++;
      }
    }
    b && k.push(b);
    return k;
  }

  function Ld(a, b) {
    return a === b;
  }
  const Md = J.parentNode; const Nd = J.childNodes; const Od = {};
  let Pd = A.deferConnectionCallbacks && document.readyState === 'loading'; let
    Qd;

  function Rd(a) {
    const b = [];
    do b.unshift(a); while (a = a.parentNode);
    return b;
  }

  function Gc(a, b, c) {
    if (a !== Od) throw new TypeError('Illegal constructor');
    this.Ja = 'ShadyRoot';
    this.host = b;
    this.c = c && c.mode;
    Nc(b);
    a = x(b);
    a.root = this;
    a.za = this.c !== 'closed' ? this : null;
    a = x(this);
    a.firstChild = a.lastChild = a.parentNode = a.nextSibling = a.previousSibling = null;
    a.childNodes = [];
    this.b = this.aa = !1;
    this.a = this.w = this.o = null;
    Yc(this);
  }

  function Yc(a) {
    a.aa || (a.aa = !0, Gb(() => Sd(a)));
  }

  function Sd(a) {
    for (var b; a;) {
      a.aa && (b = a);
      a: {
        let c = a;
        a = c.host.getRootNode();
        if (B(a)) for (let d = c.host.childNodes, e = 0; e < d.length; e++) if (c = d[e], c.localName == 'slot') break a;
        a = void 0;
      }
    }
    b && b._renderRoot();
  }

  Gc.prototype._renderRoot = function () {
    const a = Pd;
    Pd = !0;
    this.aa = !1;
    if (this.o) {
      fd(this);
      for (var b = 0, c; b < this.o.length; b++) {
        c = this.o[b];
        var d = z(c); var
          e = d.assignedNodes;
        d.assignedNodes = [];
        d.N = [];
        if (d.oa = e) {
          for (d = 0; d < e.length; d++) {
            var f = z(e[d]);
            f.$ = f.assignedSlot;
            f.assignedSlot === c && (f.assignedSlot = null);
          }
        }
      }
      for (b = this.host.firstChild; b; b = b.nextSibling)Td(this, b);
      for (b = 0; b < this.o.length; b++) {
        c = this.o[b];
        e = z(c);
        if (!e.assignedNodes.length) for (d = c.firstChild; d; d = d.nextSibling)Td(this, d, c);
        (d = (d = z(c.parentNode)) && d.root)
        && dd(d) && d._renderRoot();
        Ud(this, e.N, e.assignedNodes);
        if (d = e.oa) {
          for (f = 0; f < d.length; f++)z(d[f]).$ = null;
          e.oa = null;
          d.length > e.assignedNodes.length && (e.ea = !0);
        }
        e.ea && (e.ea = !1, Vd(this, c));
      }
      c = this.o;
      b = [];
      for (e = 0; e < c.length; e++)d = c[e].parentNode, (f = z(d)) && f.root || !(b.indexOf(d) < 0) || b.push(d);
      for (c = 0; c < b.length; c++) {
        f = b[c];
        e = f === this ? this.host : f;
        d = [];
        f = f.childNodes;
        for (var g = 0; g < f.length; g++) {
          var h = f[g];
          if (h.localName == 'slot') {
            h = z(h).N;
            for (var k = 0; k < h.length; k++)d.push(h[k]);
          } else d.push(h);
        }
        f = Nd(e);
        g = Kd(d, d.length,
          f, f.length);
        k = h = 0;
        for (var l = void 0; h < g.length && (l = g[h]); h++) {
          for (var n = 0, p = void 0; n < l.W.length && (p = l.W[n]); n++)Md(p) === e && C.removeChild.call(e, p), f.splice(l.index + k, 1);
          k -= l.ba;
        }
        k = 0;
        for (l = void 0; k < g.length && (l = g[k]); k++) for (h = f[l.index], n = l.index; n < l.index + l.ba; n++)p = d[n], C.insertBefore.call(e, p, h), f.splice(n, 0, p);
      }
    }
    if (!this.b) for (b = this.host.childNodes, c = 0, e = b.length; c < e; c++)d = b[c], f = z(d), Md(d) !== this.host || d.localName !== 'slot' && f.assignedSlot || C.removeChild.call(this.host, d);
    this.b = !0;
    Pd = a;
    Qd && Qd();
  };
  function Td(a, b, c) {
    const d = x(b); const
      e = d.$;
    d.$ = null;
    c || (c = (a = a.w[b.slot || '__catchall']) && a[0]);
    c ? (x(c).assignedNodes.push(b), d.assignedSlot = c) : d.assignedSlot = void 0;
    e !== d.assignedSlot && d.assignedSlot && (x(d.assignedSlot).ea = !0);
  }

  function Ud(a, b, c) {
    for (let d = 0, e = void 0; d < c.length && (e = c[d]); d++) {
      if (e.localName == 'slot') {
        const f = z(e).assignedNodes;
        f && f.length && Ud(a, b, f);
      } else b.push(c[d]);
    }
  }

  function Vd(a, b) {
    C.dispatchEvent.call(b, new Event('slotchange'));
    b = z(b);
    b.assignedSlot && Vd(a, b.assignedSlot);
  }

  function Xc(a, b) {
    a.a = a.a || [];
    a.o = a.o || [];
    a.w = a.w || {};
    a.a.push.apply(a.a, b instanceof Array ? b : na(ma(b)));
  }

  function fd(a) {
    if (a.a && a.a.length) {
      for (var b = a.a, c, d = 0; d < b.length; d++) {
        const e = b[d];
        Nc(e);
        Nc(e.parentNode);
        const f = gd(e);
        a.w[f] ? (c = c || {}, c[f] = !0, a.w[f].push(e)) : a.w[f] = [e];
        a.o.push(e);
      }
      if (c) for (const g in c)a.w[g] = hd(a.w[g]);
      a.a = [];
    }
  }

  function gd(a) {
    const b = a.name || a.getAttribute('name') || '__catchall';
    return a.Ha = b;
  }

  function hd(a) {
    return a.sort((a, c) => {
      a = Rd(a);
      for (let b = Rd(c), e = 0; e < a.length; e++) {
        c = a[e];
        const f = b[e];
        if (c !== f) return a = Array.from(c.parentNode.childNodes), a.indexOf(c) - a.indexOf(f);
      }
    });
  }

  function cd(a, b) {
    if (a.o) {
      fd(a);
      const c = a.w; let
        d;
      for (d in c) {
        for (let e = c[d], f = 0; f < e.length; f++) {
          let g = e[f];
          if (Cb(b, g)) {
            e.splice(f, 1);
            var h = a.o.indexOf(g);
            h >= 0 && a.o.splice(h, 1);
            f--;
            g = z(g);
            if (h = g.N) {
              for (let k = 0; k < h.length; k++) {
                const l = h[k]; const
                  n = Md(l);
                n && C.removeChild.call(n, l);
              }
            }
            g.N = [];
            g.assignedNodes = [];
            h = !0;
          }
        }
      }
      return h;
    }
  }

  function dd(a) {
    fd(a);
    return !(!a.o || !a.o.length);
  }

  if (window.customElements && A.qa) {
    const Wd = new Map();
    Qd = function () {
      let a = Array.from(Wd);
      Wd.clear();
      a = ma(a);
      for (let b = a.next(); !b.done; b = a.next()) {
        b = ma(b.value);
        const c = b.next().value;
        b.next().value ? c.Fa() : c.Ga();
      }
    };
    Pd && document.addEventListener('readystatechange', () => {
      Pd = !1;
      Qd();
    }, { once: !0 });
    const Xd = function (a, b, c) {
      let d = 0; const
        e = `__isConnected${d++}`;
      if (b || c) {
        a.prototype.connectedCallback = a.prototype.Fa = function () {
          Pd ? Wd.set(this, !0) : this[e] || (this[e] = !0, b && b.call(this));
        }, a.prototype.disconnectedCallback = a.prototype.Ga = function () {
          Pd ? this.isConnected || Wd.set(this, !1) : this[e] && (this[e] = !1, c && c.call(this));
        };
      }
      return a;
    }; const
      { define } = window.customElements;
    Object.defineProperty(window.CustomElementRegistry.prototype, 'define', {
      value(a, b) {
        const c = b.prototype.connectedCallback; const
          d = b.prototype.disconnectedCallback;
        define.call(window.customElements, a, Xd(b, c, d));
        b.prototype.connectedCallback = c;
        b.prototype.disconnectedCallback = d;
      },
    });
  }

  function Yd(a) {
    const b = a.getRootNode();
    B(b) && Sd(b);
    return (a = z(a)) && a.assignedSlot || null;
  }

  const Zd = { addEventListener: Bd.bind(window), removeEventListener: Dd.bind(window) }; const
    $d = {
      addEventListener: Bd,
      removeEventListener: Dd,
      appendChild(a) {
        return Pc(this, a);
      },
      insertBefore(a, b) {
        return Pc(this, a, b);
      },
      removeChild(a) {
        return Sc(this, a);
      },
      replaceChild(a, b) {
        Pc(this, a, b);
        Sc(this, b);
        return a;
      },
      cloneNode(a) {
        if (this.localName == 'template') var b = C.cloneNode.call(this, a); else if (b = C.cloneNode.call(this, !1), a && b.nodeType !== Node.ATTRIBUTE_NODE) {
          a = this.childNodes;
          for (var c = 0, d; c < a.length; c++)d = a[c].cloneNode(!0), b.appendChild(d);
        }
        return b;
      },
      getRootNode() {
        return id(this);
      },
      contains(a) {
        return Cb(this, a);
      },
      dispatchEvent(a) {
        Hb();
        return C.dispatchEvent.call(this, a);
      },
    };
  Object.defineProperties($d, {
    isConnected: {
      get() {
        if (xc && xc.call(this)) return !0;
        if (this.nodeType == Node.DOCUMENT_FRAGMENT_NODE) return !1;
        let a = this.ownerDocument;
        if (Bb) {
          if (C.contains.call(a, this)) return !0;
        } else if (a.documentElement && C.contains.call(a.documentElement, this)) return !0;
        for (a = this; a && !(a instanceof Document);)a = a.parentNode || (B(a) ? a.host : void 0);
        return !!(a && a instanceof Document);
      },
      configurable: !0,
    },
  });
  const ae = {
    get assignedSlot() {
      return Yd(this);
    },
  }; const be = {
    querySelector(a) {
      return jd(this, b => qb.call(b, a), a => !!a)[0] || null;
    },
    querySelectorAll(a, b) {
      if (b) {
        b = Array.prototype.slice.call(C.querySelectorAll.call(this, a));
        const c = this.getRootNode();
        return b.filter(a => a.getRootNode() == c);
      }
      return jd(this, b => qb.call(b, a));
    },
  }; const ce = {
    assignedNodes(a) {
      if (this.localName === 'slot') {
        let b = this.getRootNode();
        B(b) && Sd(b);
        return (b = z(this))
          ? (a && a.flatten ? b.N : b.assignedNodes) || [] : [];
      }
    },
  }; const
    de = sb({
      setAttribute(a, b) {
        md(this, a, b);
      },
      removeAttribute(a) {
        C.removeAttribute.call(this, a);
        ed(this, a);
      },
      attachShadow(a) {
        if (!this) throw 'Must provide a host.';
        if (!a) throw 'Not enough arguments.';
        return new Gc(Od, this, a);
      },
      get slot() {
        return this.getAttribute('slot');
      },
      set slot(a) {
        md(this, 'slot', a);
      },
      get assignedSlot() {
        return Yd(this);
      },
    }, be, ce);
  Object.defineProperties(de, Cc);
  const ee = sb({
    importNode(a, b) {
      return nd(a, b);
    },
    getElementById(a) {
      return jd(this, b => b.id == a, a => !!a)[0] || null;
    },
  }, be);
  Object.defineProperties(ee, { _activeElement: Dc.activeElement });
  for (var fe = HTMLElement.prototype.blur, ge = {
      blur() {
        let a = z(this);
        (a = (a = a && a.root) && a.activeElement) ? a.blur() : fe.call(this);
      },
    }, he = {}, ie = ma(Object.getOwnPropertyNames(Document.prototype)), je = ie.next(); !je.done; he = { H: he.H }, je = ie.next()) {
    he.H = je.value, he.H.substring(0, 2) === 'on' && Object.defineProperty(ge, he.H, {
      set: (function (a) {
        return function (b) {
          const c = x(this); const
            d = a.H.substring(2);
          c.Z[a.H] && this.removeEventListener(d, c.Z[a.H]);
          this.addEventListener(d, b, {});
          c.Z[a.H] = b;
        };
      }(he)),
      get: (function (a) {
        return function () {
          const b = z(this);
          return b && b.Z[a.H];
        };
      }(he)),
      configurable: !0,
    });
  }
  const ke = {
    addEventListener(a, b, c) {
      typeof c !== 'object' && (c = { capture: !!c });
      c.na = this;
      this.host.addEventListener(a, b, c);
    },
    removeEventListener(a, b, c) {
      typeof c !== 'object' && (c = { capture: !!c });
      c.na = this;
      this.host.removeEventListener(a, b, c);
    },
    getElementById(a) {
      return jd(this, b => b.id == a, a => !!a)[0] || null;
    },
  };

  function L(a, b) {
    for (let c = Object.getOwnPropertyNames(b), d = 0; d < c.length; d++) {
      const e = c[d]; const
        f = Object.getOwnPropertyDescriptor(b, e);
      f.value ? a[e] = f.value : Object.defineProperty(a, e, f);
    }
  }
  if (A.qa) {
    const ShadyDOM = {
      inUse: A.qa,
      patch(a) {
        Ic(a);
        Hc(a);
        return a;
      },
      isShadyRoot: B,
      enqueue: Gb,
      flush: Hb,
      settings: A,
      filterMutations: Mb,
      observeChildren: Kb,
      unobserveChildren: Lb,
      nativeMethods: C,
      nativeTree: J,
      deferConnectionCallbacks: A.deferConnectionCallbacks,
      handlesDynamicScoping: !0,
    };
    window.ShadyDOM = ShadyDOM;
    Id();
    const le = window.customElements && window.customElements.nativeHTMLElement || HTMLElement;
    L(Gc.prototype, ke);
    L(window.Node.prototype, $d);
    L(window.Window.prototype, Zd);
    L(window.Text.prototype, ae);
    L(window.DocumentFragment.prototype, be);
    L(window.Element.prototype, de);
    L(window.Document.prototype, ee);
    window.HTMLSlotElement && L(window.HTMLSlotElement.prototype, ce);
    L(le.prototype, ge);
    A.K && (Ec(window.Node.prototype), Ec(window.Text.prototype), Ec(window.DocumentFragment.prototype), Ec(window.Element.prototype), Ec(le.prototype), Ec(window.Document.prototype), window.HTMLSlotElement && Ec(window.HTMLSlotElement.prototype));
    Fc();
    window.ShadowRoot = Gc;
  }

  const me = new Set('annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph'.split(' '));

  function ne(a) {
    const b = me.has(a);
    a = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);
    return !b && a;
  }

  function M(a) {
    const b = a.isConnected;
    if (void 0 !== b) return b;
    for (; a && !(a.__CE_isImportDocument || a instanceof Document);)a = a.parentNode || (window.ShadowRoot && a instanceof ShadowRoot ? a.host : void 0);
    return !(!a || !(a.__CE_isImportDocument || a instanceof Document));
  }

  function oe(a, b) {
    for (; b && b !== a && !b.nextSibling;)b = b.parentNode;
    return b && b !== a ? b.nextSibling : null;
  }

  function pe(a, b, c) {
    c = void 0 === c ? new Set() : c;
    for (let d = a; d;) {
      if (d.nodeType === Node.ELEMENT_NODE) {
        let e = d;
        b(e);
        const f = e.localName;
        if (f === 'link' && e.getAttribute('rel') === 'import') {
          d = e.import;
          if (d instanceof Node && !c.has(d)) for (c.add(d), d = d.firstChild; d; d = d.nextSibling)pe(d, b, c);
          d = oe(a, e);
          continue;
        } else if (f === 'template') {
          d = oe(a, e);
          continue;
        }
        if (e = e.__CE_shadowRoot) for (e = e.firstChild; e; e = e.nextSibling)pe(e, b, c);
      }
      d = d.firstChild ? d.firstChild : oe(a, d);
    }
  }

  function N(a, b, c) {
    a[b] = c;
  }
  function qe() {
    this.a = new Map();
    this.m = new Map();
    this.f = [];
    this.c = !1;
  }

  function re(a, b, c) {
    a.a.set(b, c);
    a.m.set(c.constructor, c);
  }

  function se(a, b) {
    a.c = !0;
    a.f.push(b);
  }

  function te(a, b) {
    a.c && pe(b, b => a.b(b));
  }

  qe.prototype.b = function (a) {
    if (this.c && !a.__CE_patched) {
      a.__CE_patched = !0;
      for (let b = 0; b < this.f.length; b++) this.f[b](a);
    }
  };
  function O(a, b) {
    const c = [];
    pe(b, a => c.push(a));
    for (b = 0; b < c.length; b++) {
      const d = c[b];
      d.__CE_state === 1 ? a.connectedCallback(d) : ue(a, d);
    }
  }

  function P(a, b) {
    const c = [];
    pe(b, a => c.push(a));
    for (b = 0; b < c.length; b++) {
      const d = c[b];
      d.__CE_state === 1 && a.disconnectedCallback(d);
    }
  }

  function Q(a, b, c) {
    c = void 0 === c ? {} : c;
    const d = c.fb || new Set();
    const e = c.ia || function (b) {
      return ue(a, b);
    };
    const f = [];
    pe(b, (b) => {
      if (b.localName === 'link' && b.getAttribute('rel') === 'import') {
        const c = b.import;
        c instanceof Node && (c.__CE_isImportDocument = !0, c.__CE_hasRegistry = !0);
        c && c.readyState === 'complete' ? c.__CE_documentLoadHandled = !0 : b.addEventListener('load', () => {
          const c = b.import;
          if (!c.__CE_documentLoadHandled) {
            c.__CE_documentLoadHandled = !0;
            const f = new Set(d);
            f.delete(c);
            Q(a, c, { fb: f, ia: e });
          }
        });
      } else f.push(b);
    }, d);
    if (a.c) for (b = 0; b < f.length; b++)a.b(f[b]);
    for (b = 0; b < f.length; b++)e(f[b]);
  }

  function ue(a, b) {
    if (void 0 === b.__CE_state) {
      let c = b.ownerDocument;
      if (c.defaultView || c.__CE_isImportDocument && c.__CE_hasRegistry) {
        if (c = a.a.get(b.localName)) {
          c.constructionStack.push(b);
          let d = c.constructor;
          try {
            try {
              if (new d() !== b) throw Error('The custom element constructor did not produce the element being upgraded.');
            } finally {
              c.constructionStack.pop();
            }
          } catch (g) {
            throw b.__CE_state = 2, g;
          }
          b.__CE_state = 1;
          b.__CE_definition = c;
          if (c.attributeChangedCallback) {
            for (c = c.observedAttributes, d = 0; d < c.length; d++) {
              const e = c[d];
              const f = b.getAttribute(e);
              f !== null && a.attributeChangedCallback(b, e, null, f, null);
            }
          }
          M(b) && a.connectedCallback(b);
        }
      }
    }
  }

  qe.prototype.connectedCallback = function (a) {
    const b = a.__CE_definition;
    b.connectedCallback && b.connectedCallback.call(a);
  };
  qe.prototype.disconnectedCallback = function (a) {
    const b = a.__CE_definition;
    b.disconnectedCallback && b.disconnectedCallback.call(a);
  };
  qe.prototype.attributeChangedCallback = function (a, b, c, d, e) {
    const f = a.__CE_definition;
    f.attributeChangedCallback && f.observedAttributes.indexOf(b) > -1 && f.attributeChangedCallback.call(a, b, c, d, e);
  };
  function ve(a) {
    const b = document;
    this.b = a;
    this.a = b;
    this.P = void 0;
    Q(this.b, this.a);
    this.a.readyState === 'loading' && (this.P = new MutationObserver(this.c.bind(this)), this.P.observe(this.a, {
      childList: !0,
      subtree: !0,
    }));
  }

  function we(a) {
    a.P && a.P.disconnect();
  }

  ve.prototype.c = function (a) {
    let b = this.a.readyState;
    b !== 'interactive' && b !== 'complete' || we(this);
    for (b = 0; b < a.length; b++) for (let c = a[b].addedNodes, d = 0; d < c.length; d++)Q(this.b, c[d]);
  };
  function xe() {
    const a = this;
    this.a = this.A = void 0;
    this.b = new Promise(((b) => {
      a.a = b;
      a.A && b(a.A);
    }));
  }

  xe.prototype.resolve = function (a) {
    if (this.A) throw Error('Already resolved.');
    this.A = a;
    this.a && this.a(a);
  };
  function S(a) {
    this.c = !1;
    this.a = a;
    this.G = new Map();
    this.f = function (a) {
      return a();
    };
    this.b = !1;
    this.m = [];
    this.fa = new ve(a);
  }

  r = S.prototype;
  r.define = function (a, b) {
    const c = this;
    if (!(b instanceof Function)) throw new TypeError('Custom element constructors must be functions.');
    if (!ne(a)) throw new SyntaxError(`The element name '${a}' is not valid.`);
    if (this.a.a.get(a)) throw Error(`A custom element with name '${a}' has already been defined.`);
    if (this.c) throw Error('A custom element is already being defined.');
    this.c = !0;
    try {
      const d = function (a) {
        const b = e[a];
        if (void 0 !== b && !(b instanceof Function)) throw Error(`The '${a}' callback must be a function.`);
        return b;
      }; var
        e = b.prototype;
      if (!(e instanceof Object)) throw new TypeError("The custom element constructor's prototype is not an object.");
      var f = d('connectedCallback');
      var g = d('disconnectedCallback');
      var h = d('adoptedCallback');
      var k = d('attributeChangedCallback');
      var l = b.observedAttributes || [];
    } catch (n) {
      return;
    } finally {
      this.c = !1;
    }
    b = {
      localName: a,
      constructor: b,
      connectedCallback: f,
      disconnectedCallback: g,
      adoptedCallback: h,
      attributeChangedCallback: k,
      observedAttributes: l,
      constructionStack: [],
    };
    re(this.a, a, b);
    this.m.push(b);
    this.b || (this.b = !0, this.f(() => ye(c)));
  };
  r.ia = function (a) {
    Q(this.a, a);
  };
  function ye(a) {
    if (!1 !== a.b) {
      a.b = !1;
      for (var b = a.m, c = [], d = new Map(), e = 0; e < b.length; e++)d.set(b[e].localName, []);
      Q(a.a, document, {
        ia(b) {
          if (void 0 === b.__CE_state) {
            const e = b.localName; const
              f = d.get(e);
            f ? f.push(b) : a.a.a.get(e) && c.push(b);
          }
        },
      });
      for (e = 0; e < c.length; e++)ue(a.a, c[e]);
      for (; b.length > 0;) {
        let f = b.shift();
        e = f.localName;
        f = d.get(f.localName);
        for (let g = 0; g < f.length; g++)ue(a.a, f[g]);
        (e = a.G.get(e)) && e.resolve(void 0);
      }
    }
  }

  r.get = function (a) {
    if (a = this.a.a.get(a)) return a.constructor;
  };
  r.Ca = function (a) {
    if (!ne(a)) return Promise.reject(new SyntaxError(`'${a}' is not a valid custom element name.`));
    let b = this.G.get(a);
    if (b) return b.b;
    b = new xe();
    this.G.set(a, b);
    this.a.a.get(a) && !this.m.some(b => b.localName === a) && b.resolve(void 0);
    return b.b;
  };
  r.Ya = function (a) {
    we(this.fa);
    const b = this.f;
    this.f = function (c) {
      return a(() => b(c));
    };
  };
  window.CustomElementRegistry = S;
  S.prototype.define = S.prototype.define;
  S.prototype.upgrade = S.prototype.ia;
  S.prototype.get = S.prototype.get;
  S.prototype.whenDefined = S.prototype.Ca;
  S.prototype.polyfillWrapFlushCallback = S.prototype.Ya;
  const ze = window.Document.prototype.createElement; const Ae = window.Document.prototype.createElementNS;
  const Be = window.Document.prototype.importNode; const Ce = window.Document.prototype.prepend;
  const De = window.Document.prototype.append; const Ee = window.DocumentFragment.prototype.prepend;
  const Fe = window.DocumentFragment.prototype.append; const Ge = window.Node.prototype.cloneNode;
  const He = window.Node.prototype.appendChild; const Ie = window.Node.prototype.insertBefore;
  const Je = window.Node.prototype.removeChild; const Ke = window.Node.prototype.replaceChild;
  const Le = Object.getOwnPropertyDescriptor(window.Node.prototype,
    'textContent'); const Me = window.Element.prototype.attachShadow;
  const Ne = Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML');
  const Oe = window.Element.prototype.getAttribute; const Pe = window.Element.prototype.setAttribute;
  const Qe = window.Element.prototype.removeAttribute; const Re = window.Element.prototype.getAttributeNS;
  const Se = window.Element.prototype.setAttributeNS; const Te = window.Element.prototype.removeAttributeNS;
  const Ue = window.Element.prototype.insertAdjacentElement; const Ve = window.Element.prototype.insertAdjacentHTML;
  const We = window.Element.prototype.prepend;
  const Xe = window.Element.prototype.append; const Ye = window.Element.prototype.before; const Ze = window.Element.prototype.after;
  const $e = window.Element.prototype.replaceWith; const af = window.Element.prototype.remove; const bf = window.HTMLElement;
  const cf = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML');
  const df = window.HTMLElement.prototype.insertAdjacentElement; const
    ef = window.HTMLElement.prototype.insertAdjacentHTML;
  const ff = new function () {
  }();

  function gf() {
    const a = hf;
    window.HTMLElement = (function () {
      function b() {
        const b = this.constructor; let
          d = a.m.get(b);
        if (!d) throw Error('The custom element being constructed was not registered with `customElements`.');
        let e = d.constructionStack;
        if (e.length === 0) return e = ze.call(document, d.localName), Object.setPrototypeOf(e, b.prototype), e.__CE_state = 1, e.__CE_definition = d, a.b(e), e;
        d = e.length - 1;
        const f = e[d];
        if (f === ff) throw Error('The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.');
        e[d] = ff;
        Object.setPrototypeOf(f, b.prototype);
        a.b(f);
        return f;
      }

      b.prototype = bf.prototype;
      Object.defineProperty(b.prototype, 'constructor', {
        writable: !0,
        configurable: !0,
        enumerable: !1,
        value: b,
      });
      return b;
    }());
  }
  function jf(a, b, c) {
    function d(b) {
      return function (c) {
        for (var d = [], e = 0; e < arguments.length; ++e)d[e] = arguments[e];
        e = [];
        for (var f = [], l = 0; l < d.length; l++) {
          let n = d[l];
          n instanceof Element && M(n) && f.push(n);
          if (n instanceof DocumentFragment) for (n = n.firstChild; n; n = n.nextSibling)e.push(n); else e.push(n);
        }
        b.apply(this, d);
        for (d = 0; d < f.length; d++)P(a, f[d]);
        if (M(this)) for (d = 0; d < e.length; d++)f = e[d], f instanceof Element && O(a, f);
      };
    }

    void 0 !== c.ha && (b.prepend = d(c.ha));
    void 0 !== c.append && (b.append = d(c.append));
  }
  function kf() {
    const a = hf;
    N(Document.prototype, 'createElement', function (b) {
      if (this.__CE_hasRegistry) {
        const c = a.a.get(b);
        if (c) return new c.constructor();
      }
      b = ze.call(this, b);
      a.b(b);
      return b;
    });
    N(Document.prototype, 'importNode', function (b, c) {
      b = Be.call(this, b, c);
      this.__CE_hasRegistry ? Q(a, b) : te(a, b);
      return b;
    });
    N(Document.prototype, 'createElementNS', function (b, c) {
      if (this.__CE_hasRegistry && (b === null || b === 'http://www.w3.org/1999/xhtml')) {
        const d = a.a.get(c);
        if (d) return new d.constructor();
      }
      b = Ae.call(this, b, c);
      a.b(b);
      return b;
    });
    jf(a, Document.prototype, { ha: Ce, append: De });
  }
  function lf() {
    function a(a, d) {
      Object.defineProperty(a, 'textContent', {
        enumerable: d.enumerable,
        configurable: !0,
        get: d.get,
        set(a) {
          if (this.nodeType === Node.TEXT_NODE) d.set.call(this, a); else {
            let c = void 0;
            if (this.firstChild) {
              const e = this.childNodes; const
                h = e.length;
              if (h > 0 && M(this)) {
                c = Array(h);
                for (let k = 0; k < h; k++)c[k] = e[k];
              }
            }
            d.set.call(this, a);
            if (c) for (a = 0; a < c.length; a++)P(b, c[a]);
          }
        },
      });
    }

    var b = hf;
    N(Node.prototype, 'insertBefore', function (a, d) {
      if (a instanceof DocumentFragment) {
        var c = Array.prototype.slice.apply(a.childNodes);
        a = Ie.call(this, a, d);
        if (M(this)) for (d = 0; d < c.length; d++)O(b, c[d]);
        return a;
      }
      c = M(a);
      d = Ie.call(this, a, d);
      c && P(b, a);
      M(this) && O(b, a);
      return d;
    });
    N(Node.prototype, 'appendChild', function (a) {
      if (a instanceof DocumentFragment) {
        var c = Array.prototype.slice.apply(a.childNodes);
        a = He.call(this, a);
        if (M(this)) for (var e = 0; e < c.length; e++)O(b, c[e]);
        return a;
      }
      c = M(a);
      e = He.call(this, a);
      c && P(b, a);
      M(this) && O(b, a);
      return e;
    });
    N(Node.prototype, 'cloneNode', function (a) {
      a = Ge.call(this, a);
      this.ownerDocument.__CE_hasRegistry ? Q(b, a)
        : te(b, a);
      return a;
    });
    N(Node.prototype, 'removeChild', function (a) {
      const c = M(a); const
        e = Je.call(this, a);
      c && P(b, a);
      return e;
    });
    N(Node.prototype, 'replaceChild', function (a, d) {
      if (a instanceof DocumentFragment) {
        var c = Array.prototype.slice.apply(a.childNodes);
        a = Ke.call(this, a, d);
        if (M(this)) for (P(b, d), d = 0; d < c.length; d++)O(b, c[d]);
        return a;
      }
      c = M(a);
      const f = Ke.call(this, a, d); const
        g = M(this);
      g && P(b, d);
      c && P(b, a);
      g && O(b, a);
      return f;
    });
    Le && Le.get ? a(Node.prototype, Le) : se(b, (b) => {
      a(b, {
        enumerable: !0,
        configurable: !0,
        get() {
          for (var a = [], b = 0; b < this.childNodes.length; b++)a.push(this.childNodes[b].textContent);
          return a.join('');
        },
        set(a) {
          for (; this.firstChild;)Je.call(this, this.firstChild);
          He.call(this, document.createTextNode(a));
        },
      });
    });
  }
  function mf(a) {
    function b(b) {
      return function (c) {
        for (var d = [], e = 0; e < arguments.length; ++e)d[e] = arguments[e];
        e = [];
        for (var h = [], k = 0; k < d.length; k++) {
          let l = d[k];
          l instanceof Element && M(l) && h.push(l);
          if (l instanceof DocumentFragment) for (l = l.firstChild; l; l = l.nextSibling)e.push(l); else e.push(l);
        }
        b.apply(this, d);
        for (d = 0; d < h.length; d++)P(a, h[d]);
        if (M(this)) for (d = 0; d < e.length; d++)h = e[d], h instanceof Element && O(a, h);
      };
    }

    const c = Element.prototype;
    void 0 !== Ye && (c.before = b(Ye));
    void 0 !== Ye && (c.after = b(Ze));
    void 0 !== $e
    && N(c, 'replaceWith', function (b) {
      for (var c = [], d = 0; d < arguments.length; ++d)c[d] = arguments[d];
      d = [];
      for (var g = [], h = 0; h < c.length; h++) {
        let k = c[h];
        k instanceof Element && M(k) && g.push(k);
        if (k instanceof DocumentFragment) for (k = k.firstChild; k; k = k.nextSibling)d.push(k); else d.push(k);
      }
      h = M(this);
      $e.apply(this, c);
      for (c = 0; c < g.length; c++)P(a, g[c]);
      if (h) for (P(a, this), c = 0; c < d.length; c++)g = d[c], g instanceof Element && O(a, g);
    });
    void 0 !== af && N(c, 'remove', function () {
      const b = M(this);
      af.call(this);
      b && P(a, this);
    });
  }
  function nf() {
    function a(a, b) {
      Object.defineProperty(a, 'innerHTML', {
        enumerable: b.enumerable,
        configurable: !0,
        get: b.get,
        set(a) {
          const c = this; let
            e = void 0;
          M(this) && (e = [], pe(this, (a) => {
            a !== c && e.push(a);
          }));
          b.set.call(this, a);
          if (e) {
            for (let f = 0; f < e.length; f++) {
              const g = e[f];
              g.__CE_state === 1 && d.disconnectedCallback(g);
            }
          }
          this.ownerDocument.__CE_hasRegistry ? Q(d, this) : te(d, this);
          return a;
        },
      });
    }

    function b(a, b) {
      N(a, 'insertAdjacentElement', function (a, c) {
        const e = M(c);
        a = b.call(this, a, c);
        e && P(d, c);
        M(a) && O(d, c);
        return a;
      });
    }

    function c(a, b) {
      function c(a, b) {
        for (var c = []; a !== b; a = a.nextSibling)c.push(a);
        for (b = 0; b < c.length; b++)Q(d, c[b]);
      }

      N(a, 'insertAdjacentHTML', function (a, d) {
        a = a.toLowerCase();
        if (a === 'beforebegin') {
          var e = this.previousSibling;
          b.call(this, a, d);
          c(e || this.parentNode.firstChild, this);
        } else if (a === 'afterbegin') e = this.firstChild, b.call(this, a, d), c(this.firstChild, e); else if (a === 'beforeend') e = this.lastChild, b.call(this, a, d), c(e || this.firstChild, null); else if (a === 'afterend') {
          e = this.nextSibling, b.call(this, a, d), c(this.nextSibling,
            e);
        } else throw new SyntaxError(`The value provided (${String(a)}) is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.`);
      });
    }

    var d = hf;
    Me && N(Element.prototype, 'attachShadow', function (a) {
      return this.__CE_shadowRoot = a = Me.call(this, a);
    });
    Ne && Ne.get ? a(Element.prototype, Ne) : cf && cf.get ? a(HTMLElement.prototype, cf) : se(d, (b) => {
      a(b, {
        enumerable: !0,
        configurable: !0,
        get() {
          return Ge.call(this, !0).innerHTML;
        },
        set(a) {
          const b = this.localName === 'template'; const c = b ? this.content : this; const
            d = Ae.call(document,
              this.namespaceURI, this.localName);
          for (d.innerHTML = a; c.childNodes.length > 0;)Je.call(c, c.childNodes[0]);
          for (a = b ? d.content : d; a.childNodes.length > 0;)He.call(c, a.childNodes[0]);
        },
      });
    });
    N(Element.prototype, 'setAttribute', function (a, b) {
      if (this.__CE_state !== 1) return Pe.call(this, a, b);
      const c = Oe.call(this, a);
      Pe.call(this, a, b);
      b = Oe.call(this, a);
      d.attributeChangedCallback(this, a, c, b, null);
    });
    N(Element.prototype, 'setAttributeNS', function (a, b, c) {
      if (this.__CE_state !== 1) return Se.call(this, a, b, c);
      const e = Re.call(this, a,
        b);
      Se.call(this, a, b, c);
      c = Re.call(this, a, b);
      d.attributeChangedCallback(this, b, e, c, a);
    });
    N(Element.prototype, 'removeAttribute', function (a) {
      if (this.__CE_state !== 1) return Qe.call(this, a);
      const b = Oe.call(this, a);
      Qe.call(this, a);
      b !== null && d.attributeChangedCallback(this, a, b, null, null);
    });
    N(Element.prototype, 'removeAttributeNS', function (a, b) {
      if (this.__CE_state !== 1) return Te.call(this, a, b);
      const c = Re.call(this, a, b);
      Te.call(this, a, b);
      const e = Re.call(this, a, b);
      c !== e && d.attributeChangedCallback(this, b, c, e, a);
    });
    df ? b(HTMLElement.prototype,
      df) : Ue ? b(Element.prototype, Ue) : console.warn('Custom Elements: `Element#insertAdjacentElement` was not patched.');
    ef ? c(HTMLElement.prototype, ef) : Ve ? c(Element.prototype, Ve) : console.warn('Custom Elements: `Element#insertAdjacentHTML` was not patched.');
    jf(d, Element.prototype, { ha: We, append: Xe });
    mf(d);
  }
  const of = window.customElements;
  if (!of || of.forcePolyfill || typeof of.define !== 'function' || typeof of.get !== 'function') {
    var hf = new qe();
    gf();
    kf();
    jf(hf, DocumentFragment.prototype, { ha: Ee, append: Fe });
    lf();
    nf();
    document.__CE_hasRegistry = !0;
    const customElements = new S(hf);
    Object.defineProperty(window, 'customElements', { configurable: !0, enumerable: !0, value: customElements });
  }

  function pf() {
    this.end = this.start = 0;
    this.rules = this.parent = this.previous = null;
    this.cssText = this.parsedCssText = '';
    this.atRule = !1;
    this.type = 0;
    this.parsedSelector = this.selector = this.keyframesName = '';
  }

  function qf(a) {
    a = a.replace(rf, '').replace(sf, '');
    const b = vf; const c = a; const
      d = new pf();
    d.start = 0;
    d.end = c.length;
    for (let e = d, f = 0, g = c.length; f < g; f++) {
      if (c[f] === '{') {
        e.rules || (e.rules = []);
        const h = e; const
          k = h.rules[h.rules.length - 1] || null;
        e = new pf();
        e.start = f + 1;
        e.parent = h;
        e.previous = k;
        h.rules.push(e);
      } else c[f] === '}' && (e.end = f + 1, e = e.parent || d);
    }
    return b(d, a);
  }

  function vf(a, b) {
    let c = b.substring(a.start, a.end - 1);
    a.parsedCssText = a.cssText = c.trim();
    a.parent && (c = b.substring(a.previous ? a.previous.end : a.parent.start, a.start - 1), c = wf(c), c = c.replace(xf, ' '), c = c.substring(c.lastIndexOf(';') + 1), c = a.parsedSelector = a.selector = c.trim(), a.atRule = c.indexOf('@') === 0, a.atRule ? c.indexOf('@media') === 0 ? a.type = yf : c.match(zf) && (a.type = Af, a.keyframesName = a.selector.split(xf).pop()) : a.type = c.indexOf('--') === 0 ? Bf : Cf);
    if (c = a.rules) {
      for (let d = 0, e = c.length, f = void 0; d < e && (f = c[d]); d++) {
        vf(f,
          b);
      }
    }
    return a;
  }

  function wf(a) {
    return a.replace(/\\([0-9a-f]{1,6})\s/gi, (a, c) => {
      a = c;
      for (c = 6 - a.length; c--;)a = `0${a}`;
      return `\\${a}`;
    });
  }

  function Df(a, b, c) {
    c = void 0 === c ? '' : c;
    let d = '';
    if (a.cssText || a.rules) {
      const e = a.rules; let
        f;
      if (f = e) f = e[0], f = !(f && f.selector && f.selector.indexOf('--') === 0);
      if (f) {
        f = 0;
        for (let g = e.length, h = void 0; f < g && (h = e[f]); f++)d = Df(h, b, d);
      } else b ? b = a.cssText : (b = a.cssText, b = b.replace(Ef, '').replace(Ff, ''), b = b.replace(Gf, '').replace(Hf, '')), (d = b.trim()) && (d = `  ${d}\n`);
    }
    d && (a.selector && (c += `${a.selector} {\n`), c += d, a.selector && (c += '}\n\n'));
    return c;
  }

  var Cf = 1; var Af = 7; var yf = 4; var Bf = 1E3; var rf = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim; var sf = /@import[^;]*;/gim;
  var Ef = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim;
  var Ff = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim;
  var Gf = /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim; var Hf = /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim;
  var zf = /^@[^\s]*keyframes/; var
    xf = /\s+/g;
  const T = !(window.ShadyDOM && window.ShadyDOM.inUse); let
    If;

  function Jf(a) {
    If = a && a.shimcssproperties ? !1 : T || !(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) || !window.CSS || !CSS.supports || !CSS.supports('box-shadow', '0 0 0 var(--foo)'));
  }

  window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss ? If = window.ShadyCSS.nativeCss : window.ShadyCSS ? (Jf(window.ShadyCSS), window.ShadyCSS = void 0) : Jf(window.WebComponents && window.WebComponents.flags);
  const V = If;
  const Kf = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi;
  const Lf = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi; const Mf = /(--[\w-]+)\s*([:,;)]|$)/gi;
  const Nf = /(animation\s*:)|(animation-name\s*:)/; const Of = /@media\s(.*)/; const
    Pf = /\{[^}]*\}/g;
  const Qf = new Set();

  function Rf(a, b) {
    if (!a) return '';
    typeof a === 'string' && (a = qf(a));
    b && Sf(a, b);
    return Df(a, V);
  }

  function Tf(a) {
    !a.__cssRules && a.textContent && (a.__cssRules = qf(a.textContent));
    return a.__cssRules || null;
  }

  function Uf(a) {
    return !!a.parent && a.parent.type === Af;
  }

  function Sf(a, b, c, d) {
    if (a) {
      let e = !1; let
        f = a.type;
      if (d && f === yf) {
        var g = a.selector.match(Of);
        g && (window.matchMedia(g[1]).matches || (e = !0));
      }
      f === Cf ? b(a) : c && f === Af ? c(a) : f === Bf && (e = !0);
      if ((a = a.rules) && !e) for (e = 0, f = a.length, g = void 0; e < f && (g = a[e]); e++)Sf(g, b, c, d);
    }
  }

  function Vf(a, b, c, d) {
    const e = document.createElement('style');
    b && e.setAttribute('scope', b);
    e.textContent = a;
    Wf(e, c, d);
    return e;
  }

  let Xf = null;

  function Yf(a) {
    a = document.createComment(` Shady DOM styles for ${a} `);
    const b = document.head;
    b.insertBefore(a, (Xf ? Xf.nextSibling : null) || b.firstChild);
    return Xf = a;
  }

  function Wf(a, b, c) {
    b = b || document.head;
    b.insertBefore(a, c && c.nextSibling || b.firstChild);
    Xf ? a.compareDocumentPosition(Xf) === Node.DOCUMENT_POSITION_PRECEDING && (Xf = a) : Xf = a;
  }

  function Zf(a, b) {
    for (let c = 0, d = a.length; b < d; b++) if (a[b] === '(') c++; else if (a[b] === ')' && --c === 0) return b;
    return -1;
  }

  function $f(a, b) {
    let c = a.indexOf('var(');
    if (c === -1) return b(a, '', '', '');
    let d = Zf(a, c + 3); const
      e = a.substring(c + 4, d);
    c = a.substring(0, c);
    a = $f(a.substring(d + 1), b);
    d = e.indexOf(',');
    return d === -1 ? b(c, e.trim(), '', a) : b(c, e.substring(0, d).trim(), e.substring(d + 1).trim(), a);
  }

  function ag(a, b) {
    T ? a.setAttribute('class', b) : window.ShadyDOM.nativeMethods.setAttribute.call(a, 'class', b);
  }

  function bg(a) {
    let b = a.localName; let
      c = '';
    b ? b.indexOf('-') > -1 || (c = b, b = a.getAttribute && a.getAttribute('is') || '') : (b = a.is, c = a.extends);
    return { is: b, X: c };
  }

  function cg(a) {
    for (var b = [], c = '', d = 0; d >= 0 && d < a.length; d++) {
      if (a[d] === '(') {
        const e = Zf(a, d);
        c += a.slice(d, e + 1);
        d = e;
      } else a[d] === ',' ? (b.push(c), c = '') : c += a[d];
    }
    c && b.push(c);
    return b;
  }

  function dg(a) {
    if (void 0 === a.ja) {
      let b = a.getAttribute('css-build');
      if (b) a.ja = b; else {
        a: {
          b = a.localName === 'template' ? a.content.firstChild : a.firstChild;
          if (b instanceof Comment && (b = b.textContent.trim().split(':'), b[0] === 'css-build')) {
            b = b[1];
            break a;
          }
          b = '';
        }
        if (b !== '') {
          const c = a.localName === 'template' ? a.content.firstChild : a.firstChild;
          c.parentNode.removeChild(c);
        }
        a.ja = b;
      }
    }
    return a.ja || '';
  }
  function eg() {
  }

  function fg(a, b) {
    gg(W, a, (a) => {
      hg(a, b || '');
    });
  }

  function gg(a, b, c) {
    b.nodeType === Node.ELEMENT_NODE && c(b);
    if (b = b.localName === 'template' ? (b.content || b.kb || b).childNodes : b.children || b.childNodes) for (let d = 0; d < b.length; d++)gg(a, b[d], c);
  }

  function hg(a, b, c) {
    if (b) {
      if (a.classList) c ? (a.classList.remove('style-scope'), a.classList.remove(b)) : (a.classList.add('style-scope'), a.classList.add(b)); else if (a.getAttribute) {
        const d = a.getAttribute(ig);
        c ? d && (b = d.replace('style-scope', '').replace(b, ''), ag(a, b)) : ag(a, `${d ? `${d} ` : ''}style-scope ${b}`);
      }
    }
  }

  function jg(a, b, c) {
    gg(W, a, (a) => {
      hg(a, b, !0);
      hg(a, c);
    });
  }

  function kg(a, b) {
    gg(W, a, (a) => {
      hg(a, b || '', !0);
    });
  }

  function lg(a, b, c, d) {
    const e = W;
    T || (void 0 === d ? '' : d) === 'shady' ? b = Rf(b, c) : (a = bg(a), b = `${mg(e, b, a.is, a.X, c)}\n\n`);
    return b.trim();
  }

  function mg(a, b, c, d, e) {
    const f = ng(c, d);
    c = c ? og + c : '';
    return Rf(b, (b) => {
      b.c || (b.selector = b.F = pg(a, b, a.b, c, f), b.c = !0);
      e && e(b, c, f);
    });
  }

  function ng(a, b) {
    return b ? `[is=${a}]` : a;
  }

  function pg(a, b, c, d, e) {
    const f = cg(b.selector);
    if (!Uf(b)) {
      b = 0;
      for (let g = f.length, h = void 0; b < g && (h = f[b]); b++)f[b] = c.call(a, h, d, e);
    }
    return f.filter(a => !!a).join(qg);
  }

  function rg(a) {
    return a.replace(sg, (a, c, d) => {
      d.indexOf('+') > -1 ? d = d.replace(/\+/g, '___') : d.indexOf('___') > -1 && (d = d.replace(/___/g, '+'));
      return `:${c}(${d})`;
    });
  }

  function tg(a) {
    for (var b = [], c; c = a.match(ug);) {
      const d = c.index; const
        e = Zf(a, d);
      if (e === -1) throw Error(`${c.input} selector missing ')'`);
      c = a.slice(d, e + 1);
      a = a.replace(c, '\ue000');
      b.push(c);
    }
    return { sa: a, matches: b };
  }

  function vg(a, b) {
    const c = a.split('\ue000');
    return b.reduce((a, b, f) => a + b + c[f + 1], c[0]);
  }

  eg.prototype.b = function (a, b, c) {
    let d = !1;
    a = a.trim();
    const e = sg.test(a);
    e && (a = a.replace(sg, (a, b, c) => `:${b}(${c.replace(/\s/g, '')})`), a = rg(a));
    const f = ug.test(a);
    if (f) {
      var g = tg(a);
      a = g.sa;
      g = g.matches;
    }
    a = a.replace(wg, `${xg} $1`);
    a = a.replace(yg, (a, e, f) => {
      d || (a = zg(f, e, b, c), d = d || a.stop, e = a.Oa, f = a.value);
      return e + f;
    });
    f && (a = vg(a, g));
    e && (a = rg(a));
    return a;
  };
  function zg(a, b, c, d) {
    const e = a.indexOf(Ag);
    a.indexOf(xg) >= 0 ? a = Bg(a, d) : e !== 0 && (a = c ? Cg(a, c) : a);
    c = !1;
    e >= 0 && (b = '', c = !0);
    if (c) {
      var f = !0;
      c && (a = a.replace(Dg, (a, b) => ` > ${b}`));
    }
    a = a.replace(Eg, (a, b, c) => `[dir="${c}"] ${b}, ${b}[dir="${c}"]`);
    return { value: a, Oa: b, stop: f };
  }

  function Cg(a, b) {
    a = a.split(Fg);
    a[0] += b;
    return a.join(Fg);
  }

  function Bg(a, b) {
    let c = a.match(Gg);
    return (c = c && c[2].trim() || '') ? c[0].match(Hg) ? a.replace(Gg, (a, c, f) => b + f) : c.split(Hg)[0] === b ? c : Ig : a.replace(xg, b);
  }

  function Jg(a) {
    a.selector === Kg && (a.selector = 'html');
  }

  eg.prototype.c = function (a) {
    return a.match(xg) ? '' : a.match(Ag) ? this.b(a, Lg) : Cg(a.trim(), Lg);
  };
  fa.Object.defineProperties(eg.prototype, {
    a: {
      configurable: !0,
      enumerable: !0,
      get() {
        return 'style-scope';
      },
    },
  });
  var sg = /:(nth[-\w]+)\(([^)]+)\)/; var Lg = ':not(.style-scope)'; var qg = ',';
  var yg = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g; var Hg = /[[.:#*]/; var xg = ':host'; var Kg = ':root'; var Ag = '::slotted';
  var wg = new RegExp(`^(${Ag})`); var Gg = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
  var Dg = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/; var Eg = /(.*):dir\((?:(ltr|rtl))\)/; var og = '.'; var Fg = ':';
  var ig = 'class'; var Ig = 'should_not_match'; var ug = /:(?:matches|any|-(?:webkit|moz)-any)/; var
    W = new eg();

  function Mg(a, b, c, d, e) {
    this.M = a || null;
    this.b = b || null;
    this.c = c || [];
    this.T = null;
    this.da = e || '';
    this.X = d || '';
    this.a = this.I = this.O = null;
  }

  function X(a) {
    return a ? a.__styleInfo : null;
  }

  function Ng(a, b) {
    return a.__styleInfo = b;
  }

  Mg.prototype.f = function () {
    return this.M;
  };
  Mg.prototype._getStyleRules = Mg.prototype.f;
  function Og(a) {
    const b = this.matches || this.matchesSelector || this.mozMatchesSelector || this.msMatchesSelector || this.oMatchesSelector || this.webkitMatchesSelector;
    return b && b.call(this, a);
  }

  const Pg = navigator.userAgent.match('Trident');

  function Qg() {
  }

  function Rg(a) {
    const b = {}; const c = []; let
      d = 0;
    Sf(a, (a) => {
      Sg(a);
      a.index = d++;
      a = a.B.cssText;
      for (var c; c = Mf.exec(a);) {
        const e = c[1];
        c[2] !== ':' && (b[e] = !0);
      }
    }, (a) => {
      c.push(a);
    });
    a.b = c;
    a = [];
    for (const e in b)a.push(e);
    return a;
  }

  function Sg(a) {
    if (!a.B) {
      const b = {}; const
        c = {};
      Tg(a, c) && (b.L = c, a.rules = null);
      b.cssText = a.parsedCssText.replace(Pf, '').replace(Kf, '');
      a.B = b;
    }
  }

  function Tg(a, b) {
    let c = a.B;
    if (c) {
      if (c.L) return Object.assign(b, c.L), !0;
    } else {
      c = a.parsedCssText;
      for (var d; a = Kf.exec(c);) {
        d = (a[2] || a[3]).trim();
        if (d !== 'inherit' || d !== 'unset') b[a[1].trim()] = d;
        d = !0;
      }
      return d;
    }
  }

  function Ug(a, b, c) {
    b && (b = b.indexOf(';') >= 0 ? Vg(a, b, c) : $f(b, (b, e, f, g) => {
      if (!e) return b + g;
      (e = Ug(a, c[e], c)) && e !== 'initial' ? e === 'apply-shim-inherit' && (e = 'inherit') : e = Ug(a, c[f] || f, c) || f;
      return b + (e || '') + g;
    }));
    return b && b.trim() || '';
  }

  function Vg(a, b, c) {
    b = b.split(';');
    for (var d = 0, e, f; d < b.length; d++) {
      if (e = b[d]) {
        Lf.lastIndex = 0;
        if (f = Lf.exec(e)) e = Ug(a, c[f[1]], c); else if (f = e.indexOf(':'), f !== -1) {
          let g = e.substring(f);
          g = g.trim();
          g = Ug(a, g, c) || g;
          e = e.substring(0, f) + g;
        }
        b[d] = e && e.lastIndexOf(';') === e.length - 1 ? e.slice(0, -1) : e || '';
      }
    }
    return b.join(';');
  }

  function Wg(a, b) {
    const c = {}; const
      d = [];
    Sf(a, (a) => {
      a.B || Sg(a);
      let e = a.F || a.parsedSelector;
      b && a.B.L && e && Og.call(b, e) && (Tg(a, c), a = a.index, e = parseInt(a / 32, 10), d[e] = (d[e] || 0) | 1 << a % 32);
    }, null, !0);
    return { L: c, key: d };
  }

  function Xg(a, b, c, d) {
    b.B || Sg(b);
    if (b.B.L) {
      let e = bg(a);
      a = e.is;
      e = e.X;
      e = a ? ng(a, e) : 'html';
      const f = b.parsedSelector; let g = f === ':host > *' || f === 'html'; let
        h = f.indexOf(':host') === 0 && !g;
      c === 'shady' && (g = f === `${e} > *.${e}` || f.indexOf('html') !== -1, h = !g && f.indexOf(e) === 0);
      if (g || h) {
        c = e, h && (b.F || (b.F = pg(W, b, W.b, a ? og + a : '', e)), c = b.F || e), d({
          sa: c,
          Va: h,
          vb: g,
        });
      }
    }
  }

  function Yg(a, b, c) {
    const d = {}; const
      e = {};
    Sf(b, (b) => {
      Xg(a, b, c, (c) => {
        Og.call(a.lb || a, c.sa) && (c.Va ? Tg(b, d) : Tg(b, e));
      });
    }, null, !0);
    return { Za: e, Ta: d };
  }

  function Zg(a, b, c, d) {
    let e = bg(b); const f = ng(e.is, e.X);
    const g = new RegExp(`(?:^|[^.#[:])${b.extends ? `\\${f.slice(0, -1)}\\]` : f}($|[.:[\\s>+~])`);
    let h = X(b);
    e = h.M;
    h = h.da;
    const k = $g(e, d);
    return lg(b, e, (b) => {
      let e = '';
      b.B || Sg(b);
      b.B.cssText && (e = Vg(a, b.B.cssText, c));
      b.cssText = e;
      if (!T && !Uf(b) && b.cssText) {
        let h = e = b.cssText;
        b.xa == null && (b.xa = Nf.test(e));
        if (b.xa) {
          if (b.ga == null) {
            b.ga = [];
            for (var l in k)h = k[l], h = h(e), e !== h && (e = h, b.ga.push(l));
          } else {
            for (l = 0; l < b.ga.length; ++l)h = k[b.ga[l]], e = h(e);
            h = e;
          }
        }
        b.cssText = h;
        b.F = b.F || b.selector;
        e = `.${d}`;
        l = cg(b.F);
        h = 0;
        for (let u = l.length, w = void 0; h < u && (w = l[h]); h++)l[h] = w.match(g) ? w.replace(f, e) : `${e} ${w}`;
        b.selector = l.join(',');
      }
    }, h);
  }

  function $g(a, b) {
    a = a.b;
    const c = {};
    if (!T && a) {
      for (let d = 0, e = a[d]; d < a.length; e = a[++d]) {
        const f = e; const
          g = b;
        f.f = new RegExp(`\\b${f.keyframesName}(?!\\B|-)`, 'g');
        f.a = `${f.keyframesName}-${g}`;
        f.F = f.F || f.selector;
        f.selector = f.F.replace(f.keyframesName, f.a);
        c[e.keyframesName] = ah(e);
      }
    }
    return c;
  }

  function ah(a) {
    return function (b) {
      return b.replace(a.f, a.a);
    };
  }

  function bh(a, b) {
    const c = ch; const
      d = Tf(a);
    a.textContent = Rf(d, (a) => {
      let d = a.cssText = a.parsedCssText;
      a.B && a.B.cssText && (d = d.replace(Ef, '').replace(Ff, ''), a.cssText = Vg(c, d, b));
    });
  }

  fa.Object.defineProperties(Qg.prototype, {
    a: {
      configurable: !0,
      enumerable: !0,
      get() {
        return 'x-scope';
      },
    },
  });
  var ch = new Qg();
  const dh = {}; const
    eh = window.customElements;
  if (eh && !T) {
    const fh = eh.define;
    eh.define = function (a, b, c) {
      dh[a] || (dh[a] = Yf(a));
      fh.call(eh, a, b, c);
    };
  }

  function gh() {
    this.cache = {};
  }

  gh.prototype.store = function (a, b, c, d) {
    const e = this.cache[a] || [];
    e.push({ L: b, styleElement: c, I: d });
    e.length > 100 && e.shift();
    this.cache[a] = e;
  };
  gh.prototype.fetch = function (a, b, c) {
    if (a = this.cache[a]) {
      for (let d = a.length - 1; d >= 0; d--) {
        const e = a[d]; var
          f;
        a: {
          for (f = 0; f < c.length; f++) {
            const g = c[f];
            if (e.L[g] !== b[g]) {
              f = !1;
              break a;
            }
          }
          f = !0;
        }
        if (f) return e;
      }
    }
  };
  function hh() {
  }

  function ih(a) {
    let b = [];
    a.classList ? b = Array.from(a.classList) : a instanceof window.SVGElement && a.hasAttribute('class') && (b = a.getAttribute('class').split(/\s+/));
    a = b;
    b = a.indexOf(W.a);
    return b > -1 ? a[b + 1] : '';
  }

  function jh(a) {
    const b = a.getRootNode();
    return b === a || b === a.ownerDocument ? '' : (a = b.host) ? bg(a).is : '';
  }

  function kh(a) {
    for (let b = 0; b < a.length; b++) {
      const c = a[b];
      if (c.target !== document.documentElement && c.target !== document.head) {
        for (let d = 0; d < c.addedNodes.length; d++) {
          let e = c.addedNodes[d];
          if (e.nodeType === Node.ELEMENT_NODE) {
            let f = e.getRootNode(); let
              g = ih(e);
            if (g && f === e.ownerDocument && (e.localName !== 'style' && e.localName !== 'template' || dg(e) === '')) kg(e, g); else if (f instanceof ShadowRoot) {
              for (f = jh(e), f !== g && jg(e, g, f), e = window.ShadyDOM.nativeMethods.querySelectorAll.call(e, `:not(.${W.a})`), g = 0; g < e.length; g++) {
                f = e[g];
                const h = jh(f);
                h && hg(f, h);
              }
            }
          }
        }
      }
    }
  }

  if (!(T || window.ShadyDOM && window.ShadyDOM.handlesDynamicScoping)) {
    const lh = new MutationObserver(kh); const
      mh = function (a) {
        lh.observe(a, { childList: !0, subtree: !0 });
      };
    if (window.customElements && !window.customElements.polyfillWrapFlushCallback) mh(document); else {
      const nh = function () {
        mh(document.body);
      };
      window.HTMLImports ? window.HTMLImports.whenReady(nh) : requestAnimationFrame(() => {
        if (document.readyState === 'loading') {
          var a = function () {
            nh();
            document.removeEventListener('readystatechange', a);
          };
          document.addEventListener('readystatechange',
            a);
        } else nh();
      });
    }
    hh = function () {
      kh(lh.takeRecords());
    };
  }
  const oh = hh;
  const ph = {};
  const qh = Promise.resolve();

  function rh(a) {
    if (a = ph[a]) a._applyShimCurrentVersion = a._applyShimCurrentVersion || 0, a._applyShimValidatingVersion = a._applyShimValidatingVersion || 0, a._applyShimNextVersion = (a._applyShimNextVersion || 0) + 1;
  }

  function sh(a) {
    return a._applyShimCurrentVersion === a._applyShimNextVersion;
  }

  function th(a) {
    a._applyShimValidatingVersion = a._applyShimNextVersion;
    a.b || (a.b = !0, qh.then(() => {
      a._applyShimCurrentVersion = a._applyShimNextVersion;
      a.b = !1;
    }));
  }
  const uh = new gh();

  function Y() {
    this.G = {};
    this.c = document.documentElement;
    const a = new pf();
    a.rules = [];
    this.f = Ng(this.c, new Mg(a));
    this.m = !1;
    this.b = this.a = null;
  }

  r = Y.prototype;
  r.flush = function () {
    oh();
  };
  r.Ra = function (a) {
    return Tf(a);
  };
  r.cb = function (a) {
    return Rf(a);
  };
  r.prepareTemplate = function (a, b, c) {
    this.prepareTemplateDom(a, b);
    this.prepareTemplateStyles(a, b, c);
  };
  r.prepareTemplateStyles = function (a, b, c) {
    if (!a.m) {
      T || dh[b] || (dh[b] = Yf(b));
      a.m = !0;
      a.name = b;
      a.extends = c;
      ph[b] = a;
      let d = dg(a);
      let e = [];
      for (var f = a.content.querySelectorAll('style'), g = 0; g < f.length; g++) {
        const h = f[g];
        if (h.hasAttribute('shady-unscoped')) {
          if (!T) {
            let k = h.textContent;
            Qf.has(k) || (Qf.add(k), k = h.cloneNode(!0), document.head.appendChild(k));
            h.parentNode.removeChild(h);
          }
        } else e.push(h.textContent), h.parentNode.removeChild(h);
      }
      e = e.join('').trim();
      c = { is: b, extends: c };
      vh(this);
      if (f = dg(a) === '') {
        f = Lf.test(e)
        || Kf.test(e), Lf.lastIndex = 0, Kf.lastIndex = 0;
      }
      e = qf(e);
      f && V && this.a && this.a.transformRules(e, b);
      a._styleAst = e;
      e = [];
      V || (e = Rg(a._styleAst));
      if (!e.length || V) f = T ? a.content : null, b = dh[b] || null, d = lg(c, a._styleAst, null, d), d = d.length ? Vf(d, c.is, f, b) : void 0, a.a = d;
      a.f = e;
    }
  };
  r.prepareTemplateDom = function (a, b) {
    const c = dg(a);
    T || c === 'shady' || a.c || (a.c = !0, fg(a.content, b));
  };
  function wh(a) {
    !a.b && window.ShadyCSS && window.ShadyCSS.CustomStyleInterface && (a.b = window.ShadyCSS.CustomStyleInterface, a.b.transformCallback = function (b) {
      a.Aa(b);
    }, a.b.validateCallback = function () {
      requestAnimationFrame(() => {
        (a.b.enqueued || a.m) && a.flushCustomStyles();
      });
    });
  }

  function vh(a) {
    !a.a && window.ShadyCSS && window.ShadyCSS.ApplyShim && (a.a = window.ShadyCSS.ApplyShim, a.a.invalidCallback = rh);
    wh(a);
  }

  r.flushCustomStyles = function () {
    vh(this);
    if (this.b) {
      const a = this.b.processStyles();
      if (this.b.enqueued) {
        if (V) {
          for (var b = 0; b < a.length; b++) {
            var c = this.b.getStyleForCustomStyle(a[b]);
            if (c && V && this.a) {
              const d = Tf(c);
              vh(this);
              this.a.transformRules(d);
              c.textContent = Rf(d);
            }
          }
        } else for (xh(this, this.c, this.f), b = 0; b < a.length; b++)(c = this.b.getStyleForCustomStyle(a[b])) && bh(c, this.f.O);
        this.b.enqueued = !1;
        this.m && !V && this.styleDocument();
      }
    }
  };
  r.styleElement = function (a, b) {
    let c = X(a);
    if (!c) {
      var d = bg(a);
      c = d.is;
      d = d.X;
      var e = dh[c] || null;
      c = ph[c];
      if (c) {
        var f = c._styleAst;
        var g = c.f;
        var h = dg(c);
      }
      f = new Mg(f, e, g, d, h);
      c && Ng(a, f);
      c = f;
    }
    a !== this.c && (this.m = !0);
    b && (c.T = c.T || {}, Object.assign(c.T, b));
    if (V) {
      b = c;
      f = bg(a).is;
      if (b.T) {
        g = b.T;
        for (var k in g)k === null ? a.style.removeProperty(k) : a.style.setProperty(k, g[k]);
      }
      if (!(!(k = ph[f]) && a !== this.c || k && dg(k) !== '') && k && k.a && !sh(k)) {
        if (sh(k) || k._applyShimValidatingVersion !== k._applyShimNextVersion) {
          vh(this), this.a && this.a.transformRules(k._styleAst,
            f), k.a.textContent = lg(a, b.M), th(k);
        }
        T && (f = a.shadowRoot) && (f = f.querySelector('style')) && (f.textContent = lg(a, b.M));
        b.M = k._styleAst;
      }
    } else if (k = c, this.flush(), xh(this, a, k), k.c && k.c.length) {
      b = bg(a).is;
      c = (f = uh.fetch(b, k.O, k.c)) ? f.styleElement : null;
      g = k.I;
      (h = f && f.I) || (h = this.G[b] = (this.G[b] || 0) + 1, h = `${b}-${h}`);
      k.I = h;
      h = k.I;
      d = ch;
      d = c ? c.textContent || '' : Zg(d, a, k.O, h);
      e = X(a);
      const l = e.a;
      l && !T && l !== c && (l._useCount--, l._useCount <= 0 && l.parentNode && l.parentNode.removeChild(l));
      T ? e.a ? (e.a.textContent = d, c = e.a) : d && (c = Vf(d,
        h, a.shadowRoot, e.b)) : c ? c.parentNode || (Pg && d.indexOf('@media') > -1 && (c.textContent = d), Wf(c, null, e.b)) : d && (c = Vf(d, h, null, e.b));
      c && (c._useCount = c._useCount || 0, e.a != c && c._useCount++, e.a = c);
      h = c;
      T || (c = k.I, e = d = a.getAttribute('class') || '', g && (e = d.replace(new RegExp(`\\s*x-scope\\s*${g}\\s*`, 'g'), ' ')), e += `${e ? ' ' : ''}x-scope ${c}`, d !== e && ag(a, e));
      f || uh.store(b, k.O, h, k.I);
    }
  };
  function yh(a, b) {
    return (b = b.getRootNode().host) ? X(b) ? b : yh(a, b) : a.c;
  }

  function xh(a, b, c) {
    a = yh(a, b);
    let d = X(a);
    a = Object.create(d.O || null);
    let e = Yg(b, c.M, c.da);
    b = Wg(d.M, b).L;
    Object.assign(a, e.Ta, b, e.Za);
    b = c.T;
    for (var f in b) if ((e = b[f]) || e === 0) a[f] = e;
    f = ch;
    b = Object.getOwnPropertyNames(a);
    for (e = 0; e < b.length; e++)d = b[e], a[d] = Ug(f, a[d], a);
    c.O = a;
  }

  r.styleDocument = function (a) {
    this.styleSubtree(this.c, a);
  };
  r.styleSubtree = function (a, b) {
    const c = a.shadowRoot;
    (c || a === this.c) && this.styleElement(a, b);
    if (b = c && (c.children || c.childNodes)) for (a = 0; a < b.length; a++) this.styleSubtree(b[a]); else if (a = a.children || a.childNodes) for (b = 0; b < a.length; b++) this.styleSubtree(a[b]);
  };
  r.Aa = function (a) {
    const b = this; const c = Tf(a); const
      d = dg(a);
    d !== this.f.da && (this.f.da = d);
    Sf(c, (a) => {
      if (T) Jg(a); else {
        const c = W;
        a.selector = a.parsedSelector;
        Jg(a);
        a.selector = a.F = pg(c, a, c.c, void 0, void 0);
      }
      V && d === '' && (vh(b), b.a && b.a.transformRule(a));
    });
    V ? a.textContent = Rf(c) : this.f.M.rules.push(c);
  };
  r.getComputedStyleValue = function (a, b) {
    let c;
    V || (c = (X(a) || X(yh(this, a))).O[b]);
    return (c = c || window.getComputedStyle(a).getPropertyValue(b)) ? c.trim() : '';
  };
  r.bb = function (a, b) {
    let c = a.getRootNode();
    b = b ? b.split(/\s/) : [];
    c = c.host && c.host.localName;
    if (!c) {
      let d = a.getAttribute('class');
      if (d) {
        d = d.split(/\s/);
        for (let e = 0; e < d.length; e++) {
          if (d[e] === W.a) {
            c = d[e + 1];
            break;
          }
        }
      }
    }
    c && b.push(W.a, c);
    V || (c = X(a)) && c.I && b.push(ch.a, c.I);
    ag(a, b.join(' '));
  };
  r.La = function (a) {
    return X(a);
  };
  r.ab = function (a, b) {
    hg(a, b);
  };
  r.eb = function (a, b) {
    hg(a, b, !0);
  };
  r.$a = function (a) {
    return jh(a);
  };
  r.Pa = function (a) {
    return ih(a);
  };
  Y.prototype.flush = Y.prototype.flush;
  Y.prototype.prepareTemplate = Y.prototype.prepareTemplate;
  Y.prototype.styleElement = Y.prototype.styleElement;
  Y.prototype.styleDocument = Y.prototype.styleDocument;
  Y.prototype.styleSubtree = Y.prototype.styleSubtree;
  Y.prototype.getComputedStyleValue = Y.prototype.getComputedStyleValue;
  Y.prototype.setElementClass = Y.prototype.bb;
  Y.prototype._styleInfoForNode = Y.prototype.La;
  Y.prototype.transformCustomStyleForDocument = Y.prototype.Aa;
  Y.prototype.getStyleAst = Y.prototype.Ra;
  Y.prototype.styleAstToString = Y.prototype.cb;
  Y.prototype.flushCustomStyles = Y.prototype.flushCustomStyles;
  Y.prototype.scopeNode = Y.prototype.ab;
  Y.prototype.unscopeNode = Y.prototype.eb;
  Y.prototype.scopeForNode = Y.prototype.$a;
  Y.prototype.currentScopeForNode = Y.prototype.Pa;
  Object.defineProperties(Y.prototype, {
    nativeShadow: {
      get() {
        return T;
      },
    },
    nativeCss: {
      get() {
        return V;
      },
    },
  });
  const Z = new Y();
  let zh;
  let Ah;
  window.ShadyCSS && (zh = window.ShadyCSS.ApplyShim, Ah = window.ShadyCSS.CustomStyleInterface);
  window.ShadyCSS = {
    ScopingShim: Z,
    prepareTemplate(a, b, c) {
      Z.flushCustomStyles();
      Z.prepareTemplate(a, b, c);
    },
    prepareTemplateDom(a, b) {
      Z.prepareTemplateDom(a, b);
    },
    prepareTemplateStyles(a, b, c) {
      Z.flushCustomStyles();
      Z.prepareTemplateStyles(a, b, c);
    },
    styleSubtree(a, b) {
      Z.flushCustomStyles();
      Z.styleSubtree(a, b);
    },
    styleElement(a) {
      Z.flushCustomStyles();
      Z.styleElement(a);
    },
    styleDocument(a) {
      Z.flushCustomStyles();
      Z.styleDocument(a);
    },
    flushCustomStyles() {
      Z.flushCustomStyles();
    },
    getComputedStyleValue(a, b) {
      return Z.getComputedStyleValue(a, b);
    },
    nativeCss: V,
    nativeShadow: T,
  };
  zh && (window.ShadyCSS.ApplyShim = zh);
  Ah && (window.ShadyCSS.CustomStyleInterface = Ah);
  (function (a) {
    function b(a) {
      a == '' && (f.call(this), this.i = !0);
      return a.toLowerCase();
    }

    function c(a) {
      const b = a.charCodeAt(0);
      return b > 32 && b < 127 && [34, 35, 60, 62, 63, 96].indexOf(b) == -1 ? a : encodeURIComponent(a);
    }

    function d(a) {
      const b = a.charCodeAt(0);
      return b > 32 && b < 127 && [34, 35, 60, 62, 96].indexOf(b) == -1 ? a : encodeURIComponent(a);
    }

    function e(a, e, g) {
      function h(a) {
        ba.push(a);
      }

      let k = e || 'scheme start';
      let w = 0;
      let q = '';
      let u = !1;
      let R = !1;
      var ba = [];
      a:for (; (void 0 != a[w - 1] || w == 0) && !this.i;) {
        let m = a[w];
        switch (k) {
          case 'scheme start':
            if (m && p.test(m)) {
              q
              += m.toLowerCase(), k = 'scheme';
            } else if (e) {
              h('Invalid scheme.');
              break a;
            } else {
              q = '';
              k = 'no scheme';
              continue;
            }
            break;
          case 'scheme':
            if (m && G.test(m)) q += m.toLowerCase(); else if (m == ':') {
              this.h = q;
              q = '';
              if (e) break a;
              void 0 !== l[this.h] && (this.D = !0);
              k = this.h == 'file' ? 'relative' : this.D && g && g.h == this.h ? 'relative or authority' : this.D ? 'authority first slash' : 'scheme data';
            } else if (e) {
              void 0 != m && h(`Code point not allowed in scheme: ${m}`);
              break a;
            } else {
              q = '';
              w = 0;
              k = 'no scheme';
              continue;
            }
            break;
          case 'scheme data':
            m == '?' ? (this.u = '?',
            k = 'query') : m == '#' ? (this.C = '#', k = 'fragment') : void 0 != m && m != '\t' && m != '\n' && m != '\r' && (this.pa += c(m));
            break;
          case 'no scheme':
            if (g && void 0 !== l[g.h]) {
              k = 'relative';
              continue;
            } else h('Missing scheme.'), f.call(this), this.i = !0;
            break;
          case 'relative or authority':
            if (m == '/' && a[w + 1] == '/') k = 'authority ignore slashes'; else {
              h(`Expected /, got: ${m}`);
              k = 'relative';
              continue;
            }
            break;
          case 'relative':
            this.D = !0;
            this.h != 'file' && (this.h = g.h);
            if (void 0 == m) {
              this.j = g.j;
              this.s = g.s;
              this.l = g.l.slice();
              this.u = g.u;
              this.v = g.v;
              this.g = g.g;
              break a;
            } else if (m == '/' || m == '\\') m == '\\' && h('\\ is an invalid code point.'), k = 'relative slash'; else if (m == '?') this.j = g.j, this.s = g.s, this.l = g.l.slice(), this.u = '?', this.v = g.v, this.g = g.g, k = 'query'; else if (m == '#') this.j = g.j, this.s = g.s, this.l = g.l.slice(), this.u = g.u, this.C = '#', this.v = g.v, this.g = g.g, k = 'fragment'; else {
              k = a[w + 1];
              var y = a[w + 2];
              if (this.h != 'file' || !p.test(m) || k != ':' && k != '|' || void 0 != y && y != '/' && y != '\\' && y != '?' && y != '#') this.j = g.j, this.s = g.s, this.v = g.v, this.g = g.g, this.l = g.l.slice(), this.l.pop();
              k = 'relative path';
              continue;
            }
            break;
          case 'relative slash':
            if (m == '/' || m == '\\') m == '\\' && h('\\ is an invalid code point.'), k = this.h == 'file' ? 'file host' : 'authority ignore slashes'; else {
              this.h != 'file' && (this.j = g.j, this.s = g.s, this.v = g.v, this.g = g.g);
              k = 'relative path';
              continue;
            }
            break;
          case 'authority first slash':
            if (m == '/') k = 'authority second slash'; else {
              h(`Expected '/', got: ${m}`);
              k = 'authority ignore slashes';
              continue;
            }
            break;
          case 'authority second slash':
            k = 'authority ignore slashes';
            if (m != '/') {
              h(`Expected '/', got: ${
                m}`);
              continue;
            }
            break;
          case 'authority ignore slashes':
            if (m != '/' && m != '\\') {
              k = 'authority';
              continue;
            } else h(`Expected authority, got: ${m}`);
            break;
          case 'authority':
            if (m == '@') {
              u && (h('@ already seen.'), q += '%40');
              u = !0;
              for (m = 0; m < q.length; m++)y = q[m], y == '\t' || y == '\n' || y == '\r' ? h('Invalid whitespace in authority.') : y == ':' && this.g === null ? this.g = '' : (y = c(y), this.g !== null ? this.g += y : this.v += y);
              q = '';
            } else if (void 0 == m || m == '/' || m == '\\' || m == '?' || m == '#') {
              w -= q.length;
              q = '';
              k = 'host';
              continue;
            } else q += m;
            break;
          case 'file host':
            if (void 0
              == m || m == '/' || m == '\\' || m == '?' || m == '#') {
              q.length != 2 || !p.test(q[0]) || q[1] != ':' && q[1] != '|' ? (q.length != 0 && (this.j = b.call(this, q), q = ''), k = 'relative path start') : k = 'relative path';
              continue;
            } else m == '\t' || m == '\n' || m == '\r' ? h('Invalid whitespace in file host.') : q += m;
            break;
          case 'host':
          case 'hostname':
            if (m != ':' || R) {
              if (void 0 == m || m == '/' || m == '\\' || m == '?' || m == '#') {
                this.j = b.call(this, q);
                q = '';
                k = 'relative path start';
                if (e) break a;
                continue;
              } else {
                m != '\t' && m != '\n' && m != '\r' ? (m == '[' ? R = !0 : m == ']' && (R = !1), q += m) : h(`Invalid code point in host/hostname: ${
                  m}`);
              }
            } else if (this.j = b.call(this, q), q = '', k = 'port', e == 'hostname') break a;
            break;
          case 'port':
            if (/[0-9]/.test(m)) q += m; else if (void 0 == m || m == '/' || m == '\\' || m == '?' || m == '#' || e) {
              q != '' && (q = parseInt(q, 10), q != l[this.h] && (this.s = `${q}`), q = '');
              if (e) break a;
              k = 'relative path start';
              continue;
            } else m == '\t' || m == '\n' || m == '\r' ? h(`Invalid code point in port: ${m}`) : (f.call(this), this.i = !0);
            break;
          case 'relative path start':
            m == '\\' && h("'\\' not allowed in path.");
            k = 'relative path';
            if (m != '/' && m != '\\') continue;
            break;
          case 'relative path':
            if (void 0
              != m && m != '/' && m != '\\' && (e || m != '?' && m != '#')) m != '\t' && m != '\n' && m != '\r' && (q += c(m)); else {
              m == '\\' && h('\\ not allowed in relative path.');
              if (y = n[q.toLowerCase()]) q = y;
              q == '..' ? (this.l.pop(), m != '/' && m != '\\' && this.l.push('')) : q == '.' && m != '/' && m != '\\' ? this.l.push('') : q != '.' && (this.h == 'file' && this.l.length == 0 && q.length == 2 && p.test(q[0]) && q[1] == '|' && (q = `${q[0]}:`), this.l.push(q));
              q = '';
              m == '?' ? (this.u = '?', k = 'query') : m == '#' && (this.C = '#', k = 'fragment');
            }
            break;
          case 'query':
            e || m != '#' ? void 0 != m && m != '\t' && m != '\n' && m != '\r' && (this.u
                += d(m)) : (this.C = '#', k = 'fragment');
            break;
          case 'fragment':
            void 0 != m && m != '\t' && m != '\n' && m != '\r' && (this.C += m);
        }
        w++;
      }
    }

    function f() {
      this.v = this.pa = this.h = '';
      this.g = null;
      this.s = this.j = '';
      this.l = [];
      this.C = this.u = '';
      this.D = this.i = !1;
    }

    function g(a, b) {
      void 0 === b || b instanceof g || (b = new g(String(b)));
      this.Ma = a;
      f.call(this);
      a = a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
      e.call(this, a, null, b);
    }

    let h = !1;
    if (!a.rb) {
      try {
        const k = new URL('b', 'http://a');
        k.pathname = 'c%20d';
        h = k.href === 'http://a/c%20d';
      } catch (w) {
      }
    }
    if (!h) {
      var l = Object.create(null);
      l.ftp = 21;
      l.file = 0;
      l.gopher = 70;
      l.http = 80;
      l.https = 443;
      l.ws = 80;
      l.wss = 443;
      var n = Object.create(null);
      n['%2e'] = '.';
      n['.%2e'] = '..';
      n['%2e.'] = '..';
      n['%2e%2e'] = '..';
      var p = /[a-zA-Z]/; var
        G = /[a-zA-Z0-9\+\-\.]/;
      g.prototype = {
        toString() {
          return this.href;
        },
        get href() {
          if (this.i) return this.Ma;
          let a = '';
          if (this.v != '' || this.g != null) a = `${this.v + (this.g != null ? `:${this.g}` : '')}@`;
          return this.protocol + (this.D ? `//${a}${this.host}` : '') + this.pathname + this.u + this.C;
        },
        set href(a) {
          f.call(this);
          e.call(this, a);
        },
        get protocol() {
          return `${this.h
          }:`;
        },
        set protocol(a) {
          this.i || e.call(this, `${a}:`, 'scheme start');
        },
        get host() {
          return this.i ? '' : this.s ? `${this.j}:${this.s}` : this.j;
        },
        set host(a) {
          !this.i && this.D && e.call(this, a, 'host');
        },
        get hostname() {
          return this.j;
        },
        set hostname(a) {
          !this.i && this.D && e.call(this, a, 'hostname');
        },
        get port() {
          return this.s;
        },
        set port(a) {
          !this.i && this.D && e.call(this, a, 'port');
        },
        get pathname() {
          return this.i ? '' : this.D ? `/${this.l.join('/')}` : this.pa;
        },
        set pathname(a) {
          !this.i && this.D && (this.l = [], e.call(this, a, 'relative path start'));
        },
        get search() {
          return this.i
          || !this.u || this.u == '?' ? '' : this.u;
        },
        set search(a) {
          !this.i && this.D && (this.u = '?', a[0] == '?' && (a = a.slice(1)), e.call(this, a, 'query'));
        },
        get hash() {
          return this.i || !this.C || this.C == '#' ? '' : this.C;
        },
        set hash(a) {
          this.i || (this.C = '#', a[0] == '#' && (a = a.slice(1)), e.call(this, a, 'fragment'));
        },
        get origin() {
          let a;
          if (this.i || !this.h) return '';
          switch (this.h) {
            case 'data':
            case 'file':
            case 'javascript':
            case 'mailto':
              return 'null';
          }
          return (a = this.host) ? `${this.h}://${a}` : '';
        },
      };
      const u = a.URL;
      u && (g.createObjectURL = function (a) {
        return u.createObjectURL.apply(u,
          arguments);
      }, g.revokeObjectURL = function (a) {
        u.revokeObjectURL(a);
      });
      a.URL = g;
    }
  }(window));
  Object.getOwnPropertyDescriptor(Node.prototype, 'baseURI') || Object.defineProperty(Node.prototype, 'baseURI', {
    get() {
      const a = (this.ownerDocument || this).querySelector('base[href]');
      return a && a.href || window.location.href;
    },
    configurable: !0,
    enumerable: !0,
  });
  const Bh = document.createElement('style');
  Bh.textContent = 'body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n';
  const Ch = document.querySelector('head');
  Ch.insertBefore(Bh, Ch.firstChild);
  const Dh = window.customElements; let Eh = !1; let
    Fh = null;
  Dh.polyfillWrapFlushCallback && Dh.polyfillWrapFlushCallback((a) => {
    Fh = a;
    Eh && a();
  });
  function Gh() {
    window.HTMLTemplateElement.bootstrap && window.HTMLTemplateElement.bootstrap(window.document);
    Fh && Fh();
    Eh = !0;
    window.WebComponents.ready = !0;
    document.dispatchEvent(new CustomEvent('WebComponentsReady', { bubbles: !0 }));
  }

  document.readyState !== 'complete' ? (window.addEventListener('load', Gh), window.addEventListener('DOMContentLoaded', () => {
    window.removeEventListener('load', Gh);
    Gh();
  })) : Gh();
}).call(this);

// # sourceMappingURL=webcomponents-bundle.js.map
