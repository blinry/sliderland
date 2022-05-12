const {createFFmpeg} = FFmpeg
const ffmpeg = createFFmpeg({log: true})

const supportsH264 = MediaRecorder.isTypeSupported("video/webm;codecs=h264")
let mimeType = "video/webm"
if (supportsH264) {
    mimeType += ";codecs=h264"
}

let examples = [
    {
        comment:
            "a minimalist creative coding playground, by @blinry. click the blue arrow!",
        code: "sin(x*10+t)*0.1+0.5",
    },
    {
        comment:
            "here's an intro on  how to make animations only using 64 sliders!",
        code: "sin(t)*0.5+0.5",
    },
    {
        comment:
            "write a function that returns a value between 0 and 1 (try changing it!)",
        code: "0.5",
    },
    {
        comment: "the function is evaluated for each slider individually",
        code: "random()",
    },
    {
        comment: "`t` is the time in seconds, reset it by editing the function",
        code: "t/10",
    },
    {
        comment:
            "`x` is the position of the slider, between 0 (left) and 1 (right)",
        code: "x",
    },
    {comment: "and `i` is the index of the slider (0..63)", code: "i < 32"},
    {comment: "you can use the time to make animations", code: "x+sin(t)"},
    {
        comment: "multiply the time to change the speed",
        code: "x+sin(t*4)",
    },
    {comment: "use modulo to make patterns", code: "i % 2"},
    {
        comment:
            "you can use math functions like `sin` or `sqrt` and constants like `PI`",
        code: "sqrt(x)+sin(i+t)/50",
    },
    {
        comment:
            "you can use any JavaScript! the `Math` namespace is included.",
        code: `{
  // try moving your browser window!
  let offset = window.screenX/100
  return sin(x*5 + offset)*0.2 + 0.5
}`,
    },
    {
        comment:
            "more examples: binary clock, using the bitwise and operator `&` ",
        code: "2**i & t*10",
    },
    {comment: "circle", code: "(i%2-0.5)*sin(acos(1-x*2))+0.5"},
    {comment: "escalator", code: "round(x*8 - t%1)/8 + t%1 / 8"},
    {comment: "endless pattern", code: "t*x % 1"},
    {comment: "rotating line", code: "(x-0.5)*tan(t)+0.5"},
    {
        comment: "this one is by @sequentialchaos",
        code: "abs(sin(i+t))",
    },
    {
        comment:
            "munching squares, by @daniel_bohrer, using the bitwise xor operator `^` ",
        code: "(i^(t*30)%64)/63",
    },
    {
        comment: "gradient, made with @lenaschimmel",
        code: "sign(x-random())",
    },
    {
        comment: "nice sine waves, try changing numbers and see what they do",
        code: "sin(i/10+t*2.8+(i%3/3)*PI)*0.1+sin(i/10-t*2.8)*0.02+0.5",
    },
    {
        comment: "now create your own! what you type is saved in the url.",
        code: "/* have fun! */",
    },
]

let sliders = []
let n = 64

let b = 15 // top/bottom border width
let w = 2000 - 2 * b // size of the canvas

let tStart = performance.now()
let currentFormula

let canvas = document.querySelector("#sliders")
let ctx = canvas.getContext("2d")

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    this.beginPath()
    this.moveTo(x + r, y)
    this.arcTo(x + w, y, x + w, y + h, r)
    this.arcTo(x + w, y + h, x, y + h, r)
    this.arcTo(x, y + h, x, y, r)
    this.arcTo(x, y, x + w, y, r)
    this.closePath()
    return this
}

function update() {
    let formulaText = formula.value

    //ctx.clearRect(0, 0, w, w + 2 * b)
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, w + 2 * b, w + 2 * b)

    if (formulaText.length === 0) {
        theFunction = () => 0
    }

    let t = (performance.now() - tStart) / 1000
    for (var i = 0; i < n; i++) {
        let x = i / 63
        let val = theFunction(t, i, x)
        if (isFinite(val)) {
            sliderColor = "#0075ff"
            val = Math.min(val, 1)
            val = Math.max(val, 0)
        } else {
            val = 0
            sliderColor = "#cbcbcb"
        }
        let sliderWidth = 0.43
        let handleDiameter = w / 64
        ctx.fillStyle = "#efefef"
        ctx.strokeStyle = "#b2b2b2"
        ctx.lineWidth = w / 1000
        let topBottomOffset = (handleDiameter - sliderWidth * (w / 64)) / 2
        let roundRect = ctx.roundRect(
            b + ((i + (1 - sliderWidth) / 2) * w) / 64,
            b + topBottomOffset,
            (w / 64) * sliderWidth,
            w - 2 * topBottomOffset,
            w / 64 / 2,
        )
        roundRect.fill()
        roundRect.stroke()
        ctx.fillStyle = sliderColor
        ctx.roundRect(
            b + ((i + (1 - sliderWidth) / 2) * w) / 64,
            topBottomOffset +
                (1 - val) * (w - 2 * topBottomOffset - handleDiameter) +
                handleDiameter / 2 +
                b,
            (w / 64) * sliderWidth,
            w -
                2 * topBottomOffset -
                ((1 - val) * (w - 2 * topBottomOffset - handleDiameter) +
                    handleDiameter / 2),
            w / 64 / 2,
        ).fill()
        ctx.beginPath()
        ctx.arc(
            b + ((i + 0.5) * w) / 64,
            topBottomOffset +
                (1 - val) * (w - 2 * topBottomOffset - handleDiameter) +
                handleDiameter / 2 +
                b,
            handleDiameter / 2,
            0,
            2 * Math.PI,
        )
        ctx.fill()
    }

    requestAnimationFrame(update)
}

