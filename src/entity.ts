import Game from './game';
import { setMatrix } from './lib';

export interface Entity {
    x: number;
    y: number;

    draw(game: Game): void;
    // Return false on remove
    simulate(game: Game): boolean;
}

export class Enemy implements Entity {
    enemyScale: number = 1.5;
    constructor(public x: number, public y: number) {}

    draw(game: Game) {
        const renderer = game.renderer;
        const gl = renderer.gl;
        game.enemyShaders.use();

        renderer.modelMat = setMatrix(this.x - this.enemyScale / 2, this.y - this.enemyScale / 2, this.enemyScale);
        renderer.setMatrices();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    simulate() {
        return true;
    }
}

export function buildEntities(): Entity[] {
    return [];
}
