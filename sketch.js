var baseHealth = 0;

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

  for (let i = 0; i < 100; i++) {
    /**
     * @type {Enemy}
     */
    var enemy = GameObject.instantiate(new Enemy(), randomPointAroundCenter(96 + Math.random() * 64).add(new Vec2(128, 128)));
    enemy.velocity = new Vec2(0.2, 0.2)
    enemies.push(enemy)
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

var center = new Vec2(128, 128)
var baseRadius = 50;

var player = GameObject.instantiate(new GameObject(), center.add(randomPointAroundCenter(40)))

function draw() {
  time += deltaTime;
  background(20);

  // update
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    e.pos = e.pos.moveTowards(center, e.velocity.magnitude);

    if (e.pos.distance(center) < e.radius / 2 + baseRadius / 2) {
      enemies.splice(i, 1)

      for (let ip = 0; ip < 10; ip++) {
        var p = new Particle();
        p.pos = e.pos.add(randomPointAroundCenter(5))
        p.velocity = randomPointAroundCenter(0.3)
        p.radius = 5
        p.dr = -0.1
        particles.push(p)
      }
    }
  }


  // update player

  var acc = new Vec2(
    (pressed.has('KeyA') ? -0.03 : 0 + pressed.has('KeyD') ? 0.03 : 0),
    (pressed.has('KeyW') ? -0.03 : 0 + pressed.has('KeyS') ? 0.03 : 0),
  );
  player.velocity = player.velocity.add(acc)

  player.velocity = player.velocity.add(new Vec2(
    acc.x != 0 ? 0 : Math.sign(player.velocity.x) * -0.03,
    acc.y != 0 ? 0 : Math.sign(player.velocity.y) * -0.03,
  ))
  player.pos = player.pos.add(player.velocity);

  // end

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.pos = p.pos.add(p.velocity);
    p.radius = Math.max(0, p.radius + p.dr);

    if (p.radius <= 0) {
      particles.splice(i, 1)
    }
  }

  // render

  fill('white')
  circle(player.pos.x, player.pos.y, 10)

  fill('yellow')
  circle(128, 128, baseRadius + 2 * sin(time / 300))

  enemies.forEach(e => {
    fill('red')
    circle(e.pos.x, e.pos.y, e.radius)
  })

  particles.forEach(p => {
    fill(p.color)
    circle(p.pos.x, p.pos.y, p.radius)
  })
}
