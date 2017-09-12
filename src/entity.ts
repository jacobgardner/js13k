import Game from './game';
import { setMatrix } from './lib';
import { state } from './globals';
import Node from './node';
import { normalize } from './lib';
import config from './config';
import { lerp } from './progression';

export interface Entity {
    x: number;
    y: number;

    draw(game: Game): void;
    // Return false on remove
    simulate(game: Game): boolean;
}

export class Bullet implements Entity {
    bulletScale: number = 0.05;
    bulletSpeed: number = 0.6;

    vector: [number, number];
    constructor(public x: number, public y: number) {}
    draw(game: Game) {
        const renderer = game.renderer;
        const gl = renderer.gl;
        game.bulletShaders.use();

        renderer.modelMat = setMatrix(
            this.x - this.bulletScale / 2,
            this.y - this.bulletScale / 2,
            this.bulletScale
        );
        renderer.setMatrices();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    simulate(game: Game) {
        const dx = this.x + this.vector[0] * this.bulletSpeed * state.delta;
        const dy = this.y + this.vector[1] * this.bulletSpeed * state.delta;

        const current = game.grid.get(
            Math.floor(this.x),
            Math.floor(this.y)
        ) as Node;
        const player = game.player;
        if (
            // current &&
            current !== game.start &&
            current !== game.end &&
            current.passable(dx, dy, 0.02)
        ) {
            // Check for player collision
            const { x, y } = player;

            if (
                current.passable(x, y) &&
                game.grid.get(Math.floor(x), Math.floor(y)) !== game.start
            ) {
                const a = dx - x;
                const b = dy - y;
                if (a * a + b * b < 0.04 * 0.04) {
                    player.attack(0.06);
                    return false;
                }
            }

            this.x = dx;
            this.y = dy;
            return true;
        }

        return false;
    }
}

abstract class Enemy implements Entity {
    constructor(
        public x: number,
        public y: number,
        public level: number,
        public distance: number
    ) {}

    abstract draw(game: Game): void;
    abstract simulate(game: Game): boolean;
}

abstract class Item implements Entity {
    constructor(public x: number, public y: number) // public level: number,
    // public distance: number
    {
    }

    abstract draw(game: Game): void;
    abstract simulate(game: Game): boolean;
}

export class Shield extends Item {

    draw(game: Game) {
        const renderer = game.renderer;
        const gl = renderer.gl;

        game.shieldProgram.use();

        renderer.modelMat = setMatrix(
            this.x,
            this.y,
            1
        );
        renderer.setMatrices();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


    }

    simulate(game: Game) {
        return true;
    }
}

export class MiniMap extends Item {
    grabbed: number;
    fade: number = 0;

    constructor(x: number, y: number) {
        super(x + 0.5, y + 0.5);

    }

    draw(game: Game) {
        const minimapScale = 1 / game.grid.height;
        const renderer = game.renderer;
        const gl = renderer.gl;

        const now = Date.now();

        const c = Math.cos(now / 1000 % Math.PI * 2);
        const s = Math.sin(now / 1000 % Math.PI * 2);

        const oldCam = game.renderer.camera;
        const scale = config.CAMERA_SCALE;

        const r1 = c * minimapScale;
        const r2 = s * minimapScale;

        // prettier-ignore
        renderer.camera = new Float32Array([
            r1,      r2,                 0, 0,
            -r2,     r1,      0, 0,
            0,                 0,                 1, 0,
            scale * (this.x - game.player.x - 0.1 * (r1 + r2)), scale * (this.y - game.player.y - 0.2 * (r1 - r2)), 1, 1
            // -(game.player.x * scale) + this.x * scale, -(game.player.y * scale) + this.y * scale, 1, 1
        ]);

        game.dropShadowShaders.use();
        gl.uniform1f(game.dropShadowShaders.fade, this.fade);

        // I'm honestly not sure why this works...
        // I think it's because I'm displacing it half of the extra distance
        //  caused by the upscale... but let's be real... who cares?

        renderer.modelMat = setMatrix(
            -0.1 / minimapScale, -0.1 / minimapScale,
            game.grid.height * 1.2
        );
        renderer.setMatrices();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


        game.mazeShaders.use();
        gl.uniform1f(game.mazeShaders.fade, this.fade);
        game.grid.draw(game, true);
        gl.uniform1f(game.mazeShaders.fade, 0);

        game.renderer.camera = oldCam;
    }

    simulate(game: Game) {
        const [dx, dy] = [game.player.x - this.x, game.player.y - this.y];

        if (this.grabbed) {
            this.fade = (Date.now() - this.grabbed) * config.TIME_DILATION / 300;

            if (this.fade > 1) {
                return false;
            }
        } else if (dx * dx + dy * dy < 0.05) {
            this.grabbed = Date.now();
            game.minimapActivated = Date.now();
        }

        return true;
    }
}

export class ProximityMine extends Enemy {
    maxEnemyScale: number = 0.2;
    maxExplosionScale: number = 0.7;
    enemyScale: number;
    explosionScale: number = 0;
    currentSpeed: number = 0;
    chaseTime: number = 2500;
    accelTime: number = 600;
    explodeTime: number = 500;
    maxSpeed: number;
    startTime: number;
    spent = false;

