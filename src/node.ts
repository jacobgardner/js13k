import Game from './game';
import config from './config';
import { setMatrix } from './lib';

const LEFT = 1;
const RIGHT = 2;
const UP = 4;
const DOWN = 8;

export default class Node {
    untouched: Node[] = [];
    children: Node[] = [];
    touched: boolean = false;
    position: number[];
    distance: number = 0;
    time?: number = 0;

    constructor(x: number, y: number) {
        this.position = [x, y];
    }

    passable(x: number, y: number, radius: number = 0): boolean {
        if (x < 0.5) {
            x -= radius;
        } else {
            x += radius;
        }

        if (y < 0.5) {
            y -= radius;
        } else {
            y += radius;
        }

        x = Math.floor(x);
        y = Math.floor(y);
        if (this.position[0] === x && this.position[1] === y) {
            return true;
        }

        for (const child of this.children) {
            if (
                child.position[0] === Math.floor(x) &&
                child.position[1] === Math.floor(y)
            ) {
                return true;
            }
        }

        return false;
    }

    draw(game: Game) {
        const [x, y] = this.position;
        const renderer = game.renderer;
        const gl = renderer.gl;
        renderer.modelMat = setMatrix(x, y);
        renderer.setMatrices();

        gl.uniform1i(
            game.mazeShaders.squareState,
            this === game.start
                ? 0
                : this === game.end ? 1 : this.touched ? 2 : 3
        );

        let t = !this.time ? 0 : (Date.now() - this.time) / config.TRANSITION;
        if (t > 1) {
            t = 1;
        }

        gl.uniform1f(game.mazeShaders.t, t);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
