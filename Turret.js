class Turret extends GameObject {

    constructor() {
        super('turret');
        this.undockSpeed = 30;
        this.distanceFromCenter = 60;
        this.angle = Math.PI * 2 / numOfTurrets * Scene.instance.getGameObjectsByTag('turret').length;
        this.rotateSpeed = 0.01;
        this.radius = 5;
        this.stroke = 'black';
        this.fill = 'white';
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

    update() {
        var collidingEnemy = this.getEnemyCollision();
        if (collidingEnemy) {
            this.destroy();
            collidingEnemy.destroy();
            return;
        }
        this.ai.next();
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
        return sphereCast(Scene.instance.getGameObjectsByTag('meteor'), this.pos, dir, this.shootRange, this.shootRadius).find(a => true);
    }

    findTarget() {
        return this.enemiesAtRange[0];
    }

    shoot() {
        if (this.target == null) {
            return;
        }

        var dir = this.target.pos.sub(this.pos).normalize();
        this.enemiesHit = sphereCast(Scene.instance.getGameObjectsByTag('meteor'), this.pos, dir, this.shootRange, this.shootRadius);
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

    getEnemyCollision() {
        return getCollisions(this, 'enemy').find(e => true);
    }

    render() {
        super.render();
        this.renderShootLine();
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

    onDestroy() {
        this.deathParticles();
    }

    deathParticles() {
        for (let ip = 0; ip < 10; ip++) {
            var p = new Particle();
            p.pos = this.pos.add(randomPointAroundCenter(5))
            p.velocity = randomPointAroundCenter(0.3)
            p.radius = 5
            p.dr = -0.1
            particleSystem.particles.push(p)
        }
    }
}
