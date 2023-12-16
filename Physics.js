/**
 * @param {Array<GameObject>} targets 
 * @param {Vec2} origin 
 * @param {Vec2} direction 
 * @param {number} distance 
 * @param {number} radius 
 * 
 * @returns {Array<GameObject>}
 */
function sphereCast(targets, origin, direction, distance, radius) {
    var collided = [];
    for (let i = 0; i < distance; i += radius) {
        var point = origin.add(direction.multScalar(i))

        targets.forEach(t => {
            if (point.distance(t.pos) <= radius) {
                collided.push(t);
            }
        })
    }

    return collided;
}