class ParticleSystem {
    constructor() {
        /**
         * @rtpe {Array<Particle>}
         */
        this.particles = [];
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.pos = p.pos.add(p.velocity);
            p.radius = Math.max(0, p.radius + p.dr);

            if (p.radius <= 0) {
                this.particles.splice(i, 1)
            }
        }
    }

    render() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            stroke('black')
            fill(p.color)
            circle(p.pos.x, p.pos.y, p.diameter)
        }
    }
}