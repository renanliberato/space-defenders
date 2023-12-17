class Miner extends GameObject {
    constructor() {
        super();
        this.speed = 100;
        this.radius = 5;
        this.color = 'orange';

        /**
         * @type {Meteor}
         */
        this.target = null;

        /**
         * @type {number}
         */
        this.targetAngleDock = 0;

        /**
         * @type {vec2}
         */
        this.docketPoint = null;

        this.miningHit = false;
        this.lastMineTime = 0;
        this.mineCooldown = 1;
    }

    start() {
        /**
         * @type {vec2}
         */
        this.docketPoint = this.pos;
    }

    update() {
        if (this.target == null) {
            this.target = meteors.find(m => screenBounds.contains(m.pos));
            this.targetAngleDock = Math.PI * 2 * Math.random();
        }

        if (this.target != null) {
            var dockPoint = this.target.pos.add(pointAroundCenter(this.targetAngleDock, this.target.radius + this.radius + 10));
            if (!screenBounds.contains(this.target.pos)) {
                this.target = null;
                return;
            } else {
                this.pos = this.pos.moveTowards(dockPoint, this.speed * deltaTime);
            }

            if (this.pos.distance(dockPoint) < this.radius) {
                if (frameCount % (this.mineCooldown * 30) == 0) {
                    this.miningHit = true;
                    this.mine();
                    this.lastMineTime = time;
                }
            }
        } else {
            this.pos = this.pos.moveTowards(this.docketPoint, this.speed * deltaTime);
        }
    }

    mine() {
        for (let ip = 0; ip < 3; ip++) {
            var p = new Particle();
            p.pos = this.target.pos.add(randomPointAroundCenter(5));
            p.velocity = randomPointAroundCenter(0.3);
            p.color = 'grey';
            p.radius = 2;
            p.dr = -0.1;
            particles.push(p);
        }
    }

    renderMiningLine() {
        if (this.miningHit) {
            this.miningHit = false;
            stroke('orange');
            stroke('orange');
            line(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y);
        }
    }
}