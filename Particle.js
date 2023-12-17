class Particle {
    constructor() {
        this.color = 'white';
        this.pos = Vec2.zero();
        this.velocity = Vec2.zero();
        this.dr = 0;
        this.radius = 1;
    }

    get diameter() { return this.radius * 2; }
}
