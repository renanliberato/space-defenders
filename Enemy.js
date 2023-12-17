class Enemy extends GameObject {
    constructor() {
        super();
        this.health = 1;
        this.radius = 5;
        this.velocity = new Vec2(1, 1);
    }

    /**
     * 
     * @param {number} damage 
     */
    takeDamage(damage) {
        this.health -= damage;

        for (let ip = 0; ip < 3; ip++) {
            var p = new Particle();
            p.pos = this.pos.add(randomPointAroundCenter(5))
            p.velocity = randomPointAroundCenter(0.3)
            p.radius = 2
            p.dr = -0.2
            p.color = 'red';
            particles.push(p)
        }
    }

    deathParticles() {
        for (let ip = 0; ip < 10; ip++) {
            var p = new Particle();
            p.pos = this.pos.add(randomPointAroundCenter(5))
            p.velocity = randomPointAroundCenter(0.3)
            p.radius = 3
            p.dr = -0.1
            p.color = 'red';
            particles.push(p)
        }
    }
}
