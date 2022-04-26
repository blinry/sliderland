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
    let formulaText = formula.innerText

    if (formulaText.length > 0) {
        let t = (performance.now() - tStart) / 1000
        for (var i = 0; i < sliders.length; i++) {
            let x = i / 63
            let val = eval(t, i, x)
            if (val === undefined || isNaN(val) || !isFinite(val)) {
                sliders[i].value = 0
                sliders[i].disabled = true
            } else {
                sliders[i].value = val
                sliders[i].disabled = false
            }
        }
    }

    requestAnimationFrame(update)
}

let formula = document.getElementById("formula")
let eval = () => 0
formula.oninput = () => {
    // URL-encode formula into hash
    let hash = encodeURIComponent(formula.innerText)
    window.location.hash = hash

    // Reset t
    tStart = performance.now()

    // Extract function
    updateFormula()
}

function updateFormula() {
    try {
        let formulaText = formula.innerText
        if (formulaText.length > 0) {
            eval = new Function(
                "t",
                "i",
                "x",
                "try { with (Math) { return " +
                    formulaText +
                    "}} catch (e) {return undefined}",
            )
        } else {
            for (var i = 0; i < sliders.length; i++) {
                sliders[i].value = 0
                sliders[i].disabled = false
            }
        }
        formula.classList.remove("error")
    } catch (e) {
        formula.classList.add("error")
    }
}

// URL-decode hash
let hash = decodeURIComponent(window.location.hash.substr(1))
if (hash !== "") {
    formula.innerText = hash
}

updateFormula()

update()
