class Meteor extends GameObject {
    constructor() {
        super();
        this.radius = 20;
        this.color = 'grey';
    }

    start() {
        this.velocity = center.sub(this.pos).rotate(Math.PI / 2).normalize().multScalar(1);

        while (screenBounds.contains(this.pos)) {
            this.pos = this.pos.sub(this.velocity.multScalar(this.radius))
        }

        this.pos = this.pos.sub(this.velocity.multScalar(this.radius * 2))
    }
}