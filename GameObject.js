class Circle {

}

class GameObject {

    /**
     * @param {string} tag 
     */
    constructor(tag) {
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

    start() { }

    update() { }

    render() {
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
}
