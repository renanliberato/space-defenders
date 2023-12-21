var AppScreen = {
  width: window.innerWidth,
  height: window.innerHeight,
  bounds: new Rect(new Vec2(0, 0), new Vec2(window.innerWidth, window.innerHeight))
}
var center = new Vec2(AppScreen.width / 2, AppScreen.height / 2)

var scene = new Scene();

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

var particleSystem = new ParticleSystem();

function setup() {
  p5.disableFriendlyErrors = true;
  canvas = createCanvas(AppScreen.width, AppScreen.height);
  frameRate(30);

  meteor = GameObject.instantiate(new Meteor(), center.add(pointAroundCenter(0, 100)))

  planet = GameObject.instantiate(new Planet(), center);
}


var time = 0;
var timeScale = 1;
function draw() {

  deltaTime /= 1000;

  deltaTime *= timeScale;

  time += deltaTime;

  update();
  render();
}

function update() {
  /**
   * @type {Array<CelestialObject>}
   */
  var celestials = Scene.instance.gameObjects.filter(g => !!g.mass);

  for (var i = 0; i < celestials.length; i++) {
    celestials[i].updateVelocity(celestials, deltaTime);
  }

  for (var i = 0; i < celestials.length; i++) {
    celestials[i].updatePosition(deltaTime);
  }

  for (var i = 0; i < Scene.instance.gameObjects.length; i++) {
    Scene.instance.gameObjects[i].update();
  }

  particleSystem.update();
}


function render() {
  background('#20043d');

  for (var i = 0; i < Scene.instance.gameObjects.length; i++) {
    Scene.instance.gameObjects[i].render();
  }

  renderCelestialDebug();

  particleSystem.render();

  // debug
  fill('white');
  text(Math.round(frameRate()), 10, 20);
}

function renderCelestialDebug() {
  /**
   * @type {Array<CelestialObject>}
   */
  var celestials = Scene.instance.gameObjects.filter(g => !!g.mass);
  var celestialsCopy = celestials.map(obj => ({
    mass: obj.mass,
    pos: obj.pos,
    velocity: obj.velocity,
  }));

  for (let j = 0; j < 1000; j++) {
    for (var i = 0; i < celestials.length; i++) {
      celestials[i].updateVelocity(celestials, 1 / 60);
    }

    for (var i = 0; i < celestials.length; i++) {
      celestials[i].updatePosition(1 / 60);
    }

    for (var i = 0; i < celestials.length; i++) {
      stroke(celestials[i].fill)
      fill(celestials[i].fill)
      circle(celestials[i].pos.x, celestials[i].pos.y, 2)
    }
  }

  for (let i = 0; i < celestials.length; i++) {
    celestials[i].mass = celestialsCopy[i].mass;
    celestials[i].pos = celestialsCopy[i].pos;
    celestials[i].velocity = celestialsCopy[i].velocity;

  }
}