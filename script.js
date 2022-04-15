let sin = Math.sin
let cos = Math.cos
let abs = Math.abs
let floor = Math.floor
let ceil = Math.ceil
let sqrt = Math.sqrt
let random = Math.random
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
    let phaseLength = 4 * 1000 // milliseconds
    let fadeDuration = 1 * 1000

    let t = performance.now() - tStart - fadeDuration / 2

    let formula = document.getElementById("formula").value

    if (formula.length > 0) {
        apply(userformula)
    } else {
        let funcs = [
            loading,
            stairScroll,
            stairHor,
            spectrogram,
            onesine,
            twosines,
            stairVer,
            twister,
            drop,
            rotating,
            fire,
            ball,
            multiball,
            tunnel,
            heart,
            rand,
            empty,
        ]
        //funcs = [spectrogram]

        t = t + funcs.length * phaseLength

        let phase = Math.floor((t % (funcs.length * phaseLength)) / phaseLength)
        let phasePosition = t % phaseLength
        if (phasePosition > phaseLength - fadeDuration) {
            let p2 = phasePosition - (phaseLength - fadeDuration)
            let amount = 1 / (1 + Math.exp((0.5 - p2 / fadeDuration) * 10))
            let func = funcs[phase]
            let func2 = funcs[(phase + 1) % funcs.length]
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

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
// Get the source
const audio = document.querySelector("audio")
audio.onplay = () => {
    audioCtx.resume()
    restart()
}
const source = audioCtx.createMediaElementSource(audio)
// Create an analyser
const analyser = audioCtx.createAnalyser()
analyser.fftSize = 64 * 2 * 8
const bufferLength = analyser.frequencyBinCount
const dataArray = new Uint8Array(analyser.frequencyBinCount)
// Connect parts
source.connect(analyser)
analyser.connect(audioCtx.destination)
function spectrogram(t, i) {
    if (i == 0) {
        analyser.getByteFrequencyData(dataArray)
    }
    return dataArray[i] / 300
}

function stairScroll(t, i) {
    return ceil((i / 64) * 8 - ((t * 2) % 8)) / 8 + ((t * 2) % 8) / 8
}

function stairHor(t, i) {
    return (
        floor(
            (abs((((i + t * 100) / 64) % (2 + 2 * sqrt(2))) - (1 + sqrt(2))) -
                0.5 * sqrt(2)) *
                8,
        ) / 8
    )
}

function stairVer(t, i) {
    return (
        abs(
            ((((floor((i / 64) * 8) / 8) * 64 + t * 100) / 64) %
                (2 + 2 * sqrt(2))) -
                (1 + sqrt(2)),
        ) -
        0.5 * sqrt(2)
    )
}

function drop(t, i) {
    return i == 32
        ? Math.sin(t * 10 + PI / 2) * 0.55 + 1
        : Math.sin(-Math.abs(i / 64 - 0.5) * 10 + t * 10) * 0.03 + 0.5
}

function empty(t, i) {
    return 0
}

function apply(func) {
    let t = (performance.now() - tStart) / 1000
    for (var i = 0; i < sliders.length; i++) {
        let val = func(t, i)
        if (val !== undefined) {
            sliders[i].value = 0.8*val + spectrogram(t, i) * 0.2
        }
    }
}

function interpolate(func1, func2, amount) {
    apply(function (t, i) {
        return func1(t, i) * (1 - amount) + func2(t, i) * amount
    })
}

function rotating(t, i) {
    let a = sin(t) * PI * 2
    let x = i / 64 - 0.5
    let y = (x / cos(a)) * sin(a) + 0.5
    return y
}

function banner(t, i) {
    //IJLMNUVW
}

function tunnel(t, i) {
    let x = 0.5
    let y = 0.5

    let n = 3
    let c = floor(i) % n
    let maxR = 0.5 * sqrt(2)
    let r = ((maxR / n) * c + t / 2) % maxR

    let j = i / 64
    if (Math.abs(x - j) <= r) {
        let a = Math.acos(Math.abs(x - j) / r)
        let offset = Math.sin(a) * r
        if (t % 0.1 > 0.05) {
            return y + offset
        } else {
            return y - offset
        }
    } else {
        return 0
    }
}

function loading(t, i) {
    return Math.min(1, -(i - (((64 / 105) * t) % 15) ** 5))
}

function fire(t, i) {
    let r = sin(i ** 2 + t * 30) * 0.5 + 0.5
    let h = sin(t) * 0.2 + 1
    return r * h * (cos(((i - 32) / 70) * PI) * 0.7 + sin(i + t * 10) * 0.2)
}

function heart(t, i) {
    let val1 = 0
    let val2 = 0

    let j = i / 64 + 0.01

    let r = 0.2 + 0.03 * (sin(t * 4) * 0.5 + 0.5)

    let x = 0.5 - r
    let y = 0.43 + r

    if (Math.abs(x - j) <= r) {
        let a = Math.acos(Math.abs(x - j) / r)
        let offset = Math.sin(a) * r
        val1 = y + offset
    }

    x = 0.5 + r

    if (Math.abs(x - j) <= r) {
        let a = Math.acos(Math.abs(x - j) / r)
        let offset = Math.sin(a) * r
        val1 = y + offset
    }

    r = 1.9 * r
    dist = Math.abs(0.5 - j)
    if (dist <= r) {
        val2 = dist + 0.43 - r / sqrt(2)
    }

    return i % 2 == 0 ? val1 : val2
}

function ball(t, i) {
    let r = 0.1
    let x = Math.sin(t) * (1 - 2 * r) * 0.5 + 0.5
    let y = Math.sin(t * 0.8) * (1 - 2 * r) * 0.5 + 0.5

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

function multiball(t, i) {
    let lowest = 0
    for (let c = 0; c < 4; c++) {
        let r = 0.1 + 0.02 * c
        let x = Math.sin(t + c) * (1 - 2 * r) * 0.5 + 0.5
        let y = Math.sin(t * 0.8 + 2 * c) * (1 - 2 * r) * 0.5 + 0.5

        let j = i / 64
        if (Math.abs(x - j) <= r) {
            let a = Math.acos(Math.abs(x - j) / r)
            let offset = Math.sin(a) * r
            if (i % 2 == 0) {
                if (lowest == 0 || random() < 0.5) {
                    lowest = y + offset
                }
            } else {
                if (lowest == 0 || random() < 0.5) {
                    lowest = y - offset
                }
            }
        } else {
        }
    }
    return lowest
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

function onesine(t, i) {
    return Math.sin(i / 10 + t) * 0.2 + 0.5
}

function twosines(t, i) {
    if (i % 2 == 0) {
        return onesine(t, i)
    } else {
        return Math.sin(i / 30 + t * 0.8) * 0.5 + 0.5
    }
}

function twister(t, i) {
    let n = 3
    let offset = i % n
    let d = sin(i / 10 + t * 0.8) * 0.01
    let d2 = sin(-i / 10 + t * 2.8) * 0.02
    return Math.sin(i / 10 + t * 2.8 + (offset / n) * PI) * (0.1 + d2) + 0.5 + d
}

update()

function restart() {
    tStart = performance.now()
}
