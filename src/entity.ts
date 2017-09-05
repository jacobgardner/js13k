import Game from './game';
import { setMatrix } from './lib';
import { state } from './globals';
import Node from './node';
import { normalize } from './lib';

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
        if (current !== game.start && current !== game.end && current.passable(dx, dy)) {
            // Check for player collision
            const {x, y} = player;

            if (current.passable(x, y)) {
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

export class Enemy implements Entity {
    enemyScale: number = 0.8;
    prevShotTime: number = Date.now();
    constructor(public x: number, public y: number) {}

    draw(game: Game) {
        const renderer = game.renderer;
        const gl = renderer.gl;
        game.enemyShaders.use();

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
