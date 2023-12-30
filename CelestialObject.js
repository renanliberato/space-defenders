class Universe {
    // original is 0.0001
    static gravitationalConstant = 0.01;
}

class CelestialObject extends GameObject {
    constructor(tag, radius, surfaceGravity, fill) {
        super(tag);

        this.fill = fill;
        this.radius = radius;

        /**
         * @type {number}
         */
        this.surfaceGravity = surfaceGravity;

        /**
         * @type {number}
         */
        this.mass = surfaceGravity * radius * radius / Universe.gravitationalConstant;
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
                var dir = otherBody.pos.sub(this.pos);
                var sqrDst = dir.magnitude;
                var forceDir = dir.normalized;

                var acceleration = forceDir
                    .multScalar(Universe.gravitationalConstant * otherBody.mass * (1 / sqrDst));

                this.acceleration = acceleration;
                this.velocity = this.velocity.add(acceleration.multScalar(timeStep));
            }
        }

        // var collidable = Scene.instance.getCollidableGameObjects().filter(g => g != this);
        // while (checkSphere(
        //     collidable,
        //     this.pos.add(posDelta),
        //     this.radius).length > 0) {
        //     console.log(`trying again ${frameCount}`)
        //     posDelta = posDelta.sub(this.velocity.multScalar(timeStep / 10));
        // }
    }

    updatePosition(timeStep) {
        var posDelta = this.velocity.multScalar(timeStep);

        this.pos = this.pos.add(posDelta)
    }

    update() {
        this.updatePosition(deltaTime)
    }

    render() {
        super.render()

        if (this.radius > 10) {
            // debug
            fill('white')
            stroke('white')
            textAlign('center')
            textSize(10)
            text(`${this.pos.x.toFixed(0)},${this.pos.y.toFixed(0)}`, this.pos.x, this.pos.y - this.radius - 15)
            var lineEnd = this.pos.add(this.velocity.normalized.multScalar(5))
            line(this.pos.x, this.pos.y, lineEnd.x, lineEnd.y)
            text(`${(this.velocity.magnitude * deltaTime).toFixed(1)}u/s`, this.pos.x, this.pos.y - this.radius - 2)
        }
    }
}