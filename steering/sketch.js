var agents = []
var targetForceSlider

function setup() {
    createCanvas(400, 400)
    targetForceSlider = createSlider(0.01, 2, 1, 0.01)
    for (let i = 0; i < 250; i++) {
        let pos = createVector(random(width), random(height))
        agents.push(new Agent(pos))
    }
}

function draw() {
    background(0)
    let targetForce = targetForceSlider.value()
    let target = new Target(createVector(width / 2, height / 2), targetForce)
    let antiTarget = new Target(createVector(mouseX, mouseY), 2)
    for (let index in agents) {
        let agent = agents[index]
        agent.seek(target)
        agent.flee(antiTarget)
        agent.avoidWall(1)
        agent.update()
        agent.render()
    }
}

class Target {
    constructor(pos, maxForce) {
        this.position = pos
        this.maxForce = maxForce
    }
}

class Agent {
    constructor(pos) {
        this.position = pos
        this.velocity = createVector(0, 0)
        this.acceleration = createVector(0, 0)
        this.maxSpeed = 5
        this.minDistance = 50
    }

    steer(desired, maxForce) {
        let steer = p5.Vector.sub(desired, this.velocity)
        if (steer.mag() > maxForce) {
            steer.normalize()
            steer.mult(maxForce)
        }
        this.acceleration.add(steer)
    }

    avoidWall(maxForce) {
        let desired = createVector(this.velocity.x, this.velocity.y)
        if (this.position.x < 25) {
            desired.x = this.maxSpeed
        }
        if (this.position.x > width - 25) {
            desired.x = -this.maxSpeed
        }
        if (this.position.y < 25) {
            desired.y = this.maxSpeed
        }
        if (this.position.y > height - 25) {
            desired.y = -this.maxSpeed
        }
        this.steer(desired, maxForce)
    }

    seek(target) {
        let desired = p5.Vector.sub(target.position, this.position)
        desired.mult(this.maxSpeed)
        this.steer(desired, target.maxForce)
    }

    flee(target) {
        let desired = p5.Vector.sub(target.position, this.position)
        if (desired.mag() > this.minDistance) {
            return
        }
        desired.mult(-1)
        desired.mult(this.maxSpeed)

        this.steer(desired, target.maxForce)
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
