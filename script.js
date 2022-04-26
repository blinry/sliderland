let releaseMode = false

if (releaseMode) {
    document.querySelector("audio").controls = false
    document.querySelector("#formula").style.display = "none"
}

let sin = Math.sin
let cos = Math.cos
let tan = Math.tan
let abs = Math.abs
let floor = Math.floor
let ceil = Math.ceil
let sqrt = Math.sqrt
let random = Math.random
let max = Math.max
let min = Math.min
let PI = Math.PI

let sliders = []
let n = 64

let tStart = performance.now()

let container = document.querySelector("#sliders")

for (var i = 0; i < n; i++) {
    let slider = document.createElement("input")
    slider.type = "range"
    slider.min = 0
    slider.max = 1
    slider.value = 0
    slider.step = 0.0001
    slider.style.left = 0
    slider.style.top = `${i}rem`

    sliders.push(slider)
    container.appendChild(slider)
}

let phaseLength = (40 / 6) * 1000 // milliseconds
let fadeDuration = 1 * 1000

function update() {
    let t = performance.now() - tStart - fadeDuration / 2

    let formula = document.getElementById("formula").innerText

    if (formula.length > 0 || !releaseMode) {
        let fail = false
        let eval
        try {
            eval = new Function(
                "t",
                "i",
                "x",
                "try { with (Math) { return " + formula + "}} catch (e) {}",
            )
        } catch (e) {
            fail = true
        }

        if (fail) {
            document.querySelector("#formula").classList.add("error")
        } else {
            document.querySelector("#formula").classList.remove("error")

            let t = (performance.now() - tStart) / 1000
            for (var i = 0; i < sliders.length; i++) {
                let x = i / 63
                let val = 0
                try {
                    val = eval(t, i, x)
                    console.log(val)
                } catch (e) {}

                sliders[i].value = val
            }
        }
    }

    requestAnimationFrame(update)
}

let formula = document.getElementById("formula")
formula.oninput = () => {
    // URL-encode formula into hash
    let hash = encodeURIComponent(formula.innerText)
    window.location.hash = hash
    tStart = performance.now()
}

// URL-decode hash
let hash = decodeURIComponent(window.location.hash.substr(1))
if (hash !== "") {
    document.getElementById("formula").innerText = hash
}

update()
