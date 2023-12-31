function nullFn() { }

class AppEditorUIElement {
    /**
     * 
     * @param {Vec2} pos 
     * @param {Vec2} offset 
     */
    constructor(pos, offset) {
        this.pos = pos;
        this.offset = offset;
        this.rect = new Rect(pos, pos.add(offset));
        this.fill = '';
        this.stroke = '';
        this.text = '';
        this.onClick = nullFn;
    }

    /**
     * 
     * @param {Vec2} point 
     */
    collides(point) {
        return this.rect.contains(point);
    }
}

class AppEditorButton {
    constructor(title, action) {
        this.title = title;
        this.action = action.bind(this);
    }
}

class AppEditor {
    constructor() {
        this.currentScene = new Scene();
        /**
         * @type {Array<AppEditorUIElement>}
         */
        this.elements = [
            // border
            create(
                new AppEditorUIElement(
                    new Vec2(1, 1),
                    new Vec2(AppScreen.width - 2, AppScreen.height - 2)
                ),
                obj => {
                    obj.stroke = 'black';
                }
            ),
            // left menu border
            create(
                new AppEditorUIElement(
                    new Vec2(1, 1),
                    new Vec2(50, AppScreen.height - 2)
                ),
                obj => {
                    obj.stroke = 'black';
                }
            ),
            // button play
            create(
                new AppEditorUIElement(
                    new Vec2(1, 1),
                    new Vec2(50, 50)
                ),
                obj => {
                    obj.stroke = 'black';
                }
            )
        ];
    }

    preload() {

    }

    setup() {

    }

    loadScene(path) {

    }

    play() {

    }

    stop() {

    }

    update() {

    }

    render() {
        this.elements.forEach(element => {
            if (element.fill == '') {
                noFill()
            } else {
                fill(element.fill)
            }

            if (element.stroke == '') {
                noStroke()
            } else {
                stroke(element.stroke)
            }

            rect(element.pos.x, element.pos.y, element.offset.x, element.offset.y)
        });
        // noFill()
        // stroke('black')
        // rect(1, 1, AppScreen.width - 2, AppScreen.height - 2)


        // rect(1, 1, 50, AppScreen.height - 2)
        // for (let i = 0; i < this.buttons.length; i++) {
        //     const button = this.buttons[i];

        //     noFill()
        //     stroke('black')
        //     rect(1, 1, 50, 50 * (i + 1))

        //     textAlign(CENTER)
        //     textSize(20)
        //     text(button.title, 25, 50 * (i) + 32)
        // }
    }
}
