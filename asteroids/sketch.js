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

        update(bullets)

        update(asteroids)
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
        this.speed = 0
        this.rot = 0
    }

    checkCollsion(circle) {
        let otherPos = createVector(circle.position.x, circle.position.y)
        let distance = otherPos.sub(this.position).mag()
        return distance < (15 + circle.radius) / 2
    }

    update() {
        this.direction.rotate(this.rot)
        let dir = createVector(this.direction.x, this.direction.y)
        this.position.add(dir.mult(this.speed))
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
        return distance < (this.radius + other.radius) / 2
    }

    update() {
        let dir = createVector(this.direction.x, this.direction.y)
        this.position.add(dir.mult(this.speed))
        // return true if the cirlce is far off screen
        return (this.position.x > width + 100 || this.position.x < -100 || this.position.y > height + 100 || this.position.y < -100)
    }

    render() {
        fill(this.color)
        noStroke()
        ellipse(this.position.x, this.position.y, this.radius, this.radius)
    }
}

function update(arr) {
    for (let index in arr) {
        let bullet = arr[index]
        if (bullet.update()) {
            arr.splice(index, 1)
        }
    }
}

function checkCollsions() {
    for (let asteroidIndex in asteroids) {
        let asteroid = asteroids[asteroidIndex]
        for (let bulletIndex in bullets) {
            let bullet = bullets[bulletIndex]
            if (bullet.checkCollsion(asteroid)) {
                bullets.splice(bulletIndex, 1)
                asteroids.splice(asteroidIndex, 1)
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
    let size = random(5, 30)

    let asteroid = new Circle(pos, dir, speed, size, color(100, 100, 100))
    asteroids.push(asteroid)
}

function spawnBullet() {
    let pos = createVector(player.position.x, player.position.y)
    let dir = createVector(player.direction.x, player.direction.y)
    let bullet = new Circle(pos, dir, bulletSpeed, 10, color(255, 255, 255))
    bullets.push(bullet)
}

function mousePressed() {
    spawnBullet()
}

function keyPressed() {
    if (keyCode == 32) {
        spawnBullet()
    } else if (keyCode == 38) {
        // up
        player.speed--
    } else if (keyCode == 37) {
        // left
        player.rot = -0.1
    } else if (keyCode == 39) {
        // right
        player.rot = 0.1
    } else if (keyCode == 40) {
        // down
        player.speed++
    }
    if (player.speed > 0) {
        player.speed = 0
    }
}

function keyReleased() {
    if (keyCode == 37 || keyCode == 39) {
        player.rot = 0
    }
}
