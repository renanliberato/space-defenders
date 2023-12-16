/**
 * @type {Array<Turret>}
 */
var turrets = [];

/**
 * @type {Array<Enemy>}
 */
var enemies = [];

/**
 * @type {Array<Particle>}
 */
var particles = [];

var time = 0;

function setup() {
  createCanvas(256, 256);
  frameRate(30);

  for (let i = 0; i < 30; i++) {
    /**
     * @type {Enemy}
     */
    var enemy = GameObject.instantiate(new Enemy(), randomPointAroundCenter(96 + Math.random() * 64).add(new Vec2(128, 128)));
    enemies.push(enemy)
  }

  turrets.push(GameObject.instantiate(new Turret(), Vec2.zero()));
  turrets.push(GameObject.instantiate(new Turret(), Vec2.zero()));
  turrets.push(GameObject.instantiate(new Turret(), Vec2.zero()));
}

const pressed = new Set();

function keyPressed(evt) {
  const { code } = evt;

  if (!pressed.has(code)) {
    pressed.add(code);
  }
}

function keyReleased(evt) {
  pressed.delete(evt.code);
}

var center = new Vec2(128, 128)
var baseRadius = 50;

function draw() {
  time += deltaTime;

  // update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    e.pos = e.pos.moveTowards(center, e.velocity.magnitude);

    if (e.pos.distance(center) < e.radius / 2 + baseRadius / 2) {
      e.takeDamage(e.health);
    }

    if (e.health <= 0) {
      enemies.splice(i, 1)
      e.deathParticles();
    }
  }

  // update turrets
  for (let i = turrets.length - 1; i >= 0; i--) {
    const t = turrets[i];
    if (t.isCollidingWithEnemy()) {
      turrets.splice(i, 1)
      t.deathParticles();
      continue;
    }
    t.ai.next();
  }

  // update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.pos = p.pos.add(p.velocity);
    p.radius = Math.max(0, p.radius + p.dr);

    if (p.radius <= 0) {
      particles.splice(i, 1)
    }
  }

  background(20);

  // render base
  stroke('black')
  fill('yellow')
  circle(128, 128, baseRadius + 2 * sin(time / 300))

  // render enemies
  enemies.forEach(e => {
    stroke('black')
    fill('red')
    circle(e.pos.x, e.pos.y, e.radius)
  })

  // render turrets
  turrets.forEach(t => {
    stroke('black')
    fill('white')
    circle(t.pos.x, t.pos.y, t.radius)

    t.renderShootLine()
  })

  // render particles
  particles.forEach(p => {
    stroke('black')
    fill(p.color)
    circle(p.pos.x, p.pos.y, p.radius)
  })
}