let formula = document.getElementById("formula")
let comment = document.getElementById("comment")
let theFunction = () => 0
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
    height += 1
    formula.style.height = height + "rem"
}

// https://benborgers.com/posts/textarea-tab
formula.addEventListener("keydown", (e) => {
    if (e.keyCode === 9) {
        e.preventDefault()
        document.execCommand("insertText", false, " ".repeat(2))
    }
})

formula.onselect = (e) => {
    if (e.target.selectionStart == e.target.selectionEnd) {
        updateFormula(formula.value)
    } else {
        const selection = e.target.value.substring(
            e.target.selectionStart,
            e.target.selectionEnd,
        )
        updateFormula(selection)
    }
}

formula.onclick = formula.onselect
formula.onblur = formula.onselect
formula.onkeydown = formula.onselect
formula.onmousedown = formula.onselect

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
        if (formulaText.length > 0) {
            currentFormula = formulaText
            theFunction = new Function(
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

let hash = decodeURIComponent(window.location.hash.substr(1))
if (hash == "") {
    loadExample(0)
    updateFormula(formula.value)
    formula.focus()
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
    comment.innerHTML = ""
    if (examples[n].comment !== undefined && examples[n].comment !== "") {
        comment.innerHTML = "// " + examples[n].comment + "\n"
    }
    formula.value += examples[n].code
    formula.selectionStart = formula.value.length
    formula.selectionEnd = formula.value.length
    updateTextareaHeight()
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

let rec
let recordingStarted = false

// https://stackoverflow.com/questions/50681683/how-to-save-canvas-animation-as-gif-or-webm
function startRecording() {
    recordingStarted = true
    const chunks = [] // here we will store our recorded media chunks (Blobs)
    const stream = canvas.captureStream() // grab our canvas MediaStream
    rec = new MediaRecorder(stream, {mimeType: mimeType}) // init the recorder
    // every time the recorder has new data, we will store it in our array
    rec.ondataavailable = (e) => chunks.push(e.data)
    // only when the recorder stops, we construct a complete Blob from all the chunks
    rec.onstop = () => {
        var fileBlob = new Blob(chunks, {type: mimeType})
        var reader = new FileReader()
        reader.onload = function (evt) {
            ;(async () => {
                if (!ffmpeg.isLoaded()) {
                    await ffmpeg.load()
                }

                await ffmpeg.FS(
                    "writeFile",
                    "sliderland.webm",
                    new Uint8Array(
                        evt.target.result,
                        0,
                        evt.target.result.byteLength,
                    ),
                )

                if (supportsH264) {
                    await ffmpeg.run(
                        "-i",
                        "sliderland.webm",
                        "-vcodec",
                        "copy",
                        "-qscale",
                        "0",
                        "sliderland.mp4",
                    )
                } else {
                    await ffmpeg.run("-i", "sliderland.webm", "sliderland.mp4")
                }

                var mp4blob = ffmpeg.FS("readFile", "sliderland.mp4")
                var fr = new FileReader()
                fr.onload = (e) => {
                    let dataUrl = e.target.result

                    var link = document.createElement("a")
                    link.href = dataUrl
                    document.body.appendChild(link)
                    link.download = "sliderland.mp4"
                    link.click()
                }
                fr.readAsDataURL(new Blob([mp4blob], {type: "video/mp4"}))
            })()
        }
        reader.readAsArrayBuffer(fileBlob)
    }
    rec.start()
}

function stopRecording() {
    rec.stop()
    recordingStarted = false
}

document.querySelector("#record").onclick = () => {
    if (recordingStarted) {
        document.querySelector("#record").innerHTML = "record"
        stopRecording()
    } else {
        document.querySelector("#record").innerHTML = "stop"
        startRecording()
    }
}

update()
