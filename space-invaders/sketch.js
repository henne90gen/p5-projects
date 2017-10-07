var gameOver = false,
    ship,
    bullets = [],
    aliens = []

function setup() {
    createCanvas(400, 400)
    ship = new Ship()
}

function draw() {
    background(0)

    if (aliens.length == 0) {
        bullets = []
        for (let j = 0; j < 7; j++) {
            for (let i = 0; i < 10; i++) {
                let alien = new Alien(createVector(i * 35 + 20, 15 + j * 35))
                aliens.push(alien)
            }
        }
    }

    for (let index in bullets) {
        let bullet = bullets[index]
        if (!gameOver && bullet.update()) {
            bullets.splice(index, 1)
            index--;
        }
        bullet.render()
    }

    let switchDirection = false
    for (let index in aliens) {
        let alien = aliens[index]
        if (!gameOver && alien.update()) {
            switchDirection = true
        }
        for (let bulletIndex in bullets) {
            let bullet = bullets[bulletIndex]
            if (bullet.checkCollision(alien)) {
                bullets.splice(bulletIndex, 1)
                bulletIndex--;
                aliens.splice(index, 1)
                index--;
            }
        }
        if (ship.checkCollision(alien) || alien.reachedBottom()) {
            gameOver = true
        }
        alien.render()
    }
    if (switchDirection) {
        for (let alien of aliens) {
            alien.switchDirection()
        }
    }

    if (!gameOver) {
        ship.update()
    }
    ship.render()

    if (gameOver) {
        textSize(32)
        fill(100, 100, 100)
        text("Game Over", 100, 200)
    }
}

class Ship {
    constructor() {
        this.direction = 0
        this.width = 10
        this.height = 25
        this.speed = 3
        this.position = createVector(width / 2, height - this.height - 10)
    }

    checkCollision(alien) {
        let distance = alien.position.copy().sub(this.position).mag()
        return distance < alien.radius + this.width / 2
    }

    move(dir) {
        this.direction = dir * this.speed
    }

    update() {
        this.position.x += this.direction
    }

    render() {
        noStroke()
        fill(255)
        rect(this.position.x - this.width / 2, this.position.y, this.width, this.height)
    }
}

class Bullet {
    constructor(pos) {
        this.position = pos.copy()
        this.speed = 5
        this.radius = 3
    }

    checkCollision(alien) {
        let distance = alien.position.copy().sub(this.position).mag()
        return distance < this.radius + alien.radius
    }

    update() {
        this.position.y -= this.speed
        return this.position.y < -this.radius
    }

    render() {
        noStroke()
        fill(255)
        ellipse(this.position.x, this.position.y, this.radius * 2)
    }
}

class Alien {
    constructor(pos) {
        this.position = pos.copy()
        this.direction = 1
        this.speed = 0.2
        this.radius = 10
    }

    switchDirection() {
        this.direction *= -1
    }

    reachedBottom() {
        return this.position.y + this.radius > height
    }

    update() {
        this.position.x += this.direction * this.speed
        this.position.y += this.speed
        return (this.position.x < this.radius || this.position.x > width - this.radius)
    }

    render() {
        noStroke()
        fill(255)
        ellipse(this.position.x, this.position.y, this.radius * 2)
    }
}

function shoot() {
    let bullet = new Bullet(ship.position)
    bullets.push(bullet)
}

function mousePressed() {}

var looping = true

function keyPressed() {
    if (keyCode == 32) {
        // space
        shoot()
    } else if (keyCode == 38) {
        // up
    } else if (keyCode == 37) {
        // left
        ship.move(-1)
    } else if (keyCode == 39) {
        // right
        ship.move(1)
    } else if (keyCode == 40) {
        // down
    }
}

function keyReleased() {
    if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
        ship.move(0)
    }
}
