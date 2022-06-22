!(function (e) {
  function t(n) {
    if (i[n]) return i[n].exports;
    var a = (i[n] = { i: n, l: !1, exports: {} });
    return e[n].call(a.exports, a, a.exports, t), (a.l = !0), a.exports;
  }
  var i = {};
  (t.m = e),
    (t.c = i),
    (t.d = function (e, i, n) {
      t.o(e, i) ||
        Object.defineProperty(e, i, {
          configurable: !1,
          enumerable: !0,
          get: n,
        });
    }),
    (t.n = function (e) {
      var i =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return t.d(i, "a", i), i;
    }),
    (t.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (t.p = ""),
    t((t.s = 0));
})([
  function (e, t, i) {
    "use strict";
    var n = (function () {
      function e(e, t) {
        var i = [],
          n = !0,
          a = !1,
          l = void 0;
        try {
          for (
            var o, r = e[Symbol.iterator]();
            !(n = (o = r.next()).done) &&
            (i.push(o.value), !t || i.length !== t);
            n = !0
          );
        } catch (e) {
          (a = !0), (l = e);
        } finally {
          try {
            !n && r.return && r.return();
          } finally {
            if (a) throw l;
          }
        }
        return i;
      }
      return function (t, i) {
        if (Array.isArray(t)) return t;
        if (Symbol.iterator in Object(t)) return e(t, i);
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance"
        );
      };
    })();
    (L.Control.HtmlLegend = L.Control.extend({
      _map: null,
      _activeLayers: 0,
      _alwaysShow: !1,
      options: {
        position: "topright",
        legends: [],
        collapseSimple: !1,
        detectStretched: !1,
        collapsedOnInit: !1,
        disableVisibilityControls: !1,
        updateOpacity: null,
        defaultOpacity: 1,
        visibleIcon: "leaflet-html-legend-icon-eye",
        hiddenIcon: "leaflet-html-legend-icon-eye-slash",
        toggleIcon: "leaflet-html-legend-icon-eye",
      },
      onAdd: function (e) {
        return (
          (this._map = e),
          (this._container = L.DomUtil.create(
            "div",
            "leaflet-control leaflet-bar leaflet-html-legend"
          )),
          (this._lastId = 0),
          (this._entries = {}),
          L.DomEvent.disableClickPropagation(this._container),
          L.DomEvent.disableScrollPropagation(this._container),
          this.render(),
          this._container
        );
      },
      render: function () {
        var e = this;
        L.DomUtil.empty(this._container),
          this.options.legends.forEach(function (t) {
            return e._renderLegend(t);
          }, this),
          this._checkVisibility();
      },
      addLegend: function (e) {
        if (this._map) return this._renderLegend(e), this._lastId;
        throw Error("Legend control must be added to the map first.");
      },
      removeLegend: function (e) {
        var t = this._entries[e];
        t &&
          (t.layer &&
            t.events &&
            Object.entries(t.events).forEach(function (e) {
              var i = n(e, 2),
                a = i[0],
                l = i[1];
              return t.layer.off(a, l);
            }),
          L.DomUtil.remove(this._entries[e].container),
          delete this._entries[e]);
      },
      _renderLegend: function (e) {
        var t = this;
        if (e.elements) {
          var i = e.elements,
            n = "legend-block";
          this.options.detectStretched &&
            3 === i.length &&
            "" !== i[0].label &&
            "" === i[1].label &&
            "" !== i[2].label &&
            (n += " legend-stretched");
          var a = L.DomUtil.create("div", n, this._container),
            l = ++this._lastId;
          if (
            ((this._entries[l] = { container: a }),
            this.options.collapseSimple && 1 === i.length && !i[0].label)
          )
            return (
              this._addElement(i[0].html, e.name, i[0].style, a),
              this._connectLayer(a, e, l),
              a
            );
          if (e.name) {
            var o = L.DomUtil.create("h4", null, a);
            L.DomUtil.create("div", "legend-caret", o),
              (L.DomUtil.create("span", null, o).innerHTML = e.name),
              this.options.collapsedOnInit && L.DomUtil.addClass(o, "closed"),
              L.DomEvent.on(
                o,
                "click",
                function () {
                  L.DomUtil.hasClass(o, "closed")
                    ? L.DomUtil.removeClass(o, "closed")
                    : L.DomUtil.addClass(o, "closed");
                },
                this
              );
          }
          var r = L.DomUtil.create("div", "legend-elements", a);
          return (
            i.forEach(function (e) {
              t._addElement(e.html, e.label, e.style, r);
            }, this),
            this._connectLayer(a, e, l),
            a
          );
        }
      },
      _addElement: function (e, t, i, a) {
        var l = L.DomUtil.create("div", "legend-row", a),
          o = L.DomUtil.create("span", "symbol", l);
        i &&
          Object.entries(i).forEach(function (e) {
            var t = n(e, 2),
              i = t[0],
              a = t[1];
            o.style[i] = a;
          }),
          (o.innerHTML = e),
          t && (L.DomUtil.create("label", null, l).innerHTML = t);
      },
      _updateOpacity: function (e, t) {
        "function" == typeof this.options.updateOpacity
          ? this.options.updateOpacity(e, t)
          : "function" == typeof e.setOpacity
          ? e.setOpacity(t)
          : "function" == typeof e.setStyle && e.setStyle({ opacity: t });
      },
      _layerAdd: function (e) {
        (this._activeLayers += 1),
          (e.style.display = ""),
          this._checkVisibility();
      },
      _layerRemove: function (e) {
        (this._activeLayers -= 1),
          (e.style.display = "none"),
          this._checkVisibility();
      },
      _connectLayer: function (e, t, i) {
        var n = this,
          a = t.layer;
        if (!a) return void (this._alwaysShow = !0);
        if (
          (this._map.hasLayer(a)
            ? (this._activeLayers += 1)
            : (e.style.display = "none"),
          e.classList.add("layer-control"),
          !this.options.disableVisibilityControls)
        ) {
          var l = a.opacity || this.options.defaultOpacity || 1;
          this._updateOpacity(a, l);
          var o = L.DomUtil.create(
            "i",
            "visibility-toggle " + this.options.toggleIcon,
            e
          );
          (o.dataset.visibileOpacity = l),
            L.DomEvent.on(o, "click", function (e) {
              var t = e.target;
              L.DomUtil.hasClass(t, "disabled")
                ? (L.DomUtil.removeClass(t, "disabled"),
                  n._updateOpacity(a, t.dataset.visibileOpacity))
                : (L.DomUtil.addClass(t, "disabled"), n._updateOpacity(a, 0));
            });
          var r = L.DomUtil.create("span", "opacity-slider", e);
          (L.DomUtil.create("span", "slider-label", r).innerHTML =
            "Transparency:"),
            L.DomUtil.create("i", this.options.visibleIcon, r);
          var s = L.DomUtil.create("input", null, r);
          (s.type = "range"),
            (s.min = 0),
            (s.max = 1),
            (s.step = 0.1),
            (s.onchange = function (e) {
              var t = 1 - e.target.value || 0;
              n._updateOpacity(a, t),
                (o.dataset.visibileOpacity = t),
                L.DomUtil.removeClass(o, "disabled");
            }),
            (s.value = 1 - l),
            L.DomUtil.create("i", this.options.hiddenIcon, r);
        }
        var c = this._layerAdd.bind(this, e),
          d = this._layerRemove.bind(this, e);
        a.on("add", c).on("remove", d),
          (this._entries[i].layer = a),
          (this._entries[i].events = { add: c, remove: d });
      },
      _checkVisibility: function () {
        this._alwaysShow || this._activeLayers
          ? (this._container.style.display = "")
          : (this._container.style.display = "none");
      },
    })),
      (L.control.htmllegend = function (e) {
        return new L.Control.HtmlLegend(e);
      });
  },
]);
//# sourceMappingURL=L.Control.HtmlLegend.js.map
