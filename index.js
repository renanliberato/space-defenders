var AppScreen = {
    width: window.innerWidth,
    height: window.innerHeight,
    bounds: new Rect(new Vec2(0, 0), new Vec2(window.innerWidth, window.innerHeight))
}

var sceneDefinition = {
    gameObjects: [
        {
            name: 'Border',
            components: {
                RectTransform: {
                    class: 'RectTransform',
                    pos: { x: 1, y: 1 },
                    offset: { x: 373, y: 665 }
                },
                DrawRect: {
                    class: 'DrawRect',
                }
            }
        },
        {
            name: 'Button',
            components: {
                RectTransform: {
                    class: 'RectTransform',
                    pos: { x: 1, y: 1 },
                    offset: { x: 50, y: 50 }
                },
                DrawRect: {
                    class: 'DrawRect',
                },
                Button: {
                    class: 'Button'
                },
            }
        },
        {
            name: 'Label',
            components: {
                RectTransform: {
                    class: 'RectTransform',
                    pos: { x: 25, y: 28 },
                    offset: { x: 1, y: 1 }
                },
                DrawText: {
                    class: 'DrawText',
                    text: 'PLAY',
                    textAlign: 'center',
                },
            }
        },
    ]
}

var scene = new Scene();
scene.deserialize(sceneDefinition);

function preload() {

}

function setup() {
    randomSeed(0);

    p5.disableFriendlyErrors = true;
    canvas = createCanvas(AppScreen.width, AppScreen.height);
    frameRate(30);
}

function draw() {
    background('white')
    scene.render();
}

function mousePressed() {
    scene.propagateMousePressed(new Vec2(mouseX, mouseY));
}