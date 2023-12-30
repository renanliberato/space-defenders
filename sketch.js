var AppScreen = {
  width: window.innerWidth,
  height: window.innerHeight,
  bounds: new Rect(new Vec2(0, 0), new Vec2(window.innerWidth, window.innerHeight))
}
var center = new Vec2(0, 0)

var scene = new Scene();

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

var particleSystem = new ParticleSystem();
var seed = 1;
var planet = null;

var myFont;
function preload() {
  myFont = loadFont('GermaniaOne-Regular.ttf');
}

function setup() {
  randomSeed(seed);

  p5.disableFriendlyErrors = true;
  canvas = createCanvas(AppScreen.width, AppScreen.height, WEBGL);
  frameRate(30);

  textFont(myFont);

  for (let i = 0; i < 5000; i++) {
    var randomPoint = randomPointAroundCenter(random() * 450);
    var dir = randomPoint.sub(center);
    var velNormalized = dir.normalized;
    var pos = randomPoint.add(center.add(randomPoint).add(velNormalized.multScalar(250)))
    var met = GameObject.instantiate(new Meteor(6), pos)
    met.velocity = velNormalized.rotate(Math.PI / 2).multScalar(400)
    // - dir.magnitude / 20
  }

  then(GameObject.instantiate(new Planet(), center.sub(new Vec2(0, -150))), obj => {
    planet = obj;
    obj.velocity = new Vec2(187, 0)
  })
  then(GameObject.instantiate(new CelestialObject('moon', 10, 7, 'orange'), center.add(new Vec2(0, -200))), moon => {
    moon.velocity = new Vec2(-450, 0)
  });
  then(GameObject.instantiate(new Planet(), center.sub(new Vec2(0, 150))), obj => {
    obj.velocity = new Vec2(-187, 0)
  })
  then(GameObject.instantiate(new CelestialObject('moon', 10, 7, 'orange'), center.add(new Vec2(0, 200))), moon => {
    moon.velocity = new Vec2(450, 0)
  });
  // then(GameObject.instantiate(new CelestialObject('moon', 10, 15, 'red'), center.sub(new Vec2(0, 200))), moon => {
  //   moon.velocity = new Vec2(-100, 0)
  // });
  celestialsThatImpactGravity = Scene.instance.gameObjects.filter(g => g.mass >= 10);
}


var time = 0;
var timeScale = 1;
function draw() {

  deltaTime = Math.min(50, deltaTime)
  deltaTime /= 1000;

  // camera(0, 0, Math.min(6000, 750 + frameCount * 5), 0, 0, 0, 0, 1, 0)
  camera(0, 0, 4500, 0, 0, 0, 0, 1, 0)

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
    celestials[i].updateVelocity(celestialsThatImpactGravity, deltaTime);
  }

  // for (var i = 0; i < celestials.length; i++) {
  //   celestials[i].updatePosition(deltaTime);
  // }

  for (var i = 0; i < Scene.instance.gameObjects.length; i++) {
    Scene.instance.gameObjects[i].update();
  }

  particleSystem.update();
}


function render() {
  background('#20043d');

  // renderCelestialDebug();

  for (var i = 0; i < Scene.instance.gameObjects.length; i++) {
    Scene.instance.gameObjects[i].render();
  }


  particleSystem.render();

  // debug
  fill('white');
  textAlign('left')
  textSize(30)
  text(`${Math.round(frameRate())} fps`, 10 - AppScreen.width / 2, 20 - AppScreen.height / 2);
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

  var futurePos = [];
  celestials.forEach(element => {
    futurePos.push([])
  });

  for (let j = 0; j < 20; j++) {
    for (var i = 0; i < celestials.length; i++) {
      celestials[i].updateVelocity(celestials, 1 / 5);
    }

    for (var i = 0; i < celestials.length; i++) {
      celestials[i].updatePosition(1 / 5);
      futurePos[i].push(celestials[i].pos);
    }
  }

  for (var i = 0; i < futurePos.length; i++) {
    stroke(celestials[i].fill)
    fill(celestials[i].fill)
    for (var k = 1; k < futurePos[i].length; k++) {
      line(futurePos[i][k - 1].x, futurePos[i][k - 1].y, futurePos[i][k].x, futurePos[i][k].y)
    }
  }

  for (let i = 0; i < celestials.length; i++) {
    celestials[i].mass = celestialsCopy[i].mass;
    celestials[i].pos = celestialsCopy[i].pos;
    celestials[i].velocity = celestialsCopy[i].velocity;

  }
}