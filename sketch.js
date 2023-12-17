var scene = new Scene();

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

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

var numOfTurrets = params.numOfTurrets;
if (!numOfTurrets) {
  numOfTurrets = 3;
}
var numOfEnemies = params.numOfEnemies;
if (!numOfEnemies) {
  numOfEnemies = 10;
}
var numOfMiners = 3;

function setup() {
  canvas = createCanvas(w, h);
  frameRate(30);

  for (let i = 0; i < numOfEnemies; i++) {
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
var baseDiameter = 50;

function draw() {
  deltaTime /= 1000;
  time += deltaTime;

  // update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    e.pos = e.pos.moveTowards(center, e.velocity.magnitude);

    if (e.pos.distance(center) < e.radius + baseDiameter / 2) {
      e.takeDamage(e.health);
    }

    if (e.health <= 0) {
      enemies.splice(i, 1)
      e.destroy();
    }
  }

  // update turrets
  for (let i = turrets.length - 1; i >= 0; i--) {
    const t = turrets[i];

    var collidingEnemy = t.getEnemyCollision();
    if (collidingEnemy) {
      turrets.splice(i, 1)
      t.destroy();
      collidingEnemy.destroy();
      enemies.splice(enemies.findIndex(e => e == collidingEnemy), 1)
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
    circle(e.pos.x, e.pos.y, e.diameter)
  })

  // render turrets
  turrets.forEach(t => {
    stroke('black')
    fill('white')
    circle(t.pos.x, t.pos.y, t.diameter)

    t.renderShootLine()
  })

  // render meteors
  meteors.forEach(m => {
    stroke('black')
    fill('grey')
    circle(m.pos.x, m.pos.y, m.diameter)
  })

  // render miners
  miners.forEach(m => {
    stroke('black')
    fill('orange')
    circle(m.pos.x, m.pos.y, m.diameter)

    m.renderMiningLine();
  })

  // render base
  stroke('black')
  fill('yellow')
  circle(center.x, center.y, baseDiameter + 2 * sin(time * 3))

  // render particles
  particles.forEach(p => {
    stroke('black')
    fill(p.color)
    circle(p.pos.x, p.pos.y, p.diameter)
  })



  // debug
  fill('white')
  text(Math.round(frameRate()), 10, 20)
}
