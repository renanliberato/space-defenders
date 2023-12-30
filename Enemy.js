//   var enemy = GameObject.instantiate(new Enemy(), randomPointOutOfScreen());

class Enemy extends GameObject {
    constructor() {
        super('enemy');
        this.health = 1;
        this.radius = 5;
        this.stroke = 'black';
        this.fill = 'red';
        this.velocity = new Vec2(0.1, 0.1);
    }

    update() {
        this.pos = this.pos.moveTowards(center, this.velocity.magnitude);

        if (this.pos.distance(center) < this.radius + planet.radius) {
            this.takeDamage(this.health);
        }

        if (this.health <= 0) {
            this.destroy();
        }
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
            particleSystem.particles.push(p)
        }
    }

    onDestroy() {
        super.onDestroy();
        this.deathParticles();
    }

    deathParticles() {
        for (let ip = 0; ip < 10; ip++) {
            var p = new Particle();
            p.pos = this.pos.add(randomPointAroundCenter(5))
            p.velocity = randomPointAroundCenter(0.3)
            p.radius = 3
            p.dr = -0.1
            p.color = 'red';
            particleSystem.particles.push(p)
        }
    }
}
