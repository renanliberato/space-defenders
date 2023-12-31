class Component {
    constructor() {
        /**
         * @type {GameObject}
         */
        this.gameObject = null;
        this.className = this.constructor.name;
    }

    start() {

    }

    update() {

    }

    render() {

    }

    serialize() {
        return Object.keys(this).reduce(
            (res, prop) => {
                var propValue = this[prop];
                switch (typeof propValue) {
                    case 'object':
                        if (propValue.serialize !== undefined) {
                            res[prop] = propValue.serialize();
                            res[prop].class = propValue.constructor.name;
                            res[prop].serialized = true;
                        } else {
                            res[prop] = propValue;
                        }
                        break;
                    default:
                        res[prop] = propValue;
                        break;
                }
            },
            {}
        )
    }

    deserialize(savedValue) {
        Object.keys(savedValue).forEach(key => {
            switch (typeof this[key]) {
                case 'object':
                    if (savedValue.serialized) {
                        this[key].deserialize(savedValue);
                    } else {
                        this[key] = savedValue[key];
                    }
                    break;
                default:
                    this[key] = savedValue[key];
                    break;
            }
        })
    }
}

class Transform extends Component {
    constructor() {
        super();
        this.pos = Vec2.zero();
    }
}

class RectTransform extends Component {
    constructor() {
        super();
        this.pos = Vec2.zero();
        this.offset = Vec2.zero();
        this.rect = new Rect();
    }

    start() {
        this.rect = new Rect(this.pos, this.offset);
    }

    deserialize(data) {
        super.deserialize(data)

        this.rect = new Rect(this.pos, this.offset);
    }
}

class DrawRect extends Component {
    constructor() {
        super();
        this.fill = '';
        this.stroke = 'black';
        this.strokeWeight = 1;
    }

    render() {
        this.fill == '' ? noFill() : fill(this.fill);
        this.stroke == '' ? noStroke() : stroke(this.stroke);
        strokeWeight(this.strokeWeight);
        var rectTransform = this.gameObject.components.get('RectTransform');
        rect(rectTransform.pos.x, rectTransform.pos.y, rectTransform.offset.x, rectTransform.offset.y)
    }
}

class Button extends Component {
    start() {

    }

    onClick() {
        console.log(`${this.gameObject.name} was clicked`)
    }
}

class DrawText extends Component {
    constructor() {
        super();
        this.fill = 'black';
        this.text = '';
        this.textSize = 12;
        this.textAlign = 'left';
    }

    render() {
        this.fill == '' ? noFill() : fill(this.fill);
        textSize(this.textSize);
        textAlign(this.textAlign);
        var pos = this.gameObject.components.get('RectTransform').pos;
        text(this.text, pos.x, pos.y);
    }
}