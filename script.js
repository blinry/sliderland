let sliders = []
let n = 64
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
    let t = performance.now()

    //userformula(t)
    //rand(t)
    //twosines2(t)
    // disabletest(t)
    //twosines(t)
    ball(t)
    requestAnimationFrame(update)
}

function ball(t) {
    let r = 0.1
    let x = Math.sin(t / 1000) * (1 - 2 * r) * 0.5 + 0.5
    let y = Math.sin(t / 800) * (1 - 2 * r) * 0.5 + 0.5

    for (var i = 0; i < sliders.length; i++) {
        let j = i / sliders.length
        if (Math.abs(x - j) <= r) {
            let a = Math.acos(Math.abs(x - j) / r)
            console.log(a)
            let offset = Math.sin(a) * r
            if (i % 2 == 0) {
                sliders[i].value = y + offset
            } else {
                sliders[i].value = y - offset
            }
        } else {
            sliders[i].value = 0 //Math.sin(t / 50) * 0.5 + 0.5
        }
    }
}

function userformula(t) {
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
            console.log(e)
        }

        for (var i = 0; i < sliders.length; i++) {
            try {
                sliders[i].value = eval(t, i)
            } catch (e) {
                console.log(e)
            }
        }
    }
}

function disabletest(t) {
    for (var i = 0; i < sliders.length; i++) {
        if (i > 10) {
            sliders[i].disabled = true
        }
    }
}

function rand(t) {
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].value = Math.random()
    }
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

function twosines(t) {
    for (var i = 0; i < sliders.length; i++) {
        if (i % 2 == 0) {
            sliders[i].value = Math.sin(i / 10 + t / 1000) * 0.5 + 0.5
        } else {
            sliders[i].value = Math.sin(i / 30 + t / 800) * 0.5 + 0.5
        }
    }
}

update()
