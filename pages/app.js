function scrollChat() {
  $(".chat-container .scrollbox").scrollTop($("#chatmessage").innerHeight())
}

function scrollPublicChat() {
  $("#collapseOne").scrollTop(0)
}

function openTfaModal(t) {
  if (currentUser) return form = $(this).closest("form"), modalHtml = '<div class="modal fade" id="tfaModal" tabindex="-1" role="dialog"><div class="modal-dialog modal-md" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="messageModalLabel">Требуется подтверждение операции</h4></div><div class="modal-body"><div class="text-center loading"></div></div><div class="modal-footer clearfix"><span class="text-danger text-xs-small"></span><button type="button" class="btn btn-link" data-dismiss="modal">ОТМЕНА</button><button type="submit" class="btn btn-primary" disabled>Подтвердить</button></div></div></div></div>', $("#tfaModal", form).remove(), $(form).prepend(modalHtml), $("#tfaModal", form).modal({
    remote: "/tfa/confirm"
  }), t.preventDefault(), !1
}

function openDialogModal(t) {
  if ($("#messageModal form").attr("action", $(t).data("href")), $("#messageModal .region_data").hide(), $("#messageModal select").attr("disabled", "disabled"), $("#messageModal input[name=region_id]").attr("disabled", "disabled"), regions = $(t).data("regions"), regions) {
    $("#messageModal .region_data").show(), $("#messageModal select").removeAttr("disabled"), $("#messageModal select").html("");
    for (id in regions) $("#messageModal select").append($('<option value="' + id + '">' + regions[id] + "</option>"))
  }
  return $(t).data("region") && $("#messageModal input[name=region_id]").removeAttr("disabled").val($(t).data("region")), $(t).data("order") && $("#messageModal input[name=order_id]").removeAttr("disabled").val($(t).data("order")), $('#messageModal input[name="title"]').val($(t).data("title")), $("#messageModal").modal(), !1
}

function sendNewMessage(t) {
  return $(".text-danger", t).text(""), $('button[type="submit"]').attr("disabled", "disabled"), $.post($(t).attr("action"), $(t).serialize(), function(e) {
    e.uuid && $('input[name="form-uuid"]', t).val(e.uuid), "success" == e.result ? ($(".form-group", t).slideUp(), $(".modal-footer", t).hide(), $(".modal-body", t).append($('<div class="msg">Сообщение отправлено. <a href="' + e.redirect + '">Перейти к диалогу</a></div>'))) : e.result && "error" == e.result ? $(".text-danger", t).text(e.message) : $(".text-danger", t).text("Ошибка отправки, попробуйте позже"), $('button[type="submit"]').removeAttr("disabled")
  }), !1
}

function updateUnreaded(t) {
  currenciesByCode = t.currencies, $(document).trigger("currency.change", currenciesByCode), $(".currency_widget div:eq(0)").html(Math.round(currenciesByCode.USD.back_rate / 1e8).formatMoney(0, "", " ", ".") + " USD<span>/</span>" + Math.round(currenciesByCode.RUR.back_rate / 1e8).formatMoney(0, "", " ", ".") + " RUB"), $(".notyfi .counter").text(t.notifications), 0 == t.importantOrders && (t.importantOrders = ""), 0 == t.unreaded && (t.unreaded = ""), 0 == t.notifications && (t.notifications = ""), $("#orders-counter").text(t.importantOrders), $("#inbox-counter").text(t.unreaded), $(".notyfi .badge").text(t.notifications), t.orderTimer > 0 && ($("#orderTimer").data("time", t.orderTimer), $("#orderTimer").parents("a.timer_off").removeClass("timer_off").addClass("timer_on")), t.notifications > 0 ? $(".notyfi .badge").removeClass("hide") : $(".notyfi .badge").addClass("hide")
}

function checkUnreaded() {
  now = (new Date).getTime(), webSocket && webSocket.connected ? (!localStorage.getItem("user.check-unreaded.emitedAt") || now >= parseInt(localStorage.getItem("user.check-unreaded.emitedAt")) + checkUnreadedInterval) && (localStorage.setItem("user.check-unreaded.emitedAt", now), webSocket.emit("user.check-unreaded", {})) : $.ajax("/ajax/unreaded-messages", {
    dataType: "jsonp",
    timeout: 1e4,
    success: updateUnreaded
  })
}

function markAsReaded(t) {
  $.ajax("/ajax/mark-as-readed", {
    data: t,
    method: "POST",
    dataType: "json",
    success: function(t) {}
  })
}

function checkNewChats(t, e, n) {
  $.ajax(("Market" == t ? "/market/" + e : "") + "/inbox/check-new/" + n, {
    dataType: "html",
    success: function(t) {
      t = $(t), chat_old = $(".userlist .user_[data-id=" + n + "]:eq(0)"), chat_old.remove(), t.hide(), t.find(".glyphicon-envelope").remove(), $(".userlist").prepend(t), t.slideDown(), checkUnreaded()
    }
  })
}

function sqlToLocalTimestamp(t) {
  return tmp = t.split(" "), time = tmp[1], tmp = tmp[0].split("-"), tmp[2] + "." + tmp[1] + "." + tmp[0] + " " + time
}

function timer(t) {
  $(".timer, #orderTimer").each(function() {
    var t = $(this);
    if (t) {
      var e = parseInt(t.data("time"));
      if (e > 0) {
        $(t).parents("a.timer_off").removeClass("timer_off").addClass("timer_on");
        var n = Math.floor(e / 86400),
          i = Math.floor((e - 86400 * n) / 3600),
          o = "0" + Math.floor((e - 3600 * i - 86400 * n) / 60),
          r = "0" + Math.floor(e - 3600 * i - 60 * o - 86400 * n);
        t.text((n > 0 ? n + " д " : "") + i + ":" + o.substr(-2) + ":" + r.substr(-2)), t.data("time", e - 1)
      } else t.text(""), $(t).parents("a.timer_on").removeClass("timer_on").addClass("timer_off"), 1 == t.data("reload-on-end") && location.reload()
    }
  })
}

function updateShopMenu() {
  clearTimeout(timeoutUpdateShopMenu), timeoutUpdateShopMenu = setTimeout(function() {
    if ($(".header_shop__second, .topmenu_second").length) {
      var t = $(".header_shop__second, .topmenu_second"),
        e = t.offset().top,
        n = "";
      $(".dropdown-wrp", t).show(), $(">a", t).each(function() {
        $(this).offset().top > e && (n += "<li>" + $(this)[0].outerHTML + "</li>")
      }), "" != n ? $(".dropdown-wrp ul", t).html(n) : $(".dropdown-wrp", t).hide()
    }
  }, 20)
}

function setCookie(t, e, n) {
  var i;
  if (n) {
    var o = new Date;
    o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3), i = "; expires=" + o.toGMTString()
  } else i = "";
  document.cookie = encodeURIComponent(t) + "=" + encodeURIComponent(e) + i + "; path=/"
}

function getCookie(t) {
  for (var e = t + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
    for (var o = n[i];
      " " == o.charAt(0);) o = o.substring(1, o.length);
    if (0 == o.indexOf(e)) return o.substring(e.length, o.length)
  }
  return null
}

function deleteCookie(t) {
  setCookie(t, "", -1)
}
if (! function(t, e) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = t.document ? e(t, !0) : function(t) {
      if (!t.document) throw new Error("jQuery requires a window with a document");
      return e(t)
    } : e(t)
  }("undefined" != typeof window ? window : this, function(t, e) {
    function n(t) {
      var e = !!t && "length" in t && t.length,
        n = rt.type(t);
      return "function" !== n && !rt.isWindow(t) && ("array" === n || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
    }

    function i(t, e, n) {
      if (rt.isFunction(e)) return rt.grep(t, function(t, i) {
        return !!e.call(t, i, t) !== n
      });
      if (e.nodeType) return rt.grep(t, function(t) {
        return t === e !== n
      });
      if ("string" == typeof e) {
        if (gt.test(e)) return rt.filter(e, t, n);
        e = rt.filter(e, t)
      }
      return rt.grep(t, function(t) {
        return J.call(e, t) > -1 !== n
      })
    }

    function o(t, e) {
      for (;
        (t = t[e]) && 1 !== t.nodeType;);
      return t
    }

    function r(t) {
      var e = {};
      return rt.each(t.match(At) || [], function(t, n) {
        e[n] = !0
      }), e
    }

    function s() {
      Y.removeEventListener("DOMContentLoaded", s), t.removeEventListener("load", s), rt.ready()
    }

    function a() {
      this.expando = rt.expando + a.uid++
    }

    function c(t, e, n) {
      var i;
      if (void 0 === n && 1 === t.nodeType)
        if (i = "data-" + e.replace(_t, "-$&").toLowerCase(), n = t.getAttribute(i), "string" == typeof n) {
          try {
            n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : St.test(n) ? rt.parseJSON(n) : n)
          } catch (t) {}
          Et.set(t, e, n)
        } else n = void 0;
      return n
    }

    function l(t, e, n, i) {
      var o, r = 1,
        s = 20,
        a = i ? function() {
          return i.cur()
        } : function() {
          return rt.css(t, e, "")
        },
        c = a(),
        l = n && n[3] || (rt.cssNumber[e] ? "" : "px"),
        u = (rt.cssNumber[e] || "px" !== l && +c) && Dt.exec(rt.css(t, e));
      if (u && u[3] !== l) {
        l = l || u[3], n = n || [], u = +c || 1;
        do r = r || ".5", u /= r, rt.style(t, e, u + l); while (r !== (r = a() / c) && 1 !== r && --s)
      }
      return n && (u = +u || +c || 0, o = n[1] ? u + (n[1] + 1) * n[2] : +n[2], i && (i.unit = l, i.start = u, i.end = o)), o
    }

    function u(t, e) {
      var n = "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e || "*") : "undefined" != typeof t.querySelectorAll ? t.querySelectorAll(e || "*") : [];
      return void 0 === e || e && rt.nodeName(t, e) ? rt.merge([t], n) : n
    }

    function h(t, e) {
      for (var n = 0, i = t.length; i > n; n++) Tt.set(t[n], "globalEval", !e || Tt.get(e[n], "globalEval"))
    }

    function p(t, e, n, i, o) {
      for (var r, s, a, c, l, p, d = e.createDocumentFragment(), f = [], g = 0, m = t.length; m > g; g++)
        if (r = t[g], r || 0 === r)
          if ("object" === rt.type(r)) rt.merge(f, r.nodeType ? [r] : r);
          else if (Pt.test(r)) {
        for (s = s || d.appendChild(e.createElement("div")), a = (Bt.exec(r) || ["", ""])[1].toLowerCase(), c = Ot[a] || Ot._default, s.innerHTML = c[1] + rt.htmlPrefilter(r) + c[2], p = c[0]; p--;) s = s.lastChild;
        rt.merge(f, s.childNodes), s = d.firstChild, s.textContent = ""
      } else f.push(e.createTextNode(r));
      for (d.textContent = "", g = 0; r = f[g++];)
        if (i && rt.inArray(r, i) > -1) o && o.push(r);
        else if (l = rt.contains(r.ownerDocument, r), s = u(d.appendChild(r), "script"), l && h(s), n)
        for (p = 0; r = s[p++];) Rt.test(r.type || "") && n.push(r);
      return d
    }

    function d() {
      return !0
    }

    function f() {
      return !1
    }

    function g() {
      try {
        return Y.activeElement
      } catch (t) {}
    }

    function m(t, e, n, i, o, r) {
      var s, a;
      if ("object" == typeof e) {
        "string" != typeof n && (i = i || n, n = void 0);
        for (a in e) m(t, a, n, i, e[a], r);
        return t
      }
      if (null == i && null == o ? (o = n, i = n = void 0) : null == o && ("string" == typeof n ? (o = i, i = void 0) : (o = i, i = n, n = void 0)), o === !1) o = f;
      else if (!o) return t;
      return 1 === r && (s = o, o = function(t) {
        return rt().off(t), s.apply(this, arguments)
      }, o.guid = s.guid || (s.guid = rt.guid++)), t.each(function() {
        rt.event.add(this, e, o, i, n)
      })
    }

    function y(t, e) {
      return rt.nodeName(t, "table") && rt.nodeName(11 !== e.nodeType ? e : e.firstChild, "tr") ? t.getElementsByTagName("tbody")[0] || t.appendChild(t.ownerDocument.createElement("tbody")) : t
    }

    function v(t) {
      return t.type = (null !== t.getAttribute("type")) + "/" + t.type, t
    }

    function b(t) {
      var e = Ht.exec(t.type);
      return e ? t.type = e[1] : t.removeAttribute("type"), t
    }

    function w(t, e) {
      var n, i, o, r, s, a, c, l;
      if (1 === e.nodeType) {
        if (Tt.hasData(t) && (r = Tt.access(t), s = Tt.set(e, r), l = r.events)) {
          delete s.handle, s.events = {};
          for (o in l)
            for (n = 0, i = l[o].length; i > n; n++) rt.event.add(e, o, l[o][n])
        }
        Et.hasData(t) && (a = Et.access(t), c = rt.extend({}, a), Et.set(e, c))
      }
    }

    function A(t, e) {
      var n = e.nodeName.toLowerCase();
      "input" === n && It.test(t.type) ? e.checked = t.checked : "input" !== n && "textarea" !== n || (e.defaultValue = t.defaultValue)
    }

    function x(t, e, n, i) {
      e = K.apply([], e);
      var o, r, s, a, c, l, h = 0,
        d = t.length,
        f = d - 1,
        g = e[0],
        m = rt.isFunction(g);
      if (m || d > 1 && "string" == typeof g && !it.checkClone && Ut.test(g)) return t.each(function(o) {
        var r = t.eq(o);
        m && (e[0] = g.call(this, o, r.html())), x(r, e, n, i)
      });
      if (d && (o = p(e, t[0].ownerDocument, !1, t, i), r = o.firstChild, 1 === o.childNodes.length && (o = r), r || i)) {
        for (s = rt.map(u(o, "script"), v), a = s.length; d > h; h++) c = o, h !== f && (c = rt.clone(c, !0, !0), a && rt.merge(s, u(c, "script"))), n.call(t[h], c, h);
        if (a)
          for (l = s[s.length - 1].ownerDocument, rt.map(s, b), h = 0; a > h; h++) c = s[h], Rt.test(c.type || "") && !Tt.access(c, "globalEval") && rt.contains(l, c) && (c.src ? rt._evalUrl && rt._evalUrl(c.src) : rt.globalEval(c.textContent.replace(Wt, "")))
      }
      return t
    }

    function C(t, e, n) {
      for (var i, o = e ? rt.filter(e, t) : t, r = 0; null != (i = o[r]); r++) n || 1 !== i.nodeType || rt.cleanData(u(i)), i.parentNode && (n && rt.contains(i.ownerDocument, i) && h(u(i, "script")), i.parentNode.removeChild(i));
      return t
    }

    function k(t, e) {
      var n = rt(e.createElement(t)).appendTo(e.body),
        i = rt.css(n[0], "display");
      return n.detach(), i
    }

    function T(t) {
      var e = Y,
        n = Qt[t];
      return n || (n = k(t, e), "none" !== n && n || (zt = (zt || rt("<iframe frameborder='0' width='0' height='0'/>")).appendTo(e.documentElement), e = zt[0].contentDocument, e.write(), e.close(), n = k(t, e), zt.detach()), Qt[t] = n), n
    }

    function E(t, e, n) {
      var i, o, r, s, a = t.style;
      return n = n || Zt(t), s = n ? n.getPropertyValue(e) || n[e] : void 0, "" !== s && void 0 !== s || rt.contains(t.ownerDocument, t) || (s = rt.style(t, e)), n && !it.pixelMarginRight() && Yt.test(s) && Xt.test(e) && (i = a.width, o = a.minWidth, r = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = i, a.minWidth = o, a.maxWidth = r), void 0 !== s ? s + "" : s
    }

    function S(t, e) {
      return {
        get: function() {
          return t() ? void delete this.get : (this.get = e).apply(this, arguments)
        }
      }
    }

    function _(t) {
      if (t in ie) return t;
      for (var e = t[0].toUpperCase() + t.slice(1), n = ne.length; n--;)
        if (t = ne[n] + e, t in ie) return t
    }

    function $(t, e, n) {
      var i = Dt.exec(e);
      return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : e
    }

    function D(t, e, n, i, o) {
      for (var r = n === (i ? "border" : "content") ? 4 : "width" === e ? 1 : 0, s = 0; 4 > r; r += 2) "margin" === n && (s += rt.css(t, n + Nt[r], !0, o)), i ? ("content" === n && (s -= rt.css(t, "padding" + Nt[r], !0, o)), "margin" !== n && (s -= rt.css(t, "border" + Nt[r] + "Width", !0, o))) : (s += rt.css(t, "padding" + Nt[r], !0, o), "padding" !== n && (s += rt.css(t, "border" + Nt[r] + "Width", !0, o)));
      return s
    }

    function N(t, e, n) {
      var i = !0,
        o = "width" === e ? t.offsetWidth : t.offsetHeight,
        r = Zt(t),
        s = "border-box" === rt.css(t, "boxSizing", !1, r);
      if (0 >= o || null == o) {
        if (o = E(t, e, r), (0 > o || null == o) && (o = t.style[e]), Yt.test(o)) return o;
        i = s && (it.boxSizingReliable() || o === t.style[e]), o = parseFloat(o) || 0
      }
      return o + D(t, e, n || (s ? "border" : "content"), i, r) + "px"
    }

    function j(t, e) {
      for (var n, i, o, r = [], s = 0, a = t.length; a > s; s++) i = t[s], i.style && (r[s] = Tt.get(i, "olddisplay"), n = i.style.display, e ? (r[s] || "none" !== n || (i.style.display = ""), "" === i.style.display && jt(i) && (r[s] = Tt.access(i, "olddisplay", T(i.nodeName)))) : (o = jt(i), "none" === n && o || Tt.set(i, "olddisplay", o ? n : rt.css(i, "display"))));
      for (s = 0; a > s; s++) i = t[s], i.style && (e && "none" !== i.style.display && "" !== i.style.display || (i.style.display = e ? r[s] || "" : "none"));
      return t
    }

    function I(t, e, n, i, o) {
      return new I.prototype.init(t, e, n, i, o)
    }

    function B() {
      return t.setTimeout(function() {
        oe = void 0
      }), oe = rt.now()
    }

    function R(t, e) {
      var n, i = 0,
        o = {
          height: t
        };
      for (e = e ? 1 : 0; 4 > i; i += 2 - e) n = Nt[i], o["margin" + n] = o["padding" + n] = t;
      return e && (o.opacity = o.width = t), o
    }

    function O(t, e, n) {
      for (var i, o = (V.tweeners[e] || []).concat(V.tweeners["*"]), r = 0, s = o.length; s > r; r++)
        if (i = o[r].call(n, e, t)) return i
    }

    function P(t, e, n) {
      var i, o, r, s, a, c, l, u, h = this,
        p = {},
        d = t.style,
        f = t.nodeType && jt(t),
        g = Tt.get(t, "fxshow");
      n.queue || (a = rt._queueHooks(t, "fx"), null == a.unqueued && (a.unqueued = 0, c = a.empty.fire, a.empty.fire = function() {
        a.unqueued || c()
      }), a.unqueued++, h.always(function() {
        h.always(function() {
          a.unqueued--, rt.queue(t, "fx").length || a.empty.fire()
        })
      })), 1 === t.nodeType && ("height" in e || "width" in e) && (n.overflow = [d.overflow, d.overflowX, d.overflowY], l = rt.css(t, "display"), u = "none" === l ? Tt.get(t, "olddisplay") || T(t.nodeName) : l, "inline" === u && "none" === rt.css(t, "float") && (d.display = "inline-block")), n.overflow && (d.overflow = "hidden", h.always(function() {
        d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
      }));
      for (i in e)
        if (o = e[i], se.exec(o)) {
          if (delete e[i], r = r || "toggle" === o, o === (f ? "hide" : "show")) {
            if ("show" !== o || !g || void 0 === g[i]) continue;
            f = !0
          }
          p[i] = g && g[i] || rt.style(t, i)
        } else l = void 0;
      if (rt.isEmptyObject(p)) "inline" === ("none" === l ? T(t.nodeName) : l) && (d.display = l);
      else {
        g ? "hidden" in g && (f = g.hidden) : g = Tt.access(t, "fxshow", {}), r && (g.hidden = !f), f ? rt(t).show() : h.done(function() {
          rt(t).hide()
        }), h.done(function() {
          var e;
          Tt.remove(t, "fxshow");
          for (e in p) rt.style(t, e, p[e])
        });
        for (i in p) s = O(f ? g[i] : 0, i, h), i in g || (g[i] = s.start, f && (s.end = s.start, s.start = "width" === i || "height" === i ? 1 : 0))
      }
    }

    function M(t, e) {
      var n, i, o, r, s;
      for (n in t)
        if (i = rt.camelCase(n), o = e[i], r = t[n], rt.isArray(r) && (o = r[1], r = t[n] = r[0]), n !== i && (t[i] = r, delete t[n]), s = rt.cssHooks[i], s && "expand" in s) {
          r = s.expand(r), delete t[i];
          for (n in r) n in t || (t[n] = r[n], e[n] = o)
        } else e[i] = o
    }

    function V(t, e, n) {
      var i, o, r = 0,
        s = V.prefilters.length,
        a = rt.Deferred().always(function() {
          delete c.elem
        }),
        c = function() {
          if (o) return !1;
          for (var e = oe || B(), n = Math.max(0, l.startTime + l.duration - e), i = n / l.duration || 0, r = 1 - i, s = 0, c = l.tweens.length; c > s; s++) l.tweens[s].run(r);
          return a.notifyWith(t, [l, r, n]), 1 > r && c ? n : (a.resolveWith(t, [l]), !1)
        },
        l = a.promise({
          elem: t,
          props: rt.extend({}, e),
          opts: rt.extend(!0, {
            specialEasing: {},
            easing: rt.easing._default
          }, n),
          originalProperties: e,
          originalOptions: n,
          startTime: oe || B(),
          duration: n.duration,
          tweens: [],
          createTween: function(e, n) {
            var i = rt.Tween(t, l.opts, e, n, l.opts.specialEasing[e] || l.opts.easing);
            return l.tweens.push(i), i
          },
          stop: function(e) {
            var n = 0,
              i = e ? l.tweens.length : 0;
            if (o) return this;
            for (o = !0; i > n; n++) l.tweens[n].run(1);
            return e ? (a.notifyWith(t, [l, 1, 0]), a.resolveWith(t, [l, e])) : a.rejectWith(t, [l, e]), this
          }
        }),
        u = l.props;
      for (M(u, l.opts.specialEasing); s > r; r++)
        if (i = V.prefilters[r].call(l, t, u, l.opts)) return rt.isFunction(i.stop) && (rt._queueHooks(l.elem, l.opts.queue).stop = rt.proxy(i.stop, i)), i;
      return rt.map(u, O, l), rt.isFunction(l.opts.start) && l.opts.start.call(t, l), rt.fx.timer(rt.extend(c, {
        elem: t,
        anim: l,
        queue: l.opts.queue
      })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
    }

    function q(t) {
      return t.getAttribute && t.getAttribute("class") || ""
    }

    function L(t) {
      return function(e, n) {
        "string" != typeof e && (n = e, e = "*");
        var i, o = 0,
          r = e.toLowerCase().match(At) || [];
        if (rt.isFunction(n))
          for (; i = r[o++];) "+" === i[0] ? (i = i.slice(1) || "*", (t[i] = t[i] || []).unshift(n)) : (t[i] = t[i] || []).push(n)
      }
    }

    function F(t, e, n, i) {
      function o(a) {
        var c;
        return r[a] = !0, rt.each(t[a] || [], function(t, a) {
          var l = a(e, n, i);
          return "string" != typeof l || s || r[l] ? s ? !(c = l) : void 0 : (e.dataTypes.unshift(l), o(l), !1)
        }), c
      }
      var r = {},
        s = t === Ee;
      return o(e.dataTypes[0]) || !r["*"] && o("*")
    }

    function U(t, e) {
      var n, i, o = rt.ajaxSettings.flatOptions || {};
      for (n in e) void 0 !== e[n] && ((o[n] ? t : i || (i = {}))[n] = e[n]);
      return i && rt.extend(!0, t, i), t
    }

    function H(t, e, n) {
      for (var i, o, r, s, a = t.contents, c = t.dataTypes;
        "*" === c[0];) c.shift(), void 0 === i && (i = t.mimeType || e.getResponseHeader("Content-Type"));
      if (i)
        for (o in a)
          if (a[o] && a[o].test(i)) {
            c.unshift(o);
            break
          }
      if (c[0] in n) r = c[0];
      else {
        for (o in n) {
          if (!c[0] || t.converters[o + " " + c[0]]) {
            r = o;
            break
          }
          s || (s = o)
        }
        r = r || s
      }
      return r ? (r !== c[0] && c.unshift(r), n[r]) : void 0
    }

    function W(t, e, n, i) {
      var o, r, s, a, c, l = {},
        u = t.dataTypes.slice();
      if (u[1])
        for (s in t.converters) l[s.toLowerCase()] = t.converters[s];
      for (r = u.shift(); r;)
        if (t.responseFields[r] && (n[t.responseFields[r]] = e), !c && i && t.dataFilter && (e = t.dataFilter(e, t.dataType)), c = r, r = u.shift())
          if ("*" === r) r = c;
          else if ("*" !== c && c !== r) {
        if (s = l[c + " " + r] || l["* " + r], !s)
          for (o in l)
            if (a = o.split(" "), a[1] === r && (s = l[c + " " + a[0]] || l["* " + a[0]])) {
              s === !0 ? s = l[o] : l[o] !== !0 && (r = a[0], u.unshift(a[1]));
              break
            }
        if (s !== !0)
          if (s && t.throws) e = s(e);
          else try {
            e = s(e)
          } catch (t) {
            return {
              state: "parsererror",
              error: s ? t : "No conversion from " + c + " to " + r
            }
          }
      }
      return {
        state: "success",
        data: e
      }
    }

    function z(t, e, n, i) {
      var o;
      if (rt.isArray(e)) rt.each(e, function(e, o) {
        n || De.test(t) ? i(t, o) : z(t + "[" + ("object" == typeof o && null != o ? e : "") + "]", o, n, i)
      });
      else if (n || "object" !== rt.type(e)) i(t, e);
      else
        for (o in e) z(t + "[" + o + "]", e[o], n, i)
    }

    function Q(t) {
      return rt.isWindow(t) ? t : 9 === t.nodeType && t.defaultView
    }
    var X = [],
      Y = t.document,
      Z = X.slice,
      K = X.concat,
      G = X.push,
      J = X.indexOf,
      tt = {},
      et = tt.toString,
      nt = tt.hasOwnProperty,
      it = {},
      ot = "2.2.4",
      rt = function(t, e) {
        return new rt.fn.init(t, e)
      },
      st = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      at = /^-ms-/,
      ct = /-([\da-z])/gi,
      lt = function(t, e) {
        return e.toUpperCase()
      };
    rt.fn = rt.prototype = {
      jquery: ot,
      constructor: rt,
      selector: "",
      length: 0,
      toArray: function() {
        return Z.call(this)
      },
      get: function(t) {
        return null != t ? 0 > t ? this[t + this.length] : this[t] : Z.call(this)
      },
      pushStack: function(t) {
        var e = rt.merge(this.constructor(), t);
        return e.prevObject = this, e.context = this.context, e
      },
      each: function(t) {
        return rt.each(this, t)
      },
      map: function(t) {
        return this.pushStack(rt.map(this, function(e, n) {
          return t.call(e, n, e)
        }))
      },
      slice: function() {
        return this.pushStack(Z.apply(this, arguments))
      },
      first: function() {
        return this.eq(0)
      },
      last: function() {
        return this.eq(-1)
      },
      eq: function(t) {
        var e = this.length,
          n = +t + (0 > t ? e : 0);
        return this.pushStack(n >= 0 && e > n ? [this[n]] : [])
      },
      end: function() {
        return this.prevObject || this.constructor()
      },
      push: G,
      sort: X.sort,
      splice: X.splice
    }, rt.extend = rt.fn.extend = function() {
      var t, e, n, i, o, r, s = arguments[0] || {},
        a = 1,
        c = arguments.length,
        l = !1;
      for ("boolean" == typeof s && (l = s, s = arguments[a] || {}, a++), "object" == typeof s || rt.isFunction(s) || (s = {}), a === c && (s = this, a--); c > a; a++)
        if (null != (t = arguments[a]))
          for (e in t) n = s[e], i = t[e], s !== i && (l && i && (rt.isPlainObject(i) || (o = rt.isArray(i))) ? (o ? (o = !1, r = n && rt.isArray(n) ? n : []) : r = n && rt.isPlainObject(n) ? n : {}, s[e] = rt.extend(l, r, i)) : void 0 !== i && (s[e] = i));
      return s
    }, rt.extend({
      expando: "jQuery" + (ot + Math.random()).replace(/\D/g, ""),
      isReady: !0,
      error: function(t) {
        throw new Error(t)
      },
      noop: function() {},
      isFunction: function(t) {
        return "function" === rt.type(t)
      },
      isArray: Array.isArray,
      isWindow: function(t) {
        return null != t && t === t.window
      },
      isNumeric: function(t) {
        var e = t && t.toString();
        return !rt.isArray(t) && e - parseFloat(e) + 1 >= 0
      },
      isPlainObject: function(t) {
        var e;
        if ("object" !== rt.type(t) || t.nodeType || rt.isWindow(t)) return !1;
        if (t.constructor && !nt.call(t, "constructor") && !nt.call(t.constructor.prototype || {}, "isPrototypeOf")) return !1;
        for (e in t);
        return void 0 === e || nt.call(t, e)
      },
      isEmptyObject: function(t) {
        var e;
        for (e in t) return !1;
        return !0
      },
      type: function(t) {
        return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? tt[et.call(t)] || "object" : typeof t
      },
      globalEval: function(t) {
        var e, n = eval;
        t = rt.trim(t), t && (1 === t.indexOf("use strict") ? (e = Y.createElement("script"), e.text = t, Y.head.appendChild(e).parentNode.removeChild(e)) : n(t))
      },
      camelCase: function(t) {
        return t.replace(at, "ms-").replace(ct, lt)
      },
      nodeName: function(t, e) {
        return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
      },
      each: function(t, e) {
        var i, o = 0;
        if (n(t))
          for (i = t.length; i > o && e.call(t[o], o, t[o]) !== !1; o++);
        else
          for (o in t)
            if (e.call(t[o], o, t[o]) === !1) break; return t
      },
      trim: function(t) {
        return null == t ? "" : (t + "").replace(st, "")
      },
      makeArray: function(t, e) {
        var i = e || [];
        return null != t && (n(Object(t)) ? rt.merge(i, "string" == typeof t ? [t] : t) : G.call(i, t)), i
      },
      inArray: function(t, e, n) {
        return null == e ? -1 : J.call(e, t, n)
      },
      merge: function(t, e) {
        for (var n = +e.length, i = 0, o = t.length; n > i; i++) t[o++] = e[i];
        return t.length = o, t
      },
      grep: function(t, e, n) {
        for (var i, o = [], r = 0, s = t.length, a = !n; s > r; r++) i = !e(t[r], r), i !== a && o.push(t[r]);
        return o
      },
      map: function(t, e, i) {
        var o, r, s = 0,
          a = [];
        if (n(t))
          for (o = t.length; o > s; s++) r = e(t[s], s, i), null != r && a.push(r);
        else
          for (s in t) r = e(t[s], s, i), null != r && a.push(r);
        return K.apply([], a)
      },
      guid: 1,
      proxy: function(t, e) {
        var n, i, o;
        return "string" == typeof e && (n = t[e], e = t, t = n), rt.isFunction(t) ? (i = Z.call(arguments, 2), o = function() {
          return t.apply(e || this, i.concat(Z.call(arguments)))
        }, o.guid = t.guid = t.guid || rt.guid++, o) : void 0
      },
      now: Date.now,
      support: it
    }), "function" == typeof Symbol && (rt.fn[Symbol.iterator] = X[Symbol.iterator]), rt.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(t, e) {
      tt["[object " + e + "]"] = e.toLowerCase()
    });
    var ut = function(t) {
      function e(t, e, n, i) {
        var o, r, s, a, c, l, h, d, f = e && e.ownerDocument,
          g = e ? e.nodeType : 9;
        if (n = n || [], "string" != typeof t || !t || 1 !== g && 9 !== g && 11 !== g) return n;
        if (!i && ((e ? e.ownerDocument || e : q) !== j && N(e), e = e || j, B)) {
          if (11 !== g && (l = yt.exec(t)))
            if (o = l[1]) {
              if (9 === g) {
                if (!(s = e.getElementById(o))) return n;
                if (s.id === o) return n.push(s), n
              } else if (f && (s = f.getElementById(o)) && M(e, s) && s.id === o) return n.push(s), n
            } else {
              if (l[2]) return G.apply(n, e.getElementsByTagName(t)), n;
              if ((o = l[3]) && A.getElementsByClassName && e.getElementsByClassName) return G.apply(n, e.getElementsByClassName(o)), n
            }
          if (A.qsa && !W[t + " "] && (!R || !R.test(t))) {
            if (1 !== g) f = e, d = t;
            else if ("object" !== e.nodeName.toLowerCase()) {
              for ((a = e.getAttribute("id")) ? a = a.replace(bt, "\\$&") : e.setAttribute("id", a = V), h = T(t), r = h.length, c = pt.test(a) ? "#" + a : "[id='" + a + "']"; r--;) h[r] = c + " " + p(h[r]);
              d = h.join(","), f = vt.test(t) && u(e.parentNode) || e
            }
            if (d) try {
              return G.apply(n, f.querySelectorAll(d)), n
            } catch (t) {} finally {
              a === V && e.removeAttribute("id")
            }
          }
        }
        return S(t.replace(at, "$1"), e, n, i)
      }

      function n() {
        function t(n, i) {
          return e.push(n + " ") > x.cacheLength && delete t[e.shift()], t[n + " "] = i
        }
        var e = [];
        return t
      }

      function i(t) {
        return t[V] = !0, t
      }

      function o(t) {
        var e = j.createElement("div");
        try {
          return !!t(e)
        } catch (t) {
          return !1
        } finally {
          e.parentNode && e.parentNode.removeChild(e), e = null
        }
      }

      function r(t, e) {
        for (var n = t.split("|"), i = n.length; i--;) x.attrHandle[n[i]] = e
      }

      function s(t, e) {
        var n = e && t,
          i = n && 1 === t.nodeType && 1 === e.nodeType && (~e.sourceIndex || Q) - (~t.sourceIndex || Q);
        if (i) return i;
        if (n)
          for (; n = n.nextSibling;)
            if (n === e) return -1;
        return t ? 1 : -1
      }

      function a(t) {
        return function(e) {
          var n = e.nodeName.toLowerCase();
          return "input" === n && e.type === t
        }
      }

      function c(t) {
        return function(e) {
          var n = e.nodeName.toLowerCase();
          return ("input" === n || "button" === n) && e.type === t
        }
      }

      function l(t) {
        return i(function(e) {
          return e = +e, i(function(n, i) {
            for (var o, r = t([], n.length, e), s = r.length; s--;) n[o = r[s]] && (n[o] = !(i[o] = n[o]))
          })
        })
      }

      function u(t) {
        return t && "undefined" != typeof t.getElementsByTagName && t
      }

      function h() {}

      function p(t) {
        for (var e = 0, n = t.length, i = ""; n > e; e++) i += t[e].value;
        return i
      }

      function d(t, e, n) {
        var i = e.dir,
          o = n && "parentNode" === i,
          r = F++;
        return e.first ? function(e, n, r) {
          for (; e = e[i];)
            if (1 === e.nodeType || o) return t(e, n, r)
        } : function(e, n, s) {
          var a, c, l, u = [L, r];
          if (s) {
            for (; e = e[i];)
              if ((1 === e.nodeType || o) && t(e, n, s)) return !0
          } else
            for (; e = e[i];)
              if (1 === e.nodeType || o) {
                if (l = e[V] || (e[V] = {}), c = l[e.uniqueID] || (l[e.uniqueID] = {}), (a = c[i]) && a[0] === L && a[1] === r) return u[2] = a[2];
                if (c[i] = u, u[2] = t(e, n, s)) return !0
              }
        }
      }

      function f(t) {
        return t.length > 1 ? function(e, n, i) {
          for (var o = t.length; o--;)
            if (!t[o](e, n, i)) return !1;
          return !0
        } : t[0]
      }

      function g(t, n, i) {
        for (var o = 0, r = n.length; r > o; o++) e(t, n[o], i);
        return i
      }

      function m(t, e, n, i, o) {
        for (var r, s = [], a = 0, c = t.length, l = null != e; c > a; a++)(r = t[a]) && (n && !n(r, i, o) || (s.push(r), l && e.push(a)));
        return s
      }

      function y(t, e, n, o, r, s) {
        return o && !o[V] && (o = y(o)), r && !r[V] && (r = y(r, s)), i(function(i, s, a, c) {
          var l, u, h, p = [],
            d = [],
            f = s.length,
            y = i || g(e || "*", a.nodeType ? [a] : a, []),
            v = !t || !i && e ? y : m(y, p, t, a, c),
            b = n ? r || (i ? t : f || o) ? [] : s : v;
          if (n && n(v, b, a, c), o)
            for (l = m(b, d), o(l, [], a, c), u = l.length; u--;)(h = l[u]) && (b[d[u]] = !(v[d[u]] = h));
          if (i) {
            if (r || t) {
              if (r) {
                for (l = [], u = b.length; u--;)(h = b[u]) && l.push(v[u] = h);
                r(null, b = [], l, c)
              }
              for (u = b.length; u--;)(h = b[u]) && (l = r ? tt(i, h) : p[u]) > -1 && (i[l] = !(s[l] = h))
            }
          } else b = m(b === s ? b.splice(f, b.length) : b), r ? r(null, s, b, c) : G.apply(s, b)
        })
      }

      function v(t) {
        for (var e, n, i, o = t.length, r = x.relative[t[0].type], s = r || x.relative[" "], a = r ? 1 : 0, c = d(function(t) {
            return t === e
          }, s, !0), l = d(function(t) {
            return tt(e, t) > -1
          }, s, !0), u = [function(t, n, i) {
            var o = !r && (i || n !== _) || ((e = n).nodeType ? c(t, n, i) : l(t, n, i));
            return e = null, o
          }]; o > a; a++)
          if (n = x.relative[t[a].type]) u = [d(f(u), n)];
          else {
            if (n = x.filter[t[a].type].apply(null, t[a].matches), n[V]) {
              for (i = ++a; o > i && !x.relative[t[i].type]; i++);
              return y(a > 1 && f(u), a > 1 && p(t.slice(0, a - 1).concat({
                value: " " === t[a - 2].type ? "*" : ""
              })).replace(at, "$1"), n, i > a && v(t.slice(a, i)), o > i && v(t = t.slice(i)), o > i && p(t))
            }
            u.push(n)
          }
        return f(u)
      }

      function b(t, n) {
        var o = n.length > 0,
          r = t.length > 0,
          s = function(i, s, a, c, l) {
            var u, h, p, d = 0,
              f = "0",
              g = i && [],
              y = [],
              v = _,
              b = i || r && x.find.TAG("*", l),
              w = L += null == v ? 1 : Math.random() || .1,
              A = b.length;
            for (l && (_ = s === j || s || l); f !== A && null != (u = b[f]); f++) {
              if (r && u) {
                for (h = 0, s || u.ownerDocument === j || (N(u), a = !B); p = t[h++];)
                  if (p(u, s || j, a)) {
                    c.push(u);
                    break
                  }
                l && (L = w)
              }
              o && ((u = !p && u) && d--, i && g.push(u))
            }
            if (d += f, o && f !== d) {
              for (h = 0; p = n[h++];) p(g, y, s, a);
              if (i) {
                if (d > 0)
                  for (; f--;) g[f] || y[f] || (y[f] = Z.call(c));
                y = m(y)
              }
              G.apply(c, y), l && !i && y.length > 0 && d + n.length > 1 && e.uniqueSort(c)
            }
            return l && (L = w, _ = v), g
          };
        return o ? i(s) : s
      }
      var w, A, x, C, k, T, E, S, _, $, D, N, j, I, B, R, O, P, M, V = "sizzle" + 1 * new Date,
        q = t.document,
        L = 0,
        F = 0,
        U = n(),
        H = n(),
        W = n(),
        z = function(t, e) {
          return t === e && (D = !0), 0
        },
        Q = 1 << 31,
        X = {}.hasOwnProperty,
        Y = [],
        Z = Y.pop,
        K = Y.push,
        G = Y.push,
        J = Y.slice,
        tt = function(t, e) {
          for (var n = 0, i = t.length; i > n; n++)
            if (t[n] === e) return n;
          return -1
        },
        et = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        nt = "[\\x20\\t\\r\\n\\f]",
        it = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        ot = "\\[" + nt + "*(" + it + ")(?:" + nt + "*([*^$|!~]?=)" + nt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + it + "))|)" + nt + "*\\]",
        rt = ":(" + it + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ot + ")*)|.*)\\)|)",
        st = new RegExp(nt + "+", "g"),
        at = new RegExp("^" + nt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + nt + "+$", "g"),
        ct = new RegExp("^" + nt + "*," + nt + "*"),
        lt = new RegExp("^" + nt + "*([>+~]|" + nt + ")" + nt + "*"),
        ut = new RegExp("=" + nt + "*([^\\]'\"]*?)" + nt + "*\\]", "g"),
        ht = new RegExp(rt),
        pt = new RegExp("^" + it + "$"),
        dt = {
          ID: new RegExp("^#(" + it + ")"),
          CLASS: new RegExp("^\\.(" + it + ")"),
          TAG: new RegExp("^(" + it + "|[*])"),
          ATTR: new RegExp("^" + ot),
          PSEUDO: new RegExp("^" + rt),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + nt + "*(even|odd|(([+-]|)(\\d*)n|)" + nt + "*(?:([+-]|)" + nt + "*(\\d+)|))" + nt + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + et + ")$", "i"),
          needsContext: new RegExp("^" + nt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + nt + "*((?:-\\d)?\\d*)" + nt + "*\\)|)(?=[^-]|$)", "i")
        },
        ft = /^(?:input|select|textarea|button)$/i,
        gt = /^h\d$/i,
        mt = /^[^{]+\{\s*\[native \w/,
        yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        vt = /[+~]/,
        bt = /'|\\/g,
        wt = new RegExp("\\\\([\\da-f]{1,6}" + nt + "?|(" + nt + ")|.)", "ig"),
        At = function(t, e, n) {
          var i = "0x" + e - 65536;
          return i !== i || n ? e : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
        },
        xt = function() {
          N()
        };
      try {
        G.apply(Y = J.call(q.childNodes), q.childNodes), Y[q.childNodes.length].nodeType
      } catch (t) {
        G = {
          apply: Y.length ? function(t, e) {
            K.apply(t, J.call(e))
          } : function(t, e) {
            for (var n = t.length, i = 0; t[n++] = e[i++];);
            t.length = n - 1
          }
        }
      }
      A = e.support = {}, k = e.isXML = function(t) {
        var e = t && (t.ownerDocument || t).documentElement;
        return !!e && "HTML" !== e.nodeName
      }, N = e.setDocument = function(t) {
        var e, n, i = t ? t.ownerDocument || t : q;
        return i !== j && 9 === i.nodeType && i.documentElement ? (j = i, I = j.documentElement, B = !k(j), (n = j.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", xt, !1) : n.attachEvent && n.attachEvent("onunload", xt)), A.attributes = o(function(t) {
          return t.className = "i", !t.getAttribute("className")
        }), A.getElementsByTagName = o(function(t) {
          return t.appendChild(j.createComment("")), !t.getElementsByTagName("*").length
        }), A.getElementsByClassName = mt.test(j.getElementsByClassName), A.getById = o(function(t) {
          return I.appendChild(t).id = V, !j.getElementsByName || !j.getElementsByName(V).length
        }), A.getById ? (x.find.ID = function(t, e) {
          if ("undefined" != typeof e.getElementById && B) {
            var n = e.getElementById(t);
            return n ? [n] : []
          }
        }, x.filter.ID = function(t) {
          var e = t.replace(wt, At);
          return function(t) {
            return t.getAttribute("id") === e
          }
        }) : (delete x.find.ID, x.filter.ID = function(t) {
          var e = t.replace(wt, At);
          return function(t) {
            var n = "undefined" != typeof t.getAttributeNode && t.getAttributeNode("id");
            return n && n.value === e
          }
        }), x.find.TAG = A.getElementsByTagName ? function(t, e) {
          return "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t) : A.qsa ? e.querySelectorAll(t) : void 0
        } : function(t, e) {
          var n, i = [],
            o = 0,
            r = e.getElementsByTagName(t);
          if ("*" === t) {
            for (; n = r[o++];) 1 === n.nodeType && i.push(n);
            return i
          }
          return r
        }, x.find.CLASS = A.getElementsByClassName && function(t, e) {
          return "undefined" != typeof e.getElementsByClassName && B ? e.getElementsByClassName(t) : void 0
        }, O = [], R = [], (A.qsa = mt.test(j.querySelectorAll)) && (o(function(t) {
          I.appendChild(t).innerHTML = "<a id='" + V + "'></a><select id='" + V + "-\r\\' msallowcapture=''><option selected=''></option></select>", t.querySelectorAll("[msallowcapture^='']").length && R.push("[*^$]=" + nt + "*(?:''|\"\")"), t.querySelectorAll("[selected]").length || R.push("\\[" + nt + "*(?:value|" + et + ")"), t.querySelectorAll("[id~=" + V + "-]").length || R.push("~="), t.querySelectorAll(":checked").length || R.push(":checked"), t.querySelectorAll("a#" + V + "+*").length || R.push(".#.+[+~]")
        }), o(function(t) {
          var e = j.createElement("input");
          e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("name", "D"), t.querySelectorAll("[name=d]").length && R.push("name" + nt + "*[*^$|!~]?="), t.querySelectorAll(":enabled").length || R.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), R.push(",.*:")
        })), (A.matchesSelector = mt.test(P = I.matches || I.webkitMatchesSelector || I.mozMatchesSelector || I.oMatchesSelector || I.msMatchesSelector)) && o(function(t) {
          A.disconnectedMatch = P.call(t, "div"), P.call(t, "[s!='']:x"), O.push("!=", rt)
        }), R = R.length && new RegExp(R.join("|")), O = O.length && new RegExp(O.join("|")), e = mt.test(I.compareDocumentPosition), M = e || mt.test(I.contains) ? function(t, e) {
          var n = 9 === t.nodeType ? t.documentElement : t,
            i = e && e.parentNode;
          return t === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(i)))
        } : function(t, e) {
          if (e)
            for (; e = e.parentNode;)
              if (e === t) return !0;
          return !1
        }, z = e ? function(t, e) {
          if (t === e) return D = !0, 0;
          var n = !t.compareDocumentPosition - !e.compareDocumentPosition;
          return n ? n : (n = (t.ownerDocument || t) === (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1, 1 & n || !A.sortDetached && e.compareDocumentPosition(t) === n ? t === j || t.ownerDocument === q && M(q, t) ? -1 : e === j || e.ownerDocument === q && M(q, e) ? 1 : $ ? tt($, t) - tt($, e) : 0 : 4 & n ? -1 : 1)
        } : function(t, e) {
          if (t === e) return D = !0, 0;
          var n, i = 0,
            o = t.parentNode,
            r = e.parentNode,
            a = [t],
            c = [e];
          if (!o || !r) return t === j ? -1 : e === j ? 1 : o ? -1 : r ? 1 : $ ? tt($, t) - tt($, e) : 0;
          if (o === r) return s(t, e);
          for (n = t; n = n.parentNode;) a.unshift(n);
          for (n = e; n = n.parentNode;) c.unshift(n);
          for (; a[i] === c[i];) i++;
          return i ? s(a[i], c[i]) : a[i] === q ? -1 : c[i] === q ? 1 : 0
        }, j) : j
      }, e.matches = function(t, n) {
        return e(t, null, null, n)
      }, e.matchesSelector = function(t, n) {
        if ((t.ownerDocument || t) !== j && N(t),
          n = n.replace(ut, "='$1']"), A.matchesSelector && B && !W[n + " "] && (!O || !O.test(n)) && (!R || !R.test(n))) try {
          var i = P.call(t, n);
          if (i || A.disconnectedMatch || t.document && 11 !== t.document.nodeType) return i
        } catch (t) {}
        return e(n, j, null, [t]).length > 0
      }, e.contains = function(t, e) {
        return (t.ownerDocument || t) !== j && N(t), M(t, e)
      }, e.attr = function(t, e) {
        (t.ownerDocument || t) !== j && N(t);
        var n = x.attrHandle[e.toLowerCase()],
          i = n && X.call(x.attrHandle, e.toLowerCase()) ? n(t, e, !B) : void 0;
        return void 0 !== i ? i : A.attributes || !B ? t.getAttribute(e) : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
      }, e.error = function(t) {
        throw new Error("Syntax error, unrecognized expression: " + t)
      }, e.uniqueSort = function(t) {
        var e, n = [],
          i = 0,
          o = 0;
        if (D = !A.detectDuplicates, $ = !A.sortStable && t.slice(0), t.sort(z), D) {
          for (; e = t[o++];) e === t[o] && (i = n.push(o));
          for (; i--;) t.splice(n[i], 1)
        }
        return $ = null, t
      }, C = e.getText = function(t) {
        var e, n = "",
          i = 0,
          o = t.nodeType;
        if (o) {
          if (1 === o || 9 === o || 11 === o) {
            if ("string" == typeof t.textContent) return t.textContent;
            for (t = t.firstChild; t; t = t.nextSibling) n += C(t)
          } else if (3 === o || 4 === o) return t.nodeValue
        } else
          for (; e = t[i++];) n += C(e);
        return n
      }, x = e.selectors = {
        cacheLength: 50,
        createPseudo: i,
        match: dt,
        attrHandle: {},
        find: {},
        relative: {
          ">": {
            dir: "parentNode",
            first: !0
          },
          " ": {
            dir: "parentNode"
          },
          "+": {
            dir: "previousSibling",
            first: !0
          },
          "~": {
            dir: "previousSibling"
          }
        },
        preFilter: {
          ATTR: function(t) {
            return t[1] = t[1].replace(wt, At), t[3] = (t[3] || t[4] || t[5] || "").replace(wt, At), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
          },
          CHILD: function(t) {
            return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || e.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && e.error(t[0]), t
          },
          PSEUDO: function(t) {
            var e, n = !t[6] && t[2];
            return dt.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[4] || t[5] || "" : n && ht.test(n) && (e = T(n, !0)) && (e = n.indexOf(")", n.length - e) - n.length) && (t[0] = t[0].slice(0, e), t[2] = n.slice(0, e)), t.slice(0, 3))
          }
        },
        filter: {
          TAG: function(t) {
            var e = t.replace(wt, At).toLowerCase();
            return "*" === t ? function() {
              return !0
            } : function(t) {
              return t.nodeName && t.nodeName.toLowerCase() === e
            }
          },
          CLASS: function(t) {
            var e = U[t + " "];
            return e || (e = new RegExp("(^|" + nt + ")" + t + "(" + nt + "|$)")) && U(t, function(t) {
              return e.test("string" == typeof t.className && t.className || "undefined" != typeof t.getAttribute && t.getAttribute("class") || "")
            })
          },
          ATTR: function(t, n, i) {
            return function(o) {
              var r = e.attr(o, t);
              return null == r ? "!=" === n : !n || (r += "", "=" === n ? r === i : "!=" === n ? r !== i : "^=" === n ? i && 0 === r.indexOf(i) : "*=" === n ? i && r.indexOf(i) > -1 : "$=" === n ? i && r.slice(-i.length) === i : "~=" === n ? (" " + r.replace(st, " ") + " ").indexOf(i) > -1 : "|=" === n && (r === i || r.slice(0, i.length + 1) === i + "-"))
            }
          },
          CHILD: function(t, e, n, i, o) {
            var r = "nth" !== t.slice(0, 3),
              s = "last" !== t.slice(-4),
              a = "of-type" === e;
            return 1 === i && 0 === o ? function(t) {
              return !!t.parentNode
            } : function(e, n, c) {
              var l, u, h, p, d, f, g = r !== s ? "nextSibling" : "previousSibling",
                m = e.parentNode,
                y = a && e.nodeName.toLowerCase(),
                v = !c && !a,
                b = !1;
              if (m) {
                if (r) {
                  for (; g;) {
                    for (p = e; p = p[g];)
                      if (a ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) return !1;
                    f = g = "only" === t && !f && "nextSibling"
                  }
                  return !0
                }
                if (f = [s ? m.firstChild : m.lastChild], s && v) {
                  for (p = m, h = p[V] || (p[V] = {}), u = h[p.uniqueID] || (h[p.uniqueID] = {}), l = u[t] || [], d = l[0] === L && l[1], b = d && l[2], p = d && m.childNodes[d]; p = ++d && p && p[g] || (b = d = 0) || f.pop();)
                    if (1 === p.nodeType && ++b && p === e) {
                      u[t] = [L, d, b];
                      break
                    }
                } else if (v && (p = e, h = p[V] || (p[V] = {}), u = h[p.uniqueID] || (h[p.uniqueID] = {}), l = u[t] || [], d = l[0] === L && l[1], b = d), b === !1)
                  for (;
                    (p = ++d && p && p[g] || (b = d = 0) || f.pop()) && ((a ? p.nodeName.toLowerCase() !== y : 1 !== p.nodeType) || !++b || (v && (h = p[V] || (p[V] = {}), u = h[p.uniqueID] || (h[p.uniqueID] = {}), u[t] = [L, b]), p !== e)););
                return b -= o, b === i || b % i === 0 && b / i >= 0
              }
            }
          },
          PSEUDO: function(t, n) {
            var o, r = x.pseudos[t] || x.setFilters[t.toLowerCase()] || e.error("unsupported pseudo: " + t);
            return r[V] ? r(n) : r.length > 1 ? (o = [t, t, "", n], x.setFilters.hasOwnProperty(t.toLowerCase()) ? i(function(t, e) {
              for (var i, o = r(t, n), s = o.length; s--;) i = tt(t, o[s]), t[i] = !(e[i] = o[s])
            }) : function(t) {
              return r(t, 0, o)
            }) : r
          }
        },
        pseudos: {
          not: i(function(t) {
            var e = [],
              n = [],
              o = E(t.replace(at, "$1"));
            return o[V] ? i(function(t, e, n, i) {
              for (var r, s = o(t, null, i, []), a = t.length; a--;)(r = s[a]) && (t[a] = !(e[a] = r))
            }) : function(t, i, r) {
              return e[0] = t, o(e, null, r, n), e[0] = null, !n.pop()
            }
          }),
          has: i(function(t) {
            return function(n) {
              return e(t, n).length > 0
            }
          }),
          contains: i(function(t) {
            return t = t.replace(wt, At),
              function(e) {
                return (e.textContent || e.innerText || C(e)).indexOf(t) > -1
              }
          }),
          lang: i(function(t) {
            return pt.test(t || "") || e.error("unsupported lang: " + t), t = t.replace(wt, At).toLowerCase(),
              function(e) {
                var n;
                do
                  if (n = B ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return n = n.toLowerCase(), n === t || 0 === n.indexOf(t + "-");
                while ((e = e.parentNode) && 1 === e.nodeType);
                return !1
              }
          }),
          target: function(e) {
            var n = t.location && t.location.hash;
            return n && n.slice(1) === e.id
          },
          root: function(t) {
            return t === I
          },
          focus: function(t) {
            return t === j.activeElement && (!j.hasFocus || j.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
          },
          enabled: function(t) {
            return t.disabled === !1
          },
          disabled: function(t) {
            return t.disabled === !0
          },
          checked: function(t) {
            var e = t.nodeName.toLowerCase();
            return "input" === e && !!t.checked || "option" === e && !!t.selected
          },
          selected: function(t) {
            return t.parentNode && t.parentNode.selectedIndex, t.selected === !0
          },
          empty: function(t) {
            for (t = t.firstChild; t; t = t.nextSibling)
              if (t.nodeType < 6) return !1;
            return !0
          },
          parent: function(t) {
            return !x.pseudos.empty(t)
          },
          header: function(t) {
            return gt.test(t.nodeName)
          },
          input: function(t) {
            return ft.test(t.nodeName)
          },
          button: function(t) {
            var e = t.nodeName.toLowerCase();
            return "input" === e && "button" === t.type || "button" === e
          },
          text: function(t) {
            var e;
            return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || "text" === e.toLowerCase())
          },
          first: l(function() {
            return [0]
          }),
          last: l(function(t, e) {
            return [e - 1]
          }),
          eq: l(function(t, e, n) {
            return [0 > n ? n + e : n]
          }),
          even: l(function(t, e) {
            for (var n = 0; e > n; n += 2) t.push(n);
            return t
          }),
          odd: l(function(t, e) {
            for (var n = 1; e > n; n += 2) t.push(n);
            return t
          }),
          lt: l(function(t, e, n) {
            for (var i = 0 > n ? n + e : n; --i >= 0;) t.push(i);
            return t
          }),
          gt: l(function(t, e, n) {
            for (var i = 0 > n ? n + e : n; ++i < e;) t.push(i);
            return t
          })
        }
      }, x.pseudos.nth = x.pseudos.eq;
      for (w in {
          radio: !0,
          checkbox: !0,
          file: !0,
          password: !0,
          image: !0
        }) x.pseudos[w] = a(w);
      for (w in {
          submit: !0,
          reset: !0
        }) x.pseudos[w] = c(w);
      return h.prototype = x.filters = x.pseudos, x.setFilters = new h, T = e.tokenize = function(t, n) {
        var i, o, r, s, a, c, l, u = H[t + " "];
        if (u) return n ? 0 : u.slice(0);
        for (a = t, c = [], l = x.preFilter; a;) {
          i && !(o = ct.exec(a)) || (o && (a = a.slice(o[0].length) || a), c.push(r = [])), i = !1, (o = lt.exec(a)) && (i = o.shift(), r.push({
            value: i,
            type: o[0].replace(at, " ")
          }), a = a.slice(i.length));
          for (s in x.filter) !(o = dt[s].exec(a)) || l[s] && !(o = l[s](o)) || (i = o.shift(), r.push({
            value: i,
            type: s,
            matches: o
          }), a = a.slice(i.length));
          if (!i) break
        }
        return n ? a.length : a ? e.error(t) : H(t, c).slice(0)
      }, E = e.compile = function(t, e) {
        var n, i = [],
          o = [],
          r = W[t + " "];
        if (!r) {
          for (e || (e = T(t)), n = e.length; n--;) r = v(e[n]), r[V] ? i.push(r) : o.push(r);
          r = W(t, b(o, i)), r.selector = t
        }
        return r
      }, S = e.select = function(t, e, n, i) {
        var o, r, s, a, c, l = "function" == typeof t && t,
          h = !i && T(t = l.selector || t);
        if (n = n || [], 1 === h.length) {
          if (r = h[0] = h[0].slice(0), r.length > 2 && "ID" === (s = r[0]).type && A.getById && 9 === e.nodeType && B && x.relative[r[1].type]) {
            if (e = (x.find.ID(s.matches[0].replace(wt, At), e) || [])[0], !e) return n;
            l && (e = e.parentNode), t = t.slice(r.shift().value.length)
          }
          for (o = dt.needsContext.test(t) ? 0 : r.length; o-- && (s = r[o], !x.relative[a = s.type]);)
            if ((c = x.find[a]) && (i = c(s.matches[0].replace(wt, At), vt.test(r[0].type) && u(e.parentNode) || e))) {
              if (r.splice(o, 1), t = i.length && p(r), !t) return G.apply(n, i), n;
              break
            }
        }
        return (l || E(t, h))(i, e, !B, n, !e || vt.test(t) && u(e.parentNode) || e), n
      }, A.sortStable = V.split("").sort(z).join("") === V, A.detectDuplicates = !!D, N(), A.sortDetached = o(function(t) {
        return 1 & t.compareDocumentPosition(j.createElement("div"))
      }), o(function(t) {
        return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
      }) || r("type|href|height|width", function(t, e, n) {
        return n ? void 0 : t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
      }), A.attributes && o(function(t) {
        return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
      }) || r("value", function(t, e, n) {
        return n || "input" !== t.nodeName.toLowerCase() ? void 0 : t.defaultValue
      }), o(function(t) {
        return null == t.getAttribute("disabled")
      }) || r(et, function(t, e, n) {
        var i;
        return n ? void 0 : t[e] === !0 ? e.toLowerCase() : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
      }), e
    }(t);
    rt.find = ut, rt.expr = ut.selectors, rt.expr[":"] = rt.expr.pseudos, rt.uniqueSort = rt.unique = ut.uniqueSort, rt.text = ut.getText, rt.isXMLDoc = ut.isXML, rt.contains = ut.contains;
    var ht = function(t, e, n) {
        for (var i = [], o = void 0 !== n;
          (t = t[e]) && 9 !== t.nodeType;)
          if (1 === t.nodeType) {
            if (o && rt(t).is(n)) break;
            i.push(t)
          }
        return i
      },
      pt = function(t, e) {
        for (var n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
        return n
      },
      dt = rt.expr.match.needsContext,
      ft = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
      gt = /^.[^:#\[\.,]*$/;
    rt.filter = function(t, e, n) {
      var i = e[0];
      return n && (t = ":not(" + t + ")"), 1 === e.length && 1 === i.nodeType ? rt.find.matchesSelector(i, t) ? [i] : [] : rt.find.matches(t, rt.grep(e, function(t) {
        return 1 === t.nodeType
      }))
    }, rt.fn.extend({
      find: function(t) {
        var e, n = this.length,
          i = [],
          o = this;
        if ("string" != typeof t) return this.pushStack(rt(t).filter(function() {
          for (e = 0; n > e; e++)
            if (rt.contains(o[e], this)) return !0
        }));
        for (e = 0; n > e; e++) rt.find(t, o[e], i);
        return i = this.pushStack(n > 1 ? rt.unique(i) : i), i.selector = this.selector ? this.selector + " " + t : t, i
      },
      filter: function(t) {
        return this.pushStack(i(this, t || [], !1))
      },
      not: function(t) {
        return this.pushStack(i(this, t || [], !0))
      },
      is: function(t) {
        return !!i(this, "string" == typeof t && dt.test(t) ? rt(t) : t || [], !1).length
      }
    });
    var mt, yt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      vt = rt.fn.init = function(t, e, n) {
        var i, o;
        if (!t) return this;
        if (n = n || mt, "string" == typeof t) {
          if (i = "<" === t[0] && ">" === t[t.length - 1] && t.length >= 3 ? [null, t, null] : yt.exec(t), !i || !i[1] && e) return !e || e.jquery ? (e || n).find(t) : this.constructor(e).find(t);
          if (i[1]) {
            if (e = e instanceof rt ? e[0] : e, rt.merge(this, rt.parseHTML(i[1], e && e.nodeType ? e.ownerDocument || e : Y, !0)), ft.test(i[1]) && rt.isPlainObject(e))
              for (i in e) rt.isFunction(this[i]) ? this[i](e[i]) : this.attr(i, e[i]);
            return this
          }
          return o = Y.getElementById(i[2]), o && o.parentNode && (this.length = 1, this[0] = o), this.context = Y, this.selector = t, this
        }
        return t.nodeType ? (this.context = this[0] = t, this.length = 1, this) : rt.isFunction(t) ? void 0 !== n.ready ? n.ready(t) : t(rt) : (void 0 !== t.selector && (this.selector = t.selector, this.context = t.context), rt.makeArray(t, this))
      };
    vt.prototype = rt.fn, mt = rt(Y);
    var bt = /^(?:parents|prev(?:Until|All))/,
      wt = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
      };
    rt.fn.extend({
      has: function(t) {
        var e = rt(t, this),
          n = e.length;
        return this.filter(function() {
          for (var t = 0; n > t; t++)
            if (rt.contains(this, e[t])) return !0
        })
      },
      closest: function(t, e) {
        for (var n, i = 0, o = this.length, r = [], s = dt.test(t) || "string" != typeof t ? rt(t, e || this.context) : 0; o > i; i++)
          for (n = this[i]; n && n !== e; n = n.parentNode)
            if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && rt.find.matchesSelector(n, t))) {
              r.push(n);
              break
            }
        return this.pushStack(r.length > 1 ? rt.uniqueSort(r) : r)
      },
      index: function(t) {
        return t ? "string" == typeof t ? J.call(rt(t), this[0]) : J.call(this, t.jquery ? t[0] : t) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
      },
      add: function(t, e) {
        return this.pushStack(rt.uniqueSort(rt.merge(this.get(), rt(t, e))))
      },
      addBack: function(t) {
        return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
      }
    }), rt.each({
      parent: function(t) {
        var e = t.parentNode;
        return e && 11 !== e.nodeType ? e : null
      },
      parents: function(t) {
        return ht(t, "parentNode")
      },
      parentsUntil: function(t, e, n) {
        return ht(t, "parentNode", n)
      },
      next: function(t) {
        return o(t, "nextSibling")
      },
      prev: function(t) {
        return o(t, "previousSibling")
      },
      nextAll: function(t) {
        return ht(t, "nextSibling")
      },
      prevAll: function(t) {
        return ht(t, "previousSibling")
      },
      nextUntil: function(t, e, n) {
        return ht(t, "nextSibling", n)
      },
      prevUntil: function(t, e, n) {
        return ht(t, "previousSibling", n)
      },
      siblings: function(t) {
        return pt((t.parentNode || {}).firstChild, t)
      },
      children: function(t) {
        return pt(t.firstChild)
      },
      contents: function(t) {
        return t.contentDocument || rt.merge([], t.childNodes)
      }
    }, function(t, e) {
      rt.fn[t] = function(n, i) {
        var o = rt.map(this, e, n);
        return "Until" !== t.slice(-5) && (i = n), i && "string" == typeof i && (o = rt.filter(i, o)), this.length > 1 && (wt[t] || rt.uniqueSort(o), bt.test(t) && o.reverse()), this.pushStack(o)
      }
    });
    var At = /\S+/g;
    rt.Callbacks = function(t) {
      t = "string" == typeof t ? r(t) : rt.extend({}, t);
      var e, n, i, o, s = [],
        a = [],
        c = -1,
        l = function() {
          for (o = t.once, i = e = !0; a.length; c = -1)
            for (n = a.shift(); ++c < s.length;) s[c].apply(n[0], n[1]) === !1 && t.stopOnFalse && (c = s.length, n = !1);
          t.memory || (n = !1), e = !1, o && (s = n ? [] : "")
        },
        u = {
          add: function() {
            return s && (n && !e && (c = s.length - 1, a.push(n)), function e(n) {
              rt.each(n, function(n, i) {
                rt.isFunction(i) ? t.unique && u.has(i) || s.push(i) : i && i.length && "string" !== rt.type(i) && e(i)
              })
            }(arguments), n && !e && l()), this
          },
          remove: function() {
            return rt.each(arguments, function(t, e) {
              for (var n;
                (n = rt.inArray(e, s, n)) > -1;) s.splice(n, 1), c >= n && c--
            }), this
          },
          has: function(t) {
            return t ? rt.inArray(t, s) > -1 : s.length > 0
          },
          empty: function() {
            return s && (s = []), this
          },
          disable: function() {
            return o = a = [], s = n = "", this
          },
          disabled: function() {
            return !s
          },
          lock: function() {
            return o = a = [], n || (s = n = ""), this
          },
          locked: function() {
            return !!o
          },
          fireWith: function(t, n) {
            return o || (n = n || [], n = [t, n.slice ? n.slice() : n], a.push(n), e || l()), this
          },
          fire: function() {
            return u.fireWith(this, arguments), this
          },
          fired: function() {
            return !!i
          }
        };
      return u
    }, rt.extend({
      Deferred: function(t) {
        var e = [
            ["resolve", "done", rt.Callbacks("once memory"), "resolved"],
            ["reject", "fail", rt.Callbacks("once memory"), "rejected"],
            ["notify", "progress", rt.Callbacks("memory")]
          ],
          n = "pending",
          i = {
            state: function() {
              return n
            },
            always: function() {
              return o.done(arguments).fail(arguments), this
            },
            then: function() {
              var t = arguments;
              return rt.Deferred(function(n) {
                rt.each(e, function(e, r) {
                  var s = rt.isFunction(t[e]) && t[e];
                  o[r[1]](function() {
                    var t = s && s.apply(this, arguments);
                    t && rt.isFunction(t.promise) ? t.promise().progress(n.notify).done(n.resolve).fail(n.reject) : n[r[0] + "With"](this === i ? n.promise() : this, s ? [t] : arguments)
                  })
                }), t = null
              }).promise()
            },
            promise: function(t) {
              return null != t ? rt.extend(t, i) : i
            }
          },
          o = {};
        return i.pipe = i.then, rt.each(e, function(t, r) {
          var s = r[2],
            a = r[3];
          i[r[1]] = s.add, a && s.add(function() {
            n = a
          }, e[1 ^ t][2].disable, e[2][2].lock), o[r[0]] = function() {
            return o[r[0] + "With"](this === o ? i : this, arguments), this
          }, o[r[0] + "With"] = s.fireWith
        }), i.promise(o), t && t.call(o, o), o
      },
      when: function(t) {
        var e, n, i, o = 0,
          r = Z.call(arguments),
          s = r.length,
          a = 1 !== s || t && rt.isFunction(t.promise) ? s : 0,
          c = 1 === a ? t : rt.Deferred(),
          l = function(t, n, i) {
            return function(o) {
              n[t] = this, i[t] = arguments.length > 1 ? Z.call(arguments) : o, i === e ? c.notifyWith(n, i) : --a || c.resolveWith(n, i)
            }
          };
        if (s > 1)
          for (e = new Array(s), n = new Array(s), i = new Array(s); s > o; o++) r[o] && rt.isFunction(r[o].promise) ? r[o].promise().progress(l(o, n, e)).done(l(o, i, r)).fail(c.reject) : --a;
        return a || c.resolveWith(i, r), c.promise()
      }
    });
    var xt;
    rt.fn.ready = function(t) {
      return rt.ready.promise().done(t), this
    }, rt.extend({
      isReady: !1,
      readyWait: 1,
      holdReady: function(t) {
        t ? rt.readyWait++ : rt.ready(!0)
      },
      ready: function(t) {
        (t === !0 ? --rt.readyWait : rt.isReady) || (rt.isReady = !0, t !== !0 && --rt.readyWait > 0 || (xt.resolveWith(Y, [rt]), rt.fn.triggerHandler && (rt(Y).triggerHandler("ready"), rt(Y).off("ready"))))
      }
    }), rt.ready.promise = function(e) {
      return xt || (xt = rt.Deferred(), "complete" === Y.readyState || "loading" !== Y.readyState && !Y.documentElement.doScroll ? t.setTimeout(rt.ready) : (Y.addEventListener("DOMContentLoaded", s), t.addEventListener("load", s))), xt.promise(e)
    }, rt.ready.promise();
    var Ct = function(t, e, n, i, o, r, s) {
        var a = 0,
          c = t.length,
          l = null == n;
        if ("object" === rt.type(n)) {
          o = !0;
          for (a in n) Ct(t, e, a, n[a], !0, r, s)
        } else if (void 0 !== i && (o = !0, rt.isFunction(i) || (s = !0), l && (s ? (e.call(t, i), e = null) : (l = e, e = function(t, e, n) {
            return l.call(rt(t), n)
          })), e))
          for (; c > a; a++) e(t[a], n, s ? i : i.call(t[a], a, e(t[a], n)));
        return o ? t : l ? e.call(t) : c ? e(t[0], n) : r
      },
      kt = function(t) {
        return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType
      };
    a.uid = 1, a.prototype = {
      register: function(t, e) {
        var n = e || {};
        return t.nodeType ? t[this.expando] = n : Object.defineProperty(t, this.expando, {
          value: n,
          writable: !0,
          configurable: !0
        }), t[this.expando]
      },
      cache: function(t) {
        if (!kt(t)) return {};
        var e = t[this.expando];
        return e || (e = {}, kt(t) && (t.nodeType ? t[this.expando] = e : Object.defineProperty(t, this.expando, {
          value: e,
          configurable: !0
        }))), e
      },
      set: function(t, e, n) {
        var i, o = this.cache(t);
        if ("string" == typeof e) o[e] = n;
        else
          for (i in e) o[i] = e[i];
        return o
      },
      get: function(t, e) {
        return void 0 === e ? this.cache(t) : t[this.expando] && t[this.expando][e]
      },
      access: function(t, e, n) {
        var i;
        return void 0 === e || e && "string" == typeof e && void 0 === n ? (i = this.get(t, e), void 0 !== i ? i : this.get(t, rt.camelCase(e))) : (this.set(t, e, n), void 0 !== n ? n : e)
      },
      remove: function(t, e) {
        var n, i, o, r = t[this.expando];
        if (void 0 !== r) {
          if (void 0 === e) this.register(t);
          else {
            rt.isArray(e) ? i = e.concat(e.map(rt.camelCase)) : (o = rt.camelCase(e), e in r ? i = [e, o] : (i = o, i = i in r ? [i] : i.match(At) || [])), n = i.length;
            for (; n--;) delete r[i[n]]
          }(void 0 === e || rt.isEmptyObject(r)) && (t.nodeType ? t[this.expando] = void 0 : delete t[this.expando])
        }
      },
      hasData: function(t) {
        var e = t[this.expando];
        return void 0 !== e && !rt.isEmptyObject(e)
      }
    };
    var Tt = new a,
      Et = new a,
      St = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      _t = /[A-Z]/g;
    rt.extend({
      hasData: function(t) {
        return Et.hasData(t) || Tt.hasData(t)
      },
      data: function(t, e, n) {
        return Et.access(t, e, n)
      },
      removeData: function(t, e) {
        Et.remove(t, e)
      },
      _data: function(t, e, n) {
        return Tt.access(t, e, n)
      },
      _removeData: function(t, e) {
        Tt.remove(t, e)
      }
    }), rt.fn.extend({
      data: function(t, e) {
        var n, i, o, r = this[0],
          s = r && r.attributes;
        if (void 0 === t) {
          if (this.length && (o = Et.get(r), 1 === r.nodeType && !Tt.get(r, "hasDataAttrs"))) {
            for (n = s.length; n--;) s[n] && (i = s[n].name, 0 === i.indexOf("data-") && (i = rt.camelCase(i.slice(5)), c(r, i, o[i])));
            Tt.set(r, "hasDataAttrs", !0)
          }
          return o
        }
        return "object" == typeof t ? this.each(function() {
          Et.set(this, t)
        }) : Ct(this, function(e) {
          var n, i;
          if (r && void 0 === e) {
            if (n = Et.get(r, t) || Et.get(r, t.replace(_t, "-$&").toLowerCase()), void 0 !== n) return n;
            if (i = rt.camelCase(t), n = Et.get(r, i), void 0 !== n) return n;
            if (n = c(r, i, void 0), void 0 !== n) return n
          } else i = rt.camelCase(t), this.each(function() {
            var n = Et.get(this, i);
            Et.set(this, i, e), t.indexOf("-") > -1 && void 0 !== n && Et.set(this, t, e)
          })
        }, null, e, arguments.length > 1, null, !0)
      },
      removeData: function(t) {
        return this.each(function() {
          Et.remove(this, t)
        })
      }
    }), rt.extend({
      queue: function(t, e, n) {
        var i;
        return t ? (e = (e || "fx") + "queue", i = Tt.get(t, e), n && (!i || rt.isArray(n) ? i = Tt.access(t, e, rt.makeArray(n)) : i.push(n)), i || []) : void 0
      },
      dequeue: function(t, e) {
        e = e || "fx";
        var n = rt.queue(t, e),
          i = n.length,
          o = n.shift(),
          r = rt._queueHooks(t, e),
          s = function() {
            rt.dequeue(t, e)
          };
        "inprogress" === o && (o = n.shift(), i--), o && ("fx" === e && n.unshift("inprogress"), delete r.stop, o.call(t, s, r)), !i && r && r.empty.fire()
      },
      _queueHooks: function(t, e) {
        var n = e + "queueHooks";
        return Tt.get(t, n) || Tt.access(t, n, {
          empty: rt.Callbacks("once memory").add(function() {
            Tt.remove(t, [e + "queue", n])
          })
        })
      }
    }), rt.fn.extend({
      queue: function(t, e) {
        var n = 2;
        return "string" != typeof t && (e = t, t = "fx", n--), arguments.length < n ? rt.queue(this[0], t) : void 0 === e ? this : this.each(function() {
          var n = rt.queue(this, t, e);
          rt._queueHooks(this, t), "fx" === t && "inprogress" !== n[0] && rt.dequeue(this, t)
        })
      },
      dequeue: function(t) {
        return this.each(function() {
          rt.dequeue(this, t)
        })
      },
      clearQueue: function(t) {
        return this.queue(t || "fx", [])
      },
      promise: function(t, e) {
        var n, i = 1,
          o = rt.Deferred(),
          r = this,
          s = this.length,
          a = function() {
            --i || o.resolveWith(r, [r])
          };
        for ("string" != typeof t && (e = t, t = void 0), t = t || "fx"; s--;) n = Tt.get(r[s], t + "queueHooks"), n && n.empty && (i++, n.empty.add(a));
        return a(), o.promise(e)
      }
    });
    var $t = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      Dt = new RegExp("^(?:([+-])=|)(" + $t + ")([a-z%]*)$", "i"),
      Nt = ["Top", "Right", "Bottom", "Left"],
      jt = function(t, e) {
        return t = e || t, "none" === rt.css(t, "display") || !rt.contains(t.ownerDocument, t)
      },
      It = /^(?:checkbox|radio)$/i,
      Bt = /<([\w:-]+)/,
      Rt = /^$|\/(?:java|ecma)script/i,
      Ot = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
    Ot.optgroup = Ot.option, Ot.tbody = Ot.tfoot = Ot.colgroup = Ot.caption = Ot.thead, Ot.th = Ot.td;
    var Pt = /<|&#?\w+;/;
    ! function() {
      var t = Y.createDocumentFragment(),
        e = t.appendChild(Y.createElement("div")),
        n = Y.createElement("input");
      n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), e.appendChild(n), it.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, e.innerHTML = "<textarea>x</textarea>", it.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue
    }();
    var Mt = /^key/,
      Vt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
      qt = /^([^.]*)(?:\.(.+)|)/;
    rt.event = {
      global: {},
      add: function(t, e, n, i, o) {
        var r, s, a, c, l, u, h, p, d, f, g, m = Tt.get(t);
        if (m)
          for (n.handler && (r = n, n = r.handler, o = r.selector), n.guid || (n.guid = rt.guid++), (c = m.events) || (c = m.events = {}), (s = m.handle) || (s = m.handle = function(e) {
              return "undefined" != typeof rt && rt.event.triggered !== e.type ? rt.event.dispatch.apply(t, arguments) : void 0
            }), e = (e || "").match(At) || [""], l = e.length; l--;) a = qt.exec(e[l]) || [], d = g = a[1], f = (a[2] || "").split(".").sort(), d && (h = rt.event.special[d] || {}, d = (o ? h.delegateType : h.bindType) || d, h = rt.event.special[d] || {}, u = rt.extend({
            type: d,
            origType: g,
            data: i,
            handler: n,
            guid: n.guid,
            selector: o,
            needsContext: o && rt.expr.match.needsContext.test(o),
            namespace: f.join(".")
          }, r), (p = c[d]) || (p = c[d] = [], p.delegateCount = 0, h.setup && h.setup.call(t, i, f, s) !== !1 || t.addEventListener && t.addEventListener(d, s)), h.add && (h.add.call(t, u), u.handler.guid || (u.handler.guid = n.guid)), o ? p.splice(p.delegateCount++, 0, u) : p.push(u), rt.event.global[d] = !0)
      },
      remove: function(t, e, n, i, o) {
        var r, s, a, c, l, u, h, p, d, f, g, m = Tt.hasData(t) && Tt.get(t);
        if (m && (c = m.events)) {
          for (e = (e || "").match(At) || [""], l = e.length; l--;)
            if (a = qt.exec(e[l]) || [], d = g = a[1], f = (a[2] || "").split(".").sort(), d) {
              for (h = rt.event.special[d] || {}, d = (i ? h.delegateType : h.bindType) || d, p = c[d] || [], a = a[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = r = p.length; r--;) u = p[r], !o && g !== u.origType || n && n.guid !== u.guid || a && !a.test(u.namespace) || i && i !== u.selector && ("**" !== i || !u.selector) || (p.splice(r, 1), u.selector && p.delegateCount--, h.remove && h.remove.call(t, u));
              s && !p.length && (h.teardown && h.teardown.call(t, f, m.handle) !== !1 || rt.removeEvent(t, d, m.handle), delete c[d])
            } else
              for (d in c) rt.event.remove(t, d + e[l], n, i, !0);
          rt.isEmptyObject(c) && Tt.remove(t, "handle events")
        }
      },
      dispatch: function(t) {
        t = rt.event.fix(t);
        var e, n, i, o, r, s = [],
          a = Z.call(arguments),
          c = (Tt.get(this, "events") || {})[t.type] || [],
          l = rt.event.special[t.type] || {};
        if (a[0] = t, t.delegateTarget = this, !l.preDispatch || l.preDispatch.call(this, t) !== !1) {
          for (s = rt.event.handlers.call(this, t, c), e = 0;
            (o = s[e++]) && !t.isPropagationStopped();)
            for (t.currentTarget = o.elem, n = 0;
              (r = o.handlers[n++]) && !t.isImmediatePropagationStopped();) t.rnamespace && !t.rnamespace.test(r.namespace) || (t.handleObj = r, t.data = r.data, i = ((rt.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, a), void 0 !== i && (t.result = i) === !1 && (t.preventDefault(), t.stopPropagation()));
          return l.postDispatch && l.postDispatch.call(this, t), t.result
        }
      },
      handlers: function(t, e) {
        var n, i, o, r, s = [],
          a = e.delegateCount,
          c = t.target;
        if (a && c.nodeType && ("click" !== t.type || isNaN(t.button) || t.button < 1))
          for (; c !== this; c = c.parentNode || this)
            if (1 === c.nodeType && (c.disabled !== !0 || "click" !== t.type)) {
              for (i = [], n = 0; a > n; n++) r = e[n], o = r.selector + " ", void 0 === i[o] && (i[o] = r.needsContext ? rt(o, this).index(c) > -1 : rt.find(o, this, null, [c]).length), i[o] && i.push(r);
              i.length && s.push({
                elem: c,
                handlers: i
              })
            }
        return a < e.length && s.push({
          elem: this,
          handlers: e.slice(a)
        }), s
      },
      props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      fixHooks: {},
      keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(t, e) {
          return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode), t
        }
      },
      mouseHooks: {
        props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(t, e) {
          var n, i, o, r = e.button;
          return null == t.pageX && null != e.clientX && (n = t.target.ownerDocument || Y, i = n.documentElement, o = n.body, t.pageX = e.clientX + (i && i.scrollLeft || o && o.scrollLeft || 0) - (i && i.clientLeft || o && o.clientLeft || 0), t.pageY = e.clientY + (i && i.scrollTop || o && o.scrollTop || 0) - (i && i.clientTop || o && o.clientTop || 0)), t.which || void 0 === r || (t.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0), t
        }
      },
      fix: function(t) {
        if (t[rt.expando]) return t;
        var e, n, i, o = t.type,
          r = t,
          s = this.fixHooks[o];
        for (s || (this.fixHooks[o] = s = Vt.test(o) ? this.mouseHooks : Mt.test(o) ? this.keyHooks : {}), i = s.props ? this.props.concat(s.props) : this.props, t = new rt.Event(r), e = i.length; e--;) n = i[e], t[n] = r[n];
        return t.target || (t.target = Y), 3 === t.target.nodeType && (t.target = t.target.parentNode), s.filter ? s.filter(t, r) : t
      },
      special: {
        load: {
          noBubble: !0
        },
        focus: {
          trigger: function() {
            return this !== g() && this.focus ? (this.focus(), !1) : void 0
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            return this === g() && this.blur ? (this.blur(), !1) : void 0
          },
          delegateType: "focusout"
        },
        click: {
          trigger: function() {
            return "checkbox" === this.type && this.click && rt.nodeName(this, "input") ? (this.click(), !1) : void 0
          },
          _default: function(t) {
            return rt.nodeName(t.target, "a")
          }
        },
        beforeunload: {
          postDispatch: function(t) {
            void 0 !== t.result && t.originalEvent && (t.originalEvent.returnValue = t.result)
          }
        }
      }
    }, rt.removeEvent = function(t, e, n) {
      t.removeEventListener && t.removeEventListener(e, n)
    }, rt.Event = function(t, e) {
      return this instanceof rt.Event ? (t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || void 0 === t.defaultPrevented && t.returnValue === !1 ? d : f) : this.type = t, e && rt.extend(this, e), this.timeStamp = t && t.timeStamp || rt.now(), void(this[rt.expando] = !0)) : new rt.Event(t, e)
    }, rt.Event.prototype = {
      constructor: rt.Event,
      isDefaultPrevented: f,
      isPropagationStopped: f,
      isImmediatePropagationStopped: f,
      isSimulated: !1,
      preventDefault: function() {
        var t = this.originalEvent;
        this.isDefaultPrevented = d, t && !this.isSimulated && t.preventDefault()
      },
      stopPropagation: function() {
        var t = this.originalEvent;
        this.isPropagationStopped = d, t && !this.isSimulated && t.stopPropagation()
      },
      stopImmediatePropagation: function() {
        var t = this.originalEvent;
        this.isImmediatePropagationStopped = d, t && !this.isSimulated && t.stopImmediatePropagation(), this.stopPropagation()
      }
    }, rt.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function(t, e) {
      rt.event.special[t] = {
        delegateType: e,
        bindType: e,
        handle: function(t) {
          var n, i = this,
            o = t.relatedTarget,
            r = t.handleObj;
          return o && (o === i || rt.contains(i, o)) || (t.type = r.origType, n = r.handler.apply(this, arguments), t.type = e), n
        }
      }
    }), rt.fn.extend({
      on: function(t, e, n, i) {
        return m(this, t, e, n, i)
      },
      one: function(t, e, n, i) {
        return m(this, t, e, n, i, 1)
      },
      off: function(t, e, n) {
        var i, o;
        if (t && t.preventDefault && t.handleObj) return i = t.handleObj, rt(t.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
        if ("object" == typeof t) {
          for (o in t) this.off(o, e, t[o]);
          return this
        }
        return e !== !1 && "function" != typeof e || (n = e, e = void 0), n === !1 && (n = f), this.each(function() {
          rt.event.remove(this, t, n, e)
        })
      }
    });
    var Lt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
      Ft = /<script|<style|<link/i,
      Ut = /checked\s*(?:[^=]|=\s*.checked.)/i,
      Ht = /^true\/(.*)/,
      Wt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    rt.extend({
      htmlPrefilter: function(t) {
        return t.replace(Lt, "<$1></$2>")
      },
      clone: function(t, e, n) {
        var i, o, r, s, a = t.cloneNode(!0),
          c = rt.contains(t.ownerDocument, t);
        if (!(it.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || rt.isXMLDoc(t)))
          for (s = u(a), r = u(t), i = 0, o = r.length; o > i; i++) A(r[i], s[i]);
        if (e)
          if (n)
            for (r = r || u(t), s = s || u(a), i = 0, o = r.length; o > i; i++) w(r[i], s[i]);
          else w(t, a);
        return s = u(a, "script"), s.length > 0 && h(s, !c && u(t, "script")), a
      },
      cleanData: function(t) {
        for (var e, n, i, o = rt.event.special, r = 0; void 0 !== (n = t[r]); r++)
          if (kt(n)) {
            if (e = n[Tt.expando]) {
              if (e.events)
                for (i in e.events) o[i] ? rt.event.remove(n, i) : rt.removeEvent(n, i, e.handle);
              n[Tt.expando] = void 0
            }
            n[Et.expando] && (n[Et.expando] = void 0)
          }
      }
    }), rt.fn.extend({
      domManip: x,
      detach: function(t) {
        return C(this, t, !0)
      },
      remove: function(t) {
        return C(this, t)
      },
      text: function(t) {
        return Ct(this, function(t) {
          return void 0 === t ? rt.text(this) : this.empty().each(function() {
            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = t)
          })
        }, null, t, arguments.length)
      },
      append: function() {
        return x(this, arguments, function(t) {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
            var e = y(this, t);
            e.appendChild(t)
          }
        })
      },
      prepend: function() {
        return x(this, arguments, function(t) {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
            var e = y(this, t);
            e.insertBefore(t, e.firstChild)
          }
        })
      },
      before: function() {
        return x(this, arguments, function(t) {
          this.parentNode && this.parentNode.insertBefore(t, this)
        })
      },
      after: function() {
        return x(this, arguments, function(t) {
          this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
        })
      },
      empty: function() {
        for (var t, e = 0; null != (t = this[e]); e++) 1 === t.nodeType && (rt.cleanData(u(t, !1)), t.textContent = "");
        return this
      },
      clone: function(t, e) {
        return t = null != t && t, e = null == e ? t : e, this.map(function() {
          return rt.clone(this, t, e)
        })
      },
      html: function(t) {
        return Ct(this, function(t) {
          var e = this[0] || {},
            n = 0,
            i = this.length;
          if (void 0 === t && 1 === e.nodeType) return e.innerHTML;
          if ("string" == typeof t && !Ft.test(t) && !Ot[(Bt.exec(t) || ["", ""])[1].toLowerCase()]) {
            t = rt.htmlPrefilter(t);
            try {
              for (; i > n; n++) e = this[n] || {}, 1 === e.nodeType && (rt.cleanData(u(e, !1)), e.innerHTML = t);
              e = 0
            } catch (t) {}
          }
          e && this.empty().append(t)
        }, null, t, arguments.length)
      },
      replaceWith: function() {
        var t = [];
        return x(this, arguments, function(e) {
          var n = this.parentNode;
          rt.inArray(this, t) < 0 && (rt.cleanData(u(this)), n && n.replaceChild(e, this))
        }, t)
      }
    }), rt.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(t, e) {
      rt.fn[t] = function(t) {
        for (var n, i = [], o = rt(t), r = o.length - 1, s = 0; r >= s; s++) n = s === r ? this : this.clone(!0), rt(o[s])[e](n), G.apply(i, n.get());
        return this.pushStack(i)
      }
    });
    var zt, Qt = {
        HTML: "block",
        BODY: "block"
      },
      Xt = /^margin/,
      Yt = new RegExp("^(" + $t + ")(?!px)[a-z%]+$", "i"),
      Zt = function(e) {
        var n = e.ownerDocument.defaultView;
        return n && n.opener || (n = t), n.getComputedStyle(e)
      },
      Kt = function(t, e, n, i) {
        var o, r, s = {};
        for (r in e) s[r] = t.style[r], t.style[r] = e[r];
        o = n.apply(t, i || []);
        for (r in e) t.style[r] = s[r];
        return o
      },
      Gt = Y.documentElement;
    ! function() {
      function e() {
        a.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", a.innerHTML = "", Gt.appendChild(s);
        var e = t.getComputedStyle(a);
        n = "1%" !== e.top, r = "2px" === e.marginLeft, i = "4px" === e.width, a.style.marginRight = "50%", o = "4px" === e.marginRight, Gt.removeChild(s)
      }
      var n, i, o, r, s = Y.createElement("div"),
        a = Y.createElement("div");
      a.style && (a.style.backgroundClip = "content-box", a.cloneNode(!0).style.backgroundClip = "", it.clearCloneStyle = "content-box" === a.style.backgroundClip, s.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", s.appendChild(a), rt.extend(it, {
        pixelPosition: function() {
          return e(), n
        },
        boxSizingReliable: function() {
          return null == i && e(), i
        },
        pixelMarginRight: function() {
          return null == i && e(), o
        },
        reliableMarginLeft: function() {
          return null == i && e(), r
        },
        reliableMarginRight: function() {
          var e, n = a.appendChild(Y.createElement("div"));
          return n.style.cssText = a.style.cssText = "-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", n.style.marginRight = n.style.width = "0", a.style.width = "1px", Gt.appendChild(s), e = !parseFloat(t.getComputedStyle(n).marginRight), Gt.removeChild(s), a.removeChild(n), e
        }
      }))
    }();
    var Jt = /^(none|table(?!-c[ea]).+)/,
      te = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
      },
      ee = {
        letterSpacing: "0",
        fontWeight: "400"
      },
      ne = ["Webkit", "O", "Moz", "ms"],
      ie = Y.createElement("div").style;
    rt.extend({
      cssHooks: {
        opacity: {
          get: function(t, e) {
            if (e) {
              var n = E(t, "opacity");
              return "" === n ? "1" : n
            }
          }
        }
      },
      cssNumber: {
        animationIterationCount: !0,
        columnCount: !0,
        fillOpacity: !0,
        flexGrow: !0,
        flexShrink: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0
      },
      cssProps: {
        float: "cssFloat"
      },
      style: function(t, e, n, i) {
        if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
          var o, r, s, a = rt.camelCase(e),
            c = t.style;
          return e = rt.cssProps[a] || (rt.cssProps[a] = _(a) || a), s = rt.cssHooks[e] || rt.cssHooks[a], void 0 === n ? s && "get" in s && void 0 !== (o = s.get(t, !1, i)) ? o : c[e] : (r = typeof n, "string" === r && (o = Dt.exec(n)) && o[1] && (n = l(t, e, o), r = "number"), void(null != n && n === n && ("number" === r && (n += o && o[3] || (rt.cssNumber[a] ? "" : "px")),
            it.clearCloneStyle || "" !== n || 0 !== e.indexOf("background") || (c[e] = "inherit"), s && "set" in s && void 0 === (n = s.set(t, n, i)) || (c[e] = n))))
        }
      },
      css: function(t, e, n, i) {
        var o, r, s, a = rt.camelCase(e);
        return e = rt.cssProps[a] || (rt.cssProps[a] = _(a) || a), s = rt.cssHooks[e] || rt.cssHooks[a], s && "get" in s && (o = s.get(t, !0, n)), void 0 === o && (o = E(t, e, i)), "normal" === o && e in ee && (o = ee[e]), "" === n || n ? (r = parseFloat(o), n === !0 || isFinite(r) ? r || 0 : o) : o
      }
    }), rt.each(["height", "width"], function(t, e) {
      rt.cssHooks[e] = {
        get: function(t, n, i) {
          return n ? Jt.test(rt.css(t, "display")) && 0 === t.offsetWidth ? Kt(t, te, function() {
            return N(t, e, i)
          }) : N(t, e, i) : void 0
        },
        set: function(t, n, i) {
          var o, r = i && Zt(t),
            s = i && D(t, e, i, "border-box" === rt.css(t, "boxSizing", !1, r), r);
          return s && (o = Dt.exec(n)) && "px" !== (o[3] || "px") && (t.style[e] = n, n = rt.css(t, e)), $(t, n, s)
        }
      }
    }), rt.cssHooks.marginLeft = S(it.reliableMarginLeft, function(t, e) {
      return e ? (parseFloat(E(t, "marginLeft")) || t.getBoundingClientRect().left - Kt(t, {
        marginLeft: 0
      }, function() {
        return t.getBoundingClientRect().left
      })) + "px" : void 0
    }), rt.cssHooks.marginRight = S(it.reliableMarginRight, function(t, e) {
      return e ? Kt(t, {
        display: "inline-block"
      }, E, [t, "marginRight"]) : void 0
    }), rt.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(t, e) {
      rt.cssHooks[t + e] = {
        expand: function(n) {
          for (var i = 0, o = {}, r = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) o[t + Nt[i] + e] = r[i] || r[i - 2] || r[0];
          return o
        }
      }, Xt.test(t) || (rt.cssHooks[t + e].set = $)
    }), rt.fn.extend({
      css: function(t, e) {
        return Ct(this, function(t, e, n) {
          var i, o, r = {},
            s = 0;
          if (rt.isArray(e)) {
            for (i = Zt(t), o = e.length; o > s; s++) r[e[s]] = rt.css(t, e[s], !1, i);
            return r
          }
          return void 0 !== n ? rt.style(t, e, n) : rt.css(t, e)
        }, t, e, arguments.length > 1)
      },
      show: function() {
        return j(this, !0)
      },
      hide: function() {
        return j(this)
      },
      toggle: function(t) {
        return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function() {
          jt(this) ? rt(this).show() : rt(this).hide()
        })
      }
    }), rt.Tween = I, I.prototype = {
      constructor: I,
      init: function(t, e, n, i, o, r) {
        this.elem = t, this.prop = n, this.easing = o || rt.easing._default, this.options = e, this.start = this.now = this.cur(), this.end = i, this.unit = r || (rt.cssNumber[n] ? "" : "px")
      },
      cur: function() {
        var t = I.propHooks[this.prop];
        return t && t.get ? t.get(this) : I.propHooks._default.get(this)
      },
      run: function(t) {
        var e, n = I.propHooks[this.prop];
        return this.options.duration ? this.pos = e = rt.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : this.pos = e = t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : I.propHooks._default.set(this), this
      }
    }, I.prototype.init.prototype = I.prototype, I.propHooks = {
      _default: {
        get: function(t) {
          var e;
          return 1 !== t.elem.nodeType || null != t.elem[t.prop] && null == t.elem.style[t.prop] ? t.elem[t.prop] : (e = rt.css(t.elem, t.prop, ""), e && "auto" !== e ? e : 0)
        },
        set: function(t) {
          rt.fx.step[t.prop] ? rt.fx.step[t.prop](t) : 1 !== t.elem.nodeType || null == t.elem.style[rt.cssProps[t.prop]] && !rt.cssHooks[t.prop] ? t.elem[t.prop] = t.now : rt.style(t.elem, t.prop, t.now + t.unit)
        }
      }
    }, I.propHooks.scrollTop = I.propHooks.scrollLeft = {
      set: function(t) {
        t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
      }
    }, rt.easing = {
      linear: function(t) {
        return t
      },
      swing: function(t) {
        return .5 - Math.cos(t * Math.PI) / 2
      },
      _default: "swing"
    }, rt.fx = I.prototype.init, rt.fx.step = {};
    var oe, re, se = /^(?:toggle|show|hide)$/,
      ae = /queueHooks$/;
    rt.Animation = rt.extend(V, {
        tweeners: {
          "*": [function(t, e) {
            var n = this.createTween(t, e);
            return l(n.elem, t, Dt.exec(e), n), n
          }]
        },
        tweener: function(t, e) {
          rt.isFunction(t) ? (e = t, t = ["*"]) : t = t.match(At);
          for (var n, i = 0, o = t.length; o > i; i++) n = t[i], V.tweeners[n] = V.tweeners[n] || [], V.tweeners[n].unshift(e)
        },
        prefilters: [P],
        prefilter: function(t, e) {
          e ? V.prefilters.unshift(t) : V.prefilters.push(t)
        }
      }), rt.speed = function(t, e, n) {
        var i = t && "object" == typeof t ? rt.extend({}, t) : {
          complete: n || !n && e || rt.isFunction(t) && t,
          duration: t,
          easing: n && e || e && !rt.isFunction(e) && e
        };
        return i.duration = rt.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in rt.fx.speeds ? rt.fx.speeds[i.duration] : rt.fx.speeds._default, null != i.queue && i.queue !== !0 || (i.queue = "fx"), i.old = i.complete, i.complete = function() {
          rt.isFunction(i.old) && i.old.call(this), i.queue && rt.dequeue(this, i.queue)
        }, i
      }, rt.fn.extend({
        fadeTo: function(t, e, n, i) {
          return this.filter(jt).css("opacity", 0).show().end().animate({
            opacity: e
          }, t, n, i)
        },
        animate: function(t, e, n, i) {
          var o = rt.isEmptyObject(t),
            r = rt.speed(e, n, i),
            s = function() {
              var e = V(this, rt.extend({}, t), r);
              (o || Tt.get(this, "finish")) && e.stop(!0)
            };
          return s.finish = s, o || r.queue === !1 ? this.each(s) : this.queue(r.queue, s)
        },
        stop: function(t, e, n) {
          var i = function(t) {
            var e = t.stop;
            delete t.stop, e(n)
          };
          return "string" != typeof t && (n = e, e = t, t = void 0), e && t !== !1 && this.queue(t || "fx", []), this.each(function() {
            var e = !0,
              o = null != t && t + "queueHooks",
              r = rt.timers,
              s = Tt.get(this);
            if (o) s[o] && s[o].stop && i(s[o]);
            else
              for (o in s) s[o] && s[o].stop && ae.test(o) && i(s[o]);
            for (o = r.length; o--;) r[o].elem !== this || null != t && r[o].queue !== t || (r[o].anim.stop(n), e = !1, r.splice(o, 1));
            !e && n || rt.dequeue(this, t)
          })
        },
        finish: function(t) {
          return t !== !1 && (t = t || "fx"), this.each(function() {
            var e, n = Tt.get(this),
              i = n[t + "queue"],
              o = n[t + "queueHooks"],
              r = rt.timers,
              s = i ? i.length : 0;
            for (n.finish = !0, rt.queue(this, t, []), o && o.stop && o.stop.call(this, !0), e = r.length; e--;) r[e].elem === this && r[e].queue === t && (r[e].anim.stop(!0), r.splice(e, 1));
            for (e = 0; s > e; e++) i[e] && i[e].finish && i[e].finish.call(this);
            delete n.finish
          })
        }
      }), rt.each(["toggle", "show", "hide"], function(t, e) {
        var n = rt.fn[e];
        rt.fn[e] = function(t, i, o) {
          return null == t || "boolean" == typeof t ? n.apply(this, arguments) : this.animate(R(e, !0), t, i, o)
        }
      }), rt.each({
        slideDown: R("show"),
        slideUp: R("hide"),
        slideToggle: R("toggle"),
        fadeIn: {
          opacity: "show"
        },
        fadeOut: {
          opacity: "hide"
        },
        fadeToggle: {
          opacity: "toggle"
        }
      }, function(t, e) {
        rt.fn[t] = function(t, n, i) {
          return this.animate(e, t, n, i)
        }
      }), rt.timers = [], rt.fx.tick = function() {
        var t, e = 0,
          n = rt.timers;
        for (oe = rt.now(); e < n.length; e++) t = n[e], t() || n[e] !== t || n.splice(e--, 1);
        n.length || rt.fx.stop(), oe = void 0
      }, rt.fx.timer = function(t) {
        rt.timers.push(t), t() ? rt.fx.start() : rt.timers.pop()
      }, rt.fx.interval = 13, rt.fx.start = function() {
        re || (re = t.setInterval(rt.fx.tick, rt.fx.interval))
      }, rt.fx.stop = function() {
        t.clearInterval(re), re = null
      }, rt.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
      }, rt.fn.delay = function(e, n) {
        return e = rt.fx ? rt.fx.speeds[e] || e : e, n = n || "fx", this.queue(n, function(n, i) {
          var o = t.setTimeout(n, e);
          i.stop = function() {
            t.clearTimeout(o)
          }
        })
      },
      function() {
        var t = Y.createElement("input"),
          e = Y.createElement("select"),
          n = e.appendChild(Y.createElement("option"));
        t.type = "checkbox", it.checkOn = "" !== t.value, it.optSelected = n.selected, e.disabled = !0, it.optDisabled = !n.disabled, t = Y.createElement("input"), t.value = "t", t.type = "radio", it.radioValue = "t" === t.value
      }();
    var ce, le = rt.expr.attrHandle;
    rt.fn.extend({
      attr: function(t, e) {
        return Ct(this, rt.attr, t, e, arguments.length > 1)
      },
      removeAttr: function(t) {
        return this.each(function() {
          rt.removeAttr(this, t)
        })
      }
    }), rt.extend({
      attr: function(t, e, n) {
        var i, o, r = t.nodeType;
        if (3 !== r && 8 !== r && 2 !== r) return "undefined" == typeof t.getAttribute ? rt.prop(t, e, n) : (1 === r && rt.isXMLDoc(t) || (e = e.toLowerCase(), o = rt.attrHooks[e] || (rt.expr.match.bool.test(e) ? ce : void 0)), void 0 !== n ? null === n ? void rt.removeAttr(t, e) : o && "set" in o && void 0 !== (i = o.set(t, n, e)) ? i : (t.setAttribute(e, n + ""), n) : o && "get" in o && null !== (i = o.get(t, e)) ? i : (i = rt.find.attr(t, e), null == i ? void 0 : i))
      },
      attrHooks: {
        type: {
          set: function(t, e) {
            if (!it.radioValue && "radio" === e && rt.nodeName(t, "input")) {
              var n = t.value;
              return t.setAttribute("type", e), n && (t.value = n), e
            }
          }
        }
      },
      removeAttr: function(t, e) {
        var n, i, o = 0,
          r = e && e.match(At);
        if (r && 1 === t.nodeType)
          for (; n = r[o++];) i = rt.propFix[n] || n, rt.expr.match.bool.test(n) && (t[i] = !1), t.removeAttribute(n)
      }
    }), ce = {
      set: function(t, e, n) {
        return e === !1 ? rt.removeAttr(t, n) : t.setAttribute(n, n), n
      }
    }, rt.each(rt.expr.match.bool.source.match(/\w+/g), function(t, e) {
      var n = le[e] || rt.find.attr;
      le[e] = function(t, e, i) {
        var o, r;
        return i || (r = le[e], le[e] = o, o = null != n(t, e, i) ? e.toLowerCase() : null, le[e] = r), o
      }
    });
    var ue = /^(?:input|select|textarea|button)$/i,
      he = /^(?:a|area)$/i;
    rt.fn.extend({
      prop: function(t, e) {
        return Ct(this, rt.prop, t, e, arguments.length > 1)
      },
      removeProp: function(t) {
        return this.each(function() {
          delete this[rt.propFix[t] || t]
        })
      }
    }), rt.extend({
      prop: function(t, e, n) {
        var i, o, r = t.nodeType;
        if (3 !== r && 8 !== r && 2 !== r) return 1 === r && rt.isXMLDoc(t) || (e = rt.propFix[e] || e, o = rt.propHooks[e]), void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(t, n, e)) ? i : t[e] = n : o && "get" in o && null !== (i = o.get(t, e)) ? i : t[e]
      },
      propHooks: {
        tabIndex: {
          get: function(t) {
            var e = rt.find.attr(t, "tabindex");
            return e ? parseInt(e, 10) : ue.test(t.nodeName) || he.test(t.nodeName) && t.href ? 0 : -1
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    }), it.optSelected || (rt.propHooks.selected = {
      get: function(t) {
        var e = t.parentNode;
        return e && e.parentNode && e.parentNode.selectedIndex, null
      },
      set: function(t) {
        var e = t.parentNode;
        e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex)
      }
    }), rt.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
      rt.propFix[this.toLowerCase()] = this
    });
    var pe = /[\t\r\n\f]/g;
    rt.fn.extend({
      addClass: function(t) {
        var e, n, i, o, r, s, a, c = 0;
        if (rt.isFunction(t)) return this.each(function(e) {
          rt(this).addClass(t.call(this, e, q(this)))
        });
        if ("string" == typeof t && t)
          for (e = t.match(At) || []; n = this[c++];)
            if (o = q(n), i = 1 === n.nodeType && (" " + o + " ").replace(pe, " ")) {
              for (s = 0; r = e[s++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
              a = rt.trim(i), o !== a && n.setAttribute("class", a)
            }
        return this
      },
      removeClass: function(t) {
        var e, n, i, o, r, s, a, c = 0;
        if (rt.isFunction(t)) return this.each(function(e) {
          rt(this).removeClass(t.call(this, e, q(this)))
        });
        if (!arguments.length) return this.attr("class", "");
        if ("string" == typeof t && t)
          for (e = t.match(At) || []; n = this[c++];)
            if (o = q(n), i = 1 === n.nodeType && (" " + o + " ").replace(pe, " ")) {
              for (s = 0; r = e[s++];)
                for (; i.indexOf(" " + r + " ") > -1;) i = i.replace(" " + r + " ", " ");
              a = rt.trim(i), o !== a && n.setAttribute("class", a)
            }
        return this
      },
      toggleClass: function(t, e) {
        var n = typeof t;
        return "boolean" == typeof e && "string" === n ? e ? this.addClass(t) : this.removeClass(t) : rt.isFunction(t) ? this.each(function(n) {
          rt(this).toggleClass(t.call(this, n, q(this), e), e)
        }) : this.each(function() {
          var e, i, o, r;
          if ("string" === n)
            for (i = 0, o = rt(this), r = t.match(At) || []; e = r[i++];) o.hasClass(e) ? o.removeClass(e) : o.addClass(e);
          else void 0 !== t && "boolean" !== n || (e = q(this), e && Tt.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", e || t === !1 ? "" : Tt.get(this, "__className__") || ""))
        })
      },
      hasClass: function(t) {
        var e, n, i = 0;
        for (e = " " + t + " "; n = this[i++];)
          if (1 === n.nodeType && (" " + q(n) + " ").replace(pe, " ").indexOf(e) > -1) return !0;
        return !1
      }
    });
    var de = /\r/g,
      fe = /[\x20\t\r\n\f]+/g;
    rt.fn.extend({
      val: function(t) {
        var e, n, i, o = this[0];
        return arguments.length ? (i = rt.isFunction(t), this.each(function(n) {
          var o;
          1 === this.nodeType && (o = i ? t.call(this, n, rt(this).val()) : t, null == o ? o = "" : "number" == typeof o ? o += "" : rt.isArray(o) && (o = rt.map(o, function(t) {
            return null == t ? "" : t + ""
          })), e = rt.valHooks[this.type] || rt.valHooks[this.nodeName.toLowerCase()], e && "set" in e && void 0 !== e.set(this, o, "value") || (this.value = o))
        })) : o ? (e = rt.valHooks[o.type] || rt.valHooks[o.nodeName.toLowerCase()], e && "get" in e && void 0 !== (n = e.get(o, "value")) ? n : (n = o.value, "string" == typeof n ? n.replace(de, "") : null == n ? "" : n)) : void 0
      }
    }), rt.extend({
      valHooks: {
        option: {
          get: function(t) {
            var e = rt.find.attr(t, "value");
            return null != e ? e : rt.trim(rt.text(t)).replace(fe, " ")
          }
        },
        select: {
          get: function(t) {
            for (var e, n, i = t.options, o = t.selectedIndex, r = "select-one" === t.type || 0 > o, s = r ? null : [], a = r ? o + 1 : i.length, c = 0 > o ? a : r ? o : 0; a > c; c++)
              if (n = i[c], (n.selected || c === o) && (it.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !rt.nodeName(n.parentNode, "optgroup"))) {
                if (e = rt(n).val(), r) return e;
                s.push(e)
              }
            return s
          },
          set: function(t, e) {
            for (var n, i, o = t.options, r = rt.makeArray(e), s = o.length; s--;) i = o[s], (i.selected = rt.inArray(rt.valHooks.option.get(i), r) > -1) && (n = !0);
            return n || (t.selectedIndex = -1), r
          }
        }
      }
    }), rt.each(["radio", "checkbox"], function() {
      rt.valHooks[this] = {
        set: function(t, e) {
          return rt.isArray(e) ? t.checked = rt.inArray(rt(t).val(), e) > -1 : void 0
        }
      }, it.checkOn || (rt.valHooks[this].get = function(t) {
        return null === t.getAttribute("value") ? "on" : t.value
      })
    });
    var ge = /^(?:focusinfocus|focusoutblur)$/;
    rt.extend(rt.event, {
      trigger: function(e, n, i, o) {
        var r, s, a, c, l, u, h, p = [i || Y],
          d = nt.call(e, "type") ? e.type : e,
          f = nt.call(e, "namespace") ? e.namespace.split(".") : [];
        if (s = a = i = i || Y, 3 !== i.nodeType && 8 !== i.nodeType && !ge.test(d + rt.event.triggered) && (d.indexOf(".") > -1 && (f = d.split("."), d = f.shift(), f.sort()), l = d.indexOf(":") < 0 && "on" + d, e = e[rt.expando] ? e : new rt.Event(d, "object" == typeof e && e), e.isTrigger = o ? 2 : 3, e.namespace = f.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = i), n = null == n ? [e] : rt.makeArray(n, [e]), h = rt.event.special[d] || {}, o || !h.trigger || h.trigger.apply(i, n) !== !1)) {
          if (!o && !h.noBubble && !rt.isWindow(i)) {
            for (c = h.delegateType || d, ge.test(c + d) || (s = s.parentNode); s; s = s.parentNode) p.push(s), a = s;
            a === (i.ownerDocument || Y) && p.push(a.defaultView || a.parentWindow || t)
          }
          for (r = 0;
            (s = p[r++]) && !e.isPropagationStopped();) e.type = r > 1 ? c : h.bindType || d, u = (Tt.get(s, "events") || {})[e.type] && Tt.get(s, "handle"), u && u.apply(s, n), u = l && s[l], u && u.apply && kt(s) && (e.result = u.apply(s, n), e.result === !1 && e.preventDefault());
          return e.type = d, o || e.isDefaultPrevented() || h._default && h._default.apply(p.pop(), n) !== !1 || !kt(i) || l && rt.isFunction(i[d]) && !rt.isWindow(i) && (a = i[l], a && (i[l] = null), rt.event.triggered = d, i[d](), rt.event.triggered = void 0, a && (i[l] = a)), e.result
        }
      },
      simulate: function(t, e, n) {
        var i = rt.extend(new rt.Event, n, {
          type: t,
          isSimulated: !0
        });
        rt.event.trigger(i, null, e)
      }
    }), rt.fn.extend({
      trigger: function(t, e) {
        return this.each(function() {
          rt.event.trigger(t, e, this)
        })
      },
      triggerHandler: function(t, e) {
        var n = this[0];
        return n ? rt.event.trigger(t, e, n, !0) : void 0
      }
    }), rt.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(t, e) {
      rt.fn[e] = function(t, n) {
        return arguments.length > 0 ? this.on(e, null, t, n) : this.trigger(e)
      }
    }), rt.fn.extend({
      hover: function(t, e) {
        return this.mouseenter(t).mouseleave(e || t)
      }
    }), it.focusin = "onfocusin" in t, it.focusin || rt.each({
      focus: "focusin",
      blur: "focusout"
    }, function(t, e) {
      var n = function(t) {
        rt.event.simulate(e, t.target, rt.event.fix(t))
      };
      rt.event.special[e] = {
        setup: function() {
          var i = this.ownerDocument || this,
            o = Tt.access(i, e);
          o || i.addEventListener(t, n, !0), Tt.access(i, e, (o || 0) + 1)
        },
        teardown: function() {
          var i = this.ownerDocument || this,
            o = Tt.access(i, e) - 1;
          o ? Tt.access(i, e, o) : (i.removeEventListener(t, n, !0), Tt.remove(i, e))
        }
      }
    });
    var me = t.location,
      ye = rt.now(),
      ve = /\?/;
    rt.parseJSON = function(t) {
      return JSON.parse(t + "")
    }, rt.parseXML = function(e) {
      var n;
      if (!e || "string" != typeof e) return null;
      try {
        n = (new t.DOMParser).parseFromString(e, "text/xml")
      } catch (t) {
        n = void 0
      }
      return n && !n.getElementsByTagName("parsererror").length || rt.error("Invalid XML: " + e), n
    };
    var be = /#.*$/,
      we = /([?&])_=[^&]*/,
      Ae = /^(.*?):[ \t]*([^\r\n]*)$/gm,
      xe = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      Ce = /^(?:GET|HEAD)$/,
      ke = /^\/\//,
      Te = {},
      Ee = {},
      Se = "*/".concat("*"),
      _e = Y.createElement("a");
    _e.href = me.href, rt.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: me.href,
        type: "GET",
        isLocal: xe.test(me.protocol),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": Se,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript"
        },
        contents: {
          xml: /\bxml\b/,
          html: /\bhtml/,
          json: /\bjson\b/
        },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON"
        },
        converters: {
          "* text": String,
          "text html": !0,
          "text json": rt.parseJSON,
          "text xml": rt.parseXML
        },
        flatOptions: {
          url: !0,
          context: !0
        }
      },
      ajaxSetup: function(t, e) {
        return e ? U(U(t, rt.ajaxSettings), e) : U(rt.ajaxSettings, t)
      },
      ajaxPrefilter: L(Te),
      ajaxTransport: L(Ee),
      ajax: function(e, n) {
        function i(e, n, i, a) {
          var l, h, v, b, A, C = n;
          2 !== w && (w = 2, c && t.clearTimeout(c), o = void 0, s = a || "", x.readyState = e > 0 ? 4 : 0, l = e >= 200 && 300 > e || 304 === e, i && (b = H(p, x, i)), b = W(p, b, x, l), l ? (p.ifModified && (A = x.getResponseHeader("Last-Modified"), A && (rt.lastModified[r] = A), A = x.getResponseHeader("etag"), A && (rt.etag[r] = A)), 204 === e || "HEAD" === p.type ? C = "nocontent" : 304 === e ? C = "notmodified" : (C = b.state, h = b.data, v = b.error, l = !v)) : (v = C, !e && C || (C = "error", 0 > e && (e = 0))), x.status = e, x.statusText = (n || C) + "", l ? g.resolveWith(d, [h, C, x]) : g.rejectWith(d, [x, C, v]), x.statusCode(y), y = void 0, u && f.trigger(l ? "ajaxSuccess" : "ajaxError", [x, p, l ? h : v]), m.fireWith(d, [x, C]), u && (f.trigger("ajaxComplete", [x, p]), --rt.active || rt.event.trigger("ajaxStop")))
        }
        "object" == typeof e && (n = e, e = void 0), n = n || {};
        var o, r, s, a, c, l, u, h, p = rt.ajaxSetup({}, n),
          d = p.context || p,
          f = p.context && (d.nodeType || d.jquery) ? rt(d) : rt.event,
          g = rt.Deferred(),
          m = rt.Callbacks("once memory"),
          y = p.statusCode || {},
          v = {},
          b = {},
          w = 0,
          A = "canceled",
          x = {
            readyState: 0,
            getResponseHeader: function(t) {
              var e;
              if (2 === w) {
                if (!a)
                  for (a = {}; e = Ae.exec(s);) a[e[1].toLowerCase()] = e[2];
                e = a[t.toLowerCase()]
              }
              return null == e ? null : e
            },
            getAllResponseHeaders: function() {
              return 2 === w ? s : null
            },
            setRequestHeader: function(t, e) {
              var n = t.toLowerCase();
              return w || (t = b[n] = b[n] || t, v[t] = e), this
            },
            overrideMimeType: function(t) {
              return w || (p.mimeType = t), this
            },
            statusCode: function(t) {
              var e;
              if (t)
                if (2 > w)
                  for (e in t) y[e] = [y[e], t[e]];
                else x.always(t[x.status]);
              return this
            },
            abort: function(t) {
              var e = t || A;
              return o && o.abort(e), i(0, e), this
            }
          };
        if (g.promise(x).complete = m.add, x.success = x.done, x.error = x.fail, p.url = ((e || p.url || me.href) + "").replace(be, "").replace(ke, me.protocol + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = rt.trim(p.dataType || "*").toLowerCase().match(At) || [""], null == p.crossDomain) {
          l = Y.createElement("a");
          try {
            l.href = p.url, l.href = l.href, p.crossDomain = _e.protocol + "//" + _e.host != l.protocol + "//" + l.host
          } catch (t) {
            p.crossDomain = !0
          }
        }
        if (p.data && p.processData && "string" != typeof p.data && (p.data = rt.param(p.data, p.traditional)), F(Te, p, n, x), 2 === w) return x;
        u = rt.event && p.global, u && 0 === rt.active++ && rt.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Ce.test(p.type), r = p.url, p.hasContent || (p.data && (r = p.url += (ve.test(r) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = we.test(r) ? r.replace(we, "$1_=" + ye++) : r + (ve.test(r) ? "&" : "?") + "_=" + ye++)), p.ifModified && (rt.lastModified[r] && x.setRequestHeader("If-Modified-Since", rt.lastModified[r]), rt.etag[r] && x.setRequestHeader("If-None-Match", rt.etag[r])), (p.data && p.hasContent && p.contentType !== !1 || n.contentType) && x.setRequestHeader("Content-Type", p.contentType), x.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Se + "; q=0.01" : "") : p.accepts["*"]);
        for (h in p.headers) x.setRequestHeader(h, p.headers[h]);
        if (p.beforeSend && (p.beforeSend.call(d, x, p) === !1 || 2 === w)) return x.abort();
        A = "abort";
        for (h in {
            success: 1,
            error: 1,
            complete: 1
          }) x[h](p[h]);
        if (o = F(Ee, p, n, x)) {
          if (x.readyState = 1, u && f.trigger("ajaxSend", [x, p]), 2 === w) return x;
          p.async && p.timeout > 0 && (c = t.setTimeout(function() {
            x.abort("timeout")
          }, p.timeout));
          try {
            w = 1, o.send(v, i)
          } catch (t) {
            if (!(2 > w)) throw t;
            i(-1, t)
          }
        } else i(-1, "No Transport");
        return x
      },
      getJSON: function(t, e, n) {
        return rt.get(t, e, n, "json")
      },
      getScript: function(t, e) {
        return rt.get(t, void 0, e, "script")
      }
    }), rt.each(["get", "post"], function(t, e) {
      rt[e] = function(t, n, i, o) {
        return rt.isFunction(n) && (o = o || i, i = n, n = void 0), rt.ajax(rt.extend({
          url: t,
          type: e,
          dataType: o,
          data: n,
          success: i
        }, rt.isPlainObject(t) && t))
      }
    }), rt._evalUrl = function(t) {
      return rt.ajax({
        url: t,
        type: "GET",
        dataType: "script",
        async: !1,
        global: !1,
        throws: !0
      })
    }, rt.fn.extend({
      wrapAll: function(t) {
        var e;
        return rt.isFunction(t) ? this.each(function(e) {
          rt(this).wrapAll(t.call(this, e))
        }) : (this[0] && (e = rt(t, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
          for (var t = this; t.firstElementChild;) t = t.firstElementChild;
          return t
        }).append(this)), this)
      },
      wrapInner: function(t) {
        return rt.isFunction(t) ? this.each(function(e) {
          rt(this).wrapInner(t.call(this, e))
        }) : this.each(function() {
          var e = rt(this),
            n = e.contents();
          n.length ? n.wrapAll(t) : e.append(t)
        })
      },
      wrap: function(t) {
        var e = rt.isFunction(t);
        return this.each(function(n) {
          rt(this).wrapAll(e ? t.call(this, n) : t)
        })
      },
      unwrap: function() {
        return this.parent().each(function() {
          rt.nodeName(this, "body") || rt(this).replaceWith(this.childNodes)
        }).end()
      }
    }), rt.expr.filters.hidden = function(t) {
      return !rt.expr.filters.visible(t)
    }, rt.expr.filters.visible = function(t) {
      return t.offsetWidth > 0 || t.offsetHeight > 0 || t.getClientRects().length > 0
    };
    var $e = /%20/g,
      De = /\[\]$/,
      Ne = /\r?\n/g,
      je = /^(?:submit|button|image|reset|file)$/i,
      Ie = /^(?:input|select|textarea|keygen)/i;
    rt.param = function(t, e) {
      var n, i = [],
        o = function(t, e) {
          e = rt.isFunction(e) ? e() : null == e ? "" : e, i[i.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
        };
      if (void 0 === e && (e = rt.ajaxSettings && rt.ajaxSettings.traditional), rt.isArray(t) || t.jquery && !rt.isPlainObject(t)) rt.each(t, function() {
        o(this.name, this.value)
      });
      else
        for (n in t) z(n, t[n], e, o);
      return i.join("&").replace($e, "+")
    }, rt.fn.extend({
      serialize: function() {
        return rt.param(this.serializeArray())
      },
      serializeArray: function() {
        return this.map(function() {
          var t = rt.prop(this, "elements");
          return t ? rt.makeArray(t) : this
        }).filter(function() {
          var t = this.type;
          return this.name && !rt(this).is(":disabled") && Ie.test(this.nodeName) && !je.test(t) && (this.checked || !It.test(t))
        }).map(function(t, e) {
          var n = rt(this).val();
          return null == n ? null : rt.isArray(n) ? rt.map(n, function(t) {
            return {
              name: e.name,
              value: t.replace(Ne, "\r\n")
            }
          }) : {
            name: e.name,
            value: n.replace(Ne, "\r\n")
          }
        }).get()
      }
    }), rt.ajaxSettings.xhr = function() {
      try {
        return new t.XMLHttpRequest
      } catch (t) {}
    };
    var Be = {
        0: 200,
        1223: 204
      },
      Re = rt.ajaxSettings.xhr();
    it.cors = !!Re && "withCredentials" in Re, it.ajax = Re = !!Re, rt.ajaxTransport(function(e) {
      var n, i;
      return it.cors || Re && !e.crossDomain ? {
        send: function(o, r) {
          var s, a = e.xhr();
          if (a.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
            for (s in e.xhrFields) a[s] = e.xhrFields[s];
          e.mimeType && a.overrideMimeType && a.overrideMimeType(e.mimeType), e.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest");
          for (s in o) a.setRequestHeader(s, o[s]);
          n = function(t) {
            return function() {
              n && (n = i = a.onload = a.onerror = a.onabort = a.onreadystatechange = null, "abort" === t ? a.abort() : "error" === t ? "number" != typeof a.status ? r(0, "error") : r(a.status, a.statusText) : r(Be[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
                binary: a.response
              } : {
                text: a.responseText
              }, a.getAllResponseHeaders()))
            }
          }, a.onload = n(), i = a.onerror = n("error"), void 0 !== a.onabort ? a.onabort = i : a.onreadystatechange = function() {
            4 === a.readyState && t.setTimeout(function() {
              n && i()
            })
          }, n = n("abort");
          try {
            a.send(e.hasContent && e.data || null)
          } catch (t) {
            if (n) throw t
          }
        },
        abort: function() {
          n && n()
        }
      } : void 0
    }), rt.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /\b(?:java|ecma)script\b/
      },
      converters: {
        "text script": function(t) {
          return rt.globalEval(t), t
        }
      }
    }), rt.ajaxPrefilter("script", function(t) {
      void 0 === t.cache && (t.cache = !1), t.crossDomain && (t.type = "GET")
    }), rt.ajaxTransport("script", function(t) {
      if (t.crossDomain) {
        var e, n;
        return {
          send: function(i, o) {
            e = rt("<script>").prop({
              charset: t.scriptCharset,
              src: t.url
            }).on("load error", n = function(t) {
              e.remove(), n = null, t && o("error" === t.type ? 404 : 200, t.type)
            }), Y.head.appendChild(e[0])
          },
          abort: function() {
            n && n()
          }
        }
      }
    });
    var Oe = [],
      Pe = /(=)\?(?=&|$)|\?\?/;
    rt.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var t = Oe.pop() || rt.expando + "_" + ye++;
        return this[t] = !0, t
      }
    }), rt.ajaxPrefilter("json jsonp", function(e, n, i) {
      var o, r, s, a = e.jsonp !== !1 && (Pe.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Pe.test(e.data) && "data");
      return a || "jsonp" === e.dataTypes[0] ? (o = e.jsonpCallback = rt.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(Pe, "$1" + o) : e.jsonp !== !1 && (e.url += (ve.test(e.url) ? "&" : "?") + e.jsonp + "=" + o), e.converters["script json"] = function() {
        return s || rt.error(o + " was not called"), s[0]
      }, e.dataTypes[0] = "json", r = t[o], t[o] = function() {
        s = arguments
      }, i.always(function() {
        void 0 === r ? rt(t).removeProp(o) : t[o] = r, e[o] && (e.jsonpCallback = n.jsonpCallback, Oe.push(o)), s && rt.isFunction(r) && r(s[0]), s = r = void 0
      }), "script") : void 0
    }), rt.parseHTML = function(t, e, n) {
      if (!t || "string" != typeof t) return null;
      "boolean" == typeof e && (n = e, e = !1), e = e || Y;
      var i = ft.exec(t),
        o = !n && [];
      return i ? [e.createElement(i[1])] : (i = p([t], e, o), o && o.length && rt(o).remove(), rt.merge([], i.childNodes))
    };
    var Me = rt.fn.load;
    rt.fn.load = function(t, e, n) {
      if ("string" != typeof t && Me) return Me.apply(this, arguments);
      var i, o, r, s = this,
        a = t.indexOf(" ");
      return a > -1 && (i = rt.trim(t.slice(a)), t = t.slice(0, a)), rt.isFunction(e) ? (n = e, e = void 0) : e && "object" == typeof e && (o = "POST"), s.length > 0 && rt.ajax({
        url: t,
        type: o || "GET",
        dataType: "html",
        data: e
      }).done(function(t) {
        r = arguments, s.html(i ? rt("<div>").append(rt.parseHTML(t)).find(i) : t)
      }).always(n && function(t, e) {
        s.each(function() {
          n.apply(this, r || [t.responseText, e, t])
        })
      }), this
    }, rt.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
      rt.fn[e] = function(t) {
        return this.on(e, t)
      }
    }), rt.expr.filters.animated = function(t) {
      return rt.grep(rt.timers, function(e) {
        return t === e.elem
      }).length
    }, rt.offset = {
      setOffset: function(t, e, n) {
        var i, o, r, s, a, c, l, u = rt.css(t, "position"),
          h = rt(t),
          p = {};
        "static" === u && (t.style.position = "relative"), a = h.offset(), r = rt.css(t, "top"), c = rt.css(t, "left"), l = ("absolute" === u || "fixed" === u) && (r + c).indexOf("auto") > -1, l ? (i = h.position(), s = i.top, o = i.left) : (s = parseFloat(r) || 0, o = parseFloat(c) || 0), rt.isFunction(e) && (e = e.call(t, n, rt.extend({}, a))), null != e.top && (p.top = e.top - a.top + s), null != e.left && (p.left = e.left - a.left + o), "using" in e ? e.using.call(t, p) : h.css(p)
      }
    }, rt.fn.extend({
      offset: function(t) {
        if (arguments.length) return void 0 === t ? this : this.each(function(e) {
          rt.offset.setOffset(this, t, e)
        });
        var e, n, i = this[0],
          o = {
            top: 0,
            left: 0
          },
          r = i && i.ownerDocument;
        return r ? (e = r.documentElement, rt.contains(e, i) ? (o = i.getBoundingClientRect(), n = Q(r), {
          top: o.top + n.pageYOffset - e.clientTop,
          left: o.left + n.pageXOffset - e.clientLeft
        }) : o) : void 0
      },
      position: function() {
        if (this[0]) {
          var t, e, n = this[0],
            i = {
              top: 0,
              left: 0
            };
          return "fixed" === rt.css(n, "position") ? e = n.getBoundingClientRect() : (t = this.offsetParent(), e = this.offset(), rt.nodeName(t[0], "html") || (i = t.offset()), i.top += rt.css(t[0], "borderTopWidth", !0), i.left += rt.css(t[0], "borderLeftWidth", !0)), {
            top: e.top - i.top - rt.css(n, "marginTop", !0),
            left: e.left - i.left - rt.css(n, "marginLeft", !0)
          }
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (var t = this.offsetParent; t && "static" === rt.css(t, "position");) t = t.offsetParent;
          return t || Gt
        })
      }
    }), rt.each({
      scrollLeft: "pageXOffset",
      scrollTop: "pageYOffset"
    }, function(t, e) {
      var n = "pageYOffset" === e;
      rt.fn[t] = function(i) {
        return Ct(this, function(t, i, o) {
          var r = Q(t);
          return void 0 === o ? r ? r[e] : t[i] : void(r ? r.scrollTo(n ? r.pageXOffset : o, n ? o : r.pageYOffset) : t[i] = o)
        }, t, i, arguments.length)
      }
    }), rt.each(["top", "left"], function(t, e) {
      rt.cssHooks[e] = S(it.pixelPosition, function(t, n) {
        return n ? (n = E(t, e), Yt.test(n) ? rt(t).position()[e] + "px" : n) : void 0
      })
    }), rt.each({
      Height: "height",
      Width: "width"
    }, function(t, e) {
      rt.each({
        padding: "inner" + t,
        content: e,
        "": "outer" + t
      }, function(n, i) {
        rt.fn[i] = function(i, o) {
          var r = arguments.length && (n || "boolean" != typeof i),
            s = n || (i === !0 || o === !0 ? "margin" : "border");
          return Ct(this, function(e, n, i) {
            var o;
            return rt.isWindow(e) ? e.document.documentElement["client" + t] : 9 === e.nodeType ? (o = e.documentElement, Math.max(e.body["scroll" + t], o["scroll" + t], e.body["offset" + t], o["offset" + t], o["client" + t])) : void 0 === i ? rt.css(e, n, s) : rt.style(e, n, i, s)
          }, e, r ? i : void 0, r, null)
        }
      })
    }), rt.fn.extend({
      bind: function(t, e, n) {
        return this.on(t, null, e, n)
      },
      unbind: function(t, e) {
        return this.off(t, null, e)
      },
      delegate: function(t, e, n, i) {
        return this.on(e, t, n, i)
      },
      undelegate: function(t, e, n) {
        return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", n)
      },
      size: function() {
        return this.length
      }
    }), rt.fn.andSelf = rt.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
      return rt
    });
    var Ve = t.jQuery,
      qe = t.$;
    return rt.noConflict = function(e) {
      return t.$ === rt && (t.$ = qe), e && t.jQuery === rt && (t.jQuery = Ve), rt
    }, e || (t.jQuery = t.$ = rt), rt
  }), "undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery");
if (+ function(t) {
    "use strict";
    var e = t.fn.jquery.split(" ")[0].split(".");
    if (e[0] < 2 && e[1] < 9 || 1 == e[0] && 9 == e[1] && e[2] < 1 || e[0] > 3) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")
  }(jQuery), + function(t) {
    "use strict";

    function e(e) {
      return this.each(function() {
        var n = t(this),
          o = n.data("bs.alert");
        o || n.data("bs.alert", o = new i(this)), "string" == typeof e && o[e].call(n)
      })
    }
    var n = '[data-dismiss="alert"]',
      i = function(e) {
        t(e).on("click", n, this.close)
      };
    i.VERSION = "3.3.7", i.TRANSITION_DURATION = 150, i.prototype.close = function(e) {
      function n() {
        s.detach().trigger("closed.bs.alert").remove()
      }
      var o = t(this),
        r = o.attr("data-target");
      r || (r = o.attr("href"), r = r && r.replace(/.*(?=#[^\s]*$)/, ""));
      var s = t("#" === r ? [] : r);
      e && e.preventDefault(), s.length || (s = o.closest(".alert")), s.trigger(e = t.Event("close.bs.alert")), e.isDefaultPrevented() || (s.removeClass("in"), t.support.transition && s.hasClass("fade") ? s.one("bsTransitionEnd", n).emulateTransitionEnd(i.TRANSITION_DURATION) : n())
    };
    var o = t.fn.alert;
    t.fn.alert = e, t.fn.alert.Constructor = i, t.fn.alert.noConflict = function() {
      return t.fn.alert = o, this
    }, t(document).on("click.bs.alert.data-api", n, i.prototype.close)
  }(jQuery), + function(t) {
    "use strict";

    function e(e) {
      return this.each(function() {
        var i = t(this),
          o = i.data("bs.button"),
          r = "object" == typeof e && e;
        o || i.data("bs.button", o = new n(this, r)), "toggle" == e ? o.toggle() : e && o.setState(e)
      })
    }
    var n = function(e, i) {
      this.$element = t(e), this.options = t.extend({}, n.DEFAULTS, i), this.isLoading = !1
    };
    n.VERSION = "3.3.7", n.DEFAULTS = {
      loadingText: "loading..."
    }, n.prototype.setState = function(e) {
      var n = "disabled",
        i = this.$element,
        o = i.is("input") ? "val" : "html",
        r = i.data();
      e += "Text", null == r.resetText && i.data("resetText", i[o]()), setTimeout(t.proxy(function() {
        i[o](null == r[e] ? this.options[e] : r[e]), "loadingText" == e ? (this.isLoading = !0, i.addClass(n).attr(n, n).prop(n, !0)) : this.isLoading && (this.isLoading = !1, i.removeClass(n).removeAttr(n).prop(n, !1))
      }, this), 0)
    }, n.prototype.toggle = function() {
      var t = !0,
        e = this.$element.closest('[data-toggle="buttons"]');
      if (e.length) {
        var n = this.$element.find("input");
        "radio" == n.prop("type") ? (n.prop("checked") && (t = !1), e.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == n.prop("type") && (n.prop("checked") !== this.$element.hasClass("active") && (t = !1), this.$element.toggleClass("active")), n.prop("checked", this.$element.hasClass("active")), t && n.trigger("change")
      } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
    };
    var i = t.fn.button;
    t.fn.button = e, t.fn.button.Constructor = n, t.fn.button.noConflict = function() {
      return t.fn.button = i, this
    }, t(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(n) {
      var i = t(n.target).closest(".btn");
      e.call(i, "toggle"), t(n.target).is('input[type="radio"], input[type="checkbox"]') || (n.preventDefault(), i.is("input,button") ? i.trigger("focus") : i.find("input:visible,button:visible").first().trigger("focus"))
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(e) {
      t(e.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(e.type))
    })
  }(jQuery), + function(t) {
    "use strict";

    function e(e) {
      var n = e.attr("data-target");
      n || (n = e.attr("href"), n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, ""));
      var i = n && t(n);
      return i && i.length ? i : e.parent()
    }

    function n(n) {
      n && 3 === n.which || (t(o).remove(), t(r).each(function() {
        var i = t(this),
          o = e(i),
          r = {
            relatedTarget: this
          };
        o.hasClass("open") && (n && "click" == n.type && /input|textarea/i.test(n.target.tagName) && t.contains(o[0], n.target) || (o.trigger(n = t.Event("hide.bs.dropdown", r)), n.isDefaultPrevented() || (i.attr("aria-expanded", "false"), o.removeClass("open").trigger(t.Event("hidden.bs.dropdown", r)))))
      }))
    }

    function i(e) {
      return this.each(function() {
        var n = t(this),
          i = n.data("bs.dropdown");
        i || n.data("bs.dropdown", i = new s(this)), "string" == typeof e && i[e].call(n)
      })
    }
    var o = ".dropdown-backdrop",
      r = '[data-toggle="dropdown"]',
      s = function(e) {
        t(e).on("click.bs.dropdown", this.toggle)
      };
    s.VERSION = "3.3.7", s.prototype.toggle = function(i) {
      var o = t(this);
      if (!o.is(".disabled, :disabled")) {
        var r = e(o),
          s = r.hasClass("open");
        if (n(), !s) {
          "ontouchstart" in document.documentElement && !r.closest(".navbar-nav").length && t(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(t(this)).on("click", n);
          var a = {
            relatedTarget: this
          };
          if (r.trigger(i = t.Event("show.bs.dropdown", a)), i.isDefaultPrevented()) return;
          o.trigger("focus").attr("aria-expanded", "true"), r.toggleClass("open").trigger(t.Event("shown.bs.dropdown", a))
        }
        return !1
      }
    }, s.prototype.keydown = function(n) {
      if (/(38|40|27|32)/.test(n.which) && !/input|textarea/i.test(n.target.tagName)) {
        var i = t(this);
        if (n.preventDefault(), n.stopPropagation(), !i.is(".disabled, :disabled")) {
          var o = e(i),
            s = o.hasClass("open");
          if (!s && 27 != n.which || s && 27 == n.which) return 27 == n.which && o.find(r).trigger("focus"), i.trigger("click");
          var a = " li:not(.disabled):visible a",
            c = o.find(".dropdown-menu" + a);
          if (c.length) {
            var l = c.index(n.target);
            38 == n.which && l > 0 && l--, 40 == n.which && l < c.length - 1 && l++, ~l || (l = 0), c.eq(l).trigger("focus")
          }
        }
      }
    };
    var a = t.fn.dropdown;
    t.fn.dropdown = i, t.fn.dropdown.Constructor = s, t.fn.dropdown.noConflict = function() {
      return t.fn.dropdown = a, this
    }, t(document).on("click.bs.dropdown.data-api", n).on("click.bs.dropdown.data-api", ".dropdown form", function(t) {
      t.stopPropagation()
    }).on("click.bs.dropdown.data-api", r, s.prototype.toggle).on("keydown.bs.dropdown.data-api", r, s.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", s.prototype.keydown)
  }(jQuery), + function(t) {
    "use strict";

    function e(e, i) {
      return this.each(function() {
        var o = t(this),
          r = o.data("bs.modal"),
          s = t.extend({}, n.DEFAULTS, o.data(), "object" == typeof e && e);
        r || o.data("bs.modal", r = new n(this, s)), "string" == typeof e ? r[e](i) : s.show && r.show(i)
      })
    }
    var n = function(e, n) {
      this.options = n, this.$body = t(document.body), this.$element = t(e), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, t.proxy(function() {
        this.$element.trigger("loaded.bs.modal")
      }, this))
    };
    n.VERSION = "3.3.7", n.TRANSITION_DURATION = 300, n.BACKDROP_TRANSITION_DURATION = 150, n.DEFAULTS = {
      backdrop: !0,
      keyboard: !0,
      show: !0
    }, n.prototype.toggle = function(t) {
      return this.isShown ? this.hide() : this.show(t)
    }, n.prototype.show = function(e) {
      var i = this,
        o = t.Event("show.bs.modal", {
          relatedTarget: e
        });
      this.$element.trigger(o), this.isShown || o.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', t.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
        i.$element.one("mouseup.dismiss.bs.modal", function(e) {
          t(e.target).is(i.$element) && (i.ignoreBackdropClick = !0)
        })
      }), this.backdrop(function() {
        var o = t.support.transition && i.$element.hasClass("fade");
        i.$element.parent().length || i.$element.appendTo(i.$body), i.$element.show().scrollTop(0), i.adjustDialog(), o && i.$element[0].offsetWidth, i.$element.addClass("in"), i.enforceFocus();
        var r = t.Event("shown.bs.modal", {
          relatedTarget: e
        });
        o ? i.$dialog.one("bsTransitionEnd", function() {
          i.$element.trigger("focus").trigger(r)
        }).emulateTransitionEnd(n.TRANSITION_DURATION) : i.$element.trigger("focus").trigger(r)
      }))
    }, n.prototype.hide = function(e) {
      e && e.preventDefault(), e = t.Event("hide.bs.modal"), this.$element.trigger(e), this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), t(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), t.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(n.TRANSITION_DURATION) : this.hideModal())
    }, n.prototype.enforceFocus = function() {
      t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function(t) {
        document === t.target || this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus")
      }, this))
    }, n.prototype.escape = function() {
      this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", t.proxy(function(t) {
        27 == t.which && this.hide()
      }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, n.prototype.resize = function() {
      this.isShown ? t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this)) : t(window).off("resize.bs.modal")
    }, n.prototype.hideModal = function() {
      var t = this;
      this.$element.hide(), this.backdrop(function() {
        t.$body.removeClass("modal-open"), t.resetAdjustments(), t.resetScrollbar(), t.$element.trigger("hidden.bs.modal")
      })
    }, n.prototype.removeBackdrop = function() {
      this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, n.prototype.backdrop = function(e) {
      var i = this,
        o = this.$element.hasClass("fade") ? "fade" : "";
      if (this.isShown && this.options.backdrop) {
        var r = t.support.transition && o;
        if (this.$backdrop = t(document.createElement("div")).addClass("modal-backdrop " + o).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", t.proxy(function(t) {
            return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
          }, this)), r && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !e) return;
        r ? this.$backdrop.one("bsTransitionEnd", e).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION) : e()
      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass("in");
        var s = function() {
          i.removeBackdrop(), e && e()
        };
        t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", s).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION) : s()
      } else e && e()
    }, n.prototype.handleUpdate = function() {
      this.adjustDialog()
    }, n.prototype.adjustDialog = function() {
      var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
      this.$element.css({
        paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
        paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
      })
    }, n.prototype.resetAdjustments = function() {
      this.$element.css({
        paddingLeft: "",
        paddingRight: ""
      })
    }, n.prototype.checkScrollbar = function() {
      var t = window.innerWidth;
      if (!t) {
        var e = document.documentElement.getBoundingClientRect();
        t = e.right - Math.abs(e.left)
      }
      this.bodyIsOverflowing = document.body.clientWidth < t, this.scrollbarWidth = this.measureScrollbar()
    }, n.prototype.setScrollbar = function() {
      var t = parseInt(this.$body.css("padding-right") || 0, 10);
      this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", t + this.scrollbarWidth)
    }, n.prototype.resetScrollbar = function() {
      this.$body.css("padding-right", this.originalBodyPad)
    }, n.prototype.measureScrollbar = function() {
      var t = document.createElement("div");
      t.className = "modal-scrollbar-measure", this.$body.append(t);
      var e = t.offsetWidth - t.clientWidth;
      return this.$body[0].removeChild(t), e
    };
    var i = t.fn.modal;
    t.fn.modal = e, t.fn.modal.Constructor = n, t.fn.modal.noConflict = function() {
      return t.fn.modal = i, this
    }, t(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(n) {
      var i = t(this),
        o = i.attr("href"),
        r = t(i.attr("data-target") || o && o.replace(/.*(?=#[^\s]+$)/, "")),
        s = r.data("bs.modal") ? "toggle" : t.extend({
          remote: !/#/.test(o) && o
        }, r.data(), i.data());
      i.is("a") && n.preventDefault(), r.one("show.bs.modal", function(t) {
        t.isDefaultPrevented() || r.one("hidden.bs.modal", function() {
          i.is(":visible") && i.trigger("focus")
        })
      }), e.call(r, s, this)
    })
  }(jQuery), + function(t) {
    "use strict";

    function e(e) {
      return this.each(function() {
        var i = t(this),
          o = i.data("bs.tooltip"),
          r = "object" == typeof e && e;
        !o && /destroy|hide/.test(e) || (o || i.data("bs.tooltip", o = new n(this, r)), "string" == typeof e && o[e]())
      })
    }
    var n = function(t, e) {
      this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", t, e)
    };
    n.VERSION = "3.3.7", n.TRANSITION_DURATION = 150, n.DEFAULTS = {
      animation: !0,
      placement: "top",
      selector: !1,
      template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      trigger: "hover focus",
      title: "",
      delay: 0,
      html: !1,
      container: !1,
      viewport: {
        selector: "body",
        padding: 0
      }
    }, n.prototype.init = function(e, n, i) {
      if (this.enabled = !0, this.type = e, this.$element = t(n), this.options = this.getOptions(i), this.$viewport = this.options.viewport && t(t.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
          click: !1,
          hover: !1,
          focus: !1
        }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
      for (var o = this.options.trigger.split(" "), r = o.length; r--;) {
        var s = o[r];
        if ("click" == s) this.$element.on("click." + this.type, this.options.selector, t.proxy(this.toggle, this));
        else if ("manual" != s) {
          var a = "hover" == s ? "mouseenter" : "focusin",
            c = "hover" == s ? "mouseleave" : "focusout";
          this.$element.on(a + "." + this.type, this.options.selector, t.proxy(this.enter, this)), this.$element.on(c + "." + this.type, this.options.selector, t.proxy(this.leave, this))
        }
      }
      this.options.selector ? this._options = t.extend({}, this.options, {
        trigger: "manual",
        selector: ""
      }) : this.fixTitle()
    }, n.prototype.getDefaults = function() {
      return n.DEFAULTS
    }, n.prototype.getOptions = function(e) {
      return e = t.extend({}, this.getDefaults(), this.$element.data(), e), e.delay && "number" == typeof e.delay && (e.delay = {
        show: e.delay,
        hide: e.delay
      }), e
    }, n.prototype.getDelegateOptions = function() {
      var e = {},
        n = this.getDefaults();
      return this._options && t.each(this._options, function(t, i) {
        n[t] != i && (e[t] = i)
      }), e
    }, n.prototype.enter = function(e) {
      var n = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
      return n || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n)), e instanceof t.Event && (n.inState["focusin" == e.type ? "focus" : "hover"] = !0), n.tip().hasClass("in") || "in" == n.hoverState ? void(n.hoverState = "in") : (clearTimeout(n.timeout), n.hoverState = "in", n.options.delay && n.options.delay.show ? void(n.timeout = setTimeout(function() {
        "in" == n.hoverState && n.show()
      }, n.options.delay.show)) : n.show())
    }, n.prototype.isInStateTrue = function() {
      for (var t in this.inState)
        if (this.inState[t]) return !0;
      return !1
    }, n.prototype.leave = function(e) {
      var n = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
      return n || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n)), e instanceof t.Event && (n.inState["focusout" == e.type ? "focus" : "hover"] = !1), n.isInStateTrue() ? void 0 : (clearTimeout(n.timeout), n.hoverState = "out", n.options.delay && n.options.delay.hide ? void(n.timeout = setTimeout(function() {
        "out" == n.hoverState && n.hide()
      }, n.options.delay.hide)) : n.hide())
    }, n.prototype.show = function() {
      var e = t.Event("show.bs." + this.type);
      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e);
        var i = t.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
        if (e.isDefaultPrevented() || !i) return;
        var o = this,
          r = this.tip(),
          s = this.getUID(this.type);
        this.setContent(), r.attr("id", s), this.$element.attr("aria-describedby", s), this.options.animation && r.addClass("fade");
        var a = "function" == typeof this.options.placement ? this.options.placement.call(this, r[0], this.$element[0]) : this.options.placement,
          c = /\s?auto?\s?/i,
          l = c.test(a);
        l && (a = a.replace(c, "") || "top"), r.detach().css({
          top: 0,
          left: 0,
          display: "block"
        }).addClass(a).data("bs." + this.type, this), this.options.container ? r.appendTo(this.options.container) : r.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
        var u = this.getPosition(),
          h = r[0].offsetWidth,
          p = r[0].offsetHeight;
        if (l) {
          var d = a,
            f = this.getPosition(this.$viewport);
          a = "bottom" == a && u.bottom + p > f.bottom ? "top" : "top" == a && u.top - p < f.top ? "bottom" : "right" == a && u.right + h > f.width ? "left" : "left" == a && u.left - h < f.left ? "right" : a, r.removeClass(d).addClass(a)
        }
        var g = this.getCalculatedOffset(a, u, h, p);
        this.applyPlacement(g, a);
        var m = function() {
          var t = o.hoverState;
          o.$element.trigger("shown.bs." + o.type), o.hoverState = null, "out" == t && o.leave(o)
        };
        t.support.transition && this.$tip.hasClass("fade") ? r.one("bsTransitionEnd", m).emulateTransitionEnd(n.TRANSITION_DURATION) : m()
      }
    }, n.prototype.applyPlacement = function(e, n) {
      var i = this.tip(),
        o = i[0].offsetWidth,
        r = i[0].offsetHeight,
        s = parseInt(i.css("margin-top"), 10),
        a = parseInt(i.css("margin-left"), 10);
      isNaN(s) && (s = 0), isNaN(a) && (a = 0), e.top += s, e.left += a, t.offset.setOffset(i[0], t.extend({
        using: function(t) {
          i.css({
            top: Math.round(t.top),
            left: Math.round(t.left)
          })
        }
      }, e), 0), i.addClass("in");
      var c = i[0].offsetWidth,
        l = i[0].offsetHeight;
      "top" == n && l != r && (e.top = e.top + r - l);
      var u = this.getViewportAdjustedDelta(n, e, c, l);
      u.left ? e.left += u.left : e.top += u.top;
      var h = /top|bottom/.test(n),
        p = h ? 2 * u.left - o + c : 2 * u.top - r + l,
        d = h ? "offsetWidth" : "offsetHeight";
      i.offset(e), this.replaceArrow(p, i[0][d], h)
    }, n.prototype.replaceArrow = function(t, e, n) {
      this.arrow().css(n ? "left" : "top", 50 * (1 - t / e) + "%").css(n ? "top" : "left", "")
    }, n.prototype.setContent = function() {
      var t = this.tip(),
        e = this.getTitle();
      t.find(".tooltip-inner")[this.options.html ? "html" : "text"](e), t.removeClass("fade in top bottom left right")
    }, n.prototype.hide = function(e) {
      function i() {
        "in" != o.hoverState && r.detach(), o.$element && o.$element.removeAttr("aria-describedby").trigger("hidden.bs." + o.type), e && e()
      }
      var o = this,
        r = t(this.$tip),
        s = t.Event("hide.bs." + this.type);
      return this.$element.trigger(s), s.isDefaultPrevented() ? void 0 : (r.removeClass("in"), t.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", i).emulateTransitionEnd(n.TRANSITION_DURATION) : i(), this.hoverState = null, this)
    }, n.prototype.fixTitle = function() {
      var t = this.$element;
      (t.attr("title") || "string" != typeof t.attr("data-original-title")) && t.attr("data-original-title", t.attr("title") || "").attr("title", "")
    }, n.prototype.hasContent = function() {
      return this.getTitle()
    }, n.prototype.getPosition = function(e) {
      e = e || this.$element;
      var n = e[0],
        i = "BODY" == n.tagName,
        o = n.getBoundingClientRect();
      null == o.width && (o = t.extend({}, o, {
        width: o.right - o.left,
        height: o.bottom - o.top
      }));
      var r = window.SVGElement && n instanceof window.SVGElement,
        s = i ? {
          top: 0,
          left: 0
        } : r ? null : e.offset(),
        a = {
          scroll: i ? document.documentElement.scrollTop || document.body.scrollTop : e.scrollTop()
        },
        c = i ? {
          width: t(window).width(),
          height: t(window).height()
        } : null;
      return t.extend({}, o, a, c, s)
    }, n.prototype.getCalculatedOffset = function(t, e, n, i) {
      return "bottom" == t ? {
        top: e.top + e.height,
        left: e.left + e.width / 2 - n / 2
      } : "top" == t ? {
        top: e.top - i,
        left: e.left + e.width / 2 - n / 2
      } : "left" == t ? {
        top: e.top + e.height / 2 - i / 2,
        left: e.left - n
      } : {
        top: e.top + e.height / 2 - i / 2,
        left: e.left + e.width
      }
    }, n.prototype.getViewportAdjustedDelta = function(t, e, n, i) {
      var o = {
        top: 0,
        left: 0
      };
      if (!this.$viewport) return o;
      var r = this.options.viewport && this.options.viewport.padding || 0,
        s = this.getPosition(this.$viewport);
      if (/right|left/.test(t)) {
        var a = e.top - r - s.scroll,
          c = e.top + r - s.scroll + i;
        a < s.top ? o.top = s.top - a : c > s.top + s.height && (o.top = s.top + s.height - c)
      } else {
        var l = e.left - r,
          u = e.left + r + n;
        l < s.left ? o.left = s.left - l : u > s.right && (o.left = s.left + s.width - u)
      }
      return o
    }, n.prototype.getTitle = function() {
      var t, e = this.$element,
        n = this.options;
      return t = e.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(e[0]) : n.title)
    }, n.prototype.getUID = function(t) {
      do t += ~~(1e6 * Math.random()); while (document.getElementById(t));
      return t
    }, n.prototype.tip = function() {
      if (!this.$tip && (this.$tip = t(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
      return this.$tip
    }, n.prototype.arrow = function() {
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, n.prototype.enable = function() {
      this.enabled = !0
    }, n.prototype.disable = function() {
      this.enabled = !1
    }, n.prototype.toggleEnabled = function() {
      this.enabled = !this.enabled
    }, n.prototype.toggle = function(e) {
      var n = this;
      e && (n = t(e.currentTarget).data("bs." + this.type), n || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n))), e ? (n.inState.click = !n.inState.click, n.isInStateTrue() ? n.enter(n) : n.leave(n)) : n.tip().hasClass("in") ? n.leave(n) : n.enter(n)
    }, n.prototype.destroy = function() {
      var t = this;
      clearTimeout(this.timeout), this.hide(function() {
        t.$element.off("." + t.type).removeData("bs." + t.type), t.$tip && t.$tip.detach(), t.$tip = null, t.$arrow = null, t.$viewport = null, t.$element = null
      })
    };
    var i = t.fn.tooltip;
    t.fn.tooltip = e, t.fn.tooltip.Constructor = n, t.fn.tooltip.noConflict = function() {
      return t.fn.tooltip = i, this
    }
  }(jQuery), + function(t) {
    "use strict";

    function e(e) {
      return this.each(function() {
        var i = t(this),
          o = i.data("bs.popover"),
          r = "object" == typeof e && e;
        !o && /destroy|hide/.test(e) || (o || i.data("bs.popover", o = new n(this, r)), "string" == typeof e && o[e]())
      })
    }
    var n = function(t, e) {
      this.init("popover", t, e)
    };
    if (!t.fn.tooltip) throw new Error("Popover requires tooltip.js");
    n.VERSION = "3.3.7", n.DEFAULTS = t.extend({}, t.fn.tooltip.Constructor.DEFAULTS, {
      placement: "right",
      trigger: "click",
      content: "",
      template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), n.prototype = t.extend({}, t.fn.tooltip.Constructor.prototype), n.prototype.constructor = n, n.prototype.getDefaults = function() {
      return n.DEFAULTS
    }, n.prototype.setContent = function() {
      var t = this.tip(),
        e = this.getTitle(),
        n = this.getContent();
      t.find(".popover-title")[this.options.html ? "html" : "text"](e), t.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof n ? "html" : "append" : "text"](n), t.removeClass("fade top bottom left right in"), t.find(".popover-title").html() || t.find(".popover-title").hide()
    }, n.prototype.hasContent = function() {
      return this.getTitle() || this.getContent()
    }, n.prototype.getContent = function() {
      var t = this.$element,
        e = this.options;
      return t.attr("data-content") || ("function" == typeof e.content ? e.content.call(t[0]) : e.content)
    }, n.prototype.arrow = function() {
      return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    var i = t.fn.popover;
    t.fn.popover = e, t.fn.popover.Constructor = n, t.fn.popover.noConflict = function() {
      return t.fn.popover = i, this
    }
  }(jQuery), + function(t) {
    "use strict";

    function e(e) {
      return this.each(function() {
        var i = t(this),
          o = i.data("bs.tab");
        o || i.data("bs.tab", o = new n(this)), "string" == typeof e && o[e]()
      })
    }
    var n = function(e) {
      this.element = t(e)
    };
    n.VERSION = "3.3.7", n.TRANSITION_DURATION = 150, n.prototype.show = function() {
      var e = this.element,
        n = e.closest("ul:not(.dropdown-menu)"),
        i = e.data("target");
      if (i || (i = e.attr("href"), i = i && i.replace(/.*(?=#[^\s]*$)/, "")), !e.parent("li").hasClass("active")) {
        var o = n.find(".active:last a"),
          r = t.Event("hide.bs.tab", {
            relatedTarget: e[0]
          }),
          s = t.Event("show.bs.tab", {
            relatedTarget: o[0]
          });
        if (o.trigger(r), e.trigger(s), !s.isDefaultPrevented() && !r.isDefaultPrevented()) {
          var a = t(i);
          this.activate(e.closest("li"), n), this.activate(a, a.parent(), function() {
            o.trigger({
              type: "hidden.bs.tab",
              relatedTarget: e[0]
            }), e.trigger({
              type: "shown.bs.tab",
              relatedTarget: o[0]
            })
          })
        }
      }
    }, n.prototype.activate = function(e, i, o) {
      function r() {
        s.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), e.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), a ? (e[0].offsetWidth, e.addClass("in")) : e.removeClass("fade"), e.parent(".dropdown-menu").length && e.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), o && o()
      }
      var s = i.find("> .active"),
        a = o && t.support.transition && (s.length && s.hasClass("fade") || !!i.find("> .fade").length);
      s.length && a ? s.one("bsTransitionEnd", r).emulateTransitionEnd(n.TRANSITION_DURATION) : r(), s.removeClass("in")
    };
    var i = t.fn.tab;
    t.fn.tab = e, t.fn.tab.Constructor = n, t.fn.tab.noConflict = function() {
      return t.fn.tab = i, this
    };
    var o = function(n) {
      n.preventDefault(), e.call(t(this), "show")
    };
    t(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', o).on("click.bs.tab.data-api", '[data-toggle="pill"]', o)
  }(jQuery), + function(t) {
    "use strict";

    function e(e) {
      return this.each(function() {
        var i = t(this),
          o = i.data("bs.affix"),
          r = "object" == typeof e && e;
        o || i.data("bs.affix", o = new n(this, r)), "string" == typeof e && o[e]()
      })
    }
    var n = function(e, i) {
      this.options = t.extend({}, n.DEFAULTS, i), this.$target = t(this.options.target).on("scroll.bs.affix.data-api", t.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", t.proxy(this.checkPositionWithEventLoop, this)), this.$element = t(e), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
    };
    n.VERSION = "3.3.7", n.RESET = "affix affix-top affix-bottom", n.DEFAULTS = {
      offset: 0,
      target: window
    }, n.prototype.getState = function(t, e, n, i) {
      var o = this.$target.scrollTop(),
        r = this.$element.offset(),
        s = this.$target.height();
      if (null != n && "top" == this.affixed) return n > o && "top";
      if ("bottom" == this.affixed) return null != n ? !(o + this.unpin <= r.top) && "bottom" : !(t - i >= o + s) && "bottom";
      var a = null == this.affixed,
        c = a ? o : r.top,
        l = a ? s : e;
      return null != n && n >= o ? "top" : null != i && c + l >= t - i && "bottom"
    }, n.prototype.getPinnedOffset = function() {
      if (this.pinnedOffset) return this.pinnedOffset;
      this.$element.removeClass(n.RESET).addClass("affix");
      var t = this.$target.scrollTop(),
        e = this.$element.offset();
      return this.pinnedOffset = e.top - t
    }, n.prototype.checkPositionWithEventLoop = function() {
      setTimeout(t.proxy(this.checkPosition, this), 1)
    }, n.prototype.checkPosition = function() {
      if (this.$element.is(":visible")) {
        var e = this.$element.height(),
          i = this.options.offset,
          o = i.top,
          r = i.bottom,
          s = Math.max(t(document).height(), t(document.body).height());
        "object" != typeof i && (r = o = i), "function" == typeof o && (o = i.top(this.$element)), "function" == typeof r && (r = i.bottom(this.$element));
        var a = this.getState(s, e, o, r);
        if (this.affixed != a) {
          null != this.unpin && this.$element.css("top", "");
          var c = "affix" + (a ? "-" + a : ""),
            l = t.Event(c + ".bs.affix");
          if (this.$element.trigger(l), l.isDefaultPrevented()) return;
          this.affixed = a, this.unpin = "bottom" == a ? this.getPinnedOffset() : null, this.$element.removeClass(n.RESET).addClass(c).trigger(c.replace("affix", "affixed") + ".bs.affix")
        }
        "bottom" == a && this.$element.offset({
          top: s - e - r
        })
      }
    };
    var i = t.fn.affix;
    t.fn.affix = e, t.fn.affix.Constructor = n, t.fn.affix.noConflict = function() {
      return t.fn.affix = i, this
    }, t(window).on("load", function() {
      t('[data-spy="affix"]').each(function() {
        var n = t(this),
          i = n.data();
        i.offset = i.offset || {}, null != i.offsetBottom && (i.offset.bottom = i.offsetBottom), null != i.offsetTop && (i.offset.top = i.offsetTop), e.call(n, i)
      })
    })
  }(jQuery), + function(t) {
    "use strict";

    function e(e) {
      var n, i = e.attr("data-target") || (n = e.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, "");
      return t(i)
    }

    function n(e) {
      return this.each(function() {
        var n = t(this),
          o = n.data("bs.collapse"),
          r = t.extend({}, i.DEFAULTS, n.data(), "object" == typeof e && e);
        !o && r.toggle && /show|hide/.test(e) && (r.toggle = !1), o || n.data("bs.collapse", o = new i(this, r)), "string" == typeof e && o[e]()
      })
    }
    var i = function(e, n) {
      this.$element = t(e), this.options = t.extend({}, i.DEFAULTS, n), this.$trigger = t('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    i.VERSION = "3.3.7", i.TRANSITION_DURATION = 350, i.DEFAULTS = {
      toggle: !0
    }, i.prototype.dimension = function() {
      var t = this.$element.hasClass("width");
      return t ? "width" : "height"
    }, i.prototype.show = function() {
      if (!this.transitioning && !this.$element.hasClass("in")) {
        var e, o = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
        if (!(o && o.length && (e = o.data("bs.collapse"), e && e.transitioning))) {
          var r = t.Event("show.bs.collapse");
          if (this.$element.trigger(r), !r.isDefaultPrevented()) {
            o && o.length && (n.call(o, "hide"), e || o.data("bs.collapse", null));
            var s = this.dimension();
            this.$element.removeClass("collapse").addClass("collapsing")[s](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
            var a = function() {
              this.$element.removeClass("collapsing").addClass("collapse in")[s](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
            };
            if (!t.support.transition) return a.call(this);
            var c = t.camelCase(["scroll", s].join("-"));
            this.$element.one("bsTransitionEnd", t.proxy(a, this)).emulateTransitionEnd(i.TRANSITION_DURATION)[s](this.$element[0][c])
          }
        }
      }
    }, i.prototype.hide = function() {
      if (!this.transitioning && this.$element.hasClass("in")) {
        var e = t.Event("hide.bs.collapse");
        if (this.$element.trigger(e), !e.isDefaultPrevented()) {
          var n = this.dimension();
          this.$element[n](this.$element[n]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
          var o = function() {
            this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
          };
          return t.support.transition ? void this.$element[n](0).one("bsTransitionEnd", t.proxy(o, this)).emulateTransitionEnd(i.TRANSITION_DURATION) : o.call(this)
        }
      }
    }, i.prototype.toggle = function() {
      this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, i.prototype.getParent = function() {
      return t(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(t.proxy(function(n, i) {
        var o = t(i);
        this.addAriaAndCollapsedClass(e(o), o)
      }, this)).end()
    }, i.prototype.addAriaAndCollapsedClass = function(t, e) {
      var n = t.hasClass("in");
      t.attr("aria-expanded", n), e.toggleClass("collapsed", !n).attr("aria-expanded", n)
    };
    var o = t.fn.collapse;
    t.fn.collapse = n, t.fn.collapse.Constructor = i, t.fn.collapse.noConflict = function() {
      return t.fn.collapse = o, this
    }, t(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(i) {
      var o = t(this);
      o.attr("data-target") || i.preventDefault();
      var r = e(o),
        s = r.data("bs.collapse"),
        a = s ? "toggle" : o.data();
      n.call(r, a)
    })
  }(jQuery), + function(t) {
    "use strict";

    function e() {
      var t = document.createElement("bootstrap"),
        e = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend"
        };
      for (var n in e)
        if (void 0 !== t.style[n]) return {
          end: e[n]
        };
      return !1
    }
    t.fn.emulateTransitionEnd = function(e) {
      var n = !1,
        i = this;
      t(this).one("bsTransitionEnd", function() {
        n = !0
      });
      var o = function() {
        n || t(i).trigger(t.support.transition.end)
      };
      return setTimeout(o, e), this
    }, t(function() {
      t.support.transition = e(), t.support.transition && (t.event.special.bsTransitionEnd = {
        bindType: t.support.transition.end,
        delegateType: t.support.transition.end,
        handle: function(e) {
          return t(e.target).is(this) ? e.handleObj.handler.apply(this, arguments) : void 0
        }
      })
    })
  }(jQuery), $("#shop_list_main .tile__item a, #shop_list_top .tile__item a, #shop_list_promo .tile__item a, #shop_list_rusilk .tile__item a").on("click", function() {
    function t() {
      var t = $(window).width();
      n.width(t);
      setTimeout(function() {
        n.css("margin-left", "");
        var t = n.offset();
        n.css("margin-left", -t.left)
      }, 20)
    }

    function e() {
      clearTimeout(i), i = setTimeout(function() {
        var t = $(window).width();
        n.width(t);
        n.css("margin-left", "");
        var e = n.offset();
        n.css("margin-left", -e.left)
      }, 20)
    }
    var n = $(this.parentNode).find(".tile_full");
    t();
    var i;
    $(window).on("resize", e)
  }), $(".page").is(":not(.chat-page)") && $(".page").is(":not(.no-fix)")) {
  $(".page").css({
    "padding-top": $("#header").height() + "px"
  });
  var stickyNavTop = $("#content").offset().top,
    sticky = $("#header"),
    stickyNav = function() {
      var t = $(window).scrollTop();
      t > stickyNavTop ? $(sticky).addClass("sticky") : $(sticky).removeClass("sticky")
    };
  stickyNav(), $(window).scroll(function() {
    stickyNav()
  }), $(".view_cat").click(function() {
    return $("html").toggleClass("cat_open"), !1
  })
}
$("#mobile_menu, .menu-overlay").click(function() {
    return $("html").toggleClass("menu_open"), !1
  }), $(function() {
    $(".dropdown-form").click(function(t) {
      t.stopPropagation()
    })
  }),
  function(t) {
    t.fn.unveil = function(e, n) {
      function i() {
        var e = u.filter(function() {
          var e = t(this);
          if (!e.is(":hidden")) {
            var n = s.scrollTop(),
              i = n + s.height(),
              o = e.offset().top,
              r = o + e.height();
            return r >= n - a && o <= i + a
          }
        });
        o = e.trigger("unveil"), u = u.not(o)
      }
      var o, r, s = t(window),
        a = e || 0,
        c = window.devicePixelRatio > 1,
        l = c ? "data-src-retina" : "data-src",
        u = this;
      return this.one("unveil", function() {
        var t = this.getAttribute(l);
        t = t || this.getAttribute("data-src"), t && (this.setAttribute("src", t), "function" == typeof n && n.call(this))
      }), s.on("scroll.unveil resize.unveil lookup.unveil", i), t(".chat-container .contacts").on("scroll.unveil resize.unveil lookup.unveil", function() {
        r && clearTimeout(r), r = setTimeout(i, 300)
      }), i(), this
    }
  }(window.jQuery || window.Zepto),
  function(t, e, n, i) {
    function o(e, n) {
      this.element = e, this.$element = t(e), this.maxHeight = n && n.hasOwnProperty("maxHeight") ? n.maxHeight : 0, this.initialHeight = 0, this.init()
    }
    var r = "textareaAutoSize",
      s = "plugin_" + r,
      a = function(t) {
        return t.replace(/\s/g, "").length > 0
      };
    o.prototype = {
      init: function() {
        var n = (this.$element.outerHeight(), parseInt(this.$element.css("paddingBottom")) + parseInt(this.$element.css("paddingTop")) || 0),
          i = 0,
          o = this.maxHeight;
        a(this.element.value) ? this.$element.height(this.element.scrollHeight - n) : i = this.element.scrollHeight - n, this.$element.on("input keyup change", function(r) {
          var s = t(e),
            a = s.scrollTop();
          currentHeight = this.scrollHeight - n, i > 0 && o > 0 && (currentHeight = Math.min(currentHeight, i * o)), t(this).height(0).height(currentHeight), s.scrollTop(a)
        })
      }
    }, t.fn[r] = function(e) {
      return this.each(function() {
        t.data(this, s) || t.data(this, s, new o(this, e))
      }), this
    }
  }(jQuery, window, document), ! function(t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
      var e;
      "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), e.io = t()
    }
  }(function() {
    var t;
    return function t(e, n, i) {
      function o(s, a) {
        if (!n[s]) {
          if (!e[s]) {
            var c = "function" == typeof require && require;
            if (!a && c) return c(s, !0);
            if (r) return r(s, !0);
            throw new Error("Cannot find module '" + s + "'")
          }
          var l = n[s] = {
            exports: {}
          };
          e[s][0].call(l.exports, function(t) {
            var n = e[s][1][t];
            return o(n ? n : t)
          }, l, l.exports, t, e, n, i)
        }
        return n[s].exports
      }
      for (var r = "function" == typeof require && require, s = 0; s < i.length; s++) o(i[s]);
      return o
    }({
      1: [function(t, e, n) {
        e.exports = t("./lib/")
      }, {
        "./lib/": 2
      }],
      2: [function(t, e, n) {
        function i(t, e) {
          "object" == typeof t && (e = t, t = void 0), e = e || {};
          var n, i = o(t),
            r = i.source,
            l = i.id;
          return e.forceNew || e["force new connection"] || !1 === e.multiplex ? (a("ignoring socket cache for %s", r), n = s(r, e)) : (c[l] || (a("new io instance for %s", r), c[l] = s(r, e)), n = c[l]), n.socket(i.path)
        }
        var o = t("./url"),
          r = t("socket.io-parser"),
          s = t("./manager"),
          a = t("debug")("socket.io-client");
        e.exports = n = i;
        var c = n.managers = {};
        n.protocol = r.protocol, n.connect = i, n.Manager = t("./manager"), n.Socket = t("./socket")
      }, {
        "./manager": 3,
        "./socket": 5,
        "./url": 6,
        debug: 10,
        "socket.io-parser": 46
      }],
      3: [function(t, e, n) {
        function i(t, e) {
          return this instanceof i ? (t && "object" == typeof t && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = e, this.reconnection(e.reconnection !== !1), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new p({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor()
          }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = "closed", this.uri = t, this.connected = [], this.encoding = !1, this.packetBuffer = [], this.encoder = new a.Encoder, this.decoder = new a.Decoder, this.autoConnect = e.autoConnect !== !1, void(this.autoConnect && this.open())) : new i(t, e)
        }
        var o = (t("./url"), t("engine.io-client")),
          r = t("./socket"),
          s = t("component-emitter"),
          a = t("socket.io-parser"),
          c = t("./on"),
          l = t("component-bind"),
          u = (t("object-component"), t("debug")("socket.io-client:manager")),
          h = t("indexof"),
          p = t("backo2");
        e.exports = i, i.prototype.emitAll = function() {
          this.emit.apply(this, arguments);
          for (var t in this.nsps) this.nsps[t].emit.apply(this.nsps[t], arguments)
        }, i.prototype.updateSocketIds = function() {
          for (var t in this.nsps) this.nsps[t].id = this.engine.id
        }, s(i.prototype), i.prototype.reconnection = function(t) {
          return arguments.length ? (this._reconnection = !!t, this) : this._reconnection
        }, i.prototype.reconnectionAttempts = function(t) {
          return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts
        }, i.prototype.reconnectionDelay = function(t) {
          return arguments.length ? (this._reconnectionDelay = t,
            this.backoff && this.backoff.setMin(t), this) : this._reconnectionDelay
        }, i.prototype.randomizationFactor = function(t) {
          return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) : this._randomizationFactor
        }, i.prototype.reconnectionDelayMax = function(t) {
          return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) : this._reconnectionDelayMax
        }, i.prototype.timeout = function(t) {
          return arguments.length ? (this._timeout = t, this) : this._timeout
        }, i.prototype.maybeReconnectOnOpen = function() {
          !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
        }, i.prototype.open = i.prototype.connect = function(t) {
          if (u("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
          u("opening %s", this.uri), this.engine = o(this.uri, this.opts);
          var e = this.engine,
            n = this;
          this.readyState = "opening", this.skipReconnect = !1;
          var i = c(e, "open", function() {
              n.onopen(), t && t()
            }),
            r = c(e, "error", function(e) {
              if (u("connect_error"), n.cleanup(), n.readyState = "closed", n.emitAll("connect_error", e), t) {
                var i = new Error("Connection error");
                i.data = e, t(i)
              } else n.maybeReconnectOnOpen()
            });
          if (!1 !== this._timeout) {
            var s = this._timeout;
            u("connect attempt will timeout after %d", s);
            var a = setTimeout(function() {
              u("connect attempt timed out after %d", s), i.destroy(), e.close(), e.emit("error", "timeout"), n.emitAll("connect_timeout", s)
            }, s);
            this.subs.push({
              destroy: function() {
                clearTimeout(a)
              }
            })
          }
          return this.subs.push(i), this.subs.push(r), this
        }, i.prototype.onopen = function() {
          u("open"), this.cleanup(), this.readyState = "open", this.emit("open");
          var t = this.engine;
          this.subs.push(c(t, "data", l(this, "ondata"))), this.subs.push(c(this.decoder, "decoded", l(this, "ondecoded"))), this.subs.push(c(t, "error", l(this, "onerror"))), this.subs.push(c(t, "close", l(this, "onclose")))
        }, i.prototype.ondata = function(t) {
          this.decoder.add(t)
        }, i.prototype.ondecoded = function(t) {
          this.emit("packet", t)
        }, i.prototype.onerror = function(t) {
          u("error", t), this.emitAll("error", t)
        }, i.prototype.socket = function(t) {
          var e = this.nsps[t];
          if (!e) {
            e = new r(this, t), this.nsps[t] = e;
            var n = this;
            e.on("connect", function() {
              e.id = n.engine.id, ~h(n.connected, e) || n.connected.push(e)
            })
          }
          return e
        }, i.prototype.destroy = function(t) {
          var e = h(this.connected, t);
          ~e && this.connected.splice(e, 1), this.connected.length || this.close()
        }, i.prototype.packet = function(t) {
          u("writing packet %j", t);
          var e = this;
          e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, this.encoder.encode(t, function(t) {
            for (var n = 0; n < t.length; n++) e.engine.write(t[n]);
            e.encoding = !1, e.processPacketQueue()
          }))
        }, i.prototype.processPacketQueue = function() {
          if (this.packetBuffer.length > 0 && !this.encoding) {
            var t = this.packetBuffer.shift();
            this.packet(t)
          }
        }, i.prototype.cleanup = function() {
          for (var t; t = this.subs.shift();) t.destroy();
          this.packetBuffer = [], this.encoding = !1, this.decoder.destroy()
        }, i.prototype.close = i.prototype.disconnect = function() {
          this.skipReconnect = !0, this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
        }, i.prototype.onclose = function(t) {
          u("close"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", t), this._reconnection && !this.skipReconnect && this.reconnect()
        }, i.prototype.reconnect = function() {
          if (this.reconnecting || this.skipReconnect) return this;
          var t = this;
          if (this.backoff.attempts >= this._reconnectionAttempts) u("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;
          else {
            var e = this.backoff.duration();
            u("will wait %dms before reconnect attempt", e), this.reconnecting = !0;
            var n = setTimeout(function() {
              t.skipReconnect || (u("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function(e) {
                e ? (u("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (u("reconnect success"), t.onreconnect())
              }))
            }, e);
            this.subs.push({
              destroy: function() {
                clearTimeout(n)
              }
            })
          }
        }, i.prototype.onreconnect = function() {
          var t = this.backoff.attempts;
          this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", t)
        }
      }, {
        "./on": 4,
        "./socket": 5,
        "./url": 6,
        backo2: 7,
        "component-bind": 8,
        "component-emitter": 9,
        debug: 10,
        "engine.io-client": 11,
        indexof: 42,
        "object-component": 43,
        "socket.io-parser": 46
      }],
      4: [function(t, e, n) {
        function i(t, e, n) {
          return t.on(e, n), {
            destroy: function() {
              t.removeListener(e, n)
            }
          }
        }
        e.exports = i
      }, {}],
      5: [function(t, e, n) {
        function i(t, e) {
          this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.io.autoConnect && this.open(), this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0
        }
        var o = t("socket.io-parser"),
          r = t("component-emitter"),
          s = t("to-array"),
          a = t("./on"),
          c = t("component-bind"),
          l = t("debug")("socket.io-client:socket"),
          u = t("has-binary");
        e.exports = n = i;
        var h = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1
          },
          p = r.prototype.emit;
        r(i.prototype), i.prototype.subEvents = function() {
          if (!this.subs) {
            var t = this.io;
            this.subs = [a(t, "open", c(this, "onopen")), a(t, "packet", c(this, "onpacket")), a(t, "close", c(this, "onclose"))]
          }
        }, i.prototype.open = i.prototype.connect = function() {
          return this.connected ? this : (this.subEvents(), this.io.open(), "open" == this.io.readyState && this.onopen(), this)
        }, i.prototype.send = function() {
          var t = s(arguments);
          return t.unshift("message"), this.emit.apply(this, t), this
        }, i.prototype.emit = function(t) {
          if (h.hasOwnProperty(t)) return p.apply(this, arguments), this;
          var e = s(arguments),
            n = o.EVENT;
          u(e) && (n = o.BINARY_EVENT);
          var i = {
            type: n,
            data: e
          };
          return "function" == typeof e[e.length - 1] && (l("emitting packet with ack id %d", this.ids), this.acks[this.ids] = e.pop(), i.id = this.ids++), this.connected ? this.packet(i) : this.sendBuffer.push(i), this
        }, i.prototype.packet = function(t) {
          t.nsp = this.nsp, this.io.packet(t)
        }, i.prototype.onopen = function() {
          l("transport is open - connecting"), "/" != this.nsp && this.packet({
            type: o.CONNECT
          })
        }, i.prototype.onclose = function(t) {
          l("close (%s)", t), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", t)
        }, i.prototype.onpacket = function(t) {
          if (t.nsp == this.nsp) switch (t.type) {
            case o.CONNECT:
              this.onconnect();
              break;
            case o.EVENT:
              this.onevent(t);
              break;
            case o.BINARY_EVENT:
              this.onevent(t);
              break;
            case o.ACK:
              this.onack(t);
              break;
            case o.BINARY_ACK:
              this.onack(t);
              break;
            case o.DISCONNECT:
              this.ondisconnect();
              break;
            case o.ERROR:
              this.emit("error", t.data)
          }
        }, i.prototype.onevent = function(t) {
          var e = t.data || [];
          l("emitting event %j", e), null != t.id && (l("attaching ack callback to event"), e.push(this.ack(t.id))), this.connected ? p.apply(this, e) : this.receiveBuffer.push(e)
        }, i.prototype.ack = function(t) {
          var e = this,
            n = !1;
          return function() {
            if (!n) {
              n = !0;
              var i = s(arguments);
              l("sending ack %j", i);
              var r = u(i) ? o.BINARY_ACK : o.ACK;
              e.packet({
                type: r,
                id: t,
                data: i
              })
            }
          }
        }, i.prototype.onack = function(t) {
          l("calling ack %s with %j", t.id, t.data);
          var e = this.acks[t.id];
          e.apply(this, t.data), delete this.acks[t.id]
        }, i.prototype.onconnect = function() {
          this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
        }, i.prototype.emitBuffered = function() {
          var t;
          for (t = 0; t < this.receiveBuffer.length; t++) p.apply(this, this.receiveBuffer[t]);
          for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) this.packet(this.sendBuffer[t]);
          this.sendBuffer = []
        }, i.prototype.ondisconnect = function() {
          l("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
        }, i.prototype.destroy = function() {
          if (this.subs) {
            for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();
            this.subs = null
          }
          this.io.destroy(this)
        }, i.prototype.close = i.prototype.disconnect = function() {
          return this.connected && (l("performing disconnect (%s)", this.nsp), this.packet({
            type: o.DISCONNECT
          })), this.destroy(), this.connected && this.onclose("io client disconnect"), this
        }
      }, {
        "./on": 4,
        "component-bind": 8,
        "component-emitter": 9,
        debug: 10,
        "has-binary": 38,
        "socket.io-parser": 46,
        "to-array": 50
      }],
      6: [function(t, e, n) {
        (function(n) {
          function i(t, e) {
            var i = t,
              e = e || n.location;
            return null == t && (t = e.protocol + "//" + e.host), "string" == typeof t && ("/" == t.charAt(0) && (t = "/" == t.charAt(1) ? e.protocol + t : e.hostname + t), /^(https?|wss?):\/\//.test(t) || (r("protocol-less url %s", t), t = "undefined" != typeof e ? e.protocol + "//" + t : "https://" + t), r("parse %s", t), i = o(t)), i.port || (/^(http|ws)$/.test(i.protocol) ? i.port = "80" : /^(http|ws)s$/.test(i.protocol) && (i.port = "443")), i.path = i.path || "/", i.id = i.protocol + "://" + i.host + ":" + i.port, i.href = i.protocol + "://" + i.host + (e && e.port == i.port ? "" : ":" + i.port), i
          }
          var o = t("parseuri"),
            r = t("debug")("socket.io-client:url");
          e.exports = i
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        debug: 10,
        parseuri: 44
      }],
      7: [function(t, e, n) {
        function i(t) {
          t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0
        }
        e.exports = i, i.prototype.duration = function() {
          var t = this.ms * Math.pow(this.factor, this.attempts++);
          if (this.jitter) {
            var e = Math.random(),
              n = Math.floor(e * this.jitter * t);
            t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n
          }
          return 0 | Math.min(t, this.max)
        }, i.prototype.reset = function() {
          this.attempts = 0
        }, i.prototype.setMin = function(t) {
          this.ms = t
        }, i.prototype.setMax = function(t) {
          this.max = t
        }, i.prototype.setJitter = function(t) {
          this.jitter = t
        }
      }, {}],
      8: [function(t, e, n) {
        var i = [].slice;
        e.exports = function(t, e) {
          if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function");
          var n = i.call(arguments, 2);
          return function() {
            return e.apply(t, n.concat(i.call(arguments)))
          }
        }
      }, {}],
      9: [function(t, e, n) {
        function i(t) {
          if (t) return o(t)
        }

        function o(t) {
          for (var e in i.prototype) t[e] = i.prototype[e];
          return t
        }
        e.exports = i, i.prototype.on = i.prototype.addEventListener = function(t, e) {
          return this._callbacks = this._callbacks || {}, (this._callbacks[t] = this._callbacks[t] || []).push(e), this
        }, i.prototype.once = function(t, e) {
          function n() {
            i.off(t, n), e.apply(this, arguments)
          }
          var i = this;
          return this._callbacks = this._callbacks || {}, n.fn = e, this.on(t, n), this
        }, i.prototype.off = i.prototype.removeListener = i.prototype.removeAllListeners = i.prototype.removeEventListener = function(t, e) {
          if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
          var n = this._callbacks[t];
          if (!n) return this;
          if (1 == arguments.length) return delete this._callbacks[t], this;
          for (var i, o = 0; o < n.length; o++)
            if (i = n[o], i === e || i.fn === e) {
              n.splice(o, 1);
              break
            }
          return this
        }, i.prototype.emit = function(t) {
          this._callbacks = this._callbacks || {};
          var e = [].slice.call(arguments, 1),
            n = this._callbacks[t];
          if (n) {
            n = n.slice(0);
            for (var i = 0, o = n.length; i < o; ++i) n[i].apply(this, e)
          }
          return this
        }, i.prototype.listeners = function(t) {
          return this._callbacks = this._callbacks || {}, this._callbacks[t] || []
        }, i.prototype.hasListeners = function(t) {
          return !!this.listeners(t).length
        }
      }, {}],
      10: [function(t, e, n) {
        function i(t) {
          return i.enabled(t) ? function(e) {
            e = o(e);
            var n = new Date,
              r = n - (i[t] || n);
            i[t] = n, e = t + " " + e + " +" + i.humanize(r), window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
          } : function() {}
        }

        function o(t) {
          return t instanceof Error ? t.stack || t.message : t
        }
        e.exports = i, i.names = [], i.skips = [], i.enable = function(t) {
          try {
            localStorage.debug = t
          } catch (t) {}
          for (var e = (t || "").split(/[\s,]+/), n = e.length, o = 0; o < n; o++) t = e[o].replace("*", ".*?"), "-" === t[0] ? i.skips.push(new RegExp("^" + t.substr(1) + "$")) : i.names.push(new RegExp("^" + t + "$"))
        }, i.disable = function() {
          i.enable("")
        }, i.humanize = function(t) {
          var e = 1e3,
            n = 6e4,
            i = 60 * n;
          return t >= i ? (t / i).toFixed(1) + "h" : t >= n ? (t / n).toFixed(1) + "m" : t >= e ? (t / e | 0) + "s" : t + "ms"
        }, i.enabled = function(t) {
          for (var e = 0, n = i.skips.length; e < n; e++)
            if (i.skips[e].test(t)) return !1;
          for (var e = 0, n = i.names.length; e < n; e++)
            if (i.names[e].test(t)) return !0;
          return !1
        };
        try {
          window.localStorage && i.enable(localStorage.debug)
        } catch (t) {}
      }, {}],
      11: [function(t, e, n) {
        e.exports = t("./lib/")
      }, {
        "./lib/": 12
      }],
      12: [function(t, e, n) {
        e.exports = t("./socket"), e.exports.parser = t("engine.io-parser")
      }, {
        "./socket": 13,
        "engine.io-parser": 25
      }],
      13: [function(t, e, n) {
        (function(n) {
          function i(t, e) {
            if (!(this instanceof i)) return new i(t, e);
            if (e = e || {}, t && "object" == typeof t && (e = t, t = null), t && (t = u(t), e.host = t.host, e.secure = "https" == t.protocol || "wss" == t.protocol, e.port = t.port, t.query && (e.query = t.query)), this.secure = null != e.secure ? e.secure : n.location && "https:" == location.protocol, e.host) {
              var o = e.host.split(":");
              e.hostname = o.shift(), o.length ? e.port = o.pop() : e.port || (e.port = this.secure ? "443" : "80")
            }
            this.agent = e.agent || !1, this.hostname = e.hostname || (n.location ? location.hostname : "localhost"), this.port = e.port || (n.location && location.port ? location.port : this.secure ? 443 : 80), this.query = e.query || {}, "string" == typeof this.query && (this.query = p.decode(this.query)), this.upgrade = !1 !== e.upgrade, this.path = (e.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!e.forceJSONP, this.jsonp = !1 !== e.jsonp, this.forceBase64 = !!e.forceBase64, this.enablesXDR = !!e.enablesXDR, this.timestampParam = e.timestampParam || "t", this.timestampRequests = e.timestampRequests, this.transports = e.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.callbackBuffer = [], this.policyPort = e.policyPort || 843, this.rememberUpgrade = e.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = e.onlyBinaryUpgrades, this.pfx = e.pfx || null, this.key = e.key || null, this.passphrase = e.passphrase || null, this.cert = e.cert || null, this.ca = e.ca || null, this.ciphers = e.ciphers || null, this.rejectUnauthorized = e.rejectUnauthorized || null, this.open()
          }

          function o(t) {
            var e = {};
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            return e
          }
          var r = t("./transports"),
            s = t("component-emitter"),
            a = t("debug")("engine.io-client:socket"),
            c = t("indexof"),
            l = t("engine.io-parser"),
            u = t("parseuri"),
            h = t("parsejson"),
            p = t("parseqs");
          e.exports = i, i.priorWebsocketSuccess = !1, s(i.prototype), i.protocol = l.protocol, i.Socket = i, i.Transport = t("./transport"), i.transports = t("./transports"), i.parser = t("engine.io-parser"), i.prototype.createTransport = function(t) {
            a('creating transport "%s"', t);
            var e = o(this.query);
            e.EIO = l.protocol, e.transport = t, this.id && (e.sid = this.id);
            var n = new r[t]({
              agent: this.agent,
              hostname: this.hostname,
              port: this.port,
              secure: this.secure,
              path: this.path,
              query: e,
              forceJSONP: this.forceJSONP,
              jsonp: this.jsonp,
              forceBase64: this.forceBase64,
              enablesXDR: this.enablesXDR,
              timestampRequests: this.timestampRequests,
              timestampParam: this.timestampParam,
              policyPort: this.policyPort,
              socket: this,
              pfx: this.pfx,
              key: this.key,
              passphrase: this.passphrase,
              cert: this.cert,
              ca: this.ca,
              ciphers: this.ciphers,
              rejectUnauthorized: this.rejectUnauthorized
            });
            return n
          }, i.prototype.open = function() {
            var t;
            if (this.rememberUpgrade && i.priorWebsocketSuccess && this.transports.indexOf("websocket") != -1) t = "websocket";
            else {
              if (0 == this.transports.length) {
                var e = this;
                return void setTimeout(function() {
                  e.emit("error", "No transports available")
                }, 0)
              }
              t = this.transports[0]
            }
            this.readyState = "opening";
            var t;
            try {
              t = this.createTransport(t)
            } catch (t) {
              return this.transports.shift(), void this.open()
            }
            t.open(), this.setTransport(t)
          }, i.prototype.setTransport = function(t) {
            a("setting transport %s", t.name);
            var e = this;
            this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = t, t.on("drain", function() {
              e.onDrain()
            }).on("packet", function(t) {
              e.onPacket(t)
            }).on("error", function(t) {
              e.onError(t)
            }).on("close", function() {
              e.onClose("transport close")
            })
          }, i.prototype.probe = function(t) {
            function e() {
              if (p.onlyBinaryUpgrades) {
                var e = !this.supportsBinary && p.transport.supportsBinary;
                h = h || e
              }
              h || (a('probe transport "%s" opened', t), u.send([{
                type: "ping",
                data: "probe"
              }]), u.once("packet", function(e) {
                if (!h)
                  if ("pong" == e.type && "probe" == e.data) {
                    if (a('probe transport "%s" pong', t), p.upgrading = !0, p.emit("upgrading", u), !u) return;
                    i.priorWebsocketSuccess = "websocket" == u.name, a('pausing current transport "%s"', p.transport.name), p.transport.pause(function() {
                      h || "closed" != p.readyState && (a("changing transport and sending upgrade packet"), l(), p.setTransport(u), u.send([{
                        type: "upgrade"
                      }]), p.emit("upgrade", u), u = null, p.upgrading = !1, p.flush())
                    })
                  } else {
                    a('probe transport "%s" failed', t);
                    var n = new Error("probe error");
                    n.transport = u.name, p.emit("upgradeError", n)
                  }
              }))
            }

            function n() {
              h || (h = !0, l(), u.close(), u = null)
            }

            function o(e) {
              var i = new Error("probe error: " + e);
              i.transport = u.name, n(), a('probe transport "%s" failed because of error: %s', t, e), p.emit("upgradeError", i)
            }

            function r() {
              o("transport closed")
            }

            function s() {
              o("socket closed")
            }

            function c(t) {
              u && t.name != u.name && (a('"%s" works - aborting "%s"', t.name, u.name), n())
            }

            function l() {
              u.removeListener("open", e), u.removeListener("error", o), u.removeListener("close", r), p.removeListener("close", s), p.removeListener("upgrading", c)
            }
            a('probing transport "%s"', t);
            var u = this.createTransport(t, {
                probe: 1
              }),
              h = !1,
              p = this;
            i.priorWebsocketSuccess = !1, u.once("open", e), u.once("error", o), u.once("close", r), this.once("close", s), this.once("upgrading", c), u.open()
          }, i.prototype.onOpen = function() {
            if (a("socket open"), this.readyState = "open", i.priorWebsocketSuccess = "websocket" == this.transport.name, this.emit("open"), this.flush(), "open" == this.readyState && this.upgrade && this.transport.pause) {
              a("starting upgrade probes");
              for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t])
            }
          }, i.prototype.onPacket = function(t) {
            if ("opening" == this.readyState || "open" == this.readyState) switch (a('socket receive: type "%s", data "%s"', t.type, t.data), this.emit("packet", t), this.emit("heartbeat"), t.type) {
              case "open":
                this.onHandshake(h(t.data));
                break;
              case "pong":
                this.setPing();
                break;
              case "error":
                var e = new Error("server error");
                e.code = t.data, this.emit("error", e);
                break;
              case "message":
                this.emit("data", t.data), this.emit("message", t.data)
            } else a('packet received with socket readyState "%s"', this.readyState)
          }, i.prototype.onHandshake = function(t) {
            this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" != this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
          }, i.prototype.onHeartbeat = function(t) {
            clearTimeout(this.pingTimeoutTimer);
            var e = this;
            e.pingTimeoutTimer = setTimeout(function() {
              "closed" != e.readyState && e.onClose("ping timeout")
            }, t || e.pingInterval + e.pingTimeout)
          }, i.prototype.setPing = function() {
            var t = this;
            clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function() {
              a("writing ping packet - expecting pong within %sms", t.pingTimeout), t.ping(), t.onHeartbeat(t.pingTimeout)
            }, t.pingInterval)
          }, i.prototype.ping = function() {
            this.sendPacket("ping")
          }, i.prototype.onDrain = function() {
            for (var t = 0; t < this.prevBufferLen; t++) this.callbackBuffer[t] && this.callbackBuffer[t]();
            this.writeBuffer.splice(0, this.prevBufferLen), this.callbackBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 == this.writeBuffer.length ? this.emit("drain") : this.flush()
          }, i.prototype.flush = function() {
            "closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
          }, i.prototype.write = i.prototype.send = function(t, e) {
            return this.sendPacket("message", t, e), this
          }, i.prototype.sendPacket = function(t, e, n) {
            if ("closing" != this.readyState && "closed" != this.readyState) {
              var i = {
                type: t,
                data: e
              };
              this.emit("packetCreate", i), this.writeBuffer.push(i), this.callbackBuffer.push(n), this.flush()
            }
          }, i.prototype.close = function() {
            function t() {
              i.onClose("forced close"), a("socket closing - telling transport to close"), i.transport.close()
            }

            function e() {
              i.removeListener("upgrade", e), i.removeListener("upgradeError", e), t()
            }

            function n() {
              i.once("upgrade", e), i.once("upgradeError", e)
            }
            if ("opening" == this.readyState || "open" == this.readyState) {
              this.readyState = "closing";
              var i = this;
              this.writeBuffer.length ? this.once("drain", function() {
                this.upgrading ? n() : t()
              }) : this.upgrading ? n() : t()
            }
            return this
          }, i.prototype.onError = function(t) {
            a("socket error %j", t), i.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t)
          }, i.prototype.onClose = function(t, e) {
            if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
              a('socket close with reason: "%s"', t);
              var n = this;
              clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), setTimeout(function() {
                n.writeBuffer = [], n.callbackBuffer = [], n.prevBufferLen = 0
              }, 0), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", t, e)
            }
          }, i.prototype.filterUpgrades = function(t) {
            for (var e = [], n = 0, i = t.length; n < i; n++) ~c(this.transports, t[n]) && e.push(t[n]);
            return e
          }
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        "./transport": 14,
        "./transports": 15,
        "component-emitter": 9,
        debug: 22,
        "engine.io-parser": 25,
        indexof: 42,
        parsejson: 34,
        parseqs: 35,
        parseuri: 36
      }],
      14: [function(t, e, n) {
        function i(t) {
          this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, this.readyState = "", this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized
        }
        var o = t("engine.io-parser"),
          r = t("component-emitter");
        e.exports = i, r(i.prototype), i.timestamps = 0, i.prototype.onError = function(t, e) {
          var n = new Error(t);
          return n.type = "TransportError", n.description = e, this.emit("error", n), this
        }, i.prototype.open = function() {
          return "closed" != this.readyState && "" != this.readyState || (this.readyState = "opening", this.doOpen()), this
        }, i.prototype.close = function() {
          return "opening" != this.readyState && "open" != this.readyState || (this.doClose(), this.onClose()), this
        }, i.prototype.send = function(t) {
          if ("open" != this.readyState) throw new Error("Transport not open");
          this.write(t)
        }, i.prototype.onOpen = function() {
          this.readyState = "open", this.writable = !0, this.emit("open")
        }, i.prototype.onData = function(t) {
          var e = o.decodePacket(t, this.socket.binaryType);
          this.onPacket(e)
        }, i.prototype.onPacket = function(t) {
          this.emit("packet", t)
        }, i.prototype.onClose = function() {
          this.readyState = "closed", this.emit("close")
        }
      }, {
        "component-emitter": 9,
        "engine.io-parser": 25
      }],
      15: [function(t, e, n) {
        (function(e) {
          function i(t) {
            var n, i = !1,
              a = !1,
              c = !1 !== t.jsonp;
            if (e.location) {
              var l = "https:" == location.protocol,
                u = location.port;
              u || (u = l ? 443 : 80), i = t.hostname != location.hostname || u != t.port, a = t.secure != l
            }
            if (t.xdomain = i, t.xscheme = a, n = new o(t), "open" in n && !t.forceJSONP) return new r(t);
            if (!c) throw new Error("JSONP disabled");
            return new s(t)
          }
          var o = t("xmlhttprequest"),
            r = t("./polling-xhr"),
            s = t("./polling-jsonp"),
            a = t("./websocket");
          n.polling = i, n.websocket = a
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        "./polling-jsonp": 16,
        "./polling-xhr": 17,
        "./websocket": 19,
        xmlhttprequest: 20
      }],
      16: [function(t, e, n) {
        (function(n) {
          function i() {}

          function o(t) {
            r.call(this, t), this.query = this.query || {}, a || (n.___eio || (n.___eio = []), a = n.___eio), this.index = a.length;
            var e = this;
            a.push(function(t) {
              e.onData(t)
            }), this.query.j = this.index, n.document && n.addEventListener && n.addEventListener("beforeunload", function() {
              e.script && (e.script.onerror = i)
            }, !1)
          }
          var r = t("./polling"),
            s = t("component-inherit");
          e.exports = o;
          var a, c = /\n/g,
            l = /\\n/g;
          s(o, r), o.prototype.supportsBinary = !1, o.prototype.doClose = function() {
            this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), r.prototype.doClose.call(this)
          }, o.prototype.doPoll = function() {
            var t = this,
              e = document.createElement("script");
            this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function(e) {
              t.onError("jsonp poll error", e)
            };
            var n = document.getElementsByTagName("script")[0];
            n.parentNode.insertBefore(e, n), this.script = e;
            var i = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
            i && setTimeout(function() {
              var t = document.createElement("iframe");
              document.body.appendChild(t), document.body.removeChild(t)
            }, 100)
          }, o.prototype.doWrite = function(t, e) {
            function n() {
              i(), e()
            }

            function i() {
              if (o.iframe) try {
                o.form.removeChild(o.iframe)
              } catch (t) {
                o.onError("jsonp polling iframe removal error", t)
              }
              try {
                var t = '<iframe src="javascript:0" name="' + o.iframeId + '">';
                r = document.createElement(t)
              } catch (t) {
                r = document.createElement("iframe"), r.name = o.iframeId, r.src = "javascript:0"
              }
              r.id = o.iframeId, o.form.appendChild(r), o.iframe = r
            }
            var o = this;
            if (!this.form) {
              var r, s = document.createElement("form"),
                a = document.createElement("textarea"),
                u = this.iframeId = "eio_iframe_" + this.index;
              s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", s.style.left = "-1000px", s.target = u, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), a.name = "d", s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a
            }
            this.form.action = this.uri(), i(), t = t.replace(l, "\\\n"), this.area.value = t.replace(c, "\\n");
            try {
              this.form.submit()
            } catch (t) {}
            this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
              "complete" == o.iframe.readyState && n()
            } : this.iframe.onload = n
          }
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        "./polling": 18,
        "component-inherit": 21
      }],
      17: [function(t, e, n) {
        (function(n) {
          function i() {}

          function o(t) {
            if (c.call(this, t), n.location) {
              var e = "https:" == location.protocol,
                i = location.port;
              i || (i = e ? 443 : 80), this.xd = t.hostname != n.location.hostname || i != t.port, this.xs = t.secure != e
            }
          }

          function r(t) {
            this.method = t.method || "GET", this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, this.async = !1 !== t.async, this.data = void 0 != t.data ? t.data : null, this.agent = t.agent, this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.create()
          }

          function s() {
            for (var t in r.requests) r.requests.hasOwnProperty(t) && r.requests[t].abort()
          }
          var a = t("xmlhttprequest"),
            c = t("./polling"),
            l = t("component-emitter"),
            u = t("component-inherit"),
            h = t("debug")("engine.io-client:polling-xhr");
          e.exports = o, e.exports.Request = r, u(o, c), o.prototype.supportsBinary = !0, o.prototype.request = function(t) {
            return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, new r(t)
          }, o.prototype.doWrite = function(t, e) {
            var n = "string" != typeof t && void 0 !== t,
              i = this.request({
                method: "POST",
                data: t,
                isBinary: n
              }),
              o = this;
            i.on("success", e), i.on("error", function(t) {
              o.onError("xhr post error", t)
            }), this.sendXhr = i
          }, o.prototype.doPoll = function() {
            h("xhr poll");
            var t = this.request(),
              e = this;
            t.on("data", function(t) {
              e.onData(t)
            }), t.on("error", function(t) {
              e.onError("xhr poll error", t)
            }), this.pollXhr = t
          }, l(r.prototype), r.prototype.create = function() {
            var t = {
              agent: this.agent,
              xdomain: this.xd,
              xscheme: this.xs,
              enablesXDR: this.enablesXDR
            };
            t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;
            var e = this.xhr = new a(t),
              i = this;
            try {
              if (h("xhr open %s: %s", this.method, this.uri), e.open(this.method, this.uri, this.async), this.supportsBinary && (e.responseType = "arraybuffer"), "POST" == this.method) try {
                this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
              } catch (t) {}
              "withCredentials" in e && (e.withCredentials = !0), this.hasXDR() ? (e.onload = function() {
                i.onLoad()
              }, e.onerror = function() {
                i.onError(e.responseText)
              }) : e.onreadystatechange = function() {
                4 == e.readyState && (200 == e.status || 1223 == e.status ? i.onLoad() : setTimeout(function() {
                  i.onError(e.status)
                }, 0))
              }, h("xhr data %s", this.data), e.send(this.data)
            } catch (t) {
              return void setTimeout(function() {
                i.onError(t)
              }, 0)
            }
            n.document && (this.index = r.requestsCount++, r.requests[this.index] = this)
          }, r.prototype.onSuccess = function() {
            this.emit("success"), this.cleanup()
          }, r.prototype.onData = function(t) {
            this.emit("data", t), this.onSuccess()
          }, r.prototype.onError = function(t) {
            this.emit("error", t), this.cleanup(!0)
          }, r.prototype.cleanup = function(t) {
            if ("undefined" != typeof this.xhr && null !== this.xhr) {
              if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = i : this.xhr.onreadystatechange = i, t) try {
                this.xhr.abort()
              } catch (t) {}
              n.document && delete r.requests[this.index], this.xhr = null
            }
          }, r.prototype.onLoad = function() {
            var t;
            try {
              var e;
              try {
                e = this.xhr.getResponseHeader("Content-Type").split(";")[0]
              } catch (t) {}
              t = "application/octet-stream" === e ? this.xhr.response : this.supportsBinary ? "ok" : this.xhr.responseText
            } catch (t) {
              this.onError(t)
            }
            null != t && this.onData(t)
          }, r.prototype.hasXDR = function() {
            return "undefined" != typeof n.XDomainRequest && !this.xs && this.enablesXDR
          }, r.prototype.abort = function() {
            this.cleanup()
          }, n.document && (r.requestsCount = 0, r.requests = {}, n.attachEvent ? n.attachEvent("onunload", s) : n.addEventListener && n.addEventListener("beforeunload", s, !1))
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        "./polling": 18,
        "component-emitter": 9,
        "component-inherit": 21,
        debug: 22,
        xmlhttprequest: 20
      }],
      18: [function(t, e, n) {
        function i(t) {
          var e = t && t.forceBase64;
          l && !e || (this.supportsBinary = !1), o.call(this, t)
        }
        var o = t("../transport"),
          r = t("parseqs"),
          s = t("engine.io-parser"),
          a = t("component-inherit"),
          c = t("debug")("engine.io-client:polling");
        e.exports = i;
        var l = function() {
          var e = t("xmlhttprequest"),
            n = new e({
              xdomain: !1
            });
          return null != n.responseType
        }();
        a(i, o), i.prototype.name = "polling", i.prototype.doOpen = function() {
          this.poll()
        }, i.prototype.pause = function(t) {
          function e() {
            c("paused"), n.readyState = "paused", t()
          }
          var n = this;
          if (this.readyState = "pausing", this.polling || !this.writable) {
            var i = 0;
            this.polling && (c("we are currently polling - waiting to pause"), i++, this.once("pollComplete", function() {
              c("pre-pause polling complete"), --i || e()
            })), this.writable || (c("we are currently writing - waiting to pause"), i++, this.once("drain", function() {
              c("pre-pause writing complete"), --i || e()
            }))
          } else e()
        }, i.prototype.poll = function() {
          c("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
        }, i.prototype.onData = function(t) {
          var e = this;
          c("polling got data %s", t);
          var n = function(t, n, i) {
            return "opening" == e.readyState && e.onOpen(), "close" == t.type ? (e.onClose(), !1) : void e.onPacket(t)
          };
          s.decodePayload(t, this.socket.binaryType, n), "closed" != this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" == this.readyState ? this.poll() : c('ignoring poll - transport state "%s"', this.readyState))
        }, i.prototype.doClose = function() {
          function t() {
            c("writing close packet"), e.write([{
              type: "close"
            }])
          }
          var e = this;
          "open" == this.readyState ? (c("transport open - closing"), t()) : (c("transport not open - deferring close"), this.once("open", t))
        }, i.prototype.write = function(t) {
          var e = this;
          this.writable = !1;
          var n = function() {
              e.writable = !0, e.emit("drain")
            },
            e = this;
          s.encodePayload(t, this.supportsBinary, function(t) {
            e.doWrite(t, n)
          })
        }, i.prototype.uri = function() {
          var t = this.query || {},
            e = this.secure ? "https" : "http",
            n = "";
          return !1 !== this.timestampRequests && (t[this.timestampParam] = +new Date + "-" + o.timestamps++), this.supportsBinary || t.sid || (t.b64 = 1), t = r.encode(t), this.port && ("https" == e && 443 != this.port || "http" == e && 80 != this.port) && (n = ":" + this.port), t.length && (t = "?" + t), e + "://" + this.hostname + n + this.path + t
        }
      }, {
        "../transport": 14,
        "component-inherit": 21,
        debug: 22,
        "engine.io-parser": 25,
        parseqs: 35,
        xmlhttprequest: 20
      }],
      19: [function(t, e, n) {
        function i(t) {
          var e = t && t.forceBase64;
          e && (this.supportsBinary = !1), o.call(this, t)
        }
        var o = t("../transport"),
          r = t("engine.io-parser"),
          s = t("parseqs"),
          a = t("component-inherit"),
          c = t("debug")("engine.io-client:websocket"),
          l = t("ws");
        e.exports = i, a(i, o), i.prototype.name = "websocket", i.prototype.supportsBinary = !0, i.prototype.doOpen = function() {
          if (this.check()) {
            var t = this.uri(),
              e = void 0,
              n = {
                agent: this.agent
              };
            n.pfx = this.pfx, n.key = this.key, n.passphrase = this.passphrase, n.cert = this.cert, n.ca = this.ca, n.ciphers = this.ciphers, n.rejectUnauthorized = this.rejectUnauthorized, this.ws = new l(t, e, n), void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.binaryType = "arraybuffer", this.addEventListeners();
          }
        }, i.prototype.addEventListeners = function() {
          var t = this;
          this.ws.onopen = function() {
            t.onOpen()
          }, this.ws.onclose = function() {
            t.onClose()
          }, this.ws.onmessage = function(e) {
            t.onData(e.data)
          }, this.ws.onerror = function(e) {
            t.onError("websocket error", e)
          }
        }, "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (i.prototype.onData = function(t) {
          var e = this;
          setTimeout(function() {
            o.prototype.onData.call(e, t)
          }, 0)
        }), i.prototype.write = function(t) {
          function e() {
            n.writable = !0, n.emit("drain")
          }
          var n = this;
          this.writable = !1;
          for (var i = 0, o = t.length; i < o; i++) r.encodePacket(t[i], this.supportsBinary, function(t) {
            try {
              n.ws.send(t)
            } catch (t) {
              c("websocket closed before onclose event")
            }
          });
          setTimeout(e, 0)
        }, i.prototype.onClose = function() {
          o.prototype.onClose.call(this)
        }, i.prototype.doClose = function() {
          "undefined" != typeof this.ws && this.ws.close()
        }, i.prototype.uri = function() {
          var t = this.query || {},
            e = this.secure ? "wss" : "ws",
            n = "";
          return this.port && ("wss" == e && 443 != this.port || "ws" == e && 80 != this.port) && (n = ":" + this.port), this.timestampRequests && (t[this.timestampParam] = +new Date), this.supportsBinary || (t.b64 = 1), t = s.encode(t), t.length && (t = "?" + t), e + "://" + this.hostname + n + this.path + t
        }, i.prototype.check = function() {
          return !(!l || "__initialize" in l && this.name === i.prototype.name)
        }
      }, {
        "../transport": 14,
        "component-inherit": 21,
        debug: 22,
        "engine.io-parser": 25,
        parseqs: 35,
        ws: 37
      }],
      20: [function(t, e, n) {
        var i = t("has-cors");
        e.exports = function(t) {
          var e = t.xdomain,
            n = t.xscheme,
            o = t.enablesXDR;
          try {
            if ("undefined" != typeof XMLHttpRequest && (!e || i)) return new XMLHttpRequest
          } catch (t) {}
          try {
            if ("undefined" != typeof XDomainRequest && !n && o) return new XDomainRequest
          } catch (t) {}
          if (!e) try {
            return new ActiveXObject("Microsoft.XMLHTTP")
          } catch (t) {}
        }
      }, {
        "has-cors": 40
      }],
      21: [function(t, e, n) {
        e.exports = function(t, e) {
          var n = function() {};
          n.prototype = e.prototype, t.prototype = new n, t.prototype.constructor = t
        }
      }, {}],
      22: [function(t, e, n) {
        function i() {
          return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
        }

        function o() {
          var t = arguments,
            e = this.useColors;
          if (t[0] = (e ? "%c" : "") + this.namespace + (e ? " %c" : " ") + t[0] + (e ? "%c " : " ") + "+" + n.humanize(this.diff), !e) return t;
          var i = "color: " + this.color;
          t = [t[0], i, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
          var o = 0,
            r = 0;
          return t[0].replace(/%[a-z%]/g, function(t) {
            "%" !== t && (o++, "%c" === t && (r = o))
          }), t.splice(r, 0, i), t
        }

        function r() {
          return "object" == typeof console && "function" == typeof console.log && Function.prototype.apply.call(console.log, console, arguments)
        }

        function s(t) {
          try {
            null == t ? localStorage.removeItem("debug") : localStorage.debug = t
          } catch (t) {}
        }

        function a() {
          var t;
          try {
            t = localStorage.debug
          } catch (t) {}
          return t
        }
        n = e.exports = t("./debug"), n.log = r, n.formatArgs = o, n.save = s, n.load = a, n.useColors = i, n.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], n.formatters.j = function(t) {
          return JSON.stringify(t)
        }, n.enable(a())
      }, {
        "./debug": 23
      }],
      23: [function(t, e, n) {
        function i() {
          return n.colors[u++ % n.colors.length]
        }

        function o(t) {
          function e() {}

          function o() {
            var t = o,
              e = +new Date,
              r = e - (l || e);
            t.diff = r, t.prev = l, t.curr = e, l = e, null == t.useColors && (t.useColors = n.useColors()), null == t.color && t.useColors && (t.color = i());
            var s = Array.prototype.slice.call(arguments);
            s[0] = n.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));
            var a = 0;
            s[0] = s[0].replace(/%([a-z%])/g, function(e, i) {
              if ("%" === e) return e;
              a++;
              var o = n.formatters[i];
              if ("function" == typeof o) {
                var r = s[a];
                e = o.call(t, r), s.splice(a, 1), a--
              }
              return e
            }), "function" == typeof n.formatArgs && (s = n.formatArgs.apply(t, s));
            var c = o.log || n.log || console.log.bind(console);
            c.apply(t, s)
          }
          e.enabled = !1, o.enabled = !0;
          var r = n.enabled(t) ? o : e;
          return r.namespace = t, r
        }

        function r(t) {
          n.save(t);
          for (var e = (t || "").split(/[\s,]+/), i = e.length, o = 0; o < i; o++) e[o] && (t = e[o].replace(/\*/g, ".*?"), "-" === t[0] ? n.skips.push(new RegExp("^" + t.substr(1) + "$")) : n.names.push(new RegExp("^" + t + "$")))
        }

        function s() {
          n.enable("")
        }

        function a(t) {
          var e, i;
          for (e = 0, i = n.skips.length; e < i; e++)
            if (n.skips[e].test(t)) return !1;
          for (e = 0, i = n.names.length; e < i; e++)
            if (n.names[e].test(t)) return !0;
          return !1
        }

        function c(t) {
          return t instanceof Error ? t.stack || t.message : t
        }
        n = e.exports = o, n.coerce = c, n.disable = s, n.enable = r, n.enabled = a, n.humanize = t("ms"), n.names = [], n.skips = [], n.formatters = {};
        var l, u = 0
      }, {
        ms: 24
      }],
      24: [function(t, e, n) {
        function i(t) {
          var e = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(t);
          if (e) {
            var n = parseFloat(e[1]),
              i = (e[2] || "ms").toLowerCase();
            switch (i) {
              case "years":
              case "year":
              case "y":
                return n * h;
              case "days":
              case "day":
              case "d":
                return n * u;
              case "hours":
              case "hour":
              case "h":
                return n * l;
              case "minutes":
              case "minute":
              case "m":
                return n * c;
              case "seconds":
              case "second":
              case "s":
                return n * a;
              case "ms":
                return n
            }
          }
        }

        function o(t) {
          return t >= u ? Math.round(t / u) + "d" : t >= l ? Math.round(t / l) + "h" : t >= c ? Math.round(t / c) + "m" : t >= a ? Math.round(t / a) + "s" : t + "ms"
        }

        function r(t) {
          return s(t, u, "day") || s(t, l, "hour") || s(t, c, "minute") || s(t, a, "second") || t + " ms"
        }

        function s(t, e, n) {
          if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + n : Math.ceil(t / e) + " " + n + "s"
        }
        var a = 1e3,
          c = 60 * a,
          l = 60 * c,
          u = 24 * l,
          h = 365.25 * u;
        e.exports = function(t, e) {
          return e = e || {}, "string" == typeof t ? i(t) : e.long ? r(t) : o(t)
        }
      }, {}],
      25: [function(t, e, n) {
        (function(e) {
          function i(t, e) {
            var i = "b" + n.packets[t.type] + t.data.data;
            return e(i)
          }

          function o(t, e, i) {
            if (!e) return n.encodeBase64Packet(t, i);
            var o = t.data,
              r = new Uint8Array(o),
              s = new Uint8Array(1 + o.byteLength);
            s[0] = y[t.type];
            for (var a = 0; a < r.length; a++) s[a + 1] = r[a];
            return i(s.buffer)
          }

          function r(t, e, i) {
            if (!e) return n.encodeBase64Packet(t, i);
            var o = new FileReader;
            return o.onload = function() {
              t.data = o.result, n.encodePacket(t, e, !0, i)
            }, o.readAsArrayBuffer(t.data)
          }

          function s(t, e, i) {
            if (!e) return n.encodeBase64Packet(t, i);
            if (m) return r(t, e, i);
            var o = new Uint8Array(1);
            o[0] = y[t.type];
            var s = new w([o.buffer, t.data]);
            return i(s)
          }

          function a(t, e, n) {
            for (var i = new Array(t.length), o = p(t.length, n), r = function(t, n, o) {
                e(n, function(e, n) {
                  i[t] = n, o(e, i)
                })
              }, s = 0; s < t.length; s++) r(s, t[s], o)
          }
          var c = t("./keys"),
            l = t("has-binary"),
            u = t("arraybuffer.slice"),
            h = t("base64-arraybuffer"),
            p = t("after"),
            d = t("utf8"),
            f = navigator.userAgent.match(/Android/i),
            g = /PhantomJS/i.test(navigator.userAgent),
            m = f || g;
          n.protocol = 3;
          var y = n.packets = {
              open: 0,
              close: 1,
              ping: 2,
              pong: 3,
              message: 4,
              upgrade: 5,
              noop: 6
            },
            v = c(y),
            b = {
              type: "error",
              data: "parser error"
            },
            w = t("blob");
          n.encodePacket = function(t, n, r, a) {
            "function" == typeof n && (a = n, n = !1), "function" == typeof r && (a = r, r = null);
            var c = void 0 === t.data ? void 0 : t.data.buffer || t.data;
            if (e.ArrayBuffer && c instanceof ArrayBuffer) return o(t, n, a);
            if (w && c instanceof e.Blob) return s(t, n, a);
            if (c && c.base64) return i(t, a);
            var l = y[t.type];
            return void 0 !== t.data && (l += r ? d.encode(String(t.data)) : String(t.data)), a("" + l)
          }, n.encodeBase64Packet = function(t, i) {
            var o = "b" + n.packets[t.type];
            if (w && t.data instanceof w) {
              var r = new FileReader;
              return r.onload = function() {
                var t = r.result.split(",")[1];
                i(o + t)
              }, r.readAsDataURL(t.data)
            }
            var s;
            try {
              s = String.fromCharCode.apply(null, new Uint8Array(t.data))
            } catch (e) {
              for (var a = new Uint8Array(t.data), c = new Array(a.length), l = 0; l < a.length; l++) c[l] = a[l];
              s = String.fromCharCode.apply(null, c)
            }
            return o += e.btoa(s), i(o)
          }, n.decodePacket = function(t, e, i) {
            if ("string" == typeof t || void 0 === t) {
              if ("b" == t.charAt(0)) return n.decodeBase64Packet(t.substr(1), e);
              if (i) try {
                t = d.decode(t)
              } catch (t) {
                return b
              }
              var o = t.charAt(0);
              return Number(o) == o && v[o] ? t.length > 1 ? {
                type: v[o],
                data: t.substring(1)
              } : {
                type: v[o]
              } : b
            }
            var r = new Uint8Array(t),
              o = r[0],
              s = u(t, 1);
            return w && "blob" === e && (s = new w([s])), {
              type: v[o],
              data: s
            }
          }, n.decodeBase64Packet = function(t, n) {
            var i = v[t.charAt(0)];
            if (!e.ArrayBuffer) return {
              type: i,
              data: {
                base64: !0,
                data: t.substr(1)
              }
            };
            var o = h.decode(t.substr(1));
            return "blob" === n && w && (o = new w([o])), {
              type: i,
              data: o
            }
          }, n.encodePayload = function(t, e, i) {
            function o(t) {
              return t.length + ":" + t
            }

            function r(t, i) {
              n.encodePacket(t, !!s && e, !0, function(t) {
                i(null, o(t))
              })
            }
            "function" == typeof e && (i = e, e = null);
            var s = l(t);
            return e && s ? w && !m ? n.encodePayloadAsBlob(t, i) : n.encodePayloadAsArrayBuffer(t, i) : t.length ? void a(t, r, function(t, e) {
              return i(e.join(""))
            }) : i("0:")
          }, n.decodePayload = function(t, e, i) {
            if ("string" != typeof t) return n.decodePayloadAsBinary(t, e, i);
            "function" == typeof e && (i = e, e = null);
            var o;
            if ("" == t) return i(b, 0, 1);
            for (var r, s, a = "", c = 0, l = t.length; c < l; c++) {
              var u = t.charAt(c);
              if (":" != u) a += u;
              else {
                if ("" == a || a != (r = Number(a))) return i(b, 0, 1);
                if (s = t.substr(c + 1, r), a != s.length) return i(b, 0, 1);
                if (s.length) {
                  if (o = n.decodePacket(s, e, !0), b.type == o.type && b.data == o.data) return i(b, 0, 1);
                  var h = i(o, c + r, l);
                  if (!1 === h) return
                }
                c += r, a = ""
              }
            }
            return "" != a ? i(b, 0, 1) : void 0
          }, n.encodePayloadAsArrayBuffer = function(t, e) {
            function i(t, e) {
              n.encodePacket(t, !0, !0, function(t) {
                return e(null, t)
              })
            }
            return t.length ? void a(t, i, function(t, n) {
              var i = n.reduce(function(t, e) {
                  var n;
                  return n = "string" == typeof e ? e.length : e.byteLength, t + n.toString().length + n + 2
                }, 0),
                o = new Uint8Array(i),
                r = 0;
              return n.forEach(function(t) {
                var e = "string" == typeof t,
                  n = t;
                if (e) {
                  for (var i = new Uint8Array(t.length), s = 0; s < t.length; s++) i[s] = t.charCodeAt(s);
                  n = i.buffer
                }
                e ? o[r++] = 0 : o[r++] = 1;
                for (var a = n.byteLength.toString(), s = 0; s < a.length; s++) o[r++] = parseInt(a[s]);
                o[r++] = 255;
                for (var i = new Uint8Array(n), s = 0; s < i.length; s++) o[r++] = i[s]
              }), e(o.buffer)
            }) : e(new ArrayBuffer(0))
          }, n.encodePayloadAsBlob = function(t, e) {
            function i(t, e) {
              n.encodePacket(t, !0, !0, function(t) {
                var n = new Uint8Array(1);
                if (n[0] = 1, "string" == typeof t) {
                  for (var i = new Uint8Array(t.length), o = 0; o < t.length; o++) i[o] = t.charCodeAt(o);
                  t = i.buffer, n[0] = 0
                }
                for (var r = t instanceof ArrayBuffer ? t.byteLength : t.size, s = r.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++) a[o] = parseInt(s[o]);
                if (a[s.length] = 255, w) {
                  var c = new w([n.buffer, a.buffer, t]);
                  e(null, c)
                }
              })
            }
            a(t, i, function(t, n) {
              return e(new w(n))
            })
          }, n.decodePayloadAsBinary = function(t, e, i) {
            "function" == typeof e && (i = e, e = null);
            for (var o = t, r = [], s = !1; o.byteLength > 0;) {
              for (var a = new Uint8Array(o), c = 0 === a[0], l = "", h = 1; 255 != a[h]; h++) {
                if (l.length > 310) {
                  s = !0;
                  break
                }
                l += a[h]
              }
              if (s) return i(b, 0, 1);
              o = u(o, 2 + l.length), l = parseInt(l);
              var p = u(o, 0, l);
              if (c) try {
                p = String.fromCharCode.apply(null, new Uint8Array(p))
              } catch (t) {
                var d = new Uint8Array(p);
                p = "";
                for (var h = 0; h < d.length; h++) p += String.fromCharCode(d[h])
              }
              r.push(p), o = u(o, l)
            }
            var f = r.length;
            r.forEach(function(t, o) {
              i(n.decodePacket(t, e, !0), o, f)
            })
          }
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        "./keys": 26,
        after: 27,
        "arraybuffer.slice": 28,
        "base64-arraybuffer": 29,
        blob: 30,
        "has-binary": 31,
        utf8: 33
      }],
      26: [function(t, e, n) {
        e.exports = Object.keys || function(t) {
          var e = [],
            n = Object.prototype.hasOwnProperty;
          for (var i in t) n.call(t, i) && e.push(i);
          return e
        }
      }, {}],
      27: [function(t, e, n) {
        function i(t, e, n) {
          function i(t, o) {
            if (i.count <= 0) throw new Error("after called too many times");
            --i.count, t ? (r = !0, e(t), e = n) : 0 !== i.count || r || e(null, o)
          }
          var r = !1;
          return n = n || o, i.count = t, 0 === t ? e() : i
        }

        function o() {}
        e.exports = i
      }, {}],
      28: [function(t, e, n) {
        e.exports = function(t, e, n) {
          var i = t.byteLength;
          if (e = e || 0, n = n || i, t.slice) return t.slice(e, n);
          if (e < 0 && (e += i), n < 0 && (n += i), n > i && (n = i), e >= i || e >= n || 0 === i) return new ArrayBuffer(0);
          for (var o = new Uint8Array(t), r = new Uint8Array(n - e), s = e, a = 0; s < n; s++, a++) r[a] = o[s];
          return r.buffer
        }
      }, {}],
      29: [function(t, e, n) {
        ! function(t) {
          "use strict";
          n.encode = function(e) {
            var n, i = new Uint8Array(e),
              o = i.length,
              r = "";
            for (n = 0; n < o; n += 3) r += t[i[n] >> 2], r += t[(3 & i[n]) << 4 | i[n + 1] >> 4], r += t[(15 & i[n + 1]) << 2 | i[n + 2] >> 6], r += t[63 & i[n + 2]];
            return o % 3 === 2 ? r = r.substring(0, r.length - 1) + "=" : o % 3 === 1 && (r = r.substring(0, r.length - 2) + "=="), r
          }, n.decode = function(e) {
            var n, i, o, r, s, a = .75 * e.length,
              c = e.length,
              l = 0;
            "=" === e[e.length - 1] && (a--, "=" === e[e.length - 2] && a--);
            var u = new ArrayBuffer(a),
              h = new Uint8Array(u);
            for (n = 0; n < c; n += 4) i = t.indexOf(e[n]), o = t.indexOf(e[n + 1]), r = t.indexOf(e[n + 2]), s = t.indexOf(e[n + 3]), h[l++] = i << 2 | o >> 4, h[l++] = (15 & o) << 4 | r >> 2, h[l++] = (3 & r) << 6 | 63 & s;
            return u
          }
        }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
      }, {}],
      30: [function(t, e, n) {
        (function(t) {
          function n(t, e) {
            e = e || {};
            for (var n = new i, o = 0; o < t.length; o++) n.append(t[o]);
            return e.type ? n.getBlob(e.type) : n.getBlob()
          }
          var i = t.BlobBuilder || t.WebKitBlobBuilder || t.MSBlobBuilder || t.MozBlobBuilder,
            o = function() {
              try {
                var t = new Blob(["hi"]);
                return 2 == t.size
              } catch (t) {
                return !1
              }
            }(),
            r = i && i.prototype.append && i.prototype.getBlob;
          e.exports = function() {
            return o ? t.Blob : r ? n : void 0
          }()
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {}],
      31: [function(t, e, n) {
        (function(n) {
          function i(t) {
            function e(t) {
              if (!t) return !1;
              if (n.Buffer && n.Buffer.isBuffer(t) || n.ArrayBuffer && t instanceof ArrayBuffer || n.Blob && t instanceof Blob || n.File && t instanceof File) return !0;
              if (o(t)) {
                for (var i = 0; i < t.length; i++)
                  if (e(t[i])) return !0
              } else if (t && "object" == typeof t) {
                t.toJSON && (t = t.toJSON());
                for (var r in t)
                  if (t.hasOwnProperty(r) && e(t[r])) return !0
              }
              return !1
            }
            return e(t)
          }
          var o = t("isarray");
          e.exports = i
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        isarray: 32
      }],
      32: [function(t, e, n) {
        e.exports = Array.isArray || function(t) {
          return "[object Array]" == Object.prototype.toString.call(t)
        }
      }, {}],
      33: [function(e, n, i) {
        (function(e) {
          ! function(o) {
            function r(t) {
              for (var e, n, i = [], o = 0, r = t.length; o < r;) e = t.charCodeAt(o++), e >= 55296 && e <= 56319 && o < r ? (n = t.charCodeAt(o++), 56320 == (64512 & n) ? i.push(((1023 & e) << 10) + (1023 & n) + 65536) : (i.push(e), o--)) : i.push(e);
              return i
            }

            function s(t) {
              for (var e, n = t.length, i = -1, o = ""; ++i < n;) e = t[i], e > 65535 && (e -= 65536, o += b(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += b(e);
              return o
            }

            function a(t, e) {
              return b(t >> e & 63 | 128)
            }

            function c(t) {
              if (0 == (4294967168 & t)) return b(t);
              var e = "";
              return 0 == (4294965248 & t) ? e = b(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (e = b(t >> 12 & 15 | 224), e += a(t, 6)) : 0 == (4292870144 & t) && (e = b(t >> 18 & 7 | 240), e += a(t, 12), e += a(t, 6)), e += b(63 & t | 128)
            }

            function l(t) {
              for (var e, n = r(t), i = n.length, o = -1, s = ""; ++o < i;) e = n[o], s += c(e);
              return s
            }

            function u() {
              if (v >= y) throw Error("Invalid byte index");
              var t = 255 & m[v];
              if (v++, 128 == (192 & t)) return 63 & t;
              throw Error("Invalid continuation byte")
            }

            function h() {
              var t, e, n, i, o;
              if (v > y) throw Error("Invalid byte index");
              if (v == y) return !1;
              if (t = 255 & m[v], v++, 0 == (128 & t)) return t;
              if (192 == (224 & t)) {
                var e = u();
                if (o = (31 & t) << 6 | e, o >= 128) return o;
                throw Error("Invalid continuation byte")
              }
              if (224 == (240 & t)) {
                if (e = u(), n = u(), o = (15 & t) << 12 | e << 6 | n, o >= 2048) return o;
                throw Error("Invalid continuation byte")
              }
              if (240 == (248 & t) && (e = u(), n = u(), i = u(), o = (15 & t) << 18 | e << 12 | n << 6 | i, o >= 65536 && o <= 1114111)) return o;
              throw Error("Invalid UTF-8 detected")
            }

            function p(t) {
              m = r(t), y = m.length, v = 0;
              for (var e, n = [];
                (e = h()) !== !1;) n.push(e);
              return s(n)
            }
            var d = "object" == typeof i && i,
              f = "object" == typeof n && n && n.exports == d && n,
              g = "object" == typeof e && e;
            g.global !== g && g.window !== g || (o = g);
            var m, y, v, b = String.fromCharCode,
              w = {
                version: "2.0.0",
                encode: l,
                decode: p
              };
            if ("function" == typeof t && "object" == typeof t.amd && t.amd) t(function() {
              return w
            });
            else if (d && !d.nodeType)
              if (f) f.exports = w;
              else {
                var A = {},
                  x = A.hasOwnProperty;
                for (var C in w) x.call(w, C) && (d[C] = w[C])
              } else o.utf8 = w
          }(this)
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {}],
      34: [function(t, e, n) {
        (function(t) {
          var n = /^[\],:{}\s]*$/,
            i = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            o = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            r = /(?:^|:|,)(?:\s*\[)+/g,
            s = /^\s+/,
            a = /\s+$/;
          e.exports = function(e) {
            return "string" == typeof e && e ? (e = e.replace(s, "").replace(a, ""), t.JSON && JSON.parse ? JSON.parse(e) : n.test(e.replace(i, "@").replace(o, "]").replace(r, "")) ? new Function("return " + e)() : void 0) : null
          }
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {}],
      35: [function(t, e, n) {
        n.encode = function(t) {
          var e = "";
          for (var n in t) t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
          return e
        }, n.decode = function(t) {
          for (var e = {}, n = t.split("&"), i = 0, o = n.length; i < o; i++) {
            var r = n[i].split("=");
            e[decodeURIComponent(r[0])] = decodeURIComponent(r[1])
          }
          return e
        }
      }, {}],
      36: [function(t, e, n) {
        var i = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
          o = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        e.exports = function(t) {
          var e = t,
            n = t.indexOf("["),
            r = t.indexOf("]");
          n != -1 && r != -1 && (t = t.substring(0, n) + t.substring(n, r).replace(/:/g, ";") + t.substring(r, t.length));
          for (var s = i.exec(t || ""), a = {}, c = 14; c--;) a[o[c]] = s[c] || "";
          return n != -1 && r != -1 && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a
        }
      }, {}],
      37: [function(t, e, n) {
        function i(t, e, n) {
          var i;
          return i = e ? new r(t, e) : new r(t)
        }
        var o = function() {
            return this
          }(),
          r = o.WebSocket || o.MozWebSocket;
        e.exports = r ? i : null, r && (i.prototype = r.prototype)
      }, {}],
      38: [function(t, e, n) {
        (function(n) {
          function i(t) {
            function e(t) {
              if (!t) return !1;
              if (n.Buffer && n.Buffer.isBuffer(t) || n.ArrayBuffer && t instanceof ArrayBuffer || n.Blob && t instanceof Blob || n.File && t instanceof File) return !0;
              if (o(t)) {
                for (var i = 0; i < t.length; i++)
                  if (e(t[i])) return !0
              } else if (t && "object" == typeof t) {
                t.toJSON && (t = t.toJSON());
                for (var r in t)
                  if (Object.prototype.hasOwnProperty.call(t, r) && e(t[r])) return !0
              }
              return !1
            }
            return e(t)
          }
          var o = t("isarray");
          e.exports = i
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        isarray: 39
      }],
      39: [function(t, e, n) {
        e.exports = t(32)
      }, {}],
      40: [function(t, e, n) {
        var i = t("global");
        try {
          e.exports = "XMLHttpRequest" in i && "withCredentials" in new i.XMLHttpRequest
        } catch (t) {
          e.exports = !1
        }
      }, {
        global: 41
      }],
      41: [function(t, e, n) {
        e.exports = function() {
          return this
        }()
      }, {}],
      42: [function(t, e, n) {
        var i = [].indexOf;
        e.exports = function(t, e) {
          if (i) return t.indexOf(e);
          for (var n = 0; n < t.length; ++n)
            if (t[n] === e) return n;
          return -1
        }
      }, {}],
      43: [function(t, e, n) {
        var i = Object.prototype.hasOwnProperty;
        n.keys = Object.keys || function(t) {
          var e = [];
          for (var n in t) i.call(t, n) && e.push(n);
          return e
        }, n.values = function(t) {
          var e = [];
          for (var n in t) i.call(t, n) && e.push(t[n]);
          return e
        }, n.merge = function(t, e) {
          for (var n in e) i.call(e, n) && (t[n] = e[n]);
          return t
        }, n.length = function(t) {
          return n.keys(t).length
        }, n.isEmpty = function(t) {
          return 0 == n.length(t)
        }
      }, {}],
      44: [function(t, e, n) {
        var i = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
          o = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        e.exports = function(t) {
          for (var e = i.exec(t || ""), n = {}, r = 14; r--;) n[o[r]] = e[r] || "";
          return n
        }
      }, {}],
      45: [function(t, e, n) {
        (function(e) {
          var i = t("isarray"),
            o = t("./is-buffer");
          n.deconstructPacket = function(t) {
            function e(t) {
              if (!t) return t;
              if (o(t)) {
                var r = {
                  _placeholder: !0,
                  num: n.length
                };
                return n.push(t), r
              }
              if (i(t)) {
                for (var s = new Array(t.length), a = 0; a < t.length; a++) s[a] = e(t[a]);
                return s
              }
              if ("object" == typeof t && !(t instanceof Date)) {
                var s = {};
                for (var c in t) s[c] = e(t[c]);
                return s
              }
              return t
            }
            var n = [],
              r = t.data,
              s = t;
            return s.data = e(r), s.attachments = n.length, {
              packet: s,
              buffers: n
            }
          }, n.reconstructPacket = function(t, e) {
            function n(t) {
              if (t && t._placeholder) {
                var o = e[t.num];
                return o
              }
              if (i(t)) {
                for (var r = 0; r < t.length; r++) t[r] = n(t[r]);
                return t
              }
              if (t && "object" == typeof t) {
                for (var s in t) t[s] = n(t[s]);
                return t
              }
              return t
            }
            return t.data = n(t.data), t.attachments = void 0, t
          }, n.removeBlobs = function(t, n) {
            function r(t, c, l) {
              if (!t) return t;
              if (e.Blob && t instanceof Blob || e.File && t instanceof File) {
                s++;
                var u = new FileReader;
                u.onload = function() {
                  l ? l[c] = this.result : a = this.result, --s || n(a)
                }, u.readAsArrayBuffer(t)
              } else if (i(t))
                for (var h = 0; h < t.length; h++) r(t[h], h, t);
              else if (t && "object" == typeof t && !o(t))
                for (var p in t) r(t[p], p, t)
            }
            var s = 0,
              a = t;
            r(a), s || n(a)
          }
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        "./is-buffer": 47,
        isarray: 48
      }],
      46: [function(t, e, n) {
        function i() {}

        function o(t) {
          var e = "",
            i = !1;
          return e += t.type, n.BINARY_EVENT != t.type && n.BINARY_ACK != t.type || (e += t.attachments, e += "-"), t.nsp && "/" != t.nsp && (i = !0, e += t.nsp), null != t.id && (i && (e += ",", i = !1), e += t.id), null != t.data && (i && (e += ","), e += h.stringify(t.data)), u("encoded %j as %s", t, e), e
        }

        function r(t, e) {
          function n(t) {
            var n = d.deconstructPacket(t),
              i = o(n.packet),
              r = n.buffers;
            r.unshift(i), e(r)
          }
          d.removeBlobs(t, n)
        }

        function s() {
          this.reconstructor = null
        }

        function a(t) {
          var e = {},
            i = 0;
          if (e.type = Number(t.charAt(0)), null == n.types[e.type]) return l();
          if (n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type) {
            for (var o = "";
              "-" != t.charAt(++i) && (o += t.charAt(i), i + 1 != t.length););
            if (o != Number(o) || "-" != t.charAt(i)) throw new Error("Illegal attachments");
            e.attachments = Number(o)
          }
          if ("/" == t.charAt(i + 1))
            for (e.nsp = ""; ++i;) {
              var r = t.charAt(i);
              if ("," == r) break;
              if (e.nsp += r, i + 1 == t.length) break
            } else e.nsp = "/";
          var s = t.charAt(i + 1);
          if ("" !== s && Number(s) == s) {
            for (e.id = ""; ++i;) {
              var r = t.charAt(i);
              if (null == r || Number(r) != r) {
                --i;
                break
              }
              if (e.id += t.charAt(i), i + 1 == t.length) break
            }
            e.id = Number(e.id)
          }
          if (t.charAt(++i)) try {
            e.data = h.parse(t.substr(i))
          } catch (t) {
            return l()
          }
          return u("decoded %s as %j", t, e), e
        }

        function c(t) {
          this.reconPack = t, this.buffers = []
        }

        function l(t) {
          return {
            type: n.ERROR,
            data: "parser error"
          }
        }
        var u = t("debug")("socket.io-parser"),
          h = t("json3"),
          p = (t("isarray"), t("component-emitter")),
          d = t("./binary"),
          f = t("./is-buffer");
        n.protocol = 4, n.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"], n.CONNECT = 0, n.DISCONNECT = 1, n.EVENT = 2, n.ACK = 3, n.ERROR = 4, n.BINARY_EVENT = 5, n.BINARY_ACK = 6, n.Encoder = i, n.Decoder = s, i.prototype.encode = function(t, e) {
          if (u("encoding packet %j", t), n.BINARY_EVENT == t.type || n.BINARY_ACK == t.type) r(t, e);
          else {
            var i = o(t);
            e([i])
          }
        }, p(s.prototype), s.prototype.add = function(t) {
          var e;
          if ("string" == typeof t) e = a(t), n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type ? (this.reconstructor = new c(e), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", e)) : this.emit("decoded", e);
          else {
            if (!f(t) && !t.base64) throw new Error("Unknown type: " + t);
            if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
            e = this.reconstructor.takeBinaryData(t), e && (this.reconstructor = null, this.emit("decoded", e))
          }
        }, s.prototype.destroy = function() {
          this.reconstructor && this.reconstructor.finishedReconstruction()
        }, c.prototype.takeBinaryData = function(t) {
          if (this.buffers.push(t), this.buffers.length == this.reconPack.attachments) {
            var e = d.reconstructPacket(this.reconPack, this.buffers);
            return this.finishedReconstruction(), e
          }
          return null
        }, c.prototype.finishedReconstruction = function() {
          this.reconPack = null, this.buffers = []
        }
      }, {
        "./binary": 45,
        "./is-buffer": 47,
        "component-emitter": 9,
        debug: 10,
        isarray: 48,
        json3: 49
      }],
      47: [function(t, e, n) {
        (function(t) {
          function n(e) {
            return t.Buffer && t.Buffer.isBuffer(e) || t.ArrayBuffer && e instanceof ArrayBuffer
          }
          e.exports = n
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {}],
      48: [function(t, e, n) {
        e.exports = t(32)
      }, {}],
      49: [function(e, n, i) {
        ! function(e) {
          function n(t) {
            if (n[t] !== s) return n[t];
            var e;
            if ("bug-string-char-index" == t) e = "a" != "a" [0];
            else if ("json" == t) e = n("json-stringify") && n("json-parse");
            else {
              var i, o = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
              if ("json-stringify" == t) {
                var r = u.stringify,
                  c = "function" == typeof r && h;
                if (c) {
                  (i = function() {
                    return 1
                  }).toJSON = i;
                  try {
                    c = "0" === r(0) && "0" === r(new Number) && '""' == r(new String) && r(a) === s && r(s) === s && r() === s && "1" === r(i) && "[1]" == r([i]) && "[null]" == r([s]) && "null" == r(null) && "[null,null,null]" == r([s, a, null]) && r({
                      a: [i, !0, !1, null, "\0\b\n\f\r\t"]
                    }) == o && "1" === r(null, i) && "[\n 1,\n 2\n]" == r([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == r(new Date(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == r(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == r(new Date(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == r(new Date(-1))
                  } catch (t) {
                    c = !1
                  }
                }
                e = c
              }
              if ("json-parse" == t) {
                var l = u.parse;
                if ("function" == typeof l) try {
                  if (0 === l("0") && !l(!1)) {
                    i = l(o);
                    var p = 5 == i.a.length && 1 === i.a[0];
                    if (p) {
                      try {
                        p = !l('"\t"')
                      } catch (t) {}
                      if (p) try {
                        p = 1 !== l("01")
                      } catch (t) {}
                      if (p) try {
                        p = 1 !== l("1.")
                      } catch (t) {}
                    }
                  }
                } catch (t) {
                  p = !1
                }
                e = p
              }
            }
            return n[t] = !!e
          }
          var o, r, s, a = {}.toString,
            c = "function" == typeof t && t.amd,
            l = "object" == typeof JSON && JSON,
            u = "object" == typeof i && i && !i.nodeType && i;
          u && l ? (u.stringify = l.stringify, u.parse = l.parse) : u = e.JSON = l || {};
          var h = new Date(-0xc782b5b800cec);
          try {
            h = h.getUTCFullYear() == -109252 && 0 === h.getUTCMonth() && 1 === h.getUTCDate() && 10 == h.getUTCHours() && 37 == h.getUTCMinutes() && 6 == h.getUTCSeconds() && 708 == h.getUTCMilliseconds()
          } catch (t) {}
          if (!n("json")) {
            var p = "[object Function]",
              d = "[object Date]",
              f = "[object Number]",
              g = "[object String]",
              m = "[object Array]",
              y = "[object Boolean]",
              v = n("bug-string-char-index");
            if (!h) var b = Math.floor,
              w = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
              A = function(t, e) {
                return w[e] + 365 * (t - 1970) + b((t - 1969 + (e = +(e > 1))) / 4) - b((t - 1901 + e) / 100) + b((t - 1601 + e) / 400)
              };
            (o = {}.hasOwnProperty) || (o = function(t) {
              var e, n = {};
              return (n.__proto__ = null, n.__proto__ = {
                toString: 1
              }, n).toString != a ? o = function(t) {
                var e = this.__proto__,
                  n = t in (this.__proto__ = null, this);
                return this.__proto__ = e, n
              } : (e = n.constructor, o = function(t) {
                var n = (this.constructor || e).prototype;
                return t in this && !(t in n && this[t] === n[t])
              }), n = null, o.call(this, t)
            });
            var x = {
                boolean: 1,
                number: 1,
                string: 1,
                undefined: 1
              },
              C = function(t, e) {
                var n = typeof t[e];
                return "object" == n ? !!t[e] : !x[n]
              };
            if (r = function(t, e) {
                var n, i, s, c = 0;
                (n = function() {
                  this.valueOf = 0
                }).prototype.valueOf = 0, i = new n;
                for (s in i) o.call(i, s) && c++;
                return n = i = null, c ? r = 2 == c ? function(t, e) {
                  var n, i = {},
                    r = a.call(t) == p;
                  for (n in t) r && "prototype" == n || o.call(i, n) || !(i[n] = 1) || !o.call(t, n) || e(n)
                } : function(t, e) {
                  var n, i, r = a.call(t) == p;
                  for (n in t) r && "prototype" == n || !o.call(t, n) || (i = "constructor" === n) || e(n);
                  (i || o.call(t, n = "constructor")) && e(n)
                } : (i = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], r = function(t, e) {
                  var n, r, s = a.call(t) == p,
                    c = !s && "function" != typeof t.constructor && C(t, "hasOwnProperty") ? t.hasOwnProperty : o;
                  for (n in t) s && "prototype" == n || !c.call(t, n) || e(n);
                  for (r = i.length; n = i[--r]; c.call(t, n) && e(n));
                }), r(t, e)
              }, !n("json-stringify")) {
              var k = {
                  92: "\\\\",
                  34: '\\"',
                  8: "\\b",
                  12: "\\f",
                  10: "\\n",
                  13: "\\r",
                  9: "\\t"
                },
                T = "000000",
                E = function(t, e) {
                  return (T + (e || 0)).slice(-t)
                },
                S = "\\u00",
                _ = function(t) {
                  var e, n = '"',
                    i = 0,
                    o = t.length,
                    r = o > 10 && v;
                  for (r && (e = t.split("")); i < o; i++) {
                    var s = t.charCodeAt(i);
                    switch (s) {
                      case 8:
                      case 9:
                      case 10:
                      case 12:
                      case 13:
                      case 34:
                      case 92:
                        n += k[s];
                        break;
                      default:
                        if (s < 32) {
                          n += S + E(2, s.toString(16));
                          break
                        }
                        n += r ? e[i] : v ? t.charAt(i) : t[i]
                    }
                  }
                  return n + '"'
                },
                $ = function(t, e, n, i, c, l, u) {
                  var h, p, v, w, x, C, k, T, S, D, N, j, I, B, R, O;
                  try {
                    h = e[t]
                  } catch (t) {}
                  if ("object" == typeof h && h)
                    if (p = a.call(h), p != d || o.call(h, "toJSON")) "function" == typeof h.toJSON && (p != f && p != g && p != m || o.call(h, "toJSON")) && (h = h.toJSON(t));
                    else if (h > -1 / 0 && h < 1 / 0) {
                    if (A) {
                      for (x = b(h / 864e5), v = b(x / 365.2425) + 1970 - 1; A(v + 1, 0) <= x; v++);
                      for (w = b((x - A(v, 0)) / 30.42); A(v, w + 1) <= x; w++);
                      x = 1 + x - A(v, w), C = (h % 864e5 + 864e5) % 864e5, k = b(C / 36e5) % 24, T = b(C / 6e4) % 60, S = b(C / 1e3) % 60, D = C % 1e3
                    } else v = h.getUTCFullYear(), w = h.getUTCMonth(), x = h.getUTCDate(), k = h.getUTCHours(), T = h.getUTCMinutes(), S = h.getUTCSeconds(), D = h.getUTCMilliseconds();
                    h = (v <= 0 || v >= 1e4 ? (v < 0 ? "-" : "+") + E(6, v < 0 ? -v : v) : E(4, v)) + "-" + E(2, w + 1) + "-" + E(2, x) + "T" + E(2, k) + ":" + E(2, T) + ":" + E(2, S) + "." + E(3, D) + "Z"
                  } else h = null;
                  if (n && (h = n.call(e, t, h)), null === h) return "null";
                  if (p = a.call(h), p == y) return "" + h;
                  if (p == f) return h > -1 / 0 && h < 1 / 0 ? "" + h : "null";
                  if (p == g) return _("" + h);
                  if ("object" == typeof h) {
                    for (B = u.length; B--;)
                      if (u[B] === h) throw TypeError();
                    if (u.push(h), N = [], R = l, l += c, p == m) {
                      for (I = 0, B = h.length; I < B; I++) j = $(I, h, n, i, c, l, u), N.push(j === s ? "null" : j);
                      O = N.length ? c ? "[\n" + l + N.join(",\n" + l) + "\n" + R + "]" : "[" + N.join(",") + "]" : "[]"
                    } else r(i || h, function(t) {
                      var e = $(t, h, n, i, c, l, u);
                      e !== s && N.push(_(t) + ":" + (c ? " " : "") + e)
                    }), O = N.length ? c ? "{\n" + l + N.join(",\n" + l) + "\n" + R + "}" : "{" + N.join(",") + "}" : "{}";
                    return u.pop(), O
                  }
                };
              u.stringify = function(t, e, n) {
                var i, o, r, s;
                if ("function" == typeof e || "object" == typeof e && e)
                  if ((s = a.call(e)) == p) o = e;
                  else if (s == m) {
                  r = {};
                  for (var c, l = 0, u = e.length; l < u; c = e[l++], s = a.call(c), (s == g || s == f) && (r[c] = 1));
                }
                if (n)
                  if ((s = a.call(n)) == f) {
                    if ((n -= n % 1) > 0)
                      for (i = "", n > 10 && (n = 10); i.length < n; i += " ");
                  } else s == g && (i = n.length <= 10 ? n : n.slice(0, 10));
                return $("", (c = {}, c[""] = t, c), o, r, i, "", [])
              }
            }
            if (!n("json-parse")) {
              var D, N, j = String.fromCharCode,
                I = {
                  92: "\\",
                  34: '"',
                  47: "/",
                  98: "\b",
                  116: "\t",
                  110: "\n",
                  102: "\f",
                  114: "\r"
                },
                B = function() {
                  throw D = N = null, SyntaxError()
                },
                R = function() {
                  for (var t, e, n, i, o, r = N, s = r.length; D < s;) switch (o = r.charCodeAt(D)) {
                    case 9:
                    case 10:
                    case 13:
                    case 32:
                      D++;
                      break;
                    case 123:
                    case 125:
                    case 91:
                    case 93:
                    case 58:
                    case 44:
                      return t = v ? r.charAt(D) : r[D], D++, t;
                    case 34:
                      for (t = "@", D++; D < s;)
                        if (o = r.charCodeAt(D), o < 32) B();
                        else if (92 == o) switch (o = r.charCodeAt(++D)) {
                        case 92:
                        case 34:
                        case 47:
                        case 98:
                        case 116:
                        case 110:
                        case 102:
                        case 114:
                          t += I[o], D++;
                          break;
                        case 117:
                          for (e = ++D, n = D + 4; D < n; D++) o = r.charCodeAt(D), o >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 70 || B();
                          t += j("0x" + r.slice(e, D));
                          break;
                        default:
                          B()
                      } else {
                        if (34 == o) break;
                        for (o = r.charCodeAt(D), e = D; o >= 32 && 92 != o && 34 != o;) o = r.charCodeAt(++D);
                        t += r.slice(e, D)
                      }
                      if (34 == r.charCodeAt(D)) return D++, t;
                      B();
                    default:
                      if (e = D, 45 == o && (i = !0, o = r.charCodeAt(++D)), o >= 48 && o <= 57) {
                        for (48 == o && (o = r.charCodeAt(D + 1), o >= 48 && o <= 57) && B(), i = !1; D < s && (o = r.charCodeAt(D), o >= 48 && o <= 57); D++);
                        if (46 == r.charCodeAt(D)) {
                          for (n = ++D; n < s && (o = r.charCodeAt(n), o >= 48 && o <= 57); n++);
                          n == D && B(), D = n
                        }
                        if (o = r.charCodeAt(D), 101 == o || 69 == o) {
                          for (o = r.charCodeAt(++D), 43 != o && 45 != o || D++, n = D; n < s && (o = r.charCodeAt(n), o >= 48 && o <= 57); n++);
                          n == D && B(), D = n
                        }
                        return +r.slice(e, D)
                      }
                      if (i && B(), "true" == r.slice(D, D + 4)) return D += 4, !0;
                      if ("false" == r.slice(D, D + 5)) return D += 5, !1;
                      if ("null" == r.slice(D, D + 4)) return D += 4, null;
                      B()
                  }
                  return "$"
                },
                O = function(t) {
                  var e, n;
                  if ("$" == t && B(), "string" == typeof t) {
                    if ("@" == (v ? t.charAt(0) : t[0])) return t.slice(1);
                    if ("[" == t) {
                      for (e = []; t = R(), "]" != t; n || (n = !0)) n && ("," == t ? (t = R(), "]" == t && B()) : B()), "," == t && B(), e.push(O(t));
                      return e
                    }
                    if ("{" == t) {
                      for (e = {}; t = R(), "}" != t; n || (n = !0)) n && ("," == t ? (t = R(), "}" == t && B()) : B()), "," != t && "string" == typeof t && "@" == (v ? t.charAt(0) : t[0]) && ":" == R() || B(), e[t.slice(1)] = O(R());
                      return e
                    }
                    B()
                  }
                  return t
                },
                P = function(t, e, n) {
                  var i = M(t, e, n);
                  i === s ? delete t[e] : t[e] = i
                },
                M = function(t, e, n) {
                  var i, o = t[e];
                  if ("object" == typeof o && o)
                    if (a.call(o) == m)
                      for (i = o.length; i--;) P(o, i, n);
                    else r(o, function(t) {
                      P(o, t, n)
                    });
                  return n.call(t, e, o)
                };
              u.parse = function(t, e) {
                var n, i;
                return D = 0, N = "" + t, n = O(R()), "$" != R() && B(), D = N = null, e && a.call(e) == p ? M((i = {}, i[""] = n, i), "", e) : n
              }
            }
          }
          c && t(function() {
            return u
          })
        }(this)
      }, {}],
      50: [function(t, e, n) {
        function i(t, e) {
          var n = [];
          e = e || 0;
          for (var i = e || 0; i < t.length; i++) n[i - e] = t[i];
          return n
        }
        e.exports = i
      }, {}]
    }, {}, [1])(1)
  }), ! function(t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : jQuery)
  }(function(t) {
    function e(e, i, o) {
      var i = {
        content: {
          message: "object" == typeof i ? i.message : i,
          title: i.title ? i.title : "",
          icon: i.icon ? i.icon : "",
          url: i.url ? i.url : "#",
          target: i.target ? i.target : "-"
        }
      };
      o = t.extend(!0, {}, i, o), this.settings = t.extend(!0, {}, n, o), this._defaults = n, "-" == this.settings.content.target && (this.settings.content.target = this.settings.url_target), this.animations = {
        start: "webkitAnimationStart oanimationstart MSAnimationStart animationstart",
        end: "webkitAnimationEnd oanimationend MSAnimationEnd animationend"
      }, "number" == typeof this.settings.offset && (this.settings.offset = {
        x: this.settings.offset,
        y: this.settings.offset
      }), this.init()
    }
    var n = {
      element: "body",
      position: null,
      type: "info",
      allow_dismiss: !0,
      newest_on_top: !1,
      showProgressbar: !1,
      placement: {
        from: "top",
        align: "right"
      },
      offset: 20,
      spacing: 10,
      z_index: 1031,
      delay: 5e3,
      timer: 1e3,
      url_target: "_blank",
      mouse_over: null,
      animate: {
        enter: "animated fadeInDown",
        exit: "animated fadeOutUp"
      },
      onShow: null,
      onShown: null,
      onClose: null,
      onClosed: null,
      icon_type: "class",
      template: '<div data-notify="container" class="col-xs-11 col-sm-4 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
    };
    String.format = function() {
      for (var t = arguments[0], e = 1; e < arguments.length; e++) t = t.replace(RegExp("\\{" + (e - 1) + "\\}", "gm"), arguments[e]);
      return t
    }, t.extend(e.prototype, {
      init: function() {
        var t = this;
        this.buildNotify(), this.settings.content.icon && this.setIcon(), "#" != this.settings.content.url && this.styleURL(), this.placement(), this.bind(), this.notify = {
          $ele: this.$ele,
          update: function(e, n) {
            var i = {};
            "string" == typeof e ? i[e] = n : i = e;
            for (var e in i) switch (e) {
              case "type":
                this.$ele.removeClass("alert-" + t.settings.type), this.$ele.find('[data-notify="progressbar"] > .progress-bar').removeClass("progress-bar-" + t.settings.type), t.settings.type = i[e], this.$ele.addClass("alert-" + i[e]).find('[data-notify="progressbar"] > .progress-bar').addClass("progress-bar-" + i[e]);
                break;
              case "icon":
                var o = this.$ele.find('[data-notify="icon"]');
                "class" == t.settings.icon_type.toLowerCase() ? o.removeClass(t.settings.content.icon).addClass(i[e]) : (o.is("img") || o.find("img"), o.attr("src", i[e]));
                break;
              case "progress":
                var r = t.settings.delay - t.settings.delay * (i[e] / 100);
                this.$ele.data("notify-delay", r), this.$ele.find('[data-notify="progressbar"] > div').attr("aria-valuenow", i[e]).css("width", i[e] + "%");
                break;
              case "url":
                this.$ele.find('[data-notify="url"]').attr("href", i[e]);
                break;
              case "target":
                this.$ele.find('[data-notify="url"]').attr("target", i[e]);
                break;
              default:
                this.$ele.find('[data-notify="' + e + '"]').html(i[e])
            }
            var s = this.$ele.outerHeight() + parseInt(t.settings.spacing) + parseInt(t.settings.offset.y);
            t.reposition(s)
          },
          close: function() {
            t.close()
          }
        }
      },
      buildNotify: function() {
        var e = this.settings.content;
        this.$ele = t(String.format(this.settings.template, this.settings.type, e.title, e.message, e.url, e.target)), this.$ele.attr("data-notify-position", this.settings.placement.from + "-" + this.settings.placement.align), this.settings.allow_dismiss || this.$ele.find('[data-notify="dismiss"]').css("display", "none"), (this.settings.delay <= 0 && !this.settings.showProgressbar || !this.settings.showProgressbar) && this.$ele.find('[data-notify="progressbar"]').remove()
      },
      setIcon: function() {
        "class" == this.settings.icon_type.toLowerCase() ? this.$ele.find('[data-notify="icon"]').addClass(this.settings.content.icon) : this.$ele.find('[data-notify="icon"]').is("img") ? this.$ele.find('[data-notify="icon"]').attr("src", this.settings.content.icon) : this.$ele.find('[data-notify="icon"]').append('<img src="' + this.settings.content.icon + '" alt="Notify Icon" />')
      },
      styleURL: function() {
        this.$ele.find('[data-notify="url"]').css({
          backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)",
          height: "100%",
          left: "0px",
          position: "absolute",
          top: "0px",
          width: "100%",
          zIndex: this.settings.z_index + 1
        }), this.$ele.find('[data-notify="dismiss"]').css({
          position: "absolute",
          right: "10px",
          top: "5px",
          zIndex: this.settings.z_index + 2
        })
      },
      placement: function() {
        var e = this,
          n = this.settings.offset.y,
          i = {
            display: "inline-block",
            margin: "0px auto",
            position: this.settings.position ? this.settings.position : "body" === this.settings.element ? "fixed" : "absolute",
            transition: "all .5s ease-in-out",
            zIndex: this.settings.z_index
          },
          o = !1,
          r = this.settings;
        switch (t('[data-notify-position="' + this.settings.placement.from + "-" + this.settings.placement.align + '"]:not([data-closing="true"])').each(function() {
          return n = Math.max(n, parseInt(t(this).css(r.placement.from)) + parseInt(t(this).outerHeight()) + parseInt(r.spacing))
        }), 1 == this.settings.newest_on_top && (n = this.settings.offset.y), i[this.settings.placement.from] = n + "px", this.settings.placement.align) {
          case "left":
          case "right":
            i[this.settings.placement.align] = this.settings.offset.x + "px";
            break;
          case "center":
            i.left = 0, i.right = 0
        }
        this.$ele.css(i).addClass(this.settings.animate.enter), t.each(Array("webkit", "moz", "o", "ms", ""), function(t, n) {
          e.$ele[0].style[n + "AnimationIterationCount"] = 1
        }), t(this.settings.element).append(this.$ele), 1 == this.settings.newest_on_top && (n = parseInt(n) + parseInt(this.settings.spacing) + this.$ele.outerHeight(), this.reposition(n)), t.isFunction(e.settings.onShow) && e.settings.onShow.call(this.$ele), this.$ele.one(this.animations.start, function() {
          o = !0
        }).one(this.animations.end, function() {
          t.isFunction(e.settings.onShown) && e.settings.onShown.call(this)
        }), setTimeout(function() {
          o || t.isFunction(e.settings.onShown) && e.settings.onShown.call(this)
        }, 600)
      },
      bind: function() {
        var e = this;
        if (this.$ele.find('[data-notify="dismiss"]').on("click", function() {
            e.close()
          }), this.$ele.mouseover(function() {
            t(this).data("data-hover", "true")
          }).mouseout(function() {
            t(this).data("data-hover", "false")
          }), this.$ele.data("data-hover", "false"), this.settings.delay > 0) {
          e.$ele.data("notify-delay", e.settings.delay);
          var n = setInterval(function() {
            var t = parseInt(e.$ele.data("notify-delay")) - e.settings.timer;
            if ("false" === e.$ele.data("data-hover") && "pause" == e.settings.mouse_over || "pause" != e.settings.mouse_over) {
              var i = (e.settings.delay - t) / e.settings.delay * 100;
              e.$ele.data("notify-delay", t), e.$ele.find('[data-notify="progressbar"] > div').attr("aria-valuenow", i).css("width", i + "%")
            }
            t <= -e.settings.timer && (clearInterval(n), e.close())
          }, e.settings.timer)
        }
      },
      close: function() {
        var e = this,
          n = parseInt(this.$ele.css(this.settings.placement.from)),
          i = !1;
        this.$ele.data("closing", "true").addClass(this.settings.animate.exit), e.reposition(n), t.isFunction(e.settings.onClose) && e.settings.onClose.call(this.$ele), this.$ele.one(this.animations.start, function() {
          i = !0
        }).one(this.animations.end, function() {
          t(this).remove(), t.isFunction(e.settings.onClosed) && e.settings.onClosed.call(this)
        }), setTimeout(function() {
          i || (e.$ele.remove(), e.settings.onClosed && e.settings.onClosed(e.$ele))
        }, 600)
      },
      reposition: function(e) {
        var n = this,
          i = '[data-notify-position="' + this.settings.placement.from + "-" + this.settings.placement.align + '"]:not([data-closing="true"])',
          o = this.$ele.nextAll(i);
        1 == this.settings.newest_on_top && (o = this.$ele.prevAll(i)), o.each(function() {
          t(this).css(n.settings.placement.from, e), e = parseInt(e) + parseInt(n.settings.spacing) + t(this).outerHeight()
        })
      }
    }), t.notify = function(t, n) {
      var i = new e(this, t, n);
      return i.notify
    }, t.notifyDefaults = function(e) {
      return n = t.extend(!0, {}, n, e)
    }, t.notifyClose = function(e) {
      "undefined" == typeof e || "all" == e ? t("[data-notify]").find('[data-notify="dismiss"]').trigger("click") : t('[data-notify-position="' + e + '"]').find('[data-notify="dismiss"]').trigger("click")
    }
  }),
  function(t) {
    "use strict";
    var e, n = t.Base64,
      i = "2.1.9";
    if ("undefined" != typeof module && module.exports) try {
      e = require("buffer").Buffer
    } catch (t) {}
    var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      r = function(t) {
        for (var e = {}, n = 0, i = t.length; n < i; n++) e[t.charAt(n)] = n;
        return e
      }(o),
      s = String.fromCharCode,
      a = function(t) {
        if (t.length < 2) {
          var e = t.charCodeAt(0);
          return e < 128 ? t : e < 2048 ? s(192 | e >>> 6) + s(128 | 63 & e) : s(224 | e >>> 12 & 15) + s(128 | e >>> 6 & 63) + s(128 | 63 & e)
        }
        var e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
        return s(240 | e >>> 18 & 7) + s(128 | e >>> 12 & 63) + s(128 | e >>> 6 & 63) + s(128 | 63 & e)
      },
      c = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
      l = function(t) {
        return t.replace(c, a)
      },
      u = function(t) {
        var e = [0, 2, 1][t.length % 3],
          n = t.charCodeAt(0) << 16 | (t.length > 1 ? t.charCodeAt(1) : 0) << 8 | (t.length > 2 ? t.charCodeAt(2) : 0),
          i = [o.charAt(n >>> 18), o.charAt(n >>> 12 & 63), e >= 2 ? "=" : o.charAt(n >>> 6 & 63), e >= 1 ? "=" : o.charAt(63 & n)];
        return i.join("")
      },
      h = t.btoa ? function(e) {
        return t.btoa(e)
      } : function(t) {
        return t.replace(/[\s\S]{1,3}/g, u)
      },
      p = e ? function(t) {
        return (t.constructor === e.constructor ? t : new e(t)).toString("base64")
      } : function(t) {
        return h(l(t))
      },
      d = function(t, e) {
        return e ? p(String(t)).replace(/[+\/]/g, function(t) {
          return "+" == t ? "-" : "_"
        }).replace(/=/g, "") : p(String(t))
      },
      f = function(t) {
        return d(t, !0)
      },
      g = new RegExp(["[À-ß][-¿]", "[à-ï][-¿]{2}", "[ð-÷][-¿]{3}"].join("|"), "g"),
      m = function(t) {
        switch (t.length) {
          case 4:
            var e = (7 & t.charCodeAt(0)) << 18 | (63 & t.charCodeAt(1)) << 12 | (63 & t.charCodeAt(2)) << 6 | 63 & t.charCodeAt(3),
              n = e - 65536;
            return s((n >>> 10) + 55296) + s((1023 & n) + 56320);
          case 3:
            return s((15 & t.charCodeAt(0)) << 12 | (63 & t.charCodeAt(1)) << 6 | 63 & t.charCodeAt(2));
          default:
            return s((31 & t.charCodeAt(0)) << 6 | 63 & t.charCodeAt(1))
        }
      },
      y = function(t) {
        return t.replace(g, m)
      },
      v = function(t) {
        var e = t.length,
          n = e % 4,
          i = (e > 0 ? r[t.charAt(0)] << 18 : 0) | (e > 1 ? r[t.charAt(1)] << 12 : 0) | (e > 2 ? r[t.charAt(2)] << 6 : 0) | (e > 3 ? r[t.charAt(3)] : 0),
          o = [s(i >>> 16), s(i >>> 8 & 255), s(255 & i)];
        return o.length -= [0, 0, 2, 1][n], o.join("")
      },
      b = t.atob ? function(e) {
        return t.atob(e)
      } : function(t) {
        return t.replace(/[\s\S]{1,4}/g, v)
      },
      w = e ? function(t) {
        return (t.constructor === e.constructor ? t : new e(t, "base64")).toString()
      } : function(t) {
        return y(b(t))
      },
      A = function(t) {
        return w(String(t).replace(/[-_]/g, function(t) {
          return "-" == t ? "+" : "/"
        }).replace(/[^A-Za-z0-9\+\/]/g, ""))
      },
      x = function() {
        var e = t.Base64;
        return t.Base64 = n, e
      };
    if (t.Base64 = {
        VERSION: i,
        atob: b,
        btoa: h,
        fromBase64: A,
        toBase64: d,
        utob: l,
        encode: d,
        encodeURI: f,
        btou: y,
        decode: A,
        noConflict: x
      }, "function" == typeof Object.defineProperty) {
      var C = function(t) {
        return {
          value: t,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      };
      t.Base64.extendString = function() {
        Object.defineProperty(String.prototype, "fromBase64", C(function() {
          return A(this)
        })), Object.defineProperty(String.prototype, "toBase64", C(function(t) {
          return d(this, t)
        })), Object.defineProperty(String.prototype, "toBase64URI", C(function() {
          return d(this, !0)
        }))
      }
    }
    t.Meteor && (Base64 = t.Base64)
  }(this), ! function(t, e, n, i) {
    function o(e, n) {
      this.settings = null, this.options = t.extend({}, o.Defaults, n), this.$element = t(e), this.drag = t.extend({}, p), this.state = t.extend({}, d), this.e = t.extend({}, f), this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._invalidated = {}, this._pipe = [], t.each(o.Plugins, t.proxy(function(t, e) {
        this._plugins[t[0].toLowerCase() + t.slice(1)] = new e(this)
      }, this)), t.each(o.Pipe, t.proxy(function(e, n) {
        this._pipe.push({
          filter: n.filter,
          run: t.proxy(n.run, this)
        })
      }, this)), this.setup(), this.initialize()
    }

    function r(t) {
      if (t.touches !== i) return {
        x: t.touches[0].pageX,
        y: t.touches[0].pageY
      };
      if (t.touches === i) {
        if (t.pageX !== i) return {
          x: t.pageX,
          y: t.pageY
        };
        if (t.pageX === i) return {
          x: t.clientX,
          y: t.clientY
        }
      }
    }

    function s(t) {
      var e, i, o = n.createElement("div"),
        r = t;
      for (e in r)
        if (i = r[e], "undefined" != typeof o.style[i]) return o = null, [i, e];
      return [!1]
    }

    function a() {
      return s(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1]
    }

    function c() {
      return s(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0]
    }

    function l() {
      return s(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0]
    }

    function u() {
      return "ontouchstart" in e || !!navigator.msMaxTouchPoints
    }

    function h() {
      return e.navigator.msPointerEnabled
    }
    var p, d, f;
    p = {
      start: 0,
      startX: 0,
      startY: 0,
      current: 0,
      currentX: 0,
      currentY: 0,
      offsetX: 0,
      offsetY: 0,
      distance: null,
      startTime: 0,
      endTime: 0,
      updatedX: 0,
      targetEl: null
    }, d = {
      isTouch: !1,
      isScrolling: !1,
      isSwiping: !1,
      direction: !1,
      inMotion: !1
    }, f = {
      _onDragStart: null,
      _onDragMove: null,
      _onDragEnd: null,
      _transitionEnd: null,
      _resizer: null,
      _responsiveCall: null,
      _goToLoop: null,
      _checkVisibile: null
    }, o.Defaults = {
      items: 3,
      loop: !1,
      center: !1,
      mouseDrag: !0,
      touchDrag: !0,
      pullDrag: !0,
      freeDrag: !1,
      margin: 0,
      stagePadding: 0,
      merge: !1,
      mergeFit: !0,
      autoWidth: !1,
      startPosition: 0,
      rtl: !1,
      smartSpeed: 250,
      fluidSpeed: !1,
      dragEndSpeed: !1,
      responsive: {},
      responsiveRefreshRate: 200,
      responsiveBaseElement: e,
      responsiveClass: !1,
      fallbackEasing: "swing",
      info: !1,
      nestedItemSelector: !1,
      itemElement: "div",
      stageElement: "div",
      themeClass: "owl-theme",
      baseClass: "owl-carousel",
      itemClass: "owl-item",
      centerClass: "center",
      activeClass: "active"
    }, o.Width = {
      Default: "default",
      Inner: "inner",
      Outer: "outer"
    }, o.Plugins = {}, o.Pipe = [{
      filter: ["width", "items", "settings"],
      run: function(t) {
        t.current = this._items && this._items[this.relative(this._current)]
      }
    }, {
      filter: ["items", "settings"],
      run: function() {
        var t = this._clones,
          e = this.$stage.children(".cloned");
        (e.length !== t.length || !this.settings.loop && t.length > 0) && (this.$stage.children(".cloned").remove(), this._clones = [])
      }
    }, {
      filter: ["items", "settings"],
      run: function() {
        var t, e, n = this._clones,
          i = this._items,
          o = this.settings.loop ? n.length - Math.max(2 * this.settings.items, 4) : 0;
        for (t = 0, e = Math.abs(o / 2); e > t; t++) o > 0 ? (this.$stage.children().eq(i.length + n.length - 1).remove(), n.pop(), this.$stage.children().eq(0).remove(), n.pop()) : (n.push(n.length / 2), this.$stage.append(i[n[n.length - 1]].clone().addClass("cloned")), n.push(i.length - 1 - (n.length - 1) / 2), this.$stage.prepend(i[n[n.length - 1]].clone().addClass("cloned")))
      }
    }, {
      filter: ["width", "items", "settings"],
      run: function() {
        var t, e, n, i = this.settings.rtl ? 1 : -1,
          o = (this.width() / this.settings.items).toFixed(3),
          r = 0;
        for (this._coordinates = [], e = 0, n = this._clones.length + this._items.length; n > e; e++) t = this._mergers[this.relative(e)], t = this.settings.mergeFit && Math.min(t, this.settings.items) || t, r += (this.settings.autoWidth ? this._items[this.relative(e)].width() + this.settings.margin : o * t) * i, this._coordinates.push(r)
      }
    }, {
      filter: ["width", "items", "settings"],
      run: function() {
        var e, n, i = (this.width() / this.settings.items).toFixed(3),
          o = {
            width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding,
            "padding-left": this.settings.stagePadding || "",
            "padding-right": this.settings.stagePadding || ""
          };
        if (this.$stage.css(o), o = {
            width: this.settings.autoWidth ? "auto" : i - this.settings.margin
          }, o[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin, !this.settings.autoWidth && t.grep(this._mergers, function(t) {
            return t > 1
          }).length > 0)
          for (e = 0, n = this._coordinates.length; n > e; e++) o.width = Math.abs(this._coordinates[e]) - Math.abs(this._coordinates[e - 1] || 0) - this.settings.margin, this.$stage.children().eq(e).css(o);
        else this.$stage.children().css(o)
      }
    }, {
      filter: ["width", "items", "settings"],
      run: function(t) {
        t.current && this.reset(this.$stage.children().index(t.current))
      }
    }, {
      filter: ["position"],
      run: function() {
        this.animate(this.coordinates(this._current))
      }
    }, {
      filter: ["width", "position", "items", "settings"],
      run: function() {
        var t, e, n, i, o = this.settings.rtl ? 1 : -1,
          r = 2 * this.settings.stagePadding,
          s = this.coordinates(this.current()) + r,
          a = s + this.width() * o,
          c = [];
        for (n = 0, i = this._coordinates.length; i > n; n++) t = this._coordinates[n - 1] || 0, e = Math.abs(this._coordinates[n]) + r * o, (this.op(t, "<=", s) && this.op(t, ">", a) || this.op(e, "<", s) && this.op(e, ">", a)) && c.push(n);
        this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass), this.$stage.children(":eq(" + c.join("), :eq(") + ")").addClass(this.settings.activeClass), this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), this.$stage.children().eq(this.current()).addClass(this.settings.centerClass))
      }
    }], o.prototype.initialize = function() {
      if (this.trigger("initialize"), this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl), this.browserSupport(), this.settings.autoWidth && this.state.imagesLoaded !== !0) {
        var e, n, o;
        if (e = this.$element.find("img"), n = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : i, o = this.$element.children(n).width(), e.length && 0 >= o) return this.preloadAutoWidthImages(e), !1
      }
      this.$element.addClass("owl-loading"), this.$stage = t("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this._width = this.$element.width(), this.refresh(), this.$element.removeClass("owl-loading").addClass("owl-loaded"), this.eventsCall(), this.internalEvents(), this.addTriggerableEvents(), this.trigger("initialized")
    }, o.prototype.setup = function() {
      var e = this.viewport(),
        n = this.options.responsive,
        i = -1,
        o = null;
      n ? (t.each(n, function(t) {
        e >= t && t > i && (i = Number(t))
      }), o = t.extend({}, this.options, n[i]), delete o.responsive, o.responsiveClass && this.$element.attr("class", function(t, e) {
        return e.replace(/\b owl-responsive-\S+/g, "")
      }).addClass("owl-responsive-" + i)) : o = t.extend({}, this.options), (null === this.settings || this._breakpoint !== i) && (this.trigger("change", {
        property: {
          name: "settings",
          value: o
        }
      }), this._breakpoint = i, this.settings = o, this.invalidate("settings"), this.trigger("changed", {
        property: {
          name: "settings",
          value: this.settings
        }
      }))
    }, o.prototype.optionsLogic = function() {
      this.$element.toggleClass("owl-center", this.settings.center), this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1), this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, o.prototype.prepare = function(e) {
      var n = this.trigger("prepare", {
        content: e
      });
      return n.data || (n.data = t("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(e)), this.trigger("prepared", {
        content: n.data
      }), n.data
    }, o.prototype.update = function() {
      for (var e = 0, n = this._pipe.length, i = t.proxy(function(t) {
          return this[t]
        }, this._invalidated), o = {}; n > e;)(this._invalidated.all || t.grep(this._pipe[e].filter, i).length > 0) && this._pipe[e].run(o), e++;
      this._invalidated = {}
    }, o.prototype.width = function(t) {
      switch (t = t || o.Width.Default) {
        case o.Width.Inner:
        case o.Width.Outer:
          return this._width;
        default:
          return this._width - 2 * this.settings.stagePadding + this.settings.margin
      }
    }, o.prototype.refresh = function() {
      return 0 !== this._items.length && ((new Date).getTime(), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$stage.addClass("owl-refresh"), this.update(), this.$stage.removeClass("owl-refresh"), this.state.orientation = e.orientation, this.watchVisibility(), this.trigger("refreshed"), void 0)
    }, o.prototype.eventsCall = function() {
      this.e._onDragStart = t.proxy(function(t) {
        this.onDragStart(t)
      }, this), this.e._onDragMove = t.proxy(function(t) {
        this.onDragMove(t)
      }, this), this.e._onDragEnd = t.proxy(function(t) {
        this.onDragEnd(t)
      }, this), this.e._onResize = t.proxy(function(t) {
        this.onResize(t)
      }, this), this.e._transitionEnd = t.proxy(function(t) {
        this.transitionEnd(t)
      }, this), this.e._preventClick = t.proxy(function(t) {
        this.preventClick(t)
      }, this)
    }, o.prototype.onThrottledResize = function() {
      e.clearTimeout(this.resizeTimer), this.resizeTimer = e.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate)
    }, o.prototype.onResize = function() {
      return !!this._items.length && (this._width !== this.$element.width() && (!this.trigger("resize").isDefaultPrevented() && (this._width = this.$element.width(), this.invalidate("width"), this.refresh(), void this.trigger("resized"))))
    }, o.prototype.eventsRouter = function(t) {
      var e = t.type;
      "mousedown" === e || "touchstart" === e ? this.onDragStart(t) : "mousemove" === e || "touchmove" === e ? this.onDragMove(t) : "mouseup" === e || "touchend" === e ? this.onDragEnd(t) : "touchcancel" === e && this.onDragEnd(t)
    }, o.prototype.internalEvents = function() {
      var n = (u(), h());
      this.settings.mouseDrag ? (this.$stage.on("mousedown", t.proxy(function(t) {
        this.eventsRouter(t)
      }, this)), this.$stage.on("dragstart", function() {
        return !1
      }), this.$stage.get(0).onselectstart = function() {
        return !1
      }) : this.$element.addClass("owl-text-select-on"), this.settings.touchDrag && !n && this.$stage.on("touchstart touchcancel", t.proxy(function(t) {
        this.eventsRouter(t)
      }, this)), this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1), this.settings.responsive !== !1 && this.on(e, "resize", t.proxy(this.onThrottledResize, this))
    }, o.prototype.onDragStart = function(i) {
      var o, s, a, c;
      if (o = i.originalEvent || i || e.event, 3 === o.which || this.state.isTouch) return !1;
      if ("mousedown" === o.type && this.$stage.addClass("owl-grab"), this.trigger("drag"), this.drag.startTime = (new Date).getTime(), this.speed(0), this.state.isTouch = !0, this.state.isScrolling = !1, this.state.isSwiping = !1, this.drag.distance = 0, s = r(o).x, a = r(o).y, this.drag.offsetX = this.$stage.position().left, this.drag.offsetY = this.$stage.position().top, this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin), this.state.inMotion && this.support3d) c = this.getTransformProperty(), this.drag.offsetX = c, this.animate(c), this.state.inMotion = !0;
      else if (this.state.inMotion && !this.support3d) return this.state.inMotion = !1, !1;
      this.drag.startX = s - this.drag.offsetX, this.drag.startY = a - this.drag.offsetY, this.drag.start = s - this.drag.startX, this.drag.targetEl = o.target || o.srcElement, this.drag.updatedX = this.drag.start, ("IMG" === this.drag.targetEl.tagName || "A" === this.drag.targetEl.tagName) && (this.drag.targetEl.draggable = !1), t(n).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", t.proxy(function(t) {
        this.eventsRouter(t)
      }, this))
    }, o.prototype.onDragMove = function(t) {
      var n, o, s, a, c, l;
      this.state.isTouch && (this.state.isScrolling || (n = t.originalEvent || t || e.event, o = r(n).x, s = r(n).y, this.drag.currentX = o - this.drag.startX, this.drag.currentY = s - this.drag.startY, this.drag.distance = this.drag.currentX - this.drag.offsetX, this.drag.distance < 0 ? this.state.direction = this.settings.rtl ? "right" : "left" : this.drag.distance > 0 && (this.state.direction = this.settings.rtl ? "left" : "right"), this.settings.loop ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction ? this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && "left" === this.state.direction && (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length)) : (a = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum()), c = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum()), l = this.settings.pullDrag ? this.drag.distance / 5 : 0, this.drag.currentX = Math.max(Math.min(this.drag.currentX, a + l), c + l)), (this.drag.distance > 8 || this.drag.distance < -8) && (n.preventDefault !== i ? n.preventDefault() : n.returnValue = !1, this.state.isSwiping = !0), this.drag.updatedX = this.drag.currentX, (this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === !1 && (this.state.isScrolling = !0, this.drag.updatedX = this.drag.start), this.animate(this.drag.updatedX)))
    }, o.prototype.onDragEnd = function(e) {
      var i, o, r;
      if (this.state.isTouch) {
        if ("mouseup" === e.type && this.$stage.removeClass("owl-grab"), this.trigger("dragged"), this.drag.targetEl.removeAttribute("draggable"), this.state.isTouch = !1, this.state.isScrolling = !1, this.state.isSwiping = !1, 0 === this.drag.distance && this.state.inMotion !== !0) return this.state.inMotion = !1, !1;
        this.drag.endTime = (new Date).getTime(), i = this.drag.endTime - this.drag.startTime, o = Math.abs(this.drag.distance), (o > 3 || i > 300) && this.removeClick(this.drag.targetEl), r = this.closest(this.drag.updatedX), this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(r), this.invalidate("position"), this.update(), this.settings.pullDrag || this.drag.updatedX !== this.coordinates(r) || this.transitionEnd(), this.drag.distance = 0, t(n).off(".owl.dragEvents")
      }
    }, o.prototype.removeClick = function(n) {
      this.drag.targetEl = n, t(n).on("click.preventClick", this.e._preventClick), e.setTimeout(function() {
        t(n).off("click.preventClick")
      }, 300)
    }, o.prototype.preventClick = function(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation && e.stopPropagation(), t(e.target).off("click.preventClick")
    }, o.prototype.getTransformProperty = function() {
      var t, n;
      return t = e.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform"), t = t.replace(/matrix(3d)?\(|\)/g, "").split(","), n = 16 === t.length, n !== !0 ? t[4] : t[12]
    }, o.prototype.closest = function(e) {
      var n = -1,
        i = 30,
        o = this.width(),
        r = this.coordinates();
      return this.settings.freeDrag || t.each(r, t.proxy(function(t, s) {
        return e > s - i && s + i > e ? n = t : this.op(e, "<", s) && this.op(e, ">", r[t + 1] || s - o) && (n = "left" === this.state.direction ? t + 1 : t), -1 === n
      }, this)), this.settings.loop || (this.op(e, ">", r[this.minimum()]) ? n = e = this.minimum() : this.op(e, "<", r[this.maximum()]) && (n = e = this.maximum())), n
    }, o.prototype.animate = function(e) {
      this.trigger("translate"), this.state.inMotion = this.speed() > 0, this.support3d ? this.$stage.css({
        transform: "translate3d(" + e + "px,0px, 0px)",
        transition: this.speed() / 1e3 + "s"
      }) : this.state.isTouch ? this.$stage.css({
        left: e + "px"
      }) : this.$stage.animate({
        left: e
      }, this.speed() / 1e3, this.settings.fallbackEasing, t.proxy(function() {
        this.state.inMotion && this.transitionEnd()
      }, this))
    }, o.prototype.current = function(t) {
      if (t === i) return this._current;
      if (0 === this._items.length) return i;
      if (t = this.normalize(t), this._current !== t) {
        var e = this.trigger("change", {
          property: {
            name: "position",
            value: t
          }
        });
        e.data !== i && (t = this.normalize(e.data)), this._current = t, this.invalidate("position"), this.trigger("changed", {
          property: {
            name: "position",
            value: this._current
          }
        })
      }
      return this._current
    }, o.prototype.invalidate = function(t) {
      this._invalidated[t] = !0
    }, o.prototype.reset = function(t) {
      t = this.normalize(t), t !== i && (this._speed = 0, this._current = t, this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]))
    }, o.prototype.normalize = function(e, n) {
      var o = n ? this._items.length : this._items.length + this._clones.length;
      return !t.isNumeric(e) || 1 > o ? i : e = this._clones.length ? (e % o + o) % o : Math.max(this.minimum(n), Math.min(this.maximum(n), e))
    }, o.prototype.relative = function(t) {
      return t = this.normalize(t), t -= this._clones.length / 2, this.normalize(t, !0)
    }, o.prototype.maximum = function(t) {
      var e, n, i, o = 0,
        r = this.settings;
      if (t) return this._items.length - 1;
      if (!r.loop && r.center) e = this._items.length - 1;
      else if (r.loop || r.center)
        if (r.loop || r.center) e = this._items.length + r.items;
        else {
          if (!r.autoWidth && !r.merge) throw "Can not detect maximum absolute position.";
          for (revert = r.rtl ? 1 : -1, n = this.$stage.width() - this.$element.width();
            (i = this.coordinates(o)) && !(i * revert >= n);) e = ++o
        } else e = this._items.length - r.items;
      return e
    }, o.prototype.minimum = function(t) {
      return t ? 0 : this._clones.length / 2
    }, o.prototype.items = function(t) {
      return t === i ? this._items.slice() : (t = this.normalize(t, !0), this._items[t])
    }, o.prototype.mergers = function(t) {
      return t === i ? this._mergers.slice() : (t = this.normalize(t, !0), this._mergers[t])
    }, o.prototype.clones = function(e) {
      var n = this._clones.length / 2,
        o = n + this._items.length,
        r = function(t) {
          return t % 2 === 0 ? o + t / 2 : n - (t + 1) / 2
        };
      return e === i ? t.map(this._clones, function(t, e) {
        return r(e)
      }) : t.map(this._clones, function(t, n) {
        return t === e ? r(n) : null
      })
    }, o.prototype.speed = function(t) {
      return t !== i && (this._speed = t), this._speed
    }, o.prototype.coordinates = function(e) {
      var n = null;
      return e === i ? t.map(this._coordinates, t.proxy(function(t, e) {
        return this.coordinates(e)
      }, this)) : (this.settings.center ? (n = this._coordinates[e], n += (this.width() - n + (this._coordinates[e - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)) : n = this._coordinates[e - 1] || 0, n)
    }, o.prototype.duration = function(t, e, n) {
      return Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(n || this.settings.smartSpeed)
    }, o.prototype.to = function(n, i) {
      if (this.settings.loop) {
        var o = n - this.relative(this.current()),
          r = this.current(),
          s = this.current(),
          a = this.current() + o,
          c = 0 > s - a,
          l = this._clones.length + this._items.length;
        a < this.settings.items && c === !1 ? (r = s + this._items.length, this.reset(r)) : a >= l - this.settings.items && c === !0 && (r = s - this._items.length, this.reset(r)), e.clearTimeout(this.e._goToLoop), this.e._goToLoop = e.setTimeout(t.proxy(function() {
          this.speed(this.duration(this.current(), r + o, i)), this.current(r + o), this.update()
        }, this), 30)
      } else this.speed(this.duration(this.current(), n, i)), this.current(n), this.update()
    }, o.prototype.next = function(t) {
      t = t || !1, this.to(this.relative(this.current()) + 1, t)
    }, o.prototype.prev = function(t) {
      t = t || !1, this.to(this.relative(this.current()) - 1, t)
    }, o.prototype.transitionEnd = function(t) {
      return (t === i || (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) === this.$stage.get(0))) && (this.state.inMotion = !1, void this.trigger("translated"))
    }, o.prototype.viewport = function() {
      var i;
      if (this.options.responsiveBaseElement !== e) i = t(this.options.responsiveBaseElement).width();
      else if (e.innerWidth) i = e.innerWidth;
      else {
        if (!n.documentElement || !n.documentElement.clientWidth) throw "Can not detect viewport width.";
        i = n.documentElement.clientWidth
      }
      return i
    }, o.prototype.replace = function(e) {
      this.$stage.empty(), this._items = [], e && (e = e instanceof jQuery ? e : t(e)), this.settings.nestedItemSelector && (e = e.find("." + this.settings.nestedItemSelector)), e.filter(function() {
        return 1 === this.nodeType
      }).each(t.proxy(function(t, e) {
        e = this.prepare(e), this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)
      }, this)), this.reset(t.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, o.prototype.add = function(t, e) {
      e = e === i ? this._items.length : this.normalize(e, !0), this.trigger("add", {
        content: t,
        position: e
      }), 0 === this._items.length || e === this._items.length ? (this.$stage.append(t), this._items.push(t), this._mergers.push(1 * t.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)) : (this._items[e].before(t), this._items.splice(e, 0, t), this._mergers.splice(e, 0, 1 * t.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)), this.invalidate("items"), this.trigger("added", {
        content: t,
        position: e
      })
    }, o.prototype.remove = function(t) {
      t = this.normalize(t, !0), t !== i && (this.trigger("remove", {
        content: this._items[t],
        position: t
      }), this._items[t].remove(), this._items.splice(t, 1), this._mergers.splice(t, 1), this.invalidate("items"), this.trigger("removed", {
        content: null,
        position: t
      }))
    }, o.prototype.addTriggerableEvents = function() {
      var e = t.proxy(function(e, n) {
        return t.proxy(function(t) {
          t.relatedTarget !== this && (this.suppress([n]), e.apply(this, [].slice.call(arguments, 1)), this.release([n]))
        }, this)
      }, this);
      t.each({
        next: this.next,
        prev: this.prev,
        to: this.to,
        destroy: this.destroy,
        refresh: this.refresh,
        replace: this.replace,
        add: this.add,
        remove: this.remove
      }, t.proxy(function(t, n) {
        this.$element.on(t + ".owl.carousel", e(n, t + ".owl.carousel"))
      }, this))
    }, o.prototype.watchVisibility = function() {
      function n(t) {
        return t.offsetWidth > 0 && t.offsetHeight > 0
      }

      function i() {
        n(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), e.clearInterval(this.e._checkVisibile))
      }
      n(this.$element.get(0)) || (this.$element.addClass("owl-hidden"), e.clearInterval(this.e._checkVisibile), this.e._checkVisibile = e.setInterval(t.proxy(i, this), 500))
    }, o.prototype.preloadAutoWidthImages = function(e) {
      var n, i, o, r;
      n = 0, i = this, e.each(function(s, a) {
        o = t(a), r = new Image, r.onload = function() {
          n++, o.attr("src", r.src), o.css("opacity", 1), n >= e.length && (i.state.imagesLoaded = !0, i.initialize())
        }, r.src = o.attr("src") || o.attr("data-src") || o.attr("data-src-retina")
      })
    }, o.prototype.destroy = function() {
      this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass), this.settings.responsive !== !1 && t(e).off("resize.owl.carousel"), this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
      for (var i in this._plugins) this._plugins[i].destroy();
      (this.settings.mouseDrag || this.settings.touchDrag) && (this.$stage.off("mousedown touchstart touchcancel"), t(n).off(".owl.dragEvents"), this.$stage.get(0).onselectstart = function() {}, this.$stage.off("dragstart", function() {
        return !1
      })), this.$element.off(".owl"), this.$stage.children(".cloned").remove(), this.e = null, this.$element.removeData("owlCarousel"), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.unwrap()
    }, o.prototype.op = function(t, e, n) {
      var i = this.settings.rtl;
      switch (e) {
        case "<":
          return i ? t > n : n > t;
        case ">":
          return i ? n > t : t > n;
        case ">=":
          return i ? n >= t : t >= n;
        case "<=":
          return i ? t >= n : n >= t
      }
    }, o.prototype.on = function(t, e, n, i) {
      t.addEventListener ? t.addEventListener(e, n, i) : t.attachEvent && t.attachEvent("on" + e, n)
    }, o.prototype.off = function(t, e, n, i) {
      t.removeEventListener ? t.removeEventListener(e, n, i) : t.detachEvent && t.detachEvent("on" + e, n)
    }, o.prototype.trigger = function(e, n, i) {
      var o = {
          item: {
            count: this._items.length,
            index: this.current()
          }
        },
        r = t.camelCase(t.grep(["on", e, i], function(t) {
          return t
        }).join("-").toLowerCase()),
        s = t.Event([e, "owl", i || "carousel"].join(".").toLowerCase(), t.extend({
          relatedTarget: this
        }, o, n));
      return this._supress[e] || (t.each(this._plugins, function(t, e) {
        e.onTrigger && e.onTrigger(s)
      }), this.$element.trigger(s), this.settings && "function" == typeof this.settings[r] && this.settings[r].apply(this, s)), s
    }, o.prototype.suppress = function(e) {
      t.each(e, t.proxy(function(t, e) {
        this._supress[e] = !0
      }, this))
    }, o.prototype.release = function(e) {
      t.each(e, t.proxy(function(t, e) {
        delete this._supress[e]
      }, this))
    }, o.prototype.browserSupport = function() {
      if (this.support3d = l(), this.support3d) {
        this.transformVendor = c();
        var t = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"];
        this.transitionEndVendor = t[a()], this.vendorName = this.transformVendor.replace(/Transform/i, ""), this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : ""
      }
      this.state.orientation = e.orientation
    }, t.fn.owlCarousel = function(e) {
      return this.each(function() {
        t(this).data("owlCarousel") || t(this).data("owlCarousel", new o(this, e));
      })
    }, t.fn.owlCarousel.Constructor = o
  }(window.Zepto || window.jQuery, window, document),
  function(t, e) {
    var n = function(e) {
      this._core = e, this._loaded = [], this._handlers = {
        "initialized.owl.carousel change.owl.carousel": t.proxy(function(e) {
          if (e.namespace && this._core.settings && this._core.settings.lazyLoad && (e.property && "position" == e.property.name || "initialized" == e.type))
            for (var n = this._core.settings, i = n.center && Math.ceil(n.items / 2) || n.items, o = n.center && -1 * i || 0, r = (e.property && e.property.value || this._core.current()) + o, s = this._core.clones().length, a = t.proxy(function(t, e) {
                this.load(e)
              }, this); o++ < i;) this.load(s / 2 + this._core.relative(r)), s && t.each(this._core.clones(this._core.relative(r++)), a)
        }, this)
      }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    n.Defaults = {
      lazyLoad: !1
    }, n.prototype.load = function(n) {
      var i = this._core.$stage.children().eq(n),
        o = i && i.find(".owl-lazy");
      !o || t.inArray(i.get(0), this._loaded) > -1 || (o.each(t.proxy(function(n, i) {
        var o, r = t(i),
          s = e.devicePixelRatio > 1 && r.attr("data-src-retina") || r.attr("data-src");
        this._core.trigger("load", {
          element: r,
          url: s
        }, "lazy"), r.is("img") ? r.one("load.owl.lazy", t.proxy(function() {
          r.css("opacity", 1), this._core.trigger("loaded", {
            element: r,
            url: s
          }, "lazy")
        }, this)).attr("src", s) : (o = new Image, o.onload = t.proxy(function() {
          r.css({
            "background-image": "url(" + s + ")",
            opacity: "1"
          }), this._core.trigger("loaded", {
            element: r,
            url: s
          }, "lazy")
        }, this), o.src = s)
      }, this)), this._loaded.push(i.get(0)))
    }, n.prototype.destroy = function() {
      var t, e;
      for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Lazy = n
  }(window.Zepto || window.jQuery, window, document),
  function(t) {
    var e = function(n) {
      this._core = n, this._handlers = {
        "initialized.owl.carousel": t.proxy(function() {
          this._core.settings.autoHeight && this.update()
        }, this),
        "changed.owl.carousel": t.proxy(function(t) {
          this._core.settings.autoHeight && "position" == t.property.name && this.update()
        }, this),
        "loaded.owl.lazy": t.proxy(function(t) {
          this._core.settings.autoHeight && t.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update()
        }, this)
      }, this._core.options = t.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
      autoHeight: !1,
      autoHeightClass: "owl-height"
    }, e.prototype.update = function() {
      this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass)
    }, e.prototype.destroy = function() {
      var t, e;
      for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.AutoHeight = e
  }(window.Zepto || window.jQuery, window, document),
  function(t, e, n) {
    var i = function(e) {
      this._core = e, this._videos = {}, this._playing = null, this._fullscreen = !1, this._handlers = {
        "resize.owl.carousel": t.proxy(function(t) {
          this._core.settings.video && !this.isInFullScreen() && t.preventDefault()
        }, this),
        "refresh.owl.carousel changed.owl.carousel": t.proxy(function() {
          this._playing && this.stop()
        }, this),
        "prepared.owl.carousel": t.proxy(function(e) {
          var n = t(e.content).find(".owl-video");
          n.length && (n.css("display", "none"), this.fetch(n, t(e.content)))
        }, this)
      }, this._core.options = t.extend({}, i.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", t.proxy(function(t) {
        this.play(t)
      }, this))
    };
    i.Defaults = {
      video: !1,
      videoHeight: !1,
      videoWidth: !1
    }, i.prototype.fetch = function(t, e) {
      var n = t.attr("data-vimeo-id") ? "vimeo" : "youtube",
        i = t.attr("data-vimeo-id") || t.attr("data-youtube-id"),
        o = t.attr("data-width") || this._core.settings.videoWidth,
        r = t.attr("data-height") || this._core.settings.videoHeight,
        s = t.attr("href");
      if (!s) throw new Error("Missing video URL.");
      if (i = s.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), i[3].indexOf("youtu") > -1) n = "youtube";
      else {
        if (!(i[3].indexOf("vimeo") > -1)) throw new Error("Video URL not supported.");
        n = "vimeo"
      }
      i = i[6], this._videos[s] = {
        type: n,
        id: i,
        width: o,
        height: r
      }, e.attr("data-video", s), this.thumbnail(t, this._videos[s])
    }, i.prototype.thumbnail = function(e, n) {
      var i, o, r, s = n.width && n.height ? 'style="width:' + n.width + "px;height:" + n.height + 'px;"' : "",
        a = e.find("img"),
        c = "src",
        l = "",
        u = this._core.settings,
        h = function(t) {
          o = '<div class="owl-video-play-icon"></div>', i = u.lazyLoad ? '<div class="owl-video-tn ' + l + '" ' + c + '="' + t + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + t + ')"></div>', e.after(i), e.after(o)
        };
      return e.wrap('<div class="owl-video-wrapper"' + s + "></div>"), this._core.settings.lazyLoad && (c = "data-src", l = "owl-lazy"), a.length ? (h(a.attr(c)), a.remove(), !1) : void("youtube" === n.type ? (r = "http://img.youtube.com/vi/" + n.id + "/hqdefault.jpg", h(r)) : "vimeo" === n.type && t.ajax({
        type: "GET",
        url: "http://vimeo.com/api/v2/video/" + n.id + ".json",
        jsonp: "callback",
        dataType: "jsonp",
        success: function(t) {
          r = t[0].thumbnail_large, h(r)
        }
      }))
    }, i.prototype.stop = function() {
      this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null
    }, i.prototype.play = function(e) {
      this._core.trigger("play", null, "video"), this._playing && this.stop();
      var n, i, o = t(e.target || e.srcElement),
        r = o.closest("." + this._core.settings.itemClass),
        s = this._videos[r.attr("data-video")],
        a = s.width || "100%",
        c = s.height || this._core.$stage.height();
      "youtube" === s.type ? n = '<iframe width="' + a + '" height="' + c + '" src="http://www.youtube.com/embed/' + s.id + "?autoplay=1&v=" + s.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === s.type && (n = '<iframe src="http://player.vimeo.com/video/' + s.id + '?autoplay=1" width="' + a + '" height="' + c + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'), r.addClass("owl-video-playing"), this._playing = r, i = t('<div style="height:' + c + "px; width:" + a + 'px" class="owl-video-frame">' + n + "</div>"), o.after(i)
    }, i.prototype.isInFullScreen = function() {
      var i = n.fullscreenElement || n.mozFullScreenElement || n.webkitFullscreenElement;
      return i && t(i).parent().hasClass("owl-video-frame") && (this._core.speed(0), this._fullscreen = !0), !(i && this._fullscreen && this._playing) && (this._fullscreen ? (this._fullscreen = !1, !1) : !this._playing || this._core.state.orientation === e.orientation || (this._core.state.orientation = e.orientation, !1))
    }, i.prototype.destroy = function() {
      var t, e;
      this._core.$element.off("click.owl.video");
      for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Video = i
  }(window.Zepto || window.jQuery, window, document),
  function(t, e, n, i) {
    var o = function(e) {
      this.core = e, this.core.options = t.extend({}, o.Defaults, this.core.options), this.swapping = !0, this.previous = i, this.next = i, this.handlers = {
        "change.owl.carousel": t.proxy(function(t) {
          "position" == t.property.name && (this.previous = this.core.current(), this.next = t.property.value)
        }, this),
        "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": t.proxy(function(t) {
          this.swapping = "translated" == t.type
        }, this),
        "translate.owl.carousel": t.proxy(function() {
          this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
        }, this)
      }, this.core.$element.on(this.handlers)
    };
    o.Defaults = {
      animateOut: !1,
      animateIn: !1
    }, o.prototype.swap = function() {
      if (1 === this.core.settings.items && this.core.support3d) {
        this.core.speed(0);
        var e, n = t.proxy(this.clear, this),
          i = this.core.$stage.children().eq(this.previous),
          o = this.core.$stage.children().eq(this.next),
          r = this.core.settings.animateIn,
          s = this.core.settings.animateOut;
        this.core.current() !== this.previous && (s && (e = this.core.coordinates(this.previous) - this.core.coordinates(this.next), i.css({
          left: e + "px"
        }).addClass("animated owl-animated-out").addClass(s).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", n)), r && o.addClass("animated owl-animated-in").addClass(r).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", n))
      }
    }, o.prototype.clear = function(e) {
      t(e.target).css({
        left: ""
      }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.transitionEnd()
    }, o.prototype.destroy = function() {
      var t, e;
      for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Animate = o
  }(window.Zepto || window.jQuery, window, document),
  function(t, e, n) {
    var i = function(e) {
      this.core = e, this.core.options = t.extend({}, i.Defaults, this.core.options), this.handlers = {
        "translated.owl.carousel refreshed.owl.carousel": t.proxy(function() {
          this.autoplay()
        }, this),
        "play.owl.autoplay": t.proxy(function(t, e, n) {
          this.play(e, n)
        }, this),
        "stop.owl.autoplay": t.proxy(function() {
          this.stop()
        }, this),
        "mouseover.owl.autoplay": t.proxy(function() {
          this.core.settings.autoplayHoverPause && this.pause()
        }, this),
        "mouseleave.owl.autoplay": t.proxy(function() {
          this.core.settings.autoplayHoverPause && this.autoplay()
        }, this)
      }, this.core.$element.on(this.handlers)
    };
    i.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1
    }, i.prototype.autoplay = function() {
      this.core.settings.autoplay && !this.core.state.videoPlay ? (e.clearInterval(this.interval), this.interval = e.setInterval(t.proxy(function() {
        this.play()
      }, this), this.core.settings.autoplayTimeout)) : e.clearInterval(this.interval)
    }, i.prototype.play = function() {
      return n.hidden === !0 || this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion ? void 0 : this.core.settings.autoplay === !1 ? void e.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed)
    }, i.prototype.stop = function() {
      e.clearInterval(this.interval)
    }, i.prototype.pause = function() {
      e.clearInterval(this.interval)
    }, i.prototype.destroy = function() {
      var t, n;
      e.clearInterval(this.interval);
      for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
      for (n in Object.getOwnPropertyNames(this)) "function" != typeof this[n] && (this[n] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.autoplay = i
  }(window.Zepto || window.jQuery, window, document),
  function(t) {
    "use strict";
    var e = function(n) {
      this._core = n, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
        next: this._core.next,
        prev: this._core.prev,
        to: this._core.to
      }, this._handlers = {
        "prepared.owl.carousel": t.proxy(function(e) {
          this._core.settings.dotsData && this._templates.push(t(e.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
        }, this),
        "add.owl.carousel": t.proxy(function(e) {
          this._core.settings.dotsData && this._templates.splice(e.position, 0, t(e.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
        }, this),
        "remove.owl.carousel prepared.owl.carousel": t.proxy(function(t) {
          this._core.settings.dotsData && this._templates.splice(t.position, 1)
        }, this),
        "change.owl.carousel": t.proxy(function(t) {
          if ("position" == t.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
            var e = this._core.current(),
              n = this._core.maximum(),
              i = this._core.minimum();
            t.data = t.property.value > n ? e >= n ? i : n : t.property.value < i ? n : t.property.value
          }
        }, this),
        "changed.owl.carousel": t.proxy(function(t) {
          "position" == t.property.name && this.draw()
        }, this),
        "refreshed.owl.carousel": t.proxy(function() {
          this._initialized || (this.initialize(), this._initialized = !0), this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation")
        }, this)
      }, this._core.options = t.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    e.Defaults = {
      nav: !1,
      navRewind: !0,
      navText: ["prev", "next"],
      navSpeed: !1,
      navElement: "div",
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotData: !1,
      dotsSpeed: !1,
      dotsContainer: !1,
      controlsClass: "owl-controls"
    }, e.prototype.initialize = function() {
      var e, n, i = this._core.settings;
      i.dotsData || (this._templates = [t("<div>").addClass(i.dotClass).append(t("<span>")).prop("outerHTML")]), i.navContainer && i.dotsContainer || (this._controls.$container = t("<div>").addClass(i.controlsClass).appendTo(this.$element)), this._controls.$indicators = i.dotsContainer ? t(i.dotsContainer) : t("<div>").hide().addClass(i.dotsClass).appendTo(this._controls.$container), this._controls.$indicators.on("click", "div", t.proxy(function(e) {
        var n = t(e.target).parent().is(this._controls.$indicators) ? t(e.target).index() : t(e.target).parent().index();
        e.preventDefault(), this.to(n, i.dotsSpeed)
      }, this)), e = i.navContainer ? t(i.navContainer) : t("<div>").addClass(i.navContainerClass).prependTo(this._controls.$container), this._controls.$next = t("<" + i.navElement + ">"), this._controls.$previous = this._controls.$next.clone(), this._controls.$previous.addClass(i.navClass[0]).html(i.navText[0]).hide().prependTo(e).on("click", t.proxy(function() {
        this.prev(i.navSpeed)
      }, this)), this._controls.$next.addClass(i.navClass[1]).html(i.navText[1]).hide().appendTo(e).on("click", t.proxy(function() {
        this.next(i.navSpeed)
      }, this));
      for (n in this._overrides) this._core[n] = t.proxy(this[n], this)
    }, e.prototype.destroy = function() {
      var t, e, n, i;
      for (t in this._handlers) this.$element.off(t, this._handlers[t]);
      for (e in this._controls) this._controls[e].remove();
      for (i in this.overides) this._core[i] = this._overrides[i];
      for (n in Object.getOwnPropertyNames(this)) "function" != typeof this[n] && (this[n] = null)
    }, e.prototype.update = function() {
      var t, e, n, i = this._core.settings,
        o = this._core.clones().length / 2,
        r = o + this._core.items().length,
        s = i.center || i.autoWidth || i.dotData ? 1 : i.dotsEach || i.items;
      if ("page" !== i.slideBy && (i.slideBy = Math.min(i.slideBy, i.items)), i.dots || "page" == i.slideBy)
        for (this._pages = [], t = o, e = 0, n = 0; r > t; t++)(e >= s || 0 === e) && (this._pages.push({
          start: t - o,
          end: t - o + s - 1
        }), e = 0, ++n), e += this._core.mergers(this._core.relative(t))
    }, e.prototype.draw = function() {
      var e, n, i = "",
        o = this._core.settings,
        r = (this._core.$stage.children(), this._core.relative(this._core.current()));
      if (!o.nav || o.loop || o.navRewind || (this._controls.$previous.toggleClass("disabled", 0 >= r), this._controls.$next.toggleClass("disabled", r >= this._core.maximum())), this._controls.$previous.toggle(o.nav), this._controls.$next.toggle(o.nav), o.dots) {
        if (e = this._pages.length - this._controls.$indicators.children().length, o.dotData && 0 !== e) {
          for (n = 0; n < this._controls.$indicators.children().length; n++) i += this._templates[this._core.relative(n)];
          this._controls.$indicators.html(i)
        } else e > 0 ? (i = new Array(e + 1).join(this._templates[0]), this._controls.$indicators.append(i)) : 0 > e && this._controls.$indicators.children().slice(e).remove();
        this._controls.$indicators.find(".active").removeClass("active"), this._controls.$indicators.children().eq(t.inArray(this.current(), this._pages)).addClass("active")
      }
      this._controls.$indicators.toggle(o.dots)
    }, e.prototype.onTrigger = function(e) {
      var n = this._core.settings;
      e.page = {
        index: t.inArray(this.current(), this._pages),
        count: this._pages.length,
        size: n && (n.center || n.autoWidth || n.dotData ? 1 : n.dotsEach || n.items)
      }
    }, e.prototype.current = function() {
      var e = this._core.relative(this._core.current());
      return t.grep(this._pages, function(t) {
        return t.start <= e && t.end >= e
      }).pop()
    }, e.prototype.getPosition = function(e) {
      var n, i, o = this._core.settings;
      return "page" == o.slideBy ? (n = t.inArray(this.current(), this._pages), i = this._pages.length, e ? ++n : --n, n = this._pages[(n % i + i) % i].start) : (n = this._core.relative(this._core.current()), i = this._core.items().length, e ? n += o.slideBy : n -= o.slideBy), n
    }, e.prototype.next = function(e) {
      t.proxy(this._overrides.to, this._core)(this.getPosition(!0), e)
    }, e.prototype.prev = function(e) {
      t.proxy(this._overrides.to, this._core)(this.getPosition(!1), e)
    }, e.prototype.to = function(e, n, i) {
      var o;
      i ? t.proxy(this._overrides.to, this._core)(e, n) : (o = this._pages.length, t.proxy(this._overrides.to, this._core)(this._pages[(e % o + o) % o].start, n))
    }, t.fn.owlCarousel.Constructor.Plugins.Navigation = e
  }(window.Zepto || window.jQuery, window, document),
  function(t, e) {
    "use strict";
    var n = function(i) {
      this._core = i, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
        "initialized.owl.carousel": t.proxy(function() {
          "URLHash" == this._core.settings.startPosition && t(e).trigger("hashchange.owl.navigation")
        }, this),
        "prepared.owl.carousel": t.proxy(function(e) {
          var n = t(e.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
          this._hashes[n] = e.content
        }, this)
      }, this._core.options = t.extend({}, n.Defaults, this._core.options), this.$element.on(this._handlers), t(e).on("hashchange.owl.navigation", t.proxy(function() {
        var t = e.location.hash.substring(1),
          n = this._core.$stage.children(),
          i = this._hashes[t] && n.index(this._hashes[t]) || 0;
        return !!t && void this._core.to(i, !1, !0)
      }, this))
    };
    n.Defaults = {
      URLhashListener: !1
    }, n.prototype.destroy = function() {
      var n, i;
      t(e).off("hashchange.owl.navigation");
      for (n in this._handlers) this._core.$element.off(n, this._handlers[n]);
      for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Hash = n
  }(window.Zepto || window.jQuery, window, document), $("#regionChange select").on("change", function() {
    $("#regionChange").submit()
  }), $("#catalog-filters input[type=checkbox], #catalog-filters input[type=radio]").on("change", function() {
    $("#catalog-filters").submit()
  }), currentUser && setInterval(checkUnreaded, checkUnreadedInterval), setInterval(timer, 1e3), $('a[href="#"]').on("click", function(t) {
    t.preventDefault()
  });
try {
  $(".tree ul:has(li.active)").show()
} catch (t) {}
var timeoutUpdateShopMenu;
updateShopMenu(), $(window).on("resize", updateShopMenu);
try {
  lh = location.host
} catch (t) {}
jQuery(document).ready(function(t) {
    function e() {
      if (t("#chat-search").length) {
        var e = t("#chat-search").val().toLowerCase();
        t(".user_.not-found").removeClass("show"), t(".user_").each(function() {
          name = t(this).find(".details p:eq(0)").text().toLowerCase(), theme = t(this).find(".details p:eq(1)").text().toLowerCase(), note = t(this).find(".details a.link1").text().toLowerCase(), "" == e ? t(this).show() : name.indexOf(e) >= 0 || theme.indexOf(e) >= 0 || note.indexOf(e) >= 0 ? t(this).show() : t(this).hide()
        }), 0 == t(".user_:not(.not-found):visible").length && t(".user_.not-found").addClass("show")
      }
    }
    t(".news.hide").removeClass("hide");
    try {
      var n = t(".carousel_news_in");
      n.owlCarousel({
        margin: 0,
        responsive: {
          0: {
            items: 1
          },
          900: {
            items: 2
          }
        }
      }), t(".carousel_next").click(function() {
        n.trigger("next.owl.carousel")
      }), t(".carousel_prev").click(function() {
        n.trigger("prev.owl.carousel", [300])
      }), t(".collapse").on("shown.bs.collapse", function() {
        t(".unveil", this).trigger("unveil")
      })
    } catch (t) {}
    t(document).on("click", ".tfa-confirm", openTfaModal), t.notifyDefaults({
      type: "info",
      allow_dismiss: !0,
      newest_on_top: !0,
      placement: {
        from: "bottom",
        align: "left"
      },
      offset: {
        x: 20,
        y: 20
      },
      icon_type: "image",
      spacing: 10,
      z_index: 1031,
      delay: 5e3,
      animate: {
        enter: "animated fadeInDown",
        exit: "animated fadeOutDown"
      },
      mouse_over: "pause",
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button><img data-notify="icon" class="icon"> <div data-notify="message" class="message"><div data-notify="title" class="title over">{1}</div> {2}</div><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" data-notify="url"></a></div>'
    }), t("span.price-helper").mouseover(function() {
      t(this).tooltip({
        title: function() {
          return priceBTC = parseFloat(this.innerHTML), priceUSD = parseFloat(priceBTC * parseFloat(currenciesByCode.USD.back_rate) / 1e8).toFixed(2) + " $", priceRUR = Math.round(priceBTC * parseFloat(currenciesByCode.RUR.back_rate) / 1e8) + " руб", priceUSD + "<br>" + priceRUR
        },
        html: !0
      }).tooltip("show")
    }), t('[data-toggle="tooltip"]').tooltip(), t('[data-toggle="popover"]').popover(), t("img.unveil").show(), t("img.unveil").unveil(0, function() {
      t(this).load(function() {
        t(this).removeClass("default")
      })
    });
    try {
      t(".carousel").carousel({
        interval: 1e4
      }), t(".fancybox").fancybox()
    } catch (t) {}
    t("#myshop").click(function(e) {
      return e.preventDefault(), t(".floatbtn").hide(), t(".float_apanel").show(), !1
    }), t(".closebtn").click(function(e) {
      return e.preventDefault(), t(".float_apanel").hide(), t(".floatbtn").show(), !1
    }), scrollChat(), scrollPublicChat();
    var i = t("nav.navbar").outerHeight() + t("div.row.menu").outerHeight() + t(".header-message-container").height(),
      o = t("footer").outerHeight();
    t(window).height() - i - o - t(".stitlemessage").outerHeight() - t(".chat-members").outerHeight() - Math.min(145, t(".dialog-answer").outerHeight()) - 50;
    t(".user_.active").lenght && t(".userlist").scrollTop(t(".user_.active").position().top - 24), t(".user_").css({
      cursor: "pointer"
    }), t("#chatmessage .paginator").hide(), t(".chat-container .scrollbox").scroll(function(e) {
      if (0 == t(".chat-container .scrollbox").scrollTop()) {
        var n = t("#chatmessage .msg").first();
        n.is(".empty") ? t("#chatmessage .loading").hide() : (t("#chatmessage .loading").show(), t.ajax("/inbox/load/" + Chat.id, {
          dataType: "html",
          data: {
            lastId: n.data("id")
          },
          success: function(e) {
            t(e).insertBefore(n), t(".chat-container .scrollbox").scrollTop(n.position().top - 24), t("#chatmessage .loading").hide()
          },
          error: function() {
            t("#chatmessage .loading").hide()
          }
        }))
      }
    }), t(".chatarea").scroll(function(e) {
      if (0 == t(".chatarea").scrollTop()) {
        var n = t(".chatarea .chmessage").first();
        n.is(".empty") ? t(".chatarea .loading").hide() : (t(".chatarea .loading").show(), t.ajax("/chat/load", {
          dataType: "html",
          data: {
            lastId: n.data("id")
          },
          success: function(e) {
            t(e).insertBefore(n), t(".chatarea ").is(".smallchatbox") ? t(".chatarea ").scrollTop(n.position().top - 184) : t(".chatarea ").scrollTop(n.position().top - 74), t(".chatarea .loading").hide()
          },
          error: function() {
            t(".chatarea .loading").hide()
          }
        }))
      }
    }), t(".chat-form").attr("onsubmit", "return sendChatMessage(this);"), t(".public-chat").attr("onsubmit", "return sendPublicChatMessage(this);"), t("#chat-search").keyup(e), t("#chat-search").change(e), t(".note-trigger").click(function() {
      return t(".note-trigger").text("Оставить заметку" == t(".note-trigger").text() ? "Спрятать" : "Оставить заметку").toggleClass("ptop20"), t(".notepanel").slideToggle(0, function() {
        "block" == t(".notepanel").css("display") && t(".notepanel textarea").focus()
      }), !1
    }), t(".notepanel").submit(function() {
      return url = t(this).attr("action"), t.ajax(url, {
        dataType: "json",
        method: "POST",
        data: t(".notepanel input[type=text]"),
        success: function(e) {
          t(".note-trigger").click(), t("#chat-note-" + Chat.id).text(t(".notepanel input[type=text]").val())
        }
      }), !1
    }), t("#commentfield").focus(function() {
      t("#commentfield").animate({
        height: "130px"
      })
    })
  }), $(document.body).on("click", ".favorite_list", function(t) {
    t.preventDefault(), $(this).tooltip("hide");
    var e = $(this).attr("href");
    return $.ajax({
      type: "GET",
      url: e,
      context: $(this),
      dataType: "json",
      success: function(t) {
        t.success && ("add" == t.operation ? $(this).replaceWith('<a href="/favorites/del/' + $(this).data("id") + "/" + $(this).data("type") + '" data-id="' + $(this).data("id") + '"  data-type="' + $(this).data("type") + '" data-toggle="tooltip" data-placement="bottom" title="Удалить из закладок" class="favorite_list"> <i class="i_heartfill"></i>' + ("market" == $(this).data("type") ? "убрать" : "") + "</a>") : $(this).replaceWith('<a href="/favorites/add/' + $(this).data("id") + "/" + $(this).data("type") + '" data-id="' + $(this).data("id") + '"   data-type="' + $(this).data("type") + '"  data-toggle="tooltip" data-placement="bottom" title="Добавить в закладки" class="favorite_list"> <i class="i_heart"></i>' + ("market" == $(this).data("type") ? "в закладки" : "") + "</a>"))
      }
    }), !1
  }),
  function() {
    function t(t) {
      function e(t) {
        var e = function() {
          i.play();
          var e = Array.prototype.slice.call(arguments);
          return t.apply(this, e)
        };
        return e.original = t, e
      }

      function n(t) {
        if (t) {
          if ("function" != typeof t) throw new TypeError("expecting a function");
          return e(t)
        }
        i.play()
      }
      var i = new Audio(t);
      return i.load(), i.autoplay = !1, n
    }
    window.Audio || (window.Audio = function() {}, Audio.prototype.load = Audio, Audio.prototype.play = Audio), window.createBeeper = t, window.beep = t("data:audio/ogg;base64,T2dnUwACAAAAAAAAAABMHAb7AAAAAEigSrMBHgF2b3JiaXMAAAAAAUSsAAD/////APQBAP////+4AU9nZ1MAAAAAAAAAAAAATBwG+wEAAAAtPX8zDzD/////////////////6AN2b3JiaXMKAAAATGF2ZjUzLjIuMAEAAAASAAAAZW5jb2Rlcj1MYXZmNTMuMi4wAQV2b3JiaXMpQkNWAQAIAAAAMUwgxYDQkFUAABAAAGAkKQ6TZkkppZShKHmYlEhJKaWUxTCJmJSJxRhjjDHGGGOMMcYYY4wgNGQVAAAEAIAoCY6j5klqzjlnGCeOcqA5aU44pyAHilHgOQnC9SZjbqa0pmtuziklCA1ZBQAAAgBASCGFFFJIIYUUYoghhhhiiCGHHHLIIaeccgoqqKCCCjLIIINMMumkk0466aijjjrqKLTQQgsttNJKTDHVVmOuvQZdfHPOOeecc84555xzzglCQ1YBACAAAARCBhlkEEIIIYUUUogppphyCjLIgNCQVQAAIACAAAAAAEeRFEmxFMuxHM3RJE/yLFETNdEzRVNUTVVVVVV1XVd2Zdd2ddd2fVmYhVu4fVm4hVvYhV33hWEYhmEYhmEYhmH4fd/3fd/3fSA0ZBUAIAEAoCM5luMpoiIaouI5ogOEhqwCAGQAAAQAIAmSIimSo0mmZmquaZu2aKu2bcuyLMuyDISGrAIAAAEABAAAAAAAoGmapmmapmmapmmapmmapmmapmmaZlmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVlAaMgqAEACAEDHcRzHcSRFUiTHciwHCA1ZBQDIAAAIAEBSLMVyNEdzNMdzPMdzPEd0RMmUTM30TA8IDVkFAAACAAgAAAAAAEAxHMVxHMnRJE9SLdNyNVdzPddzTdd1XVdVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVgdCQVQAABAAAIZ1mlmqACDOQYSA0ZBUAgAAAABihCEMMCA1ZBQAABAAAiKHkIJrQmvPNOQ6a5aCpFJvTwYlUmye5qZibc84555xszhnjnHPOKcqZxaCZ0JpzzkkMmqWgmdCac855EpsHranSmnPOGeecDsYZYZxzzmnSmgep2Vibc85Z0JrmqLkUm3POiZSbJ7W5VJtzzjnnnHPOOeecc86pXpzOwTnhnHPOidqba7kJXZxzzvlknO7NCeGcc84555xzzjnnnHPOCUJDVgEAQAAABGHYGMadgiB9jgZiFCGmIZMedI8Ok6AxyCmkHo2ORkqpg1BSGSeldILQkFUAACAAAIQQUkghhRRSSCGFFFJIIYYYYoghp5xyCiqopJKKKsoos8wyyyyzzDLLrMPOOuuwwxBDDDG00kosNdVWY4215p5zrjlIa6W11lorpZRSSimlIDRkFQAAAgBAIGSQQQYZhRRSSCGGmHLKKaegggoIDVkFAAACAAgAAADwJM8RHdERHdERHdERHdERHc/xHFESJVESJdEyLVMzPVVUVVd2bVmXddu3hV3Ydd/Xfd/XjV8XhmVZlmVZlmVZlmVZlmVZlmUJQkNWAQAgAAAAQgghhBRSSCGFlGKMMcecg05CCYHQkFUAACAAgAAAAABHcRTHkRzJkSRLsiRN0izN8jRP8zTRE0VRNE1TFV3RFXXTFmVTNl3TNWXTVWXVdmXZtmVbt31Ztn3f933f933f933f933f13UgNGQVACABAKAjOZIiKZIiOY7jSJIEhIasAgBkAAAEAKAojuI4jiNJkiRZkiZ5lmeJmqmZnumpogqEhqwCAAABAAQAAAAAAKBoiqeYiqeIiueIjiiJlmmJmqq5omzKruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6QGjIKgBAAgBAR3IkR3IkRVIkRXIkBwgNWQUAyAAACADAMRxDUiTHsixN8zRP8zTREz3RMz1VdEUXCA1ZBQAAAgAIAAAAAADAkAxLsRzN0SRRUi3VUjXVUi1VVD1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVXVNE3TNIHQkJUAABkAAGTB9yCEEA6j1EIwQWjMQQap5KBBSaXV1oPmEDOMOe+VhJJJSj1YzkHEkPMgIccUY0ppKy1l1BjBQOfcceUQBEJDVgQAUQAAgDGGMcQYcs5JyaREzjEpnZTIOUelk9JJKS2WGDMpJbYSY+Sco9JJyqSUGEuLHaUSY4mtAACAAAcAgAALodCQFQFAFAAAYgxSCimFlFLOKeaQUsox5RxSSjmmnFPOOQgdhMoxBp2DECmlHFPOKecchMxB5ZyD0EEoAAAgwAEAIMBCKDRkRQAQJwDgkBzPkzRLFCVLE0VPFGXXE01XljTNFDVRVFXLE1XVVFXbFk1VtiVNE0VN9FRVE0VVFVXTlk1VtW3PNG3ZVF3dFlVVt2Xb9n1XtoXfM01ZFlXV1k3VtXXXln1ftnVdmDTNNDVRVFVNFFXVdFXdNlXXtjVRdF1RVWVZVFVZVmXZFlZZ1n1LFFXVU03ZFVVVllXZ9W1Vln3fdF1dV2XZ91VZ9nXbF4bl9n2jqKq2bsqur6uy7Pu2bvNt3zdKmmaamii6qiaKqmuqqm6bqmvbliiqqqiqsuyZqiursizsqivbuiaKqiuqqiyLqirLquz6virLui2qqq2rsuzrpiv7vu772LLuG6eq6roq276xyrKv676vtHXd9z3TlGXTVX3dVFVfl3XfKNu6MIyqquuqLPvGKsu+sPs+uvETRlXVdVV2hV2VbV/YjZ2w+76xzLrNuH1fOW5fV5bfWPKFuLYtDLNvM25fN/rGrwzHMuSZpm2Lrqrrpurqwqzrxm/7ujGMqurrqizzVVf2dd33CbvuG8PoqrqwyrLvq7bs+7ruG8tv/Li2zbd9nzHbuk/4jXxfWMq2LbSFn3LrurEMv5Gu/AgAABhwAAAIMKEMFBqyIgCIEwBgEHJOMQWhUgxCByGlDkJJFWMQMuekVMxBCaW0FkJJrWIMQuWYhMw5KaGElkIpLXUQUgqltBZKaS21FmtKLcYOQkqhlJZCKa2llmJMrcVYMQYhc0xKxpyUUEpLoZTWMuekdA5S6iCkVFJqrZTUYsWYlAw6Kp2DkkoqMZWUWgultFZKirGkFFtrMdbWYq2hlNZCKa2VlGJMLdXWYqy1YgxC5piUjDkpoZSWQimpVYxJ6aCjkjkoqaQUWykpxcw5KR2ElDoIKZVUYisptRZKaa2kFFsopcUWW60ptVZDKa2VlGIsKcXYYqu1xVZjByGlUEproZTWUms1ptZiDKW0VlKKsaQUW4ux1tZiraGU1kIqsZWSWkyx1dharDW1FmNqsdYWY60x1tpjrb2nlGJMLdXYWqw51tZjrTX3DkJKoZTWQimtpdZqTK3FGkppraQSWyipxRZbra3FWEMprZWUWiwpxdhiq7XFWGtqLcYWW60ptVhjrj3HVmNPrcXYYqy1tVZrrDXnWGOvBQAADDgAAASYUAYKDVkJAEQBABCEKMWclAYhx5yjlCDEmIOUKscglNJaxRyUUlrrnJPSUoydg1JSirGk1FqMtZaUWoux1gIAAAocAAACbNCUWByg0JCVAEAUAABiDEKMQWiQUcoxCI1BSjEGIVKKMeekREox5pyUzDHnJKSUMecclJRCCKWk0lIIoZSUUisAAKDAAQAgwAZNicUBCg1ZEQBEAQAAxiDGEGMIOgchkxI5yKB0EBoIIZVOSkallFZay6SUlkprEYROSkgpo1JaK6llkkprpZUCAMAOHADADiyEQkNWAgB5AACIMUox5pxzBiGlHHPOOYOQUsw555xiijHnIIRQKcaYcxBCyBxzDkIIIWTMOQchhBA65yCEUEIInXMQQgghlM45CCGUUErnHIQQQimlAACgAgcAgAAbRTYnGAkqNGQlAJAHAAAYo5RzUlJqlGIMQiqtRQoxBqGk1irGnJOSUowVY85JSS3GDkIpKbVWawehlJRaq7WUklJsteZcSmktxlpzTq3FWGuuPafWYqw159wLAMBdcAAAO7BRZHOCkaBCQ1YCAHkAAAxCSjHGGGNIKcYYY4wxpJRijDHGmGKMMcYYc04xxhhjjDnHGGPMMeecY4wxxpxzzjHGGHPOOecYY4w555xzjDHnnHPOOcaYc84555wAAKACBwCAABtFNicYCSo0ZCUAkAcAABAipZRSSmmklFJKKaU0UkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSiklhBBCCCGEEAoAcbxwAPSZsFFkc4KRoEJDVgIAqQAAgDEKOQWdhFQapZyDkEpKKTVKOSchpZRSq5yTklJrscVYOSclpdZarLGTklKLtdaacycltRZjrbXmkFKMtebac9AhpRZrzTXn3Etrseaccw8+mNhirb33nntQMdZcg+5BCKFirDnnHIQPvgAAkwgHAMQFG1ZHOCkaCyw0ZBUAEAMAMAQAQSiaAQCACQ4AAAFWsCuztGqjuKmTvOiDwCd0xGZkyKVUzORE0CM11GIl2KEV3OAFYKEhKwEAMgAABGrMtcdYI8SYg1RaLhVSCkqJvVRKKQeh5ZophZRylkvHmGKMUawldEgZBK2E0CmFiKKWWiuhQ8hJyjHG1ikGAACAIADAQITMBAIFUGAgAwAOEBKkAIDCAkPHcBEQkEvIKDAoHBPOSacNAEAQIjNEImIxSEyoBoqK6QBgcYEhHwAyNDbSLi6gywAXdHHXgRCCEIQgFgdQQAIOTrjhiTc84QYn6BSVOggAAAAAAAQAeAAASDaAiIho5jg6PD5AQkRGSEpMTlACAAAAAAAIAD4AAJIUICIimjmODo8PkBCREZISkxOUAAAAAAAAAAAAICAgAAAAAAAQAAAAICBPZ2dTAATAKQAAAAAAAEwcBvsCAAAA+CpiXxZCPkDk3jMvLjFAQDrXvsLf/wT/CPn2/C3lv5K3NmCkQF09XD0/z/X2ziGPk6+++iPhyYOEErC3SyOLrXu0l6qmxYP3e4kr914/mBbFwqPGw0jOK1ysD1wA/GE9/3oKfTObImt12QFyXU/fr6hSwX+W6wgkEC4S7bDo6z8u192VpQ5FrAK0MvP1bjMpnmE3aW0PhCnbQgYcaunfnrm9mZcQcDAnWC07wKj+zh/df0q2AeBB6kjpcjAbGxpH9QRsul6v08Ok8ctRbNwv+0SzyE9UAWCANgAAWogl2d+1vXCWTf82lvTYsKp9vzu7D+ZYqwgAgI1AOiBcDQAA9AbBILOoDgEW1r0EAYCAVZ3FtAQBgIBVCTKAEkQAAFD53Nbg7MH/h0F2LQfbNN7HBQAhSGWg+g1htiiUg3cxBAABIysnK6MkI1PKBvvDJ9V61AXHDaGAIkAXEwkqmemez0jaxMkyHZCRSJBuKgQmzBgSiZXBNPRXtLAcEqhVOYHXPpVOxhzq9Fj3baMFqlhAoZ7kVT0siv/LRCR6EGQcpS4ULFssCWYIroHGVWMMMcWhvIRj0CKHGp0gAzjw7QkAthfl4/+xAtkoy1N/HVfl2mxYt1/+QqdO5tsAANAHxSUAfPpiB3pAoC9jABac4wQAAPdg8vkYAGjsEqWMIAEAAP1uQuzeq/1iDypKeZ7GwH4kAKi9LD286P1fWrzb/rvnhOY9iuDDnEd4tWrIdvKU4V8LitYFtHXHw/8NmSoeV5uoPqFM5yCIU19W6L4DS01JYmaA5tUQ+EDQ7YGiONGdp1FBfD1gRGOVxX0VGQSYpJze17TDHAqPfmrddjINWs6W17rfV6WFMkhMiuYQY1GmtukXYAGgOhDAXu8IAEgAtBn9///suVHP9CK358ximBMCBQZur5tLZEpUTx63Reiww7EkW4SBD8oxBUp0L+SmOiQAvCm1/y+o4En+YVhV+AQgAHJQOd4PtnBKJP4IdfOtXNDnRnUoHvApNbKeEFRVuw2MNen/5nJ8BORHOkZO+yvQ5AD9dfaRVF2fr6FaCzMRqFAGFGRw7/cv+DpxsKcrlDmL/583gWza/geVIquIfweaHPQOt1duH6oMUtl5hL173U1R1K5rK6nuB8fTGnzfAcw98b92Um9WD3XVAeZzje8HH+HJ89lADsIfOKNwoqHBmeOR8G0LMMB6PsyKV73Wy21Slenz/Z/3sbUKlx2New5UXtl/7Xu7pV7uV5NxAACyLQAJ2Am0JEwBeL7qly7Wk7r9Xa/LVk9WxL92cvh56aJ7t5f7A0keVl0AQHTTiS0JHGqFP/bYizmX1LrsAOF2j+fif8b8vE2BBMYPhHOv71waRT0ynSt1KAaA6a8N3z+WzfLZzH1SsbBeABp4Vdj/7QY0U+Jb/9uWkqBs1M8obl5rHr8fYjgTAEAfXmEQAOYbDfQKqMFHCQlW468A2QCAdeHGA+BXKChBBAAAGz8jW61KHmsCErzR9g62LwAWYiym72by9ups88SfRvs7ZFETAnT2+tGtXVOobR+b0qiZFEQHnp+uinnAHf4U6p1geMbjDPmB7dxFILte9+HTAMFnSVu9VjyEdWrb/QsJdrRnfXttc5Wyaae7lGjvcbhdtN12wxRIpqqLullvhvDcdmWKIYdc1R7NJEss1W+UDvglmiQA3jdV2f+dfKMsU7n22mYjFNoSGZYBAMACCgAAMBn0gAJnAtDTAACsijC5AACwgIIRRAAAkDs45M220fY9UJWXWwNjfD8AINVOlaFfaBXxanxgFYRRC5CAO6rnoWXcxz4L0VOktSYWM7h6LcZq6fgBa9UZhbWq4pKwkxkiUrptExJxo60CtKxWFfDCsAvwhFIBLq6WDawFqsFbhvjq17WBv5dlgRSkCpLD9O88ZlQcFA1kRaVQdDkF4CTAY1sEAP4nJcT/yXardG9h2YvkEs2ohc+tBgDQc40GAKpIJgsADwb15KAD/GCyCwCgMGFQSAAA4OjGm/f0wistFn9+c/97kvD2AwBO4W8o5Lp/eoaV9y4xdY97wA2gaTWXkbOkG4pExFckQXME8nm2ELqm7pdzI/+kDmU9VsL82gqb0n3vWjUrlnDbXT1ljYtHpfIWtmnWMEoGRWM/oJGSp4UIwa56KODFwMYq/q5nogEIIGrBcfEBwhsA6CjwBuAwZgDfUoAG/tbkxf9TLrZCPcK1tVHRlo2JtAGdswQAYIEuASwA+jo5YAEKswGYBoCFGw4AIJEUMgwAAP/C0c4jlMa5wfQaKJCGjwsAtBYZpcHawCP2Cdgn4PHWinxYc10Wp/MLWFAek5vVMqINqtmSLMZfnt60PvxyYW36JDnZjxHocrLp0ItRwMLendCtNkz/T3057Rc/JcRUu5kiAZqpe3WRCajbN2k4qhobvZTnfFRVXNHgEgMYmk0mnQF7Y2yqdX18tI7I+RHQVCt3g9JyzwRrleZedb2T7hGUVA74zHr3xwApAR5m5Oj/0xoG5ZriWrbJMxuTJYNFSd0JAKBHFQDgFgckqNEzKQCAklsKMAKyyXkGBgAIn/rRD5nJM4KczYfdfh+fzwCwEgr6WZA3cVanRbb2rJp1tzk2tBpNF4Ph85k4WhxCUYjwtCPsrxBxZuUbYsHneEIBGTJiGv4TXSY2xCJxogMEcPV1RbUMwwdm0nUjSsFUWEUaL0uRFKPIwFiIItW0ncyiqIlEAKPH8SpG5kxtYYoik2TnhssHplUl+PkIjwC3m2RR9ePaZJN55r/kvL0r4Q89r7tZZVMd9yDXAkHb2h+NuRD0dVttRs1QRsZD8wInQU66pu599U+xetFMzTJ8/h++5SPkP+u1K+VqYk9nlhUgH7cAAAAARwC4JQxADDC5BUAD5IUDcoIxCqAAAGAqACp5ZR6/moNIxFJ/uBeHAmdY7hHt33q/iboBdcCdCLY6nBYORV2nZcPgC98UZOD9vB8LTQsNVmJWVX5fBBI1LADuvE3VmLQL4rRNDN51WdybMkxTKTlhplLNp7vD3ERFRDREokTctHIIR3s84d+VTyVIgzZrSMuoGPQRpGwl6Aa2q3V5AGAGtVJ+U5t6Nivc+nvloMgmGR2JsqZoZIEcxYvMBJ/KuvtFJjgDPuyiXH90ljfnB6Z2lyxObl8hqPXq4al8nwsFuWIy/LVcrd7Q14r+1fvQF4cAAL4VpOxvmV+YYcqZXCFR2bgVA9aSDAAADIB3AMABAMorp/IcRwHkbgr/RO1SDZeFZ4RWD6AXALutbkoYDyeLOEkai/vaOhvVwagUIbS4lIqBa0xS79woBAktiL9EjHQ83AG0oVkIRON+JYFFsLfy1GrupxstXXJwQaUUMRdMCIo4VpXH3xq0CG3hzwVUjfHfhzHz3CrqaCSfneO62gbQMwxqbN+Zw0PC55TsvZjiZi5Hu4znzEz+YhvEI7iuqZlVK2K//lPa2LJPLWY6mqevyIl2vPip6JIuA9SmOX7tPGK4XNYC722n98aaW2pOFspfPOytJrARdAkdAL4UhOJPMqt0QShzCS8J5d8oP9bYnjccOAAwkgGqPJdMk1EA2N98Wv+///PuZcmGd3AW7f0e/PvY/W26Fmrj0ZOKunE4Z67eFMdjc2Zjs8uRpofTpK0d/n38/4npsel4+O/ZnG5c3+pa27prWoSALxae67iODxwx4VjT/Ph00T5W9a9PQ8Afl/PLuj5WY1ssFk+fLi9zgVFVVbZYMOxxOYQtwvwIti21Lv6a+6gi56I5zIPmMNe0WG7fa7PUse61URN5RtiYIs5ZcM4y54PmR31FCjBbbLONwpjYSUXT93i7/Uj+Giy1mE1oyp5etDRgAwT4BX6nCQ==");
  }(), String.prototype.hexEncode = function() {
    var t, e, n = "";
    for (e = 0; e < this.length; e++) t = this.charCodeAt(e).toString(16), n += ("000" + t).slice(-4);
    return n
  }, Number.prototype.formatMoney = function(t, e, n, i) {
    t = isNaN(t = Math.abs(t)) ? 2 : t, e = void 0 !== e ? e : "$", n = n || ",", i = i || ".";
    var o = this,
      r = o < 0 ? "-" : "",
      s = parseInt(o = Math.abs(+o || 0).toFixed(t), 10) + "",
      a = (a = s.length) > 3 ? a % 3 : 0;
    return e + r + (a ? s.substr(0, a) + n : "") + s.substr(a).replace(/(\d{3})(?=\d)/g, "$1" + n) + (t ? i + Math.abs(o - s).toFixed(t).slice(2) : "")
  }, Number.prototype.round = function(t) {
    return +(Math.round(this + "e+" + t) + "e-" + t)
  };