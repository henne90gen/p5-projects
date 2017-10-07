var agents = []
var mouseTargetForceSlider, positionTargetForceSlider

function setup() {
    createCanvas(400, 400)
    mouseTargetForceSlider = createSlider(0.01, 2, 0.5, 0.01)
    positionTargetForceSlider = createSlider(0.01, 2, 0.5, 0.01)
    for (let i = 0; i < 4*4; i++) {
        let x = i%4 * 100 + 50
        let y = Math.floor(i/4) * 100 + 50
        let pos = createVector(x, y)
        agents.push(new Agent(pos))
    }
}

function draw() {
    background(0)
    let mouseTargetForce = mouseTargetForceSlider.value()
    let positionTargetForce = positionTargetForceSlider.value()
    let mouseTarget = new Target(createVector(mouseX, mouseY), mouseTargetForce)
    for (let index in agents) {
        let agent = agents[index]
        let positionTarget = new Target(agent.startPosition.copy(), positionTargetForce)
        agent.seek(positionTarget)
        agent.flee(mouseTarget)
        agent.update()
        agent.render()
    }
}

class Target {
    constructor(pos, maxForce, minDistance) {
        this.position = pos.copy()
        this.maxForce = maxForce
        if (!minDistance) {
            minDistance = 1000
        }
        this.minDistance = minDistance
    }
}

class Agent {
    constructor(pos) {
        this.position = pos.copy()
        this.startPosition = pos.copy()
        this.velocity = createVector(0, 0)
        this.acceleration = createVector(0, 0)
        this.maxSpeed = 5
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
        if (desired.mag() > target.minDistance) {
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