    constructor(x: number, y: number, level: number, distance: number) {
        super(x, y, level, distance);

        this.enemyScale = this.maxEnemyScale;

        this.maxSpeed = config.INITIAL_PLAYER_SPEED * 0.8;
    }

    draw(game: Game) {
        const renderer = game.renderer;
        const gl = renderer.gl;
        game.proximityProgram.use();

        renderer.modelMat = setMatrix(
            this.x - this.enemyScale / 2,
            this.y - this.enemyScale / 2,
            this.enemyScale
        );
        renderer.setMatrices();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        game.explosionProgram.use();

        renderer.modelMat = setMatrix(
            this.x - this.explosionScale / 2,
            this.y - this.explosionScale / 2,
            this.explosionScale
        );
        renderer.setMatrices();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    simulate(game: Game) {
        const currentNode = game.grid.get(
            Math.floor(this.x),
            Math.floor(this.y)
        ) as Node;
        const player = game.player;
        const { x, y } = player;

        const [dx, dy] = [x - this.x, y - this.y];
        const vec = normalize([dx, dy]);
        const dist = dx * dx + dy * dy;

        const lineOfSight = currentNode.passable(Math.floor(x), Math.floor(y));

        if (!this.startTime && dist < 0.5 && lineOfSight) {
            this.startTime = Date.now();
        } else if (this.startTime) {
            let delta = (Date.now() - this.startTime) * config.TIME_DILATION;

            if (delta < this.chaseTime) {
                if (dist > 0.001 && lineOfSight) {
                    const t = (Date.now() - this.startTime) / this.accelTime;
                    const speed = lerp(0, this.maxSpeed, t > 1 ? 1 : t);
                    this.x = this.x + vec[0] * speed * state.delta;
                    this.y = this.y + vec[1] * speed * state.delta;
                }
            } else if (delta < this.chaseTime + this.explodeTime) {
                delta -= this.chaseTime;

                let percentDone;
                if (delta > this.explodeTime / 2) {
                    percentDone = 2 - 2 * delta / this.explodeTime;
                    this.enemyScale = this.maxEnemyScale * percentDone;
                } else {
                    percentDone = 2 * delta / this.explodeTime;
                }

                this.explosionScale = this.maxExplosionScale * percentDone;

                const explosionDist = Math.pow(
                    (this.explosionScale + player.playerScale) / 2,
                    2
                );

                for (const enemy of game.entities) {
                    if (enemy instanceof Shooter) {
                        const [ex, ey] = [this.x - enemy.x, this.y - enemy.y];
                        const enemyDist = ex * ex + ey * ey;
                        if (
                            enemyDist <
                            Math.pow(
                                (this.explosionScale + enemy.enemyScale) / 2,
                                2
                            )
                        ) {
                            enemy.dying = true;
                        }
                    }
                }

                if (!this.spent && dist < explosionDist) {
                    player.attack(0.25);
                    this.spent = true;
                }
            } else {
                return false;
            }
        }
        return true;
    }
}

export class Shooter extends Enemy {
    maxEnemyScale: number = 0.13;
    enemyScale: number;
    prevShotTime: number = Date.now();
    dying: boolean = false;
    dieStart: number;

    constructor(x: number, y: number, level: number, distance: number) {
        super(x, y, level, distance);

        this.enemyScale = this.maxEnemyScale;
    }

    draw(game: Game) {
        const renderer = game.renderer;
        const gl = renderer.gl;
        game.shooterProgram.use();

        renderer.modelMat = setMatrix(
            this.x - this.enemyScale / 2,
            this.y - this.enemyScale / 2,
            this.enemyScale
        );
        renderer.setMatrices();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    simulate(game: Game) {
        if (this.dying) {
            if (!this.dieStart) {
                this.dieStart = Date.now();
            } else {
                const t = (Date.now() - this.dieStart) * config.TIME_DILATION;
                this.enemyScale = lerp(this.enemyScale, 0, t);

                if (this.enemyScale <= 0) {
                    return false;
                }
            }

            return true;
        }

        if (Date.now() - this.prevShotTime > 1000) {
            this.prevShotTime = Date.now();
            let vector = normalize([
                game.player.x - this.x,
                game.player.y - this.y
            ]);

            const bullet = new Bullet(this.x, this.y);
            bullet.vector = vector;

            game.pendingEntities.push(bullet);
        }
        return true;
    }
}

export function buildEntities(): Entity[] {
    return [];
}
