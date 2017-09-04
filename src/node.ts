import Game from './game';
import { TRANSITION } from './config';
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

    // We could save this value instead of computing every time....
    //  but the bytes!!!
    classify() {
        let number = 0;
        for (const kid of this.children) {
            const x = this.position[0] - kid.position[0];
            const y = this.position[1] - kid.position[1];
            if (x === 1) {
                number += LEFT;
            } else if (x === -1) {
                number += RIGHT;
            } else if (y === 1) {
                number += UP;
            } else {
                number += DOWN;
            }
        }

        return number;
    }

    draw(game: Game) {
        const [x, y] = this.position;
        const renderer = game.renderer;
        const gl = renderer.gl;
        renderer.modelMat = setMatrix(x, y);
        renderer.setMatrices();

        const classified = this.classify();
        gl.uniform1i(
            game.mazeShaders.squareState,
            this === game.start
                ? 0
                : this === game.end ? 1 : this.touched ? 2 : 3
        );

        let t = !this.time ? 0 : (Date.now() - this.time) / TRANSITION;
        if (t > 1) {
            t = 1;
        }

        gl.uniform1f(game.mazeShaders.t, t);
        gl.uniform4iv(game.mazeShaders.squareType, [
            LEFT & classified,
            UP & classified,
            RIGHT & classified,
            DOWN & classified
        ]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

