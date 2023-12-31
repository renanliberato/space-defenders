class Planet extends CelestialObject {
    constructor() {
        super('planet', 25, 100, 'yellow');
        this.baseRadius = this.radius;
    }

    update() {
        super.update();
        this.radius = this.baseRadius + sin(Time.time * 3);
    }
}
