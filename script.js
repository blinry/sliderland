let examples = [
    {
        comment: "a minimalist creative coding playground, by blinry",
        code: "sin(x*10+t)*0.1+0.5",
    },
    {
        comment: "for every slider return a value between 0 and 1",
        code: "random()",
    },
    {comment: "t is the time in seconds", code: "t/10"},
    {comment: "i is the index of the slider (0..63)", code: "i/64"},
    {comment: "you can also use x as a shorthand", code: "x"},
    {comment: "use the time to make animations", code: "sin(x+t)/2+0.5"},
    {
        comment: "multiply the time to change the speed",
        code: "sin(x+t*4)/2+0.5",
    },
    {comment: "you can use modulo to create patterns", code: "i%2"},
    {
        comment: "skip `Math.` to use methods and props like `sin` or `PI`",
        code: "sqrt(x)+sin(i)/50",
    },
    {
        comment: "more examples, this one is by @sequentialchaos",
        code: "abs(sin(i+t))",
    },
    {
        comment: "munching squares, by @daniel_bohrer",
        code: "(i^(t*30)%64)/63",
    },
    {code: "x+sin(t)"},
    {code: "(t*x)%1"},
    {code: "x**2"},
    {code: "(x-0.5)*tan(t)+0.5"},
    {
        comment: "last one - try changing numbers and see what happens!",
        code: "sin(i/10+t*2.8+(i%3/3)*PI)*(0.1+sin(i/10+t*2.8)*0.02)+0.5+sin(i/10+t*0.8)*0.01",
    },
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

//for (let example of examples) {
//    let code = document.createElement("a")
//    code.innerHTML = example
//    code.href = "#" + encodeURIComponent(example)
//    code.onclick = toggleExamples
//    document.querySelector("#examples").appendChild(code)
//}

let phaseLength = (40 / 6) * 1000 // milliseconds
let fadeDuration = 1 * 1000

function update() {
    let formulaText = formula.value

    if (formulaText.length > 0) {
        let t = (performance.now() - tStart) / 1000
        for (var i = 0; i < sliders.length; i++) {
            let x = i / 63
            let val = eval(t, i, x)
            if (isFinite(val)) {
                sliders[i].value = val
                sliders[i].disabled = false
            } else {
                sliders[i].value = 0
                sliders[i].disabled = true
            }
        }
    }

    requestAnimationFrame(update)
}

let formula = document.getElementById("formula")
let comment = document.getElementById("comment")
let eval = () => 0
formula.oninput = () => {
    saveFormulaToHash()

    // Reset t
    tStart = performance.now()

    // Extract function
    updateFormula(formula.value)

    updateTextareaHeight()
}

function updateTextareaHeight() {
    let height = 0
    formula.value.split("\n").forEach((line) => {
        height += Math.ceil(0.00001 + line.length / 80)
    })
    formula.style.height = height + "rem"
}

// https://benborgers.com/posts/textarea-tab
formula.addEventListener("keydown", (e) => {
    if (e.keyCode === 9) {
        e.preventDefault()
        document.execCommand("insertText", false, " ".repeat(2))
    }
})

//formula.onselect = (e) => {
//    const selection = e.target.value.substring(
//        e.target.selectionStart,
//        e.target.selectionEnd,
//    )
//    updateFormula(selection)
//    console.log(selection)
//}
//
//let unselect = () => {
//    updateFormula(formula.value)
//}
//
//formula.onclick = unselect
//formula.onblur = unselect
//formula.onkeydown = unselect
//formula.onmousedown = unselect

function saveFormulaToHash() {
    // URL-encode formula into hash
    let hash = encodeURIComponent(formula.value)
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
    window.location.hash = hash
    if (hash === "") {
        removeHash()
    }
}

function updateFormula(formulaText) {
    try {
        //formulaText = formulaText.replace(/\/\/.*?$/gm, "")
        //formulaText = formulaText.replace(/\n/g, "")

        if (formulaText.length > 0) {
            eval = new Function(
                "t",
                "i",
                "x",
                `try {
                    with (Math) {
                        let fn = () => ${formulaText}
                        return fn()
                    }
                } catch (e) {
                    return undefined
                }`,
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
    if (formula.value !== hash) {
        formula.value = hash
    }
    updateFormula(hash)
    tStart = performance.now()
}

//window.onhashchange = getFormulaFromHash

let hash = decodeURIComponent(window.location.hash.substr(1))
if (hash == "") {
    loadExample(0)
    updateFormula(formula.value)
    tStart = performance.now()
} else {
    getFormulaFromHash()
    updateTextareaHeight()
    comment.innerText = "// " + examples[0].comment
}

function loadExample(n) {
    window.location.hash = ""
    removeHash()

    formula.value = ""
    comment.innerText = ""
    if (examples[n].comment !== undefined && examples[n].comment !== "") {
        comment.innerText = "// " + examples[n].comment + "\n"
    }
    formula.value += examples[n].code
    formula.selectionStart = formula.value.length
    formula.selectionEnd = formula.value.length
    formula.focus()
}

// From https://stackoverflow.com/a/5298684/248734
function removeHash() {
    var scrollV,
        scrollH,
        loc = window.location
    if ("pushState" in history)
        history.pushState("", document.title, loc.pathname + loc.search)
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop
        scrollH = document.body.scrollLeft

        loc.hash = ""

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV
        document.body.scrollLeft = scrollH
    }
}

let currentExample = 0
document.querySelector("#examples-right").onclick = () => {
    currentExample = (currentExample + 1) % examples.length
    loadExample(currentExample)
    updateFormula(formula.value)
    tStart = performance.now()
}
document.querySelector("#examples-left").onclick = () => {
    currentExample = (currentExample - 1 + examples.length) % examples.length
    loadExample(currentExample)
    updateFormula(formula.value)
    tStart = performance.now()
}
document.querySelector("#sliders").onclick = () => {
    document.querySelector("#examples-right").click()
}

/*let huh = document.querySelector("#huh")
let examplesOpen = false
huh.onclick = toggleExamples

function toggleExamples() {
    examplesOpen = !examplesOpen
    if (examplesOpen) {
        document.querySelector("#examples").style.display = "flex"
    } else {
        document.querySelector("#examples").style.display = "none"
    }
}*/

update()
