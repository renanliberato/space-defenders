class Circle {

}

class GameObject {

    constructor() {
        this.pos = Vec2.zero();
        this.velocity = Vec2.zero();
    }

    /**
     * @param {GameObject} go
     * @param {Vec2} pos
     *
     * @returns {GameObject}
     */
    static instantiate(go, pos) {
        go.pos = pos;

        go.start();
        return go;
    }

    start() { }

    update() { }
}
