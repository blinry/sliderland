let examples = [
    "random() // for every slider return a value between 0 and 1",
    "t/10 // t is the time in seconds",
    "i/63 // i is the index of the slider (0..63)",
    "x // x is a shorthand for i/63",
    "sin(x+t)/2+0.5 // use the time to make animations",
    "sin(x+t*4)/2+0.5 // multiply the time to change the speed",
    "i%2 // create patterns using modulo",
    "sqrt(x)+sin(i)/50 // skip `Math.` to use methods and props like `sin` or `PI`",
    "sin(i/10+t*2.8+(i%3/3)*PI)*(0.1+sin(i/10+t*2.8)*0.02)+0.5+sin(i/10+t*0.8)*0.01",
]

let sliders = []
let n = 64

let tStart = performance.now()

let container = document.querySelector("#sliders")

for (let i = 0; i < n; i++) {
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

for (let example of examples) {
    let code = document.createElement("a")
    code.innerHTML = example
    code.href = "#" + encodeURIComponent(example)
    code.onclick = toggleExamples
    document.querySelector("#examples").appendChild(code)
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
        formulaText = formulaText.replace(/\/\/.*?$/gm, "")
        formulaText = formulaText.replace(/\n/g, "")

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
function getFormulaFromHash() {
    let hash = decodeURIComponent(window.location.hash.substr(1))
    if (hash !== "") {
        if (formula.innerText !== hash) {
            formula.innerText = hash
        }
    } else {
        formula.innerText = "sin(x*10+t)*0.1+0.5"
    }
    updateFormula()
    tStart = performance.now()
}

window.onhashchange = getFormulaFromHash
getFormulaFromHash()

let huh = document.querySelector("#huh")
let examplesOpen = false
huh.onclick = toggleExamples

function toggleExamples() {
    examplesOpen = !examplesOpen
    if (examplesOpen) {
        document.querySelector("#examples").style.display = "flex"
    } else {
        document.querySelector("#examples").style.display = "none"
    }
}

update()
