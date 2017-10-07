var cursor,
    spacing,
    elements

function setup() {
    createCanvas(400, 400)
    cursor = createVector(0, 0)
    spacing = 10
    elements = []
    frameRate(8)
}

function draw() {
    background(0)
    for (let elem of elements) {
        elem.render()
    }
    cursor = createVector(0, 0)
    elements = []
    let arcs = 0,
        lines = 0,
        squares = 0
    while (cursor.y < height) {
        let elem
        let rand = random()
        if (rand < 1 / 3) {
            elem = new Arc(cursor, spacing)
            arcs++
        } else if (rand < 2 / 3) {
            elem = new Line(cursor, spacing)
            lines++
        } else {
            elem = new Square(cursor, spacing)
            squares++
        }
        elements.push(elem)
        cursor.x += spacing
        if (cursor.x >= width) {
            cursor.x = 0
            cursor.y += spacing
        }
    }
    console.log("Arcs: " + arcs + ", Lines: " + lines + ", Squares: " + squares);
}

class Element {
    constructor(pos, length) {
        this.position = pos.copy()
        this.length = length
        this.choice = 1
        if (random() < 0.5) {
            this.choice = -1
        }
    }

    render() {}
}

class Line extends Element {
    render() {
        stroke(255)
        if (this.choice > 0) {
            line(this.position.x, this.position.y, this.position.x + this.length, this.position.y + this.length)
        } else {
            line(this.position.x + this.length, this.position.y, this.position.x, this.position.y + this.length)
        }
    }
}

class Arc extends Element {
    constructor(pos, length) {
        super(pos, length)
        if (random() < 0.5) {
            this.choice *= 2
        }
    }

    render() {
        stroke(255)
        noFill()
        if (this.choice == -2) {
            arc(this.position.x, this.position.y, this.length, this.length, 0, HALF_PI)
        } else if (this.choice == -1) {
            arc(this.position.x + this.length, this.position.y + this.length, this.length, this.length, PI, PI + HALF_PI)
        } else if (this.choice == 1) {
            arc(this.position.x + this.length, this.position.y, this.length, this.length, HALF_PI, PI)
        } else {
            arc(this.position.x, this.position.y + this.length, this.length, this.length, PI + HALF_PI, 2 * PI)
        }
    }
}

class Square extends Element {
    render() {
        noStroke()
        if (this.choice < 0) {
            fill(0)
        } else {
            fill(255)
        }
        rect(this.position.x, this.position.y, this.position.x + this.length, this.position.y + this.length)
    }
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
