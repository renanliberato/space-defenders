/**
 * @type {Array<Turret>}
 */
var turrets = [];

/**
 * @type {Array<Enemy>}
 */
var enemies = [];

/**
 * @type {Array<Meteor>}
 */
var meteors = [];

/**
 * @type {Array<Miner>}
 */
var miners = [];

/**
 * @type {Array<Particle>}
 */
var particles = [];

var time = 0;

var w = window.innerWidth;
var h = window.innerHeight;

var numOfTurrets = 6;
var numOfMiners = 3;

function setup() {
  canvas = createCanvas(w, h);
  frameRate(30);

  for (let i = 0; i < 10; i++) {
    /**
     * @type {Enemy}
     */
    var enemy = GameObject.instantiate(new Enemy(), randomPointAroundCenter(96 + Math.random() * 256).add(new Vec2(center.x, center.y)));
    enemies.push(enemy)
  }

  for (let i = 0; i < numOfTurrets; i++) {
    turrets.push(GameObject.instantiate(new Turret(), Vec2.zero()));
  }

  for (let i = 0; i < 1; i++) {
    meteors.push(GameObject.instantiate(new Meteor(), center.add(randomPointAroundCenter(100))));
  }

  for (let i = 0; i < 3; i++) {
    miners.push(GameObject.instantiate(new Miner(), center.add(pointAroundCenter(Math.PI * 2 / numOfMiners * i, 40))));
  }
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

var screenBounds = new Rect(new Vec2(0, 0), new Vec2(w, h));
var center = new Vec2(w / 2, h / 2)
var baseRadius = 50;

function draw() {
  deltaTime /= 1000;
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

  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.pos = m.pos.add(m.velocity);
  }

  for (let i = miners.length - 1; i >= 0; i--) {
    const m = miners[i];
    m.update();
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

  background('#20043d');

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

  // render meteors
  meteors.forEach(m => {
    stroke('black')
    fill('grey')
    circle(m.pos.x, m.pos.y, m.radius)
  })

  // render miners
  miners.forEach(m => {
    stroke('black')
    fill('orange')
    circle(m.pos.x, m.pos.y, m.radius)

    m.renderMiningLine();
  })

  // render base
  stroke('black')
  fill('yellow')
  circle(center.x, center.y, baseRadius + 2 * sin(time * 3))

  // render particles
  particles.forEach(p => {
    stroke('black')
    fill(p.color)
    circle(p.pos.x, p.pos.y, p.radius)
  })



  // debug
  fill('white')
  text(Math.round(frameRate()), 10, 20)
}
