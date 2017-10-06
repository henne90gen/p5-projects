function setup() {
    createCanvas(400, 400)
}

function draw() {
    background(0)
}

function mousePressed() {}

var looping = true

function keyPressed() {
    if (keyCode == 32) {
        // space
        if (looping) {
            noLoop()
            looping = false
        } else {
            loop()
            looping = true
        }
    } else if (keyCode == 38) {
        // up
    } else if (keyCode == 37) {
        // left
    } else if (keyCode == 39) {
        // right
    } else if (keyCode == 40) {
        // down
    }
}

function keyReleased() {}
