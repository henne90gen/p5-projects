var agents = []

function setup() {
    createCanvas(500, 500)
    for (let i = 0; i < 500; i++) {
        let pos = createVector(random(width), random(height))
        agents.push(new Agent(pos))
    }
}

function draw() {
    background(0)
    let target = createVector(width / 2, height / 2)
    for (let index in agents) {
        let agent = agents[index]
        agent.steer(target)
        agent.update()
        agent.render()
    }
}

class Agent {
    constructor(pos) {
        this.position = pos
        this.velocity = createVector(0, 0)
        this.acceleration = createVector(0, 0)
        this.maxSpeed = 5
        this.maxForce = 0.1
    }

    steer(target) {
        let desired = p5.Vector.sub(target, this.position)
        if (desired.mag() > this.maxSpeed) {
            desired.normalize()
            desired.mult(this.maxSpeed)
        }
        let steer = p5.Vector.sub(desired, this.velocity)
        if (steer.mag() > this.maxForce) {
            steer.normalize()
            steer.mult(this.maxForce)
        }
        this.acceleration.add(steer)
    }

    update() {
        this.velocity.add(this.acceleration)
        if (this.velocity.mag() > this.maxSpeed) {
            this.velocity.normalize()
            this.velocity.mult(this.maxSpeed)
        }
        this.position.add(this.velocity)
        this.acceleration.mult(0)
    }

    render() {
        fill(255)
        ellipse(this.position.x, this.position.y, 10, 10)
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
