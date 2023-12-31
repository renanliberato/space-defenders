class Circle {

}

class GameObject {

    /**
     * @param {string} tag 
     */
    constructor(tag) {
        /**
         * @type {Map<string, Component>}
         */
        this.components = new Map();
        this.name = 'Game Object';
        this.tag = tag;
        this.pos = Vec2.zero();
        this.velocity = Vec2.zero();
        this.radius = 0;
        this.fill = 'white';
        this.stroke = 'black';
        this.collidable = false;
        this.destroyed = false;
    }

    get diameter() { return this.radius * 2; }

    /**
     * @param {GameObject} go
     * @param {Vec2} pos
     *
     * @returns {GameObject}
     */
    static instantiate(go, pos) {
        Scene.instance.addGameObject(go);

        go.pos = pos;

        go.start();
        return go;
    }

    /**
     * 
     * @param {Component} c 
     */
    addComponent(c) {
        this.components.set(c.constructor.name, c);
        c.gameObject = this;
        c.start();

        return c;
    }

    start() { }

    update() { }

    render() {
        this.components.forEach(c => c.render());
        if (this.radius > 0) {
            stroke(this.stroke)
            fill(this.fill)
            circle(this.pos.x, this.pos.y, this.diameter);
        }
    }

    destroy() {
        this.onDestroy();
        Scene.instance.removeGameObject(this);
    }

    onDestroy() {
        this.destroyed = true;
    }

    tryMoveWithVelocity() {
        var newPos = this.pos.add(this.velocity)
        if (checkSphere(Scene.instance.gameObjects.filter(g => g != this), newPos, this.radius).length > 0) {
            return;
        }
        this.pos = newPos;
    }

    serialize() {
        return {
            name: this.name,
            tag: this.tag,
            components: Object.keys(this.components).reduce((serializedObject, componentName) => {
                serializedObject[componentName] = this.components.get(componentName).serialize();
            }, {})
        }
    }

    deserialize(obj) {
        this.tag = obj.tag;
        this.name = obj.name;

        Object.keys(obj.components).forEach(componentName => {
            var componentSerializedData = obj.components[componentName];
            var component = this.addComponent(eval(`new ${componentSerializedData.class}()`))
            component.deserialize(componentSerializedData);
        })
        // this.pos = Vec2.deserialize(obj.pos);
        // this.velocity = Vec2.deserialize(obj.velocity);
        // this.radius = obj.radius;
        // this.fill = obj.fill;
        // this.stroke = obj.stroke;
        // this.mass = obj.mass;
    }
}
