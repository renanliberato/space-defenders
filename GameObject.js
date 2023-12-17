class Circle {

}

class GameObject {

    constructor() {
        this.pos = Vec2.zero();
        this.velocity = Vec2.zero();
        this.radius = 0;
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

    destroy() {
        Scene.instance.removeGameObject(this);
    }

    getCollicions() { }
}
