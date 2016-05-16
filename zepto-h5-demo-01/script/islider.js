function iSlider(t) {
    this.opts = {
        wrap: ".wrap",
        item: ".item",
        playClass: "play",
        index: 0,
        noslide: [],
        speed: 400,
        triggerDist: 30,
        isVertical: !0,
        useACC: !0,
        fullScr: !0,
        preventMove: !1,
        lastLocate: !0,
        loadingImgs: [],
        onslide: function() {},
        onloading: function() {},
        loadingOverTime: 15
    };
    for (var s in t) this.opts[s] = t[s];
    this.init()
}
iSlider.prototype = {
    wrap: null,
    index: 0,
    length: 0,
    _tpl: [],
    _delayTime: 150,
    _sessionKey: location.host + location.pathname,
    _prev: null,
    _current: null,
    _next: null,
    $: function(t, s) {
        return (s || document).querySelector(t)
    },
    addClass: function(t, s) {
        t.classList ? t.classList.add(s) : t.className += " " + s
    },
    removeClass: function(t, s) {
        t.classList ? t.classList.remove(s) : t.className = t.className.replace(new RegExp("\\s*\\b" + s + "\\b", "g"), "")
    },
    init: function() {
        this.wrap = "string" == typeof this.opts.wrap ? this.$(this.opts.wrap) : this.opts.wrap,
        this._sessionKey = btoa(encodeURIComponent(this._sessionKey + this.wrap.id + this.wrap.className));
        var t = parseInt(sessionStorage[this._sessionKey]);
        if (this.index = (this.opts.lastLocate && t >= 0 ? t: 0) || this.opts.index || 0, !this.wrap) throw Error('"wrap" param can not be empty!');
        this._tpl = this.wrap.cloneNode(!0),
        this._tpl = this.opts.item ? this._tpl.querySelectorAll(this.opts.item) : this._tpl.children;
        for (var s = 0; s < this._tpl.length; s++) this._tpl[s].style.cssText += "display:block;position:absolute;left:0;top:0;width:100%;height:100%";
        if (this.length = this._tpl.length, this.touchInitPos = 0, this.startPos = 0, this.totalDist = 0, this.deltaX1 = 0, this.deltaX2 = 0, this.opts.fullScr) {
            var i = document.createElement("style");
            i.innerHTML = "html,body{width:100%;height:100%;overflow:hidden}",
            document.head.appendChild(i),
            i = null
        }
        this.wrap.style.cssText += "display:block;position:relative;" + (this.opts.fullScr ? "width:100%;height:100%": ""),
        this.displayWidth = this.wrap.clientWidth,
        this.displayHeight = this.wrap.clientHeight,
        this.scrollDist = this.opts.isVertical ? this.displayHeight: this.displayWidth,
        this._setHTML(),
        this.opts.loadingImgs && this.opts.loadingImgs.length ? this._loading() : this._pageInit(),
        /iPhone|iPod|iPad/.test(navigator.userAgent) && (this._delayTime = 50),
        this._bindEvt()
    },
    _bindEvt: function() {
        var t = this,
        s = this.opts.fullScr ? this.$("body") : this.wrap;
        s.addEventListener("touchstart",
        function(s) {
            t._touchstart(s)
        },
        !1),
        s.addEventListener("touchmove",
        function(s) {
            t._touchmove(s)
        },
        !1),
        s.addEventListener("touchend",
        function(s) {
            t._touchend(s)
        },
        !1),
        s.addEventListener("touchcancel",
        function(s) {
            t._touchend(s)
        },
        !1),
        (this.opts.fullScr || this.opts.preventMove) && s.addEventListener("touchmove",
        function(t) {
            t.preventDefault()
        },
        !1)
    },
    _setHTML: function(t) {
        t >= 0 && (this.index = t),
        this.wrap.innerHTML = "";
        var s = document.createDocumentFragment();
        this.index > 0 && (this._prev = this._tpl[this.index - 1].cloneNode(!0), this._prev.style.cssText += this._getTransform("-" + this.scrollDist + "px"), s.appendChild(this._prev)),
        this._current = this._tpl[this.index].cloneNode(!0),
        this._current.style.cssText += this._getTransform(0),
        s.appendChild(this._current),
        this.index < this.length - 1 && (this._next = this._tpl[this.index + 1].cloneNode(!0), this._next.style.cssText += this._getTransform(this.scrollDist + "px"), s.appendChild(this._next)),
        this.wrap.appendChild(s)
    },
    _pageInit: function() {
        var t = this;
        setTimeout(function() {
            t.addClass(t._current, t.opts.playClass);
            try {
                t.opts.onslide.call(t, t.index)
            } catch(s) {
                console.info(s)
            }
        },
        this._delayTime)
    },
    _touchstart: function(t) {
        var s = this;
        1 === t.touches.length && (this.lockSlide = !1, this._touchstartX = t.touches[0].pageX, this._touchstartY = t.touches[0].pageY, this.touchInitPos = this.opts.isVertical ? t.touches[0].pageY: t.touches[0].pageX, this.deltaX1 = this.touchInitPos, this.startPos = 0, this.startPosPrev = -this.scrollDist, this.startPosNext = this.scrollDist, this._next && (s._next.style.cssText += "-webkit-transition-duration:0;"), s._current.style.cssText += "-webkit-transition-duration:0;", this._prev && (s._prev.style.cssText += "-webkit-transition-duration:0;"))
    },
    _touchmove: function(t) {
        var s = this;
        if (1 === t.touches.length && !this.lockSlide) {
            var i = Math.abs(t.touches[0].pageX - this._touchstartX),
            e = Math.abs(t.touches[0].pageY - this._touchstartY);
            if (i > e && this.opts.isVertical) return this.lockSlide = !0,
            void 0;
            if (e > i && !this.opts.isVertical) return this.lockSlide = !0,
            void 0;
            if (! (this.opts.noslide && this.opts.noslide.indexOf(this.index) >= 0 && t.touches[0].pageY - this._touchstartY < 0)) {
                var o = this.opts.isVertical ? t.touches[0].pageY: t.touches[0].pageX;
                this.deltaX2 = o - this.deltaX1,
                this.totalDist = this.startPos + o - this.touchInitPos,
                s._current.style.cssText += this._getTransform(this.totalDist + "px"),
                this.startPos = this.totalDist,
                this.totalDist < 0 ? this._next && (this.totalDist2 = this.startPosNext + o - this.touchInitPos, s._next.style.cssText += this._getTransform(this.totalDist2 + "px"), this.startPosNext = this.totalDist2) : this._prev && (this.totalDist2 = this.startPosPrev + o - this.touchInitPos, s._prev.style.cssText += this._getTransform(this.totalDist2 + "px"), this.startPosPrev = this.totalDist2),
                this.touchInitPos = o
            }
        }
    },
    _touchend: function() {
        this.deltaX2 < -this.opts.triggerDist ? this.next() : this.deltaX2 > this.opts.triggerDist ? this.prev() : this._itemReset(),
        this.deltaX2 = 0
    },
    _getTransform: function(t) {
        var s = this.opts.isVertical ? "0," + t: t + ",0";
        return ";-webkit-transform:" + (this.opts.useACC ? "translate3d(" + s + ",0)": "translate(" + s + ")")
    },
    _itemReset: function() {
        var t = this;
        t._current.style.cssText += "-webkit-transition-duration:" + this.opts.speed + "ms;" + this._getTransform(0),
        t._prev && (t._prev.style.cssText += "-webkit-transition-duration:" + this.opts.speed + "ms;" + this._getTransform("-" + this.scrollDist + "px")),
        t._next && (t._next.style.cssText += "-webkit-transition-duration:" + this.opts.speed + "ms;" + this._getTransform(this.scrollDist + "px")),
        this.deltaX2 = 0
    },
    _loading: function() {
        function t() {
            try {
                s.opts.onloading.call(s, n, h)
            } catch(t) {}
            n == h && (e && clearTimeout(e), s._pageInit(), o = null, s.opts.preLoadingImgs && s.opts.preLoadingImgs.length && s.preloading())
        }
        for (var s = this,
        i = this.opts.loadingImgs,
        e = setTimeout(function() {
            try {
                s.opts.onloading.call(s, h, h)
            } catch(t) {}
            s._pageInit()
        },
        1e3 * this.opts.loadingOverTime), o = [], n = 1, h = i.length + 1, r = 0; r < i.length; r++) o[r] = new Image,
        o[r].src = i[r],
        o[r].onload = o[r].onerror = o[r].onabort = function(s) {
            n++,
            this.src === i[0] && "load" === s.type && clearTimeout(e),
            t(),
            this.onload = this.onerror = this.onabort = null
        };
        try {
            s.opts.onloading.call(s, 1, h)
        } catch(a) {}
    },
    prev: function() {
        var t = this;
        if (!this._current || !this._prev) return this._itemReset(),
        void 0;
        if (! (this.index > 0)) return this._itemReset(),
        !1;
        this.index--;
        this.index + 1 > this.length - 1 ? 0 : this.index + 1;
        this._next && this.wrap.removeChild(this._next),
        this._next = this._current,
        this._current = this._prev,
        this._prev = null,
        this._next.style.cssText += "-webkit-transition-duration:" + this.opts.speed + "ms;" + this._getTransform(this.scrollDist + "px"),
        this._current.style.cssText += "-webkit-transition-duration:" + this.opts.speed + "ms;" + this._getTransform(0),
        sessionStorage[this._sessionKey] = this.index,
        setTimeout(function() {
            t.$("." + t.opts.playClass, t.wrap) && t.removeClass(t.$("." + t.opts.playClass, t.wrap), t.opts.playClass),
            t.addClass(t._current, t.opts.playClass);
            try {
                t.opts.onslide.call(t, t.index)
            } catch(s) {
                console.info(s)
            }
            var i = t.index - 1;
            return 0 > i ? (i = t.length - 1, !1) : (t._prev = t._tpl[i].cloneNode(!0), t._prev.style.cssText += "-webkit-transition-duration:0ms;" + t._getTransform("-" + t.scrollDist + "px"), t.wrap.insertBefore(t._prev, t._current), void 0)
        },
        this._delayTime)
    },
    next: function() {
        var t = this;
        if (!this._current || !this._next) return this._itemReset(),
        void 0;
        if (! (this.index < this.length - 1)) return this._itemReset(),
        !1;
        this.index++;
        0 === this.index ? this.length - 1 : this.index - 1;
        this._prev && this.wrap.removeChild(this._prev),
        this._prev = this._current,
        this._current = this._next,
        this._next = null,
        this._prev.style.cssText += "-webkit-transition-duration:" + this.opts.speed + "ms;" + this._getTransform("-" + this.scrollDist + "px"),
        this._current.style.cssText += "-webkit-transition-duration:" + this.opts.speed + "ms;" + this._getTransform(0),
        sessionStorage[this._sessionKey] = this.index,
        setTimeout(function() {
            t.$("." + t.opts.playClass, t.wrap) && t.removeClass(t.$("." + t.opts.playClass, t.wrap), t.opts.playClass),
            t.addClass(t._current, t.opts.playClass);
            try {
                t.opts.onslide.call(t, t.index)
            } catch(s) {
                console.info(s)
            }
            var i = t.index + 1;
            return i >= t.length ? !1 : (t._next = t._tpl[i].cloneNode(!0), t._next.style.cssText += "-webkit-transition-duration:0ms;" + t._getTransform(t.scrollDist + "px"), t.wrap.appendChild(t._next), void 0)
        },
        this._delayTime)
    },
    slideTo: function(t) {
        this._setHTML(t),
        this._pageInit()
    }
},
"object" == typeof module ? module.exports = iSlider: window.iSlider = iSlider;
/*  |xGv00|60074f19eb33c228dfa9fc9d5df3a986 */
