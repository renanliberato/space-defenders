class Meteor extends CelestialObject {
    constructor() {
        super('meteor');
        this.radius = 10;
        this.fill = 'grey';
        this.stroke = 'black';
        this.mass = 10;

        this.velocity = new Vec2(0, 100)
    }

    start() {
        // this.velocity = center.sub(this.pos).rotate(Math.PI / 2).normalize().multScalar(1);

        // while (screenBounds.contains(this.pos)) {
        //     this.pos = this.pos.sub(this.velocity.multScalar(this.radius))
        // }

        // this.pos = this.pos.sub(this.velocity.multScalar(this.radius * 2))
    }

    update() {
        // this.tryMoveWithVelocity();
        // this.velocity.add(center.sub(this.pos))
    }
}