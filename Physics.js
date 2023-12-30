class Cooldown {
    /**
     * 
     * @param {number} cooldown 
     */
    constructor(cooldown) {
        this.cooldown = cooldown;
        this.lastExecution = 0;
    }

    checkExecuteAndUpdate() {
        if (time >= this.lastExecution + this.cooldown) {
            this.lastExecution = time;

            return true;
        }

        return false;
    }
}

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

class Collision {
    constructor(go, normal) {
        /**
         * @type {GameObject}
         */
        this.gameObject = go;

        /**
         * @type {Vec2}
         */
        this.normal = normal;
    }
}

/**
 * @param {Array<GameObject>} targets 
 * @param {Vec2} origin 
 * @param {number} radius 
 * 
 * @returns {Array<Collision>}
 */
function checkSphere(targets, point, radius) {
    var collided = [];
    targets.forEach(t => {
        if (point.distance(t.pos) <= (radius + t.radius)) {
            collided.push(new Collision(t, t.pos.sub(point).normalized));
        }
    })
    return collided;
}

/**
 * 
 * @param {GameObject} obj 
 * @returns {Array<GameObject>}
 */
function getCollisions(obj, tag) {
    var all = tag == '*'
    return Scene.instance.gameObjects.filter(g => (all || g.tag == tag) && obj.pos.distance(g.pos) < obj.radius + g.radius);
}