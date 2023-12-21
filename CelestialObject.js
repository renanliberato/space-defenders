class Universe {
    // original is 0.0001
    static gravitationalConstant = 0.01;
}

class CelestialObject extends GameObject {
    constructor(tag) {
        super(tag);

        this.mass = 1;
    }

    /**
     * 
     * @param {Array<CelestialObject>} allObjects 
     * @param {number} timeStep 
     */
    updateVelocity(allObjects, timeStep) {
        for (let i = 0; i < allObjects.length; i++) {
            const otherBody = allObjects[i];

            if (otherBody != this) {
                var sqrDst = otherBody.pos.distance(this.pos);
                var forceDir = otherBody.pos.sub(this.pos).normalized;

                var acceleration = forceDir
                    .multScalar(Universe.gravitationalConstant)
                    .multScalar(otherBody.mass)
                    .multScalar(1 / sqrDst);

                this.acceleration = acceleration;
                this.velocity = this.velocity.add(acceleration.multScalar(timeStep));
            }
        }
    }

    updatePosition(timeStep) {
        this.pos = this.pos.add(this.velocity.multScalar(timeStep))
    }

    render() {
        super.render()

        fill('white')
        stroke('white')
        textAlign('center')
        text(`${this.pos.x.toFixed(0)},${this.pos.y.toFixed(0)}`, this.pos.x, this.pos.y - this.radius - 15)
        text(`${this.velocity.x.toFixed(2)},${this.velocity.y.toFixed(2)}`, this.pos.x, this.pos.y - this.radius - 2)
    }
}