class Rect {
    /**
     *
     * @param {Vec2} topLeft
     * @param {Vec2} bottomRight
     */
    constructor(topLeft, bottomRight) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    /**
     *
     * @param {Vec2} point
     * @returns {boolean}
     */
    contains(point) {
        return !(
            this.topLeft.x > point.x ||
            this.topLeft.y > point.y ||
            this.bottomRight.x < point.x ||
            this.bottomRight.y < point.y
        );
    }
}
