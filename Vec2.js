class Vec2 {

    /**
     * @type {number}
     */
    x;

    /**
     * @type {number}
     */
    y;

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static zero() {
        return new Vec2(0, 0);
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }


    /**
     * @param {Vec2} other
     * @returns {number}
     */
    distance(other) {
        var dx = other.x - this.x;
        var dy = other.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     *
     * @param {Vec2} other
     * @returns {Vec2}
     */
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    /**
     *
     * @param {Vec2} other
     * @returns {Vec2}
     */
    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    normalize() {
        var newVec = new Vec2();
        var norm = Math.sqrt(this.x * this.x + this.y * this.y);
        if (norm != 0) { // as3 return 0,0 for a this of zero length
            newVec.x = this.x / norm;
            newVec.y = this.y / norm;
        }

        return newVec;
    }

    /**
     *
     * @param {number} x
     * @returns {Vec2}
     */
    multScalar(x) {
        return new Vec2(this.x * x, this.y * x);
    }

    /**
     *
     * @param {Vec2} other
     *
     * @returns {number}
     */
    angleTo(other) {
        return atan2(other.y - this.y, other.x - this.x);
    }

    /**
     *
     * @param {Vec2} other
     * @param {number} speed
     *
     * @returns {Vec2}
     */
    moveTowards(other, maxDistanceDelta) {
        var a = new Vec2(other.x - this.x, other.y - this.y);
        var magnitude = a.magnitude;

        if (magnitude <= maxDistanceDelta || magnitude == 0) {
            return other;
        }

        return this.add(new Vec2(
            a.x / magnitude * maxDistanceDelta,
            a.y / magnitude * maxDistanceDelta
        ));
    }
}
