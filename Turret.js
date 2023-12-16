class Turret extends GameObject {

    constructor() {
        super();
        this.distanceFromCenter = 60;
        this.angle = Math.random() * Math.PI * 2;
        this.rotateSpeed = 0.01;
        this.radius = 10;
        this.damage = 1;
        this.shootRange = 100;
        this.shootRadius = 10;
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

        var state = 'patrol'
        while (true) {
            switch (state) {
                case 'patrol':
                    this.rotateRight();
                    this.enemiesAtRange = this.getEnemiesAtRange();
                    if (this.enemiesAtRange.length > 0) {
                        this.target = this.findTarget();
                        state = 'attack';
                        break;
                    }
                    break;
                case 'attack':
                    if (this.target == null || this.target.health <= 0) {
                        this.target = null;
                        state = 'patrol';
                        break;
                    }

                    if (frameCount % (this.shootCooldown * 30) == 0) {
                        this.shoot();
                    }
                    break;
            }
            yield;
        }
    }

    getEnemiesAtRange() {
        var dir = this.pos.sub(center).normalize();
        return sphereCast(enemies, this.pos, dir, this.shootRange, this.shootRadius);
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

    rotateToTarget() {
        if (this.target == null) {
            return;
        }

        var targetAngle = center.angleTo(this.target.pos);
        var turretAngle = center.angleTo(this.pos);

        if (targetAngle > turretAngle) {
            this.rotateRight();
        } else {
            this.rotateLeft();
        }
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
