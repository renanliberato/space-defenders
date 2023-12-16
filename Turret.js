class Miner extends GameObject {
    constructor() {
        super();
        this.speed = 100;
        this.radius = 10;
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
            this.target = meteors.find(m => screenBounds.contains(m.pos))
            this.targetAngleDock = Math.PI * 2 * Math.random()
        }

        if (this.target != null) {
            var dockPoint = this.target.pos.add(pointAroundCenter(this.targetAngleDock, this.target.radius / 2 + this.radius / 2 + 10));
            if (!screenBounds.contains(this.target.pos)) {
                this.target = null;
                return;
            } else {
                this.pos = this.pos.moveTowards(dockPoint, this.speed * deltaTime)
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
            p.pos = this.target.pos.add(randomPointAroundCenter(5))
            p.velocity = randomPointAroundCenter(0.3)
            p.color = 'grey'
            p.radius = 5
            p.dr = -0.1
            particles.push(p)
        }
    }

    renderMiningLine() {
        if (this.miningHit) {
            this.miningHit = false;
            stroke('orange')
            stroke('orange')
            line(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y)
        }
    }
}

class Turret extends GameObject {

    constructor() {
        super();
        this.undockSpeed = 30;
        this.distanceFromCenter = 60;
        this.angle = Math.PI * 2 / numOfTurrets * turrets.length;
        this.rotateSpeed = 0.01;
        this.radius = 10;
        this.damage = 1;
        this.shootRange = 100;
        this.shootRadius = 10;
        this.lastShootTime = 0;
        this.shootCooldown = 1;

        /**
         * @type {Enemy}
         */
        this.target = null;

        /**
         * @type {Array<Enemy>}
         */
        this.enemiesHit = [];

        /**
         * @type {Array<Enemy>}
         */
        this.enemiesAtRange = [];

        this.ai = this.aiLoop();
    }

    *aiLoop() {
        yield;

        var state = 'undocking'
        var undockTarget = center.add(pointAroundCenter(this.angle, this.distanceFromCenter));
        this.pos = center;
        while (true) {
            switch (state) {
                case 'undocking':
                    this.pos = this.pos.moveTowards(undockTarget, this.undockSpeed * deltaTime)

                    if (this.pos.distance(undockTarget) <= 0.1) {
                        state = 'patrol';
                        break;
                    }
                    break;
                case 'patrol':
                    this.rotateRight();
                    this.target = this.getEnemyAtRange();
                    if (this.target != null) {
                        // state = 'attack';
                        if (frameCount % (this.shootCooldown * 30) == 0) {
                            this.shoot();
                            this.lastShootTime = time;
                        }
                        break;
                    }
                    break;
                // case 'attack':
                //     if (this.target == null || this.target.health <= 0) {
                //         this.target = null;
                //         state = 'patrol';
                //         break;
                //     }

                //     if (frameCount % (this.shootCooldown * 30) == 0) {
                //         this.shoot();
                //     }
                //     break;
            }
            yield;
        }
    }

    getEnemyAtRange() {
        var dir = this.pos.sub(center).normalize();
        return sphereCast(enemies, this.pos, dir, this.shootRange, this.shootRadius).find(a => true);
    }

    findTarget() {
        return this.enemiesAtRange[0];
    }

    shoot() {
        if (this.target == null) {
            return;
        }

        var dir = this.target.pos.sub(this.pos).normalize();
        this.enemiesHit = sphereCast(enemies, this.pos, dir, this.shootRange, this.shootRadius);
        if (this.enemiesHit.length > 1) {
            this.enemiesHit = [this.enemiesHit[0]];
        }
        this.applyDamage();
    }

    applyDamage() {
        this.enemiesHit.forEach(e => {
            e.takeDamage(this.damage)
        })
    }

    isCollidingWithEnemy() {
        return enemies.find(e => e.pos.distance(this.pos) <= e.radius / 2 + this.radius / 2)
    }

    renderShootLine() {
        fill('white')
        stroke('white')
        this.enemiesHit.forEach(enemyHit => {
            line(this.pos.x, this.pos.y, enemyHit.pos.x, enemyHit.pos.y)
        })
        this.enemiesHit = [];
    }

    rotateRight() {
        this.angle += this.rotateSpeed;

        if (this.angle > Math.PI * 2) {
            this.angle -= Math.PI * 2;
        }
        this.pos = center.add(pointAroundCenter(this.angle, this.distanceFromCenter));
    }

    rotateLeft() {
        this.angle -= this.rotateSpeed;

        if (this.angle < -Math.PI * 2) {
            this.angle += Math.PI * 2;
        }

        this.pos = center.add(pointAroundCenter(this.angle, this.distanceFromCenter));
    }

    deathParticles() {
        for (let ip = 0; ip < 10; ip++) {
            var p = new Particle();
            p.pos = this.pos.add(randomPointAroundCenter(5))
            p.velocity = randomPointAroundCenter(0.3)
            p.radius = 5
            p.dr = -0.1
            particles.push(p)
        }
    }
}
