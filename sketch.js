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

var isCasting;
var mouseInitialPos = new Vec2();
function mousePressed() {
  isCasting = true;
  mouseInitialPos = mousePreviewPos = getMousePosWithCamZoomAdjustment()
}

var mousePreviewPos = new Vec2();

function getMousePosWithCamZoomAdjustment() {
  return new Vec2(
    mouseX - AppScreen.width / 2,
    mouseY - AppScreen.height / 2
  ).multScalar(appCam.zoomFactor);
}

function mouseDragged() {
  if (isCasting) {
    mousePreviewPos = getMousePosWithCamZoomAdjustment();
  }
}

function mouseReleased() {
  isCasting = false;
  var clickPos = getMousePosWithCamZoomAdjustment()

  then(GameObject.instantiate(new Planet(), mouseInitialPos), obj => {
    obj.velocity = mouseInitialPos.sub(clickPos);
  })
}

function mouseClicked() {
}

var myFont;
function preload() {
  myFont = loadFont('GermaniaOne-Regular.ttf');
}

/**
 * @type {AppCamera}
 */
var appCam = null;

function setup() {
  randomSeed(seed);

  p5.disableFriendlyErrors = true;
  canvas = createCanvas(AppScreen.width, AppScreen.height, WEBGL);
  frameRate(30);

  textFont(myFont);

  // for (let i = 0; i < 5000; i++) {
  //   var randomPoint = randomPointAroundCenter(random() * 900);
  //   var dir = randomPoint.sub(center);
  //   var velNormalized = dir.normalized;
  //   var pos = randomPoint.add(center.add(randomPoint).add(velNormalized.multScalar(250)))
  //   var met = GameObject.instantiate(new Meteor(6), pos)
  //   met.velocity = velNormalized.rotate(Math.PI / 2).multScalar(400)
  //   // - dir.magnitude / 20
  // }

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

  appCam = new AppCamera(createCamera())

  fetch(`/scenes/scene_1.json`).then(res => res.text()).then(res => {
    scene = Scene.deserialize(JSON.parse(res))
  })
}

class AppCamera {
  constructor(p5Cam) {
    this.p5Cam = p5Cam;
    this.zoomFactor = 0;
    this.initialEyeZ = p5Cam.eyeZ;
  }

  setPosition(x, y, z) {
    this.p5Cam.setPosition(x, y, z)
  }

  update() {
    this.zoomFactor = this.p5Cam.eyeZ / this.initialEyeZ;
  }
}

var appCamZoomFactor = 0;
function draw() {

  // appCam.setPosition(0, 0, Math.min(6000, 750 + frameCount * 5))
  appCam.setPosition(0, 0, 4000)
  appCam.update();

  Time.tick(deltaTime)

  update();
  render();
}

function update() {
  var celestialsThatImpactGravity = Scene.instance.gameObjects.filter(g => g.mass >= 10);

  /**
   * @type {Array<CelestialObject>}
   */
  var celestials = Scene.instance.gameObjects.filter(g => !!g.mass);

  for (var i = 0; i < celestials.length; i++) {
    celestials[i].updateVelocity(celestialsThatImpactGravity, Time.deltaTime);
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

  if (isCasting) {
    stroke('white');
    fill('white');
    strokeWeight(5)
    line(mouseInitialPos.x, mouseInitialPos.y, mousePreviewPos.x, mousePreviewPos.y)
  }


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

