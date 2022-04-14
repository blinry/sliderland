let sin = Math.sin
let cos = Math.cos
let abs = Math.abs
let floor = Math.floor
let sqrt = Math.sqrt
let PI = Math.PI

let sliders = []
let n = 64

let tStart = performance.now()

for (var i = 0; i < n; i++) {
    let slider = document.createElement("input")
    slider.type = "range"
    slider.min = 0
    slider.max = 1
    slider.value = 0
    slider.step = 0.0001

    sliders.push(slider)
    document.body.appendChild(slider)
}

function update() {
    let t = performance.now() - tStart
    let phaseLength = 3 * 1000 // milliseconds
    let fadeDuration = 1 * 1000

    let formula = document.getElementById("formula").value

    if (formula.length > 0) {
        apply(userformula)
    } else {
        let funcs = [stairHor, stairVer, drop, ball, twosines, rand, empty]
        let phase = Math.floor((t % (funcs.length * phaseLength)) / phaseLength)
        let phasePosition = t % phaseLength
        if (phasePosition < fadeDuration) {
            // let amount = 1 - phasePosition / fadeDuration // linear mix
            let amount =
                1 / (1 + Math.exp((0.5 - phasePosition / fadeDuration) * 10))
            let func = funcs[(phase - 1 + funcs.length) % funcs.length]
            let func2 = funcs[phase]
            interpolate(func, func2, amount)
        } else {
            let func = funcs[phase]
            apply(func)
        }
    }

    //apply(funcs[phase])
    //interpolate(twosines, ball)

    requestAnimationFrame(update)
}

function stairHor(t, i) {
    return (
        floor(
            (abs((((i + t / 10) / 64) % (2 + 2 * sqrt(2))) - (1 + sqrt(2))) -
                0.5 * sqrt(2)) *
                8,
        ) / 8
    )
}

function stairVer(t, i) {
    return (
        abs(
            ((((floor((i / 64) * 8) / 8) * 64 + t / 10) / 64) %
                (2 + 2 * sqrt(2))) -
                (1 + sqrt(2)),
        ) -
        0.5 * sqrt(2)
    )
}

function drop(t, i) {
    return i == 32
        ? Math.sin(t / 100) * 0.55 + 1
        : Math.sin(-Math.abs(i / 64 - 0.5) * 10 + t / 100) * 0.03 + 0.5
}

function empty(t, i) {
    return 0
}

function apply(func) {
    let t = performance.now() - tStart
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].value = func(t, i)
    }
}

function interpolate(func1, func2, amount) {
    let t = performance.now() - tStart

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].value = (1 - amount) * func1(t, i) + amount * func2(t, i)
    }
}

function tunnel(t, i) {
    let x = 0.5
    let y = 0.5

    for (let c = 0; c < 4; c++) {
        let r = 0.1 * c

        let j = i / 64
        if (Math.abs(x - j) <= r && i % 4 == c) {
            let a = Math.acos(Math.abs(x - j) / r)
            let offset = Math.sin(a) * r
            if (i % 2 == 0) {
                return y + offset
            } else {
                return y - offset
            }
        } else {
            return 0
        }
    }
}

function ball(t, i) {
    let r = 0.1
    let x = Math.sin(t / 1000) * (1 - 2 * r) * 0.5 + 0.5
    let y = Math.sin(t / 800) * (1 - 2 * r) * 0.5 + 0.5

    let j = i / 64
    if (Math.abs(x - j) <= r) {
        let a = Math.acos(Math.abs(x - j) / r)
        let offset = Math.sin(a) * r
        if (i % 2 == 0) {
            return y + offset
        } else {
            return y - offset
        }
    } else {
        return 0 //Math.sin(t / 50) * 0.5 + 0.5
    }
}

function userformula(t, i) {
    let formula = document.getElementById("formula").value

    if (formula.length > 0) {
        try {
            var eval = new Function(
                "t",
                "i",
                "try { with (Math) { return " +
                    formula +
                    "}} catch (e) { console.log(e) }",
            )
        } catch (e) {
            //console.log(e)
        }

        try {
            return eval(t, i)
        } catch (e) {
            //console.log(e)
        }
    }
    return 0
}

function disabletest(t) {
    for (var i = 0; i < sliders.length; i++) {
        if (i > 10) {
            sliders[i].disabled = true
        }
    }
}

function rand(t, i) {
    return Math.random()
}

function twosines2(t) {
    for (var i = 0; i < sliders.length; i++) {
        if (t % 100 < 50) {
            sliders[i].value = Math.sin(i / 10 + t / 1000) * 0.5 + 0.5
        } else {
            sliders[i].value = Math.sin(i / 30 + t / 800) * 0.5 + 0.5
        }
    }
}

function twosines(t, i) {
    if (i % 2 == 0) {
        return Math.sin(i / 10 + t / 1000) * 0.5 + 0.5
    } else {
        return Math.sin(i / 30 + t / 800) * 0.5 + 0.5
    }
}

update()
