function randomPointAroundCenter(radius) {
    var angle = random() * Math.PI * 2;

    return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

function pointAroundCenter(angle, radius) {
    return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

function randomPointOutOfScreen() {
    var pos = randomPointAroundCenter(10).add(center);
    var velocity = center.sub(pos).normalize();
    while (Screen.screenBounds.contains(pos)) {
        pos = pos.sub(velocity)
    }

    pos = pos.sub(velocity.multScalar(10))
    return pos;
}

/**
 * 
 * @template T
 * @param {T} obj 
 * @param {(T) => void} action 
 */
function then(obj, action) {
    action(obj)
}

/**
 * 
 * @template T
 * @param {T} obj 
 * @param {(T) => void} action 
 */
function create(obj, action) {
    action(obj)

    return obj;
}