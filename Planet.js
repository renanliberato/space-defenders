class Planet extends CelestialObject {
    constructor() {
        super('planet');
        this.radius = 25;
        this.baseRadius = this.radius;
        this.fill = 'yellow';
        this.mass = 1_000_000;
    }

    update() {
        this.radius = this.baseRadius + sin(time * 3);
    }
}
