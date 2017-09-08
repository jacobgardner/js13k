import Game from './game';
import { setMatrix } from './lib';
import { state } from './globals';
import Node from './node';
import { normalize } from './lib';
import { INITIAL_PLAYER_SPEED } from './config';
import { lerp } from './progression';

export interface Entity {
    x: number;
    y: number;

    draw(game: Game): void;
    // Return false on remove
    simulate(game: Game): boolean;
}

export class Bullet implements Entity {
    bulletScale: number = 0.4;
    bulletSpeed: number = 0.4 / this.bulletScale;
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

export class ProximityMine extends Enemy {
    enemyScale: number = 0.8;
    currentSpeed: number = 0;
    maxSpeed: number;
    startTime: number;

    constructor(x: number, y: number, level: number, distance: number) {
        super(x, y, level, distance);

        this.maxSpeed = INITIAL_PLAYER_SPEED * 0.9;
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
    }

    simulate(game: Game) {
        const currentNode = game.grid.get(
            Math.floor(this.x),
            Math.floor(this.y)
        ) as Node;
        const player = game.player;
        const { x, y } = player;
        // const playerNode = game.grid.get(Math.floor(x), Math.floor(y));

        const [dx, dy] = [x - this.x, y - this.y];
        const vec = normalize([dx, dy]);
        const dist = dx * dx + dy * dy;

        if (currentNode.passable(Math.floor(x), Math.floor(y))) {
            if (!this.startTime && dist < 0.5) {
                this.startTime = Date.now();
            } else if (this.startTime) {
                if (dist < 0.03 * 0.03) {
                    player.attack(0.1);
                }

                if (dist > 0.001) {
                    const t = (Date.now() - this.startTime) / 3000;
                    const speed = lerp(0, this.maxSpeed, t > 1 ? 1 : t);
                    this.x = this.x + vec[0] * speed * state.delta;
                    this.y = this.y + vec[1] * speed * state.delta;
                }

                if (Date.now() - this.startTime > 3000) {
                    return false;
                }
            }
        }

        return true;
    }
}

export class Shooter extends Enemy {
    enemyScale: number = 0.8;
    prevShotTime: number = Date.now();

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
