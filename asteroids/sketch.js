var bullets = []
var asteroids = []
var bulletSpeed = -5
var gameOver = false

function setup() {
    createCanvas(400, 400)
    player = new Player()
}

function draw() {
    background(0)

    if (gameOver) {
        textSize(32)
        fill(255)
        text("Game Over", 100, 200)
    } else {
        player.update()

        for (let index in bullets) {
            if (bullets[index].update(false)) {
                bullets.splice(index, 1)
                index--;
            }
        }

        for (let index in asteroids) {
            asteroids[index].update(true)
        }
        while (asteroids.length < 10) {
            spawnAsteroid()
        }

        checkCollsions()
    }

    player.render()

    for (let bullet of bullets) {
        bullet.render()
    }

    for (let asteroid of asteroids) {
        asteroid.render()
    }
}

class Player {
    constructor() {
        this.position = createVector(100, 150)
        this.direction = createVector(0, 1)
        this.velocity = createVector(0, 0)
        this.acceleration = createVector(0, 0)
        this.angle = 0
        this.thrustForce = -0.1
    }

    checkCollsion(circle) {
        let otherPos = createVector(circle.position.x, circle.position.y)
        let distance = otherPos.sub(this.position).mag()
        return distance < (15 + circle.radius) / 2
    }

    thrust(b) {
        this.thrusting = b
    }

    rotate(angle) {
        this.angle = angle
    }

    update() {
        this.direction.rotate(this.angle)
        if (this.thrusting) {
            this.acceleration = this.direction.copy().normalize().mult(this.thrustForce)
        } else {
            this.acceleration = createVector(0, 0)
        }
        this.velocity.add(this.acceleration)
        this.velocity.mult(0.99)
        this.position.add(this.velocity)
        if (this.position.x < 0) {
            this.position.x = width
        } else if (this.position.x > width) {
            this.position.x = 0
        }
        if (this.position.y < 0) {
            this.position.y = height
        } else if (this.position.y > height) {
            this.position.y = 0
        }
    }

    render() {
        push()
        let p1 = createVector(-10, 10)
        let p2 = createVector(10, 10)
        let p3 = createVector(0, -15)
        translate(this.position.x, this.position.y)
        rotate(this.direction.heading() - PI / 2)
        fill(255)
        triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
        pop()
    }
}

class Circle {
    constructor(position, direction, speed, radius, col) {
        this.position = position
        direction.mult(1 / direction.mag())
        this.direction = direction
        this.speed = speed
        this.radius = radius
        this.color = col
    }

    checkCollsion(other) {
        let otherPos = createVector(other.position.x, other.position.y)
        let distance = otherPos.sub(this.position).mag()
        return distance < this.radius + other.radius
    }

    update(wrapping) {
        let dir = createVector(this.direction.x, this.direction.y)
        this.position.add(dir.mult(this.speed))
        if (wrapping) {
            if (this.position.x < -this.radius) {
                this.position.x = width + this.radius
            } else if (this.position.x > width + this.radius) {
                this.position.x = -this.radius
            }
            if (this.position.y < -this.radius) {
                this.position.y = height + this.radius
            } else if (this.position.y > height + this.radius) {
                this.position.y = -this.radius
            }
        } else {
            return (this.position.x < -this.radius || this.position.x > width + this.radius || this.position.y < -this.radius || this.position.y > height + this.radius)
        }
    }

    render() {
        fill(this.color)
        noStroke()
        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2)
    }
}

function checkCollsions() {
    for (let asteroidIndex in asteroids) {
        let asteroid = asteroids[asteroidIndex]
        for (let bulletIndex in bullets) {
            let bullet = bullets[bulletIndex]
            if (bullet.checkCollsion(asteroid)) {
                bullets.splice(bulletIndex, 1)
                bulletIndex--;
                asteroids.splice(asteroidIndex, 1)
                asteroidIndex--;
            }
        }
        if (player.checkCollsion(asteroid)) {
            gameOver = true
        }
    }
}

function spawnAsteroid() {
    let x = random(-100, width + 100)
    let y = 0
    if (x > width || x < 0) {
        y = random(-100, height + 100)
    } else {
        if (random(0, 1) < 0.5) {
            y = random(-100, 0)
        } else {
            y = random(height, height + 100)
        }
    }
    let pos = createVector(x, y)
    let dir = createVector(random(-1, 1), random(-1, 1))
    let speed = random(0.1, 3)
    let size = random(2.5, 15)

    let asteroid = new Circle(pos, dir, speed, size, color(100, 100, 100))
    asteroids.push(asteroid)
}

function spawnBullet() {
    let pos = player.position.copy()
    let dir = player.direction.copy()
    let bullet = new Circle(pos, dir, bulletSpeed, 5, color(255, 255, 255))
    bullets.push(bullet)
}

function mousePressed() {
    spawnBullet()
}

function keyPressed() {
    if (keyCode == 32) {
        // space
        spawnBullet()
    } else if (keyCode == 38) {
        // up
        player.thrust(true)
    } else if (keyCode == 37) {
        // left
        player.rotate(-0.1)
    } else if (keyCode == 39) {
        // right
        player.rotate(0.1)
    }
}

function keyReleased() {
    if (keyCode == 37 || keyCode == 39) {
        player.rotate(0)
    } else if (keyCode == UP_ARROW) {
        player.thrust(false)
    }
}
