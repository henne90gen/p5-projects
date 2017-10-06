var bullets = []
var asteroids = []
var bulletSpeed = -5

function setup() {
	createCanvas(400, 400)
	background(0)
	stroke(0)
	fill(255)
	player = new Player()
	for (let i = 0; i < 1; i++) {
		spawnAsteroid()
	}
}

function draw() {
	player.update()

	updateBullets()

	updateAsteroids()

	checkCollsions()

	background(0)

	player.render()

	for (let bullet of bullets) {
		fill(255)
		ellipse(bullet.pos.x, bullet.pos.y, 10, 10)
	}

	for (let asteroid of asteroids) {
		fill(255, 0, 255)
		ellipse(asteroid.pos.x, asteroid.pos.y, asteroid.size, asteroid.size)
	}
}

class Player {
	constructor() {
		this.position = createVector(100, 100)
		this.direction = createVector(0, 1)
		this.speed = 0
		this.rot = 0
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
		rotate(this.direction.heading() - PI/2)
		fill(255)
		triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
		pop()
	}
}

class Circle {
	constructor() {

	}

	update() {

	}

	render() {

	}
}

function updateBullets() {
	for (let index in bullets) {
		let bullet = bullets[index]
		dir = createVector(bullet.dir.x, bullet.dir.y)
		bullet.pos.add(dir.mult(bulletSpeed))
		if (bullet.pos.x > width || bullet.pos.x < 0 || bullet.pos.y > height || bullet.pos.y < 0) {
			bullets.splice(index, 1)
		}
	}
}

function updateAsteroids() {
	for (let index in asteroids) {
		let asteroid = asteroids[index]
		dir = createVector(asteroid.dir.x, asteroid.dir.y)
		asteroid.pos.add(dir.mult(asteroid.speed))
		if (asteroid.pos.x > width + 100 || asteroid.pos.x < -100 || asteroid.pos.y > height + 100 || asteroid.pos.y < -100) {
			asteroids.splice(index, 1)
		}
	}
	while (asteroids.length < 10) {
		spawnAsteroid()
	}
}

function checkCollsions() {
	for (let bulletIndex in bullets) {
		let bullet = bullets[bulletIndex]
		for (let asteroidIndex in asteroids) {
			let asteroid = asteroids[asteroidIndex]
			let astPos = createVector(asteroid.pos.x, asteroid.pos.y)
			let distance = astPos.sub(bullet.pos).mag()
			if (distance < 5 + asteroid.size/2) {
				bullets.splice(bulletIndex, 1)
				asteroids.splice(asteroidIndex, 1)
			}
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
	let speed = random(0.1, 3)
	let size = random(5, 30)
	asteroid = {
		pos: createVector(x, y),
		dir: createVector(random(-1, 1), random(-1, 1)),
		speed: speed,
		size: size,
	}
	asteroid.dir.mult(1/asteroid.dir.mag())
	asteroids.push(asteroid)
}

function spawnBullet() {
	let bullet = {
		pos: createVector(player.position.x, player.position.y),
		dir: createVector(player.direction.x, player.direction.y)
	}
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
