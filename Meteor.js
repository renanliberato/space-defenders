class Meteor extends CelestialObject {
    constructor(radius) {
        super('meteor', radius, radius / 1000, 'grey');
        this.mass = radius;
        this.collidable = true;
    }

    start() {
        // this.velocity = center.sub(this.pos).rotate(Math.PI / 2).normalize().multScalar(1);

        // while (screenBounds.contains(this.pos)) {
        //     this.pos = this.pos.sub(this.velocity.multScalar(this.radius))
        // }

        // this.pos = this.pos.sub(this.velocity.multScalar(this.radius * 2))
    }

    update() {
        super.update();
        // this.tryMoveWithVelocity();
        // this.velocity.add(center.sub(this.pos))
    }

    render() {
        noStroke()
        fill(this.fill)
        circle(this.pos.x, this.pos.y, this.diameter);
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
            p.color = this.fill;
            particleSystem.particles.push(p)
        }
    }
}