parcelRequire = (function (e, t, n, i) {
    var r,
        o = "function" == typeof parcelRequire && parcelRequire,
        a = "function" == typeof require && require
    function s(n, i) {
        if (!t[n]) {
            if (!e[n]) {
                var r = "function" == typeof parcelRequire && parcelRequire
                if (!i && r) return r(n, !0)
                if (o) return o(n, !0)
                if (a && "string" == typeof n) return a(n)
                var c = new Error("Cannot find module '" + n + "'")
                throw ((c.code = "MODULE_NOT_FOUND"), c)
            }
            ;(u.resolve = function (t) {
                return e[n][1][t] || t
            }),
                (u.cache = {})
            var l = (t[n] = new s.Module(n))
            e[n][0].call(l.exports, u, l, l.exports, this)
        }
        return t[n].exports
        function u(e) {
            return s(u.resolve(e))
        }
    }
    ;(s.isParcelRequire = !0),
        (s.Module = function (e) {
            ;(this.id = e), (this.bundle = s), (this.exports = {})
        }),
        (s.modules = e),
        (s.cache = t),
        (s.parent = o),
        (s.register = function (t, n) {
            e[t] = [
                function (e, t) {
                    t.exports = n
                },
                {},
            ]
        })
    for (var c = 0; c < n.length; c++)
        try {
            s(n[c])
        } catch (e) {
            r || (r = e)
        }
    if (n.length) {
        var l = s(n[n.length - 1])
        "object" == typeof exports && "undefined" != typeof module
            ? (module.exports = l)
            : "function" == typeof define &&
              define.amd &&
              define(function () {
                  return l
              })
    }
    if (((parcelRequire = s), r)) throw r
    return s
})(
    {
        I5x1: [
            function (e, t, n) {
                t.exports = {
                    "for every dot return 0 or 1 \nto change the visibility":
                        "Math.random() < 0.1",
                    "use a float between 0 and 1\n to define the size":
                        "Math.random()",
                    "parameter `t` is \nthe time in seconds": "Math.sin(t)",
                    "param `i` is the index \nof the dot (0..255)": "i / 256",
                    "`x` is the column index\n from 0 to 15": "x / 16",
                    "`y` is the row\n also from 0 to 15": "y / 16",
                    "positive numbers are white,\nnegatives are red": "y - 7.5",
                    "use the time\nto animate values": "y - t",
                    "multiply the time\nto change the speed": "y - t*4",
                    "create patterns using \ndifferent color":
                        "[1, 0, -1][i%3]",
                    "skip `Math.` to use methods \nand props like `sin` or `PI`":
                        "sin(t-sqrt((x-7.5)**2+(y-6)**2))",
                    "more examples ...": "sin(y/8 + t)",
                    "simple triangle": "y - x",
                    "quarter triangle": "(y > x) && (14-x < y)",
                    pattern: "i%4 - y%4",
                    grid: "x%4 && y%4",
                    square: "x>3 & y>3 & x<12 & y<12",
                    "animated square": "-(x>t & y>t & x<15-t & y<15-t)",
                    "mondrian squares": "(y-6) * (x-6)",
                    "moving cross": "(y-4*t|0) * (x-2-t|0)",
                    sierpinski: "4 * t & i & x & y",
                    "binary clock": "(t*10) & (1<<x) && y==8",
                    "random noise": "random() * 2 - 1",
                    "static smooth noise": "sin(i ** 2)",
                    "animated smooth noise": "cos(t + i + x * y)",
                    waves: "sin(x/2) - sin(x-t) - y+6",
                    "bloop bloop bloop\nby @v21": "(x-8)*(y-8) - sin(t)*64",
                    "fireworks\nby @p_malin and @aemkei":
                        "-.4/(hypot(x-t%10,y-t%8)-t%2*9)",
                    "ripples\nby @thespite": "Math.sin(t-Math.sqrt(x*x+y*y))",
                    "scrolling TIXY font\nby @atesgoral":
                        "[5463,2194,2386][y+t*9&7]&1<<x-1",
                    "3d checker board\nby @p_malin":
                        "(((x-8)/y+t*5)&1^1/y*8&1)*y/5",
                    "sticky blood\nby @joeytwiddle":
                        "y-t*3+9+3*cos(x*3-t)-5*sin(x*7)",
                    "3d starfield\nby @p_malin":
                        "d=y*y%5.9+1,!((x+t*50/d)&15)/d",
                    "dialogue with an alien\nby @chiptune":
                        "1/32*tan(t/64*x*tan(i-x))",
                    "space invader\nby @keithclarkcouk + @zozuar":
                        "'p}¶¼<¼¶}p'.charCodeAt(x)&2**y",
                    "hungry pac man\nby @p_malin and @aemkei":
                        "hypot(x-=t%4*5,y-=8)<6&&x<y|y<-x",
                    "spectrum analyser\nby @joeytwiddle":
                        "x&y<9&y>4+sin(8*t+x*x)+x/4",
                    diagonals: "y == x || -(15-x == y)",
                    frame: "x==0 | x==15 | y==0 | y==15",
                    drop: "8*t%13 - hypot(x-7.5, y-7.5)",
                    rotation: "sin(2*atan((y-7.5)/(x-7.5))+5*t)",
                    wipe: "(x-y) - sin(t) * 16",
                    "soft wipe": "(x-y)/24 - sin(t)",
                    disco: "sin(t*5) * tan(t*7)",
                    "input is limited \nto 32 characters!":
                        "(x-5)**2 + (y-5)**2 - 99*sin(t)",
                    "click here to \ncreate your own": "'HAVE FUN!'",
                }
            },
            {},
        ],
        Focm: [
            function (e, t, n) {
                "use strict"
                var i = (function (e) {
                    return e && e.__esModule ? e : {default: e}
                })(e("./examples.json"))
                var r = 16,
                    o = 16,
                    a = 1,
                    s = r * (o + a) - a,
                    c = document.getElementById("input"),
                    l = document.getElementById("editor"),
                    u = document.getElementById("comment"),
                    d = document.getElementById("output"),
                    y = d.getContext("2d"),
                    f = window.devicePixelRatio || 1,
                    h = function () {},
                    m = null,
                    p = ""
                function x() {
                    var e = new URL(document.location)
                    e.searchParams.has("code") &&
                        (c.value = e.searchParams.get("code"))
                }
                function v() {
                    ;(p = c.value),
                        (m = null),
                        p.length > 32
                            ? l.classList.add("over-limit")
                            : l.classList.remove("over-limit")
                    try {
                        h = new Function(
                            "t",
                            "i",
                            "x",
                            "y",
                            "\n      try {\n        with (Math) {\n          return ".concat(
                                p,
                                ";\n        }\n      } catch (error) {\n        return error;\n      }\n    ",
                            ),
                        )
                    } catch (e) {
                        h = null
                    }
                }
                function w(e) {
                    var t = u.querySelectorAll("label")
                    1 === e.length
                        ? ((t[0].innerHTML = "&nbsp;"),
                          (t[1].innerHTML = "// ".concat(e[0])))
                        : ((t[0].innerHTML = "// ".concat(e[0])),
                          (t[1].innerHTML = "// ".concat(e[1])))
                }
                function b() {
                    var e = c.value,
                        t = Object.values(i.default),
                        n = Object.keys(i.default)[t.indexOf(e)]
                    n && w(n.split("\n"))
                }
                ;(d.width = d.height = s * f),
                    y.scale(f, f),
                    (d.style.width = d.style.height = "".concat(s, "px")),
                    x(),
                    c.addEventListener("input", v),
                    v(),
                    c.addEventListener("focus", function () {
                        l.classList.add("focus"),
                            w([
                                'hit "enter" to save in URL',
                                'or get <a href="https://twitter.com/aemkei/status/1323399877611708416">more info here</a>',
                            ])
                    }),
                    c.addEventListener("blur", function () {
                        b(), l.classList.remove("focus")
                    }),
                    l.addEventListener("submit", function (e) {
                        e.preventDefault()
                        var t = new URL(document.location)
                        t.searchParams.set("code", p),
                            history.replaceState(null, p, t)
                    }),
                    (function e() {
                        var t = 0
                        if (
                            (m
                                ? (t = (new Date() - m) / 1e3)
                                : (m = new Date()),
                            h)
                        ) {
                            ;(d.width = d.height = s * f), y.scale(f, f)
                            for (var n = 0, i = 0; i < r; i++)
                                for (var c = 0; c < r; c++) {
                                    var l = Number(h(t, n, c, i)),
                                        u = o / 2,
                                        p = "#FFF",
                                        x = (l * o) / 2
                                    x < 0 && ((x = -x), (p = "#F24")),
                                        x > o / 2 && (x = o / 2),
                                        y.beginPath(),
                                        (y.fillStyle = p),
                                        y.arc(
                                            c * (o + a) + u,
                                            i * (o + a) + u,
                                            x,
                                            0,
                                            2 * Math.PI,
                                        ),
                                        y.fill(),
                                        n++
                                }
                            window.requestAnimationFrame(e)
                        } else window.requestAnimationFrame(e)
                    })(),
                    d.addEventListener("click", function () {
                        var e = Object.values(i.default),
                            t = e.indexOf(p)
                        if (e[t + 1]) {
                            var n = e[(t += 1)]
                            ;(c.value = n), b(), v()
                        }
                    }),
                    (window.onpopstate = function (e) {
                        x(), v()
                    }),
                    b()
            },
            {"./examples.json": "I5x1"},
        ],
    },
    {},
    ["Focm"],
)
